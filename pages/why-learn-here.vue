<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why Learn Machine Learning Here?
        </h1>
        <p class="text-xl text-gray-600">
          Discover what makes ML Simplified the best place to start your machine learning journey
        </p>
      </div>

      <!-- Key Differentiators -->
      <section class="mb-16">
        <div class="space-y-12">
          <!-- Zero Setup -->
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon name="mdi:rocket-launch" class="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Start Learning in Seconds, Not Hours</h2>
              <p class="text-gray-700 mb-4">
                Traditional ML learning requires installing Python, Jupyter, NumPy, scikit-learn, and more. 
                That's hours of setup before you write a single line of code. With ML Simplified, you click 
                a link and start learning immediately. Everything runs in your browser with zero configuration.
              </p>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 font-medium mb-2">Other Platforms:</p>
                <ul class="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• Install Python and package managers</li>
                  <li>• Set up virtual environments</li>
                  <li>• Install multiple libraries</li>
                  <li>• Debug installation issues</li>
                  <li>• Finally start learning (maybe)</li>
                </ul>
                <p class="text-sm text-blue-600 font-semibold">ML Simplified: Click and learn. That's it.</p>
              </div>
            </div>
          </div>

          <!-- Visual Learning -->
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Icon name="mdi:eye" class="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">See Algorithms Work, Don't Just Read About Them</h2>
              <p class="text-gray-700 mb-4">
                Reading about gradient descent is one thing. Watching it navigate a loss landscape in real-time 
                is transformative. Our interactive visualizations show you exactly how algorithms work, building 
                intuition that textbooks can't provide.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="bg-green-50 p-3 rounded-lg">
                  <p class="text-sm font-semibold text-green-900 mb-1">✓ Watch models learn in real-time</p>
                  <p class="text-xs text-green-700">See loss decrease with each iteration</p>
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                  <p class="text-sm font-semibold text-green-900 mb-1">✓ Visualize decision boundaries</p>
                  <p class="text-xs text-green-700">Understand how classifiers separate data</p>
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                  <p class="text-sm font-semibold text-green-900 mb-1">✓ Explore 3D loss landscapes</p>
                  <p class="text-xs text-green-700">Navigate optimization paths interactively</p>
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                  <p class="text-sm font-semibold text-green-900 mb-1">✓ Animate clustering iterations</p>
                  <p class="text-xs text-green-700">Watch centroids converge step-by-step</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Experimentation -->
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Icon name="mdi:hand-pointing-up" class="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Learn by Doing, Not Just Watching</h2>
              <p class="text-gray-700 mb-4">
                Every parameter is at your fingertips. Adjust learning rates, change datasets, modify architectures. 
                See what happens when you make learning rates too high. Discover why feature scaling matters. 
                Build intuition through experimentation, not memorization.
              </p>
              <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p class="text-sm text-blue-900 font-medium mb-2">
                  "I finally understand why my models weren't converging. Seeing the optimization path 
                  oscillate with high learning rates made it click instantly."
                </p>
                <p class="text-xs text-blue-700">- Sarah, Data Science Student</p>
              </div>
            </div>
          </div>

          <!-- Structured Learning -->
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon name="mdi:map-marker-path" class="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Clear Learning Path from Basics to Advanced</h2>
              <p class="text-gray-700 mb-4">
                No more jumping between random tutorials. Our curriculum is carefully structured to build 
                knowledge progressively. Start with linear regression, master the fundamentals, then advance 
                to neural networks and deep learning.
              </p>
              <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-700">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span>Guided lessons with clear learning objectives</span>
                </div>
                <div class="flex items-center text-sm text-gray-700">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span>Quizzes to test your understanding</span>
                </div>
                <div class="flex items-center text-sm text-gray-700">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span>Progress tracking to see how far you've come</span>
                </div>
                <div class="flex items-center text-sm text-gray-700">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span>Prerequisites clearly marked for each module</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Comparison Table -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">How We Compare</h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b-2 border-gray-200">Feature</th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50">ML Simplified</th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b-2 border-gray-200">Video Courses</th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b-2 border-gray-200">Textbooks</th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b-2 border-gray-200">Jupyter Notebooks</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Zero Setup</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Interactive Visualizations</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:minus" class="w-5 h-5 text-gray-400 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:minus" class="w-5 h-5 text-gray-400 mx-auto" /></td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Real-Time Parameter Adjustment</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:minus" class="w-5 h-5 text-gray-400 mx-auto" /></td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Hands-On Experimentation</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Structured Curriculum</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:minus" class="w-5 h-5 text-gray-400 mx-auto" /></td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-4 py-3 text-gray-900">Free & Open Source</td>
                <td class="px-4 py-3 text-center bg-blue-50"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:close-bold" class="w-5 h-5 text-red-600 mx-auto" /></td>
                <td class="px-4 py-3 text-center"><Icon name="mdi:check-bold" class="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 text-center mt-4">
          <Icon name="mdi:check-bold" class="inline w-4 h-4 text-green-600" /> = Yes &nbsp;&nbsp;
          <Icon name="mdi:minus" class="inline w-4 h-4 text-gray-400" /> = Partial &nbsp;&nbsp;
          <Icon name="mdi:close-bold" class="inline w-4 h-4 text-red-600" /> = No
        </p>
      </section>

      <!-- Social Proof / Testimonials -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">What Learners Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              "Finally, a platform that makes ML concepts click! The interactive visualizations helped me 
              understand gradient descent in 10 minutes after struggling with textbooks for weeks."
            </p>
            <p class="text-sm font-semibold text-gray-900">Alex Chen</p>
            <p class="text-xs text-gray-600">Computer Science Student</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              "The zero-setup approach is brilliant. I was learning within seconds, not hours. Perfect for 
              busy professionals who want to learn ML without the installation headaches."
            </p>
            <p class="text-sm font-semibold text-gray-900">Maria Rodriguez</p>
            <p class="text-xs text-gray-600">Product Manager</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              "I love how I can experiment with different parameters and immediately see the results. 
              It's like having a ML playground where mistakes are learning opportunities."
            </p>
            <p class="text-sm font-semibold text-gray-900">James Wilson</p>
            <p class="text-xs text-gray-600">Self-Taught Developer</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              "The visual approach makes complex concepts accessible. I recommend this to all my students 
              as a supplement to our coursework. It bridges theory and intuition perfectly."
            </p>
            <p class="text-sm font-semibold text-gray-900">Dr. Emily Park</p>
            <p class="text-xs text-gray-600">University Professor</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Experience the Difference?
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of learners building ML intuition through interactive exploration
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/modules"
            class="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 shadow-lg"
          >
            Start Learning for Free
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-block px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Learn More About Us
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useSEO({
  title: 'Why Learn Machine Learning Here? - ML Simplified Benefits & Comparison',
  description: 'Discover why ML Simplified is the best place to learn machine learning. Zero setup, interactive visualizations, hands-on experimentation, and structured curriculum. Compare with other learning resources.',
  keywords: 'machine learning comparison, best ML learning platform, interactive ML tutorial, ML visualization, learn machine learning online',
  url: '/why-learn-here',
  type: 'website',
})

// FAQ Structured Data
useFAQStructuredData([
  {
    question: 'Why choose ML Simplified over other learning platforms?',
    answer: 'ML Simplified offers zero setup, interactive visualizations, real-time parameter adjustments, and hands-on experimentation. Everything runs in your browser with no installations required.',
  },
  {
    question: 'Do I need to install Python or any software?',
    answer: 'No! ML Simplified runs entirely in your browser. Just click a link and start learning immediately with zero setup required.',
  },
  {
    question: 'How is ML Simplified different from video courses?',
    answer: 'Unlike passive video courses, ML Simplified provides interactive visualizations where you can adjust parameters and see results in real-time, building intuition through experimentation.',
  },
  {
    question: 'Is ML Simplified free to use?',
    answer: 'Yes! ML Simplified is completely free and open source. All learning modules and features are available at no cost.',
  },
])
</script>
