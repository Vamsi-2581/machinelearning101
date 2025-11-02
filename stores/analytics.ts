import { defineStore } from 'pinia';
import type { AnalyticsEvent, AnalyticsEventType } from '~/types/analytics';

/**
 * Analytics Store
 * 
 * Manages usage tracking and analytics with privacy controls.
 * All tracking is anonymous and respects user opt-in/opt-out preferences.
 * Uses Pinia persistence plugin for localStorage.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.6
 */

export interface AnalyticsState {
  events: AnalyticsEvent[];
  sessionStart: number;
  optedIn: boolean;
  anonymousId: string;
  initialized: boolean;
}

const MAX_EVENTS = 100; // Keep only recent events in memory

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => ({
    events: [],
    sessionStart: Date.now(),
    optedIn: false, // Default to opt-out for privacy
    anonymousId: '',
    initialized: false,
  }),

  persist: {
      key: 'ml-platform-analytics-config',
      
  },

  getters: {
    /**
     * Check if analytics is enabled
     */
    isEnabled: (state): boolean => {
      return state.optedIn;
    },

    /**
     * Get session duration in minutes
     */
    sessionDuration: (state): number => {
      const duration = Date.now() - state.sessionStart;
      return Math.round(duration / 60000);
    },

    /**
     * Get events by type
     */
    getEventsByType: (state) => {
      return (type: AnalyticsEventType): AnalyticsEvent[] => {
        return state.events.filter(e => e.type === type);
      };
    },

    /**
     * Get event count
     */
    eventCount: (state): number => {
      return state.events.length;
    },
  },

  actions: {
    /**
     * Track a generic event
     */
    trackEvent(type: AnalyticsEventType, data: Record<string, any> = {}): void {
      if (!this.optedIn) return;

      const event: AnalyticsEvent = {
        type,
        timestamp: Date.now(),
        data: {
          ...data,
          sessionId: this.anonymousId,
          sessionDuration: this.sessionDuration,
        },
      };

      this.events.push(event);

      // Keep only recent events to avoid memory issues
      if (this.events.length > MAX_EVENTS) {
        this.events.shift();
      }

      // Send to analytics service (placeholder for future implementation)
      this.sendToAnalyticsService(event);
    },

    /**
     * Track page view
     */
    trackPageView(page: string, title?: string): void {
      this.trackEvent('page_view', {
        page,
        title,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });
    },

    /**
     * Track module visit
     */
    trackModuleVisit(moduleId: string, moduleName: string): void {
      this.trackEvent('module_visit', {
        moduleId,
        moduleName,
      });
    },

    /**
     * Track interaction (parameter change, button click, etc.)
     */
    trackInteraction(moduleId: string, action: string, details?: Record<string, any>): void {
      this.trackEvent('interaction', {
        moduleId,
        action,
        ...details,
      });
    },

    /**
     * Track parameter change
     */
    trackParameterChange(moduleId: string, parameter: string, value: any): void {
      this.trackEvent('parameter_change', {
        moduleId,
        parameter,
        value,
      });
    },

    /**
     * Track algorithm execution
     */
    trackAlgorithmRun(moduleId: string, parameters: Record<string, any>, duration?: number): void {
      this.trackEvent('algorithm_run', {
        moduleId,
        parameters,
        duration,
      });
    },

    /**
     * Track quiz completion
     */
    trackQuizComplete(moduleId: string, score: number, totalQuestions: number): void {
      this.trackEvent('quiz_complete', {
        moduleId,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
      });
    },

    /**
     * Track quiz answer
     */
    trackQuizAnswer(moduleId: string, questionId: string, correct: boolean): void {
      this.trackEvent('quiz_answer', {
        moduleId,
        questionId,
        correct,
      });
    },

    /**
     * Track module completion
     */
    trackModuleComplete(moduleId: string): void {
      this.trackEvent('module_complete', {
        moduleId,
      });
    },

    /**
     * Track bookmark addition
     */
    trackBookmarkAdd(moduleId: string): void {
      this.trackEvent('bookmark_add', {
        moduleId,
      });
    },

    /**
     * Set opt-in preference
     */
    setOptIn(value: boolean): void {
      this.optedIn = value;
      // Persistence handled automatically by plugin

      // Track opt-in/opt-out event (only if opting in)
      if (value) {
        this.trackEvent('interaction', {
          action: 'analytics_opt_in',
        });
      } else {
        // Clear events when opting out
        this.events = [];
      }
    },

    /**
     * Generate anonymous ID
     */
    generateAnonymousId(): string {
      return `anon-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    },

    /**
     * Initialize analytics
     */
    initialize(): void {
      if (this.initialized) return;

      // Persistence plugin handles loading from localStorage
      if (!this.anonymousId) {
        this.anonymousId = this.generateAnonymousId();
        // Persistence handled automatically by plugin
      }

      this.sessionStart = Date.now();
      this.initialized = true;

      // Track session start if opted in
      if (this.optedIn) {
        this.trackEvent('interaction', {
          action: 'session_start',
        });
      }
    },

    /**
     * Send event to analytics service
     * Integrates with Google Analytics via nuxt-gtag
     */
    sendToAnalyticsService(event: AnalyticsEvent): void {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event.type, event.data);
      }

      // Send to Google Analytics if available (client-side only)
      if (typeof window !== 'undefined') {
        try {
          // Access gtag from window (injected by nuxt-gtag)
          const gtag = (window as any).gtag;
          
          if (gtag) {
            // Map event types to GA4 event names
            const eventName = this.mapEventTypeToGA4Name(event.type);
            
            // Extract relevant params for GA4
            const params = this.extractGA4Params(event.data);
            
            // Send event to GA4
            gtag('event', eventName, params);
          }
        } catch (error) {
          console.error('[Analytics] Error sending to Google Analytics:', error);
        }
      }
    },

    /**
     * Map internal event types to GA4-friendly names
     */
    mapEventTypeToGA4Name(type: AnalyticsEventType): string {
      const mapping: Record<AnalyticsEventType, string> = {
        page_view: 'page_view',
        module_visit: 'module_visit',
        parameter_change: 'parameter_change',
        algorithm_run: 'algorithm_run',
        quiz_complete: 'quiz_complete',
        quiz_answer: 'quiz_answer',
        bookmark_add: 'bookmark_add',
        module_complete: 'module_complete',
        interaction: 'interaction',
      };
      return mapping[type] || type;
    },

    /**
     * Extract GA4-compatible params from event data
     * GA4 accepts string, number, and boolean values
     */
    extractGA4Params(data: Record<string, unknown>): Record<string, string | number | boolean> {
      const params: Record<string, string | number | boolean> = {};
      
      for (const [key, value] of Object.entries(data)) {
        // Skip sessionId and sessionDuration as they're internal
        if (key === 'sessionId' || key === 'sessionDuration') continue;
        
        // Only include primitive types
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          params[key] = value;
        } else if (value !== null && value !== undefined) {
          // Convert objects/arrays to JSON strings
          params[key] = JSON.stringify(value);
        }
      }
      
      return params;
    },

    /**
     * Clear all analytics data
     */
    clearData(): void {
      this.events = [];
    },

    /**
     * Reset analytics (for testing or user request)
     */
    reset(): void {
      this.events = [];
      this.anonymousId = this.generateAnonymousId();
      this.sessionStart = Date.now();
      // Persistence handled automatically by plugin
    },
  },
});
