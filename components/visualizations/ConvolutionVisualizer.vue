<template>
  <div class="convolution-visualizer">
    <div v-if="loading" class="loading-state">
      <LoadingSkeleton :height="height" />
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
    </div>
    
    <div v-else class="visualization-grid">
      <!-- Filters Section -->
      <div v-if="filters && filters.length > 0" class="section">
        <h3 class="section-title">Convolutional Filters</h3>
        <div class="grid-container">
          <div
            v-for="(filter, idx) in filters"
            :key="`filter-${idx}`"
            class="grid-item"
          >
            <div class="item-label">Filter {{ idx + 1 }}</div>
            <Heatmap
              :data="filter"
              :colorscale="'RdBu'"
              :show-scale="false"
              :show-annotations="false"
              :height="'200px'"
              :title="''"
            />
          </div>
        </div>
      </div>
      
      <!-- Feature Maps Section -->
      <div v-if="featureMaps && featureMaps.length > 0" class="section">
        <h3 class="section-title">Feature Maps (After Convolution)</h3>
        <div class="grid-container">
          <div
            v-for="(map, idx) in featureMaps"
            :key="`feature-${idx}`"
            class="grid-item"
          >
            <div class="item-label">Feature Map {{ idx + 1 }}</div>
            <Heatmap
              :data="map"
              :colorscale="'Viridis'"
              :show-scale="false"
              :show-annotations="false"
              :height="'200px'"
              :title="''"
            />
          </div>
        </div>
      </div>
      
      <!-- Pooled Maps Section -->
      <div v-if="pooledMaps && pooledMaps.length > 0" class="section">
        <h3 class="section-title">Pooled Feature Maps (After Max Pooling)</h3>
        <div class="grid-container">
          <div
            v-for="(map, idx) in pooledMaps"
            :key="`pooled-${idx}`"
            class="grid-item"
          >
            <div class="item-label">Pooled Map {{ idx + 1 }}</div>
            <Heatmap
              :data="map"
              :colorscale="'Viridis'"
              :show-scale="false"
              :show-annotations="false"
              :height="'200px'"
              :title="''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Heatmap from './Heatmap.vue';
import LoadingSkeleton from '~/components/shared/LoadingSkeleton.vue';

interface Props {
  filters?: number[][][];
  featureMaps?: number[][][];
  pooledMaps?: number[][][];
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  featureMaps: () => [],
  pooledMaps: () => [],
  loading: false,
  error: null,
  height: '600px',
});

// Computed properties for easier template access
const hasData = computed(() => {
  return (
    (props.filters && props.filters.length > 0) ||
    (props.featureMaps && props.featureMaps.length > 0) ||
    (props.pooledMaps && props.pooledMaps.length > 0)
  );
});
</script>

<style scoped>
.convolution-visualizer {
  width: 100%;
  min-height: v-bind(height);
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: v-bind(height);
  padding: 2rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

.visualization-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .visualization-grid {
    padding: 0.5rem;
    gap: 1.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .section-title {
    color: #f9fafb;
    border-bottom-color: #374151;
  }
  
  .grid-item {
    background: #1f2937;
  }
  
  .item-label {
    color: #9ca3af;
  }
}

/* Accessibility */
.convolution-visualizer:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
