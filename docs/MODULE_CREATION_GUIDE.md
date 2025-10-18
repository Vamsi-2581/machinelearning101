# Quick Module Creation Guide

This is a condensed guide for quickly adding new learning modules to the platform.

## Quick Start Checklist

- [ ] Create content files (config.json, content.md, quiz.json)
- [ ] Implement algorithm class
- [ ] Create page component
- [ ] Add to domain navigation
- [ ] Test functionality
- [ ] Verify accessibility

## Step-by-Step Process

### 1. Create Content Directory

```bash
mkdir -p content/modules/[domain]/[module-name]
cd content/modules/[domain]/[module-name]
```

### 2. Create config.json

```json
{
  "id": "module-name",
  "name": "Display Name",
  "domain": "regression",
  "difficulty": "beginner",
  "estimatedTime": 30,
  "description": "Brief description",
  "prerequisites": [],
  "learningObjectives": [
    "Objective 1",
    "Objective 2"
  ],
  "interactive": {
    "algorithm": "AlgorithmClassName",
    "defaultParams": {
      "learningRate": 0.01,
      "epochs": 100
    },
    "controls": [
      {
        "id": "learningRate",
        "type": "slider",
        "label": "Learning Rate",
        "min": 0.001,
        "max": 0.1,
        "step": 0.001,
        "tooltip": "Controls learning speed"
      }
    ],
    "datasets": ["simple-linear", "noisy-linear"],
    "visualizations": [
      {
        "id": "main",
        "type": "scatter2d",
        "title": "Data and Model"
      }
    ]
  }
}
```

### 3. Create content.md

```markdown
# Module Name

## Introduction

Brief introduction to the concept and why it matters.

## Key Concepts

### Concept 1
Explanation of first key concept.

### Concept 2
Explanation of second key concept.

## How It Works

Step-by-step explanation of the algorithm:

1. Step one
2. Step two
3. Step three

## Mathematical Foundation

$$
y = mx + b
$$

Where:
- $y$ is the predicted value
- $m$ is the slope
- $x$ is the input
- $b$ is the intercept

## When to Use

Practical guidance on when this algorithm is appropriate:
- Use case 1
- Use case 2
- Use case 3

## Limitations

- Limitation 1
- Limitation 2

## Summary

Key takeaways:
- Takeaway 1
- Takeaway 2
- Takeaway 3
```

### 4. Create quiz.json

```json
{
  "questions": [
    {
      "id": "q1",
      "text": "What is the main purpose of this algorithm?",
      "type": "multiple-choice",
      "options": [
        "Option A",
        "Option B (correct)",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 1,
      "explanation": "Explanation of why B is correct and others are wrong."
    },
    {
      "id": "q2",
      "text": "True or False: This statement is correct.",
      "type": "true-false",
      "options": ["True", "False"],
      "correctAnswer": 0,
      "explanation": "Explanation of the answer."
    }
  ]
}
```

### 5. Implement Algorithm

Create `algorithms/[domain]/[AlgorithmName].ts`:

```typescript
import type { Algorithm, AlgorithmResults } from '~/types/algorithm';

/**
 * [Algorithm Name] implementation
 * 
 * Requirements: X.X, Y.Y
 */
export class AlgorithmName implements Algorithm {
  name = 'Algorithm Name';
  
  private param1: number;
  private param2: number;
  private results: any = null;
  
  constructor(param1: number = 0.01, param2: number = 100) {
    this.param1 = param1;
    this.param2 = param2;
  }
  
  async fit(X: number[][], y?: number[]): Promise<void> {
    // Validate input
    if (!X || X.length === 0) {
      throw new Error('Training data cannot be empty');
    }
    
    // Training logic here
    // Use await new Promise(resolve => setTimeout(resolve, 0))
    // periodically to avoid blocking
  }
  
  predict(X: number[][]): number[] | string[] {
    // Prediction logic
    return [];
  }
  
  getVisualizationData(): any {
    return {
      type: 'scatter2d',
      data: {
        // Visualization data
      }
    };
  }
  
  getMetrics(): Record<string, number> {
    return {
      metric1: 0,
      metric2: 0
    };
  }
  
  reset(): void {
    this.results = null;
  }
}
```

### 6. Create Page Component

Create `pages/modules/[domain]/[module-name].vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useModuleStore } from '~/stores/module';
import { AlgorithmName } from '~/algorithms/[domain]/AlgorithmName';

// Load module data
const config = await import(`~/content/modules/[domain]/[module-name]/config.json`);
const content = await import(`~/content/modules/[domain]/[module-name]/content.md`);
const quiz = await import(`~/content/modules/[domain]/[module-name]/quiz.json`);

// Initialize
const moduleStore = useModuleStore();
moduleStore.initModule(config.id, config.interactive.defaultParams);

const algorithm = ref<AlgorithmName | null>(null);
const isTraining = ref(false);

// Training handler
const handleTrain = async () => {
  try {
    isTraining.value = true;
    
    const params = moduleStore.parameters;
    algorithm.value = new AlgorithmName(params.param1, params.param2);
    
    const dataset = moduleStore.dataset;
    await algorithm.value.fit(dataset.X, dataset.y);
    
    moduleStore.setResults({
      visualizationData: algorithm.value.getVisualizationData(),
      metrics: algorithm.value.getMetrics()
    });
  } catch (error) {
    console.error('Training error:', error);
    // Show error toast
  } finally {
    isTraining.value = false;
  }
};

// SEO
useSEO({
  title: config.name,
  description: config.description
});
</script>

<template>
  <ModuleLayout
    :config="config"
    :content="content"
    :quiz="quiz"
  >
    <template #interactive>
      <InteractiveSection>
        <template #controls>
          <ControlPanel
            :controls="config.interactive.controls"
            :values="moduleStore.parameters"
            :loading="isTraining"
            @update="moduleStore.setParameter"
            @train="handleTrain"
            @reset="moduleStore.resetModule"
          />
        </template>
        
        <template #visualization>
          <VisualizationPanel
            v-if="moduleStore.results"
            :data="moduleStore.results.visualizationData"
          />
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            Adjust parameters and click Train to see results
          </div>
        </template>
      </InteractiveSection>
    </template>
  </ModuleLayout>
</template>
```

### 7. Add to Navigation

Update `pages/modules/[domain]/index.vue` to include your module in the list.

### 8. Test

```bash
# Start dev server
npm run dev

# Visit your module
# http://localhost:3000/modules/[domain]/[module-name]

# Test:
# - All controls work
# - Training completes successfully
# - Visualizations render correctly
# - Quiz functions properly
# - Responsive on mobile
# - Keyboard navigation works
# - No console errors

# Build to verify
npm run build
```

## Common Patterns

### Dataset Loading

```typescript
// In page component
const loadDataset = (datasetId: string) => {
  const datasets = {
    'simple-linear': generateLinearData(100, 0.5, 0),
    'noisy-linear': generateLinearData(100, 0.5, 0.2),
    'polynomial': generatePolynomialData(100, [1, 2, 1], 0.1)
  };
  
  moduleStore.setDataset(datasets[datasetId]);
};
```

### Progress Reporting

```typescript
// In algorithm
async fit(X: number[][], y: number[]): Promise<void> {
  for (let epoch = 0; epoch < this.epochs; epoch++) {
    // Training step
    
    // Yield every 10 epochs to update UI
    if (epoch % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

### Error Handling

```typescript
// In page component
const handleTrain = async () => {
  try {
    isTraining.value = true;
    await algorithm.value.fit(X, y);
  } catch (error) {
    const toastStore = useToastStore();
    toastStore.error('Training failed: ' + error.message);
  } finally {
    isTraining.value = false;
  }
};
```

### Metrics Display

```vue
<template>
  <div class="metrics-grid">
    <div v-for="(value, key) in metrics" :key="key" class="metric-card">
      <div class="metric-label">{{ formatLabel(key) }}</div>
      <div class="metric-value">{{ formatValue(value) }}</div>
    </div>
  </div>
</template>
```

## Control Types Reference

### Slider
```json
{
  "id": "learningRate",
  "type": "slider",
  "label": "Learning Rate",
  "min": 0.001,
  "max": 0.1,
  "step": 0.001,
  "tooltip": "Controls how fast the model learns"
}
```

### Select/Dropdown
```json
{
  "id": "optimizer",
  "type": "select",
  "label": "Optimizer",
  "options": [
    { "label": "SGD", "value": "sgd" },
    { "label": "Adam", "value": "adam" }
  ],
  "tooltip": "Optimization algorithm to use"
}
```

### Checkbox
```json
{
  "id": "useRegularization",
  "type": "checkbox",
  "label": "Use Regularization",
  "tooltip": "Apply L2 regularization to prevent overfitting"
}
```

### Number Input
```json
{
  "id": "numClusters",
  "type": "input",
  "inputType": "number",
  "label": "Number of Clusters",
  "min": 2,
  "max": 10,
  "tooltip": "How many clusters to find"
}
```

## Visualization Types

### Scatter Plot
```typescript
getVisualizationData() {
  return {
    type: 'scatter2d',
    data: {
      x: this.X.map(p => p[0]),
      y: this.y,
      mode: 'markers',
      name: 'Data Points'
    }
  };
}
```

### Line Chart
```typescript
getVisualizationData() {
  return {
    type: 'line',
    data: {
      x: this.history.epochs,
      y: this.history.loss,
      name: 'Training Loss'
    }
  };
}
```

### Heatmap
```typescript
getVisualizationData() {
  return {
    type: 'heatmap',
    data: {
      z: this.confusionMatrix,
      x: ['Class 0', 'Class 1'],
      y: ['Class 0', 'Class 1'],
      colorscale: 'Blues'
    }
  };
}
```

### 3D Surface
```typescript
getVisualizationData() {
  return {
    type: 'surface',
    data: {
      x: this.xGrid,
      y: this.yGrid,
      z: this.zGrid,
      colorscale: 'Viridis'
    }
  };
}
```

## Tips and Best Practices

### Performance
- Use typed arrays for large numerical data
- Yield control periodically in long loops
- Consider Web Workers for heavy computation
- Debounce parameter updates

### User Experience
- Show loading states during training
- Provide helpful error messages
- Add tooltips for all controls
- Display metrics in an easy-to-read format

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Testing
- Test with different datasets
- Verify edge cases (empty data, single point)
- Check responsive behavior
- Validate all controls work

## Troubleshooting

### Module doesn't appear
- Check file paths match exactly
- Verify config.json is valid JSON
- Ensure page component is in correct location

### Algorithm doesn't train
- Check for console errors
- Verify dataset format is correct
- Ensure parameters are valid
- Add try-catch for debugging

### Visualization doesn't render
- Check visualization data format
- Verify visualization type is supported
- Look for console errors
- Test with simple data first

### Performance issues
- Profile with browser DevTools
- Check for infinite loops
- Verify you're yielding control
- Consider reducing data size

## Need Help?

- See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed information
- Check existing modules for examples
- Ask in GitHub Discussions
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)
