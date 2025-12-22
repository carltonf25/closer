-- Comprehensive RLS Policy Diagnostic and Fix
-- Run this in Supabase SQL Editor

-- Step 1: Check current RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'leads';

-- Step 2: List all existing policies on leads table
SELECT 
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- Step 3: Drop ALL existing policies on leads (we'll recreate them)
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Contractors can view their delivered leads" ON leads;
DROP POLICY IF EXISTS "Service role full access to leads" ON leads;

-- Step 4: Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 5: Recreate policies in correct order

-- Policy 1: Allow anonymous and authenticated users to INSERT leads
CREATE POLICY "Anyone can create leads"
  ON leads 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow contractors to view leads delivered to them
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

-- Policy 3: Service role has full access (bypasses RLS)
CREATE POLICY "Service role full access to leads"
  ON leads 
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 6: Verify policies were created
SELECT 
  policyname,
  permissive,
  roles,
  cmd as command
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- Step 7: Test insert as anon (this should work now)
-- Note: You can't actually test as anon in SQL Editor, but the policy is set up correctly
-- The test script will verify this works

