# Hierarchical Clustering

## Introduction

Hierarchical clustering is a powerful unsupervised learning technique that builds a hierarchy of clusters, creating a tree-like structure called a dendrogram. Unlike K-means, which requires you to specify the number of clusters upfront, hierarchical clustering reveals the natural grouping structure at multiple levels of granularity.

Think of it like a family tree or organizational chart - you can see relationships at different levels, from individual members to large groups, all in one visualization.

## What You'll Learn

By the end of this module, you will:

- Understand agglomerative (bottom-up) and divisive (top-down) approaches
- Learn about different linkage criteria and when to use them
- Explore dendrograms for visualizing cluster hierarchies
- Recognize how to determine the optimal number of clusters
- Understand the computational complexity and scalability

## Two Approaches to Hierarchical Clustering

### Agglomerative (Bottom-Up)

**Most common approach:**

1. Start with each point as its own cluster (n clusters)
2. Repeatedly merge the two closest clusters
3. Continue until all points are in one cluster
4. Cut the dendrogram at desired level to get k clusters

**Analogy:** Building a pyramid from individual blocks

### Divisive (Top-Down)

**Less common approach:**

1. Start with all points in one cluster
2. Repeatedly split the cluster into two sub-clusters
3. Continue until each point is its own cluster
4. Cut the dendrogram at desired level to get k clusters

**Analogy:** Breaking down a large organization into departments

**Note:** Agglomerative is more commonly used because it's computationally more efficient.

## The Agglomerative Algorithm

### Step-by-Step Process

**Step 1: Initialize**
- Treat each data point as a single cluster
- Calculate pairwise distances between all points
- Create a distance matrix

**Step 2: Find Closest Pair**
- Identify the two clusters with minimum distance
- Use the chosen linkage criterion

**Step 3: Merge**
- Combine the two closest clusters into one
- Update the distance matrix

**Step 4: Repeat**
- Continue steps 2-3 until only one cluster remains
- Record the merge history

**Step 5: Create Dendrogram**
- Visualize the merge history as a tree
- Height represents distance at which clusters merged

**Step 6: Cut the Tree**
- Choose a height or number of clusters
- Extract final cluster assignments

## Linkage Criteria

The linkage criterion determines how to measure distance between clusters. This is the most important choice in hierarchical clustering.

### Single Linkage (Minimum)

**Definition:** Distance between closest points in two clusters

```
d(A, B) = min{d(a, b) : a ∈ A, b ∈ B}
```

**Characteristics:**
- Creates long, chain-like clusters
- Sensitive to noise and outliers
- Can connect distant clusters through intermediate points
- Good for non-convex shapes

**When to use:**
- Data has elongated or irregular shapes
- You want to detect connected components

**Drawback:** "Chaining effect" - can create unnatural long chains

### Complete Linkage (Maximum)

**Definition:** Distance between farthest points in two clusters

```
d(A, B) = max{d(a, b) : a ∈ A, b ∈ B}
```

**Characteristics:**
- Creates compact, spherical clusters
- Less sensitive to outliers than single linkage
- Tends to break large clusters
- Prefers clusters of similar size

**When to use:**
- You want compact, well-separated clusters
- Data has spherical cluster shapes

**Drawback:** Can split natural clusters if they're not compact

### Average Linkage (Mean)

**Definition:** Average distance between all pairs of points

```
d(A, B) = (1/|A||B|) Σ Σ d(a, b)
```

**Characteristics:**
- Compromise between single and complete
- More robust than single linkage
- Less biased toward compact clusters than complete
- Generally good default choice

**When to use:**
- You want balanced clusters
- You're unsure which linkage to use
- Data has moderate noise

**Advantage:** Balanced approach, works well in many scenarios

### Ward's Method (Minimum Variance)

**Definition:** Minimize within-cluster variance when merging

```
Merge clusters that minimize: Σ(within-cluster sum of squares)
```

**Characteristics:**
- Creates compact, evenly-sized clusters
- Minimizes variance within clusters
- Most popular choice in practice
- Similar to K-means objective

**When to use:**
- You want compact, spherical clusters
- You want clusters of similar size
- You're familiar with K-means

**Advantage:** Often produces the best results for well-separated, spherical clusters

**Note:** Only works with Euclidean distance

## The Dendrogram

A dendrogram is a tree diagram that shows the hierarchical relationship between clusters.

### Reading a Dendrogram

**Vertical Axis (Height):**
- Represents the distance at which clusters merge
- Higher merges = more dissimilar clusters
- Lower merges = more similar clusters

**Horizontal Axis:**
- Individual data points (leaves)
- Order is chosen for visualization clarity

**Branches:**
- Show which clusters merged
- Length indicates dissimilarity

**Cutting the Tree:**
- Horizontal line across dendrogram
- Height determines number of clusters
- Points below the line in same branch = same cluster

### Interpreting Dendrograms

**Long vertical lines:**
- Large distance between merges
- Suggests natural separation
- Good place to cut the tree

**Short vertical lines:**
- Small distance between merges
- Clusters are similar
- Less clear separation

**Balanced tree:**
- Clusters of similar size
- Hierarchical structure is clear

**Unbalanced tree:**
- Some clusters much larger than others
- May indicate outliers or noise

## Determining the Number of Clusters

Unlike K-means, hierarchical clustering doesn't require specifying k upfront. You can use the dendrogram to decide:

### Visual Inspection

**Look for:**
- Long vertical lines (large gaps)
- Natural breaks in the tree
- Consistent cluster sizes

**Cut at:**
- Height with largest gap
- Level that makes domain sense

### Elbow Method

Plot within-cluster variance vs. number of clusters:
- Look for "elbow" where improvement slows
- Similar to K-means elbow method

### Silhouette Analysis

Calculate silhouette score for different k:
- Measures how well points fit their clusters
- Range: -1 (poor) to +1 (excellent)
- Choose k with highest average silhouette

### Gap Statistic

Compare within-cluster variance to random data:
- Measures how much better clustering is than random
- Choose k where gap is largest

### Domain Knowledge

Consider:
- What makes sense for your problem?
- Are there natural groupings?
- What's actionable?

## Distance Metrics

Hierarchical clustering works with any distance metric:

### Euclidean Distance (Most Common)

```
d = √[Σ(xᵢ - yᵢ)²]
```

**When to use:** Continuous features, spherical clusters

### Manhattan Distance

```
d = Σ|xᵢ - yᵢ|
```

**When to use:** Grid-like data, less sensitive to outliers

### Cosine Distance

```
d = 1 - (x·y)/(||x|| ||y||)
```

**When to use:** Text data, high-dimensional sparse data

### Correlation Distance

```
d = 1 - correlation(x, y)
```

**When to use:** Time series, gene expression data

## Advantages of Hierarchical Clustering

1. **No Need to Specify k**: Explore different numbers of clusters
2. **Dendrogram Visualization**: See relationships at all levels
3. **Deterministic**: Same result every time (unlike K-means)
4. **Any Distance Metric**: Works with custom similarity measures
5. **Hierarchical Structure**: Reveals nested relationships
6. **No Random Initialization**: No need to run multiple times
7. **Flexible**: Can cut tree at any level

## Limitations of Hierarchical Clustering

1. **Computational Complexity**: O(n²) space, O(n³) time for naive implementation
2. **Not Scalable**: Difficult for large datasets (>10,000 points)
3. **Sensitive to Noise**: Outliers can distort the hierarchy
4. **Irreversible Decisions**: Once merged, clusters can't be split
5. **Linkage Choice**: Results depend heavily on linkage method
6. **Memory Intensive**: Must store distance matrix
7. **No Probabilistic Model**: No uncertainty estimates

## Computational Complexity

### Time Complexity

**Naive algorithm:**
- O(n³): For each of n-1 merges, search n² distances

**Optimized algorithms:**
- O(n² log n): Using priority queues and efficient data structures

### Space Complexity

- O(n²): Must store distance matrix
- Can be prohibitive for large datasets

### Scalability

**Practical limits:**
- Works well: < 1,000 points
- Manageable: 1,000 - 10,000 points
- Challenging: > 10,000 points

**For large datasets:**
- Use K-means or DBSCAN instead
- Or sample data first, then cluster

## Handling Different Data Types

### Numerical Features

- Use Euclidean or Manhattan distance
- Scale features if needed
- Most common scenario

### Categorical Features

- Use Hamming distance or Jaccard similarity
- Or encode as binary features
- Consider Gower distance for mixed types

### Mixed Features

- Use Gower distance (handles mixed types)
- Or normalize and use weighted distance
- Or encode categoricals as numerical

### Text Data

- Use cosine similarity
- Or Jaccard similarity for sets
- TF-IDF vectors work well

## Comparison with K-Means

### Hierarchical Clustering
- **Pros:** No need to specify k, deterministic, reveals structure
- **Cons:** Slow, not scalable, sensitive to noise
- **Best for:** Small datasets, exploratory analysis, hierarchical data

### K-Means
- **Pros:** Fast, scalable, simple
- **Cons:** Need to specify k, random initialization, assumes spherical clusters
- **Best for:** Large datasets, known number of clusters, spherical clusters

### When to Choose Which

**Use Hierarchical when:**
- Dataset is small (< 10,000 points)
- You don't know the number of clusters
- You want to explore the hierarchy
- You need deterministic results

**Use K-Means when:**
- Dataset is large
- You know the number of clusters
- Speed is important
- Clusters are roughly spherical

## Real-World Applications

Hierarchical clustering is used in many domains:

- **Biology**: Phylogenetic trees, gene expression analysis
- **Marketing**: Customer segmentation with hierarchy
- **Document Organization**: Topic hierarchies, document trees
- **Image Segmentation**: Hierarchical image regions
- **Social Networks**: Community detection with levels
- **Taxonomy**: Creating classification hierarchies

## Tips for Better Results

1. **Choose Linkage Carefully**: Ward's is often best for spherical clusters
2. **Scale Features**: Especially important for Euclidean distance
3. **Remove Outliers**: They can distort the hierarchy
4. **Use Appropriate Distance**: Match metric to data type
5. **Visualize Dendrogram**: Helps understand structure
6. **Try Multiple Linkages**: Compare results
7. **Consider Sampling**: For large datasets, cluster a sample first
8. **Validate Results**: Use silhouette or other metrics

## Advanced Techniques

### BIRCH (Balanced Iterative Reducing and Clustering using Hierarchies)

- Scalable hierarchical clustering
- Uses tree structure for efficiency
- Can handle large datasets
- O(n) time complexity

### Agglomerative Clustering with Connectivity Constraints

- Add constraints on which clusters can merge
- Useful for spatial data
- Ensures clusters are spatially connected

### Hierarchical DBSCAN

- Combines hierarchical and density-based approaches
- Handles varying density clusters
- More robust to noise

## Interpreting Results

### Cluster Profiles

For each cluster, examine:
- **Size**: How many points?
- **Centroid**: Average feature values
- **Spread**: Within-cluster variance
- **Characteristics**: What makes it unique?

### Cluster Validation

**Internal metrics:**
- Silhouette score
- Davies-Bouldin index
- Calinski-Harabasz index

**External metrics (if labels available):**
- Adjusted Rand Index
- Normalized Mutual Information

### Actionability

Ask:
- Do clusters make domain sense?
- Are they actionable?
- Do they reveal insights?
- Can you explain them to stakeholders?

## Summary

Hierarchical clustering is a powerful technique that:

- Builds a hierarchy of clusters from bottom-up or top-down
- Uses linkage criteria to determine cluster distances
- Creates dendrograms for visualization
- Doesn't require specifying the number of clusters upfront
- Works with any distance metric
- Is deterministic but computationally expensive

Understanding hierarchical clustering provides insights into data structure and relationships at multiple levels of granularity.

## Next Steps

After mastering hierarchical clustering, explore:

- **DBSCAN**: Density-based clustering for arbitrary shapes
- **Gaussian Mixture Models**: Probabilistic clustering
- **Spectral Clustering**: Graph-based clustering
- **Ensemble Clustering**: Combining multiple clustering results
- **Cluster Validation**: Advanced metrics and techniques
