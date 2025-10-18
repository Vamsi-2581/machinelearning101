# Core Web Vitals Optimization

This document outlines the optimizations implemented to improve Core Web Vitals scores for ML Simplified.

## Core Web Vitals Metrics

### 1. Largest Contentful Paint (LCP)
**Target: < 2.5 seconds**

LCP measures loading performance. It marks the point when the largest content element becomes visible.

#### Optimizations Implemented:

- **Image Optimization**
  - Using `@nuxt/image` module for automatic image optimization
  - Lazy loading images below the fold
  - Proper image sizing with `width` and `height` attributes
  - WebP format with fallbacks

- **Font Optimization**
  - Using `@nuxt/fonts` module for optimal font loading
  - Font preloading for critical fonts
  - Font-display: swap to prevent invisible text

- **Code Splitting**
  - Manual chunks for visualization libraries (Plotly, D3, Chart.js)
  - Domain-specific algorithm bundles
  - Lazy loading of non-critical components

- **Static Site Generation**
  - Pre-rendering all pages at build time
  - No server-side rendering delays
  - Instant page loads from CDN

- **Resource Hints**
  - DNS prefetch for external resources
  - Preconnect to critical origins
  - Preload critical resources

### 2. First Input Delay (FID) / Interaction to Next Paint (INP)
**Target: < 100ms (FID) / < 200ms (INP)**

FID/INP measures interactivity. It quantifies the delay between user interaction and browser response.

#### Optimizations Implemented:

- **Web Workers**
  - Heavy computations (algorithm training) run in Web Workers
  - Main thread remains responsive during calculations
  - Progress updates without blocking UI

- **Debouncing**
  - Parameter changes debounced (100ms)
  - Prevents excessive re-renders
  - Smooth user experience

- **requestAnimationFrame**
  - Smooth animations using RAF
  - 60fps target for visualizations
  - GPU-accelerated transforms

- **Event Delegation**
  - Efficient event handling
  - Minimal event listeners
  - Proper cleanup on unmount

- **Code Optimization**
  - Typed arrays for numerical operations
  - Memoization for expensive calculations
  - Virtual scrolling for long lists

### 3. Cumulative Layout Shift (CLS)
**Target: < 0.1**

CLS measures visual stability. It quantifies unexpected layout shifts during page load.

#### Optimizations Implemented:

- **Image Dimensions**
  - All images have explicit width/height
  - Aspect ratio boxes prevent layout shifts
  - Skeleton loaders for dynamic content

- **Font Loading**
  - Font-display: swap prevents FOIT
  - Fallback fonts match metrics
  - No layout shift when fonts load

- **Dynamic Content**
  - Reserved space for loading states
  - Skeleton screens for async content
  - Smooth transitions between states

- **CSS Containment**
  - CSS contain property for isolated components
  - Transform-based animations (no layout changes)
  - Fixed heights for dynamic sections

## Implementation Details

### Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Image optimization
  image: {
    formats: ['webp', 'avif', 'jpeg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // Font optimization
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  },

  // Code splitting
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'viz-plotly': ['plotly.js'],
            'viz-d3': ['d3'],
            'algorithms-regression': ['~/algorithms/regression/*'],
            // ... more chunks
          }
        }
      }
    }
  },

  // Static generation
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [/* all routes */]
    }
  }
})
```

### Component Optimizations

#### Lazy Loading Components

```vue
<script setup>
// Lazy load heavy components
const PlotlyChart = defineAsyncComponent(() =>
  import('~/components/visualizations/PlotlyChart.vue')
)
</script>
```

#### Image Optimization

```vue
<template>
  <NuxtImg
    src="/hero-image.jpg"
    width="1200"
    height="600"
    alt="ML Simplified Hero"
    loading="lazy"
    format="webp"
  />
</template>
```

#### Skeleton Loaders

```vue
<template>
  <div v-if="loading" class="skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-content"></div>
  </div>
  <div v-else>
    <!-- Actual content -->
  </div>
</template>
```

### Performance Monitoring

#### Web Vitals Tracking

```typescript
// composables/useWebVitals.ts
import { onCLS, onFID, onLCP, onINP } from 'web-vitals'

export function useWebVitals() {
  onCLS(metric => {
    console.log('CLS:', metric.value)
    // Send to analytics
  })

  onFID(metric => {
    console.log('FID:', metric.value)
    // Send to analytics
  })

  onLCP(metric => {
    console.log('LCP:', metric.value)
    // Send to analytics
  })

  onINP(metric => {
    console.log('INP:', metric.value)
    // Send to analytics
  })
}
```

## Testing

### Tools

1. **Lighthouse**
   - Run in Chrome DevTools
   - CI/CD integration
   - Target: 90+ score

2. **PageSpeed Insights**
   - Test real-world performance
   - Field data from CrUX
   - Target: Good for all metrics

3. **WebPageTest**
   - Detailed waterfall analysis
   - Multiple locations/devices
   - Filmstrip view

### Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Generate static site
npm run generate
```

## Monitoring

### Real User Monitoring (RUM)

- Track Core Web Vitals in production
- Segment by device type, connection speed
- Alert on regressions
- Monthly performance reviews

### Synthetic Monitoring

- Automated Lighthouse runs on deploy
- Performance budgets in CI/CD
- Fail builds on regressions
- Track trends over time

## Best Practices

### Do's

✅ Use static site generation
✅ Lazy load below-the-fold content
✅ Optimize images (WebP, proper sizing)
✅ Use Web Workers for heavy computation
✅ Implement code splitting
✅ Add resource hints (preconnect, dns-prefetch)
✅ Use CSS containment
✅ Debounce user inputs
✅ Reserve space for dynamic content
✅ Monitor Core Web Vitals

### Don'ts

❌ Load large libraries on initial page load
❌ Block main thread with heavy computations
❌ Use layout-shifting animations
❌ Load images without dimensions
❌ Use render-blocking resources
❌ Ignore performance budgets
❌ Skip lazy loading
❌ Use synchronous scripts
❌ Forget to test on real devices
❌ Ignore field data

## Performance Budget

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| LCP | < 2.5s | TBD | 🟡 |
| FID | < 100ms | TBD | 🟡 |
| CLS | < 0.1 | TBD | 🟡 |
| Total Bundle Size | < 500KB | TBD | 🟡 |
| First Load JS | < 200KB | TBD | 🟡 |
| Lighthouse Score | > 90 | TBD | 🟡 |

## Next Steps

1. ✅ Implement core optimizations
2. ⏳ Run Lighthouse audit
3. ⏳ Measure real-world performance
4. ⏳ Set up performance monitoring
5. ⏳ Create performance dashboard
6. ⏳ Establish performance budgets
7. ⏳ Automate performance testing in CI/CD

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Nuxt Performance](https://nuxt.com/docs/guide/concepts/rendering#performance)
