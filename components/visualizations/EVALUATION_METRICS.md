# Evaluation Metrics Visualization Components

This document describes the evaluation metrics visualization components implemented for the ML Learning Platform.

## Components

### 1. ConfusionMatrix

Renders a confusion matrix as a heatmap with calculated metrics.

**Props:**
- `confusionMatrix: number[][]` - 2D array representing the confusion matrix
- `classLabels?: string[]` - Optional labels for classes
- `title?: string` - Chart title (default: "Confusion Matrix")
- `showMetrics?: boolean` - Show accuracy, precision, recall, F1 (default: true)
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `height?: string` - Chart height (default: "500px")

**Features:**
- Heatmap visualization with cell annotations
- Automatic calculation of accuracy, precision, recall, and F1 score
- Macro-averaged metrics for multi-class classification
- Color-coded metric cards

**Example Usage:**
```vue
<ConfusionMatrix
  :confusionMatrix="[[50, 10], [5, 35]]"
  :classLabels="['Class 0', 'Class 1']"
  title="Binary Classification Results"
  :showMetrics="true"
/>
```

---

### 2. ROCCurve

Plots ROC (Receiver Operating Characteristic) curve with AUC calculation.

**Props:**
- `fpr: number[]` - False Positive Rate values
- `tpr: number[]` - True Positive Rate values
- `auc?: number | null` - Area Under Curve value
- `title?: string` - Chart title (default: "ROC Curve")
- `showDiagonal?: boolean` - Show random classifier line (default: true)
- `showAUC?: boolean` - Display AUC value and interpretation (default: true)
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `height?: string` - Chart height (default: "500px")

**Features:**
- Interactive ROC curve plot
- Diagonal reference line for random classifier
- AUC display with interpretation (Excellent/Good/Fair/Poor)
- Hover tooltips showing FPR and TPR values

**Example Usage:**
```vue
<ROCCurve
  :fpr="[0, 0.1, 0.2, 0.5, 1.0]"
  :tpr="[0, 0.6, 0.8, 0.95, 1.0]"
  :auc="0.92"
  title="Binary Classifier Performance"
/>
```

---

### 3. LearningCurves

Visualizes training vs validation performance to detect overfitting/underfitting.

**Props:**
- `trainingSizes: number[]` - Training set sizes
- `trainingScores: number[]` - Training scores at each size
- `validationScores: number[]` - Validation scores at each size
- `metricName?: string` - Name of the metric (default: "Score")
- `title?: string` - Chart title (default: "Learning Curves")
- `showIndicators?: boolean` - Show overfitting/underfitting indicators (default: true)
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `height?: string` - Chart height (default: "500px")

**Features:**
- Dual line plot for training and validation scores
- Automatic detection of overfitting, underfitting, and good fit
- Color-coded indicator cards with suggestions
- Interactive hover tooltips

**Indicators:**
- **Good Fit**: Training and validation scores are close and high
- **Overfitting**: Large gap between training and validation scores
- **Underfitting**: Both scores are low
- **High Variance**: Moderate gap between scores

**Example Usage:**
```vue
<LearningCurves
  :trainingSizes="[100, 200, 300, 400, 500]"
  :trainingScores="[0.75, 0.82, 0.87, 0.90, 0.92]"
  :validationScores="[0.70, 0.78, 0.83, 0.85, 0.86]"
  metricName="Accuracy"
  title="Model Learning Progress"
/>
```

---

### 4. CrossValidation

Displays cross-validation results with fold-by-fold performance and statistics.

**Props:**
- `foldScores: number[]` - Score for each fold
- `metricName?: string` - Name of the metric (default: "Score")
- `title?: string` - Chart title (default: "Cross-Validation Results")
- `showStats?: boolean` - Show mean, std, min, max (default: true)
- `showSplits?: boolean` - Show train/test split visualization (default: true)
- `numFolds?: number` - Number of folds (defaults to foldScores.length)
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `chartHeight?: string` - Chart height (default: "400px")

**Features:**
- Bar chart showing performance per fold
- Mean line overlay with annotation
- Statistics cards (mean, std, min, max)
- Visual representation of train/test splits for each fold
- Color-coded bars (above/below mean)

**Example Usage:**
```vue
<CrossValidation
  :foldScores="[0.85, 0.87, 0.83, 0.86, 0.84]"
  metricName="Accuracy"
  title="5-Fold Cross-Validation"
  :showStats="true"
  :showSplits="true"
/>
```

---

## Integration

All components are exported from `components/visualizations/index.ts`:

```typescript
import {
  ConfusionMatrix,
  ROCCurve,
  LearningCurves,
  CrossValidation
} from '~/components/visualizations';
```

Or use Nuxt's auto-import feature:

```vue
<template>
  <ConfusionMatrix :confusionMatrix="matrix" />
  <ROCCurve :fpr="fpr" :tpr="tpr" :auc="auc" />
  <LearningCurves :trainingSizes="sizes" :trainingScores="train" :validationScores="val" />
  <CrossValidation :foldScores="scores" />
</template>
```

## Type Definitions

Type definitions are available in `types/visualization.ts`:

```typescript
import type {
  ConfusionMatrixData,
  ROCCurveData,
  LearningCurvesData,
  CrossValidationData
} from '~/types/visualization';
```

## Requirements Satisfied

- **Requirement 3.1**: Confusion matrix visualization for classification models ✓
- **Requirement 3.2**: ROC curve with AUC for binary classifiers ✓
- **Requirement 3.5**: Learning curves showing training vs validation ✓
- **Requirement 3.4**: Cross-validation visualization with fold performance ✓
- **Requirement 3.6**: Tooltips and explanations for metrics ✓

## Notes

- All components use Plotly.js for interactive visualizations
- Components follow the existing BaseChart pattern for consistency
- Responsive design with proper error and loading states
- Accessible with proper ARIA labels and keyboard navigation
- Metrics calculations are performed client-side for real-time updates
