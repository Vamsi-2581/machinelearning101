/**
 * Web Vitals Tracking Composable
 * 
 * Tracks Core Web Vitals metrics and reports them to analytics
 * Requirements: 1.5, 14.4 - Performance optimization
 */

import { onMounted } from 'vue'

export interface WebVitalMetric {
  name: 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

/**
 * Track Core Web Vitals
 */
export function useWebVitals() {
  onMounted(async () => {
    // Only track in production and if analytics is enabled
    if (process.dev) return

    try {
      // Dynamically import web-vitals to avoid bundling in dev
      const { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } = await import('web-vitals')

      // Track Cumulative Layout Shift
      onCLS((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })

      // Track First Input Delay
      onFID((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })

      // Track Largest Contentful Paint
      onLCP((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })

      // Track First Contentful Paint
      onFCP((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })

      // Track Time to First Byte
      onTTFB((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })

      // Track Interaction to Next Paint
      onINP((metric: any) => {
        reportMetric(metric as WebVitalMetric)
      })
    } catch (error) {
      console.error('Failed to load web-vitals:', error)
    }
  })
}

/**
 * Report metric to analytics
 */
function reportMetric(metric: WebVitalMetric) {
  // Log in development
  if (process.dev) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    })
  }

  // Send to analytics in production
  // Note: Analytics integration can be added here when needed
  // Example: Send to custom analytics endpoint
  // fetch('/api/analytics/web-vitals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     metric: metric.name,
  //     value: Math.round(metric.value),
  //     rating: metric.rating,
  //   }),
  // })
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    // Navigation timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Paint timing
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    
    // Resource timing
    resources: performance.getEntriesByType('resource').length,
  }
}

/**
 * Log performance metrics to console
 */
export function logPerformanceMetrics() {
  const metrics = getPerformanceMetrics()
  if (!metrics) return

  console.table({
    'DNS Lookup': `${metrics.dns.toFixed(2)}ms`,
    'TCP Connection': `${metrics.tcp.toFixed(2)}ms`,
    'Time to First Byte': `${metrics.ttfb.toFixed(2)}ms`,
    'Download': `${metrics.download.toFixed(2)}ms`,
    'DOM Interactive': `${metrics.domInteractive.toFixed(2)}ms`,
    'DOM Complete': `${metrics.domComplete.toFixed(2)}ms`,
    'Load Complete': `${metrics.loadComplete.toFixed(2)}ms`,
    'First Contentful Paint': `${metrics.fcp.toFixed(2)}ms`,
    'Resources Loaded': metrics.resources,
  })
}

// No global window extensions needed
