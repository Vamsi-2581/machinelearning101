/**
 * AdaBoost (Adaptive Boosting) Classification Algorithm
 * 
 * Implements AdaBoost for binary classification by sequentially training
 * weak learners (decision stumps) and adaptively adjusting sample weights
 * based on classification errors. Each weak learner focuses on previously
 * misclassified examples.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { BaseAlgorithm } from '../../types/algorithm';
import type { VisualizationData, Metrics, TrainingHistory } from '../../types/algorithm';
import { mean, sum } from '../../utils/math';

export interface AdaBoostParams {
  nEstimators: number;
  learningRate: number;
  algorithm: 'SAMME' | 'SAMME.R';
  randomState?: number;
}

interface DecisionStump {
  featureIndex: number;
  threshold: number;
  polarity: number; // 1 or -1
  alpha: number; // weight of this weak learner
  error: number;
}

export class AdaBoost extends BaseAlgorithm {
  name = 'AdaBoost';
  
  // Model parameters
  private stumps: DecisionStump[] = [];
  private classes: number[] = [];
  private nFeatures: number = 0;
  
  // Training data (stored for visualization)
  private X_train: number[][] = [];
  private y_train: number[] = [];
  private sampleWeights: number[] = [];
  
  // Hyperparameters
  private nEstimators: number;
  private learningRate: number;
  private algorithm: 'SAMME' | 'SAMME.R';
  private randomState?: number;
  
  // Training history
  protected override trainingHistory: TrainingHistory & { 
    accuracy: number[];
    weightedError: number[];
    alpha: number[];
    stumpErrors: number[];
  } = {
    epochs: [],
    loss: [],
    accuracy: [],
    weightedError: [],
    alpha: [],
    stumpErrors: []
  };
  
  constructor(params: AdaBoostParams = {
    nEstimators: 50,
    learningRate: 1.0,
    algorithm: 'SAMME'
  }) {
    super();
    this.nEstimators = params.nEstimators;
    this.learningRate = params.learningRate;
    this.algorithm = params.algorithm;
    this.randomState = params.randomState;
  }
  
  /**
   * Find the best decision stump for the current weighted dataset
   */
  private findBestStump(X: number[][], y: number[], weights: number[]): DecisionStump {
    let bestStump: DecisionStump = {
      featureIndex: 0,
      threshold: 0,
      polarity: 1,
      alpha: 0,
      error: Infinity
    };
    
    const totalWeight = sum(weights);
    
    // Try each feature
    for (let featureIdx = 0; featureIdx < this.nFeatures; featureIdx++) {
      // Get unique values for this feature
      const featureValues = X.map(row => row[featureIdx]);
      const uniqueValues = [...new Set(featureValues)].sort((a, b) => a - b);
      
      // Try each threshold
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        // Try both polarities
        for (const polarity of [1, -1]) {
          let weightedError = 0;
          
          // Calculate weighted error for this stump
          for (let j = 0; j < X.length; j++) {
            const prediction = X[j][featureIdx] <= threshold ? polarity : -polarity;
            const actualLabel = y[j] === this.classes[1] ? 1 : -1; // Convert to {-1, +1}
            
            if (prediction !== actualLabel) {
              weightedError += weights[j];
            }
          }
          
          weightedError /= totalWeight;
          
          // Update best stump if this is better
          if (weightedError < bestStump.error) {
            bestStump = {
              featureIndex: featureIdx,
              threshold: threshold,
              polarity: polarity,
              alpha: 0, // Will be calculated later
              error: weightedError
            };
          }
        }
      }
    }
    
    return bestStump;
  }
  
  /**
   * Make prediction with a single decision stump
   */
  private predictStump(stump: DecisionStump, X: number[][]): number[] {
    const predictions: number[] = [];
    
    for (const x of X) {
      const prediction = x[stump.featureIndex] <= stump.threshold ? 
        stump.polarity : -stump.polarity;
      predictions.push(prediction);
    }
    
    return predictions;
  }
  
  /**
   * Calculate the alpha (weight) for a weak learner
   */
  private calculateAlpha(error: number): number {
    // Prevent division by zero and log(0)
    const clampedError = Math.max(1e-10, Math.min(1 - 1e-10, error));
    return this.learningRate * 0.5 * Math.log((1 - clampedError) / clampedError);
  }
  
  /**
   * Update sample weights based on predictions
   */
  private updateWeights(weights: number[], y: number[], predictions: number[], alpha: number): number[] {
    const newWeights: number[] = [];
    
    for (let i = 0; i < weights.length; i++) {
      const actualLabel = y[i] === this.classes[1] ? 1 : -1;
      const exponentialTerm = Math.exp(-alpha * actualLabel * predictions[i]);
      newWeights.push(weights[i] * exponentialTerm);
    }
    
    // Normalize weights
    const totalWeight = sum(newWeights);
    if (totalWeight > 0) {
      for (let i = 0; i < newWeights.length; i++) {
        newWeights[i] /= totalWeight;
      }
    }
    
    return newWeights;
  }
  
  /**
   * Get ensemble predictions (raw scores)
   */
  private getEnsemblePredictions(X: number[][]): number[] {
    const predictions = new Array(X.length).fill(0);
    
    for (const stump of this.stumps) {
      const stumpPreds = this.predictStump(stump, X);
      for (let i = 0; i < predictions.length; i++) {
        predictions[i] += stump.alpha * stumpPreds[i];
      }
    }
    
    return predictions;
  }
  
  /**
   * Calculate exponential loss (AdaBoost's loss function)
   */
  private calculateExponentialLoss(predictions: number[], y: number[]): number {
    let loss = 0;
    
    for (let i = 0; i < y.length; i++) {
      const actualLabel = y[i] === this.classes[1] ? 1 : -1;
      loss += Math.exp(-actualLabel * predictions[i]);
    }
    
    return loss / y.length;
  }
  
  /**
   * Train the AdaBoost classifier
   */
  async fit(X: number[][], y: number[]): Promise<void> {
    // Validate input
    this.validateInput(X);
    this.validateTarget(X, y);
    
    // Store training data
    this.X_train = X.map(row => [...row]);
    this.y_train = [...y];
    this.nFeatures = X[0].length;
    
    // Get unique classes and ensure binary classification
    this.classes = [...new Set(y)].sort((a, b) => a - b);
    if (this.classes.length !== 2) {
      throw new Error('AdaBoost currently supports only binary classification');
    }
    
    // Initialize sample weights uniformly
    const n = X.length;
    this.sampleWeights = new Array(n).fill(1 / n);
    
    // Reset model and history
    this.stumps = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      weightedError: [],
      alpha: [],
      stumpErrors: []
    };
    
    // Train weak learners sequentially
    for (let iteration = 0; iteration < this.nEstimators; iteration++) {
      // Find best decision stump for current weighted dataset
      const stump = this.findBestStump(X, y, this.sampleWeights);
      
      // Check if error is too high (worse than random guessing)
      if (stump.error >= 0.5) {
        console.warn(`Stopping early: weak learner error (${stump.error}) >= 0.5 at iteration ${iteration}`);
        break;
      }
      
      // Calculate alpha (weight) for this weak learner
      stump.alpha = this.calculateAlpha(stump.error);
      
      // Add stump to ensemble
      this.stumps.push(stump);
      
      // Get predictions from this stump
      const stumpPredictions = this.predictStump(stump, X);
      
      // Update sample weights
      this.sampleWeights = this.updateWeights(this.sampleWeights, y, stumpPredictions, stump.alpha);
      
      // Calculate ensemble predictions and metrics
      const ensemblePredictions = this.getEnsemblePredictions(X);
      const finalPredictions = ensemblePredictions.map(pred => pred >= 0 ? this.classes[1] : this.classes[0]);
      
      const accuracy = finalPredictions.reduce((acc, pred, i) => acc + (pred === y[i] ? 1 : 0), 0) / y.length;
      const exponentialLoss = this.calculateExponentialLoss(ensemblePredictions, y);
      
      // Store training history
      this.trainingHistory.epochs.push(iteration);
      this.trainingHistory.loss.push(exponentialLoss);
      this.trainingHistory.accuracy.push(accuracy);
      this.trainingHistory.weightedError.push(stump.error);
      this.trainingHistory.alpha.push(stump.alpha);
      this.trainingHistory.stumpErrors.push(stump.error);
      
      // Early stopping if perfect accuracy
      if (accuracy >= 0.999) {
        break;
      }
    }
    
    this.trained = true;
  }
  
  /**
   * Predict class probabilities for new data
   */
  predictProba(X: number[][]): number[][] {
    this.ensureTrained();
    this.validateInput(X, this.nFeatures);
    
    const rawPredictions = this.getEnsemblePredictions(X);
    const probabilities: number[][] = [];
    
    for (const rawPred of rawPredictions) {
      // Convert raw prediction to probability using sigmoid-like transformation
      // For AdaBoost, we use the sign of the prediction for classification
      // and convert to probabilities
      const prob1 = 1 / (1 + Math.exp(-2 * rawPred)); // Sigmoid with scaling
      const prob0 = 1 - prob1;
      probabilities.push([prob0, prob1]);
    }
    
    return probabilities;
  }
  
  /**
   * Make predictions on new data
   */
  predict(X: number[][]): number[] {
    this.ensureTrained();
    this.validateInput(X, this.nFeatures);
    
    const rawPredictions = this.getEnsemblePredictions(X);
    return rawPredictions.map(pred => pred >= 0 ? this.classes[1] : this.classes[0]);
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
        const prob = this.predictProba(point)[0][1];
        row.push(prob);
      }
      predGrid.push(row);
    }
    
    return { x: x1Grid, y: x2Grid, z: predGrid };
  }
  
  /**
   * Get feature importance based on how often features are used in stumps
   */
  private getFeatureImportance(): number[] {
    const importance = new Array(this.nFeatures).fill(0);
    
    for (const stump of this.stumps) {
      importance[stump.featureIndex] += stump.alpha;
    }
    
    // Normalize
    const total = sum(importance);
    if (total > 0) {
      for (let i = 0; i < importance.length; i++) {
        importance[i] /= total;
      }
    }
    
    return importance;
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
      
      // Create scatter plot for each class with sample weights as marker size
      const colors = ['#3b82f6', '#ef4444'];
      const symbols = ['circle', 'x'];
      
      for (let i = 0; i < this.classes.length; i++) {
        const cls = this.classes[i];
        const classIndices = this.y_train.map((y, idx) => y === cls ? idx : -1).filter(idx => idx !== -1);
        const classX1 = classIndices.map(idx => x1Values[idx]);
        const classX2 = classIndices.map(idx => x2Values[idx]);
        const classSizes = classIndices.map(idx => Math.max(4, this.sampleWeights[idx] * 100 * this.X_train.length));
        
        visualizations.push({
          type: 'scatter2d',
          data: {
            x: classX1,
            y: classX2,
            mode: 'markers',
            name: `Class ${cls}`,
            marker: { 
              color: colors[i], 
              size: classSizes,
              symbol: symbols[i],
              sizemode: 'diameter',
              sizemin: 4
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
            colorscale: 'RdBu',
            reversescale: true,
            showscale: true,
            opacity: 0.6,
            name: 'Decision Boundary'
          }
        });
      }
    }
    
    // Training curves
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.loss,
        mode: 'lines+markers',
        name: 'Exponential Loss',
        line: { color: '#ef4444', width: 2 },
        marker: { size: 4 }
      }
    });
    
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.accuracy,
        mode: 'lines+markers',
        name: 'Training Accuracy',
        line: { color: '#10b981', width: 2 },
        marker: { size: 4 }
      }
    });
    
    // Weighted error for each weak learner
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.weightedError,
        mode: 'lines+markers',
        name: 'Weighted Error',
        line: { color: '#f59e0b', width: 2 },
        marker: { size: 4 }
      }
    });
    
    // Alpha values (weak learner weights)
    visualizations.push({
      type: 'bar',
      data: {
        x: this.trainingHistory.epochs.map(e => `Stump ${e + 1}`),
        y: this.trainingHistory.alpha,
        name: 'Weak Learner Weights (α)',
        marker: { color: '#8b5cf6' }
      }
    });
    
    // Feature importance
    if (this.nFeatures <= 10) {
      const importance = this.getFeatureImportance();
      const featureNames = Array.from({ length: this.nFeatures }, (_, i) => `Feature ${i + 1}`);
      
      visualizations.push({
        type: 'bar',
        data: {
          x: featureNames,
          y: importance,
          name: 'Feature Importance',
          marker: { color: '#06b6d4' }
        }
      });
    }
    
    // Sample weights evolution (show final weights)
    if (this.nFeatures === 2) {
      const x1Values = this.X_train.map(row => row[0]);
      const x2Values = this.X_train.map(row => row[1]);
      const weightSizes = this.sampleWeights.map(w => Math.max(4, w * 100 * this.X_train.length));
      
      visualizations.push({
        type: 'scatter2d',
        data: {
          x: x1Values,
          y: x2Values,
          mode: 'markers',
          name: 'Sample Weights',
          marker: { 
            color: '#9333ea',
            size: weightSizes,
            sizemode: 'diameter',
            sizemin: 4,
            opacity: 0.6
          }
        }
      });
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
    
    // Binary confusion matrix
    const confusionMatrix: number[][] = [[0, 0], [0, 0]];
    
    for (let i = 0; i < n; i++) {
      const trueIdx = this.classes.indexOf(this.y_train[i]);
      const predIdx = this.classes.indexOf(predictions[i]);
      if (trueIdx !== -1 && predIdx !== -1) {
        confusionMatrix[trueIdx][predIdx]++;
      }
    }
    
    // Calculate metrics
    const tp = confusionMatrix[1][1];
    const fp = confusionMatrix[0][1];
    const fn = confusionMatrix[1][0];
    const tn = confusionMatrix[0][0];
    
    const accuracy = (tp + tn) / n;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1Score = precision + recall > 0 ? 
      2 * (precision * recall) / (precision + recall) : 0;
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix
    };
  }
  
  /**
   * Reset the model
   */
  override reset(): void {
    super.reset();
    this.stumps = [];
    this.classes = [];
    this.nFeatures = 0;
    this.X_train = [];
    this.y_train = [];
    this.sampleWeights = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      weightedError: [],
      alpha: [],
      stumpErrors: []
    };
  }
  
  /**
   * Get model parameters
   */
  getParameters() {
    return {
      nEstimators: this.nEstimators,
      learningRate: this.learningRate,
      algorithm: this.algorithm,
      classes: [...this.classes],
      nFeatures: this.nFeatures,
      nStumps: this.stumps.length,
      featureImportance: this.trained ? this.getFeatureImportance() : [],
      totalAlpha: this.stumps.reduce((sum, stump) => sum + stump.alpha, 0)
    };
  }
}