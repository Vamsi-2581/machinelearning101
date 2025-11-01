# Image Classification Basics

## Introduction

Image classification is one of the fundamental tasks in computer vision, where the goal is to assign a label or category to an image based on its visual content. From identifying objects in photos to medical diagnosis, image classification powers countless real-world applications.

In this module, you'll learn how neural networks can classify images by processing their features. While modern systems use deep convolutional neural networks (CNNs), we'll start with the fundamentals using a simple neural network architecture that processes extracted image features.

## What is Image Classification?

Image classification is the task of assigning one or more labels to an image from a predefined set of categories. For example:

- **Object Recognition**: Identifying whether an image contains a cat, dog, or bird
- **Medical Imaging**: Classifying X-rays as showing normal or abnormal conditions
- **Document Processing**: Categorizing scanned documents by type
- **Quality Control**: Detecting defective products in manufacturing

The key challenge is teaching a computer to recognize patterns in visual data that humans naturally perceive.

## From Images to Features

Raw images are represented as grids of pixels, where each pixel has color values (RGB). For a 100×100 pixel color image, that's 30,000 numbers! Processing raw pixels directly can be computationally expensive.

Instead, we often extract **features** from images:

- **Color Histograms**: Distribution of colors in the image
- **Texture Features**: Patterns and textures present
- **Shape Descriptors**: Geometric properties of objects
- **Edge Information**: Boundaries and contours

These features reduce dimensionality while preserving important information for classification.

## Neural Network Architecture

Our image classifier uses a simple **feedforward neural network** with three layers:

### 1. Input Layer
Receives the extracted image features (e.g., color histogram values, texture descriptors). Each feature becomes an input neuron.

### 2. Hidden Layer
Processes the input features through weighted connections. Each hidden neuron:
- Computes a weighted sum of inputs
- Applies a **ReLU activation** function: `f(x) = max(0, x)`
- Learns to detect patterns and combinations of features

The ReLU activation introduces non-linearity, allowing the network to learn complex decision boundaries.

### 3. Output Layer
Produces class probabilities using the **softmax activation**:

```
softmax(z_i) = exp(z_i) / Σ exp(z_j)
```

This ensures outputs sum to 1 and can be interpreted as probabilities for each class.

## Training Process

The network learns through **backpropagation** and **gradient descent**:

### 1. Forward Pass
- Input features flow through the network
- Each layer transforms the data
- Output layer produces class probabilities

### 2. Loss Calculation
We use **cross-entropy loss** to measure prediction error:

```
Loss = -Σ y_true * log(y_pred)
```

Where `y_true` is the true class (one-hot encoded) and `y_pred` is the predicted probability.

### 3. Backward Pass
- Compute gradients of loss with respect to weights
- Propagate errors backward through the network
- Update weights to reduce loss

### 4. Weight Update
```
weight = weight - learning_rate * gradient
```

The learning rate controls how much we adjust weights in each step.

## Regularization

To prevent **overfitting** (memorizing training data instead of learning general patterns), we add **L2 regularization**:

```
Loss_total = Loss_classification + (λ/2) * Σ weight²
```

This penalty term discourages large weights, encouraging the model to find simpler, more generalizable solutions.

## Multi-Class Classification

Unlike binary classification (two classes), image classification often involves multiple categories. The softmax function naturally extends to any number of classes:

- Each output neuron represents one class
- Softmax ensures probabilities sum to 1
- The class with highest probability is the prediction

## Evaluation Metrics

### Accuracy
Percentage of correctly classified images:
```
Accuracy = (Correct Predictions) / (Total Predictions)
```

### Confusion Matrix
A table showing true vs. predicted classes for all samples. Helps identify which classes are confused with each other.

### Precision
For each class, what fraction of predicted instances were correct:
```
Precision = True Positives / (True Positives + False Positives)
```

### Recall
For each class, what fraction of actual instances were found:
```
Recall = True Positives / (True Positives + False Negatives)
```

### F1 Score
Harmonic mean of precision and recall:
```
F1 = 2 * (Precision * Recall) / (Precision + Recall)
```

## Interactive Demo

Use the controls to experiment with the image classifier:

1. **Choose a Dataset**: Select different image feature datasets
2. **Adjust Learning Rate**: See how it affects training speed and stability
3. **Modify Hidden Layer Size**: Observe the impact on model capacity
4. **Tune Regularization**: Balance between fitting and generalization
5. **Train the Model**: Watch the loss decrease and accuracy improve

Observe how the confusion matrix reveals which classes are easily distinguished and which are often confused.

## Use Cases

### Medical Imaging
Classifying medical scans (X-rays, MRIs, CT scans) to assist in diagnosis. Features might include texture patterns, intensity distributions, and anatomical landmarks.

### Product Categorization
E-commerce platforms automatically categorize product images. Features could include color schemes, shapes, and visual patterns.

### Wildlife Monitoring
Identifying animal species from camera trap images. Features might capture fur patterns, body shapes, and color distributions.

### Document Classification
Sorting scanned documents by type (invoices, receipts, forms). Features include text layout, logos, and structural elements.

## Best Practices

### Feature Engineering
- Choose features relevant to your classification task
- Normalize features to similar scales
- Remove redundant or highly correlated features

### Model Architecture
- Start with a small hidden layer and increase if needed
- Too many neurons can lead to overfitting
- Too few neurons may not capture complex patterns

### Training
- Use appropriate learning rates (0.001 - 0.1 typically)
- Monitor both training loss and accuracy
- Stop training if loss stops decreasing (early stopping)

### Regularization
- Start with small regularization values
- Increase if you observe overfitting (high training accuracy, low test accuracy)
- Balance between model complexity and generalization

### Evaluation
- Always evaluate on unseen test data
- Use confusion matrix to identify problem classes
- Consider class imbalance in your metrics

## Limitations and Next Steps

This simple neural network has limitations:

- **Feature Dependency**: Requires manual feature extraction
- **Limited Capacity**: May struggle with complex visual patterns
- **No Spatial Understanding**: Doesn't preserve spatial relationships in images

**Convolutional Neural Networks (CNNs)** address these limitations by:
- Learning features automatically from raw pixels
- Preserving spatial structure through convolution operations
- Building hierarchical representations from simple to complex patterns

After mastering these basics, explore CNNs to see how modern image classification achieves state-of-the-art performance!

## Further Reading

- **Deep Learning Book** by Goodfellow, Bengio, and Courville - Chapter on Feedforward Networks
- **Pattern Recognition and Machine Learning** by Bishop - Chapter on Neural Networks
- **CS231n: Convolutional Neural Networks for Visual Recognition** - Stanford course materials
- **ImageNet Classification with Deep Convolutional Neural Networks** - AlexNet paper that revolutionized computer vision
- **Visualizing and Understanding Convolutional Networks** - Insights into how CNNs learn visual features

## Key Takeaways

- Image classification assigns categories to images based on visual content
- Neural networks learn to classify by processing extracted features
- Hidden layers with ReLU activation enable learning complex patterns
- Softmax activation produces class probabilities for multi-class problems
- Cross-entropy loss guides the learning process
- Regularization prevents overfitting and improves generalization
- Confusion matrices reveal classification strengths and weaknesses
- Modern approaches use CNNs to learn features directly from pixels
