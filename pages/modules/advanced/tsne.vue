<template>
  <ModuleLayout
    title="t-SNE Visualization"
    description="Learn how t-SNE reveals structure in high-dimensional data through non-linear dimensionality reduction"
    difficulty="advanced"
    :estimated-time="40"
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
        loading-message="Running t-SNE optimization..."
        :error="error"
        :on-retry="handleRetry"
      >
        <!-- Controls -->
        <template #controls>
          <ControlPanel
            :controls="controls"
            :values="parameters"
            :loading="isTraining"
            submit-label="Run t-SNE"
            @change="handleParameterChange"
            @reset="handleReset"
            @submit="handleTrain"
          />
          
          <!-- Metrics Display -->
          <div v-if="metrics" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">t-SNE Results</h3>
            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-500">Final Cost (KL Divergence)</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.finalCost?.toFixed(4) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Iterations</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.iterations }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Perplexity</div>
                <div class="text-lg font-semibold text-gray-900">{{ metrics.perplexity }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Dimensions</div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ metrics.nFeatures }}D → {{ metrics.nComponents }}D
                </div>
              </div>
            </div>
          </div>
          
          <!-- Animation Controls -->
          <div v-if="animationFrames.length > 0" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="text-sm font-semibold text-blue-700 mb-3">Animation</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Button
                  :disabled="isAnimating"
                  @click="playAnimation"
                  size="sm"
                >
                  {{ isAnimating ? 'Playing...' : 'Play Animation' }}
                </Button>
                <Button
                  :disabled="!isAnimating"
                  @click="stopAnimation"
                  size="sm"
                  variant="secondary"
                >
                  Stop
                </Button>
              </div>
              <div v-if="isAnimating" class="text-xs text-blue-600">
                Frame {{ currentFrame + 1 }} / {{ animationFrames.length }}
              </div>
            </div>
          </div>
        </template>

        <!-- Visualization -->
        <template #visualization>
          <div class="space-y-4">
            <LineChart
              v-if="lossSeries && lossSeries.length > 0"
              :series="lossSeries"
              title="Optimization Progress (KL Divergence)"
              x-label="Iteration"
              y-label="Cost"
              :show-legend="false"
              height="350px"
            />
            
            <Scatter2D
              v-if="embeddingSeries && embeddingSeries.length > 0"
              :series="embeddingSeries"
              title="t-SNE 2D Embedding"
              x-label="t-SNE Dimension 1"
              y-label="t-SNE Dimension 2"
              :show-legend="false"
              height="600px"
            />
            
            <Plot3D
              v-if="embedding3D"
              :data="embedding3D"
              title="t-SNE 3D Embedding"
              x-label="Dimension 1"
              y-label="Dimension 2"
              z-label="Dimension 3"
              height="600px"
            />
          </div>
        </template>
      </InteractiveSection>
    </template>

    <!-- Quiz Section -->
    <template #quiz>
      <Quiz
        v-if="quizData"
        :questions="quizData.questions"
        :title="quizData.title"
        :passing-score="quizData.passingScore"
        @complete="handleQuizComplete"
      />
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModuleStore } from '~/stores/module';
import { useProgressStore } from '~/stores/progress';
import { TSNE } from '~/algorithms/advanced/TSNE';
import Scatter2D from '~/components/visualizations/Scatter2D.vue';
import LineChart from '~/components/visualizations/LineChart.vue';
import Plot3D from '~/components/visualizations/Plot3D.vue';
import type { ControlConfig } from '~/components/modules/ControlPanel.vue';
import type { Metrics } from '~/types/algorithm';
import type { ScatterSeries } from '~/components/visualizations/Scatter2D.vue';
import type { LineSeries } from '~/components/visualizations/LineChart.vue';


// Content
const contentMarkdown = `
# t-SNE (t-Distributed Stochastic Neighbor Embedding)

t-SNE is a powerful non-linear dimensionality reduction technique specifically designed for visualizing high-dimensional data. Unlike PCA, which preserves global structure, t-SNE excels at preserving local structure and revealing clusters.

## What You'll Learn

- How t-SNE differs from linear methods like PCA
- The role of perplexity in controlling local vs global structure
- How to interpret t-SNE visualizations correctly
- When t-SNE is appropriate and its limitations
- How the optimization process works iteratively
`;

const howItWorksMarkdown = `
## The t-SNE Algorithm

t-SNE works through these key steps:

1. **Compute pairwise similarities in high-dimensional space**: Using Gaussian distributions
2. **Initialize random low-dimensional embedding**: Start with random positions
3. **Compute pairwise similarities in low-dimensional space**: Using Student t-distribution
4. **Minimize KL divergence**: Iteratively adjust positions to match similarity distributions
5. **Converge to final embedding**: Stop when cost stabilizes

## Key Concepts

### Perplexity

Perplexity is the most important hyperparameter:

- **Low perplexity (5-15)**: Focuses on very local structure, may create many small clusters
- **Medium perplexity (30-50)**: Balanced view, typical default
- **High perplexity (50-100)**: Emphasizes global structure, may merge clusters

Think of perplexity as the number of nearest neighbors to consider.

### Student t-Distribution

t-SNE uses a Student t-distribution (heavy-tailed) in low dimensions:

- Allows moderate distances in high dimensions to become larger distances in low dimensions
- Prevents "crowding problem" where points are forced too close together
- Creates clearer separation between clusters

### KL Divergence

The cost function measures how well the low-dimensional embedding preserves similarities:

- Lower cost = better preservation of structure
- Cost decreases during optimization
- Final cost value is not directly interpretable across different datasets

## Interpreting t-SNE Plots

### What t-SNE Shows

✅ **Cluster structure**: Groups of similar points
✅ **Local relationships**: Nearby points are similar
✅ **Relative cluster sizes**: Larger clusters have more points

### What t-SNE Doesn't Show

❌ **Distances between clusters**: Not meaningful
❌ **Global structure**: Overall shape may be arbitrary
❌ **Cluster sizes**: Visual size doesn't indicate importance
❌ **Axes**: Dimensions have no inherent meaning

## Important Considerations

### Multiple Runs

t-SNE is stochastic (random initialization):
- Different runs produce different embeddings
- All may be valid representations
- Run multiple times to check consistency

### Perplexity Sensitivity

Try different perplexity values:
- Too low: Fragments data into many clusters
- Too high: Merges distinct clusters
- Typical range: 5-50 for most datasets

### Computational Cost

t-SNE is computationally expensive:
- O(n²) complexity in number of samples
- Can be slow for large datasets (>10,000 points)
- Consider using PCA first to reduce to ~50 dimensions
`;


// Stores and composables
const moduleStore = useModuleStore();
const progressStore = useProgressStore();

// Parameters
const parameters = ref({
  nComponents: 2,
  perplexity: 30,
  learningRate: 200,
  maxIterations: 500,
  dataset: 'mnist-sample',
});

// Controls configuration
const controls: ControlConfig[] = [
  {
    id: 'dataset',
    type: 'select',
    label: 'Dataset',
    options: [
      { label: 'MNIST Sample (10D)', value: 'mnist-sample' },
      { label: 'Iris (4D)', value: 'iris' },
      { label: 'Swiss Roll (3D)', value: 'swiss-roll' },
    ],
    tooltip: 'Choose a dataset to visualize',
    group: 'Data',
  },
  {
    id: 'perplexity',
    type: 'slider',
    label: 'Perplexity',
    min: 5,
    max: 50,
    step: 5,
    tooltip: 'Balance between local and global structure. Higher values consider more neighbors.',
    group: 't-SNE Parameters',
  },
  {
    id: 'learningRate',
    type: 'slider',
    label: 'Learning Rate',
    min: 10,
    max: 1000,
    step: 10,
    tooltip: 'Step size for gradient descent. Typical range: 10-1000.',
    group: 't-SNE Parameters',
  },
  {
    id: 'maxIterations',
    type: 'slider',
    label: 'Max Iterations',
    min: 250,
    max: 2000,
    step: 250,
    tooltip: 'Number of optimization iterations. More iterations = better convergence but slower.',
    group: 't-SNE Parameters',
  },
  {
    id: 'nComponents',
    type: 'select',
    label: 'Output Dimensions',
    options: [
      { label: '2D', value: 2 },
      { label: '3D', value: 3 },
    ],
    tooltip: 'Number of dimensions in the output embedding',
    group: 't-SNE Parameters',
  },
];

// Training state
const isTraining = ref(false);
const trainingProgress = ref(0);
const error = ref<string | null>(null);

// Results
const metrics = ref<Metrics | null>(null);
const lossSeries = ref<LineSeries[]>([]);
const embeddingSeries = ref<ScatterSeries[]>([]);
const embedding3D = ref<any>(null);

// Animation
const animationFrames = ref<number[][][]>([]);
const currentFrame = ref(0);
const isAnimating = ref(false);
let animationInterval: any = null;

// Quiz data
const quizData = ref<any>(null);

// Algorithm instance
let algorithm: TSNE | null = null;

/**
 * Initialize module
 */
onMounted(async () => {
  moduleStore.setCurrentModule('tsne');
  moduleStore.setParameters(parameters.value);
  
  // Load default dataset
  await loadInitialDataset();
  
  // Load quiz data
  try {
    const quiz = await import('../../../content/modules/advanced/tsne/quiz.json');
    quizData.value = quiz.default || quiz;
  } catch (err) {
    console.warn('Quiz data not found');
  }
});

/**
 * Generate synthetic datasets
 */
const generateSyntheticData = (datasetType: string) => {
  let n = 150;
  let d = 4;
  
  if (datasetType === 'mnist-sample') {
    n = 100;
    d = 10;
  } else if (datasetType === 'swiss-roll') {
    n = 200;
    d = 3;
  }
  
  const data = [];
  const nClusters = 3;
  
  for (let i = 0; i < n; i++) {
    const features = [];
    const cluster = Math.floor(i / (n / nClusters));
    
    if (datasetType === 'swiss-roll') {
      // Swiss roll manifold
      const t = (i / n) * 4 * Math.PI;
      const x = t * Math.cos(t);
      const y = (Math.random() - 0.5) * 20;
      const z = t * Math.sin(t);
      features.push(x, y, z);
    } else {
      // Random high-dimensional data with cluster structure
      for (let j = 0; j < d; j++) {
        const base = cluster * 5 + (j % 2) * 2;
        const noise = (Math.random() - 0.5) * 3;
        features.push(base + noise);
      }
    }
    
    data.push({
      features,
      label: cluster,
      id: `point-${i}`
    });
  }
  
  return data;
};

/**
 * Load initial dataset
 */
const loadInitialDataset = async () => {
  const syntheticData = generateSyntheticData(parameters.value.dataset);
  moduleStore.loadDataset(syntheticData);
};


/**
 * Handle parameter change
 */
const handleParameterChange = async (id: string, value: any) => {
  parameters.value[id] = value;
  moduleStore.setParameter(id, value);
  
  // Reload dataset if changed
  if (id === 'dataset') {
    await loadInitialDataset();
    // Clear previous results
    metrics.value = null;
    lossSeries.value = [];
    embeddingSeries.value = [];
    embedding3D.value = null;
    animationFrames.value = [];
  }
};

/**
 * Handle reset
 */
const handleReset = async () => {
  stopAnimation();
  
  parameters.value = {
    nComponents: 2,
    perplexity: 30,
    learningRate: 200,
    maxIterations: 500,
    dataset: 'mnist-sample',
  };
  moduleStore.setParameters(parameters.value);
  
  await loadInitialDataset();
  
  metrics.value = null;
  lossSeries.value = [];
  embeddingSeries.value = [];
  embedding3D.value = null;
  animationFrames.value = [];
  error.value = null;
};

/**
 * Handle train
 */
const handleTrain = async () => {
  stopAnimation();
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
    
    // Validate perplexity
    if (parameters.value.perplexity >= X.length) {
      throw new Error(`Perplexity (${parameters.value.perplexity}) must be less than number of samples (${X.length})`);
    }
    
    // Create and train algorithm
    algorithm = new TSNE({
      nComponents: parameters.value.nComponents,
      perplexity: parameters.value.perplexity,
      learningRate: parameters.value.learningRate,
      maxIterations: parameters.value.maxIterations
    });
    
    // Train
    const startTime = Date.now();
    await algorithm.fit(X);
    const endTime = Date.now();
    
    console.log(`t-SNE completed in ${endTime - startTime}ms`);
    
    // Get results
    metrics.value = algorithm.getMetrics();
    const visualizations = algorithm.getVisualizationData();
    animationFrames.value = algorithm.getAnimationFrames();
    
    // Process visualizations
    if (visualizations.length > 0) {
      // Loss curve
      const lossViz = visualizations[0];
      if (lossViz.type === 'line' && lossViz.data?.loss) {
        lossSeries.value = [{
          x: lossViz.data.loss.x,
          y: lossViz.data.loss.y,
          name: lossViz.data.loss.name || 'KL Divergence',
          color: lossViz.data.loss.line?.color || '#ef4444',
          width: lossViz.data.loss.line?.width || 2,
        }];
      }
      
      // 2D embedding
      if (visualizations.length > 1) {
        const embViz = visualizations[1];
        if (embViz.type === 'scatter2d' && embViz.data?.embedding) {
          embeddingSeries.value = [{
            x: embViz.data.embedding.x,
            y: embViz.data.embedding.y,
            name: embViz.data.embedding.name || 't-SNE Embedding',
            color: embViz.data.embedding.marker?.color || '#8b5cf6',
            mode: 'markers',
            marker: {
              size: embViz.data.embedding.marker?.size || 8,
              opacity: embViz.data.embedding.marker?.opacity || 0.7
            }
          }];
        }
      }
      
      // 3D embedding
      if (visualizations.length > 2 && parameters.value.nComponents >= 3) {
        const emb3DViz = visualizations[2];
        if (emb3DViz.type === 'scatter3d' && emb3DViz.data) {
          embedding3D.value = [emb3DViz.data];
        }
      }
    }
    
    trainingProgress.value = 1;
  } catch (err) {
    console.error('t-SNE error:', err);
    error.value = err instanceof Error ? err.message : 't-SNE failed. Please try again.';
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

/**
 * Play animation
 */
const playAnimation = () => {
  if (animationFrames.value.length === 0) return;
  
  isAnimating.value = true;
  currentFrame.value = 0;
  
  animationInterval = setInterval(() => {
    currentFrame.value++;
    
    if (currentFrame.value >= animationFrames.value.length) {
      stopAnimation();
      return;
    }
    
    // Update visualization with current frame
    const frame = animationFrames.value[currentFrame.value];
    if (frame && frame.length > 0) {
      const x = frame.map(point => point[0]);
      const y = frame.map(point => point[1]);
      
      embeddingSeries.value = [{
        x,
        y,
        name: `Iteration ${currentFrame.value}`,
        color: '#8b5cf6',
        mode: 'markers',
        marker: {
          size: 8,
          opacity: 0.7
        }
      }];
    }
  }, 500); // 500ms per frame
};

/**
 * Stop animation
 */
const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
  isAnimating.value = false;
  
  // Reset to final frame
  if (algorithm && animationFrames.value.length > 0) {
    const finalFrame = animationFrames.value[animationFrames.value.length - 1];
    if (finalFrame && finalFrame.length > 0) {
      const x = finalFrame.map(point => point[0]);
      const y = finalFrame.map(point => point[1]);
      
      embeddingSeries.value = [{
        x,
        y,
        name: 't-SNE Embedding',
        color: '#8b5cf6',
        mode: 'markers',
        marker: {
          size: 8,
          opacity: 0.7
        }
      }];
    }
  }
};

/**
 * Handle quiz completion
 */
const handleQuizComplete = (score: number, answers: any[]) => {
  progressStore.saveQuizScore('tsne', score);
  
  if (score >= (quizData.value?.passingScore || 70)) {
    progressStore.markModuleComplete('tsne');
  }
};
</script>
