<template>
  <div class="visualization-panel" :class="{ fullscreen: isFullscreen }">
    <!-- Panel Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ title }}</h3>
      
      <div class="panel-actions">
        <!-- Export Button -->
        <button
          v-if="allowExport"
          @click="handleExport"
          :disabled="!hasData"
          class="action-button"
          title="Export visualization"
          aria-label="Export visualization"
        >
          <span class="action-icon">📥</span>
        </button>

        <!-- Fullscreen Toggle -->
        <button
          v-if="allowFullscreen"
          @click="toggleFullscreen"
          class="action-button"
          :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          <span class="action-icon">{{ isFullscreen ? '⤓' : '⤢' }}</span>
        </button>
      </div>
    </div>

    <!-- Visualization Content -->
    <div class="panel-content" ref="contentRef">
      <!-- Render appropriate visualization based on type -->
      <component
        v-if="visualizationType && hasData"
        :is="visualizationComponent"
        v-bind="visualizationProps"
        @ready="handleVisualizationReady"
      />

      <!-- Empty State -->
      <div v-else-if="!hasData" class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-message">{{ emptyMessage }}</p>
      </div>

      <!-- Slot for custom visualization -->
      <slot v-if="!visualizationType" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onBeforeUnmount } from 'vue';
import type { VisualizationType } from '~/types/visualization';

interface Props {
  title?: string;
  type?: VisualizationType;
  data?: any;
  config?: any;
  allowFullscreen?: boolean;
  allowExport?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Visualization',
  allowFullscreen: true,
  allowExport: true,
  emptyMessage: 'No data to visualize. Adjust parameters and run the algorithm.',
});

const emit = defineEmits<{
  export: [];
  fullscreenChange: [isFullscreen: boolean];
  ready: [];
}>();

const isFullscreen = ref(false);
const contentRef = ref<HTMLElement>();
const visualizationReady = ref(false);

/**
 * Check if data is available
 */
const hasData = computed(() => {
  return props.data !== null && props.data !== undefined;
});

/**
 * Get visualization type
 */
const visualizationType = computed(() => {
  return props.type;
});

/**
 * Dynamically load visualization component based on type
 */
const visualizationComponent = computed(() => {
  if (!props.type) return null;

  const componentMap: Record<VisualizationType, any> = {
    'scatter2d': defineAsyncComponent(() => import('~/components/visualizations/Scatter2D.vue')),
    'scatter3d': defineAsyncComponent(() => import('~/components/visualizations/Plot3D.vue')),
    'line': defineAsyncComponent(() => import('~/components/visualizations/LineChart.vue')),
    'heatmap': defineAsyncComponent(() => import('~/components/visualizations/Heatmap.vue')),
    'surface': defineAsyncComponent(() => import('~/components/visualizations/Plot3D.vue')),
    'canvas-scatter': defineAsyncComponent(() => import('~/components/visualizations/CanvasScatter.vue')),
  };

  return componentMap[props.type] || null;
});

/**
 * Props to pass to visualization component
 */
const visualizationProps = computed(() => {
  return {
    data: props.data,
    config: props.config,
    ...props.config,
  };
});

/**
 * Toggle fullscreen mode
 */
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  emit('fullscreenChange', isFullscreen.value);

  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

/**
 * Handle export button click
 */
const handleExport = () => {
  emit('export');
  
  // Default export behavior - download as PNG
  if (contentRef.value) {
    try {
      // For Plotly charts
      const plotlyDiv = contentRef.value.querySelector('.js-plotly-plot') as any;
      if (plotlyDiv && (window as any).Plotly) {
        (window as any).Plotly.downloadImage(plotlyDiv, {
          format: 'png',
          width: 1200,
          height: 800,
          filename: `visualization-${Date.now()}`
        });
        return;
      }

      // For canvas-based visualizations
      const canvas = contentRef.value.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `visualization-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        return;
      }

      console.warn('No exportable visualization found');
    } catch (error) {
      console.error('Error exporting visualization:', error);
    }
  }
};

/**
 * Handle visualization ready event
 */
const handleVisualizationReady = () => {
  visualizationReady.value = true;
  emit('ready');
};

/**
 * Close fullscreen on Escape key
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen();
  }
};

// Add keyboard listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown);
}

// Cleanup
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }
  if (isFullscreen.value) {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.visualization-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.visualization-panel.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  max-width: 100vw;
  max-height: 100vh;
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.action-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}

.action-button:active:not(:disabled) {
  background-color: #e5e7eb;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.action-icon {
  font-size: 1rem;
  line-height: 1;
}

/* Panel Content */
.panel-content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
  min-height: 300px;
}

.fullscreen .panel-content {
  min-height: 0;
  height: calc(100vh - 60px);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-message {
  color: #6b7280;
  font-size: 0.875rem;
  max-width: 400px;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .panel-header {
    padding: 0.75rem;
  }

  .panel-title {
    font-size: 0.875rem;
  }

  .action-button {
    width: 28px;
    height: 28px;
  }

  .action-icon {
    font-size: 0.875rem;
  }

  .panel-content {
    padding: 0.75rem;
    min-height: 250px;
  }

  .empty-state {
    min-height: 250px;
    padding: 1.5rem;
  }

  .empty-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .panel-actions {
    gap: 0.25rem;
  }

  .action-button {
    width: 24px;
    height: 24px;
  }

  .action-icon {
    font-size: 0.75rem;
  }
}
</style>
