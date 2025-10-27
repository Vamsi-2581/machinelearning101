import { defineStore } from 'pinia';

/**
 * Auth Store
 * 
 * Manages user authentication state including user profile, JWT token,
 * and authentication status. Uses Pinia persistence plugin for localStorage.
 * Backend API is the source of truth for user data.
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

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  persist: {
    key: 'ml-platform-auth',
    storage: piniaPluginPersistedstate.localStorage(), 
  },

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
      // Persistence handled automatically by plugin
    },

    /**
     * Set JWT token
     */
    setToken(token: string): void {
      this.token = token;
      this.isAuthenticated = true;
      // Persistence handled automatically by plugin
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
      // Persistence handled automatically by plugin
    },

    /**
     * Update user profile data
     */
    updateUser(updates: Partial<User>): void {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        // Persistence handled automatically by plugin
      }
    },
  },
} );
