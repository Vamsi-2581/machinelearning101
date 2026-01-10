# ML Platform Auth Worker

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.x-E36002)](https://hono.dev/)

Serverless authentication and progress synchronization backend for [Machine Learning 101](../README.md), built on Cloudflare Workers for global edge deployment.

## ✨ Features

- 🔐 **Google OAuth 2.0**: Secure authentication flow
- 🎫 **JWT Sessions**: Stateless authentication with 7-day expiration
- ☁️ **Progress Sync**: Cross-device learning progress synchronization
- 🗄️ **Cloudflare D1**: SQLite database at the edge
- ⚡ **Edge Computing**: Sub-50ms response times globally
- 🛡️ **Security**: CSRF protection, parameterized queries, CORS configuration
- 🧪 **Tested**: Comprehensive test suite with Vitest

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Cloudflare Account** ([Sign up free](https://dash.cloudflare.com/sign-up))
- **Wrangler CLI** ([Installation guide](https://developers.cloudflare.com/workers/wrangler/install-and-update/))
- **Google OAuth Credentials** ([Google Cloud Console](https://console.cloud.google.com/))

### Installation

```bash
# Navigate to worker directory
cd worker

# Install dependencies
npm install
```

### Database Setup

```bash
# Create D1 database
wrangler d1 create ml-platform-db

# Copy the database_id from output and update wrangler.toml
# Update the database_id in the [[d1_databases]] section

# Run migrations
./migrate.sh prod
```

See [MIGRATIONS.md](./MIGRATIONS.md) for detailed database management.

### Configure Secrets

```bash
# Google OAuth credentials
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GOOGLE_REDIRECT_URI

# JWT secret (generate with: openssl rand -base64 32)
wrangler secret put JWT_SECRET

# Frontend URL for CORS
wrangler secret put FRONTEND_URL
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `https://your-worker.workers.dev/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

### Deploy

```bash
# Deploy to production
npm run deploy

# Your worker will be available at:
# https://machinelearning101-api.your-subdomain.workers.dev
```

### Configure Frontend

Update the frontend `.env` file:

```bash
NUXT_PUBLIC_API_URL=https://machinelearning101-api.your-subdomain.workers.dev
```

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Setup verification checklist
- [MIGRATIONS.md](./MIGRATIONS.md) - Database migration guide
- [../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md) - Complete deployment guide

## 🛠️ Development

### Local Development

```bash
# Start local development server (http://localhost:8787)
npm run dev
```

For local development with the frontend:

```bash
# Terminal 1: Start worker
cd worker
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

Update frontend `.env`:
```bash
NUXT_PUBLIC_API_URL=http://localhost:8787
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Deployment

```bash
# Deploy to production
npm run deploy

# Deploy to specific environment
wrangler deploy --env production
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/google` | Initiate Google OAuth flow | No |
| `GET` | `/api/auth/google/callback` | OAuth callback handler | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (JWT) |
| `POST` | `/api/auth/logout` | Logout user | No |

### Progress Synchronization

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/progress/sync` | Sync user progress | Yes (JWT) |
| `GET` | `/api/progress` | Get user progress | Yes (JWT) |

### Authentication Flow

1. Frontend redirects to `/api/auth/google`
2. User authenticates with Google
3. Google redirects to `/api/auth/google/callback`
4. Worker creates JWT and redirects to frontend with token
5. Frontend stores JWT and includes in subsequent requests via `Authorization: Bearer <token>` header

## 📁 Project Structure

```
worker/
├── src/
│   ├── index.ts              # Main entry point & Hono app
│   ├── router.ts             # Request routing
│   ├── handlers/             # Request handlers
│   │   ├── auth.ts          # Authentication handlers
│   │   └── progress.ts      # Progress sync handlers
│   ├── middleware/           # Middleware functions
│   │   ├── auth.ts          # JWT verification
│   │   └── cors.ts          # CORS configuration
│   ├── services/             # Business logic
│   │   ├── auth.ts          # OAuth & JWT logic
│   │   ├── database.ts      # Database operations
│   │   └── progress.ts      # Progress sync logic
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── tests/                    # Test suite
│   ├── handlers/            # Handler tests
│   ├── middleware/          # Middleware tests
│   ├── services/            # Service tests
│   ├── utils/               # Utility tests
│   └── integration/         # Integration tests
├── migrations/               # Database migrations
├── schema.sql                # Database schema
├── migrate.sh                # Migration script
├── wrangler.toml             # Cloudflare configuration
├── vitest.config.ts          # Test configuration
└── package.json              # Dependencies
```

## 🧪 Testing

Comprehensive test suite using Vitest:

- **Unit Tests**: Services, utilities, middleware
- **Integration Tests**: End-to-end API flows
- **Coverage**: Aim for >80% code coverage

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security Features

- ✅ **JWT Authentication**: 7-day token expiration with secure signing
- ✅ **CSRF Protection**: OAuth state parameter validation
- ✅ **SQL Injection Prevention**: Parameterized queries only
- ✅ **CORS Configuration**: Restricted to frontend domain
- ✅ **Secret Management**: Cloudflare Workers secrets (never in code)
- ✅ **HTTPS Only**: All endpoints require secure connections
- ✅ **Rate Limiting**: Cloudflare's built-in DDoS protection

## ⚙️ Configuration

### Environment Variables

Set via `wrangler secret put`:

| Secret | Description | Example |
|--------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://your-worker.workers.dev/api/auth/google/callback` |
| `JWT_SECRET` | JWT signing key (32+ chars) | Generate: `openssl rand -base64 32` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://yourdomain.com` |

### Database Configuration

D1 database binding in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "ml_platform_db"
database_name = "ml-platform-db"
database_id = "your-database-id"
```

## 🐛 Troubleshooting

### Common Issues

**Database not found**
```bash
# Ensure database is created and ID matches wrangler.toml
wrangler d1 list
```

**OAuth redirect mismatch**
```bash
# Verify GOOGLE_REDIRECT_URI matches Google Cloud Console
wrangler secret list
```

**CORS errors**
```bash
# Ensure FRONTEND_URL matches your frontend domain exactly
wrangler secret put FRONTEND_URL
```

**JWT verification fails**
```bash
# Regenerate JWT_SECRET and update both worker and clear user sessions
openssl rand -base64 32
wrangler secret put JWT_SECRET
```

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Hono Framework](https://hono.dev/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 🤝 Contributing

Contributions welcome! See the main [Contributing Guide](../docs/CONTRIBUTING.md) for guidelines.

---

Part of [Machine Learning 101](../README.md)
