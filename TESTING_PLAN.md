# Authentication & Account Creation Testing Plan

## Prerequisites

### Environment Setup
- ✅ Supabase project configured
- ✅ Service role key configured
- ✅ Mailchimp Transactional API configured
- ✅ Development server running (`npm run dev`)

### Test Account Preparation
Create test email addresses for different scenarios:
- Primary test: `test-contractor@example.com`
- Duplicate test: `duplicate@example.com`
- Password reset: `reset-test@example.com`

---

## Test Suite 1: Contractor Signup Flow

### Test 1.1: Successful Account Creation
**Objective:** Verify complete signup flow with valid data

**Steps:**
1. Navigate to `/contractor/signup`
2. Fill in the signup form:
   - Company Name: "Test HVAC Services"
   - Contact Name: "John Doe"
   - Email: "test-contractor+[timestamp]@example.com"
   - Phone: "(404) 555-0100"
   - City: "Atlanta"
   - State: "GA"
   - ZIP: "30301"
   - Services: Select at least 1 (e.g., "HVAC Repair")
   - Service ZIPs: "30301"
   - Password: "TestPass123!"
3. Click "Create Account"

**Expected Results:**
- ✅ Success message displayed
- ✅ Message instructs to check email for verification
- ✅ User record created in Supabase Auth
- ✅ Contractor record created in `contractors` table
- ✅ Verification email sent to provided address
- ✅ Contractor status is "active"
- ✅ Default values set: `billing_type=per_lead`, `max_leads_per_day=10`

**Database Verification:**
```sql
-- Check auth user created
SELECT * FROM auth.users WHERE email = 'test-contractor@example.com';

-- Check contractor record
SELECT * FROM contractors WHERE email = 'test-contractor@example.com';

-- Verify relationships
SELECT c.*, u.email_confirmed_at
FROM contractors c
JOIN auth.users u ON c.user_id = u.id
WHERE c.email = 'test-contractor@example.com';
```

---

### Test 1.2: Validation - Missing Required Fields
**Objective:** Verify form validation catches missing data

**Test Cases:**
| Field | Action | Expected Error |
|-------|--------|----------------|
| Company Name | Leave empty | "Company name is required" |
| Contact Name | Leave empty | "Contact name is required" |
| Email | Leave empty | Error on submit |
| Email | Invalid format | "Please enter a valid email" |
| Phone | Less than 10 digits | "Please enter a valid phone number" |
| Services | None selected | "Please select at least one service" |
| Service ZIPs | Empty array | "Please enter at least one ZIP code you serve" |
| Password | Less than 8 chars | "Password must be at least 8 characters" |
| ZIP | Invalid format | "Please enter a valid ZIP code" |

**Steps:**
1. For each test case above, fill form with invalid data
2. Submit the form
3. Verify appropriate error message displays

---

### Test 1.3: Duplicate Email Prevention
**Objective:** Verify system prevents duplicate accounts

**Steps:**
1. Create a contractor account with `duplicate@example.com`
2. Wait for account creation to complete
3. Try to create another account with same email
4. Submit the form

**Expected Results:**
- ✅ Error message: "This email is already registered"
- ✅ Error displayed under email field
- ✅ No duplicate records created in database
- ✅ Original account remains unchanged

---

### Test 1.4: Honeypot Spam Protection
**Objective:** Verify honeypot field blocks spam

**Steps:**
1. Open browser console
2. Navigate to `/contractor/signup`
3. Fill form with valid data
4. Add honeypot field using console:
   ```javascript
   const form = document.querySelector('form');
   const honeypot = document.createElement('input');
   honeypot.name = 'website';
   honeypot.value = 'http://spam.com';
   form.appendChild(honeypot);
   ```
5. Submit the form

**Expected Results:**
- ✅ Form submission rejected
- ✅ Generic error message (not revealing honeypot)
- ✅ No account created

---

### Test 1.5: Phone Number Formatting
**Objective:** Verify phone numbers are normalized

**Test Cases:**
| Input | Expected Storage |
|-------|------------------|
| (404) 555-0100 | 4045550100 |
| 404-555-0100 | 4045550100 |
| 404.555.0100 | 4045550100 |
| +1 404 555 0100 | 14045550100 |

**Steps:**
1. For each format, create an account
2. Check database to verify phone is stored without formatting

**Database Check:**
```sql
SELECT phone FROM contractors WHERE company_name = 'Test [Format]';
```

---

## Test Suite 2: Email Verification Flow

### Test 2.1: Email Verification Link
**Objective:** Verify email confirmation process

**Steps:**
1. Create a new contractor account
2. Check email inbox for verification email
3. Click verification link in email
4. Observe redirect behavior

**Expected Results:**
- ✅ Email received from configured sender
- ✅ Email contains verification link
- ✅ Link redirects to Supabase confirmation endpoint
- ✅ After confirmation, redirected to `/contractor/verify-email`
- ✅ Success message displayed
- ✅ `email_confirmed_at` timestamp set in database

**Email Verification:**
- Check Mailchimp dashboard for sent emails
- Verify email template includes verification link
- Verify sender email matches `MAILCHIMP_FROM_EMAIL`

---

### Test 2.2: Login Before Email Verification
**Objective:** Verify unverified users cannot login

**Steps:**
1. Create new contractor account
2. Do NOT click verification email
3. Navigate to `/contractor/login`
4. Enter credentials
5. Click "Sign In"

**Expected Results:**
- ✅ Login rejected
- ✅ Message: "Please verify your email before logging in"
- ✅ Option to resend verification email displayed

---

### Test 2.3: Resend Verification Email
**Objective:** Verify resend functionality works

**Steps:**
1. Create account (don't verify)
2. Try to login (should fail)
3. Click "Resend verification email" link
4. Check email inbox

**Expected Results:**
- ✅ Success message displayed
- ✅ New verification email sent
- ✅ Email contains fresh verification link
- ✅ Both old and new links work (Supabase behavior)

---

## Test Suite 3: Login Flow

### Test 3.1: Successful Login (Verified Account)
**Objective:** Verify login works for verified contractors

**Steps:**
1. Create and verify a contractor account
2. Navigate to `/contractor/login`
3. Enter email and password
4. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to `/contractor/dashboard`
- ✅ Session cookie set
- ✅ User data accessible in dashboard

---

### Test 3.2: Invalid Credentials
**Objective:** Verify error handling for wrong credentials

**Test Cases:**
| Scenario | Email | Password | Expected Error |
|----------|-------|----------|----------------|
| Wrong password | valid@example.com | wrongpass | "Invalid email or password" |
| Non-existent email | notexist@example.com | anypass | "Invalid email or password" |
| Empty email | (empty) | anypass | "Email and password required" |
| Empty password | valid@example.com | (empty) | "Email and password required" |

---

### Test 3.3: Churned Account Login
**Objective:** Verify churned contractors cannot login

**Setup:**
```sql
-- Set contractor to churned status
UPDATE contractors
SET status = 'churned'
WHERE email = 'churned-test@example.com';
```

**Steps:**
1. Try to login with churned account
2. Observe error message

**Expected Results:**
- ✅ Login rejected
- ✅ Message: "Your account has been deactivated. Please contact support."

---

### Test 3.4: Session Persistence
**Objective:** Verify sessions persist across page refreshes

**Steps:**
1. Login successfully
2. Refresh the page
3. Navigate to different contractor pages
4. Close and reopen browser (if testing cookies)

**Expected Results:**
- ✅ User remains logged in after refresh
- ✅ Can access protected pages without re-login
- ✅ Session persists based on cookie settings

---

## Test Suite 4: Password Reset Flow

### Test 4.1: Request Password Reset
**Objective:** Verify password reset email is sent

**Steps:**
1. Navigate to `/contractor/reset-password`
2. Enter registered email: "reset-test@example.com"
3. Click "Send Reset Link"

**Expected Results:**
- ✅ Success message displayed (regardless of email existence - security)
- ✅ Message: "If an account exists, you will receive a password reset email."
- ✅ Email sent to valid address
- ✅ No email sent to invalid address (but same message shown)

---

### Test 4.2: Use Password Reset Link
**Objective:** Verify password can be reset

**Steps:**
1. Request password reset
2. Check email for reset link
3. Click reset link
4. Enter new password: "NewPassword123!"
5. Submit

**Expected Results:**
- ✅ Link redirects to `/contractor/update-password`
- ✅ Password update form displayed
- ✅ Can enter new password
- ✅ Password updated successfully
- ✅ Redirected to `/contractor/dashboard`
- ✅ Can login with new password

---

### Test 4.3: Reset Link Expiration
**Objective:** Verify reset links expire

**Steps:**
1. Request password reset
2. Wait for link to expire (check Supabase settings for expiration time)
3. Try to use expired link

**Expected Results:**
- ✅ Error message about expired link
- ✅ Option to request new reset link

---

### Test 4.4: Password Requirements
**Objective:** Verify password validation on reset

**Test Cases:**
| Password | Expected Result |
|----------|----------------|
| "short" | "Password must be at least 8 characters" |
| "ValidPass123!" | Success |
| (empty) | Error |

---

## Test Suite 5: Sign Out Flow

### Test 5.1: Sign Out
**Objective:** Verify logout clears session

**Steps:**
1. Login successfully
2. Navigate to dashboard
3. Click sign out (if button exists) or call signOut action
4. Try to access `/contractor/dashboard`

**Expected Results:**
- ✅ Session cleared
- ✅ Redirected to `/contractor/login`
- ✅ Cannot access protected pages
- ✅ Must login again to access dashboard

---

## Test Suite 6: Authorization & Protected Routes

### Test 6.1: Unauthenticated Access
**Objective:** Verify middleware blocks unauthenticated users

**Steps:**
1. Ensure logged out
2. Try to access `/contractor/dashboard` directly

**Expected Results:**
- ✅ Redirected to `/contractor/login`
- ✅ Dashboard not accessible

---

### Test 6.2: Contractor Record Validation
**Objective:** Verify users must have contractor record

**Setup:**
```sql
-- Create auth user without contractor record (edge case)
-- This would be manual DB manipulation for testing
```

**Expected Results:**
- ✅ Login fails with "Account setup incomplete"
- ✅ User cannot access contractor dashboard

---

## Test Suite 7: Data Integrity

### Test 7.1: Transaction Rollback
**Objective:** Verify contractor creation is atomic

**Test Approach:**
This is best tested by temporarily breaking the database:
1. Simulate DB error during contractor record creation
2. Verify auth user is also rolled back

**Expected Results:**
- ✅ If contractor insert fails, auth user is deleted
- ✅ Error message shown to user
- ✅ Can retry signup with same email

---

### Test 7.2: Service and ZIP Validation
**Objective:** Verify arrays are stored correctly

**Steps:**
1. Create account with multiple services: ["hvac_repair", "plumbing_repair"]
2. Add multiple service ZIPs: ["30301", "30302", "30303"]
3. Check database

**Expected Results:**
```sql
SELECT services, service_zips
FROM contractors
WHERE email = 'multi-test@example.com';

-- Should return:
-- services: {hvac_repair,plumbing_repair}
-- service_zips: {30301,30302,30303}
```

---

## Test Suite 8: Edge Cases & Security

### Test 8.1: SQL Injection Attempts
**Objective:** Verify inputs are sanitized

**Test Cases:**
Try these in various fields:
- `admin@test.com'; DROP TABLE contractors; --`
- `<script>alert('xss')</script>`
- `../../etc/passwd`

**Expected Results:**
- ✅ Treated as literal strings
- ✅ No SQL execution
- ✅ No script execution
- ✅ No path traversal

---

### Test 8.2: CORS & API Security
**Objective:** Verify API endpoints are protected

**Steps:**
1. Try to call server actions from external domain
2. Verify CORS policies

**Expected Results:**
- ✅ Only allowed origins can call actions
- ✅ Supabase RLS policies enforced

---

### Test 8.3: Rate Limiting
**Objective:** Check for signup spam protection

**Steps:**
1. Attempt to create 10 accounts in rapid succession
2. Observe behavior

**Note:** Check if Supabase has rate limiting enabled

---

## Test Suite 9: User Experience

### Test 9.1: Form Field Validation Timing
**Objective:** Verify validation provides good UX

**Steps:**
1. Fill out form
2. Tab through fields with errors
3. Observe when errors appear

**Expected Results:**
- ✅ Errors appear on blur or submit (not while typing)
- ✅ Clear, helpful error messages
- ✅ Errors clear when field becomes valid

---

### Test 9.2: Loading States
**Objective:** Verify loading indicators work

**Steps:**
1. Fill out signup form
2. Submit
3. Observe button state during submission

**Expected Results:**
- ✅ Button shows loading spinner
- ✅ Button text changes to "Creating account..."
- ✅ Button disabled during submission
- ✅ Cannot submit multiple times

---

## Automated Testing Setup (Future)

### Recommended Tools
- **Unit Tests:** Vitest or Jest
- **Integration Tests:** Playwright or Cypress
- **API Tests:** Supertest
- **Database Tests:** Supabase JS Client with test environment

### Example Test Structure
```typescript
describe('Contractor Signup', () => {
  it('creates account with valid data', async () => {
    // Test implementation
  });

  it('prevents duplicate emails', async () => {
    // Test implementation
  });

  it('validates required fields', async () => {
    // Test implementation
  });
});
```

---

## Test Data Management

### Clean Up After Testing
```sql
-- Delete test accounts
DELETE FROM contractors WHERE email LIKE '%test%' OR email LIKE '%example.com';

-- Delete auth users
-- Use Supabase dashboard or admin API to delete test auth users

-- Check for orphaned records
SELECT * FROM contractors c
LEFT JOIN auth.users u ON c.user_id = u.id
WHERE u.id IS NULL;
```

---

## Testing Checklist

### Before Starting Tests
- [ ] Development server running
- [ ] Database accessible
- [ ] Email service configured
- [ ] Test email account ready
- [ ] Browser dev tools open

### During Testing
- [ ] Document any bugs found
- [ ] Take screenshots of errors
- [ ] Note unexpected behaviors
- [ ] Check console for errors
- [ ] Verify network requests

### After Testing
- [ ] Clean up test data
- [ ] Document test results
- [ ] Report issues found
- [ ] Update test plan if needed

---

## Known Limitations

1. **Email Delivery:** In development, emails may go to spam or be delayed
2. **Rate Limiting:** Supabase may rate limit signup attempts
3. **Email Uniqueness:** Supabase enforces unique emails at auth level
4. **Session Duration:** Check Supabase settings for session timeout

---

## Quick Test Script

```bash
# Start dev server
npm run dev

# In another terminal, open URLs:
open http://localhost:3000/contractor/signup
open http://localhost:3000/contractor/login
open http://localhost:3000/contractor/reset-password

# Monitor logs
tail -f .next/trace
```

---

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Appropriate error messages displayed
- ✅ Data persisted correctly in database
- ✅ Emails sent successfully
- ✅ Sessions managed properly
- ✅ Security measures working
- ✅ Good user experience maintained
