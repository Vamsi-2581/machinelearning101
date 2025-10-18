# localStorage Utilities

This directory contains utilities for managing browser localStorage with robust error handling, quota management, and state persistence.

## Files

- **storage.ts** - Core storage service with quota handling and data migration
- **storage.example.ts** - Usage examples and patterns
- **pinia-persistence.ts** (in plugins/) - Pinia plugin for automatic state persistence

## Features

### Storage Service (`storage.ts`)

#### ✅ Error Handling
- Graceful handling of quota exceeded errors
- Parse error detection and recovery
- Availability checking (private browsing mode support)

#### ✅ Quota Management
- Automatic quota exceeded detection
- Storage usage calculation
- User notification system via custom events

#### ✅ Data Migration
- Version-based migration system
- Automatic migration on version updates
- Per-key migration with error isolation

#### ✅ Utility Methods
- `get<T>(key, defaultValue?)` - Get item with type safety
- `set<T>(key, value)` - Set item with error handling
- `remove(key)` - Remove item
- `clear()` - Clear all items with prefix
- `keys()` - Get all keys
- `getStorageInfo()` - Get storage usage info

### Pinia Persistence Plugin (`plugins/pinia-persistence.ts`)

#### ✅ Auto-Save
- Automatic state persistence on changes
- Debounced writes (300ms default) to prevent excessive I/O
- Per-store configuration

#### ✅ Auto-Restore
- Automatic state restoration on app initialization
- Error handling for corrupted data

#### ✅ Selective Persistence
- Include/exclude specific stores
- Exclude specific paths within stores (e.g., transient state)

#### ✅ Quota Handling
- Automatic quota exceeded detection
- Custom event emission for user notification

## Usage

### Basic Storage Operations

```typescript
import { storage } from '~/utils/storage';

// Save data
const result = storage.set('user-settings', {
  theme: 'dark',
  language: 'en'
});

if (!result.success) {
  console.error(result.error?.message);
}

// Get data with default
const settings = storage.get('user-settings', { theme: 'light' });

// Remove data
storage.remove('user-settings');

// Clear all
storage.clear();
```

### Pinia Store Persistence

The Pinia persistence plugin is automatically configured in `plugins/pinia-persistence.ts`. All stores are persisted by default with the following configuration:

```typescript
// Excluded from persistence:
// - module.isTraining
// - module.trainingProgress
// - analytics.events
```

To customize persistence for your store:

```typescript
// In plugins/pinia-persistence.ts
const persistencePlugin = createPersistedState({
  exclude: ['myTransientStore'], // Don't persist this store
  excludePaths: {
    myStore: ['temporaryField'], // Don't persist this field
  },
  debounce: 300, // Debounce delay in ms
});
```

### Data Migration

```typescript
import { StorageService } from '~/utils/storage';

const storage = new StorageService({
  prefix: 'my_app_',
  version: 2,
});

// Register migration from v1 to v2
storage.registerMigration(2, (oldData, oldVersion) => {
  if (oldVersion === 1) {
    // Transform data structure
    return {
      ...oldData,
      newField: oldData.oldField,
    };
  }
  return oldData;
});
```

### Handling Quota Exceeded

```typescript
// Listen for quota exceeded events
window.addEventListener('storage-quota-exceeded', (event: any) => {
  const { storeId, error } = event.detail;
  
  // Show user notification
  alert(`Storage is full! Please clear some data.`);
  
  // Optionally, clear old data
  storage.clear();
});
```

## Configuration

### Storage Service Options

```typescript
interface StorageOptions {
  prefix?: string;    // Key prefix (default: 'ml_platform_')
  version?: number;   // Storage version (default: 1)
}
```

### Persistence Plugin Options

```typescript
interface PersistenceOptions {
  include?: string[];              // Store IDs to persist
  exclude?: string[];              // Store IDs to exclude
  debounce?: number;               // Debounce delay (default: 300ms)
  keyPrefix?: string;              // Storage key prefix (default: 'store_')
  excludePaths?: Record<string, string[]>; // Paths to exclude per store
}
```

## Error Types

```typescript
type StorageErrorType = 
  | 'quota_exceeded'  // Storage quota exceeded
  | 'not_available'   // localStorage not available
  | 'parse_error'     // JSON parse error
  | 'unknown';        // Unknown error
```

## Best Practices

1. **Always check result.success** when using `storage.set()`
2. **Provide default values** when using `storage.get()`
3. **Exclude transient state** from persistence (loading states, temporary data)
4. **Use debouncing** to prevent excessive writes
5. **Handle quota exceeded** gracefully with user notifications
6. **Version your data** and provide migrations for breaking changes
7. **Test in private browsing** mode where localStorage may be unavailable

## Requirements Satisfied

- ✅ 9.1: Save state to browser local storage
- ✅ 9.2: Restore session state on return
- ✅ 9.5: Handle storage quota exceeded with user notification
- ✅ Data migration for version updates
- ✅ Debouncing to prevent excessive writes
