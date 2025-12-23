/**
 * Test Email Sending
 *
 * This script tests the email notification system by sending test emails.
 *
 * Usage:
 *   npx tsx scripts/test-email.ts
 *
 * Prerequisites:
 *   - Set MAILCHIMP_API_KEY in .env.local
 *   - Set MAILCHIMP_FROM_EMAIL in .env.local
 *   - Set MAILCHIMP_FROM_NAME in .env.local
 */

import { config } from 'dotenv';
import {
  sendLeadConfirmationEmail,
  sendContractorAlertEmail,
  sendLeadAcceptedEmail,
} from '../src/lib/email/send';

// Load environment variables
config({ path: '.env.local' });

async function testLeadConfirmationEmail() {
  console.log('\n📧 Testing Lead Confirmation Email...');

  const result = await sendLeadConfirmationEmail({
    to: process.env.TEST_EMAIL || 'test@example.com',
    firstName: 'John',
    lastName: 'Smith',
    serviceType: 'ac_repair',
    city: 'Atlanta',
    state: 'GA',
    urgency: 'emergency',
  });

  if (result.success) {
    console.log('✅ Lead confirmation email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
  } else {
    console.error('❌ Failed to send lead confirmation email');
    console.error(`   Error: ${result.error}`);
  }

  return result.success;
}

async function testContractorAlertEmail() {
  console.log('\n📧 Testing Contractor Alert Email...');

  const result = await sendContractorAlertEmail({
    to: process.env.TEST_EMAIL || 'test@example.com',
    contractorName: 'ABC HVAC Services',
    leadId: 'test-lead-123',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '4045551234',
    email: 'jane.doe@example.com',
    serviceType: 'hvac_installation',
    urgency: 'this_week',
    address: '123 Main St',
    city: 'Marietta',
    state: 'GA',
    zip: '30060',
    description:
      'Need to replace old HVAC system in 2-story home. Current system is 15 years old and not cooling properly.',
  });

  if (result.success) {
    console.log('✅ Contractor alert email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
  } else {
    console.error('❌ Failed to send contractor alert email');
    console.error(`   Error: ${result.error}`);
  }

  return result.success;
}

async function testLeadAcceptedEmail() {
  console.log('\n📧 Testing Lead Accepted Email...');

  const result = await sendLeadAcceptedEmail({
    to: process.env.TEST_EMAIL || 'test@example.com',
    homeownerName: 'Bob Johnson',
    contractorName: 'XYZ Plumbing',
    contractorPhone: '7705559876',
    contractorEmail: 'contact@xyzplumbing.com',
    serviceType: 'emergency_plumbing',
  });

  if (result.success) {
    console.log('✅ Lead accepted email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
  } else {
    console.error('❌ Failed to send lead accepted email');
    console.error(`   Error: ${result.error}`);
  }

  return result.success;
}

async function runTests() {
  console.log('🚀 Email Notification Test Suite');
  console.log('=================================');

  // Check environment variables
  if (!process.env.MAILCHIMP_API_KEY) {
    console.error(
      '\n❌ MAILCHIMP_API_KEY not found in environment variables'
    );
    console.error('   Please set it in .env.local');
    process.exit(1);
  }

  if (!process.env.MAILCHIMP_FROM_EMAIL) {
    console.error(
      '\n❌ MAILCHIMP_FROM_EMAIL not found in environment variables'
    );
    console.error('   Please set it in .env.local');
    process.exit(1);
  }

  console.log(`\n📬 Sending test emails to: ${process.env.TEST_EMAIL || 'test@example.com'}`);
  console.log('   (Set TEST_EMAIL in .env.local to use a different address)');

  const results = {
    leadConfirmation: false,
    contractorAlert: false,
    leadAccepted: false,
  };

  // Run all tests
  try {
    results.leadConfirmation = await testLeadConfirmationEmail();
    results.contractorAlert = await testContractorAlertEmail();
    results.leadAccepted = await testLeadAcceptedEmail();
  } catch (error) {
    console.error('\n❌ Unexpected error during testing:', error);
    process.exit(1);
  }

  // Summary
  console.log('\n=================================');
  console.log('📊 Test Results Summary:');
  console.log('=================================');
  console.log(
    `Lead Confirmation: ${results.leadConfirmation ? '✅ PASSED' : '❌ FAILED'}`
  );
  console.log(
    `Contractor Alert:  ${results.contractorAlert ? '✅ PASSED' : '❌ FAILED'}`
  );
  console.log(
    `Lead Accepted:     ${results.leadAccepted ? '✅ PASSED' : '❌ FAILED'}`
  );

  const allPassed =
    results.leadConfirmation &&
    results.contractorAlert &&
    results.leadAccepted;

  if (allPassed) {
    console.log('\n🎉 All email tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some email tests failed. Please check the logs above.');
    process.exit(1);
  }
}

runTests();
