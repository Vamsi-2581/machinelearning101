# Linear Regression

## Introduction

Linear regression is one of the fundamental algorithms in machine learning and statistics. It's used to model the relationship between a dependent variable (what we want to predict) and one or more independent variables (the features we use to make predictions).

The beauty of linear regression lies in its simplicity and interpretability. Unlike complex "black box" models, you can easily understand how each feature contributes to the prediction.

## What You'll Learn

By the end of this module, you will:

- Understand how linear regression models relationships in data
- Learn how gradient descent optimizes model parameters
- Interpret key regression metrics (MSE, RMSE, R², MAE)
- Recognize the impact of learning rate on model training
- Visualize the relationship between data and the fitted line

## The Linear Model

### Simple Linear Regression

For the simplest case with one feature, the linear regression model is:

```
y = w₁x + w₀
```

Where:
- **y** is the predicted value (dependent variable)
- **x** is the input feature (independent variable)
- **w₁** is the weight or slope (how much y changes when x changes)
- **w₀** is the bias or intercept (the value of y when x = 0)

### Multiple Linear Regression

When we have multiple features, the model extends to:

```
y = w₁x₁ + w₂x₂ + ... + wₙxₙ + w₀
```

Each feature has its own weight that determines its contribution to the prediction.

## How It Works: Gradient Descent

Linear regression uses an optimization algorithm called **gradient descent** to find the best weights. Here's how it works:

### Step 1: Initialize Parameters

Start with random (or zero) values for all weights and the bias.

### Step 2: Make Predictions

For each data point, calculate the predicted value using the current weights:

```
ŷᵢ = w₁x₁ᵢ + w₂x₂ᵢ + ... + wₙxₙᵢ + w₀
```

### Step 3: Calculate Error

Measure how far off our predictions are using the **Mean Squared Error (MSE)**:

```
MSE = (1/m) Σ(yᵢ - ŷᵢ)²
```

Where m is the number of data points. We square the errors to:
- Make all errors positive
- Penalize larger errors more heavily

### Step 4: Compute Gradients

Calculate how much each weight should change to reduce the error. This involves computing the derivative of the loss function with respect to each parameter.

### Step 5: Update Parameters

Adjust the weights in the direction that reduces the error:

```
w₁ = w₁ - α × gradient_w₁
w₀ = w₀ - α × gradient_w₀
```

Where **α** (alpha) is the **learning rate** - a hyperparameter that controls how big each step is.

### Step 6: Repeat

Continue steps 2-5 for a specified number of **epochs** (iterations through the entire dataset) or until the model converges.

## Key Hyperparameters

### Learning Rate (α)

The learning rate controls how quickly the model learns:

- **Too small**: Training will be very slow, requiring many epochs to converge
- **Too large**: The model may overshoot the optimal solution and fail to converge
- **Just right**: The model converges efficiently to a good solution

Typical values: 0.001 to 0.1

### Epochs

The number of times the algorithm processes the entire dataset:

- **Too few**: The model may not have learned the pattern fully (underfitting)
- **Too many**: Wastes computation time once the model has converged
- **Just right**: Enough iterations for the loss to stabilize

Typical values: 50 to 500 for simple problems

## Performance Metrics

### Mean Squared Error (MSE)

The average of squared differences between predictions and actual values:

```
MSE = (1/m) Σ(yᵢ - ŷᵢ)²
```

- **Lower is better** (0 is perfect)
- Sensitive to outliers due to squaring
- Units are squared (e.g., if predicting price in dollars, MSE is in dollars²)

### Root Mean Squared Error (RMSE)

The square root of MSE:

```
RMSE = √MSE
```

- **Lower is better** (0 is perfect)
- Same units as the target variable
- More interpretable than MSE
- Still sensitive to outliers

### R² Score (Coefficient of Determination)

Measures the proportion of variance in the target variable explained by the model:

```
R² = 1 - (SS_residual / SS_total)
```

Where:
- SS_residual = Σ(yᵢ - ŷᵢ)² (sum of squared residuals)
- SS_total = Σ(yᵢ - ȳ)² (total sum of squares)

**Interpretation:**
- **R² = 1.0**: Perfect predictions
- **R² = 0.0**: Model is no better than predicting the mean
- **R² < 0.0**: Model is worse than predicting the mean
- **R² = 0.7**: Model explains 70% of the variance

### Mean Absolute Error (MAE)

The average of absolute differences between predictions and actual values:

```
MAE = (1/m) Σ|yᵢ - ŷᵢ|
```

- **Lower is better** (0 is perfect)
- Same units as the target variable
- Less sensitive to outliers than MSE/RMSE
- All errors weighted equally

## Assumptions of Linear Regression

For linear regression to work well, several assumptions should hold:

1. **Linearity**: The relationship between features and target is linear
2. **Independence**: Observations are independent of each other
3. **Homoscedasticity**: The variance of errors is constant across all levels of features
4. **Normality**: The residuals (errors) are normally distributed
5. **No multicollinearity**: Features are not highly correlated with each other (for multiple regression)

## When to Use Linear Regression

Linear regression is ideal when:

- You need an interpretable model
- The relationship between features and target is approximately linear
- You want to understand feature importance
- You need fast training and prediction
- You have continuous numerical targets

## Limitations

Linear regression may not work well when:

- The relationship is highly non-linear
- There are complex interactions between features
- The data has many outliers
- Features have very different scales (solution: normalize/standardize)
- There's significant multicollinearity

## Tips for Better Results

1. **Feature Scaling**: Normalize or standardize features to similar ranges
2. **Feature Engineering**: Create polynomial features for non-linear relationships
3. **Outlier Handling**: Remove or transform extreme outliers
4. **Regularization**: Use Ridge (L2) or Lasso (L1) regression to prevent overfitting
5. **Cross-Validation**: Validate performance on unseen data

## Real-World Applications

Linear regression is used in many domains:

- **Economics**: Predicting GDP, inflation, stock prices
- **Healthcare**: Modeling disease progression, drug dosage
- **Marketing**: Sales forecasting, customer lifetime value
- **Real Estate**: House price prediction
- **Climate Science**: Temperature trends, sea level rise
- **Sports**: Player performance prediction

## Summary

Linear regression is a powerful yet simple algorithm that:

- Models linear relationships between features and targets
- Uses gradient descent to optimize parameters
- Provides interpretable coefficients
- Serves as a foundation for more complex algorithms

Understanding linear regression is essential for any machine learning practitioner, as it introduces key concepts like loss functions, optimization, and model evaluation that apply to more advanced algorithms.

## Next Steps

After mastering linear regression, you can explore:

- **Polynomial Regression**: Fitting non-linear relationships
- **Regularized Regression**: Ridge and Lasso for preventing overfitting
- **Logistic Regression**: Classification using a similar approach
- **Multiple Regression**: Working with many features
- **Time Series Regression**: Predicting sequential data
