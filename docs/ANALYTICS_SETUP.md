# Analytics Setup Guide

This guide explains how to set up privacy-focused analytics using Plausible Analytics for the ML Learning Platform.

## Overview

The platform uses Plausible Analytics, a privacy-focused, GDPR-compliant analytics service that:
- Doesn't use cookies
- Doesn't track users across sites
- Doesn't collect personal data
- Is fully compliant with GDPR, CCPA, and PECR

## Setup Instructions

### 1. Create a Plausible Account

1. Go to [Plausible.io](https://plausible.io) and create an account
2. Add your website domain (e.g., `machinelearningsimplified.com`)
3. Note your domain name for configuration

### 2. Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Plausible Analytics Configuration
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NUXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io
```

For self-hosted Plausible, change the host:
```bash
NUXT_PUBLIC_PLAUSIBLE_HOST=https://your-plausible-instance.com
```

### 3. Deploy Configuration

For production deployments (Vercel, Netlify, etc.), add these environment variables in your hosting platform's dashboard.

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` with your domain
3. Add `NUXT_PUBLIC_PLAUSIBLE_HOST` (optional, defaults to plausible.io)

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add the same variables as above

## How It Works

### Opt-In by Default

The platform respects user privacy by:
- **Defaulting to opt-out**: Analytics are disabled until the user explicitly opts in
- **Storing preference locally**: User's choice is saved in localStorage
- **No tracking without consent**: No data is sent to Plausible unless the user opts in

### Tracked Events

The following events are tracked when analytics is enabled:

#### Page Views
- Automatically tracked on route changes
- Includes page path and title

#### Module Interactions
- **Module Visit**: When a user opens a module
- **Module Complete**: When a user completes a module
- **Parameter Change**: When a user adjusts algorithm parameters
- **Algorithm Run**: When a user trains/runs an algorithm

#### Quiz Events
- **Quiz Answer**: Individual question answers (correct/incorrect)
- **Quiz Complete**: Quiz completion with score

#### User Actions
- **Bookmark Add**: When a user bookmarks a module
- **Interaction**: Generic interactions (button clicks, etc.)

### Custom Event Properties

Events include relevant context:
- `module_id`: Identifier for the module
- `module_name`: Human-readable module name
- `parameter`: Parameter name for parameter changes
- `value`: Parameter value
- `score`: Quiz score
- `correct`: Whether quiz answer was correct
- etc.

## Usage in Code

### Track Custom Events

```typescript
// In a component or composable
const { trackEvent } = usePlausible();

// Track a custom event
trackEvent('Custom Event', {
  property1: 'value1',
  property2: 123,
});
```

### Track Module-Specific Events

```typescript
const { trackModuleVisit, trackParameterChange } = usePlausible();

// Track module visit
trackModuleVisit('linear-regression', 'Linear Regression');

// Track parameter change
trackParameterChange('linear-regression', 'learningRate', 0.01);
```

### Using Analytics Store

The analytics store provides a centralized way to track events:

```typescript
const analyticsStore = useAnalyticsStore();

// Track events through the store
analyticsStore.trackModuleVisit('linear-regression', 'Linear Regression');
analyticsStore.trackParameterChange('linear-regression', 'learningRate', 0.01);
analyticsStore.trackQuizComplete('linear-regression', 8, 10);
```

## Privacy Controls

### User Opt-In/Opt-Out

Users can control analytics through:
1. **Cookie Consent Banner**: Shown on first visit
2. **Privacy Settings Page**: Accessible from the footer
3. **LocalStorage**: Preference is saved locally

### Checking Opt-In Status

```typescript
const analyticsStore = useAnalyticsStore();

if (analyticsStore.optedIn) {
  // User has opted in to analytics
}
```

### Setting Opt-In Preference

```typescript
const analyticsStore = useAnalyticsStore();

// Opt in
analyticsStore.setOptIn(true);

// Opt out
analyticsStore.setOptIn(false);
```

## Testing

### Development Mode

In development, analytics events are logged to the console:

```
[Analytics] module_visit { moduleId: 'linear-regression', moduleName: 'Linear Regression' }
```

### Testing Without Plausible Account

The platform works without Plausible configured:
- Events are still tracked in the analytics store
- Events are logged to console in development
- No errors occur if Plausible is not loaded

### Testing With Plausible

1. Set up a test domain in Plausible
2. Configure environment variables
3. Enable analytics in the app
4. Check Plausible dashboard for events

## Troubleshooting

### Events Not Showing in Plausible

1. **Check environment variables**: Ensure `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` is set correctly
2. **Check opt-in status**: User must opt in to analytics
3. **Check browser console**: Look for Plausible script loading errors
4. **Check ad blockers**: Some ad blockers block Plausible (though it's privacy-focused)

### Script Not Loading

1. Verify the Plausible host URL is correct
2. Check browser network tab for script loading
3. Ensure domain is added in Plausible dashboard

### Events Not Tracked

1. Verify user has opted in: `analyticsStore.optedIn === true`
2. Check console for errors
3. Verify Plausible script is loaded: `typeof window.plausible === 'function'`

## Alternative Analytics Services

While the platform is configured for Plausible, you can integrate other privacy-focused services:

### Simple Analytics
- Similar to Plausible
- Update `plugins/analytics.client.ts` to load Simple Analytics script

### Fathom Analytics
- Another privacy-focused option
- Update script loading in the plugin

### Self-Hosted Plausible
- Set `NUXT_PUBLIC_PLAUSIBLE_HOST` to your instance URL
- Everything else works the same

## GDPR Compliance

The platform is GDPR-compliant by design:
- ✅ No cookies used for analytics
- ✅ No personal data collected
- ✅ Opt-in required before tracking
- ✅ Easy opt-out mechanism
- ✅ Data stored anonymously
- ✅ Clear privacy policy

## Resources

- [Plausible Documentation](https://plausible.io/docs)
- [Plausible Events API](https://plausible.io/docs/custom-event-goals)
- [GDPR Compliance](https://plausible.io/data-policy)
