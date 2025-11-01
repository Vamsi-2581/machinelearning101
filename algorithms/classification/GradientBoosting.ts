/**
 * Gradient Boosting Classification Algorithm
 * 
 * Implements Gradient Boosting for classification by sequentially training
 * weak learners (decision stumps) to correct the errors of previous models.
 * Each new model is trained on the residuals of the ensemble.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { BaseAlgorithm } from '../../types/algorithm';
import type { VisualizationData, Metrics, TrainingHistory } from '../../types/algorithm';
import { mean, sum } from '../../utils/math';

export interface GradientBoostingParams {
  nEstimators: number;
  learningRate: number;
  maxDepth: number;
  minSamplesSplit: number;
  subsample: number;
}

interface DecisionStump {
  featureIndex: number;
  threshold: number;
  leftValue: number;
  rightValue: number;
  weight: number;
}

export class GradientBoosting extends BaseAlgorithm {
  name = 'Gradient Boosting';
  
  // Model parameters
  private stumps: DecisionStump[] = [];
  private classes: number[] = [];
  private nFeatures: number = 0;
  private initialPrediction: number = 0;
  
  // Training data (stored for visualization)
  private X_train: number[][] = [];
  private y_train: number[] = [];
  
  // Hyperparameters
  private nEstimators: number;
  private learningRate: number;
  private maxDepth: number;
  private minSamplesSplit: number;
  private subsample: number;
  
  // Training history
  protected override trainingHistory: TrainingHistory & { 
    accuracy: number[];
    loss: number[];
    oobError: number[];
  } = {
    epochs: [],
    loss: [],
    accuracy: [],
    oobError: []
  };
  
  constructor(params: GradientBoostingParams = {
    nEstimators: 100,
    learningRate: 0.1,
    maxDepth: 3,
    minSamplesSplit: 2,
    subsample: 1.0
  }) {
    super();
    this.nEstimators = params.nEstimators;
    this.learningRate = params.learningRate;
    this.maxDepth = params.maxDepth;
    this.minSamplesSplit = params.minSamplesSplit;
    this.subsample = params.subsample;
  }
  
  /**
   * Sigmoid function for binary classification
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, x))));
  }
  
  /**
   * Calculate log-odds for binary classification
   */
  private calculateLogOdds(y: number[]): number {
    const positives = y.filter(label => label === 1).length;
    const negatives = y.length - positives;
    
    if (positives === 0) return -10;
    if (negatives === 0) return 10;
    
    return Math.log(positives / negatives);
  }
  
  /**
   * Calculate residuals for gradient boosting
   */
  private calculateResiduals(predictions: number[], y: number[]): number[] {
    const residuals: number[] = [];
    
    for (let i = 0; i < y.length; i++) {
      // For binary classification, residual is y - p where p is probability
      const probability = this.sigmoid(predictions[i]);
      residuals.push(y[i] - probability);
    }
    
    return residuals;
  }
  
  /**
   * Find best split for a decision stump
   */
  private findBestSplit(X: number[][], residuals: number[], sampleIndices: number[]): DecisionStump | null {
    let bestStump: DecisionStump | null = null;
    let bestMse = Infinity;
    
    // Try each feature
    for (let featureIdx = 0; featureIdx < this.nFeatures; featureIdx++) {
      // Get unique values for this feature
      const featureValues = sampleIndices.map(i => X[i][featureIdx]);
      const uniqueValues = [...new Set(featureValues)].sort((a, b) => a - b);
      
      // Try each threshold
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        // Split samples
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];
        
        for (const idx of sampleIndices) {
          if (X[idx][featureIdx] <= threshold) {
            leftIndices.push(idx);
          } else {
            rightIndices.push(idx);
          }
        }
        
        // Check minimum samples constraint
        if (leftIndices.length < this.minSamplesSplit || rightIndices.length < this.minSamplesSplit) {
          continue;
        }
        
        // Calculate mean residuals for each side
        const leftResiduals = leftIndices.map(i => residuals[i]);
        const rightResiduals = rightIndices.map(i => residuals[i]);
        
        const leftValue = leftResiduals.length > 0 ? mean(leftResiduals) : 0;
        const rightValue = rightResiduals.length > 0 ? mean(rightResiduals) : 0;
        
        // Calculate MSE
        let mse = 0;
        for (const residual of leftResiduals) {
          mse += Math.pow(residual - leftValue, 2);
        }
        for (const residual of rightResiduals) {
          mse += Math.pow(residual - rightValue, 2);
        }
        mse /= sampleIndices.length;
        
        if (mse < bestMse) {
          bestMse = mse;
          bestStump = {
            featureIndex: featureIdx,
            threshold: threshold,
            leftValue: leftValue,
            rightValue: rightValue,
            weight: this.learningRate
          };
        }
      }
    }
    
    return bestStump;
  }
  
  /**
   * Predict with a single decision stump
   */
  private predictStump(stump: DecisionStump, X: number[][]): number[] {
    const predictions: number[] = [];
    
    for (const x of X) {
      if (x[stump.featureIndex] <= stump.threshold) {
        predictions.push(stump.leftValue * stump.weight);
      } else {
        predictions.push(stump.rightValue * stump.weight);
      }
    }
    
    return predictions;
  }
  
  /**
   * Get ensemble predictions (raw scores)
   */
  private getEnsemblePredictions(X: number[][]): number[] {
    const predictions = new Array(X.length).fill(this.initialPrediction);
    
    for (const stump of this.stumps) {
      const stumpPreds = this.predictStump(stump, X);
      for (let i = 0; i < predictions.length; i++) {
        predictions[i] += stumpPreds[i];
      }
    }
    
    return predictions;
  }
  
  /**
   * Subsample data for stochastic gradient boosting
   */
  private subsampleData(n: number): number[] {
    const sampleSize = Math.floor(n * this.subsample);
    const indices: number[] = [];
    
    if (this.subsample >= 1.0) {
      // Use all data
      for (let i = 0; i < n; i++) {
        indices.push(i);
      }
    } else {
      // Random sampling without replacement
      const allIndices = Array.from({ length: n }, (_, i) => i);
      for (let i = 0; i < sampleSize; i++) {
        const randomIdx = Math.floor(Math.random() * allIndices.length);
        indices.push(allIndices.splice(randomIdx, 1)[0]);
      }
    }
    
    return indices;
  }
  
  /**
   * Calculate binary cross-entropy loss
   */
  private calculateLoss(predictions: number[], y: number[]): number {
    let loss = 0;
    
    for (let i = 0; i < y.length; i++) {
      const prob = this.sigmoid(predictions[i]);
      const clampedProb = Math.max(1e-15, Math.min(1 - 1e-15, prob));
      loss += -(y[i] * Math.log(clampedProb) + (1 - y[i]) * Math.log(1 - clampedProb));
    }
    
    return loss / y.length;
  }
  
  /**
   * Train the Gradient Boosting classifier
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
      throw new Error('Gradient Boosting currently supports only binary classification');
    }
    
    // Convert labels to 0/1 if needed
    const binaryY = y.map(label => this.classes.indexOf(label));
    
    // Initialize with log-odds
    this.initialPrediction = this.calculateLogOdds(binaryY);
    
    // Reset model and history
    this.stumps = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      oobError: []
    };
    
    // Current predictions (log-odds)
    let currentPredictions = new Array(X.length).fill(this.initialPrediction);
    
    // Train weak learners sequentially
    for (let iteration = 0; iteration < this.nEstimators; iteration++) {
      // Calculate residuals
      const residuals = this.calculateResiduals(currentPredictions, binaryY);
      
      // Subsample data
      const sampleIndices = this.subsampleData(X.length);
      
      // Find best decision stump
      const stump = this.findBestSplit(X, residuals, sampleIndices);
      
      if (!stump) {
        console.warn(`No valid split found at iteration ${iteration}`);
        break;
      }
      
      // Add stump to ensemble
      this.stumps.push(stump);
      
      // Update predictions
      const stumpPreds = this.predictStump(stump, X);
      for (let i = 0; i < currentPredictions.length; i++) {
        currentPredictions[i] += stumpPreds[i];
      }
      
      // Calculate metrics
      const loss = this.calculateLoss(currentPredictions, binaryY);
      const probabilities = currentPredictions.map(pred => this.sigmoid(pred));
      const predictions = probabilities.map(prob => prob >= 0.5 ? 1 : 0);
      const accuracy = predictions.reduce((acc, pred, i) => acc + (pred === binaryY[i] ? 1 : 0), 0) / binaryY.length;
      
      // Store training history
      this.trainingHistory.epochs.push(iteration);
      this.trainingHistory.loss.push(loss);
      this.trainingHistory.accuracy.push(accuracy);
      this.trainingHistory.oobError.push(1 - accuracy); // Simple approximation
      
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
      const prob1 = this.sigmoid(rawPred);
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
    
    const probabilities = this.predictProba(X);
    return probabilities.map(probs => this.classes[probs[1] >= 0.5 ? 1 : 0]);
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
      importance[stump.featureIndex] += Math.abs(stump.weight);
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
      
      // Create scatter plot for each class
      const colors = ['#3b82f6', '#ef4444'];
      const symbols = ['circle', 'x'];
      
      for (let i = 0; i < this.classes.length; i++) {
        const cls = this.classes[i];
        const classIndices = this.y_train.map((y, idx) => y === cls ? idx : -1).filter(idx => idx !== -1);
        const classX1 = classIndices.map(idx => x1Values[idx]);
        const classX2 = classIndices.map(idx => x2Values[idx]);
        
        visualizations.push({
          type: 'scatter2d',
          data: {
            x: classX1,
            y: classX2,
            mode: 'markers',
            name: `Class ${cls}`,
            marker: { 
              color: colors[i], 
              size: 8, 
              symbol: symbols[i] 
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
        name: 'Training Loss',
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
          marker: { color: '#8b5cf6' }
        }
      });
    }
    
    // Ensemble size vs performance
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs.map(e => e + 1),
        y: this.trainingHistory.accuracy,
        mode: 'lines+markers',
        name: 'Accuracy vs Ensemble Size',
        line: { color: '#f59e0b', width: 2 },
        marker: { size: 4 }
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
    this.initialPrediction = 0;
    this.X_train = [];
    this.y_train = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      oobError: []
    };
  }
  
  /**
   * Get model parameters
   */
  getParameters() {
    return {
      nEstimators: this.nEstimators,
      learningRate: this.learningRate,
      maxDepth: this.maxDepth,
      minSamplesSplit: this.minSamplesSplit,
      subsample: this.subsample,
      classes: [...this.classes],
      nFeatures: this.nFeatures,
      initialPrediction: this.initialPrediction,
      nStumps: this.stumps.length,
      featureImportance: this.trained ? this.getFeatureImportance() : []
    };
  }
}