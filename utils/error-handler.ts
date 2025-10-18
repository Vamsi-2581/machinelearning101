import type { AppError } from '~/types/error';
import { MLPlatformError, UserInputError, ComputationError, VisualizationError, StorageError } from '~/types/error';

/**
 * Global error handler for the ML learning platform
 * 
 * Handles different categories of errors and provides user-friendly
 * messages and suggestions.
 * 
 * Requirements: 1.5
 */

export class ErrorHandler {
  private toastStore: any;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize the error handler with the toast store
   */
  initialize(toastStore: any): void {
    this.toastStore = toastStore;
  }

  /**
   * Handle an error
   */
  handle(error: Error | AppError): void {
    // Convert to AppError if needed
    const appError = this.normalizeError(error);

    // Log to console in development
    if (this.isDevelopment) {
      console.error('[ErrorHandler]', {
        category: appError.category,
        code: appError.code,
        message: appError.message,
        details: appError.details,
        stack: appError.stack,
      });
    }

    // Handle based on category
    switch (appError.category) {
      case 'user-input':
        this.handleUserInputError(appError);
        break;
      case 'computation':
        this.handleComputationError(appError);
        break;
      case 'visualization':
        this.handleVisualizationError(appError);
        break;
      case 'storage':
        this.handleStorageError(appError);
        break;
      default:
        this.handleUnknownError(appError);
    }
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: Error | AppError): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    // Try to categorize common errors
    if (error.message.includes('quota') || error.message.includes('storage')) {
      return new StorageError(error.message, {
        userMessage: 'Unable to save data to browser storage',
        suggestions: ['Clear browser data', 'Free up storage space'],
      });
    }

    if (error.message.includes('convergence') || error.message.includes('numerical')) {
      return new ComputationError(error.message, {
        userMessage: 'Algorithm computation failed',
        suggestions: ['Try different parameters', 'Use a different dataset'],
      });
    }

    return new MLPlatformError(error.message, 'unknown', {
      userMessage: 'An unexpected error occurred',
    });
  }

  /**
   * Check if error is an AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error.category === 'string';
  }

  /**
   * Handle user input errors
   */
  private handleUserInputError(error: AppError): void {
    if (this.toastStore) {
      this.toastStore.error(
        error.userMessage || error.message,
        'Invalid Input',
        error.suggestions
      );
    }
  }

  /**
   * Handle computation errors
   */
  private handleComputationError(error: AppError): void {
    if (this.toastStore) {
      this.toastStore.error(
        error.userMessage || error.message,
        'Computation Error',
        error.suggestions
      );
    }
  }

  /**
   * Handle visualization errors
   */
  private handleVisualizationError(error: AppError): void {
    if (this.toastStore) {
      this.toastStore.warning(
        error.userMessage || error.message,
        'Visualization Error',
        error.suggestions
      );
    }
  }

  /**
   * Handle storage errors
   */
  private handleStorageError(error: AppError): void {
    if (this.toastStore) {
      this.toastStore.warning(
        error.userMessage || error.message,
        'Storage Error',
        error.suggestions
      );
    }
  }

  /**
   * Handle unknown errors
   */
  private handleUnknownError(error: AppError): void {
    if (this.toastStore) {
      this.toastStore.error(
        error.userMessage || 'An unexpected error occurred. Please try again.',
        'Error',
        error.suggestions
      );
    }
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

/**
 * Composable for using error handler in components
 */
export function useErrorHandler() {
  const toastStore = useToastStore();

  // Initialize on first use
  if (!errorHandler['toastStore']) {
    errorHandler.initialize(toastStore);
  }

  return {
    handleError: (error: Error | AppError) => errorHandler.handle(error),
    UserInputError,
    ComputationError,
    VisualizationError,
    StorageError,
  };
}
