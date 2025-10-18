<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="shortcuts-overlay"
      @click="close"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        ref="dialogRef"
        class="shortcuts-dialog"
        @click.stop
        role="document"
      >
        <div class="shortcuts-header">
          <h2 id="shortcuts-title" class="shortcuts-title">
            Keyboard Shortcuts
          </h2>
          <button
            @click="close"
            class="close-button"
            aria-label="Close keyboard shortcuts dialog"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="shortcuts-content">
          <div
            v-for="(group, index) in shortcutGroups"
            :key="index"
            class="shortcut-group"
          >
            <h3 class="group-title">{{ group.title }}</h3>
            <dl class="shortcuts-list">
              <div
                v-for="shortcut in group.shortcuts"
                :key="shortcut.keys"
                class="shortcut-item"
              >
                <dt class="shortcut-keys">
                  <kbd
                    v-for="(key, keyIndex) in shortcut.keys.split('+')"
                    :key="keyIndex"
                    class="key"
                  >
                    {{ key.trim() }}
                  </kbd>
                </dt>
                <dd class="shortcut-description">{{ shortcut.description }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="shortcuts-footer">
          <p class="footer-text">
            Press <kbd class="key">?</kbd> to toggle this dialog
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useFocusTrap } from '../../composables/useKeyboardShortcuts';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const dialogRef = ref<HTMLElement>();
const isOpen = ref(props.modelValue);

// Sync with v-model
watch(() => props.modelValue, (value) => {
  isOpen.value = value;
  if (value) {
    nextTick(() => {
      // Focus the first focusable element in the dialog
      const firstButton = dialogRef.value?.querySelector<HTMLElement>('button');
      firstButton?.focus();
    });
  }
});

// Focus trap
useFocusTrap(dialogRef, isOpen);

const close = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
};

const shortcutGroups = [
  {
    title: 'General',
    shortcuts: [
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: 'Escape', description: 'Close dialogs and menus' },
      { keys: '/', description: 'Focus search (when available)' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: 'g + h', description: 'Go to home page' },
      { keys: 'g + m', description: 'Go to modules page' },
      { keys: 'g + p', description: 'Go to progress page' },
      { keys: 'g + b', description: 'Go to bookmarks page' },
    ],
  },
  {
    title: 'Module Controls',
    shortcuts: [
      { keys: 'r', description: 'Run/train algorithm' },
      { keys: 'Shift + r', description: 'Reset parameters' },
      { keys: 'n', description: 'Next module' },
      { keys: 'p', description: 'Previous module' },
    ],
  },
  {
    title: 'Accessibility',
    shortcuts: [
      { keys: 'Tab', description: 'Move to next interactive element' },
      { keys: 'Shift + Tab', description: 'Move to previous interactive element' },
      { keys: 'Enter / Space', description: 'Activate buttons and links' },
      { keys: 'Arrow Keys', description: 'Navigate sliders and select options' },
    ],
  },
];
</script>

<style scoped>
.shortcuts-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.shortcuts-dialog {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.shortcuts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.shortcuts-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-button {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.close-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.shortcuts-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.shortcut-group:not(:last-child) {
  margin-bottom: 2rem;
}

.group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
}

.shortcuts-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.shortcut-item {
  display: grid;
  grid-template-columns: minmax(8rem, auto) 1fr;
  gap: 1rem;
  align-items: center;
}

.shortcut-keys {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin: 0;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.25rem 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shortcut-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.shortcuts-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

/* Responsive */
@media (max-width: 640px) {
  .shortcuts-dialog {
    max-height: 95vh;
  }

  .shortcut-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .shortcuts-header {
    padding: 1rem;
  }

  .shortcuts-content {
    padding: 1rem;
  }

  .shortcuts-title {
    font-size: 1.25rem;
  }
}
</style>
