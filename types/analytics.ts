/**
 * Analytics tracking types
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'module_visit'
  | 'parameter_change'
  | 'algorithm_run'
  | 'quiz_complete'
  | 'quiz_answer'
  | 'bookmark_add'
  | 'module_complete'
  | 'interaction';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  data: Record<string, any>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  optedIn: boolean;
  anonymousId?: string;
}
