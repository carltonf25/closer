-- Verify Contractor RLS Policies
-- Run this in your Supabase SQL Editor

-- 1. Check if RLS is enabled on contractors table
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'contractors';

-- 2. List ALL policies on contractors table
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
WHERE tablename = 'contractors'
ORDER BY policyname;

-- 3. Check if the policy exists for SELECT
SELECT policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'contractors'
  AND cmd = 'SELECT';

-- 4. Test the current user's permissions (run this while logged in)
SELECT
  auth.uid() as current_user_id,
  COUNT(*) as contractor_records_visible
FROM contractors
WHERE user_id = auth.uid();

-- 5. Check if there are any contractors at all (as service role)
SELECT COUNT(*) as total_contractors
FROM contractors;
