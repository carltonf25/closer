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
- [X] Set up Git repository and initial commit
- [x] Configure ESLint and Prettier rules
- [ ] Set up Vercel project for deployment

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
- [ ] Add client-side phone number formatting
- [ ] Add address autocomplete (Google Places API)
- [ ] Implement form analytics tracking (PostHog/Mixpanel)
- [ ] Add honeypot field for spam prevention
- [ ] Test form submissions end-to-end

**Estimated Time:** 4-6 hours

### 1.4 SEO Landing Pages
- [x] Create dynamic [city]/[service] route
- [x] Implement generateStaticParams for all city/service combos
- [x] Add JSON-LD structured data
- [x] Configure metadata generation
- [ ] Create XML sitemap generator
- [ ] Set up robots.txt
- [ ] Add canonical URLs
- [ ] Implement breadcrumb navigation
- [ ] Create city index page (/locations)
- [ ] Create service index pages (/services/hvac, /services/plumbing)
- [ ] Add internal linking between related pages

**Estimated Time:** 4-5 hours

### 1.5 Homepage & Marketing
- [x] Build homepage hero section
- [x] Create trust badges and social proof elements
- [x] Add "How It Works" section
- [x] Build city/service quick links
- [x] Create footer with navigation
- [ ] Add testimonials section (can use placeholder content initially)
- [ ] Create FAQ section with schema markup
- [ ] Add exit-intent popup for lead capture
- [ ] Implement sticky mobile CTA

**Estimated Time:** 3-4 hours

---

## Phase 2: Notifications & Lead Routing (Weeks 3-4)

### 2.1 Email Notifications
- [ ] Set up SendGrid or Resend account
- [ ] Create email templates:
  - [ ] New lead confirmation (to homeowner)
  - [ ] New lead alert (to contractor)
  - [ ] Lead accepted notification (to homeowner)
- [ ] Implement email sending utility function
- [ ] Add email to lead submission flow
- [ ] Set up email tracking (opens, clicks)
- [ ] Handle email bounces and failures

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
- [ ] Implement contractor matching algorithm:
  - [ ] Match by service type
  - [ ] Match by ZIP code coverage
  - [ ] Check contractor daily/monthly lead limits
  - [ ] Check contractor active status
- [ ] Create lead distribution function:
  - [ ] Exclusive lead logic (single contractor)
  - [ ] Shared lead logic (multiple contractors)
  - [ ] Round-robin distribution for fairness
- [ ] Add lead_deliveries record creation
- [ ] Implement retry logic for failed notifications
- [ ] Create lead routing dashboard/logs for debugging

**Estimated Time:** 6-8 hours

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
- [ ] Create contractor signup page
- [ ] Implement Supabase Auth signup flow
- [ ] Create contractor login page
- [ ] Implement password reset flow
- [ ] Add email verification requirement
- [ ] Create auth middleware for protected routes
- [ ] Build auth context/hook for client components

**Estimated Time:** 4-5 hours

### 3.2 Contractor Onboarding
- [ ] Build multi-step onboarding form:
  - [ ] Step 1: Company information
  - [ ] Step 2: Services offered
  - [ ] Step 3: Service area (ZIP codes)
  - [ ] Step 4: License verification
  - [ ] Step 5: Notification preferences
- [ ] Create contractor profile in database
- [ ] Implement ZIP code selector (map or list)
- [ ] Add license number validation (if GA has API)
- [ ] Set initial status to 'pending'

**Estimated Time:** 6-8 hours

### 3.3 Lead Inbox
- [ ] Create leads dashboard page
- [ ] Build lead list component with filtering:
  - [ ] Filter by status (new, viewed, accepted, rejected)
  - [ ] Filter by service type
  - [ ] Filter by date range
- [ ] Create lead detail modal/page:
  - [ ] Show customer contact info
  - [ ] Show service details
  - [ ] Show urgency level
  - [ ] Show lead price
- [ ] Implement real-time updates (Supabase Realtime)
- [ ] Add lead count badges and notifications
- [ ] Build mobile-responsive inbox view

**Estimated Time:** 8-10 hours

### 3.4 Lead Actions
- [ ] Implement "Accept Lead" action:
  - [ ] Update lead_delivery status
  - [ ] Trigger billing (if applicable)
  - [ ] Send confirmation to homeowner
- [ ] Implement "Reject Lead" action:
  - [ ] Update lead_delivery status
  - [ ] Optionally collect rejection reason
  - [ ] Re-route to another contractor (if shared)
- [ ] Implement "Mark as Contacted" action
- [ ] Implement "Report Bad Lead" action:
  - [ ] Collect feedback
  - [ ] Flag for review
  - [ ] Potential credit process
- [ ] Add lead quality rating (1-5 stars)

**Estimated Time:** 5-6 hours

### 3.5 Contractor Settings
- [ ] Build settings page with sections:
  - [ ] Profile information
  - [ ] Service areas (add/remove ZIPs)
  - [ ] Services offered (add/remove)
  - [ ] Lead preferences (max per day/month)
  - [ ] Notification settings (email/SMS toggles)
  - [ ] Pause/resume lead delivery
- [ ] Implement settings update server actions
- [ ] Add confirmation for destructive changes

**Estimated Time:** 4-5 hours

---

## Phase 4: Billing & Payments (Weeks 8-9)

### 4.1 Stripe Setup
- [ ] Create Stripe account and get API keys
- [ ] Install Stripe SDK
- [ ] Create Stripe utility functions
- [ ] Set up webhook endpoint
- [ ] Configure webhook signature verification
- [ ] Test with Stripe CLI locally

**Estimated Time:** 2-3 hours

### 4.2 Contractor Billing Setup
- [ ] Create Stripe Customer for each contractor
- [ ] Build payment method management:
  - [ ] Add card via Stripe Elements
  - [ ] List saved payment methods
  - [ ] Set default payment method
  - [ ] Remove payment method
- [ ] Store Stripe customer ID in contractors table
- [ ] Handle payment method failures

**Estimated Time:** 5-6 hours

### 4.3 Lead Billing
- [ ] Implement pay-per-lead billing:
  - [ ] Create invoice item when lead accepted
  - [ ] Calculate price based on service/urgency/exclusivity
  - [ ] Apply any discounts or credits
- [ ] Create billing record in lead_deliveries
- [ ] Implement invoice generation (weekly/monthly)
- [ ] Set up automatic payment collection
- [ ] Handle failed payments:
  - [ ] Retry logic
  - [ ] Pause lead delivery
  - [ ] Send payment failure notifications

**Estimated Time:** 6-8 hours

### 4.4 Billing Dashboard
- [ ] Create billing overview page:
  - [ ] Current balance
  - [ ] Recent charges
  - [ ] Payment history
- [ ] Build invoice list with download links
- [ ] Add spending analytics:
  - [ ] Leads purchased this month
  - [ ] Spend by service type
  - [ ] Cost per lead trends
- [ ] Implement credit/refund display
- [ ] Add billing alert thresholds

**Estimated Time:** 5-6 hours

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
  - [ ] Average lead price
- [ ] Build financial reports:
  - [ ] Accounts receivable
  - [ ] Payment success rates
  - [ ] Refund/credit tracking
- [ ] Add revenue forecasting (basic)
- [ ] Create exportable reports

**Estimated Time:** 5-6 hours

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

*Last Updated: December 2024*
