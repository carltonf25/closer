# Form Setup Guide

This guide covers the setup for advanced form features including address autocomplete and analytics.

## Address Autocomplete (Google Places API)

The lead forms include Google Places API integration for address autocomplete. This feature is **optional** - the forms will work without it, but users will need to manually enter their address.

### Setup Instructions

1. **Get a Google Places API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Places API" and "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add to Environment Variables:**

   ```env
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-api-key-here
   ```

3. **How It Works:**
   - When a user starts typing an address, Google Places suggests completions
   - When a place is selected, the form auto-fills:
     - Street address
     - City
     - State
     - ZIP code
   - If no API key is provided, the form works normally with manual input

### Cost Considerations

- Google Places API has a free tier: $200/month credit
- Address autocomplete costs ~$2.83 per 1,000 requests
- With the free tier, you get ~70,000 free autocomplete requests/month
- Monitor usage in Google Cloud Console

## Form Analytics Tracking

The forms include analytics tracking that works with PostHog or Mixpanel.

### Setup Instructions

#### Option 1: PostHog (Recommended)

1. **Create PostHog Account:**
   - Sign up at [posthog.com](https://posthog.com)
   - Get your project API key

2. **Add PostHog Script:**
   Add to your `src/app/layout.tsx`:

   ```tsx
   import Script from 'next/script';

   // In your layout component:
   <Script
     id="posthog-js"
     strategy="afterInteractive"
     dangerouslySetInnerHTML={{
       __html: `
         !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return e.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
         posthog.init('YOUR_POSTHOG_API_KEY',{api_host:'https://app.posthog.com'})
       `,
     }}
   />;
   ```

#### Option 2: Mixpanel

1. **Create Mixpanel Account:**
   - Sign up at [mixpanel.com](https://mixpanel.com)
   - Get your project token

2. **Add Mixpanel Script:**
   Add to your `src/app/layout.tsx`:

   ```tsx
   import Script from 'next/script';

   // In your layout component:
   <Script
     id="mixpanel-js"
     strategy="afterInteractive"
     src="https://cdn.mixpanel.com/lib/mixpanel-2-latest.min.js"
     onLoad={() => {
       if (window.mixpanel) {
         window.mixpanel.init('YOUR_MIXPANEL_TOKEN');
       }
     }}
   />;
   ```

### Tracked Events

The forms automatically track:

- `form_viewed` - When a form is displayed
- `form_started` - When user begins filling the form
- `form_step` - Step changes (for multi-step forms)
- `form_submitted` - Successful form submission
- `form_submission_failed` - Failed submission with error details

### Without Analytics Provider

If no analytics provider is configured, events are logged to the console in development mode only. The forms will work normally.

## Testing Form Submissions

### Manual Testing

1. **Test Quick Form:**
   - Go to homepage (`/`)
   - Fill out the quick lead form
   - Submit and verify lead appears in Supabase

2. **Test Full Form:**
   - Go to any city/service page (e.g., `/atlanta/hvac-repair`)
   - Fill out the multi-step form
   - Verify all fields are captured correctly

3. **Test Phone Formatting:**
   - Type phone number and verify it formats as you type: `(XXX) XXX-XXXX`

4. **Test Address Autocomplete (if API key set):**
   - Start typing an address
   - Select from suggestions
   - Verify city, state, and ZIP auto-fill

5. **Test Honeypot:**
   - Open browser dev tools
   - Find the hidden `website` field
   - Fill it out and submit
   - Form should silently fail (spam protection)

### Automated Testing Script

Run the database test to verify form submission works:

```bash
npm run db:test
```

This tests:

- Database connection
- Public read access
- Lead creation with service role

## Environment Variables Summary

Add these to `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional - for address autocomplete
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Analytics (configured via script tags, not env vars)
# PostHog or Mixpanel scripts added to layout.tsx
```

## Troubleshooting

### Address Autocomplete Not Working

- Check that `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` is set
- Verify API key has Places API enabled
- Check browser console for errors
- Form will work without autocomplete - users can type manually

### Analytics Not Tracking

- Verify PostHog/Mixpanel script is loaded (check Network tab)
- Check browser console for initialization errors
- Events log to console in development if no provider is set up

### Form Submission Fails

- Check Supabase connection: `npm run db:test`
- Verify RLS policies are set up correctly
- Check server logs for errors
- Ensure all required fields are filled
