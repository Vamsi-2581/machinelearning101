# Polynomial Regression

## Introduction

While linear regression works well for linear relationships, many real-world phenomena follow curved patterns. Polynomial regression extends linear regression by transforming features into polynomial terms, allowing us to model non-linear relationships while still using the familiar linear regression framework.

The key insight is that we can fit curves by treating polynomial terms (x², x³, etc.) as additional features in a linear model.

## What You'll Learn

By the end of this module, you will:

- Understand how polynomial features capture non-linear relationships
- Learn to choose appropriate polynomial degrees
- Recognize overfitting and underfitting in polynomial models
- Apply feature normalization for polynomial regression
- Interpret polynomial regression curves and coefficients

## The Polynomial Model

### From Linear to Polynomial

A linear model with one feature:
```
y = w₁x + w₀
```

A polynomial model of degree 2:
```
y = w₂x² + w₁x + w₀
```

A polynomial model of degree d:
```
y = wₐxᵈ + ... + w₂x² + w₁x + w₀
```

### Feature Transformation

Polynomial regression works by creating new features from the original feature:

**Original feature**: x = [1, 2, 3, 4]

**Degree 2 features**: 
- x¹ = [1, 2, 3, 4]
- x² = [1, 4, 9, 16]

**Degree 3 features**:
- x¹ = [1, 2, 3, 4]
- x² = [1, 4, 9, 16]
- x³ = [1, 8, 27, 64]

Once we have these polynomial features, we apply standard linear regression!

## How It Works

### Step 1: Create Polynomial Features

Transform each input value x into a vector of polynomial terms:
```
x → [x, x², x³, ..., xᵈ]
```

### Step 2: Normalize Features (Recommended)

Polynomial features can have very different scales (x vs x¹⁰), so normalization is crucial:
```
x_normalized = (x - mean) / std_dev
```

### Step 3: Apply Linear Regression

Use gradient descent to find weights for each polynomial term, just like in linear regression.

### Step 4: Make Predictions

For a new input x:
1. Create polynomial features: [x, x², x³, ..., xᵈ]
2. Normalize using training statistics
3. Compute: y = w₁x + w₂x² + ... + wₐxᵈ + w₀

## Choosing the Polynomial Degree

The degree is the most important hyperparameter in polynomial regression.

### Degree Too Low (Underfitting)

- Model is too simple to capture the pattern
- High training error
- High test error
- Example: Using degree 1 (linear) for a quadratic relationship

### Degree Just Right

- Model captures the true pattern
- Low training error
- Low test error
- Generalizes well to new data

### Degree Too High (Overfitting)

- Model fits training data too closely, including noise
- Very low training error
- High test error
- Wiggly, unrealistic curve
- Example: Using degree 10 for a quadratic relationship

### Guidelines for Degree Selection

1. **Start simple**: Begin with degree 2 or 3
2. **Visualize**: Plot the fitted curve - does it look reasonable?
3. **Cross-validate**: Use validation data to check generalization
4. **Domain knowledge**: Consider the physics or theory behind your data
5. **Regularization**: Use Ridge or Lasso to control complexity

## The Bias-Variance Tradeoff

Polynomial regression perfectly illustrates the bias-variance tradeoff:

**Low Degree (High Bias, Low Variance)**:
- Underfits the data
- Consistent but inaccurate predictions
- Similar performance on training and test data

**High Degree (Low Bias, High Variance)**:
- Overfits the data
- Accurate on training data but poor on test data
- Predictions vary greatly with different training sets

**Optimal Degree (Balanced)**:
- Captures true pattern without overfitting
- Good performance on both training and test data

## Feature Normalization

Normalization is especially important for polynomial regression because polynomial features have vastly different scales.

### Why Normalize?

Without normalization:
- x = 10 → x² = 100 → x³ = 1000 → x¹⁰ = 10,000,000,000
- Gradient descent struggles with such different scales
- Numerical instability and slow convergence

With normalization:
- All features have similar scales (mean=0, std=1)
- Faster convergence
- More stable training
- Better numerical precision

### Z-Score Normalization

```
x_norm = (x - μ) / σ

where:
μ = mean of feature
σ = standard deviation of feature
```

## Performance Metrics

The same metrics from linear regression apply:

- **MSE**: Penalizes large errors heavily
- **RMSE**: Interpretable in original units
- **R² Score**: Proportion of variance explained (watch for overfitting!)
- **MAE**: Robust to outliers

For polynomial regression, also monitor:
- **Training vs Validation Error**: Large gap indicates overfitting
- **Curve Smoothness**: Excessive wiggling suggests overfitting

## Real-World Applications

Polynomial regression is used in:

- **Physics**: Modeling projectile motion, spring forces
- **Economics**: Modeling diminishing returns, growth curves
- **Biology**: Population growth, enzyme kinetics
- **Engineering**: Stress-strain relationships, calibration curves
- **Climate Science**: Temperature trends with seasonal patterns

## Advantages

- Models non-linear relationships
- Still uses linear regression framework
- Interpretable coefficients
- Fast training and prediction
- No need for complex algorithms

## Limitations

- Prone to overfitting with high degrees
- Extrapolation can be unreliable (curves can shoot off)
- Only models smooth, polynomial-like curves
- Requires careful degree selection
- Feature scaling is essential

## Tips for Better Results

1. **Always normalize features** when degree > 2
2. **Start with low degrees** (2-3) and increase if needed
3. **Use cross-validation** to select degree
4. **Visualize the fitted curve** to check reasonableness
5. **Consider regularization** (Ridge/Lasso) for high degrees
6. **Be cautious with extrapolation** beyond training data range
7. **Try other approaches** if polynomial doesn't fit well (splines, GAMs)

## Comparison with Other Approaches

**vs Linear Regression**:
- More flexible, can model curves
- More prone to overfitting
- Requires degree selection

**vs Splines**:
- Simpler, more interpretable
- Less flexible for complex shapes
- Global fit (splines are local)

**vs Neural Networks**:
- Much simpler and faster
- More interpretable
- Limited to polynomial shapes
- Better for small datasets

## Summary

Polynomial regression extends linear regression to model non-linear relationships by:
- Creating polynomial features from original features
- Applying linear regression to transformed features
- Carefully selecting the polynomial degree to balance bias and variance

The key challenge is choosing the right degree - too low and you underfit, too high and you overfit. Visualization, cross-validation, and domain knowledge are your best tools for finding the sweet spot.

## Next Steps

After mastering polynomial regression, explore:

- **Ridge Regression**: Add L2 regularization to control overfitting
- **Lasso Regression**: Add L1 regularization for feature selection
- **Elastic Net**: Combine Ridge and Lasso
- **Spline Regression**: More flexible piecewise polynomials
- **Generalized Additive Models (GAMs)**: Flexible non-parametric curves
