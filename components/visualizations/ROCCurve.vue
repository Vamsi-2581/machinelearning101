<template>
  <div class="roc-curve-container">
    <BaseChart
      :data="plotlyData"
      :layout="plotlyLayout"
      :config="plotlyConfig"
      :loading="loading"
      :error="error"
      :height="height"
    />
    
    <div v-if="showAUC && auc !== null" class="auc-display">
      <div class="auc-label">Area Under Curve (AUC)</div>
      <div class="auc-value">{{ auc.toFixed(4) }}</div>
      <div class="auc-interpretation">
        {{ getAUCInterpretation(auc) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';
import BaseChart from './BaseChart.vue';

interface Props {
  fpr: number[];
  tpr: number[];
  auc?: number | null;
  title?: string;
  showDiagonal?: boolean;
  showAUC?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  auc: null,
  title: 'ROC Curve',
  showDiagonal: true,
  showAUC: true,
  loading: false,
  error: null,
  height: '500px',
});

const plotlyData = computed(() => {
  const traces: any[] = [];
  
  // ROC Curve
  traces.push({
    x: props.fpr,
    y: props.tpr,
    type: 'scatter',
    mode: 'lines',
    name: `ROC Curve${props.auc !== null ? ` (AUC = ${props.auc.toFixed(4)})` : ''}`,
    line: {
      color: '#3b82f6',
      width: 3,
    },
    hovertemplate: 
      'FPR: %{x:.4f}<br>' +
      'TPR: %{y:.4f}<br>' +
      '<extra></extra>',
  });
  
  // Diagonal reference line (random classifier)
  if (props.showDiagonal) {
    traces.push({
      x: [0, 1],
      y: [0, 1],
      type: 'scatter',
      mode: 'lines',
      name: 'Random Classifier',
      line: {
        color: '#9ca3af',
        width: 2,
        dash: 'dash',
      },
      hoverinfo: 'skip',
    });
  }
  
  return traces;
});

const plotlyLayout = computed<Partial<Layout>>(() => ({
  title: {
    text: props.title,
    font: { size: 16, weight: 600 },
  },
  xaxis: {
    title: 'False Positive Rate',
    range: [0, 1],
    showgrid: true,
    gridcolor: '#e5e7eb',
    zeroline: true,
  },
  yaxis: {
    title: 'True Positive Rate',
    range: [0, 1],
    showgrid: true,
    gridcolor: '#e5e7eb',
    zeroline: true,
  },
  showlegend: true,
  legend: {
    x: 0.6,
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
    filename: 'roc_curve',
    height: 800,
    width: 800,
    scale: 2,
  },
}));

const getAUCInterpretation = (auc: number): string => {
  if (auc >= 0.9) {
    return 'Excellent classifier';
  } else if (auc >= 0.8) {
    return 'Good classifier';
  } else if (auc >= 0.7) {
    return 'Fair classifier';
  } else if (auc >= 0.6) {
    return 'Poor classifier';
  } else {
    return 'Very poor classifier';
  }
};
</script>

<style scoped>
.roc-curve-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auc-display {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.auc-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.auc-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auc-interpretation {
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 600;
}
</style>
