<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <button v-if="isMobile" @click="toggleSidebar"
            class="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <NuxtLink to="/"
            class="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <Icon name="mdi:brain" class="w-8 h-8 text-blue-600" />
            <span>ML Simplified</span>
          </NuxtLink>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
            class="text-sm font-medium transition-colors" :class="isActive(item.path)
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right side: Progress indicator and Auth -->
        <div class="hidden lg:flex items-center space-x-4">
          <!-- Progress indicator -->
          <NuxtLink to="/progress" 
             v-if="isAuthenticated"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all group"
            :title="`${completedModulesCount} of ${totalModulesCount} modules completed`">
            <div class="flex items-center space-x-2"> 
              <div class="flex flex-col">
                <div class="flex items-center space-x-2">
                  <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-300" :class="getProgressBarColor(completionPercentage)"
                      :style="{ width: `${completionPercentage}%` }" role="progressbar"
                      :aria-valuenow="completionPercentage" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                 <span class="text-sm font-semibold text-gray-900">{{ completionPercentage }}%</span>
                </div>
                <!-- <span class="text-xs text-gray-500 mt-0.5">{{ completedModulesCount }}/{{ totalModulesCount }} modules</span> -->
              </div>
            </div>
          </NuxtLink>

          <!-- Auth section -->
          <div class="flex items-center">
            <!-- Sign in button (when not authenticated) --> 

                  <button
                  v-if="!isAuthenticated"
        @click="handleSignIn"
        :disabled="isLoading"
        class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span class="font-medium">{{ isLoading ? 'Signing in...' : 'Sign in with Google' }}</span>
      </button>

            <!-- User menu (when authenticated) -->
            <div v-else class="relative">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-expanded="userMenuOpen" aria-haspopup="true">
                <img v-if="user?.picture_url" :src="user.picture_url" :alt="`${user.name}'s profile picture`"
                  class="w-8 h-8 rounded-full border-2 border-gray-200" />
                <div v-else
                  class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {{ getUserInitials(user?.name) }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ user?.name }}</span>
                <svg class="w-4 h-4 text-gray-600 transition-transform" :class="{ 'rotate-180': userMenuOpen }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                @click.stop>
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                </div>
                <button @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  :disabled="isLoading">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ isLoading ? 'Logging out...' : 'Logout' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Auth and menu button -->
        <div v-if="isMobile" class="flex items-center space-x-2">
          <!-- Mobile auth button/avatar --> 
                            <button
                  v-if="!isAuthenticated"
        @click="handleSignIn"
        :disabled="isLoading"
        class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span class="font-medium">{{ isLoading ? 'Signing in...' : 'Sign in with Google' }}</span>
      </button>


          <button v-else @click="toggleUserMenu"
            class="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="User menu">
            <img v-if="user?.picture_url" :src="user.picture_url" :alt="`${user.name}'s profile picture`"
              class="w-8 h-8 rounded-full border-2 border-gray-200" />
            <div v-else
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ getUserInitials(user?.name) }}
            </div>
          </button>

          <!-- Mobile menu button -->
          <button @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle mobile menu" :aria-expanded="mobileMenuOpen">
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <nav class="flex flex-col space-y-3" aria-label="Mobile navigation">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" @click="closeMobileMenu"
            class="px-3 py-2 rounded-md text-base font-medium transition-colors" :class="isActive(item.path)
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
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
            <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: `${completionPercentage}%` }">
            </div>
          </div>
        </div>

        <!-- Mobile auth section -->
        <div v-if="isAuthenticated" class="mt-4 px-3 py-3 bg-gray-50 rounded-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <img v-if="user?.picture_url" :src="user.picture_url" :alt="`${user.name}'s profile picture`"
                class="w-10 h-10 rounded-full border-2 border-gray-200" />
              <div v-else
                class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {{ getUserInitials(user?.name) }}
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-900">{{ user?.name }}</span>
                <span class="text-xs text-gray-500 truncate">{{ user?.email }}</span>
              </div>
            </div>
            <button @click="handleLogout"
              class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              :disabled="isLoading">
              {{ isLoading ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
        </div>
        <div v-else class="mt-4">
          <button @click="handleSignIn"
            class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isLoading">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{{ isLoading ? 'Signing in...' : 'Sign in with Google' }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Import stores and composables
import { useProgressStore } from '~/stores/progress';
import { useAuth } from '~/composables/useAuth';
import { useModules } from '~/composables/useModules';

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
const userMenuOpen = ref(false);

// Progress tracking from store
const progressStore = useProgressStore();
const { MODULE_REGISTRY } = useModules();

const completedModulesCount = computed(() => progressStore.completedModules.length);

// Total modules count from the registry
const totalModulesCount = computed(() => {
  return Object.keys(MODULE_REGISTRY).length;
});

// Calculate completion percentage based on actual module count
const completionPercentage = computed(() => {
  const total = totalModulesCount.value;
  const completed = completedModulesCount.value;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Auth state and actions
// Requirements: 8.1, 8.2, 8.5
const { user, isAuthenticated, isLoading, signInWithGoogle, logout } = useAuth();

// Get progress bar color based on completion percentage
const getProgressBarColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-600';
  return 'bg-blue-600';
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
  // Close user menu when opening mobile menu
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false;
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Toggle user menu
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// Toggle sidebar (emit event for parent to handle)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  // Emit custom event that can be caught by the layout
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  }
};

// Auth handlers
// Requirements: 8.1, 8.5
const handleSignIn = () => {
  signInWithGoogle();
};

const handleLogout = async () => {
  userMenuOpen.value = false;
  mobileMenuOpen.value = false;
  await logout();
};

// Get user initials for avatar fallback
const getUserInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    mobileMenuOpen.value = false;
  }
};

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (userMenuOpen.value && !target.closest('[aria-haspopup="true"]') && !target.closest('.absolute')) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
});
</script>
