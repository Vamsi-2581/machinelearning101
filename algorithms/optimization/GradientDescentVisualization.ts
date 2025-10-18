/**
 * Gradient Descent Visualization
 * 
 * Provides step-by-step gradient descent optimization with path tracking
 * for educational visualization purposes.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import type { Optimizer, OptimizationStep, LossFunction, GradientFunction } from './GradientDescentOptimizer';
import { createOptimizer } from './GradientDescentOptimizer';

/**
 * Optimization state for step-by-step execution
 */
export type OptimizationState = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Configuration for gradient descent visualization
 */
export interface GradientDescentConfig {
  optimizerType: 'sgd' | 'momentum' | 'rmsprop' | 'adam';
  learningRate: number;
  maxIterations: number;
  tolerance?: number;
  momentum?: number;
  beta?: number;
  beta1?: number;
  beta2?: number;
  epsilon?: number;
}

/**
 * Gradient Descent Visualization class
 * 
 * Manages optimization process with step-by-step execution and path tracking
 */
export class GradientDescentVisualization {
  private optimizer: Optimizer | null = null;
  private lossFunction: LossFunction;
  private gradientFunction: GradientFunction;
  private config: GradientDescentConfig;
  
  private currentParams: number[];
  private initialParams: number[];
  private optimizationPath: OptimizationStep[] = [];
  private state: OptimizationState = 'idle';
  private currentIteration: number = 0;
  
  constructor(
    lossFunction: LossFunction,
    gradientFunction: GradientFunction,
    initialParams: number[],
    config: GradientDescentConfig
  ) {
    this.lossFunction = lossFunction;
    this.gradientFunction = gradientFunction;
    this.initialParams = [...initialParams];
    this.currentParams = [...initialParams];
    this.config = config;
    
    this.initializeOptimizer();
  }
  
  /**
   * Initialize the optimizer based on configuration
   */
  private initializeOptimizer(): void {
    this.optimizer = createOptimizer(
      this.config.optimizerType,
      this.initialParams,
      {
        learningRate: this.config.learningRate,
        maxIterations: this.config.maxIterations,
        tolerance: this.config.tolerance,
        trackHistory: true,
        momentum: this.config.momentum,
        beta: this.config.beta,
        beta1: this.config.beta1,
        beta2: this.config.beta2,
        epsilon: this.config.epsilon
      }
    );
  }
  
  /**
   * Perform a single optimization step
   */
  step(): OptimizationStep | null {
    if (!this.optimizer || this.state === 'completed') {
      return null;
    }
    
    // Compute gradient at current parameters
    const gradient = this.gradientFunction(this.currentParams);
    
    // Compute loss at current parameters
    const loss = this.lossFunction(this.currentParams);
    
    // Record current step
    const stepData: OptimizationStep = {
      iteration: this.currentIteration,
      params: [...this.currentParams],
      loss,
      gradient: [...gradient],
      learningRate: this.config.learningRate
    };
    
    this.optimizationPath.push(stepData);
    
    // Update parameters using optimizer
    this.currentParams = this.optimizer.step(gradient);
    this.currentIteration++;
    
    // Check convergence
    const gradientNorm = Math.sqrt(gradient.reduce((sum, g) => sum + g * g, 0));
    const tolerance = this.config.tolerance ?? 1e-6;
    
    if (gradientNorm < tolerance || this.currentIteration >= this.config.maxIterations) {
      this.state = 'completed';
    }
    
    return stepData;
  }
  
  /**
   * Run optimization for multiple steps
   */
  async runSteps(numSteps: number): Promise<OptimizationStep[]> {
    const steps: OptimizationStep[] = [];
    
    for (let i = 0; i < numSteps && this.state !== 'completed'; i++) {
      const step = this.step();
      if (step) {
        steps.push(step);
      }
      
      // Allow UI to update periodically
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return steps;
  }
  
  /**
   * Run optimization to completion
   */
  async runToCompletion(): Promise<OptimizationStep[]> {
    this.state = 'running';
    const steps: OptimizationStep[] = [];
    
    while (this.state === 'running' && this.currentIteration < this.config.maxIterations) {
      const step = this.step();
      if (step) {
        steps.push(step);
      }
      
      // Allow UI to update periodically
      if (this.currentIteration % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return steps;
  }
  
  /**
   * Pause optimization
   */
  pause(): void {
    if (this.state === 'running') {
      this.state = 'paused';
    }
  }
  
  /**
   * Resume optimization
   */
  resume(): void {
    if (this.state === 'paused') {
      this.state = 'running';
    }
  }
  
  /**
   * Reset optimization to initial state
   */
  reset(): void {
    this.currentParams = [...this.initialParams];
    this.optimizationPath = [];
    this.currentIteration = 0;
    this.state = 'idle';
    
    if (this.optimizer) {
      this.optimizer.reset();
    }
    
    this.initializeOptimizer();
  }
  
  /**
   * Update configuration and reset
   */
  updateConfig(config: Partial<GradientDescentConfig>): void {
    this.config = { ...this.config, ...config };
    this.reset();
  }
  
  /**
   * Get current optimization state
   */
  getState(): OptimizationState {
    return this.state;
  }
  
  /**
   * Get current parameters
   */
  getCurrentParams(): number[] {
    return [...this.currentParams];
  }
  
  /**
   * Get optimization path (all steps taken)
   */
  getOptimizationPath(): OptimizationStep[] {
    return this.optimizationPath;
  }
  
  /**
   * Get current iteration number
   */
  getCurrentIteration(): number {
    return this.currentIteration;
  }
  
  /**
   * Get current loss value
   */
  getCurrentLoss(): number {
    return this.lossFunction(this.currentParams);
  }
  
  /**
   * Get current gradient
   */
  getCurrentGradient(): number[] {
    return this.gradientFunction(this.currentParams);
  }
  
  /**
   * Check if optimization is complete
   */
  isComplete(): boolean {
    return this.state === 'completed';
  }
  
  /**
   * Get optimizer name
   */
  getOptimizerName(): string {
    return this.optimizer?.name ?? 'Unknown';
  }
}
