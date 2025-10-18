<template>
  <ModuleLayout
    title="Example Module"
    description="This is an example module demonstrating the module layout system"
    difficulty="beginner"
    :estimated-time="15"
  >
    <!-- Content Section -->
    <template #content>
      <ContentSection
        title="Introduction"
        :markdown-content="contentMarkdown"
      />
      
      <ContentSection
        title="Key Concepts"
        collapsible
        :markdown-content="conceptsMarkdown"
      />
    </template>

    <!-- Interactive Section -->
    <template #interactive>
      <InteractiveSection
        :loading="isTraining"
        :progress="trainingProgress"
        loading-message="Training model..."
        :error="error"
        :on-retry="handleRetry"
      >
        <!-- Controls -->
        <template #controls>
          <ControlPanel
            :controls="controls"
            :values="parameters"
            :loading="isTraining"
            submit-label="Train Model"
            @change="handleParameterChange"
            @reset="handleReset"
            @submit="handleTrain"
          />
        </template>

        <!-- Visualization -->
        <template #visualization>
          <VisualizationPanel
            title="Results"
            type="scatter2d"
            :data="visualizationData"
            :allow-fullscreen="true"
            :allow-export="true"
          />
        </template>
      </InteractiveSection>
    </template>

    <!-- Quiz Section -->
    <template #quiz>
      <ContentSection title="Quiz">
        <p>Quiz component will go here...</p>
      </ContentSection>
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModuleLayout from '~/components/modules/ModuleLayout.vue';
import ContentSection from '~/components/modules/ContentSection.vue';
import InteractiveSection from '~/components/modules/InteractiveSection.vue';
import ControlPanel from '~/components/modules/ControlPanel.vue';
import VisualizationPanel from '~/components/modules/VisualizationPanel.vue';
import type { ControlConfig } from '~/components/modules/ControlPanel.vue';

// Content
const contentMarkdown = `
# Welcome to the Example Module

This module demonstrates how to use the **module layout system** to create interactive learning experiences.

## Features

- Interactive parameter controls
- Real-time visualizations
- Responsive design
- Accessible components

You can adjust parameters in the interactive section and see the results immediately.
`;

const conceptsMarkdown = `
## Understanding the Concepts

This section can be collapsed to save space. It contains additional information about the topic.

### Key Points

1. **Modularity**: Each component is self-contained
2. **Interactivity**: Real-time feedback on parameter changes
3. **Accessibility**: Keyboard navigation and screen reader support
`;

// Parameters
const parameters = ref({
  learningRate: 0.01,
  epochs: 100,
  datasetSize: 50,
  enableFeature: true,
  optimizer: 'sgd',
});

// Controls configuration
const controls: ControlConfig[] = [
  {
    id: 'learningRate',
    type: 'slider',
    label: 'Learning Rate',
    min: 0.001,
    max: 0.1,
    step: 0.001,
    tooltip: 'Controls how quickly the model learns',
    group: 'Training Parameters',
  },
  {
    id: 'epochs',
    type: 'slider',
    label: 'Epochs',
    min: 10,
    max: 500,
    step: 10,
    tooltip: 'Number of training iterations',
    group: 'Training Parameters',
  },
  {
    id: 'datasetSize',
    type: 'slider',
    label: 'Dataset Size',
    min: 20,
    max: 200,
    step: 10,
    group: 'Data',
  },
  {
    id: 'optimizer',
    type: 'select',
    label: 'Optimizer',
    options: [
      { label: 'SGD', value: 'sgd' },
      { label: 'Adam', value: 'adam' },
      { label: 'RMSProp', value: 'rmsprop' },
    ],
    group: 'Training Parameters',
  },
  {
    id: 'enableFeature',
    type: 'toggle',
    label: 'Enable Advanced Feature',
    group: 'Options',
  },
];

// Training state
const isTraining = ref(false);
const trainingProgress = ref(0);
const error = ref<string | null>(null);

// Visualization data
const visualizationData = ref<any>(null);

/**
 * Handle parameter change
 */
const handleParameterChange = (id: string, value: any) => {
  parameters.value[id] = value;
};

/**
 * Handle reset
 */
const handleReset = () => {
  parameters.value = {
    learningRate: 0.01,
    epochs: 100,
    datasetSize: 50,
    enableFeature: true,
    optimizer: 'sgd',
  };
  visualizationData.value = null;
  error.value = null;
};

/**
 * Handle train
 */
const handleTrain = async () => {
  isTraining.value = true;
  trainingProgress.value = 0;
  error.value = null;

  try {
    // Simulate training
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      trainingProgress.value = i / 10;
    }

    // Generate sample visualization data
    const n = parameters.value.datasetSize;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = Array.from({ length: n }, () => Math.random() * 100);

    visualizationData.value = [
      {
        x,
        y,
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
        marker: { color: '#3b82f6', size: 8 },
      },
    ];
  } catch (err) {
    error.value = 'Training failed. Please try again.';
  } finally {
    isTraining.value = false;
  }
};

/**
 * Handle retry
 */
const handleRetry = () => {
  error.value = null;
  handleTrain();
};
</script>

<style scoped>
/* Page-specific styles if needed */
</style>
