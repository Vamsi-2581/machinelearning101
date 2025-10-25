# Machine Learning Simplified

An interactive, browser-based machine learning learning platform designed for beginners. Learn ML concepts through hands-on experimentation with zero setup required.

## Features

- 🎯 **Interactive Learning**: Real-time parameter adjustments with immediate visual feedback
- 📊 **Rich Visualizations**: See algorithms work through interactive charts and graphs
- 🧪 **Hands-On Experiments**: Train models, adjust parameters, and see results instantly
- 📚 **Guided Content**: Clear explanations, quizzes, and progress tracking
- 🔒 **Privacy-Focused**: Optional analytics with full user control
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Quick Start

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
 
```

## Development Server

Start the development server on `http://localhost:3000`:
 

## Production

Build the application for production (useful for checking that new changes do not introduce errors):

```bash
# npm (should also be used after making changes to confirm no errors were introduced)
npm run build 

```

Locally preview production build:

```bash
# npm
npm run preview

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Authentication Backend Setup

This project includes an optional authentication backend using Cloudflare Workers for user accounts and progress synchronization across devices.

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Google OAuth credentials](https://console.cloud.google.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed

### Quick Setup

1. **Configure Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `https://api.yourdomain.com/api/auth/google/callback`

2. **Set up Cloudflare Worker**:
   ```bash
   cd worker
   npm install
   
   # Create D1 database
   wrangler d1 create ml-platform-db
   
   # Update wrangler.toml with the database ID from output
   
   # Run database migrations
   ./migrate.sh prod
   ```

3. **Configure secrets**:
   ```bash
   # Set Cloudflare Worker secrets
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   wrangler secret put GOOGLE_REDIRECT_URI
   wrangler secret put JWT_SECRET
   wrangler secret put FRONTEND_URL
   ```

4. **Deploy worker**:
   ```bash
   npm run deploy
   ```

5. **Configure frontend**:
   ```bash
   # In project root
   cp .env.example .env
   
   # Edit .env and set your worker URL
   NUXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
   ```

### Detailed Setup Instructions

For comprehensive setup and deployment instructions, see:
- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [docs/ENVIRONMENT_SETUP_CHECKLIST.md](docs/ENVIRONMENT_SETUP_CHECKLIST.md) - Setup verification checklist
- [worker/README.md](worker/README.md) - Worker documentation
- [worker/SETUP.md](worker/SETUP.md) - Setup verification guide
- [worker/MIGRATIONS.md](worker/MIGRATIONS.md) - Database migration guide

### Required Cloudflare Worker Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://api.yourdomain.com/api/auth/google/callback` |
| `JWT_SECRET` | Secret key for JWT signing | Generate with `openssl rand -base64 32` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://yourdomain.com` |

### Local Development

For local development with the auth backend:

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start worker
cd worker
npm run dev
```

Then set `NUXT_PUBLIC_API_URL=http://localhost:8787` in your `.env` file.

### Without Authentication Backend

The platform works fully without the authentication backend - progress is stored locally in the browser. Authentication is only needed for:
- Syncing progress across devices
- Persistent user accounts
- Cloud backup of learning progress

## Analytics Setup

This project uses privacy-focused analytics with Plausible. To enable analytics:

1. Create a [Plausible Analytics](https://plausible.io) account
2. Add your domain to Plausible
3. Set environment variables:

```bash
# Copy the example file (if not already done)
cp .env.example .env

# Edit .env and add your domain
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

For detailed setup instructions, see [docs/ANALYTICS_SETUP.md](docs/ANALYTICS_SETUP.md).

### Privacy & User Control

- Analytics are **opt-in by default** - users must explicitly consent
- No personal data is collected
- No cookies are used for tracking
- Users can opt out at any time via the privacy settings page
- Fully GDPR, CCPA, and PECR compliant

## Documentation

### For Users
- [User Guide](docs/USER_GUIDE.md) - Complete guide for learners
- [Getting Started](pages/getting-started.vue) - Quick start guide
- [FAQ](pages/faq.vue) - Frequently asked questions

### For Developers
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Comprehensive development guide
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines
- [Module Creation Guide](docs/MODULE_CREATION_GUIDE.md) - Quick reference for adding modules
- [Performance Checklist](docs/PERFORMANCE_CHECKLIST.md) - Performance optimization guide
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Complete deployment instructions

### Technical Documentation
- [Analytics Setup Guide](docs/ANALYTICS_SETUP.md) - Configure Plausible Analytics
- [Analytics Integration Guide](docs/ANALYTICS_INTEGRATION.md) - Add tracking to new modules
- [Project Structure](.kiro/steering/structure.md) - Understand the codebase
- [Technology Stack](.kiro/steering/tech.md) - Technologies used
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) - Recent implementation details
- [Worker Setup](worker/SETUP.md) - Authentication backend setup verification
- [Database Migrations](worker/MIGRATIONS.md) - Database management guide

## Environment Variables

### Frontend (.env)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Your domain for Plausible analytics | - |
| `NUXT_PUBLIC_PLAUSIBLE_HOST` | No | Plausible instance URL | `https://plausible.io` |
| `NUXT_PUBLIC_API_URL` | No | Cloudflare Worker URL for auth | - |

### Worker Secrets (Cloudflare)

Set these using `wrangler secret put SECRET_NAME`:

| Secret | Required | Description | How to Generate |
|--------|----------|-------------|-----------------|
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth client secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_REDIRECT_URI` | Yes* | OAuth callback URL | Your worker URL + `/api/auth/google/callback` |
| `JWT_SECRET` | Yes* | JWT signing secret | `openssl rand -base64 32` |
| `FRONTEND_URL` | Yes* | Frontend domain for CORS | Your frontend URL |

*Only required if using authentication backend

See [worker/.env.example](worker/.env.example) for detailed configuration instructions.

## Project Structure

```
.
├── algorithms/          # ML algorithm implementations
├── components/          # Vue components
│   ├── layout/         # Layout components
│   ├── modules/        # Module-specific components
│   ├── shared/         # Shared/reusable components
│   └── visualizations/ # Visualization components
├── composables/         # Vue composables
├── content/            # Module content (markdown + config)
├── pages/              # Nuxt pages (auto-routing)
├── stores/             # Pinia stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── worker/             # Cloudflare Worker for authentication
└── service-workers/    # Web Workers for heavy computation
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Coding standards
- Testing guidelines
- Pull request process

New to the project? Check out the [Developer Guide](docs/DEVELOPER_GUIDE.md) to get started!

## License

MIT License - see LICENSE file for details.

