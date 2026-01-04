'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import getStripeClient from '@/lib/stripe/client';
import { z } from 'zod';
import type { SetupPaymentMethodResult } from '@/lib/stripe/types';

const setupPaymentMethodSchema = z.object({
  pricingTier: z.enum(['pro', 'elite']),
  billingType: z.enum(['per_lead', 'monthly', 'hybrid']),
});

/**
 * Creates Stripe customer and SetupIntent for payment method collection
 * Called during onboarding
 */
export async function setupPaymentMethod(
  data: z.infer<typeof setupPaymentMethodSchema>
): Promise<SetupPaymentMethodResult> {
  try {
    const result = setupPaymentMethodSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid payment setup data' };
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const { data: contractor } = await supabase
      .from('contractors')
      .select('id, email, contact_name, company_name, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    const stripe = getStripeClient();
    let customerId = contractor.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: contractor.email,
        name: contractor.contact_name,
        metadata: {
          contractor_id: contractor.id,
          billing_type: result.data.billingType,
          pricing_tier: result.data.pricingTier,
          company_name: contractor.company_name,
        },
      });

      customerId = customer.id;

      // Store customer ID
      const adminSupabase = createAdminSupabaseClient();
      const { error: updateError } = await adminSupabase
        .from('contractors')
        .update({ stripe_customer_id: customerId })
        .eq('id', contractor.id);

      if (updateError) {
        console.error('[STRIPE_ACTIONS] Failed to save customer ID:', updateError);
        return { success: false, message: 'Failed to save payment information' };
      }
    }

    // Create SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        contractor_id: contractor.id,
        pricing_tier: result.data.pricingTier,
        billing_type: result.data.billingType,
      },
    });

    return {
      success: true,
      customerId,
      setupIntentClientSecret: setupIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error('[STRIPE_ACTIONS] Setup payment method error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to setup payment method',
    };
  }
}

const confirmPaymentMethodSchema = z.object({
  setupIntentId: z.string(),
  billingType: z.enum(['per_lead', 'monthly', 'hybrid']),
  pricingTier: z.enum(['pro', 'elite']),
});

/**
 * Confirms payment method and creates subscription if needed
 */
export async function confirmPaymentMethod(
  data: z.infer<typeof confirmPaymentMethodSchema>
): Promise<SetupPaymentMethodResult> {
  try {
    const result = confirmPaymentMethodSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid confirmation data' };
    }

    const stripe = getStripeClient();
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const { data: contractor } = await supabase
      .from('contractors')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!contractor?.stripe_customer_id) {
      return { success: false, message: 'Payment setup not found' };
    }

    // Retrieve setup intent
    const setupIntent = await stripe.setupIntents.retrieve(result.data.setupIntentId);

    if (setupIntent.status !== 'succeeded') {
      return { success: false, message: 'Payment method setup not completed' };
    }

    const paymentMethodId = setupIntent.payment_method as string;

    // Set as default payment method
    await stripe.customers.update(contractor.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription for monthly/hybrid
    if (result.data.billingType === 'monthly' || result.data.billingType === 'hybrid') {
      const priceId =
        result.data.pricingTier === 'pro'
          ? process.env.STRIPE_PRICE_PRO_MONTHLY_ID
          : process.env.STRIPE_PRICE_ELITE_MONTHLY_ID;

      if (!priceId) {
        console.error('[STRIPE_ACTIONS] Missing price ID for tier:', result.data.pricingTier);
        return { success: false, message: 'Subscription configuration error' };
      }

      await stripe.subscriptions.create({
        customer: contractor.stripe_customer_id,
        items: [{ price: priceId }],
        metadata: {
          contractor_id: contractor.id,
          billing_type: result.data.billingType,
          pricing_tier: result.data.pricingTier,
        },
      });
    }

    return { success: true, customerId: contractor.stripe_customer_id };
  } catch (error) {
    console.error('[STRIPE_ACTIONS] Confirm payment method error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to confirm payment method',
    };
  }
}
