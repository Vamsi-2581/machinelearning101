# Bookmark Integration Guide

This guide explains how the bookmark feature is integrated into module pages and how to add it to new modules.

## Overview

The bookmark feature allows users to save and restore module parameter configurations. It's automatically integrated into all module pages through the `ModuleLayout` component.

## How It Works

### 1. Automatic Integration via ModuleLayout

The `BookmarkButton` component is automatically included in the `ModuleLayout` header. All module pages that use `ModuleLayout` automatically get bookmark functionality.

**Requirements:**
- The module page must pass a `module-id` prop to `ModuleLayout`
- The module page must listen to the `@load-bookmark` event from `ModuleLayout`

### 2. Parameter Restoration

When a user loads a bookmark, the `ModuleLayout` emits a `load-bookmark` event with the saved parameters. The module page handles this event to restore the configuration.

## Implementation Pattern

### Basic Setup

```vue
<template>
  <ModuleLayout
    title="Your Module Title"
    description="Module description"
    difficulty="beginner"
    :estimated-time="30"
    module-id="your-module-id"
    :table-of-contents="tableOfContents"
    @load-bookmark="handleLoadBookmark"
  >
    <!-- Your module content -->
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModuleStore } from '~/stores/module';
import { useBookmarkRestore } from '~/composables/useBookmarkRestore';

const moduleStore = useModuleStore();

// Define your parameters
const parameters = ref({
  learningRate: 0.01,
  epochs: 100,
  dataset: 'default-dataset',
  // ... other parameters
});

// Your training/update function
const handleTrain = async () => {
  // Your training logic
};

// Bookmark restoration - automatically handles parameter updates and dataset reloading
const { handleLoadBookmark } = useBookmarkRestore(parameters, handleTrain);
</script>
```

### The useBookmarkRestore Composable

The `useBookmarkRestore` composable handles the common logic for restoring bookmarks:

**Parameters:**
- `parameters` (Ref): Reference to your module's parameters object
- `onRestore` (Function, optional): Callback to execute after parameters are restored (e.g., re-train algorithm, update visualizations)

**What it does:**
1. Updates the parameters with bookmark values
2. Reloads the dataset if it changed
3. Calls your custom restore logic (if provided)
4. Handles errors gracefully

### Examples

#### Example 1: Simple Module (Re-train on Load)

```typescript
// For modules that need to re-train when parameters change
const { handleLoadBookmark } = useBookmarkRestore(parameters, handleTrain);
```

#### Example 2: Visualization Module (Re-initialize on Load)

```typescript
// For modules that need to reinitialize visualizations
const { handleLoadBookmark } = useBookmarkRestore(parameters, initializeVisualization);
```

#### Example 3: No Automatic Action

```typescript
// For modules that don't need automatic actions (parameters update is enough)
const { handleLoadBookmark } = useBookmarkRestore(parameters);
```

## What Gets Saved

The bookmark saves:
- **Module ID**: Identifies which module the bookmark belongs to
- **Bookmark Name**: User-provided name for the configuration
- **All Parameters**: Complete snapshot of the `parameters` object
- **Timestamp**: When the bookmark was created/updated

## Validation

The bookmark system includes automatic validation:

### Frontend Validation
- Bookmark name: 1-100 characters
- Parameter size: < 10KB when serialized to JSON
- Deep cloning to prevent reference issues

### Backend Validation
- User authentication via JWT
- Parameter JSON size limit (10KB)
- Bookmark name length validation

## User Experience

### Saving a Bookmark
1. User adjusts parameters on a module page
2. User clicks the bookmark button in the header
3. User enters a name for the configuration
4. System validates and saves the bookmark
5. For authenticated users, bookmark syncs to cloud automatically

### Loading a Bookmark
1. User clicks the bookmark button
2. User selects a saved bookmark from the dropdown
3. System restores all parameters
4. Module re-trains/updates automatically (if configured)
5. User sees the restored configuration

## Module Store Integration

The bookmark system integrates with the module store:

```typescript
// Parameters are automatically synced to the module store
moduleStore.setParameters(parameters.value);

// Dataset changes are handled automatically
moduleStore.loadDataset(dataset.data);
```

## Error Handling

The system handles common errors gracefully:

- **Offline Mode**: Bookmarks save locally and sync when online
- **Invalid Parameters**: Shows user-friendly error messages
- **Missing Modules**: Preserves bookmarks even if module not found
- **Sync Failures**: Retries with exponential backoff

## Testing

When adding bookmark support to a new module:

1. **Save Test**: Adjust parameters and save a bookmark
2. **Load Test**: Load the bookmark and verify parameters restore correctly
3. **Dataset Test**: Change dataset, save bookmark, load and verify dataset changes
4. **Sync Test**: (For authenticated users) Verify bookmark syncs to cloud
5. **Cross-Device Test**: (For authenticated users) Verify bookmark appears on other devices

## Troubleshooting

### Bookmark Button Not Appearing
- Ensure `module-id` prop is set on `ModuleLayout`
- Check that `ModuleLayout` is imported correctly

### Parameters Not Restoring
- Verify `@load-bookmark="handleLoadBookmark"` is set on `ModuleLayout`
- Check that `useBookmarkRestore` is called with correct parameters
- Ensure the `onRestore` callback is defined if needed

### Bookmarks Not Syncing
- Check user authentication status
- Verify network connectivity
- Check browser console for sync errors

## Requirements Covered

This implementation satisfies the following requirements from the spec:

- **Requirement 1.1**: Save module configurations with custom names
- **Requirement 2.1**: Load saved configurations
- **Requirement 2.2**: Restore parameter values from bookmarks
- **Requirement 2.3**: Trigger side effects (re-training, visualization updates)
- **Requirement 7.1**: Bookmark button accessible on every module page
- **Requirement 7.2**: Display bookmark count on button

## Future Enhancements

Potential improvements for the bookmark system:

- Bookmark sharing between users
- Bookmark categories/tags
- Bookmark search and filtering
- Bookmark export/import
- Bookmark versioning
