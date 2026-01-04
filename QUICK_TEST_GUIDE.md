# Quick Auth Testing Guide

## Setup (One-time)
```bash
# Ensure dev server is running
npm run dev

# Open your browser to http://localhost:3000
```

## 5-Minute Smoke Test

### 1. Test Signup ✅
**URL:** http://localhost:3000/contractor/signup

**Test Data:**
```
Company Name: Test HVAC Co
Contact Name: John Smith
Email: test+[timestamp]@yourdomain.com  # Use your real email for verification
Phone: (404) 555-0100
City: Atlanta
State: GA
ZIP: 30301
Services: [Check HVAC Repair]
Service ZIPs: 30301
Password: TestPass123!
```

**Expected:** Success message → Check email

---

### 2. Test Email Verification ✅
**Steps:**
1. Check email inbox
2. Click verification link
3. Should redirect to verify-email page
4. Should show "Email Verified" or redirect to dashboard

---

### 3. Test Login ✅
**URL:** http://localhost:3000/contractor/login

**Credentials:**
- Email: [email from signup]
- Password: TestPass123!

**Expected:** Redirect to dashboard

---

### 4. Test Password Reset ✅
**URL:** http://localhost:3000/contractor/reset-password

**Steps:**
1. Enter your test email
2. Check email for reset link
3. Click link → should open update-password page
4. Enter new password: NewPass456!
5. Should redirect to dashboard
6. Logout and test new password

---

### 5. Test Error Cases ✅

**Duplicate Email:**
- Try signup with same email → should error

**Invalid Login:**
- Wrong password → "Invalid email or password"

**Unverified Login:**
- Create account, don't verify, try login → should block

---

## Database Checks

```sql
-- Check created contractor
SELECT
  c.company_name,
  c.email,
  c.status,
  c.services,
  c.service_zips,
  u.email_confirmed_at
FROM contractors c
JOIN auth.users u ON c.user_id = u.id
WHERE c.email = 'your-test-email@example.com';

-- Should see:
-- - status: 'active'
-- - services: {hvac_repair}
-- - email_confirmed_at: [timestamp after verification]
```

---

## Clean Up Test Data

```sql
-- Delete test contractor (replace with your test email)
DELETE FROM contractors WHERE email LIKE '%test%';

-- Delete from Supabase Auth dashboard:
-- Authentication > Users > find test user > Delete
```

---

## Troubleshooting

### "Account creation failed"
- Check Supabase connection in .env.local
- Check service role key is correct
- Check browser console for errors

### Emails not arriving
- Check Mailchimp dashboard for delivery
- Check spam folder
- Verify MAILCHIMP_API_KEY in .env.local
- Check Mailchimp sender email is verified

### "Invalid submission" error
- Browser may have autofill that triggered honeypot
- Clear form and re-enter manually

### Cannot access dashboard
- Check middleware.ts is not blocking
- Verify session cookie is set (Dev Tools > Application > Cookies)
- Check Supabase session is valid

---

## Testing URLs

- Signup: http://localhost:3000/contractor/signup
- Login: http://localhost:3000/contractor/login
- Dashboard: http://localhost:3000/contractor/dashboard
- Reset Password: http://localhost:3000/contractor/reset-password
- Verify Email: http://localhost:3000/contractor/verify-email
- Update Password: http://localhost:3000/contractor/update-password

---

## Test Results Template

```
Date: ___________
Tester: ___________

[ ] Signup works
[ ] Email verification received
[ ] Email link works
[ ] Login works (verified account)
[ ] Login blocked (unverified account)
[ ] Password reset email sent
[ ] Password reset works
[ ] Duplicate email blocked
[ ] Invalid credentials show error
[ ] Dashboard accessible after login
[ ] Session persists on refresh

Issues Found:
1. ___________
2. ___________
```

---

## Next Steps

Once basic auth is working:
1. Test with multiple contractors
2. Test lead routing to contractors
3. Test contractor dashboard functionality
4. Test with real customer emails
5. Monitor email deliverability rates

See `TESTING_PLAN.md` for comprehensive test cases.
