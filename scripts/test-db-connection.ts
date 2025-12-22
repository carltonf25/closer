/**
 * Simple database connection test
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure .env.local is loaded and contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  try {
    // Test 1: Read service areas (public read)
    console.log('1. Testing public read access (service_areas)...');
    const { data: areas, error: areasError } = await supabase
      .from('service_areas')
      .select('city, slug')
      .limit(3);

    if (areasError) throw areasError;
    console.log(`   ✅ Found ${areas?.length || 0} service areas`);
    if (areas && areas.length > 0) {
      console.log(`   Sample: ${areas[0].city} (${areas[0].slug})`);
    }

    // Test 2: Read lead prices (public read)
    console.log('\n2. Testing public read access (lead_prices)...');
    const { data: prices, error: pricesError } = await supabase
      .from('lead_prices')
      .select('service_type, urgency, base_price')
      .limit(3);

    if (pricesError) throw pricesError;
    console.log(`   ✅ Found ${prices?.length || 0} price entries`);
    if (prices && prices.length > 0) {
      console.log(`   Sample: ${prices[0].service_type} - ${prices[0].urgency}: $${prices[0].base_price}`);
    }

    // Test 3: Create a test lead (public insert)
    console.log('\n3. Testing public lead creation...');
    const testLead = {
      service_type: 'hvac_repair',
      urgency: 'today',
      first_name: 'Test',
      last_name: 'Connection',
      phone: '555-9999',
      address: '123 Test St',
      city: 'Atlanta',
      state: 'GA',
      zip: '30309',
      property_type: 'residential',
    };

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()
      .single();

    if (leadError) {
      console.error('\n   ❌ Lead creation failed!');
      console.error(`   Error code: ${leadError.code || 'unknown'}`);
      console.error(`   Error message: ${leadError.message}`);
      console.error(`   Error details: ${JSON.stringify(leadError, null, 2)}`);
      
      if (leadError.message.includes('row-level security') || leadError.message.includes('RLS')) {
        console.error('\n   ⚠️  RLS Policy Issue Detected!');
        console.error('   The "Anyone can create leads" policy may not be set up correctly.');
        console.error('\n   To fix this:');
        console.error('   1. Go to Supabase Dashboard → SQL Editor');
        console.error('   2. Run the SQL in: scripts/fix-rls-policies.sql');
        console.error('   3. Or manually run:');
        console.error('      DROP POLICY IF EXISTS "Anyone can create leads" ON leads;');
        console.error('      CREATE POLICY "Anyone can create leads"');
        console.error('        ON leads FOR INSERT TO anon, authenticated');
        console.error('        WITH CHECK (TRUE);');
        console.error('\n   4. Verify the policy exists:');
        console.error('      SELECT * FROM pg_policies WHERE tablename = \'leads\';');
      }
      throw leadError;
    }
    
    console.log(`   ✅ Lead created successfully (ID: ${lead.id})`);

    // Note: We can't delete via anon key due to RLS, but that's OK for testing
    // The lead will remain but can be cleaned up manually or via admin client
    console.log('   ℹ️  Note: Test lead created (cleanup requires admin access)');

    console.log('\n' + '='.repeat(50));
    console.log('✅ All database tests passed!');
    console.log('Your database is set up correctly and ready to use.');
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('\n❌ Database test failed!');
    console.error(`Error: ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('1. Verify .env.local has correct Supabase credentials');
    console.error('2. Check that the migration SQL was run successfully');
    console.error('3. Verify RLS policies are enabled in Supabase dashboard');
    process.exit(1);
  }
}

testConnection();

