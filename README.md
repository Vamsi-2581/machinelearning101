# Machine Learning 101

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

An interactive, browser-based machine learning learning platform designed for beginners. Learn ML concepts through hands-on experimentation with **zero setup required** — everything runs directly in your browser.

## ✨ Features

- 🎯 **Interactive Learning**: Real-time parameter adjustments with immediate visual feedback
- 📊 **Rich Visualizations**: See algorithms work through interactive 2D/3D charts powered by Chart.js, D3.js, and Plotly.js
- 🧪 **Hands-On Experiments**: Train models, adjust parameters, and see results instantly
- 📚 **Guided Content**: Clear explanations, interactive quizzes, and progress tracking
- 🔒 **Privacy-Focused**: Optional analytics with full user control and GDPR compliance
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Zero Setup**: No installations, no backend dependencies, no barriers to learning
- 🌐 **Fully Static**: Deployable to any static hosting platform (Netlify, Vercel, GitHub Pages)
- 🔐 **Auth**: Cloud sync with Cloudflare Workers for cross-device progress tracking
 
## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/marvelefe/machinelearning101.git
cd machinelearning101

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate
```

### Run Tests

```bash
# Run unit tests
npm run test

# Type checking
npm run type-check
```

## 🔐 Authentication Backend

The authentication backend enables:

- ☁️ **Cross-Device Sync**: Access your progress from any device
- 💾 **Cloud Backup**: Never lose your learning progress
- 👤 **User Accounts**: Persistent profiles with Google OAuth

### Backend Architecture

- **Cloudflare Workers**: Serverless edge computing for low latency
- **Cloudflare D1**: SQLite-based database at the edge
- **Google OAuth 2.0**: Secure authentication
- **JWT Sessions**: Stateless authentication with 7-day expiration

### Quick Setup

See the [Worker README](worker/README.md) for detailed setup instructions.

```bash
cd worker

# Install dependencies
npm install

# Create D1 database
wrangler d1 create ml-platform-db

# Run migrations
./migrate.sh prod

# Configure secrets
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put JWT_SECRET

# Deploy
npm run deploy
```

### Required Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `GOOGLE_CLIENT_ID` | OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://your-worker.workers.dev/api/auth/google/callback` |
| `JWT_SECRET` | JWT signing key | `openssl rand -base64 32` |
| `FRONTEND_URL` | Frontend domain | `https://yourdomain.com` |

### Documentation

- [Worker README](worker/README.md) - Complete worker documentation
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Setup Verification](worker/SETUP.md) - Verify your setup
- [Database Migrations](worker/MIGRATIONS.md) - Database management

## 📊 Analytics (Optional)

Analytics with Google Analytics 4:

- **Opt-in by default** - requires explicit user consent
- **Anonymous data only** - no personal information collected
- **GDPR compliant** - Google Consent Mode v2
- **User control** - opt out anytime via privacy settings

### Setup

```bash
# Copy environment template
cp .env.example .env

# Add your GA4 Measurement ID
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
```

See [Analytics Setup Guide](docs/ANALYTICS_SETUP.md) for detailed instructions.

## 📚 Documentation

### For Users
- [User Guide](docs/USER_GUIDE.md) - Complete learning guide
- [FAQ](pages/faq.vue) - Frequently asked questions

### For Developers
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Development setup and workflow
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute
- [Module Creation Guide](docs/MODULE_CREATION_GUIDE.md) - Add new learning modules

### Architecture
- [Project Structure](.kiro/steering/structure.md) - Codebase organization
- [Technology Stack](.kiro/steering/tech.md) - Technologies and tools

## ⚙️ Configuration

### Frontend Environment Variables

Create a `.env` file in the project root:

```bash
# Optional: Google Analytics 4
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX

# Authentication backend
NUXT_PUBLIC_API_URL=https://your-worker.workers.dev
```

### Worker Secrets (Optional)

Only needed if deploying the authentication backend. See [worker/README.md](worker/README.md) for details.

## 🏗️ Project Structure

```
.
├── algorithms/          # ML algorithm implementations
│   ├── advanced/       # Neural networks, PCA, t-SNE
│   ├── classification/ # KNN, decision trees, SVM
│   ├── clustering/     # K-means, hierarchical
│   ├── optimization/   # Gradient descent variants
│   ├── preprocessing/  # Scaling, encoding, imputation
│   └── regression/     # Linear, logistic regression
├── components/          # Vue components
│   ├── layout/         # Header, footer, navigation
│   ├── modules/        # Module-specific UI
│   ├── shared/         # Reusable components
│   └── visualizations/ # Chart wrappers
├── composables/         # Vue composables (reusable logic)
├── content/            # Learning content (markdown + JSON)
│   └── modules/        # Organized by domain
├── pages/              # Nuxt pages (auto-routing)
├── stores/             # Pinia state management
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── worker/             # Cloudflare Worker (auth backend)
└── service-workers/    # Web Workers (heavy computation)
```

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 (Vue 3 + TypeScript)
- **State Management**: Pinia with persistence
- **Styling**: Tailwind CSS
- **Visualizations**: Chart.js, D3.js, Plotly.js
- **Backend**: Cloudflare Workers + D1 (optional)
- **Testing**: Vitest
- **Build**: Vite with static site generation

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Contribution Guidelines

- Read the [Contributing Guide](docs/CONTRIBUTING.md) 


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


Made with ❤️ for learners everywhere

