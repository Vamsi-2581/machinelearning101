# Preprocessing Algorithms

This directory contains implementations of data preprocessing algorithms for the ML Learning Platform.

## Available Algorithms

### 1. Feature Scaling (`FeatureScaling.ts`)

Implements normalization and standardization techniques for scaling features to similar ranges.

**Methods:**
- `normalize()`: Min-max scaling to [0, 1] range
- `standardize()`: Z-score normalization (mean=0, std=1)

**Usage:**
```typescript
import { FeatureScaling } from '~/algorithms/preprocessing/FeatureScaling';

const data = [[1, 10], [2, 20], [3, 30]];
const scaler = new FeatureScaling(data);

// Normalize
const normalizedResult = scaler.normalize();
console.log(normalizedResult.scaled);

// Standardize
scaler.setData(data); // Reset
const standardizedResult = scaler.standardize();
console.log(standardizedResult.scaled);
```

**When to Use:**
- **Normalization**: For bounded values, neural networks, KNN
- **Standardization**: For normally distributed data, linear models, distance-based algorithms

### 2. Missing Value Imputation (`MissingValueImputation.ts`)

Implements various strategies for handling missing values in datasets.

**Methods:**
- `imputeMean()`: Replace missing values with feature mean
- `imputeMedian()`: Replace missing values with feature median
- `imputeMode()`: Replace missing values with feature mode
- `imputeForwardFill()`: Replace missing values with last observed value

**Usage:**
```typescript
import { MissingValueImputation } from '~/algorithms/preprocessing/MissingValueImputation';

// Generate data with missing values
const data = MissingValueImputation.generateDataWithMissing(
  100,  // rows
  3,    // columns
  20    // missing percentage
);

const imputer = new MissingValueImputation(data);

// Apply imputation
const result = imputer.imputeMean();
console.log(result.imputed);
console.log(`Missing: ${result.missingCount} (${result.missingPercentage}%)`);
```

**When to Use:**
- **Mean**: Normal distributions, random missing values
- **Median**: Skewed distributions, presence of outliers
- **Mode**: Categorical or discrete data
- **Forward Fill**: Time series data, temporal ordering

## Common Patterns

### Result Objects

All preprocessing algorithms return result objects with:
- `original`: Original data
- `scaled/imputed`: Transformed data
- `method`: Method used
- `statistics`: Relevant statistics (means, medians, etc.)

### Error Handling

All methods validate input and throw descriptive errors:
```typescript
try {
  const result = scaler.normalize();
} catch (error) {
  console.error('Preprocessing error:', error.message);
}
```

## Best Practices

1. **Always split data first**: Apply preprocessing after train/test split
2. **Fit on training data**: Calculate statistics from training data only
3. **Apply to all sets**: Use same transformation on train, validation, and test
4. **Document choices**: Record which preprocessing methods were used
5. **Evaluate impact**: Compare model performance with different preprocessing strategies

## Module Pages

Each algorithm has a corresponding interactive module page:
- `/modules/preprocessing/feature-scaling`
- `/modules/preprocessing/missing-value-imputation`

## Testing

To test preprocessing algorithms:
```bash
npm run test -- algorithms/preprocessing
```

## Future Enhancements

Potential additions:
- Outlier detection and removal
- Feature encoding (one-hot, label encoding)
- Feature selection methods
- Polynomial feature generation
- Log/power transformations
