# Project Structure

## Directory Organization

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

## Key Patterns

### Algorithm Structure

- All algorithms extend `BaseAlgorithm` from `types/algorithm.ts`
- Implement: `fit()`, `predict()`, `getVisualizationData()`, `getMetrics()`
- Use TypeScript classes with typed parameters
- Include JSDoc comments with requirement references

### Component Organization

- **Layout**: Page structure (header, footer, navigation)
- **Modules**: Module-specific UI (ModuleLayout, ControlPanel, etc.)
- **Shared**: Reusable components (Button, Input, Select, etc.)
- **Visualizations**: Chart wrappers (Scatter2D, LineChart, Heatmap, etc.)

### Module Content Structure

Each module has three files in `content/modules/[domain]/[module]/`:

1. **config.json**: Metadata, parameters, datasets, visualizations
2. **content.md**: Learning content with sections
3. **quiz.json**: Quiz questions and answers

### State Management

- **module.ts**: Algorithm parameters, datasets, results, training state
- **progress.ts**: User progress, completed modules, quiz scores
- **analytics.ts**: Analytics consent and event tracking
- **toast.ts**: Toast notifications

### Type Definitions

- **algorithm.ts**: Algorithm interfaces and base classes
- **module.ts**: Module configuration and metadata
- **dataset.ts**: Dataset types and structures
- **visualization.ts**: Visualization data types
- **quiz.ts**: Quiz question and answer types

## Naming Conventions

- **Files**: PascalCase for components/classes, kebab-case for pages
- **Components**: PascalCase (e.g., `ModuleLayout.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useModules.ts`)
- **Stores**: camelCase (e.g., `module.ts`)
- **Types**: PascalCase for interfaces/types

## Path Aliases

- `@/` or `~/` - Project root
- `algorithms/` - Algorithm implementations
- `components/` - Vue components
- `composables/` - Composables
- `stores/` - Pinia stores
- `types/` - Type definitions
- `utils/` - Utilities

## Code Style

- TypeScript strict mode enabled
- Composition API for Vue components
- JSDoc comments for public APIs
- Requirement references in comments (e.g., `Requirements: 2.3, 4.1`)
- Accessibility-first component design
