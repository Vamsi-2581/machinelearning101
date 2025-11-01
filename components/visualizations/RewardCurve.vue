<template>
  <BaseChart
    :data="plotlyData"
    :layout="plotlyLayout"
    :config="plotlyConfig"
    :loading="loading"
    :error="error"
    :height="height"
  />
</template>

<script setup lang="ts">
/**
 * RewardCurve Visualization Component
 * 
 * Displays cumulative rewards over time for reinforcement learning algorithms,
 * particularly useful for multi-armed bandit problems.
 * 
 * Requirements: 4.3, 16.1, 16.2
 */

import { computed } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';
import BaseChart from './BaseChart.vue';

export interface RewardData {
  x: number[];
  y: number[];
  name: string;
  color?: string;
  showMarkers?: boolean;
  fill?: boolean;
}

interface Props {
  rewards: RewardData[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  showLegend?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
  showGrid?: boolean;
  showOptimalLine?: boolean;
  optimalValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Cumulative Rewards',
  xLabel: 'Trial',
  yLabel: 'Cumulative Reward',
  showLegend: true,
  loading: false,
  error: null,
  height: '400px',
  showGrid: true,
  showOptimalLine: false,
});

const defaultColors = [
  '#10b981', // green
  '#3b82f6', // blue
  '#ef4444', // red
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const plotlyData = computed(() => {
  if (!props.rewards || props.rewards.length === 0) {
    return [];
  }
  
  const traces = props.rewards.map((reward, index) => {
    if (!reward || !Array.isArray(reward.x) || !Array.isArray(reward.y)) {
      console.error('Invalid reward data:', reward);
      return null;
    }
    
    const trace: any = {
      x: reward.x,
      y: reward.y,
      type: 'scatter',
      mode: reward.showMarkers ? 'lines+markers' : 'lines',
      name: reward.name,
      line: {
        color: reward.color || defaultColors[index % defaultColors.length],
        width: 2,
      },
      hovertemplate: 
        `<b>${reward.name}</b><br>` +
        `${props.xLabel}: %{x}<br>` +
        `${props.yLabel}: %{y:.2f}<br>` +
        '<extra></extra>',
    };
    
    // Only add marker if showMarkers is true
    if (reward.showMarkers) {
      trace.marker = {
        size: 4,
        color: reward.color || defaultColors[index % defaultColors.length],
      };
    }
    
    // Only add fill properties if fill is true
    if (reward.fill) {
      trace.fill = 'tozeroy';
      trace.fillcolor = `${reward.color || defaultColors[index % defaultColors.length]}20`;
    }
    
    return trace;
  }).filter(d => d !== null);

  // Add optimal line if requested
  if (props.showOptimalLine && props.optimalValue !== undefined && props.rewards.length > 0 && props.rewards[0].x.length > 0) {
    const maxX = Math.max(...props.rewards[0].x);
    traces.push({
      x: [0, maxX],
      y: [0, props.optimalValue * maxX],
      type: 'scatter',
      mode: 'lines',
      name: 'Optimal',
      line: {
        color: '#9ca3af',
        width: 2,
        dash: 'dash',
      },
      hovertemplate: 
        '<b>Optimal</b><br>' +
        `${props.xLabel}: %{x}<br>` +
        `${props.yLabel}: %{y:.2f}<br>` +
        '<extra></extra>',
    });
  }

  return traces;
});

const plotlyLayout = computed<Partial<Layout>>(() => ({
  title: props.title ? {
    text: props.title,
    font: { size: 16, weight: 600 },
  } : undefined,
  xaxis: {
    title: props.xLabel,
    showgrid: props.showGrid,
    gridcolor: '#e5e7eb',
    zeroline: true,
    zerolinecolor: '#9ca3af',
  },
  yaxis: {
    title: props.yLabel,
    showgrid: props.showGrid,
    gridcolor: '#e5e7eb',
    zeroline: true,
    zerolinecolor: '#9ca3af',
  },
  showlegend: props.showLegend,
  legend: {
    x: 1,
    xanchor: 'right',
    y: 1,
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    bordercolor: '#e5e7eb',
    borderwidth: 1,
  },
  hovermode: 'x unified',
  margin: {
    l: 60,
    r: 20,
    t: props.title ? 60 : 20,
    b: 60,
  },
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'reward_curve',
    height: 600,
    width: 1000,
    scale: 2,
  },
}));
</script>
