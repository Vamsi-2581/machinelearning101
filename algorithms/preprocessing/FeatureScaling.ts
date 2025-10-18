/**
 * Feature Scaling Algorithm
 * Implements normalization (min-max scaling) and standardization (z-score)
 */

export type ScalingMethod = 'normalize' | 'standardize' | 'none';

export interface ScalingResult {
  scaled: number[][];
  original: number[][];
  method: ScalingMethod;
  statistics: {
    originalMin?: number[];
    originalMax?: number[];
    originalMean?: number[];
    originalStd?: number[];
    scaledMin?: number[];
    scaledMax?: number[];
    scaledMean?: number[];
    scaledStd?: number[];
  };
}

export class FeatureScaling {
  private data: number[][] = [];
  private scaledData: number[][] = [];
  private method: ScalingMethod = 'none';
  private statistics: ScalingResult['statistics'] = {};

  constructor(data: number[][] = []) {
    this.data = data;
  }

  /**
   * Set the data to be scaled
   */
  setData(data: number[][]): void {
    this.data = data;
    this.scaledData = [];
    this.statistics = {};
  }

  /**
   * Apply normalization (min-max scaling) to scale features to [0, 1]
   * Formula: (x - min) / (max - min)
   */
  normalize(): ScalingResult {
    if (this.data.length === 0) {
      throw new Error('No data to normalize');
    }

    this.method = 'normalize';
    const numFeatures = this.data[0].length;
    
    // Calculate min and max for each feature
    const mins: number[] = [];
    const maxs: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = this.data.map(row => row[j]);
      mins[j] = Math.min(...column);
      maxs[j] = Math.max(...column);
    }

    // Apply normalization
    this.scaledData = this.data.map(row => 
      row.map((value, j) => {
        const range = maxs[j] - mins[j];
        return range === 0 ? 0 : (value - mins[j]) / range;
      })
    );

    // Calculate statistics
    this.statistics = {
      originalMin: mins,
      originalMax: maxs,
      originalMean: this.calculateMeans(this.data),
      originalStd: this.calculateStds(this.data),
      scaledMin: this.calculateMins(this.scaledData),
      scaledMax: this.calculateMaxs(this.scaledData),
      scaledMean: this.calculateMeans(this.scaledData),
      scaledStd: this.calculateStds(this.scaledData),
    };

    return this.getResult();
  }

  /**
   * Apply standardization (z-score normalization)
   * Formula: (x - mean) / std
   */
  standardize(): ScalingResult {
    if (this.data.length === 0) {
      throw new Error('No data to standardize');
    }

    this.method = 'standardize';
    const numFeatures = this.data[0].length;
    
    // Calculate mean and std for each feature
    const means: number[] = [];
    const stds: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = this.data.map(row => row[j]);
      means[j] = column.reduce((sum, val) => sum + val, 0) / column.length;
      
      const variance = column.reduce((sum, val) => sum + Math.pow(val - means[j], 2), 0) / column.length;
      stds[j] = Math.sqrt(variance);
    }

    // Apply standardization
    this.scaledData = this.data.map(row => 
      row.map((value, j) => {
        return stds[j] === 0 ? 0 : (value - means[j]) / stds[j];
      })
    );

    // Calculate statistics
    this.statistics = {
      originalMin: this.calculateMins(this.data),
      originalMax: this.calculateMaxs(this.data),
      originalMean: means,
      originalStd: stds,
      scaledMin: this.calculateMins(this.scaledData),
      scaledMax: this.calculateMaxs(this.scaledData),
      scaledMean: this.calculateMeans(this.scaledData),
      scaledStd: this.calculateStds(this.scaledData),
    };

    return this.getResult();
  }

  /**
   * Get the current result
   */
  getResult(): ScalingResult {
    return {
      scaled: this.scaledData.length > 0 ? this.scaledData : this.data,
      original: this.data,
      method: this.method,
      statistics: this.statistics,
    };
  }

  /**
   * Reset to original data
   */
  reset(): void {
    this.scaledData = [];
    this.method = 'none';
    this.statistics = {};
  }

  // Helper methods for statistics
  private calculateMeans(data: number[][]): number[] {
    if (data.length === 0) return [];
    const numFeatures = data[0].length;
    const means: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = data.map(row => row[j]);
      means[j] = column.reduce((sum, val) => sum + val, 0) / column.length;
    }
    
    return means;
  }

  private calculateStds(data: number[][]): number[] {
    if (data.length === 0) return [];
    const means = this.calculateMeans(data);
    const numFeatures = data[0].length;
    const stds: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = data.map(row => row[j]);
      const variance = column.reduce((sum, val) => sum + Math.pow(val - means[j], 2), 0) / column.length;
      stds[j] = Math.sqrt(variance);
    }
    
    return stds;
  }

  private calculateMins(data: number[][]): number[] {
    if (data.length === 0) return [];
    const numFeatures = data[0].length;
    const mins: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = data.map(row => row[j]);
      mins[j] = Math.min(...column);
    }
    
    return mins;
  }

  private calculateMaxs(data: number[][]): number[] {
    if (data.length === 0) return [];
    const numFeatures = data[0].length;
    const maxs: number[] = [];
    
    for (let j = 0; j < numFeatures; j++) {
      const column = data.map(row => row[j]);
      maxs[j] = Math.max(...column);
    }
    
    return maxs;
  }
}
