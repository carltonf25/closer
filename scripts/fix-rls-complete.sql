-- Complete RLS Fix - Try this comprehensive approach
-- Run this in Supabase SQL Editor

-- Step 1: Check current state
SELECT 'Current policies:' as step;
SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'leads';

-- Step 2: Disable RLS temporarily to reset
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can create leads" ON leads;
DROP POLICY IF EXISTS "Contractors can view their delivered leads" ON leads;
DROP POLICY IF EXISTS "Service role full access to leads" ON leads;

-- Step 4: Re-enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 5: Grant explicit permissions to anon role
-- (This might be needed in some Supabase configurations)
GRANT INSERT ON leads TO anon;
GRANT INSERT ON leads TO authenticated;

-- Step 6: Create policies with explicit role targeting
-- Policy for anonymous users (public form submissions)
CREATE POLICY "leads_insert_anon"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users
CREATE POLICY "leads_insert_authenticated"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for contractors to view their leads
CREATE POLICY "Contractors can view their delivered leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lead_deliveries ld
      JOIN contractors c ON c.id = ld.contractor_id
      WHERE ld.lead_id = leads.id
        AND c.user_id = auth.uid()
    )
  );

-- Policy for service role (full access)
CREATE POLICY "Service role full access to leads"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify
SELECT 'New policies:' as step;
SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'leads' ORDER BY cmd, policyname;

-- Step 8: Check grants
SELECT 'Grants:' as step;
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'leads' 
  AND grantee IN ('anon', 'authenticated');

