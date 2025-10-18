<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Your Learning Progress</h1>
        <p class="mt-2 text-gray-600">Track your journey through machine learning concepts</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Overall Completion -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Overall Progress</p>
              <p class="mt-2 text-3xl font-bold text-blue-600">{{ completionPercentage }}%</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon name="chart-pie" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div class="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-300"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Completed Modules -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Modules Completed</p>
              <p class="mt-2 text-3xl font-bold text-green-600">{{ completedCount }}</p>
              <p class="text-sm text-gray-500">of {{ totalModules }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon name="check-circle" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Average Quiz Score -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Avg Quiz Score</p>
              <p class="mt-2 text-3xl font-bold text-purple-600">{{ averageQuizScore }}%</p>
              <p class="text-sm text-gray-500">{{ quizCount }} quizzes</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon name="trophy" class="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Time Spent -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Time Spent</p>
              <p class="mt-2 text-3xl font-bold text-orange-600">{{ formattedTimeSpent }}</p>
              <p class="text-sm text-gray-500">learning</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <Icon name="clock" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Progress Over Time</h2>
        <div class="h-64 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <Icon name="chart-line" class="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p>Progress chart visualization coming soon</p>
            <p class="text-sm mt-1">Track your learning journey over time</p>
          </div>
        </div>
      </div>

      <!-- Completed Modules List -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Completed Modules</h2>
          <span class="text-sm text-gray-600">{{ completedCount }} modules</span>
        </div>
        
        <div v-if="completedModules.length === 0" class="text-center py-8 text-gray-500">
          <Icon name="inbox" class="w-16 h-16 mx-auto mb-2 text-gray-400" />
          <p>No modules completed yet</p>
          <p class="text-sm mt-1">Start learning to see your progress here</p>
          <NuxtLink
            to="/modules"
            class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Modules
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="module in completedModules"
            :key="module.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div class="flex items-center space-x-4 flex-1">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="check" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900">{{ module.name }}</h3>
                <p class="text-sm text-gray-500 capitalize">{{ module.domain }}</p>
              </div>
              <div v-if="module.quizScore !== undefined" class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Quiz:</span>
                <span
                  class="text-sm font-medium"
                  :class="getScoreColor(module.quizScore)"
                >
                  {{ module.quizScore }}%
                </span>
              </div>
              <NuxtLink
                :to="module.path"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Review →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Domain Progress -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Progress by Domain</h2>
        
        <div class="space-y-4">
          <div
            v-for="domain in domainProgress"
            :key="domain.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="`bg-${domain.color}-100`"
                >
                  <Icon :name="domain.icon" class="w-6 h-6" :class="`text-${domain.color}-600`" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ domain.name }}</h3>
                  <p class="text-xs text-gray-500">{{ domain.completed }} of {{ domain.total }} completed</p>
                </div>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ domain.percentage }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="`bg-${domain.color}-600`"
                :style="{ width: `${domain.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex justify-center space-x-4">
        <button
          @click="clearProgress"
          class="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
        >
          Clear All Progress
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useProgressStore } from '~/stores/progress';
import { useModules } from '~/composables/useModules';
import type { ModuleMetadata } from '~/types/module';

// SEO
useSEO({
  title: 'Your Learning Progress - ML Simplified',
  description: 'Track your learning progress through machine learning concepts. View completed modules, quiz scores, time spent, and progress by domain.',
  keywords: 'learning progress, ML progress tracking, quiz scores, module completion, learning analytics',
  url: '/progress',
  type: 'website',
  noindex: true, // Personal progress page, no need to index
})

const progressStore = useProgressStore();
const { getAllModuleNavItems, getDomainCompletionStats, DOMAINS } = useModules();

// Computed properties
const completionPercentage = computed(() => progressStore.completionPercentage);
const averageQuizScore = computed(() => progressStore.averageQuizScore);
const completedCount = computed(() => progressStore.completedModules.length);
const quizCount = computed(() => Object.keys(progressStore.quizScores).length);

// Format time spent
const formattedTimeSpent = computed(() => {
  const minutes = progressStore.totalTimeSpent;
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
});

// Total modules count
const totalModules = computed(() => {
  return Object.keys(useModules().MODULE_REGISTRY).length;
});

// Completed modules with metadata
const completedModules = ref<ModuleMetadata[]>([]);

// Domain progress
const domainProgress = ref<Array<{
  id: string;
  name: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
  percentage: number;
}>>([]);

// Load completed modules
const loadCompletedModules = async () => {
  const allModules = await getAllModuleNavItems();
  const completed = allModules.filter(m => m.completed);
  
  // Get full metadata for completed modules
  const modulesWithMetadata = await Promise.all(
    completed.map(async (m) => {
      const { loadModuleConfig, MODULE_REGISTRY } = useModules();
      const config = await loadModuleConfig(m.id);
      if (config) {
        return {
          ...config,
          path: MODULE_REGISTRY[m.id].path,
          completed: true,
          quizScore: progressStore.getQuizScore(m.id),
        };
      }
      return null;
    })
  );
  
  completedModules.value = modulesWithMetadata.filter(m => m !== null) as ModuleMetadata[];
};

// Load domain progress
const loadDomainProgress = async () => {
  const domains = Object.keys(DOMAINS) as Array<keyof typeof DOMAINS>;
  
  const progress = await Promise.all(
    domains.map(async (domainId) => {
      const stats = await getDomainCompletionStats(domainId);
      const domain = DOMAINS[domainId];
      
      return {
        id: domainId,
        name: domain.name,
        icon: domain.icon,
        color: domain.color,
        ...stats,
      };
    })
  );
  
  domainProgress.value = progress;
};

// Get color class for quiz score
const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

// Clear progress with confirmation
const clearProgress = () => {
  if (confirm('Are you sure you want to clear all your progress? This action cannot be undone.')) {
    progressStore.clearProgress();
    completedModules.value = [];
    loadDomainProgress();
  }
};

// Load data on mount
onMounted(async () => {
  await loadCompletedModules();
  await loadDomainProgress();
});
</script>
