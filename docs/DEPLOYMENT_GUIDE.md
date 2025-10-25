# Deployment Guide

Complete guide for deploying the Machine Learning Simplified platform with authentication backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google OAuth Setup](#google-oauth-setup)
3. [Cloudflare Worker Setup](#cloudflare-worker-setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Frontend Deployment](#frontend-deployment)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up)
- **Google Cloud Account**: [Sign up](https://console.cloud.google.com/)
- **Domain** (optional but recommended): For production deployment

### Required Tools

```bash
# Node.js 18+ and npm
node --version  # Should be 18.0.0 or higher
npm --version

# Wrangler CLI (Cloudflare Workers CLI)
npm install -g wrangler

# Verify installation
wrangler --version
```

### Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

---

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `ml-platform-auth`
4. Click "Create"

### 2. Enable Google+ API

1. In the project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in required fields:
   - **App name**: Machine Learning Simplified
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
7. Click "Save and Continue"
8. **Test users** (for development):
   - Add your email address
9. Click "Save and Continue"

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: ML Platform Worker
   - **Authorized JavaScript origins**: Leave empty
   - **Authorized redirect URIs**:
     - Development: `http://localhost:8787/api/auth/google/callback`
     - Production: `https://api.yourdomain.com/api/auth/google/callback`
5. Click "Create"
6. **Save the credentials**:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`

> ⚠️ **Important**: Keep these credentials secure. Never commit them to version control.

---

## Cloudflare Worker Setup

### 1. Navigate to Worker Directory

```bash
cd worker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create ml-platform-db
```

**Output example**:
```
✅ Successfully created DB 'ml-platform-db'

[[d1_databases]]
binding = "DB"
database_name = "ml-platform-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. Update wrangler.toml

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "ml-platform-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Replace with your ID
```

---

## Database Setup

### 1. Run Database Migrations

The `migrate.sh` script handles database migrations for both development and production.

#### Development Database

```bash
./migrate.sh dev
```

This creates tables in your local development database.

#### Production Database

```bash
./migrate.sh prod
```

This creates tables in your production D1 database.

### 2. Verify Database Schema

```bash
# List tables in development
wrangler d1 execute ml-platform-db --local --command "SELECT name FROM sqlite_master WHERE type='table'"

# List tables in production
wrangler d1 execute ml-platform-db --command "SELECT name FROM sqlite_master WHERE type='table'"
```

Expected output:
```
users
progress
quiz_scores
bookmarks
```

### 3. Database Schema Overview

The database includes four main tables:

- **users**: User accounts with Google OAuth data
- **progress**: Module completion tracking
- **quiz_scores**: Quiz results and scores
- **bookmarks**: User-saved modules

See [worker/schema.sql](../worker/schema.sql) for the complete schema.

---

## Environment Configuration

### 1. Worker Secrets

Set the following secrets for your Cloudflare Worker:

```bash
# Navigate to worker directory
cd worker

# Set Google OAuth credentials
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Google Client ID when prompted

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Google Client Secret when prompted

# Set redirect URI (must match Google OAuth configuration)
wrangler secret put GOOGLE_REDIRECT_URI
# Development: http://localhost:8787/api/auth/google/callback
# Production: https://api.yourdomain.com/api/auth/google/callback

# Generate and set JWT secret (use a strong random string)
wrangler secret put JWT_SECRET
# Generate with: openssl rand -base64 32

# Set frontend URL (for CORS)
wrangler secret put FRONTEND_URL
# Development: http://localhost:3000
# Production: https://yourdomain.com
```

### 2. Generate JWT Secret

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Verify Secrets

```bash
wrangler secret list
```

Expected output:
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
JWT_SECRET
FRONTEND_URL
```

### 4. Frontend Environment Variables

Create or update `.env` in the project root:

```bash
# API endpoint
NUXT_PUBLIC_API_URL=https://api.yourdomain.com

# For local development
# NUXT_PUBLIC_API_URL=http://localhost:8787
```

---

## Cloudflare Worker Deployment

### 1. Test Locally

```bash
cd worker

# Start local development server
npm run dev
```

The worker will be available at `http://localhost:8787`.

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

Ensure all tests pass before deploying.

### 3. Deploy to Production

```bash
# Deploy the worker
npm run deploy
```

**Output example**:
```
✨ Built successfully
✨ Uploaded successfully
✨ Deployed successfully
🌍 https://ml-platform-auth.your-subdomain.workers.dev
```

### 4. Custom Domain (Optional)

To use a custom domain like `api.yourdomain.com`:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your worker
3. Go to "Triggers" → "Custom Domains"
4. Click "Add Custom Domain"
5. Enter: `api.yourdomain.com`
6. Click "Add Custom Domain"

Cloudflare will automatically provision SSL certificates.

### 5. Update Google OAuth Redirect URI

After deploying with a custom domain:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth client
4. Update "Authorized redirect URIs":
   - Add: `https://api.yourdomain.com/api/auth/google/callback`
5. Save changes

### 6. Update Worker Secrets

Update the redirect URI secret:

```bash
wrangler secret put GOOGLE_REDIRECT_URI
# Enter: https://api.yourdomain.com/api/auth/google/callback

wrangler secret put FRONTEND_URL
# Enter: https://yourdomain.com
```

---

## Frontend Deployment

### 1. Update Environment Variables

Update `.env` with your production API URL:

```bash
NUXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Build the Frontend

```bash
# From project root
npm run build
```

This generates a static site in `.output/public/`.

### 3. Test Production Build Locally

```bash
npm run preview
```

Test the authentication flow:
1. Click "Sign in with Google"
2. Complete OAuth flow
3. Verify user profile appears
4. Test progress sync

### 4. Deploy to Hosting Provider

The platform is a static site and can be deployed to any static hosting provider:

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.output/public
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Cloudflare Pages

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy .output/public
```

#### GitHub Pages

```bash
# Push .output/public to gh-pages branch
npm run generate
git subtree push --prefix .output/public origin gh-pages
```

### 5. Configure Domain

Point your domain to your hosting provider:

- **Netlify**: Add custom domain in Netlify dashboard
- **Vercel**: Add custom domain in Vercel dashboard
- **Cloudflare Pages**: Add custom domain in Cloudflare dashboard
- **GitHub Pages**: Configure custom domain in repository settings

---

## Verification

### 1. Test Worker Endpoints

```bash
# Test health check
curl https://api.yourdomain.com/

# Test OAuth initiation (should redirect)
curl -I https://api.yourdomain.com/api/auth/google
```

### 2. Test Authentication Flow

1. Open your deployed frontend: `https://yourdomain.com`
2. Click "Sign in with Google"
3. Complete OAuth consent
4. Verify:
   - Redirected back to frontend
   - User profile appears in header
   - JWT token stored in localStorage

### 3. Test Progress Sync

1. Complete a module
2. Open browser DevTools → Network tab
3. Verify POST request to `/api/progress/sync`
4. Check response status: 200 OK

### 4. Test Multi-Device Sync

1. Sign in on Device A
2. Complete a module
3. Sign in on Device B with same account
4. Verify progress appears on Device B

### 5. Monitor Worker Logs

```bash
# Tail worker logs
wrangler tail
```

### 6. Check Database

```bash
# Query users table
wrangler d1 execute ml-platform-db --command "SELECT COUNT(*) FROM users"

# Query progress table
wrangler d1 execute ml-platform-db --command "SELECT COUNT(*) FROM progress"
```

---

## Troubleshooting

### OAuth Errors

#### "redirect_uri_mismatch"

**Cause**: Redirect URI doesn't match Google OAuth configuration

**Solution**:
1. Check `GOOGLE_REDIRECT_URI` secret matches exactly
2. Verify URI is added in Google Cloud Console
3. Ensure protocol (http/https) matches

#### "invalid_client"

**Cause**: Invalid client ID or secret

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Check for extra spaces or newlines
3. Regenerate credentials if needed

### JWT Errors

#### "Invalid token" or 401 Unauthorized

**Cause**: JWT validation failing

**Solution**:
1. Check `JWT_SECRET` is set correctly
2. Verify token hasn't expired (7-day expiration)
3. Clear localStorage and sign in again

### CORS Errors

#### "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: CORS not configured correctly

**Solution**:
1. Verify `FRONTEND_URL` secret matches your frontend domain exactly
2. Check protocol (http/https) matches
3. Ensure no trailing slash in URL

### Database Errors

#### "no such table: users"

**Cause**: Database migrations not run

**Solution**:
```bash
cd worker
./migrate.sh prod
```

#### "D1_ERROR: database not found"

**Cause**: Database ID in wrangler.toml is incorrect

**Solution**:
1. Run `wrangler d1 list` to find correct ID
2. Update `database_id` in `wrangler.toml`
3. Redeploy worker

### Deployment Errors

#### "Error: No such binding: DB"

**Cause**: D1 database binding not configured

**Solution**:
1. Verify `[[d1_databases]]` section in `wrangler.toml`
2. Ensure `binding = "DB"` matches code
3. Redeploy worker

#### "Error: Secret not found"

**Cause**: Required secrets not set

**Solution**:
```bash
wrangler secret list
# Set any missing secrets
wrangler secret put SECRET_NAME
```

### Performance Issues

#### Slow authentication

**Cause**: Worker cold starts

**Solution**:
- Workers warm up after first request
- Consider Cloudflare Workers Paid plan for reduced cold starts

#### Database query timeouts

**Cause**: Missing indexes or large dataset

**Solution**:
1. Verify indexes exist (see `schema.sql`)
2. Check query performance with `EXPLAIN QUERY PLAN`

---

## Production Checklist

Before going live, verify:

- [ ] Google OAuth configured with production redirect URI
- [ ] All Cloudflare Worker secrets set
- [ ] Database migrations run on production D1
- [ ] Worker deployed and accessible
- [ ] Custom domain configured (if applicable)
- [ ] Frontend deployed with correct API URL
- [ ] Authentication flow tested end-to-end
- [ ] Progress sync tested across devices
- [ ] Error monitoring configured
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] Test user accounts created and verified

---

## Monitoring and Maintenance

### Worker Analytics

View worker analytics in Cloudflare Dashboard:
- Request volume
- Error rates
- Response times
- Geographic distribution

### Database Monitoring

```bash
# Check database size
wrangler d1 execute ml-platform-db --command "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()"

# Check table row counts
wrangler d1 execute ml-platform-db --command "
  SELECT 'users' as table_name, COUNT(*) as count FROM users
  UNION ALL
  SELECT 'progress', COUNT(*) FROM progress
  UNION ALL
  SELECT 'quiz_scores', COUNT(*) FROM quiz_scores
  UNION ALL
  SELECT 'bookmarks', COUNT(*) FROM bookmarks
"
```

### Log Monitoring

```bash
# Real-time logs
wrangler tail

# Filter by status code
wrangler tail --status error
```

### Backup Strategy

D1 databases are automatically backed up by Cloudflare. To export data:

```bash
# Export users table
wrangler d1 execute ml-platform-db --command "SELECT * FROM users" --json > users_backup.json
```

---

## Rollback Procedure

If issues occur after deployment:

### 1. Rollback Worker

```bash
# List deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback [deployment-id]
```

### 2. Rollback Database

```bash
# Restore from backup
wrangler d1 execute ml-platform-db --file=backup.sql
```

### 3. Rollback Frontend

Depends on hosting provider:
- **Netlify**: Rollback in dashboard
- **Vercel**: Rollback in dashboard
- **Cloudflare Pages**: Rollback in dashboard

---

## Support and Resources

### Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment)

### Community

- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Nuxt Discord](https://discord.com/invite/nuxt)

### Project Documentation

- [Worker README](../worker/README.md)
- [Setup Guide](../worker/SETUP.md)
- [Migration Guide](../worker/MIGRATIONS.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)

---

## Security Best Practices

1. **Rotate Secrets Regularly**: Update JWT_SECRET and OAuth credentials periodically
2. **Monitor Access Logs**: Watch for suspicious authentication attempts
3. **Rate Limiting**: Consider adding rate limiting for auth endpoints
4. **HTTPS Only**: Never use HTTP in production
5. **Audit Dependencies**: Regularly update npm packages
6. **Backup Data**: Export database regularly
7. **Test Security**: Run security audits before major releases

---

## Cost Estimation

### Cloudflare Workers

- **Free Tier**: 100,000 requests/day
- **Paid Plan**: $5/month for 10M requests

### Cloudflare D1

- **Free Tier**: 5GB storage, 5M reads/day, 100K writes/day
- **Paid Plan**: Usage-based pricing

### Estimated Costs for Small Platform

- **< 1000 users**: Free tier sufficient
- **1000-10000 users**: ~$5-10/month
- **10000+ users**: ~$20-50/month

---

## Next Steps

After successful deployment:

1. **Monitor Performance**: Watch worker analytics and error rates
2. **Gather Feedback**: Test with real users
3. **Optimize**: Identify and fix bottlenecks
4. **Scale**: Upgrade plans as needed
5. **Iterate**: Add new features based on usage patterns

---

**Deployment complete!** 🎉

Your Machine Learning Simplified platform is now live with authentication and progress sync.
