/**
 * Dataset type definitions for ML learning platform
 */

export type DatasetType = 'regression' | 'classification' | 'clustering' | 'detection';

export interface DataPoint {
  /** Feature values for this data point */
  features: number[];
  /** Label for supervised learning (optional for clustering) */
  label?: number | string;
  /** Unique identifier for the data point */
  id?: string;
}

export interface Dataset {
  /** Unique identifier for the dataset */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of the dataset */
  description: string;
  /** Type of ML problem this dataset is for */
  type: DatasetType;
  /** Number of features per data point */
  features: number;
  /** Number of samples in the dataset */
  samples: number;
  /** The actual data points */
  data: DataPoint[];
  /** Optional metadata */
  metadata?: {
    /** Feature names */
    featureNames?: string[];
    /** Label name */
    labelName?: string;
    /** Additional properties */
    [key: string]: any;
  };
}

export interface DatasetValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a dataset to ensure it meets requirements
 */
export function validateDataset(dataset: Dataset): DatasetValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!dataset.id) {
    errors.push('Dataset must have an id');
  }
  if (!dataset.name) {
    errors.push('Dataset must have a name');
  }
  if (!dataset.type) {
    errors.push('Dataset must have a type');
  }
  if (!['regression', 'classification', 'clustering', 'detection'].includes(dataset.type)) {
    errors.push('Dataset type must be regression, classification, clustering, or detection');
  }

  // Check data array
  if (!Array.isArray(dataset.data)) {
    errors.push('Dataset data must be an array');
    return { valid: false, errors };
  }

  if (dataset.data.length === 0) {
    errors.push('Dataset must contain at least one data point');
    return { valid: false, errors };
  }

  // Validate samples count
  if (dataset.samples !== dataset.data.length) {
    errors.push(`Dataset samples count (${dataset.samples}) does not match data length (${dataset.data.length})`);
  }

  // Validate each data point
  const firstPoint = dataset.data[0];
  if (!firstPoint || !firstPoint.features || !Array.isArray(firstPoint.features)) {
    errors.push('Data points must have a features array');
    return { valid: false, errors };
  }

  const expectedFeatures = firstPoint.features.length;
  
  // Check features count
  if (dataset.features !== expectedFeatures) {
    errors.push(`Dataset features count (${dataset.features}) does not match actual features (${expectedFeatures})`);
  }

  // Validate all data points have consistent structure
  dataset.data.forEach((point, index) => {
    if (!point.features || !Array.isArray(point.features)) {
      errors.push(`Data point at index ${index} missing features array`);
      return;
    }

    if (point.features.length !== expectedFeatures) {
      errors.push(`Data point at index ${index} has ${point.features.length} features, expected ${expectedFeatures}`);
    }

    // Check for NaN or invalid values
    point.features.forEach((value, featureIndex) => {
      if (typeof value !== 'number' || !isFinite(value)) {
        errors.push(`Data point at index ${index}, feature ${featureIndex} has invalid value: ${value}`);
      }
    });

    // For supervised learning, check labels
    if (dataset.type === 'regression' || dataset.type === 'classification' || dataset.type === 'detection') {
      if (point.label === undefined || point.label === null) {
        errors.push(`Data point at index ${index} missing required label for ${dataset.type}`);
      }

      if (dataset.type === 'regression' && typeof point.label === 'number' && !isFinite(point.label)) {
        errors.push(`Data point at index ${index} has invalid regression label: ${point.label}`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Creates a validated dataset
 */
export function createDataset(config: Omit<Dataset, 'samples' | 'features'>): Dataset {
  const dataset: Dataset = {
    ...config,
    samples: config.data.length,
    features: config.data[0]?.features.length || 0
  };

  const validation = validateDataset(dataset);
  if (!validation.valid) {
    throw new Error(`Invalid dataset: ${validation.errors.join(', ')}`);
  }

  return dataset;
}
