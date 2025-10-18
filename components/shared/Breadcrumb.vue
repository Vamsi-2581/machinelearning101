<template>
  <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <!-- Separator -->
        <Icon
          v-if="index > 0"
          name="heroicons:chevron-right"
          class="w-4 h-4 text-gray-400 mx-2"
          aria-hidden="true"
        />
        
        <!-- Breadcrumb Item -->
        <NuxtLink
          v-if="!item.current"
          :to="item.path"
          class="text-gray-600 hover:text-gray-900 transition-colors"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="font-medium text-gray-900"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>
