<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
            <p class="mt-2 text-gray-600">Save and organize your favorite module configurations</p>
          </div>
          <!-- Sync status indicator -->
          <div v-if="progressStore.isSyncing" class="flex items-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Syncing...</span>
          </div>
          <div v-else-if="progressStore.lastSyncedAt" class="flex items-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Synced {{ formatSyncTime(progressStore.lastSyncedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow p-6 animate-pulse">
          <div class="flex items-start justify-between">
            <div class="flex-1 space-y-3">
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="flex space-x-2">
                <div class="h-6 bg-gray-200 rounded w-20"></div>
                <div class="h-6 bg-gray-200 rounded w-20"></div>
                <div class="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div class="flex space-x-2">
              <div class="h-9 w-9 bg-gray-200 rounded"></div>
              <div class="h-9 w-9 bg-gray-200 rounded"></div>
              <div class="h-9 w-9 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="bookmarks.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
        <p class="text-gray-600 mb-6">Start bookmarking module configurations to save your favorite setups</p>
        <NuxtLink
          to="/modules"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse Modules
        </NuxtLink>
      </div>

      <!-- Bookmarks list -->
      <div v-else class="space-y-4">
        <div
          v-for="bookmark in sortedBookmarks"
          :key="bookmark.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          :class="{ 'border-l-4 border-yellow-500': !MODULE_REGISTRY[bookmark.moduleId] }"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <!-- Bookmark header -->
                <div class="flex items-center space-x-3 mb-2">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 truncate">
                    {{ bookmark.name }}
                  </h3>
                </div>

                <!-- Module info -->
                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{{ getModuleName(bookmark.moduleId) }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatDate(bookmark.timestamp) }}</span>
                  </span>
                </div>

                <!-- Warning for missing modules -->
                <div v-if="!MODULE_REGISTRY[bookmark.moduleId]" class="mb-3 flex items-start space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                  <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span>This module is not currently available. The bookmark has been preserved.</span>
                </div>

                <!-- Parameters preview -->
                <div v-if="Object.keys(bookmark.parameters).length > 0" class="mb-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(value, key) in bookmark.parameters"
                      :key="key"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <span class="font-semibold">{{ key }}:</span>
                      <span class="ml-1">{{ formatParameterValue(value) }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="loadBookmark(bookmark)"
                  class="p-2 rounded-md transition-colors"
                  :class="MODULE_REGISTRY[bookmark.moduleId] 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-400 cursor-not-allowed'"
                  :disabled="!MODULE_REGISTRY[bookmark.moduleId]"
                  :title="MODULE_REGISTRY[bookmark.moduleId] ? 'Load this configuration' : 'Module not available'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button
                  @click="editBookmark(bookmark)"
                  class="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  title="Edit bookmark name"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteBookmark(bookmark.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete bookmark"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit bookmark modal -->
  <div
    v-if="editingBookmark"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="cancelEdit"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Bookmark</h3>
      
      <div class="mb-4">
        <label for="bookmark-name" class="block text-sm font-medium text-gray-700 mb-2">
          Bookmark Name
        </label>
        <input
          id="bookmark-name"
          v-model="editName"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter bookmark name"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="cancelEdit"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveEdit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          :disabled="!editName.trim()"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProgressStore } from '~/stores/progress';
import { useToastStore } from '~/stores/toast';
import { useAuth } from '~/composables/useAuth';
import { useModules } from '~/composables/useModules';
import type { Bookmark } from '~/types/progress';

// SEO
useSEO({
  title: 'Your Bookmarks - Machine Learning 101',
  description: 'Manage your saved module configurations. Save and organize your favorite parameter setups for quick access.',
  keywords: 'bookmarks, saved configurations, ML module bookmarks, parameter presets',
  url: '/bookmarks',
  type: 'website',
  noindex: true, // Personal bookmarks page, no need to index
})

const router = useRouter();
const progressStore = useProgressStore();
const { MODULE_REGISTRY } = useModules();

// Loading state
const isLoading = ref(false);

// Bookmarks
const bookmarks = computed(() => progressStore.bookmarks);

// Sorted bookmarks (most recent first)
const sortedBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => b.timestamp - a.timestamp);
});

// Edit state
const editingBookmark = ref<Bookmark | null>(null);
const editName = ref('');

// Get module name from ID
const getModuleName = (moduleId: string): string => {
  const registryEntry = MODULE_REGISTRY[moduleId];
  if (!registryEntry) {
    // Module not found - return formatted name with indicator
    const formattedName = moduleId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${formattedName} (Not Found)`;
  }
  
  // Convert kebab-case to Title Case
  return moduleId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

// Format sync time
const formatSyncTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return 'recently';
};

// Format parameter value
const formatParameterValue = (value: any): string => {
  if (typeof value === 'number') {
    return value.toFixed(3).replace(/\.?0+$/, '');
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
};

// Load bookmark (navigate to module with parameters)
const loadBookmark = (bookmark: Bookmark) => {
  const registryEntry = MODULE_REGISTRY[bookmark.moduleId];
  if (!registryEntry) {
    // Module not found - show error but keep bookmark in list
    const toastStore = useToastStore();
    toastStore.error(
      `The module "${bookmark.moduleId}" could not be found. It may have been renamed or removed.`,
      'Module Not Found',
      ['The bookmark has been preserved and will work if the module is restored.']
    );
    return;
  }

  // Validate parameters exist
  if (!bookmark.parameters || Object.keys(bookmark.parameters).length === 0) {
    // Navigate without parameters if none exist
    router.push(registryEntry.path);
    return;
  }

  // Navigate to module with query parameters
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(bookmark.parameters)) {
    // Handle different parameter types
    if (value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  }
  
  // Navigate with parameters - module page will handle parameter restoration
  router.push(`${registryEntry.path}?${query.toString()}`);
};

// Edit bookmark
const editBookmark = (bookmark: Bookmark) => {
  editingBookmark.value = bookmark;
  editName.value = bookmark.name;
};

// Save edit
const saveEdit = () => {
  if (!editingBookmark.value || !editName.value.trim()) return;

  // Update bookmark name using store method (Pinia persistence handles storage automatically)
  progressStore.updateBookmarkName(editingBookmark.value.id, editName.value.trim());

  cancelEdit();
};

// Cancel edit
const cancelEdit = () => {
  editingBookmark.value = null;
  editName.value = '';
};

// Delete bookmark
const deleteBookmark = (bookmarkId: string) => {
  if (confirm('Are you sure you want to delete this bookmark?')) {
    progressStore.removeBookmark(bookmarkId);
  }
};

// Fetch bookmarks on mount if authenticated
onMounted(async () => {
  // Check if user is authenticated and fetch latest bookmarks
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated.value) {
    isLoading.value = true;
    try {
      await progressStore.loadFromBackend();
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      const toastStore = useToastStore();
      toastStore.error('Failed to fetch bookmarks from server. Showing local bookmarks.', 'Sync Error');
    } finally {
      isLoading.value = false;
    }
  }
});
</script>
