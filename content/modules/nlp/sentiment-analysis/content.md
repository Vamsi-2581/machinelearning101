# Sentiment Analysis

## Introduction

Sentiment analysis, also known as opinion mining, is the process of computationally identifying and categorizing opinions expressed in text to determine whether the writer's attitude is positive, negative, or neutral. It's one of the most widely used applications of Natural Language Processing (NLP) in business and research.

From analyzing customer reviews to monitoring social media sentiment, this technology helps organizations understand public opinion at scale. In this module, you'll learn how machines can understand the emotional tone of text and classify it by sentiment.

## What is Sentiment Analysis?

Sentiment analysis is a text classification task that aims to determine the emotional tone behind words. At its core, it answers questions like:

- Is this product review positive or negative?
- What do customers think about our new feature?
- How is the public reacting to this news?
- Is this tweet expressing happiness or frustration?

### Types of Sentiment Analysis

**Binary Sentiment**: Classifies text as positive or negative
```
"This movie was amazing!" → Positive
"Terrible experience, very disappointed." → Negative
```

**Multi-class Sentiment**: Includes neutral category
```
"This movie was amazing!" → Positive
"The movie was okay, nothing special." → Neutral
"Terrible experience, very disappointed." → Negative
```

**Fine-grained Sentiment**: Uses rating scales (1-5 stars)
```
"Absolutely perfect!" → 5 stars
"Pretty good overall" → 4 stars
"It's okay" → 3 stars
```

**Aspect-based Sentiment**: Analyzes sentiment for specific aspects
```
"The food was excellent but the service was slow."
→ Food: Positive, Service: Negative
```

## Why is Sentiment Analysis Important?

### Business Applications

1. **Customer Feedback Analysis**
   - Automatically categorize thousands of reviews
   - Identify common complaints and praise
   - Track sentiment trends over time

2. **Brand Monitoring**
   - Monitor social media mentions
   - Detect PR crises early
   - Measure campaign effectiveness

3. **Market Research**
   - Understand customer preferences
   - Analyze competitor sentiment
   - Identify market trends

4. **Customer Service**
   - Prioritize urgent negative feedback
   - Route complaints to appropriate teams
   - Measure customer satisfaction

### Research Applications

- Political opinion analysis
- Public health monitoring
- Social science research
- Financial market prediction

## How Sentiment Analysis Works

### The Pipeline

1. **Text Preprocessing**
   - Tokenization
   - Lowercasing
   - Removing special characters
   - Handling negations

2. **Feature Extraction**
   - Bag-of-Words representation
   - TF-IDF weighting
   - Word embeddings
   - N-grams

3. **Classification**
   - Train a machine learning model
   - Logistic regression
   - Naive Bayes
   - Neural networks

4. **Prediction**
   - Apply model to new text
   - Get sentiment label and confidence
   - Identify contributing words

## Bag-of-Words Representation

The bag-of-words (BoW) model represents text as a collection of words, ignoring grammar and word order but keeping track of word frequency.

### Example

```
Text: "I love this movie. This movie is great!"

Vocabulary: {I, love, this, movie, is, great}

BoW Vector: [1, 1, 2, 2, 1, 1]
            (counts for each word)
```

### Advantages
- Simple and intuitive
- Works well for many tasks
- Computationally efficient
- Easy to interpret

### Limitations
- Ignores word order ("not good" vs "good not")
- Loses context and semantics
- Creates sparse, high-dimensional vectors
- Doesn't capture word relationships

## Logistic Regression for Text Classification

Logistic regression is a linear model that predicts the probability of each sentiment class.

### How It Works

1. **Feature Representation**: Convert text to BoW vector
2. **Linear Combination**: Compute weighted sum of features
3. **Softmax Activation**: Convert scores to probabilities
4. **Prediction**: Choose class with highest probability

### Mathematical Formulation

For each class c:
```
score_c = bias_c + Σ(weight_c,i × feature_i)
probability_c = exp(score_c) / Σ(exp(score_k))
```

### Training Process

1. Initialize weights randomly
2. For each training example:
   - Compute predictions
   - Calculate loss (cross-entropy)
   - Update weights using gradient descent
3. Repeat until convergence

### Regularization

L2 regularization prevents overfitting by penalizing large weights:
```
loss = cross_entropy_loss + λ × Σ(weight²)
```

## Word Importance and Highlighting

One advantage of linear models is interpretability - we can see which words contribute most to each sentiment.

### Positive Indicators
Words with high positive weights:
- "excellent", "amazing", "love", "perfect"
- "great", "wonderful", "fantastic", "best"

### Negative Indicators
Words with high negative weights:
- "terrible", "awful", "hate", "worst"
- "disappointing", "poor", "bad", "horrible"

### Neutral Words
Words with weights near zero:
- "the", "is", "was", "have"
- "this", "that", "it", "they"

## Challenges in Sentiment Analysis

### 1. Negation Handling

Negation words flip sentiment:
```
"good" → Positive
"not good" → Negative
"not bad" → Positive
```

**Solution**: Use n-grams or special negation handling

### 2. Sarcasm and Irony

```
"Oh great, another delay. Just what I needed!" → Negative (despite "great")
```

**Challenge**: Requires understanding context and tone

### 3. Context Dependency

```
"This movie is sick!" → Positive (slang)
"I feel sick after watching this." → Negative (literal)
```

**Solution**: Consider surrounding words and domain

### 4. Aspect-based Sentiment

```
"The camera is great but the battery life is terrible."
→ Camera: Positive, Battery: Negative
```

**Challenge**: Need to identify aspects and their sentiments

### 5. Multilingual Sentiment

Different languages express sentiment differently:
- Idioms and expressions
- Cultural context
- Translation challenges

### 6. Domain Adaptation

Models trained on movie reviews may not work well for:
- Product reviews
- Social media posts
- News articles
- Medical text

## Interactive Demo

Use the controls to train and test a sentiment classifier:

1. **Choose a Dataset**: Select training data (movie reviews, products, social media)
2. **Set Sentiment Classes**: Binary (positive/negative) or ternary (add neutral)
3. **Adjust Learning Rate**: Control how fast the model learns
4. **Set Training Epochs**: More epochs = more learning (but risk overfitting)
5. **Configure Regularization**: Prevent overfitting with L2 penalty
6. **Set Min Word Frequency**: Filter rare words from vocabulary

Observe:
- **Sentiment Predictions**: See how text is classified with confidence scores
- **Word Highlighting**: Identify which words drive sentiment predictions
- **Training Loss**: Monitor model convergence
- **Top Words**: Discover most influential words for each sentiment

## Use Cases

### E-commerce

**Product Review Analysis**
- Automatically categorize thousands of reviews
- Identify common issues and praise points
- Generate summary statistics
- Alert teams to negative trends

**Example**: Amazon analyzes millions of reviews to show "positive" and "negative" review summaries

### Social Media

**Brand Monitoring**
- Track mentions across platforms
- Measure campaign sentiment
- Identify influencers and detractors
- Respond to negative sentiment quickly

**Example**: Airlines monitor Twitter for customer complaints and respond in real-time

### Customer Service

**Ticket Prioritization**
- Route urgent negative feedback first
- Categorize support tickets
- Measure customer satisfaction
- Identify training needs

**Example**: Zendesk uses sentiment to prioritize support tickets

### Finance

**Market Sentiment Analysis**
- Analyze news articles
- Monitor social media for stock mentions
- Predict market movements
- Assess company reputation

**Example**: Hedge funds analyze Twitter sentiment for trading signals

### Healthcare

**Patient Feedback**
- Analyze patient reviews
- Identify care quality issues
- Monitor treatment satisfaction
- Improve patient experience

**Example**: Hospitals analyze patient surveys to improve care

## Best Practices

### 1. Quality Training Data

- Use domain-specific data
- Ensure balanced classes
- Include diverse examples
- Verify label quality

### 2. Preprocessing Matters

- Handle negations carefully
- Consider keeping punctuation (!, ?)
- Preserve emoticons and emojis
- Clean but don't over-process

### 3. Feature Engineering

- Try different text representations
- Use n-grams for context
- Consider word embeddings
- Include domain-specific features

### 4. Model Selection

- Start simple (logistic regression)
- Try ensemble methods
- Consider deep learning for complex tasks
- Balance accuracy and interpretability

### 5. Evaluation

- Use appropriate metrics (accuracy, F1-score)
- Test on held-out data
- Analyze errors and edge cases
- Consider human evaluation

### 6. Continuous Improvement

- Monitor performance over time
- Retrain with new data
- Handle concept drift
- Collect user feedback

## Advanced Techniques

### Deep Learning Approaches

**Recurrent Neural Networks (RNNs)**
- Process text sequentially
- Capture word order and context
- Handle variable-length input

**Convolutional Neural Networks (CNNs)**
- Extract local patterns
- Fast and parallelizable
- Good for short texts

**Transformers (BERT, GPT)**
- State-of-the-art performance
- Pre-trained on massive corpora
- Transfer learning capabilities
- Contextual word representations

### Transfer Learning

Use pre-trained models:
1. Start with model trained on large corpus
2. Fine-tune on your specific task
3. Achieve better performance with less data

### Ensemble Methods

Combine multiple models:
- Voting classifiers
- Stacking
- Boosting
- Better accuracy and robustness

## Common Pitfalls

### Overfitting

**Problem**: Model memorizes training data
**Solution**: Use regularization, more data, simpler model

### Class Imbalance

**Problem**: Too many positive or negative examples
**Solution**: Resampling, class weights, different metrics

### Data Leakage

**Problem**: Test data influences training
**Solution**: Proper train/test split, careful preprocessing

### Ignoring Context

**Problem**: Treating all words equally
**Solution**: Use n-grams, word embeddings, or deep learning

## Evaluation Metrics

### Accuracy

Percentage of correct predictions:
```
Accuracy = (Correct Predictions) / (Total Predictions)
```

**When to Use**: Balanced datasets

### Precision and Recall

**Precision**: Of predicted positives, how many are actually positive?
**Recall**: Of actual positives, how many did we predict?

```
Precision = True Positives / (True Positives + False Positives)
Recall = True Positives / (True Positives + False Negatives)
```

### F1-Score

Harmonic mean of precision and recall:
```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**When to Use**: Imbalanced datasets, need balance between precision and recall

### Confusion Matrix

Shows all prediction combinations:
```
                Predicted
              Pos    Neg
Actual  Pos   TP     FN
        Neg   FP     TN
```

## Further Reading

### Research Papers

- "Thumbs up? Sentiment Classification using Machine Learning Techniques" - Pang & Lee (2002)
- "Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank" - Socher et al. (2013)
- "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" - Devlin et al. (2018)

### Books

- "Speech and Language Processing" by Jurafsky & Martin
- "Natural Language Processing with Python" by Bird, Klein & Loper
- "Deep Learning for Natural Language Processing" by Palash Goyal et al.

### Tools and Libraries

- **NLTK**: Sentiment analysis with VADER
- **TextBlob**: Simple sentiment analysis API
- **spaCy**: Industrial NLP with sentiment
- **Hugging Face Transformers**: State-of-the-art models
- **scikit-learn**: Machine learning for text

### Online Resources

- [Stanford NLP Sentiment Analysis](https://nlp.stanford.edu/sentiment/)
- [Hugging Face Sentiment Analysis](https://huggingface.co/tasks/sentiment-analysis)
- [Google Cloud Natural Language API](https://cloud.google.com/natural-language)

## Summary

Sentiment analysis is a powerful NLP technique for understanding opinions in text:

- **Classification Task**: Categorize text by emotional tone (positive, negative, neutral)
- **Bag-of-Words**: Simple but effective text representation
- **Logistic Regression**: Linear model for sentiment classification
- **Word Importance**: Identify which words drive sentiment predictions
- **Wide Applications**: Customer feedback, brand monitoring, market research

The key to successful sentiment analysis is understanding your domain, choosing appropriate features, and continuously evaluating and improving your model. Start simple with logistic regression and bag-of-words, then explore more advanced techniques as needed!
