<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <button
            v-if="isMobile"
            @click="toggleSidebar"
            class="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <NuxtLink
            to="/"
            class="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Icon name="mdi:brain" class="w-8 h-8 text-blue-600" />
            <span>ML Simplified</span>
          </NuxtLink>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-sm font-medium transition-colors"
            :class="isActive(item.path) 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Progress indicator -->
        <NuxtLink
          to="/progress"
          class="hidden lg:flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all group"
          :title="`${completedModulesCount} of ${totalModulesCount} modules completed`"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex flex-col">
              <div class="flex items-center space-x-2">
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="getProgressBarColor(completionPercentage)"
                    :style="{ width: `${completionPercentage}%` }"
                    role="progressbar"
                    :aria-valuenow="completionPercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ completionPercentage }}%</span>
              </div>
              <span class="text-xs text-gray-500 mt-0.5">{{ completedModulesCount }}/{{ totalModulesCount }} modules</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Mobile menu button -->
        <button
          v-if="isMobile"
          @click="toggleMobileMenu"
          class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle mobile menu"
          :aria-expanded="mobileMenuOpen"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden py-4 border-t border-gray-200"
      >
        <nav class="flex flex-col space-y-3" aria-label="Mobile navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="isActive(item.path)
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile progress indicator -->
        <div class="mt-4 px-3 py-2 bg-gray-50 rounded-md">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Learning Progress</span>
            <span class="text-sm font-medium text-gray-900">{{ completionPercentage }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-300"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Import progress store
import { useProgressStore } from '~/stores/progress';

// Navigation items
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Modules', path: '/modules' },
  { label: 'Progress', path: '/progress' },
  { label: 'Bookmarks', path: '/bookmarks' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

// Mobile state
const isMobile = ref(false);
const mobileMenuOpen = ref(false);
const sidebarOpen = ref(false);

// Progress tracking from store
const progressStore = useProgressStore();
const completionPercentage = computed(() => progressStore.completionPercentage);
const completedModulesCount = computed(() => progressStore.completedModules.length);

// Total modules count (should match the registry)
const totalModulesCount = computed(() => {
  // This should ideally come from the module registry
  // For now, we'll use a reasonable estimate based on the registry
  return 20; // Update this when we have the actual count from the registry
});

// Get progress bar color based on completion percentage
const getProgressBarColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-600';
  if (percentage >= 75) return 'bg-blue-600';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

// Check if route is active
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Toggle sidebar (emit event for parent to handle)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  // Emit custom event that can be caught by the layout
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  }
};

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
