# Technology Stack

## Framework & Core

- **Nuxt 4** - Vue.js meta-framework with SSR/SSG support
- **Vue 3** - Composition API with TypeScript
- **TypeScript** - Strict mode enabled with type checking
- **Pinia** - State management with persistence
- **Tailwind CSS** - Utility-first styling

## Visualization Libraries

- **Chart.js** - 2D charts and graphs
- **D3.js** - Advanced data visualizations
- **Plotly.js** - Interactive 3D plots and scientific visualizations

## Additional Modules

- `@nuxt/fonts` - Font optimization
- `@nuxt/icon` - Icon system
- `@nuxt/image` - Image optimization
- `@nuxt/scripts` - Script loading (analytics)
- `@pinia/nuxt` - Pinia integration

## Build & Development

### Common Commands

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

### Build Configuration

- **Static Site Generation**: Configured for static deployment
- **Code Splitting**: Manual chunks for visualization libraries
- **TypeScript**: Strict mode with type checking enabled
- **Path Aliases**: `@`, `~`, `algorithms`, `components`, `composables`, `stores`, `types`, `utils`

## Deployment

- Static site generation via `nuxt generate`
- Deployable to any static hosting (Netlify, Vercel, GitHub Pages, etc.)
- No server-side runtime required

## Environment Variables

```bash
# Analytics (optional)
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NUXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io
```

## Performance Optimizations

- Web Workers for heavy computations
- Lazy loading of visualization libraries
- Component-level code splitting
- Static site generation for fast initial loads
