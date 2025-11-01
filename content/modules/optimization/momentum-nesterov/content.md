# Momentum & Nesterov Acceleration

## Introduction

Momentum is one of the most important innovations in optimization, transforming slow, oscillating SGD into a fast, smooth optimizer. Think of it like a ball rolling down a hill - it builds up speed in consistent directions and dampens oscillations. Nesterov momentum takes this further by "looking ahead" before making updates, providing even better convergence properties.

## The Problem with Vanilla SGD

Standard SGD suffers from several issues:

1. **Slow convergence** in directions with small but consistent gradients
2. **Oscillations** in directions with large gradients
3. **Poor conditioning** when different parameters have different scales
4. **Zigzagging** behavior instead of taking direct paths to the minimum

Momentum addresses all of these problems elegantly.

## How Momentum Works

### The Physical Analogy

Imagine a ball rolling down a hill:
- **Gravity** (gradient) pulls it toward the bottom
- **Momentum** keeps it moving in the same direction
- **Friction** (learning rate) controls how much the gradient affects motion

### Mathematical Formulation

**Standard SGD:**
```
θ = θ - α∇L(θ)
```

**SGD with Momentum:**
```
v = βv + ∇L(θ)
θ = θ - αv
```

Where:
- **v** is the velocity (accumulated gradients)
- **β** is the momentum coefficient (typically 0.9)
- **α** is the learning rate

### Key Insights

1. **Acceleration**: Consistent gradient directions build up velocity
2. **Damping**: Oscillating gradients cancel out in the velocity
3. **Memory**: Past gradients influence current updates
4. **Smoothing**: Velocity provides a smoothed version of recent gradients

## Nesterov Accelerated Gradient (NAG)

Nesterov momentum improves on standard momentum by "looking ahead":

**Standard Momentum:**
1. Compute gradient at current position
2. Update velocity with this gradient
3. Move using the velocity

**Nesterov Momentum:**
1. Look ahead to where momentum would take us
2. Compute gradient at that lookahead position
3. Update velocity with the lookahead gradient
4. Move using the velocity

### Mathematical Formulation

```
v = βv + ∇L(θ - αβv)
θ = θ - αv
```

The key difference: gradient is computed at `θ - αβv` (lookahead position) instead of `θ`.

### Why Nesterov Works Better

- **Anticipation**: Sees where momentum is taking us before committing
- **Correction**: Can slow down before overshooting
- **Stability**: More stable near the minimum
- **Theory**: Better convergence guarantees

## Interactive Demo

Experiment with different momentum settings:

1. **Compare Methods**:
   - **None**: See vanilla SGD behavior
   - **Standard**: Watch momentum smooth the path
   - **Nesterov**: Observe the lookahead advantage

2. **Adjust Momentum Coefficient**:
   - **β = 0.0**: No momentum (equivalent to SGD)
   - **β = 0.5**: Light momentum
   - **β = 0.9**: Strong momentum (typical default)
   - **β = 0.99**: Very strong momentum

3. **Test Different Landscapes**:
   - **Quadratic Bowl**: See basic acceleration
   - **Elongated Valley**: Watch momentum handle ill-conditioning
   - **Rosenbrock**: Observe navigation of complex landscapes
   - **Saddle Point**: See how momentum escapes saddle points
   - **Zigzag**: Watch momentum smooth oscillatory behavior

## Understanding the Visualizations

### Optimization Path
- **No Momentum**: Zigzag pattern following gradients directly
- **With Momentum**: Smoother, more direct path to minimum
- **Nesterov**: Often takes slightly different, more efficient path

### Velocity Evolution
- **Buildup**: Velocity grows in consistent gradient directions
- **Oscillation**: Velocity oscillates less than raw gradients
- **Decay**: Velocity decreases as gradients get smaller near minimum

### Gradient vs Velocity Magnitude
- **Early Training**: Velocity magnitude grows as momentum builds
- **Later Training**: Velocity becomes smoother than raw gradients
- **Convergence**: Both decrease as minimum is approached

## When Momentum Helps

### Excellent for:
1. **Ill-conditioned problems** (elongated valleys)
2. **Noisy gradients** (stochastic settings)
3. **Saddle points** (momentum helps escape)
4. **Long, consistent gradient directions**

### Less helpful for:
1. **Very noisy objectives** (momentum can accumulate noise)
2. **Frequently changing optimal directions**
3. **Very well-conditioned problems** (already fast)

## Choosing the Momentum Coefficient

### β = 0.0 (No Momentum)
- Equivalent to standard SGD
- Use when momentum hurts performance

### β = 0.5 (Light Momentum)
- Gentle acceleration
- Good for noisy or changing objectives

### β = 0.9 (Standard Momentum)
- Most common choice
- Good balance of acceleration and stability

### β = 0.99 (Heavy Momentum)
- Strong acceleration
- Risk of overshooting
- Good for very consistent gradients

## Momentum vs Other Methods

| Method | Acceleration | Memory | Complexity | When to Use |
|--------|-------------|---------|------------|-------------|
| **SGD** | None | None | Lowest | Simple problems |
| **Momentum** | Yes | Velocity | Low | Most problems |
| **Nesterov** | Yes+ | Velocity | Low | When momentum works |
| **Adam** | Yes | 2 vectors | Medium | Adaptive needs |

## Common Pitfalls

### 1. Too Much Momentum
- **Problem**: Overshooting, instability
- **Solution**: Reduce β or learning rate

### 2. Wrong Learning Rate
- **Problem**: Momentum amplifies learning rate effects
- **Solution**: Often need smaller learning rates with momentum

### 3. Ignoring Problem Structure
- **Problem**: Using momentum when gradients change direction frequently
- **Solution**: Monitor velocity vs gradient alignment

### 4. Not Giving It Time
- **Problem**: Momentum needs time to build up
- **Solution**: Run for more iterations to see benefits

## Best Practices

### 1. Start with β = 0.9
- Works well for most problems
- Adjust based on performance

### 2. Reduce Learning Rate
- Momentum amplifies effective learning rate
- Often need α 2-10x smaller than SGD

### 3. Monitor Velocity
- Watch velocity evolution plots
- Ensure velocity aligns with desired direction

### 4. Combine with Other Techniques
- **Learning rate scheduling**: Reduce α over time
- **Gradient clipping**: Prevent velocity explosion
- **Warmup**: Start with low momentum, increase gradually

## Theoretical Insights

### Convergence Rates
- **SGD**: O(1/k) for convex functions
- **Momentum**: O(1/k²) for strongly convex functions
- **Nesterov**: O(1/k²) with better constants

### Optimal Momentum
For quadratic functions, optimal momentum is:
```
β* = (√κ - 1)/(√κ + 1)
```
where κ is the condition number.

### Relationship to Physical Systems
Momentum optimization corresponds to:
- **Heavy ball method** in continuous time
- **Symplectic integrators** in physics
- **Second-order dynamics** with friction

## Advanced Variants

### Adaptive Momentum
- Adjust β based on gradient consistency
- Higher β when gradients align
- Lower β when gradients change direction

### Restart Schemes
- Reset momentum when progress stalls
- Helps escape from poor trajectories
- Useful for non-convex optimization

### Momentum with Variance Reduction
- Combine with SVRG or SAGA
- Reduces noise while maintaining acceleration
- Better theoretical guarantees

## Implementation Tips

### 1. Initialize Velocity to Zero
- Standard practice
- Momentum builds up naturally

### 2. Apply Momentum to All Parameters
- Usually apply same β to all parameters
- Can use different β for different parameter groups

### 3. Save Velocity State
- Important for checkpointing
- Needed to resume training properly

### 4. Monitor Gradient-Velocity Alignment
- cos(angle) between gradient and velocity
- Should be positive for good performance

## Further Reading

- [On the Momentum Term in Gradient Descent Learning](https://www.cs.toronto.edu/~fritz/absps/momentum.pdf)
- [A Method for Solving the Convex Programming Problem with Convergence Rate O(1/k²)](https://mpawankumar.info/teaching/cdt-big-data/nesterov83.pdf) - Original Nesterov paper
- [Why Momentum Really Works](https://distill.pub/2017/momentum/)
- [An Overview of Gradient Descent Optimization Algorithms](https://ruder.io/optimizing-gradient-descent/)

## Key Takeaways

- Momentum accelerates optimization by accumulating gradients over time
- It smooths oscillations and speeds up convergence in consistent directions
- Nesterov momentum provides better convergence by looking ahead
- β = 0.9 is a good default momentum coefficient for most problems
- Momentum often requires smaller learning rates than vanilla SGD
- Visualization of velocity helps understand momentum dynamics
- Momentum is most beneficial for ill-conditioned and noisy optimization problems
- Understanding momentum is crucial for appreciating modern optimizers like Adam