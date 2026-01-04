# Stripe Billing Testing Guide

## Overview
This guide covers testing the complete Stripe billing integration including payment setup, lead charging, subscriptions, and refunds.

## Setup Requirements
- Stripe test API keys configured in `.env.local`
- Stripe products created (Pro Tier $149/mo, Elite Tier $399/mo)
- Webhook endpoint configured (for production)
- Dev server running: `npm run dev`

---

## Test Cards

```
Success Card:         4242 4242 4242 4242
Declined Card:        4000 0000 0000 0002
Requires Auth:        4000 0025 0000 3155
Insufficient Funds:   4000 0000 0000 9995
```

**For all cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 30301)

---

## Test 1: Pro Tier with Per-Lead Billing

### Steps:

1. **Sign up as a new contractor**
   - Navigate to contractor signup page
   - Complete registration with email/password
   - Verify email if required

2. **Complete Onboarding Flow**
   - **Step 1 - Pricing Tier:** Select **Pro Tier**
   - **Step 2 - Notifications:** Add notification email and phone
   - **Step 3 - Payment Method:**
     - Stripe Elements card form will appear
     - Enter test card: `4242 4242 4242 4242`
     - Fill in expiry, CVC, ZIP
     - Click "Continue"
     - Stripe processes SetupIntent
   - **Step 4 - Review:** Complete onboarding

3. **Verify in Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/test/customers
   - Find new customer with contractor's email
   - Click customer → Payment Methods tab
   - Verify card is saved and set as default

4. **Accept a Lead (Triggers Billing)**
   - Ensure a lead is delivered to this contractor
   - Navigate to leads inbox
   - Click "Accept Lead" button

   **Behind the scenes:**
   - `chargeForLead()` is called
   - Stripe invoice created and charged immediately
   - 25% Pro tier discount applied to base price
   - `lead_deliveries` updated: `billed=true`, `stripe_invoice_id` set

5. **Verify Payment in Stripe**
   - Go to: https://dashboard.stripe.com/test/payments
   - Find the charge (amount = base price × 0.75)
   - Click payment → View details
   - Check metadata contains:
     - `lead_delivery_id`
     - `contractor_id`
     - `billing_type: per_lead`
     - `pricing_tier: pro`
     - `base_price` and `final_price`

6. **Verify Database Updates**
   - Check `lead_deliveries` table in Supabase:
     - `billed = true`
     - `billed_at` has timestamp
     - `stripe_invoice_id` populated
     - `price` shows discounted amount

### Expected Results:
✅ Customer created in Stripe
✅ Payment method saved
✅ Immediate charge on lead acceptance
✅ 25% discount applied
✅ Invoice created
✅ Database updated correctly

---

## Test 2: Pro Tier with Monthly Subscription

### Steps:

1. **New contractor signup** (different email)

2. **Complete Onboarding**
   - **Step 1:** Select **Pro Tier**
   - **Billing Type:** Choose **Monthly** (not per-lead)
   - **Step 2:** Notifications
   - **Step 3:** Add payment method (use `4242 4242 4242 4242`)
   - **Step 4:** Complete

3. **Verify Subscription Created**
   - Go to: https://dashboard.stripe.com/test/subscriptions
   - Find subscription for $149/month
   - Status should be "Active"
   - Check metadata:
     - `contractor_id`
     - `billing_type: monthly`
     - `pricing_tier: pro`

4. **Accept a Lead**
   - Have lead delivered to contractor
   - Click "Accept Lead"

   **Expected behavior:**
   - NO charge to card (covered by subscription)
   - Lead marked as `billed=true`
   - NO `stripe_invoice_id` for the lead

5. **Verify in Database**
   - `contractors` table:
     - `stripe_subscription_id` populated
     - `subscription_status = active`
   - `lead_deliveries` table:
     - `billed = true`
     - `billed_at` has timestamp
     - `stripe_invoice_id = null`

### Expected Results:
✅ Monthly subscription created ($149/mo)
✅ Lead acceptance does NOT charge card
✅ Leads counted but covered by subscription
✅ Subscription appears in Stripe dashboard

---

## Test 3: Elite Tier with Hybrid Billing

### Steps:

1. **New contractor signup**

2. **Onboarding**
   - Select **Elite Tier**
   - Choose **Hybrid** billing type
   - Add payment method

3. **Verify Both Created**
   - Stripe Subscriptions: $399/month subscription exists
   - When accepting leads: Also charged per-lead

4. **Accept a Lead**
   - Lead delivery happens
   - Accept lead
   - **Both charges occur:**
     - Monthly subscription continues ($399)
     - Per-lead charge also applies (no discount for Elite hybrid)

### Expected Results:
✅ $399/month subscription active
✅ Per-lead charges also occur
✅ Both appear in Stripe payments

---

## Test 4: Failed Payment Handling

### Steps:

1. **New contractor signup**

2. **Onboarding with Declined Card**
   - Select Pro Tier, per-lead billing
   - Use declined card: `4000 0000 0000 0002`
   - Try to complete payment step
   - Should fail with clear error message

3. **Or: Decline During Lead Acceptance**
   - Onboard successfully with good card
   - Later, card is declined (simulate by using test mode)
   - Try to accept a lead

   **Expected behavior:**
   - Payment fails
   - Lead acceptance is **reverted**
   - `outcome` returns to `pending`
   - `responded_at` cleared
   - Error shown to contractor: "Payment failed: Your card was declined. Please update your payment method."

4. **Verify in Database**
   - `lead_deliveries`:
     - `billed = false`
     - `outcome = pending`
     - `responded_at = null`

### Expected Results:
✅ Failed payment detected
✅ Lead acceptance rolled back
✅ Clear error message to user
✅ Database remains consistent

---

## Test 5: Webhook Events (Production Only)

**Note:** Webhooks require public URL. Use Stripe CLI for local testing.

### Local Testing Setup:

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Webhook Events to Test:

1. **payment_intent.succeeded**
   - Triggered when payment succeeds
   - Logged in webhook handler

2. **payment_intent.payment_failed**
   - Triggered when payment fails
   - Updates lead_deliveries with failure reason

3. **invoice.payment_failed**
   - Triggered on subscription payment failure
   - After 3 attempts: Contractor paused (`status = paused`)

4. **customer.subscription.created/updated**
   - Subscription becomes active
   - If contractor was paused: Reactivate (`status = active`)

5. **customer.subscription.deleted**
   - Subscription cancelled
   - Contractor downgraded to starter per_lead

### Expected Results:
✅ All events logged in console
✅ Database updates occur correctly
✅ Contractor status changes appropriately

---

## Test 6: Admin Refund Flow

### Steps:

1. **Contractor Reports Bad Lead**
   - Contractor accepts and is charged for a lead
   - Goes to lead in inbox
   - Clicks "Report Bad Lead"
   - Selects reason: "Invalid contact info"
   - Submits report

2. **Admin Reviews Request**
   - Admin navigates to `/admin/refunds`
   - Sees list of bad lead reports
   - Reviews contractor complaint and feedback
   - Click "Approve Refund" button

3. **Verify Refund Processed**
   - Go to: https://dashboard.stripe.com/test/refunds
   - Find the refund for this payment
   - Status should be "Succeeded"

4. **Verify Database Updates**
   - `lead_deliveries` table:
     - `billed = false`
     - `billed_at = null`
     - `feedback` contains refund note

### Expected Results:
✅ Refund appears in Stripe dashboard
✅ Money returned to contractor
✅ Database reflects unbilled status
✅ Admin notes saved

---

## Test 7: Subscription Lifecycle

### Test Monthly Billing Cycle:

1. **Create subscription** (Pro tier monthly)

2. **Simulate billing cycle** in Stripe Dashboard:
   - Go to subscription
   - Click "..." → "Advance billing time"
   - Advance by 1 month
   - New invoice generated and paid

3. **Failed subscription payment:**
   - Update card to declined card in Stripe Dashboard
   - Advance billing time
   - Invoice fails
   - After 3 attempts: Contractor paused

### Expected Results:
✅ Recurring billing works
✅ Failed payments pause contractor
✅ Contractor can't receive new leads when paused

---

## Verification Checklist

### Stripe Dashboard Checks:

**Customers:**
- [ ] New customers created during onboarding
- [ ] Payment methods attached and set as default
- [ ] Customer metadata includes contractor_id, billing_type, pricing_tier

**Subscriptions:**
- [ ] Monthly subscriptions created for Pro/Elite tiers
- [ ] Correct pricing ($149 Pro, $399 Elite)
- [ ] Subscription status is "Active"

**Payments:**
- [ ] Per-lead charges appear when leads accepted
- [ ] Correct amounts (with tier discounts)
- [ ] Payment metadata includes tracking info

**Invoices:**
- [ ] Auto-generated for per-lead charges
- [ ] Status shows "Paid"
- [ ] Line items show lead charge description

**Refunds:**
- [ ] Processed refunds appear
- [ ] Correct amounts refunded

### Database Checks:

**contractors table:**
- [ ] `stripe_customer_id` populated
- [ ] `billing_type` matches selection
- [ ] `pricing_tier` correct
- [ ] `stripe_subscription_id` (if monthly/hybrid)
- [ ] `subscription_status` (if applicable)

**lead_deliveries table:**
- [ ] `billed` true after acceptance
- [ ] `billed_at` timestamp
- [ ] `stripe_invoice_id` (if per-lead charge)
- [ ] `price` correct (with discounts)
- [ ] `payment_failed_at` and `payment_failed_reason` (if failure)

---

## Common Issues & Troubleshooting

### Issue: "Payment method setup not completed"
**Cause:** SetupIntent didn't succeed
**Fix:** Check Stripe test card used, verify publishable key is correct

### Issue: "Payment failed: Your card was declined"
**Cause:** Using declined test card or insufficient funds card
**Fix:** Use success card `4242 4242 4242 4242`

### Issue: "Subscription configuration error"
**Cause:** Price IDs not set in environment variables
**Fix:** Verify `STRIPE_PRICE_PRO_MONTHLY_ID` and `STRIPE_PRICE_ELITE_MONTHLY_ID` are set correctly

### Issue: Webhook not receiving events
**Cause:** Webhook secret mismatch or endpoint not configured
**Fix:**
- Local: Use Stripe CLI `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Production: Verify webhook endpoint URL and signing secret

### Issue: TypeScript compilation errors
**Cause:** Type inference issues with Supabase queries
**Fix:** These are warnings and won't prevent runtime execution

---

## Production Deployment Checklist

Before going live:

- [ ] Switch from test keys to live Stripe keys
- [ ] Create live products and prices in Stripe
- [ ] Configure live webhook endpoint with production URL
- [ ] Test with live Stripe cards in test mode first
- [ ] Set up Stripe billing alerts
- [ ] Configure failed payment email notifications
- [ ] Test subscription cancellation flow
- [ ] Verify refund policy is documented
- [ ] Set up monitoring for failed charges
- [ ] Test all three billing models in production

---

## Support Resources

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Stripe API Docs:** https://stripe.com/docs/api
- **Webhook Testing:** https://stripe.com/docs/webhooks/test
