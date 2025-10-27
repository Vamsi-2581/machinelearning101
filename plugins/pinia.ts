/**
 * Pinia Plugin
 * 
 * Initializes stores on client-side. Persistence is handled by pinia-plugin-persistedstate.
 */

export default defineNuxtPlugin(() => {
  // Initialize stores on client-side only
  if (process.client) {
    const analyticsStore = useAnalyticsStore();

    // Initialize analytics store (sets up session)
    analyticsStore.initialize();

    // Track initial page view if analytics is enabled
    if (analyticsStore.isEnabled) {
      analyticsStore.trackPageView(window.location.pathname);
    }
  }
});
