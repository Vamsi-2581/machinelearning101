/**
 * Progress tracking types
 */

export interface Bookmark {
  id: string;
  moduleId: string;
  name: string;
  parameters: Record<string, any>;
  timestamp: number;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  quizScore?: number;
  lastVisited: number;
  timeSpent: number;
}
