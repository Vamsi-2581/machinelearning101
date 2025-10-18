/**
 * Performance Optimization Plugin
 * 
 * Implements various performance optimizations for Core Web Vitals
 * Requirements: 1.5, 14.4 - Performance optimization
 */

export default defineNuxtPlugin(() => {
  // Resource hints for external resources
  if (typeof document !== 'undefined') {
    // DNS prefetch for external domains
    const dnsPrefetch = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    dnsPrefetch.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect to critical origins
    const preconnect = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    preconnect.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Intersection Observer for lazy loading
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    // Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
    })

    // Observe images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))
  }

  // Prefetch on hover for navigation links
  if (typeof document !== 'undefined') {
    let prefetchTimeout: NodeJS.Timeout

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement
      
      if (link && !link.dataset.prefetched) {
        prefetchTimeout = setTimeout(() => {
          const href = link.getAttribute('href')
          if (href) {
            // Prefetch the page
            const linkEl = document.createElement('link')
            linkEl.rel = 'prefetch'
            linkEl.href = href
            document.head.appendChild(linkEl)
            link.dataset.prefetched = 'true'
          }
        }, 100)
      }
    })

    document.addEventListener('mouseout', () => {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout)
      }
    })
  }

  // Performance observer for monitoring
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
            })
          }
        }
      })

      longTaskObserver.observe({ entryTypes: ['longtask'] })

      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any
          if (layoutShift.hadRecentInput) continue
          
          if (layoutShift.value > 0.1) {
            console.warn('Large layout shift detected:', {
              value: layoutShift.value,
              sources: layoutShift.sources,
            })
          }
        }
      })

      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      // PerformanceObserver not supported or error occurred
      console.debug('Performance monitoring not available:', error)
    }
  }

  // Optimize font loading
  if (typeof document !== 'undefined' && 'fonts' in document) {
    // Preload critical fonts
    document.fonts.ready.then(() => {
      console.debug('Fonts loaded')
    })
  }

  // Service Worker registration (for future PWA support)
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    // Uncomment when service worker is implemented
    // navigator.serviceWorker.register('/sw.js').then(registration => {
    //   console.log('Service Worker registered:', registration)
    // }).catch(error => {
    //   console.error('Service Worker registration failed:', error)
    // })
  }
})
