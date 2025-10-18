<template>
  <figure 
    class="base-chart-wrapper" 
    ref="wrapperRef"
    role="img"
    :aria-label="ariaLabel || 'Data visualization'"
    :aria-describedby="ariaDescribedby"
  >
    <div v-if="loading" class="chart-loading" role="status" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Loading visualization...</p>
    </div>
    
    <div v-else-if="error" class="chart-error" role="alert" aria-live="assertive">
      <div class="error-icon" aria-hidden="true">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button 
        v-if="onRetry" 
        @click="onRetry" 
        class="retry-button"
        aria-label="Retry loading visualization"
      >
        Retry
      </button>
    </div>
    
    <div 
      v-show="!loading && !error"
      ref="chartRef" 
      class="chart-container"
      :style="{ width: '100%', height: height }"
      role="img"
      :aria-label="ariaLabel || 'Interactive data visualization'"
      tabindex="0"
    ></div>
    
    <!-- Screen reader description -->
    <figcaption v-if="description" :id="descriptionId" class="sr-only">
      {{ description }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist-min';

interface Props {
  data: any[];
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  loading?: boolean;
  error?: string | null;
  height?: string;
  onRetry?: () => void;
  ariaLabel?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  layout: () => ({}),
  config: () => ({}),
  loading: false,
  error: null,
  height: '400px',
});

// Generate unique ID for aria-describedby
const descriptionId = `chart-desc-${Math.random().toString(36).substr(2, 9)}`;
const ariaDescribedby = computed(() => props.description ? descriptionId : undefined);

const emit = defineEmits<{
  plotlyClick: [event: Plotly.PlotMouseEvent];
  plotlyHover: [event: Plotly.PlotMouseEvent];
  plotlyUnhover: [event: Plotly.PlotMouseEvent];
  plotlySelected: [event: Plotly.PlotSelectionEvent];
  ready: [];
}>();

const chartRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const defaultLayout: Partial<Plotly.Layout> = {
  autosize: true,
  margin: { l: 50, r: 50, t: 50, b: 50 },
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: {
    family: 'system-ui, -apple-system, sans-serif',
    size: 12,
    color: '#374151',
  },
};

const defaultConfig: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
};

const createPlot = async () => {
  if (!chartRef.value || props.loading || props.error) return;

  try {
    const mergedLayout = { ...defaultLayout, ...props.layout };
    const mergedConfig = { ...defaultConfig, ...props.config };

    await Plotly.newPlot(
      chartRef.value,
      props.data,
      mergedLayout,
      mergedConfig
    );

    // Attach event listeners
    chartRef.value.on('plotly_click', (data: Plotly.PlotMouseEvent) => {
      emit('plotlyClick', data);
    });

    chartRef.value.on('plotly_hover', (data: Plotly.PlotMouseEvent) => {
      emit('plotlyHover', data);
    });

    chartRef.value.on('plotly_unhover', (data: Plotly.PlotMouseEvent) => {
      emit('plotlyUnhover', data);
    });

    chartRef.value.on('plotly_selected', (data: Plotly.PlotSelectionEvent) => {
      emit('plotlySelected', data);
    });

    emit('ready');
  } catch (err) {
    console.error('Error creating Plotly chart:', err);
  }
};

const updatePlot = async () => {
  if (!chartRef.value || props.loading || props.error) return;

  try {
    const mergedLayout = { ...defaultLayout, ...props.layout };
    await Plotly.react(chartRef.value, props.data, mergedLayout);
  } catch (err) {
    console.error('Error updating Plotly chart:', err);
  }
};

const handleResize = () => {
  if (chartRef.value && !props.loading && !props.error) {
    Plotly.Plots.resize(chartRef.value);
  }
};

onMounted(async () => {
  await nextTick();
  
  if (!props.loading && !props.error) {
    await createPlot();
  }

  // Set up resize observer for responsive behavior
  if (wrapperRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.value.observe(wrapperRef.value);
  }
});

onBeforeUnmount(() => {
  if (chartRef.value) {
    Plotly.purge(chartRef.value);
  }
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// Watch for data changes
watch(() => props.data, async () => {
  if (!props.loading && !props.error) {
    await updatePlot();
  }
}, { deep: true });

// Watch for layout changes
watch(() => props.layout, async () => {
  if (!props.loading && !props.error) {
    await updatePlot();
  }
}, { deep: true });

// Watch for loading state changes
watch(() => props.loading, async (newLoading) => {
  if (!newLoading && !props.error) {
    await nextTick();
    await createPlot();
  }
});
</script>

<style scoped>
.base-chart-wrapper {
  position: relative;
  width: 100%;
  min-height: 200px;
}

.chart-container {
  width: 100%;
}

.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chart-loading p {
  color: #6b7280;
  font-size: 0.875rem;
}

.chart-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

.retry-button:active {
  background-color: #1d4ed8;
}
</style>
