<template>
  <ContentSection title="Quiz">
    <!-- Error state with retry -->
    <div
      v-if="error"
      class="quiz-error p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg
            class="w-5 h-5 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-yellow-800 mb-1">
            Quiz Unavailable
          </h3>
          <p class="text-sm text-yellow-700">{{ error }}</p>
          <button
            v-if="onRetry"
            @click="handleRetry"
            class="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            :disabled="retrying"
          >
            <svg
              v-if="!retrying"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ retrying ? 'Retrying...' : 'Try Again' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Coming soon state -->
    <div
      v-else-if="comingSoon"
      class="quiz-placeholder p-6 bg-blue-50 border border-blue-200 rounded-lg"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg
            class="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-blue-800 mb-1">
            Quiz Coming Soon
          </h3>
          <p class="text-sm text-blue-700">
            We're preparing an interactive quiz for this module. Check back soon to test your knowledge!
          </p>
        </div>
      </div>
    </div>
  </ContentSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * QuizErrorDisplay Component
 * 
 * Displays user-friendly error messages and fallback UI for quiz loading failures.
 * Provides retry functionality for transient errors.
 * 
 * Requirements: 1.5, 6.1, 6.2, 6.3, 6.6
 */

interface Props {
  /** Error message to display, or null if no error */
  error?: string | null;
  /** Whether to show "coming soon" message instead of error */
  comingSoon?: boolean;
  /** Optional retry callback for load failures */
  onRetry?: (() => void | Promise<void>) | null;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  comingSoon: false,
  onRetry: null,
});

const retrying = ref(false);

/**
 * Handle retry button click
 * Calls the onRetry callback if provided
 */
const handleRetry = async () => {
  if (!props.onRetry || retrying.value) return;
  
  retrying.value = true;
  try {
    await props.onRetry();
  } catch (err) {
    console.error('Retry failed:', err);
  } finally {
    retrying.value = false;
  }
};
</script>
