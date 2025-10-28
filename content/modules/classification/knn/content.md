# K-Nearest Neighbors (KNN)

## Introduction

K-Nearest Neighbors (KNN) is one of the simplest and most intuitive machine learning algorithms. Unlike other algorithms that learn a model during training, KNN is a "lazy learner" - it simply stores all the training data and makes predictions by looking at the K closest examples when needed.

The core idea is beautifully simple: "You are the average of your neighbors." To classify a new point, KNN finds the K nearest training examples and assigns the most common class among them.

## What You'll Learn

By the end of this module, you will:

- Understand how KNN makes predictions using nearest neighbors
- Learn how the K parameter affects model complexity and performance
- Explore different distance metrics and when to use them
- Recognize why feature scaling is critical for KNN
- Understand the bias-variance tradeoff in KNN

## How KNN Works

![KNN Classification Visualization](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/KnnClassification.svg/500px-KnnClassification.svg.png)
*KNN classifies a point based on the majority class of its K nearest neighbors*

### The Algorithm

KNN follows a simple process for classification:

**Step 1: Store Training Data**
- Keep all training examples in memory
- No actual "training" happens - this is why it's called "lazy learning"

**Step 2: Calculate Distances**
- For a new point to classify, calculate its distance to all training points
- Use a distance metric (Euclidean, Manhattan, etc.)

**Step 3: Find K Nearest Neighbors**
- Sort all training points by distance
- Select the K closest points

**Step 4: Vote for Class**
- Count the class labels of the K nearest neighbors
- Assign the most common class (majority vote)
- For ties, use the nearest neighbor or a random choice

### Example

Imagine classifying whether an email is spam or not spam:

1. You have 100 labeled emails (training data)
2. A new email arrives
3. Find the 5 most similar emails (K=5)
4. If 4 are spam and 1 is not spam, classify as spam

## Distance Metrics

![Distance Metrics Comparison](https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Manhattan_distance.svg/500px-Manhattan_distance.svg.png)
*Comparison of Euclidean (green) vs Manhattan (red/blue/yellow) distance*

### Euclidean Distance (L2)

The straight-line distance between two points:

```
d = √[(x₁ - x₂)² + (y₁ - y₂)²]
```

For n dimensions:
```
d = √[Σ(xᵢ - yᵢ)²]
```

**When to use:**
- Features are continuous and on similar scales
- You want the shortest path between points
- Most common choice for KNN

### Manhattan Distance (L1)

The sum of absolute differences (like walking on a city grid):

```
d = |x₁ - x₂| + |y₁ - y₂|
```

For n dimensions:
```
d = Σ|xᵢ - yᵢ|
```

**When to use:**
- Features represent grid-like spaces
- You want to reduce the impact of outliers
- Computational efficiency is important

### Other Distance Metrics

- **Minkowski Distance**: Generalization of Euclidean and Manhattan
- **Cosine Similarity**: For text and high-dimensional data
- **Hamming Distance**: For categorical features

## The K Parameter

![KNN Decision Boundaries](https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Map1NN.png/500px-Map1NN.png)
*Decision boundaries for different values of K*

The choice of K dramatically affects model behavior:

### Small K (e.g., K=1)

**Advantages:**
- Captures fine details in the data
- Low bias (flexible model)
- Can model complex decision boundaries

**Disadvantages:**
- Sensitive to noise and outliers
- High variance (overfitting)
- Decision boundary is jagged and irregular

**When to use:** Clean data with clear patterns

### Large K (e.g., K=20)

**Advantages:**
- Smooth decision boundaries
- Less sensitive to noise
- Low variance (stable predictions)

**Disadvantages:**
- May miss local patterns
- High bias (underfitting)
- Can blur class boundaries

**When to use:** Noisy data or when you want stable predictions

### Choosing K

**Rules of thumb:**
- Start with K = √n (where n is the number of training samples)
- Use odd K for binary classification to avoid ties
- Use cross-validation to find optimal K
- Typical range: 3 to 15 for most problems

## Feature Scaling: Critical for KNN

KNN is **extremely sensitive** to feature scales because it uses distances. Consider:

```
Feature 1 (Age): 20-80 (range: 60)
Feature 2 (Income): $20,000-$200,000 (range: 180,000)
```

Without scaling, income dominates the distance calculation, making age nearly irrelevant!

### Normalization (Min-Max Scaling)

Scale features to [0, 1]:

```
x_scaled = (x - x_min) / (x_max - x_min)
```

### Standardization (Z-score)

Scale to mean=0, std=1:

```
x_scaled = (x - μ) / σ
```

**Always scale features before using KNN!**

## Advantages of KNN

1. **Simple and Intuitive**: Easy to understand and explain
2. **No Training Phase**: Fast to "train" (just store data)
3. **Naturally Multi-class**: Works with any number of classes
4. **Non-parametric**: Makes no assumptions about data distribution
5. **Adapts to New Data**: Easy to add new training examples

## Limitations of KNN

1. **Slow Predictions**: Must calculate distance to all training points
2. **Memory Intensive**: Stores entire training dataset
3. **Curse of Dimensionality**: Performance degrades in high dimensions
4. **Sensitive to Irrelevant Features**: All features affect distance equally
5. **Requires Feature Scaling**: Doesn't work well with unscaled features
6. **Imbalanced Classes**: Majority class can dominate voting

## The Curse of Dimensionality

As the number of features increases:

- Points become increasingly sparse
- All points become roughly equidistant
- The concept of "nearest" becomes meaningless
- Performance degrades significantly

**Solution:** Use dimensionality reduction (PCA, feature selection) before KNN

## Bias-Variance Tradeoff

![Bias-Variance Tradeoff](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bias_and_variance_contributing_to_total_error.svg/500px-Bias_and_variance_contributing_to_total_error.svg.png)
*The bias-variance tradeoff in model complexity*

KNN demonstrates the classic bias-variance tradeoff:

### Low K (e.g., K=1)
- **Low Bias**: Can fit complex patterns
- **High Variance**: Sensitive to noise, overfits
- **Result**: Good training accuracy, poor test accuracy

### High K (e.g., K=50)
- **High Bias**: Oversimplifies patterns
- **Low Variance**: Stable but may underfit
- **Result**: Moderate training and test accuracy

### Optimal K
- **Balanced**: Captures true patterns without overfitting
- **Result**: Best test accuracy

## Weighted KNN

Standard KNN gives equal votes to all K neighbors. **Weighted KNN** gives more influence to closer neighbors:

```
weight = 1 / distance
```

Closer neighbors have more say in the classification.

**Benefits:**
- Reduces impact of distant neighbors
- Can use larger K without over-smoothing
- Often improves performance

## Performance Metrics

### Accuracy

Percentage of correct predictions:

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**Good for:** Balanced datasets

### Precision

Of predicted positives, how many are actually positive:

```
Precision = TP / (TP + FP)
```

**Good for:** When false positives are costly (e.g., spam detection)

### Recall (Sensitivity)

Of actual positives, how many were correctly predicted:

```
Recall = TP / (TP + FN)
```

**Good for:** When false negatives are costly (e.g., disease detection)

### F1 Score

Harmonic mean of precision and recall:

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Good for:** Imbalanced datasets, balancing precision and recall

## Optimizing KNN Performance

### 1. Feature Engineering
- Remove irrelevant features
- Create meaningful derived features
- Use domain knowledge

### 2. Feature Scaling
- Always normalize or standardize
- Ensure all features contribute equally

### 3. Dimensionality Reduction
- Use PCA to reduce features
- Apply feature selection techniques

### 4. Efficient Search Structures
- Use KD-trees or Ball trees
- Approximate nearest neighbors for large datasets

### 5. Cross-Validation
- Use k-fold cross-validation to find optimal K
- Test multiple distance metrics

## Real-World Applications

KNN is used in many domains:

- **Recommendation Systems**: "Users like you also liked..."
- **Image Recognition**: Classify images based on similar images
- **Medical Diagnosis**: Diagnose based on similar patient cases
- **Credit Scoring**: Assess risk based on similar applicants
- **Anomaly Detection**: Identify outliers with few nearby neighbors
- **Pattern Recognition**: Handwriting recognition, face recognition

## When to Use KNN

KNN works best when:

- You have small to medium-sized datasets
- Features are continuous and can be scaled
- Decision boundaries are irregular
- You need a simple, interpretable model
- Training time is not critical
- You have sufficient memory

## When NOT to Use KNN

Avoid KNN when:

- You have very large datasets (slow predictions)
- You have many features (curse of dimensionality)
- Features are on very different scales and can't be normalized
- You need fast real-time predictions
- Memory is limited

## Comparison with Other Algorithms

### KNN vs. Logistic Regression
- **KNN**: Non-linear boundaries, no training, slow prediction
- **Logistic Regression**: Linear boundaries, fast training and prediction

### KNN vs. Decision Trees
- **KNN**: Smooth boundaries, requires scaling, memory intensive
- **Decision Trees**: Axis-aligned boundaries, no scaling needed, compact

### KNN vs. Neural Networks
- **KNN**: Simple, interpretable, no training
- **Neural Networks**: Complex, powerful, requires training

## Tips for Better Results

1. **Start Simple**: Begin with K=5 and Euclidean distance
2. **Scale Features**: Always normalize or standardize
3. **Tune K**: Use cross-validation to find optimal K
4. **Remove Outliers**: Clean your data before training
5. **Feature Selection**: Remove irrelevant or redundant features
6. **Try Weighted KNN**: Give more weight to closer neighbors
7. **Handle Imbalance**: Use weighted voting for imbalanced classes

## Summary

K-Nearest Neighbors is a simple yet powerful algorithm that:

- Makes predictions based on similarity to training examples
- Requires no training phase (lazy learning)
- Is sensitive to feature scaling and the choice of K
- Works well for small to medium datasets with proper preprocessing
- Demonstrates the bias-variance tradeoff clearly

Understanding KNN provides intuition about distance-based learning and the importance of feature engineering in machine learning.

## Next Steps

After mastering KNN, explore:

- **Decision Trees**: Rule-based classification
- **Support Vector Machines**: Maximum margin classification
- **Ensemble Methods**: Combining multiple KNN models
- **Dimensionality Reduction**: PCA for high-dimensional data
- **Advanced Distance Metrics**: Custom similarity measures
