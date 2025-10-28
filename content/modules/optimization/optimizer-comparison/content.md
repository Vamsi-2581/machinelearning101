# Optimizer Comparison

## Introduction

Optimization algorithms are the engines that power machine learning - they're responsible for finding the best parameters for your models. While basic gradient descent works, modern optimizers use clever techniques to converge faster, handle noisy gradients, and adapt to different problem characteristics.

This module explores the evolution of optimization algorithms, from simple Stochastic Gradient Descent (SGD) to sophisticated adaptive methods like Adam. Understanding these optimizers helps you train models more efficiently and achieve better results.

## What You'll Learn

By the end of this module, you will:

- Understand the limitations of basic SGD
- Learn how momentum accelerates convergence
- Explore adaptive learning rate methods (RMSProp, Adam)
- Compare optimizer performance on different loss landscapes
- Recognize when to use each optimizer

## The Optimization Problem

All optimizers solve the same fundamental problem:

```
minimize: L(θ) = (1/n) Σ loss(f(xᵢ; θ), yᵢ)
```

Where:
- **L(θ)**: Loss function to minimize
- **θ**: Model parameters (weights and biases)
- **f(x; θ)**: Model prediction function
- **loss**: Measures prediction error

The goal is to find θ* that minimizes L(θ).

## Stochastic Gradient Descent (SGD)

![Optimizer Comparison](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stogra.png/500px-Stogra.png)
*Different optimizers navigate the loss landscape in different ways*

### Basic Algorithm

The simplest optimizer updates parameters in the opposite direction of the gradient:

```
θ = θ - α∇L(θ)
```

Where:
- **α**: Learning rate (step size)
- **∇L(θ)**: Gradient of loss with respect to parameters

### Variants

**Batch Gradient Descent:**
- Uses entire dataset for each update
- Accurate but slow for large datasets

**Stochastic Gradient Descent:**
- Uses one random sample for each update
- Fast but noisy updates

**Mini-batch SGD:**
- Uses small batch of samples (e.g., 32, 64, 128)
- Balances speed and stability
- Most common in practice

### Advantages

1. **Simple**: Easy to understand and implement
2. **Memory Efficient**: Only needs current gradient
3. **Works Well**: Effective for many problems
4. **Proven**: Decades of theoretical and practical results

### Limitations

1. **Slow Convergence**: Can take many iterations
2. **Sensitive to Learning Rate**: Hard to tune
3. **Same Rate for All Parameters**: Doesn't adapt
4. **Oscillation**: Can bounce around valleys
5. **Stuck in Saddle Points**: Slow progress in flat regions

## SGD with Momentum

![SGD with Momentum](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stogra.png/500px-Stogra.png)
*Momentum accelerates convergence by accumulating gradients*

### The Problem with Basic SGD

Imagine rolling a ball down a hill:
- **Basic SGD**: Ball moves based only on current slope
- **With Momentum**: Ball accumulates velocity, rolling faster downhill

### Algorithm

Momentum adds a velocity term that accumulates gradients:

```
v = βv - α∇L(θ)
θ = θ + v
```

Where:
- **v**: Velocity (accumulated gradient)
- **β**: Momentum coefficient (typically 0.9)
- **α**: Learning rate

### How It Works

1. **Accumulates Gradients**: Builds up speed in consistent directions
2. **Dampens Oscillations**: Cancels out opposing gradients
3. **Accelerates**: Moves faster in directions of consistent gradient
4. **Overcomes Local Minima**: Can roll through small bumps

### Momentum Coefficient (β)

**Small β (e.g., 0.5):**
- Less momentum
- More responsive to current gradient
- Less smoothing

**Large β (e.g., 0.9-0.99):**
- More momentum
- Smoother trajectory
- Can overshoot

**Typical value:** 0.9

### Advantages Over Basic SGD

1. **Faster Convergence**: Accelerates in consistent directions
2. **Reduced Oscillation**: Smoother path to minimum
3. **Better for Ravines**: Navigates narrow valleys effectively
4. **Escapes Plateaus**: Maintains velocity in flat regions

### Nesterov Momentum

An improved variant that "looks ahead":

```
v = βv - α∇L(θ + βv)
θ = θ + v
```

Computes gradient at the "lookahead" position, providing better updates.

## AdaGrad (Adaptive Gradient)

![Adaptive Learning Rates](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gradient_descent.gif/350px-Gradient_descent.gif)
*Adaptive optimizers adjust learning rates per parameter*

### The Idea

Different parameters may need different learning rates. AdaGrad adapts the learning rate for each parameter based on historical gradients.

### Algorithm

```
g = g + (∇L(θ))²
θ = θ - (α / √(g + ε)) ∇L(θ)
```

Where:
- **g**: Sum of squared gradients (per parameter)
- **ε**: Small constant for numerical stability (e.g., 10⁻⁸)

### How It Works

1. **Accumulates Squared Gradients**: Tracks how much each parameter has changed
2. **Reduces Learning Rate**: Parameters with large gradients get smaller updates
3. **Increases Learning Rate**: Parameters with small gradients get larger updates
4. **Per-Parameter Adaptation**: Each parameter has its own effective learning rate

### Advantages

1. **No Manual Tuning**: Learning rate adapts automatically
2. **Good for Sparse Features**: Rare features get larger updates
3. **Handles Different Scales**: Adapts to parameter magnitudes

### Limitations

1. **Monotonic Decay**: Learning rate only decreases, never increases
2. **Eventually Stops**: Can stop learning too early
3. **Not Ideal for Deep Learning**: Accumulation can be too aggressive

## RMSProp (Root Mean Square Propagation)

### Fixing AdaGrad's Problem

RMSProp addresses AdaGrad's aggressive learning rate decay by using an exponential moving average of squared gradients instead of accumulating all history.

### Algorithm

```
g = βg + (1-β)(∇L(θ))²
θ = θ - (α / √(g + ε)) ∇L(θ)
```

Where:
- **g**: Exponential moving average of squared gradients
- **β**: Decay rate (typically 0.9)

### How It Works

1. **Exponential Moving Average**: Recent gradients matter more
2. **Forgets Old Gradients**: Doesn't accumulate indefinitely
3. **Adapts Learning Rate**: Per-parameter adaptation like AdaGrad
4. **Maintains Learning**: Can increase learning rate if gradients decrease

### Advantages Over AdaGrad

1. **Doesn't Stop Learning**: Learning rate can increase again
2. **Better for Non-Stationary Problems**: Adapts to changing gradients
3. **Works Well in Practice**: Popular for deep learning

### Hyperparameters

- **Learning rate (α)**: Typically 0.001
- **Decay rate (β)**: Typically 0.9

## Adam (Adaptive Moment Estimation)

### The Best of Both Worlds

Adam combines momentum (first moment) with RMSProp (second moment), creating one of the most popular optimizers.

### Algorithm

```
m = β₁m + (1-β₁)∇L(θ)           # First moment (momentum)
v = β₂v + (1-β₂)(∇L(θ))²        # Second moment (RMSProp)

m̂ = m / (1-β₁ᵗ)                 # Bias correction
v̂ = v / (1-β₂ᵗ)                 # Bias correction

θ = θ - α(m̂ / (√v̂ + ε))
```

Where:
- **m**: First moment estimate (mean of gradients)
- **v**: Second moment estimate (variance of gradients)
- **β₁**: Decay rate for first moment (typically 0.9)
- **β₂**: Decay rate for second moment (typically 0.999)
- **t**: Time step

### How It Works

1. **Momentum Component**: Accumulates gradient direction (like momentum)
2. **Adaptive Learning Rate**: Scales by gradient variance (like RMSProp)
3. **Bias Correction**: Corrects initialization bias in early iterations
4. **Per-Parameter Adaptation**: Each parameter gets customized updates

### Why Bias Correction?

In early iterations, m and v are biased toward zero. Bias correction compensates:

```
m̂ = m / (1-β₁ᵗ)
```

As t increases, (1-β₁ᵗ) approaches 1, and correction becomes negligible.

### Advantages

1. **Robust**: Works well across many problems
2. **Fast Convergence**: Combines benefits of momentum and adaptive rates
3. **Little Tuning**: Default hyperparameters work well
4. **Handles Sparse Gradients**: Good for sparse data
5. **Computationally Efficient**: Only slightly more expensive than SGD

### Hyperparameters

**Default values (work well in most cases):**
- **α (learning rate)**: 0.001
- **β₁**: 0.9
- **β₂**: 0.999
- **ε**: 10⁻⁸

### Variants

**AdaMax:**
- Uses infinity norm instead of L2 norm
- More stable for some problems

**Nadam:**
- Combines Adam with Nesterov momentum
- Slightly better convergence

**AMSGrad:**
- Fixes potential convergence issues in Adam
- Uses maximum of past squared gradients

## Optimizer Comparison

### Convergence Speed

**Fastest to Slowest (typically):**
1. Adam / RMSProp
2. SGD with Momentum
3. Basic SGD
4. AdaGrad (can slow down)

### Generalization

**Best to Worst (sometimes):**
1. SGD with Momentum (with proper tuning)
2. Adam
3. RMSProp
4. Basic SGD

**Note:** Adam may converge faster but sometimes generalizes slightly worse than well-tuned SGD with momentum.

### Ease of Use

**Easiest to Hardest:**
1. Adam (good defaults)
2. RMSProp
3. SGD with Momentum
4. Basic SGD (very sensitive to learning rate)

### Memory Requirements

**Lowest to Highest:**
1. SGD: O(p) - only parameters
2. Momentum: O(2p) - parameters + velocity
3. RMSProp: O(2p) - parameters + squared gradients
4. Adam: O(3p) - parameters + first moment + second moment

Where p is the number of parameters.

## When to Use Each Optimizer

### Use SGD with Momentum When:

- You have time to tune hyperparameters carefully
- You want the best possible generalization
- You're training from scratch on large datasets
- You're following a proven recipe (e.g., ResNet training)

**Typical settings:**
- Learning rate: 0.01-0.1 (with decay schedule)
- Momentum: 0.9

### Use Adam When:

- You want fast convergence with minimal tuning
- You're working with sparse data or gradients
- You're doing transfer learning or fine-tuning
- You want a good default optimizer
- You're prototyping and iterating quickly

**Typical settings:**
- Learning rate: 0.001 (or 0.0001 for fine-tuning)
- β₁: 0.9, β₂: 0.999

### Use RMSProp When:

- You're training RNNs or LSTMs
- You want adaptive learning rates without momentum
- Adam is unstable for your problem

**Typical settings:**
- Learning rate: 0.001
- Decay rate: 0.9

### Use AdaGrad When:

- You have very sparse features (e.g., NLP with rare words)
- You're doing online learning
- You don't need long training runs

## Learning Rate Schedules

Even with adaptive optimizers, learning rate schedules can help:

### Step Decay

Reduce learning rate by factor every N epochs:

```
α = α₀ × γ^(epoch / N)
```

**Example:** Reduce by 0.1 every 30 epochs

### Exponential Decay

Smooth exponential reduction:

```
α = α₀ × e^(-kt)
```

### Cosine Annealing

Smooth reduction following cosine curve:

```
α = α_min + (α_max - α_min) × (1 + cos(πt/T)) / 2
```

### Warm Restarts

Periodically reset learning rate to high value:
- Helps escape local minima
- Can improve generalization

### Warmup

Start with small learning rate, gradually increase:
- Stabilizes training in early iterations
- Common in transformer models

## Loss Landscape Characteristics

Different optimizers perform differently on various landscapes:

### Convex (Bowl-shaped)

**Best:** All optimizers work well
**Fastest:** Adam, RMSProp

### Ravines (Narrow valleys)

**Best:** Momentum-based (SGD with momentum, Adam)
**Worst:** Basic SGD (oscillates)

### Plateaus (Flat regions)

**Best:** Momentum-based (maintains velocity)
**Worst:** Basic SGD (slow progress)

### Many Local Minima

**Best:** SGD with momentum (can escape)
**Worst:** Adaptive methods (may get stuck)

### Saddle Points

**Best:** Momentum-based
**Worst:** Basic SGD (very slow)

## Practical Tips

### Starting Point

1. **Default to Adam**: Good starting point for most problems
2. **Use Default Hyperparameters**: α=0.001, β₁=0.9, β₂=0.999
3. **Monitor Training**: Watch loss curves

### If Adam Doesn't Work Well

1. **Try Different Learning Rates**: 0.0001, 0.001, 0.01
2. **Try SGD with Momentum**: May generalize better
3. **Add Learning Rate Schedule**: Decay over time
4. **Check Gradient Norms**: Ensure gradients aren't exploding/vanishing

### Hyperparameter Tuning

**Priority order:**
1. **Learning Rate**: Most important, tune first
2. **Batch Size**: Affects gradient noise
3. **Momentum/Beta Values**: Usually defaults work
4. **Learning Rate Schedule**: Fine-tune after basics work

### Debugging

**Loss not decreasing:**
- Learning rate too high (try 10x smaller)
- Gradient issues (check gradient norms)
- Bug in code

**Loss decreasing slowly:**
- Learning rate too small (try 10x larger)
- Wrong optimizer for problem
- Need learning rate schedule

**Loss oscillating:**
- Learning rate too high
- Batch size too small
- Need momentum

## Advanced Topics

### Gradient Clipping

Prevent exploding gradients:

```
if ||∇L(θ)|| > threshold:
    ∇L(θ) = threshold × ∇L(θ) / ||∇L(θ)||
```

Common in RNNs and transformers.

### Weight Decay

Add L2 regularization to optimizer:

```
θ = θ - α(∇L(θ) + λθ)
```

**Note:** Adam with weight decay (AdamW) is different from Adam with L2 regularization.

### Gradient Accumulation

Simulate larger batch sizes:
- Accumulate gradients over multiple mini-batches
- Update parameters once
- Useful when memory is limited

## Summary

Modern optimizers have evolved to address limitations of basic gradient descent:

- **SGD**: Simple but requires careful tuning
- **Momentum**: Accelerates convergence, reduces oscillation
- **AdaGrad**: Adapts learning rate per parameter, but can stop learning
- **RMSProp**: Fixes AdaGrad's decay problem
- **Adam**: Combines momentum and adaptive rates, most popular

**General recommendation:** Start with Adam (α=0.001), switch to SGD with momentum if you need better generalization and have time to tune.

## Next Steps

After mastering optimizers, explore:

- **Learning Rate Schedules**: Advanced scheduling strategies
- **Second-Order Methods**: Newton's method, L-BFGS
- **Distributed Optimization**: Training on multiple GPUs
- **Hyperparameter Optimization**: Automated tuning
- **Optimization Theory**: Convergence guarantees and analysis
