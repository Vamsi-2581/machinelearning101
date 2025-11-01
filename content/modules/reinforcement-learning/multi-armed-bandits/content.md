# Multi-Armed Bandits

## Introduction

Imagine you're in a casino facing a row of slot machines (called "one-armed bandits" because they have one lever and take your money). Each machine has a different, unknown probability of paying out. You have a limited budget and want to maximize your winnings. Which machines should you play?

This is the **multi-armed bandit problem** - one of the simplest yet most fundamental problems in reinforcement learning. It captures the essence of the exploration-exploitation tradeoff without the complexity of sequential states.

The multi-armed bandit problem appears everywhere:
- **A/B Testing**: Which website design converts better?
- **Clinical Trials**: Which treatment works best?
- **Ad Placement**: Which ad gets more clicks?
- **Recommendation Systems**: Which content keeps users engaged?

## What You'll Learn

By the end of this module, you will:

- Understand the multi-armed bandit problem and its real-world applications
- Learn the exploration-exploitation tradeoff in its simplest form
- Compare three popular strategies: epsilon-greedy, UCB, and Thompson Sampling
- Understand regret as a performance metric
- Recognize when bandits are appropriate vs full RL
- Visualize learning progress through reward and regret curves

## The Multi-Armed Bandit Problem

### Problem Setup

You have:
- **K arms** (slot machines, options, actions)
- **T trials** (opportunities to pull an arm)
- Each arm has an unknown reward distribution
- Goal: Maximize total reward over T trials

### Key Characteristics

**Stateless**: Unlike full RL, there's no state that changes
- Each trial is independent
- No sequential decision-making
- Simpler than Markov Decision Processes

**Stochastic Rewards**: Each arm gives random rewards
- Same arm can give different rewards each time
- We only know the distribution through experience

**Unknown Distributions**: We don't know which arms are best
- Must learn through trial and error
- Can't just calculate the optimal strategy

### The Challenge

If we knew which arm was best, we'd always pull it. But we don't know, so we must:

**Explore**: Try different arms to learn which are good
**Exploit**: Pull the best known arm to maximize reward

Too much exploration → Waste trials on bad arms
Too much exploitation → Miss discovering better arms

This is the **exploration-exploitation tradeoff**.

## Real-World Applications

### A/B Testing

**Problem**: Which website design leads to more purchases?

**Bandit Formulation**:
- Arms: Different website designs (A, B, C, ...)
- Reward: 1 if user makes purchase, 0 otherwise
- Goal: Show the best design to maximize conversions

**Why Bandits**: Traditional A/B testing shows each design equally, wasting traffic on poor designs. Bandits adapt, showing better designs more often.

### Clinical Trials

**Problem**: Which drug dosage is most effective?

**Bandit Formulation**:
- Arms: Different dosages
- Reward: Patient improvement score
- Goal: Find best dosage while minimizing harm

**Why Bandits**: Ethical to shift patients toward better treatments as we learn, rather than fixed allocation.

### Online Advertising

**Problem**: Which ad gets the most clicks?

**Bandit Formulation**:
- Arms: Different ads
- Reward: 1 if clicked, 0 otherwise
- Goal: Maximize click-through rate

**Why Bandits**: Ad performance changes over time; bandits adapt continuously.

### Content Recommendation

**Problem**: Which articles keep users engaged?

**Bandit Formulation**:
- Arms: Different articles
- Reward: Time spent reading
- Goal: Maximize user engagement

**Why Bandits**: User preferences vary; bandits personalize recommendations.

## Regret: Measuring Performance

### What is Regret?

**Regret** measures how much reward we lost by not always choosing the optimal arm.

```
Regret at trial t = Optimal Reward - Actual Reward
Cumulative Regret = Sum of all regrets
```

### Example

Suppose:
- Arm 1 (optimal): 0.8 expected reward
- Arm 2: 0.5 expected reward
- Arm 3: 0.3 expected reward

If we pull Arm 2:
- Regret = 0.8 - 0.5 = 0.3

If we pull Arm 1:
- Regret = 0.8 - 0.8 = 0

### Why Regret Matters

**Low Regret**: Algorithm quickly identifies and exploits best arm
**High Regret**: Algorithm wastes trials on suboptimal arms

Good bandit algorithms have **sublinear regret**:
- Regret grows slower than number of trials
- Average regret per trial → 0 as T → ∞

## Strategy 1: Epsilon-Greedy

The simplest approach to balance exploration and exploitation.

### Algorithm

```
For each trial:
  With probability ε:
    Pull a random arm (explore)
  With probability 1-ε:
    Pull the arm with highest average reward (exploit)
```

### How It Works

**Exploration (ε)**: Try random arms to discover their rewards
**Exploitation (1-ε)**: Use current knowledge to maximize reward

**ε = 0.1**: 10% exploration, 90% exploitation (typical)
**ε = 0**: Pure exploitation (greedy)
**ε = 1**: Pure exploration (random)

### Advantages

- Simple to implement
- Easy to understand
- Works reasonably well in practice
- Guaranteed to converge to optimal arm

### Disadvantages

- Explores uniformly (doesn't prioritize uncertain arms)
- Fixed exploration rate (doesn't adapt)
- Can be inefficient with many arms
- Regret is linear in worst case

### When to Use

- Simple problems with few arms
- When you want predictable behavior
- As a baseline to compare other methods
- When implementation simplicity matters

## Strategy 2: UCB (Upper Confidence Bound)

A smarter approach that explores uncertain arms more.

### The Idea

For each arm, maintain:
- **Mean reward estimate**: Average reward so far
- **Confidence bound**: Uncertainty in the estimate

Pull the arm with highest **upper confidence bound**:
```
UCB(arm) = mean_reward + c × sqrt(ln(total_pulls) / arm_pulls)
           └──────────┘   └────────────────────────────────┘
           Exploitation        Exploration Bonus
```

### How It Works

**Exploitation Term**: Prefer arms with high average reward
**Exploration Bonus**: Prefer arms we're uncertain about
- Large when arm pulled few times
- Decreases as we pull arm more
- Increases as total trials increase

**Parameter c**: Controls exploration
- Higher c → More exploration
- Lower c → More exploitation
- Typical: c = 2

### Why It's Smart

**Optimism Under Uncertainty**: Assumes uncertain arms might be great
**Adaptive Exploration**: Automatically explores uncertain arms
**No Random Exploration**: Deterministic, principled approach

### Advantages

- Theoretically optimal regret bounds
- Adapts exploration to uncertainty
- No random exploration needed
- Works well in practice

### Disadvantages

- Requires counting arm pulls
- Sensitive to parameter c
- Can be slow to converge initially
- Assumes stationary rewards

### When to Use

- When you want theoretical guarantees
- Problems with stationary rewards
- When you can tune parameter c
- When deterministic behavior is preferred

## Strategy 3: Thompson Sampling

A Bayesian approach using probability matching.

### The Idea

Maintain a probability distribution over each arm's reward:
- Start with prior belief (e.g., uniform)
- Update belief after each observation (Bayesian update)
- Sample from each arm's distribution
- Pull arm with highest sample

### How It Works (Bernoulli Rewards)

For each arm, maintain Beta distribution Beta(α, β):
- α: Number of successes + 1
- β: Number of failures + 1

```
For each trial:
  For each arm:
    Sample θ from Beta(α, β)
  Pull arm with highest θ
  Update winner's α or β based on reward
```

### Why It's Elegant

**Probability Matching**: Pulls each arm proportional to probability it's optimal
**Natural Exploration**: Uncertain arms have wide distributions, get sampled more
**Bayesian**: Principled probabilistic framework

### Advantages

- Often best empirical performance
- Naturally balances exploration-exploitation
- Adapts to uncertainty
- Extends to complex scenarios

### Disadvantages

- More complex to implement
- Requires sampling from distributions
- Computationally more expensive
- Harder to analyze theoretically

### When to Use

- When empirical performance matters most
- Problems with binary or bounded rewards
- When you can afford computation
- Modern applications (often the default choice)

## Comparing Strategies

### Epsilon-Greedy vs UCB

**Epsilon-Greedy**:
- Simpler
- Random exploration
- Fixed exploration rate
- Linear regret possible

**UCB**:
- More sophisticated
- Directed exploration
- Adaptive exploration
- Logarithmic regret guaranteed

### UCB vs Thompson Sampling

**UCB**:
- Deterministic
- Theoretical guarantees
- Requires parameter tuning
- Frequentist approach

**Thompson Sampling**:
- Stochastic
- Often better empirically
- Fewer parameters
- Bayesian approach

### Which to Choose?

**Start Simple**: Try epsilon-greedy first
**Want Guarantees**: Use UCB
**Want Performance**: Use Thompson Sampling
**In Practice**: Thompson Sampling often wins

## Convergence and Optimality

### What Does Convergence Mean?

A bandit algorithm converges when:
- It identifies the optimal arm
- Pulls optimal arm most of the time
- Regret growth slows down

### Convergence Rates

**Epsilon-Greedy**: 
- Converges eventually
- Regret: O(T) in worst case
- Never stops exploring suboptimal arms

**UCB**:
- Converges faster
- Regret: O(log T)
- Exploration decreases over time

**Thompson Sampling**:
- Converges fast in practice
- Regret: O(log T) for many cases
- Naturally reduces exploration

### Signs of Good Performance

- Cumulative reward approaches optimal
- Cumulative regret grows slowly
- Optimal arm pulled frequently
- Estimated rewards match true rewards

## Extensions and Variants

### Contextual Bandits

Add context (features) to each trial:
- Different user demographics
- Time of day
- Device type

Pull arm based on context, not just history.

**Applications**: Personalized recommendations, targeted advertising

### Restless Bandits

Arm rewards change over time:
- User preferences shift
- Seasonal effects
- Concept drift

Need to balance exploration of new behavior with exploitation.

**Solutions**: Sliding windows, discounted updates, change detection

### Combinatorial Bandits

Choose multiple arms simultaneously:
- Display multiple ads
- Recommend several items
- Select feature subset

**Challenge**: Exponential number of combinations

### Adversarial Bandits

Rewards chosen by adversary:
- Worst-case analysis
- No stochastic assumptions
- Robust to manipulation

**Algorithm**: EXP3 (Exponential-weight algorithm for Exploration and Exploitation)

## Bandits vs Full Reinforcement Learning

### When to Use Bandits

**Stateless Problems**:
- Each decision is independent
- No sequential effects
- Immediate rewards

**Examples**:
- A/B testing
- Ad selection
- Treatment assignment

### When to Use Full RL

**Sequential Problems**:
- Actions affect future states
- Delayed rewards
- Long-term planning needed

**Examples**:
- Game playing
- Robot navigation
- Resource management

### Bandits as RL Building Block

Bandits are:
- Simplest RL problem (one state)
- Foundation for understanding exploration
- Component in larger RL systems

## Practical Tips

### 1. Start with Thompson Sampling

Unless you have specific reasons otherwise:
- Often best performance
- Fewer parameters to tune
- Adapts naturally

### 2. Tune Exploration Parameters

For epsilon-greedy:
- Try ε = 0.1, 0.05, 0.01
- Consider epsilon decay

For UCB:
- Try c = 1, 2, 3
- Higher c for more exploration

### 3. Monitor Regret

Track cumulative regret:
- Should grow sublinearly
- Flattening indicates convergence
- Compare strategies

### 4. Use Sufficient Trials

More trials → Better learning:
- Minimum: 100 × number of arms
- Better: 1000 × number of arms
- Depends on reward variance

### 5. Visualize Learning

Plot:
- Cumulative reward over time
- Cumulative regret over time
- Arm pull distribution
- Estimated vs true rewards

### 6. Consider Reward Scale

Normalize rewards to [0, 1]:
- Makes parameters more interpretable
- Improves numerical stability
- Easier to compare across problems

## Summary

Multi-armed bandits are:

- The simplest reinforcement learning problem
- A pure exploration-exploitation tradeoff
- Applicable to many real-world problems
- Foundation for understanding RL

Key strategies:
- **Epsilon-Greedy**: Simple, random exploration
- **UCB**: Smart, directed exploration with guarantees
- **Thompson Sampling**: Bayesian, often best in practice

Performance metric:
- **Regret**: Difference from optimal
- Good algorithms have sublinear regret

Applications:
- A/B testing and experimentation
- Clinical trials
- Online advertising
- Recommendation systems

## Next Steps

After mastering bandits, explore:

- **Contextual Bandits**: Add features to decisions
- **Q-Learning**: Add states and sequential decisions
- **Policy Gradients**: Learn policies directly
- **Bayesian Optimization**: Optimize expensive functions
- **Online Learning**: Broader framework for adaptive algorithms
