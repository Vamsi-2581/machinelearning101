/**
 * Composable for lazy loading algorithm implementations
 * 
 * This composable provides dynamic imports for algorithm classes,
 * enabling code splitting by domain and reducing initial bundle size.
 * 
 * Requirements: 14.4, 14.8
 */

import type { Algorithm } from '~/types/algorithm';

type AlgorithmConstructor<T extends Algorithm = Algorithm> = new (...args: any[]) => T;

/**
 * Lazy load an algorithm by domain and name
 */
export function useLazyAlgorithm() {
  /**
   * Load a regression algorithm
   */
  const loadRegressionAlgorithm = async (name: 'LinearRegression'): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'LinearRegression': {
        const module = await import('~/algorithms/regression/LinearRegression');
        return module.LinearRegression;
      }
      default:
        throw new Error(`Unknown regression algorithm: ${name}`);
    }
  };

  /**
   * Load a classification algorithm
   */
  const loadClassificationAlgorithm = async (name: 'LogisticRegression'): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'LogisticRegression': {
        const module = await import('~/algorithms/classification/LogisticRegression');
        return module.LogisticRegression;
      }
      default:
        throw new Error(`Unknown classification algorithm: ${name}`);
    }
  };

  /**
   * Load a clustering algorithm
   */
  const loadClusteringAlgorithm = async (name: 'KMeans'): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'KMeans': {
        const module = await import('~/algorithms/clustering/KMeans');
        return module.KMeans;
      }
      default:
        throw new Error(`Unknown clustering algorithm: ${name}`);
    }
  };

  /**
   * Load a preprocessing algorithm
   */
  const loadPreprocessingAlgorithm = async (
    name: 'FeatureScaling' | 'MissingValueImputation'
  ): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'FeatureScaling': {
        const module = await import('~/algorithms/preprocessing/FeatureScaling');
        return module.FeatureScaling;
      }
      case 'MissingValueImputation': {
        const module = await import('~/algorithms/preprocessing/MissingValueImputation');
        return module.MissingValueImputation;
      }
      default:
        throw new Error(`Unknown preprocessing algorithm: ${name}`);
    }
  };

  /**
   * Load an optimization algorithm
   */
  const loadOptimizationAlgorithm = async (
    name: 'GradientDescentOptimizer' | 'GradientDescentVisualization' | 'LossLandscape'
  ): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'GradientDescentOptimizer': {
        const module = await import('~/algorithms/optimization/GradientDescentOptimizer');
        return module.GradientDescentOptimizer;
      }
      case 'GradientDescentVisualization': {
        const module = await import('~/algorithms/optimization/GradientDescentVisualization');
        return module.GradientDescentVisualization;
      }
      case 'LossLandscape': {
        const module = await import('~/algorithms/optimization/LossLandscape');
        return module.LossLandscape;
      }
      default:
        throw new Error(`Unknown optimization algorithm: ${name}`);
    }
  };

  /**
   * Load an advanced algorithm
   */
  const loadAdvancedAlgorithm = async (
    name: 'PCA' | 'TSNE' | 'NeuralNetwork'
  ): Promise<AlgorithmConstructor> => {
    switch (name) {
      case 'PCA': {
        const module = await import('~/algorithms/advanced/PCA');
        return module.PCA;
      }
      case 'TSNE': {
        const module = await import('~/algorithms/advanced/TSNE');
        return module.TSNE;
      }
      case 'NeuralNetwork': {
        const module = await import('~/algorithms/advanced/NeuralNetwork');
        return module.NeuralNetwork;
      }
      default:
        throw new Error(`Unknown advanced algorithm: ${name}`);
    }
  };

  /**
   * Load any algorithm by domain and name
   */
  const loadAlgorithm = async (
    domain: 'regression' | 'classification' | 'clustering' | 'preprocessing' | 'optimization' | 'advanced',
    name: string
  ): Promise<AlgorithmConstructor> => {
    switch (domain) {
      case 'regression':
        return loadRegressionAlgorithm(name as any);
      case 'classification':
        return loadClassificationAlgorithm(name as any);
      case 'clustering':
        return loadClusteringAlgorithm(name as any);
      case 'preprocessing':
        return loadPreprocessingAlgorithm(name as any);
      case 'optimization':
        return loadOptimizationAlgorithm(name as any);
      case 'advanced':
        return loadAdvancedAlgorithm(name as any);
      default:
        throw new Error(`Unknown domain: ${domain}`);
    }
  };

  return {
    loadAlgorithm,
    loadRegressionAlgorithm,
    loadClassificationAlgorithm,
    loadClusteringAlgorithm,
    loadPreprocessingAlgorithm,
    loadOptimizationAlgorithm,
    loadAdvancedAlgorithm,
  };
}
