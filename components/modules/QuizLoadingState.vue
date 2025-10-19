<template>
  <ContentSection title="Quiz">
    <div
      class="quiz-loading p-6 bg-gray-50 border border-gray-200 rounded-lg"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex items-center gap-4">
        <!-- Spinner -->
        <div class="flex-shrink-0">
          <svg
            class="w-8 h-8 text-blue-600 animate-spin"
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
        </div>
        
        <!-- Loading message -->
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-700 mb-1">
            Loading Quiz
          </h3>
          <p class="text-sm text-gray-600">
            Preparing your quiz questions...
          </p>
        </div>
      </div>
      
      <!-- Skeleton loader for quiz preview -->
      <div class="mt-6 space-y-4" aria-hidden="true">
        <!-- Question skeleton -->
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div class="space-y-2">
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </ContentSection>
</template>

<script setup lang="ts">
/**
 * QuizLoadingState Component
 * 
 * Displays a loading indicator while quiz data is being loaded.
 * Includes skeleton UI to provide visual feedback during async loading.
 * 
 * Requirements: 6.1, 6.6
 */
</script>
