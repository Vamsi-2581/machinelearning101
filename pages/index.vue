<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Master Machine Learning Through Interactive Exploration
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Learn ML concepts with zero setup. Experiment with algorithms, adjust parameters in real-time, and build intuition through beautiful visualizations.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink
            to="/modules"
            class="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          >
            Start Learning Now
          </NuxtLink>
          <NuxtLink
            to="/about/"
            class="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          >
            Learn More
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Why Learn Machine Learning Here?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:rocket-launch" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Zero Setup</h3>
            <p class="text-gray-600">
              Everything runs in your browser. No installations, no backend, no barriers. Start learning immediately.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:hand-pointing-up" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Learn by Doing</h3>
            <p class="text-gray-600">
              Interactive controls let you adjust parameters and see results instantly. Experiment freely and build intuition.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:chart-line" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Visual First</h3>
            <p class="text-gray-600">
              See algorithms work through rich, interactive visualizations. Watch models learn in real-time.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:stairs-up" class="w-8 h-8 text-orange-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Progressive Learning</h3>
            <p class="text-gray-600">
              Organized from basic to advanced concepts. Learn at your own pace with guided lessons and quizzes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Modules Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Featured Learning Modules
        </h2>
        <p class="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Explore our interactive modules covering essential machine learning concepts
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="module in featuredModules"
            :key="module.id"
            :to="module.path"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div class="flex items-center mb-3">
              <Icon :name="module.icon" class="w-8 h-8 text-blue-600 mr-3" />
              <span class="text-sm font-medium text-blue-600 uppercase tracking-wide">{{ module.domain }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ module.title }}</h3>
            <p class="text-gray-600 mb-4">{{ module.description }}</p>
            <div class="flex items-center text-sm text-gray-500">
              <Icon name="mdi:clock-outline" class="w-4 h-4 mr-1" />
              <span>{{ module.duration }} min</span>
              <span class="mx-2">•</span>
              <span class="capitalize">{{ module.difficulty }}</span>
            </div>
          </NuxtLink>
        </div>
        <div class="text-center mt-12">
          <NuxtLink
            to="/modules"
            class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View All Modules
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Learning Domains Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Comprehensive ML Curriculum
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="domain in allDomains"
            :key="domain.id"
            :to="`/modules/${domain.id}`"
            class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-all duration-200 group block"
          >
            <div class="flex items-center mb-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-110"
                :class="`bg-${domain.color}-100`"
              >
                <Icon 
                  :name="domain.icon" 
                  :class="`w-5 h-5 text-${domain.color}-600`"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ domain.name }}
              </h3>
            </div>
            <p class="text-gray-600 text-sm">{{ domain.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
 

    <!-- About Creator Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          From the Creator
        </h2>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="flex-shrink-0">
            <div class=" rounded-full flex items-center justify-center"> 
                <NuxtImg
                  src="https://avatars.githubusercontent.com/u/56586020?v=4" 
                 
                  alt="Author"
                  class="rounded-full "
                  width="120px"
                  height="120px"
                  loading="lazy" 
                />

            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Building Intuition Through Interaction
            </h3>
            <!-- <p class="text-gray-700 mb-4">
              Machine Learning 101 was created to make machine learning accessible to everyone through interactive, visual learning experiences. No complex setups, no prerequisites.
            </p>  -->
            <p class="text-gray-700">
              Every module is designed to build intuition first, theory second. Because when you truly understand how something works, the math becomes much easier to grasp.
            </p>
          </div>
        </div>
      </div>
    </section>
 
    <!-- CTA Section -->
    <section class="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Your ML Journey?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Join learners building intuition through interactive exploration
        </p>
        <NuxtLink
          to="/modules"
          class="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 shadow-lg"
        >
          Start Learning for Free
        </NuxtLink>
      </div>
    </section>
 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSEO, useWebsiteStructuredData, useOrganizationStructuredData } from '~/composables/useSEO';
import { useModules, DOMAINS } from '~/composables/useModules';
import type { Domain } from '~/types/module';

// SEO
useSEO({
  title: 'Machine Learning 101 - Learn Machine Learning Through Interactive Visualizations',
  description: 'Master machine learning concepts with zero setup. Interactive visualizations, real-time parameter adjustments, and hands-on experimentation. Learn regression, classification, clustering, and more.',
  keywords: 'machine learning, interactive learning, ML tutorial, data science, visualization, regression, classification, clustering, neural networks',
  url: '/',
  type: 'website',
})

// Structured Data
useWebsiteStructuredData()
useOrganizationStructuredData()

// Newsletter form
const newsletterEmail = ref('');

const handleNewsletterSubmit = () => {
  // TODO: Implement newsletter subscription logic
  console.log('Newsletter subscription:', newsletterEmail.value);
  alert('Thank you for subscribing! (Newsletter integration coming soon)');
  newsletterEmail.value = '';
}

// Load all domains for the curriculum section
const allDomains = ref(Object.values(DOMAINS));

// Featured modules data
const featuredModules = [
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    description: 'Learn how to model linear relationships and understand gradient descent optimization.',
    domain: 'Regression',
    path: '/modules/regression/linear-regression',
    icon: 'mdi:chart-line-variant',
    duration: 30,
    difficulty: 'beginner'
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    description: 'Explore binary classification with decision boundaries and probability predictions.',
    domain: 'Classification',
    path: '/modules/classification/logistic-regression',
    icon: 'mdi:chart-scatter-plot',
    duration: 35,
    difficulty: 'beginner'
  },
  {
    id: 'k-means',
    title: 'K-Means Clustering',
    description: 'Discover unsupervised learning by grouping similar data points together.',
    domain: 'Clustering',
    path: '/modules/clustering/k-means',
    icon: 'mdi:dots-hexagon',
    duration: 30,
    difficulty: 'beginner'
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    description: 'Visualize how optimization algorithms navigate loss landscapes to find optimal solutions.',
    domain: 'Optimization',
    path: '/modules/optimization/gradient-descent',
    icon: 'mdi:slope-downhill',
    duration: 25,
    difficulty: 'intermediate'
  },
  {
    id: 'feature-scaling',
    title: 'Feature Scaling',
    description: 'Understand normalization and standardization with before/after comparisons.',
    domain: 'Preprocessing',
    path: '/modules/preprocessing/feature-scaling',
    icon: 'mdi:scale-balance',
    duration: 20,
    difficulty: 'beginner'
  },
  {
    id: 'neural-network',
    title: 'Neural Networks',
    description: 'Explore feedforward networks with interactive architecture and backpropagation visualization.',
    domain: 'Advanced',
    path: '/modules/advanced/neural-network',
    icon: 'mdi:brain',
    duration: 45,
    difficulty: 'advanced'
  }
]
</script>
