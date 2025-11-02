<template>
  <div class="cross-validation-container">
    <!-- Fold Performance Chart -->
     <ClientOnly>
    <BaseChart
      :data="performanceData"
      :layout="performanceLayout"
      :config="plotlyConfig"
      :loading="loading"
      :error="error"
      :height="chartHeight"
    />
    </ClientOnly>
    <!-- Statistics Summary -->
    <div v-if="showStats && stats" class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Mean Score</div>
        <div class="stat-value">{{ stats.mean.toFixed(4) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Std Deviation</div>
        <div class="stat-value">{{ stats.std.toFixed(4) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Min Score</div>
        <div class="stat-value">{{ stats.min.toFixed(4) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Max Score</div>
        <div class="stat-value">{{ stats.max.toFixed(4) }}</div>
      </div>
    </div>
    
    <!-- Train/Test Split Visualization -->
    <div v-if="showSplits" class="splits-section">
      <h3 class="splits-title">Train/Test Splits</h3>
      <div class="splits-grid">
        <div 
          v-for="(fold, index) in foldScores" 
          :key="index"
          class="split-row"
        >
          <div class="fold-label">Fold {{ index + 1 }}</div>
          <div class="split-bar">
            <div 
              v-for="(segment, segIndex) in getSplitSegments(index)"
              :key="segIndex"
              class="split-segment"
              :class="segment.type"
              :style="{ width: segment.width + '%' }"
              :title="segment.tooltip"
            >
              {{ segment.label }}
            </div>
          </div>
          <div class="fold-score">{{ fold.toFixed(3) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';

interface Props {
  foldScores: number[];
  metricName?: string;
  title?: string;
  showStats?: boolean;
  showSplits?: boolean;
  numFolds?: number;
  loading?: boolean;
  error?: string | null;
  chartHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  metricName: 'Score',
  title: 'Cross-Validation Results',
  showStats: true,
  showSplits: true,
  loading: false,
  error: null,
  chartHeight: '400px',
});

const numFolds = computed(() => props.numFolds || props.foldScores.length);

const performanceData = computed(() => {
  const foldLabels = props.foldScores.map((_, i) => `Fold ${i + 1}`);
  
  return [{
    x: foldLabels,
    y: props.foldScores,
    type: 'bar',
    marker: {
      color: props.foldScores.map(score => {
        const mean = stats.value?.mean || 0;
        return score >= mean ? '#10b981' : '#3b82f6';
      }),
      line: {
        color: '#1f2937',
        width: 1,
      },
    },
    hovertemplate: 
      'Fold: %{x}<br>' +
      `${props.metricName}: %{y:.4f}<br>` +
      '<extra></extra>',
  }];
});

const performanceLayout = computed<Partial<Layout>>(() => ({
  title: {
    text: props.title,
    font: { size: 16, weight: 600 },
  },
  xaxis: {
    title: 'Fold',
    showgrid: false,
  },
  yaxis: {
    title: props.metricName,
    showgrid: true,
    gridcolor: '#e5e7eb',
  },
  shapes: stats.value ? [
    // Mean line
    {
      type: 'line',
      x0: -0.5,
      x1: props.foldScores.length - 0.5,
      y0: stats.value.mean,
      y1: stats.value.mean,
      line: {
        color: '#ef4444',
        width: 2,
        dash: 'dash',
      },
    },
  ] : [],
  annotations: stats.value ? [
    {
      x: props.foldScores.length - 1,
      y: stats.value.mean,
      text: `Mean: ${stats.value.mean.toFixed(4)}`,
      showarrow: false,
      xanchor: 'left',
      xshift: 10,
      font: {
        color: '#ef4444',
        size: 12,
        weight: 600,
      },
    },
  ] : [],
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'cross_validation',
    height: 800,
    width: 800,
    scale: 2,
  },
}));

interface Stats {
  mean: number;
  std: number;
  min: number;
  max: number;
}

const stats = computed<Stats | null>(() => {
  if (props.foldScores.length === 0) {
    return null;
  }
  
  const mean = props.foldScores.reduce((sum, score) => sum + score, 0) / props.foldScores.length;
  
  const variance = props.foldScores.reduce((sum, score) => {
    return sum + Math.pow(score - mean, 2);
  }, 0) / props.foldScores.length;
  
  const std = Math.sqrt(variance);
  const min = Math.min(...props.foldScores);
  const max = Math.max(...props.foldScores);
  
  return { mean, std, min, max };
});

interface SplitSegment {
  type: 'train' | 'test';
  width: number;
  label: string;
  tooltip: string;
}

const getSplitSegments = (foldIndex: number): SplitSegment[] => {
  const segments: SplitSegment[] = [];
  const folds = numFolds.value;
  const segmentWidth = 100 / folds;
  
  for (let i = 0; i < folds; i++) {
    const isTest = i === foldIndex;
    segments.push({
      type: isTest ? 'test' : 'train',
      width: segmentWidth,
      label: isTest ? 'Test' : '',
      tooltip: isTest ? 'Test Set' : 'Training Set',
    });
  }
  
  return segments;
};
</script>

<style scoped>
.cross-validation-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.splits-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.splits-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.splits-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.split-row {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  align-items: center;
  gap: 1rem;
}

.fold-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.split-bar {
  display: flex;
  height: 32px;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.split-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  transition: opacity 0.2s;
}

.split-segment:hover {
  opacity: 0.8;
}

.split-segment.train {
  background: #3b82f6;
}

.split-segment.test {
  background: #10b981;
}

.fold-score {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  text-align: right;
}
</style>
