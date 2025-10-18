<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About ML Simplified
        </h1>
        <p class="text-xl text-gray-600">
          Making machine learning accessible through interactive exploration
        </p>
      </div>

      <!-- Mission Section -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <div class="prose prose-lg max-w-none text-gray-700">
          <p class="mb-4">
            Machine learning is transforming the world, but learning it can be intimidating. Complex mathematics, 
            abstract concepts, and setup barriers prevent many curious minds from exploring this fascinating field.
          </p>
          <p class="mb-4">
            ML Simplified was created to change that. We believe that the best way to learn machine learning is 
            through hands-on experimentation and visual exploration. By removing setup barriers and providing 
            interactive visualizations, we make ML concepts accessible to everyone.
          </p>
          <p>
            Our platform runs entirely in your browser with zero setup required. Adjust parameters, see results 
            instantly, and build intuition through experimentation. Whether you're a student, professional, or 
            curious learner, ML Simplified helps you understand how algorithms really work.
          </p>
        </div>
      </section>

      <!-- What Makes Us Different -->
      <section class="mb-12 bg-blue-50 rounded-lg p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="mdi:lightning-bolt" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Zero Setup, Instant Learning</h3>
              <p class="text-gray-700">
                No installations, no configuration, no backend servers. Everything runs in your browser. 
                Click a link and start learning immediately.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Icon name="mdi:eye" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Visual-First Approach</h3>
              <p class="text-gray-700">
                See algorithms work in real-time. Watch gradient descent navigate loss landscapes, observe 
                decision boundaries form, and visualize how models learn from data.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="mdi:hand-pointing-up" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Interactive Experimentation</h3>
              <p class="text-gray-700">
                Adjust learning rates, change datasets, modify architectures. Every parameter is at your 
                fingertips with immediate visual feedback. Learn by doing, not just reading.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Icon name="mdi:map-marker-path" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Structured Learning Path</h3>
              <p class="text-gray-700">
                Progress from fundamentals to advanced topics. Each module includes explanations, interactive 
                visualizations, and quizzes to test your understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Technology Section -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Built with Modern Web Technology</h2>
        <p class="text-gray-700 mb-6">
          ML Simplified leverages cutting-edge web technologies to deliver a fast, responsive, and 
          accessible learning experience:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Client-Side Computation</h3>
            <p class="text-sm text-gray-600">
              All algorithms run in your browser using Web Workers for smooth performance
            </p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Interactive Visualizations</h3>
            <p class="text-sm text-gray-600">
              Powered by Plotly, D3.js, and custom Canvas rendering for rich graphics
            </p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p class="text-sm text-gray-600">
              Works seamlessly on desktop, tablet, and mobile devices
            </p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Privacy-Focused</h3>
            <p class="text-sm text-gray-600">
              Your progress is saved locally. No accounts required, no data collection
            </p>
          </div>
        </div>
      </section>

      <!-- Open Source Section -->
      <section class="mb-12 bg-gray-50 rounded-lg p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Open Source & Community</h2>
        <p class="text-gray-700 mb-4">
          ML Simplified is an open-source project built for the learning community. We believe that 
          educational resources should be freely accessible to everyone.
        </p>
        <p class="text-gray-700 mb-6">
          Whether you want to contribute new modules, improve existing content, fix bugs, or suggest 
          features, we welcome your participation. Together, we can make machine learning education 
          better for everyone.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="https://github.com/mlsimplified/platform"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <Icon name="mdi:github" class="w-5 h-5 mr-2" />
            View on GitHub
          </a>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Icon name="mdi:email" class="w-5 h-5 mr-2" />
            Get in Touch
          </NuxtLink>
        </div>
      </section>

      <!-- Contact Info -->
      <section class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h2>
        <p class="text-gray-700 mb-6">
          We'd love to hear from you. Whether you have questions, suggestions, or just want to say hello.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Contact Us
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useSEO({
  title: 'About ML Simplified - Our Mission to Make Machine Learning Accessible',
  description: 'Learn about ML Simplified\'s mission to make machine learning accessible through interactive visualizations and hands-on experimentation. Zero setup, visual-first learning for everyone.',
  keywords: 'about ML Simplified, machine learning education, interactive learning platform, open source ML, educational technology',
  url: '/about',
  type: 'website',
})

// Structured Data
useOrganizationStructuredData()
</script>
