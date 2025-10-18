<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Optimization</h1>
    <p class="text-lg text-gray-600 mb-8">
      Learn how optimization algorithms train machine learning models by minimizing loss functions.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Gradient Descent Module -->
      <NuxtLink
        to="/modules/optimization/gradient-descent"
        class="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold text-gray-900">Gradient Descent</h2>
          <span class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
            Intermediate
          </span>
        </div>
        <p class="text-gray-600 mb-4">
          Visualize how different optimizers navigate loss landscapes to find optimal parameters.
        </p>
        <div class="flex items-center text-sm text-gray-500">
          <Icon name="mdi:clock-outline" class="w-4 h-4 mr-1" />
          <span>45 min</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
definePageMeta({
  layout: 'default'
});

// SEO
useSEO({
  title: 'Optimization Modules - ML Simplified',
  description: 'Learn optimization algorithms including gradient descent, Adam, RMSProp, and momentum. Visualize how optimizers navigate loss landscapes to train machine learning models.',
  keywords: 'optimization algorithms, gradient descent, Adam optimizer, RMSProp, momentum, loss functions, machine learning optimization',
  url: '/modules/optimization',
  type: 'website',
})

// Breadcrumb structured data
useBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Learning Modules', url: '/modules' },
  { name: 'Optimization', url: '/modules/optimization' },
])
</script>
