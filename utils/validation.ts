import { UserInputError } from '~/types/error';

/**
 * Parameter validation utilities
 * 
 * Provides validation rules and functions for algorithm parameters
 * 
 * Requirements: 8.2
 */

export type ValidationRuleType = 'range' | 'required' | 'positive' | 'integer' | 'custom' | 'enum';

export interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  validate: (value: any) => boolean;
  min?: number;
  max?: number;
  allowedValues?: any[];
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface ParameterConfig {
  id: string;
  label: string;
  type: 'number' | 'string' | 'boolean';
  rules: ValidationRule[];
  defaultValue?: any;
}

/**
 * Parameter validator class
 */
export class ParameterValidator {
  private rules: Record<string, ValidationRule[]>;

  constructor(rules: Record<string, ValidationRule[]> = {}) {
    this.rules = rules;
  }

  /**
   * Add validation rules for a parameter
   */
  addRules(paramKey: string, rules: ValidationRule[]): void {
    this.rules[paramKey] = rules;
  }

  /**
   * Validate parameters against rules
   */
  validate(params: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      const paramRules = this.rules[key] || [];
      
      for (const rule of paramRules) {
        if (!rule.validate(value)) {
          errors[key] = rule.message;
          break; // Stop at first error for this parameter
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate a single parameter
   */
  validateParameter(key: string, value: any): { valid: boolean; error?: string } {
    const paramRules = this.rules[key] || [];

    for (const rule of paramRules) {
      if (!rule.validate(value)) {
        return { valid: false, error: rule.message };
      }
    }

    return { valid: true };
  }

  /**
   * Throw error if validation fails
   */
  validateOrThrow(params: Record<string, any>): void {
    const result = this.validate(params);
    if (!result.valid) {
      const errorMessages = Object.entries(result.errors)
        .map(([key, msg]) => `${key}: ${msg}`)
        .join('; ');
      
      throw new UserInputError(`Invalid parameters: ${errorMessages}`, {
        code: 'VALIDATION_ERROR',
        details: result.errors,
        userMessage: 'Please check your input parameters',
        suggestions: Object.values(result.errors),
      });
    }
  }
}

/**
 * Common validation rule builders
 */
export const ValidationRules = {
  /**
   * Require a value to be present
   */
  required(message = 'This field is required'): ValidationRule {
    return {
      type: 'required',
      message,
      validate: (value: any) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
      },
    };
  },

  /**
   * Require a number to be within a range
   */
  range(min: number, max: number, message?: string): ValidationRule {
    return {
      type: 'range',
      message: message || `Value must be between ${min} and ${max}`,
      min,
      max,
      validate: (value: any) => {
        const num = Number(value);
        if (isNaN(num)) return false;
        return num >= min && num <= max;
      },
    };
  },

  /**
   * Require a positive number
   */
  positive(message = 'Value must be positive'): ValidationRule {
    return {
      type: 'positive',
      message,
      validate: (value: any) => {
        const num = Number(value);
        if (isNaN(num)) return false;
        return num > 0;
      },
    };
  },

  /**
   * Require a non-negative number
   */
  nonNegative(message = 'Value must be non-negative'): ValidationRule {
    return {
      type: 'positive',
      message,
      validate: (value: any) => {
        const num = Number(value);
        if (isNaN(num)) return false;
        return num >= 0;
      },
    };
  },

  /**
   * Require an integer
   */
  integer(message = 'Value must be an integer'): ValidationRule {
    return {
      type: 'integer',
      message,
      validate: (value: any) => {
        const num = Number(value);
        if (isNaN(num)) return false;
        return Number.isInteger(num);
      },
    };
  },

  /**
   * Require value to be one of allowed values
   */
  enum(allowedValues: any[], message?: string): ValidationRule {
    return {
      type: 'enum',
      message: message || `Value must be one of: ${allowedValues.join(', ')}`,
      allowedValues,
      validate: (value: any) => allowedValues.includes(value),
    };
  },

  /**
   * Custom validation function
   */
  custom(validateFn: (value: any) => boolean, message: string): ValidationRule {
    return {
      type: 'custom',
      message,
      validate: validateFn,
    };
  },

  /**
   * Combine multiple rules with AND logic
   */
  combine(...rules: ValidationRule[]): ValidationRule {
    return {
      type: 'custom',
      message: 'Validation failed',
      validate: (value: any) => rules.every(rule => rule.validate(value)),
    };
  },
};

/**
 * Algorithm-specific validators
 */
export const AlgorithmValidators = {
  /**
   * Linear Regression validator
   */
  linearRegression(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('learningRate', [
      ValidationRules.required(),
      ValidationRules.positive('Learning rate must be positive'),
      ValidationRules.range(0.0001, 1, 'Learning rate should be between 0.0001 and 1'),
    ]);

    validator.addRules('epochs', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Epochs must be positive'),
      ValidationRules.range(1, 10000, 'Epochs should be between 1 and 10000'),
    ]);

    return validator;
  },

  /**
   * Logistic Regression validator
   */
  logisticRegression(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('learningRate', [
      ValidationRules.required(),
      ValidationRules.positive('Learning rate must be positive'),
      ValidationRules.range(0.0001, 1, 'Learning rate should be between 0.0001 and 1'),
    ]);

    validator.addRules('epochs', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Epochs must be positive'),
      ValidationRules.range(1, 10000, 'Epochs should be between 1 and 10000'),
    ]);

    validator.addRules('regularization', [
      ValidationRules.nonNegative('Regularization must be non-negative'),
      ValidationRules.range(0, 10, 'Regularization should be between 0 and 10'),
    ]);

    return validator;
  },

  /**
   * K-Means validator
   */
  kMeans(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('k', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Number of clusters must be positive'),
      ValidationRules.range(2, 20, 'Number of clusters should be between 2 and 20'),
    ]);

    validator.addRules('maxIterations', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Max iterations must be positive'),
      ValidationRules.range(1, 1000, 'Max iterations should be between 1 and 1000'),
    ]);

    validator.addRules('initMethod', [
      ValidationRules.required(),
      ValidationRules.enum(['random', 'kmeans++'], 'Init method must be "random" or "kmeans++"'),
    ]);

    return validator;
  },

  /**
   * Gradient Descent validator
   */
  gradientDescent(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('learningRate', [
      ValidationRules.required(),
      ValidationRules.positive('Learning rate must be positive'),
      ValidationRules.range(0.001, 1, 'Learning rate should be between 0.001 and 1'),
    ]);

    validator.addRules('momentum', [
      ValidationRules.nonNegative('Momentum must be non-negative'),
      ValidationRules.range(0, 0.99, 'Momentum should be between 0 and 0.99'),
    ]);

    validator.addRules('optimizer', [
      ValidationRules.required(),
      ValidationRules.enum(['sgd', 'momentum', 'adam', 'rmsprop'], 'Invalid optimizer'),
    ]);

    return validator;
  },

  /**
   * Neural Network validator
   */
  neuralNetwork(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('hiddenLayers', [
      ValidationRules.required(),
      ValidationRules.custom(
        (value: any) => Array.isArray(value) && value.length > 0 && value.every((n: any) => Number.isInteger(n) && n > 0),
        'Hidden layers must be an array of positive integers'
      ),
    ]);

    validator.addRules('learningRate', [
      ValidationRules.required(),
      ValidationRules.positive('Learning rate must be positive'),
      ValidationRules.range(0.0001, 1, 'Learning rate should be between 0.0001 and 1'),
    ]);

    validator.addRules('epochs', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Epochs must be positive'),
      ValidationRules.range(1, 10000, 'Epochs should be between 1 and 10000'),
    ]);

    validator.addRules('activation', [
      ValidationRules.required(),
      ValidationRules.enum(['relu', 'sigmoid', 'tanh'], 'Invalid activation function'),
    ]);

    return validator;
  },

  /**
   * PCA validator
   */
  pca(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('nComponents', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Number of components must be positive'),
      ValidationRules.range(1, 10, 'Number of components should be between 1 and 10'),
    ]);

    return validator;
  },

  /**
   * t-SNE validator
   */
  tsne(): ParameterValidator {
    const validator = new ParameterValidator();
    
    validator.addRules('perplexity', [
      ValidationRules.required(),
      ValidationRules.positive('Perplexity must be positive'),
      ValidationRules.range(5, 50, 'Perplexity should be between 5 and 50'),
    ]);

    validator.addRules('iterations', [
      ValidationRules.required(),
      ValidationRules.integer(),
      ValidationRules.positive('Iterations must be positive'),
      ValidationRules.range(100, 5000, 'Iterations should be between 100 and 5000'),
    ]);

    return validator;
  },
};

/**
 * Composable for using validation in components
 */
export function useValidation(algorithmType?: string) {
  const getValidator = (type: string): ParameterValidator => {
    const validators: Record<string, () => ParameterValidator> = {
      'linear-regression': AlgorithmValidators.linearRegression,
      'logistic-regression': AlgorithmValidators.logisticRegression,
      'k-means': AlgorithmValidators.kMeans,
      'gradient-descent': AlgorithmValidators.gradientDescent,
      'neural-network': AlgorithmValidators.neuralNetwork,
      'pca': AlgorithmValidators.pca,
      'tsne': AlgorithmValidators.tsne,
    };

    const validatorFn = validators[type];
    return validatorFn ? validatorFn() : new ParameterValidator();
  };

  const validator = algorithmType ? getValidator(algorithmType) : new ParameterValidator();

  return {
    validator,
    validate: (params: Record<string, any>) => validator.validate(params),
    validateParameter: (key: string, value: any) => validator.validateParameter(key, value),
    validateOrThrow: (params: Record<string, any>) => validator.validateOrThrow(params),
    ValidationRules,
  };
}
