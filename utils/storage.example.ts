/**
 * Example usage of the storage service
 * This file demonstrates how to use the storage utilities
 */

import { storage, StorageService } from './storage';

// ============================================
// Basic Usage Examples
// ============================================

// Save data
const saveResult = storage.set('user-preferences', {
  theme: 'dark',
  language: 'en',
  notifications: true,
});

if (!saveResult.success) {
  console.error('Failed to save:', saveResult.error?.message);
}

// Get data
const preferences = storage.get('user-preferences', { theme: 'light' });
console.log('User preferences:', preferences);

// Remove data
storage.remove('user-preferences');

// Clear all data with prefix
storage.clear();

// Get all keys
const allKeys = storage.keys();
console.log('All storage keys:', allKeys);

// ============================================
// Storage Info
// ============================================

const info = storage.getStorageInfo();
console.log(`Storage used: ${info.used} bytes`);
console.log(`Storage available: ${info.available}`);

// ============================================
// Custom Storage Instance
// ============================================

const customStorage = new StorageService({
  prefix: 'my_app_',
  version: 2,
});

// ============================================
// Data Migration Example
// ============================================

// Register a migration from version 1 to 2
customStorage.registerMigration(2, (oldData, oldVersion) => {
  if (oldVersion === 1) {
    // Example: Rename a field
    if (oldData.userName) {
      return {
        ...oldData,
        username: oldData.userName,
        userName: undefined,
      };
    }
  }
  return oldData;
});

// ============================================
// Error Handling Example
// ============================================

const result = storage.set('large-data', { /* large object */ });

if (!result.success && result.error) {
  switch (result.error.type) {
    case 'quota_exceeded':
      // Show user notification to clear storage
      console.error('Storage quota exceeded!');
      break;
    case 'not_available':
      // Fallback to in-memory storage or inform user
      console.error('localStorage not available');
      break;
    case 'parse_error':
      // Data corruption, might need to clear
      console.error('Failed to parse stored data');
      break;
    default:
      console.error('Unknown storage error');
  }
}

// ============================================
// Listen for quota exceeded events
// ============================================

if (typeof window !== 'undefined') {
  window.addEventListener('storage-quota-exceeded', (event: any) => {
    const { storeId, error } = event.detail;
    console.error(`Storage quota exceeded for store: ${storeId}`);
    
    // Show user notification
    // You can integrate with your notification system here
  });
}
