<template>
  <div class="policy-visualization" :style="{ height }">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center h-full text-red-600">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="policy-container">
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-600">
          Showing policy action probabilities for each state
        </p>
      </div>
      
      <!-- Action selector -->
      <div class="controls mb-4 flex flex-wrap gap-2">
        <button
          v-for="(actionName, idx) in actions"
          :key="`action-${idx}`"
          @click="selectedAction = idx"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            selectedAction === idx
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ actionName }}
        </button>
        <button
          @click="selectedAction = null"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            selectedAction === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Best Action
        </button>
      </div>
      
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="policy-svg"
      >
        <!-- Grid cells with policy probabilities -->
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
              class="policy-cell"
            />
            
            <!-- Action arrows or probability text -->
            <g v-if="!isObstacle(i, j)">
              <g v-if="selectedAction === null">
                <!-- Show arrow for best action -->
                <path
                  :d="getArrowPath(i, j)"
                  :fill="getArrowColor(i, j)"
                  stroke="#ffffff"
                  stroke-width="1"
                />
              </g>
              <g v-else>
                <!-- Show probability text for selected action -->
                <text
                  :x="j * cellSize + cellSize / 2"
                  :y="i * cellSize + cellSize / 2"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  :fill="getTextColor(i, j)"
                  font-size="12"
                  font-weight="600"
                >
                  {{ formatProbability(i, j) }}
                </text>
              </g>
            </g>
            
            <!-- Obstacle marker -->
            <text
              v-if="isObstacle(i, j)"
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
          stroke-width="2"
        />
        
        <circle
          :cx="goalState[1] * cellSize + cellSize * 0.15"
          :cy="goalState[0] * cellSize + cellSize * 0.15"
          :r="cellSize * 0.1"
          fill="#ef4444"
          stroke="#ffffff"
          stroke-width="2"
        />
      </svg>
      
      <!-- Legend -->
      <div class="legend mt-4">
        <div v-if="selectedAction === null" class="text-sm text-gray-600 mb-2">
          <p class="font-semibold mb-1">Arrow Direction:</p>
          <p>Shows the most probable action for each state</p>
        </div>
        <div v-else class="text-sm text-gray-600 mb-2">
          <p class="font-semibold mb-1">Probability Scale:</p>
          <div class="flex items-center justify-between">
            <span>Low (0%)</span>
            <span>High (100%)</span>
          </div>
          <div class="h-4 rounded-md mt-1" :style="{ background: colorGradient }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  gridSize: number;
  policyData: { [key: string]: number[][] };
  actions: string[];
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
  title: 'Policy Visualization',
  loading: false,
  error: null,
  height: '600px',
});

const selectedAction = ref<number | null>(null);

// Calculate cell size based on grid size
const cellSize = computed(() => {
  const maxSize = 600;
  return Math.floor(maxSize / props.gridSize);
});

const svgWidth = computed(() => props.gridSize * cellSize.value);
const svgHeight = computed(() => props.gridSize * cellSize.value);

/**
 * Get action probabilities for a state
 */
const getActionProbabilities = (row: number, col: number): number[] => {
  const probabilities: number[] = [];
  
  for (let i = 0; i < props.actions.length; i++) {
    const actionKey = `action_${i}`;
    const actionGrid = props.policyData[actionKey];
    
    if (actionGrid && actionGrid[row] && actionGrid[row][col] !== undefined) {
      probabilities.push(actionGrid[row][col]);
    } else {
      probabilities.push(0);
    }
  }
  
  return probabilities;
};

/**
 * Get best action for a state
 */
const getBestAction = (row: number, col: number): number => {
  const probabilities = getActionProbabilities(row, col);
  let maxProb = -Infinity;
  let bestAction = 0;
  
  for (let i = 0; i < probabilities.length; i++) {
    if (probabilities[i] > maxProb) {
      maxProb = probabilities[i];
      bestAction = i;
    }
  }
  
  return bestAction;
};

/**
 * Get cell color based on probability
 */
const getCellColor = (row: number, col: number): string => {
  if (isObstacle(row, col)) {
    return '#f3f4f6';
  }
  
  if (selectedAction.value === null) {
    // Show uniform color when displaying best actions
    return '#ffffff';
  }
  
  const probabilities = getActionProbabilities(row, col);
  const prob = probabilities[selectedAction.value] || 0;
  
  // Color scale from light blue (low) to dark blue (high)
  const r = Math.floor(219 * (1 - prob) + 37 * prob);
  const g = Math.floor(234 * (1 - prob) + 99 * prob);
  const b = Math.floor(254 * (1 - prob) + 235 * prob);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Get text color for readability
 */
const getTextColor = (row: number, col: number): string => {
  if (isObstacle(row, col)) {
    return '#9ca3af';
  }
  
  if (selectedAction.value === null) {
    return '#1f2937';
  }
  
  const probabilities = getActionProbabilities(row, col);
  const prob = probabilities[selectedAction.value] || 0;
  
  return prob > 0.5 ? '#ffffff' : '#1f2937';
};

/**
 * Format probability for display
 */
const formatProbability = (row: number, col: number): string => {
  if (selectedAction.value === null) {
    return '';
  }
  
  const probabilities = getActionProbabilities(row, col);
  const prob = probabilities[selectedAction.value] || 0;
  
  return `${(prob * 100).toFixed(0)}%`;
};

/**
 * Get arrow path for best action
 */
const getArrowPath = (row: number, col: number): string => {
  const bestAction = getBestAction(row, col);
  const centerX = col * cellSize.value + cellSize.value / 2;
  const centerY = row * cellSize.value + cellSize.value / 2;
  const arrowSize = cellSize.value * 0.3;
  
  // Arrow directions: 0=up, 1=right, 2=down, 3=left
  switch (bestAction) {
    case 0: // Up
      return `M ${centerX} ${centerY - arrowSize} 
              L ${centerX - arrowSize * 0.5} ${centerY + arrowSize * 0.3}
              L ${centerX + arrowSize * 0.5} ${centerY + arrowSize * 0.3} Z`;
    case 1: // Right
      return `M ${centerX + arrowSize} ${centerY}
              L ${centerX - arrowSize * 0.3} ${centerY - arrowSize * 0.5}
              L ${centerX - arrowSize * 0.3} ${centerY + arrowSize * 0.5} Z`;
    case 2: // Down
      return `M ${centerX} ${centerY + arrowSize}
              L ${centerX - arrowSize * 0.5} ${centerY - arrowSize * 0.3}
              L ${centerX + arrowSize * 0.5} ${centerY - arrowSize * 0.3} Z`;
    case 3: // Left
      return `M ${centerX - arrowSize} ${centerY}
              L ${centerX + arrowSize * 0.3} ${centerY - arrowSize * 0.5}
              L ${centerX + arrowSize * 0.3} ${centerY + arrowSize * 0.5} Z`;
    default:
      return '';
  }
};

/**
 * Get arrow color based on confidence
 */
const getArrowColor = (row: number, col: number): string => {
  const probabilities = getActionProbabilities(row, col);
  const bestAction = getBestAction(row, col);
  const confidence = probabilities[bestAction] || 0;
  
  // Color from light blue (low confidence) to dark blue (high confidence)
  const r = Math.floor(147 * (1 - confidence) + 37 * confidence);
  const g = Math.floor(197 * (1 - confidence) + 99 * confidence);
  const b = Math.floor(253 * (1 - confidence) + 235 * confidence);
  
  return `rgb(${r}, ${g}, ${b})`;
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
  return 'linear-gradient(to right, rgb(219, 234, 254), rgb(37, 99, 235))';
});
</script>

<style scoped>
.policy-visualization {
  @apply w-full flex flex-col items-center justify-center;
}

.policy-container {
  @apply flex flex-col items-center w-full;
}

.policy-svg {
  @apply border border-gray-300 rounded-lg shadow-sm;
}

.policy-cell {
  @apply transition-all duration-200;
}

.policy-cell:hover {
  @apply opacity-80 cursor-pointer;
}

.controls button {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.legend {
  @apply w-full max-w-md;
}
</style>
