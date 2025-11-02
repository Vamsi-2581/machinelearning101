<template>
  <div class="relative">
    <button
      @click="toggleBookmarkMenu"
      class="inline-flex items-center space-x-2 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="hasBookmarks ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      :title="hasBookmarks ? 'Manage bookmarks' : 'Save bookmark'"
    >
      <svg
        class="w-5 h-5"
        :class="hasBookmarks ? 'fill-current' : 'fill-none'"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span class="text-sm font-medium">
        {{ hasBookmarks ? `${bookmarkCount} Saved` : 'Bookmark' }}
      </span>
    </button>

    <!-- Bookmark menu -->
    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      @click.stop
    >
      <!-- Save new bookmark -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-2">Save Current Configuration</h3>
        <div class="space-y-2">
          <div class="flex space-x-2">
            <input
              v-model="newBookmarkName"
              type="text"
              placeholder="Bookmark name..."
              maxlength="100"
              :disabled="isSaving"
              :class="[
                'flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2',
                validationError 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500',
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              @keydown.enter="saveBookmark"
              @keydown.escape="closeMenu"
              @input="validateBookmarkName(newBookmarkName)"
            />
            <button
              @click="saveBookmark"
              :disabled="!newBookmarkName.trim() || isSaving || !!validationError"
              class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[70px] justify-center"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
          <!-- Validation error message -->
          <p v-if="validationError" class="text-xs text-red-600" role="alert">
            {{ validationError }}
          </p>
        </div>
      </div>

      <!-- Existing bookmarks -->
      <div v-if="moduleBookmarks.length > 0" class="max-h-64 overflow-y-auto">
        <div class="p-2">
          <h4 class="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Saved Configurations</h4>
          <div
            v-for="bookmark in moduleBookmarks"
            :key="bookmark.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group"
          >
            <button
              @click="loadBookmark(bookmark)"
              class="flex-1 text-left text-sm text-gray-900 hover:text-blue-600 truncate"
            >
              {{ bookmark.name }}
            </button>
            <button
              @click="deleteBookmark(bookmark.id)"
              class="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete bookmark"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- View all bookmarks link -->
      <div class="p-3 border-t border-gray-200">
        <NuxtLink
          to="/bookmarks"
          class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          @click="closeMenu"
        >
          View All Bookmarks →
        </NuxtLink>
      </div>
    </div>

    <!-- Overlay to close menu -->
    <div
      v-if="showMenu"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useProgressStore } from '~/stores/progress';
import { useAnalyticsStore } from '~/stores/analytics';
import { useToastStore } from '~/stores/toast';
import type { Bookmark } from '~/types/progress';

interface Props {
  moduleId: string;
  parameters: Record<string, any>;
  onLoad?: (parameters: Record<string, any>) => void;
}

const props = defineProps<Props>();

const progressStore = useProgressStore();
const analyticsStore = useAnalyticsStore();
const toastStore = useToastStore();

// Menu state
const showMenu = ref(false);
const newBookmarkName = ref('');
const isSaving = ref(false);
const validationError = ref('');

// Get bookmarks for this module
const moduleBookmarks = computed(() => {
  return progressStore.getModuleBookmarks(props.moduleId);
});

const hasBookmarks = computed(() => moduleBookmarks.value.length > 0);
const bookmarkCount = computed(() => moduleBookmarks.value.length);

// Toggle menu
const toggleBookmarkMenu = () => {
  showMenu.value = !showMenu.value;
  if (showMenu.value) {
    // Generate default name
    newBookmarkName.value = `Config ${new Date().toLocaleString()}`;
    validationError.value = '';
  }
};

// Close menu
const closeMenu = () => {
  showMenu.value = false;
  newBookmarkName.value = '';
  validationError.value = '';
};

/**
 * Validate bookmark name
 * Requirements: 1.1, 1.2
 */
const validateBookmarkName = (name: string): boolean => {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    validationError.value = 'Bookmark name is required';
    return false;
  }
  
  if (trimmedName.length > 100) {
    validationError.value = 'Bookmark name must be 100 characters or less';
    return false;
  }
  
  validationError.value = '';
  return true;
};

/**
 * Validate parameter size
 * Requirements: 6.4, 8.1
 */
const validateParameterSize = (parameters: Record<string, any>): boolean => {
  try {
    const serialized = JSON.stringify(parameters);
    const sizeInBytes = new Blob([serialized]).size;
    const sizeInKB = sizeInBytes / 1024;
    
    if (sizeInKB > 10) {
      toastStore.error(
        'Configuration is too large to save. Please reduce the number of parameters or simplify your settings.',
        'Configuration Too Large',
        ['Try using fewer parameters', 'Simplify complex settings']
      );
      return false;
    }
    
    return true;
  } catch (error) {
    toastStore.error('Failed to validate configuration size', 'Validation Error');
    return false;
  }
};

/**
 * Save bookmark with validation and error handling
 * Requirements: 1.1, 2.1, 6.1, 1.5, 8.1, 2.5
 */
const saveBookmark = async () => {
  const trimmedName = newBookmarkName.value.trim();
  console.log("name", trimmedName)
  
  // Validate name
  if (!validateBookmarkName(trimmedName)) {
    return;
  }
  
   console.log("Validating parameter size")
  
  // Validate parameter size
  if (!validateParameterSize(props.parameters)) {
    return;
  }

  // Set loading state
  isSaving.value = true;
  
  try {
    // Deep clone parameters using structuredClone to prevent reference issues
    // Requirements: 1.1, 2.1, 6.1
    const clonedParameters = JSON.parse(JSON.stringify(props.parameters));
    
    // Check if user is offline before attempting to save
    // Requirements: 2.5
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // Add bookmark to local store
    progressStore.addBookmark({
      moduleId: props.moduleId,
      name: trimmedName,
      parameters: clonedParameters,
    });

    console.log("Added bookmark to store")

    // Track bookmark addition
    analyticsStore.trackBookmarkAdd(props.moduleId);

    // Show appropriate feedback based on online/offline status
    // Requirements: 1.5, 2.5
    if (isOffline) {
      toastStore.warning(
        'You are offline. Bookmark saved locally and will sync when you reconnect.',
        'Offline Mode'
      );
    } else {
      // For authenticated users, the sync happens in the background via triggerSync()
      // Show success message immediately for better UX
      toastStore.success('Configuration saved successfully', 'Bookmark Saved');
    }
    
    newBookmarkName.value = '';
    validationError.value = '';
    
    // Small delay to show success state before closing
    setTimeout(() => {
      isSaving.value = false;
    }, 300);
  } catch (error) {
    console.log("Error saving bookmark", error)
    // Handle errors gracefully
    // Requirements: 1.5, 2.5
    isSaving.value = false;
    
    if (error instanceof Error) {
      // Check for offline scenario
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        toastStore.warning(
          'You are offline. Bookmark saved locally and will sync when you reconnect.',
          'Offline Mode'
        );
      } else {
        toastStore.error(
          `Failed to save bookmark: ${error.message}`,
          'Save Failed',
          ['Please try again', 'Check your connection']
        );
      }
    } else {
      toastStore.error(
        'An unexpected error occurred while saving the bookmark',
        'Save Failed'
      );
    }
  }
};

/**
 * Load bookmark with cloned parameters
 * Requirements: 2.1, 6.1
 */
const loadBookmark = (bookmark: Bookmark) => {
  try {
    if (props.onLoad) {
      // Deep clone parameters to prevent reference issues
      const clonedParameters = JSON.parse(JSON.stringify(bookmark.parameters));
      props.onLoad(clonedParameters);
    }
    closeMenu();
    toastStore.success('Configuration loaded successfully', 'Bookmark Loaded');
  } catch (error) {
    console.error(error)
    toastStore.error(
      'Failed to load bookmark configuration',
      'Load Failed',
      ['The bookmark may be corrupted', 'Try another bookmark']
    );
  }
};

/**
 * Delete bookmark with confirmation
 */
const deleteBookmark = (bookmarkId: string) => {
  if (confirm('Delete this bookmark?')) {
    try {
      progressStore.removeBookmark(bookmarkId);
      toastStore.success('Bookmark deleted successfully', 'Bookmark Deleted');
    } catch (error) {
      toastStore.error('Failed to delete bookmark', 'Delete Failed');
    }
  }
};

// Close menu on escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMenu.value) {
    closeMenu();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
