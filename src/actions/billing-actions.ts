'use server';

import getStripeClient from '@/lib/stripe/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type Invoice = {
  id: string;
  amount_paid: number;
  created: number;
  status: string;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  description: string;
};

type BillingStats = {
  total_spent: number;
  this_month_spent: number;
  leads_purchased: number;
  leads_this_month: number;
};

type PaymentFailure = {
  id: string;
  invoice_id: string;
  amount: number;
  attempt_count: number;
  error_message: string | null;
  created_at: string;
};

type GetBillingDataResult = {
  success: boolean;
  invoices?: Invoice[];
  stats?: BillingStats;
  hasPaymentMethod?: boolean;
  paymentFailures?: PaymentFailure[];
  isPaused?: boolean;
  message?: string;
};

/**
 * Get billing data for contractor dashboard
 */
export async function getBillingData(): Promise<GetBillingDataResult> {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id, stripe_customer_id, pricing_tier, status')
      .eq('user_id', user.id)
      .single()) as {
      data: {
        id: string;
        stripe_customer_id: string | null;
        pricing_tier: string;
        status: string;
      } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    const hasPaymentMethod = !!contractor.stripe_customer_id;
    const isPaused = contractor.status === 'paused';

    // Get billing stats from lead_deliveries
    const { data: deliveries } = (await supabase
      .from('lead_deliveries')
      .select('id, price, billed, billed_at, outcome')
      .eq('contractor_id', contractor.id)
      .eq('billed', true)) as {
      data: Array<{
        id: string;
        price: number;
        billed: boolean;
        billed_at: string | null;
        outcome: string;
      }> | null;
      error: any;
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: BillingStats = {
      total_spent: 0,
      this_month_spent: 0,
      leads_purchased: deliveries?.filter(d => d.outcome === 'accepted').length || 0,
      leads_this_month:
        deliveries?.filter(
          d =>
            d.outcome === 'accepted' &&
            d.billed_at &&
            new Date(d.billed_at) >= startOfMonth
        ).length || 0,
    };

    deliveries?.forEach(d => {
      stats.total_spent += d.price;
      if (d.billed_at && new Date(d.billed_at) >= startOfMonth) {
        stats.this_month_spent += d.price;
      }
    });

    // Get invoices from Stripe if customer exists
    let invoices: Invoice[] = [];

    if (contractor.stripe_customer_id) {
      const stripe = getStripeClient();

      const stripeInvoices = await stripe.invoices.list({
        customer: contractor.stripe_customer_id,
        limit: 10,
      });

      invoices = stripeInvoices.data.map(inv => ({
        id: inv.id,
        amount_paid: inv.amount_paid / 100, // Convert from cents
        created: inv.created,
        status: inv.status || 'unknown',
        invoice_pdf: inv.invoice_pdf || null,
        hosted_invoice_url: inv.hosted_invoice_url || null,
        description:
          inv.lines.data[0]?.description || 'Lead charge',
      }));
    }

    // Get recent payment failures (gracefully handle if table doesn't exist yet)
    let paymentFailures: PaymentFailure[] = [];
    try {
      const { data: failures } = await supabase
        .from('payment_failures')
        .select('id, invoice_id, amount, attempt_count, error_message, created_at')
        .eq('contractor_id', contractor.id)
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (failures) {
        paymentFailures = failures;
      }
    } catch (err) {
      // Table might not exist yet, that's okay
      console.log('[BILLING] Payment failures table not available yet');
    }

    return {
      success: true,
      invoices,
      stats,
      hasPaymentMethod,
      paymentFailures,
      isPaused,
    };
  } catch (error) {
    console.error('[BILLING] Failed to get billing data:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to get billing data',
    };
  }
}
