<template>
  <div class="learning-curves-container">
    <BaseChart
      :data="plotlyData"
      :layout="plotlyLayout"
      :config="plotlyConfig"
      :loading="loading"
      :error="error"
      :height="height"
    />
    
    <div v-if="showIndicators && indicator" class="indicator-card" :class="indicator.type">
      <div class="indicator-icon">{{ indicator.icon }}</div>
      <div class="indicator-content">
        <div class="indicator-title">{{ indicator.title }}</div>
        <div class="indicator-description">{{ indicator.description }}</div>
        <div v-if="indicator.suggestion" class="indicator-suggestion">
          💡 {{ indicator.suggestion }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';

interface Props {
  trainingSizes: number[];
  trainingScores: number[];
  validationScores: number[];
  metricName?: string;
  title?: string;
  showIndicators?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  metricName: 'Score',
  title: 'Learning Curves',
  showIndicators: true,
  loading: false,
  error: null,
  height: '500px',
});

const plotlyData = computed(() => {
  const traces: any[] = [];
  
  // Training score line
  traces.push({
    x: props.trainingSizes,
    y: props.trainingScores,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Training Score',
    line: {
      color: '#3b82f6',
      width: 3,
    },
    marker: {
      size: 8,
      symbol: 'circle',
    },
    hovertemplate: 
      'Training Size: %{x}<br>' +
      `${props.metricName}: %{y:.4f}<br>` +
      '<extra></extra>',
  });
  
  // Validation score line
  traces.push({
    x: props.trainingSizes,
    y: props.validationScores,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Validation Score',
    line: {
      color: '#10b981',
      width: 3,
    },
    marker: {
      size: 8,
      symbol: 'circle',
    },
    hovertemplate: 
      'Training Size: %{x}<br>' +
      `${props.metricName}: %{y:.4f}<br>` +
      '<extra></extra>',
  });
  
  return traces;
});

const plotlyLayout = computed<Partial<Layout>>(() => ({
  title: {
    text: props.title,
    font: { size: 16, weight: 600 },
  },
  xaxis: {
    title: 'Training Set Size',
    showgrid: true,
    gridcolor: '#e5e7eb',
  },
  yaxis: {
    title: props.metricName,
    showgrid: true,
    gridcolor: '#e5e7eb',
  },
  showlegend: true,
  legend: {
    x: 0.7,
    y: 0.1,
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    bordercolor: '#e5e7eb',
    borderwidth: 1,
  },
  hovermode: 'closest',
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'learning_curves',
    height: 800,
    width: 800,
    scale: 2,
  },
}));

interface Indicator {
  type: 'good' | 'overfitting' | 'underfitting' | 'high-variance';
  icon: string;
  title: string;
  description: string;
  suggestion?: string;
}

const indicator = computed<Indicator | null>(() => {
  if (props.trainingScores.length === 0 || props.validationScores.length === 0) {
    return null;
  }
  
  const lastTrainScore = props.trainingScores[props.trainingScores.length - 1];
  const lastValScore = props.validationScores[props.validationScores.length - 1];
  const gap = lastTrainScore - lastValScore;
  
  // Check if both scores are low
  if (lastTrainScore < 0.7 && lastValScore < 0.7) {
    return {
      type: 'underfitting',
      icon: '📉',
      title: 'Underfitting Detected',
      description: 'Both training and validation scores are low. The model is too simple to capture the underlying patterns.',
      suggestion: 'Try increasing model complexity, adding more features, or reducing regularization.',
    };
  }
  
  // Check for large gap (overfitting)
  if (gap > 0.1 && lastTrainScore > 0.8) {
    return {
      type: 'overfitting',
      icon: '⚠️',
      title: 'Overfitting Detected',
      description: 'Training score is significantly higher than validation score. The model is memorizing the training data.',
      suggestion: 'Try adding regularization, reducing model complexity, or collecting more training data.',
    };
  }
  
  // Check for high variance (curves not converging)
  if (gap > 0.05 && gap <= 0.1) {
    return {
      type: 'high-variance',
      icon: '📊',
      title: 'High Variance',
      description: 'There is a noticeable gap between training and validation scores.',
      suggestion: 'Consider adding more training data or applying regularization techniques.',
    };
  }
  
  // Good fit
  if (gap <= 0.05 && lastValScore > 0.7) {
    return {
      type: 'good',
      icon: '✅',
      title: 'Good Fit',
      description: 'Training and validation scores are close and reasonably high. The model generalizes well.',
    };
  }
  
  return null;
});
</script>

<style scoped>
.learning-curves-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.indicator-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid;
  background: white;
}

.indicator-card.good {
  border-color: #10b981;
  background: #f0fdf4;
}

.indicator-card.overfitting {
  border-color: #ef4444;
  background: #fef2f2;
}

.indicator-card.underfitting {
  border-color: #f59e0b;
  background: #fffbeb;
}

.indicator-card.high-variance {
  border-color: #3b82f6;
  background: #eff6ff;
}

.indicator-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.indicator-content {
  flex: 1;
}

.indicator-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.indicator-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.indicator-suggestion {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}
</style>
