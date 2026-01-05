# HVAC Lead Generation Platform - Development Plan

## Overview

This document breaks down the development of the HVAC/Plumbing lead generation platform into actionable tasks organized by phase. Each task includes estimated time and dependencies.

---

## Phase 1: Foundation & MVP (Weeks 1-2)

### 1.1 Project Setup

- [x] Initialize Next.js 14 project with TypeScript
- [x] Configure Tailwind CSS with custom theme
- [x] Set up project directory structure
- [x] Create environment configuration template
- [x] Set up Git repository and initial commit
- [x] Configure ESLint and Prettier rules
- [x] Set up Vercel project for deployment

**Estimated Time:** 2-3 hours

### 1.2 Database Setup

- [x] Create Supabase project
- [x] Run initial migration SQL script
- [x] Verify tables, enums, and indexes created correctly
- [x] Test RLS policies with test queries
- [x] Set up database backups (Supabase handles automatically)
- [x] Document database access credentials securely

**Estimated Time:** 1-2 hours

### 1.3 Lead Capture Forms

- [x] Build QuickLeadForm component (minimal fields)
- [x] Build full LeadForm component (multi-step)
- [x] Create Zod validation schemas
- [x] Implement server action for lead submission
- [x] Add client-side phone number formatting
- [x] Add address autocomplete (Google Places API) - optional, works without API key
- [x] Implement form analytics tracking (PostHog/Mixpanel) - optional, works without provider
- [x] Add honeypot field for spam prevention
- [x] Test form submissions end-to-end

**Estimated Time:** 4-6 hours

### 1.4 SEO Landing Pages

- [x] Create dynamic [city]/[service] route
- [x] Implement generateStaticParams for all city/service combos
- [x] Add JSON-LD structured data
- [x] Configure metadata generation
- [x] Create XML sitemap generator
- [x] Set up robots.txt
- [x] Add canonical URLs
- [x] Implement breadcrumb navigation
- [x] Create city index page (/locations)
- [x] Create service index pages (/services/hvac, /services/plumbing)
- [x] Add internal linking between related pages

**Estimated Time:** 4-5 hours

### 1.5 Homepage & Marketing

- [x] Build homepage hero section
- [x] Create trust badges and social proof elements
- [x] Add "How It Works" section
- [x] Build city/service quick links
- [x] Create footer with navigation
- [x] Add testimonials section (can use placeholder content initially)
- [x] Create FAQ section with schema markup
- [x] Add exit-intent popup for lead capture
- [x] Implement sticky mobile CTA

**Estimated Time:** 3-4 hours

---

## Phase 2: Notifications & Lead Routing (Weeks 3-4)

### 2.1 Email Notifications

- [x] Set up Mailchimp Transactional (Mandrill) account
- [x] Create email templates:
  - [x] New lead confirmation (to homeowner)
  - [x] New lead alert (to contractor)
  - [x] Lead accepted notification (to homeowner)
- [x] Implement email sending utility function
- [x] Add email to lead submission flow
- [x] Set up email tracking (opens, clicks) - Mailchimp handles automatically
- [ ] Handle email bounces and failures - Future enhancement

**Estimated Time:** 4-5 hours

### 2.2 SMS Notifications (Twilio)

- [ ] Set up Twilio account and phone number
- [ ] Create Twilio utility functions
- [ ] Implement SMS templates:
  - [ ] New lead alert to contractor
  - [ ] Lead confirmation to homeowner
- [ ] Add SMS to lead submission flow
- [ ] Implement opt-out handling (STOP keyword)
- [ ] Set up SMS delivery status webhooks
- [ ] Add rate limiting for SMS sends

**Estimated Time:** 4-5 hours

### 2.3 Lead Routing Logic

- [x] Implement contractor matching algorithm:
  - [x] Match by service type
  - [x] Match by ZIP code coverage
  - [ ] Check contractor daily/monthly lead limits (deferred)
  - [x] Check contractor active status
- [x] Create lead distribution function:
  - [x] Exclusive lead logic (single contractor)
  - [x] Shared lead logic (broadcast to multiple contractors)
  - [x] Database function handles matching logic
- [x] Add lead_deliveries record creation
- [x] Pricing based on service_type + urgency from database
- [ ] Implement retry logic for failed notifications
- [ ] Create lead routing dashboard/logs for debugging

**Estimated Time:** 6-8 hours
**Status:** ✅ Complete (basic routing implemented)

### 2.4 Phone Verification (Optional but Recommended)

- [ ] Implement Twilio Verify or similar service
- [ ] Add verification step to lead form
- [ ] Update lead status after verification
- [ ] Track verification rates
- [ ] A/B test verified vs unverified conversion

**Estimated Time:** 3-4 hours

---

## Phase 3: Contractor Portal (Weeks 5-7)

### 3.1 Authentication

- [x] Create contractor signup page
- [x] Implement Supabase Auth signup flow
- [x] Create contractor login page
- [x] Implement password reset flow
- [x] Add email verification requirement
- [x] Create auth middleware for protected routes
- [x] Build auth context/hook for client components

**Estimated Time:** 4-5 hours
**Status:** ✅ Complete

### 3.2 Contractor Onboarding

- [x] Build multi-step onboarding form:
  - [x] Step 1: Pricing tier selection (Starter/Pro/Elite with comparison)
  - [x] Step 2: Notification preferences
  - [x] Step 3: Payment method (if Pro/Elite tier selected) - Placeholder for Phase 4
  - [x] Step 4: Review and confirm
- [x] Create contractor profile updates in database
- [x] Service area collected during signup (ZIP codes)
- [x] License number collected during signup
- [x] Set initial status to 'active' (from signup)
- [x] Display tier benefits and pricing clearly
- [x] Show refund policy during onboarding

**Estimated Time:** 8-10 hours
**Status:** ✅ Complete

### 3.3 Lead Inbox

- [x] Create leads dashboard page
- [x] Build lead list component with filtering:
  - [x] Filter by status (new, viewed, accepted, rejected)
  - [x] Filter by service type
  - [x] Filter by date range
- [x] Create lead detail modal/page:
  - [x] Show customer contact info
  - [x] Show service details
  - [x] Show urgency level
  - [x] Show lead price
- [x] Implement real-time updates (Supabase Realtime)
- [x] Add lead count badges and notifications
- [x] Build mobile-responsive inbox view

**Estimated Time:** 8-10 hours
**Status:** ✅ Complete

### 3.4 Lead Actions

- [x] Implement "Accept Lead" action:
  - [x] Update lead_delivery status
  - [x] Trigger billing (if applicable)
  - [x] Send confirmation to homeowner
  - [x] Revert if billing fails
- [x] Implement "Reject Lead" action:
  - [x] Update lead_delivery status
  - [x] Collect rejection reason via modal
  - [ ] Re-route to another contractor (if shared) - Future enhancement
- [x] Implement "Mark as Contacted" action
- [x] Implement "Report Bad Lead" action:
  - [x] Collect feedback via modal
  - [x] Flag for review
  - [x] Potential credit process (admin review)
- [x] Add lead quality rating (1-5 stars)
- [x] Obscure contact info until lead accepted
- [x] Show discounted prices based on tier

**Estimated Time:** 5-6 hours
**Status:** ✅ Complete

### 3.5 Contractor Settings

- [x] Build settings page with sections:
  - [x] Profile information
  - [x] Service areas (add/remove ZIPs)
  - [x] Services offered (add/remove)
  - [x] Lead preferences (max per day/month)
  - [x] Notification settings (email/SMS toggles)
  - [x] Pause/resume lead delivery
- [x] Implement settings update server actions
- [x] Add confirmation for destructive changes

**Estimated Time:** 4-5 hours
**Status:** ✅ Complete

---

## Phase 4: Billing & Payments (Weeks 8-9)

### 4.1 Stripe Setup

- [x] Create Stripe account and get API keys
- [x] Install Stripe SDK
- [x] Create Stripe utility functions
- [x] Set up webhook endpoint
- [x] Configure webhook signature verification
- [x] Test with Stripe CLI locally

**Estimated Time:** 2-3 hours
**Status:** ✅ Complete

### 4.2 Contractor Pricing Tiers

- [x] Implement three-tier system:
  - [x] **Tier 1: Starter** - Pay-per-lead only, no monthly fee
  - [x] **Tier 2: Pro** - Monthly subscription + 20% lead discount
  - [x] **Tier 3: Elite** - Monthly subscription + 30% lead discount
- [x] Add tier selection during contractor onboarding
- [x] Implement tier-based lead pricing discounts (20% Pro, 30% Elite)
- [x] Display discounted prices in lead inbox
- [x] Create Stripe subscription products for Pro/Elite tiers
- [ ] Create tier upgrade/downgrade flow in settings - Future enhancement
- [ ] Add tier benefits to contractor dashboard (priority routing, quality scores) - Future
- [ ] Handle tier change proration - Future

**Estimated Time:** 6-8 hours
**Status:** ✅ Core Complete (Tier selection + discounts working)

### 4.3 Contractor Billing Setup

- [x] Store Stripe customer ID and tier in contractors table
- [x] Basic Stripe customer creation infrastructure
- [ ] Build payment method management UI:
  - [ ] Add card via Stripe Elements
  - [ ] List saved payment methods
  - [ ] Set default payment method
  - [ ] Remove payment method
- [ ] Handle payment method failures gracefully
- [ ] Implement prepaid credit system for Starter tier

**Estimated Time:** 5-6 hours
**Status:** ⚠️ Partially Complete (Database ready, UI pending)

### 4.4 Lead Billing

- [x] Implement pay-per-lead billing:
  - [x] Create invoice item when lead accepted
  - [x] Calculate price from delivery.price (populated from lead_prices)
  - [x] Apply tier-based discounts (20% Pro, 30% Elite)
  - [x] Create and pay invoice immediately for per_lead billing
  - [x] Skip charging for monthly subscription (covered by subscription)
- [x] Create billing record in lead_deliveries (billed, billed_at, stripe_invoice_id)
- [x] Set up automatic payment collection (charge_automatically)
- [x] Revert lead acceptance if billing fails
- [ ] Implement invoice generation (batched weekly/monthly)
- [ ] Deduct from prepaid credits (Starter tier)
- [ ] Handle failed payments:
  - [ ] Retry logic (3 attempts over 7 days)
  - [ ] Pause lead delivery after failure
  - [ ] Send payment failure notifications
  - [ ] Downgrade tier if subscription payment fails

**Estimated Time:** 6-8 hours
**Status:** ✅ Core Complete (Immediate charging works)

### 4.5 Refund & Credit Management

- [x] Build refund request UI:
  - [x] "Report Bad Lead" modal on lead card
  - [x] Reason dropdown with predefined options
  - [x] Collect detailed feedback
- [x] Implement Stripe refund processing (admin function)
  - [x] Process refund via Stripe API
  - [x] Update lead_deliveries record
  - [x] Track refund reason in feedback
- [ ] Implement automated refund system:
  - [ ] Auto-approve for invalid contact info (verify via system logs)
  - [ ] Auto-approve for wrong service area (geographic check)
  - [ ] Auto-approve for incorrect service type (data mismatch)
  - [ ] Auto-approve for duplicate leads within 7 days
  - [ ] Auto-deny for non-refundable scenarios (show reason)
- [ ] Create admin refund management UI:
  - [ ] Manual review queue for requests
  - [ ] Approve/deny with notes
  - [ ] Track refund rate by contractor
  - [ ] Flag abuse patterns (>10% refund requests)
- [ ] Issue refunds as account credits (vs Stripe refund)
- [ ] Add credit balance display to contractor dashboard
- [ ] Apply credits automatically to future lead purchases

**Estimated Time:** 8-10 hours
**Status:** ⚠️ Partially Complete (Backend ready, admin UI pending)

### 4.6 Billing Dashboard

- [ ] Create billing overview page:
  - [ ] Current tier and benefits
  - [ ] Current balance (credits - pending charges)
  - [ ] Next billing date and amount
  - [ ] Recent charges
  - [ ] Payment history
  - [ ] Available credits from refunds
- [ ] Build invoice list with download links
- [ ] Add spending analytics:
  - [ ] Leads purchased this month
  - [ ] Spend by service type
  - [ ] Cost per lead trends
  - [ ] ROI calculator (if conversion data available)
- [ ] Implement credit/refund history display
- [ ] Add billing alert thresholds
- [ ] Show tier comparison and upgrade prompts

**Estimated Time:** 6-8 hours
**Status:** ⏳ Pending (Backend ready, frontend UI needed)

---

## Phase 5: Admin Dashboard (Weeks 10-11)

### 5.1 Admin Authentication

- [ ] Create admin role in Supabase
- [ ] Build admin login page
- [ ] Implement admin-only middleware
- [ ] Set up admin user accounts

**Estimated Time:** 2-3 hours

### 5.2 Lead Management

- [ ] Create admin leads dashboard:
  - [ ] List all leads with search/filter
  - [ ] View lead details
  - [ ] Edit lead information
  - [ ] Manually assign leads to contractors
- [ ] Build lead quality review queue
- [ ] Implement lead status management
- [ ] Add lead export (CSV)
- [ ] Create lead analytics:
  - [ ] Leads by source
  - [ ] Leads by city/service
  - [ ] Conversion rates

**Estimated Time:** 6-8 hours

### 5.3 Contractor Management

- [ ] Create contractor list view:
  - [ ] Search and filter
  - [ ] Status indicators
  - [ ] Quick actions
- [ ] Build contractor detail page:
  - [ ] Profile information
  - [ ] Lead history
  - [ ] Billing summary
  - [ ] Performance metrics
- [ ] Implement contractor approval workflow
- [ ] Add contractor status management (activate/pause/deactivate)
- [ ] Create contractor notes system
- [ ] Build contractor export (CSV)

**Estimated Time:** 6-8 hours

### 5.4 Revenue Analytics

- [ ] Create revenue dashboard:
  - [ ] Total revenue (daily/weekly/monthly)
  - [ ] Revenue by service type
  - [ ] Revenue by city
  - [ ] Revenue by contractor tier (Starter/Pro/Elite)
  - [ ] Average lead price by tier
  - [ ] MRR (Monthly Recurring Revenue) from subscriptions
- [ ] Build financial reports:
  - [ ] Accounts receivable
  - [ ] Payment success rates
  - [ ] Refund/credit tracking and rate
  - [ ] Refund reasons breakdown
  - [ ] Contractors by refund rate (flag >10%)
- [ ] Add revenue forecasting (basic)
- [ ] Create exportable reports
- [ ] Track tier conversion rates (Starter → Pro → Elite)

**Estimated Time:** 6-8 hours

### 5.5 System Configuration

- [ ] Build pricing management:
  - [ ] View/edit lead prices by service/urgency
  - [ ] Set city-specific pricing
  - [ ] Manage pricing tiers
- [ ] Create service area management:
  - [ ] Add/edit/disable cities
  - [ ] Manage SEO content per city
- [ ] Add system settings:
  - [ ] Lead routing rules
  - [ ] Notification templates
  - [ ] Feature flags

**Estimated Time:** 4-5 hours

---

## Phase 6: Growth & Optimization (Weeks 12+)

### 6.1 SEO Optimization

- [ ] Implement content strategy:
  - [ ] Create blog section
  - [ ] Write city-specific content
  - [ ] Add service guides
- [ ] Set up Google Search Console
- [ ] Monitor and fix crawl errors
- [ ] Implement page speed optimizations:
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Caching headers
- [ ] Build internal linking strategy
- [ ] Add review schema markup

**Estimated Time:** Ongoing

### 6.2 PPC Landing Pages

- [ ] Create dedicated PPC landing page template
- [ ] Build variant system for A/B testing
- [ ] Implement conversion tracking:
  - [ ] Google Ads conversion
  - [ ] Facebook Pixel
  - [ ] UTM parameter tracking
- [ ] Create campaign-specific pages
- [ ] Set up landing page analytics

**Estimated Time:** 4-5 hours

### 6.3 A/B Testing Framework

- [ ] Choose A/B testing tool (PostHog/Optimizely/custom)
- [ ] Implement experiment wrapper component
- [ ] Create test variations for:
  - [ ] Form layouts
  - [ ] CTA copy
  - [ ] Trust badges
  - [ ] Page layouts
- [ ] Set up conversion tracking
- [ ] Build results dashboard

**Estimated Time:** 5-6 hours

### 6.4 Lead Quality Scoring

- [ ] Define quality scoring criteria:
  - [ ] Phone verification status
  - [ ] Email provided
  - [ ] Description completeness
  - [ ] Time of submission
  - [ ] Source quality
- [ ] Implement scoring algorithm
- [ ] Add score to lead display
- [ ] Use score for routing priority
- [ ] Track score vs conversion correlation

**Estimated Time:** 4-5 hours

### 6.5 Contractor Reviews & Ratings

- [ ] Create review request flow:
  - [ ] Send review request after service
  - [ ] Build review submission form
- [ ] Implement review display:
  - [ ] Contractor profile page
  - [ ] Review aggregation
- [ ] Add review moderation
- [ ] Display reviews on landing pages
- [ ] Implement review schema markup

**Estimated Time:** 6-8 hours

### 6.6 Referral Program

- [ ] Design referral program:
  - [ ] Contractor-to-contractor referrals
  - [ ] Customer referrals
- [ ] Build referral tracking system
- [ ] Create referral dashboard
- [ ] Implement reward/credit system
- [ ] Add referral analytics

**Estimated Time:** 5-6 hours

---

## Technical Debt & Maintenance

### Ongoing Tasks

- [ ] Write unit tests for critical functions
- [ ] Add integration tests for forms
- [ ] Set up error monitoring (Sentry)
- [ ] Implement logging system
- [ ] Create runbooks for common issues
- [ ] Document API endpoints
- [ ] Regular dependency updates
- [ ] Database query optimization
- [ ] Security audits

### Performance Monitoring

- [ ] Set up uptime monitoring
- [ ] Implement performance tracking (Web Vitals)
- [ ] Create alerting for errors/downtime
- [ ] Monitor database performance
- [ ] Track API response times

---

## Task Priority Matrix

### Must Have (Launch Blockers)

1. Database setup and migrations
2. Lead capture forms working end-to-end
3. Basic email notifications
4. At least 5 city/service landing pages live
5. Manual lead delivery process documented

### Should Have (Week 1-4)

1. SMS notifications
2. Automated lead routing
3. Contractor signup flow
4. Basic contractor portal

### Nice to Have (Month 2+)

1. Stripe billing automation
2. Admin dashboard
3. A/B testing
4. Review system

---

## Milestone Checklist

### Milestone 1: Soft Launch (Week 2)

- [ ] Forms capturing leads to database
- [ ] Email notifications working
- [ ] 10+ landing pages indexed
- [ ] Manual contractor outreach started

### Milestone 2: Contractor Beta (Week 4)

- [ ] 3+ contractors signed up
- [ ] Lead routing automated
- [ ] SMS notifications live
- [ ] Basic contractor portal functional

### Milestone 3: Revenue (Week 6)

- [ ] First paid lead delivered
- [ ] Billing system functional
- [ ] 10+ active contractors
- [ ] 50+ leads/month

### Milestone 4: Scale (Week 10)

- [ ] Admin dashboard complete
- [ ] 25+ contractors
- [ ] 200+ leads/month
- [ ] Expand to 2nd Georgia metro

### Milestone 5: Growth (Week 16)

- [ ] PPC campaigns running
- [ ] A/B testing active
- [ ] Review system live
- [ ] Consider expansion beyond Georgia

---

## Resource Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [SendGrid API](https://docs.sendgrid.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

---

---

## Recent Completion Summary (January 2026)

### Authentication & Email Verification ✅
- Implemented email confirmation flow with Supabase Auth
- Created `/auth/callback` route handler for verification codes
- Added proper session cookie handling for server-side auth
- Fixed email confirmation link routing (now uses correct domain)
- Added 30-second timeout for slow first contractor queries

### Lead Inbox Enhancements ✅
- Contact information obscuring for non-accepted leads
  - Phone: (•••) •••-1234 (last 4 digits only)
  - Email: c•••@example.com (first letter + domain)
  - Address: 123 •••••••••• (street number only)
- Tier-based pricing display
  - Shows original + discounted price for Pro/Elite
  - Green highlighting of savings
  - Discount percentage badge

### Billing System Core ✅
- Integrated Stripe SDK and webhooks
- Lead charging on acceptance (immediate invoicing)
- Tier-based discount calculation (20% Pro, 30% Elite)
- Refund processing (admin function)
- Billing failure → lead acceptance reversion
- All billing metadata tracked in lead_deliveries

### Next Priority Items
1. **Payment Method Management UI** - Allow contractors to add/update cards
2. **Billing Dashboard** - Show charges, invoices, credits
3. **Admin Refund Queue** - UI for reviewing bad lead reports
4. **Subscription Management** - Create/cancel Pro/Elite subscriptions
5. **Failed Payment Handling** - Retry logic and notifications

_Last Updated: January 5, 2026_
