<template>
  <div class="embedding-projection">
    <!-- Dimension Toggle -->
    <div class="controls mb-4 flex items-center gap-4">
      <label class="flex items-center gap-2">
        <input
          type="radio"
          :value="'2d'"
          v-model="dimension"
          class="form-radio text-indigo-600"
        />
        <span class="text-sm font-medium">2D Projection</span>
      </label>
      <label class="flex items-center gap-2">
        <input
          type="radio"
          :value="'3d'"
          v-model="dimension"
          class="form-radio text-indigo-600"
        />
        <span class="text-sm font-medium">3D Projection</span>
      </label>
      
      <label class="flex items-center gap-2 ml-auto">
        <input
          type="checkbox"
          v-model="showLabels"
          class="form-checkbox text-indigo-600"
        />
        <span class="text-sm font-medium">Show Labels</span>
      </label>
    </div>
    
    <!-- 2D Visualization -->
    <Scatter2D
      v-if="dimension === '2d' && scatter2DData"
      :series="scatter2DData"
      :title="title || '2D Word Embedding Projection'"
      x-label="Component 1"
      y-label="Component 2"
      :show-legend="false"
      :loading="loading"
      :error="error"
      :height="height"
      @point-click="handlePointClick"
      @point-hover="handlePointHover"
    />
    
    <!-- 3D Visualization -->
    <Plot3D
      v-else-if="dimension === '3d' && scatter3DData"
      type="scatter"
      :scatter-series="scatter3DData"
      :title="title || '3D Word Embedding Projection'"
      x-label="Component 1"
      y-label="Component 2"
      z-label="Component 3"
      :show-legend="false"
      :loading="loading"
      :error="error"
      :height="height"
    />
    
    <!-- Selected Word Info -->
    <div
      v-if="selectedWord"
      class="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
    >
      <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
        Selected Word: {{ selectedWord.word }}
      </h4>
      <p class="text-sm text-indigo-700 dark:text-indigo-300">
        Frequency: {{ selectedWord.frequency }}
      </p>
      <div v-if="selectedWord.similar && selectedWord.similar.length > 0" class="mt-2">
        <p class="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-1">
          Similar Words:
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="sim in selectedWord.similar"
            :key="sim.word"
            class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs border border-indigo-200 dark:border-indigo-700"
          >
            {{ sim.word }} ({{ (sim.similarity * 100).toFixed(1) }}%)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Scatter2D from './Scatter2D.vue';
import Plot3D from './Plot3D.vue';
import type { ScatterSeries } from './Scatter2D.vue';
import type { Scatter3DSeries } from './Plot3D.vue';

/**
 * EmbeddingProjection Component
 * 
 * Visualizes word embeddings in 2D or 3D space using dimensionality reduction.
 * Supports interactive exploration with word labels and similarity information.
 * 
 * Requirements: 3.3, 16.1, 16.2
 */

interface WordPoint {
  word: string;
  x: number;
  y: number;
  z?: number;
  frequency: number;
}

interface SimilarWord {
  word: string;
  similarity: number;
}

interface SelectedWordInfo {
  word: string;
  frequency: number;
  similar?: SimilarWord[];
}

interface Props {
  words: string[];
  coordinates2d?: number[][]; // [x, y] for each word
  coordinates3d?: number[][]; // [x, y, z] for each word
  frequencies?: number[];
  title?: string;
  loading?: boolean;
  error?: string | null;
  height?: string;
  colorBy?: 'frequency' | 'cluster';
  onWordSelect?: (word: string) => SimilarWord[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  error: null,
  height: '600px',
  colorBy: 'frequency',
});

const emit = defineEmits<{
  wordClick: [word: string];
  wordHover: [word: string];
}>();

const dimension = ref<'2d' | '3d'>('2d');
const showLabels = ref(true);
const selectedWord = ref<SelectedWordInfo | null>(null);

// Compute color scale based on frequency
const getColorForFrequency = (frequency: number, maxFreq: number): string => {
  const normalized = frequency / maxFreq;
  const hue = 240 - (normalized * 120); // Blue (240) to Red (120)
  return `hsl(${hue}, 70%, 50%)`;
};

// Prepare 2D scatter data
const scatter2DData = computed<ScatterSeries[]>(() => {
  if (!props.coordinates2d || props.coordinates2d.length === 0) {
    return [];
  }
  
  const maxFreq = Math.max(...(props.frequencies || [1]));
  const points = props.words.map((word, idx) => {
    const coords = props.coordinates2d![idx];
    const freq = props.frequencies?.[idx] || 1;
    
    return {
      word,
      x: coords[0],
      y: coords[1],
      frequency: freq,
      color: getColorForFrequency(freq, maxFreq)
    };
  });
  
  // Group by color for better visualization
  const colorGroups = new Map<string, typeof points>();
  points.forEach(point => {
    const color = point.color;
    if (!colorGroups.has(color)) {
      colorGroups.set(color, []);
    }
    colorGroups.get(color)!.push(point);
  });
  
  // Create series for each color group
  return Array.from(colorGroups.entries()).map(([color, groupPoints]) => ({
    x: groupPoints.map(p => p.x),
    y: groupPoints.map(p => p.y),
    name: `Frequency Group`,
    color,
    mode: showLabels.value ? 'markers+text' : 'markers',
    marker: {
      size: 8,
      opacity: 0.7,
    },
    hovertemplate: groupPoints.map(p => 
      `<b>${p.word}</b><br>` +
      `Frequency: ${p.frequency}<br>` +
      `X: %{x:.2f}<br>` +
      `Y: %{y:.2f}<br>` +
      '<extra></extra>'
    ).join(''),
  } as ScatterSeries));
});

// Prepare 3D scatter data
const scatter3DData = computed<Scatter3DSeries[]>(() => {
  if (!props.coordinates3d || props.coordinates3d.length === 0) {
    return [];
  }
  
  const maxFreq = Math.max(...(props.frequencies || [1]));
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  const colors: string[] = [];
  
  props.words.forEach((word, idx) => {
    const coords = props.coordinates3d![idx];
    const freq = props.frequencies?.[idx] || 1;
    
    x.push(coords[0]);
    y.push(coords[1]);
    z.push(coords[2]);
    colors.push(getColorForFrequency(freq, maxFreq));
  });
  
  return [{
    x,
    y,
    z,
    name: 'Word Embeddings',
    mode: showLabels.value ? 'markers+text' : 'markers',
    marker: {
      size: 5,
      opacity: 0.7,
    },
  }];
});

// Handle point click
const handlePointClick = (data: { seriesIndex: number; pointIndex: number; x: number; y: number }) => {
  const word = props.words[data.pointIndex];
  if (word) {
    emit('wordClick', word);
    
    // Get similar words if callback provided
    const similar = props.onWordSelect?.(word);
    
    selectedWord.value = {
      word,
      frequency: props.frequencies?.[data.pointIndex] || 0,
      similar,
    };
  }
};

// Handle point hover
const handlePointHover = (data: { seriesIndex: number; pointIndex: number; x: number; y: number }) => {
  const word = props.words[data.pointIndex];
  if (word) {
    emit('wordHover', word);
  }
};

// Watch for dimension changes
watch(dimension, () => {
  selectedWord.value = null;
});

// Watch for label toggle
watch(showLabels, () => {
  // Force re-render by updating computed properties
});
</script>

<style scoped>
.embedding-projection {
  @apply w-full;
}

.controls {
  @apply flex flex-wrap items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.form-radio,
.form-checkbox {
  @apply w-4 h-4 cursor-pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .controls {
    @apply flex-col items-start;
  }
  
  .controls label {
    @apply w-full;
  }
}
</style>
