# BookmarkButton Component

A reusable component for saving and managing module configurations as bookmarks.

## Features

- Save current module parameters as named bookmarks
- View and load saved bookmarks for the current module
- Delete unwanted bookmarks
- Quick access to all bookmarks page
- Visual feedback for modules with saved bookmarks

## Usage

### Basic Usage in Module Pages

```vue
<template>
  <ModuleLayout
    title="Linear Regression"
    module-id="linear-regression"
    :previous-module="previousModule"
    :next-module="nextModule"
  >
    <!-- Add bookmark button to the header -->
    <template #bookmark-button>
      <BookmarkButton
        module-id="linear-regression"
        :parameters="parameters"
        :on-load="handleLoadBookmark"
      />
    </template>

    <!-- Rest of your module content -->
    <template #content>
      <!-- ... -->
    </template>

    <template #interactive>
      <!-- ... -->
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookmarkButton from '~/components/shared/BookmarkButton.vue';

const parameters = ref({
  learningRate: 0.01,
  epochs: 100,
  dataset: 'simple-linear',
});

// Handle loading a bookmark
const handleLoadBookmark = (bookmarkedParams: Record<string, any>) => {
  // Update your parameters with the bookmarked values
  parameters.value = { ...bookmarkedParams };
  
  // Optionally trigger any side effects (e.g., reload dataset, retrain model)
  // ...
};
</script>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `moduleId` | `string` | Yes | Unique identifier for the module |
| `parameters` | `Record<string, any>` | Yes | Current module parameters to save |
| `onLoad` | `(parameters: Record<string, any>) => void` | No | Callback when a bookmark is loaded |

## Features

### Saving Bookmarks

1. Click the bookmark button
2. Enter a name for your configuration
3. Click "Save"

The bookmark will include:
- Module ID
- Bookmark name
- All current parameters
- Timestamp

### Loading Bookmarks

1. Click the bookmark button
2. Select a saved bookmark from the list
3. The `onLoad` callback will be triggered with the bookmarked parameters

### Managing Bookmarks

- **Delete**: Click the X icon next to a bookmark in the dropdown
- **View All**: Click "View All Bookmarks" to go to the bookmarks page
- **Edit**: Go to the bookmarks page to edit bookmark names

## Bookmark Storage

Bookmarks are stored in the progress store and persisted to localStorage. They include:

```typescript
interface Bookmark {
  id: string;              // Auto-generated unique ID
  moduleId: string;        // Module identifier
  name: string;            // User-provided name
  parameters: Record<string, any>;  // Saved parameters
  timestamp: number;       // Creation timestamp
}
```

## Styling

The component uses Tailwind CSS classes and adapts to your theme. The bookmark icon:
- Outlined when no bookmarks exist
- Filled when bookmarks are saved
- Shows count when multiple bookmarks exist

## Accessibility

- Keyboard navigation support (Enter to save, Escape to close)
- Focus management
- ARIA labels and roles
- Screen reader friendly

## Example: Complete Integration

```vue
<template>
  <ModuleLayout
    title="Gradient Descent"
    description="Visualize optimization algorithms"
    difficulty="intermediate"
    :estimated-time="45"
    module-id="gradient-descent"
    :parameters="parameters"
    :on-load="handleLoadBookmark"
  >  
    <template #interactive>
      <InteractiveSection>
        <template #controls>
          <ControlPanel
            :controls="controls"
            :values="parameters"
            @change="handleParameterChange"
            @submit="handleTrain"
          />
        </template>
      </InteractiveSection>
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookmarkButton from '~/components/shared/BookmarkButton.vue';

const parameters = ref({
  optimizer: 'sgd',
  learningRate: 0.01,
  momentum: 0.9,
  beta1: 0.9,
  beta2: 0.999,
  lossFunction: 'quadratic',
});

const handleParameterChange = (id: string, value: any) => {
  parameters.value[id] = value;
};

const handleLoadBookmark = (bookmarkedParams: Record<string, any>) => {
  // Restore all parameters
  parameters.value = { ...bookmarkedParams };
  
  // Optionally reset visualization or retrain
  resetVisualization();
};

const handleTrain = () => {
  // Training logic...
};

const resetVisualization = () => {
  // Reset logic...
};
</script>
```

## Notes

- Bookmarks are module-specific (filtered by `moduleId`)
- Parameters are deep-cloned when saved to prevent reference issues
- The component handles all storage operations automatically
- Bookmarks persist across sessions via localStorage
