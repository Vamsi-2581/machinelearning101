<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Main content area with sidebar -->
    <div class="flex flex-1 relative">
      <!-- Main content -->
      <main id="main-content" class="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300"
        :class="{ 'blur-sm pointer-events-none': showLoginPrompt }" tabindex="-1">
        <slot />
      </main>

      <!-- Login prompt overlay for module pages -->
      <!-- <LoginDialog :show="showLoginPrompt" @close="handleCloseDialog" /> -->
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '~/components/layout/Header.vue';
import Footer from '~/components/layout/Footer.vue';
import LoginDialog from '~/components/shared/LoginDialog.vue';
import { useAuth } from '~/composables/useAuth';
import { navigateTo } from '#app';

const route = useRoute();
const { isAuthenticated } = useAuth();

// Check if current route is a module page
const isModulePage = computed(() => {
  return route.path.startsWith('/modules/') && route.path !== '/modules' && route.path !== '/modules/';
});

// Show login prompt on module pages when not authenticated
const showLoginPrompt = computed(() => {
  return isModulePage.value && !isAuthenticated.value;
});

// Handle dialog close - redirect to modules page
const handleCloseDialog = async () => {
  await navigateTo('/modules');
};

// Watch for authentication changes to hide dialog
watch(isAuthenticated, (newValue) => {
  if (newValue && showLoginPrompt.value) {
    // User just authenticated, dialog will automatically hide
  }
});
</script>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
