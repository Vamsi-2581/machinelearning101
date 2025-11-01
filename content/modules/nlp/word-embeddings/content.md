# Word Embeddings

## Introduction

Word embeddings are one of the most important breakthroughs in Natural Language Processing. They transform words from discrete symbols into continuous vector representations that capture semantic meaning. This allows machines to understand that "king" is to "queen" as "man" is to "woman", or that "Paris" and "France" have a relationship similar to "London" and "England".

In this module, you'll learn how word embeddings work, explore the Word2Vec algorithm, and see how these dense vector representations enable machines to understand language semantics.

## The Problem with One-Hot Encoding

Traditional approaches represent words as one-hot vectors:

```
Vocabulary: ["cat", "dog", "king", "queen"]

"cat"   = [1, 0, 0, 0]
"dog"   = [0, 1, 0, 0]
"king"  = [0, 0, 1, 0]
"queen" = [0, 0, 0, 1]
```

**Problems**:
1. **High Dimensionality**: Vector size = vocabulary size (often 10,000+)
2. **No Semantic Information**: All words are equally distant from each other
3. **Sparse Representations**: Mostly zeros, inefficient storage
4. **No Generalization**: Can't capture relationships between words

## What are Word Embeddings?

Word embeddings are **dense, low-dimensional vector representations** of words that capture semantic and syntactic relationships:

```
"cat"   = [0.2, -0.4, 0.7, ..., 0.1]  (50-300 dimensions)
"dog"   = [0.3, -0.3, 0.6, ..., 0.2]  (similar to "cat")
"king"  = [0.5, 0.8, -0.1, ..., 0.4]
"queen" = [0.4, 0.7, -0.2, ..., 0.3]  (similar to "king")
```

**Key Properties**:
- **Dense**: Every dimension has a meaningful value
- **Low-Dimensional**: Typically 50-300 dimensions vs. 10,000+ for one-hot
- **Semantic**: Similar words have similar vectors
- **Learned**: Automatically discovered from text data

## The Distributional Hypothesis

Word embeddings are based on the **distributional hypothesis**:

> "You shall know a word by the company it keeps" - J.R. Firth

Words that appear in similar contexts tend to have similar meanings:

```
"The cat sat on the mat"
"The dog sat on the mat"
```

Since "cat" and "dog" appear in similar contexts, their embeddings should be similar.

## Word2Vec: Skip-gram Model

Word2Vec is a popular algorithm for learning word embeddings. The **Skip-gram** model predicts context words given a target word:

### Architecture

```
Input: "cat"
↓
Embedding Layer (word → vector)
↓
Output Layer (predict context words)
↓
Predictions: ["the", "sat", "on"]
```

### Training Process

Given the sentence: "The cat sat on the mat"

For target word "cat" with window size 2:
- Context words: ["The", "sat"]
- Goal: Maximize probability of context words given "cat"

### Objective Function

The model learns to maximize:

```
P(context | target) = P("The" | "cat") × P("sat" | "cat")
```

By adjusting word vectors to make this probability high.

## Negative Sampling

Training on all words is computationally expensive. **Negative sampling** makes it efficient:

### Positive Sample
- Target: "cat"
- Context: "sat"
- Label: 1 (these words appear together)

### Negative Samples
- Target: "cat"
- Random words: "elephant", "computer", "ocean"
- Label: 0 (these words don't appear together)

The model learns to:
1. Give high scores to actual word pairs
2. Give low scores to random word pairs

This is much faster than computing probabilities over the entire vocabulary.

## Semantic Relationships

Word embeddings capture fascinating semantic relationships through **vector arithmetic**:

### Analogy Relationships

```
king - man + woman ≈ queen
Paris - France + Italy ≈ Rome
walking - walk + swim ≈ swimming
```

### Similarity

Words with similar meanings have similar vectors:

```
cosine_similarity("cat", "dog") = 0.85
cosine_similarity("cat", "computer") = 0.12
```

### Clustering

Related words cluster together in embedding space:
- Animals: cat, dog, elephant, lion
- Countries: France, Italy, Spain, Germany
- Verbs: run, walk, jump, swim

## Cosine Similarity

We measure word similarity using **cosine similarity**:

```
similarity = (A · B) / (||A|| × ||B||)
```

Where:
- A · B = dot product of vectors
- ||A|| = magnitude of vector A

**Range**: -1 (opposite) to +1 (identical)

**Example**:
```
vec("cat") = [0.2, 0.8, 0.3]
vec("dog") = [0.3, 0.7, 0.4]

similarity = 0.98 (very similar!)
```

## Dimensionality and Visualization

### Embedding Dimensions

Typical sizes:
- **50-100**: Fast, good for small datasets
- **200-300**: Standard, good balance
- **500-1000**: Captures more nuance, slower

### Visualization

We can't visualize 300-dimensional space, so we use **dimensionality reduction**:

1. **PCA (Principal Component Analysis)**: Linear projection
2. **t-SNE**: Non-linear, preserves local structure
3. **UMAP**: Fast, preserves global structure

These project high-dimensional embeddings to 2D or 3D for visualization.

## Training Parameters

### Window Size

How many words to consider on each side:

```
Window = 2: "The [cat] sat on"
Window = 5: "... The [cat] sat on the ..."
```

- **Small window (1-2)**: Captures syntactic relationships
- **Large window (5-10)**: Captures semantic relationships

### Embedding Dimension

- **Higher**: More expressive, captures subtle relationships
- **Lower**: Faster, less memory, may lose information

### Minimum Count

Filter rare words:
- **High (5+)**: Smaller vocabulary, faster training
- **Low (1-2)**: Keeps rare words, larger vocabulary

### Learning Rate

- **High (0.1)**: Fast convergence, may overshoot
- **Low (0.001)**: Slow but stable convergence

### Epochs

Number of passes through the corpus:
- **Few (1-5)**: Fast, may underfit
- **Many (10-20)**: Better quality, slower

## Interactive Demo

Use the controls to experiment with word embeddings:

1. **Choose a Corpus**: Select different text domains
2. **Adjust Embedding Dimension**: See how dimensionality affects representation
3. **Modify Window Size**: Observe impact on semantic vs. syntactic relationships
4. **Train the Model**: Watch embeddings evolve over epochs
5. **Explore the Space**: Click on words to find similar words
6. **Visualize in 2D/3D**: See how words cluster by meaning

Observe:
- How similar words cluster together
- Semantic relationships in the vector space
- Training loss convergence
- Effect of hyperparameters

## Use Cases

### Text Classification

Use pre-trained embeddings as features:
- Sentiment analysis
- Spam detection
- Topic categorization

### Information Retrieval

Find similar documents:
- Search engines
- Recommendation systems
- Document clustering

### Machine Translation

Align words across languages:
- Cross-lingual embeddings
- Transfer learning
- Zero-shot translation

### Named Entity Recognition

Capture entity relationships:
- Person names
- Locations
- Organizations

### Question Answering

Understand semantic similarity:
- Match questions to answers
- Find relevant passages
- Semantic search

## Best Practices

### 1. Use Pre-trained Embeddings

For most tasks, start with pre-trained embeddings:
- **Word2Vec**: Google News (3M words, 300d)
- **GloVe**: Wikipedia + Gigaword (6B tokens)
- **FastText**: Handles out-of-vocabulary words

### 2. Fine-tune on Your Domain

Adapt embeddings to your specific domain:
- Medical text
- Legal documents
- Social media
- Technical documentation

### 3. Handle Out-of-Vocabulary Words

Strategies for unknown words:
- Use subword embeddings (FastText)
- Average character embeddings
- Use a special UNK token

### 4. Normalize Embeddings

Normalize vectors to unit length:
- Makes cosine similarity = dot product
- Faster computation
- More stable training

### 5. Consider Context

Modern approaches use contextual embeddings:
- **BERT**: Different embeddings for different contexts
- **ELMo**: Deep contextualized representations
- **GPT**: Transformer-based embeddings

## Limitations

### Polysemy

Same word, different meanings:
- "bank" (financial) vs "bank" (river)
- "apple" (fruit) vs "Apple" (company)

**Solution**: Contextual embeddings (BERT, ELMo)

### Bias

Embeddings can reflect societal biases:
- Gender bias: "doctor" → male, "nurse" → female
- Racial bias: Associations with names
- Cultural bias: Western-centric relationships

**Solution**: Debiasing techniques, careful evaluation

### Static Representations

Word2Vec gives one vector per word:
- Can't capture multiple meanings
- No context awareness

**Solution**: Contextual embeddings

### Rare Words

Words with few occurrences have poor embeddings:
- Noisy representations
- Unreliable similarities

**Solution**: Increase minimum count, use subword embeddings

## Advanced Topics

### GloVe (Global Vectors)

Alternative to Word2Vec:
- Uses global word co-occurrence statistics
- Matrix factorization approach
- Often performs similarly to Word2Vec

### FastText

Extension of Word2Vec:
- Represents words as bags of character n-grams
- Handles out-of-vocabulary words
- Better for morphologically rich languages

### Contextual Embeddings

Modern approaches:
- **ELMo**: Bidirectional LSTM
- **BERT**: Transformer encoder
- **GPT**: Transformer decoder

These generate different embeddings based on context.

### Cross-lingual Embeddings

Align embeddings across languages:
- Shared vector space
- Zero-shot translation
- Cross-lingual transfer learning

## Further Reading

### Seminal Papers

- "Efficient Estimation of Word Representations in Vector Space" (Mikolov et al., 2013) - Original Word2Vec paper
- "Distributed Representations of Words and Phrases and their Compositionality" (Mikolov et al., 2013) - Negative sampling
- "GloVe: Global Vectors for Word Representation" (Pennington et al., 2014)
- "Enriching Word Vectors with Subword Information" (Bojanowski et al., 2017) - FastText

### Tools and Libraries

- **Gensim**: Python library for Word2Vec and Doc2Vec
- **FastText**: Facebook's library for efficient text classification and embeddings
- **Hugging Face Transformers**: Modern contextual embeddings
- **spaCy**: Industrial-strength NLP with pre-trained embeddings

### Pre-trained Embeddings

- [Google Word2Vec](https://code.google.com/archive/p/word2vec/)
- [Stanford GloVe](https://nlp.stanford.edu/projects/glove/)
- [Facebook FastText](https://fasttext.cc/docs/en/english-vectors.html)

### Online Resources

- [Word2Vec Tutorial](http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/)
- [The Illustrated Word2Vec](https://jalammar.github.io/illustrated-word2vec/)
- [Understanding Word Embeddings](https://www.tensorflow.org/text/guide/word_embeddings)

## Summary

Word embeddings revolutionized NLP by providing dense, semantic representations of words:

- **Dense Vectors**: Low-dimensional representations (50-300d) vs. sparse one-hot encoding
- **Semantic Meaning**: Similar words have similar vectors
- **Vector Arithmetic**: Captures analogies and relationships
- **Learned from Data**: Automatically discovered from text corpora
- **Transfer Learning**: Pre-trained embeddings work across tasks

Key algorithms:
- **Word2Vec**: Skip-gram and CBOW models
- **GloVe**: Global co-occurrence statistics
- **FastText**: Subword information

Modern evolution:
- **Contextual Embeddings**: BERT, ELMo, GPT
- **Different vectors for different contexts**
- **State-of-the-art performance**

Word embeddings are the foundation of modern NLP, enabling machines to understand and process human language with unprecedented accuracy!
