<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Learning Modules
      </h1>
      <p class="text-lg text-gray-600 max-w-3xl">
        Explore machine learning concepts through interactive modules organized by domain. 
        Each module includes hands-on visualizations, explanations, and quizzes to test your knowledge.
      </p>
    </div>

    <!-- Overall Progress -->
    <div v-if="overallProgress" class="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Your Progress</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ overallProgress.completed }} of {{ overallProgress.total }} modules completed
          </p>
        </div>
        <div class="text-3xl font-bold text-blue-600">
          {{ overallProgress.percentage }}%
        </div>
      </div>
      <div class="w-full h-3 bg-white rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
          :style="{ width: `${overallProgress.percentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Domains Grid -->
    <div v-if="domains.length > 0" class="space-y-8">
      <h2 class="text-2xl font-semibold text-gray-900">Learning Domains</h2>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="domain in domains"
          :key="domain.id"
          :to="`/modules/${domain.id}`"
          class="block p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-200 group"
        >
          <!-- Domain Icon and Title -->
          <div class="flex items-start space-x-4 mb-4">
            <div 
              class="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              :class="`bg-${domain.color}-100`"
            >
              <Icon 
                :name="`${domain.icon}`" 
                :class="`w-7 h-7 text-${domain.color}-600`"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ domain.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ domain.modules.length }} {{ domain.modules.length === 1 ? 'module' : 'modules' }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ domain.description }}
          </p>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Progress</span>
              <span class="font-medium text-gray-700">
                {{ getCompletedCount(domain) }} / {{ domain.modules.length }}
              </span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="`bg-${domain.color}-500`"
                :style="{ width: `${getCompletionPercentage(domain)}%` }"
              ></div>
            </div>
          </div>

          <!-- View Modules Link -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center">
              View modules
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading modules...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useModules } from '~/composables/useModules';
import type { DomainInfo } from '~/types/module';

const { getAllDomains } = useModules();

const domains = ref<DomainInfo[]>([]);

onMounted(async () => {
  domains.value = await getAllDomains();
});

const getCompletedCount = (domain: DomainInfo): number => {
  return domain.modules.filter(m => m.completed).length;
};

const getCompletionPercentage = (domain: DomainInfo): number => {
  if (domain.modules.length === 0) return 0;
  return Math.round((getCompletedCount(domain) / domain.modules.length) * 100);
};

const overallProgress = computed(() => {
  if (domains.value.length === 0) return null;
  
  const total = domains.value.reduce((sum, d) => sum + d.modules.length, 0);
  const completed = domains.value.reduce((sum, d) => sum + getCompletedCount(d), 0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, percentage };
});

// SEO
useSEO({
  title: 'Learning Modules - Machine Learning 101',
  description: 'Explore interactive machine learning modules covering regression, classification, clustering, preprocessing, optimization, and advanced topics. Learn through hands-on experimentation.',
  keywords: 'machine learning modules, ML courses, interactive ML learning, regression, classification, clustering, neural networks',
  url: '/modules',
  type: 'website',
})

// Breadcrumb structured data
useBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Learning Modules', url: '/modules' },
])
</script>
