# Lasso Regression

## Introduction

Lasso (Least Absolute Shrinkage and Selection Operator) regression is a powerful regularization technique that not only prevents overfitting like Ridge regression, but also performs automatic feature selection by setting some coefficients to exactly zero. This makes Lasso particularly valuable when working with high-dimensional data where many features may be irrelevant.

## What You'll Learn

- Understand L1 regularization and automatic feature selection
- Learn how Lasso sets coefficients to exactly zero
- Compare Lasso with Ridge regression
- Apply Lasso for feature selection in high-dimensional data
- Interpret sparse models created by Lasso

## The Lasso Model

### Modified Loss Function

Lasso adds an L1 penalty to the loss function:

```
Loss = MSE + α × (sum of absolute coefficients)
Loss = (1/m) Σ(y - ŷ)² + α × Σ|w|
```

The key difference from Ridge is using absolute values (|w|) instead of squared values (w²).

## Feature Selection

Unlike Ridge, Lasso can set coefficients to exactly zero, effectively removing features from the model. This happens because the L1 penalty has "corners" at zero that encourage sparse solutions.

## When to Use Lasso

- When you suspect many features are irrelevant
- When you need interpretable models with fewer features
- For high-dimensional data (more features than samples)
- When you want automatic feature selection

## Lasso vs Ridge

| Aspect | Lasso (L1) | Ridge (L2) |
|--------|------------|------------|
| **Feature Selection** | Yes (sets coefficients to zero) | No (shrinks but keeps all) |
| **Sparsity** | Sparse models | Dense models |
| **Multicollinearity** | Picks one from correlated group | Shrinks all equally |
| **Interpretability** | High (fewer features) | Moderate |

## Summary

Lasso regression extends linear regression by adding an L1 penalty that both prevents overfitting and performs automatic feature selection, creating sparse, interpretable models.
