/**
 * Common Loss Functions for Gradient Descent Visualization
 * 
 * Provides simple, visualizable loss functions for educational purposes
 */

import type { LossFunction, GradientFunction } from './GradientDescentOptimizer';

/**
 * Loss function with its gradient
 */
export interface LossFunctionWithGradient {
  name: string;
  description: string;
  loss: LossFunction;
  gradient: GradientFunction;
  optimalParams?: number[];
  domain?: { min: number[]; max: number[] };
}

/**
 * Simple quadratic bowl: f(x, y) = x² + y²
 * Gradient: [2x, 2y]
 * Optimal: [0, 0]
 */
export const quadraticBowl: LossFunctionWithGradient = {
  name: 'Quadratic Bowl',
  description: 'Simple convex function: f(x, y) = x² + y²',
  loss: ([x, y]) => x * x + y * y,
  gradient: ([x, y]) => [2 * x, 2 * y],
  optimalParams: [0, 0],
  domain: { min: [-5, -5], max: [5, 5] }
};

/**
 * Elongated valley: f(x, y) = x² + 10y²
 * Gradient: [2x, 20y]
 * Optimal: [0, 0]
 */
export const elongatedValley: LossFunctionWithGradient = {
  name: 'Elongated Valley',
  description: 'Ill-conditioned quadratic: f(x, y) = x² + 10y²',
  loss: ([x, y]) => x * x + 10 * y * y,
  gradient: ([x, y]) => [2 * x, 20 * y],
  optimalParams: [0, 0],
  domain: { min: [-5, -5], max: [5, 5] }
};

/**
 * Rosenbrock function (banana function): f(x, y) = (1-x)² + 100(y-x²)²
 * Gradient: [-2(1-x) - 400x(y-x²), 200(y-x²)]
 * Optimal: [1, 1]
 */
export const rosenbrock: LossFunctionWithGradient = {
  name: 'Rosenbrock Function',
  description: 'Non-convex banana-shaped valley: f(x, y) = (1-x)² + 100(y-x²)²',
  loss: ([x, y]) => {
    const term1 = (1 - x) * (1 - x);
    const term2 = 100 * (y - x * x) * (y - x * x);
    return term1 + term2;
  },
  gradient: ([x, y]) => {
    const dx = -2 * (1 - x) - 400 * x * (y - x * x);
    const dy = 200 * (y - x * x);
    return [dx, dy];
  },
  optimalParams: [1, 1],
  domain: { min: [-2, -1], max: [2, 3] }
};

/**
 * Beale function: f(x, y) = (1.5 - x + xy)² + (2.25 - x + xy²)² + (2.625 - x + xy³)²
 * Optimal: [3, 0.5]
 */
export const beale: LossFunctionWithGradient = {
  name: 'Beale Function',
  description: 'Multi-modal function with narrow valley',
  loss: ([x, y]) => {
    const term1 = Math.pow(1.5 - x + x * y, 2);
    const term2 = Math.pow(2.25 - x + x * y * y, 2);
    const term3 = Math.pow(2.625 - x + x * y * y * y, 2);
    return term1 + term2 + term3;
  },
  gradient: ([x, y]) => {
    const t1 = 1.5 - x + x * y;
    const t2 = 2.25 - x + x * y * y;
    const t3 = 2.625 - x + x * y * y * y;
    
    const dx = 2 * t1 * (y - 1) + 2 * t2 * (y * y - 1) + 2 * t3 * (y * y * y - 1);
    const dy = 2 * t1 * x + 2 * t2 * 2 * x * y + 2 * t3 * 3 * x * y * y;
    
    return [dx, dy];
  },
  optimalParams: [3, 0.5],
  domain: { min: [-4.5, -4.5], max: [4.5, 4.5] }
};

/**
 * Himmelblau function: f(x, y) = (x² + y - 11)² + (x + y² - 7)²
 * Multiple local minima
 */
export const himmelblau: LossFunctionWithGradient = {
  name: 'Himmelblau Function',
  description: 'Multi-modal function with four identical local minima',
  loss: ([x, y]) => {
    const term1 = Math.pow(x * x + y - 11, 2);
    const term2 = Math.pow(x + y * y - 7, 2);
    return term1 + term2;
  },
  gradient: ([x, y]) => {
    const t1 = x * x + y - 11;
    const t2 = x + y * y - 7;
    
    const dx = 4 * x * t1 + 2 * t2;
    const dy = 2 * t1 + 4 * y * t2;
    
    return [dx, dy];
  },
  optimalParams: [3, 2], // One of four minima
  domain: { min: [-5, -5], max: [5, 5] }
};

/**
 * Saddle point: f(x, y) = x² - y²
 * Gradient: [2x, -2y]
 * Saddle point at: [0, 0]
 */
export const saddlePoint: LossFunctionWithGradient = {
  name: 'Saddle Point',
  description: 'Function with saddle point: f(x, y) = x² - y²',
  loss: ([x, y]) => x * x - y * y,
  gradient: ([x, y]) => [2 * x, -2 * y],
  optimalParams: [0, 0],
  domain: { min: [-3, -3], max: [3, 3] }
};

/**
 * Rastrigin function (simplified 2D): f(x, y) = 20 + x² + y² - 10(cos(2πx) + cos(2πy))
 * Highly multi-modal
 */
export const rastrigin: LossFunctionWithGradient = {
  name: 'Rastrigin Function',
  description: 'Highly multi-modal function with many local minima',
  loss: ([x, y]) => {
    const A = 10;
    return 2 * A + (x * x - A * Math.cos(2 * Math.PI * x)) + 
           (y * y - A * Math.cos(2 * Math.PI * y));
  },
  gradient: ([x, y]) => {
    const A = 10;
    const dx = 2 * x + 2 * Math.PI * A * Math.sin(2 * Math.PI * x);
    const dy = 2 * y + 2 * Math.PI * A * Math.sin(2 * Math.PI * y);
    return [dx, dy];
  },
  optimalParams: [0, 0],
  domain: { min: [-5.12, -5.12], max: [5.12, 5.12] }
};

/**
 * All available loss functions
 */
export const lossFunctions: Record<string, LossFunctionWithGradient> = {
  'quadratic-bowl': quadraticBowl,
  'elongated-valley': elongatedValley,
  'rosenbrock': rosenbrock,
  'beale': beale,
  'himmelblau': himmelblau,
  'saddle-point': saddlePoint,
  'rastrigin': rastrigin
};

/**
 * Get loss function by ID
 */
export function getLossFunction(id: string): LossFunctionWithGradient {
  const fn = lossFunctions[id];
  if (!fn) {
    throw new Error(`Unknown loss function: ${id}`);
  }
  return fn;
}

/**
 * Get list of available loss functions
 */
export function getAvailableLossFunctions(): Array<{ id: string; name: string; description: string }> {
  return Object.entries(lossFunctions).map(([id, fn]) => ({
    id,
    name: fn.name,
    description: fn.description
  }));
}
