import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyLeads() {
  console.log('\n📊 Checking leads in database...\n');

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error fetching leads:', error);
    return;
  }

  console.log(`✅ Found ${leads?.length || 0} recent leads:\n`);

  leads?.forEach((lead, index) => {
    console.log(`Lead #${index + 1}:`);
    console.log(`  ID: ${lead.id}`);
    console.log(`  Name: ${lead.first_name} ${lead.last_name}`);
    console.log(`  Phone: ${lead.phone}`);
    console.log(`  Service: ${lead.service_type}`);
    console.log(`  Urgency: ${lead.urgency}`);
    console.log(`  Address: ${lead.address || '(not provided)'}`);
    console.log(`  City: ${lead.city || '(not provided)'}`);
    console.log(`  ZIP: ${lead.zip}`);
    console.log(`  Status: ${lead.status}`);
    console.log(`  Created: ${new Date(lead.created_at).toLocaleString()}`);
    console.log('');
  });
}

verifyLeads();
