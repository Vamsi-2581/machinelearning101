<template>
  <div class="checkbox-control">
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="checkboxId"
          ref="checkboxRef"
          type="checkbox"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          :aria-label="ariaLabel || label"
          :aria-describedby="helperText ? `${checkboxId}-description` : undefined"
          :class="checkboxClasses"
          @change="handleChange"
        />
      </div>
      <div v-if="label || helperText" class="ml-3 text-sm">
        <label
          v-if="label"
          :for="checkboxId"
          :class="labelClasses"
        >
          {{ label }}
          <span v-if="required" class="text-red-500" aria-label="required">*</span>
        </label>
        <p
          v-if="helperText"
          :id="`${checkboxId}-description`"
          class="text-gray-500"
        >
          {{ helperText }}
        </p>
      </div>
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
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}>();

const checkboxRef = ref<HTMLInputElement>();
const checkboxId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`);

const checkboxClasses = computed(() => [
  'h-4',
  'w-4',
  'rounded',
  'border-gray-300',
  'text-blue-600',
  'transition-colors',
  'duration-200',
  'focus:ring-2',
  'focus:ring-blue-500',
  'focus:ring-offset-2',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'cursor-pointer',
]);

const labelClasses = computed(() => [
  'font-medium',
  'text-gray-700',
  props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
};

defineExpose({
  focus: () => checkboxRef.value?.focus(),
  blur: () => checkboxRef.value?.blur(),
});
</script>
