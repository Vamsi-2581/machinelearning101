# Learning Rate Scheduling

## Introduction

Learning rate scheduling is one of the most important techniques for improving optimization in machine learning. While finding the right initial learning rate is crucial, dynamically adjusting it during training can dramatically improve convergence speed, stability, and final performance. Think of it as shifting gears in a car - you start fast to cover distance quickly, then slow down for precision as you approach your destination.

## Why Schedule Learning Rates?

### The Learning Rate Dilemma

With a fixed learning rate, you face a fundamental trade-off:
- **High learning rate**: Fast initial progress but poor final convergence (overshooting)
- **Low learning rate**: Stable convergence but painfully slow progress

### The Solution: Adaptive Scheduling

Learning rate scheduling resolves this by:
1. **Starting high** for rapid initial progress
2. **Reducing gradually** for stable final convergence
3. **Adapting to training dynamics** based on various criteria

## Common Scheduling Strategies

### 1. Constant Schedule
```
lr(t) = lr₀
```
**When to use**: Baseline comparison, very simple problems
**Pros**: Simple, no hyperparameters
**Cons**: Suboptimal for most real problems

### 2. Step Schedule
```
lr(t) = lr₀ × γ^⌊t/step_size⌋
```
**When to use**: When you know roughly when to reduce learning rate
**Pros**: Simple, interpretable, works well in practice
**Cons**: Requires tuning step_size and γ

### 3. Exponential Decay
```
lr(t) = lr₀ × decay_rate^t
```
**When to use**: Smooth, gradual reduction needed
**Pros**: Smooth decay, single hyperparameter
**Cons**: Can become too small too quickly

### 4. Cosine Annealing
```
lr(t) = lr_min + (lr₀ - lr_min) × (1 + cos(πt/T)) / 2
```
**When to use**: Fixed training budget, want smooth decay
**Pros**: Smooth, reaches minimum exactly at end
**Cons**: Requires knowing total iterations

### 5. Polynomial Decay
```
lr(t) = lr₀ × (1 - t/T)^power
```
**When to use**: Want control over decay shape
**Pros**: Flexible decay curve
**Cons**: Requires tuning power parameter

### 6. Reduce on Plateau
```
lr(t+1) = lr(t) × factor  (if no improvement for 'patience' steps)
```
**When to use**: Don't know when loss will plateau
**Pros**: Adaptive to actual training dynamics
**Cons**: Can be slow to react

## Interactive Demo

Experiment with different scheduling strategies:

1. **Compare Schedules**:
   - Start with **Constant** to see baseline behavior
   - Try **Step** with different step sizes and gamma values
   - Experiment with **Exponential** decay rates
   - Test **Cosine** annealing for smooth decay

2. **Observe the Effects**:
   - **Loss curves**: How does scheduling affect convergence speed?
   - **Learning rate plots**: See how each schedule evolves
   - **Optimization paths**: Notice how step sizes change over time

3. **Test Different Problems**:
   - **Quadratic Bowl**: Simple convex function
   - **Elongated Valley**: Different parameter scales
   - **Rosenbrock**: Challenging non-convex landscape
   - **Noisy Quadratic**: See how scheduling handles noise

## Understanding the Visualizations

### Learning Rate Schedule Plot
- **Constant**: Flat line - no adaptation
- **Step**: Staircase pattern - discrete reductions
- **Exponential**: Smooth exponential curve
- **Cosine**: Smooth cosine curve reaching minimum
- **Polynomial**: Curved decay based on power parameter
- **Plateau**: Irregular reductions based on loss progress

### Loss Over Iterations
- **Early Phase**: Higher learning rates show faster initial progress
- **Later Phase**: Lower learning rates show more stable convergence
- **Oscillations**: Large learning rates may cause oscillations

### Optimization Path
- **Variable Step Sizes**: Path shows how step sizes change over time
- **Direction Changes**: Learning rate affects how aggressively the optimizer moves

## Best Practices

### 1. Start with Step Schedule
- Simple and effective for most problems
- Reduce by factor of 2-10 every 30-100 epochs
- Easy to understand and debug

### 2. Use Cosine for Fixed Budgets
- When you know exactly how many iterations you'll train
- Provides smooth decay to minimum learning rate
- Popular in modern deep learning

### 3. Plateau Detection for Unknown Dynamics
- When you don't know when loss will plateau
- Set patience based on problem complexity
- Monitor validation loss, not training loss

### 4. Combine with Other Techniques
- **Warmup**: Start with very low learning rate, increase to target
- **Restarts**: Periodically reset to higher learning rate
- **Cyclical**: Cycle between high and low learning rates

## Common Pitfalls

### 1. Reducing Too Aggressively
- **Problem**: Learning rate becomes too small too quickly
- **Solution**: Use smaller reduction factors or longer step sizes

### 2. Not Reducing Enough
- **Problem**: Learning rate stays too high, causing instability
- **Solution**: More aggressive scheduling or lower final learning rates

### 3. Wrong Timing
- **Problem**: Reducing learning rate too early or too late
- **Solution**: Monitor loss curves and adjust timing

### 4. Ignoring Problem Characteristics
- **Problem**: Using same schedule for all problems
- **Solution**: Adapt schedule to problem complexity and data size

## Advanced Scheduling Techniques

### Warmup
Start with very low learning rate and gradually increase:
```
lr(t) = lr₀ × min(1, t/warmup_steps)
```

### Cyclical Learning Rates
Cycle between minimum and maximum learning rates:
```
lr(t) = lr_min + (lr_max - lr_min) × (1 + cos(π × cycle_progress)) / 2
```

### One Cycle Policy
Single cycle from low → high → very low learning rate

## Theoretical Insights

### Convergence Theory
- **Large learning rates**: Fast progress but poor final accuracy
- **Small learning rates**: Slow but stable convergence
- **Scheduling**: Gets benefits of both phases

### Generalization
- **High learning rates**: Help escape sharp minima (poor generalization)
- **Low learning rates**: Find flat minima (better generalization)
- **Scheduling**: Naturally transitions from exploration to exploitation

## Implementation Tips

### 1. Monitor Multiple Metrics
- Training loss
- Validation loss (if available)
- Gradient norms
- Parameter changes

### 2. Save Checkpoints
- Before each learning rate reduction
- Allows rollback if reduction was premature

### 3. Visualize Progress
- Plot learning rate schedule
- Overlay with loss curves
- Look for correlation between reductions and improvements

## When Each Schedule Works Best

| Schedule | Best For | Pros | Cons |
|----------|----------|------|------|
| **Step** | Most problems | Simple, effective | Requires tuning |
| **Exponential** | Smooth decay needed | One parameter | Can decay too fast |
| **Cosine** | Fixed training budget | Smooth, reaches min | Need total iterations |
| **Polynomial** | Custom decay shape | Flexible | Complex tuning |
| **Plateau** | Unknown dynamics | Adaptive | Can be slow |

## Further Reading

- [Cyclical Learning Rates for Training Neural Networks](https://arxiv.org/abs/1506.01186)
- [Super-Convergence: Very Fast Training of Neural Networks](https://arxiv.org/abs/1708.07120)
- [Bag of Tricks for Image Classification](https://arxiv.org/abs/1812.01187)
- [Learning Rate Scheduling in Deep Learning](https://towardsdatascience.com/learning-rate-schedules-and-adaptive-learning-rate-methods-for-deep-learning-2c8f433990d1)

## Key Takeaways

- Learning rate scheduling is essential for optimal convergence
- Different schedules work better for different problems
- Step scheduling is a good starting point for most applications
- Cosine annealing works well when you know the training budget
- Plateau detection adapts to actual training dynamics
- Visualization helps understand the impact of different schedules
- Combine scheduling with other optimization techniques for best results
- The right schedule can dramatically improve both convergence speed and final performance