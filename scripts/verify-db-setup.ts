#!/usr/bin/env tsx
/**
 * Database Setup Verification Script
 * 
 * Run this after setting up your Supabase database to verify everything is working.
 * 
 * Usage:
 *   npx tsx scripts/verify-db-setup.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please ensure .env.local contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseSetup() {
  console.log('🔍 Verifying database setup...\n');

  const checks = [
    {
      name: 'Service Areas Table',
      query: async () => {
        const { data, error } = await supabase
          .from('service_areas')
          .select('id, city, slug')
          .limit(5);
        
        if (error) throw error;
        return { success: true, count: data?.length || 0, sample: data };
      },
    },
    {
      name: 'Lead Prices Table',
      query: async () => {
        const { data, error } = await supabase
          .from('lead_prices')
          .select('service_type, urgency, base_price')
          .limit(5);
        
        if (error) throw error;
        return { success: true, count: data?.length || 0, sample: data };
      },
    },
    {
      name: 'Public Lead Creation',
      query: async () => {
        const testLead = {
          service_type: 'hvac_repair',
          urgency: 'today',
          first_name: 'Test',
          last_name: 'Verification',
          phone: '555-0000',
          address: '123 Test St',
          city: 'Atlanta',
          state: 'GA',
          zip: '30309',
          property_type: 'residential',
        };

        const { data, error } = await supabase
          .from('leads')
          .insert(testLead)
          .select()
          .single();

        if (error) throw error;

        // Clean up test lead
        await supabase.from('leads').delete().eq('id', data.id);

        return { success: true, leadId: data.id };
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      console.log(`Checking ${check.name}...`);
      const result = await check.query();
      
      if (result.success) {
        console.log(`  ✅ ${check.name} - OK`);
        if ('count' in result) {
          console.log(`     Found ${result.count} records`);
        }
        passed++;
      }
    } catch (error: any) {
      console.log(`  ❌ ${check.name} - FAILED`);
      console.log(`     Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\n✅ Database setup verified successfully!');
    console.log('You can now proceed with the next steps in DEVELOPMENT_PLAN.md');
  } else {
    console.log('\n❌ Some checks failed. Please review the errors above.');
    console.log('Make sure you have:');
    console.log('  1. Run the migration SQL script in Supabase SQL Editor');
    console.log('  2. Set correct environment variables in .env.local');
    process.exit(1);
  }
}

verifyDatabaseSetup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

