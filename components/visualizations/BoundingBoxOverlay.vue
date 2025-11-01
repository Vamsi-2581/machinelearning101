<template>
  <div class="bounding-box-overlay">
    <BaseChart
      v-if="!useCanvas"
      :data="plotlyData"
      :layout="plotlyLayout"
      :config="plotlyConfig"
      :loading="loading"
      :error="error"
      :height="height"
    />
    <div v-else class="canvas-container" :style="{ height }">
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="detection-canvas"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      />
      <div v-if="hoveredBox" class="box-tooltip" :style="tooltipStyle">
        <div class="tooltip-content">
          <div><strong>{{ hoveredBox.className || `Class ${hoveredBox.class}` }}</strong></div>
          <div>Confidence: {{ (hoveredBox.confidence * 100).toFixed(1) }}%</div>
          <div>Position: ({{ hoveredBox.x }}, {{ hoveredBox.y }})</div>
          <div>Size: {{ hoveredBox.width }}×{{ hoveredBox.height }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import type { Layout, Config } from 'plotly.js-dist-min';
import BaseChart from './BaseChart.vue';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: number;
  className?: string;
}

interface Props {
  image: number[][];
  detections?: BoundingBox[];
  groundTruth?: BoundingBox[];
  imageWidth: number;
  imageHeight: number;
  title?: string;
  showGroundTruth?: boolean;
  showDetections?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: string;
  useCanvas?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  detections: () => [],
  groundTruth: () => [],
  title: 'Object Detection Results',
  showGroundTruth: true,
  showDetections: true,
  loading: false,
  error: null,
  height: '600px',
  useCanvas: true,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(600);
const canvasHeight = ref(600);
const hoveredBox = ref<BoundingBox | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

const tooltipStyle = computed(() => ({
  left: `${mouseX.value + 10}px`,
  top: `${mouseY.value + 10}px`,
}));

/**
 * Draw the image and bounding boxes on canvas
 */
const drawCanvas = () => {
  if (!canvasRef.value || !props.image || props.image.length === 0) return;
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate scale to fit canvas
  const scaleX = canvas.width / props.imageWidth;
  const scaleY = canvas.height / props.imageHeight;
  
  // Draw image as grayscale heatmap
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const imgY = Math.floor(y / scaleY);
      const imgX = Math.floor(x / scaleX);
      
      if (imgY < props.image.length && imgX < props.image[0].length) {
        const value = props.image[imgY][imgX];
        const intensity = Math.floor(value * 255);
        
        const idx = (y * canvas.width + x) * 4;
        imageData.data[idx] = intensity;     // R
        imageData.data[idx + 1] = intensity; // G
        imageData.data[idx + 2] = intensity; // B
        imageData.data[idx + 3] = 255;       // A
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Draw ground truth boxes (green)
  if (props.showGroundTruth && props.groundTruth) {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    for (const box of props.groundTruth) {
      const x = box.x * scaleX;
      const y = box.y * scaleY;
      const width = box.width * scaleX;
      const height = box.height * scaleY;
      
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y - 20, width, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.fillText('Ground Truth', x + 5, y - 6);
    }
  }
  
  // Draw detected boxes (blue)
  if (props.showDetections && props.detections) {
    ctx.setLineDash([]);
    
    for (const box of props.detections) {
      const x = box.x * scaleX;
      const y = box.y * scaleY;
      const width = box.width * scaleX;
      const height = box.height * scaleY;
      
      // Color based on confidence
      const confidence = box.confidence;
      const alpha = 0.5 + confidence * 0.5;
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = 2;
      
      ctx.strokeRect(x, y, width, height);
      
      // Draw label with confidence
      const label = `${box.className || `Class ${box.class}`} ${(confidence * 100).toFixed(0)}%`;
      ctx.font = '12px sans-serif';
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.fillRect(x, y - 20, textWidth + 10, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 5, y - 6);
    }
  }
};

/**
 * Handle mouse move to show tooltip
 */
const handleMouseMove = (event: MouseEvent) => {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  mouseX.value = event.clientX - rect.left;
  mouseY.value = event.clientY - rect.top;
  
  const scaleX = canvas.width / props.imageWidth;
  const scaleY = canvas.height / props.imageHeight;
  
  // Check if mouse is over any detection box
  hoveredBox.value = null;
  
  if (props.detections) {
    for (const box of props.detections) {
      const boxX = box.x * scaleX;
      const boxY = box.y * scaleY;
      const boxWidth = box.width * scaleX;
      const boxHeight = box.height * scaleY;
      
      if (x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight) {
        hoveredBox.value = box;
        break;
      }
    }
  }
};

/**
 * Handle mouse leave
 */
const handleMouseLeave = () => {
  hoveredBox.value = null;
};

/**
 * Plotly data for non-canvas rendering
 */
const plotlyData = computed(() => {
  const traces: any[] = [];
  
  // Image as heatmap
  traces.push({
    z: props.image,
    type: 'heatmap',
    colorscale: 'Greys',
    showscale: false,
    hoverinfo: 'skip',
  });
  
  // Ground truth boxes
  if (props.showGroundTruth && props.groundTruth) {
    for (const box of props.groundTruth) {
      traces.push({
        x: [box.x, box.x + box.width, box.x + box.width, box.x, box.x],
        y: [box.y, box.y, box.y + box.height, box.y + box.height, box.y],
        mode: 'lines',
        line: { color: '#10b981', width: 3 },
        name: 'Ground Truth',
        showlegend: traces.length === 1,
        hovertemplate: 'Ground Truth<extra></extra>',
      });
    }
  }
  
  // Detection boxes
  if (props.showDetections && props.detections) {
    for (const box of props.detections) {
      const alpha = 0.5 + box.confidence * 0.5;
      traces.push({
        x: [box.x, box.x + box.width, box.x + box.width, box.x, box.x],
        y: [box.y, box.y, box.y + box.height, box.y + box.height, box.y],
        mode: 'lines',
        line: { color: `rgba(59, 130, 246, ${alpha})`, width: 2 },
        name: `Detection (${(box.confidence * 100).toFixed(0)}%)`,
        hovertemplate: 
          `${box.className || `Class ${box.class}`}<br>` +
          `Confidence: ${(box.confidence * 100).toFixed(1)}%<br>` +
          `Position: (${box.x}, ${box.y})<br>` +
          `Size: ${box.width}×${box.height}<extra></extra>`,
      });
    }
  }
  
  return traces;
});

const plotlyLayout = computed<Partial<Layout>>(() => ({
  title: props.title ? {
    text: props.title,
    font: { size: 16, weight: 600 },
  } : undefined,
  xaxis: {
    title: '',
    showgrid: false,
    zeroline: false,
    range: [0, props.imageWidth],
  },
  yaxis: {
    title: '',
    showgrid: false,
    zeroline: false,
    autorange: 'reversed',
    range: [0, props.imageHeight],
  },
  showlegend: true,
  legend: {
    x: 1,
    xanchor: 'right',
    y: 1,
  },
  hovermode: 'closest',
}));

const plotlyConfig = computed<Partial<Config>>(() => ({
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'object_detection',
    height: 800,
    width: 800,
    scale: 2,
  },
}));

// Watch for changes and redraw
watch(
  () => [props.image, props.detections, props.groundTruth, props.showDetections, props.showGroundTruth],
  () => {
    if (props.useCanvas) {
      nextTick(() => drawCanvas());
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.useCanvas) {
    nextTick(() => drawCanvas());
  }
});
</script>

<style scoped>
.bounding-box-overlay {
  position: relative;
  width: 100%;
}

.canvas-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.detection-canvas {
  max-width: 100%;
  max-height: 100%;
  cursor: crosshair;
  image-rendering: pixelated;
}

.box-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tooltip-content strong {
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .detection-canvas {
    width: 100%;
    height: auto;
  }
  
  .box-tooltip {
    font-size: 0.75rem;
    padding: 0.375rem;
  }
}
</style>
