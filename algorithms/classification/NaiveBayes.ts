/**
 * Naive Bayes Classification Algorithm
 * 
 * Implements Gaussian Naive Bayes classifier based on Bayes' theorem with the
 * "naive" assumption of conditional independence between features.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { BaseAlgorithm } from '../../types/algorithm';
import type { VisualizationData, Metrics, TrainingHistory } from '../../types/algorithm';
import { mean, sum } from '../../utils/math';

export interface NaiveBayesParams {
  smoothing: number;
  priors?: number[] | null;
}

interface ClassStatistics {
  mean: number[];
  variance: number[];
  prior: number;
  count: number;
}

export class NaiveBayes extends BaseAlgorithm {
  name = 'Naive Bayes';
  
  // Model parameters
  private classStats: Map<number, ClassStatistics> = new Map();
  private classes: number[] = [];
  private nFeatures: number = 0;
  
  // Training data (stored for visualization)
  private X_train: number[][] = [];
  private y_train: number[] = [];
  
  // Hyperparameters
  private smoothing: number;
  private priors: number[] | null;
  
  // Training history
  protected override trainingHistory: TrainingHistory & { 
    accuracy: number[];
    logLikelihood: number[];
  } = {
    epochs: [],
    loss: [],
    accuracy: [],
    logLikelihood: []
  };
  
  constructor(params: NaiveBayesParams = {
    smoothing: 1e-9,
    priors: null
  }) {
    super();
    this.smoothing = params.smoothing;
    this.priors = params.priors;
  }
  
  /**
   * Calculate mean and variance for each feature per class
   */
  private calculateClassStatistics(X: number[][], y: number[]): void {
    this.classStats.clear();
    this.classes = [...new Set(y)].sort((a, b) => a - b);
    this.nFeatures = X[0].length;
    
    const totalSamples = X.length;
    
    for (const cls of this.classes) {
      // Get samples for this class
      const classIndices = y.map((label, idx) => label === cls ? idx : -1)
                           .filter(idx => idx !== -1);
      const classX = classIndices.map(idx => X[idx]);
      const classCount = classX.length;
      
      // Calculate mean for each feature
      const featureMeans: number[] = [];
      for (let j = 0; j < this.nFeatures; j++) {
        const featureValues = classX.map(row => row[j]);
        featureMeans.push(mean(featureValues));
      }
      
      // Calculate variance for each feature
      const featureVariances: number[] = [];
      for (let j = 0; j < this.nFeatures; j++) {
        const featureValues = classX.map(row => row[j]);
        const featureMean = featureMeans[j];
        const variance = sum(featureValues.map(val => Math.pow(val - featureMean, 2))) / classCount;
        // Add smoothing to prevent zero variance
        featureVariances.push(variance + this.smoothing);
      }
      
      // Calculate prior probability
      const prior = this.priors ? this.priors[this.classes.indexOf(cls)] : classCount / totalSamples;
      
      this.classStats.set(cls, {
        mean: featureMeans,
        variance: featureVariances,
        prior: prior,
        count: classCount
      });
    }
  }
  
  /**
   * Calculate Gaussian probability density function
   */
  private gaussianPdf(x: number, mean: number, variance: number): number {
    const coefficient = 1 / Math.sqrt(2 * Math.PI * variance);
    const exponent = -Math.pow(x - mean, 2) / (2 * variance);
    return coefficient * Math.exp(exponent);
  }
  
  /**
   * Calculate log probability for a sample belonging to a class
   */
  private calculateLogProbability(x: number[], cls: number): number {
    const stats = this.classStats.get(cls)!;
    
    // Start with log prior
    let logProb = Math.log(stats.prior);
    
    // Add log likelihood for each feature (assuming independence)
    for (let j = 0; j < this.nFeatures; j++) {
      const pdf = this.gaussianPdf(x[j], stats.mean[j], stats.variance[j]);
      // Prevent log(0) by adding small epsilon
      logProb += Math.log(Math.max(pdf, 1e-300));
    }
    
    return logProb;
  }
  
  /**
   * Train the Naive Bayes classifier
   */
  async fit(X: number[][], y: number[]): Promise<void> {
    // Validate input
    this.validateInput(X);
    this.validateTarget(X, y);
    
    // Store training data
    this.X_train = X.map(row => [...row]);
    this.y_train = [...y];
    
    // Reset training history
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      logLikelihood: []
    };
    
    // Calculate class statistics
    this.calculateClassStatistics(X, y);
    
    // Calculate training metrics (Naive Bayes doesn't have epochs, but we'll show final metrics)
    const predictions = this.predictInternal(X);
    const accuracy = this.calculateAccuracy(predictions, y);
    const logLikelihood = this.calculateLogLikelihood(X, y);
    
    // Store single "epoch" of results
    this.trainingHistory.epochs.push(0);
    this.trainingHistory.loss.push(-logLikelihood); // Negative log-likelihood as loss
    this.trainingHistory.accuracy.push(accuracy);
    this.trainingHistory.logLikelihood.push(logLikelihood);
    
    this.trained = true;
  }
  
  /**
   * Calculate accuracy
   */
  private calculateAccuracy(predictions: number[], y: number[]): number {
    let correct = 0;
    for (let i = 0; i < y.length; i++) {
      if (predictions[i] === y[i]) {
        correct++;
      }
    }
    return correct / y.length;
  }
  
  /**
   * Calculate log-likelihood of the data
   */
  private calculateLogLikelihood(X: number[][], y: number[]): number {
    let totalLogLikelihood = 0;
    
    for (let i = 0; i < X.length; i++) {
      const logProb = this.calculateLogProbability(X[i], y[i]);
      totalLogLikelihood += logProb;
    }
    
    return totalLogLikelihood;
  }
  
  /**
   * Predict class probabilities for new data
   */
  predictProba(X: number[][]): number[][] {
    this.ensureTrained();
    this.validateInput(X, this.nFeatures);
    
    const probabilities: number[][] = [];
    
    for (const x of X) {
      const logProbs: number[] = [];
      
      // Calculate log probability for each class
      for (const cls of this.classes) {
        logProbs.push(this.calculateLogProbability(x, cls));
      }
      
      // Convert log probabilities to probabilities using log-sum-exp trick
      const maxLogProb = Math.max(...logProbs);
      const expProbs = logProbs.map(logProb => Math.exp(logProb - maxLogProb));
      const sumExpProbs = sum(expProbs);
      const normalizedProbs = expProbs.map(prob => prob / sumExpProbs);
      
      probabilities.push(normalizedProbs);
    }
    
    return probabilities;
  }
  
  /**
   * Internal prediction method without training check
   */
  private predictInternal(X: number[][]): number[] {
    const predictions: number[] = [];
    
    for (const x of X) {
      let bestClass = this.classes[0];
      let bestLogProb = this.calculateLogProbability(x, bestClass);
      
      // Find class with highest log probability
      for (let i = 1; i < this.classes.length; i++) {
        const cls = this.classes[i];
        const logProb = this.calculateLogProbability(x, cls);
        
        if (logProb > bestLogProb) {
          bestLogProb = logProb;
          bestClass = cls;
        }
      }
      
      predictions.push(bestClass);
    }
    
    return predictions;
  }

  /**
   * Make predictions on new data
   */
  predict(X: number[][]): number[] {
    this.ensureTrained();
    this.validateInput(X, this.nFeatures);
    return this.predictInternal(X);
  }
  
  /**
   * Generate decision boundary for 2D visualization
   */
  private generateDecisionBoundary(): { x: number[], y: number[], z: number[][] } | null {
    if (this.nFeatures !== 2) {
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
        const point = [[x1Grid[i], x2Grid[j]]];
        const pred = this.predictInternal(point)[0];
        row.push(pred);
      }
      predGrid.push(row);
    }
    
    return { x: x1Grid, y: x2Grid, z: predGrid };
  }
  
  /**
   * Generate probability contours for visualization
   */
  private generateProbabilityContours(): { x: number[], y: number[], z: number[][] } | null {
    if (this.nFeatures !== 2 || this.classes.length !== 2) {
      return null; // Only for 2D binary classification
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
    const probGrid: number[][] = [];
    
    for (let i = 0; i <= resolution; i++) {
      x1Grid.push(x1Min + (i / resolution) * (x1Max - x1Min));
    }
    
    for (let j = 0; j <= resolution; j++) {
      x2Grid.push(x2Min + (j / resolution) * (x2Max - x2Min));
    }
    
    // Compute probabilities for each grid point
    for (let j = 0; j <= resolution; j++) {
      const row: number[] = [];
      for (let i = 0; i <= resolution; i++) {
        const point = [[x1Grid[i], x2Grid[j]]];
        const proba = this.predictProba(point)[0];
        // Get probability of class 1
        row.push(proba[1]);
      }
      probGrid.push(row);
    }
    
    return { x: x1Grid, y: x2Grid, z: probGrid };
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
    if (this.nFeatures === 2) {
      const x1Values = this.X_train.map(row => row[0]);
      const x2Values = this.X_train.map(row => row[1]);
      
      // Create scatter plot for each class
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      const symbols = ['circle', 'x', 'triangle-up', 'square', 'diamond'];
      
      for (const cls of this.classes) {
        const classIndices = this.y_train.map((y, i) => y === cls ? i : -1).filter(i => i !== -1);
        const classX1 = classIndices.map(i => x1Values[i]);
        const classX2 = classIndices.map(i => x2Values[i]);
        
        visualizations.push({
          type: 'scatter2d',
          data: {
            x: classX1,
            y: classX2,
            mode: 'markers',
            name: `Class ${cls}`,
            marker: { 
              color: colors[cls % colors.length], 
              size: 8, 
              symbol: symbols[cls % symbols.length] 
            }
          }
        });
      }
      
      // Add decision boundary
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
            opacity: 0.3,
            name: 'Decision Boundary'
          }
        });
      }
      
      // Add probability contours for binary classification
      if (this.classes.length === 2) {
        const probData = this.generateProbabilityContours();
        if (probData) {
          visualizations.push({
            type: 'heatmap',
            data: {
              x: probData.x,
              y: probData.y,
              z: probData.z,
              colorscale: 'RdBu',
              reversescale: true,
              showscale: true,
              opacity: 0.6,
              name: 'Class Probabilities'
            }
          });
        }
      }
    }
    
    // Feature distributions by class (for first two features)
    if (this.nFeatures >= 1) {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      
      for (let featureIdx = 0; featureIdx < Math.min(2, this.nFeatures); featureIdx++) {
        const featureName = `Feature ${featureIdx + 1}`;
        
        for (const cls of this.classes) {
          const stats = this.classStats.get(cls)!;
          const featureMean = stats.mean[featureIdx];
          const variance = stats.variance[featureIdx];
          const std = Math.sqrt(variance);
          
          // Generate Gaussian curve
          const x: number[] = [];
          const y: number[] = [];
          const xMin = featureMean - 3 * std;
          const xMax = featureMean + 3 * std;
          
          for (let i = 0; i <= 100; i++) {
            const xVal = xMin + (i / 100) * (xMax - xMin);
            const yVal = this.gaussianPdf(xVal, featureMean, variance);
            x.push(xVal);
            y.push(yVal);
          }
          
          visualizations.push({
            type: 'line',
            data: {
              x: x,
              y: y,
              mode: 'lines',
              name: `${featureName} - Class ${cls}`,
              line: { 
                color: colors[cls % colors.length], 
                width: 2 
              }
            }
          });
        }
      }
    }
    
    // Training metrics
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.accuracy,
        mode: 'markers',
        name: 'Training Accuracy',
        marker: { color: '#10b981', size: 10 }
      }
    });
    
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.logLikelihood,
        mode: 'markers',
        name: 'Log-Likelihood',
        marker: { color: '#8b5cf6', size: 10 }
      }
    });
    
    return visualizations;
  }
  
  /**
   * Calculate performance metrics
   */
  getMetrics(): Metrics {
    if (!this.trained) {
      return {};
    }
    
    const predictions = this.predictInternal(this.X_train);
    const n = this.y_train.length;
    
    // Multi-class confusion matrix
    const confusionMatrix: number[][] = [];
    for (let i = 0; i < this.classes.length; i++) {
      confusionMatrix.push(new Array(this.classes.length).fill(0));
    }
    
    for (let i = 0; i < n; i++) {
      const trueIdx = this.classes.indexOf(this.y_train[i]);
      const predIdx = this.classes.indexOf(predictions[i]);
      if (trueIdx !== -1 && predIdx !== -1) {
        confusionMatrix[trueIdx][predIdx]++;
      }
    }
    
    // Accuracy
    const accuracy = this.calculateAccuracy(predictions, this.y_train);
    
    // For binary classification, calculate additional metrics
    let precision = 0;
    let recall = 0;
    let f1Score = 0;
    
    if (this.classes.length === 2) {
      const tp = confusionMatrix[1][1];
      const fp = confusionMatrix[0][1];
      const fn = confusionMatrix[1][0];
      
      precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      f1Score = precision + recall > 0 ? 
        2 * (precision * recall) / (precision + recall) : 0;
    }
    
    const metrics: Metrics = {
      accuracy,
      confusionMatrix
    };
    
    if (this.classes.length === 2) {
      metrics.precision = precision;
      metrics.recall = recall;
      metrics.f1Score = f1Score;
    }
    
    return metrics;
  }
  
  /**
   * Reset the model
   */
  override reset(): void {
    super.reset();
    this.classStats.clear();
    this.classes = [];
    this.nFeatures = 0;
    this.X_train = [];
    this.y_train = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      logLikelihood: []
    };
  }
  
  /**
   * Get model parameters
   */
  getParameters() {
    const classStatsObj: { [key: number]: ClassStatistics } = {};
    for (const [cls, stats] of this.classStats.entries()) {
      classStatsObj[cls] = {
        mean: [...stats.mean],
        variance: [...stats.variance],
        prior: stats.prior,
        count: stats.count
      };
    }
    
    return {
      classes: [...this.classes],
      nFeatures: this.nFeatures,
      smoothing: this.smoothing,
      classStats: classStatsObj
    };
  }
}