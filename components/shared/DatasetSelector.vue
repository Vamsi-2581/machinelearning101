<template>
  <div class="dataset-selector">
    <div class="selector-header">
      <label :for="selectId" class="selector-label">
        {{ label }}
      </label>
      <button
        v-if="showPreview && selectedDataset"
        type="button"
        class="preview-button"
        @click="togglePreview"
        :aria-expanded="previewOpen"
        aria-controls="dataset-preview"
      >
        {{ previewOpen ? 'Hide' : 'Show' }} Preview
      </button>
    </div>

    <select
      :id="selectId"
      v-model="selectedId"
      class="dataset-select"
      @change="handleChange"
      :disabled="disabled"
    >
      <option value="" disabled>Select a dataset...</option>
      <option
        v-for="option in filteredOptions"
        :key="option.id"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>

    <p v-if="selectedOption" class="dataset-description">
      {{ selectedOption.description }}
    </p>

    <div
      v-if="showPreview && previewOpen && selectedDataset"
      id="dataset-preview"
      class="dataset-preview"
    >
      <h4 class="preview-title">Dataset Preview</h4>
      
      <div class="preview-stats">
        <div class="stat">
          <span class="stat-label">Samples:</span>
          <span class="stat-value">{{ selectedDataset.samples }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Features:</span>
          <span class="stat-value">{{ selectedDataset.features }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Type:</span>
          <span class="stat-value">{{ selectedDataset.type }}</span>
        </div>
      </div>

      <div v-if="previewData.length > 0" class="preview-data">
        <p class="preview-subtitle">First {{ previewData.length }} points:</p>
        <div class="preview-table-wrapper">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="(_, idx) in selectedDataset.features" :key="`feature-${idx}`">
                  {{ selectedDataset.metadata?.featureNames?.[idx] || `Feature ${idx}` }}
                </th>
                <th v-if="selectedDataset.type !== 'clustering'">
                  {{ selectedDataset.metadata?.labelName || 'Label' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(point, idx) in previewData" :key="point.id || idx">
                <td v-for="(value, fIdx) in point.features" :key="`${idx}-${fIdx}`">
                  {{ value.toFixed(2) }}
                </td>
                <td v-if="selectedDataset.type !== 'clustering'">
                  {{ typeof point.label === 'number' ? point.label.toFixed(2) : point.label }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <p v-if="error" class="error-message" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, readonly } from 'vue';
import type { DatasetType, Dataset } from '../../types/dataset';
import { useDataset, type DatasetOption } from '../../composables/useDataset';

interface Props {
  label?: string;
  filterType?: DatasetType;
  disabled?: boolean;
  showPreview?: boolean;
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'datasetLoaded', dataset: Dataset): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Dataset',
  disabled: false,
  showPreview: true,
  modelValue: ''
});

const emit = defineEmits<Emits>();

const { getAvailableDatasets, getDatasetsByType, getDatasetOption, loadDataset } = useDataset();

const selectedId = ref(props.modelValue);
const selectedDataset = ref<Dataset | null>(null);
const previewOpen = ref(false);
const error = ref<string | null>(null);

const selectId = computed(() => `dataset-select-${Math.random().toString(36).substr(2, 9)}`);

const filteredOptions = computed((): DatasetOption[] => {
  if (props.filterType) {
    return getDatasetsByType(props.filterType);
  }
  return getAvailableDatasets();
});

const selectedOption = computed(() => {
  if (!selectedId.value) return null;
  return getDatasetOption(selectedId.value);
});

const previewData = computed(() => {
  if (!selectedDataset.value) return [];
  return selectedDataset.value.data.slice(0, 10);
});

const handleChange = async () => {
  error.value = null;
  
  if (!selectedId.value) {
    selectedDataset.value = null;
    emit('update:modelValue', '');
    return;
  }

  try {
    const dataset = await loadDataset(selectedId.value);
    
    if (dataset) {
      selectedDataset.value = dataset;
      emit('update:modelValue', selectedId.value);
      emit('datasetLoaded', dataset);
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load dataset';
    console.error('Error loading dataset:', e);
  }
};

const togglePreview = () => {
  previewOpen.value = !previewOpen.value;
};

// Watch for external changes to modelValue
watch(() => props.modelValue, async (newValue) => {
  if (newValue !== selectedId.value) {
    selectedId.value = newValue;
    if (newValue) {
      await handleChange();
    }
  }
});

// Load initial dataset if modelValue is provided
onMounted(async () => {
  if (props.modelValue) {
    await handleChange();
  }
});
</script>

<style scoped>
.dataset-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selector-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.preview-button {
  font-size: 0.75rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  text-decoration: underline;
}

.preview-button:hover {
  color: #2563eb;
}

.preview-button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.dataset-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
}

.dataset-select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.dataset-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dataset-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dataset-preview {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #f9fafb;
}

.preview-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #111827;
}

.preview-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.stat-label {
  font-weight: 500;
  color: #6b7280;
}

.stat-value {
  color: #111827;
}

.preview-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.preview-table-wrapper {
  overflow-x: auto;
}

.preview-table {
  width: 100%;
  font-size: 0.75rem;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.preview-table th {
  font-weight: 600;
  color: #374151;
  background-color: #f3f4f6;
}

.preview-table td {
  color: #6b7280;
}

.error-message {
  font-size: 0.75rem;
  color: #dc2626;
  margin: 0;
  padding: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
}
</style>
