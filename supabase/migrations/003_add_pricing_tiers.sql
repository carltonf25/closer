-- Add pricing tier support to contractors table

-- Create pricing tier enum
CREATE TYPE pricing_tier AS ENUM ('starter', 'pro', 'elite');

-- Add tier column to contractors table
ALTER TABLE contractors
ADD COLUMN pricing_tier pricing_tier NOT NULL DEFAULT 'starter',
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN onboarding_completed_at TIMESTAMPTZ;

-- Add indexes for new columns
CREATE INDEX idx_contractors_pricing_tier ON contractors(pricing_tier);
CREATE INDEX idx_contractors_onboarding_completed ON contractors(onboarding_completed) WHERE onboarding_completed = FALSE;

-- Update existing contractors to have onboarding completed
-- (since they went through the old signup flow)
UPDATE contractors
SET onboarding_completed = TRUE,
    onboarding_completed_at = created_at
WHERE onboarding_completed = FALSE;
