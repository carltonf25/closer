-- Add subscription tracking fields to contractors table

ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

-- Add index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_contractors_stripe_subscription
ON contractors(stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;

-- Add constraint to ensure valid subscription statuses
ALTER TABLE contractors
DROP CONSTRAINT IF EXISTS check_subscription_status;

ALTER TABLE contractors
ADD CONSTRAINT check_subscription_status
CHECK (
  subscription_status IS NULL OR
  subscription_status IN ('active', 'past_due', 'canceled', 'unpaid', 'trialing')
);

-- Add comments for documentation
COMMENT ON COLUMN contractors.stripe_subscription_id IS 'Stripe subscription ID for monthly/hybrid billing';
COMMENT ON COLUMN contractors.subscription_status IS 'Current Stripe subscription status';
COMMENT ON COLUMN contractors.subscription_current_period_end IS 'End date of current billing period';
