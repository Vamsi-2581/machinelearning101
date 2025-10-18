<template>
  <div class="toggle-control">
    <div class="flex items-center justify-between">
      <div v-if="label || helperText" class="flex-1 mr-3">
        <label
          v-if="label"
          :for="toggleId"
          :class="labelClasses"
        >
          {{ label }}
          <span v-if="required" class="text-red-500" aria-label="required">*</span>
        </label>
        <p
          v-if="helperText"
          :id="`${toggleId}-description`"
          class="text-sm text-gray-500"
        >
          {{ helperText }}
        </p>
      </div>
      
      <button
        :id="toggleId"
        ref="toggleRef"
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :aria-label="ariaLabel || label"
        :aria-describedby="helperText ? `${toggleId}-description` : undefined"
        :disabled="disabled"
        :class="toggleClasses"
        @click="handleToggle"
        @keydown.space.prevent="handleToggle"
        @keydown.enter.prevent="handleToggle"
      >
        <span
          :class="thumbClasses"
          aria-hidden="true"
        >
          <span
            v-if="showIcons"
            :class="iconClasses"
          >
            <!-- Check icon when on -->
            <svg
              v-if="modelValue"
              class="h-3 w-3 text-blue-600"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path
                d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
              />
            </svg>
            <!-- X icon when off -->
            <svg
              v-else
              class="h-3 w-3 text-gray-400"
              fill="none"
              viewBox="0 0 12 12"
            >
              <path
                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  showIcons?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  showIcons: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}>();

const toggleRef = ref<HTMLButtonElement>();
const toggleId = computed(() => `toggle-${Math.random().toString(36).substr(2, 9)}`);

const toggleClasses = computed(() => [
  'relative',
  'inline-flex',
  'h-6',
  'w-11',
  'flex-shrink-0',
  'rounded-full',
  'border-2',
  'border-transparent',
  'transition-colors',
  'duration-200',
  'ease-in-out',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-blue-500',
  'focus:ring-offset-2',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'cursor-pointer',
  props.modelValue ? 'bg-blue-600' : 'bg-gray-200',
]);

const thumbClasses = computed(() => [
  'pointer-events-none',
  'inline-block',
  'h-5',
  'w-5',
  'rounded-full',
  'bg-white',
  'shadow',
  'ring-0',
  'transition',
  'duration-200',
  'ease-in-out',
  'transform',
  props.modelValue ? 'translate-x-5' : 'translate-x-0',
]);

const iconClasses = computed(() => [
  'flex',
  'items-center',
  'justify-center',
  'h-full',
  'w-full',
]);

const labelClasses = computed(() => [
  'block',
  'text-sm',
  'font-medium',
  'text-gray-700',
  props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
]);

const handleToggle = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue;
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
};

defineExpose({
  focus: () => toggleRef.value?.focus(),
  blur: () => toggleRef.value?.blur(),
});
</script>
