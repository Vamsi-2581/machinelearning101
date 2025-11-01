/**
 * Composable for loading and managing datasets
 */

import type { Dataset, DatasetType } from '~/types/dataset';
import {
  generateSimpleLinear,
  generateNoisyLinear,
  generatePolynomial,
  generateBinaryClassification,
  generateMultiClassification,
  generateBlobs,
  generateCircles,
  generateMoons,
  generateImageFeatures,
  generateSimpleObjectDetection,
  generateMultiObjectDetection
} from '~/utils/dataset-generators';

export interface DatasetOption {
  id: string;
  name: string;
  description: string;
  type: DatasetType;
  generator: () => Dataset;
}

/**
 * Registry of all available datasets
 */
const datasetRegistry: DatasetOption[] = [
  // Regression datasets
  {
    id: 'simple-linear',
    name: 'Simple Linear',
    description: 'A simple linear relationship with minimal noise',
    type: 'regression',
    generator: () => generateSimpleLinear()
  },
  {
    id: 'noisy-linear',
    name: 'Noisy Linear',
    description: 'A linear relationship with significant noise',
    type: 'regression',
    generator: () => generateNoisyLinear()
  },
  {
    id: 'polynomial',
    name: 'Polynomial',
    description: 'A quadratic relationship',
    type: 'regression',
    generator: () => generatePolynomial()
  },
  
  // Classification datasets
  {
    id: 'binary-classification',
    name: 'Binary Classification',
    description: 'Two well-separated classes',
    type: 'classification',
    generator: () => generateBinaryClassification()
  },
  {
    id: 'multi-classification',
    name: 'Multi-Class Classification',
    description: '3 classes arranged in a circle',
    type: 'classification',
    generator: () => generateMultiClassification()
  },
  {
    id: 'image-features',
    name: 'Image Features (3 classes)',
    description: 'Pre-extracted features from a pre-trained model',
    type: 'classification',
    generator: () => generateImageFeatures()
  },
  
  // Clustering datasets
  {
    id: 'blobs',
    name: 'Blob Clusters',
    description: 'Gaussian blob clusters',
    type: 'clustering',
    generator: () => generateBlobs()
  },
  {
    id: 'circles',
    name: 'Concentric Circles',
    description: 'Two concentric circles',
    type: 'clustering',
    generator: () => generateCircles()
  },
  {
    id: 'moons',
    name: 'Two Moons',
    description: 'Two interleaving half-moon shapes',
    type: 'clustering',
    generator: () => generateMoons()
  },
  
  // Object detection datasets
  {
    id: 'simple-objects',
    name: 'Simple Objects (16x16)',
    description: 'Small images with centered objects',
    type: 'detection',
    generator: () => generateSimpleObjectDetection()
  },
  {
    id: 'multi-objects',
    name: 'Multiple Objects (16x16)',
    description: 'Images with multiple objects to detect',
    type: 'detection',
    generator: () => generateMultiObjectDetection()
  }
];

export function useDataset() {
  const currentDataset = ref<Dataset | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Get all available datasets
   */
  const getAvailableDatasets = (): DatasetOption[] => {
    return datasetRegistry;
  };

  /**
   * Get datasets filtered by type
   */
  const getDatasetsByType = (type: DatasetType): DatasetOption[] => {
    return datasetRegistry.filter(d => d.type === type);
  };

  /**
   * Get a specific dataset option by ID
   */
  const getDatasetOption = (id: string): DatasetOption | undefined => {
    return datasetRegistry.find(d => d.id === id);
  };

  /**
   * Load a dataset by ID
   */
  const loadDataset = async (id: string): Promise<Dataset | null> => {
    loading.value = true;
    error.value = null;

    try {
      const option = getDatasetOption(id);
      
      if (!option) {
        throw new Error(`Dataset with id "${id}" not found`);
      }

      // Generate the dataset
      const dataset = option.generator();
      
      currentDataset.value = dataset;
      return dataset;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load dataset';
      console.error('Error loading dataset:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load a custom dataset
   */
  const loadCustomDataset = (dataset: Dataset): void => {
    currentDataset.value = dataset;
  };

  /**
   * Clear the current dataset
   */
  const clearDataset = (): void => {
    currentDataset.value = null;
    error.value = null;
  };

  /**
   * Get preview data for a dataset (first N points)
   */
  const getDatasetPreview = (dataset: Dataset, maxPoints: number = 10) => {
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      type: dataset.type,
      features: dataset.features,
      samples: dataset.samples,
      previewData: dataset.data.slice(0, maxPoints),
      metadata: dataset.metadata
    };
  };

  /**
   * Get statistics about the current dataset
   */
  const getDatasetStats = computed(() => {
    if (!currentDataset.value) return null;

    const dataset = currentDataset.value;
    const stats: any = {
      samples: dataset.samples,
      features: dataset.features,
      type: dataset.type
    };

    // Calculate feature statistics
    if (dataset.data.length > 0) {
      const featureStats = [];
      
      for (let i = 0; i < dataset.features; i++) {
        const values = dataset.data.map(d => d.features[i]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        
        featureStats.push({
          index: i,
          name: dataset.metadata?.featureNames?.[i] || `Feature ${i}`,
          min,
          max,
          mean,
          range: max - min
        });
      }
      
      stats.featureStats = featureStats;
    }

    // Calculate label statistics for supervised learning
    if (dataset.type === 'classification') {
      const labels = dataset.data.map(d => d.label).filter(l => l !== undefined);
      const uniqueLabels = [...new Set(labels)];
      const labelCounts = uniqueLabels.map(label => ({
        label,
        count: labels.filter(l => l === label).length
      }));
      
      stats.labelStats = {
        uniqueLabels: uniqueLabels.length,
        distribution: labelCounts
      };
    } else if (dataset.type === 'regression') {
      const labels = dataset.data.map(d => d.label as number).filter(l => l !== undefined);
      if (labels.length > 0) {
        stats.labelStats = {
          min: Math.min(...labels),
          max: Math.max(...labels),
          mean: labels.reduce((a, b) => a + b, 0) / labels.length
        };
      }
    }

    return stats;
  });

  return {
    // State
    currentDataset: readonly(currentDataset),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    datasetStats: getDatasetStats,
    
    // Methods
    getAvailableDatasets,
    getDatasetsByType,
    getDatasetOption,
    loadDataset,
    loadCustomDataset,
    clearDataset,
    getDatasetPreview
  };
}
