/**
 * Web Workers initialization plugin
 * 
 * This plugin preloads Web Workers for heavy algorithms to improve performance
 * and provides global access to worker management functionality.
 * 
 * Requirements: 13.5, 17.5
 */

import { useHeavyAlgorithms } from '~/composables/useHeavyAlgorithms';

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return;

  const { preloadWebWorker, isWebWorkerSupported } = useHeavyAlgorithms();

  // Check if Web Workers are supported
  if (!isWebWorkerSupported()) {
    console.warn('Web Workers not supported in this browser. Heavy algorithms will run on main thread.');
    return;
  }

  // Preload Web Worker on app initialization
  try {
    preloadWebWorker();
    console.log('Web Worker preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload Web Worker:', error);
  }

  // Provide global access to heavy algorithm utilities
  return {
    provide: {
      heavyAlgorithms: useHeavyAlgorithms(),
    }
  };
});