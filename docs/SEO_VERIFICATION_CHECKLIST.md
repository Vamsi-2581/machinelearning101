# SEO Verification Checklist

Use this checklist to verify that all SEO optimizations are working correctly before and after deployment.

## Pre-Deployment Checks

### Build Verification
- [x] Build completes without errors (`npm run build`)
- [x] All routes are prerendered (45 routes)
- [x] Sitemap.xml is generated
- [x] Robots.txt is present
- [x] No TypeScript errors
- [x] Bundle sizes are reasonable

### Meta Tags Verification

#### Home Page (/)
- [ ] Title includes "ML Simplified"
- [ ] Description is compelling and keyword-rich
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URL is correct
- [ ] Structured data (Website + Organization) present

#### About Page (/about)
- [ ] Unique title
- [ ] Unique description
- [ ] Organization structured data present

#### Why Learn Here (/why-learn-here)
- [ ] Unique title
- [ ] Unique description
- [ ] FAQ structured data present

#### Contact Page (/contact)
- [ ] Unique title
- [ ] Unique description
- [ ] Contact information visible

#### Privacy Page (/privacy)
- [ ] Unique title
- [ ] Unique description
- [ ] Privacy policy content

#### Module Index Pages
- [ ] /modules - Breadcrumb structured data
- [ ] /modules/regression - Breadcrumb structured data
- [ ] /modules/classification - Breadcrumb structured data
- [ ] /modules/clustering - Breadcrumb structured data
- [ ] /modules/preprocessing - Breadcrumb structured data
- [ ] /modules/optimization - Breadcrumb structured data
- [ ] /modules/advanced - Breadcrumb structured data

#### Individual Module Pages
- [ ] Linear Regression - Course + Breadcrumb structured data
- [ ] All module pages have unique titles
- [ ] All module pages have unique descriptions

#### User Pages
- [ ] /progress - Has noindex meta tag
- [ ] /bookmarks - Has noindex meta tag

### Sitemap Verification
- [x] Sitemap.xml is accessible at /sitemap.xml
- [x] Contains all public pages
- [x] Excludes user-specific pages (/progress, /bookmarks)
- [x] Has proper XML structure
- [x] Includes lastmod, changefreq, priority
- [x] All URLs use https://machinelearningsimplified.com

### Robots.txt Verification
- [x] Robots.txt is accessible at /robots.txt
- [x] Allows all crawlers
- [x] Disallows /progress
- [x] Disallows /bookmarks
- [x] References sitemap.xml

### Performance Verification
- [ ] Run `./scripts/check-performance.sh`
- [ ] JavaScript bundle < 1MB
- [ ] CSS bundle < 200KB
- [ ] No large images (>500KB)
- [ ] web-vitals package installed
- [ ] @nuxt/image configured
- [ ] @nuxt/fonts configured

## Post-Deployment Checks

### Live Site Verification
- [ ] Site is accessible via HTTPS
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is accessible

### SEO Tools Testing

#### Google Search Console
- [ ] Submit sitemap
- [ ] Verify ownership
- [ ] Check for crawl errors
- [ ] Monitor index coverage
- [ ] Check mobile usability

#### Lighthouse Audit
- [ ] Run on home page
- [ ] Run on module pages
- [ ] SEO score > 95
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90

#### PageSpeed Insights
- [ ] Test home page
- [ ] Test module pages
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Check mobile and desktop

#### Rich Results Test
- [ ] Test home page structured data
- [ ] Test module page structured data
- [ ] Verify breadcrumb markup
- [ ] Verify course markup
- [ ] Verify organization markup
- [ ] Verify FAQ markup

#### Mobile-Friendly Test
- [ ] Test home page
- [ ] Test module pages
- [ ] Verify responsive design
- [ ] Check touch targets
- [ ] Verify text readability

### Social Media Sharing

#### Open Graph
- [ ] Share on Facebook - preview looks good
- [ ] Share on LinkedIn - preview looks good
- [ ] Image displays correctly
- [ ] Title and description correct

#### Twitter Card
- [ ] Share on Twitter - card displays
- [ ] Image displays correctly
- [ ] Title and description correct

### Core Web Vitals Monitoring
- [ ] Web Vitals tracking active
- [ ] Metrics being logged
- [ ] No console errors
- [ ] Performance plugin loaded

## Testing Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check performance
./scripts/check-performance.sh

# Run Lighthouse (after starting preview)
npx lighthouse http://localhost:3000 --view

# Test specific page
npx lighthouse http://localhost:3000/modules/regression/linear-regression --view
```

## External Tools

### Required Tools
1. [Google Search Console](https://search.google.com/search-console)
2. [Lighthouse](https://developers.google.com/web/tools/lighthouse)
3. [PageSpeed Insights](https://pagespeed.web.dev/)
4. [Rich Results Test](https://search.google.com/test/rich-results)
5. [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Optional Tools
1. [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
2. [Ahrefs Site Audit](https://ahrefs.com/site-audit)
3. [SEMrush Site Audit](https://www.semrush.com/siteaudit/)
4. [WebPageTest](https://www.webpagetest.org/)

## Common Issues and Solutions

### Issue: Sitemap not accessible
**Solution:** Check that sitemap.xml is in .output/public/ after build

### Issue: Meta tags not showing
**Solution:** Verify useSEO() is called in page setup

### Issue: Structured data errors
**Solution:** Test with Rich Results Test and fix JSON-LD syntax

### Issue: Poor performance scores
**Solution:** Run performance check script and optimize bundles

### Issue: High CLS score
**Solution:** Add explicit dimensions to images and reserve space for dynamic content

### Issue: Slow LCP
**Solution:** Optimize images, reduce bundle size, use code splitting

## Success Criteria

### SEO
- ✅ All pages have unique titles and descriptions
- ✅ Structured data on appropriate pages
- ✅ Sitemap.xml generated and accessible
- ✅ Robots.txt configured correctly
- ✅ Canonical URLs on all pages
- ✅ Open Graph and Twitter Card tags

### Performance
- ⏳ Lighthouse Performance > 90
- ⏳ LCP < 2.5s
- ⏳ FID < 100ms
- ⏳ CLS < 0.1
- ⏳ Total bundle size < 500KB

### Accessibility
- ⏳ Lighthouse Accessibility > 90
- ⏳ Keyboard navigation works
- ⏳ Screen reader compatible
- ⏳ Color contrast compliant

### Best Practices
- ⏳ Lighthouse Best Practices > 90
- ⏳ HTTPS enabled
- ⏳ No console errors
- ⏳ No security issues

## Notes

- Run checks on both development and production builds
- Test on multiple devices and browsers
- Monitor Core Web Vitals after launch
- Regular SEO audits (monthly)
- Keep documentation updated

## Sign-off

- [ ] All pre-deployment checks completed
- [ ] Build successful
- [ ] No errors or warnings
- [ ] Ready for deployment

**Checked by:** _________________
**Date:** _________________
**Notes:** _________________
