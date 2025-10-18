# Neural Networks

## Introduction

Neural networks are the foundation of modern deep learning. They're computing systems inspired by biological neural networks that can learn complex patterns from data through interconnected layers of artificial neurons.

## Network Architecture

### Layers

A feedforward neural network consists of:

1. **Input Layer**: Receives the raw features
2. **Hidden Layers**: Process information through weighted connections
3. **Output Layer**: Produces the final prediction

### Neurons

Each neuron:
- Receives inputs from previous layer
- Computes weighted sum plus bias
- Applies activation function
- Passes output to next layer

## Forward Propagation

Forward propagation is how the network makes predictions.

### Step-by-Step Process

For each neuron in each layer:

1. **Compute weighted sum**:
   ```
   z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
   ```

2. **Apply activation function**:
   ```
   a = activation(z)
   ```

3. **Pass to next layer**: Output becomes input for next layer

### Example

Input: [1.0, 0.5]
Weights: [0.3, 0.7]
Bias: 0.1

```
z = 0.3(1.0) + 0.7(0.5) + 0.1 = 0.75
a = sigmoid(0.75) = 0.68
```

## Activation Functions

Activation functions introduce non-linearity, allowing networks to learn complex patterns.

### Sigmoid

```
σ(x) = 1 / (1 + e^(-x))
```

- Output range: (0, 1)
- Smooth gradient
- Can suffer from vanishing gradients
- Good for output layer in binary classification

### ReLU (Rectified Linear Unit)

```
f(x) = max(0, x)
```

- Output range: [0, ∞)
- Most popular for hidden layers
- Computationally efficient
- Can suffer from "dying ReLU" problem

### Tanh (Hyperbolic Tangent)

```
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
```

- Output range: (-1, 1)
- Zero-centered (unlike sigmoid)
- Similar gradient issues as sigmoid

## Backpropagation

Backpropagation is how networks learn by computing gradients.

### The Algorithm

1. **Forward pass**: Compute predictions
2. **Compute loss**: Measure error
3. **Backward pass**: Compute gradients
4. **Update weights**: Adjust to reduce loss

### Gradient Computation

For each weight, compute:

```
∂Loss/∂w = ∂Loss/∂a × ∂a/∂z × ∂z/∂w
```

Using the chain rule, gradients flow backwards through the network.

### Weight Update

```
w_new = w_old - learning_rate × gradient
```

## Loss Functions

### Binary Cross-Entropy

For binary classification:

```
Loss = -[y log(ŷ) + (1-y) log(1-ŷ)]
```

Where:
- y is the true label (0 or 1)
- ŷ is the predicted probability

### Mean Squared Error

For regression:

```
Loss = (1/n) Σ(y - ŷ)²
```

## Training Process

### Epoch

One complete pass through the training data.

### Batch vs Stochastic

- **Batch Gradient Descent**: Use all data for each update
- **Stochastic Gradient Descent (SGD)**: Use one sample at a time
- **Mini-batch**: Use small batches (most common)

### Learning Rate

Controls step size for weight updates:
- Too high: May overshoot minimum
- Too low: Slow convergence
- Typical range: 0.001 - 0.1

## Common Challenges

### Vanishing Gradients

- Gradients become very small in deep networks
- Early layers learn slowly
- Solutions: ReLU, batch normalization, residual connections

### Exploding Gradients

- Gradients become very large
- Weights update too much
- Solutions: Gradient clipping, careful initialization

### Overfitting

- Network memorizes training data
- Poor generalization to new data
- Solutions: Regularization, dropout, more data

## Best Practices

### Architecture Design

- Start simple, add complexity as needed
- More layers = more capacity but harder to train
- Typical hidden layer sizes: 16, 32, 64, 128, 256

### Initialization

- Random initialization breaks symmetry
- Xavier/He initialization scales with layer size
- Never initialize all weights to same value

### Hyperparameter Tuning

- Learning rate: Most important
- Number of layers and neurons
- Activation functions
- Batch size
- Number of epochs

### Monitoring Training

- Plot loss curves
- Check for overfitting (train vs validation)
- Monitor gradient magnitudes
- Visualize activations

## Applications

### Computer Vision

- Image classification
- Object detection
- Facial recognition
- Style transfer

### Natural Language Processing

- Text classification
- Machine translation
- Sentiment analysis
- Question answering

### Other Domains

- Speech recognition
- Game playing (AlphaGo)
- Recommendation systems
- Time series forecasting

## Summary

Neural networks are powerful function approximators that:

**Strengths:**
- Learn complex non-linear patterns
- Automatic feature learning
- Scalable to large datasets
- State-of-the-art performance on many tasks

**Challenges:**
- Require lots of data
- Computationally expensive
- Many hyperparameters to tune
- Can be difficult to interpret

**Key Concepts:**
- Forward propagation computes predictions
- Backpropagation computes gradients
- Activation functions add non-linearity
- Gradient descent updates weights
- Architecture and hyperparameters matter
