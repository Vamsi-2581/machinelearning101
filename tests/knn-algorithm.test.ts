/**
 * KNN Algorithm Tests
 * 
 * Tests for K-Nearest Neighbors classification algorithm
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { KNN } from '../algorithms/classification/KNN';

describe('KNN Algorithm', () => {
  let knn: KNN;

  beforeEach(() => {
    knn = new KNN({ k: 3, distanceMetric: 'euclidean' });
  });

  describe('Basic Functionality', () => {
    it('should train and predict on simple binary classification', async () => {
      // Simple linearly separable data
      const X = [
        [1, 1],
        [2, 2],
        [3, 3],
        [6, 6],
        [7, 7],
        [8, 8]
      ];
      const y = [0, 0, 0, 1, 1, 1];

      await knn.fit(X, y);
      const predictions = knn.predict(X);

      expect(predictions).toHaveLength(6);
      expect(predictions).toEqual(y);
    });

    it('should make correct predictions on new data', async () => {
      const X_train = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y_train = [0, 0, 1, 1];

      await knn.fit(X_train, y_train);

      const X_test = [
        [1.5, 1.5],  // Should be class 0
        [8.5, 8.5]   // Should be class 1
      ];
      const predictions = knn.predict(X_test);

      expect(predictions[0]).toBe(0);
      expect(predictions[1]).toBe(1);
    });

    it('should handle multi-class classification', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [5, 5],
        [6, 6],
        [9, 9],
        [10, 10]
      ];
      const y = [0, 0, 1, 1, 2, 2];

      await knn.fit(X, y);
      const predictions = knn.predict(X);

      expect(predictions).toEqual(y);
    });
  });

  describe('Distance Metrics', () => {
    it('should use Euclidean distance correctly', async () => {
      const knnEuclidean = new KNN({ k: 1, distanceMetric: 'euclidean' });
      
      const X = [[0, 0], [1, 1], [5, 5]];
      const y = [0, 0, 1];

      await knnEuclidean.fit(X, y);
      
      // Point (1.5, 1.5) is closer to (1, 1) than (5, 5) using Euclidean distance
      const prediction = knnEuclidean.predict([[1.5, 1.5]]);
      expect(prediction[0]).toBe(0);
    });

    it('should use Manhattan distance correctly', async () => {
      const knnManhattan = new KNN({ k: 1, distanceMetric: 'manhattan' });
      
      const X = [[0, 0], [1, 1], [5, 5]];
      const y = [0, 0, 1];

      await knnManhattan.fit(X, y);
      
      // Point (1.5, 1.5) is closer to (1, 1) than (5, 5) using Manhattan distance
      const prediction = knnManhattan.predict([[1.5, 1.5]]);
      expect(prediction[0]).toBe(0);
    });
  });

  describe('K Parameter', () => {
    it('should respect K=1 (nearest neighbor)', async () => {
      const knn1 = new KNN({ k: 1, distanceMetric: 'euclidean' });
      
      const X = [[0, 0], [10, 10]];
      const y = [0, 1];

      await knn1.fit(X, y);
      
      // Point closer to (0, 0)
      expect(knn1.predict([[1, 1]])[0]).toBe(0);
      
      // Point closer to (10, 10)
      expect(knn1.predict([[9, 9]])[0]).toBe(1);
    });

    it('should use majority voting with K=3', async () => {
      const knn3 = new KNN({ k: 3, distanceMetric: 'euclidean' });
      
      const X = [
        [1, 1],
        [2, 2],
        [3, 3],
        [10, 10]
      ];
      const y = [0, 0, 0, 1];

      await knn3.fit(X, y);
      
      // Point (2.5, 2.5) has 3 nearest neighbors all class 0
      expect(knn3.predict([[2.5, 2.5]])[0]).toBe(0);
    });
  });

  describe('Metrics', () => {
    it('should calculate accuracy for binary classification', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const metrics = knn.getMetrics();

      expect(metrics.accuracy).toBeDefined();
      expect(metrics.accuracy).toBeGreaterThan(0);
      expect(metrics.accuracy).toBeLessThanOrEqual(1);
    });

    it('should calculate confusion matrix for binary classification', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const metrics = knn.getMetrics();

      expect(metrics.confusionMatrix).toBeDefined();
      expect(metrics.confusionMatrix).toHaveLength(2);
      expect(metrics.confusionMatrix![0]).toHaveLength(2);
    });

    it('should calculate precision, recall, and F1 score', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const metrics = knn.getMetrics();

      expect(metrics.precision).toBeDefined();
      expect(metrics.recall).toBeDefined();
      expect(metrics.f1Score).toBeDefined();
    });
  });

  describe('Visualization Data', () => {
    it('should generate visualization data for 2D classification', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const vizData = knn.getVisualizationData();

      expect(vizData).toBeDefined();
      expect(Array.isArray(vizData)).toBe(true);
      expect(vizData.length).toBeGreaterThan(0);
    });

    it('should include scatter plot data', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const vizData = knn.getVisualizationData();

      const scatterViz = vizData.find(v => v.type === 'scatter2d');
      expect(scatterViz).toBeDefined();
      expect(scatterViz!.data).toBeDefined();
    });

    it('should include decision boundary heatmap', async () => {
      const X = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ];
      const y = [0, 0, 1, 1];

      await knn.fit(X, y);
      const vizData = knn.getVisualizationData();

      const heatmapViz = vizData.find(v => v.type === 'heatmap');
      expect(heatmapViz).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when predicting before training', () => {
      expect(() => knn.predict([[1, 1]])).toThrow();
    });

    it('should validate input dimensions', async () => {
      const X = [[1, 1], [2, 2]];
      const y = [0, 1];

      await knn.fit(X, y);

      // Try to predict with wrong number of features
      expect(() => knn.predict([[1, 1, 1]])).toThrow();
    });

    it('should validate target size matches input size', async () => {
      const X = [[1, 1], [2, 2]];
      const y = [0]; // Wrong size

      await expect(knn.fit(X, y)).rejects.toThrow();
    });
  });

  describe('Reset', () => {
    it('should reset the model state', async () => {
      const X = [[1, 1], [2, 2]];
      const y = [0, 1];

      await knn.fit(X, y);
      expect(() => knn.predict([[1, 1]])).not.toThrow();

      knn.reset();
      expect(() => knn.predict([[1, 1]])).toThrow();
    });
  });
});
