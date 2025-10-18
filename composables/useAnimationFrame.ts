/**
 * Composable for optimized animations using requestAnimationFrame
 * 
 * This composable provides utilities for smooth 60fps animations
 * and optimized rendering performance.
 * 
 * Requirements: 8.5, 13.4
 */

import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Animation callback function type
 */
export type AnimationCallback = (deltaTime: number, timestamp: number) => void;

/**
 * Composable for requestAnimationFrame-based animations
 */
export function useAnimationFrame(callback: AnimationCallback, autoStart: boolean = false) {
  const isRunning = ref(false);
  const fps = ref(0);
  
  let animationId: number | null = null;
  let lastTimestamp = 0;
  let frameCount = 0;
  let fpsUpdateTime = 0;

  /**
   * Animation loop
   */
  const animate = (timestamp: number) => {
    if (!isRunning.value) {
      return;
    }

    // Calculate delta time
    const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 0;
    lastTimestamp = timestamp;

    // Update FPS counter
    frameCount++;
    if (timestamp - fpsUpdateTime >= 1000) {
      fps.value = Math.round((frameCount * 1000) / (timestamp - fpsUpdateTime));
      frameCount = 0;
      fpsUpdateTime = timestamp;
    }

    // Call the animation callback
    callback(deltaTime, timestamp);

    // Schedule next frame
    animationId = requestAnimationFrame(animate);
  };

  /**
   * Start the animation
   */
  const start = () => {
    if (isRunning.value) {
      return;
    }

    isRunning.value = true;
    lastTimestamp = 0;
    frameCount = 0;
    fpsUpdateTime = performance.now();
    animationId = requestAnimationFrame(animate);
  };

  /**
   * Stop the animation
   */
  const stop = () => {
    if (!isRunning.value) {
      return;
    }

    isRunning.value = false;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  /**
   * Toggle animation state
   */
  const toggle = () => {
    if (isRunning.value) {
      stop();
    } else {
      start();
    }
  };

  // Auto-start if requested
  if (autoStart) {
    onMounted(() => {
      start();
    });
  }

  // Clean up on unmount
  onUnmounted(() => {
    stop();
  });

  return {
    isRunning,
    fps,
    start,
    stop,
    toggle,
  };
}

/**
 * Composable for smooth value interpolation
 */
export function useSmoothValue(initialValue: number, smoothing: number = 0.1) {
  const currentValue = ref(initialValue);
  const targetValue = ref(initialValue);
  
  let animationId: number | null = null;

  /**
   * Interpolation loop
   */
  const interpolate = () => {
    const diff = targetValue.value - currentValue.value;
    
    if (Math.abs(diff) < 0.001) {
      currentValue.value = targetValue.value;
      animationId = null;
      return;
    }

    currentValue.value += diff * smoothing;
    animationId = requestAnimationFrame(interpolate);
  };

  /**
   * Set target value and start interpolation
   */
  const setValue = (value: number) => {
    targetValue.value = value;
    
    if (animationId === null) {
      animationId = requestAnimationFrame(interpolate);
    }
  };

  /**
   * Set value immediately without interpolation
   */
  const setImmediate = (value: number) => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    currentValue.value = value;
    targetValue.value = value;
  };

  // Clean up on unmount
  onUnmounted(() => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  });

  return {
    currentValue,
    targetValue,
    setValue,
    setImmediate,
  };
}

/**
 * Composable for frame-rate independent animations
 */
export function useFrameRateIndependent() {
  const deltaTime = ref(0);
  const elapsedTime = ref(0);
  
  let lastTimestamp = 0;
  let animationId: number | null = null;
  let callbacks: Array<(dt: number, elapsed: number) => void> = [];

  /**
   * Animation loop
   */
  const animate = (timestamp: number) => {
    const dt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0;
    lastTimestamp = timestamp;
    
    deltaTime.value = dt;
    elapsedTime.value += dt;

    // Call all registered callbacks
    callbacks.forEach(callback => callback(dt, elapsedTime.value));

    animationId = requestAnimationFrame(animate);
  };

  /**
   * Register a callback
   */
  const onFrame = (callback: (dt: number, elapsed: number) => void) => {
    callbacks.push(callback);
    
    // Start animation loop if not running
    if (animationId === null) {
      lastTimestamp = 0;
      animationId = requestAnimationFrame(animate);
    }

    // Return unregister function
    return () => {
      callbacks = callbacks.filter(cb => cb !== callback);
      
      // Stop animation loop if no callbacks
      if (callbacks.length === 0 && animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };
  };

  /**
   * Reset elapsed time
   */
  const reset = () => {
    elapsedTime.value = 0;
    lastTimestamp = 0;
  };

  // Clean up on unmount
  onUnmounted(() => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
    callbacks = [];
  });

  return {
    deltaTime,
    elapsedTime,
    onFrame,
    reset,
  };
}

/**
 * Composable for batching DOM updates
 */
export function useBatchedUpdates() {
  let updateScheduled = false;
  let pendingUpdates: Array<() => void> = [];

  /**
   * Schedule an update
   */
  const scheduleUpdate = (update: () => void) => {
    pendingUpdates.push(update);

    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(() => {
        const updates = pendingUpdates;
        pendingUpdates = [];
        updateScheduled = false;

        updates.forEach(fn => fn());
      });
    }
  };

  /**
   * Force immediate execution of pending updates
   */
  const flush = () => {
    if (pendingUpdates.length > 0) {
      const updates = pendingUpdates;
      pendingUpdates = [];
      updateScheduled = false;

      updates.forEach(fn => fn());
    }
  };

  return {
    scheduleUpdate,
    flush,
  };
}
