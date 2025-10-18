<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">Data Preprocessing</h1>
      <p class="text-lg text-gray-600 mb-8">
        Learn essential data preprocessing techniques to prepare your data for machine learning.
        Preprocessing is a critical step that can significantly impact model performance.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Feature Scaling Module -->
        <NuxtLink
          to="/modules/preprocessing/feature-scaling"
          class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <h2 class="text-2xl font-semibold">Feature Scaling</h2>
            <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Beginner
            </span>
          </div>
          <p class="text-gray-600 mb-4">
            Learn normalization and standardization techniques to transform features to similar scales.
            Essential for distance-based algorithms and neural networks.
          </p>
          <div class="flex items-center text-sm text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>~20 minutes</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Normalization</span>
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Standardization</span>
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Z-Score</span>
          </div>
        </NuxtLink>

        <!-- Missing Value Imputation Module -->
        <NuxtLink
          to="/modules/preprocessing/missing-value-imputation"
          class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <h2 class="text-2xl font-semibold">Missing Value Imputation</h2>
            <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Beginner
            </span>
          </div>
          <p class="text-gray-600 mb-4">
            Explore different strategies for handling missing values in your dataset.
            Learn when to use mean, median, mode, or forward-fill imputation.
          </p>
          <div class="flex items-center text-sm text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>~25 minutes</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Mean</span>
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Median</span>
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Mode</span>
            <span class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Forward Fill</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Learning Path -->
      <div class="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 class="text-xl font-semibold mb-3">Recommended Learning Path</h3>
        <ol class="space-y-2">
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-medium mr-3">1</span>
            <div>
              <p class="font-medium">Feature Scaling</p>
              <p class="text-sm text-gray-600">Start with understanding how to normalize and standardize features</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-medium mr-3">2</span>
            <div>
              <p class="font-medium">Missing Value Imputation</p>
              <p class="text-sm text-gray-600">Learn how to handle missing data effectively</p>
            </div>
          </li>
        </ol>
      </div>

      <!-- Why Preprocessing Matters -->
      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="text-xl font-semibold mb-3">Why Preprocessing Matters</h3>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span><strong>Improves Model Performance:</strong> Clean, well-scaled data leads to better predictions</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span><strong>Faster Convergence:</strong> Properly scaled features help algorithms converge faster</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span><strong>Handles Real-World Data:</strong> Real datasets often have missing values and inconsistent scales</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span><strong>Prevents Bias:</strong> Proper preprocessing prevents features from dominating due to scale</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
