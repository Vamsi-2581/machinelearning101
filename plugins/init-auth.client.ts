/**
 * Auth Initialization Plugin
 * 
 * Initializes authentication state and loads user data from backend API
 * on app mount. Backend API is the source of truth for authenticated users.
 * 
 * Requirements: 8.3, 8.4, 8.7
 */

export default defineNuxtPlugin(async () => {
  if (process.client) {
    const { initializeAuth } = useAuth();
    
    // Initialize auth and load user data from backend
    // This will verify the token and fetch user profile + progress
    await initializeAuth();
  }
});
