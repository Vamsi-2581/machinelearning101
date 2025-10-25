# Pinia Stores

This directory contains the Pinia stores for state management in the ML Learning Platform.

## Stores

### Module Store (`module.ts`)

Manages algorithm module state including parameters, datasets, results, and training status.

**Usage:**

```typescript
const moduleStore = useModuleStore();

// Set parameters
moduleStore.setParameter('learningRate', 0.01);
moduleStore.setParameters({ learningRate: 0.01, epochs: 100 });

// Load dataset
moduleStore.loadDataset(dataPoints);

// Run algorithm
await moduleStore.runAlgorithm(async () => {
  // Your algorithm logic here
  return results;
});

// Access state
const params = moduleStore.currentParams;
const hasResults = moduleStore.hasResults;

// Reset
moduleStore.resetModule();
```

### Progress Store (`progress.ts`)

Manages user progress tracking with localStorage persistence.

**Usage:**

```typescript
const progressStore = useProgressStore();

// Mark module complete
progressStore.markModuleComplete('linear-regression');

// Save quiz score
progressStore.saveQuizScore('linear-regression', 85);

// Add bookmark
progressStore.addBookmark({
  moduleId: 'linear-regression',
  name: 'My Configuration',
  parameters: { learningRate: 0.01 },
});

// Access progress
const completion = progressStore.completionPercentage;
const avgScore = progressStore.averageQuizScore;
const isComplete = progressStore.isModuleCompleted('linear-regression');

// Clear all progress
progressStore.clearProgress();
```

### Analytics Store (`analytics.ts`)

Manages anonymous usage tracking with privacy controls.

**Usage:**

```typescript
const analyticsStore = useAnalyticsStore();

// Set opt-in preference
analyticsStore.setOptIn(true);

// Track events
analyticsStore.trackPageView('/modules/linear-regression');
analyticsStore.trackModuleVisit('linear-regression', 'Linear Regression');
analyticsStore.trackInteraction('linear-regression', 'train_button_click');
analyticsStore.trackParameterChange('linear-regression', 'learningRate', 0.01);
analyticsStore.trackAlgorithmRun('linear-regression', { learningRate: 0.01 });
analyticsStore.trackQuizComplete('linear-regression', 8, 10);

// Check if enabled
if (analyticsStore.isEnabled) {
  // Track something
}
```

### Auth Store (`auth.ts`)

Manages user authentication state with localStorage persistence.

**Usage:**

```typescript
const authStore = useAuthStore();

// Set user and token
authStore.setUser({
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  picture_url: 'https://example.com/pic.jpg',
});
authStore.setToken('jwt-token-here');

// Update user profile
authStore.updateUser({ name: 'Jane Doe' });

// Set loading state
authStore.setLoading(true);

// Access state
const isAuthenticated = authStore.isAuthenticated;
const userName = authStore.displayName;
const userEmail = authStore.userEmail;
const profilePic = authStore.profilePicture;
const hasToken = authStore.hasValidToken;

// Logout
authStore.clearAuth();

// Initialize (loads from localStorage)
authStore.initialize();
```

## Initialization

Stores are automatically initialized by the Pinia plugin (`plugins/pinia.ts`):

- Progress store loads saved data from localStorage
- Analytics store loads configuration from localStorage
- Auto-save runs every 30 seconds for progress
- Data is saved before page unload

## Composable

Use the `useStores` composable for convenient access to all stores:

```typescript
const { moduleStore, progressStore, analyticsStore, authStore } = useStores();
```

## Type Safety

All stores are fully typed with TypeScript. Import types from the store files:

```typescript
import type { ModuleState } from '~/stores/module';
import type { ProgressState } from '~/stores/progress';
import type { AnalyticsState } from '~/stores/analytics';
import type { AuthState, User } from '~/stores/auth';
```

## Requirements Mapping

- **Module Store**: Requirements 14.2, 2.6
- **Progress Store**: Requirements 9.1, 9.2, 9.4, 9.6
- **Analytics Store**: Requirements 11.1, 11.2, 11.3, 11.6
- **Auth Store**: Requirements 8.4
