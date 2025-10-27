import { defineStore } from 'pinia';
import type { Bookmark } from '~/types/progress';
import { useAuth } from '~/composables/useAuth'
/**
 * Progress Store
 * 
 * Manages user progress tracking including completed modules,
 * quiz scores, bookmarks, and session data. Uses Pinia persistence plugin
 * for localStorage. Backend API is the source of truth for authenticated users.
 * 
 * Requirements: 9.1, 9.2, 9.4, 9.6, 8.7, 4.1, 4.2, 4.3
 */

export interface ProgressState {
  completedModules: string[];
  quizScores: Record<string, number>;
  bookmarks: Bookmark[];
  lastVisited: string | null;
  totalTimeSpent: number;
  sessionStart: number;
  lastSyncedAt: number | null;
  isSyncing: boolean;
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    completedModules: [],
    quizScores: {},
    bookmarks: [],
    lastVisited: null,
    totalTimeSpent: 0,
    sessionStart: Date.now(),
    lastSyncedAt: null,
    isSyncing: false,
  }),

  persist: {
    key: 'ml-platform-progress',
    storage: piniaPluginPersistedstate.localStorage(),
  },

  getters: {
    /**
     * Calculate overall completion percentage
     * Note: This getter is deprecated. Use computed values with MODULE_REGISTRY instead.
     * Kept for backward compatibility.
     */
    completionPercentage: (state): number => {
      // Dynamic calculation should be done in components using MODULE_REGISTRY
      // This is a fallback that assumes 9 modules based on current registry
      const totalModules = 9;
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
     * Trigger cloud sync if user is authenticated
     * Requirements: 8.7, 4.1, 4.2, 4.3
     */
    async triggerSync(): Promise<void> {
      // Only run in browser environment
      if (typeof window === 'undefined' || this.isSyncing) return;
      
      try {
        // Dynamically import to avoid circular dependency
        
        const { syncProgress, isAuthenticated } = useAuth();
        
        // Only sync if user is authenticated
        if (isAuthenticated.value) {
          this.isSyncing = true;
          // Use setTimeout to avoid blocking the UI
          setTimeout(() => {
            syncProgress()
              .then(() => {
                this.lastSyncedAt = Date.now();
              })
              .catch((error: Error) => {
                // Silently fail - sync is a background operation
                console.error('Background sync failed:', error);
              })
              .finally(() => {
                this.isSyncing = false;
              });
          }, 100);
        }
      } catch (error) {
        // Silently fail in test environments or when composable is not available
        // This is expected behavior when running tests
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to trigger sync:', error);
        }
        this.isSyncing = false;
      }
    },

    /**
     * Load progress from backend API (for authenticated users)
     * Requirements: 8.7
     */
    async loadFromBackend(): Promise<boolean> {
      if (typeof window === 'undefined') return false;

      try { 
        const { fetchProgress, isAuthenticated } = useAuth();

        if (isAuthenticated.value) {
          const success = await fetchProgress();
          if (success) {
            this.lastSyncedAt = Date.now();
          }
          return success;
        }
        return false;
      } catch (error) {
        console.error('Failed to load progress from backend:', error);
        return false;
      }
    },

    /**
     * Merge backend data with local data
     * Backend is the source of truth for authenticated users
     */
    mergeBackendData(backendData: {
      completedModules: string[];
      quizScores: Record<string, number>;
      bookmarks: Bookmark[];
    }): void {
      // For completed modules: union of both sets
      const allCompleted = new Set([...this.completedModules, ...backendData.completedModules]);
      this.completedModules = Array.from(allCompleted);

      // For quiz scores: use higher score
      for (const [moduleId, score] of Object.entries(backendData.quizScores)) {
        const localScore = this.quizScores[moduleId];
        if (!localScore || score > localScore) {
          this.quizScores[moduleId] = score;
        }
      }

      // For bookmarks: merge by moduleId (avoid duplicates)
      const bookmarkMap = new Map(this.bookmarks.map(b => [b.moduleId, b]));
      for (const bookmark of backendData.bookmarks) {
        if (!bookmarkMap.has(bookmark.moduleId)) {
          this.bookmarks.push(bookmark);
        }
      }

      // Persistence handled automatically by plugin
    },

    /**
     * Mark a module as completed
     * Requirements: 4.1
     */
    markModuleComplete(moduleId: string): void {
      if (!this.completedModules.includes(moduleId)) {
        this.completedModules.push(moduleId);
        // Persistence handled automatically by plugin
        // Sync to cloud if authenticated
        this.triggerSync();
      }
    },

    /**
     * Unmark a module as completed
     */
    unmarkModuleComplete(moduleId: string): void {
      const index = this.completedModules.indexOf(moduleId);
      if (index > -1) {
        this.completedModules.splice(index, 1);
        // Persistence handled automatically by plugin
        this.triggerSync();
      }
    },

    /**
     * Save quiz score for a module
     * Requirements: 4.2
     */
    saveQuizScore(moduleId: string, score: number): void {
      this.quizScores[moduleId] = score;
      // Persistence handled automatically by plugin
      // Sync to cloud if authenticated
      this.triggerSync();
    },

    /**
     * Add a bookmark
     * Requirements: 4.3
     */
    addBookmark(bookmark: Omit<Bookmark, 'id' | 'timestamp'>): void {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `bookmark-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: Date.now(),
      };
      this.bookmarks.push(newBookmark);
      // Persistence handled automatically by plugin
      // Sync to cloud if authenticated
      this.triggerSync();
    },

    /**
     * Remove a bookmark by ID
     * Requirements: 4.3
     */
    removeBookmark(bookmarkId: string): void {
      const index = this.bookmarks.findIndex((b: Bookmark) => b.id === bookmarkId);
      if (index > -1) {
        this.bookmarks.splice(index, 1);
        // Persistence handled automatically by plugin
        this.triggerSync();
      }
    },

    /**
     * Update last visited module
     */
    setLastVisited(moduleId: string): void {
      this.lastVisited = moduleId;
      // Persistence handled automatically by plugin
    },

    /**
     * Add time to total time spent
     */
    addTimeSpent(minutes: number): void {
      this.totalTimeSpent += minutes;
      // Persistence handled automatically by plugin
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
      this.lastSyncedAt = null;
      // Persistence handled automatically by plugin
    },
  },
});
