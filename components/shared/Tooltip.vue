<template>
  <div class="tooltip-wrapper" ref="wrapperRef">
    <div
      ref="triggerRef"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      :aria-describedby="isVisible ? tooltipId : undefined"
    >
      <slot />
    </div>
    
    <Teleport to="body">
      <div
        v-if="isVisible"
        :id="tooltipId"
        ref="tooltipRef"
        role="tooltip"
        :class="tooltipClasses"
        :style="tooltipStyle"
      >
        <div class="tooltip-content">
          {{ content }}
        </div>
        <div :class="arrowClasses"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200,
  disabled: false,
});

const wrapperRef = ref<HTMLDivElement>();
const triggerRef = ref<HTMLDivElement>();
const tooltipRef = ref<HTMLDivElement>();
const isVisible = ref(false);
const tooltipStyle = ref<Record<string, string>>({});
let showTimeout: ReturnType<typeof setTimeout> | null = null;

const tooltipId = computed(() => `tooltip-${Math.random().toString(36).substr(2, 9)}`);

const tooltipClasses = computed(() => [
  'absolute',
  'z-50',
  'px-3',
  'py-2',
  'text-sm',
  'text-white',
  'bg-gray-900',
  'rounded-lg',
  'shadow-lg',
  'pointer-events-none',
  'transition-opacity',
  'duration-200',
  'max-w-xs',
  'break-words',
]);

const arrowClasses = computed(() => {
  const baseClasses = ['absolute', 'w-2', 'h-2', 'bg-gray-900', 'transform', 'rotate-45'];
  
  const positionClasses = {
    top: ['bottom-[-4px]', 'left-1/2', '-translate-x-1/2'],
    bottom: ['top-[-4px]', 'left-1/2', '-translate-x-1/2'],
    left: ['right-[-4px]', 'top-1/2', '-translate-y-1/2'],
    right: ['left-[-4px]', 'top-1/2', '-translate-y-1/2'],
  };
  
  return [...baseClasses, ...positionClasses[props.position]];
});

const showTooltip = () => {
  if (props.disabled) return;
  
  showTimeout = setTimeout(async () => {
    isVisible.value = true;
    await nextTick();
    calculatePosition();
  }, props.delay);
};

const hideTooltip = () => {
  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }
  isVisible.value = false;
};

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return;
  
  const triggerRect = triggerRef.value.getBoundingClientRect();
  const tooltipRect = tooltipRef.value.getBoundingClientRect();
  const spacing = 8; // Gap between trigger and tooltip
  
  let top = 0;
  let left = 0;
  
  switch (props.position) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - spacing;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + spacing;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - spacing;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + spacing;
      break;
  }
  
  // Ensure tooltip stays within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (left < 0) {
    left = spacing;
  } else if (left + tooltipRect.width > viewportWidth) {
    left = viewportWidth - tooltipRect.width - spacing;
  }
  
  if (top < 0) {
    top = spacing;
  } else if (top + tooltipRect.height > viewportHeight) {
    top = viewportHeight - tooltipRect.height - spacing;
  }
  
  tooltipStyle.value = {
    top: `${top + window.scrollY}px`,
    left: `${left + window.scrollX}px`,
  };
};

const handleScroll = () => {
  if (isVisible.value) {
    calculatePosition();
  }
};

const handleResize = () => {
  if (isVisible.value) {
    calculatePosition();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleResize);
  if (showTimeout) {
    clearTimeout(showTimeout);
  }
});
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
}

.tooltip-content {
  position: relative;
  z-index: 1;
}
</style>
