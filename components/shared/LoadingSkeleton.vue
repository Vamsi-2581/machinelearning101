<script setup lang="ts">
/**
 * Loading Skeleton Component
 * 
 * Provides visual feedback while content is loading
 * Requirements: 1.4, 13.3
 */

interface Props {
  type?: 'text' | 'card' | 'chart' | 'module' | 'custom';
  lines?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  lines: 3,
  height: '1rem',
  width: '100%',
  rounded: true
});
</script>

<template>
  <div class="loading-skeleton" role="status" aria-label="Loading content">
    <!-- Text Skeleton -->
    <div v-if="type === 'text'" class="space-y-3">
      <div
        v-for="i in lines"
        :key="i"
        :class="[
          'skeleton-item',
          rounded ? 'rounded' : '',
          i === lines ? 'w-3/4' : 'w-full'
        ]"
        :style="{ height }"
      />
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-item h-48 rounded-t-lg" />
      <div class="p-4 space-y-3">
        <div class="skeleton-item h-6 w-3/4 rounded" />
        <div class="skeleton-item h-4 w-full rounded" />
        <div class="skeleton-item h-4 w-5/6 rounded" />
      </div>
    </div>

    <!-- Chart Skeleton -->
    <div v-else-if="type === 'chart'" class="skeleton-chart">
      <div class="skeleton-item h-64 rounded-lg" />
      <div class="mt-2 flex justify-center gap-4">
        <div class="skeleton-item h-3 w-16 rounded" />
        <div class="skeleton-item h-3 w-16 rounded" />
        <div class="skeleton-item h-3 w-16 rounded" />
      </div>
    </div>

    <!-- Module Skeleton -->
    <div v-else-if="type === 'module'" class="skeleton-module">
      <!-- Header -->
      <div class="skeleton-item h-12 w-full rounded-lg mb-6" />
      
      <!-- Content Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div class="skeleton-item h-8 w-2/3 rounded" />
          <div class="skeleton-item h-4 w-full rounded" />
          <div class="skeleton-item h-4 w-full rounded" />
          <div class="skeleton-item h-4 w-4/5 rounded" />
          <div class="skeleton-item h-32 w-full rounded-lg mt-6" />
        </div>
        
        <!-- Right Column -->
        <div class="space-y-4">
          <div class="skeleton-item h-64 w-full rounded-lg" />
          <div class="flex gap-2">
            <div class="skeleton-item h-10 flex-1 rounded" />
            <div class="skeleton-item h-10 flex-1 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else-if="type === 'custom'">
      <div
        class="skeleton-item"
        :class="{ 'rounded-lg': rounded }"
        :style="{ height, width }"
      />
    </div>

    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>
.skeleton-item {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-card {
  @apply bg-white rounded-lg border border-gray-200 overflow-hidden;
}

.skeleton-chart {
  @apply w-full;
}

.skeleton-module {
  @apply w-full;
}

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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .skeleton-item {
    background: linear-gradient(
      90deg,
      #2a2a2a 0%,
      #3a3a3a 20%,
      #2a2a2a 40%,
      #2a2a2a 100%
    );
  }
}
</style>
