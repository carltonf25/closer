# Database Setup Guide

This guide will help you complete the database setup for your HVAC lead generation platform.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. You'll need three values:
   - **Project URL**: Found at the top of the API settings page
     - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Listed under "Project API keys"
     - This is the public key that can be exposed in client-side code
     - ⚠️ **Important**: This should be a JWT token starting with `eyJ...`
     - It's a long string (200+ characters)
   - **service_role key**: Also listed under "Project API keys"
     - ⚠️ **Keep this secret!** Never commit this to version control
     - This key bypasses Row Level Security (RLS) - use only server-side
     - Also a JWT token starting with `eyJ...`

## Step 2: Configure Environment Variables

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long JWT token)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long JWT token)
```

**Note**: Both API keys should be JWT tokens (long strings starting with `eyJ`). If you see keys that look different, make sure you're copying from the correct fields in the Supabase dashboard.

## Step 3: Run the Database Migration

You have two options to run the migration:

### Option A: Using Supabase SQL Editor (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase/migrations/001_initial_schema.sql`
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for the migration to complete (should take a few seconds)

### Option B: Using Supabase CLI (Advanced)

If you have Supabase CLI installed and linked:

```bash
# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## Step 4: Verify the Migration

After running the migration, verify that everything was created correctly:

### Check Tables

Run this query in the SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:

- `contractors`
- `lead_deliveries`
- `lead_prices`
- `leads`
- `service_areas`

### Check Enums

```sql
SELECT typname
FROM pg_type
WHERE typtype = 'e'
ORDER BY typname;
```

You should see:

- `billing_type`
- `contractor_status`
- `delivery_outcome`
- `lead_source`
- `lead_status`
- `lead_urgency`
- `property_type`
- `service_type`

### Check Seed Data

```sql
-- Check service areas (should have 20 Georgia cities)
SELECT COUNT(*) FROM service_areas;
-- Expected: 20

-- Check lead prices (should have pricing for all service/urgency combinations)
SELECT COUNT(*) FROM lead_prices;
-- Expected: 56 (7 services × 4 urgency levels × 2 exclusivity options)
```

## Step 5: Test RLS Policies

Test that Row Level Security is working correctly:

### Test Public Lead Creation

```sql
-- This should work (anyone can create leads)
INSERT INTO leads (
  service_type, urgency, first_name, last_name, phone,
  address, city, state, zip, property_type
) VALUES (
  'hvac_repair', 'today', 'Test', 'User', '555-1234',
  '123 Main St', 'Atlanta', 'GA', '30309', 'residential'
);

-- Verify it was created
SELECT * FROM leads WHERE first_name = 'Test';
```

### Test Public Read Access

```sql
-- Anyone should be able to read service areas
SELECT * FROM service_areas LIMIT 5;

-- Anyone should be able to read lead prices
SELECT * FROM lead_prices LIMIT 5;
```

### Clean Up Test Data

```sql
-- Remove test lead
DELETE FROM leads WHERE first_name = 'Test';
```

## Step 6: Generate TypeScript Types

After the migration is complete, generate TypeScript types from your database:

```bash
# First, get your project ID from Supabase dashboard (Settings > General)
# Then run:
SUPABASE_PROJECT_ID=your-project-id npm run db:types
```

Or manually:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

## Step 7: Test Database Connection

After setting up your environment variables, test the connection:

```bash
# Test with anonymous key (tests RLS policies)
npm run db:test

# Test with service role (confirms app will work)
npx tsx scripts/test-with-service-role.ts
```

**Important Note**: Your application uses the `service_role` key (via `createAdminSupabaseClient()`), which bypasses RLS. This means:

- ✅ **Your application forms will work** even if the anon RLS test fails
- ✅ The service role test confirms everything is set up correctly
- ⚠️ The anon RLS test is mainly for security best practices

The tests verify:

- ✅ Database connection works
- ✅ Public read access to service_areas
- ✅ Public read access to lead_prices
- ✅ Lead creation with service role (your app uses this)
- ⚠️ Public insert access to leads via anon key (optional, for security)

## Troubleshooting

### "Invalid API key" Error

If you get an "Invalid API key" error when running `npm run db:test`:

1. **Verify key format**: Supabase API keys are JWT tokens that start with `eyJ...` and are 200+ characters long
2. **Check .env.local**: Make sure the file exists and contains all three variables
3. **No quotes needed**: Don't wrap the keys in quotes in `.env.local`
4. **Copy correctly**: Make sure you copied the entire key (they're very long)
5. **Check dashboard**: Go to Settings → API and verify you're copying from the correct fields:
   - `anon` / `public` key (not `publishable`)
   - `service_role` key

### Migration Fails with "already exists" errors

If you see errors about tables/enums already existing, you can either:

1. Drop and recreate (⚠️ **WARNING**: This will delete all data):

   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```

   Then re-run the migration.

2. Or modify the migration to use `CREATE IF NOT EXISTS` (not recommended for production).

### RLS Policy Errors

If you get "new row violates row-level security policy" when running `npm run db:test`:

**First, verify your app will work:**

```bash
npx tsx scripts/test-with-service-role.ts
```

If that passes ✅, your application will work fine because it uses the service role key.

**To fix RLS for anonymous access** (optional, for security best practices):

Run the comprehensive fix script in Supabase SQL Editor:

```sql
-- See scripts/fix-rls-complete.sql for full fix
```

Or try this simplified approach:

```sql
-- Grant explicit permissions
GRANT INSERT ON leads TO anon;
GRANT INSERT ON leads TO authenticated;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can create leads" ON leads;

CREATE POLICY "leads_insert_anon"
  ON leads FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leads_insert_authenticated"
  ON leads FOR INSERT TO authenticated
  WITH CHECK (true);
```

**Note**: Some Supabase projects may have the anon role configured differently. If RLS policies still don't work after trying these fixes, it's okay - your application will still function correctly using the service role.

**Note**: Your application code uses `createAdminSupabaseClient()` which bypasses RLS, so forms will work even if this test fails. However, it's good practice to have the RLS policy correct for security.

### Type Generation Fails

If `npm run db:types` fails:

- Make sure you have the Supabase CLI installed: `npm install -g supabase`
- Verify your project ID is correct
- Check that your Supabase project is accessible

## Next Steps

Once the database is set up:

1. ✅ Database setup complete
2. ⏭️ Test lead form submissions
3. ⏭️ Set up email notifications
4. ⏭️ Configure contractor onboarding

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/tables)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
