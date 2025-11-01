# Policy Gradients

## Introduction

Policy gradient methods represent a fundamentally different approach to reinforcement learning compared to value-based methods like Q-Learning. Instead of learning which actions are valuable and deriving a policy from those values, policy gradients directly learn the policy itself.

Imagine teaching someone to play basketball. A value-based approach would be like teaching them to evaluate "how good is this position?" and then choosing moves that lead to good positions. A policy-based approach is more direct: "when you're in this situation, shoot like this" - directly learning the mapping from situations to actions.

Policy gradients are particularly powerful for:
- Continuous action spaces (e.g., robot joint angles, steering wheel positions)
- Stochastic policies (sometimes randomness is optimal)
- High-dimensional action spaces
- Problems where the optimal policy is simpler than the value function

## What You'll Learn

By the end of this module, you will:

- Understand the difference between value-based and policy-based methods
- Learn how policy gradient methods directly optimize the policy
- Understand the REINFORCE algorithm and Monte Carlo policy gradients
- Learn about variance reduction techniques using baselines
- Interpret policy probability distributions and stochastic policies
- Recognize advantages of policy gradients for continuous action spaces

## Value-Based vs Policy-Based Methods

### Value-Based Methods (Q-Learning, DQN)

**Approach**: Learn value function → Derive policy

```
1. Learn Q(s, a) for all state-action pairs
2. Policy: π(s) = argmax_a Q(s, a)
3. Always choose action with highest value
```

**Characteristics**:
- Deterministic policies (always choose best action)
- Indirect: learn values, then extract policy
- Works well for discrete actions
- Can struggle with continuous actions

### Policy-Based Methods (Policy Gradients)

**Approach**: Learn policy directly

```
1. Parameterize policy: π_θ(a|s)
2. Optimize parameters θ to maximize expected return
3. Policy outputs probability distribution over actions
```

**Characteristics**:
- Stochastic policies (sample from probability distribution)
- Direct: learn policy parameters directly
- Natural for continuous actions
- Can learn simpler policies than value functions

### When to Use Each

**Use Value-Based (Q-Learning)**:
- Discrete action spaces
- Deterministic optimal policy
- Sample efficiency is critical
- Need off-policy learning

**Use Policy-Based (Policy Gradients)**:
- Continuous action spaces
- Stochastic optimal policy
- High-dimensional actions
- Policy is simpler than value function

## Policy Representation

### Stochastic Policy

A policy π_θ(a|s) outputs a probability distribution over actions:

```
State s → Policy Network → P(action 0) = 0.1
                          P(action 1) = 0.6
                          P(action 2) = 0.2
                          P(action 3) = 0.1
```

The agent samples an action from this distribution.

### Why Stochastic?

**Rock-Paper-Scissors**: Deterministic policy is exploitable. Optimal policy is uniform random (33% each).

**Partial Observability**: When you can't see everything, randomness helps explore.

**Continuous Improvement**: Stochastic policies can gradually shift probabilities, allowing smooth learning.

### Policy Parameterization

**Neural Network Policy**:
```
Input: State features
Hidden Layers: Learn representations
Output: Action probabilities (softmax)
```

**Parameters θ**: All weights and biases in the network

**Goal**: Find θ that maximizes expected cumulative reward

## The Policy Gradient Theorem

### Objective

Maximize expected return:

```
J(θ) = E_τ~π_θ [R(τ)]
```

Where:
- τ is a trajectory (sequence of states, actions, rewards)
- R(τ) is the total return of the trajectory
- E means expectation (average over many trajectories)

### The Gradient

To maximize J(θ), we need ∇_θ J(θ) (gradient with respect to parameters).

**Policy Gradient Theorem**:

```
∇_θ J(θ) = E_τ~π_θ [∑_t ∇_θ log π_θ(a_t|s_t) G_t]
```

Where:
- G_t is the return from time t onward
- log π_θ(a_t|s_t) is the log probability of the action taken

**Intuition**: 
- If action led to high return (G_t large), increase its probability
- If action led to low return (G_t small), decrease its probability
- Magnitude of change proportional to return

### Why Log Probability?

The log probability trick:

```
∇_θ π_θ(a|s) = π_θ(a|s) ∇_θ log π_θ(a|s)
```

This allows us to:
1. Sample actions from the policy
2. Compute gradients using only the sampled actions
3. Don't need to evaluate all possible actions

## The REINFORCE Algorithm

REINFORCE (Monte Carlo Policy Gradient) is the simplest policy gradient algorithm.

### Algorithm Steps

```
1. Initialize policy parameters θ randomly

2. For each episode:
   a. Generate trajectory by following π_θ
      τ = (s_0, a_0, r_0, s_1, a_1, r_1, ..., s_T)
   
   b. For each time step t:
      - Calculate return: G_t = r_t + γr_{t+1} + γ²r_{t+2} + ...
      - Calculate gradient: ∇_θ log π_θ(a_t|s_t)
      - Accumulate: g += ∇_θ log π_θ(a_t|s_t) × G_t
   
   c. Update policy: θ ← θ + α × g

3. Repeat until convergence
```

### Key Differences from Q-Learning

**Q-Learning**:
- Updates after every step
- Uses bootstrapping (estimates future value)
- Off-policy (learns from any experience)

**REINFORCE**:
- Updates after complete episode
- Uses Monte Carlo returns (actual cumulative reward)
- On-policy (learns from current policy's experience)

### Example: Grid World

**Episode 1**:
```
Path: S → Right → Down → Right → Up → G
Rewards: -1, -1, -1, -1, +100
Returns: G_0 = 96, G_1 = 97, G_2 = 98, G_3 = 99, G_4 = 100
```

**Updates**:
- Increase probability of "Right" in start state (led to G_0 = 96)
- Increase probability of "Down" in next state (led to G_1 = 97)
- And so on...

Actions that led to high returns get reinforced.

## Variance Reduction with Baselines

### The Variance Problem

REINFORCE has high variance:
- Returns can vary wildly between episodes
- Gradients are noisy
- Learning is slow and unstable

**Example**: 
- Episode 1: Return = 95 → Increase action probabilities
- Episode 2: Return = 97 → Increase action probabilities even more
- Episode 3: Return = 96 → Increase action probabilities?

All returns are positive, so all actions get reinforced, even if some are better than others.

### Baseline Solution

Subtract a baseline b from returns:

```
∇_θ J(θ) = E[∑_t ∇_θ log π_θ(a_t|s_t) (G_t - b)]
```

**Common Baseline**: Mean return

```
b = (1/N) ∑_i G_i
```

**Effect**:
- Actions with above-average returns: G_t - b > 0 → Increase probability
- Actions with below-average returns: G_t - b < 0 → Decrease probability

**Example with Baseline**:
```
Episode 1: Return = 95, Baseline = 96 → (95 - 96) = -1 → Decrease
Episode 2: Return = 97, Baseline = 96 → (97 - 96) = +1 → Increase
Episode 3: Return = 96, Baseline = 96 → (96 - 96) = 0 → No change
```

Now we're comparing actions relative to average performance!

### Value Function as Baseline

Even better baseline: V(s) - value of being in state s

```
Advantage: A(s, a) = Q(s, a) - V(s)
```

This measures how much better action a is compared to average in state s.

**Actor-Critic** methods use this approach (covered in next module).

## Advantages of Policy Gradients

### 1. Continuous Action Spaces

**Q-Learning**: Needs to evaluate Q(s, a) for all actions
- Impossible with infinite continuous actions
- Discretization loses precision

**Policy Gradients**: Directly output action
- Can output continuous values
- Natural for robot control, game controllers, etc.

**Example**: Robot arm control
- Q-Learning: Discretize angles into 10° increments (imprecise)
- Policy Gradient: Output exact angle (smooth, precise)

### 2. Stochastic Policies

Some problems require randomness:

**Rock-Paper-Scissors**:
- Deterministic policy: Always choose rock → Opponent exploits
- Stochastic policy: Random choice → Optimal

**Partial Observability**:
- Can't see everything → Randomness helps explore
- Example: Card games with hidden information

### 3. Simpler Policies

Sometimes policy is simpler than value function:

**Example**: Corridor with two actions (left, right)
- Value function: Complex, depends on exact position
- Policy: Simple, "always go right"

Policy gradients can learn this directly without learning complex values.

### 4. Better Convergence Properties

Policy gradients have guaranteed convergence to local optimum:
- Smooth optimization landscape
- Gradient ascent is well-understood
- No issues with overestimation (unlike Q-Learning)

## Limitations and Challenges

### 1. Sample Inefficiency

REINFORCE needs complete episodes:
- Can't learn from partial episodes
- Needs many episodes to reduce variance
- Slower than Q-Learning in many cases

**Solution**: Actor-Critic methods (combine with value function)

### 2. High Variance

Monte Carlo returns have high variance:
- Different episodes give very different returns
- Gradients are noisy
- Slow, unstable learning

**Solutions**: 
- Baselines
- Advantage estimation
- Multiple parallel actors

### 3. Local Optima

Gradient ascent finds local optima:
- May not find global best policy
- Sensitive to initialization
- Can get stuck in suboptimal policies

**Solutions**:
- Good initialization
- Multiple random seeds
- Entropy regularization (encourage exploration)

### 4. On-Policy Learning

REINFORCE is on-policy:
- Must generate new data with current policy
- Can't reuse old experience
- Less sample efficient than off-policy methods

**Solution**: Importance sampling (advanced topic)

## Practical Tips

### 1. Normalize Returns

Standardize returns to have mean 0, std 1:

```
G_normalized = (G - mean(G)) / std(G)
```

This stabilizes learning across different reward scales.

### 2. Use Baseline

Always use baseline for variance reduction:
- Simple: Mean return
- Better: Value function estimate

### 3. Tune Learning Rate

Policy gradients are sensitive to learning rate:
- Too high: Policy changes too fast, unstable
- Too low: Learning is very slow
- Typical range: 0.0001 to 0.01

### 4. Entropy Regularization

Add entropy bonus to encourage exploration:

```
J(θ) = E[R] + β H(π_θ)
```

Where H is entropy (measure of randomness).

### 5. Gradient Clipping

Clip gradients to prevent huge updates:

```
if ||g|| > threshold:
    g = g × (threshold / ||g||)
```

### 6. Multiple Parallel Actors

Run multiple agents in parallel:
- Collect more diverse experience
- Reduce variance through averaging
- Faster learning

## Extensions and Advanced Methods

### Actor-Critic

Combines policy gradients with value function:
- Actor: Policy network (chooses actions)
- Critic: Value network (evaluates actions)
- Critic provides better baseline
- Lower variance, faster learning

### Proximal Policy Optimization (PPO)

Limits policy updates to prevent destructive changes:
- Clips policy ratio
- More stable than vanilla policy gradients
- State-of-the-art for many tasks

### Trust Region Policy Optimization (TRPO)

Constrains policy updates to trust region:
- Guarantees monotonic improvement
- More complex than PPO
- Very stable learning

### Deterministic Policy Gradients (DDPG)

For continuous actions:
- Learns deterministic policy
- Uses critic for gradient estimation
- Efficient for continuous control

### Soft Actor-Critic (SAC)

Maximum entropy RL:
- Encourages exploration through entropy
- Off-policy learning
- State-of-the-art for continuous control

## Real-World Applications

### Robotics

- Manipulation: Grasping, assembly
- Locomotion: Walking, running, jumping
- Navigation: Path planning, obstacle avoidance
- Dexterous control: Fine motor skills

### Game Playing

- Atari games (A3C, PPO)
- Dota 2 (OpenAI Five)
- StarCraft II (AlphaStar)
- Go (AlphaGo uses policy gradients)

### Autonomous Vehicles

- Steering control
- Speed regulation
- Lane keeping
- Parking

### Finance

- Portfolio management
- Trading strategies
- Option pricing
- Risk management

### Natural Language

- Dialogue systems
- Text generation
- Machine translation
- Summarization

## Summary

Policy gradient methods:

- Directly optimize the policy using gradient ascent
- Learn stochastic policies that output probability distributions
- Excel at continuous and high-dimensional action spaces
- Use Monte Carlo returns for policy updates
- Benefit from baselines for variance reduction
- Have guaranteed convergence to local optima
- Form the foundation for modern RL algorithms (PPO, SAC, etc.)

Understanding policy gradients provides:
- Alternative perspective to value-based methods
- Foundation for actor-critic methods
- Tools for continuous control problems
- Basis for state-of-the-art RL algorithms

## Next Steps

After mastering policy gradients, explore:

- **Actor-Critic Methods**: Combine policy and value learning
- **Proximal Policy Optimization (PPO)**: Stable policy updates
- **Soft Actor-Critic (SAC)**: Maximum entropy RL
- **Multi-Agent RL**: Multiple interacting agents
- **Inverse RL**: Learn rewards from demonstrations
- **Meta-RL**: Learn to learn quickly
