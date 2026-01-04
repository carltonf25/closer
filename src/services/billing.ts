'use server';

import getStripeClient from '@/lib/stripe/client';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { CONTRACTOR_TIERS } from '@/config/services';
import type { BillingType } from '@/lib/database.types';
import type { ChargeLeadResult } from '@/lib/stripe/types';

/**
 * Calculate final lead price with tier discount applied
 */
function calculateFinalPrice(
  basePrice: number,
  tier: 'starter' | 'pro' | 'elite'
): number {
  const discount = CONTRACTOR_TIERS[tier].leadDiscount;
  return Math.round(basePrice * (1 - discount) * 100) / 100;
}

/**
 * Charge contractor for accepted lead
 * Handles all three billing types: per_lead, monthly, hybrid
 */
export async function chargeForLead(
  deliveryId: string
): Promise<ChargeLeadResult> {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: delivery, error: deliveryError } = await supabase
      .from('lead_deliveries')
      .select(
        `
        id,
        price,
        billed,
        contractor_id,
        is_exclusive,
        contractors (
          id,
          stripe_customer_id,
          billing_type,
          pricing_tier,
          company_name,
          email
        )
      `
      )
      .eq('id', deliveryId)
      .single();

    if (deliveryError || !delivery) {
      console.error('[BILLING] Delivery not found:', deliveryError);
      return { success: false, message: 'Delivery not found' };
    }

    if (delivery.billed) {
      console.log('[BILLING] Already billed:', deliveryId);
      return { success: true, message: 'Already billed' };
    }

    const contractor = delivery.contractors;
    if (!contractor?.stripe_customer_id) {
      console.error('[BILLING] No Stripe customer:', contractor?.id);
      return { success: false, message: 'Payment method not configured' };
    }

    const billingType = contractor.billing_type as BillingType;
    const pricingTier = contractor.pricing_tier as 'starter' | 'pro' | 'elite';

    // Determine if charge is needed
    const shouldCharge =
      billingType === 'per_lead' ||
      billingType === 'hybrid' ||
      (billingType === 'monthly' && pricingTier === 'starter');

    if (!shouldCharge) {
      // Monthly subscription covers this
      await supabase
        .from('lead_deliveries')
        .update({
          billed: true,
          billed_at: new Date().toISOString(),
        })
        .eq('id', deliveryId);

      return { success: true, message: 'Covered by subscription' };
    }

    // Calculate price with discount
    const finalPrice = calculateFinalPrice(delivery.price, pricingTier);
    const amountCents = Math.round(finalPrice * 100);

    const stripe = getStripeClient();

    // Create invoice item
    await stripe.invoiceItems.create({
      customer: contractor.stripe_customer_id,
      amount: amountCents,
      currency: 'usd',
      description: `Lead charge - ${delivery.is_exclusive ? 'Exclusive' : 'Shared'} lead`,
      metadata: {
        contractor_id: contractor.id,
        lead_delivery_id: deliveryId,
        billing_type: billingType,
        pricing_tier: pricingTier,
        base_price: delivery.price.toString(),
        final_price: finalPrice.toString(),
      },
    });

    // Create and pay invoice immediately
    const invoice = await stripe.invoices.create({
      customer: contractor.stripe_customer_id,
      auto_advance: true,
      collection_method: 'charge_automatically',
      metadata: {
        contractor_id: contractor.id,
        lead_delivery_id: deliveryId,
        billing_type: billingType,
      },
    });

    const paidInvoice = (await stripe.invoices.pay(invoice.id)) as any;

    // Update delivery
    await supabase
      .from('lead_deliveries')
      .update({
        billed: true,
        billed_at: new Date().toISOString(),
        stripe_invoice_id: paidInvoice.id,
      })
      .eq('id', deliveryId);

    console.log('[BILLING] Successfully charged:', {
      deliveryId,
      invoiceId: paidInvoice.id,
      amount: finalPrice,
    });

    return {
      success: true,
      invoiceId: paidInvoice.id,
      paymentIntentId:
        typeof paidInvoice.payment_intent === 'string'
          ? paidInvoice.payment_intent
          : paidInvoice.payment_intent?.id,
    };
  } catch (error) {
    console.error('[BILLING] Charge failed:', error);

    if (error instanceof Error) {
      const stripeError = error as any;
      if (stripeError.type === 'StripeCardError') {
        return {
          success: false,
          message: `Payment failed: ${stripeError.message}`,
        };
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Charge failed',
    };
  }
}

/**
 * Process refund for bad lead (manual admin approval only)
 */
export async function processLeadRefund(
  deliveryId: string,
  reason: string
): Promise<ChargeLeadResult> {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: delivery } = await supabase
      .from('lead_deliveries')
      .select('id, stripe_invoice_id, billed, price, feedback')
      .eq('id', deliveryId)
      .single();

    if (!delivery?.billed || !delivery.stripe_invoice_id) {
      return { success: false, message: 'No charge to refund' };
    }

    const stripe = getStripeClient();
    const invoice = (await stripe.invoices.retrieve(
      delivery.stripe_invoice_id
    )) as any;

    if (!invoice.payment_intent) {
      return { success: false, message: 'No payment to refund' };
    }

    await stripe.refunds.create({
      payment_intent:
        typeof invoice.payment_intent === 'string'
          ? invoice.payment_intent
          : invoice.payment_intent.id,
      reason: 'requested_by_customer',
      metadata: {
        lead_delivery_id: deliveryId,
        refund_reason: reason,
      },
    });

    await supabase
      .from('lead_deliveries')
      .update({
        billed: false,
        billed_at: null,
        feedback: `${delivery.feedback || ''}\n[REFUNDED: ${reason}]`,
      })
      .eq('id', deliveryId);

    console.log('[BILLING] Refund processed:', deliveryId);
    return { success: true, message: 'Refund processed' };
  } catch (error) {
    console.error('[BILLING] Refund failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}
