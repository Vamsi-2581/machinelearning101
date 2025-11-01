/**
 * Multi-class Classification Algorithm
 * 
 * Implements multi-class classification using One-vs-Rest (OvR) strategy with
 * logistic regression as the base classifier. This approach trains one binary
 * classifier for each class against all other classes.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { BaseAlgorithm } from '../../types/algorithm';
import type { VisualizationData, Metrics, TrainingHistory } from '../../types/algorithm';
import { mean, sum } from '../../utils/math';

export interface MultiClassParams {
  strategy: 'ovr' | 'ovo';
  maxIterations: number;
  learningRate: number;
  regularization: number;
  tolerance: number;
}

interface BinaryClassifier {
  weights: number[];
  bias: number;
  positiveClass: number;
  negativeClasses: number[];
}

export class MultiClassClassification extends BaseAlgorithm {
  name = 'Multi-class Classification';
  
  // Model parameters
  private classifiers: BinaryClassifier[] = [];
  private classes: number[] = [];
  private nFeatures: number = 0;
  
  // Training data (stored for visualization)
  private X_train: number[][] = [];
  private y_train: number[] = [];
  
  // Hyperparameters
  private strategy: 'ovr' | 'ovo';
  private maxIterations: number;
  private learningRate: number;
  private regularization: number;
  private tolerance: number;
  
  // Training history
  protected override trainingHistory: TrainingHistory & { 
    accuracy: number[];
    classifierLosses: { [key: string]: number[] };
  } = {
    epochs: [],
    loss: [],
    accuracy: [],
    classifierLosses: {}
  };
  
  constructor(params: MultiClassParams = {
    strategy: 'ovr',
    maxIterations: 1000,
    learningRate: 0.01,
    regularization: 0.01,
    tolerance: 1e-6
  }) {
    super();
    this.strategy = params.strategy;
    this.maxIterations = params.maxIterations;
    this.learningRate = params.learningRate;
    this.regularization = params.regularization;
    this.tolerance = params.tolerance;
  }
  
  /**
   * Sigmoid activation function
   */
  private sigmoid(z: number): number {
    // Clip z to prevent overflow
    const clippedZ = Math.max(-500, Math.min(500, z));
    return 1 / (1 + Math.exp(-clippedZ));
  }
  
  /**
   * Compute logistic regression loss with regularization
   */
  private computeLoss(X: number[][], y: number[], weights: number[], bias: number): number {
    let loss = 0;
    const n = X.length;
    
    for (let i = 0; i < n; i++) {
      const z = sum(X[i].map((x, j) => x * weights[j])) + bias;
      const prediction = this.sigmoid(z);
      
      // Cross-entropy loss with numerical stability
      const epsilon = 1e-15;
      const clippedPred = Math.max(epsilon, Math.min(1 - epsilon, prediction));
      
      loss += -(y[i] * Math.log(clippedPred) + (1 - y[i]) * Math.log(1 - clippedPred));
    }
    
    // Add L2 regularization
    const l2Penalty = this.regularization * sum(weights.map(w => w * w));
    
    return (loss / n) + l2Penalty;
  }
  
  /**
   * Train a binary logistic regression classifier
   */
  private trainBinaryClassifier(
    X: number[][], 
    y: number[], 
    positiveClass: number,
    negativeClasses: number[]
  ): BinaryClassifier {
    const n = X.length;
    const nFeatures = X[0].length;
    
    // Create binary labels (1 for positive class, 0 for negative classes)
    const binaryY = y.map(label => label === positiveClass ? 1 : 0);
    
    // Initialize weights and bias
    let weights = new Array(nFeatures).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    let bias = 0;
    
    let prevLoss = Infinity;
    
    for (let epoch = 0; epoch < this.maxIterations; epoch++) {
      // Forward pass
      const predictions: number[] = [];
      for (let i = 0; i < n; i++) {
        const z = sum(X[i].map((x, j) => x * weights[j])) + bias;
        predictions.push(this.sigmoid(z));
      }
      
      // Compute loss
      const currentLoss = this.computeLoss(X, binaryY, weights, bias);
      
      // Check convergence
      if (Math.abs(prevLoss - currentLoss) < this.tolerance) {
        break;
      }
      prevLoss = currentLoss;
      
      // Compute gradients
      const weightGradients = new Array(nFeatures).fill(0);
      let biasGradient = 0;
      
      for (let i = 0; i < n; i++) {
        const error = predictions[i] - binaryY[i];
        
        // Weight gradients
        for (let j = 0; j < nFeatures; j++) {
          weightGradients[j] += error * X[i][j];
        }
        
        // Bias gradient
        biasGradient += error;
      }
      
      // Add regularization to weight gradients
      for (let j = 0; j < nFeatures; j++) {
        weightGradients[j] = (weightGradients[j] / n) + (2 * this.regularization * weights[j]);
      }
      biasGradient /= n;
      
      // Update parameters
      for (let j = 0; j < nFeatures; j++) {
        weights[j] -= this.learningRate * weightGradients[j];
      }
      bias -= this.learningRate * biasGradient;
      
      // Check for numerical issues
      this.checkNumericalStability(weights, `binary classifier weights for class ${positiveClass}`);
      if (!isFinite(bias)) {
        throw new Error(`Bias became non-finite for class ${positiveClass}`);
      }
    }
    
    return {
      weights,
      bias,
      positiveClass,
      negativeClasses
    };
  }
  
  /**
   * Train the multi-class classifier using One-vs-Rest strategy
   */
  async fit(X: number[][], y: number[]): Promise<void> {
    // Validate input
    this.validateInput(X);
    this.validateTarget(X, y);
    
    // Store training data
    this.X_train = X.map(row => [...row]);
    this.y_train = [...y];
    this.nFeatures = X[0].length;
    
    // Get unique classes
    this.classes = [...new Set(y)].sort((a, b) => a - b);
    
    if (this.classes.length < 3) {
      throw new Error('Multi-class classification requires at least 3 classes');
    }
    
    // Reset training history
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      classifierLosses: {}
    };
    
    // Initialize classifier losses tracking
    for (const cls of this.classes) {
      this.trainingHistory.classifierLosses[`Class ${cls}`] = [];
    }
    
    // Train binary classifiers using One-vs-Rest strategy
    this.classifiers = [];
    
    for (const positiveClass of this.classes) {
      const negativeClasses = this.classes.filter(c => c !== positiveClass);
      
      const classifier = this.trainBinaryClassifier(X, y, positiveClass, negativeClasses);
      this.classifiers.push(classifier);
      
      // Calculate loss for this classifier
      const binaryY = y.map(label => label === positiveClass ? 1 : 0);
      const loss = this.computeLoss(X, binaryY, classifier.weights, classifier.bias);
      this.trainingHistory.classifierLosses[`Class ${positiveClass}`].push(loss);
    }
    
    // Calculate overall metrics
    const predictions = this.predictInternal(X);
    const accuracy = this.calculateAccuracy(predictions, y);
    const avgLoss = mean(Object.values(this.trainingHistory.classifierLosses).map(losses => losses[0]));
    
    // Store training metrics
    this.trainingHistory.epochs.push(0);
    this.trainingHistory.loss.push(avgLoss);
    this.trainingHistory.accuracy.push(accuracy);
    
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
   * Predict class probabilities for new data
   */
  predictProba(X: number[][]): number[][] {
    this.ensureTrained();
    this.validateInput(X, this.nFeatures);
    
    const probabilities: number[][] = [];
    
    for (const x of X) {
      const classScores: number[] = [];
      
      // Get scores from each binary classifier
      for (const classifier of this.classifiers) {
        const z = sum(x.map((val, j) => val * classifier.weights[j])) + classifier.bias;
        const score = this.sigmoid(z);
        classScores.push(score);
      }
      
      // Normalize scores to probabilities
      const sumScores = sum(classScores);
      const normalizedProbs = sumScores > 0 ? 
        classScores.map(score => score / sumScores) : 
        classScores.map(() => 1 / this.classes.length);
      
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
      let bestScore = -Infinity;
      
      // Find class with highest score
      for (let i = 0; i < this.classifiers.length; i++) {
        const classifier = this.classifiers[i];
        const z = sum(x.map((val, j) => val * classifier.weights[j])) + classifier.bias;
        const score = this.sigmoid(z);
        
        if (score > bestScore) {
          bestScore = score;
          bestClass = classifier.positiveClass;
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
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
      const symbols = ['circle', 'x', 'triangle-up', 'square', 'diamond', 'star', 'cross'];
      
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
    }
    
    // Classifier performance comparison
    const classifierNames = this.classes.map(cls => `Class ${cls}`);
    const classifierLosses = classifierNames.map(name => 
      this.trainingHistory.classifierLosses[name]?.[0] || 0
    );
    
    visualizations.push({
      type: 'line',
      data: {
        x: classifierNames,
        y: classifierLosses,
        mode: 'markers',
        name: 'Classifier Losses',
        marker: { color: '#ef4444', size: 10 }
      }
    });
    
    // Training accuracy
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
    
    // Overall loss
    visualizations.push({
      type: 'line',
      data: {
        x: this.trainingHistory.epochs,
        y: this.trainingHistory.loss,
        mode: 'markers',
        name: 'Average Loss',
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
    
    // Overall accuracy
    const accuracy = this.calculateAccuracy(predictions, this.y_train);
    
    // Per-class metrics
    const classMetrics: { [key: string]: any } = {};
    
    for (let i = 0; i < this.classes.length; i++) {
      const cls = this.classes[i];
      
      // True positives, false positives, false negatives
      const tp = confusionMatrix[i][i];
      const fp = sum(confusionMatrix.map((row, j) => j !== i ? row[i] : 0));
      const fn = sum(confusionMatrix[i].slice(0, i).concat(confusionMatrix[i].slice(i + 1)));
      
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      const f1Score = precision + recall > 0 ? 
        2 * (precision * recall) / (precision + recall) : 0;
      
      classMetrics[`class_${cls}_precision`] = precision;
      classMetrics[`class_${cls}_recall`] = recall;
      classMetrics[`class_${cls}_f1`] = f1Score;
    }
    
    // Macro-averaged metrics
    const precisions = this.classes.map(cls => classMetrics[`class_${cls}_precision`]);
    const recalls = this.classes.map(cls => classMetrics[`class_${cls}_recall`]);
    const f1Scores = this.classes.map(cls => classMetrics[`class_${cls}_f1`]);
    
    const macroPrecision = mean(precisions);
    const macroRecall = mean(recalls);
    const macroF1 = mean(f1Scores);
    
    return {
      accuracy,
      confusionMatrix,
      precision: macroPrecision,
      recall: macroRecall,
      f1Score: macroF1,
      ...classMetrics
    };
  }
  
  /**
   * Reset the model
   */
  override reset(): void {
    super.reset();
    this.classifiers = [];
    this.classes = [];
    this.nFeatures = 0;
    this.X_train = [];
    this.y_train = [];
    this.trainingHistory = {
      epochs: [],
      loss: [],
      accuracy: [],
      classifierLosses: {}
    };
  }
  
  /**
   * Get model parameters
   */
  getParameters() {
    return {
      strategy: this.strategy,
      classes: [...this.classes],
      nFeatures: this.nFeatures,
      classifiers: this.classifiers.map(clf => ({
        weights: [...clf.weights],
        bias: clf.bias,
        positiveClass: clf.positiveClass,
        negativeClasses: [...clf.negativeClasses]
      })),
      hyperparameters: {
        maxIterations: this.maxIterations,
        learningRate: this.learningRate,
        regularization: this.regularization,
        tolerance: this.tolerance
      }
    };
  }
}