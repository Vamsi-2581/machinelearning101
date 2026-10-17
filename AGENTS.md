## Product Overview

### Machine Learning 101

An interactive, browser-based machine learning learning platform designed for beginners. The platform provides hands-on, visual learning experiences for core ML concepts with zero setup required.

### Core Value Proposition

- **Zero Setup**: Everything runs in the browser - no installations, no backend, no barriers
- **Learn by Doing**: Interactive visualizations with real-time parameter adjustments
- **Visual First**: See algorithms work through rich, interactive visualizations
- **Progressive Learning**: Organized from basic to advanced concepts across ML domains

### Target Audience

Beginners learning machine learning who want to build intuition through experimentation rather than just reading theory.

### Key Features

- Interactive algorithm modules (regression, classification, clustering, preprocessing, optimization)
- Real-time parameter controls with immediate visual feedback
- Guided learning content with explanations and quizzes
- Progress tracking and state persistence
- Performance metrics and evaluation visualizations
- Responsive design for desktop, tablet, and mobile

### Learning Domains

1. **Regression**: Linear regression, logistic regression
2. **Classification**: KNN, decision trees, SVM
3. **Clustering**: K-means, hierarchical clustering
4. **Preprocessing**: Feature scaling, encoding, imputation, feature selection
5. **Optimization**: Gradient descent, Adam, RMSProp, momentum
6. **Advanced**: PCA, t-SNE, neural networks, CNNs, hyperparameter tuning

## Project Structure

### Directory Organization

```
.
├── algorithms/          # ML algorithm implementations
│   ├── advanced/       # Neural networks, PCA, t-SNE
│   ├── classification/ # Logistic regression
│   ├── clustering/     # K-means
│   ├── optimization/   # Gradient descent
│   ├── preprocessing/  # Feature scaling, imputation
│   └── regression/     # Linear regression
│
├── components/         # Vue components
│   ├── layout/        # Layout components (header, footer)
│   ├── modules/       # Module-specific components
│   ├── shared/        # Reusable UI components
│   └── visualizations/ # Visualization components
│
├── composables/        # Vue composables (reusable logic)
├── content/           # Module content (markdown + JSON)
│   └── modules/       # Organized by domain/module
│       └── [domain]/[module]/
│           ├── config.json   # Module configuration
│           ├── content.md    # Learning content
│           └── quiz.json     # Quiz questions
│
├── pages/             # Nuxt pages (auto-routing)
│   └── modules/       # Module pages by domain
│
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── service-workers/   # Web Workers for computation
└── worker/           # Cloudflare workers for backend infra
```

### Key Patterns

#### Algorithm Structure

- All algorithms extend `BaseAlgorithm` from `types/algorithm.ts`
- Implement: `fit()`, `predict()`, `getVisualizationData()`, `getMetrics()`
- Use TypeScript classes with typed parameters
- Include JSDoc comments with requirement references

#### Component Organization

- **Layout**: Page structure (header, footer, navigation)
- **Modules**: Module-specific UI (ModuleLayout, ControlPanel, etc.)
- **Shared**: Reusable components (Button, Input, Select, etc.)
- **Visualizations**: Chart wrappers (Scatter2D, LineChart, Heatmap, etc.)

#### Module Content Structure

Each module has three files in `content/modules/[domain]/[module]/`:

1. **config.json**: Metadata, parameters, datasets, visualizations
2. **content.md**: Learning content with sections
3. **quiz.json**: Quiz questions and answers

#### State Management

- **module.ts**: Algorithm parameters, datasets, results, training state
- **progress.ts**: User progress, completed modules, quiz scores
- **analytics.ts**: Analytics consent and event tracking
- **toast.ts**: Toast notifications

#### Type Definitions

- **algorithm.ts**: Algorithm interfaces and base classes
- **module.ts**: Module configuration and metadata
- **dataset.ts**: Dataset types and structures
- **visualization.ts**: Visualization data types
- **quiz.ts**: Quiz question and answer types

### Naming Conventions

- **Files**: PascalCase for components/classes, kebab-case for pages
- **Components**: PascalCase (e.g., `ModuleLayout.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useModules.ts`)
- **Stores**: camelCase (e.g., `module.ts`)
- **Types**: PascalCase for interfaces/types

### Path Aliases

- `@/` or `~/` - Project root
- `algorithms/` - Algorithm implementations
- `components/` - Vue components
- `composables/` - Composables
- `stores/` - Pinia stores
- `types/` - Type definitions
- `utils/` - Utilities

### Code Style

- TypeScript strict mode enabled
- Composition API for Vue components
- JSDoc comments for public APIs
- Requirement references in comments (e.g., `Requirements: 2.3, 4.1`)
- Accessibility-first component design

## MCP

External Tool Usage Guidelines

### Context7 MCP - Documentation Lookup

When encountering unfamiliar packages, libraries, or dependencies:

1. **First**: Use Context7 MCP tools to gather documentation

   - Resolve library ID: `mcp_Context7_resolve_library_id`
   - Fetch docs: `mcp_Context7_get_library_docs`
   - Focus on: API usage, configuration, integration patterns

2. **Priority libraries for this project**:
   - Nuxt 4, Vue 3, Pinia state management
   - Visualization: Chart.js, D3.js, Plotly.js
   - TypeScript types and patterns

### Playwright MCP - Browser Automation

Use for:

- Accessing documentation sites not available via Context7
- Testing deployed application behavior
- Verifying responsive design and accessibility
- Debugging client-side issues in production builds

### When to Use Which Tool

- **Context7**: API documentation, usage examples, type definitions
- **Playwright**: Live site testing, visual verification, interactive debugging
- **Both**: When Context7 provides API docs but you need to verify behavior in browser

## Tech Stack

Technology Stack

### Framework & Core

- **Nuxt 4** - Vue.js meta-framework with SSR/SSG support
- **Vue 3** - Composition API with TypeScript
- **TypeScript** - Strict mode enabled with type checking
- **Pinia** - State management with persistence
- **Tailwind CSS** - Utility-first styling

### Visualization Libraries

- **Chart.js** - 2D charts and graphs
- **D3.js** - Advanced data visualizations
- **Plotly.js** - Interactive 3D plots and scientific visualizations

### Additional Modules

- `@nuxt/fonts` - Font optimization
- `@nuxt/icon` - Icon system
- `@nuxt/image` - Image optimization
- `@nuxt/scripts` - Script loading (analytics)
- `@pinia/nuxt` - Pinia integration

### Build & Development

#### Common Commands

```bash
# Install dependencies
npm install
 

# Production build (should also be used after making changes to confirm no errors were introduced)
npm run build


# Run unit test using vitest (should also be used after making changes to confirm no errors were introduced)
npm run test

# Preview production build
npm run preview

# Generate static site
npm run generate

# Prepare Nuxt (post-install)
npm run postinstall
```

#### Build Configuration

- **Static Site Generation**: Configured for static deployment
- **Code Splitting**: Manual chunks for visualization libraries
- **TypeScript**: Strict mode with type checking enabled
- **Path Aliases**: `@`, `~`, `algorithms`, `components`, `composables`, `stores`, `types`, `utils`

### Deployment

- Static site generation via `nuxt generate`
- Deployable to any static hosting (Netlify, Vercel, GitHub Pages, etc.)
- No server-side runtime required

### Environment Variables

```bash
# Analytics (optional)
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NUXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io
```

### Performance Optimizations

- Web Workers for heavy computations
- Lazy loading of visualization libraries
- Component-level code splitting
- Static site generation for fast initial loads

## Spec-Driven Development

Feature specs live under `specs/<feature>/` as `requirements.md`, `design.md`, and `tasks.md`.
Use the `/spec` command to author or update a spec. Once a `tasks.md` is written, execute it with the
`executing-plans` skill (review checkpoints between tasks).
