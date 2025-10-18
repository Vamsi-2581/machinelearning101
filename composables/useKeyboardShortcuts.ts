/**
 * Composable for managing keyboard shortcuts and navigation
 * Requirements: 1.4 - Keyboard navigation support
 */

import { onMounted, onUnmounted, type Ref } from 'vue';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
      const altMatches = shortcut.alt === undefined || event.altKey === shortcut.alt;
      const shiftMatches = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
      const metaMatches = shortcut.meta === undefined || event.metaKey === shortcut.meta;

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler(event);
        break;
      }
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    shortcuts,
  };
}

/**
 * Trap focus within a container element
 * Useful for modals, dialogs, and mobile menus
 */
export function useFocusTrap(containerRef: Ref<HTMLElement | undefined>, active: Ref<boolean>) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!active.value || !containerRef.value) return;

    if (event.key === 'Tab') {
      const focusableElements = containerRef.value.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    // Close on Escape
    if (event.key === 'Escape') {
      active.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Move focus to the next/previous focusable element
 */
export function moveFocus(direction: 'next' | 'previous', container?: HTMLElement) {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

  if (currentIndex === -1) {
    focusableElements[0]?.focus();
    return;
  }

  let nextIndex: number;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % focusableElements.length;
  } else {
    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
  }

  focusableElements[nextIndex]?.focus();
}
