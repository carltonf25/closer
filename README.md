# HVAC & Plumbing Lead Generation Platform

A Next.js 14 + Supabase application for generating and selling home service leads in Georgia.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Validation**: Zod
- **Deployment**: Vercel (recommended)

## Features

### Consumer-Facing (Lead Capture)

- SEO-optimized landing pages for city/service combinations
- Multi-step lead capture forms
- Mobile-responsive design
- Trust signals and social proof

### Contractor Portal (Coming Soon)

- Lead inbox with real-time notifications
- Lead accept/reject workflow
- Billing dashboard
- Service area management

### Admin Dashboard (Coming Soon)

- Lead management
- Contractor management
- Revenue analytics
- Lead quality scoring

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages
│   │   └── [city]/[service]/ # Dynamic SEO landing pages
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── contractor/     # Contractor portal
│   │   └── admin/          # Admin dashboard
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── forms/              # Lead capture forms
│   ├── ui/                 # Reusable UI components
│   └── marketing/          # Marketing page components
├── lib/
│   ├── supabase/           # Supabase client utilities
│   ├── database.types.ts   # TypeScript types for DB
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Helper functions
├── actions/                # Server actions
├── config/                 # App configuration
│   └── services.ts         # Service & city definitions
└── types/                  # Additional TypeScript types

supabase/
└── migrations/             # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <your-repo>
cd hvac-leads
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run in SQL Editor
3. Get your API keys from Settings > API

### 3. Install Supabase CLI (Optional)

The Supabase CLI is only needed if you want to generate TypeScript types from your database schema.

```bash
npm install -g supabase
```

Then you can run:

```bash
npm run db:types  # Generates src/lib/database.types.ts
```

**Note**: The CLI is not included in package.json to avoid installation issues on Vercel. The pre-generated types are already committed to the repo.

### 4. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key URLs

- `/` - Homepage with quick lead form
- `/atlanta/hvac-repair` - Example city/service landing page
- `/marietta/emergency-plumber` - Another example
- `/contractor/signup` - Contractor registration (to be built)
- `/contractor/login` - Contractor login (to be built)

## Database Schema

### Core Tables

| Table             | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `leads`           | Captured lead data from forms                |
| `contractors`     | Service provider profiles                    |
| `lead_deliveries` | Tracks which leads sent to which contractors |
| `service_areas`   | SEO landing page configuration               |
| `lead_prices`     | Configurable pricing matrix                  |

### Key Relationships

```
leads (1) --> (many) lead_deliveries
contractors (1) --> (many) lead_deliveries
contractors --> auth.users (1:1)
```

## Adding New Cities

Edit `src/config/services.ts`:

```typescript
export const GEORGIA_CITIES = [
  // Add new city
  {
    city: 'Gainesville',
    state: 'GA',
    slug: 'gainesville',
    metro: 'Atlanta',
    population: 43000,
  },
  // ...existing cities
];
```

Also add to `service_areas` table in Supabase.

## SEO Strategy

Each city/service combination generates a unique landing page:

- URL: `/{city-slug}/{service-slug}`
- Example: `/atlanta/hvac-repair`

Pages are statically generated at build time for fast loading and SEO.

### To add more service variations:

Edit `SERVICE_SLUGS` in `src/config/services.ts` to add URL aliases:

```typescript
export const SERVICE_SLUGS = {
  'ac-repair': 'hvac_repair', // alias
  'air-conditioning-repair': 'hvac_repair', // another alias
  // ...
};
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Next Steps (Roadmap)

### Phase 1: MVP (Current)

- [x] Lead capture forms
- [x] SEO landing pages
- [x] Database schema
- [ ] Basic email notifications

### Phase 2: Contractor Portal

- [ ] Contractor signup/login
- [ ] Lead inbox
- [ ] Accept/reject workflow
- [ ] SMS notifications (Twilio)

### Phase 3: Monetization

- [ ] Stripe integration
- [ ] Pay-per-lead billing
- [ ] Invoice generation
- [ ] Usage dashboard

### Phase 4: Growth

- [ ] PPC landing page variants
- [ ] A/B testing framework
- [ ] Lead quality scoring
- [ ] Contractor reviews

## Support

For questions or issues, contact [your-email].

## License

Private - All rights reserved.
