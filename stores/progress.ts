import { defineStore } from 'pinia';
import type { Bookmark } from '~/types/progress';

/**
 * Progress Store
 * 
 * Manages user progress tracking including completed modules,
 * quiz scores, bookmarks, and session data. Persists to localStorage.
 * 
 * Requirements: 9.1, 9.2, 9.4, 9.6
 */

export interface ProgressState {
  completedModules: string[];
  quizScores: Record<string, number>;
  bookmarks: Bookmark[];
  lastVisited: string | null;
  totalTimeSpent: number;
  sessionStart: number;
}

const STORAGE_KEY = 'ml-platform-progress';

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    completedModules: [],
    quizScores: {},
    bookmarks: [],
    lastVisited: null,
    totalTimeSpent: 0,
    sessionStart: Date.now(),
  }),

  getters: {
    /**
     * Calculate overall completion percentage
     * Assumes a total number of modules (can be made dynamic)
     */
    completionPercentage: (state): number => {
      // This will be updated when we know the total number of modules
      const totalModules = 20; // Placeholder
      return state.completedModules.length > 0
        ? Math.round((state.completedModules.length / totalModules) * 100)
        : 0;
    },

    /**
     * Calculate average quiz score
     */
    averageQuizScore: (state): number => {
      const scores = Object.values(state.quizScores);
      if (scores.length === 0) return 0;
      const sum = scores.reduce((acc, score) => acc + score, 0);
      return Math.round(sum / scores.length);
    },

    /**
     * Check if a module is completed
     */
    isModuleCompleted: (state) => {
      return (moduleId: string): boolean => {
        return state.completedModules.includes(moduleId);
      };
    },

    /**
     * Get quiz score for a specific module
     */
    getQuizScore: (state) => {
      return (moduleId: string): number | undefined => {
        return state.quizScores[moduleId];
      };
    },

    /**
     * Get bookmarks for a specific module
     */
    getModuleBookmarks: (state) => {
      return (moduleId: string): Bookmark[] => {
        return state.bookmarks.filter(b => b.moduleId === moduleId);
      };
    },

    /**
     * Get total session time in minutes
     */
    sessionDuration: (state): number => {
      const duration = Date.now() - state.sessionStart;
      return Math.round(duration / 60000); // Convert to minutes
    },
  },

  actions: {
    /**
     * Mark a module as completed
     */
    markModuleComplete(moduleId: string): void {
      if (!this.completedModules.includes(moduleId)) {
        this.completedModules.push(moduleId);
        this.saveToStorage();
      }
    },

    /**
     * Unmark a module as completed
     */
    unmarkModuleComplete(moduleId: string): void {
      const index = this.completedModules.indexOf(moduleId);
      if (index > -1) {
        this.completedModules.splice(index, 1);
        this.saveToStorage();
      }
    },

    /**
     * Save quiz score for a module
     */
    saveQuizScore(moduleId: string, score: number): void {
      this.quizScores[moduleId] = score;
      this.saveToStorage();
    },

    /**
     * Add a bookmark
     */
    addBookmark(bookmark: Omit<Bookmark, 'id' | 'timestamp'>): void {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      this.bookmarks.push(newBookmark);
      this.saveToStorage();
    },

    /**
     * Remove a bookmark by ID
     */
    removeBookmark(bookmarkId: string): void {
      const index = this.bookmarks.findIndex(b => b.id === bookmarkId);
      if (index > -1) {
        this.bookmarks.splice(index, 1);
        this.saveToStorage();
      }
    },

    /**
     * Update last visited module
     */
    setLastVisited(moduleId: string): void {
      this.lastVisited = moduleId;
      this.saveToStorage();
    },

    /**
     * Add time to total time spent
     */
    addTimeSpent(minutes: number): void {
      this.totalTimeSpent += minutes;
      this.saveToStorage();
    },

    /**
     * Clear all progress data
     */
    clearProgress(): void {
      this.completedModules = [];
      this.quizScores = {};
      this.bookmarks = [];
      this.lastVisited = null;
      this.totalTimeSpent = 0;
      this.sessionStart = Date.now();
      this.clearStorage();
    },

    /**
     * Save state to localStorage
     */
    saveToStorage(): void {
      if (typeof window === 'undefined') return;

      try {
        const data = {
          completedModules: this.completedModules,
          quizScores: this.quizScores,
          bookmarks: this.bookmarks,
          lastVisited: this.lastVisited,
          totalTimeSpent: this.totalTimeSpent,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save progress to localStorage:', error);
        // Handle quota exceeded or other storage errors
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded. Consider clearing old data.');
        }
      }
    },

    /**
     * Load state from localStorage
     */
    loadFromStorage(): void {
      if (typeof window === 'undefined') return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.completedModules = data.completedModules || [];
          this.quizScores = data.quizScores || {};
          this.bookmarks = data.bookmarks || [];
          this.lastVisited = data.lastVisited || null;
          this.totalTimeSpent = data.totalTimeSpent || 0;
        }
      } catch (error) {
        console.error('Failed to load progress from localStorage:', error);
      }
    },

    /**
     * Clear localStorage
     */
    clearStorage(): void {
      if (typeof window === 'undefined') return;

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    },

    /**
     * Initialize the store (call on app mount)
     */
    initialize(): void {
      this.loadFromStorage();
      this.sessionStart = Date.now();
    },
  },
});
