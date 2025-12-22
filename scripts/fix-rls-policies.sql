-- Fix RLS Policies for Leads Table
-- Run this in Supabase SQL Editor if lead creation fails with RLS errors

-- First, check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leads';

-- Drop existing policy if it exists (to recreate it)
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

-- Recreate the policy with explicit anon role
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Verify RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Test the policy (this should work)
-- Note: Run this as anon role in SQL Editor
INSERT INTO leads (
  service_type, urgency, first_name, last_name, phone, 
  address, city, state, zip, property_type
) VALUES (
  'hvac_repair', 'today', 'RLS', 'Test', '555-9999',
  '123 Test St', 'Atlanta', 'GA', '30309', 'residential'
);

-- Clean up test
DELETE FROM leads WHERE first_name = 'RLS';

