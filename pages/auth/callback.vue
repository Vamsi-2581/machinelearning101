<!--
  OAuth Callback Page
  
  Handles the OAuth redirect from Google authentication.
  Extracts token from URL parameters, stores it in auth store,
  and redirects to the home page or original destination.
  
  Requirements: 2.5, 2.6, 8.3, 8.4
-->

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <!-- Loading State -->
      <div v-if="isProcessing" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Completing Sign In
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Please wait while we set up your account...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authentication Failed
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ errorMessage }}
        </p>
        <button
          @click="handleRetry"
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
        <button
          @click="handleGoHome"
          class="ml-3 inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Go Home
        </button>
      </div>

      <!-- Success State (brief display before redirect) -->
      <div v-else-if="success" class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sign In Successful!
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Redirecting you now...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * OAuth Callback Page Component
 * Requirements: 2.5, 2.6, 8.3, 8.4
 */

import { useHead } from '#app';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuth } from '~~/composables/useAuth';

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const isProcessing = ref(true);
const error = ref(false);
const success = ref(false);
const errorMessage = ref('An unexpected error occurred. Please try again.');

/**
 * Process the OAuth callback
 * Requirements: 2.5, 2.6, 8.3
 */
const processCallback = async (): Promise<void> => {
  try {
    isProcessing.value = true;
    error.value = false;
    success.value = false;

    // Check for error parameter in URL
    const errorParam = route.query.error as string | undefined;
    if (errorParam) {
      error.value = true;
      
      // Map error codes to user-friendly messages
      switch (errorParam) {
        case 'access_denied':
          errorMessage.value = 'You denied access to your Google account. Please try again and grant permission.';
          break;
        case 'invalid_state':
          errorMessage.value = 'Security validation failed. This may be due to an expired session. Please try again.';
          break;
        case 'oauth_failed':
          errorMessage.value = 'Failed to authenticate with Google. Please try again.';
          break;
        case 'user_creation_failed':
          errorMessage.value = 'Failed to create your account. Please try again or contact support.';
          break;
        default:
          errorMessage.value = `Authentication error: ${errorParam}. Please try again.`;
      }
      
      isProcessing.value = false;
      return;
    }

    // Handle the OAuth callback using the auth composable
    const callbackSuccess = await auth.handleOAuthCallback();

    if (callbackSuccess) {
      success.value = true;
      
      // // Get the redirect destination from query params or default to home
      // const redirectTo = (route.query.redirect as string) || '/';
      
      // // Wait a moment to show success message, then redirect
      // setTimeout(() => {
      //   router.push(redirectTo);
      // }, 1500);
    } else {
      // No token found in URL or callback failed
      error.value = true;
      errorMessage.value = 'No authentication token received. Please try signing in again.';
      isProcessing.value = false;
    }
  } catch (err) {
    console.error('Error processing OAuth callback:', err);
    error.value = true;
    errorMessage.value = 'An unexpected error occurred while processing your sign-in. Please try again.';
    isProcessing.value = false;
  }
};

/**
 * Handle retry button click
 * Requirements: 8.1
 */
const handleRetry = (): void => {
  auth.signInWithGoogle();
};

/**
 * Handle go home button click
 * Requirements: 2.6
 */
const handleGoHome = (): void => {
  router.push('/');
};

// Process callback on component mount
onMounted(() => {
  processCallback();
});

// Set page metadata
useHead({
  title: 'Completing Sign In - Machine Learning 101',
  meta: [
    {
      name: 'description',
      content: 'Completing your Google authentication...',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // Don't index callback pages
    },
  ],
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
