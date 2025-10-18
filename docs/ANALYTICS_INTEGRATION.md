# Analytics Integration Guide

This guide shows how to integrate analytics tracking throughout the application.

## Overview

Analytics tracking is implemented using:
1. **Analytics Store** (`stores/analytics.ts`): Centralized event tracking
2. **Plausible Integration** (`composables/usePlausible.ts`): Privacy-focused analytics service
3. **Module Tracking** (`composables/useModuleTracking.ts`): Time tracking and module-specific events

## Tracked Events

### 1. Module Visits
Track when a user opens a module page.

```typescript
// In module page setup
import { useAnalyticsStore } from '~/stores/analytics';

const analyticsStore = useAnalyticsStore();

onMounted(() => {
  analyticsStore.trackModuleVisit('module-id', 'Module Name');
});
```

### 2. Parameter Changes
Track when users adjust algorithm parameters.

```typescript
const handleParameterChange = (id: string, value: any) => {
  // Update parameter
  parameters.value[id] = value;
  
  // Track change
  analyticsStore.trackParameterChange('module-id', id, value);
};
```

### 3. Algorithm Runs
Track when users train/run algorithms, including duration.

```typescript
const handleTrain = async () => {
  const startTime = Date.now();
  
  // Train algorithm
  await algorithm.fit(X, y);
  
  const duration = Date.now() - startTime;
  
  // Track algorithm run
  analyticsStore.trackAlgorithmRun('module-id', parameters.value, duration);
};
```

### 4. Quiz Events

#### Quiz Answers
```typescript
// In Quiz component
const submitAnswer = () => {
  const isCorrect = selectedAnswer === correctAnswer;
  analyticsStore.trackQuizAnswer(moduleId, questionId, isCorrect);
};
```

#### Quiz Completion
```typescript
const completeQuiz = () => {
  const score = calculateScore();
  analyticsStore.trackQuizComplete(moduleId, score, totalQuestions);
};
```

### 5. Module Completion
Track when users complete a module.

```typescript
// Usually triggered after quiz completion with passing score
if (score >= 70) {
  progressStore.markModuleComplete(moduleId);
  analyticsStore.trackModuleComplete(moduleId);
}
```

### 6. Bookmarks
Track when users bookmark configurations.

```typescript
// In BookmarkButton component
const saveBookmark = () => {
  progressStore.addBookmark(bookmark);
  analyticsStore.trackBookmarkAdd(moduleId);
};
```

### 7. Generic Interactions
Track any other user interactions.

```typescript
analyticsStore.trackInteraction(moduleId, 'action_name', {
  customProp1: 'value1',
  customProp2: 123,
});
```

## Module Time Tracking

Use the `useModuleTracking` composable to track time spent on modules:

```typescript
import { useModuleTracking } from '~/composables/useModuleTracking';

const {
  startTracking,
  stopTracking,
  trackScrollDepth,
  trackSectionView,
  trackVisualizationInteraction,
  timeSpent
} = useModuleTracking('module-id', 'Module Name');

onMounted(() => {
  startTracking();
});

// Tracking is automatically stopped on unmount
```

### Scroll Depth Tracking
```typescript
const handleScroll = () => {
  const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100;
  trackScrollDepth(scrollPercentage);
};
```

### Section View Tracking
```typescript
const handleSectionView = (sectionName: string) => {
  trackSectionView(sectionName);
};
```

### Visualization Interaction Tracking
```typescript
const handleVisualizationClick = () => {
  trackVisualizationInteraction('zoom', { level: 2 });
};
```

## Complete Module Example

Here's a complete example of a module page with analytics:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModuleStore } from '~/stores/module';
import { useAnalyticsStore } from '~/stores/analytics';
import { useModuleTracking } from '~/composables/useModuleTracking';

const MODULE_ID = 'example-module';
const MODULE_NAME = 'Example Module';

// Stores
const moduleStore = useModuleStore();
const analyticsStore = useAnalyticsStore();

// Module tracking
const { startTracking, trackVisualizationInteraction } = useModuleTracking(
  MODULE_ID,
  MODULE_NAME
);

// Parameters
const parameters = ref({
  learningRate: 0.01,
  epochs: 100,
});

// Initialize
onMounted(() => {
  // Set current module
  moduleStore.setCurrentModule(MODULE_ID);
  
  // Track module visit
  analyticsStore.trackModuleVisit(MODULE_ID, MODULE_NAME);
  
  // Start time tracking
  startTracking();
});

// Handle parameter change
const handleParameterChange = (id: string, value: any) => {
  parameters.value[id] = value;
  analyticsStore.trackParameterChange(MODULE_ID, id, value);
};

// Handle algorithm run
const handleTrain = async () => {
  const startTime = Date.now();
  
  // Train algorithm
  await algorithm.fit(X, y);
  
  const duration = Date.now() - startTime;
  analyticsStore.trackAlgorithmRun(MODULE_ID, parameters.value, duration);
};

// Handle visualization interaction
const handleVisualizationZoom = () => {
  trackVisualizationInteraction('zoom');
};
</script>
```

## Page View Tracking

Page views are automatically tracked by the analytics plugin (`plugins/analytics.client.ts`) on route changes. No manual tracking needed.

## Privacy Considerations

### Opt-In Required
Analytics are only tracked if the user has opted in:

```typescript
const analyticsStore = useAnalyticsStore();

if (analyticsStore.optedIn) {
  // Track event
}
```

The store methods automatically check opt-in status, so you don't need to check manually.

### Anonymous Tracking
All tracking is anonymous:
- No personal information collected
- Anonymous session ID generated
- No cookies used
- GDPR compliant

### User Control
Users can opt in/out at any time through:
1. Cookie consent banner (first visit)
2. Privacy settings page
3. Footer privacy link

## Testing Analytics

### Development Mode
In development, events are logged to console:

```
[Analytics] module_visit { moduleId: 'linear-regression', moduleName: 'Linear Regression' }
[Analytics] parameter_change { moduleId: 'linear-regression', parameter: 'learningRate', value: 0.01 }
```

### Production Mode
In production, events are sent to Plausible Analytics (if configured).

### Testing Without Opt-In
Events are still tracked in the store but not sent to Plausible:

```typescript
// Check stored events
const analyticsStore = useAnalyticsStore();
console.log(analyticsStore.events);
```

## Best Practices

### 1. Track Meaningful Events
Only track events that provide value for understanding user behavior:
- ✅ Module visits, parameter changes, algorithm runs
- ❌ Every mouse movement, every scroll pixel

### 2. Include Context
Provide relevant context with events:

```typescript
// Good
analyticsStore.trackParameterChange('linear-regression', 'learningRate', 0.01);

// Better
analyticsStore.trackInteraction('linear-regression', 'parameter_change', {
  parameter: 'learningRate',
  value: 0.01,
  previousValue: 0.001,
  dataset: 'simple-linear',
});
```

### 3. Batch Related Events
Don't track every keystroke or slider movement. Use debouncing:

```typescript
import { useDebounceFn } from '@vueuse/core';

const debouncedTrack = useDebounceFn((id: string, value: any) => {
  analyticsStore.trackParameterChange(MODULE_ID, id, value);
}, 500);
```

### 4. Track Errors
Track errors to understand where users struggle:

```typescript
try {
  await algorithm.fit(X, y);
} catch (error) {
  analyticsStore.trackInteraction(MODULE_ID, 'algorithm_error', {
    error: error.message,
    parameters: parameters.value,
  });
}
```

### 5. Track Success Metrics
Track when users successfully complete tasks:

```typescript
// After successful training
if (metrics.r2Score > 0.8) {
  analyticsStore.trackInteraction(MODULE_ID, 'good_model', {
    r2Score: metrics.r2Score,
  });
}
```

## Checklist for New Modules

When creating a new module, ensure you:

- [ ] Track module visit in `onMounted`
- [ ] Track parameter changes in parameter handlers
- [ ] Track algorithm runs with duration
- [ ] Track quiz answers and completion (if quiz exists)
- [ ] Track module completion (if applicable)
- [ ] Track bookmark additions (if bookmarks enabled)
- [ ] Start time tracking with `useModuleTracking`
- [ ] Track visualization interactions (if applicable)
- [ ] Track errors and edge cases

## Troubleshooting

### Events Not Tracked
1. Check if user has opted in: `analyticsStore.optedIn`
2. Check console for errors
3. Verify store is imported correctly

### Events Not in Plausible
1. Verify environment variables are set
2. Check Plausible script is loaded
3. Verify domain is correct in Plausible dashboard
4. Check browser console for network errors

### Too Many Events
1. Use debouncing for frequent events
2. Only track meaningful milestones
3. Batch related events together

## Resources

- [Analytics Store](../stores/analytics.ts)
- [Plausible Composable](../composables/usePlausible.ts)
- [Module Tracking Composable](../composables/useModuleTracking.ts)
- [Analytics Plugin](../plugins/analytics.client.ts)
- [Plausible Documentation](https://plausible.io/docs)
