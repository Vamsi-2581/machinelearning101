<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p class="text-xl text-gray-600">
          We'd love to hear from you. Questions, feedback, or just want to say hello?
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          
          <div class="space-y-6 mb-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:email" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                <a 
                  href="mailto:hello@machinelearningsimplified.com" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  hello@machinelearningsimplified.com
                </a>
                <p class="text-sm text-gray-600 mt-1">We typically respond within 24-48 hours</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:github" class="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">GitHub</h3>
                <a 
                  href="https://github.com/mlsimplified-app/platform" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  github.com/mlsimplified/platform
                </a>
                <p class="text-sm text-gray-600 mt-1">Report issues, contribute, or star the project</p>
              </div>
            </div>
 
          </div>

          <!-- Quick Links -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink 
                  to="/about" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  About ML Simplified
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/why-learn-here" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Why Learn Here?
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/modules" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Browse Modules
                </NuxtLink>
              </li>
              <li>
                <a 
                  href="https://github.com/mlsimplified-app/platform/issues" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact Form & Newsletter -->
        <div> 
          <!-- Newsletter Subscription -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
            <h2 class="text-2xl font-bold mb-2">Stay Updated</h2>
            <p class="text-blue-100 mb-4">
              Get notified about new modules, features, and ML learning tips
            </p>
            <form @submit.prevent="handleNewsletterSubmit" class="space-y-3">
              <div>
                <label for="newsletter-email" class="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  v-model="newsletterEmail"
                  type="email"
                  required
                  class="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
              <button
                type="submit"
                :disabled="newsletterSubmitting"
                class="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ newsletterSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter' }}
              </button>
              <p v-if="newsletterSuccess" class="text-sm text-white text-center">
                <Icon name="mdi:check-circle" class="inline w-4 h-4 mr-1" />
                Successfully subscribed! Check your email to confirm.
              </p>
              <p v-if="newsletterError" class="text-sm text-red-200 text-center">
                <Icon name="mdi:alert-circle" class="inline w-4 h-4 mr-1" />
                {{ newsletterError }}
              </p>
            </form>
            <p class="text-xs text-blue-200 mt-4">
             Unsubscribe anytime. No spam, ever.
            </p>
          </div>

          <!-- Privacy Notice -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <Icon name="mdi:shield-check" class="w-4 h-4 mr-2 text-green-600" />
              Privacy Notice
            </h3>
            <p class="text-xs text-gray-600">
              We take your privacy seriously. We never share your information with 
              third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { ref } from 'vue'

// SEO
useSEO({
  title: 'Contact Us - ML Simplified',
  description: 'Get in touch with ML Simplified. Send us your questions, feedback, or subscribe to our newsletter for updates on new modules and ML learning tips.',
  keywords: 'contact ML Simplified, machine learning support, ML questions, newsletter subscription',
  url: '/contact',
  type: 'website',
})

// Contact Form State
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const contactSubmitting = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')

// Newsletter State
const newsletterEmail = ref('')
const newsletterSubmitting = ref(false)
const newsletterSuccess = ref(false)
const newsletterError = ref('')

// Handle Contact Form Submission
const handleContactSubmit = async () => {
  contactSubmitting.value = true
  contactSuccess.value = false
  contactError.value = ''

  try {
    // In a real implementation, this would send to a backend API or email service
    // For now, we'll simulate the submission with mailto link
    const mailtoLink = `mailto:hello@machinelearningsimplified.com?subject=${encodeURIComponent(contactForm.value.subject)}&body=${encodeURIComponent(
      `Name: ${contactForm.value.name}\nEmail: ${contactForm.value.email}\n\nMessage:\n${contactForm.value.message}`
    )}`
    
    window.location.href = mailtoLink
    
    // Show success message
    contactSuccess.value = true
    
    // Reset form after a delay
    setTimeout(() => {
      contactForm.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      contactSuccess.value = false
    }, 3000)
  } catch (error) {
    contactError.value = 'Failed to send message. Please try emailing us directly at hello@machinelearningsimplified.com'
  } finally {
    contactSubmitting.value = false
  }
}

// Handle Newsletter Subscription
const handleNewsletterSubmit = async () => {
  newsletterSubmitting.value = true
  newsletterSuccess.value = false
  newsletterError.value = ''

  try {
    // In a real implementation, this would integrate with an email service like:
    // - Mailchimp API
    // - ConvertKit API
    // - SendGrid API
    // - Custom backend endpoint
    
    // For demonstration, we'll simulate a successful subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate API call
    // const response = await fetch('/api/newsletter/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: newsletterEmail.value })
    // })
    
    newsletterSuccess.value = true
    
    // Reset form after a delay
    setTimeout(() => {
      newsletterEmail.value = ''
      newsletterSuccess.value = false
    }, 5000)
  } catch (error) {
    newsletterError.value = 'Failed to subscribe. Please try again later.'
  } finally {
    newsletterSubmitting.value = false
  }
}
</script>

