/**
 * Plausible Analytics Composable
 * 
 * Provides integration with Plausible Analytics for privacy-focused tracking.
 * Uses Nuxt Scripts module for optimal loading.
 * 
 * Requirements: 11.1, 11.3
 */

export interface PlausibleOptions {
  domain: string;
  apiHost?: string;
  trackLocalhost?: boolean;
}

export interface PlausibleEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
  url?: string;
}

/**
 * Composable for Plausible Analytics integration
 */
export function usePlausible() {
  const config = useRuntimeConfig();
  const analyticsStore = useAnalyticsStore();

  /**
   * Check if Plausible is loaded and available
   */
  const isLoaded = computed(() => {
    if (typeof window === 'undefined') return false;
    return typeof (window as any).plausible === 'function';
  });

  /**
   * Track a custom event in Plausible
   */
  const trackEvent = (eventName: string, props?: Record<string, string | number | boolean>) => {
    // Only track if user has opted in
    if (!analyticsStore.optedIn) return;

    if (!isLoaded.value) {
      console.warn('[Plausible] Analytics not loaded yet');
      return;
    }

    try {
      const plausible = (window as any).plausible;
      
      if (props) {
        plausible(eventName, { props });
      } else {
        plausible(eventName);
      }
    } catch (error) {
      console.error('[Plausible] Error tracking event:', error);
    }
  };

  /**
   * Track a page view (Plausible does this automatically, but can be called manually)
   */
  const trackPageView = (url?: string) => {
    if (!analyticsStore.optedIn) return;

    if (!isLoaded.value) return;

    try {
      const plausible = (window as any).plausible;
      plausible('pageview', { u: url || window.location.href });
    } catch (error) {
      console.error('[Plausible] Error tracking page view:', error);
    }
  };

  /**
   * Track module visit
   */
  const trackModuleVisit = (moduleId: string, moduleName: string) => {
    trackEvent('Module Visit', {
      module_id: moduleId,
      module_name: moduleName,
    });
  };

  /**
   * Track parameter change
   */
  const trackParameterChange = (moduleId: string, parameter: string, value: string | number) => {
    trackEvent('Parameter Change', {
      module_id: moduleId,
      parameter,
      value: String(value),
    });
  };

  /**
   * Track algorithm run
   */
  const trackAlgorithmRun = (moduleId: string, duration?: number) => {
    const props: Record<string, string | number> = {
      module_id: moduleId,
    };
    
    if (duration !== undefined) {
      props.duration_ms = duration;
    }

    trackEvent('Algorithm Run', props);
  };

  /**
   * Track quiz completion
   */
  const trackQuizComplete = (moduleId: string, score: number, totalQuestions: number) => {
    trackEvent('Quiz Complete', {
      module_id: moduleId,
      score,
      total_questions: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
    });
  };

  /**
   * Track quiz answer
   */
  const trackQuizAnswer = (moduleId: string, questionId: string, correct: boolean) => {
    trackEvent('Quiz Answer', {
      module_id: moduleId,
      question_id: questionId,
      correct: correct ? 'true' : 'false',
    });
  };

  /**
   * Track module completion
   */
  const trackModuleComplete = (moduleId: string) => {
    trackEvent('Module Complete', {
      module_id: moduleId,
    });
  };

  /**
   * Track bookmark addition
   */
  const trackBookmarkAdd = (moduleId: string) => {
    trackEvent('Bookmark Add', {
      module_id: moduleId,
    });
  };

  /**
   * Track generic interaction
   */
  const trackInteraction = (action: string, props?: Record<string, string | number | boolean>) => {
    trackEvent('Interaction', {
      action,
      ...props,
    });
  };

  return {
    isLoaded,
    trackEvent,
    trackPageView,
    trackModuleVisit,
    trackParameterChange,
    trackAlgorithmRun,
    trackQuizComplete,
    trackQuizAnswer,
    trackModuleComplete,
    trackBookmarkAdd,
    trackInteraction,
  };
}
