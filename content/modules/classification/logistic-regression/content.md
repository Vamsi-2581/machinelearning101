# Logistic Regression

## Introduction

Despite its name, logistic regression is a **classification** algorithm, not a regression algorithm. It's one of the most fundamental and widely-used algorithms for binary classification problems - situations where we need to predict one of two possible outcomes.

The key innovation of logistic regression is the **sigmoid function**, which transforms a linear combination of features into a probability between 0 and 1. This makes it perfect for answering yes/no questions: Will a customer buy? Is this email spam? Will a patient develop a disease?

## What You'll Learn

By the end of this module, you will:

- Understand how the sigmoid function maps predictions to probabilities
- Learn how binary cross-entropy loss guides the learning process
- Interpret classification metrics (accuracy, precision, recall, F1 score)
- Visualize decision boundaries that separate classes
- Recognize the impact of learning rate and regularization on model performance

## The Logistic Model

### From Linear to Logistic

Linear regression predicts continuous values:
```
y = w₁x₁ + w₂x₂ + ... + wₙxₙ + w₀
```

But for classification, we need probabilities (values between 0 and 1). Logistic regression applies the **sigmoid function** to the linear combination:

```
P(y=1|x) = σ(w₁x₁ + w₂x₂ + ... + wₙxₙ + w₀)
```

Where σ is the sigmoid function.

### The Sigmoid Function

![Sigmoid Function](https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Logistic-curve.svg/500px-Logistic-curve.svg.png)
*The sigmoid function maps any real number to a value between 0 and 1*

The sigmoid function is defined as:

```
σ(z) = 1 / (1 + e⁻ᶻ)
```

**Key Properties:**
- **Output range**: Always between 0 and 1
- **S-shaped curve**: Smooth transition from 0 to 1
- **Midpoint**: σ(0) = 0.5
- **Asymptotes**: As z → ∞, σ(z) → 1; as z → -∞, σ(z) → 0

This makes it perfect for representing probabilities!

### Making Predictions

Once we have the probability, we classify using a threshold (typically 0.5):

```
Predicted class = {
  1  if P(y=1|x) ≥ 0.5
  0  if P(y=1|x) < 0.5
}
```

## How It Works: Gradient Descent with Binary Cross-Entropy

![Logistic Regression Decision Boundary](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Exam_pass_logistic_curve.svg/500px-Exam_pass_logistic_curve.svg.png)
*Logistic regression creates a smooth decision boundary between classes*

### Step 1: Initialize Parameters

Start with random (or zero) values for all weights and the bias.

### Step 2: Compute Probabilities

For each data point, calculate the probability of belonging to class 1:

```
pᵢ = σ(w₁x₁ᵢ + w₂x₂ᵢ + ... + wₙxₙᵢ + w₀)
```

### Step 3: Calculate Loss

Use **binary cross-entropy loss** to measure prediction quality:

```
Loss = -(1/m) Σ[yᵢ·log(pᵢ) + (1-yᵢ)·log(1-pᵢ)]
```

Where:
- **m** is the number of data points
- **yᵢ** is the true label (0 or 1)
- **pᵢ** is the predicted probability

**Why this loss function?**
- When yᵢ = 1: Loss = -log(pᵢ), so we want pᵢ close to 1
- When yᵢ = 0: Loss = -log(1-pᵢ), so we want pᵢ close to 0
- The logarithm heavily penalizes confident wrong predictions

### Step 4: Compute Gradients

Calculate how much each weight should change to reduce the loss. The gradient for logistic regression is:

```
∂Loss/∂wⱼ = (1/m) Σ(pᵢ - yᵢ)·xⱼᵢ
```

Notice this looks similar to linear regression, but pᵢ is now a probability from the sigmoid function!

### Step 5: Update Parameters

Adjust the weights to reduce the loss:

```
wⱼ = wⱼ - α × ∂Loss/∂wⱼ
w₀ = w₀ - α × ∂Loss/∂w₀
```

Where **α** is the learning rate.

### Step 6: Repeat

Continue until convergence or for a specified number of epochs.

## Key Hyperparameters

![Binary Cross-Entropy Loss](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Logistic_cost_function.png/500px-Logistic_cost_function.png)
*Binary cross-entropy loss function for logistic regression*

### Learning Rate (α)

Controls how quickly the model learns:

- **Too small**: Slow convergence, many epochs needed
- **Too large**: May overshoot and fail to converge
- **Just right**: Efficient convergence to good solution

For logistic regression, typical values are often higher than linear regression (0.01 to 1.0) because the sigmoid function naturally bounds the outputs.

### Epochs

Number of complete passes through the training data:

- **Too few**: Model hasn't learned the pattern (underfitting)
- **Too many**: Wastes computation after convergence
- **Just right**: Loss and accuracy stabilize

### Regularization (λ)

Prevents overfitting by penalizing large weights:

```
Loss = Binary Cross-Entropy + (λ/2m) Σwⱼ²
```

- **λ = 0**: No regularization, may overfit
- **Small λ**: Slight penalty on complexity
- **Large λ**: Strong penalty, simpler model, may underfit

Common values: 0 to 1.0

## Decision Boundaries

The **decision boundary** is where the model switches from predicting class 0 to class 1. It occurs where:

```
P(y=1|x) = 0.5
```

Which means:
```
w₁x₁ + w₂x₂ + ... + wₙxₙ + w₀ = 0
```

**For 2D data (two features):**
- The decision boundary is a straight line
- Points on one side are classified as class 0
- Points on the other side are classified as class 1

**Properties:**
- Linear decision boundary (straight line/plane/hyperplane)
- Can't capture complex non-linear patterns without feature engineering
- Position and orientation determined by learned weights

## Classification Metrics

Unlike regression, we can't use MSE or RMSE. Instead, we use classification-specific metrics:

### Confusion Matrix

A table showing prediction outcomes:

```
                Predicted
                0       1
Actual  0      TN      FP
        1      FN      TP
```

Where:
- **TP (True Positive)**: Correctly predicted class 1
- **TN (True Negative)**: Correctly predicted class 0
- **FP (False Positive)**: Incorrectly predicted class 1 (Type I error)
- **FN (False Negative)**: Incorrectly predicted class 0 (Type II error)

### Accuracy

Proportion of correct predictions:

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**Interpretation:**
- **Range**: 0 to 1 (or 0% to 100%)
- **Higher is better**
- **Limitation**: Can be misleading with imbalanced classes

**Example:** If 95% of emails are not spam, a model that always predicts "not spam" has 95% accuracy but is useless!

### Precision

Of all positive predictions, how many were actually positive?

```
Precision = TP / (TP + FP)
```

**When to prioritize:**
- When false positives are costly
- Example: Medical diagnosis - don't want to tell healthy people they're sick

### Recall (Sensitivity)

Of all actual positives, how many did we correctly identify?

```
Recall = TP / (TP + FN)
```

**When to prioritize:**
- When false negatives are costly
- Example: Disease screening - don't want to miss sick people

### F1 Score

Harmonic mean of precision and recall:

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Why harmonic mean?**
- Balances precision and recall
- Penalizes extreme values
- Only high if both precision and recall are high

**Interpretation:**
- **Range**: 0 to 1
- **1.0**: Perfect precision and recall
- **Low**: Poor performance on at least one metric

## The Precision-Recall Tradeoff

There's often a tradeoff between precision and recall:

- **High threshold (e.g., 0.8)**: Predict class 1 only when very confident
  - Higher precision (fewer false positives)
  - Lower recall (more false negatives)

- **Low threshold (e.g., 0.3)**: Predict class 1 more liberally
  - Lower precision (more false positives)
  - Higher recall (fewer false negatives)

The F1 score helps balance these competing objectives.

## Assumptions and Requirements

For logistic regression to work well:

1. **Binary outcome**: Target must be 0 or 1 (can be extended to multi-class)
2. **Independent observations**: Data points should be independent
3. **Linear decision boundary**: Classes should be approximately linearly separable
4. **No multicollinearity**: Features shouldn't be highly correlated
5. **Large sample size**: More data generally improves performance

## When to Use Logistic Regression

Logistic regression is ideal when:

- You have a binary classification problem
- You need an interpretable model
- You want to understand feature importance
- Classes are approximately linearly separable
- You need probability estimates, not just class labels
- You want fast training and prediction

## Limitations

Logistic regression may not work well when:

- Classes are not linearly separable
- There are complex non-linear relationships
- You have many irrelevant features
- Classes are highly imbalanced (without adjustments)
- You need to capture feature interactions (without engineering them)

## Tips for Better Results

1. **Feature Scaling**: Normalize or standardize features for faster convergence
2. **Feature Engineering**: Create polynomial or interaction features for non-linear boundaries
3. **Handle Imbalance**: Use class weights or resampling for imbalanced datasets
4. **Regularization**: Use L2 regularization to prevent overfitting
5. **Threshold Tuning**: Adjust the classification threshold based on your precision/recall needs
6. **Cross-Validation**: Validate performance on unseen data

## Real-World Applications

Logistic regression is used extensively in:

- **Healthcare**: Disease diagnosis, patient risk assessment
- **Finance**: Credit scoring, fraud detection, default prediction
- **Marketing**: Customer churn prediction, conversion optimization
- **Email**: Spam detection
- **E-commerce**: Purchase prediction, recommendation systems
- **HR**: Employee attrition prediction
- **Insurance**: Claim likelihood, risk assessment

## Comparison with Linear Regression

| Aspect | Linear Regression | Logistic Regression |
|--------|------------------|---------------------|
| **Task** | Regression (continuous) | Classification (binary) |
| **Output** | Any real number | Probability (0 to 1) |
| **Activation** | None (identity) | Sigmoid |
| **Loss Function** | Mean Squared Error | Binary Cross-Entropy |
| **Metrics** | MSE, RMSE, R² | Accuracy, Precision, Recall, F1 |
| **Decision Boundary** | N/A | Linear hyperplane |

## Extensions

### Multi-class Classification

Logistic regression can be extended to multiple classes using:

- **One-vs-Rest (OvR)**: Train one classifier per class
- **Softmax Regression**: Generalization using softmax function

### Regularization Variants

- **Ridge (L2)**: Penalizes sum of squared weights
- **Lasso (L1)**: Penalizes sum of absolute weights, can zero out features
- **Elastic Net**: Combination of L1 and L2

## Summary

Logistic regression is a powerful classification algorithm that:

- Uses the sigmoid function to predict probabilities
- Optimizes binary cross-entropy loss with gradient descent
- Provides interpretable linear decision boundaries
- Serves as a foundation for neural networks (it's essentially a single-layer neural network!)

Understanding logistic regression is crucial because:
- It introduces key classification concepts
- It's the building block for neural networks
- It's widely used in industry for interpretable classification
- The concepts extend to more complex algorithms

## Next Steps

After mastering logistic regression, you can explore:

- **Multi-class Classification**: Softmax regression for more than two classes
- **Support Vector Machines (SVM)**: More sophisticated decision boundaries
- **Decision Trees**: Non-linear, interpretable classification
- **Neural Networks**: Stacking multiple logistic regression units
- **Ensemble Methods**: Combining multiple classifiers for better performance
