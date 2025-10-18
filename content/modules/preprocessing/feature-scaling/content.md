# Feature Scaling

## Introduction

Feature scaling is a crucial preprocessing step in machine learning that transforms features to a similar scale. Many machine learning algorithms perform better or converge faster when features are on a similar scale.

## Why Feature Scaling Matters

Different features often have different units and ranges. For example:
- Age: 0-100 years
- Income: $0-$1,000,000
- Height: 0-250 cm

Without scaling, features with larger ranges can dominate the learning process, leading to poor model performance.

## Normalization (Min-Max Scaling)

Normalization scales features to a fixed range, typically [0, 1].

**Formula:** `(x - min) / (max - min)`

**When to use:**
- When you need bounded values
- For algorithms that don't assume any distribution (e.g., neural networks, KNN)
- When features have different units

**Pros:**
- Preserves the shape of the original distribution
- Bounded values are useful for some algorithms

**Cons:**
- Sensitive to outliers
- Doesn't center the data

## Standardization (Z-Score Normalization)

Standardization transforms features to have mean = 0 and standard deviation = 1.

**Formula:** `(x - mean) / std`

**When to use:**
- For algorithms that assume normally distributed data (e.g., linear regression, logistic regression)
- When you want to preserve outlier information
- For algorithms using distance metrics

**Pros:**
- Less sensitive to outliers than normalization
- Centers the data around zero
- Preserves outlier information

**Cons:**
- Doesn't produce bounded values
- Assumes features are normally distributed

## Key Takeaways

1. **Always scale your features** when using distance-based algorithms (KNN, SVM, neural networks)
2. **Choose the right method** based on your data distribution and algorithm requirements
3. **Fit on training data only** and apply the same transformation to test data
4. **Scale after splitting** your data to avoid data leakage

## Interactive Exploration

Use the controls to:
- Switch between normalization and standardization
- Adjust the number of samples and feature range
- Observe how each method transforms the data distribution
- Compare statistics before and after scaling
