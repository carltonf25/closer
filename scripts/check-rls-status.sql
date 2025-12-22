-- Check RLS Status and Policies
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'leads';

-- 2. List ALL policies on leads table with full details
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- 3. Check what roles exist
SELECT rolname 
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres');

-- 4. Try to see if there are any conflicting policies
-- (This query shows policies that might conflict)
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'INSERT' AND 'anon' = ANY(roles::text[]) THEN 'Should allow anon insert'
    WHEN cmd = 'INSERT' AND 'authenticated' = ANY(roles::text[]) THEN 'Should allow authenticated insert'
    ELSE 'Other'
  END as policy_type
FROM pg_policies 
WHERE tablename = 'leads';

