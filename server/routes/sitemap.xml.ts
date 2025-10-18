/**
 * Sitemap Generation
 * 
 * Dynamically generates sitemap.xml with all public routes
 * Requirements: 12.6 - SEO optimization
 */

import { defineEventHandler } from 'h3'

// Base URL for the site
const SITE_URL = 'https://mlsimplified.com'

// Static pages
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/why-learn-here', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.5 },
  { url: '/modules', changefreq: 'weekly', priority: 0.9 },
]

// Domain index pages
const domainPages = [
  { url: '/modules/regression', changefreq: 'weekly', priority: 0.8 },
  { url: '/modules/classification', changefreq: 'weekly', priority: 0.8 },
  { url: '/modules/clustering', changefreq: 'weekly', priority: 0.8 },
  { url: '/modules/preprocessing', changefreq: 'weekly', priority: 0.8 },
  { url: '/modules/optimization', changefreq: 'weekly', priority: 0.8 },
  { url: '/modules/advanced', changefreq: 'weekly', priority: 0.8 },
]

// Module pages
const modulePages = [
  // Regression
  { url: '/modules/regression/linear-regression', changefreq: 'monthly', priority: 0.9 },
  
  // Classification
  { url: '/modules/classification/logistic-regression', changefreq: 'monthly', priority: 0.9 },
  
  // Clustering
  { url: '/modules/clustering/k-means', changefreq: 'monthly', priority: 0.9 },
  
  // Preprocessing
  { url: '/modules/preprocessing/feature-scaling', changefreq: 'monthly', priority: 0.9 },
  { url: '/modules/preprocessing/missing-value-imputation', changefreq: 'monthly', priority: 0.9 },
  
  // Optimization
  { url: '/modules/optimization/gradient-descent', changefreq: 'monthly', priority: 0.9 },
  
  // Advanced
  { url: '/modules/advanced/neural-network', changefreq: 'monthly', priority: 0.9 },
  { url: '/modules/advanced/pca', changefreq: 'monthly', priority: 0.9 },
  { url: '/modules/advanced/tsne', changefreq: 'monthly', priority: 0.9 },
]

// Combine all pages
const allPages = [...staticPages, ...domainPages, ...modulePages]

/**
 * Generate sitemap XML
 */
function generateSitemap(): string {
  const lastmod = new Date().toISOString().split('T')[0]
  
  const urls = allPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export default defineEventHandler((event) => {
  const sitemap = generateSitemap()
  
  // Set content type
  event.node.res.setHeader('Content-Type', 'application/xml')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  return sitemap
})
