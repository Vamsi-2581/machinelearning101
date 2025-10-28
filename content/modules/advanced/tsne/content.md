# t-SNE: t-Distributed Stochastic Neighbor Embedding

## Introduction

t-SNE (t-Distributed Stochastic Neighbor Embedding) is a machine learning algorithm for visualization developed by Laurens van der Maaten and Geoffrey Hinton. It's particularly well-suited for visualizing high-dimensional data by reducing it to 2 or 3 dimensions while preserving local structure.

## Why t-SNE?

![t-SNE Visualization Example](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/T-SNE_Embedding_of_MNIST.png/500px-T-SNE_Embedding_of_MNIST.png)
*t-SNE visualization of high-dimensional MNIST digit data in 2D*

### Limitations of Linear Methods

PCA and other linear methods have limitations:
- Only capture linear relationships
- May not reveal complex cluster structures
- Global structure preservation can obscure local patterns

### t-SNE's Strengths

t-SNE excels at:
- **Revealing clusters**: Makes groups visually distinct
- **Preserving local structure**: Keeps similar points together
- **Non-linear relationships**: Captures complex manifold structures
- **Visualization**: Creates beautiful, interpretable 2D/3D plots

## The Algorithm in Detail

### Step 1: High-Dimensional Similarities

For each pair of points, compute similarity using Gaussian distribution:

```
p(j|i) = exp(-||x_i - x_j||² / 2σ_i²) / Σ_k exp(-||x_i - x_k||² / 2σ_i²)
```

The variance σ_i is chosen based on perplexity.

### Step 2: Symmetrize Probabilities

Create symmetric joint probabilities:

```
p_ij = (p(j|i) + p(i|j)) / 2n
```

### Step 3: Low-Dimensional Similarities

In the embedding space, use Student t-distribution (heavy-tailed):

```
q_ij = (1 + ||y_i - y_j||²)^(-1) / Σ_k≠l (1 + ||y_k - y_l||²)^(-1)
```

### Step 4: Minimize KL Divergence

Adjust positions to minimize:

```
KL(P||Q) = Σ_i Σ_j p_ij log(p_ij / q_ij)
```

Using gradient descent with momentum.

## Understanding Perplexity

![t-SNE Perplexity Effect](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/T-SNE_Embedding_of_MNIST.png/500px-T-SNE_Embedding_of_MNIST.png)
*Different perplexity values create different cluster structures*

Perplexity is the most important hyperparameter in t-SNE.

### What is Perplexity?

Perplexity can be interpreted as:
- A smooth measure of effective number of neighbors
- Balance between local and global structure
- Typically set between 5 and 50

### Effects of Different Perplexities

**Low Perplexity (5-15)**
- Focuses on very local structure
- May fragment data into many small clusters
- Good for finding fine-grained patterns
- Risk of over-fragmenting

**Medium Perplexity (30-50)**
- Balanced view of structure
- Most commonly used
- Good default choice
- Captures both local and some global structure

**High Perplexity (50-100)**
- Emphasizes global structure
- May merge distinct clusters
- Closer to PCA-like behavior
- Requires more data points

### Choosing Perplexity

Rules of thumb:
- Start with 30 (default)
- Try range: 5, 10, 30, 50
- Perplexity should be less than number of points
- Larger datasets can use higher perplexity
- Look for consistent patterns across values

## Interpreting t-SNE Plots

### What You CAN Interpret

✅ **Cluster presence**: Distinct groups indicate similar points
✅ **Local relationships**: Nearby points are similar
✅ **Relative cluster density**: Tighter clusters are more similar internally

### What You CANNOT Interpret

❌ **Distances between clusters**: Not meaningful
❌ **Cluster sizes**: Visual size doesn't indicate importance
❌ **Axes**: No inherent meaning (unlike PCA)
❌ **Global structure**: Overall shape may be arbitrary

### Common Misinterpretations

**Mistake 1: Comparing cluster distances**
- Distance between clusters is not meaningful
- Two clusters far apart may be just as related as close ones

**Mistake 2: Interpreting cluster sizes**
- Large visual clusters don't mean more important
- Size depends on local density and perplexity

**Mistake 3: Over-interpreting single runs**
- t-SNE is stochastic (random initialization)
- Different runs give different embeddings
- Always run multiple times

**Mistake 4: Assuming axes have meaning**
- Unlike PCA, axes don't represent anything
- Rotation/reflection doesn't change interpretation

## Best Practices

![t-SNE vs PCA Comparison](https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/MNIST-t-SNE-PCA.png/500px-MNIST-t-SNE-PCA.png)
*Comparison of t-SNE and PCA on the same dataset*

### 1. Preprocessing

- **Standardize features**: Ensure equal scales
- **Remove outliers**: Can distort embedding
- **PCA first**: For very high dimensions (>50), reduce to ~50 with PCA
- **Sample large datasets**: t-SNE is slow for >10,000 points

### 2. Parameter Tuning

- **Try multiple perplexities**: 5, 10, 30, 50
- **Sufficient iterations**: At least 1000, often 2000-5000
- **Learning rate**: Typically 10-1000, adjust if unstable
- **Check convergence**: Cost should stabilize

### 3. Validation

- **Multiple runs**: Check consistency across random seeds
- **Compare with PCA**: Understand what's different
- **Domain knowledge**: Do clusters make sense?
- **Quantitative validation**: Use clustering metrics if labels available

### 4. Reporting

- **State parameters**: Always report perplexity, iterations, learning rate
- **Show multiple perplexities**: Demonstrate robustness
- **Explain limitations**: Acknowledge what plot doesn't show
- **Provide context**: Explain what clusters might represent

## When to Use t-SNE

### Good Use Cases

✅ **Exploratory visualization**: Initial data exploration
✅ **Cluster discovery**: Finding groups in unlabeled data
✅ **Quality control**: Identifying outliers or batch effects
✅ **Presentation**: Creating compelling visualizations
✅ **High-dimensional data**: Images, text embeddings, gene expression

### When NOT to Use t-SNE

❌ **Quantitative analysis**: Use proper clustering algorithms
❌ **Feature extraction**: Use PCA or autoencoders
❌ **New data projection**: t-SNE doesn't support transform
❌ **Preserving distances**: Use MDS or PCA
❌ **Very large datasets**: Consider UMAP or sampling

## Alternatives to t-SNE

### UMAP (Uniform Manifold Approximation and Projection)
- Faster than t-SNE
- Better preserves global structure
- Supports transform on new data
- Becoming increasingly popular

### PCA
- Linear, fast, deterministic
- Preserves global structure
- Interpretable components
- Good first step

### MDS (Multidimensional Scaling)
- Preserves pairwise distances
- Deterministic
- Slower than PCA
- Better for distance preservation

## Common Issues and Solutions

### Issue: Clusters look different each run
**Solution**: This is normal! Run multiple times and look for consistent patterns.

### Issue: All points in one blob
**Solution**: Increase perplexity or iterations, check if data actually has structure.

### Issue: Too many tiny clusters
**Solution**: Increase perplexity to see more global structure.

### Issue: Very slow computation
**Solution**: Reduce data size, use PCA preprocessing, or try UMAP.

### Issue: Cost not decreasing
**Solution**: Adjust learning rate (try 10-1000), increase iterations.

## Mathematical Intuition

### Why Student t-Distribution?

The Student t-distribution has heavier tails than Gaussian:
- Allows moderate distances in high-D to become larger in low-D
- Prevents "crowding problem"
- Creates clearer cluster separation

### Why KL Divergence?

KL divergence measures how well Q matches P:
- Asymmetric: Penalizes more for mapping similar points far apart
- Focuses on preserving local structure
- Allows dissimilar points to be mapped anywhere

## Summary

t-SNE is a powerful tool for visualizing high-dimensional data:

**Strengths:**
- Reveals cluster structure beautifully
- Preserves local relationships
- Handles non-linear structure
- Creates interpretable visualizations

**Limitations:**
- Computationally expensive
- Stochastic (different runs differ)
- Doesn't preserve global structure
- Can't transform new data

**Key Takeaway:** t-SNE is excellent for exploration and visualization, but understand its limitations and always validate findings with other methods.
