/**
 * Pinia Plugin
 * 
 * Initializes stores and sets up auto-persistence for progress store
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize stores on client-side only
  if (process.client) {
    const progressStore = useProgressStore();
    const analyticsStore = useAnalyticsStore();

    // Initialize progress store (loads from localStorage)
    progressStore.initialize();

    // Initialize analytics store (loads config from localStorage)
    analyticsStore.initialize();

    // Track initial page view if analytics is enabled
    if (analyticsStore.isEnabled) {
      analyticsStore.trackPageView(window.location.pathname);
    }

    // Save progress periodically (every 30 seconds)
    const saveInterval = setInterval(() => {
      progressStore.saveToStorage();
    }, 30000);

    // Cleanup on unmount
    nuxtApp.hook('app:unmounted', () => {
      clearInterval(saveInterval);
      progressStore.saveToStorage();
    });

    // Save progress before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        progressStore.saveToStorage();
      });
    }
  }
});
