# Lead Capture Forms - Manual Testing Guide

## Prerequisites
- ✅ Dev server running at http://localhost:3000
- ✅ Database migration completed (address and city now optional)
- ⚠️  **ACTION NEEDED**: Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` is complete

## Test 1: QuickLeadForm (Homepage)

### URL
http://localhost:3000

### Test Cases

#### ✅ Test 1.1: Valid Submission
1. Select a service (e.g., "AC Repair")
2. Enter name: "John Smith"
3. Enter phone: "(404) 555-1234"
4. Enter ZIP: "30301"
5. Click "Get Free Quotes"

**Expected Result:**
- Green checkmark success message
- "Request Received!" heading
- Lead ID should be created in database

#### ✅ Test 1.2: Phone Validation
1. Select a service
2. Enter name: "Test User"
3. Enter phone: "123" (invalid)
4. Enter ZIP: "30301"
5. Click submit

**Expected Result:**
- Red error message: "Please enter a valid phone number"

#### ✅ Test 1.3: Required Fields
1. Leave service blank
2. Fill in other fields
3. Click submit

**Expected Result:**
- Browser validation should prevent submission
- Or server returns error: "Please select a service"

## Test 2: Full LeadForm (City/Service Page)

### URL
http://localhost:3000/atlanta/hvac-repair

### Test Cases

#### ✅ Test 2.1: Multi-Step Flow
**Step 1:**
1. Click on a service type button (should highlight in blue)
2. Click on urgency option (e.g., "Within this week")
3. Click "Continue →"

**Expected Result:**
- Advances to Step 2 (contact form)

**Step 2:**
1. Enter first name: "Jane"
2. Enter last name: "Doe"
3. Enter phone: "7705551234"
4. Enter email: "jane@example.com"
5. Start typing address: "123 Peachtree" (autocomplete may appear)
6. Complete address or type full address
7. Enter city: "Atlanta" (may be pre-filled)
8. Verify state: "GA" (should be read-only)
9. Enter ZIP: "30303"
10. Optionally add description
11. Click "Get My Free Quotes →"

**Expected Result:**
- Success message appears
- Lead saved to database

#### ✅ Test 2.2: Back Navigation
1. Complete Step 1
2. On Step 2, click "← Back to service selection"

**Expected Result:**
- Returns to Step 1 with previous selections preserved

#### ✅ Test 2.3: Address Autocomplete (if Google API configured)
1. Get to Step 2
2. Click in address field
3. Start typing an address

**Expected Result:**
- If API key configured: Google Places suggestions appear
- If no API key: Regular input field works fine

## Test 3: Verify Database

### Check Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Navigate to Table Editor → `leads` table
3. Verify new leads appear with:
   - ✅ Service type
   - ✅ Phone number
   - ✅ Name (first/last or full)
   - ✅ ZIP code
   - ✅ Address (NULL for quick leads, populated for full form)
   - ✅ City (NULL for quick leads, populated for full form)
   - ✅ Status: 'new'
   - ✅ Created timestamp

## Test 4: Edge Cases

### ✅ Test 4.1: Honeypot (Bot Protection)
- This is automatic - bots that fill hidden fields will be silently rejected
- No manual testing needed, but verify forms submit normally for humans

### ✅ Test 4.2: Phone Formatting
1. Enter phone in different formats:
   - "4045551234"
   - "(404) 555-1234"
   - "404-555-1234"
2. All should be accepted and stored as clean number "4045551234"

### ✅ Test 4.3: Empty Optional Fields
1. In full LeadForm, leave email blank
2. Leave description blank
3. Submit form

**Expected Result:**
- Form should submit successfully
- Optional fields should be NULL in database

## Test 5: Error Handling

### ✅ Test 5.1: Network Error Simulation
1. Stop the dev server
2. Try to submit a form

**Expected Result:**
- Error message should appear
- User should be able to retry

### ✅ Test 5.2: Invalid Email (Full Form)
1. Enter email: "notanemail"
2. Submit form

**Expected Result:**
- Browser validation or error message for invalid email

## Checklist

After completing manual testing, verify:

- [ ] QuickLeadForm submits successfully
- [ ] Full LeadForm multi-step flow works
- [ ] Validation catches invalid inputs
- [ ] Success messages display correctly
- [ ] Leads appear in Supabase database
- [ ] Phone numbers are formatted correctly
- [ ] Address is optional (works with or without)
- [ ] City is optional (works with or without)
- [ ] Error messages are user-friendly
- [ ] Form resets after successful submission

## Known Issues / Notes

- Address autocomplete requires Google Places API key (optional)
- Analytics tracking requires PostHog/Mixpanel configuration (optional)
- Email/SMS notifications are not yet implemented (Phase 2)

## Next Steps After Testing

Once all tests pass:
1. ✅ Mark task complete in DEVELOPMENT_PLAN.md
2. Deploy to Vercel for production testing
3. Begin Phase 2: Email/SMS Notifications
