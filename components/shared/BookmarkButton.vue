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
        <div class="flex space-x-2">
          <input
            v-model="newBookmarkName"
            type="text"
            placeholder="Bookmark name..."
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="saveBookmark"
            @keydown.escape="closeMenu"
          />
          <button
            @click="saveBookmark"
            :disabled="!newBookmarkName.trim()"
            class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
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
import type { Bookmark } from '~/types/progress';

interface Props {
  moduleId: string;
  parameters: Record<string, any>;
  onLoad?: (parameters: Record<string, any>) => void;
}

const props = defineProps<Props>();

const progressStore = useProgressStore();
const analyticsStore = useAnalyticsStore();

// Menu state
const showMenu = ref(false);
const newBookmarkName = ref('');

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
  }
};

// Close menu
const closeMenu = () => {
  showMenu.value = false;
  newBookmarkName.value = '';
};

// Save bookmark
const saveBookmark = () => {
  if (!newBookmarkName.value.trim()) return;

  progressStore.addBookmark({
    moduleId: props.moduleId,
    name: newBookmarkName.value.trim(),
    parameters: { ...props.parameters },
  });

  // Track bookmark addition
  analyticsStore.trackBookmarkAdd(props.moduleId);

  newBookmarkName.value = '';
  
  // Show success feedback
  showSuccessFeedback();
};

// Load bookmark
const loadBookmark = (bookmark: Bookmark) => {
  if (props.onLoad) {
    props.onLoad(bookmark.parameters);
  }
  closeMenu();
};

// Delete bookmark
const deleteBookmark = (bookmarkId: string) => {
  if (confirm('Delete this bookmark?')) {
    progressStore.removeBookmark(bookmarkId);
  }
};

// Show success feedback
const showSuccessFeedback = () => {
  // Simple feedback - could be enhanced with a toast notification
  const button = document.activeElement as HTMLElement;
  if (button) {
    button.textContent = 'Saved!';
    setTimeout(() => {
      button.textContent = 'Save';
    }, 1000);
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
