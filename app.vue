<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CookieConsent />
    <Toast />
    <KeyboardShortcutsHelp v-model="showShortcuts" />
  </div>
</template>

<script setup lang="ts">
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';
import { useWebVitals } from './composables/useWebVitals';

const router = useRouter();
const showShortcuts = ref(false);

// Track Core Web Vitals
useWebVitals();

// Global keyboard shortcuts
// Requirements: 1.4 - Keyboard navigation support
useKeyboardShortcuts([
  {
    key: '?',
    shift: true,
    description: 'Show keyboard shortcuts help',
    handler: () => {
      showShortcuts.value = !showShortcuts.value;
    },
  },
  {
    key: '/',
    description: 'Focus search (when available)',
    handler: (e: KeyboardEvent) => {
      const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    },
    preventDefault: false,
  },
  // Navigation shortcuts with 'g' prefix
  {
    key: 'h',
    description: 'Go to home',
    handler: () => {
      // Check if 'g' was pressed recently (within 500ms)
      if (window._lastKeyPress === 'g' && window._lastKeyTime && Date.now() - window._lastKeyTime < 500) {
        router.push('/');
      }
    },
    preventDefault: false,
  },
  {
    key: 'm',
    description: 'Go to modules',
    handler: () => {
      if (window._lastKeyPress === 'g' && window._lastKeyTime && Date.now() - window._lastKeyTime < 500) {
        router.push('/modules');
      }
    },
    preventDefault: false,
  },
  {
    key: 'p',
    description: 'Go to progress',
    handler: () => {
      if (window._lastKeyPress === 'g' && window._lastKeyTime && Date.now() - window._lastKeyTime < 500) {
        router.push('/progress');
      }
    },
    preventDefault: false,
  },
  {
    key: 'b',
    description: 'Go to bookmarks',
    handler: () => {
      if (window._lastKeyPress === 'g' && window._lastKeyTime && Date.now() - window._lastKeyTime < 500) {
        router.push('/bookmarks');
      }
    },
    preventDefault: false,
  },
  {
    key: 'g',
    description: 'Navigation prefix',
    handler: () => {
      window._lastKeyPress = 'g';
      window._lastKeyTime = Date.now();
    },
    preventDefault: false,
  },
]);

// Extend window type for key tracking
declare global {
  interface Window {
    _lastKeyPress?: string;
    _lastKeyTime?: number;
  }
}
</script>
