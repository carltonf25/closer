import { NextRequest, NextResponse } from 'next/server';
import getStripeClient from '@/lib/stripe/client';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('[STRIPE_WEBHOOK] Payment succeeded:', paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error('[STRIPE_WEBHOOK] Payment failed:', paymentIntent.id);

  const deliveryId = paymentIntent.metadata?.lead_delivery_id;
  if (deliveryId) {
    const supabase = createAdminSupabaseClient();
    await supabase
      .from('lead_deliveries')
      .update({
        billed: false,
        billed_at: null,
        feedback: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown'}`,
      })
      .eq('id', deliveryId);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[STRIPE_WEBHOOK] Invoice paid:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.error('[STRIPE_WEBHOOK] Invoice failed:', invoice.id);

  const customerId = invoice.customer as string;
  const supabase = createAdminSupabaseClient();

  const { data: contractor } = (await supabase
    .from('contractors')
    .select('id, status')
    .eq('stripe_customer_id', customerId)
    .single()) as {
    data: { id: string; status: string } | null;
    error: any;
  };

  if (contractor && (invoice.attempt_count || 0) >= 3) {
    await supabase
      .from('contractors')
      .update({ status: 'paused' })
      .eq('id', contractor.id);

    console.log('[STRIPE_WEBHOOK] Contractor paused:', contractor.id);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const supabase = createAdminSupabaseClient();

  const { data: contractor } = (await supabase
    .from('contractors')
    .select('id, status')
    .eq('stripe_customer_id', customerId)
    .single()) as {
    data: { id: string; status: string } | null;
    error: any;
  };

  if (
    contractor &&
    subscription.status === 'active' &&
    contractor.status === 'paused'
  ) {
    await supabase
      .from('contractors')
      .update({ status: 'active' })
      .eq('id', contractor.id);

    console.log('[STRIPE_WEBHOOK] Contractor reactivated:', contractor.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const supabase = createAdminSupabaseClient();

  const { data: contractor } = (await supabase
    .from('contractors')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()) as {
    data: { id: string } | null;
    error: any;
  };

  if (contractor) {
    await supabase
      .from('contractors')
      .update({
        billing_type: 'per_lead',
        pricing_tier: 'starter',
      })
      .eq('id', contractor.id);

    console.log('[STRIPE_WEBHOOK] Contractor downgraded:', contractor.id);
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[STRIPE_WEBHOOK] Webhook secret not configured');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log('[STRIPE_WEBHOOK] Event received:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        console.log('[STRIPE_WEBHOOK] Unhandled event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[STRIPE_WEBHOOK] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook failed' },
      { status: 400 }
    );
  }
}
