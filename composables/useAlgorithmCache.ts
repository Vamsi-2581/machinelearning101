/**
 * Composable for caching algorithm results with memoization
 * 
 * This composable provides result caching to avoid redundant computations
 * when parameters haven't changed.
 * 
 * Requirements: 14.5
 */

import { ref, computed } from 'vue';
import type { Metrics } from '~/types/algorithm';

interface CacheEntry {
  key: string;
  timestamp: number;
  results: any;
  metrics?: Metrics;
  visualizationData?: any;
}

interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Create a cache key from parameters
 */
function createCacheKey(
  algorithm: string,
  params: Record<string, any>,
  datasetId?: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|');
  
  return `${algorithm}|${datasetId || 'default'}|${sortedParams}`;
}

/**
 * LRU Cache implementation for algorithm results
 */
class AlgorithmCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 50;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Get cached result
   */
  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry;
  }

  /**
   * Set cached result
   */
  set(key: string, results: any, metrics?: Metrics, visualizationData?: any): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      key,
      timestamp: Date.now(),
      results,
      metrics,
      visualizationData,
    });
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cached results
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }
}

// Singleton cache instance
let cacheInstance: AlgorithmCache | null = null;

/**
 * Composable for algorithm result caching
 */
export function useAlgorithmCache(options: CacheOptions = {}) {
  // Initialize cache if not exists
  if (!cacheInstance) {
    cacheInstance = new AlgorithmCache(options);
  }

  const cache = cacheInstance;
  const cacheHits = ref(0);
  const cacheMisses = ref(0);

  /**
   * Get cached result for algorithm
   */
  const getCachedResult = (
    algorithm: string,
    params: Record<string, any>,
    datasetId?: string
  ): CacheEntry | null => {
    const key = createCacheKey(algorithm, params, datasetId);
    const entry = cache.get(key);

    if (entry) {
      cacheHits.value++;
    } else {
      cacheMisses.value++;
    }

    return entry;
  };

  /**
   * Cache algorithm result
   */
  const cacheResult = (
    algorithm: string,
    params: Record<string, any>,
    results: any,
    metrics?: Metrics,
    visualizationData?: any,
    datasetId?: string
  ): void => {
    const key = createCacheKey(algorithm, params, datasetId);
    cache.set(key, results, metrics, visualizationData);
  };

  /**
   * Check if result is cached
   */
  const isCached = (
    algorithm: string,
    params: Record<string, any>,
    datasetId?: string
  ): boolean => {
    const key = createCacheKey(algorithm, params, datasetId);
    return cache.has(key);
  };

  /**
   * Clear cache
   */
  const clearCache = (): void => {
    cache.clear();
    cacheHits.value = 0;
    cacheMisses.value = 0;
  };

  /**
   * Clear expired entries
   */
  const clearExpired = (): void => {
    cache.clearExpired();
  };

  /**
   * Cache hit rate
   */
  const hitRate = computed(() => {
    const total = cacheHits.value + cacheMisses.value;
    return total > 0 ? (cacheHits.value / total) * 100 : 0;
  });

  /**
   * Cache statistics
   */
  const stats = computed(() => ({
    ...cache.getStats(),
    hits: cacheHits.value,
    misses: cacheMisses.value,
    hitRate: hitRate.value,
  }));

  return {
    getCachedResult,
    cacheResult,
    isCached,
    clearCache,
    clearExpired,
    stats,
    hitRate,
  };
}
