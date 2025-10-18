/**
 * Composable for debouncing function calls
 * 
 * This composable provides debouncing functionality to optimize
 * rendering performance by reducing the frequency of expensive operations.
 * 
 * Requirements: 8.5, 13.4
 */

import { ref, watch, type Ref } from 'vue';

/**
 * Debounce a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
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
 * Throttle a function call
 * @param fn - Function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Composable for debouncing reactive values
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref<T>(value.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  watch(
    value,
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue;
        timeoutId = null;
      }, delay);
    },
    { immediate: false }
  );

  return debouncedValue;
}

/**
 * Composable for throttling reactive values
 */
export function useThrottle<T>(value: Ref<T>, delay: number = 300) {
  const throttledValue = ref<T>(value.value) as Ref<T>;
  let lastUpdate = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  watch(
    value,
    (newValue) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdate;

      if (timeSinceLastUpdate >= delay) {
        lastUpdate = now;
        throttledValue.value = newValue;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          lastUpdate = Date.now();
          throttledValue.value = newValue;
          timeoutId = null;
        }, delay - timeSinceLastUpdate);
      }
    },
    { immediate: false }
  );

  return throttledValue;
}

/**
 * Composable for debouncing parameter changes
 * Specifically designed for algorithm parameter updates
 */
export function useDebouncedParameters(
  initialParams: Record<string, any>,
  delay: number = 300
) {
  const params = ref({ ...initialParams });
  const debouncedParams = ref({ ...initialParams });
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Update a parameter value
   */
  const setParameter = (key: string, value: any) => {
    params.value[key] = value;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      debouncedParams.value = { ...params.value };
      timeoutId = null;
    }, delay);
  };

  /**
   * Update multiple parameters at once
   */
  const setParameters = (newParams: Record<string, any>) => {
    params.value = { ...params.value, ...newParams };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      debouncedParams.value = { ...params.value };
      timeoutId = null;
    }, delay);
  };

  /**
   * Force immediate update without debouncing
   */
  const forceUpdate = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    debouncedParams.value = { ...params.value };
  };

  /**
   * Reset to initial parameters
   */
  const reset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    params.value = { ...initialParams };
    debouncedParams.value = { ...initialParams };
  };

  return {
    params,
    debouncedParams,
    setParameter,
    setParameters,
    forceUpdate,
    reset,
  };
}
