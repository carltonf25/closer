-- HVAC/Plumbing Lead Generation Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE service_type AS ENUM (
  'hvac_repair',
  'hvac_install',
  'hvac_maintenance',
  'plumbing_emergency',
  'plumbing_repair',
  'plumbing_install',
  'water_heater'
);

CREATE TYPE lead_urgency AS ENUM (
  'emergency',
  'today',
  'this_week',
  'flexible'
);

CREATE TYPE property_type AS ENUM (
  'residential',
  'commercial'
);

CREATE TYPE lead_status AS ENUM (
  'new',
  'verified',
  'sent',
  'accepted',
  'rejected',
  'converted',
  'invalid'
);

CREATE TYPE lead_source AS ENUM (
  'seo',
  'ppc',
  'facebook',
  'referral',
  'direct'
);

CREATE TYPE contractor_status AS ENUM (
  'pending',
  'active',
  'paused',
  'churned'
);

CREATE TYPE billing_type AS ENUM (
  'per_lead',
  'monthly',
  'hybrid'
);

CREATE TYPE delivery_outcome AS ENUM (
  'pending',
  'viewed',
  'accepted',
  'rejected',
  'no_response'
);

-- ============================================
-- TABLES
-- ============================================

-- Leads table - core lead data from forms
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Service details
  service_type service_type NOT NULL,
  urgency lead_urgency NOT NULL,
  
  -- Contact info
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  
  -- Address
  address VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL DEFAULT 'GA',
  zip VARCHAR(10) NOT NULL,
  
  -- Property
  property_type property_type NOT NULL DEFAULT 'residential',
  description TEXT,
  
  -- Tracking
  source lead_source NOT NULL DEFAULT 'seo',
  source_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Status
  status lead_status NOT NULL DEFAULT 'new',
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100)
);

-- Contractors table - service providers
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Auth link
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company info
  company_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Address
  address VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL DEFAULT 'GA',
  zip VARCHAR(10) NOT NULL,
  
  -- Services
  services service_type[] NOT NULL,
  service_zips VARCHAR(10)[] NOT NULL,
  
  -- Verification
  license_number VARCHAR(50),
  license_verified BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Lead preferences
  max_leads_per_day INTEGER NOT NULL DEFAULT 10,
  max_leads_per_month INTEGER,
  
  -- Billing
  billing_type billing_type NOT NULL DEFAULT 'per_lead',
  stripe_customer_id VARCHAR(100),
  
  -- Contact preferences
  notification_phone VARCHAR(20),
  notification_email VARCHAR(255),
  
  -- Status
  status contractor_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Lead deliveries - tracks which leads sent to which contractors
CREATE TABLE lead_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  
  -- Timestamps
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  
  -- Outcome
  outcome delivery_outcome NOT NULL DEFAULT 'pending',
  feedback TEXT,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  
  -- Pricing
  is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  price DECIMAL(10, 2) NOT NULL,
  billed BOOLEAN NOT NULL DEFAULT FALSE,
  billed_at TIMESTAMPTZ,
  stripe_invoice_id VARCHAR(100),
  
  UNIQUE(lead_id, contractor_id)
);

-- Service areas - for SEO landing pages
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL DEFAULT 'GA',
  slug VARCHAR(100) NOT NULL,
  metro_area VARCHAR(100),
  population INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title VARCHAR(200),
  seo_description TEXT,
  
  UNIQUE(slug)
);

-- Lead prices - configurable pricing by service/urgency
CREATE TABLE lead_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type service_type NOT NULL,
  urgency lead_urgency NOT NULL,
  is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  base_price DECIMAL(10, 2) NOT NULL,
  state CHAR(2),
  metro_area VARCHAR(100),
  
  UNIQUE(service_type, urgency, is_exclusive, state, metro_area)
);

-- ============================================
-- INDEXES
-- ============================================

-- Leads indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_service_type ON leads(service_type);
CREATE INDEX idx_leads_city_state ON leads(city, state);
CREATE INDEX idx_leads_zip ON leads(zip);

-- Contractors indexes
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_services ON contractors USING GIN(services);
CREATE INDEX idx_contractors_service_zips ON contractors USING GIN(service_zips);

-- Lead deliveries indexes
CREATE INDEX idx_lead_deliveries_lead_id ON lead_deliveries(lead_id);
CREATE INDEX idx_lead_deliveries_contractor_id ON lead_deliveries(contractor_id);
CREATE INDEX idx_lead_deliveries_outcome ON lead_deliveries(outcome);
CREATE INDEX idx_lead_deliveries_billed ON lead_deliveries(billed) WHERE billed = FALSE;

-- Service areas indexes
CREATE INDEX idx_service_areas_state ON service_areas(state);
CREATE INDEX idx_service_areas_is_active ON service_areas(is_active) WHERE is_active = TRUE;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to match contractors for a lead
CREATE OR REPLACE FUNCTION match_contractors_for_lead(p_lead_id UUID)
RETURNS SETOF contractors AS $$
DECLARE
  v_lead leads%ROWTYPE;
BEGIN
  -- Get the lead
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Find matching contractors
  RETURN QUERY
  SELECT c.*
  FROM contractors c
  WHERE c.status = 'active'
    AND v_lead.service_type = ANY(c.services)
    AND v_lead.zip = ANY(c.service_zips)
  ORDER BY c.created_at
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_prices ENABLE ROW LEVEL SECURITY;

-- Leads policies
-- Anyone can insert leads (public form submissions)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Only authenticated contractors can view leads delivered to them
CREATE POLICY "Contractors can view their delivered leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lead_deliveries ld
      JOIN contractors c ON c.id = ld.contractor_id
      WHERE ld.lead_id = leads.id
        AND c.user_id = auth.uid()
    )
  );

-- Service role can do anything
CREATE POLICY "Service role full access to leads"
  ON leads FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Contractors policies
-- Contractors can view and update their own profile
CREATE POLICY "Contractors can view own profile"
  ON contractors FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Contractors can update own profile"
  ON contractors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role full access
CREATE POLICY "Service role full access to contractors"
  ON contractors FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Lead deliveries policies
CREATE POLICY "Contractors can view their deliveries"
  ON lead_deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contractors c
      WHERE c.id = lead_deliveries.contractor_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can update their delivery responses"
  ON lead_deliveries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contractors c
      WHERE c.id = lead_deliveries.contractor_id
        AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contractors c
      WHERE c.id = lead_deliveries.contractor_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access to lead_deliveries"
  ON lead_deliveries FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Service areas - public read
CREATE POLICY "Anyone can view service areas"
  ON service_areas FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

CREATE POLICY "Service role full access to service_areas"
  ON service_areas FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Lead prices - public read
CREATE POLICY "Anyone can view lead prices"
  ON lead_prices FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Service role full access to lead_prices"
  ON lead_prices FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Georgia service areas
INSERT INTO service_areas (city, state, slug, metro_area, population, is_active) VALUES
  ('Atlanta', 'GA', 'atlanta', 'Atlanta', 498715, TRUE),
  ('Marietta', 'GA', 'marietta', 'Atlanta', 60972, TRUE),
  ('Alpharetta', 'GA', 'alpharetta', 'Atlanta', 65818, TRUE),
  ('Roswell', 'GA', 'roswell', 'Atlanta', 92833, TRUE),
  ('Sandy Springs', 'GA', 'sandy-springs', 'Atlanta', 108080, TRUE),
  ('Johns Creek', 'GA', 'johns-creek', 'Atlanta', 82453, TRUE),
  ('Dunwoody', 'GA', 'dunwoody', 'Atlanta', 49356, TRUE),
  ('Brookhaven', 'GA', 'brookhaven', 'Atlanta', 55554, TRUE),
  ('Decatur', 'GA', 'decatur', 'Atlanta', 24814, TRUE),
  ('Smyrna', 'GA', 'smyrna', 'Atlanta', 56666, TRUE),
  ('Kennesaw', 'GA', 'kennesaw', 'Atlanta', 34077, TRUE),
  ('Lawrenceville', 'GA', 'lawrenceville', 'Atlanta', 30512, TRUE),
  ('Duluth', 'GA', 'duluth', 'Atlanta', 29538, TRUE),
  ('Peachtree City', 'GA', 'peachtree-city', 'Atlanta', 35364, TRUE),
  ('Woodstock', 'GA', 'woodstock', 'Atlanta', 32310, TRUE),
  ('Savannah', 'GA', 'savannah', 'Savannah', 147780, TRUE),
  ('Augusta', 'GA', 'augusta', 'Augusta', 202081, TRUE),
  ('Columbus', 'GA', 'columbus', 'Columbus', 206922, TRUE),
  ('Macon', 'GA', 'macon', 'Macon', 157346, TRUE),
  ('Athens', 'GA', 'athens', 'Athens', 127315, TRUE);

-- Insert base lead prices
INSERT INTO lead_prices (service_type, urgency, is_exclusive, base_price) VALUES
  -- HVAC Repair
  ('hvac_repair', 'emergency', FALSE, 35.00),
  ('hvac_repair', 'emergency', TRUE, 85.00),
  ('hvac_repair', 'today', FALSE, 30.00),
  ('hvac_repair', 'today', TRUE, 70.00),
  ('hvac_repair', 'this_week', FALSE, 25.00),
  ('hvac_repair', 'this_week', TRUE, 60.00),
  ('hvac_repair', 'flexible', FALSE, 20.00),
  ('hvac_repair', 'flexible', TRUE, 50.00),
  
  -- HVAC Install
  ('hvac_install', 'emergency', FALSE, 55.00),
  ('hvac_install', 'emergency', TRUE, 140.00),
  ('hvac_install', 'today', FALSE, 50.00),
  ('hvac_install', 'today', TRUE, 130.00),
  ('hvac_install', 'this_week', FALSE, 45.00),
  ('hvac_install', 'this_week', TRUE, 120.00),
  ('hvac_install', 'flexible', FALSE, 35.00),
  ('hvac_install', 'flexible', TRUE, 100.00),
  
  -- HVAC Maintenance
  ('hvac_maintenance', 'emergency', FALSE, 20.00),
  ('hvac_maintenance', 'emergency', TRUE, 45.00),
  ('hvac_maintenance', 'today', FALSE, 18.00),
  ('hvac_maintenance', 'today', TRUE, 40.00),
  ('hvac_maintenance', 'this_week', FALSE, 15.00),
  ('hvac_maintenance', 'this_week', TRUE, 35.00),
  ('hvac_maintenance', 'flexible', FALSE, 12.00),
  ('hvac_maintenance', 'flexible', TRUE, 28.00),
  
  -- Plumbing Emergency
  ('plumbing_emergency', 'emergency', FALSE, 45.00),
  ('plumbing_emergency', 'emergency', TRUE, 110.00),
  ('plumbing_emergency', 'today', FALSE, 38.00),
  ('plumbing_emergency', 'today', TRUE, 95.00),
  ('plumbing_emergency', 'this_week', FALSE, 30.00),
  ('plumbing_emergency', 'this_week', TRUE, 75.00),
  ('plumbing_emergency', 'flexible', FALSE, 25.00),
  ('plumbing_emergency', 'flexible', TRUE, 60.00),
  
  -- Plumbing Repair
  ('plumbing_repair', 'emergency', FALSE, 30.00),
  ('plumbing_repair', 'emergency', TRUE, 70.00),
  ('plumbing_repair', 'today', FALSE, 25.00),
  ('plumbing_repair', 'today', TRUE, 60.00),
  ('plumbing_repair', 'this_week', FALSE, 20.00),
  ('plumbing_repair', 'this_week', TRUE, 50.00),
  ('plumbing_repair', 'flexible', FALSE, 15.00),
  ('plumbing_repair', 'flexible', TRUE, 40.00),
  
  -- Plumbing Install
  ('plumbing_install', 'emergency', FALSE, 45.00),
  ('plumbing_install', 'emergency', TRUE, 105.00),
  ('plumbing_install', 'today', FALSE, 40.00),
  ('plumbing_install', 'today', TRUE, 95.00),
  ('plumbing_install', 'this_week', FALSE, 35.00),
  ('plumbing_install', 'this_week', TRUE, 85.00),
  ('plumbing_install', 'flexible', FALSE, 28.00),
  ('plumbing_install', 'flexible', TRUE, 70.00),
  
  -- Water Heater
  ('water_heater', 'emergency', FALSE, 50.00),
  ('water_heater', 'emergency', TRUE, 120.00),
  ('water_heater', 'today', FALSE, 45.00),
  ('water_heater', 'today', TRUE, 110.00),
  ('water_heater', 'this_week', FALSE, 40.00),
  ('water_heater', 'this_week', TRUE, 100.00),
  ('water_heater', 'flexible', FALSE, 32.00),
  ('water_heater', 'flexible', TRUE, 85.00);
