<template>
  <ModuleLayout
    title="Linear Regression"
    description="Learn how linear regression finds the best-fit line through data using gradient descent"
    difficulty="beginner"
    :estimated-time="30"
    module-id="linear-regression"
    :previous-module="previousModule"
    :next-module="nextModule"
    :suggested-module="suggestedModule"
  >
    <!-- Content Section -->
    <template #content>
      <ContentSection
        title="Introduction"
        :markdown-content="contentMarkdown"
      />
      
      <ContentSection
        title="How It Works"
        collapsible
        :markdown-content="howItWorksMarkdown"
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
          
          <!-- Metrics Display -->
          <div v-if="metrics" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Model Performance</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-gray-500">MSE</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.mse?.toFixed(4) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">RMSE</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.rmse?.toFixed(4) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">R² Score</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.r2Score?.toFixed(4) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">MAE</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.mae?.toFixed(4) }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Visualization -->
        <template #visualization>
          <div class="space-y-4">
            <Scatter2D
              v-if="scatterSeries && scatterSeries.length > 0"
              :series="scatterSeries"
              title="Data & Regression Line"
              x-label="X"
              y-label="Y"
              :show-legend="true"
              height="500px"
            />
            
            <LineChart
              v-if="lossSeries && lossSeries.length > 0"
              :series="lossSeries"
              title="Training Loss"
              x-label="Epoch"
              y-label="Loss"
              :show-legend="false"
              height="350px"
            />
          </div>
        </template>
      </InteractiveSection>
    </template>

    <!-- Quiz Section -->
    <template #quiz>
      <ContentSection title="Test Your Knowledge">
        <p class="text-gray-600">Quiz coming soon...</p>
      </ContentSection>
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModuleStore } from '~/stores/module';
import { useAnalyticsStore } from '~/stores/analytics';
import { useDataset } from '~/composables/useDataset';
import { useModules } from '~/composables/useModules';
import { LinearRegression } from '~/algorithms/regression/LinearRegression';
import Scatter2D from '~/components/visualizations/Scatter2D.vue';
import LineChart from '~/components/visualizations/LineChart.vue';
import type { ControlConfig } from '~/components/modules/ControlPanel.vue';
import type { Metrics } from '~/types/algorithm';
import type { ScatterSeries } from '~/components/visualizations/Scatter2D.vue';
import type { LineSeries } from '~/components/visualizations/LineChart.vue';
import type { ModuleNavItem } from '~/types/module';

// Content
const contentMarkdown = `
# Linear Regression

Linear regression is one of the simplest and most widely used machine learning algorithms. It models the relationship between a dependent variable (target) and one or more independent variables (features) by fitting a linear equation to the observed data.

## What You'll Learn

- How gradient descent optimizes the model parameters
- The impact of learning rate on convergence
- How to interpret regression metrics (MSE, RMSE, R²)
- The relationship between data and the fitted line
`;

const howItWorksMarkdown = `
## The Linear Model

For simple linear regression with one feature, the model is:

\`\`\`
y = w₀ + w₁x
\`\`\`

Where:
- **y** is the predicted value
- **x** is the input feature
- **w₁** is the weight (slope)
- **w₀** is the bias (intercept)

## Gradient Descent

The algorithm uses gradient descent to find the best weights:

1. Start with random weights
2. Calculate predictions for all data points
3. Compute the error (loss) using Mean Squared Error
4. Update weights in the direction that reduces the error
5. Repeat for a specified number of epochs

## Key Metrics

- **MSE (Mean Squared Error)**: Average squared difference between predictions and actual values
- **RMSE (Root Mean Squared Error)**: Square root of MSE, in the same units as the target
- **R² Score**: Proportion of variance explained by the model (1.0 is perfect, 0.0 is no better than mean)
- **MAE (Mean Absolute Error)**: Average absolute difference between predictions and actual values
`;

// Stores and composables
const moduleStore = useModuleStore();
const analyticsStore = useAnalyticsStore();
const { loadDataset, getDatasetsByType } = useDataset();
const { getNextModule, getPreviousModule } = useModules();

// Navigation
const previousModule = ref<ModuleNavItem | null>(null);
const nextModule = ref<ModuleNavItem | null>(null);
const suggestedModule = ref<ModuleNavItem | null>(null);

// Parameters
const parameters = ref({
  learningRate: 0.01,
  epochs: 100,
  dataset: 'simple-linear',
});

// Controls configuration
const controls: ControlConfig[] = [
  {
    id: 'dataset',
    type: 'select',
    label: 'Dataset',
    options: getDatasetsByType('regression').map(d => ({
      label: d.name,
      value: d.id
    })),
    tooltip: 'Choose a dataset to train on',
    group: 'Data',
  },
  {
    id: 'learningRate',
    type: 'slider',
    label: 'Learning Rate',
    min: 0.001,
    max: 0.1,
    step: 0.001,
    tooltip: 'Controls how quickly the model learns. Too high may overshoot, too low may converge slowly.',
    group: 'Training Parameters',
  },
  {
    id: 'epochs',
    type: 'slider',
    label: 'Epochs',
    min: 10,
    max: 500,
    step: 10,
    tooltip: 'Number of training iterations. More epochs allow the model to learn better but take longer.',
    group: 'Training Parameters',
  },
];

// Training state
const isTraining = ref(false);
const trainingProgress = ref(0);
const error = ref<string | null>(null);

// Results
const metrics = ref<Metrics | null>(null);
const scatterSeries = ref<ScatterSeries[]>([]);
const lossSeries = ref<LineSeries[]>([]);

// Algorithm instance
let algorithm: LinearRegression | null = null;

/**
 * Initialize module
 */
onMounted(async () => {
  moduleStore.setCurrentModule('linear-regression');
  moduleStore.setParameters(parameters.value);
  
  // Track module visit
  analyticsStore.trackModuleVisit('linear-regression', 'Linear Regression');
  
  // Load default dataset
  await loadInitialDataset();

  // Load navigation
  previousModule.value = await getPreviousModule('linear-regression');
  nextModule.value = await getNextModule('linear-regression');
  
  // For now, suggested module is the same as next module
  // In the future, this could be based on prerequisites or user progress
  suggestedModule.value = nextModule.value;
});

/**
 * Load initial dataset
 */
const loadInitialDataset = async () => {
  const dataset = await loadDataset(parameters.value.dataset);
  if (dataset) {
    moduleStore.loadDataset(dataset.data);
  }
};

/**
 * Handle parameter change
 */
const handleParameterChange = async (id: string, value: any) => {
  parameters.value[id] = value;
  moduleStore.setParameter(id, value);
  
  // Track parameter change
  analyticsStore.trackParameterChange('linear-regression', id, value);
  
  // Reload dataset if changed
  if (id === 'dataset') {
    const dataset = await loadDataset(value);
    if (dataset) {
      moduleStore.loadDataset(dataset.data);
      // Clear previous results
      metrics.value = null;
      scatterSeries.value = [];
      lossSeries.value = [];
    }
  }
};

/**
 * Handle reset
 */
const handleReset = async () => {
  parameters.value = {
    learningRate: 0.01,
    epochs: 100,
    dataset: 'simple-linear',
  };
  moduleStore.setParameters(parameters.value);
  
  await loadInitialDataset();
  
  metrics.value = null;
  scatterSeries.value = [];
  lossSeries.value = [];
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
    // Get dataset from store
    const dataset = moduleStore.dataset;
    if (!dataset || dataset.length === 0) {
      throw new Error('No dataset loaded');
    }
    
    // Prepare data
    const X = dataset.map(d => d.features);
    const y = dataset.map(d => d.label as number);
    
    // Create and train algorithm
    algorithm = new LinearRegression({
      learningRate: parameters.value.learningRate,
      epochs: parameters.value.epochs,
      normalize: false
    });
    
    // Train with progress updates
    const startTime = Date.now();
    await algorithm.fit(X, y);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Training completed in ${duration}ms`);
    
    // Track algorithm run
    analyticsStore.trackAlgorithmRun('linear-regression', parameters.value, duration);
    
    // Get results
    metrics.value = algorithm.getMetrics();
    const visualizations = algorithm.getVisualizationData();
    
    // Process visualizations
    if (visualizations.length > 0) {
      // Scatter plot with regression line
      const scatterViz = visualizations[0];
      if (scatterViz.type === 'scatter2d' && scatterViz.data) {
        const series: ScatterSeries[] = [];
        
        // Add data points
        if (scatterViz.data.scatter) {
          series.push({
            x: scatterViz.data.scatter.x,
            y: scatterViz.data.scatter.y,
            name: scatterViz.data.scatter.name || 'Data Points',
            color: scatterViz.data.scatter.marker?.color || '#3b82f6',
            mode: 'markers',
            marker: {
              size: scatterViz.data.scatter.marker?.size || 8,
            }
          });
        }
        
        // Add regression line
        if (scatterViz.data.line) {
          series.push({
            x: scatterViz.data.line.x,
            y: scatterViz.data.line.y,
            name: scatterViz.data.line.name || 'Regression Line',
            color: scatterViz.data.line.line?.color || '#ef4444',
            mode: 'lines',
          });
        }
        
        scatterSeries.value = series;
      }
      
      // Loss curve
      if (visualizations.length > 2) {
        const lossViz = visualizations[2];
        if (lossViz.type === 'line' && lossViz.data) {
          lossSeries.value = [{
            x: lossViz.data.x,
            y: lossViz.data.y,
            name: lossViz.data.name || 'Training Loss',
            color: lossViz.data.line?.color || '#10b981',
            width: lossViz.data.line?.width || 2,
          }];
        }
      }
    }
    
    trainingProgress.value = 1;
  } catch (err) {
    console.error('Training error:', err);
    error.value = err instanceof Error ? err.message : 'Training failed. Please try again.';
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

// SEO
useSEO({
  title: 'Linear Regression - Interactive ML Tutorial',
  description: 'Learn linear regression through interactive visualization. Adjust learning rates, train models, and see gradient descent in action. Master regression metrics like MSE, RMSE, and R².',
  keywords: 'linear regression, gradient descent, machine learning tutorial, regression metrics, MSE, RMSE, R squared',
  url: '/modules/regression/linear-regression',
  type: 'article',
  section: 'Regression',
})

// Course structured data
useCourseStructuredData({
  name: 'Linear Regression',
  description: 'Learn how linear regression finds the best-fit line through data using gradient descent',
  provider: 'ML Simplified',
  url: '/modules/regression/linear-regression',
  difficulty: 'beginner',
  timeRequired: 'PT30M',
  keywords: ['linear regression', 'gradient descent', 'machine learning', 'regression'],
})

// Breadcrumb structured data
useBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Learning Modules', url: '/modules' },
  { name: 'Regression', url: '/modules/regression' },
  { name: 'Linear Regression', url: '/modules/regression/linear-regression' },
])
</script>
