/**
 * Composable for identifying and handling heavy algorithms with Web Workers
 * 
 * This composable determines which algorithms should run in Web Workers
 * based on their computational complexity and execution time.
 * 
 * Requirements: 13.5, 17.5
 */

import { useWorkerManager } from '~/utils/worker-manager';
import type { Algorithm } from '~/types/algorithm';

/**
 * Algorithms that typically take >500ms to execute
 * These should be run in Web Workers to prevent UI blocking
 */
const HEAVY_ALGORITHMS = new Set([
  // Neural Networks and Deep Learning
  'NeuralNetwork',
  'CNN',
  'DQN',
  'ActorCritic',
  'GAN',
  'Autoencoder',
  
  // Complex Optimization
  'HyperparameterTuning',
  'Ensemble',
  'GradientDescentVisualization',
  'LossLandscape',
  
  // Large Dataset Processing
  'TSNE',
  'PCA',
  'SpectralClustering',
  'DBSCAN',
  'GMM',
  
  // Text Processing (large datasets)
  'TextGeneration',
  'WordEmbeddings',
  'NamedEntityRecognition',
  
  // Computer Vision (image processing)
  'ImageSegmentation',
  'ObjectDetection',
  'TransferLearning',
  
  // Reinforcement Learning (simulation intensive)
  'PolicyGradient',
  'MultiArmedBandits',
]);

/**
 * Dataset size thresholds for Web Worker usage
 */
const DATASET_SIZE_THRESHOLDS = {
  small: 100,    // < 100 samples - always run on main thread
  medium: 1000,  // 100-1000 samples - check algorithm complexity
  large: 5000,   // > 1000 samples - prefer Web Workers for complex algorithms
  xlarge: 10000, // > 5000 samples - always use Web Workers
};

/**
 * Composable for heavy algorithm management
 */
export function useHeavyAlgorithms() {
  const workerManager = useWorkerManager();

  /**
   * Check if an algorithm should run in a Web Worker
   */
  const shouldUseWebWorker = (
    algorithmName: string,
    datasetSize: number,
    forceWorker = false
  ): boolean => {
    // Force Web Worker usage if requested
    if (forceWorker) {
      return true;
    }

    // Always use main thread for very small datasets
    if (datasetSize < DATASET_SIZE_THRESHOLDS.small) {
      return false;
    }

    // Always use Web Worker for very large datasets
    if (datasetSize > DATASET_SIZE_THRESHOLDS.xlarge) {
      return true;
    }

    // For medium to large datasets, check if algorithm is computationally heavy
    if (datasetSize > DATASET_SIZE_THRESHOLDS.medium) {
      return HEAVY_ALGORITHMS.has(algorithmName);
    }

    // For small to medium datasets, only use Web Worker for known heavy algorithms
    return HEAVY_ALGORITHMS.has(algorithmName) && datasetSize > DATASET_SIZE_THRESHOLDS.medium;
  };

  /**
   * Estimate execution time based on algorithm and dataset size
   */
  const estimateExecutionTime = (algorithmName: string, datasetSize: number): number => {
    const baseTime = HEAVY_ALGORITHMS.has(algorithmName) ? 1000 : 100; // ms
    const sizeMultiplier = Math.log10(Math.max(datasetSize, 1));
    return baseTime * sizeMultiplier;
  };

  /**
   * Run algorithm with automatic Web Worker decision
   */
  const runAlgorithm = async (
    algorithm: Algorithm,
    operation: 'fit' | 'predict' | 'transform',
    data: { X: number[][]; y?: number[] },
    params?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<any> => {
    const algorithmName = algorithm.constructor.name;
    const datasetSize = data.X.length;
    
    const useWorker = shouldUseWebWorker(algorithmName, datasetSize);
    const estimatedTime = estimateExecutionTime(algorithmName, datasetSize);

    // Log decision for debugging
    console.log(`Algorithm: ${algorithmName}, Dataset size: ${datasetSize}, Use Worker: ${useWorker}, Estimated time: ${estimatedTime}ms`);

    if (useWorker) {
      // Run in Web Worker
      try {
        switch (operation) {
          case 'fit':
            return await workerManager.train(algorithmName, data.X, data.y, params, onProgress);
          case 'predict':
            return await workerManager.predict(algorithmName, data.X, params);
          case 'transform':
            return await workerManager.transform(algorithmName, data.X, params);
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.warn('Web Worker failed, falling back to main thread:', error);
        // Fall back to main thread execution
        return runOnMainThread(algorithm, operation, data, params);
      }
    } else {
      // Run on main thread
      return runOnMainThread(algorithm, operation, data, params);
    }
  };

  /**
   * Run algorithm on main thread
   */
  const runOnMainThread = async (
    algorithm: Algorithm,
    operation: 'fit' | 'predict' | 'transform',
    data: { X: number[][]; y?: number[] },
    params?: Record<string, any>
  ): Promise<any> => {
    // Apply parameters if provided
    if (params) {
      Object.assign(algorithm, params);
    }

    switch (operation) {
      case 'fit':
        return await algorithm.fit(data.X, data.y);
      case 'predict':
        return algorithm.predict(data.X);
      case 'transform':
        // For algorithms that support transform (like PCA, feature scaling)
        if ('transform' in algorithm && typeof algorithm.transform === 'function') {
          return (algorithm as any).transform(data.X);
        }
        throw new Error(`Algorithm ${algorithm.constructor.name} does not support transform operation`);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  };

  /**
   * Check if Web Workers are supported
   */
  const isWebWorkerSupported = (): boolean => {
    return typeof Worker !== 'undefined';
  };

  /**
   * Get performance recommendations for an algorithm
   */
  const getPerformanceRecommendations = (
    algorithmName: string,
    datasetSize: number
  ): {
    useWebWorker: boolean;
    estimatedTime: number;
    recommendation: string;
  } => {
    const useWebWorker = shouldUseWebWorker(algorithmName, datasetSize);
    const estimatedTime = estimateExecutionTime(algorithmName, datasetSize);
    
    let recommendation = '';
    
    if (estimatedTime > 5000) {
      recommendation = 'This algorithm may take several seconds to complete. Consider using a smaller dataset for faster results.';
    } else if (estimatedTime > 2000) {
      recommendation = 'This algorithm may take a moment to complete. The interface will remain responsive.';
    } else if (useWebWorker) {
      recommendation = 'This algorithm will run in the background to keep the interface responsive.';
    } else {
      recommendation = 'This algorithm should complete quickly.';
    }

    return {
      useWebWorker,
      estimatedTime,
      recommendation,
    };
  };

  /**
   * Preload Web Worker for better performance
   */
  const preloadWebWorker = (): void => {
    if (isWebWorkerSupported()) {
      try {
        workerManager.init();
      } catch (error) {
        console.warn('Failed to preload Web Worker:', error);
      }
    }
  };

  return {
    shouldUseWebWorker,
    estimateExecutionTime,
    runAlgorithm,
    runOnMainThread,
    isWebWorkerSupported,
    getPerformanceRecommendations,
    preloadWebWorker,
    HEAVY_ALGORITHMS: Array.from(HEAVY_ALGORITHMS),
    DATASET_SIZE_THRESHOLDS,
  };
}