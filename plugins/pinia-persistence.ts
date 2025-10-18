/**
 * Pinia Persistence Plugin
 * Auto-saves store state to localStorage with debouncing
 * Auto-restores state on app initialization
 */

import type { PiniaPluginContext } from 'pinia';
import { storage } from '~/utils/storage';

export interface PersistenceOptions {
  /**
   * Store IDs to persist (if not specified, all stores are persisted)
   */
  include?: string[];
  
  /**
   * Store IDs to exclude from persistence
   */
  exclude?: string[];
  
  /**
   * Debounce delay in milliseconds (default: 300ms)
   */
  debounce?: number;
  
  /**
   * Storage key prefix (default: 'store_')
   */
  keyPrefix?: string;
  
  /**
   * Paths to exclude from persistence (per store)
   * Example: { module: ['isTraining', 'trainingProgress'] }
   */
  excludePaths?: Record<string, string[]>;
}

const DEFAULT_OPTIONS: Required<PersistenceOptions> = {
  include: [],
  exclude: [],
  debounce: 300,
  keyPrefix: 'store_',
  excludePaths: {},
};

/**
 * Create a debounced function
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Filter state by excluding specified paths
 */
function filterState(state: any, excludePaths: string[]): any {
  if (!excludePaths || excludePaths.length === 0) {
    return state;
  }

  const filtered = { ...state };
  
  excludePaths.forEach(path => {
    const keys = path.split('.');
    let current: any = filtered;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key || current[key] === undefined) {
        return;
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey && current) {
      delete current[lastKey];
    }
  });

  return filtered;
}

/**
 * Check if a store should be persisted
 */
function shouldPersist(
  storeId: string,
  options: Required<PersistenceOptions>
): boolean {
  // If include list is specified, only persist stores in the list
  if (options.include.length > 0) {
    return options.include.includes(storeId);
  }
  
  // Otherwise, persist all stores except those in exclude list
  return !options.exclude.includes(storeId);
}

/**
 * Create Pinia persistence plugin
 */
export function createPersistedState(options: PersistenceOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return function (context: PiniaPluginContext) {
    const { store } = context;
    const storeId = store.$id;
    
    // Check if this store should be persisted
    if (!shouldPersist(storeId, opts)) {
      return;
    }

    const storageKey = `${opts.keyPrefix}${storeId}`;
    const excludePaths = opts.excludePaths[storeId] || [];

    // Restore state from localStorage on initialization
    const savedState = storage.get(storageKey);
    if (savedState) {
      try {
        store.$patch(savedState);
        console.log(`Restored state for store: ${storeId}`);
      } catch (error) {
        console.error(`Failed to restore state for store ${storeId}:`, error);
      }
    }

    // Create debounced save function
    const debouncedSave = debounce((state: any) => {
      const filteredState = filterState(state, excludePaths);
      const result = storage.set(storageKey, filteredState);
      
      if (!result.success && result.error) {
        console.error(`Failed to persist store ${storeId}:`, result.error.message);
        
        // Notify user if quota exceeded
        if (result.error.type === 'quota_exceeded') {
          // You can emit an event or show a notification here
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('storage-quota-exceeded', {
                detail: { storeId, error: result.error },
              })
            );
          }
        }
      }
    }, opts.debounce);

    // Subscribe to store changes and save to localStorage
    store.$subscribe(
      (mutation, state) => {
        debouncedSave(state);
      },
      { detached: true } // Keep subscription even if component is unmounted
    );
  };
}

/**
 * Default export for Nuxt plugin
 */
export default defineNuxtPlugin(({ $pinia }) => {
  // Configure which stores to persist
  const persistencePlugin = createPersistedState({
    // Persist all stores by default
    exclude: [], // Add store IDs here if you want to exclude them
    
    // Exclude transient/temporary state from persistence
    excludePaths: {
      module: ['isTraining', 'trainingProgress'], // Don't persist training state
      analytics: ['events'], // Don't persist analytics events
    },
    
    debounce: 300, // 300ms debounce
  });

  ($pinia as any).use(persistencePlugin);
});
