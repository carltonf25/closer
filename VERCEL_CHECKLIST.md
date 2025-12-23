# Vercel Auto-Deployment Checklist

## ✅ Code Pushed to GitHub

Your code has been pushed to `main` branch and Vercel should be auto-deploying now.

## 🔍 Check Deployment Status

1. Go to https://vercel.com/dashboard
2. Find your project (likely named "closer")
3. Check the latest deployment (should show "Building..." or "Ready")

## ⚙️ Critical: Verify Environment Variables

**IMPORTANT:** Make sure these environment variables are set in Vercel:

### Required Variables (Add if missing)

Go to: **Project Settings → Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL=https://lrevmqzofiatcjjzdgmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
NEXT_PUBLIC_SITE_URL=[your-vercel-url or custom-domain]
```

**Note:** If these aren't set, your deployment will build successfully but forms won't work!

### Where to Find Values

- **Supabase URL & Keys:** https://supabase.com/dashboard/project/lrevmqzofiatcjjzdgmk/settings/api
- **Site URL:** Your Vercel deployment URL (e.g., `https://closer-xyz.vercel.app`)

## 📝 Once Deployed - Update Site URL

After deployment completes:

1. Copy your Vercel deployment URL
2. Go to Vercel → Project Settings → Environment Variables
3. Update `NEXT_PUBLIC_SITE_URL` to match your deployment URL
4. Redeploy if needed

## ✅ Post-Deployment Verification

Once deployment is complete, test these URLs:

### Core Pages
- [ ] Homepage: `[your-url]/`
- [ ] Locations: `[your-url]/locations`
- [ ] HVAC Services: `[your-url]/services/hvac`
- [ ] Plumbing: `[your-url]/services/plumbing`
- [ ] Sample page: `[your-url]/atlanta/hvac-repair`

### SEO
- [ ] Sitemap: `[your-url]/sitemap.xml`
- [ ] Robots: `[your-url]/robots.txt`

### Forms (Critical!)
- [ ] Submit QuickLeadForm on homepage
- [ ] Submit full form on city/service page
- [ ] Verify lead appears in Supabase database

### Mobile
- [ ] Exit-intent popup (move mouse to leave)
- [ ] Sticky CTA (scroll on mobile)
- [ ] Responsive layout

## 🐛 If Deployment Fails

### Build Error: "Module not found"
- Check that all imports are correct
- Verify all files were pushed to GitHub

### Runtime Error: "Invalid API key"
- Environment variables not set in Vercel
- Add them in Project Settings → Environment Variables
- Redeploy after adding

### Forms Don't Work
- Supabase environment variables missing
- Check browser console for errors
- Verify Supabase URL and keys in Vercel settings

## 🎯 Next Steps After Successful Deployment

1. **Configure Custom Domain** (Optional)
   - Vercel → Project Settings → Domains
   - Add your domain
   - Update DNS records

2. **Submit to Google**
   - Google Search Console: Submit sitemap
   - Verify ownership
   - Check indexing status

3. **Update Placeholder Content**
   - Replace phone number `(404) 555-1234` with real number
   - Update testimonials if desired
   - Customize FAQ answers

4. **Set Up Monitoring**
   - Vercel Analytics (built-in)
   - Google Analytics (optional)
   - UptimeRobot for uptime monitoring

## 📊 Expected Build Output

Your build should show:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (284/284)
✓ Finalizing page optimization
```

**Total Pages:** 284 (1 homepage + 1 locations + 2 services + 280 city/service combos)

## 🎉 Success Indicators

- ✅ Build shows "Ready" in Vercel
- ✅ All 284 pages accessible
- ✅ Forms submit successfully
- ✅ Sitemap generates correctly
- ✅ Mobile responsive

---

**You're deploying a production-ready lead generation platform! 🚀**

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.
