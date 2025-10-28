# Missing Value Imputation

## Introduction

Missing values are a common problem in real-world datasets. They can occur due to data collection errors, sensor failures, survey non-responses, or data corruption. Handling missing values properly is crucial for building accurate machine learning models.

## Why Missing Values Matter

Most machine learning algorithms cannot handle missing values directly. You must either:
1. Remove rows/columns with missing values (deletion)
2. Fill in missing values (imputation)
3. Use algorithms that handle missing values natively

Deletion can lead to significant data loss, especially when missing values are common. Imputation allows you to retain more data while filling in reasonable estimates.

## Imputation Strategies

![Missing Value Imputation Methods](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Imputation_methods_comparison.svg/500px-Imputation_methods_comparison.svg.png)
*Different strategies for handling missing values in datasets*

### Mean Imputation

Replace missing values with the mean (average) of the non-missing values in that feature.

**When to use:**
- For numerical features with roughly normal distribution
- When missing values are random (MCAR - Missing Completely At Random)
- Quick and simple approach

**Pros:**
- Easy to implement and understand
- Preserves the mean of the feature

**Cons:**
- Reduces variance in the data
- Can distort relationships between features
- Sensitive to outliers

### Median Imputation

Replace missing values with the median of the non-missing values.

**When to use:**
- For numerical features with skewed distributions
- When outliers are present
- More robust than mean imputation

**Pros:**
- Robust to outliers
- Better for skewed distributions
- Preserves the median

**Cons:**
- Still reduces variance
- May not preserve relationships

### Mode Imputation

![Missing Data Patterns](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Missing_data_patterns.svg/500px-Missing_data_patterns.svg.png)
*Different patterns of missing data in datasets*

Replace missing values with the most frequent value (mode).

**When to use:**
- For categorical features
- For discrete numerical features
- When the most common value is meaningful

**Pros:**
- Works for categorical data
- Simple and interpretable

**Cons:**
- Can introduce bias toward the most common value
- Not suitable for continuous features with many unique values

### Forward Fill

Replace missing values with the last observed value (carry forward).

**When to use:**
- For time series data
- When values change slowly over time
- When temporal ordering matters

**Pros:**
- Preserves temporal patterns
- Makes sense for slowly changing variables

**Cons:**
- Only works for ordered data
- Can propagate errors
- First values cannot be filled

## Types of Missing Data

![Types of Missing Data](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Missing_data_mechanisms.svg/500px-Missing_data_mechanisms.svg.png)
*MCAR, MAR, and MNAR missing data mechanisms*

Understanding why data is missing helps choose the right strategy:

1. **MCAR (Missing Completely At Random)**: Missing values are unrelated to any data
2. **MAR (Missing At Random)**: Missing values depend on observed data
3. **MNAR (Missing Not At Random)**: Missing values depend on unobserved data

## Best Practices

1. **Analyze the pattern** of missing values before choosing a strategy
2. **Consider the mechanism** that caused the missing values
3. **Use domain knowledge** to inform your imputation choice
4. **Evaluate impact** by comparing model performance with different strategies
5. **Document your approach** for reproducibility
6. **Consider advanced methods** like KNN imputation or multiple imputation for critical applications

## Interactive Exploration

Use the controls to:
- Generate datasets with different percentages of missing values
- Try different imputation methods
- Observe how each method affects the data distribution
- Compare original vs imputed data patterns
