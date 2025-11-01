# Spectral Clustering

## Introduction

Spectral Clustering is a sophisticated graph-based clustering algorithm that can discover clusters with complex, non-convex shapes that traditional methods like K-Means cannot handle. Instead of working directly in the original data space, spectral clustering transforms the data into a "spectral embedding" using eigenvalue decomposition, where clusters become more separable.

The algorithm treats data points as nodes in a graph, with edges representing similarities between points. By analyzing the spectral properties (eigenvalues and eigenvectors) of this graph, it can identify natural cluster boundaries even when clusters have irregular shapes or are intertwined.

## What You'll Learn

By the end of this module, you will:

- Understand graph-based clustering approaches
- Learn eigenvalue decomposition for clustering
- Master affinity matrix construction
- Discover Laplacian matrix properties
- Understand spectral embedding concepts
- Learn to handle non-convex cluster shapes

## Graph-Based Clustering

### From Data to Graphs

Spectral clustering views clustering as a **graph partitioning** problem:

1. **Nodes**: Each data point becomes a node in the graph
2. **Edges**: Similarities between points become weighted edges
3. **Clusters**: Dense subgraphs with sparse connections between them

### Why Graph-Based?

Traditional clustering methods assume:
- **Spherical clusters** (K-Means)
- **Density-based regions** (DBSCAN)
- **Gaussian distributions** (GMM)

Graph-based methods can handle:
- **Arbitrary shapes**: Crescents, spirals, intertwined clusters
- **Varying densities**: Different cluster densities
- **Complex boundaries**: Non-linear cluster separations

## The Spectral Clustering Algorithm

### Overview

1. **Build similarity graph**: Create affinity matrix from data
2. **Compute Laplacian**: Derive graph Laplacian matrix
3. **Eigendecomposition**: Find smallest eigenvalues/eigenvectors
4. **Spectral embedding**: Use eigenvectors as new feature space
5. **Final clustering**: Apply K-Means in embedding space

### Step 1: Affinity Matrix Construction

The **affinity matrix** A captures pairwise similarities between data points.

#### RBF (Gaussian) Kernel
```
A_ij = exp(-γ ||x_i - x_j||²)
```

**Properties**:
- **Range**: [0, 1]
- **Interpretation**: Higher values = more similar points
- **Parameter γ**: Controls locality (higher γ = more local)

#### k-Nearest Neighbors
```
A_ij = exp(-||x_i - x_j||² / 2σ²) if x_j ∈ kNN(x_i)
A_ij = 0 otherwise
```

**Properties**:
- **Sparse**: Only k neighbors per point have non-zero similarity
- **Local**: Focuses on local neighborhood structure
- **Parameter k**: Number of neighbors to consider

#### Polynomial Kernel
```
A_ij = (γ ⟨x_i, x_j⟩ + 1)^d
```

**Properties**:
- **Global**: All pairs have non-zero similarity
- **Parameters**: γ (scale), d (degree)
- **Use case**: When linear relationships are important

### Step 2: Graph Laplacian

The **Laplacian matrix** L captures the graph structure and is key to spectral analysis.

#### Degree Matrix
```
D_ii = Σ_j A_ij (sum of similarities for point i)
D_ij = 0 for i ≠ j
```

#### Unnormalized Laplacian
```
L = D - A
```

**Properties**:
- **Positive semi-definite**: All eigenvalues ≥ 0
- **Smallest eigenvalue**: Always 0
- **Connected components**: Number of 0 eigenvalues = number of connected components

#### Random Walk Laplacian
```
L_rw = D^(-1)L = I - D^(-1)A
```

**Properties**:
- **Normalized**: Accounts for varying node degrees
- **Interpretation**: Random walk transition probabilities
- **Preferred**: Often works better than unnormalized

#### Symmetric Laplacian
```
L_sym = D^(-1/2)LD^(-1/2) = I - D^(-1/2)AD^(-1/2)
```

**Properties**:
- **Symmetric**: Real eigenvalues, orthogonal eigenvectors
- **Normalized**: Similar to random walk but symmetric
- **Mathematical**: Easier theoretical analysis

### Step 3: Eigendecomposition

Find the **k smallest eigenvalues** and their corresponding **eigenvectors** of the Laplacian matrix.

#### Why Smallest Eigenvalues?

- **0 eigenvalue**: Corresponds to connected components
- **Small eigenvalues**: Correspond to "almost disconnected" components
- **Fiedler vector**: Second smallest eigenvector, reveals main partition

#### Spectral Gap

The **spectral gap** is the difference between the k-th and (k+1)-th eigenvalues:

```
gap = λ_{k+1} - λ_k
```

**Interpretation**:
- **Large gap**: Clear separation into k clusters
- **Small gap**: Ambiguous cluster boundaries
- **Model selection**: Choose k where gap is largest

### Step 4: Spectral Embedding

Create new feature representation using the k smallest eigenvectors:

```
Y = [v_1, v_2, ..., v_k] ∈ ℝ^{n×k}
```

Where v_i is the i-th smallest eigenvector.

#### Row Normalization (for symmetric Laplacian)

Normalize each row of Y to unit length:

```
Y_i ← Y_i / ||Y_i||
```

This ensures points lie on the unit sphere in the embedding space.

### Step 5: Final Clustering

Apply **K-Means clustering** to the rows of Y in the k-dimensional embedding space.

#### Why K-Means Works Here?

In the spectral embedding:
- **Clusters become convex**: Non-convex clusters in original space become separable
- **Similar distances**: Points in same cluster have similar embedding vectors
- **Spherical assumption**: More reasonable in embedding space

## Mathematical Foundation

### Graph Cut Perspective

Spectral clustering solves the **normalized cut** problem:

```
NCut(A, B) = Cut(A, B) / Vol(A) + Cut(A, B) / Vol(B)
```

Where:
- **Cut(A, B)**: Sum of edge weights between clusters A and B
- **Vol(A)**: Sum of all edge weights in cluster A

**Goal**: Minimize normalized cut to find balanced, well-separated clusters.

### Connection to Random Walks

The random walk Laplacian relates to **random walks** on the graph:

- **Transition matrix**: P = D^(-1)A
- **Stationary distribution**: Related to node degrees
- **Mixing time**: How quickly random walk converges
- **Clusters**: Regions where random walk gets "trapped"

### Cheeger's Inequality

Provides theoretical guarantee relating spectral gap to cluster quality:

```
λ_2 / 2 ≤ h_G ≤ √(2λ_2)
```

Where:
- **λ_2**: Second smallest eigenvalue (Fiedler value)
- **h_G**: Cheeger constant (measures bottleneck)

## Advantages of Spectral Clustering

### 1. Non-Convex Clusters

**Handles complex shapes**:
- Crescents and moons
- Spirals and rings
- Intertwined clusters
- Elongated clusters

### 2. Theoretical Foundation

**Well-grounded theory**:
- Graph theory connections
- Random walk interpretation
- Optimization guarantees
- Spectral graph theory

### 3. Flexible Similarity

**Various affinity functions**:
- RBF for local similarities
- k-NN for sparse graphs
- Custom kernels for domain-specific similarities

### 4. Automatic Preprocessing

**Built-in normalization**:
- Laplacian normalization handles varying densities
- Spectral embedding creates better feature space
- Less sensitive to scaling than K-Means

## Limitations of Spectral Clustering

### 1. Computational Complexity

**Expensive operations**:
- **Affinity matrix**: O(n²) space and time
- **Eigendecomposition**: O(n³) time for full decomposition
- **Memory**: Stores full n×n matrices

### 2. Parameter Selection

**Multiple parameters**:
- **k**: Number of clusters
- **γ or σ**: Kernel parameters
- **Affinity type**: RBF vs k-NN vs polynomial
- **Laplacian type**: Unnormalized vs normalized

### 3. Scalability Issues

**Large datasets**:
- **Memory**: n×n affinity matrix
- **Computation**: Eigendecomposition bottleneck
- **Approximations**: Needed for very large datasets

### 4. Out-of-Sample Problem

**No natural extension**:
- Cannot easily assign new points to clusters
- Requires recomputing entire eigendecomposition
- Workarounds: Nyström approximation, nearest neighbors

## Parameter Selection Guidelines

### Choosing k (Number of Clusters)

#### Spectral Gap Method
1. Compute eigenvalues λ₁ ≤ λ₂ ≤ ... ≤ λₙ
2. Look for largest gap: max(λᵢ₊₁ - λᵢ)
3. Choose k where gap occurs

#### Eigenvector Inspection
- Plot first few eigenvectors
- Look for clear structure
- Choose k based on visual inspection

### Choosing Affinity Parameters

#### RBF Kernel (γ parameter)
- **Too small**: All points similar, no structure
- **Too large**: Only nearest neighbors similar, fragmented
- **Heuristic**: γ = 1/(2σ²) where σ is median distance

#### k-NN Graph (k parameter)
- **Too small**: Disconnected components
- **Too large**: Dense graph, loses local structure
- **Heuristic**: k = log(n) or k = √n

### Choosing Laplacian Type

#### Random Walk Laplacian
- **Best for**: Varying cluster sizes
- **Handles**: Different node degrees well
- **Default choice**: Often works best

#### Symmetric Laplacian
- **Best for**: Theoretical analysis
- **Requires**: Row normalization
- **Use when**: Need symmetric matrices

#### Unnormalized Laplacian
- **Best for**: Equal cluster sizes
- **Simple**: No normalization needed
- **Use when**: Clusters have similar densities

## Applications

### 1. Image Segmentation

**Problem**: Segment images into regions
**Approach**: 
- Pixels as nodes
- Similarity based on color/texture/position
- Segments as clusters

**Advantages**:
- Handles irregular shapes
- Preserves boundaries
- Incorporates spatial information

### 2. Social Network Analysis

**Problem**: Find communities in networks
**Approach**:
- Users as nodes
- Connections as edges
- Communities as clusters

**Advantages**:
- Natural graph structure
- Handles overlapping communities
- Scales to large networks

### 3. Gene Expression Analysis

**Problem**: Group genes with similar expression
**Approach**:
- Genes as nodes
- Expression correlation as similarity
- Functional groups as clusters

**Advantages**:
- Handles non-linear relationships
- Robust to noise
- Discovers functional modules

### 4. Computer Vision

**Problem**: Object recognition and tracking
**Approach**:
- Features as nodes
- Similarity based on appearance/motion
- Objects as clusters

**Advantages**:
- Handles deformation
- Robust to occlusion
- Incorporates multiple cues

## Advanced Topics

### Scalable Spectral Clustering

#### Nyström Approximation
- Sample subset of points
- Approximate full eigendecomposition
- Reduces complexity to O(m³) where m << n

#### Random Sampling
- Randomly sample edges
- Approximate affinity matrix
- Trade accuracy for speed

#### Multi-level Approaches
- Coarsen graph iteratively
- Solve on coarse graph
- Project solution back

### Kernel Spectral Clustering

#### Kernel Trick
- Implicit mapping to high-dimensional space
- Compute similarities in feature space
- Handle non-linear relationships

#### Multiple Kernels
- Combine different similarity measures
- Learn optimal kernel combination
- Adapt to data characteristics

### Semi-Supervised Spectral Clustering

#### Constrained Clustering
- Incorporate must-link/cannot-link constraints
- Modify affinity matrix
- Guide clustering with partial labels

#### Label Propagation
- Use labeled points as seeds
- Propagate labels through graph
- Combine supervised and unsupervised information

## Implementation Tips

### 1. Preprocessing

**Data normalization**:
```python
# Standardize features
X = (X - X.mean(axis=0)) / X.std(axis=0)
```

**Dimensionality reduction**:
- Apply PCA before spectral clustering
- Reduces noise and computation
- Typically keep 50-100 dimensions

### 2. Affinity Matrix Construction

**Sparse representation**:
```python
# Use sparse matrices for k-NN graphs
from scipy.sparse import csr_matrix
A_sparse = csr_matrix(A)
```

**Parameter selection**:
```python
# Median distance heuristic for RBF
distances = pdist(X)
sigma = np.median(distances)
gamma = 1 / (2 * sigma**2)
```

### 3. Eigendecomposition

**Use specialized solvers**:
```python
# For sparse matrices
from scipy.sparse.linalg import eigsh
eigenvals, eigenvecs = eigsh(L, k=k, which='SM')
```

**Numerical stability**:
- Add small regularization to diagonal
- Check for numerical issues
- Use double precision if needed

### 4. Post-processing

**Handle disconnected components**:
- Check number of zero eigenvalues
- Each zero eigenvalue = one component
- May need to increase connectivity

**Embedding normalization**:
```python
# For symmetric Laplacian
Y_normalized = Y / np.linalg.norm(Y, axis=1, keepdims=True)
```

## Evaluation and Validation

### Internal Metrics

**Silhouette Score**: Adapted for spectral clustering
**Modularity**: For graph-based evaluation
**Conductance**: Measures cut quality

### External Metrics

**Adjusted Rand Index**: Similarity to ground truth
**Normalized Mutual Information**: Information-theoretic measure
**Fowlkes-Mallows Index**: Geometric mean of precision/recall

### Spectral-Specific Metrics

**Spectral gap**: Indicates cluster separability
**Eigenvalue ratios**: Stability of clustering
**Cut quality**: Normalized cut value

## Summary

Spectral Clustering is a powerful graph-based algorithm that:

- **Handles non-convex clusters** through spectral embedding
- **Has strong theoretical foundations** in graph theory and linear algebra
- **Provides flexible similarity measures** through various affinity functions
- **Requires careful parameter tuning** for optimal performance

Key considerations:
- **Computational cost** is high for large datasets
- **Parameter selection** significantly affects results
- **Works best** with well-separated, non-convex clusters
- **Struggles** with very large datasets without approximations

Spectral clustering is particularly valuable for:
- Image segmentation and computer vision
- Social network community detection
- Gene expression analysis
- Any application with complex, non-convex cluster shapes

## Next Steps

After mastering Spectral Clustering, explore:

- **Multi-view spectral clustering**: Multiple data representations
- **Deep spectral clustering**: Neural network approaches
- **Streaming spectral clustering**: Online/incremental methods
- **Hypergraph clustering**: Beyond pairwise similarities
- **Tensor spectral clustering**: Higher-order relationships