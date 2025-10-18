# Optimization Algorithms

This directory contains implementations of gradient descent optimization algorithms and utilities for visualizing their behavior on loss landscapes.

## Contents

### Optimizers (`GradientDescentOptimizer.ts`)

Four gradient descent optimizer implementations:

- **SGD**: Basic stochastic gradient descent
- **SGD with Momentum**: Accelerated convergence with momentum
- **RMSProp**: Adaptive learning rates per parameter
- **Adam**: Combines momentum and adaptive learning rates

All optimizers implement the `Optimizer` interface and support:
- Step-by-step execution
- History tracking
- State reset
- Configurable hyperparameters

### Visualization (`GradientDescentVisualization.ts`)

Main class for managing optimization visualization:
- Step-by-step execution mode
- Play/pause/reset controls
- Optimization path tracking
- State management (idle, running, paused, completed)

### Loss Functions (`LossFunctions.ts`)

Library of educational loss functions with analytical gradients:
- Quadratic Bowl (convex)
- Elongated Valley (ill-conditioned)
- Rosenbrock (non-convex banana function)
- Beale (multi-modal)
- Himmelblau (four local minima)
- Saddle Point
- Rastrigin (highly multi-modal)

### Loss Landscape (`LossLandscape.ts`)

Utilities for generating and visualizing loss landscapes:
- 2D grid generation
- Contour plot data generation
- 3D surface plot data generation
- Optimization path overlay
- Pre-configured Plotly layouts

## Usage Example

```typescript
import {
  GradientDescentVisualization,
  getLossFunction,
  generateLossLandscape,
  generateContourPlotData
} from '~/algorithms/optimization';

// Get a loss function
const lossFunc = getLossFunction('rosenbrock');

// Create visualization
const viz = new GradientDescentVisualization(
  lossFunc.loss,
  lossFunc.gradient,
  [-1.5, 2.0], // initial parameters
  {
    optimizerType: 'adam',
    learningRate: 0.01,
    maxIterations: 1000
  }
);

// Run optimization
await viz.runToCompletion();

// Generate landscape visualization
const landscape = generateLossLandscape(lossFunc.loss, {
  xRange: [-2, 2],
  yRange: [-1, 3],
  resolution: 50
});

// Get plot data with optimization path
const plotData = generateContourPlotData(
  landscape,
  viz.getOptimizationPath()
);
```

## Adding New Optimizers

To add a new optimizer:

1. Extend `BaseOptimizer` class
2. Implement the `step(gradient: number[]): number[]` method
3. Add any optimizer-specific state variables
4. Override `reset()` if needed
5. Add to `createOptimizer()` factory function

Example:

```typescript
export class MyOptimizer extends BaseOptimizer {
  name = 'My Optimizer';
  
  step(gradient: number[]): number[] {
    // Your optimization logic here
    const newParams = this.params.map((param, i) => 
      param - this.config.learningRate * gradient[i]
    );
    
    this.params = newParams;
    this.iteration++;
    
    return [...newParams];
  }
}
```

## Adding New Loss Functions

To add a new loss function:

1. Define the loss function
2. Compute the analytical gradient
3. Specify optimal parameters (if known)
4. Define visualization domain
5. Add to `lossFunctions` object

Example:

```typescript
export const myFunction: LossFunctionWithGradient = {
  name: 'My Function',
  description: 'Description of the function',
  loss: ([x, y]) => x * x + y * y,
  gradient: ([x, y]) => [2 * x, 2 * y],
  optimalParams: [0, 0],
  domain: { min: [-5, -5], max: [5, 5] }
};
```

## Performance Considerations

- Loss landscape generation is O(resolution²)
- Use resolution=50 for interactive use
- Use resolution=100+ for high-quality static images
- Optimization path overlay is O(iterations)
- Consider throttling visualization updates for long optimizations

## References

- [An overview of gradient descent optimization algorithms](https://ruder.io/optimizing-gradient-descent/)
- [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980)
- [RMSProp: Divide the gradient by a running average](http://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf)
