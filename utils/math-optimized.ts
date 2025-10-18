/**
 * Optimized matrix and linear algebra utilities using typed arrays
 * 
 * This module provides performance-optimized mathematical operations
 * using Float64Array for better memory efficiency and computation speed.
 * 
 * Requirements: 14.5
 */

/**
 * Convert 2D array to flat typed array
 */
export function toTypedArray(matrix: number[][]): Float64Array {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const flat = new Float64Array(rows * cols);
  
  for (let i = 0; i < rows; i++) {
    const row = matrix[i];
    if (!row) continue;
    for (let j = 0; j < cols; j++) {
      flat[i * cols + j] = row[j] ?? 0;
    }
  }
  
  return flat;
}

/**
 * Convert flat typed array to 2D array
 */
export function fromTypedArray(flat: Float64Array, rows: number, cols: number): number[][] {
  const matrix: number[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(flat[i * cols + j] ?? 0);
    }
    matrix.push(row);
  }
  
  return matrix;
}

/**
 * Optimized matrix multiplication using typed arrays
 * @param A - Matrix A (m x n) as flat array
 * @param B - Matrix B (n x p) as flat array
 * @param m - Rows in A
 * @param n - Cols in A / Rows in B
 * @param p - Cols in B
 * @returns Result matrix C (m x p) as flat array
 */
export function matrixMultiplyTyped(
  A: Float64Array,
  B: Float64Array,
  m: number,
  n: number,
  p: number
): Float64Array {
  const C = new Float64Array(m * p);
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const aVal = A[i * n + k] ?? 0;
        const bVal = B[k * p + j] ?? 0;
        sum += aVal * bVal;
      }
      C[i * p + j] = sum;
    }
  }
  
  return C;
}

/**
 * Optimized vector dot product using typed arrays
 * @param a - Vector a
 * @param b - Vector b
 * @returns Dot product
 */
export function dotProductTyped(a: Float64Array, b: Float64Array): number {
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
 * Optimized vector norm using typed arrays
 * @param v - Input vector
 * @returns L2 norm
 */
export function vectorNormTyped(v: Float64Array): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    const val = v[i] ?? 0;
    sum += val * val;
  }
  return Math.sqrt(sum);
}

/**
 * Optimized vector addition using typed arrays
 * @param a - Vector a
 * @param b - Vector b
 * @returns a + b
 */
export function vectorAddTyped(a: Float64Array, b: Float64Array): Float64Array {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  const result = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = (a[i] ?? 0) + (b[i] ?? 0);
  }
  
  return result;
}

/**
 * Optimized vector subtraction using typed arrays
 * @param a - Vector a
 * @param b - Vector b
 * @returns a - b
 */
export function vectorSubtractTyped(a: Float64Array, b: Float64Array): Float64Array {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
  }
  
  const result = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = (a[i] ?? 0) - (b[i] ?? 0);
  }
  
  return result;
}

/**
 * Optimized scalar multiplication using typed arrays
 * @param scalar - Scalar value
 * @param v - Vector
 * @returns scalar * v
 */
export function vectorScaleTyped(scalar: number, v: Float64Array): Float64Array {
  const result = new Float64Array(v.length);
  for (let i = 0; i < v.length; i++) {
    result[i] = scalar * (v[i] ?? 0);
  }
  return result;
}

/**
 * Optimized mean calculation using typed arrays
 * @param values - Input values
 * @returns Mean value
 */
export function meanTyped(values: Float64Array): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate mean of empty array');
  }
  
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i] ?? 0;
  }
  
  return sum / values.length;
}

/**
 * Optimized variance calculation using typed arrays
 * @param values - Input values
 * @param sample - If true, use sample variance (n-1)
 * @returns Variance
 */
export function varianceTyped(values: Float64Array, sample: boolean = true): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate variance of empty array');
  }
  
  if (sample && values.length === 1) {
    throw new Error('Cannot calculate sample variance with only one value');
  }
  
  const m = meanTyped(values);
  let sum = 0;
  
  for (let i = 0; i < values.length; i++) {
    const diff = (values[i] ?? 0) - m;
    sum += diff * diff;
  }
  
  const divisor = sample ? values.length - 1 : values.length;
  return sum / divisor;
}

/**
 * Optimized standard deviation using typed arrays
 * @param values - Input values
 * @param sample - If true, use sample std (n-1)
 * @returns Standard deviation
 */
export function stdTyped(values: Float64Array, sample: boolean = true): number {
  return Math.sqrt(varianceTyped(values, sample));
}

/**
 * Optimized normalization using typed arrays
 * @param values - Input values
 * @returns Normalized values
 */
export function normalizeTyped(values: Float64Array): Float64Array {
  if (values.length === 0) {
    return new Float64Array(0);
  }
  
  let min = values[0] ?? 0;
  let max = values[0] ?? 0;
  
  for (let i = 1; i < values.length; i++) {
    const val = values[i] ?? 0;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  
  const result = new Float64Array(values.length);
  
  if (min === max) {
    result.fill(0.5);
    return result;
  }
  
  const range = max - min;
  for (let i = 0; i < values.length; i++) {
    result[i] = ((values[i] ?? 0) - min) / range;
  }
  
  return result;
}

/**
 * Optimized standardization using typed arrays
 * @param values - Input values
 * @returns Standardized values
 */
export function standardizeTyped(values: Float64Array): Float64Array {
  if (values.length === 0) {
    return new Float64Array(0);
  }
  
  const m = meanTyped(values);
  const s = stdTyped(values, true);
  
  const result = new Float64Array(values.length);
  
  if (s === 0) {
    result.fill(0);
    return result;
  }
  
  for (let i = 0; i < values.length; i++) {
    result[i] = ((values[i] ?? 0) - m) / s;
  }
  
  return result;
}

/**
 * Optimized sum calculation using typed arrays
 * @param values - Input values
 * @returns Sum
 */
export function sumTyped(values: Float64Array): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i] ?? 0;
  }
  return sum;
}

/**
 * Optimized min calculation using typed arrays
 * @param values - Input values
 * @returns Minimum value
 */
export function minTyped(values: Float64Array): number {
  if (values.length === 0) {
    throw new Error('Cannot find minimum of empty array');
  }
  
  let min = values[0] ?? 0;
  for (let i = 1; i < values.length; i++) {
    const val = values[i] ?? 0;
    if (val < min) {
      min = val;
    }
  }
  
  return min;
}

/**
 * Optimized max calculation using typed arrays
 * @param values - Input values
 * @returns Maximum value
 */
export function maxTyped(values: Float64Array): number {
  if (values.length === 0) {
    throw new Error('Cannot find maximum of empty array');
  }
  
  let max = values[0] ?? 0;
  for (let i = 1; i < values.length; i++) {
    const val = values[i] ?? 0;
    if (val > max) {
      max = val;
    }
  }
  
  return max;
}

/**
 * Batch convert array of numbers to typed array
 * @param values - Input values
 * @returns Typed array
 */
export function toFloat64Array(values: number[]): Float64Array {
  return new Float64Array(values);
}

/**
 * Batch convert typed array to regular array
 * @param values - Typed array
 * @returns Regular array
 */
export function fromFloat64Array(values: Float64Array): number[] {
  return Array.from(values);
}
