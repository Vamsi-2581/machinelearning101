<script setup lang="ts">
import { ref } from 'vue';

/**
 * FAQ Page Component
 * 
 * Provides answers to frequently asked questions
 * Requirements: 7.2, 7.3
 */

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    id: 'install',
    category: 'Getting Started',
    question: 'Do I need to install anything?',
    answer: 'No! Everything runs directly in your browser. Just visit the website and start learning—no downloads, no setup, no hassle.'
  },
  {
    id: 'free',
    category: 'Getting Started',
    question: 'Is this platform free?',
    answer: 'Yes, ML Learning Platform is completely free to use. We believe quality ML education should be accessible to everyone.'
  },
  {
    id: 'prerequisites',
    category: 'Getting Started',
    question: 'Do I need prior machine learning knowledge?',
    answer: 'No prior ML knowledge is required! We start from the basics and build up gradually. However, basic understanding of math (algebra, basic statistics) will be helpful.'
  },
  {
    id: 'time',
    category: 'Getting Started',
    question: 'How long does it take to complete all modules?',
    answer: 'Each module takes 20-45 minutes. Completing all modules takes approximately 10-15 hours, but you can learn at your own pace and take breaks anytime.'
  },
  {
    id: 'mobile',
    category: 'Getting Started',
    question: 'Can I use this on my phone or tablet?',
    answer: 'Yes! The platform is fully responsive and works on mobile devices and tablets. However, for the best experience with complex visualizations, we recommend using a desktop or laptop.'
  },
  
  // Learning
  {
    id: 'order',
    category: 'Learning',
    question: 'What order should I follow the modules?',
    answer: 'We recommend starting with Linear Regression if you\'re a beginner. Each module lists prerequisites, so follow those suggestions. Check the User Guide for recommended learning paths.'
  },
  {
    id: 'skip',
    category: 'Learning',
    question: 'Can I skip modules?',
    answer: 'Yes, you can learn in any order. However, some modules build on concepts from earlier ones, so we recommend following the prerequisites listed in each module.'
  },
  {
    id: 'understand',
    category: 'Learning',
    question: 'How do I know if I understand a concept?',
    answer: 'Complete the quiz at the end of each module! Aim for 80% or higher. If you score lower, review the content and experiment more with the interactive controls.'
  },
  {
    id: 'stuck',
    category: 'Learning',
    question: 'What if I don\'t understand something?',
    answer: 'Take your time! Re-read the content, hover over controls for tooltips, experiment with different parameters, and try the quiz explanations. Learning ML takes practice.'
  },
  {
    id: 'practice',
    category: 'Learning',
    question: 'How can I practice what I learned?',
    answer: 'Experiment with different parameter combinations, try all available datasets, and observe how changes affect results. The best way to learn is through hands-on experimentation!'
  },
  
  // Technical
  {
    id: 'data-storage',
    category: 'Technical',
    question: 'Where is my data stored?',
    answer: 'All your data (progress, quiz scores, bookmarks) is stored locally in your browser using localStorage. Nothing is sent to our servers—your data stays private on your device.'
  },
  {
    id: 'progress-saved',
    category: 'Technical',
    question: 'Is my progress automatically saved?',
    answer: 'Yes! Your progress is automatically saved in your browser. Use the same browser to maintain your progress. Note: Private/incognito mode won\'t save progress.'
  },
  {
    id: 'export',
    category: 'Technical',
    question: 'Can I export my progress?',
    answer: 'Currently, progress is browser-specific. We\'re working on adding export/import features in a future update.'
  },
  {
    id: 'slow',
    category: 'Technical',
    question: 'Why is training slow sometimes?',
    answer: 'Complex algorithms require computation time. Training speed depends on your device, browser, and the parameters you choose (like number of epochs). Try reducing epochs or using simpler datasets for faster results.'
  },
  {
    id: 'offline',
    category: 'Technical',
    question: 'Can I use this offline?',
    answer: 'After the initial load, many features work offline. However, you need an internet connection for the first visit to download all resources.'
  },
  {
    id: 'browsers',
    category: 'Technical',
    question: 'Which browsers are supported?',
    answer: 'We support modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. Internet Explorer is not supported—please use Microsoft Edge instead.'
  },
  
  // Features
  {
    id: 'datasets',
    category: 'Features',
    question: 'Can I upload my own datasets?',
    answer: 'Currently, we provide curated datasets for each module. Custom dataset upload is planned for a future release.'
  },
  {
    id: 'visualizations',
    category: 'Features',
    question: 'Can I export visualizations?',
    answer: 'Most visualizations support zooming, panning, and hovering for details. Export functionality is coming in a future update.'
  },
  {
    id: 'bookmarks',
    category: 'Features',
    question: 'How do bookmarks work?',
    answer: 'Bookmarks let you save interesting parameter configurations. Click the bookmark button in any module to save the current state, then access your bookmarks from the main menu.'
  },
  {
    id: 'keyboard',
    category: 'Features',
    question: 'Are there keyboard shortcuts?',
    answer: 'Yes! Press "?" to see all keyboard shortcuts. All features are fully keyboard accessible for better usability and accessibility.'
  },
  
  // Content
  {
    id: 'new-modules',
    category: 'Content',
    question: 'Will more modules be added?',
    answer: 'Yes! We\'re continuously working on new modules and topics. Follow our updates or check the roadmap to see what\'s coming next.'
  },
  {
    id: 'suggest',
    category: 'Content',
    question: 'Can I suggest new modules or features?',
    answer: 'Absolutely! We welcome suggestions. Contact us through GitHub issues, email, or our feedback form. Community input helps us improve!'
  },
  {
    id: 'production',
    category: 'Content',
    question: 'Are these algorithms production-ready?',
    answer: 'These are educational implementations designed for learning. For production use, we recommend established libraries like scikit-learn, TensorFlow, or PyTorch.'
  },
  {
    id: 'accuracy',
    category: 'Content',
    question: 'How accurate are the implementations?',
    answer: 'Very accurate! Our algorithms use correct mathematical implementations and produce real results. They\'re simplified for learning but maintain algorithmic correctness.'
  },
  
  // Privacy
  {
    id: 'tracking',
    category: 'Privacy',
    question: 'Do you track my activity?',
    answer: 'We use privacy-focused analytics (opt-in) to understand how the platform is used and improve it. No personal information is collected. You can opt out anytime in privacy settings.'
  },
  {
    id: 'opt-out',
    category: 'Privacy',
    question: 'How do I opt out of analytics?',
    answer: 'Click on "Privacy Settings" in the footer or visit the privacy page. You can disable analytics with one click, and your choice is saved.'
  },
  {
    id: 'private-data',
    category: 'Privacy',
    question: 'Is my learning data private?',
    answer: 'Yes! All your learning data (progress, scores, bookmarks) stays in your browser. We never see or collect this data—it\'s completely private.'
  },
  {
    id: 'cookies',
    category: 'Privacy',
    question: 'Do you use cookies?',
    answer: 'We only use essential cookies for functionality (like saving your progress). No tracking cookies are used. You can manage cookie preferences in the privacy settings.'
  },
  
  // Troubleshooting
  {
    id: 'not-loading',
    category: 'Troubleshooting',
    question: 'The page won\'t load. What should I do?',
    answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have a stable internet connection. If issues persist, contact support.'
  },
  {
    id: 'viz-not-showing',
    category: 'Troubleshooting',
    question: 'Visualizations aren\'t showing. Help!',
    answer: 'Make sure you clicked "Train" to run the algorithm. Check if JavaScript is enabled in your browser. Try refreshing the page or using a different browser.'
  },
  {
    id: 'progress-lost',
    category: 'Troubleshooting',
    question: 'I lost my progress. Can I recover it?',
    answer: 'Progress is stored in your browser. If you cleared browser data or used a different browser, progress may be lost. Make sure cookies/localStorage are enabled and avoid private browsing mode.'
  },
  {
    id: 'quiz-issues',
    category: 'Troubleshooting',
    question: 'The quiz won\'t submit. What\'s wrong?',
    answer: 'Ensure you\'ve answered all questions. Check your internet connection. Try refreshing the page. If the problem persists, your progress is still saved locally.'
  }
];

const categories = [...new Set(faqs.map(faq => faq.category))];
const selectedCategory = ref<string | null>(null);
const searchQuery = ref('');
const expandedItems = ref<Set<string>>(new Set());

const filteredFAQs = computed(() => {
  let filtered = faqs;
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const toggleItem = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const isExpanded = (id: string) => expandedItems.value.has(id);

// SEO
useSEO({
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about ML Learning Platform, including getting started, learning tips, technical support, and privacy information.'
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p class="text-lg text-gray-600">
          Find answers to common questions about using ML Learning Platform
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Search and Filter -->
      <div class="mb-8 space-y-4">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search questions..."
            class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search FAQ"
          />
          <Icon 
            name="heroicons:magnifying-glass" 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap gap-2">
          <button
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
            @click="selectedCategory = null"
          >
            All Categories
          </button>
          <button
            v-for="category in categories"
            :key="category"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-3">
        <div
          v-for="faq in filteredFAQs"
          :key="faq.id"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <button
            :aria-expanded="isExpanded(faq.id)"
            :aria-controls="`faq-answer-${faq.id}`"
            class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="toggleItem(faq.id)"
          >
            <div class="flex-1">
              <div class="text-xs text-blue-600 font-medium mb-1">
                {{ faq.category }}
              </div>
              <div class="text-lg font-medium text-gray-900">
                {{ faq.question }}
              </div>
            </div>
            <Icon
              :name="isExpanded(faq.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
              class="w-5 h-5 text-gray-400 ml-4 flex-shrink-0"
            />
          </button>
          
          <div
            v-show="isExpanded(faq.id)"
            :id="`faq-answer-${faq.id}`"
            class="px-6 py-4 bg-gray-50 border-t border-gray-200"
          >
            <p class="text-gray-700 leading-relaxed">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="filteredFAQs.length === 0"
        class="text-center py-12"
      >
        <Icon name="heroicons:question-mark-circle" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No questions found
        </h3>
        <p class="text-gray-600 mb-4">
          Try adjusting your search or filter
        </p>
        <button
          class="text-blue-600 hover:text-blue-700 font-medium"
          @click="searchQuery = ''; selectedCategory = null"
        >
          Clear filters
        </button>
      </div>

      <!-- Still Have Questions -->
      <div class="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Still have questions?
        </h2>
        <p class="text-gray-600 mb-6">
          Can't find what you're looking for? We're here to help!
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <NuxtLink
            to="/contact"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Us
          </NuxtLink> 
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
