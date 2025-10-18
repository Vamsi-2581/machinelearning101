<template>
  <div class="interactive-section">
    <h2 class="section-title">Interactive Exploration</h2>
    
    <div class="interactive-layout" :class="{ stacked: isStacked }">
      <!-- Control Panel -->
      <div class="panel controls-panel">
        <div class="panel-header">
          <h3 class="panel-title">Controls</h3>
        </div>
        <div class="panel-content">
          <slot name="controls" />
        </div>
      </div>

      <!-- Visualization Panel -->
      <div class="panel visualization-panel">
        <div class="panel-header">
          <h3 class="panel-title">Visualization</h3>
        </div>
        <div class="panel-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">{{ loadingMessage }}</p>
            <div v-if="progress > 0" class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progress * 100}%` }"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <p class="error-message">{{ error }}</p>
            <button v-if="onRetry" @click="handleRetry" class="retry-button">
              Try Again
            </button>
          </div>

          <!-- Visualization Content -->
          <div v-else class="visualization-content">
            <slot name="visualization" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAriaLive } from '../../composables/useAriaLive';

interface Props {
  loading?: boolean;
  loadingMessage?: string;
  progress?: number;
  error?: string | null;
  onRetry?: () => void;
  stackBreakpoint?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMessage: 'Computing...',
  progress: 0,
  error: null,
  stackBreakpoint: 768,
});

const emit = defineEmits<{
  retry: [];
}>();

const windowWidth = ref(window.innerWidth);

// ARIA live announcements for screen readers
// Requirements: 7.2 - Screen reader support
const { announce } = useAriaLive({ politeness: 'polite' });

// Announce loading state changes
watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    announce(props.loadingMessage);
  } else {
    announce('Computation complete');
  }
});

// Announce errors
watch(() => props.error, (error) => {
  if (error) {
    announce(`Error: ${error}`, 'assertive');
  }
});

// Announce progress updates (throttled)
let lastProgressAnnouncement = 0;
watch(() => props.progress, (progress) => {
  const now = Date.now();
  // Announce every 25% progress or every 2 seconds
  if (progress > 0 && (progress - lastProgressAnnouncement >= 0.25 || now - lastProgressAnnouncement > 2000)) {
    announce(`Progress: ${Math.round(progress * 100)}%`);
    lastProgressAnnouncement = progress;
  }
});

/**
 * Check if layout should be stacked based on window width
 */
const isStacked = computed(() => {
  return windowWidth.value < props.stackBreakpoint;
});

/**
 * Handle retry button click
 */
const handleRetry = () => {
  if (props.onRetry) {
    props.onRetry();
  }
  emit('retry');
};

/**
 * Update window width on resize
 */
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.interactive-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

/* Two-Panel Layout */
.interactive-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  min-height: 500px;
}

.interactive-layout.stacked {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Panel Styles */
.panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.panel-content {
  padding: 1rem;
  flex: 1;
  overflow: auto;
}

/* Controls Panel */
.controls-panel {
  height: fit-content;
  max-height: 600px;
}

.interactive-layout.stacked .controls-panel {
  max-height: none;
}

/* Visualization Panel */
.visualization-panel {
  min-height: 400px;
}

.visualization-content {
  height: 100%;
  min-height: 350px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
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

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.progress-bar {
  width: 100%;
  max-width: 300px;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
  border-radius: 9999px;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  padding: 2rem;
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
  margin: 0 0 1rem 0;
  text-align: center;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

.retry-button:active {
  background-color: #1d4ed8;
}

.retry-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .interactive-layout {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 768px) {
  .interactive-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .interactive-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: auto;
  }

  .controls-panel {
    max-height: none;
  }

  .visualization-panel {
    min-height: 300px;
  }

  .visualization-content {
    min-height: 250px;
  }

  .loading-state,
  .error-state {
    min-height: 250px;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .panel-content {
    padding: 0.75rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }
}
</style>
