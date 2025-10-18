<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Skip to content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Skip to content
    </a>

    <!-- Header -->
    <LayoutHeader />

    <!-- Main content area with sidebar -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <LayoutSidebar />

      <!-- Main content -->
      <main
        id="main-content"
        class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto"
        tabindex="-1"
      >
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
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
