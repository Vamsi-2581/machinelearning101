<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Domain Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="`bg-${domainInfo.color}-100`"
        >
          <Icon 
            :name="`heroicons:${domainInfo.icon}`" 
            :class="`w-6 h-6 text-${domainInfo.color}-600`"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ domainInfo.name }}</h1>
          <p class="text-gray-600">{{ domainInfo.description }}</p>
        </div>
      </div>

      <!-- Completion Stats -->
      <div v-if="completionStats" class="flex items-center space-x-4 mt-4">
        <div class="flex-1 max-w-md">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-600">Progress</span>
            <span class="font-medium text-gray-900">
              {{ completionStats.completed }} / {{ completionStats.total }} modules
            </span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="`bg-${domainInfo.color}-600`"
              :style="{ width: `${completionStats.percentage}%` }"
            ></div>
          </div>
        </div>
        <div class="text-2xl font-bold" :class="`text-${domainInfo.color}-600`">
          {{ completionStats.percentage }}%
        </div>
      </div>
    </div>

    <!-- Modules List -->
    <div v-if="modules.length > 0" class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Modules</h2>
      
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="module in modules"
          :key="module.id"
          :to="module.path"
          class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 group"
        >
          <!-- Module Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ module.name }}
              </h3>
              <div class="flex items-center space-x-2 mt-1">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="getDifficultyClass(module.difficulty)"
                >
                  {{ module.difficulty }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ module.estimatedTime }} min
                </span>
              </div>
            </div>
            
            <!-- Completion Badge -->
            <div v-if="module.completed" class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="heroicons:check" class="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Learning Objectives -->
          <div v-if="module.learningObjectives && module.learningObjectives.length > 0" class="mb-3">
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ module.learningObjectives[0] }}
            </p>
          </div>

          <!-- Quiz Score -->
          <div v-if="module.quizScore !== undefined" class="mt-3 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Quiz Score</span>
              <span class="font-medium text-gray-900">{{ module.quizScore }}%</span>
            </div>
          </div>

          <!-- Prerequisites -->
          <div v-if="module.prerequisites && module.prerequisites.length > 0" class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-xs text-gray-500">
              Prerequisites: {{ module.prerequisites.join(', ') }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon name="heroicons:academic-cap" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
      <p class="text-gray-600">Modules for this domain are coming soon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModules } from '~/composables/useModules';
import type { DomainInfo, ModuleMetadata, Difficulty } from '~/types/module';

const { getDomainInfo, getDomainCompletionStats } = useModules();

const domainInfo = ref<DomainInfo>({
  id: 'preprocessing',
  name: 'Data Preprocessing',
  description: 'Learn essential data preprocessing techniques to prepare your data for machine learning',
  icon: 'adjustments',
  color: 'orange',
  modules: [],
});

const modules = ref<ModuleMetadata[]>([]);
const completionStats = ref<{ completed: number; total: number; percentage: number } | null>(null);

onMounted(async () => {
  const info = await getDomainInfo('preprocessing');
  domainInfo.value = info;
  modules.value = info.modules;
  
  completionStats.value = await getDomainCompletionStats('preprocessing');
});

const getDifficultyClass = (difficulty: Difficulty): string => {
  const classes = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };
  return classes[difficulty] || classes.beginner;
};

// SEO
useSEO({
  title: 'Data Preprocessing Modules - ML Simplified',
  description: 'Learn essential data preprocessing techniques including feature scaling, normalization, standardization, and missing value imputation for machine learning.',
  keywords: 'data preprocessing, feature scaling, normalization, standardization, missing value imputation, data cleaning',
  url: '/modules/preprocessing',
  type: 'website',
})

// Breadcrumb structured data
useBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Learning Modules', url: '/modules' },
  { name: 'Preprocessing', url: '/modules/preprocessing' },
])
</script>
