# Claude Context - HVAC/Plumbing Lead Generation Platform

## Project Overview

This is a Next.js 14 lead generation platform for HVAC and plumbing services in Georgia. The platform connects homeowners with licensed contractors by capturing leads through SEO-optimized landing pages and multi-step forms, then routing them to contractors who pay per lead.

**Business Model**: Lead generation marketplace where:

- Homeowners submit service requests for free
- Contractors pay per lead (either shared or exclusive)
- Platform generates 280+ static SEO landing pages (20 cities × 14 service variations)
- Three-tier contractor pricing: Starter (pay-per-lead), Pro (monthly + discounted leads), Elite (exclusive leads)

**Current Status**: Phase 2 - Lead routing implemented, working on contractor portal and billing.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (for future contractor/admin portals)
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel
- **Future**: Stripe (billing), Twilio (SMS), SendGrid/Resend (email)

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Public pages (no auth required)
│   │   ├── [city]/[service]/ # Dynamic SEO landing pages
│   │   └── layout.tsx        # Marketing layout wrapper
│   ├── layout.tsx            # Root layout with global styles
│   └── page.tsx              # Homepage with hero + quick form
├── actions/
│   └── leads.ts              # Server actions for lead submission
├── components/
│   ├── forms/
│   │   ├── AddressAutocomplete.tsx  # Google Places integration (optional)
│   │   ├── LeadForm.tsx             # Multi-step lead capture form
│   │   └── QuickLeadForm.tsx        # Minimal 3-field form
│   └── ui/
│       └── ScrollToTopButton.tsx    # Client component for scroll behavior
├── config/
│   └── services.ts           # City/service configs, pricing matrix
├── lib/
│   ├── supabase/            # Supabase client utilities
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server-side client
│   │   ├── middleware.ts    # Auth middleware helper
│   │   └── index.ts         # Exports
│   ├── database.types.ts    # Auto-generated from Supabase
│   ├── validations.ts       # Zod schemas for forms
│   ├── analytics.ts         # PostHog/Mixpanel wrapper (optional)
│   ├── utils.ts             # cn() helper for Tailwind
│   └── hooks/
│       └── usePhoneFormat.ts # Phone number formatting hook
└── types/
    └── google-maps.d.ts     # TypeScript declarations for Google Places

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema with RLS policies
```

## Database Schema

### Tables

**leads** - Captured lead data

- Primary fields: service_type, urgency, phone, email, description
- Address fields: city, state, zip_code, full_address
- Metadata: source, utm tracking, ip_address, user_agent
- Status tracking: status enum, submitted_at

**contractors** - Service provider profiles

- Profile: company_name, contact info, license_number
- Settings: is_active, max_daily/monthly leads, service types
- Auth: Links to auth.users via user_id

**lead_deliveries** - Junction table tracking lead routing

- Relationships: lead_id → leads, contractor_id → contractors
- Pricing: lead_price, is_exclusive
- Status: delivered_at, viewed_at, accepted/rejected_at
- Billing: billing_status, stripe_charge_id

**service_areas** - Defines contractor coverage and SEO landing pages

- Geography: city, state, zip_codes array
- Services: available_service_types array
- SEO: is_active, priority ranking

**lead_prices** - Dynamic pricing matrix

- Keys: service_type, urgency, is_exclusive
- Pricing: base_price, multiplier
- Geography: Optional city/state overrides

### Key Enums

```typescript
ServiceType: 'hvac_repair' |
  'hvac_install' |
  'hvac_maintenance' |
  'plumbing_emergency' |
  'plumbing_repair' |
  'plumbing_install' |
  'water_heater';

LeadUrgency: 'emergency' | 'today' | 'this_week' | 'flexible';

LeadStatus: 'new' | 'delivered' | 'contacted' | 'converted' | 'junk';
```

## Configuration Files

### src/config/services.ts

**SERVICES** - Service type definitions

- Maps ServiceType enums to labels, descriptions, SEO titles, categories

**GEORGIA_CITIES** - 20 cities configured

- Metro Atlanta (15): Atlanta, Marietta, Alpharetta, Roswell, Sandy Springs, etc.
- Other metros (5): Savannah, Augusta, Columbus, Macon, Athens

**SERVICE_SLUGS** - URL routing (14 slug variations → 7 service types)

- Example: 'hvac-repair', 'ac-repair', 'heating-repair' → all map to 'hvac_repair'

**BASE_LEAD_PRICES** - Pricing matrix

- Each service has shared and exclusive pricing
- Example: hvac_repair = $25 shared, $60 exclusive

**URGENCY_OPTIONS** - Urgency multipliers

- emergency: 1.5×, today: 1.25×, this_week: 1.0×, flexible: 0.8×

## Key Features & Components

### Lead Forms

**QuickLeadForm** (`src/components/forms/QuickLeadForm.tsx`)

- Minimal 3-field form: phone, service, urgency
- Used on homepage for quick conversions
- Client component with React state

**LeadForm** (`src/components/forms/LeadForm.tsx`)

- Full multi-step form with all fields
- Optional fields: email, address, description, contact preferences
- Pre-fills city/state from URL params
- Includes honeypot field for spam prevention
- Client component with React Hook Form

**AddressAutocomplete** (`src/components/forms/AddressAutocomplete.tsx`)

- Google Places API integration (optional, degrades gracefully)
- Falls back to regular text input if no API key
- Client component

### SEO Landing Pages

**Route**: `/src/app/(marketing)/[city]/[service]/page.tsx`

Generates 280 static pages at build time (20 cities × 14 service slugs):

- `/atlanta/hvac-repair`
- `/marietta/emergency-plumber`
- `/savannah/water-heater`
- etc.

**Features**:

- Server Component (for SEO)
- Dynamic metadata generation
- JSON-LD structured data
- Hero section with trust badges
- LeadForm pre-populated with city/service
- Related services and nearby cities sections
- ScrollToTopButton for CTA

**Static Generation**: Uses `generateStaticParams()` to pre-render all combinations

### Server Actions

**submitLead** (`src/actions/leads.ts`)

- Validates form data with Zod schema
- Creates lead record in Supabase
- Optional: triggers analytics event
- Returns success/error response

## Common Tasks

### Adding a New City

1. Add to `GEORGIA_CITIES` in `src/config/services.ts`:

```typescript
{
  city: 'Gainesville',
  state: 'GA',
  slug: 'gainesville',
  metro: 'Atlanta',
  population: 43000,
}
```

2. Rebuild to generate new static pages: `npm run build`
3. Add to `service_areas` table in Supabase (for contractor routing)

### Adding a New Service Type

1. Add enum value to database migration
2. Update `ServiceType` in `src/lib/database.types.ts`
3. Add to `SERVICES` object in `src/config/services.ts`
4. Add slug mappings to `SERVICE_SLUGS` and `SERVICE_TO_SLUG`
5. Add pricing to `BASE_LEAD_PRICES`

### Adding URL Aliases

Just add to `SERVICE_SLUGS` in `src/config/services.ts`:

```typescript
'air-conditioner-repair': 'hvac_repair',  // New alias
```

### Updating Lead Prices

Edit `BASE_LEAD_PRICES` in `src/config/services.ts`:

```typescript
hvac_repair: { shared: 30, exclusive: 70 },  // Changed from 25/60
```

## Environment Variables

Required in `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyxxx...  # For address autocomplete
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx...            # For analytics
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## ESLint Configuration

**Current Rules**:

- Airbnb base + TypeScript
- Warnings for: function component definitions, unescaped entities, console statements
- These are warnings only and don't block builds

**Common Warnings**:

- `react/function-component-definition` - Airbnb prefers arrow functions
- `react/no-unescaped-entities` - Use `&apos;` instead of `'`
- `@typescript-eslint/no-explicit-any` - Avoid `any` type
- `no-console` - Remove console.log statements

## Build Process

```bash
npm run build  # Generates 280+ static pages
npm run dev    # Development server
npm run lint   # ESLint check
npm run lint:fix  # Auto-fix ESLint issues
```

**Build Output**:

- 284 total pages (280 city/service + homepage + 404 + marketing layout)
- All pre-rendered as static HTML for fast loading
- First Load JS: ~108 KB

## Known Issues & Solutions

### Build Error: "Event handlers cannot be passed to Client Component props"

**Problem**: Server Components can't pass onClick handlers during static generation

**Solution**: Extract interactive elements to separate Client Components

- Example: Created `ScrollToTopButton.tsx` with `'use client'` directive

### Form Submission Not Working

**Check**:

1. Supabase credentials in `.env.local`
2. RLS policies allow INSERT on leads table
3. Network tab shows successful POST to Supabase

### Missing Types

Regenerate from Supabase:

```bash
npm run db:types
```

## Development Workflow

1. **Make changes** to forms, pages, or config
2. **Test locally** with `npm run dev`
3. **Check types** - TypeScript will catch most issues
4. **Run build** - `npm run build` to verify static generation works
5. **Commit** and push to trigger Vercel deployment

## Pricing Strategy

### Contractor Pricing Tiers

The platform uses a three-tier pricing model to accommodate contractors at different business stages:

**Tier 1: Starter (Pay-Per-Lead)**

- No monthly platform fee
- Higher per-lead pricing
- Shared or semi-exclusive leads
- Target: Small contractors, new users testing the platform
- Example pricing: Plumbing repair $35-$55, HVAC repair $45-$75, Replacements $80-$150
- Features: Prepaid lead credits, charged only when accepted, basic filters (service + radius)
- Pros: Low barrier to entry, fast onboarding
- Cons: Lower margins, higher churn risk

**Tier 2: Pro (Recommended Default)**

- $99-$199 monthly platform fee
- 20-30% discount on per-lead pricing
- Target: Growth-focused contractors who want consistency
- Example: $55 Starter lead → ~$38 Pro lead, $120 replacement → ~$85 Pro
- Features: Priority routing, quality score visibility, advanced filters, configurable acceptance rules
- Pros: Predictable recurring revenue, higher LTV, better conversion

**Tier 3: Elite / Exclusive**

- $299-$499 monthly platform fee
- Premium per-lead pricing for exclusive leads
- Exclusive leads by ZIP code, service type, or time window
- Target: High-volume, high-margin contractors
- Example: Emergency HVAC exclusive $110-$160, Replacement exclusive $180-$250+
- Features: Exclusive/24hr protected leads, highest routing priority, guaranteed SLA, optional call-transfer
- Pros: Highest margins, lowest churn, minimal competition

### Dynamic Lead Pricing

Lead prices are calculated using a base price multiplied by quality and demand factors:

**Base Price Factors:**

- Trade (HVAC vs Plumbing)
- Service type (repair, install, maintenance, emergency)
- Market (city or cost index)

**Multipliers Applied:**

- **Urgency (same-day/today)**: 1.3-1.5× (emergency: 1.5×, today: 1.25×, this_week: 1.0×, flexible: 0.8×)
- **Exclusivity**: 1.4-1.6× (exclusive leads cost ~2.4-2.8× shared leads)
- **Replacement scope**: 1.8-2.5× (install jobs vs repairs)
- **Verified SMS response**: 1.1-1.2× (when phone verification implemented)

Contractors are shown a transparent breakdown explaining each lead's price to reduce disputes.

### Pricing Examples (Current)

Based on database seed data:

**HVAC Repair (shared)**: $20 (flexible) → $25 (this_week) → $30 (today) → $35 (emergency)
**HVAC Repair (exclusive)**: $50 (flexible) → $60 (this_week) → $70 (today) → $85 (emergency)

**HVAC Install (shared)**: $35 (flexible) → $45 (this_week) → $50 (today) → $55 (emergency)
**HVAC Install (exclusive)**: $100 (flexible) → $120 (this_week) → $130 (today) → $140 (emergency)

**Plumbing Emergency (shared)**: $25 (flexible) → $30 (this_week) → $38 (today) → $45 (emergency)
**Plumbing Emergency (exclusive)**: $60 (flexible) → $75 (this_week) → $95 (today) → $110 (emergency)

## Refund Strategy

The platform uses an objective, automated refund policy to minimize disputes while maintaining contractor trust.

### Core Philosophy

- Refunds based on **objective, verifiable criteria only**
- Subjective outcomes (booking success, pricing disagreements) are **not refundable**
- Rules are visible to contractors before purchase
- Target refund rate: **< 5% of delivered leads**
- Refunds issued as **credits by default**, not cash

### Auto-Approved Refunds

A refund or credit is issued automatically if the lead meets any condition:

1. **Invalid contact information** - Disconnected or incorrect phone/email (verified by system logs)
2. **Wrong service area** - Lead location outside contractor's selected coverage
3. **Incorrect service category** - E.g., plumbing lead sent to HVAC-only contractor
4. **Duplicate lead** - Same homeowner within 7 days (system detects)

These conditions can be validated by system data without manual review.

### Non-Refundable Scenarios

No refund will be issued for:

- Homeowner did not answer the phone
- Homeowner chose another contractor
- Lead was price shopping or collecting quotes
- Job was not booked
- Contractor followed up late or not at all

These outcomes are considered normal business risk.

### Refund Request Flow

1. Contractor selects "Request Review" on a lead
2. Contractor chooses a reason from predefined dropdown
3. System evaluates eligibility:
   - If criteria match refundable rules → auto-approve
   - If criteria match non-refundable rules → auto-deny with explanation
   - Ambiguous edge cases → manual review queue (should be rare)
4. Approved refunds issued as account credits within 24 hours

### Dispute Prevention

- Refund rules displayed during contractor onboarding
- Refund eligibility shown before lead acceptance
- Each lead includes visible quality score and qualification summary
- Clear expectations reduce support load and contractor frustration

### Enforcement

- Abuse patterns (excessive refund requests) trigger account review
- May result in throttling or account suspension
- All refund decisions logged for transparency

## Future Implementation (Not Yet Built)

### Contractor Portal

- `/contractor/signup` - Registration flow
- `/contractor/login` - Auth
- `/contractor/dashboard` - Lead inbox
- `/contractor/settings` - Service areas, preferences

### Admin Dashboard

- `/admin/leads` - Lead management
- `/admin/contractors` - Contractor approval/management
- `/admin/analytics` - Revenue and conversion tracking

### Integrations

- **Stripe**: Pay-per-lead billing
- **Twilio**: SMS notifications to contractors
- **SendGrid/Resend**: Email notifications
- **PostHog**: Analytics and A/B testing

## Troubleshooting

### "Module not found" errors

```bash
npm install
```

### Build timeouts

- Check for infinite loops in components
- Verify all static params are valid

### Supabase connection errors

- Verify `.env.local` has correct credentials
- Check Supabase project is not paused

### TypeScript errors

- Run `npm run db:types` to regenerate database types
- Check `tsconfig.json` paths are correct

## Resources

- [Original Planning Chat](https://claude.ai/chat/24e63822-c84b-4086-8797-8c3217c753c8)
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Full roadmap with 16 weeks of tasks
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Recent Changes

### 2024-12-22

- Fixed build error: Extracted onClick handlers to `ScrollToTopButton` Client Component
- Build now successfully generates all 284 static pages
- Created this claude.md documentation file
- **Fixed Vercel deployment**: Removed Supabase CLI from package.json to prevent postinstall script failures
  - The CLI is only needed for local development (generating types)
  - Developers should install it globally: `npm install -g supabase`
  - Pre-generated types are committed to the repo
