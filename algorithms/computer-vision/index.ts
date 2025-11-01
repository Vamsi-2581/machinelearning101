/**
 * Computer Vision Algorithms Index
 * Lazy-loaded exports for code splitting optimization
 */

// Lazy exports for code splitting
export const CNN = () => import('./CNN');
export const ImageClassification = () => import('./ImageClassification');
export const ImageSegmentation = () => import('./ImageSegmentation');
export const ObjectDetection = () => import('./ObjectDetection');
export const TransferLearning = () => import('./TransferLearning');

// Algorithm registry for dynamic loading
export const COMPUTER_VISION_ALGORITHMS = {
  CNN: () => import('./CNN'),
  ImageClassification: () => import('./ImageClassification'),
  ImageSegmentation: () => import('./ImageSegmentation'),
  ObjectDetection: () => import('./ObjectDetection'),
  TransferLearning: () => import('./TransferLearning'),
} as const;

export type ComputerVisionAlgorithmName = keyof typeof COMPUTER_VISION_ALGORITHMS;