# Performance Checklist

This checklist helps ensure the ML Learning Platform maintains optimal performance.

## Build Performance

### Bundle Size

- [ ] Total bundle size < 500KB (gzipped)
- [ ] Main chunk < 200KB
- [ ] Vendor chunk < 150KB
- [ ] Each algorithm chunk < 50KB
- [ ] Each visualization library chunk < 100KB

**Check with:**
```bash
npm run build
# Review .output/public/_nuxt/ file sizes
```

### Code Splitting

- [ ] Algorithms split by domain
- [ ] Visualization libraries lazy-loaded
- [ ] Module content lazy-loaded
- [ ] Route-based code splitting working
- [ ] Dynamic imports used for heavy components

**Verify in:**
- `nuxt.config.ts` - manualChunks configuration
- Browser DevTools Network tab

### Tree Shaking

- [ ] Unused code eliminated
- [ ] No duplicate dependencies
- [ ] Lodash/utility libraries tree-shaken
- [ ] CSS purged of unused styles

**Check with:**
```bash
npm run build
# Review bundle analyzer if available
```

## Runtime Performance

### Core Web Vitals

#### Largest Contentful Paint (LCP)
- [ ] LCP < 2.5s on 3G
- [ ] LCP < 1.5s on 4G
- [ ] Critical CSS inlined
- [ ] Images optimized and lazy-loaded
- [ ] Fonts preloaded

**Test with:**
- Lighthouse
- PageSpeed Insights
- WebPageTest

#### First Input Delay (FID)
- [ ] FID < 100ms
- [ ] No long tasks blocking main thread
- [ ] Heavy computations in Web Workers
- [ ] Event handlers optimized
- [ ] Third-party scripts deferred

**Test with:**
- Chrome DevTools Performance tab
- Lighthouse

#### Cumulative Layout Shift (CLS)
- [ ] CLS < 0.1
- [ ] Image dimensions specified
- [ ] Font loading optimized (no FOIT/FOUT)
- [ ] No content jumping during load
- [ ] Skeleton loaders for dynamic content

**Test with:**
- Lighthouse
- Layout Shift GIF Generator

### JavaScript Performance

- [ ] No blocking scripts
- [ ] Scripts deferred or async
- [ ] Minimal main thread work
- [ ] Efficient algorithms (O(n) or better where possible)
- [ ] Debounced/throttled event handlers
- [ ] Memoization for expensive calculations

**Check with:**
```bash
# Run performance profiling
# Chrome DevTools > Performance > Record
```

### Rendering Performance

- [ ] 60fps during interactions
- [ ] Smooth animations (CSS transforms)
- [ ] Virtual scrolling for long lists
- [ ] Canvas for large datasets (>1000 points)
- [ ] requestAnimationFrame for animations
- [ ] No layout thrashing

**Test with:**
- Chrome DevTools Performance tab
- FPS meter
- Rendering tab (Paint flashing)

### Memory Performance

- [ ] No memory leaks
- [ ] Event listeners cleaned up
- [ ] Observers disconnected
- [ ] Timers cleared
- [ ] Large objects garbage collected
- [ ] Typed arrays for numerical data

**Test with:**
```bash
# Chrome DevTools > Memory > Take heap snapshot
# Compare before/after navigation
```

## Network Performance

### Asset Optimization

- [ ] Images compressed (WebP/AVIF)
- [ ] Images responsive (srcset)
- [ ] Images lazy-loaded
- [ ] Fonts subset and optimized
- [ ] SVGs optimized
- [ ] CSS minified
- [ ] JavaScript minified

**Tools:**
- ImageOptim / Squoosh
- Font subsetter
- SVGO

### Caching Strategy

- [ ] Static assets cached (1 year)
- [ ] HTML cached appropriately
- [ ] Service worker configured (if applicable)
- [ ] CDN configured
- [ ] Cache-Control headers set

**Verify in:**
- Network tab (Response headers)
- Lighthouse

### Resource Hints

- [ ] DNS prefetch for external domains
- [ ] Preconnect for critical origins
- [ ] Preload for critical resources
- [ ] Prefetch for next-page resources

**Check in:**
- `<head>` section of HTML
- Lighthouse recommendations

## Computation Performance

### Algorithm Optimization

- [ ] Typed arrays used (Float64Array, etc.)
- [ ] Matrix operations optimized
- [ ] Vectorized operations where possible
- [ ] Early termination conditions
- [ ] Convergence detection
- [ ] Batch processing for large datasets

**Test with:**
```bash
# Profile algorithm execution time
console.time('algorithm')
// ... algorithm code
console.timeEnd('algorithm')
```

### Web Workers

- [ ] Heavy algorithms in workers
- [ ] Progress reporting implemented
- [ ] Error handling in workers
- [ ] Worker pooling for multiple tasks
- [ ] Transferable objects used

**Verify:**
- Check worker files exist
- Test training doesn't block UI
- Monitor worker performance

### Caching & Memoization

- [ ] Results cached when parameters unchanged
- [ ] Expensive calculations memoized
- [ ] Dataset preprocessing cached
- [ ] Visualization data cached
- [ ] Cache invalidation working

**Test:**
- Train with same parameters twice
- Verify second run is faster

## Mobile Performance

### Mobile-Specific Optimizations

- [ ] Touch targets ≥ 44x44px
- [ ] Reduced animations on mobile
- [ ] Smaller images for mobile
- [ ] Reduced JavaScript for mobile
- [ ] Optimized for 3G networks

**Test on:**
- Real devices (iOS, Android)
- Chrome DevTools device emulation
- Slow 3G throttling

### Responsive Performance

- [ ] Fast on all screen sizes
- [ ] No horizontal scroll
- [ ] Readable text without zoom
- [ ] Accessible form controls
- [ ] Optimized for portrait/landscape

**Test:**
- Multiple device sizes
- Orientation changes
- Text zoom to 200%

## Accessibility Performance

- [ ] Keyboard navigation smooth
- [ ] Screen reader performance good
- [ ] Focus indicators visible
- [ ] ARIA live regions not overused
- [ ] No accessibility-blocking scripts

**Test with:**
- Keyboard only
- Screen reader (NVDA, JAWS, VoiceOver)
- Lighthouse accessibility audit

## Testing Procedures

### Automated Testing

```bash
# Run Lighthouse
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse > Run audit

# Check bundle sizes
npm run build
ls -lh .output/public/_nuxt/

# Run performance tests (if configured)
npm run test:performance
```

### Manual Testing

1. **Cold Load Test**
   - Clear cache
   - Hard refresh
   - Measure load time
   - Check for errors

2. **Warm Load Test**
   - Navigate away and back
   - Verify caching works
   - Check load time improvement

3. **Interaction Test**
   - Adjust parameters rapidly
   - Train multiple times
   - Switch between modules
   - Monitor FPS and responsiveness

4. **Memory Test**
   - Use app for 10+ minutes
   - Navigate between pages
   - Take heap snapshots
   - Check for memory growth

5. **Mobile Test**
   - Test on real devices
   - Test on slow networks
   - Test touch interactions
   - Test in different orientations

### Performance Budgets

Set and monitor these budgets:

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| Total JS | 300KB | - | - |
| Total CSS | 50KB | - | - |
| Total Images | 200KB | - | - |
| LCP | 2.5s | - | - |
| FID | 100ms | - | - |
| CLS | 0.1 | - | - |
| Time to Interactive | 3.5s | - | - |

## Optimization Priorities

### High Priority (Do First)
1. Optimize LCP (images, fonts, critical CSS)
2. Eliminate render-blocking resources
3. Implement code splitting
4. Move heavy computations to workers
5. Add loading states and skeletons

### Medium Priority (Do Next)
1. Optimize images (WebP, lazy loading)
2. Implement caching strategies
3. Reduce JavaScript bundle size
4. Optimize animations
5. Add resource hints

### Low Priority (Nice to Have)
1. Implement service worker
2. Add offline support
3. Optimize for 2G networks
4. Implement advanced caching
5. Add performance monitoring

## Monitoring

### Production Monitoring

- [ ] Real User Monitoring (RUM) configured
- [ ] Error tracking (Sentry) configured
- [ ] Performance metrics tracked
- [ ] Core Web Vitals monitored
- [ ] Alerts set up for regressions

### Regular Audits

- [ ] Weekly Lighthouse audits
- [ ] Monthly bundle size review
- [ ] Quarterly performance review
- [ ] User feedback collection
- [ ] Analytics review

## Common Issues & Solutions

### Slow Initial Load
- **Cause:** Large bundle size
- **Solution:** Code splitting, lazy loading, tree shaking

### Janky Animations
- **Cause:** Main thread blocking
- **Solution:** Use CSS transforms, requestAnimationFrame, Web Workers

### High Memory Usage
- **Cause:** Memory leaks, large datasets
- **Solution:** Cleanup listeners, use typed arrays, implement pagination

### Slow Training
- **Cause:** Heavy computation on main thread
- **Solution:** Move to Web Workers, optimize algorithms, reduce epochs

### Poor Mobile Performance
- **Cause:** Large assets, heavy JavaScript
- **Solution:** Responsive images, reduce JS, optimize for mobile

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://github.com/nuxt/nuxt/tree/main/packages/webpack-builder)

## Checklist Summary

Before each release:

- [ ] Run full build and check sizes
- [ ] Run Lighthouse audit (score > 90)
- [ ] Test on slow 3G network
- [ ] Test on real mobile devices
- [ ] Check Core Web Vitals
- [ ] Review bundle analyzer
- [ ] Test all critical user flows
- [ ] Verify no console errors
- [ ] Check memory usage
- [ ] Test accessibility

---

*Last updated: [Date]*  
*Performance is a feature - keep it optimized!*
