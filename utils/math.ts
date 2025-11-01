/**
 * Matrix and linear algebra utilities for ML algorithms
 * Uses typed arrays for performance optimization
 */

/**
 * Matrix multiplication: C = A * B
 * @param A - Matrix A (m x n)
 * @param B - Matrix B (n x p)
 * @returns Result matrix C (m x p)
 */
export function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const n = A[0]?.length || 0;
  const p = B[0]?.length || 0;
  
  if (n !== B.length) {
    throw new Error(`Cannot multiply matrices: A columns (${n}) must equal B rows (${B.length})`);
  }
  
  const C: number[][] = Array(m).fill(0).map(() => Array(p).fill(0));
  
  for (let i = 0; i < m; i++) {
    const rowA = A[i];
    const rowC = C[i];
    if (!rowA || !rowC) continue;
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const rowB = B[k];
        if (!rowB) continue;
        sum += (rowA[k] ?? 0) * (rowB[j] ?? 0);
      }
      rowC[j] = sum;
    }
  }
  
  return C;
}

/**
 * Matrix transpose: A^T
 * @param A - Input matrix (m x n)
 * @returns Transposed matrix (n x m)
 */
export function matrixTranspose(A: number[][]): number[][] {
  const m = A.length;
  const n = A[0]?.length || 0;
  
  const AT: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
  
  for (let i = 0; i < m; i++) {
    const rowA = A[i];
    if (!rowA) continue;
    for (let j = 0; j < n; j++) {
      const rowAT = AT[j];
      if (!rowAT) continue;
      rowAT[i] = rowA[j] ?? 0;
    }
  }
  
  return AT;
}

/**
 * Matrix inverse using Gauss-Jordan elimination (for small matrices)
 * @param A - Square matrix
 * @returns Inverse matrix
 */
export function matrixInverse(A: number[][]): number[][] {
  const n = A.length;
  
  if (n !== A[0]?.length) {
    throw new Error('Matrix must be square for inversion');
  }
  
  // Create augmented matrix [A | I]
  const augmented: number[][] = A.map((row, i) => [
    ...row,
    ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))
  ]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      const rowK = augmented[k];
      const rowMax = augmented[maxRow];
      if (rowK && rowMax && Math.abs(rowK[i] ?? 0) > Math.abs(rowMax[i] ?? 0)) {
        maxRow = k;
      }
    }
    
    // Swap rows
    const tempRow = augmented[i];
    augmented[i] = augmented[maxRow] ?? [];
    augmented[maxRow] = tempRow ?? [];
    
    // Check for singular matrix
    const rowI = augmented[i];
    if (!rowI || Math.abs(rowI[i] ?? 0) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted');
    }
    
    // Scale pivot row
    const pivot = rowI[i] ?? 1;
    for (let j = 0; j < 2 * n; j++) {
      rowI[j] = (rowI[j] ?? 0) / pivot;
    }
    
    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const rowK = augmented[k];
        if (!rowK) continue;
        const factor = rowK[i] ?? 0;
        for (let j = 0; j < 2 * n; j++) {
          rowK[j] = (rowK[j] ?? 0) - factor * (rowI[j] ?? 0);
        }
      }
    }
  }
  
  // Extract inverse from augmented matrix
  return augmented.map(row => row.slice(n));
}

/**
 * Vector dot product
 * @param a - Vector a
 * @param b - Vector b
 * @returns Dot product
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] ?? 0) * (b[i] ?? 0);
  }
  
  return sum;
}

/**
 * Vector norm (L2 norm / Euclidean norm)
 * @param v - Input vector
 * @returns L2 norm
 */
export function vectorNorm(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    const val = v[i] ?? 0;
    sum += val * val;
  }
  return Math.sqrt(sum);
}

/**
 * Calculate Euclidean distance between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns Euclidean distance
 */
export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

/**
 * Vector addition
 * @param a - Vector a
 * @param b - Vector b
 * @returns a + b
 */
export function vectorAdd(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  return a.map((val, i) => val + (b[i] ?? 0));
}

/**
 * Vector subtraction
 * @param a - Vector a
 * @param b - Vector b
 * @returns a - b
 */
export function vectorSubtract(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  return a.map((val, i) => val - (b[i] ?? 0));
}

/**
 * Scalar multiplication of vector
 * @param scalar - Scalar value
 * @param v - Vector
 * @returns scalar * v
 */
export function vectorScale(scalar: number, v: number[]): number[] {
  return v.map(val => scalar * val);
}

/**
 * Matrix-vector multiplication
 * @param A - Matrix (m x n)
 * @param v - Vector (n)
 * @returns Result vector (m)
 */
export function matrixVectorMultiply(A: number[][], v: number[]): number[] {
  const m = A.length;
  const n = A[0]?.length || 0;
  
  if (n !== v.length) {
    throw new Error(`Matrix columns (${n}) must match vector length (${v.length})`);
  }
  
  const result = new Array(m).fill(0);
  
  for (let i = 0; i < m; i++) {
    const row = A[i];
    if (!row) continue;
    for (let j = 0; j < n; j++) {
      result[i] = (result[i] ?? 0) + (row[j] ?? 0) * (v[j] ?? 0);
    }
  }
  
  return result;
}

/**
 * Create identity matrix
 * @param n - Matrix size
 * @returns n x n identity matrix
 */
export function identityMatrix(n: number): number[][] {
  return Array(n).fill(0).map((_, i) => 
    Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))
  );
}

/**
 * Create zero matrix
 * @param m - Number of rows
 * @param n - Number of columns
 * @returns m x n zero matrix
 */
export function zeroMatrix(m: number, n: number): number[][] {
  return Array(m).fill(0).map(() => Array(n).fill(0));
}

/**
 * Statistical utility functions
 */

/**
 * Calculate mean of an array
 * @param values - Input values
 * @returns Mean value
 */
export function mean(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate mean of empty array');
  }
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate median of an array
 * @param values - Input values
 * @returns Median value
 */
export function median(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate median of empty array');
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  } else {
    return sorted[mid] ?? 0;
  }
}

/**
 * Calculate standard deviation
 * @param values - Input values
 * @param sample - If true, use sample std (n-1), else population std (n)
 * @returns Standard deviation
 */
export function std(values: number[], sample: boolean = true): number {
  return Math.sqrt(variance(values, sample));
}

/**
 * Calculate variance
 * @param values - Input values
 * @param sample - If true, use sample variance (n-1), else population variance (n)
 * @returns Variance
 */
export function variance(values: number[], sample: boolean = true): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate variance of empty array');
  }
  
  if (sample && values.length === 1) {
    throw new Error('Cannot calculate sample variance with only one value');
  }
  
  const m = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - m, 2));
  const sum = squaredDiffs.reduce((acc, val) => acc + val, 0);
  
  const divisor = sample ? values.length - 1 : values.length;
  return sum / divisor;
}

/**
 * Calculate covariance between two variables
 * @param x - First variable
 * @param y - Second variable
 * @param sample - If true, use sample covariance (n-1)
 * @returns Covariance
 */
export function covariance(x: number[], y: number[], sample: boolean = true): number {
  if (x.length !== y.length) {
    throw new Error(`Arrays must have same length: ${x.length} vs ${y.length}`);
  }
  
  if (x.length === 0) {
    throw new Error('Cannot calculate covariance of empty arrays');
  }
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += ((x[i] ?? 0) - meanX) * ((y[i] ?? 0) - meanY);
  }
  
  const divisor = sample ? x.length - 1 : x.length;
  return sum / divisor;
}

/**
 * Calculate Pearson correlation coefficient
 * @param x - First variable
 * @param y - Second variable
 * @returns Correlation coefficient (-1 to 1)
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error(`Arrays must have same length: ${x.length} vs ${y.length}`);
  }
  
  const cov = covariance(x, y, true);
  const stdX = std(x, true);
  const stdY = std(y, true);
  
  if (stdX === 0 || stdY === 0) {
    throw new Error('Cannot calculate correlation when standard deviation is zero');
  }
  
  return cov / (stdX * stdY);
}

/**
 * Normalize values to [0, 1] range (min-max scaling)
 * @param values - Input values
 * @returns Normalized values
 */
export function normalize(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  if (min === max) {
    return values.map(() => 0.5);
  }
  
  return values.map(val => (val - min) / (max - min));
}

/**
 * Standardize values to zero mean and unit variance (z-score)
 * @param values - Input values
 * @returns Standardized values
 */
export function standardize(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }
  
  const m = mean(values);
  const s = std(values, true);
  
  if (s === 0) {
    return values.map(() => 0);
  }
  
  return values.map(val => (val - m) / s);
}

/**
 * Normalize a matrix column-wise
 * @param X - Input matrix
 * @returns Normalized matrix
 */
export function normalizeMatrix(X: number[][]): number[][] {
  if (X.length === 0) {
    return [];
  }
  
  const n = X[0]?.length ?? 0;
  const result: number[][] = X.map(row => [...row]);
  
  for (let j = 0; j < n; j++) {
    const column = X.map(row => row?.[j] ?? 0);
    const normalized = normalize(column);
    
    for (let i = 0; i < X.length; i++) {
      const row = result[i];
      if (row) {
        row[j] = normalized[i] ?? 0;
      }
    }
  }
  
  return result;
}

/**
 * Standardize a matrix column-wise
 * @param X - Input matrix
 * @returns Standardized matrix
 */
export function standardizeMatrix(X: number[][]): number[][] {
  if (X.length === 0) {
    return [];
  }
  
  const n = X[0]?.length ?? 0;
  const result: number[][] = X.map(row => [...row]);
  
  for (let j = 0; j < n; j++) {
    const column = X.map(row => row?.[j] ?? 0);
    const standardized = standardize(column);
    
    for (let i = 0; i < X.length; i++) {
      const row = result[i];
      if (row) {
        row[j] = standardized[i] ?? 0;
      }
    }
  }
  
  return result;
}

/**
 * Calculate sum of array
 * @param values - Input values
 * @returns Sum
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate minimum value
 * @param values - Input values
 * @returns Minimum value
 */
export function min(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot find minimum of empty array');
  }
  return Math.min(...values);
}

/**
 * Calculate maximum value
 * @param values - Input values
 * @returns Maximum value
 */
export function max(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot find maximum of empty array');
  }
  return Math.max(...values);
}

/**
 * Calculate mode (most frequent value) of an array
 * @param values - Input values
 * @returns Most frequent value
 */
export function mode(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate mode of empty array');
  }
  
  const counts = new Map<number, number>();
  
  // Count occurrences
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  
  // Find most frequent
  let maxCount = 0;
  let modeValue = values[0];
  
  for (const [value, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      modeValue = value;
    }
  }
  
  return modeValue;
}
