-- Add notification and preference fields to contractors table

-- Profile fields
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS business_description TEXT;

-- Service area and services fields
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS service_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS services_offered TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Lead preference fields
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS max_lead_budget INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS preferred_urgencies TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS preferred_property_types TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS exclusive_only BOOLEAN DEFAULT FALSE;

-- Notification preference fields
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notify_new_lead BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notify_lead_updates BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notify_messages BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notify_billing BOOLEAN DEFAULT TRUE;

-- Add comments for documentation
COMMENT ON COLUMN contractors.business_description IS 'Business description shown to homeowners';
COMMENT ON COLUMN contractors.service_areas IS 'Array of service areas (ZIP codes or city names)';
COMMENT ON COLUMN contractors.services_offered IS 'Array of service types offered';
COMMENT ON COLUMN contractors.max_lead_budget IS 'Maximum monthly spend on leads in dollars';
COMMENT ON COLUMN contractors.preferred_urgencies IS 'Array of preferred job urgencies (emergency, today, this_week, flexible)';
COMMENT ON COLUMN contractors.preferred_property_types IS 'Array of preferred property types (single_family, multi_family, condo, commercial)';
COMMENT ON COLUMN contractors.exclusive_only IS 'Only accept exclusive leads';
COMMENT ON COLUMN contractors.email_notifications IS 'Enable email notifications';
COMMENT ON COLUMN contractors.sms_notifications IS 'Enable SMS notifications';
COMMENT ON COLUMN contractors.notify_new_lead IS 'Notify on new leads';
COMMENT ON COLUMN contractors.notify_lead_updates IS 'Notify on lead updates';
COMMENT ON COLUMN contractors.notify_messages IS 'Notify on messages';
COMMENT ON COLUMN contractors.notify_billing IS 'Notify on billing events';
