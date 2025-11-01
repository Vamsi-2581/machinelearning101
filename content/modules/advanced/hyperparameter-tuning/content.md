# Hyperparameter Tuning

## Introduction

Hyperparameter tuning is the process of finding the optimal configuration of hyperparameters for a machine learning model. Unlike model parameters (weights and biases) that are learned during training, hyperparameters are set before training begins and control the learning process itself.

The choice of hyperparameters can dramatically affect model performance, making hyperparameter optimization a crucial step in the machine learning pipeline.

## What are Hyperparameters?

### Definition

Hyperparameters are configuration settings that control the behavior of machine learning algorithms. They are not learned from data but must be specified before training begins.

### Common Hyperparameters

#### Neural Networks
- **Learning rate**: How fast the model learns
- **Batch size**: Number of samples per gradient update
- **Number of layers**: Depth of the network
- **Hidden units**: Width of each layer
- **Dropout rate**: Regularization strength
- **Activation functions**: Type of non-linearity

#### Tree-based Models
- **Max depth**: Maximum tree depth
- **Min samples split**: Minimum samples to split a node
- **Number of estimators**: Number of trees (for ensembles)
- **Learning rate**: Shrinkage parameter (for boosting)

#### Support Vector Machines
- **C parameter**: Regularization strength
- **Kernel type**: Linear, RBF, polynomial
- **Gamma**: Kernel coefficient
- **Degree**: Polynomial degree

## The Hyperparameter Optimization Problem

### Search Space

The hyperparameter space is the set of all possible hyperparameter configurations. This space can be:

- **Continuous**: Learning rate ∈ [0.001, 0.1]
- **Discrete**: Batch size ∈ {16, 32, 64, 128}
- **Categorical**: Optimizer ∈ {Adam, SGD, RMSprop}
- **Conditional**: Some parameters only matter when others have specific values

### Objective Function

The goal is to find hyperparameters θ that minimize (or maximize) an objective function:

```
θ* = argmin f(θ)
     θ∈Θ
```

Where:
- `θ` represents hyperparameters
- `Θ` is the search space
- `f(θ)` is the validation performance

### Challenges

1. **Expensive Evaluation**: Each configuration requires full model training
2. **High Dimensionality**: Many hyperparameters to optimize
3. **Mixed Types**: Continuous, discrete, and categorical parameters
4. **Non-convex**: Multiple local optima
5. **Noisy**: Stochastic training introduces noise

## Search Strategies

### 1. Manual Search

**Approach**: Human expert manually tries different configurations

**Pros**:
- Leverages domain knowledge
- Can incorporate intuition
- Good for initial exploration

**Cons**:
- Time-consuming
- Not systematic
- Prone to bias
- Doesn't scale

### 2. Grid Search

**Approach**: Exhaustively search over a predefined grid of values

```python
learning_rates = [0.001, 0.01, 0.1]
batch_sizes = [16, 32, 64]
hidden_units = [64, 128, 256]

# Try all 3×3×3 = 27 combinations
```

**Pros**:
- Systematic and reproducible
- Guaranteed to find best in grid
- Easy to parallelize
- Good for low-dimensional spaces

**Cons**:
- Exponential growth with dimensions
- Wastes computation on irrelevant parameters
- Fixed grid may miss optimal values
- Curse of dimensionality

### 3. Random Search

**Approach**: Randomly sample configurations from the search space

**Pros**:
- More efficient than grid search
- Better coverage of important parameters
- Easy to implement and parallelize
- Works well in high dimensions

**Cons**:
- No guarantee of finding optimum
- May waste time on poor regions
- Doesn't learn from previous evaluations
- Still requires many evaluations

**Why Random Search Works**:
- Most hyperparameters don't matter equally
- Random search better explores important dimensions
- Avoids grid search's regular spacing limitations

### 4. Bayesian Optimization

**Approach**: Use probabilistic model to guide search

**Components**:
1. **Surrogate Model**: Gaussian Process models f(θ)
2. **Acquisition Function**: Decides next point to evaluate
3. **Optimization**: Find θ that maximizes acquisition

**Process**:
1. Evaluate a few random points
2. Fit Gaussian Process to observed data
3. Use acquisition function to select next point
4. Evaluate new point and update GP
5. Repeat until budget exhausted

**Pros**:
- Sample efficient
- Learns from previous evaluations
- Balances exploration vs exploitation
- Works well with expensive evaluations

**Cons**:
- More complex to implement
- GP inference can be expensive
- Assumes smoothness
- May struggle with high dimensions

## Cross-Validation for Hyperparameter Tuning

### The Problem

Using the same data for both hyperparameter selection and performance estimation leads to **optimistic bias** - the model appears better than it actually is.

### Solution: Nested Cross-Validation

```
Outer Loop (Performance Estimation):
  For each fold:
    Inner Loop (Hyperparameter Selection):
      For each hyperparameter configuration:
        Train on inner training set
        Validate on inner validation set
      Select best hyperparameters
    Train final model with best hyperparameters
    Test on outer test set
```

### Data Splits

- **Training Set**: Fit model parameters
- **Validation Set**: Select hyperparameters
- **Test Set**: Estimate final performance

### K-Fold Cross-Validation

1. Split data into K folds
2. For each fold:
   - Use K-1 folds for training
   - Use 1 fold for validation
3. Average performance across folds

## Acquisition Functions

### 1. Upper Confidence Bound (UCB)

```
UCB(θ) = μ(θ) + β × σ(θ)
```

- `μ(θ)`: Predicted mean performance
- `σ(θ)`: Predicted uncertainty
- `β`: Exploration parameter

**Intuition**: Select points with high predicted performance OR high uncertainty

### 2. Expected Improvement (EI)

```
EI(θ) = E[max(f(θ) - f*, 0)]
```

- `f*`: Current best observed value
- Probability-weighted improvement over current best

### 3. Probability of Improvement (PI)

```
PI(θ) = P(f(θ) > f*)
```

- Probability that θ will improve over current best
- Simple but can be too greedy

## Interactive Demo

Use the controls below to explore different hyperparameter tuning strategies:

### Search Strategy Comparison
- **Grid Search**: See systematic exploration
- **Random Search**: Observe random sampling
- **Bayesian Optimization**: Watch intelligent search

### Parameters to Tune
- **Max Iterations**: Balance between thoroughness and efficiency
- **CV Folds**: Trade-off between reliability and computation
- **Scoring Metric**: Choose appropriate evaluation criterion

### What to Observe

1. **Optimization Progress**: How quickly does each strategy find good configurations?
2. **Best Score Evolution**: How does the best found score improve over time?
3. **Parameter Importance**: Which hyperparameters matter most?
4. **Convergence**: When does the search stop improving?

## Advanced Techniques

### 1. Multi-fidelity Optimization

**Idea**: Use cheaper approximations to guide expensive evaluations

**Examples**:
- Train for fewer epochs initially
- Use smaller datasets for screening
- Lower resolution for images

**Benefits**:
- Faster screening of poor configurations
- More evaluations within budget
- Better exploration of space

### 2. Population-based Training

**Idea**: Evolve a population of models simultaneously

**Process**:
1. Train multiple models in parallel
2. Periodically evaluate performance
3. Replace worst performers with mutations of best
4. Continue training evolved population

**Benefits**:
- Online hyperparameter adaptation
- Efficient use of parallel resources
- Can adapt hyperparameters during training

### 3. Hyperband

**Idea**: Combine random search with early stopping

**Process**:
1. Allocate budget across configurations and training time
2. Start many configurations with small budgets
3. Progressively eliminate poor performers
4. Give more budget to promising configurations

**Benefits**:
- Efficient resource allocation
- Good performance without tuning
- Principled early stopping

## Practical Considerations

### 1. Search Space Design

**Continuous Parameters**:
- Use log scale for learning rates: [1e-5, 1e-1]
- Linear scale for dropout: [0.0, 0.5]

**Discrete Parameters**:
- Powers of 2 for batch sizes: {16, 32, 64, 128}
- Reasonable ranges for layer sizes

**Categorical Parameters**:
- Include relevant options only
- Consider conditional dependencies

### 2. Budget Allocation

**Time Constraints**:
- Set maximum wall-clock time
- Use early stopping for poor configurations
- Parallelize when possible

**Computational Resources**:
- Balance number of configurations vs training time
- Use cheaper proxies when possible
- Consider cloud computing for large searches

### 3. Reproducibility

**Random Seeds**:
- Fix seeds for data splitting
- Use different seeds for model initialization
- Document all random sources

**Logging**:
- Record all hyperparameter configurations
- Save intermediate results
- Track computational resources used

## Common Pitfalls

### 1. Data Leakage

**Problem**: Using test data for hyperparameter selection
**Solution**: Proper train/validation/test splits

### 2. Overfitting to Validation Set

**Problem**: Too many hyperparameter evaluations on same validation set
**Solution**: Nested cross-validation or hold-out test set

### 3. Ignoring Computational Cost

**Problem**: Optimizing only for performance, not efficiency
**Solution**: Multi-objective optimization considering speed/memory

### 4. Poor Search Space

**Problem**: Too narrow or too wide parameter ranges
**Solution**: Start with literature values, expand based on results

## Evaluation Metrics

### Classification
- **Accuracy**: Overall correctness
- **F1-Score**: Balance of precision and recall
- **AUC-ROC**: Ranking quality
- **Log-Loss**: Probability calibration

### Regression
- **MSE**: Mean squared error
- **MAE**: Mean absolute error
- **R²**: Explained variance
- **MAPE**: Mean absolute percentage error

### Considerations
- Choose metric aligned with business objective
- Consider class imbalance for classification
- Use multiple metrics for comprehensive evaluation

## Tools and Libraries

### Python Libraries
- **Scikit-learn**: GridSearchCV, RandomizedSearchCV
- **Optuna**: Bayesian optimization framework
- **Hyperopt**: Tree-structured Parzen Estimators
- **Ray Tune**: Scalable hyperparameter tuning

### Cloud Services
- **Google Cloud AI Platform**: Managed hyperparameter tuning
- **AWS SageMaker**: Automatic model tuning
- **Azure Machine Learning**: HyperDrive

### Specialized Tools
- **Weights & Biases**: Experiment tracking and sweeps
- **MLflow**: ML lifecycle management
- **Neptune**: Experiment management

## Case Study: Neural Network Tuning

### Problem Setup
- Binary classification task
- Neural network with 2 hidden layers
- 1000 training samples, 200 validation samples

### Hyperparameters to Tune
- Learning rate: [1e-4, 1e-1] (log scale)
- Batch size: {16, 32, 64, 128}
- Hidden units: [32, 512] (log scale)
- Dropout rate: [0.0, 0.5]
- Optimizer: {Adam, SGD, RMSprop}

### Results
- **Grid Search**: 5×4×5×5×3 = 1500 configurations
- **Random Search**: 100 random samples
- **Bayesian Optimization**: 50 evaluations

**Findings**:
- Random search found 95% of grid search performance in 1/15 time
- Bayesian optimization achieved best performance in 1/30 time
- Learning rate and hidden units were most important parameters

## Further Reading

### Foundational Papers
- "Random Search for Hyper-Parameter Optimization" (Bergstra & Bengio, 2012)
- "Practical Bayesian Optimization of Machine Learning Algorithms" (Snoek et al., 2012)
- "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization" (Li et al., 2017)

### Advanced Topics
- Multi-objective hyperparameter optimization
- Transfer learning for hyperparameter tuning
- Neural architecture search
- Automated machine learning (AutoML)

### Practical Resources
- Hyperparameter tuning best practices
- Case studies in different domains
- Benchmarking different optimization methods
- Cost-effective tuning strategies

Hyperparameter tuning is both an art and a science, requiring careful consideration of the problem domain, available resources, and optimization objectives. Modern automated approaches can significantly improve model performance while reducing the manual effort required.