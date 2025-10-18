<template>
  <div class="canvas-scatter-wrapper" ref="wrapperRef">
    <div v-if="loading" class="canvas-loading">
      <div class="loading-spinner"></div>
      <p>Loading visualization...</p>
    </div>
    
    <div v-else-if="error" class="canvas-error">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
    </div>
    
    <div v-show="!loading && !error" class="canvas-container">
      <canvas 
        ref="canvasRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @wheel="handleWheel"
        :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      ></canvas>
      
      <div v-if="hoveredPoint" class="tooltip" :style="tooltipStyle">
        <div class="tooltip-content">
          <strong>{{ hoveredPoint.seriesName }}</strong>
          <div>X: {{ hoveredPoint.x.toFixed(2) }}</div>
          <div>Y: {{ hoveredPoint.y.toFixed(2) }}</div>
        </div>
      </div>
      
      <div class="controls">
        <button @click="resetView" class="control-button" title="Reset View">
          🔄
        </button>
        <button @click="zoomIn" class="control-button" title="Zoom In">
          ➕
        </button>
        <button @click="zoomOut" class="control-button" title="Zoom Out">
          ➖
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

export interface CanvasScatterSeries {
  x: number[];
  y: number[];
  name: string;
  color: string;
  size?: number;
}

interface Props {
  series: CanvasScatterSeries[];
  width?: number;
  height?: number;
  loading?: boolean;
  error?: string | null;
  xLabel?: string;
  yLabel?: string;
  showGrid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  loading: false,
  error: null,
  xLabel: 'X',
  yLabel: 'Y',
  showGrid: true,
});

const emit = defineEmits<{
  pointClick: [data: { seriesIndex: number; pointIndex: number; x: number; y: number }];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const animationFrameId = ref<number | null>(null);

// View state
const viewState = ref({
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  minScale: 0.1,
  maxScale: 10,
});

// Interaction state
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const hoveredPoint = ref<{ x: number; y: number; seriesName: string; seriesIndex: number; pointIndex: number } | null>(null);
const mousePos = ref({ x: 0, y: 0 });

// Data bounds
const dataBounds = computed(() => {
  if (props.series.length === 0) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  props.series.forEach(s => {
    s.x.forEach(x => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    });
    s.y.forEach(y => {
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });

  // Add padding
  const paddingX = (maxX - minX) * 0.1;
  const paddingY = (maxY - minY) * 0.1;

  return {
    minX: minX - paddingX,
    maxX: maxX + paddingX,
    minY: minY - paddingY,
    maxY: maxY + paddingY,
  };
});

const tooltipStyle = computed(() => ({
  left: `${mousePos.value.x + 10}px`,
  top: `${mousePos.value.y + 10}px`,
}));

const setupCanvas = () => {
  if (!canvasRef.value || !wrapperRef.value) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = wrapperRef.value.getBoundingClientRect();
  
  canvasRef.value.width = rect.width * dpr;
  canvasRef.value.height = rect.height * dpr;
  canvasRef.value.style.width = `${rect.width}px`;
  canvasRef.value.style.height = `${rect.height}px`;

  const ctx = canvasRef.value.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
};

const worldToScreen = (x: number, y: number) => {
  if (!canvasRef.value) return { x: 0, y: 0 };

  const rect = canvasRef.value.getBoundingClientRect();
  const margin = 50;
  const plotWidth = rect.width - 2 * margin;
  const plotHeight = rect.height - 2 * margin;

  const bounds = dataBounds.value;
  const rangeX = bounds.maxX - bounds.minX;
  const rangeY = bounds.maxY - bounds.minY;

  const screenX = margin + ((x - bounds.minX) / rangeX) * plotWidth * viewState.value.scale + viewState.value.offsetX;
  const screenY = rect.height - margin - ((y - bounds.minY) / rangeY) * plotHeight * viewState.value.scale + viewState.value.offsetY;

  return { x: screenX, y: screenY };
};

const screenToWorld = (screenX: number, screenY: number) => {
  if (!canvasRef.value) return { x: 0, y: 0 };

  const rect = canvasRef.value.getBoundingClientRect();
  const margin = 50;
  const plotWidth = rect.width - 2 * margin;
  const plotHeight = rect.height - 2 * margin;

  const bounds = dataBounds.value;
  const rangeX = bounds.maxX - bounds.minX;
  const rangeY = bounds.maxY - bounds.minY;

  const x = bounds.minX + ((screenX - margin - viewState.value.offsetX) / (plotWidth * viewState.value.scale)) * rangeX;
  const y = bounds.minY + ((rect.height - margin - screenY + viewState.value.offsetY) / (plotHeight * viewState.value.scale)) * rangeY;

  return { x, y };
};

const render = () => {
  if (!canvasRef.value) return;

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const rect = canvasRef.value.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Draw grid
  if (props.showGrid) {
    drawGrid(ctx, rect);
  }

  // Draw axes
  drawAxes(ctx, rect);

  // Draw data points
  props.series.forEach((series, seriesIndex) => {
    ctx.fillStyle = series.color;
    const size = series.size || 4;

    for (let i = 0; i < series.x.length; i++) {
      const screen = worldToScreen(series.x[i], series.y[i]);
      
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Highlight hovered point
  if (hoveredPoint.value) {
    const screen = worldToScreen(hoveredPoint.value.x, hoveredPoint.value.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
};

const drawGrid = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  const margin = 50;
  const gridLines = 10;

  for (let i = 0; i <= gridLines; i++) {
    const x = margin + (i / gridLines) * (rect.width - 2 * margin);
    ctx.beginPath();
    ctx.moveTo(x, margin);
    ctx.lineTo(x, rect.height - margin);
    ctx.stroke();

    const y = margin + (i / gridLines) * (rect.height - 2 * margin);
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(rect.width - margin, y);
    ctx.stroke();
  }
};

const drawAxes = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#374151';

  const margin = 50;

  // X axis
  ctx.beginPath();
  ctx.moveTo(margin, rect.height - margin);
  ctx.lineTo(rect.width - margin, rect.height - margin);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, rect.height - margin);
  ctx.stroke();

  // Labels
  ctx.textAlign = 'center';
  ctx.fillText(props.xLabel, rect.width / 2, rect.height - 10);
  
  ctx.save();
  ctx.translate(15, rect.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(props.yLabel, 0, 0);
  ctx.restore();
};

const findNearestPoint = (screenX: number, screenY: number) => {
  const threshold = 10;
  let nearest: typeof hoveredPoint.value = null;
  let minDist = threshold;

  props.series.forEach((series, seriesIndex) => {
    for (let i = 0; i < series.x.length; i++) {
      const screen = worldToScreen(series.x[i], series.y[i]);
      const dist = Math.sqrt((screen.x - screenX) ** 2 + (screen.y - screenY) ** 2);
      
      if (dist < minDist) {
        minDist = dist;
        nearest = {
          x: series.x[i],
          y: series.y[i],
          seriesName: series.name,
          seriesIndex,
          pointIndex: i,
        };
      }
    }
  });

  return nearest;
};

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = { x: e.clientX - viewState.value.offsetX, y: e.clientY - viewState.value.offsetY };
};

const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  mousePos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  if (isDragging.value) {
    viewState.value.offsetX = e.clientX - dragStart.value.x;
    viewState.value.offsetY = e.clientY - dragStart.value.y;
    scheduleRender();
  } else {
    hoveredPoint.value = findNearestPoint(mousePos.value.x, mousePos.value.y);
    scheduleRender();
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleMouseLeave = () => {
  isDragging.value = false;
  hoveredPoint.value = null;
  scheduleRender();
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(viewState.value.minScale, Math.min(viewState.value.maxScale, viewState.value.scale * delta));
  
  viewState.value.scale = newScale;
  scheduleRender();
};

const resetView = () => {
  viewState.value = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    minScale: 0.1,
    maxScale: 10,
  };
  scheduleRender();
};

const zoomIn = () => {
  viewState.value.scale = Math.min(viewState.value.maxScale, viewState.value.scale * 1.2);
  scheduleRender();
};

const zoomOut = () => {
  viewState.value.scale = Math.max(viewState.value.minScale, viewState.value.scale / 1.2);
  scheduleRender();
};

const scheduleRender = () => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
  animationFrameId.value = requestAnimationFrame(render);
};

onMounted(() => {
  setupCanvas();
  scheduleRender();

  window.addEventListener('resize', () => {
    setupCanvas();
    scheduleRender();
  });
});

onBeforeUnmount(() => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
});

watch(() => props.series, () => {
  scheduleRender();
}, { deep: true });
</script>

<style scoped>
.canvas-scatter-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.canvas-loading,
.canvas-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

.canvas-loading p {
  color: #6b7280;
  font-size: 0.875rem;
}

.canvas-error {
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
  text-align: center;
}

.tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

.tooltip-content {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.control-button {
  width: 32px;
  height: 32px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.control-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.control-button:active {
  background-color: #e5e7eb;
}
</style>
