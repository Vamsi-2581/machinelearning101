import { defineStore } from 'pinia';

/**
 * Auth Store
 * 
 * Manages user authentication state including user profile, JWT token,
 * and authentication status. Persists to localStorage.
 * 
 * Requirements: 8.4
 */

export interface User {
  id: string;
  email: string;
  name: string;
  picture_url: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'ml-platform-auth';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    /**
     * Get user display name
     */
    displayName: (state): string => {
      return state.user?.name || 'Guest';
    },

    /**
     * Get user email
     */
    userEmail: (state): string | null => {
      return state.user?.email || null;
    },

    /**
     * Get user profile picture URL
     */
    profilePicture: (state): string | null => {
      return state.user?.picture_url || null;
    },

    /**
     * Check if user has a valid token
     */
    hasValidToken: (state): boolean => {
      return state.token !== null && state.token.length > 0;
    },
  },

  actions: {
    /**
     * Set user profile data
     */
    setUser(user: User): void {
      this.user = user;
      this.isAuthenticated = true;
      this.saveToStorage();
    },

    /**
     * Set JWT token
     */
    setToken(token: string): void {
      this.token = token;
      this.isAuthenticated = true;
      this.saveToStorage();
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },

    /**
     * Clear authentication state (logout)
     */
    clearAuth(): void {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.isLoading = false;
      this.clearStorage();
    },

    /**
     * Update user profile data
     */
    updateUser(updates: Partial<User>): void {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        this.saveToStorage();
      }
    },

    /**
     * Save state to localStorage
     */
    saveToStorage(): void {
      if (typeof window === 'undefined') return;

      try {
        const data = {
          user: this.user,
          token: this.token,
          isAuthenticated: this.isAuthenticated,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save auth state to localStorage:', error);
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
          this.user = data.user || null;
          this.token = data.token || null;
          this.isAuthenticated = data.isAuthenticated || false;
        }
      } catch (error) {
        console.error('Failed to load auth state from localStorage:', error);
        // Clear corrupted data
        this.clearStorage();
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
    },
  },
});
