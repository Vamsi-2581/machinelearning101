/**
 * Missing Value Imputation Algorithm
 * Implements various strategies for handling missing values
 */

export type ImputationMethod = 'mean' | 'median' | 'mode' | 'forward-fill' | 'none';

export interface ImputationResult {
  imputed: (number | null)[][];
  original: (number | null)[][];
  method: ImputationMethod;
  missingCount: number;
  missingPercentage: number;
  imputedValues: Map<string, number>; // position -> imputed value
  statistics: {
    mean?: number[];
    median?: number[];
    mode?: number[];
  };
}

export class MissingValueImputation {
  private data: (number | null)[][] = [];
  private imputedData: (number | null)[][] = [];
  private method: ImputationMethod = 'none';
  private statistics: ImputationResult['statistics'] = {};

  constructor(data: (number | null)[][] = []) {
    this.data = data;
  }

  /**
   * Set the data with missing values
   */
  setData(data: (number | null)[][]): void {
    this.data = data;
    this.imputedData = [];
    this.statistics = {};
  }

  /**
   * Impute missing values using mean
   */
  imputeMean(): ImputationResult {
    if (this.data.length === 0) {
      throw new Error('No data to impute');
    }

    this.method = 'mean';
    const numFeatures = this.data[0].length;
    const means: number[] = [];
    const imputedValues = new Map<string, number>();

    // Calculate mean for each feature (excluding null values)
    for (let j = 0; j < numFeatures; j++) {
      const column = this.data.map(row => row[j]).filter(val => val !== null) as number[];
      means[j] = column.length > 0 
        ? column.reduce((sum, val) => sum + val, 0) / column.length 
        : 0;
    }

    // Apply imputation
    this.imputedData = this.data.map((row, i) => 
      row.map((value, j) => {
        if (value === null) {
          imputedValues.set(`${i},${j}`, means[j]);
          return means[j];
        }
        return value;
      })
    );

    this.statistics = { mean: means };
    return this.buildResult(imputedValues);
  }

  /**
   * Impute missing values using median
   */
  imputeMedian(): ImputationResult {
    if (this.data.length === 0) {
      throw new Error('No data to impute');
    }

    this.method = 'median';
    const numFeatures = this.data[0].length;
    const medians: number[] = [];
    const imputedValues = new Map<string, number>();

    // Calculate median for each feature (excluding null values)
    for (let j = 0; j < numFeatures; j++) {
      const column = this.data.map(row => row[j]).filter(val => val !== null) as number[];
      medians[j] = this.calculateMedian(column);
    }

    // Apply imputation
    this.imputedData = this.data.map((row, i) => 
      row.map((value, j) => {
        if (value === null) {
          imputedValues.set(`${i},${j}`, medians[j]);
          return medians[j];
        }
        return value;
      })
    );

    this.statistics = { median: medians };
    return this.buildResult(imputedValues);
  }

  /**
   * Impute missing values using mode (most frequent value)
   */
  imputeMode(): ImputationResult {
    if (this.data.length === 0) {
      throw new Error('No data to impute');
    }

    this.method = 'mode';
    const numFeatures = this.data[0].length;
    const modes: number[] = [];
    const imputedValues = new Map<string, number>();

    // Calculate mode for each feature (excluding null values)
    for (let j = 0; j < numFeatures; j++) {
      const column = this.data.map(row => row[j]).filter(val => val !== null) as number[];
      modes[j] = this.calculateMode(column);
    }

    // Apply imputation
    this.imputedData = this.data.map((row, i) => 
      row.map((value, j) => {
        if (value === null) {
          imputedValues.set(`${i},${j}`, modes[j]);
          return modes[j];
        }
        return value;
      })
    );

    this.statistics = { mode: modes };
    return this.buildResult(imputedValues);
  }

  /**
   * Impute missing values using forward fill
   * Fills missing values with the last observed value
   */
  imputeForwardFill(): ImputationResult {
    if (this.data.length === 0) {
      throw new Error('No data to impute');
    }

    this.method = 'forward-fill';
    const numFeatures = this.data[0].length;
    const imputedValues = new Map<string, number>();

    // Apply forward fill for each feature
    this.imputedData = [];
    for (let i = 0; i < this.data.length; i++) {
      const row: (number | null)[] = [];
      for (let j = 0; j < numFeatures; j++) {
        if (this.data[i][j] !== null) {
          row[j] = this.data[i][j];
        } else {
          // Look for last non-null value in this column
          let lastValue: number | null = null;
          for (let k = i - 1; k >= 0; k--) {
            if (this.data[k][j] !== null) {
              lastValue = this.data[k][j];
              break;
            }
          }
          if (lastValue !== null) {
            row[j] = lastValue;
            imputedValues.set(`${i},${j}`, lastValue);
          } else {
            // If no previous value, use 0 or keep null
            row[j] = 0;
            imputedValues.set(`${i},${j}`, 0);
          }
        }
      }
      this.imputedData.push(row);
    }

    return this.buildResult(imputedValues);
  }

  /**
   * Get the current result
   */
  getResult(): ImputationResult {
    const imputedValues = new Map<string, number>();
    return this.buildResult(imputedValues);
  }

  /**
   * Reset to original data
   */
  reset(): void {
    this.imputedData = [];
    this.method = 'none';
    this.statistics = {};
  }

  /**
   * Generate data with missing values
   */
  static generateDataWithMissing(
    rows: number,
    cols: number,
    missingPercentage: number,
    valueRange: number = 100
  ): (number | null)[][] {
    const data: (number | null)[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: (number | null)[] = [];
      for (let j = 0; j < cols; j++) {
        // Randomly decide if this value should be missing
        if (Math.random() < missingPercentage / 100) {
          row.push(null);
        } else {
          row.push(Math.random() * valueRange);
        }
      }
      data.push(row);
    }
    
    return data;
  }

  // Helper methods
  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  }

  private calculateMode(values: number[]): number {
    if (values.length === 0) return 0;
    
    const frequency = new Map<number, number>();
    values.forEach(val => {
      frequency.set(val, (frequency.get(val) || 0) + 1);
    });
    
    let maxFreq = 0;
    let mode = values[0];
    frequency.forEach((freq, val) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = val;
      }
    });
    
    return mode;
  }

  private countMissing(): number {
    let count = 0;
    this.data.forEach(row => {
      row.forEach(val => {
        if (val === null) count++;
      });
    });
    return count;
  }

  private buildResult(imputedValues: Map<string, number>): ImputationResult {
    const missingCount = this.countMissing();
    const totalValues = this.data.length * (this.data[0]?.length || 0);
    
    return {
      imputed: this.imputedData.length > 0 ? this.imputedData : this.data,
      original: this.data,
      method: this.method,
      missingCount,
      missingPercentage: totalValues > 0 ? (missingCount / totalValues) * 100 : 0,
      imputedValues,
      statistics: this.statistics,
    };
  }
}
