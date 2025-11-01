/**
 * Quiz loader composable
 *
 * Provides a reusable way to load quiz data with loading states and error handling.
 * Handles async loading gracefully with proper error messages.
 *
 * Requirements: 6.1, 6.6
 */

import { ref, type Ref } from "vue";
import type { Quiz } from "~/types/quiz";
import { transformQuizData, QuizValidationError } from "~/utils/quiz-transform";

export interface QuizLoaderState {
  /** Loaded quiz data, or null if not loaded */
  quizData: Ref<Quiz | null>;
  /** Loading state indicator */
  loading: Ref<boolean>;
  /** Error message, or null if no error */
  error: Ref<string | null>;
  /** Function to load quiz data */
  loadQuiz: (moduleId: string, quizDataOrPath: any) => Promise<void>;
  /** Function to retry loading after an error */
  retry: () => Promise<void>;
}

/**
 * Composable for loading quiz data with loading states and error handling
 *
 * @returns Quiz loader state and functions
 *
 * @example
 * ```typescript
 * import quizData from '~/content/modules/regression/linear-regression/quiz.json';
 *
 * const { quizData, loading, error, loadQuiz, retry } = useQuizLoader();
 *
 * onMounted(async () => {
 *   await loadQuiz('linear-regression', quizData);
 * });
 * ```
 */
export function useQuizLoader(): QuizLoaderState {
  const quizData = ref<Quiz | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Store last load parameters for retry functionality
  let lastModuleId: string | null = null;
  let lastQuizDataOrPath: any = null;

  /**
   * Get user-friendly error message based on error type
   */
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof QuizValidationError) {
      // Validation errors - quiz data is malformed
      console.error("Quiz validation error:", (err as Error).message);
      return "Quiz data is temporarily unavailable. Please try again later.";
    }

    if (err instanceof Error) {
      // Check for specific error types
      if (
        err.message.includes("Cannot find module") ||
        err.message.includes("Failed to fetch")
      ) {
        // Quiz file doesn't exist
        return "Quiz content is not yet available for this module.";
      }

      if (err.message.includes("JSON") || err.message.includes("parse")) {
        // JSON parsing error
        console.error("Quiz JSON parsing error:", err.message);
        return "Quiz data is malformed. Please report this issue.";
      }

      // Generic error with message
      console.error("Quiz loading error:", err.message);
      return "Failed to load quiz. Please try again later.";
    }

    // Unknown error type
    console.error("Unknown quiz loading error:", err);
    return "An unexpected error occurred while loading the quiz.";
  };

  /**
   * Load quiz data from raw data or a content path
   *
   * @param moduleId - Module identifier (e.g., 'linear-regression')
   * @param quizDataOrPath - Either raw quiz data object or path to quiz.json file
   */
  const loadQuiz = async (
    moduleId: string,
    quizDataOrPath: any
  ): Promise<void> => {
    // Store parameters for retry
    lastModuleId = moduleId;
    lastQuizDataOrPath = quizDataOrPath;

    // Reset state
    loading.value = true;
    error.value = null;
    quizData.value = null;

    try {
      let rawQuiz: any;

      // Check if it's a string path or raw data
      if (typeof quizDataOrPath === "string") {
        // It's a path - use fetch to load JSON
        const response = await fetch(quizDataOrPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz: ${response.statusText}`);
        }

        rawQuiz = await response.json();
      } else {
        // It's raw data - use directly
        rawQuiz = quizDataOrPath;
      }

      // Transform to Quiz interface using the transformation utility
      // This will throw QuizValidationError if data is invalid
      quizData.value = transformQuizData(rawQuiz, moduleId);

      console.log(`Quiz data loaded successfully for ${moduleId}`);
    } catch (err) {
      // Set user-friendly error message
      error.value = getErrorMessage(err);
      quizData.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Retry loading quiz data after an error
   * Uses the last moduleId and quizDataOrPath from the previous load attempt
   */
  const retry = async (): Promise<void> => {
    if (!lastModuleId || !lastQuizDataOrPath) {
      console.warn("Cannot retry: no previous load attempt");
      return;
    }

    console.log(`Retrying quiz load for ${lastModuleId}`);
    await loadQuiz(lastModuleId, lastQuizDataOrPath);
  };

  return {
    quizData,
    loading,
    error,
    loadQuiz,
    retry,
  };
}
