<template>
  <div class="environment-renderer" :style="{ height }">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center h-full text-red-600">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="grid-container" ref="gridContainer">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="grid-svg"
      >
        <!-- Grid cells -->
        <g v-for="(row, i) in gridSize" :key="`row-${i}`">
          <rect
            v-for="(col, j) in gridSize"
            :key="`cell-${i}-${j}`"
            :x="j * cellSize"
            :y="i * cellSize"
            :width="cellSize"
            :height="cellSize"
            :fill="getCellColor(i, j)"
            :stroke="getCellStroke(i, j)"
            :stroke-width="2"
            class="grid-cell"
          />
        </g>
        
        <!-- Optimal path -->
        <g v-if="optimalPath && optimalPath.length > 1">
          <polyline
            :points="getPathPoints()"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="3"
            stroke-dasharray="5,5"
            opacity="0.7"
          />
        </g>
        
        <!-- Obstacles -->
        <g v-for="(obstacle, idx) in obstacles" :key="`obstacle-${idx}`">
          <rect
            :x="obstacle[1] * cellSize + cellSize * 0.1"
            :y="obstacle[0] * cellSize + cellSize * 0.1"
            :width="cellSize * 0.8"
            :height="cellSize * 0.8"
            fill="#1f2937"
            rx="4"
          />
        </g>
        
        <!-- Start state -->
        <circle
          :cx="startState[1] * cellSize + cellSize / 2"
          :cy="startState[0] * cellSize + cellSize / 2"
          :r="cellSize * 0.3"
          fill="#10b981"
          stroke="#ffffff"
          stroke-width="2"
        />
        <text
          :x="startState[1] * cellSize + cellSize / 2"
          :y="startState[0] * cellSize + cellSize / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#ffffff"
          font-size="12"
          font-weight="bold"
        >
          S
        </text>
        
        <!-- Goal state -->
        <circle
          :cx="goalState[1] * cellSize + cellSize / 2"
          :cy="goalState[0] * cellSize + cellSize / 2"
          :r="cellSize * 0.3"
          fill="#ef4444"
          stroke="#ffffff"
          stroke-width="2"
        />
        <text
          :x="goalState[1] * cellSize + cellSize / 2"
          :y="goalState[0] * cellSize + cellSize / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#ffffff"
          font-size="12"
          font-weight="bold"
        >
          G
        </text>
        
        <!-- Action arrows (optional) -->
        <g v-if="showActions">
          <g v-for="(row, i) in gridSize" :key="`actions-row-${i}`">
            <g v-for="(col, j) in gridSize" :key="`actions-cell-${i}-${j}`">
              <path
                v-if="!isObstacle(i, j) && !isGoal(i, j)"
                :d="getActionArrow(i, j)"
                fill="#3b82f6"
                opacity="0.6"
              />
            </g>
          </g>
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="legend mt-4 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Start</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Goal</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-800 rounded"></div>
          <span>Obstacle</span>
        </div>
        <div v-if="optimalPath" class="flex items-center gap-2">
          <div class="w-8 h-0.5 bg-purple-500" style="border-top: 3px dashed"></div>
          <span>Optimal Path</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  gridSize: number;
  startState: [number, number];
  goalState: [number, number];
  obstacles?: [number, number][];
  optimalPath?: [number, number][];
  qValues?: Map<string, number[]>;
  showActions?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  obstacles: () => [],
  optimalPath: undefined,
  qValues: undefined,
  showActions: false,
  loading: false,
  error: null,
  height: '500px',
});

const gridContainer = ref<HTMLDivElement>();

// Calculate cell size based on grid size
const cellSize = computed(() => {
  const maxSize = 600;
  return Math.floor(maxSize / props.gridSize);
});

const svgWidth = computed(() => props.gridSize * cellSize.value);
const svgHeight = computed(() => props.gridSize * cellSize.value);

/**
 * Get cell background color based on state
 */
const getCellColor = (row: number, col: number): string => {
  // Check if obstacle
  if (isObstacle(row, col)) {
    return '#1f2937';
  }
  
  // Check if on optimal path
  if (props.optimalPath) {
    const onPath = props.optimalPath.some(([r, c]) => r === row && c === col);
    if (onPath) {
      return '#ede9fe'; // Light purple
    }
  }
  
  return '#f9fafb'; // Light gray
};

/**
 * Get cell stroke color
 */
const getCellStroke = (row: number, col: number): string => {
  if (isStart(row, col) || isGoal(row, col)) {
    return '#3b82f6';
  }
  return '#e5e7eb';
};

/**
 * Check if cell is an obstacle
 */
const isObstacle = (row: number, col: number): boolean => {
  return props.obstacles.some(([r, c]) => r === row && c === col);
};

/**
 * Check if cell is start state
 */
const isStart = (row: number, col: number): boolean => {
  return props.startState[0] === row && props.startState[1] === col;
};

/**
 * Check if cell is goal state
 */
const isGoal = (row: number, col: number): boolean => {
  return props.goalState[0] === row && props.goalState[1] === col;
};

/**
 * Get SVG points for optimal path
 */
const getPathPoints = (): string => {
  if (!props.optimalPath || props.optimalPath.length === 0) {
    return '';
  }
  
  return props.optimalPath
    .map(([row, col]) => {
      const x = col * cellSize.value + cellSize.value / 2;
      const y = row * cellSize.value + cellSize.value / 2;
      return `${x},${y}`;
    })
    .join(' ');
};

/**
 * Get action arrow path for a cell (based on best Q-value)
 */
const getActionArrow = (row: number, col: number): string => {
  if (!props.qValues) {
    return '';
  }
  
  const key = `${row},${col}`;
  const qVals = props.qValues.get(key);
  
  if (!qVals || qVals.length === 0) {
    return '';
  }
  
  // Find best action
  let bestAction = 0;
  let maxQ = qVals[0];
  for (let i = 1; i < qVals.length; i++) {
    if (qVals[i] > maxQ) {
      maxQ = qVals[i];
      bestAction = i;
    }
  }
  
  // Draw arrow based on action
  const cx = col * cellSize.value + cellSize.value / 2;
  const cy = row * cellSize.value + cellSize.value / 2;
  const arrowSize = cellSize.value * 0.2;
  
  // Actions: 0=up, 1=right, 2=down, 3=left
  const directions = [
    [0, -1], // up
    [1, 0],  // right
    [0, 1],  // down
    [-1, 0]  // left
  ];
  
  const [dx, dy] = directions[bestAction];
  const tipX = cx + dx * arrowSize;
  const tipY = cy + dy * arrowSize;
  
  // Create arrow path
  return `M ${cx} ${cy} L ${tipX} ${tipY}`;
};
</script>

<style scoped>
.environment-renderer {
  @apply w-full flex flex-col items-center justify-center;
}

.grid-container {
  @apply flex flex-col items-center;
}

.grid-svg {
  @apply border border-gray-300 rounded-lg shadow-sm;
}

.grid-cell {
  @apply transition-all duration-200;
}

.grid-cell:hover {
  @apply opacity-80;
}

.legend {
  @apply text-gray-700;
}
</style>
