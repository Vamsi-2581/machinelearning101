<template>
  <div class="network-diagram">
    <svg :width="width" :height="height" class="border border-gray-200 rounded-lg bg-white">
      <!-- Connections (weights) -->
      <g v-for="(layer, l) in layers.slice(0, -1)" :key="`connections-${l}`">
        <g v-for="(neuron, i) in layer.neurons" :key="`conn-${l}-${i}`">
          <line
            v-for="(nextNeuron, j) in layers[l + 1].neurons"
            :key="`conn-${l}-${i}-${j}`"
            :x1="neuron.x"
            :y1="neuron.y"
            :x2="nextNeuron.x"
            :y2="nextNeuron.y"
            :stroke="getWeightColor(l, j, i)"
            :stroke-width="getWeightWidth(l, j, i)"
            :opacity="0.3"
          />
        </g>
      </g>
      
      <!-- Neurons -->
      <g v-for="(layer, l) in layers" :key="`layer-${l}`">
        <g v-for="(neuron, i) in layer.neurons" :key="`neuron-${l}-${i}`">
          <circle
            :cx="neuron.x"
            :cy="neuron.y"
            :r="neuronRadius"
            :fill="getNeuronColor(l, i)"
            :stroke="'#374151'"
            :stroke-width="2"
          />
          <text
            :x="neuron.x"
            :y="neuron.y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="text-xs font-semibold fill-white"
          >
            {{ neuron.activation !== undefined ? neuron.activation.toFixed(2) : '' }}
          </text>
        </g>
        
        <!-- Layer labels -->
        <text
          :x="layer.x"
          :y="height - 10"
          text-anchor="middle"
          class="text-sm font-semibold fill-gray-700"
        >
          {{ layer.label }}
        </text>
      </g>
    </svg>
    
    <!-- Legend -->
    <div class="mt-4 flex items-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-blue-500"></div>
        <span>Input Layer</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-purple-500"></div>
        <span>Hidden Layers</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-green-500"></div>
        <span>Output Layer</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  architecture: number[];
  weights?: number[][][];
  activations?: number[][];
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  weights: () => [],
  activations: () => []
});

const neuronRadius = 20;
const layerSpacing = computed(() => props.width / (props.architecture.length + 1));

interface Neuron {
  x: number;
  y: number;
  activation?: number;
}

interface Layer {
  x: number;
  neurons: Neuron[];
  label: string;
}

const layers = computed<Layer[]>(() => {
  return props.architecture.map((size, layerIndex) => {
    const x = layerSpacing.value * (layerIndex + 1);
    const verticalSpacing = (props.height - 100) / (size + 1);
    
    const neurons: Neuron[] = [];
    for (let i = 0; i < size; i++) {
      neurons.push({
        x,
        y: verticalSpacing * (i + 1) + 30,
        activation: props.activations[layerIndex]?.[i]
      });
    }
    
    let label = '';
    if (layerIndex === 0) {
      label = 'Input';
    } else if (layerIndex === props.architecture.length - 1) {
      label = 'Output';
    } else {
      label = `Hidden ${layerIndex}`;
    }
    
    return { x, neurons, label };
  });
});

const getNeuronColor = (layerIndex: number, neuronIndex: number): string => {
  const activation = props.activations[layerIndex]?.[neuronIndex];
  
  if (layerIndex === 0) {
    return '#3b82f6'; // blue for input
  } else if (layerIndex === props.architecture.length - 1) {
    return '#10b981'; // green for output
  } else {
    // Color based on activation value
    if (activation !== undefined) {
      const intensity = Math.min(Math.max(activation, 0), 1);
      const r = Math.floor(139 + (255 - 139) * intensity);
      const g = Math.floor(92 + (255 - 92) * intensity);
      const b = Math.floor(246 + (255 - 246) * intensity);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return '#8b5cf6'; // purple for hidden
  }
};

const getWeightColor = (layerIndex: number, toNeuron: number, fromNeuron: number): string => {
  const weight = props.weights[layerIndex]?.[toNeuron]?.[fromNeuron];
  
  if (weight === undefined) {
    return '#9ca3af';
  }
  
  // Positive weights = green, negative = red
  return weight >= 0 ? '#10b981' : '#ef4444';
};

const getWeightWidth = (layerIndex: number, toNeuron: number, fromNeuron: number): number => {
  const weight = props.weights[layerIndex]?.[toNeuron]?.[fromNeuron];
  
  if (weight === undefined) {
    return 1;
  }
  
  // Width based on absolute weight value
  return Math.min(Math.abs(weight) * 3, 5);
};
</script>

<style scoped>
.network-diagram {
  @apply w-full;
}
</style>
