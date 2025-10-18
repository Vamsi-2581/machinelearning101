/**
 * Composable for managing ARIA live regions for screen reader announcements
 * Requirements: 7.2 - Screen reader support
 */

import { ref, onMounted, onUnmounted } from 'vue';

export type AriaLivePoliteness = 'polite' | 'assertive' | 'off';

export interface AriaLiveOptions {
  politeness?: AriaLivePoliteness;
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

/**
 * Create and manage an ARIA live region for screen reader announcements
 */
export function useAriaLive(options: AriaLiveOptions = {}) {
  const {
    politeness = 'polite',
    atomic = true,
    relevant = 'additions text',
  } = options;

  const liveRegionId = `aria-live-${Math.random().toString(36).substr(2, 9)}`;
  let liveRegion: HTMLElement | null = null;

  /**
   * Announce a message to screen readers
   */
  const announce = (message: string, customPoliteness?: AriaLivePoliteness) => {
    if (!liveRegion) return;

    // Update politeness if provided
    if (customPoliteness) {
      liveRegion.setAttribute('aria-live', customPoliteness);
    }

    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }, 100);
  };

  /**
   * Clear the live region
   */
  const clear = () => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  };

  onMounted(() => {
    // Create live region element
    liveRegion = document.createElement('div');
    liveRegion.id = liveRegionId;
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', atomic.toString());
    liveRegion.setAttribute('aria-relevant', relevant);
    liveRegion.className = 'sr-only';
    
    // Add to document
    document.body.appendChild(liveRegion);
  });

  onUnmounted(() => {
    // Clean up
    if (liveRegion && liveRegion.parentNode) {
      liveRegion.parentNode.removeChild(liveRegion);
    }
  });

  return {
    announce,
    clear,
    liveRegionId,
  };
}

/**
 * Global announcer for app-wide announcements
 */
let globalAnnouncer: ReturnType<typeof useAriaLive> | null = null;

export function useGlobalAnnouncer() {
  if (!globalAnnouncer) {
    globalAnnouncer = useAriaLive({ politeness: 'polite' });
  }
  return globalAnnouncer;
}

/**
 * Announce navigation changes
 */
export function announceNavigation(pageName: string) {
  const announcer = useGlobalAnnouncer();
  announcer.announce(`Navigated to ${pageName}`, 'polite');
}

/**
 * Announce loading states
 */
export function announceLoading(message: string = 'Loading') {
  const announcer = useGlobalAnnouncer();
  announcer.announce(message, 'polite');
}

/**
 * Announce completion
 */
export function announceComplete(message: string = 'Complete') {
  const announcer = useGlobalAnnouncer();
  announcer.announce(message, 'polite');
}

/**
 * Announce errors
 */
export function announceError(message: string) {
  const announcer = useGlobalAnnouncer();
  announcer.announce(`Error: ${message}`, 'assertive');
}
