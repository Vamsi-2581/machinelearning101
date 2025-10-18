# Decision Trees

## Introduction

Decision trees are one of the most intuitive and interpretable machine learning algorithms. They make predictions by learning a series of if-then-else decision rules from the training data, creating a tree-like structure that mimics human decision-making.

Imagine diagnosing a patient: "If temperature > 38°C, then check for cough. If cough is present, then likely flu." This is exactly how decision trees work - they ask a series of questions about the features to arrive at a prediction.

## What You'll Learn

By the end of this module, you will:

- Understand how decision trees learn rules from data
- Learn about splitting criteria (Gini impurity and entropy)
- Explore how tree depth affects model complexity
- Recognize the importance of pruning to prevent overfitting
- Understand how to interpret feature importance

## How Decision Trees Work

### The Tree Structure

A decision tree consists of:

- **Root Node**: The top node representing the entire dataset
- **Internal Nodes**: Decision points that split the data based on feature values
- **Branches**: Connections representing the outcome of a decision
- **Leaf Nodes**: Terminal nodes that contain the final prediction

### Building the Tree

The algorithm builds the tree top-down using a greedy approach:

**Step 1: Start with All Data**
- Begin at the root with all training examples

**Step 2: Find Best Split**
- For each feature, evaluate all possible split points
- Choose the split that best separates the classes
- Use a criterion like Gini impurity or entropy

**Step 3: Create Child Nodes**
- Split the data into two groups based on the chosen feature and threshold
- Create left and right child nodes

**Step 4: Recurse**
- Repeat steps 2-3 for each child node
- Continue until a stopping criterion is met:
  - Maximum depth reached
  - Minimum samples in node
  - All samples in node have same class
  - No further improvement possible

**Step 5: Assign Class Labels**
- At each leaf node, assign the majority class of samples in that node

### Making Predictions

To classify a new example:

1. Start at the root node
2. Follow the decision rules down the tree
3. At each node, go left or right based on the feature value
4. Reach a leaf node and return its class label

## Splitting Criteria

### Gini Impurity

Measures the probability of incorrectly classifying a randomly chosen element:

```
Gini = 1 - Σ(pᵢ)²
```

Where pᵢ is the proportion of samples belonging to class i.

**Interpretation:**
- **Gini = 0**: Pure node (all samples same class)
- **Gini = 0.5**: Maximum impurity (binary classification, 50-50 split)

**Example:**
- Node with 100 samples: 70 class A, 30 class B
- Gini = 1 - (0.7² + 0.3²) = 1 - (0.49 + 0.09) = 0.42

**Advantages:**
- Computationally efficient
- Favors larger partitions
- Works well in practice

### Entropy (Information Gain)

Measures the amount of disorder or uncertainty:

```
Entropy = -Σ(pᵢ × log₂(pᵢ))
```

**Information Gain** is the reduction in entropy after a split:

```
Information Gain = Entropy(parent) - Weighted Average Entropy(children)
```

**Interpretation:**
- **Entropy = 0**: Pure node (no uncertainty)
- **Entropy = 1**: Maximum uncertainty (binary, 50-50 split)

**Example:**
- Node with 100 samples: 70 class A, 30 class B
- Entropy = -(0.7 × log₂(0.7) + 0.3 × log₂(0.3)) ≈ 0.88

**Advantages:**
- Theoretically grounded in information theory
- Can produce slightly different trees than Gini
- Often performs similarly to Gini

### Gini vs. Entropy

In practice, both criteria usually produce similar trees:

- **Gini**: Slightly faster to compute (no logarithm)
- **Entropy**: More sensitive to changes in node probabilities
- **Choice**: Often doesn't matter much; try both

## Controlling Tree Complexity

### Maximum Depth

Limits how deep the tree can grow:

- **Shallow trees (depth 1-3)**: Simple rules, may underfit
- **Medium trees (depth 4-8)**: Balanced complexity
- **Deep trees (depth 10+)**: Complex rules, may overfit

**Impact:**
- Deeper trees can model more complex patterns
- But they're more likely to memorize training data
- Find the sweet spot through cross-validation

### Minimum Samples to Split

Minimum number of samples required to split a node:

- **Low values (2-5)**: More splits, complex tree
- **High values (20-50)**: Fewer splits, simpler tree

**Purpose:**
- Prevents creating nodes with very few samples
- Reduces overfitting
- Improves generalization

### Minimum Samples per Leaf

Minimum number of samples required in a leaf node:

- Ensures each prediction is based on sufficient data
- Prevents overly specific rules
- Typically set to 1-5 for classification

### Maximum Features

Number of features to consider when looking for the best split:

- **All features**: Considers every feature (default)
- **Square root**: √(number of features) - common for classification
- **Log2**: log₂(number of features)

**Purpose:**
- Adds randomness to reduce overfitting
- Useful in ensemble methods (Random Forests)

## Pruning

Pruning removes parts of the tree that don't improve performance:

### Pre-pruning (Early Stopping)

Stop growing the tree early using stopping criteria:
- Maximum depth
- Minimum samples to split
- Minimum impurity decrease

**Advantages:**
- Computationally efficient
- Prevents overfitting during training

### Post-pruning

Grow a full tree, then remove branches:
- Cost-complexity pruning
- Reduced error pruning

**Advantages:**
- Can find better trees
- More flexible

**Process:**
1. Grow a full tree
2. Evaluate each subtree
3. Remove branches that don't improve validation performance

## Feature Importance

Decision trees naturally provide feature importance scores:

```
Importance = (samples at node / total samples) × impurity decrease
```

**Interpretation:**
- Higher values = more important features
- Sum of all importances = 1.0
- Features used near the root are typically more important

**Uses:**
- Feature selection
- Understanding model behavior
- Explaining predictions

## Advantages of Decision Trees

1. **Interpretability**: Easy to understand and visualize
2. **No Feature Scaling**: Works with features on different scales
3. **Handles Mixed Data**: Works with numerical and categorical features
4. **Non-linear Relationships**: Can model complex, non-linear patterns
5. **Feature Importance**: Automatically ranks feature importance
6. **Fast Predictions**: O(log n) prediction time
7. **Few Hyperparameters**: Relatively easy to tune

## Limitations of Decision Trees

1. **Overfitting**: Prone to creating overly complex trees
2. **Instability**: Small changes in data can create very different trees
3. **Bias Toward Dominant Classes**: Can be biased in imbalanced datasets
4. **Axis-Aligned Splits**: Can only create rectangular decision boundaries
5. **Greedy Algorithm**: May not find the globally optimal tree
6. **High Variance**: Single trees can be unstable

## Overfitting in Decision Trees

Decision trees are prone to overfitting because they can:

- Create a leaf for every training example
- Memorize noise in the training data
- Build overly complex rules

**Signs of Overfitting:**
- Perfect or near-perfect training accuracy
- Much lower test accuracy
- Very deep tree with many leaves
- Leaf nodes with very few samples

**Solutions:**
- Limit tree depth
- Increase minimum samples per split/leaf
- Use pruning
- Use ensemble methods (Random Forests, Gradient Boosting)

## Decision Boundaries

Decision trees create **axis-aligned** decision boundaries:

- Splits are always parallel to feature axes
- Creates rectangular regions in feature space
- Can approximate any boundary with enough splits
- But may need many splits for diagonal boundaries

**Example:**
- To separate classes with a diagonal line
- Tree needs many horizontal and vertical splits
- Creates a "staircase" approximation

## Handling Categorical Features

Decision trees naturally handle categorical features:

**Binary Features:**
- Split: "Is feature = value?"

**Multi-class Features:**
- Split: "Is feature in {value1, value2, ...}?"

**Ordinal Features:**
- Treat as numerical with natural ordering

**Nominal Features:**
- Consider all possible subsets (computationally expensive)
- Or use one-vs-rest splits

## Handling Missing Values

Decision trees can handle missing values:

**Surrogate Splits:**
- Find alternative features that create similar splits
- Use when primary feature is missing

**Separate Category:**
- Treat missing as a separate category
- Let the tree learn how to handle it

**Imputation:**
- Fill missing values before training
- Use mean, median, or mode

## Real-World Applications

Decision trees are used in many domains:

- **Medical Diagnosis**: Symptom-based disease classification
- **Credit Scoring**: Loan approval decisions
- **Customer Segmentation**: Marketing target identification
- **Fraud Detection**: Identifying suspicious transactions
- **Manufacturing**: Quality control and defect detection
- **Recommendation Systems**: Content filtering rules

## When to Use Decision Trees

Decision trees work best when:

- You need an interpretable model
- You have mixed feature types (numerical and categorical)
- You don't want to spend time on feature scaling
- You need to explain predictions to non-technical stakeholders
- You have non-linear relationships
- You want to identify important features

## When NOT to Use Decision Trees

Avoid single decision trees when:

- You need the highest possible accuracy (use ensembles instead)
- Your data has many irrelevant features
- You have very high-dimensional data
- You need stable predictions (small data changes shouldn't affect model)
- You have limited training data (prone to overfitting)

## Comparison with Other Algorithms

### Decision Trees vs. KNN
- **Trees**: Rule-based, interpretable, fast prediction
- **KNN**: Distance-based, no training, slow prediction

### Decision Trees vs. Logistic Regression
- **Trees**: Non-linear, no assumptions, interpretable rules
- **Logistic Regression**: Linear, probabilistic, smooth boundaries

### Decision Trees vs. Neural Networks
- **Trees**: Simple, interpretable, limited capacity
- **Neural Networks**: Complex, powerful, black box

## Ensemble Methods

Single decision trees are often combined into ensembles:

### Random Forests
- Train many trees on random subsets of data and features
- Average predictions for better performance
- Reduces overfitting and variance

### Gradient Boosting
- Train trees sequentially, each correcting previous errors
- Creates powerful models
- Used in XGBoost, LightGBM, CatBoost

### AdaBoost
- Weighted combination of weak trees
- Focuses on hard-to-classify examples

## Tips for Better Results

1. **Start Simple**: Begin with shallow trees (depth 3-5)
2. **Use Cross-Validation**: Find optimal depth and parameters
3. **Prune Aggressively**: Simpler trees generalize better
4. **Check Feature Importance**: Remove irrelevant features
5. **Handle Imbalance**: Use class weights for imbalanced data
6. **Visualize the Tree**: Understand what rules it learned
7. **Consider Ensembles**: Random Forests often outperform single trees
8. **Monitor Training vs. Test**: Watch for overfitting

## Interpreting Decision Trees

### Reading the Tree
- **Root**: Most important feature for initial split
- **Depth**: Complexity of decision rules
- **Leaf Values**: Final predictions and confidence

### Understanding Predictions
- Trace the path from root to leaf
- See which features and thresholds were used
- Understand why a prediction was made

### Feature Importance
- Which features are used most?
- Which features appear near the root?
- Which features are never used?

## Summary

Decision trees are powerful, interpretable algorithms that:

- Learn if-then-else rules from data
- Create tree structures for classification
- Use splitting criteria like Gini impurity or entropy
- Require careful tuning to prevent overfitting
- Provide natural feature importance rankings
- Form the basis for powerful ensemble methods

Understanding decision trees is essential for machine learning, as they're widely used both alone and as building blocks in ensemble methods like Random Forests and Gradient Boosting.

## Next Steps

After mastering decision trees, explore:

- **Random Forests**: Ensemble of decision trees
- **Gradient Boosting**: Sequential tree ensembles (XGBoost, LightGBM)
- **Pruning Techniques**: Advanced tree optimization
- **Feature Engineering**: Creating better features for trees
- **Interpretability**: SHAP values and tree explanations
