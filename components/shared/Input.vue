<template>
  <div class="input-control">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500" aria-label="required">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="validationState === 'error'"
        :aria-describedby="describedBy"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Success Icon -->
      <div
        v-if="validationState === 'success'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      
      <!-- Error Icon -->
      <div
        v-if="validationState === 'error'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    
    <!-- Helper Text / Error Message -->
    <p
      v-if="helperText || errorMessage"
      :id="`${inputId}-description`"
      :class="messageClasses"
    >
      {{ validationState === 'error' ? errorMessage : helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string | number;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  validationState?: 'default' | 'success' | 'error';
  errorMessage?: string;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  validationState: 'default',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement>();
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.helperText || props.errorMessage) {
    ids.push(`${inputId.value}-description`);
  }
  return ids.length > 0 ? ids.join(' ') : undefined;
});

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'px-3',
    'py-2',
    'border',
    'rounded-lg',
    'text-gray-900',
    'placeholder-gray-400',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:bg-gray-100',
    'disabled:cursor-not-allowed',
    'disabled:text-gray-500',
  ];

  const stateClasses = {
    default: [
      'border-gray-300',
      'focus:border-blue-500',
      'focus:ring-blue-500',
    ],
    success: [
      'border-green-500',
      'focus:border-green-500',
      'focus:ring-green-500',
      'pr-10',
    ],
    error: [
      'border-red-500',
      'focus:border-red-500',
      'focus:ring-red-500',
      'pr-10',
    ],
  };

  return [...baseClasses, ...stateClasses[props.validationState]];
});

const messageClasses = computed(() => {
  const baseClasses = ['mt-1', 'text-sm'];
  
  if (props.validationState === 'error') {
    return [...baseClasses, 'text-red-600'];
  }
  
  return [...baseClasses, 'text-gray-500'];
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === 'number' ? parseFloat(target.value) : target.value;
  emit('update:modelValue', value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
/* Remove number input spinners */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
