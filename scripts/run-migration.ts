import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      '..',
      'supabase',
      'migrations',
      '002_make_address_optional.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Running migration: 002_make_address_optional.sql');
    console.log('SQL:', sql);

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('Address field is now optional in the leads table.');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
