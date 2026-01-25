<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            About
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Interactive machine learning platform for beginners. Learn by doing with zero setup required.
          </p>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Quick Links
          </h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink :to="link.path"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:underline">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social links --> 
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Connect
          </h3>
          <div class="flex space-x-4">
            <a v-for="social in socialLinks" :key="social.name" :href="social.url" :aria-label="social.name"
              target="_blank" rel="noopener noreferrer"
              class="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
              <Icon :name="social.icon" class="w-6 h-6" />
            </a>
          </div>
        </div> 
      </div>
      

      <!-- Bottom bar -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-gray-500">
            © {{ currentYear }}. Made with ❤️ for learners everywhere.
          </p>
          <div class="flex space-x-6">
            <NuxtLink to="/privacy"
              class="text-sm text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:underline">
              Privacy Policy
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear());

// Quick links to marketing pages
const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Why Learn Here', path: '/why-learn-here' },
  { label: 'Contact', path: '/contact' },
  { label: 'Modules', path: '/modules' },
];

// Social media links
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/marvelefe/machinelearning101',
    icon: 'mdi:github',
  }
];
</script>
