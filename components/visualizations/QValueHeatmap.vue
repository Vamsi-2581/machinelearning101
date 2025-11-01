<template>
  <div class="q-value-heatmap" :style="{ height }">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center h-full text-red-600">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="heatmap-container">
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-600">
          Showing {{ displayMode === 'max' ? 'maximum' : 'average' }} Q-values for each state
        </p>
      </div>
      
      <div class="controls mb-4 flex gap-4">
        <button
          @click="displayMode = 'max'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            displayMode === 'max'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Max Q-Value
        </button>
        <button
          @click="displayMode = 'avg'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            displayMode === 'avg'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Average Q-Value
        </button>
      </div>
      
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="heatmap-svg"
      >
        <!-- Grid cells with Q-values -->
        <g v-for="(row, i) in gridSize" :key="`row-${i}`">
          <g v-for="(col, j) in gridSize" :key="`cell-${i}-${j}`">
            <rect
              :x="j * cellSize"
              :y="i * cellSize"
              :width="cellSize"
              :height="cellSize"
              :fill="getCellColor(i, j)"
              stroke="#e5e7eb"
              stroke-width="1"
              class="q-cell"
            />
            
            <!-- Q-value text -->
            <text
              v-if="!isObstacle(i, j)"
              :x="j * cellSize + cellSize / 2"
              :y="i * cellSize + cellSize / 2"
              text-anchor="middle"
              dominant-baseline="middle"
              :fill="getTextColor(i, j)"
              font-size="12"
              font-weight="600"
            >
              {{ formatQValue(i, j) }}
            </text>
            
            <!-- Obstacle marker -->
            <text
              v-else
              :x="j * cellSize + cellSize / 2"
              :y="i * cellSize + cellSize / 2"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#9ca3af"
              font-size="16"
            >
              ✕
            </text>
          </g>
        </g>
        
        <!-- Start and Goal markers -->
        <circle
          :cx="startState[1] * cellSize + cellSize * 0.15"
          :cy="startState[0] * cellSize + cellSize * 0.15"
          :r="cellSize * 0.1"
          fill="#10b981"
          stroke="#ffffff"
          stroke-width="1"
        />
        
        <circle
          :cx="goalState[1] * cellSize + cellSize * 0.15"
          :cy="goalState[0] * cellSize + cellSize * 0.15"
          :r="cellSize * 0.1"
          fill="#ef4444"
          stroke="#ffffff"
          stroke-width="1"
        />
      </svg>
      
      <!-- Color scale legend -->
      <div class="color-scale mt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Low Q-Value</span>
          <span class="text-gray-600">High Q-Value</span>
        </div>
        <div class="h-4 rounded-md mt-1" :style="{ background: colorGradient }"></div>
        <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>{{ minQValue.toFixed(2) }}</span>
          <span>{{ maxQValue.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  gridSize: number;
  qValues: Map<string, number[]>;
  startState: [number, number];
  goalState: [number, number];
  obstacles?: [number, number][];
  title?: string;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  obstacles: () => [],
  title: 'Q-Value Heatmap',
  loading: false,
  error: null,
  height: '600px',
});

const displayMode = ref<'max' | 'avg'>('max');

// Calculate cell size based on grid size
const cellSize = computed(() => {
  const maxSize = 600;
  return Math.floor(maxSize / props.gridSize);
});

const svgWidth = computed(() => props.gridSize * cellSize.value);
const svgHeight = computed(() => props.gridSize * cellSize.value);

/**
 * Get Q-value for a state
 */
const getQValue = (row: number, col: number): number => {
  const key = `${row},${col}`;
  const qVals = props.qValues.get(key);
  
  if (!qVals || qVals.length === 0) {
    return 0;
  }
  
  if (displayMode.value === 'max') {
    return Math.max(...qVals);
  } else {
    return qVals.reduce((a, b) => a + b, 0) / qVals.length;
  }
};

/**
 * Calculate min and max Q-values for color scaling
 */
const minQValue = computed(() => {
  let min = Infinity;
  
  for (let i = 0; i < props.gridSize; i++) {
    for (let j = 0; j < props.gridSize; j++) {
      if (!isObstacle(i, j)) {
        const qVal = getQValue(i, j);
        min = Math.min(min, qVal);
      }
    }
  }
  
  return min === Infinity ? 0 : min;
});

const maxQValue = computed(() => {
  let max = -Infinity;
  
  for (let i = 0; i < props.gridSize; i++) {
    for (let j = 0; j < props.gridSize; j++) {
      if (!isObstacle(i, j)) {
        const qVal = getQValue(i, j);
        max = Math.max(max, qVal);
      }
    }
  }
  
  return max === -Infinity ? 0 : max;
});

/**
 * Get cell color based on Q-value
 */
const getCellColor = (row: number, col: number): string => {
  if (isObstacle(row, col)) {
    return '#f3f4f6';
  }
  
  const qVal = getQValue(row, col);
  const normalized = (qVal - minQValue.value) / (maxQValue.value - minQValue.value || 1);
  
  // Color scale from blue (low) to green (medium) to yellow (high)
  if (normalized < 0.5) {
    // Blue to green
    const t = normalized * 2;
    const r = Math.floor(59 * (1 - t) + 16 * t);
    const g = Math.floor(130 * (1 - t) + 185 * t);
    const b = Math.floor(246 * (1 - t) + 129 * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Green to yellow
    const t = (normalized - 0.5) * 2;
    const r = Math.floor(16 * (1 - t) + 251 * t);
    const g = Math.floor(185 * (1 - t) + 191 * t);
    const b = Math.floor(129 * (1 - t) + 36 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

/**
 * Get text color for readability
 */
const getTextColor = (row: number, col: number): string => {
  if (isObstacle(row, col)) {
    return '#9ca3af';
  }
  
  const qVal = getQValue(row, col);
  const normalized = (qVal - minQValue.value) / (maxQValue.value - minQValue.value || 1);
  
  // Use white text for dark backgrounds
  return normalized > 0.6 ? '#ffffff' : '#1f2937';
};

/**
 * Format Q-value for display
 */
const formatQValue = (row: number, col: number): string => {
  const qVal = getQValue(row, col);
  return qVal.toFixed(1);
};

/**
 * Check if cell is an obstacle
 */
const isObstacle = (row: number, col: number): boolean => {
  return props.obstacles.some(([r, c]) => r === row && c === col);
};

/**
 * Color gradient for legend
 */
const colorGradient = computed(() => {
  return 'linear-gradient(to right, rgb(59, 130, 246), rgb(16, 185, 129), rgb(251, 191, 36))';
});
</script>

<style scoped>
.q-value-heatmap {
  @apply w-full flex flex-col items-center justify-center;
}

.heatmap-container {
  @apply flex flex-col items-center w-full;
}

.heatmap-svg {
  @apply border border-gray-300 rounded-lg shadow-sm;
}

.q-cell {
  @apply transition-all duration-200;
}

.q-cell:hover {
  @apply opacity-80 cursor-pointer;
}

.controls button {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.color-scale {
  @apply w-full max-w-md;
}
</style>
