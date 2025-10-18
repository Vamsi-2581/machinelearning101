<template>
  <aside
    class="w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out"
    :class="{
      'fixed inset-y-0 left-0 z-30 transform': isMobile,
      '-translate-x-full': isMobile && !isOpen,
      'translate-x-0': !isMobile || isOpen,
    }"
    aria-label="Module navigation"
  >
    <nav class="p-4 space-y-2">
      <!-- Domain sections -->
      <div
        v-for="domain in domains"
        :key="domain.id"
        class="mb-4"
      >
        <!-- Domain header (collapsible) -->
        <button
          @click="toggleDomain(domain.id)"
          @keydown.enter="toggleDomain(domain.id)"
          @keydown.space.prevent="toggleDomain(domain.id)"
          class="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-expanded="isDomainExpanded(domain.id)"
          :aria-controls="`domain-${domain.id}`"
        >
          <span class="flex items-center space-x-2">
            <component :is="domain.icon" class="w-5 h-5 text-gray-600" />
            <span>{{ domain.name }}</span>
            <!-- Completion badge -->
            <span 
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getDomainCompletionBadgeClass(domain)"
            >
              {{ getDomainCompletionCount(domain) }}/{{ domain.modules.length }}
            </span>
          </span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isDomainExpanded(domain.id) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Module list -->
        <div
          v-show="isDomainExpanded(domain.id)"
          :id="`domain-${domain.id}`"
          class="mt-1 ml-4 space-y-1"
        >
          <NuxtLink
            v-for="module in domain.modules"
            :key="module.id"
            :to="`/modules/${domain.id}/${module.id}`"
            @click="handleModuleClick"
            class="flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="[
              isModuleActive(domain.id, module.id)
                ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              isModuleCompleted(module.id) && !isModuleActive(domain.id, module.id)
                ? 'text-gray-500'
                : ''
            ]"
          >
            <span class="flex-1 flex items-center space-x-2">
              <span>{{ module.name }}</span>
              <!-- Current module indicator -->
              <span
                v-if="isModuleActive(domain.id, module.id)"
                class="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"
                aria-label="Current module"
              ></span>
            </span>
            
            <!-- Completion indicator -->
            <span
              v-if="isModuleCompleted(module.id)"
              class="flex-shrink-0 ml-2"
              :title="`Completed${progressStore.getQuizScore(module.id) ? ` - Quiz: ${progressStore.getQuizScore(module.id)}%` : ''}`"
            >
              <svg
                class="w-5 h-5"
                :class="isModuleActive(domain.id, module.id) ? 'text-blue-600' : 'text-green-500'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>

  <!-- Mobile overlay -->
  <div
    v-if="isMobile && isOpen"
    @click="closeSidebar"
    class="fixed inset-0 bg-black bg-opacity-50 z-20"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProgressStore } from '~/stores/progress';

const route = useRoute();
const progressStore = useProgressStore();

// Mobile state
const isMobile = ref(false);
const isOpen = ref(false);

// Expanded domains state
const expandedDomains = ref<Set<string>>(new Set(['regression']));

// Domain data structure
const domains = [
  {
    id: 'regression',
    name: 'Regression',
    icon: 'IconTrendingUp',
    modules: [
      { id: 'linear-regression', name: 'Linear Regression' },
      { id: 'logistic-regression', name: 'Logistic Regression' },
    ],
  },
  {
    id: 'classification',
    name: 'Classification',
    icon: 'IconCategory',
    modules: [
      { id: 'knn', name: 'K-Nearest Neighbors' },
      { id: 'decision-trees', name: 'Decision Trees' },
      { id: 'svm', name: 'Support Vector Machines' },
    ],
  },
  {
    id: 'clustering',
    name: 'Clustering',
    icon: 'IconCircles',
    modules: [
      { id: 'k-means', name: 'K-Means' },
      { id: 'hierarchical', name: 'Hierarchical Clustering' },
    ],
  },
  {
    id: 'preprocessing',
    name: 'Preprocessing',
    icon: 'IconAdjustments',
    modules: [
      { id: 'feature-scaling', name: 'Feature Scaling' },
      { id: 'encoding', name: 'Categorical Encoding' },
      { id: 'imputation', name: 'Missing Value Imputation' },
    ],
  },
  {
    id: 'optimization',
    name: 'Optimization',
    icon: 'IconChartLine',
    modules: [
      { id: 'gradient-descent', name: 'Gradient Descent' },
      { id: 'optimizers', name: 'Advanced Optimizers' },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced Topics',
    icon: 'IconBrain',
    modules: [
      { id: 'pca', name: 'PCA' },
      { id: 'tsne', name: 't-SNE' },
      { id: 'neural-networks', name: 'Neural Networks' },
    ],
  },
];

// Toggle domain expansion
const toggleDomain = (domainId: string) => {
  if (expandedDomains.value.has(domainId)) {
    expandedDomains.value.delete(domainId);
  } else {
    expandedDomains.value.add(domainId);
  }
};

// Check if domain is expanded
const isDomainExpanded = (domainId: string) => {
  return expandedDomains.value.has(domainId);
};

// Check if module is active
const isModuleActive = (domainId: string, moduleId: string) => {
  return route.path === `/modules/${domainId}/${moduleId}`;
};

// Check if module is completed
const isModuleCompleted = (moduleId: string) => {
  return progressStore.isModuleCompleted(moduleId);
};

// Get domain completion count
const getDomainCompletionCount = (domain: any) => {
  return domain.modules.filter((m: any) => isModuleCompleted(m.id)).length;
};

// Get domain completion badge class
const getDomainCompletionBadgeClass = (domain: any) => {
  const completed = getDomainCompletionCount(domain);
  const total = domain.modules.length;
  const percentage = (completed / total) * 100;
  
  if (percentage === 100) {
    return 'bg-green-100 text-green-800';
  } else if (percentage >= 50) {
    return 'bg-blue-100 text-blue-800';
  } else if (percentage > 0) {
    return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-gray-100 text-gray-600';
};

// Handle module click (close sidebar on mobile)
const handleModuleClick = () => {
  if (isMobile.value) {
    closeSidebar();
  }
};

// Close sidebar
const closeSidebar = () => {
  isOpen.value = false;
};

// Handle sidebar toggle event
const handleToggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    isOpen.value = false;
  }
};

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  // Close sidebar on Escape key
  if (event.key === 'Escape' && isOpen.value) {
    closeSidebar();
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  window.addEventListener('toggle-sidebar', handleToggleSidebar);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  window.removeEventListener('keydown', handleKeyDown);
});

// Placeholder icon components (will be replaced with actual icons)
const IconTrendingUp = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`
};

const IconCategory = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>`
};

const IconCircles = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
};

const IconAdjustments = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>`
};

const IconChartLine = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`
};

const IconBrain = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`
};
</script>
