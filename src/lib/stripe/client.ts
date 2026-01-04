import Stripe from 'stripe';

// Lazy initialization for serverless environment compatibility
let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('[STRIPE] STRIPE_SECRET_KEY is not configured');
    }

    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
      appInfo: {
        name: 'Georgia Home Services',
        version: '1.0.0',
      },
    });
  }

  return stripeClient;
}

export default getStripeClient;
