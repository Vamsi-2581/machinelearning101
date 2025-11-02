<template>
  <div class="slider-control">
    <div class="flex items-center justify-between mb-2">
      <label :for="inputId" class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <output
        :for="inputId"
        class="text-sm font-semibold text-blue-600"
        :aria-live="showTooltip ? 'off' : 'polite'"
      >
        {{ formattedValue }}
      </output>
    </div>
    
    <div class="relative">
      <input
        :id="inputId"
        ref="sliderRef"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="localValue"
        :disabled="disabled"
        class="slider-input"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="localValue"
        :aria-label="ariaLabel || label"
        :aria-describedby="tooltip ? `${inputId}-tooltip` : undefined"
        @input="handleInput"
        @mouseenter="showTooltipOnHover"
        @mouseleave="hideTooltipOnHover"
        @focus="showTooltipOnFocus"
        @blur="hideTooltipOnFocus"
      />
      
      <!-- Tooltip -->
      <div
        v-if="showTooltip && isTooltipVisible"
        :id="`${inputId}-tooltip`"
        role="tooltip"
        class="slider-tooltip"
        :style="tooltipStyle"
      >
        <span class="tooltip-content">{{ tooltip || formattedValue }}</span>
        <span class="tooltip-arrow"></span>
      </div>
    </div>
    
    <div v-if="showMinMax" class="flex justify-between mt-1 text-xs text-gray-500">
      <span>{{ formatValue(min) }}</span>
      <span>{{ formatValue(max) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue: number;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  tooltip?: string;
  showMinMax?: boolean;
  formatter?: (value: number) => string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showMinMax: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const sliderRef = ref<HTMLInputElement>();
const isTooltipVisible = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const localValue = ref(props.modelValue);

const inputId = computed(() => `slider-${Math.random().toString(36).substring(2, 11)}`);

const showTooltip = computed(() => props.tooltip !== undefined || isHovered.value || isFocused.value);

const formattedValue = computed(() => formatValue(localValue.value));

const tooltipStyle = computed(() => {
  if (!sliderRef.value) return {};
  
  const percentage = ((localValue.value - props.min) / (props.max - props.min)) * 100;
  return {
    left: `${percentage}%`,
    transform: 'translateX(-50%)',
  };
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  localValue.value = value;
  emit('update:modelValue', value);
};

const formatValue = (value: number): string => {
  if (props.formatter) {
    return props.formatter(value);
  }
  return value.toString();
};

const showTooltipOnHover = () => {
  isHovered.value = true;
};

const hideTooltipOnHover = () => {
  isHovered.value = false;
};

const showTooltipOnFocus = () => {
  isFocused.value = true;
};

const hideTooltipOnFocus = () => {
  isFocused.value = false;
};

// Watch for parent updates to modelValue
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

watch([isHovered, isFocused], ([hovered, focused]) => {
  isTooltipVisible.value = hovered || focused;
});
</script>

<style scoped>
.slider-control {
  @apply w-full;
}

.slider-input {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  @apply disabled:cursor-not-allowed disabled:opacity-50;
}

.slider-input::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-blue-600 rounded-full cursor-pointer;
  @apply hover:bg-blue-700 active:bg-blue-800;
  @apply transition-colors duration-200;
}

.slider-input::-moz-range-thumb {
  @apply w-5 h-5 bg-blue-600 rounded-full cursor-pointer border-0;
  @apply hover:bg-blue-700 active:bg-blue-800;
  @apply transition-colors duration-200;
}

.slider-input:disabled::-webkit-slider-thumb {
  @apply bg-gray-400;
}

.slider-input:disabled::-moz-range-thumb {
  @apply bg-gray-400;
}

.slider-tooltip {
  @apply absolute -top-10 pointer-events-none;
  @apply transition-opacity duration-200;
}

.tooltip-content {
  @apply bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap;
  @apply block;
}

.tooltip-arrow {
  @apply absolute left-1/2 -translate-x-1/2 top-full;
  @apply w-0 h-0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid theme('colors.gray.900');
}
</style>
