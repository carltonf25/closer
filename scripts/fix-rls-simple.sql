-- Simple RLS Fix for Leads Table
-- Run this in Supabase SQL Editor

-- First, let's see what policies exist
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'leads';

-- Drop the insert policy
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

-- Recreate with explicit role specification
-- Note: In Supabase, 'anon' is the role for unauthenticated users
CREATE POLICY "Anyone can create leads"
  ON leads 
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users
CREATE POLICY "Authenticated users can create leads"
  ON leads 
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Verify
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'leads' AND cmd = 'INSERT';

