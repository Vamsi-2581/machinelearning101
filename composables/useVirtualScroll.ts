/**
 * Composable for virtual scrolling
 * 
 * This composable provides virtual scrolling functionality to optimize
 * rendering performance for long lists by only rendering visible items.
 * 
 * Requirements: 8.5, 13.4
 */

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside viewport
}

/**
 * Composable for virtual scrolling
 */
export function useVirtualScroll<T>(
  items: Ref<T[]>,
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;

  const scrollTop = ref(0);
  const containerRef = ref<HTMLElement | null>(null);

  /**
   * Calculate visible range
   */
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight);
    const end = Math.ceil((scrollTop.value + containerHeight) / itemHeight);

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.value.length, end + overscan),
    };
  });

  /**
   * Get visible items
   */
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value;
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      offsetTop: (start + index) * itemHeight,
    }));
  });

  /**
   * Total height of all items
   */
  const totalHeight = computed(() => items.value.length * itemHeight);

  /**
   * Handle scroll event
   */
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  };

  /**
   * Scroll to specific index
   */
  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.value) return;

    const targetScrollTop = index * itemHeight;
    containerRef.value.scrollTo({
      top: targetScrollTop,
      behavior,
    });
  };

  /**
   * Scroll to top
   */
  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    scrollToIndex(0, behavior);
  };

  /**
   * Scroll to bottom
   */
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    scrollToIndex(items.value.length - 1, behavior);
  };

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight,
    scrollTop,
    handleScroll,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}

/**
 * Composable for dynamic height virtual scrolling
 * (More complex, for items with varying heights)
 */
export function useDynamicVirtualScroll<T>(
  items: Ref<T[]>,
  containerHeight: number,
  estimatedItemHeight: number = 50,
  overscan: number = 3
) {
  const scrollTop = ref(0);
  const containerRef = ref<HTMLElement | null>(null);
  const itemHeights = ref<Map<number, number>>(new Map());
  const itemOffsets = ref<Map<number, number>>(new Map());

  /**
   * Update item height
   */
  const updateItemHeight = (index: number, height: number) => {
    itemHeights.value.set(index, height);
    recalculateOffsets();
  };

  /**
   * Recalculate item offsets
   */
  const recalculateOffsets = () => {
    let offset = 0;
    const newOffsets = new Map<number, number>();

    for (let i = 0; i < items.value.length; i++) {
      newOffsets.set(i, offset);
      const height = itemHeights.value.get(i) || estimatedItemHeight;
      offset += height;
    }

    itemOffsets.value = newOffsets;
  };

  /**
   * Get item offset
   */
  const getItemOffset = (index: number): number => {
    return itemOffsets.value.get(index) || index * estimatedItemHeight;
  };

  /**
   * Get item height
   */
  const getItemHeight = (index: number): number => {
    return itemHeights.value.get(index) || estimatedItemHeight;
  };

  /**
   * Find visible range
   */
  const visibleRange = computed(() => {
    let start = 0;
    let end = items.value.length;

    // Binary search for start
    let left = 0;
    let right = items.value.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const offset = getItemOffset(mid);
      const height = getItemHeight(mid);

      if (offset + height < scrollTop.value) {
        left = mid + 1;
      } else if (offset > scrollTop.value) {
        right = mid - 1;
      } else {
        start = mid;
        break;
      }
    }
    start = Math.max(0, left - overscan);

    // Find end
    const viewportBottom = scrollTop.value + containerHeight;
    for (let i = start; i < items.value.length; i++) {
      const offset = getItemOffset(i);
      if (offset > viewportBottom) {
        end = i;
        break;
      }
    }
    end = Math.min(items.value.length, end + overscan);

    return { start, end };
  });

  /**
   * Get visible items
   */
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value;
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      offsetTop: getItemOffset(start + index),
    }));
  });

  /**
   * Total height
   */
  const totalHeight = computed(() => {
    if (items.value.length === 0) return 0;
    
    const lastIndex = items.value.length - 1;
    return getItemOffset(lastIndex) + getItemHeight(lastIndex);
  });

  /**
   * Handle scroll
   */
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  };

  /**
   * Scroll to index
   */
  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.value) return;

    const targetScrollTop = getItemOffset(index);
    containerRef.value.scrollTo({
      top: targetScrollTop,
      behavior,
    });
  };

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight,
    scrollTop,
    handleScroll,
    scrollToIndex,
    updateItemHeight,
  };
}
