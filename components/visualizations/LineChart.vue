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

export interface LineSeries {
  x: number[];
  y: number[];
  name: string;
  color?: string;
  dash?: 'solid' | 'dot' | 'dash' | 'dashdot';
  width?: number;
  showMarkers?: boolean;
}

interface Props {
  series: LineSeries[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  showLegend?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  logScale?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  xLabel: 'X',
  yLabel: 'Y',
  showLegend: true,
  loading: false,
  error: null,
  height: '400px',
  showGrid: true,
  logScale: false,
});

const defaultColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

const dashStyles: Record<string, string> = {
  solid: 'solid',
  dot: 'dot',
  dash: 'dash',
  dashdot: 'dashdot',
};

const plotlyData = computed(() => {
  if (!props.series || props.series.length === 0) {
    return [];
  }
  
  return props.series.map((s, index) => {
    if (!s || !Array.isArray(s.x) || !Array.isArray(s.y)) {
      console.error('Invalid series data:', s);
      return null;
    }
    
    const trace: any = {
      x: s.x,
      y: s.y,
      type: 'scatter',
      mode: s.showMarkers ? 'lines+markers' : 'lines',
      name: s.name,
      line: {
        color: s.color || defaultColors[index % defaultColors.length],
        width: s.width || 2,
        dash: dashStyles[s.dash || 'solid'],
      },
      hovertemplate: 
        `<b>${s.name}</b><br>` +
        `${props.xLabel}: %{x}<br>` +
        `${props.yLabel}: %{y:.4f}<br>` +
        '<extra></extra>',
    };
    
    if (s.showMarkers) {
      trace.marker = {
        size: 6,
        color: s.color || defaultColors[index % defaultColors.length],
      };
    }
    
    return trace;
  }).filter(d => d !== null);
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
    range: props.xRange,
  },
  yaxis: {
    title: props.yLabel,
    showgrid: props.showGrid,
    gridcolor: '#e5e7eb',
    zeroline: true,
    zerolinecolor: '#9ca3af',
    range: props.yRange,
    type: props.logScale ? 'log' : 'linear',
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
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'line_chart',
    height: 600,
    width: 1000,
    scale: 2,
  },
}));
</script>
