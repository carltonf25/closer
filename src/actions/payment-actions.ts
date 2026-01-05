'use server';

import getStripeClient from '@/lib/stripe/client';
import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import type { SetupPaymentMethodResult } from '@/lib/stripe/types';

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

type GetPaymentMethodsResult = {
  success: boolean;
  paymentMethods?: PaymentMethod[];
  message?: string;
};

type RemovePaymentMethodResult = {
  success: boolean;
  message?: string;
};

/**
 * Create or retrieve Stripe customer and setup intent for adding payment method
 */
export async function createSetupIntent(): Promise<SetupPaymentMethodResult> {
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
      .select('id, stripe_customer_id, email, company_name')
      .eq('user_id', user.id)
      .single()) as {
      data: {
        id: string;
        stripe_customer_id: string | null;
        email: string;
        company_name: string;
      } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    const stripe = getStripeClient();
    let customerId = contractor.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: contractor.email,
        name: contractor.company_name,
        metadata: {
          contractor_id: contractor.id,
        },
      });

      customerId = customer.id;

      // Update contractor with customer ID
      const adminSupabase = createAdminSupabaseClient();
      await adminSupabase
        .from('contractors')
        .update({ stripe_customer_id: customerId })
        .eq('id', contractor.id);
    }

    // Create setup intent for adding payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        contractor_id: contractor.id,
      },
    });

    return {
      success: true,
      customerId,
      setupIntentClientSecret: setupIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error('[PAYMENT] Setup intent creation failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to setup payment',
    };
  }
}

/**
 * Get all payment methods for the contractor
 */
export async function getPaymentMethods(): Promise<GetPaymentMethodsResult> {
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
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single()) as {
      data: {
        id: string;
        stripe_customer_id: string | null;
      } | null;
      error: any;
    };

    if (!contractor || !contractor.stripe_customer_id) {
      return { success: true, paymentMethods: [] };
    }

    const stripe = getStripeClient();

    // Get customer to find default payment method
    const customer = await stripe.customers.retrieve(
      contractor.stripe_customer_id
    );

    const defaultPaymentMethodId =
      customer &&
      typeof customer !== 'object'
        ? null
        : !('deleted' in customer) &&
            customer.invoice_settings?.default_payment_method
          ? typeof customer.invoice_settings.default_payment_method === 'string'
            ? customer.invoice_settings.default_payment_method
            : customer.invoice_settings.default_payment_method.id
          : null;

    // Get all payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: contractor.stripe_customer_id,
      type: 'card',
    });

    const formattedMethods: PaymentMethod[] = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '0000',
      exp_month: pm.card?.exp_month || 0,
      exp_year: pm.card?.exp_year || 0,
      is_default: pm.id === defaultPaymentMethodId,
    }));

    return {
      success: true,
      paymentMethods: formattedMethods,
    };
  } catch (error) {
    console.error('[PAYMENT] Failed to get payment methods:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to get payment methods',
    };
  }
}

/**
 * Set default payment method
 */
export async function setDefaultPaymentMethod(
  paymentMethodId: string
): Promise<RemovePaymentMethodResult> {
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
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single()) as {
      data: {
        id: string;
        stripe_customer_id: string | null;
      } | null;
      error: any;
    };

    if (!contractor || !contractor.stripe_customer_id) {
      return { success: false, message: 'No payment methods found' };
    }

    const stripe = getStripeClient();

    // Update customer default payment method
    await stripe.customers.update(contractor.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return { success: true, message: 'Default payment method updated' };
  } catch (error) {
    console.error('[PAYMENT] Failed to set default payment method:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to set default payment method',
    };
  }
}

/**
 * Remove payment method
 */
export async function removePaymentMethod(
  paymentMethodId: string
): Promise<RemovePaymentMethodResult> {
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
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single()) as {
      data: {
        id: string;
        stripe_customer_id: string | null;
      } | null;
      error: any;
    };

    if (!contractor || !contractor.stripe_customer_id) {
      return { success: false, message: 'No payment methods found' };
    }

    const stripe = getStripeClient();

    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    return { success: true, message: 'Payment method removed' };
  } catch (error) {
    console.error('[PAYMENT] Failed to remove payment method:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to remove payment method',
    };
  }
}
