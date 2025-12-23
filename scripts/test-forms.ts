/**
 * Test script for Lead Capture Forms
 * Tests both QuickLeadForm and LeadForm submissions
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import { submitQuickLead, submitLead } from '@/actions/leads';

async function testQuickLeadForm() {
  console.log('\n📝 Testing QuickLeadForm...\n');

  const formData = new FormData();
  formData.append('service_type', 'hvac_repair');
  formData.append('name', 'John Smith');
  formData.append('phone', '(404) 555-1234');
  formData.append('zip', '30301');
  formData.append('source', 'seo');
  formData.append('source_url', 'http://localhost:3000');

  const result = await submitQuickLead(null, formData);

  if (result.success) {
    console.log('✅ QuickLeadForm submission PASSED');
    console.log('   Lead ID:', result.data?.lead_id);
    console.log('   Message:', result.message);
  } else {
    console.log('❌ QuickLeadForm submission FAILED');
    console.log('   Message:', result.message);
    console.log('   Errors:', result.errors);
  }

  return result.success;
}

async function testFullLeadForm() {
  console.log('\n📝 Testing Full LeadForm...\n');

  const formData = new FormData();
  formData.append('service_type', 'plumbing_emergency');
  formData.append('urgency', 'emergency');
  formData.append('first_name', 'Jane');
  formData.append('last_name', 'Doe');
  formData.append('phone', '7705551234');
  formData.append('email', 'jane.doe@example.com');
  formData.append('address', '123 Peachtree St');
  formData.append('city', 'Atlanta');
  formData.append('state', 'GA');
  formData.append('zip', '30303');
  formData.append('property_type', 'residential');
  formData.append(
    'description',
    'Burst pipe in basement - need immediate help'
  );
  formData.append('source', 'seo');
  formData.append(
    'source_url',
    'http://localhost:3000/atlanta/emergency-plumber'
  );

  const result = await submitLead(null, formData);

  if (result.success) {
    console.log('✅ Full LeadForm submission PASSED');
    console.log('   Lead ID:', result.data?.lead_id);
    console.log('   Message:', result.message);
  } else {
    console.log('❌ Full LeadForm submission FAILED');
    console.log('   Message:', result.message);
    console.log('   Errors:', result.errors);
  }

  return result.success;
}

async function testValidation() {
  console.log('\n📝 Testing Form Validation...\n');

  // Test invalid phone number
  const invalidPhoneData = new FormData();
  invalidPhoneData.append('service_type', 'hvac_repair');
  invalidPhoneData.append('name', 'Test User');
  invalidPhoneData.append('phone', '123'); // Invalid phone
  invalidPhoneData.append('zip', '30301');

  const invalidResult = await submitQuickLead(null, invalidPhoneData);

  if (!invalidResult.success && invalidResult.errors?.phone) {
    console.log(
      '✅ Phone validation PASSED - correctly rejected invalid phone'
    );
  } else {
    console.log(
      '❌ Phone validation FAILED - should have rejected invalid phone'
    );
  }

  // Test missing required field
  const missingServiceData = new FormData();
  missingServiceData.append('name', 'Test User');
  missingServiceData.append('phone', '4045551234');
  missingServiceData.append('zip', '30301');

  const missingResult = await submitQuickLead(null, missingServiceData);

  if (!missingResult.success && missingResult.errors?.service_type) {
    console.log(
      '✅ Required field validation PASSED - correctly rejected missing service'
    );
  } else {
    console.log(
      '❌ Required field validation FAILED - should have rejected missing service'
    );
  }

  return true;
}

async function testHoneypot() {
  console.log('\n📝 Testing Honeypot Spam Protection...\n');

  const spamData = new FormData();
  spamData.append('service_type', 'hvac_repair');
  spamData.append('name', 'Spam Bot');
  spamData.append('phone', '4045551234');
  spamData.append('zip', '30301');
  spamData.append('website', 'http://spam.com'); // Honeypot field

  const result = await submitQuickLead(null, spamData);

  if (!result.success) {
    console.log('✅ Honeypot PASSED - correctly blocked spam submission');
  } else {
    console.log('❌ Honeypot FAILED - should have blocked spam submission');
  }

  return true;
}

async function runAllTests() {
  console.log('🚀 Starting Lead Capture Forms End-to-End Tests\n');
  console.log('='.repeat(60));

  try {
    const quickLeadPassed = await testQuickLeadForm();
    const fullLeadPassed = await testFullLeadForm();
    await testValidation();
    await testHoneypot();

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Summary:\n');
    console.log(
      `QuickLeadForm: ${quickLeadPassed ? '✅ PASSED' : '❌ FAILED'}`
    );
    console.log(`Full LeadForm: ${fullLeadPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('\n' + '='.repeat(60));

    if (quickLeadPassed && fullLeadPassed) {
      console.log(
        '\n🎉 All critical tests PASSED! Forms are working correctly.\n'
      );
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests FAILED. Please review the errors above.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }
}

runAllTests();
