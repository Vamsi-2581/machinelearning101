/**
 * Module Tracking Composable
 * 
 * Tracks time spent on modules and other module-specific analytics.
 * 
 * Requirements: 11.1, 11.2
 */

export function useModuleTracking(moduleId: string, moduleName: string) {
  const analyticsStore = useAnalyticsStore();
  const startTime = ref<number>(Date.now());
  const timeSpent = ref<number>(0);
  let intervalId: NodeJS.Timeout | null = null;

  /**
   * Start tracking time on module
   */
  const startTracking = () => {
    startTime.value = Date.now();
    
    // Update time spent every 10 seconds
    intervalId = setInterval(() => {
      timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000);
    }, 10000);
  };

  /**
   * Stop tracking and send final time
   */
  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    const finalTimeSpent = Math.floor((Date.now() - startTime.value) / 1000);
    
    // Track time spent if significant (more than 10 seconds)
    if (finalTimeSpent > 10) {
      analyticsStore.trackInteraction(moduleId, 'time_spent', {
        moduleName,
        timeSpent: finalTimeSpent,
      });
    }
  };

  /**
   * Track scroll depth
   */
  const trackScrollDepth = (depth: number) => {
    // Track at 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => depth >= m && depth < m + 5);
    
    if (milestone) {
      analyticsStore.trackInteraction(moduleId, 'scroll_depth', {
        moduleName,
        depth: milestone,
      });
    }
  };

  /**
   * Track section view
   */
  const trackSectionView = (sectionName: string) => {
    analyticsStore.trackInteraction(moduleId, 'section_view', {
      moduleName,
      section: sectionName,
    });
  };

  /**
   * Track visualization interaction
   */
  const trackVisualizationInteraction = (action: string, details?: Record<string, any>) => {
    analyticsStore.trackInteraction(moduleId, 'visualization_interaction', {
      moduleName,
      action,
      ...details,
    });
  };

  // Cleanup on unmount
  onUnmounted(() => {
    stopTracking();
  });

  return {
    startTracking,
    stopTracking,
    trackScrollDepth,
    trackSectionView,
    trackVisualizationInteraction,
    timeSpent: readonly(timeSpent),
  };
}
