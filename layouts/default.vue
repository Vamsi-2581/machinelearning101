<template>
  <div class="min-h-screen flex flex-col bg-gray-50">


    <!-- Header -->
    <Header />

    <!-- Main content area with sidebar -->
    <div class="flex flex-1">
      <!-- Main content -->
      <main id="main-content" class="flex-1 p-4 md:p-6 lg:p-8" tabindex="-1">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue';
import Footer from '~/components/layout/Footer.vue';

// Layout component that provides the overall structure
// Includes header, sidebar, main content area, and footer
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
