# Environment Setup Checklist

Use this checklist to verify your environment configuration is complete.

## Frontend Environment Setup

### Required Files

- [ ] `.env` file exists in project root (copy from `.env.example`)

### Optional: Analytics Configuration

- [ ] `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` set to your domain
- [ ] `NUXT_PUBLIC_PLAUSIBLE_HOST` set (or using default)
- [ ] Plausible account created and domain added
- [ ] Analytics tested and working

### Optional: Authentication Backend

- [ ] `NUXT_PUBLIC_API_URL` set to your Cloudflare Worker URL
- [ ] URL format is correct (includes `https://` or `http://` for local)
- [ ] Worker is deployed and accessible

### Verification

```bash
# Check environment variables are loaded
npm run dev
# Visit http://localhost:3000 and check browser console for any errors
```

## Worker Environment Setup

### Prerequisites

- [ ] Cloudflare account created
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated with Cloudflare (`wrangler login`)
- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created

### Database Setup

- [ ] D1 database created (`wrangler d1 create ml-platform-db`)
- [ ] Database ID added to `wrangler.toml`
- [ ] Schema migrations run (`./migrate.sh prod`)
- [ ] Tables verified:
  ```bash
  wrangler d1 execute ml-platform-db --command "SELECT name FROM sqlite_master WHERE type='table';"
  ```

### Secrets Configuration

Verify all secrets are set:

```bash
# List all secrets (should show 5 secrets)
wrangler secret list
```

Expected secrets:
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console  
- [ ] `GOOGLE_REDIRECT_URI` - Your worker URL + `/api/auth/google/callback`
- [ ] `JWT_SECRET` - Generated with `openssl rand -base64 32`
- [ ] `FRONTEND_URL` - Your frontend domain (with https://)

### Google OAuth Configuration

- [ ] Authorized redirect URI added in Google Console
- [ ] Redirect URI matches `GOOGLE_REDIRECT_URI` secret exactly
- [ ] OAuth consent screen configured
- [ ] Test users added (if in testing mode)

### Local Development Setup (Optional)

- [ ] `worker/.dev.vars` file created (copy from `.env.example`)
- [ ] All secrets added to `.dev.vars` with local values
- [ ] Local redirect URI: `http://localhost:8787/api/auth/google/callback`
- [ ] Local frontend URL: `http://localhost:3000`

### Deployment Verification

- [ ] Worker deployed (`npm run deploy` from worker directory)
- [ ] Worker URL noted and added to frontend `.env`
- [ ] Worker accessible via browser
- [ ] No errors in deployment logs

### Testing

- [ ] OAuth initiation works (redirects to Google)
  ```bash
  curl -I https://your-worker.workers.dev/api/auth/google
  # Should return 302 redirect
  ```

- [ ] Protected endpoints return 401 without auth
  ```bash
  curl https://your-worker.workers.dev/api/auth/me
  # Should return 401 Unauthorized
  ```

- [ ] Worker logs show no errors
  ```bash
  wrangler tail
  # Monitor for errors during testing
  ```

## Integration Testing

### End-to-End OAuth Flow

- [ ] Frontend displays "Sign in with Google" button
- [ ] Clicking button redirects to Google
- [ ] Google consent screen appears
- [ ] After consent, redirected back to frontend
- [ ] User is logged in (name/picture displayed)
- [ ] No errors in browser console
- [ ] No errors in worker logs

### Progress Sync Testing

- [ ] Complete a module while logged in
- [ ] Check browser console for sync API calls
- [ ] Verify 200 response from sync endpoint
- [ ] Log out
- [ ] Log back in
- [ ] Progress persists (module still marked complete)

### Database Verification

```bash
# Check user was created
wrangler d1 execute ml-platform-db --command "SELECT * FROM users LIMIT 1;"

# Check progress was saved
wrangler d1 execute ml-platform-db --command "SELECT * FROM progress LIMIT 5;"
```

## Common Issues

### Frontend Issues

**Environment variables not working**
- Ensure variables start with `NUXT_PUBLIC_`
- Restart dev server after changing `.env`
- Clear browser cache

**API calls failing**
- Check `NUXT_PUBLIC_API_URL` is correct
- Verify worker is deployed and accessible
- Check CORS configuration in worker

### Worker Issues

**OAuth redirect fails**
- Verify redirect URI in Google Console matches exactly
- Check `GOOGLE_REDIRECT_URI` secret
- Ensure HTTPS is used in production

**Database errors**
- Verify database ID in `wrangler.toml`
- Check migrations ran successfully
- Verify tables exist

**CORS errors**
- Check `FRONTEND_URL` secret matches frontend domain exactly
- Include protocol (https://) in URL
- No trailing slash in URL

**JWT errors**
- Verify `JWT_SECRET` is set
- Check token hasn't expired (7 days)
- Verify Authorization header format: `Bearer <token>`

## Security Checklist

Before going to production:

- [ ] Strong `JWT_SECRET` generated (32+ characters)
- [ ] `FRONTEND_URL` set to exact production domain
- [ ] Google OAuth redirect URI configured for production
- [ ] HTTPS enabled on frontend
- [ ] Secrets not committed to version control
- [ ] `.dev.vars` added to `.gitignore`
- [ ] Test error handling (invalid tokens, expired sessions)
- [ ] Monitor worker logs for suspicious activity

## Performance Checklist

- [ ] Frontend build optimized (`npm run build`)
- [ ] Static assets served via CDN
- [ ] Worker deployed to production (not dev mode)
- [ ] Database indexes verified
- [ ] Monitor worker execution time
- [ ] Check Core Web Vitals

## Documentation Review

- [ ] Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [ ] Review [worker/README.md](../worker/README.md)
- [ ] Check [worker/SETUP.md](../worker/SETUP.md)
- [ ] Understand [worker/MIGRATIONS.md](../worker/MIGRATIONS.md)

## Support Resources

If you encounter issues:

1. Check worker logs: `wrangler tail`
2. Review browser console for errors
3. Verify all checklist items above
4. Consult [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section
5. Check [GitHub Issues](https://github.com/yourusername/yourrepo/issues)

## Next Steps

Once everything is verified:

1. [ ] Test with real users
2. [ ] Set up monitoring/alerts
3. [ ] Document any custom configuration
4. [ ] Create backup procedures
5. [ ] Plan for scaling if needed

---

**Status**: Use this checklist to track your setup progress. Check off items as you complete them.
