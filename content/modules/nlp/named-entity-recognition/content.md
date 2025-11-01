# Named Entity Recognition

## Introduction

Named Entity Recognition (NER) is a fundamental Natural Language Processing task that identifies and classifies named entities in text into predefined categories such as persons, organizations, locations, dates, and more. It's a crucial component in information extraction systems that help computers understand who, what, where, and when in unstructured text.

From extracting key information from news articles to powering search engines and chatbots, NER enables machines to identify and categorize the important "things" mentioned in text. In this module, you'll learn how computers can automatically detect and classify named entities with high accuracy.

## What is Named Entity Recognition?

Named Entity Recognition is the task of locating and classifying named entities in text into predefined categories. It answers questions like:

- Who are the people mentioned in this article?
- Which organizations are discussed?
- What locations are referenced?
- When did events occur?

### Example

```
Text: "Apple Inc. announced that Tim Cook will visit Paris on January 15, 2024."

Entities:
- "Apple Inc." → ORGANIZATION
- "Tim Cook" → PERSON
- "Paris" → LOCATION
- "January 15, 2024" → DATE
```

### Common Entity Types

**Core Entity Types**:
- **PERSON**: Names of people (John Smith, Dr. Jane Doe)
- **ORGANIZATION**: Companies, agencies, institutions (Apple Inc., NASA, MIT)
- **LOCATION**: Cities, countries, regions (New York, France, Silicon Valley)
- **DATE**: Absolute or relative dates (January 1, 2024, yesterday)

**Extended Entity Types**:
- **TIME**: Times of day (3:00 PM, noon)
- **MONEY**: Monetary values ($100, 50 euros)
- **PERCENT**: Percentages (25%, half)
- **PRODUCT**: Product names (iPhone, Windows)
- **EVENT**: Named events (World Cup, Olympics)
- **LANGUAGE**: Language names (English, Spanish)

## Why is NER Important?

### Information Extraction

**Structured Data from Unstructured Text**
- Extract key facts from documents
- Build knowledge graphs
- Populate databases automatically
- Enable semantic search

### Question Answering

```
Question: "Who is the CEO of Apple?"
Text: "Tim Cook leads Apple Inc. as CEO..."
Answer: "Tim Cook" (extracted via NER)
```

### Content Recommendation

- Identify topics and entities in articles
- Match user interests with content
- Improve search relevance
- Enable entity-based filtering

### Business Intelligence

- Track mentions of companies and products
- Monitor competitor activities
- Analyze market trends
- Extract insights from reports

## Applications of NER

### 1. News and Media

**Automated Tagging**
- Tag articles with mentioned entities
- Create entity-based navigation
- Link related articles
- Generate topic summaries

**Example**: Google News uses NER to identify people, places, and organizations in articles

### 2. Customer Service

**Ticket Routing**
- Extract product names from complaints
- Identify customer names and accounts
- Route to appropriate departments
- Prioritize based on entities

**Example**: Zendesk extracts product names to route tickets to specialized teams

### 3. Healthcare

**Medical Record Analysis**
- Extract patient names and IDs
- Identify medications and dosages
- Extract dates and procedures
- Ensure privacy compliance

**Example**: Clinical NER systems extract medical entities for research and care

### 4. Finance

**Document Processing**
- Extract company names from filings
- Identify transaction dates and amounts
- Process contracts automatically
- Monitor regulatory compliance

**Example**: Bloomberg Terminal uses NER to extract entities from financial news

### 5. Legal

**Contract Analysis**
- Extract party names
- Identify dates and deadlines
- Find monetary amounts
- Locate jurisdictions

**Example**: Legal tech platforms use NER to analyze contracts at scale

### 6. Search Engines

**Entity-based Search**
- Understand search intent
- Provide entity-specific results
- Enable knowledge panels
- Improve query understanding

**Example**: Google Search uses NER to show knowledge panels for entities

## How NER Works

### Approaches to NER

#### 1. Rule-based NER

Uses hand-crafted patterns and rules:

```
Pattern: [Title] [FirstName] [LastName]
Example: "Dr. Jane Smith" → PERSON

Pattern: [CapitalizedWord]+ (Inc|Corp|LLC)
Example: "Apple Inc." → ORGANIZATION
```

**Advantages**:
- No training data needed
- Highly precise for specific patterns
- Easy to customize
- Transparent and explainable

**Disadvantages**:
- Requires expert knowledge
- Doesn't generalize well
- Maintenance intensive
- Misses variations

#### 2. Gazetteer-based NER

Uses dictionaries of known entities:

```
Person Gazetteer: {John Smith, Jane Doe, Tim Cook, ...}
Location Gazetteer: {Paris, London, New York, ...}
Organization Gazetteer: {Apple, Google, Microsoft, ...}
```

**Advantages**:
- High precision for known entities
- Fast lookup
- Easy to update
- Domain-specific

**Disadvantages**:
- Limited to known entities
- Requires comprehensive lists
- Doesn't handle variations
- Misses new entities

#### 3. Machine Learning NER

Learns patterns from annotated data:

**Features**:
- Word shape (capitalization, digits)
- Part-of-speech tags
- Context words
- Prefixes and suffixes
- Gazetteer matches

**Algorithms**:
- Conditional Random Fields (CRF)
- Hidden Markov Models (HMM)
- Support Vector Machines (SVM)
- Neural networks

**Advantages**:
- Generalizes to new entities
- Learns from data
- Handles variations
- Adapts to domain

**Disadvantages**:
- Requires annotated training data
- Computationally expensive
- Less interpretable
- May overfit

#### 4. Deep Learning NER

Uses neural networks for entity recognition:

**Architectures**:
- Bidirectional LSTMs
- Transformers (BERT, RoBERTa)
- Character-level CNNs
- Attention mechanisms

**Advantages**:
- State-of-the-art performance
- Learns complex patterns
- Handles context well
- Transfer learning capable

**Disadvantages**:
- Requires large datasets
- Computationally intensive
- Black box models
- Needs significant resources

### Hybrid Approaches

Combine multiple methods for best results:

1. **Pattern matching** for structured entities (dates, emails)
2. **Gazetteer lookup** for known entities
3. **Machine learning** for unknown entities
4. **Context analysis** for disambiguation

## Pattern-based Entity Extraction

### Regular Expressions

Patterns for common entity types:

**Dates**:
```regex
\d{1,2}/\d{1,2}/\d{4}           # 12/31/2023
\d{4}-\d{2}-\d{2}               # 2023-12-31
(January|February|...) \d{1,2}, \d{4}  # January 15, 2024
```

**Emails**:
```regex
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

**Phone Numbers**:
```regex
\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
```

**Money**:
```regex
\$\d+(?:,\d{3})*(?:\.\d{2})?    # $1,234.56
\d+(?:,\d{3})*(?:\.\d{2})?\s*(dollars|USD|EUR)
```

### Capitalization Patterns

**Person Names**:
```
[Title]? [FirstName] [MiddleName]? [LastName]
Dr. Jane Marie Smith
```

**Organizations**:
```
[CapitalizedWords]+ (Inc|Corp|LLC|Ltd|Company)
Apple Inc.
Microsoft Corporation
```

**Locations**:
```
[CapitalizedWords]+ (City|State|Country|Province)
New York City
```

### Context Patterns

Use surrounding words for better accuracy:

```
"in [LOCATION]"     → "in Paris"
"at [ORGANIZATION]" → "at Google"
"by [PERSON]"       → "by John Smith"
```

## Gazetteer-based Extraction

### Building Gazetteers

**Sources**:
- Wikipedia entity lists
- Government databases
- Company registries
- Geographic databases
- Domain-specific lists

**Example Gazetteers**:

```
Persons:
- Barack Obama
- Elon Musk
- Taylor Swift

Organizations:
- Apple Inc.
- United Nations
- Harvard University

Locations:
- New York
- Tokyo
- Amazon River
```

### Gazetteer Matching

**Exact Matching**:
```
Text: "Apple announced new products"
Gazetteer: {"Apple Inc.", "Apple"}
Match: "Apple" → ORGANIZATION
```

**Fuzzy Matching**:
```
Text: "Microsft released updates"  (typo)
Gazetteer: {"Microsoft"}
Match: "Microsft" → ORGANIZATION (with lower confidence)
```

### Disambiguation

Handle ambiguous entities:

```
"Apple" could be:
- ORGANIZATION (Apple Inc.)
- PRODUCT (apple fruit)

Context helps:
"Apple announced..." → ORGANIZATION
"I ate an apple..." → Not an entity
```

## Context Window Analysis

### Why Context Matters

Surrounding words provide clues about entity types:

```
"President Biden" → PERSON (title indicates person)
"in California" → LOCATION (preposition indicates location)
"at Microsoft" → ORGANIZATION (preposition indicates organization)
```

### Context Features

**Before Entity**:
- Titles: Mr., Dr., President
- Prepositions: in, at, from, to
- Verbs: said, announced, visited

**After Entity**:
- Suffixes: Inc., Corp., City
- Verbs: said, announced, reported
- Descriptors: company, person, place

### Confidence Adjustment

Use context to adjust confidence scores:

```
Base confidence: 0.6 (pattern match)
+ Context indicator found: +0.2
+ Gazetteer match: +0.1
= Final confidence: 0.9
```

## Evaluation Metrics

### Precision, Recall, and F1-Score

**Precision**: Of predicted entities, how many are correct?
```
Precision = True Positives / (True Positives + False Positives)
```

**Recall**: Of actual entities, how many did we find?
```
Recall = True Positives / (True Positives + False Negatives)
```

**F1-Score**: Harmonic mean of precision and recall
```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

### Example

```
Text: "Apple Inc. CEO Tim Cook visited Paris."

Gold Standard:
- Apple Inc. (ORGANIZATION)
- Tim Cook (PERSON)
- Paris (LOCATION)

System Output:
- Apple Inc. (ORGANIZATION) ✓
- Tim Cook (PERSON) ✓
- Paris (ORGANIZATION) ✗ (wrong type)

Precision = 2/3 = 0.67
Recall = 2/3 = 0.67
F1 = 0.67
```

### Strict vs. Relaxed Evaluation

**Strict**: Exact boundary and type match required
```
Gold: "Apple Inc." (ORGANIZATION)
Pred: "Apple" (ORGANIZATION)
Result: Incorrect (boundary mismatch)
```

**Relaxed**: Partial overlap counts
```
Gold: "Apple Inc." (ORGANIZATION)
Pred: "Apple" (ORGANIZATION)
Result: Partial credit
```

## Challenges in NER

### 1. Entity Boundary Detection

Where does an entity start and end?

```
"New York City Mayor" 
→ "New York City" (LOCATION) + "Mayor" (TITLE)
or "New York City Mayor" (PERSON)?
```

### 2. Entity Type Ambiguity

Same text, different types:

```
"Washington" could be:
- PERSON (George Washington)
- LOCATION (Washington D.C.)
- LOCATION (Washington State)
- ORGANIZATION (Washington Post)
```

### 3. Nested Entities

Entities within entities:

```
"Bank of America" contains:
- "Bank of America" (ORGANIZATION)
- "America" (LOCATION)
```

### 4. Abbreviations and Acronyms

```
"FBI" → Federal Bureau of Investigation (ORGANIZATION)
"NYC" → New York City (LOCATION)
"CEO" → Chief Executive Officer (TITLE, not entity)
```

### 5. Informal Text

Social media and casual writing:

```
"gonna meet @elonmusk in SF tmrw"
→ Elon Musk (PERSON), San Francisco (LOCATION), tomorrow (DATE)
```

### 6. Multilingual NER

Different languages have different:
- Capitalization rules
- Name formats
- Entity indicators
- Character sets

### 7. Domain Adaptation

Medical, legal, and technical domains have:
- Specialized entity types
- Domain-specific terminology
- Different naming conventions
- Unique patterns

## Interactive Demo

Use the controls to configure and test the NER system:

1. **Choose a Dataset**: Select text to analyze (news, business, social media)
2. **Select Entity Types**: Choose which entity types to recognize
3. **Configure Case Sensitivity**: Match entities case-sensitively or not
4. **Enable Context Window**: Use surrounding words for better classification
5. **Set Context Window Size**: Number of words to consider for context

Observe:
- **Entity Highlighting**: See extracted entities color-coded by type
- **Entity Distribution**: Count of each entity type found
- **Confidence Scores**: How confident the system is about each entity
- **Precision/Recall**: Evaluation metrics if gold standard available

## Best Practices

### 1. Combine Multiple Approaches

- Use patterns for structured entities (dates, emails)
- Use gazetteers for known entities
- Use ML for unknown entities
- Combine scores for final decision

### 2. Domain-Specific Customization

- Build domain-specific gazetteers
- Create custom patterns
- Train on domain data
- Adjust entity types

### 3. Handle Ambiguity

- Use context for disambiguation
- Consider multiple interpretations
- Provide confidence scores
- Allow manual review

### 4. Continuous Improvement

- Monitor performance
- Update gazetteers regularly
- Retrain models with new data
- Collect user feedback

### 5. Error Analysis

- Analyze false positives
- Identify missed entities
- Understand failure patterns
- Improve weak areas

## Advanced Techniques

### Transfer Learning

Use pre-trained models:
1. Start with BERT or similar
2. Fine-tune on NER task
3. Achieve better performance
4. Require less training data

### Active Learning

Efficiently label data:
1. Train initial model
2. Find uncertain predictions
3. Label only those examples
4. Retrain and repeat

### Multi-task Learning

Train on related tasks:
- NER + POS tagging
- NER + dependency parsing
- NER + relation extraction
- Shared representations

### Cross-lingual NER

Transfer across languages:
- Multilingual embeddings
- Translate training data
- Zero-shot transfer
- Few-shot adaptation

## Use Cases by Industry

### Healthcare
- Extract patient information
- Identify medications and dosages
- Find medical procedures
- Ensure HIPAA compliance

### Finance
- Process financial documents
- Extract transaction details
- Monitor regulatory filings
- Analyze market news

### Legal
- Analyze contracts
- Extract case information
- Find relevant precedents
- Ensure compliance

### E-commerce
- Extract product attributes
- Identify brands and models
- Process customer queries
- Improve search

### Media
- Tag news articles
- Create entity indexes
- Link related content
- Generate summaries

## Further Reading

### Research Papers

- "Named Entity Recognition with Bidirectional LSTM-CNNs" - Chiu & Nichols (2016)
- "Neural Architectures for Named Entity Recognition" - Lample et al. (2016)
- "BERT for Named Entity Recognition" - Devlin et al. (2018)

### Books

- "Speech and Language Processing" by Jurafsky & Martin (Chapter on Information Extraction)
- "Natural Language Processing with Python" by Bird, Klein & Loper
- "Introduction to Information Retrieval" by Manning, Raghavan & Schütze

### Tools and Libraries

- **spaCy**: Industrial-strength NER
- **Stanford NER**: Java-based NER system
- **NLTK**: Basic NER capabilities
- **Hugging Face**: Pre-trained NER models
- **Flair**: State-of-the-art NER library

### Online Resources

- [spaCy NER Documentation](https://spacy.io/usage/linguistic-features#named-entities)
- [Stanford NER](https://nlp.stanford.edu/software/CRF-NER.html)
- [Hugging Face NER](https://huggingface.co/tasks/token-classification)

## Summary

Named Entity Recognition is a fundamental NLP task that identifies and classifies entities in text:

- **Entity Types**: Persons, organizations, locations, dates, and more
- **Multiple Approaches**: Rule-based, gazetteer-based, ML-based, and hybrid
- **Pattern Matching**: Regular expressions for structured entities
- **Context Analysis**: Use surrounding words for better classification
- **Wide Applications**: Information extraction, search, question answering, business intelligence

The key to successful NER is combining multiple approaches, using domain knowledge, and continuously evaluating and improving your system. Start with patterns and gazetteers for high-precision extraction, then add machine learning for better coverage and generalization!
