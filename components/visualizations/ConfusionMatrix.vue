<template>
  <div class="confusion-matrix-container">
    <Heatmap
      :data="confusionMatrix"
      :xLabels="xLabels"
      :yLabels="yLabels"
      :title="title"
      colorscale="Blues"
      :showScale="true"
      :showAnnotations="true"
      :loading="loading"
      :error="error"
      :height="height"
      :reverseY="true"
    />
    
    <div v-if="showMetrics && metrics" class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Accuracy</div>
        <div class="metric-value">{{ (metrics.accuracy * 100).toFixed(2) }}%</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">Precision</div>
        <div class="metric-value">{{ (metrics.precision * 100).toFixed(2) }}%</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">Recall</div>
        <div class="metric-value">{{ (metrics.recall * 100).toFixed(2) }}%</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">F1 Score</div>
        <div class="metric-value">{{ (metrics.f1Score * 100).toFixed(2) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Heatmap from './Heatmap.vue';

interface Props {
  confusionMatrix: number[][];
  classLabels?: string[];
  title?: string;
  showMetrics?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confusion Matrix',
  showMetrics: true,
  loading: false,
  error: null,
  height: '500px',
});

const xLabels = computed(() => {
  if (props.classLabels) {
    return props.classLabels.map(label => `Predicted ${label}`);
  }
  if (!props.confusionMatrix || props.confusionMatrix.length === 0 || !props.confusionMatrix[0]) {
    return [];
  }
  return props.confusionMatrix[0].map((_, i) => `Predicted ${i}`);
});

const yLabels = computed(() => {
  if (props.classLabels) {
    return props.classLabels.map(label => `Actual ${label}`);
  }
  if (!props.confusionMatrix || props.confusionMatrix.length === 0) {
    return [];
  }
  return props.confusionMatrix.map((_, i) => `Actual ${i}`);
});

interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

const metrics = computed<Metrics | null>(() => {
  if (!props.confusionMatrix || props.confusionMatrix.length === 0) {
    return null;
  }

  const matrix = props.confusionMatrix;
  const numClasses = matrix.length;
  
  // Calculate total samples
  let total = 0;
  let correctPredictions = 0;
  
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      total += matrix[i][j];
      if (i === j) {
        correctPredictions += matrix[i][j];
      }
    }
  }
  
  // Accuracy
  const accuracy = total > 0 ? correctPredictions / total : 0;
  
  // For multi-class, calculate macro-averaged precision and recall
  let totalPrecision = 0;
  let totalRecall = 0;
  let validClasses = 0;
  
  for (let i = 0; i < numClasses; i++) {
    // True Positives for class i
    const tp = matrix[i][i];
    
    // False Positives for class i (sum of column i, excluding diagonal)
    let fp = 0;
    for (let j = 0; j < numClasses; j++) {
      if (j !== i) {
        fp += matrix[j][i];
      }
    }
    
    // False Negatives for class i (sum of row i, excluding diagonal)
    let fn = 0;
    for (let j = 0; j < numClasses; j++) {
      if (j !== i) {
        fn += matrix[i][j];
      }
    }
    
    // Precision for class i
    const classPrecision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    
    // Recall for class i
    const classRecall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    
    if ((tp + fp) > 0 || (tp + fn) > 0) {
      totalPrecision += classPrecision;
      totalRecall += classRecall;
      validClasses++;
    }
  }
  
  // Macro-averaged metrics
  const precision = validClasses > 0 ? totalPrecision / validClasses : 0;
  const recall = validClasses > 0 ? totalRecall / validClasses : 0;
  
  // F1 Score
  const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score,
  };
});
</script>

<style scoped>
.confusion-matrix-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}
</style>
