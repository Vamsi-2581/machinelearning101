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
            to="/about"
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
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Regression</h3>
            <p class="text-gray-600 text-sm">Linear & logistic regression with gradient descent visualization</p>
          </div>
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Classification</h3>
            <p class="text-gray-600 text-sm">Decision boundaries, confusion matrices, and ROC curves</p>
          </div>
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Clustering</h3>
            <p class="text-gray-600 text-sm">K-means and hierarchical clustering with interactive visualizations</p>
          </div>
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Preprocessing</h3>
            <p class="text-gray-600 text-sm">Feature scaling, encoding, and missing value imputation</p>
          </div>
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Optimization</h3>
            <p class="text-gray-600 text-sm">Gradient descent, Adam, RMSProp with loss landscape visualization</p>
          </div>
          <div class="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Advanced Topics</h3>
            <p class="text-gray-600 text-sm">PCA, t-SNE, neural networks, and deep learning concepts</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          What Learners Are Saying
        </h2>
        <p class="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of students who have transformed their understanding of machine learning
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
              </div>
            </div>
            <p class="text-gray-700 mb-4">
              "Finally, a platform that makes ML concepts click! The interactive visualizations helped me understand gradient descent in ways textbooks never could."
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-700 font-semibold">SJ</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Sarah Johnson</p>
                <p class="text-sm text-gray-600">Computer Science Student</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
              </div>
            </div>
            <p class="text-gray-700 mb-4">
              "The zero-setup approach is brilliant. I could start learning immediately without wrestling with Python installations. Perfect for beginners!"
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-green-700 font-semibold">MP</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Michael Patel</p>
                <p class="text-sm text-gray-600">Data Analyst</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
                <Icon name="mdi:star" class="w-5 h-5" />
              </div>
            </div>
            <p class="text-gray-700 mb-4">
              "I've tried many ML courses, but this one stands out. Being able to tweak parameters and see results instantly made everything so much clearer."
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-purple-700 font-semibold">EC</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Emily Chen</p>
                <p class="text-sm text-gray-600">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Creator Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-4xl mx-auto">
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
                  width="160px"
                  height="160px"
                  loading="lazy" 
                />

            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Building Intuition Through Interaction
            </h3>
            <p class="text-gray-700 mb-4">
              Machine Learning Simplified was created with a simple mission: make machine learning accessible to everyone through interactive, visual learning experiences. No complex setups, no prerequisites—just pure exploration and discovery.
            </p> 
            <p class="text-gray-700">
              Every module is designed to build intuition first, theory second. Because when you truly understand how something works, the math becomes much easier to grasp.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-2xl mx-auto text-center">
        <div class="mb-6">
          <Icon name="mdi:email-newsletter" class="w-16 h-16 text-blue-600 mx-auto" />
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Stay Updated
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Get notified when we add new modules, features, and learning resources.
        </p>
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent="handleNewsletterSubmit">
          <input
            v-model="newsletterEmail"
            type="email"
            placeholder="Enter your email"
            required
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Email address"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p class="text-sm text-gray-500 mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
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
import { ref } from 'vue';
import { useSEO, useWebsiteStructuredData, useOrganizationStructuredData } from '~/composables/useSEO';

// SEO
useSEO({
  title: 'ML Simplified - Learn Machine Learning Through Interactive Visualizations',
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
