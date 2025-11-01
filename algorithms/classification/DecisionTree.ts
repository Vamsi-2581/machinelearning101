/**
 * Decision Tree Classification Algorithm
 * 
 * Implements decision tree classification using recursive binary splitting.
 * Supports Gini impurity and entropy splitting criteria.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { BaseAlgorithm } from '../../types/algorithm';
import type { VisualizationData, Metrics } from '../../types/algorithm';

export interface DecisionTreeParams {
  maxDepth: number;
  minSamplesSplit: number;
  criterion: 'gini' | 'entropy';
}

interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  value?: number; // Class label for leaf nodes
  samples?: number;
  impurity?: number;
  classDistribution?: { [key: number]: number };
}

export class DecisionTree extends BaseAlgorithm {
  name = 'Decision Tree';
  
  // Model parameters
  private maxDepth: number;
  private minSamplesSplit: number;
  private criterion: 'gini' | 'entropy';
  
  // Trained model
  private root: TreeNode | null = null;
  
  // Training data (for visualization)
  private X_train: number[][] = [];
  private y_train: number[] = [];
  
  // Unique classes
  private classes: number[] = [];
  
  // Feature importance
  private featureImportances: number[] = [];
  
  constructor(params: DecisionTreeParams = {
    maxDepth: 5,
    minSamplesSplit: 2,
    criterion: 'gini'
  }) {
    super();
    this.maxDepth = params.maxDepth;
    this.minSamplesSplit = params.minSamplesSplit;
    this.criterion = params.criterion;
  }
  
  /**
   * Calculate Gini impurity for a set of labels
   */
  private calculateGini(labels: number[]): number {
    if (labels.length === 0) return 0;
    
    const counts: { [key: number]: number } = {};
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }
    
    let gini = 1.0;
    const n = labels.length;
    
    for (const count of Object.values(counts)) {
      const prob = count / n;
      gini -= prob * prob;
    }
    
    return gini;
  }
  
  /**
   * Calculate entropy for a set of labels
   */
  private calculateEntropy(labels: number[]): number {
    if (labels.length === 0) return 0;
    
    const counts: { [key: number]: number } = {};
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }
    
    let entropy = 0.0;
    const n = labels.length;
    
    for (const count of Object.values(counts)) {
      if (count === 0) continue;
      const prob = count / n;
      entropy -= prob * Math.log2(prob);
    }
    
    return entropy;
  }
  
  /**
   * Calculate impurity based on selected criterion
   */
  private calculateImpurity(labels: number[]): number {
    if (this.criterion === 'gini') {
      return this.calculateGini(labels);
    } else {
      return this.calculateEntropy(labels);
    }
  }
  
  /**
   * Find the best split for a node
   */
  private findBestSplit(X: number[][], y: number[]): {
    featureIndex: number;
    threshold: number;
    gain: number;
  } | null {
    const nSamples = X.length;
    const nFeatures = X[0].length;
    
    if (nSamples < this.minSamplesSplit) {
      return null;
    }
    
    const parentImpurity = this.calculateImpurity(y);
    let bestGain = 0;
    let bestFeature = 0;
    let bestThreshold = 0;
    
    // Try each feature
    for (let featureIdx = 0; featureIdx < nFeatures; featureIdx++) {
      // Get unique values for this feature
      const values = X.map(row => row[featureIdx]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      // Try each threshold (midpoint between consecutive unique values)
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        // Split data
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];
        
        for (let j = 0; j < nSamples; j++) {
          if (X[j][featureIdx] <= threshold) {
            leftIndices.push(j);
          } else {
            rightIndices.push(j);
          }
        }
        
        if (leftIndices.length === 0 || rightIndices.length === 0) {
          continue;
        }
        
        // Calculate weighted impurity
        const leftLabels = leftIndices.map(idx => y[idx]);
        const rightLabels = rightIndices.map(idx => y[idx]);
        
        const leftImpurity = this.calculateImpurity(leftLabels);
        const rightImpurity = this.calculateImpurity(rightLabels);
        
        const weightedImpurity = 
          (leftLabels.length / nSamples) * leftImpurity +
          (rightLabels.length / nSamples) * rightImpurity;
        
        const gain = parentImpurity - weightedImpurity;
        
        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = featureIdx;
          bestThreshold = threshold;
        }
      }
    }
    
    if (bestGain === 0) {
      return null;
    }
    
    // Update feature importance
    this.featureImportances[bestFeature] += bestGain * nSamples;
    
    return {
      featureIndex: bestFeature,
      threshold: bestThreshold,
      gain: bestGain
    };
  }
  
  /**
   * Get class distribution for a set of labels
   */
  private getClassDistribution(labels: number[]): { [key: number]: number } {
    const distribution: { [key: number]: number } = {};
    for (const label of labels) {
      distribution[label] = (distribution[label] || 0) + 1;
    }
    return distribution;
  }
  
  /**
   * Get majority class from labels
   */
  private getMajorityClass(labels: number[]): number {
    const counts: { [key: number]: number } = {};
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }
    
    let maxCount = 0;
    let majorityClass = labels[0];
    
    for (const [label, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        majorityClass = parseInt(label);
      }
    }
    
    return majorityClass;
  }
  
  /**
   * Build decision tree recursively
   */
  private buildTree(X: number[][], y: number[], depth: number): TreeNode {
    const nSamples = X.length;
    const impurity = this.calculateImpurity(y);
    const classDistribution = this.getClassDistribution(y);
    
    // Create leaf node if stopping criteria met
    if (
      depth >= this.maxDepth ||
      nSamples < this.minSamplesSplit ||
      impurity === 0
    ) {
      return {
        value: this.getMajorityClass(y),
        samples: nSamples,
        impurity,
        classDistribution
      };
    }
    
    // Find best split
    const split = this.findBestSplit(X, y);
    
    if (!split) {
      return {
        value: this.getMajorityClass(y),
        samples: nSamples,
        impurity,
        classDistribution
      };
    }
    
    // Split data
    const leftX: number[][] = [];
    const leftY: number[] = [];
    const rightX: number[][] = [];
    const rightY: number[] = [];
    
    for (let i = 0; i < nSamples; i++) {
      if (X[i][split.featureIndex] <= split.threshold) {
        leftX.push(X[i]);
        leftY.push(y[i]);
      } else {
        rightX.push(X[i]);
        rightY.push(y[i]);
      }
    }
    
    // Recursively build subtrees
    const leftChild = this.buildTree(leftX, leftY, depth + 1);
    const rightChild = this.buildTree(rightX, rightY, depth + 1);
    
    return {
      featureIndex: split.featureIndex,
      threshold: split.threshold,
      left: leftChild,
      right: rightChild,
      samples: nSamples,
      impurity,
      classDistribution
    };
  }
  
  /**
   * Train the decision tree
   */
  async fit(X: number[][], y: number[]): Promise<void> {
    // Validate input
    this.validateInput(X);
    this.validateTarget(X, y);
    
    // Store training data
    this.X_train = X.map(row => [...row]);
    this.y_train = [...y];
    
    // Get unique classes
    this.classes = [...new Set(y)].sort((a, b) => a - b);
    
    // Initialize feature importances
    this.featureImportances = new Array(X[0].length).fill(0);
    
    // Build tree
    this.root = this.buildTree(X, y, 0);
    
    // Normalize feature importances
    const totalImportance = this.featureImportances.reduce((sum, val) => sum + val, 0);
    if (totalImportance > 0) {
      this.featureImportances = this.featureImportances.map(val => val / totalImportance);
    }
    
    this.trained = true;
  }
  
  /**
   * Predict class for a single sample
   */
  private predictSingle(x: number[]): number {
    let node = this.root;
    
    while (node && node.featureIndex !== undefined) {
      if (x[node.featureIndex] <= node.threshold!) {
        node = node.left!;
      } else {
        node = node.right!;
      }
    }
    
    return node?.value ?? this.classes[0];
  }
  
  /**
   * Make predictions on new data
   */
  predict(X: number[][]): number[] {
    this.ensureTrained();
    this.validateInput(X, this.X_train[0].length);
    
    return X.map(x => this.predictSingle(x));
  }
  
  /**
   * Generate decision boundary for 2D visualization
   */
  private generateDecisionBoundary(): { x: number[], y: number[], z: number[][] } | null {
    if (this.X_train[0].length !== 2) {
      return null; // Only for 2D features
    }
    
    // Get data range
    const x1Values = this.X_train.map(row => row[0]);
    const x2Values = this.X_train.map(row => row[1]);
    
    const x1Min = Math.min(...x1Values) - 1;
    const x1Max = Math.max(...x1Values) + 1;
    const x2Min = Math.min(...x2Values) - 1;
    const x2Max = Math.max(...x2Values) + 1;
    
    // Create grid
    const resolution = 50;
    const x1Grid: number[] = [];
    const x2Grid: number[] = [];
    const predGrid: number[][] = [];
    
    for (let i = 0; i <= resolution; i++) {
      x1Grid.push(x1Min + (i / resolution) * (x1Max - x1Min));
    }
    
    for (let j = 0; j <= resolution; j++) {
      x2Grid.push(x2Min + (j / resolution) * (x2Max - x2Min));
    }
    
    // Compute predictions for each grid point
    for (let j = 0; j <= resolution; j++) {
      const row: number[] = [];
      for (let i = 0; i <= resolution; i++) {
        const point = [x1Grid[i], x2Grid[j]];
        const prediction = this.predictSingle(point);
        row.push(prediction);
      }
      predGrid.push(row);
    }
    
    return { x: x1Grid, y: x2Grid, z: predGrid };
  }
  
  /**
   * Get visualization data for plotting
   */
  getVisualizationData(): VisualizationData[] {
    if (!this.trained) {
      return [];
    }
    
    const visualizations: VisualizationData[] = [];
    
    // For 2D classification, create scatter plot with decision boundary
    if (this.X_train[0].length === 2) {
      const x1Values = this.X_train.map(row => row[0]);
      const x2Values = this.X_train.map(row => row[1]);
      
      // Create scatter data for each class
      const scatterData: any = {};
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      const symbols = ['circle', 'x', 'diamond', 'square', 'triangle-up'];
      
      for (let classIdx = 0; classIdx < this.classes.length; classIdx++) {
        const classLabel = this.classes[classIdx];
        const classX1 = x1Values.filter((_, i) => this.y_train[i] === classLabel);
        const classX2 = x2Values.filter((_, i) => this.y_train[i] === classLabel);
        
        scatterData[`class${classIdx}`] = {
          x: classX1,
          y: classX2,
          mode: 'markers',
          name: `Class ${classLabel}`,
          marker: { 
            color: colors[classIdx % colors.length], 
            size: 8, 
            symbol: symbols[classIdx % symbols.length]
          }
        };
      }
      
      visualizations.push({
        type: 'scatter2d',
        data: scatterData
      });
      
      // Add decision boundary heatmap
      const boundaryData = this.generateDecisionBoundary();
      if (boundaryData) {
        visualizations.push({
          type: 'heatmap',
          data: {
            x: boundaryData.x,
            y: boundaryData.y,
            z: boundaryData.z,
            colorscale: 'Viridis',
            showscale: true,
            opacity: 0.4,
            name: 'Decision Boundary'
          }
        });
      }
    }
    
    return visualizations;
  }
  
  /**
   * Calculate performance metrics
   */
  getMetrics(): Metrics {
    if (!this.trained) {
      return {};
    }
    
    const predictions = this.predict(this.X_train);
    const n = this.y_train.length;
    
    // For binary classification
    if (this.classes.length === 2) {
      // Confusion matrix
      let tp = 0, tn = 0, fp = 0, fn = 0;
      
      for (let i = 0; i < n; i++) {
        if (this.y_train[i] === 1 && predictions[i] === 1) tp++;
        else if (this.y_train[i] === 0 && predictions[i] === 0) tn++;
        else if (this.y_train[i] === 0 && predictions[i] === 1) fp++;
        else if (this.y_train[i] === 1 && predictions[i] === 0) fn++;
      }
      
      const confusionMatrix = [
        [tn, fp],
        [fn, tp]
      ];
      
      // Accuracy
      const accuracy = (tp + tn) / n;
      
      // Precision
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      
      // Recall
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      
      // F1 Score
      const f1Score = precision + recall > 0 ? 
        2 * (precision * recall) / (precision + recall) : 0;
      
      return {
        accuracy,
        precision,
        recall,
        f1Score,
        confusionMatrix
      };
    } else {
      // Multi-class classification
      // Build confusion matrix
      const confusionMatrix: number[][] = [];
      for (let i = 0; i < this.classes.length; i++) {
        confusionMatrix.push(new Array(this.classes.length).fill(0));
      }
      
      for (let i = 0; i < n; i++) {
        const trueIdx = this.classes.indexOf(this.y_train[i]);
        const predIdx = this.classes.indexOf(predictions[i]);
        confusionMatrix[trueIdx][predIdx]++;
      }
      
      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < n; i++) {
        if (predictions[i] === this.y_train[i]) correct++;
      }
      const accuracy = correct / n;
      
      // Calculate macro-averaged precision, recall, F1
      let totalPrecision = 0;
      let totalRecall = 0;
      
      for (let classIdx = 0; classIdx < this.classes.length; classIdx++) {
        let tp = confusionMatrix[classIdx][classIdx];
        let fp = 0;
        let fn = 0;
        
        for (let i = 0; i < this.classes.length; i++) {
          if (i !== classIdx) {
            fp += confusionMatrix[i][classIdx];
            fn += confusionMatrix[classIdx][i];
          }
        }
        
        const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
        const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
        
        totalPrecision += precision;
        totalRecall += recall;
      }
      
      const avgPrecision = totalPrecision / this.classes.length;
      const avgRecall = totalRecall / this.classes.length;
      const f1Score = avgPrecision + avgRecall > 0 ?
        2 * (avgPrecision * avgRecall) / (avgPrecision + avgRecall) : 0;
      
      return {
        accuracy,
        precision: avgPrecision,
        recall: avgRecall,
        f1Score,
        confusionMatrix
      };
    }
  }
  
  /**
   * Reset the model
   */
  override reset(): void {
    super.reset();
    this.root = null;
    this.X_train = [];
    this.y_train = [];
    this.classes = [];
    this.featureImportances = [];
  }
  
  /**
   * Get model parameters
   */
  getParameters() {
    return {
      maxDepth: this.maxDepth,
      minSamplesSplit: this.minSamplesSplit,
      criterion: this.criterion,
      numTrainingSamples: this.X_train.length,
      numFeatures: this.X_train.length > 0 ? this.X_train[0].length : 0,
      classes: [...this.classes],
      featureImportances: [...this.featureImportances]
    };
  }
}
