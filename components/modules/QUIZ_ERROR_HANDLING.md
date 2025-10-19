# Quiz Error Handling and Loading States

This document describes how to use the quiz error handling and loading state components in module pages.

## Components

### QuizErrorDisplay

Displays user-friendly error messages and fallback UI for quiz loading failures. Provides retry functionality for transient errors.

**Props:**
- `error` (string | null): Error message to display, or null if no error
- `comingSoon` (boolean): Whether to show "coming soon" message instead of error
- `onRetry` (function | null): Optional retry callback for load failures

**Usage:**
```vue
<QuizErrorDisplay
  :error="quizError"
  :on-retry="retryQuizLoad"
/>

<!-- Or for coming soon state -->
<QuizErrorDisplay :coming-soon="true" />
```

### QuizLoadingState

Displays a loading indicator while quiz data is being loaded. Includes skeleton UI to provide visual feedback during async loading.

**Usage:**
```vue
<QuizLoadingState v-if="quizLoading" />
```

## Composable

### useQuizLoader

Provides a reusable way to load quiz data with loading states and error handling.

**Returns:**
- `quizData` (Ref<Quiz | null>): Loaded quiz data
- `loading` (Ref<boolean>): Loading state indicator
- `error` (Ref<string | null>): Error message
- `loadQuiz` (function): Function to load quiz data
- `retry` (function): Function to retry loading after an error

**Usage:**
```typescript
import { useQuizLoader } from '~/composables/useQuizLoader';

const { quizData, loading, error, loadQuiz, retry } = useQuizLoader();

onMounted(async () => {
  await loadQuiz('module-id', '~/content/modules/domain/module-id/quiz.json');
});
```

## Complete Example

Here's a complete example of how to integrate quiz loading with error handling in a module page:

```vue
<template>
  <ModuleLayout>
    <!-- ... other sections ... -->
    
    <template #quiz>
      <!-- Loading state -->
      <QuizLoadingState v-if="quizLoading" />
      
      <!-- Error state with retry -->
      <QuizErrorDisplay
        v-else-if="quizError"
        :error="quizError"
        :on-retry="retryQuizLoad"
      />
      
      <!-- Coming soon state -->
      <QuizErrorDisplay
        v-else-if="!quizData"
        :coming-soon="true"
      />
      
      <!-- Quiz component -->
      <Quiz
        v-else
        :quiz="quizData"
        @quiz-completed="handleQuizComplete"
      />
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Quiz from '~/components/modules/Quiz.vue';
import QuizErrorDisplay from '~/components/modules/QuizErrorDisplay.vue';
import QuizLoadingState from '~/components/modules/QuizLoadingState.vue';
import { useQuizLoader } from '~/composables/useQuizLoader';
import type { QuizResult } from '~/types/quiz';

// Quiz data with loading state
const { 
  quizData, 
  loading: quizLoading, 
  error: quizError, 
  loadQuiz, 
  retry: retryQuizLoad 
} = useQuizLoader();

onMounted(async () => {
  // Load quiz data with automatic error handling
  await loadQuiz('module-id', '~/content/modules/domain/module-id/quiz.json');
});

const handleQuizComplete = (result: QuizResult) => {
  console.log('Quiz completed:', result);
  // The Quiz component already handles progress tracking
};
</script>
```

## Error Messages

The `useQuizLoader` composable automatically provides user-friendly error messages based on the error type:

- **Quiz file not found**: "Quiz content is not yet available for this module."
- **Validation error**: "Quiz data is temporarily unavailable. Please try again later."
- **JSON parsing error**: "Quiz data is malformed. Please report this issue."
- **Generic error**: "Failed to load quiz. Please try again later."
- **Unknown error**: "An unexpected error occurred while loading the quiz."

## Accessibility

Both components are fully accessible:

- **ARIA live regions**: Announce loading and error states to screen readers
- **ARIA roles**: Proper roles for alerts and status messages
- **Keyboard navigation**: Retry button is keyboard accessible
- **Focus management**: Proper focus handling for interactive elements

## Requirements Satisfied

- **Requirement 1.5**: Display friendly message for missing quizzes
- **Requirement 6.1**: User-friendly error messages for load failures
- **Requirement 6.2**: Message for quizzes with no questions
- **Requirement 6.3**: Notification when progress store fails
- **Requirement 6.6**: Loading indicators during async operations
