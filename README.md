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

## Analytics Setup

This project uses privacy-focused analytics with Plausible. To enable analytics:

1. Create a [Plausible Analytics](https://plausible.io) account
2. Add your domain to Plausible
3. Set environment variables:

```bash
# Copy the example file
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

### Technical Documentation
- [Analytics Setup Guide](docs/ANALYTICS_SETUP.md) - Configure Plausible Analytics
- [Analytics Integration Guide](docs/ANALYTICS_INTEGRATION.md) - Add tracking to new modules
- [Project Structure](.kiro/steering/structure.md) - Understand the codebase
- [Technology Stack](.kiro/steering/tech.md) - Technologies used
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) - Recent implementation details

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
└── workers/            # Web Workers for heavy computation
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

