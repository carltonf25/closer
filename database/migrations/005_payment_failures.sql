-- Create payment_failures table to track failed payment attempts
CREATE TABLE IF NOT EXISTS payment_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_failures_contractor_id
  ON payment_failures(contractor_id);

CREATE INDEX IF NOT EXISTS idx_payment_failures_resolved
  ON payment_failures(resolved);

-- Enable RLS
ALTER TABLE payment_failures ENABLE ROW LEVEL SECURITY;

-- Policy: Contractors can view their own payment failures
CREATE POLICY "Contractors can view own payment failures"
  ON payment_failures FOR SELECT
  TO authenticated
  USING (
    contractor_id IN (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );

-- Policy: Service role can do everything
CREATE POLICY "Service role can do everything on payment_failures"
  ON payment_failures FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE payment_failures IS 'Tracks failed payment attempts for billing';
