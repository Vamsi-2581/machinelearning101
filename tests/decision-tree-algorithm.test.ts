/**
 * Decision Tree Algorithm Tests
 * 
 * Tests the DecisionTree classification algorithm implementation
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DecisionTree } from '../algorithms/classification/DecisionTree';

describe('DecisionTree Algorithm', () => {
  let algorithm: DecisionTree;

  beforeEach(() => {
    algorithm = new DecisionTree({
      maxDepth: 5,
      minSamplesSplit: 2,
      criterion: 'gini'
    });
  });

  describe('Basic Functionality', () => {
    it('should train on simple binary classification data', async () => {
      // Simple linearly separable data
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 0, 1, 1];

      await algorithm.fit(X, y);
      
      const predictions = algorithm.predict(X);
      expect(predictions).toHaveLength(4);
      expect(predictions.every(p => p === 0 || p === 1)).toBe(true);
    });

    it('should make predictions after training', async () => {
      const X = [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ];
      const y = [0, 0, 1, 1];

      await algorithm.fit(X, y);
      
      const testX = [[0.5, 0.5], [2.5, 2.5]];
      const predictions = algorithm.predict(testX);
      
      expect(predictions).toHaveLength(2);
      expect(predictions[0]).toBe(0);
      expect(predictions[1]).toBe(1);
    });
  });

  describe('Metrics', () => {
    it('should calculate accuracy metrics', async () => {
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 0, 1, 1];

      await algorithm.fit(X, y);
      
      const metrics = algorithm.getMetrics();
      
      expect(metrics.accuracy).toBeDefined();
      expect(metrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(metrics.accuracy).toBeLessThanOrEqual(1);
    });

    it('should provide confusion matrix for binary classification', async () => {
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 0, 1, 1];

      await algorithm.fit(X, y);
      
      const metrics = algorithm.getMetrics();
      
      expect(metrics.confusionMatrix).toBeDefined();
      expect(metrics.confusionMatrix).toHaveLength(2);
      expect(metrics.confusionMatrix![0]).toHaveLength(2);
    });
  });

  describe('Visualization Data', () => {
    it('should provide visualization data after training', async () => {
      const X = [
        [0, 0],
        [1, 1],
      ];
      const y = [0, 1];

      await algorithm.fit(X, y);
      
      const vizData = algorithm.getVisualizationData();
      
      expect(Array.isArray(vizData)).toBe(true);
      expect(vizData.length).toBeGreaterThan(0);
    });
  });

  describe('Parameter Variations', () => {
    it('should work with entropy criterion', async () => {
      const entropyAlgorithm = new DecisionTree({
        maxDepth: 5,
        minSamplesSplit: 2,
        criterion: 'entropy'
      });

      const X = [
        [0, 0],
        [1, 1],
      ];
      const y = [0, 1];

      await entropyAlgorithm.fit(X, y);
      const predictions = entropyAlgorithm.predict(X);
      
      expect(predictions).toHaveLength(2);
    });

    it('should respect max depth parameter', async () => {
      const shallowTree = new DecisionTree({
        maxDepth: 1,
        minSamplesSplit: 2,
        criterion: 'gini'
      });

      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 0, 1, 1];

      await shallowTree.fit(X, y);
      const predictions = shallowTree.predict(X);
      
      expect(predictions).toHaveLength(4);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset the model state', async () => {
      const X = [[0, 0], [1, 1]];
      const y = [0, 1];

      await algorithm.fit(X, y);
      algorithm.reset();
      
      expect(() => algorithm.predict(X)).toThrow();
    });
  });
});
