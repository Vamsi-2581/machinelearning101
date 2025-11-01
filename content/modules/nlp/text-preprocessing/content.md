# Text Preprocessing & Tokenization

## Introduction

Text preprocessing and tokenization are the foundational steps in any Natural Language Processing (NLP) pipeline. Before machines can understand and analyze text, we need to break it down into manageable pieces and clean it up. This process transforms raw text into a structured format that algorithms can work with.

In this module, you'll learn how to tokenize text, normalize it, and prepare it for downstream NLP tasks like sentiment analysis, text classification, and language modeling.

## What is Tokenization?

Tokenization is the process of breaking text into smaller units called **tokens**. These tokens can be:

- **Words**: "The quick brown fox" → ["The", "quick", "brown", "fox"]
- **Sentences**: "Hello world. How are you?" → ["Hello world.", "How are you?"]
- **Characters**: "Hello" → ["H", "e", "l", "l", "o"]
- **Subwords**: "unhappiness" → ["un", "happiness"]

The choice of tokenization strategy depends on your specific NLP task and language characteristics.

## Why is Tokenization Important?

Tokenization serves several critical purposes:

1. **Vocabulary Building**: Creates a dictionary of unique words/tokens in your corpus
2. **Feature Extraction**: Converts text into numerical representations for machine learning
3. **Text Analysis**: Enables counting, frequency analysis, and pattern detection
4. **Normalization**: Standardizes text for consistent processing
5. **Dimensionality Reduction**: Reduces the complexity of text data

## Tokenization Strategies

### Word Tokenization

The most common approach, splitting text by whitespace and punctuation:

```
Input: "Machine learning is amazing!"
Output: ["Machine", "learning", "is", "amazing", "!"]
```

**Advantages**:
- Intuitive and easy to understand
- Works well for many languages
- Preserves semantic meaning

**Challenges**:
- Handling contractions ("don't" → "do" + "n't"?)
- Compound words ("New York", "ice cream")
- Punctuation attachment

### Sentence Tokenization

Splits text into sentences based on punctuation marks:

```
Input: "Hello world. How are you? I'm fine!"
Output: ["Hello world.", "How are you?", "I'm fine!"]
```

**Use Cases**:
- Document summarization
- Sentiment analysis per sentence
- Machine translation

**Challenges**:
- Abbreviations (Dr., Mr., etc.)
- Decimal numbers (3.14)
- Ellipsis (...)

### Character Tokenization

Breaks text into individual characters:

```
Input: "Hello"
Output: ["H", "e", "l", "l", "o"]
```

**Advantages**:
- No out-of-vocabulary issues
- Works for any language
- Useful for character-level models

**Disadvantages**:
- Loses word-level semantics
- Creates very long sequences
- Requires more computation

## Text Normalization

Normalization standardizes text to reduce variability:

### Lowercasing

Converts all text to lowercase:

```
"Machine Learning" → "machine learning"
```

**Benefits**:
- Reduces vocabulary size
- Treats "The" and "the" as the same word
- Improves model generalization

**Drawbacks**:
- Loses information (proper nouns, acronyms)
- "US" (country) vs "us" (pronoun)

### Punctuation Removal

Strips punctuation marks from text:

```
"Hello, world!" → "Hello world"
```

**When to Use**:
- Topic modeling
- Text classification
- When punctuation doesn't carry meaning

**When to Keep**:
- Sentiment analysis (! and ? matter)
- Named entity recognition
- Question answering

### Stopword Removal

Filters out common words that carry little meaning:

```
"the quick brown fox" → "quick brown fox"
```

**Common Stopwords**: the, is, at, which, on, a, an, and, or, but

**Benefits**:
- Reduces noise in text data
- Decreases vocabulary size
- Focuses on content words

**Considerations**:
- May remove important context
- "not" is often a stopword but crucial for sentiment
- Domain-specific stopwords may differ

### Stemming

Reduces words to their root form by removing suffixes:

```
"running" → "run"
"happily" → "happi"
"studies" → "studi"
```

**Algorithms**:
- **Porter Stemmer**: Most common, rule-based
- **Lancaster Stemmer**: More aggressive
- **Snowball Stemmer**: Multilingual support

**Advantages**:
- Reduces vocabulary size
- Groups related words together
- Fast and simple

**Disadvantages**:
- May produce non-words ("happi")
- Can be too aggressive
- Language-specific rules needed

## Building a Vocabulary

After tokenization, we create a **vocabulary** - the set of unique tokens:

```
Text: "the cat sat on the mat"
Tokens: ["the", "cat", "sat", "on", "the", "mat"]
Vocabulary: {"the", "cat", "sat", "on", "mat"}
Vocabulary Size: 5
```

### Token Frequency

Counting how often each token appears:

```
"the": 2
"cat": 1
"sat": 1
"on": 1
"mat": 1
```

**Applications**:
- TF-IDF weighting
- Feature selection
- Rare word filtering

## Interactive Demo

Use the controls to experiment with different tokenization and normalization options:

1. **Choose a Sample Text**: Start with different text examples
2. **Select Tokenization Mode**: Try word, sentence, or character tokenization
3. **Apply Normalization**: Toggle lowercase conversion
4. **Filter Tokens**: Remove punctuation and stopwords
5. **Apply Stemming**: See how words are reduced to roots

Observe how each option affects:
- The number of tokens
- Vocabulary size
- Token types and frequencies

## Use Cases

### Text Classification

Tokenization prepares text for classification tasks:
- Spam detection
- Sentiment analysis
- Topic categorization

### Information Retrieval

Search engines use tokenization to:
- Index documents
- Match queries to content
- Rank results by relevance

### Machine Translation

Translation systems tokenize to:
- Align source and target languages
- Handle word order differences
- Manage vocabulary

### Text Generation

Language models tokenize to:
- Learn word patterns
- Generate coherent text
- Predict next words

## Best Practices

### 1. Understand Your Task

Different tasks require different preprocessing:
- **Sentiment Analysis**: Keep punctuation and capitalization
- **Topic Modeling**: Remove stopwords and apply stemming
- **Named Entity Recognition**: Preserve capitalization

### 2. Preserve Important Information

Don't over-normalize:
- Keep negations for sentiment ("not good" ≠ "good")
- Preserve proper nouns for entity recognition
- Maintain punctuation for question detection

### 3. Handle Special Cases

Consider:
- URLs and email addresses
- Hashtags and mentions (@user)
- Numbers and dates
- Emojis and special characters

### 4. Language-Specific Processing

Different languages need different approaches:
- **English**: Space-separated words
- **Chinese/Japanese**: No spaces between words
- **Arabic**: Right-to-left text
- **German**: Compound words

### 5. Consistency is Key

Apply the same preprocessing to:
- Training data
- Validation data
- Test data
- Production inputs

## Common Pitfalls

### Over-Preprocessing

Removing too much information:
- Losing semantic meaning
- Reducing model performance
- Creating ambiguity

### Under-Preprocessing

Not cleaning enough:
- Large vocabulary size
- Sparse features
- Poor generalization

### Inconsistent Preprocessing

Different preprocessing for train vs. test:
- Distribution mismatch
- Poor model performance
- Unexpected errors

## Advanced Topics

### Subword Tokenization

Modern approaches like **Byte-Pair Encoding (BPE)** and **WordPiece**:
- Balance between word and character tokenization
- Handle rare and unknown words
- Used in BERT, GPT, and other transformers

### Contextual Tokenization

Consider surrounding context:
- "bank" (financial) vs "bank" (river)
- Homonyms and polysemy
- Part-of-speech tagging

### Multilingual Tokenization

Handling multiple languages:
- Unicode normalization
- Script detection
- Language-specific rules

## Further Reading

### Research Papers

- "A Simple, Fast, and Effective Reparameterization of IBM Model 2" - Tokenization in machine translation
- "Neural Machine Translation of Rare Words with Subword Units" - BPE tokenization
- "SentencePiece: A simple and language independent approach to subword tokenization"

### Tools and Libraries

- **NLTK**: Comprehensive NLP toolkit with tokenizers
- **spaCy**: Industrial-strength NLP with fast tokenization
- **Hugging Face Tokenizers**: Fast, modern tokenization library
- **Stanford CoreNLP**: Robust linguistic analysis tools

### Online Resources

- [NLTK Tokenization Guide](https://www.nltk.org/api/nltk.tokenize.html)
- [spaCy Tokenization](https://spacy.io/usage/linguistic-features#tokenization)
- [Hugging Face Tokenizers](https://huggingface.co/docs/tokenizers/)

## Summary

Text preprocessing and tokenization are essential first steps in NLP:

- **Tokenization** breaks text into manageable units (words, sentences, characters)
- **Normalization** standardizes text (lowercasing, stemming, stopword removal)
- **Vocabulary building** creates a dictionary of unique tokens
- **Token frequency** analysis reveals patterns in text data

The right preprocessing strategy depends on your specific task, language, and data characteristics. Experiment with different options to find what works best for your use case!
