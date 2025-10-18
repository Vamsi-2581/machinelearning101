<template>
  <div class="select-control">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500" aria-label="required">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        ref="selectRef"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-label="ariaLabel || label"
        :aria-describedby="helperText ? `${selectId}-description` : undefined"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
          :disabled="isOptionDisabled(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <!-- Dropdown Icon -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    
    <!-- Helper Text -->
    <p
      v-if="helperText"
      :id="`${selectId}-description`"
      class="mt-1 text-sm text-gray-500"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  modelValue: string | number;
  label?: string;
  options: SelectOption[] | string[] | number[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  change: [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const selectRef = ref<HTMLSelectElement>();
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

const selectClasses = computed(() => [
  'block',
  'w-full',
  'px-3',
  'py-2',
  'pr-10',
  'border',
  'border-gray-300',
  'rounded-lg',
  'text-gray-900',
  'bg-white',
  'appearance-none',
  'transition-colors',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-blue-500',
  'focus:border-blue-500',
  'disabled:bg-gray-100',
  'disabled:cursor-not-allowed',
  'disabled:text-gray-500',
  'cursor-pointer',
]);

const getOptionValue = (option: SelectOption | string | number): string | number => {
  if (typeof option === 'object') {
    return option.value;
  }
  return option;
};

const getOptionLabel = (option: SelectOption | string | number): string => {
  if (typeof option === 'object') {
    return option.label;
  }
  return String(option);
};

const isOptionDisabled = (option: SelectOption | string | number): boolean => {
  if (typeof option === 'object') {
    return option.disabled || false;
  }
  return false;
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  
  // Try to parse as number if the original modelValue was a number
  const parsedValue = typeof props.modelValue === 'number' ? parseFloat(value) : value;
  
  emit('update:modelValue', parsedValue);
  emit('change', parsedValue);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

defineExpose({
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur(),
});
</script>

<style scoped>
/* Remove default select arrow in IE */
select::-ms-expand {
  display: none;
}
</style>
