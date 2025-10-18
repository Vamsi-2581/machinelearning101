<template>
  <div class="control-panel">
    <!-- Control Groups -->
    <div
      v-for="(group, groupIndex) in groupedControls"
      :key="groupIndex"
      class="control-group"
    >
      <h4 v-if="group.title" class="group-title">{{ group.title }}</h4>
      
      <div class="controls-list">
        <div
          v-for="control in group.controls"
          :key="control.id"
          class="control-item"
        >
          <!-- Slider Control -->
          <Slider
            v-if="control.type === 'slider'"
            :model-value="values[control.id]"
            @update:model-value="handleChange(control.id, $event)"
            :label="control.label"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :tooltip="control.tooltip"
            :disabled="control.disabled"
            :formatter="control.formatter"
            :show-min-max="true"
          />

          <!-- Input Control -->
          <Input
            v-else-if="control.type === 'input'"
            :model-value="values[control.id]"
            @update:model-value="handleChange(control.id, $event)"
            :label="control.label"
            :type="control.inputType || 'text'"
            :placeholder="control.placeholder"
            :disabled="control.disabled"
            :error="validationErrors[control.id] || control.error"
          />

          <!-- Select Control -->
          <Select
            v-else-if="control.type === 'select'"
            :model-value="values[control.id]"
            @update:model-value="handleChange(control.id, $event)"
            :label="control.label"
            :options="control.options || []"
            :disabled="control.disabled"
          />

          <!-- Checkbox Control -->
          <Checkbox
            v-else-if="control.type === 'checkbox'"
            :model-value="values[control.id]"
            @update:model-value="handleChange(control.id, $event)"
            :label="control.label"
            :disabled="control.disabled"
          />

          <!-- Toggle Control -->
          <Toggle
            v-else-if="control.type === 'toggle'"
            :model-value="values[control.id]"
            @update:model-value="handleChange(control.id, $event)"
            :label="control.label"
            :disabled="control.disabled"
          />

          <!-- Validation error message -->
          <p v-if="validationErrors[control.id]" class="control-error">
            {{ validationErrors[control.id] }}
          </p>
          
          <!-- Tooltip for control -->
          <p v-if="control.description" class="control-description">
            {{ control.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <slot name="actions">
        <Button
          variant="primary"
          :disabled="disabled"
          :loading="loading"
          full-width
          @click="emit('submit')"
        >
          {{ submitLabel }}
        </Button>
        
        <Button
          variant="ghost"
          :disabled="disabled || loading"
          full-width
          @click="handleReset"
        >
          Reset
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Slider from '~/components/shared/Slider.vue';
import Input from '~/components/shared/Input.vue';
import Select from '~/components/shared/Select.vue';
import Checkbox from '~/components/shared/Checkbox.vue';
import Toggle from '~/components/shared/Toggle.vue';
import Button from '~/components/shared/Button.vue';

export interface ControlConfig {
  id: string;
  type: 'slider' | 'input' | 'select' | 'checkbox' | 'toggle';
  label: string;
  group?: string;
  
  // Common properties
  disabled?: boolean;
  tooltip?: string;
  description?: string;
  
  // Slider properties
  min?: number;
  max?: number;
  step?: number;
  formatter?: (value: number) => string;
  
  // Input properties
  inputType?: 'text' | 'number' | 'email';
  placeholder?: string;
  error?: string;
  
  // Select properties
  options?: Array<{ label: string; value: any }>;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ControlGroup {
  title?: string;
  controls: ControlConfig[];
}

interface Props {
  controls: ControlConfig[];
  values: Record<string, any>;
  disabled?: boolean;
  loading?: boolean;
  submitLabel?: string;
  validationErrors?: ValidationErrors;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  submitLabel: 'Run',
  validationErrors: () => ({}),
});

const emit = defineEmits<{
  change: [id: string, value: any];
  reset: [];
  submit: [];
}>();

/**
 * Group controls by their group property
 */
const groupedControls = computed<ControlGroup[]>(() => {
  const groups = new Map<string, ControlConfig[]>();
  
  props.controls.forEach(control => {
    const groupName = control.group || '';
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName)!.push(control);
  });

  return Array.from(groups.entries()).map(([title, controls]) => ({
    title: title || undefined,
    controls
  }));
});

/**
 * Handle control value change
 */
const handleChange = (id: string, value: any) => {
  emit('change', id, value);
};

/**
 * Handle reset button click
 */
const handleReset = () => {
  emit('reset');
};
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Control Groups */
.control-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group:not(:last-of-type) {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
}

/* Controls List */
.controls-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.control-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .control-panel {
    gap: 1.25rem;
  }

  .control-group {
    gap: 0.875rem;
  }

  .controls-list {
    gap: 1rem;
  }

  .action-buttons {
    gap: 0.5rem;
  }
}
</style>
