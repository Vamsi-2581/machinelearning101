<template>
  <ClientOnly>
  <BaseChart
    :data="plotlyData"
    :layout="plotlyLayout"
    :config="plotlyConfig"
    :loading="loading"
    :error="error"
    :height="height"
  />
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';
import BaseChart from './BaseChart.vue';

interface Props {
  data: number[][];
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
  colorscale?: string | Array<[number, string]>;
  showScale?: boolean;
  showAnnotations?: boolean;
  annotationFormat?: string;
  loading?: boolean;
  error?: string | null;
  height?: string;
  reverseY?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  colorscale: 'Blues',
  showScale: true,
  showAnnotations: true,
  annotationFormat: '.2f',
  loading: false,
  error: null,
  height: '500px',
  reverseY: true,
});

const plotlyData = computed(() => {
  const annotations: any[] = [];
  
  if (props.showAnnotations) {
    props.data.forEach((row, i) => {
      row.forEach((value, j) => {
        annotations.push({
          x: props.xLabels ? props.xLabels[j] : j,
          y: props.yLabels ? props.yLabels[i] : i,
          text: typeof value === 'number' ? value.toFixed(2) : String(value),
          showarrow: false,
          font: {
            color: getTextColor(value, props.data),
            size: 12,
          },
        });
      });
    });
  }

  return [{
    z: props.data,
    x: props.xLabels || props.data[0]?.map((_, i) => i),
    y: props.yLabels || props.data.map((_, i) => i),
    type: 'heatmap',
    colorscale: props.colorscale,
    showscale: props.showScale,
    hovertemplate: 
      (props.xLabels ? 'X: %{x}<br>' : 'Column: %{x}<br>') +
      (props.yLabels ? 'Y: %{y}<br>' : 'Row: %{y}<br>') +
      'Value: %{z}<br>' +
      '<extra></extra>',
    colorbar: props.showScale ? {
      thickness: 15,
      len: 0.7,
      tickfont: { size: 10 },
    } : undefined,
  }];
});

const plotlyLayout = computed<Partial<Layout>>(() => ({
  title: props.title ? {
    text: props.title,
    font: { size: 16, weight: 600 },
  } : undefined,
  xaxis: {
    title: '',
    side: 'bottom',
    tickangle: props.xLabels && props.xLabels.some(l => l.length > 3) ? -45 : 0,
    showgrid: false,
  },
  yaxis: {
    title: '',
    autorange: props.reverseY ? 'reversed' : true,
    showgrid: false,
  },
  annotations: props.showAnnotations ? getAnnotations() : [],
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoom2d', 'pan2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'heatmap',
    height: 800,
    width: 800,
    scale: 2,
  },
}));

const getAnnotations = () => {
  const annotations: any[] = [];
  
  props.data.forEach((row, i) => {
    row.forEach((value, j) => {
      annotations.push({
        x: props.xLabels ? props.xLabels[j] : j,
        y: props.yLabels ? props.yLabels[i] : i,
        text: typeof value === 'number' ? value.toFixed(2) : String(value),
        showarrow: false,
        font: {
          color: getTextColor(value, props.data),
          size: 12,
        },
      });
    });
  });
  
  return annotations;
};

const getTextColor = (value: number, data: number[][]): string => {
  // Calculate min and max for normalization
  const flatData = data.flat();
  const min = Math.min(...flatData);
  const max = Math.max(...flatData);
  
  // Normalize value between 0 and 1
  const normalized = (value - min) / (max - min);
  
  // Use white text for dark backgrounds (high values), black for light backgrounds
  return normalized > 0.5 ? 'white' : 'black';
};
</script>
