# Support Vector Machines (SVM)

## Introduction

Support Vector Machines (SVM) are powerful supervised learning algorithms used for classification and regression. SVMs find the optimal boundary between classes by maximizing the margin - the distance between the decision boundary and the nearest data points from each class.

The key insight of SVM is elegant: among all possible boundaries that separate the classes, choose the one that is furthest from the nearest points of both classes. This "maximum margin" approach often leads to better generalization on unseen data.

## What You'll Learn

By the end of this module, you will:

- Understand how SVM finds the maximum margin hyperplane
- Learn about support vectors and their critical role
- Explore kernel functions for handling non-linear data
- Recognize the impact of the C parameter on the margin
- Understand the kernel trick and its computational magic

## The Core Concept: Maximum Margin

### Linear Separability

For linearly separable data, many lines could separate the two classes. Which one is best?

SVM's answer: **The line that maximizes the margin.**

### The Margin

The **margin** is the distance between the decision boundary and the nearest data points from each class.

- **Decision Boundary (Hyperplane)**: The line (or plane in higher dimensions) that separates classes
- **Margin**: The "buffer zone" on either side of the boundary
- **Support Vectors**: The data points closest to the boundary that define the margin

### Why Maximum Margin?

Maximizing the margin provides:

1. **Better Generalization**: More room for error on new data
2. **Robustness**: Less sensitive to small perturbations
3. **Unique Solution**: Only one maximum margin hyperplane exists
4. **Theoretical Guarantees**: Strong mathematical foundations

## How SVM Works

### For Linearly Separable Data

**Step 1: Define the Hyperplane**

In 2D, the decision boundary is a line:
```
w₁x₁ + w₂x₂ + b = 0
```

In n dimensions, it's a hyperplane:
```
w·x + b = 0
```

Where:
- **w**: Weight vector (perpendicular to the hyperplane)
- **b**: Bias term (shifts the hyperplane)
- **x**: Feature vector

**Step 2: Define the Margin**

Points on the margin boundaries satisfy:
```
w·x + b = +1  (positive class margin)
w·x + b = -1  (negative class margin)
```

The margin width is:
```
margin = 2 / ||w||
```

**Step 3: Maximize the Margin**

To maximize the margin, minimize ||w||:

```
minimize: (1/2)||w||²
subject to: yᵢ(w·xᵢ + b) ≥ 1 for all i
```

Where yᵢ ∈ {-1, +1} is the class label.

**Step 4: Solve the Optimization Problem**

This is a convex quadratic programming problem with a unique solution. The solution depends only on the **support vectors** - the points on the margin boundaries.

### Making Predictions

To classify a new point x:

```
f(x) = sign(w·x + b)
```

- If f(x) > 0: Predict positive class
- If f(x) < 0: Predict negative class
- If f(x) = 0: On the decision boundary

## Support Vectors

**Support vectors** are the training points that lie on the margin boundaries. They are the most important points because:

1. **They Define the Boundary**: Only support vectors determine the hyperplane
2. **Other Points Don't Matter**: Points far from the margin don't affect the solution
3. **Sparse Representation**: Usually only a small fraction of training points are support vectors
4. **Memory Efficiency**: Only need to store support vectors for predictions

### Properties

- Removing non-support vectors doesn't change the model
- Adding points far from the margin doesn't change the model
- Support vectors are the "critical" examples
- Fewer support vectors = simpler model

## Soft Margin SVM: The C Parameter

Real-world data is rarely perfectly separable. **Soft margin SVM** allows some misclassifications.

### The C Parameter

C controls the tradeoff between:
- **Maximizing the margin** (simpler model)
- **Minimizing classification errors** (better training accuracy)

```
minimize: (1/2)||w||² + C × Σξᵢ
```

Where ξᵢ are slack variables allowing violations.

### Impact of C

**Small C (e.g., C = 0.01)**
- **Wide margin**: More regularization
- **More violations allowed**: Some points can be misclassified or inside the margin
- **Simpler model**: Less overfitting
- **Lower training accuracy**: May underfit
- **Better generalization**: Often better on test data

**Large C (e.g., C = 100)**
- **Narrow margin**: Less regularization
- **Fewer violations**: Tries to classify all training points correctly
- **Complex model**: More overfitting risk
- **Higher training accuracy**: May overfit
- **Worse generalization**: May perform poorly on test data

**Optimal C**
- Found through cross-validation
- Balances bias and variance
- Depends on the dataset

## Kernel Functions: Handling Non-linear Data

For non-linearly separable data, SVM uses the **kernel trick** to implicitly map data to a higher-dimensional space where it becomes linearly separable.

### The Kernel Trick

Instead of explicitly computing the high-dimensional mapping φ(x), kernels compute the inner product directly:

```
K(x, x') = φ(x)·φ(x')
```

This is computationally efficient and allows infinite-dimensional spaces!

### Common Kernels

#### Linear Kernel

```
K(x, x') = x·x'
```

**When to use:**
- Data is linearly separable
- High-dimensional data (text, images)
- Fast training and prediction
- Interpretable model

#### RBF (Radial Basis Function) Kernel

```
K(x, x') = exp(-γ||x - x'||²)
```

**When to use:**
- Non-linear relationships
- No prior knowledge about data structure
- Most popular choice
- Works well in many scenarios

**Gamma parameter:**
- **Small γ**: Smooth, simple boundary (high bias)
- **Large γ**: Complex, wiggly boundary (high variance)
- **Default**: 1 / (n_features × variance)

#### Polynomial Kernel

```
K(x, x') = (x·x' + c)^d
```

Where d is the degree.

**When to use:**
- Polynomial relationships
- Image processing
- Specific domain knowledge suggests polynomial features

**Degree parameter:**
- **d = 1**: Linear kernel
- **d = 2**: Quadratic features
- **d = 3+**: Higher-order interactions

### Choosing a Kernel

1. **Start with RBF**: Works well for most problems
2. **Try Linear**: If you have many features or need speed
3. **Try Polynomial**: If you suspect polynomial relationships
4. **Use Cross-Validation**: Compare performance

## Hyperparameters

### C (Regularization)

- **Range**: 0.01 to 100 (typically)
- **Small C**: More regularization, wider margin
- **Large C**: Less regularization, narrower margin
- **Tuning**: Use cross-validation

### Gamma (RBF/Polynomial)

- **Range**: 0.001 to 10 (typically)
- **Small γ**: Smooth boundary, far-reaching influence
- **Large γ**: Complex boundary, local influence
- **Default**: 'scale' = 1 / (n_features × X.var())
- **Tuning**: Use cross-validation

### Degree (Polynomial)

- **Range**: 2 to 5 (typically)
- **Higher degree**: More complex, slower
- **Tuning**: Start with 2 or 3

## Advantages of SVM

1. **Effective in High Dimensions**: Works well even when n_features > n_samples
2. **Memory Efficient**: Only uses support vectors
3. **Versatile**: Different kernels for different data
4. **Robust**: Maximum margin provides good generalization
5. **Theoretically Sound**: Strong mathematical foundations
6. **Works with Small Datasets**: Doesn't require massive amounts of data

## Limitations of SVM

1. **Slow Training**: O(n²) to O(n³) for large datasets
2. **Kernel Choice**: Requires selecting appropriate kernel
3. **Hyperparameter Tuning**: C and gamma need careful tuning
4. **No Probability Estimates**: Doesn't naturally output probabilities (can be added)
5. **Sensitive to Feature Scaling**: Requires normalization/standardization
6. **Black Box with Kernels**: Non-linear kernels are less interpretable
7. **Memory for Large Datasets**: Kernel matrix can be huge

## Feature Scaling: Critical for SVM

SVM is **extremely sensitive** to feature scales because it uses distances in the kernel functions.

### Why Scaling Matters

Without scaling:
- Features with larger ranges dominate
- The margin and support vectors are distorted
- Performance degrades significantly

### Scaling Methods

**Standardization (Recommended):**
```
x_scaled = (x - mean) / std
```

**Normalization:**
```
x_scaled = (x - min) / (max - min)
```

**Always scale features before training SVM!**

## Multi-class Classification

SVM is inherently binary. For multi-class problems, use:

### One-vs-Rest (OvR)

- Train n binary classifiers (one per class)
- Each classifier: "class i vs. all others"
- Predict: Choose class with highest confidence

### One-vs-One (OvO)

- Train n(n-1)/2 binary classifiers (one per pair)
- Each classifier: "class i vs. class j"
- Predict: Majority voting

**Most libraries handle this automatically.**

## SVM for Regression (SVR)

SVM can also be used for regression:

- **Goal**: Fit data within an ε-tube
- **Support Vectors**: Points outside the tube
- **Applications**: Time series, function approximation

## Real-World Applications

SVM is used in many domains:

- **Text Classification**: Spam detection, sentiment analysis
- **Image Recognition**: Face detection, object classification
- **Bioinformatics**: Protein classification, gene expression
- **Handwriting Recognition**: Digit and character recognition
- **Medical Diagnosis**: Disease classification from symptoms
- **Financial Forecasting**: Stock market prediction

## When to Use SVM

SVM works best when:

- You have small to medium-sized datasets
- You need high accuracy
- Data is high-dimensional (many features)
- You have non-linear relationships (use kernels)
- You want a theoretically sound approach
- You can afford training time

## When NOT to Use SVM

Avoid SVM when:

- You have very large datasets (millions of samples)
- Training time is critical
- You need probability estimates (use logistic regression)
- You need an interpretable model (use decision trees)
- Features are on very different scales and can't be normalized

## Comparison with Other Algorithms

### SVM vs. Logistic Regression
- **SVM**: Maximum margin, works with kernels, slower
- **Logistic Regression**: Probabilistic, faster, linear only

### SVM vs. KNN
- **SVM**: Learns decision boundary, fast prediction, slow training
- **KNN**: Instance-based, slow prediction, no training

### SVM vs. Decision Trees
- **SVM**: Smooth boundaries, requires scaling, powerful with kernels
- **Decision Trees**: Axis-aligned, no scaling needed, interpretable

### SVM vs. Neural Networks
- **SVM**: Convex optimization, fewer hyperparameters, smaller data
- **Neural Networks**: Non-convex, many hyperparameters, needs more data

## Tips for Better Results

1. **Scale Features**: Always standardize or normalize
2. **Start with RBF**: Good default kernel choice
3. **Tune C and Gamma**: Use grid search with cross-validation
4. **Try Linear First**: Faster and may work well
5. **Check for Overfitting**: Compare training and validation accuracy
6. **Use Cross-Validation**: For hyperparameter selection
7. **Consider Class Imbalance**: Use class weights if needed
8. **Reduce Features**: Remove irrelevant features for speed

## Understanding the Decision Function

The decision function value indicates:

- **|f(x)| large**: High confidence (far from boundary)
- **|f(x)| small**: Low confidence (near boundary)
- **f(x) = 0**: On the decision boundary

This can be used for:
- Ranking predictions by confidence
- Identifying uncertain predictions
- Calibrating probabilities

## Summary

Support Vector Machines are powerful algorithms that:

- Find the maximum margin hyperplane for classification
- Use support vectors to define the decision boundary
- Handle non-linear data through kernel functions
- Balance margin width and classification errors via C
- Provide strong theoretical guarantees
- Work well in high-dimensional spaces

Understanding SVM provides deep insights into optimization, kernel methods, and the bias-variance tradeoff in machine learning.

## Next Steps

After mastering SVM, explore:

- **Kernel Methods**: Custom kernels for specific domains
- **Ensemble Methods**: Combining multiple SVMs
- **Deep Learning**: Neural networks for more complex patterns
- **Support Vector Regression**: SVM for continuous targets
- **Advanced Optimization**: Understanding the dual problem
