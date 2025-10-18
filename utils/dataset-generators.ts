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
