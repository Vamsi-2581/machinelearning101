# ML Platform Auth Worker

Cloudflare Worker for authentication and progress synchronization for the Machine Learning Simplified platform.

## Features

- Google OAuth 2.0 authentication
- JWT-based session management
- User progress synchronization
- Cloudflare D1 database for data persistence
- Edge computing for low latency

## Setup

### Quick Start

For complete setup and deployment instructions, see:
- [../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md) - Comprehensive deployment guide
- [SETUP.md](./SETUP.md) - Setup verification checklist
- [MIGRATIONS.md](./MIGRATIONS.md) - Database migration guide

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

### Installation

```bash
npm install
```

### Database Setup

1. Create a D1 database:
```bash
wrangler d1 create ml-platform-db
```

2. Update `wrangler.toml` with the database ID from the output

3. Run migrations:
```bash
# For local development
./migrate.sh dev

# For production
./migrate.sh prod
```

See [MIGRATIONS.md](./MIGRATIONS.md) for detailed database management instructions.

### Environment Variables

Set the following secrets using Wrangler:

```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GOOGLE_REDIRECT_URI
wrangler secret put JWT_SECRET
wrangler secret put FRONTEND_URL
```

See [.env.example](./.env.example) for detailed descriptions of each variable.

## Development

```bash
# Start local development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

```bash
# Deploy to production
npm run deploy
```

## API Endpoints

### Authentication

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user profile (requires JWT)
- `POST /api/auth/logout` - Logout (client-side token removal)

### Progress Sync

- `POST /api/progress/sync` - Sync user progress (requires JWT)
- `GET /api/progress` - Get user progress (requires JWT)

## Project Structure

```
worker/
├── src/
│   ├── index.ts              # Main entry point
│   ├── router.ts             # Request routing
│   ├── handlers/             # Request handlers
│   ├── middleware/           # Middleware functions
│   ├── services/             # Business logic
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── tests/                    # Test files
├── schema.sql                # Database schema
├── wrangler.toml             # Cloudflare configuration
├── vitest.config.ts          # Test configuration
└── package.json              # Dependencies
```

## Testing

The project uses Vitest for unit and integration testing. Tests are organized to mirror the source structure:

- `tests/services/` - Service layer tests
- `tests/handlers/` - Handler tests
- `tests/middleware/` - Middleware tests
- `tests/utils/` - Utility tests
- `tests/integration/` - Integration tests

## Security

- JWT tokens with 7-day expiration
- CSRF protection via OAuth state parameter
- Parameterized SQL queries to prevent injection
- CORS configuration for frontend domain
- Secure secret management via Cloudflare secrets

## License

MIT
