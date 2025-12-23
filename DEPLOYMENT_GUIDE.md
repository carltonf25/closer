# Deployment Guide - Vercel

## Prerequisites

- [x] Supabase project created and configured
- [x] Database migrations run
- [x] All Phase 1 features completed and tested
- [ ] Production domain ready (or use Vercel subdomain)

## Step 1: Prepare Environment Variables

You'll need these environment variables in Vercel:

### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lrevmqzofiatcjjzdgmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Optional Variables

```bash
# Google Places API (for address autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-api-key

# Analytics (PostHog, Mixpanel, etc.)
NEXT_PUBLIC_POSTHOG_KEY=your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

The CLI will guide you through:
1. Linking to existing project or creating new one
2. Setting up environment variables
3. Deploying

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. Add Environment Variables:
   - Go to Settings → Environment Variables
   - Add all required variables from above
   - Make sure to add them for Production, Preview, and Development

5. Click "Deploy"

## Step 3: Verify Deployment

Once deployed, test these URLs:

### Core Pages
- [ ] Homepage: `https://yourdomain.com`
- [ ] Locations: `https://yourdomain.com/locations`
- [ ] HVAC Services: `https://yourdomain.com/services/hvac`
- [ ] Plumbing Services: `https://yourdomain.com/services/plumbing`
- [ ] Sample City Page: `https://yourdomain.com/atlanta/hvac-repair`

### SEO Files
- [ ] Sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Robots: `https://yourdomain.com/robots.txt`

### Forms
- [ ] QuickLeadForm on homepage
- [ ] Full LeadForm on city/service pages
- [ ] Test submission and verify in Supabase

### Mobile Features
- [ ] Exit-intent popup (try to leave page)
- [ ] Sticky mobile CTA (scroll on mobile)
- [ ] Responsive design

## Step 4: Configure Custom Domain (Optional)

If using a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Step 5: Post-Deployment Checklist

### SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify all 284 pages are indexed
- [ ] Check structured data with Google's Rich Results Test

### Analytics
- [ ] Configure PostHog/Mixpanel (if using)
- [ ] Set up Google Analytics (optional)
- [ ] Test form tracking events

### Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify page load times

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Configure Vercel alerts
- [ ] Monitor error logs

## Step 6: Update Phone Numbers

Replace placeholder phone numbers:
- `(404) 555-1234` → Your actual phone number

Files to update:
- `src/app/page.tsx`
- `src/app/(marketing)/[city]/[service]/page.tsx`
- `src/components/sections/FAQ.tsx`

## Troubleshooting

### Build Fails

**Issue:** Environment variables not found

**Solution:** Make sure all required env vars are set in Vercel dashboard

**Issue:** TypeScript errors

**Solution:** Run `npm run build` locally first to catch errors

### Forms Not Working

**Issue:** "Invalid API key" errors

**Solution:** Verify Supabase keys are correct in Vercel environment variables

**Issue:** CORS errors

**Solution:** Check Supabase project URL is correct

### Sitemap/Robots Not Loading

**Issue:** 404 on /sitemap.xml or /robots.txt

**Solution:** Ensure these files are in `src/app/` directory and properly exported

## Production Readiness Checklist

- [ ] All environment variables configured in Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Database migrations run in production Supabase
- [ ] Phone numbers updated from placeholders
- [ ] Tested all forms end-to-end in production
- [ ] Verified 284 pages are accessible
- [ ] Sitemap submitted to Google
- [ ] Analytics configured
- [ ] Monitoring set up

## Next Steps After Deployment

1. **SEO Campaign**
   - Submit to Google Search Console
   - Build backlinks
   - Create content strategy

2. **Marketing**
   - Set up Google Ads
   - Configure Facebook Pixel
   - Launch social media

3. **Continue Development**
   - Phase 2: Email/SMS Notifications
   - Phase 3: Contractor Portal
   - Phase 4: Billing & Payments

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs

---

**Your platform is ready to generate leads! 🚀**
