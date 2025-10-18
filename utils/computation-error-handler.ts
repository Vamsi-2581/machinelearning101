import { ComputationError } from '~/types/error';

/**
 * Computation error handling utilities
 * 
 * Handles algorithm computation errors including non-convergence,
 * numerical instability, and provides parameter adjustment suggestions.
 * 
 * Requirements: 4.6
 */

export interface ComputationErrorContext {
  algorithm: string;
  parameters: Record<string, any>;
  iteration?: number;
  loss?: number;
  previousLoss?: number;
}

/**
 * Detect and handle non-convergence
 */
export function handleNonConvergence(context: ComputationErrorContext): ComputationError {
  const { algorithm, parameters, iteration } = context;

  const suggestions: string[] = [];

  // Learning rate suggestions
  if (parameters.learningRate !== undefined) {
    if (parameters.learningRate > 0.1) {
      suggestions.push('Try reducing the learning rate (e.g., 0.01 or 0.001)');
    } else if (parameters.learningRate < 0.0001) {
      suggestions.push('Try increasing the learning rate slightly');
    }
  }

  // Epochs suggestions
  if (parameters.epochs !== undefined && iteration !== undefined) {
    if (iteration >= parameters.epochs) {
      suggestions.push('Increase the number of epochs to allow more training time');
    }
  }

  // Data normalization suggestion
  suggestions.push('Ensure your data is properly normalized or standardized');

  // Algorithm-specific suggestions
  if (algorithm.includes('gradient')) {
    suggestions.push('Try using a different optimizer (e.g., Adam instead of SGD)');
  }

  return new ComputationError(
    `${algorithm} failed to converge after ${iteration || 'maximum'} iterations`,
    {
      code: 'NON_CONVERGENCE',
      details: context,
      userMessage: 'The algorithm did not converge to a solution',
      suggestions,
    }
  );
}

/**
 * Detect and handle numerical instability
 */
export function handleNumericalInstability(
  context: ComputationErrorContext,
  errorType: 'overflow' | 'underflow' | 'nan' | 'inf'
): ComputationError {
  const { algorithm, parameters } = context;

  const suggestions: string[] = [];

  switch (errorType) {
    case 'overflow':
      suggestions.push('Reduce the learning rate to prevent parameter explosion');
      suggestions.push('Check for outliers in your dataset');
      suggestions.push('Apply feature scaling to normalize your data');
      break;

    case 'underflow':
      suggestions.push('Increase numerical precision or use log-space computations');
      suggestions.push('Check for very small values in your dataset');
      break;

    case 'nan':
      suggestions.push('Check for invalid operations (e.g., division by zero)');
      suggestions.push('Ensure all input data is valid (no NaN or Infinity values)');
      suggestions.push('Reduce the learning rate');
      break;

    case 'inf':
      suggestions.push('Reduce the learning rate significantly');
      suggestions.push('Check for extreme values in your dataset');
      suggestions.push('Apply gradient clipping');
      break;
  }

  // Learning rate specific suggestions
  if (parameters.learningRate !== undefined && parameters.learningRate > 0.01) {
    suggestions.push('Your learning rate might be too high - try 0.001 or lower');
  }

  return new ComputationError(
    `Numerical instability detected: ${errorType}`,
    {
      code: `NUMERICAL_${errorType.toUpperCase()}`,
      details: context,
      userMessage: `The algorithm encountered numerical instability (${errorType})`,
      suggestions,
    }
  );
}

/**
 * Detect and handle insufficient data
 */
export function handleInsufficientData(
  algorithm: string,
  dataSize: number,
  minRequired: number
): ComputationError {
  return new ComputationError(
    `Insufficient data: ${dataSize} samples provided, ${minRequired} required`,
    {
      code: 'INSUFFICIENT_DATA',
      details: { algorithm, dataSize, minRequired },
      userMessage: 'Not enough data to train the algorithm',
      suggestions: [
        `Provide at least ${minRequired} data points`,
        'Try using a simpler algorithm that requires less data',
        'Generate synthetic data for testing purposes',
      ],
    }
  );
}

/**
 * Detect and handle invalid data
 */
export function handleInvalidData(
  reason: string,
  details?: any
): ComputationError {
  const suggestions: string[] = [
    'Check your dataset for missing or invalid values',
    'Ensure all features are numeric',
    'Remove or impute missing values',
  ];

  if (reason.includes('dimension')) {
    suggestions.push('Verify that all data points have the same number of features');
  }

  if (reason.includes('label')) {
    suggestions.push('Ensure all data points have valid labels');
  }

  return new ComputationError(
    `Invalid data: ${reason}`,
    {
      code: 'INVALID_DATA',
      details,
      userMessage: 'The provided data is invalid',
      suggestions,
    }
  );
}

/**
 * Detect divergence (loss increasing)
 */
export function detectDivergence(
  lossHistory: number[],
  windowSize: number = 10
): boolean {
  if (lossHistory.length < windowSize) {
    return false;
  }

  const recentLosses = lossHistory.slice(-windowSize);
  const trend = recentLosses.reduce((acc, loss, i) => {
    if (i === 0) return acc;
    const prevLoss = recentLosses[i - 1];
    if (prevLoss === undefined) return acc;
    return acc + (loss > prevLoss ? 1 : -1);
  }, 0);

  // If most recent losses are increasing, we're diverging
  return trend > windowSize * 0.6;
}

/**
 * Handle divergence
 */
export function handleDivergence(context: ComputationErrorContext): ComputationError {
  const { algorithm, parameters } = context;

  return new ComputationError(
    'Training is diverging (loss is increasing)',
    {
      code: 'DIVERGENCE',
      details: context,
      userMessage: 'The algorithm is diverging instead of converging',
      suggestions: [
        'Reduce the learning rate significantly (try 10x smaller)',
        'Check your data for outliers or errors',
        'Try a different initialization method',
        'Ensure your data is properly normalized',
      ],
    }
  );
}

/**
 * Check for NaN or Infinity in values
 */
export function hasInvalidNumbers(values: number[]): boolean {
  return values.some(v => !isFinite(v) || isNaN(v));
}

/**
 * Detect the type of numerical issue
 */
export function detectNumericalIssue(values: number[]): 'overflow' | 'underflow' | 'nan' | 'inf' | null {
  for (const v of values) {
    if (isNaN(v)) return 'nan';
    if (v === Infinity || v === -Infinity) return 'inf';
    if (Math.abs(v) > 1e100) return 'overflow';
    if (Math.abs(v) < 1e-100 && v !== 0) return 'underflow';
  }
  return null;
}

/**
 * Safe computation wrapper
 */
export async function safeComputation<T>(
  computationFn: () => Promise<T> | T,
  context: ComputationErrorContext
): Promise<T> {
  try {
    const result = await computationFn();
    return result;
  } catch (error) {
    // Check if it's already a ComputationError
    if (error instanceof ComputationError) {
      throw error;
    }

    // Try to categorize the error
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('converge')) {
      throw handleNonConvergence(context);
    }

    if (errorMessage.includes('NaN')) {
      throw handleNumericalInstability(context, 'nan');
    }

    if (errorMessage.includes('Infinity')) {
      throw handleNumericalInstability(context, 'inf');
    }

    if (errorMessage.includes('data') || errorMessage.includes('input')) {
      throw handleInvalidData(errorMessage);
    }

    // Generic computation error
    throw new ComputationError(
      errorMessage,
      {
        code: 'COMPUTATION_FAILED',
        details: context,
        userMessage: 'Algorithm computation failed',
        suggestions: [
          'Try different parameters',
          'Check your input data',
          'Try a simpler algorithm',
        ],
      }
    );
  }
}

/**
 * Validate computation results
 */
export function validateComputationResults(
  results: any,
  context: ComputationErrorContext
): void {
  // Check for NaN or Infinity in predictions
  if (results.predictions && Array.isArray(results.predictions)) {
    if (hasInvalidNumbers(results.predictions)) {
      const issueType = detectNumericalIssue(results.predictions);
      if (issueType) {
        throw handleNumericalInstability(context, issueType);
      }
    }
  }

  // Check for NaN or Infinity in model parameters
  if (results.model) {
    const modelValues: number[] = [];
    
    if (results.model.weights) {
      modelValues.push(...results.model.weights);
    }
    
    if (results.model.bias !== undefined) {
      modelValues.push(results.model.bias);
    }

    if (hasInvalidNumbers(modelValues)) {
      const issueType = detectNumericalIssue(modelValues);
      if (issueType) {
        throw handleNumericalInstability(context, issueType);
      }
    }
  }

  // Check for divergence in training history
  if (results.trainingHistory && results.trainingHistory.loss) {
    if (detectDivergence(results.trainingHistory.loss)) {
      throw handleDivergence(context);
    }
  }
}

/**
 * Composable for computation error handling
 */
export function useComputationErrorHandler() {
  return {
    handleNonConvergence,
    handleNumericalInstability,
    handleInsufficientData,
    handleInvalidData,
    handleDivergence,
    detectDivergence,
    hasInvalidNumbers,
    detectNumericalIssue,
    safeComputation,
    validateComputationResults,
  };
}
