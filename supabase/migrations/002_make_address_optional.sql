-- Make address and city fields optional for leads
-- This allows quick lead forms to submit without full address information

ALTER TABLE leads
ALTER COLUMN address DROP NOT NULL;

ALTER TABLE leads
ALTER COLUMN city DROP NOT NULL;

-- Update the columns to allow NULL values
COMMENT ON COLUMN leads.address IS 'Street address - optional for quick leads, can be collected in follow-up';
COMMENT ON COLUMN leads.city IS 'City - optional for quick leads, can be derived from ZIP or collected in follow-up';
