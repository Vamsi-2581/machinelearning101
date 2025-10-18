<script setup lang="ts">
/**
 * Getting Started Page
 * 
 * Provides a quick start guide for new users
 * Requirements: 7.2, 7.3
 */

const steps = [
  {
    number: 1,
    title: 'Choose Your Learning Path',
    description: 'Select a path based on your experience level and goals.',
    icon: 'heroicons:map',
    paths: [
      {
        name: 'Complete Beginner',
        description: 'New to ML? Start here with the fundamentals.',
        modules: ['Linear Regression', 'Feature Scaling', 'Gradient Descent']
      },
      {
        name: 'Quick Overview',
        description: 'Have some ML knowledge? Get a refresher.',
        modules: ['Linear Regression', 'Logistic Regression', 'K-Means']
      },
      {
        name: 'Deep Dive',
        description: 'Want comprehensive understanding? Cover everything.',
        modules: ['All Preprocessing', 'All Regression', 'All Classification']
      }
    ]
  },
  {
    number: 2,
    title: 'Explore a Module',
    description: 'Each module has three sections to help you learn effectively.',
    icon: 'heroicons:book-open',
    sections: [
      {
        name: 'Content',
        description: 'Read explanations of key concepts and how the algorithm works.',
        tip: 'Read this first to understand what you\'re about to experiment with.'
      },
      {
        name: 'Interactive',
        description: 'Adjust parameters, train models, and see real-time visualizations.',
        tip: 'Experiment freely—you can\'t break anything!'
      },
      {
        name: 'Quiz',
        description: 'Test your understanding with questions and get immediate feedback.',
        tip: 'Aim for 80%+ to ensure you\'ve grasped the concepts.'
      }
    ]
  },
  {
    number: 3,
    title: 'Experiment with Parameters',
    description: 'The best way to learn is by doing. Try these experiments:',
    icon: 'heroicons:beaker',
    experiments: [
      'Start with default settings to see baseline behavior',
      'Change one parameter at a time to understand its effect',
      'Try extreme values to see what happens',
      'Switch between datasets to see how the algorithm adapts',
      'Compare results with different parameter combinations'
    ]
  },
  {
    number: 4,
    title: 'Track Your Progress',
    description: 'Your learning journey is automatically saved.',
    icon: 'heroicons:chart-bar',
    features: [
      'Completed modules are marked with checkmarks',
      'Quiz scores are saved for each module',
      'Bookmark interesting configurations',
      'Resume where you left off',
      'View your progress dashboard anytime'
    ]
  }
];

const tips = [
  {
    icon: 'heroicons:light-bulb',
    title: 'Read Tooltips',
    description: 'Hover over any control or term to see helpful explanations.'
  },
  {
    icon: 'heroicons:arrow-path',
    title: 'Use Reset',
    description: 'Click Reset to return to default settings anytime.'
  },
  {
    icon: 'heroicons:keyboard',
    title: 'Keyboard Shortcuts',
    description: 'Press "?" to see all available keyboard shortcuts.'
  },
  {
    icon: 'heroicons:clock',
    title: 'Take Your Time',
    description: 'Learning ML takes practice. Don\'t rush—experiment and explore!'
  }
];

// SEO
useSEO({
  title: 'Getting Started - Learn Machine Learning Interactively',
  description: 'Get started with ML Learning Platform. Learn how to use interactive modules, experiment with algorithms, and track your progress.'
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="text-5xl font-bold mb-4">
          Getting Started
        </h1>
        <p class="text-xl text-blue-100 mb-8">
          Learn machine learning through interactive experimentation. No installation required!
        </p>
        <NuxtLink
          to="/modules"
          class="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          Start Learning
          <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Steps -->
      <div class="space-y-12">
        <div
          v-for="step in steps"
          :key="step.number"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Step Header -->
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {{ step.number }}
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ step.title }}
                </h2>
                <p class="text-gray-600 mt-1">
                  {{ step.description }}
                </p>
              </div>
              <Icon :name="step.icon" class="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <!-- Step Content -->
          <div class="p-6">
            <!-- Learning Paths -->
            <div v-if="step.paths" class="grid md:grid-cols-3 gap-4">
              <div
                v-for="path in step.paths"
                :key="path.name"
                class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 class="font-bold text-lg text-gray-900 mb-2">
                  {{ path.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  {{ path.description }}
                </p>
                <div class="text-xs text-gray-500">
                  <div class="font-medium mb-1">Includes:</div>
                  <ul class="space-y-1">
                    <li v-for="module in path.modules" :key="module" class="flex items-start">
                      <Icon name="heroicons:check" class="w-4 h-4 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{{ module }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Module Sections -->
            <div v-if="step.sections" class="space-y-4">
              <div
                v-for="section in step.sections"
                :key="section.name"
                class="flex gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 mb-1">
                    {{ section.name }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ section.description }}
                  </p>
                  <div class="flex items-start gap-2 text-xs text-blue-600">
                    <Icon name="heroicons:light-bulb" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{{ section.tip }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experiments -->
            <ul v-if="step.experiments" class="space-y-3">
              <li
                v-for="(experiment, index) in step.experiments"
                :key="index"
                class="flex items-start gap-3"
              >
                <Icon name="heroicons:beaker" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span class="text-gray-700">{{ experiment }}</span>
              </li>
            </ul>

            <!-- Features -->
            <ul v-if="step.features" class="space-y-3">
              <li
                v-for="(feature, index) in step.features"
                :key="index"
                class="flex items-start gap-3"
              >
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="mt-12 bg-yellow-50 rounded-xl border-2 border-yellow-200 p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="heroicons:star" class="w-6 h-6 text-yellow-600" />
          Pro Tips for Success
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="tip in tips"
            :key="tip.title"
            class="flex gap-3 p-4 bg-white rounded-lg"
          >
            <Icon :name="tip.icon" class="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 class="font-bold text-gray-900 mb-1">
                {{ tip.title }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ tip.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="mt-12 grid md:grid-cols-3 gap-6">
        <NuxtLink
          to="/modules/regression/linear-regression"
          class="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors group"
        >
          <Icon name="heroicons:academic-cap" class="w-8 h-8 text-blue-600 mb-3" />
          <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600">
            Start First Module
          </h3>
          <p class="text-sm text-gray-600">
            Begin with Linear Regression
          </p>
        </NuxtLink>

        <NuxtLink
          to="/faq"
          class="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors group"
        >
          <Icon name="heroicons:question-mark-circle" class="w-8 h-8 text-blue-600 mb-3" />
          <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600">
            Read FAQ
          </h3>
          <p class="text-sm text-gray-600">
            Common questions answered
          </p>
        </NuxtLink>

        <NuxtLink
          to="/progress"
          class="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors group"
        >
          <Icon name="heroicons:chart-bar" class="w-8 h-8 text-blue-600 mb-3" />
          <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600">
            Track Progress
          </h3>
          <p class="text-sm text-gray-600">
            View your learning journey
          </p>
        </NuxtLink>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <h2 class="text-3xl font-bold mb-4">
          Ready to Start Learning?
        </h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of learners building intuition for machine learning through interactive experimentation.
        </p>
        <NuxtLink
          to="/modules"
          class="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg"
        >
          Explore All Modules
          <Icon name="heroicons:arrow-right" class="ml-2 w-6 h-6" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
