-- Add detailed payment tracking to lead_deliveries table

ALTER TABLE lead_deliveries
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failed_reason TEXT,
ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_reason TEXT;

-- Add indexes for payment tracking
CREATE INDEX IF NOT EXISTS idx_deliveries_payment_intent
ON lead_deliveries(stripe_payment_intent_id)
WHERE stripe_payment_intent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_deliveries_failed_payments
ON lead_deliveries(payment_failed_at)
WHERE payment_failed_at IS NOT NULL AND billed = FALSE;

CREATE INDEX IF NOT EXISTS idx_deliveries_refunded
ON lead_deliveries(refunded)
WHERE refunded = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN lead_deliveries.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for this charge';
COMMENT ON COLUMN lead_deliveries.payment_failed_at IS 'Timestamp when payment failed';
COMMENT ON COLUMN lead_deliveries.payment_failed_reason IS 'Reason for payment failure';
COMMENT ON COLUMN lead_deliveries.refunded IS 'Whether this charge was refunded';
COMMENT ON COLUMN lead_deliveries.refunded_at IS 'Timestamp when refund was processed';
COMMENT ON COLUMN lead_deliveries.refund_reason IS 'Reason for refund';
