# Ridge Regression

## Introduction

Ridge regression, also known as L2 regularization or Tikhonov regularization, is a technique that addresses one of the main limitations of standard linear regression: overfitting. By adding a penalty term to the loss function, Ridge regression shrinks the coefficients, making the model more robust and better at generalizing to new data.

Think of Ridge regression as adding a "cost" to having large coefficients, encouraging the model to find simpler solutions that work well on both training and test data.

## What You'll Learn

By the end of this module, you will:

- Understand L2 regularization and how it prevents overfitting
- Learn how the alpha parameter controls regularization strength
- Recognize when to use Ridge regression over standard linear regression
- Interpret the effect of regularization on model coefficients
- Apply Ridge regression to high-dimensional data

## The Problem: Overfitting

Standard linear regression can overfit when:
- You have many features relative to the number of samples
- Features are highly correlated (multicollinearity)
- The model fits noise in the training data

**Symptoms of overfitting**:
- Very low training error but high test error
- Large, unstable coefficients
- Poor generalization to new data

## The Ridge Solution: L2 Regularization

### Modified Loss Function

Ridge regression modifies the loss function by adding a penalty term:

```
Loss = MSE + α × (sum of squared coefficients)
Loss = (1/m) Σ(y - ŷ)² + α × Σw²
```

Where:
- **MSE**: Standard mean squared error (fit to data)
- **α** (alpha): Regularization strength parameter
- **Σw²**: Sum of squared weights (L2 penalty)

### How It Works

1. **Fit the data**: Minimize prediction errors (MSE term)
2. **Keep coefficients small**: Minimize the sum of squared weights (penalty term)
3. **Balance**: The alpha parameter controls the tradeoff

### The Shrinkage Effect

Ridge regression "shrinks" coefficients toward zero:
- Coefficients become smaller in magnitude
- No coefficient is exactly zero (unlike Lasso)
- All features remain in the model
- Model becomes more stable and generalizes better

## The Alpha Parameter

Alpha (α) is the key hyperparameter that controls regularization strength.

### Alpha = 0
- No regularization
- Equivalent to standard linear regression
- May overfit with many features

### Small Alpha (0.01 - 0.1)
- Light regularization
- Coefficients slightly shrunk
- Good when you have clean data and few features

### Medium Alpha (1 - 10)
- Moderate regularization
- Noticeable coefficient shrinkage
- Good default starting point

### Large Alpha (100+)
- Strong regularization
- Coefficients heavily shrunk toward zero
- May underfit if too large
- Model approaches predicting the mean

### Choosing Alpha

Methods for selecting alpha:
1. **Cross-validation**: Try different values and pick the one with best validation performance
2. **Grid search**: Test a range of values systematically
3. **Domain knowledge**: Consider the expected complexity of the relationship
4. **Regularization path**: Plot performance vs alpha to visualize the tradeoff

## Mathematical Details

### Gradient Descent with L2 Regularization

The gradient of the Ridge loss function includes the regularization term:

```
∂Loss/∂w = (1/m) Σ(ŷ - y)x + (α/m)w
```

Update rule:
```
w = w - learning_rate × [(1/m) Σ(ŷ - y)x + (α/m)w]
```

The additional term `(α/m)w` pulls weights toward zero.

### Closed-Form Solution

Ridge regression has a closed-form solution (unlike standard gradient descent):

```
w = (XᵀX + αI)⁻¹Xᵀy
```

Where:
- **X**: Feature matrix
- **y**: Target vector
- **I**: Identity matrix
- **α**: Regularization parameter

This solution is computationally efficient for small to medium datasets.

## Ridge vs Linear Regression

| Aspect | Linear Regression | Ridge Regression |
|--------|------------------|------------------|
| **Overfitting** | Prone to overfit | Resistant to overfit |
| **Coefficients** | Can be very large | Shrunk toward zero |
| **Multicollinearity** | Unstable | More stable |
| **Feature selection** | No | No (keeps all features) |
| **Interpretability** | High | Moderate |
| **Hyperparameters** | Learning rate, epochs | + Alpha |

## When to Use Ridge Regression

Ridge regression is ideal when:
- You have many features (high-dimensional data)
- Features are correlated (multicollinearity)
- Standard linear regression overfits
- You want to keep all features in the model
- You need stable, robust predictions

## Advantages

- **Prevents overfitting**: Regularization improves generalization
- **Handles multicollinearity**: Stabilizes coefficient estimates
- **Closed-form solution**: Fast computation for small datasets
- **Keeps all features**: Useful when all features are potentially relevant
- **Smooth regularization**: Gradual shrinkage of coefficients

## Limitations

- **Doesn't select features**: All features remain (use Lasso for feature selection)
- **Requires tuning**: Need to select alpha via cross-validation
- **Less interpretable**: Shrunk coefficients harder to interpret
- **Assumes linearity**: Still a linear model
- **Scaling sensitive**: Features should be normalized

## Comparison with Other Regularization Methods

### Ridge (L2) vs Lasso (L1)

**Ridge**:
- Shrinks coefficients smoothly
- Keeps all features
- Better when all features are relevant
- More stable with correlated features

**Lasso**:
- Can set coefficients exactly to zero
- Performs feature selection
- Better when many features are irrelevant
- Less stable with correlated features

### Elastic Net

Combines Ridge and Lasso:
```
Loss = MSE + α₁ × Σ|w| + α₂ × Σw²
```

- Gets benefits of both methods
- More flexible but requires tuning two parameters

## Feature Normalization

**Critical for Ridge regression**: Features must be on similar scales because the penalty term treats all coefficients equally.

Without normalization:
- Features with large scales dominate the penalty
- Regularization affects features unequally
- Results are scale-dependent

With normalization (z-score):
```
x_normalized = (x - mean) / std_dev
```

- All features contribute equally to the penalty
- Fair regularization across features
- Scale-independent results

## Real-World Applications

Ridge regression is widely used in:

- **Genomics**: Predicting traits from thousands of genes
- **Finance**: Portfolio optimization with many assets
- **Marketing**: Customer lifetime value with many features
- **Medical Research**: Disease prediction with correlated biomarkers
- **Text Analysis**: Document classification with large vocabularies
- **Image Processing**: Regression with pixel features

## Tips for Better Results

1. **Always normalize features** before applying Ridge
2. **Use cross-validation** to select alpha
3. **Try a range of alpha values** (e.g., 0.01, 0.1, 1, 10, 100)
4. **Plot regularization path** to understand coefficient behavior
5. **Compare with standard linear regression** to verify improvement
6. **Consider Elastic Net** if you also want feature selection
7. **Check for multicollinearity** in your features

## Interpreting Results

### Coefficient Magnitudes

- **Smaller coefficients**: More regularization
- **Similar-sized coefficients**: Features contribute more equally
- **Stable across runs**: Less sensitive to training data variations

### L2 Norm

The L2 norm (magnitude of weight vector) indicates regularization effect:
- **Large L2 norm**: Weak regularization (alpha too small)
- **Small L2 norm**: Strong regularization (alpha appropriate)
- **Very small L2 norm**: Over-regularization (alpha too large)

### Model Performance

- **Training error increases**: Regularization is working
- **Test error decreases**: Generalization improved
- **Both errors similar**: Good bias-variance balance

## Summary

Ridge regression extends linear regression by:
- Adding an L2 penalty term to the loss function
- Shrinking coefficients toward zero
- Preventing overfitting through regularization
- Improving generalization to new data

The key is choosing the right alpha value through cross-validation to balance fitting the training data and keeping coefficients small.

## Next Steps

After mastering Ridge regression, explore:

- **Lasso Regression**: L1 regularization for feature selection
- **Elastic Net**: Combining Ridge and Lasso
- **Cross-Validation**: Systematic hyperparameter tuning
- **Regularization Paths**: Visualizing coefficient behavior
- **Bayesian Ridge**: Probabilistic interpretation of regularization
