/**
 * Dataset generation utilities for creating sample datasets
 */

import type { Dataset, DataPoint } from '~/types/dataset';
import { createDataset } from '~/types/dataset';

/**
 * Generates a simple linear dataset: y = mx + b + noise
 */
export function generateSimpleLinear(
  samples: number = 50,
  slope: number = 2,
  intercept: number = 1,
  noise: number = 0
): Dataset {
  const data: DataPoint[] = [];
  
  for (let i = 0; i < samples; i++) {
    const x = (i / samples) * 10 - 5; // Range from -5 to 5
    const y = slope * x + intercept + (Math.random() - 0.5) * noise;
    
    data.push({
      features: [x],
      label: y,
      id: `point-${i}`
    });
  }

  return createDataset({
    id: 'simple-linear',
    name: 'Simple Linear',
    description: 'A simple linear relationship with minimal noise',
    type: 'regression',
    data,
    metadata: {
      featureNames: ['x'],
      labelName: 'y',
      slope,
      intercept
    }
  });
}

/**
 * Generates a noisy linear dataset
 */
export function generateNoisyLinear(
  samples: number = 100,
  slope: number = 1.5,
  intercept: number = 2,
  noise: number = 5
): Dataset {
  return {
    ...generateSimpleLinear(samples, slope, intercept, noise),
    id: 'noisy-linear',
    name: 'Noisy Linear',
    description: 'A linear relationship with significant noise'
  };
}

/**
 * Generates a polynomial dataset: y = ax² + bx + c + noise
 */
export function generatePolynomial(
  samples: number = 80,
  a: number = 0.5,
  b: number = 1,
  c: number = 2,
  noise: number = 2
): Dataset {
  const data: DataPoint[] = [];
  
  for (let i = 0; i < samples; i++) {
    const x = (i / samples) * 10 - 5; // Range from -5 to 5
    const y = a * x * x + b * x + c + (Math.random() - 0.5) * noise;
    
    data.push({
      features: [x],
      label: y,
      id: `point-${i}`
    });
  }

  return createDataset({
    id: 'polynomial',
    name: 'Polynomial',
    description: 'A quadratic relationship',
    type: 'regression',
    data,
    metadata: {
      featureNames: ['x'],
      labelName: 'y',
      coefficients: { a, b, c }
    }
  });
}

/**
 * Generates a binary classification dataset (two classes)
 */
export function generateBinaryClassification(
  samplesPerClass: number = 50,
  separation: number = 2
): Dataset {
  const data: DataPoint[] = [];
  
  // Class 0 - centered around (-separation, -separation)
  for (let i = 0; i < samplesPerClass; i++) {
    const x = -separation + (Math.random() - 0.5) * 2;
    const y = -separation + (Math.random() - 0.5) * 2;
    
    data.push({
      features: [x, y],
      label: 0,
      id: `class0-${i}`
    });
  }
  
  // Class 1 - centered around (separation, separation)
  for (let i = 0; i < samplesPerClass; i++) {
    const x = separation + (Math.random() - 0.5) * 2;
    const y = separation + (Math.random() - 0.5) * 2;
    
    data.push({
      features: [x, y],
      label: 1,
      id: `class1-${i}`
    });
  }

  return createDataset({
    id: 'binary-classification',
    name: 'Binary Classification',
    description: 'Two well-separated classes',
    type: 'classification',
    data,
    metadata: {
      featureNames: ['x', 'y'],
      labelName: 'class',
      classes: [0, 1]
    }
  });
}

/**
 * Generates a multi-class classification dataset (three or more classes)
 */
export function generateMultiClassification(
  numClasses: number = 3,
  samplesPerClass: number = 40
): Dataset {
  const data: DataPoint[] = [];
  const angleStep = (2 * Math.PI) / numClasses;
  const radius = 3;
  
  for (let classIdx = 0; classIdx < numClasses; classIdx++) {
    const angle = classIdx * angleStep;
    const centerX = radius * Math.cos(angle);
    const centerY = radius * Math.sin(angle);
    
    for (let i = 0; i < samplesPerClass; i++) {
      const x = centerX + (Math.random() - 0.5) * 1.5;
      const y = centerY + (Math.random() - 0.5) * 1.5;
      
      data.push({
        features: [x, y],
        label: classIdx,
        id: `class${classIdx}-${i}`
      });
    }
  }

  return createDataset({
    id: 'multi-classification',
    name: 'Multi-Class Classification',
    description: `${numClasses} classes arranged in a circle`,
    type: 'classification',
    data,
    metadata: {
      featureNames: ['x', 'y'],
      labelName: 'class',
      classes: Array.from({ length: numClasses }, (_, i) => i)
    }
  });
}

/**
 * Generates blob clusters for clustering
 */
export function generateBlobs(
  numClusters: number = 3,
  samplesPerCluster: number = 50,
  clusterStd: number = 0.8
): Dataset {
  const data: DataPoint[] = [];
  const centers: number[][] = [];
  
  // Generate random cluster centers
  for (let i = 0; i < numClusters; i++) {
    centers.push([
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ]);
  }
  
  // Generate points around each center
  for (let clusterIdx = 0; clusterIdx < numClusters; clusterIdx++) {
    const center = centers[clusterIdx];
    if (!center) continue;
    const [cx, cy] = center;
    
    for (let i = 0; i < samplesPerCluster; i++) {
      const x = (cx ?? 0) + (Math.random() - 0.5) * 2 * clusterStd;
      const y = (cy ?? 0) + (Math.random() - 0.5) * 2 * clusterStd;
      
      data.push({
        features: [x, y],
        id: `cluster${clusterIdx}-${i}`
      });
    }
  }

  return createDataset({
    id: 'blobs',
    name: 'Blob Clusters',
    description: 'Gaussian blob clusters',
    type: 'clustering',
    data,
    metadata: {
      featureNames: ['x', 'y'],
      numClusters,
      centers
    }
  });
}

/**
 * Generates concentric circles for clustering
 */
export function generateCircles(
  samplesPerCircle: number = 100,
  noise: number = 0.1
): Dataset {
  const data: DataPoint[] = [];
  
  // Inner circle
  for (let i = 0; i < samplesPerCircle; i++) {
    const angle = (i / samplesPerCircle) * 2 * Math.PI;
    const radius = 2 + (Math.random() - 0.5) * noise;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    data.push({
      features: [x, y],
      id: `inner-${i}`
    });
  }
  
  // Outer circle
  for (let i = 0; i < samplesPerCircle; i++) {
    const angle = (i / samplesPerCircle) * 2 * Math.PI;
    const radius = 5 + (Math.random() - 0.5) * noise;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    data.push({
      features: [x, y],
      id: `outer-${i}`
    });
  }

  return createDataset({
    id: 'circles',
    name: 'Concentric Circles',
    description: 'Two concentric circles',
    type: 'clustering',
    data,
    metadata: {
      featureNames: ['x', 'y'],
      numCircles: 2
    }
  });
}

/**
 * Generates two interleaving half-moon shapes
 */
export function generateMoons(
  samplesPerMoon: number = 100,
  noise: number = 0.1
): Dataset {
  const data: DataPoint[] = [];
  
  // Upper moon
  for (let i = 0; i < samplesPerMoon; i++) {
    const angle = (i / samplesPerMoon) * Math.PI;
    const radius = 3;
    const x = radius * Math.cos(angle) + (Math.random() - 0.5) * noise;
    const y = radius * Math.sin(angle) + (Math.random() - 0.5) * noise;
    
    data.push({
      features: [x, y],
      id: `moon1-${i}`
    });
  }
  
  // Lower moon (inverted and shifted)
  for (let i = 0; i < samplesPerMoon; i++) {
    const angle = (i / samplesPerMoon) * Math.PI;
    const radius = 3;
    const x = radius * Math.cos(angle) + 3 + (Math.random() - 0.5) * noise;
    const y = -radius * Math.sin(angle) - 1 + (Math.random() - 0.5) * noise;
    
    data.push({
      features: [x, y],
      id: `moon2-${i}`
    });
  }

  return createDataset({
    id: 'moons',
    name: 'Two Moons',
    description: 'Two interleaving half-moon shapes',
    type: 'clustering',
    data,
    metadata: {
      featureNames: ['x', 'y'],
      numMoons: 2
    }
  });
}

/**
 * Generates a simple object detection dataset with 16x16 images
 * Each image contains a simple shape (square or circle) at a random position
 */
export function generateSimpleObjectDetection(
  samples: number = 80,
  imageSize: number = 16
): Dataset {
  const data: DataPoint[] = [];
  
  for (let i = 0; i < samples; i++) {
    // Create blank image
    const image: number[] = new Array(imageSize * imageSize).fill(0);
    
    // Randomly decide if this image has an object (80% chance)
    const hasObject = Math.random() > 0.2;
    
    if (hasObject) {
      // Random object size (30-50% of image size)
      const objectSize = Math.floor(imageSize * (0.3 + Math.random() * 0.2));
      
      // Random position (ensure object fits in image)
      const maxPos = imageSize - objectSize;
      const x = Math.floor(Math.random() * maxPos);
      const y = Math.floor(Math.random() * maxPos);
      
      // Draw a simple square object
      for (let row = y; row < y + objectSize; row++) {
        for (let col = x; col < x + objectSize; col++) {
          image[row * imageSize + col] = 1;
        }
      }
      
      data.push({
        features: image,
        label: 1, // Has object
        id: `image-${i}`
      });
    } else {
      // Background image (no object)
      data.push({
        features: image,
        label: 0, // No object
        id: `image-${i}`
      });
    }
  }

  return createDataset({
    id: 'simple-objects',
    name: 'Simple Objects (16x16)',
    description: 'Small images with centered objects',
    type: 'detection',
    data,
    metadata: {
      featureNames: Array.from({ length: imageSize * imageSize }, (_, i) => `pixel_${i}`),
      labelName: 'has_object',
      imageSize,
      classes: [0, 1]
    }
  });
}

/**
 * Generates an image features dataset for transfer learning
 * Simulates pre-extracted features from a pre-trained model (e.g., ResNet, VGG)
 * Features are high-dimensional vectors representing image content
 */
export function generateImageFeatures(
  samplesPerClass: number = 40,
  numClasses: number = 3,
  featureDim: number = 128
): Dataset {
  const data: DataPoint[] = [];
  
  // Generate features for each class
  for (let classIdx = 0; classIdx < numClasses; classIdx++) {
    // Each class has a different "prototype" feature vector
    const prototype: number[] = [];
    for (let i = 0; i < featureDim; i++) {
      // Create distinct patterns for each class
      prototype.push(Math.sin(classIdx * 2 + i * 0.1) + Math.cos(classIdx + i * 0.05));
    }
    
    // Generate samples around the prototype
    for (let i = 0; i < samplesPerClass; i++) {
      const features: number[] = [];
      
      for (let j = 0; j < featureDim; j++) {
        // Add noise to the prototype
        const noise = (Math.random() - 0.5) * 0.5;
        features.push((prototype[j] ?? 0) + noise);
      }
      
      data.push({
        features,
        label: classIdx,
        id: `class${classIdx}-${i}`
      });
    }
  }

  return createDataset({
    id: 'image-features',
    name: 'Image Features (3 classes)',
    description: 'Pre-extracted features from a pre-trained model',
    type: 'classification',
    data,
    metadata: {
      featureNames: Array.from({ length: featureDim }, (_, i) => `feature_${i}`),
      labelName: 'class',
      classes: Array.from({ length: numClasses }, (_, i) => i),
      featureDim,
      extractedFrom: 'simulated-pretrained-model'
    }
  });
}

/**
 * Generates a multi-object detection dataset with 16x16 images
 * Each image can contain multiple objects of different types
 */
export function generateMultiObjectDetection(
  samples: number = 100,
  imageSize: number = 16
): Dataset {
  const data: DataPoint[] = [];
  
  for (let i = 0; i < samples; i++) {
    // Create blank image
    const image: number[] = new Array(imageSize * imageSize).fill(0);
    
    // Randomly decide number of objects (0-2)
    const numObjects = Math.floor(Math.random() * 3);
    
    let label = 0; // Default: no object
    
    for (let obj = 0; obj < numObjects; obj++) {
      // Random object size (20-40% of image size)
      const objectSize = Math.floor(imageSize * (0.2 + Math.random() * 0.2));
      
      // Random position (ensure object fits in image)
      const maxPos = imageSize - objectSize;
      const x = Math.floor(Math.random() * maxPos);
      const y = Math.floor(Math.random() * maxPos);
      
      // Random object type (1, 2, or 3)
      const objectType = Math.floor(Math.random() * 3) + 1;
      const intensity = objectType * 0.33; // Different intensities for different types
      
      // Draw object
      for (let row = y; row < y + objectSize; row++) {
        for (let col = x; col < x + objectSize; col++) {
          const idx = row * imageSize + col;
          // Use max to avoid overwriting with lower intensity
          image[idx] = Math.max(image[idx], intensity);
        }
      }
      
      // Set label to the highest object type present
      label = Math.max(label, objectType);
    }
    
    data.push({
      features: image,
      label,
      id: `image-${i}`
    });
  }

  return createDataset({
    id: 'multi-objects',
    name: 'Multiple Objects (16x16)',
    description: 'Images with multiple objects to detect',
    type: 'detection',
    data,
    metadata: {
      featureNames: Array.from({ length: imageSize * imageSize }, (_, i) => `pixel_${i}`),
      labelName: 'object_type',
      imageSize,
      classes: [0, 1, 2, 3]
    }
  });
}
