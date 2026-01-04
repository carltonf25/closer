export const STRIPE_CONFIG = {
  currency: 'usd',

  prices: {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY_ID || '',
    elite_monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY_ID || '',
  },

  metadata: {
    contractorId: 'contractor_id',
    leadDeliveryId: 'lead_delivery_id',
    billingType: 'billing_type',
    pricingTier: 'pricing_tier',
  },
} as const;

export default STRIPE_CONFIG;
