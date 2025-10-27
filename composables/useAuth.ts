/**
 * Auth Composable
 * 
 * Provides authentication functionality including Google OAuth sign-in,
 * logout, progress synchronization, and OAuth callback handling.
 * 
 * Requirements: 8.1, 8.3, 8.5, 8.6, 8.7
 */

import { computed } from 'vue';
import { useAuthStore, type User } from '~/stores/auth';
import { useProgressStore } from '~/stores/progress';
import { useToastStore } from '~/stores/toast';

interface SyncProgressData {
  modules: Array<{
    module_id: string;
    completed: boolean;
    completed_at: number | null;
  }>;
  quizzes: Array<{
    module_id: string;
    score: number;
    total: number;
    completed_at: number;
  }>;
  bookmarks: Array<{
    module_id: string;
    created_at: number;
  }>;
}

interface ProgressResponse {
  modules: Array<{
    id: string;
    user_id: string;
    module_id: string;
    completed: boolean;
    completed_at: number | null;
  }>;
  quizzes: Array<{
    id: string;
    user_id: string;
    module_id: string;
    score: number;
    total: number;
    completed_at: number;
  }>;
  bookmarks: Array<{
    id: string;
    user_id: string;
    module_id: string;
    created_at: number;
  }>;
}

export const useAuth = () => {
  const authStore = useAuthStore();
  const progressStore = useProgressStore();
  const toastStore = useToastStore();
  const config = useRuntimeConfig();
  
  const apiUrl = config.public.apiUrl || 'http://localhost:8787';

  /**
   * Redirect to Google OAuth sign-in
   * Requirements: 8.1, 8.3
   */
  const signInWithGoogle = (): void => {
    try {
      // Redirect to the worker's OAuth initiation endpoint
      const authUrl = `${apiUrl}/api/auth/google`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate Google sign-in:', error);
      toastStore.error('Failed to start sign-in process');
    }
  };

  /**
   * Handle OAuth callback and extract token
   * Requirements: 8.3
   */
  const handleOAuthCallback = async (): Promise<boolean> => {
    try {
      // Check if we're on the callback page with a token
      if (typeof window === 'undefined') return false;

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        toastStore.error('Authentication failed. Please try again.');
        return false;
      }

      if (token) {
        // Store the token
        authStore.setToken(token);

        // Fetch user profile
        const user = await fetchUserProfile(token);
        if (user) {
          authStore.setUser(user);
          toastStore.success(`Welcome back, ${user.name}!`);
          
          // Sync progress after successful login
          await syncProgress();
          
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to handle OAuth callback:', error);
      toastStore.error('Failed to complete sign-in');
      return false;
    }
  };

  /**
   * Fetch user profile from API
   * Requirements: 8.6
   */
  const fetchUserProfile = async (token?: string): Promise<User | null> => {
    try {
      const authToken = token || authStore.token;
      if (!authToken) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          authStore.clearAuth();
          throw new Error('Authentication expired');
        }
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  /**
   * Logout user and clear authentication state
   * Requirements: 8.5
   */
  const logout = async (): Promise<void> => {
    try {
      authStore.setLoading(true);

      // Call logout endpoint (optional, mainly for logging)
      if (authStore.token) {
        try {
          await fetch(`${apiUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // Ignore errors from logout endpoint
          console.warn('Logout endpoint call failed:', error);
        }
      }

      // Clear auth state
      authStore.clearAuth();
      
      toastStore.info('You have been logged out');

      // Redirect to home page
      if (typeof window !== 'undefined') {
        await navigateTo('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toastStore.error('Failed to logout');
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * Sync local progress data to the cloud
   * Requirements: 8.7
   */
  const syncProgress = async (): Promise<boolean> => {
    try {
      // Only sync if user is authenticated
      if (!authStore.isAuthenticated || !authStore.token) {
        return false;
      }

      authStore.setLoading(true);

      // Prepare progress data from local store
      const syncData: SyncProgressData = {
        modules: progressStore.completedModules.map(moduleId => ({
          module_id: moduleId,
          completed: true,
          completed_at: Date.now(), // Use current timestamp as approximation
        })),
        quizzes: Object.entries(progressStore.quizScores).map(([moduleId, score]) => ({
          module_id: moduleId,
          score: score,
          total: 100, // Assuming 100 is the total score
          completed_at: Date.now(),
        })),
        bookmarks: progressStore.bookmarks.map(bookmark => ({
          module_id: bookmark.moduleId,
          created_at: bookmark.timestamp,
        })),
      };

      // Send sync request
      const response = await fetch(`${apiUrl}/api/progress/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired, logout
          authStore.clearAuth();
          toastStore.warning('Session expired. Please sign in again.');
          return false;
        }
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Progress synced successfully:', result);
      
      return true;
    } catch (error) {
      console.error('Failed to sync progress:', error);
      // Don't show error toast for sync failures to avoid annoying users
      return false;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * Fetch progress data from the cloud and merge with local data
   * Requirements: 8.7
   */
  const fetchProgress = async (): Promise<boolean> => {
    try {
      // Only fetch if user is authenticated
      if (!authStore.isAuthenticated || !authStore.token) {
        return false;
      }

      authStore.setLoading(true);

      const response = await fetch(`${apiUrl}/api/progress`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired, logout
          authStore.clearAuth();
          toastStore.warning('Session expired. Please sign in again.');
          return false;
        }
        throw new Error(`Failed to fetch progress: ${response.statusText}`);
      }

      const data: ProgressResponse = await response.json();

      // Merge cloud data with local data
      // For modules: add any completed modules from cloud that aren't local
      data.modules.forEach(module => {
        if (module.completed && !progressStore.completedModules.includes(module.module_id)) {
          progressStore.markModuleComplete(module.module_id);
        }
      });

      // Use the new mergeBackendData method
      progressStore.mergeBackendData({
        completedModules: data.modules
          .filter((m: { completed: boolean }) => m.completed)
          .map((m: { module_id: string }) => m.module_id),
        quizScores: Object.fromEntries(
          data.quizzes.map((q: { module_id: string; score: number }) => [q.module_id, q.score])
        ),
        bookmarks: data.bookmarks.map((b: { module_id: string; created_at: number }) => ({
          id: `bookmark-${b.created_at}`,
          moduleId: b.module_id,
          name: `Bookmark for ${b.module_id}`,
          parameters: {},
          timestamp: b.created_at,
        })),
      });

      console.log('Progress fetched and merged successfully');
      return true;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      return false;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * Initialize auth state on app mount
   * Requirements: 8.3, 8.4
   */
  const initializeAuth = async (): Promise<void> => {
    try {
      // Pinia persistence plugin handles loading from localStorage automatically
      // If we have a token, verify it's still valid by fetching user profile
      if (authStore.token) {
        const user = await fetchUserProfile();
        if (user) {
          authStore.setUser(user);
          // Fetch progress from cloud and merge with local
          await fetchProgress();
        } else {
          // Token is invalid, clear auth
          authStore.clearAuth();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authStore.clearAuth();
    }
  };

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    
    // Actions
    signInWithGoogle,
    logout,
    syncProgress,
    fetchProgress,
    handleOAuthCallback,
    initializeAuth,
  };
};
