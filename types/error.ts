/**
 * Error types and interfaces for the ML learning platform
 */

export type ErrorCategory = 'user-input' | 'computation' | 'visualization' | 'storage' | 'unknown';

export interface AppError extends Error {
  category: ErrorCategory;
  code?: string;
  details?: any;
  userMessage?: string;
  suggestions?: string[];
}

export class MLPlatformError extends Error implements AppError {
  category: ErrorCategory;
  code?: string;
  details?: any;
  userMessage?: string;
  suggestions?: string[];

  constructor(
    message: string,
    category: ErrorCategory,
    options?: {
      code?: string;
      details?: any;
      userMessage?: string;
      suggestions?: string[];
    }
  ) {
    super(message);
    this.name = 'MLPlatformError';
    this.category = category;
    this.code = options?.code;
    this.details = options?.details;
    this.userMessage = options?.userMessage || message;
    this.suggestions = options?.suggestions;
  }
}

export class UserInputError extends MLPlatformError {
  constructor(message: string, options?: Omit<ConstructorParameters<typeof MLPlatformError>[2], 'category'>) {
    super(message, 'user-input', options);
    this.name = 'UserInputError';
  }
}

export class ComputationError extends MLPlatformError {
  constructor(message: string, options?: Omit<ConstructorParameters<typeof MLPlatformError>[2], 'category'>) {
    super(message, 'computation', options);
    this.name = 'ComputationError';
  }
}

export class VisualizationError extends MLPlatformError {
  constructor(message: string, options?: Omit<ConstructorParameters<typeof MLPlatformError>[2], 'category'>) {
    super(message, 'visualization', options);
    this.name = 'VisualizationError';
  }
}

export class StorageError extends MLPlatformError {
  constructor(message: string, options?: Omit<ConstructorParameters<typeof MLPlatformError>[2], 'category'>) {
    super(message, 'storage', options);
    this.name = 'StorageError';
  }
}
