<template>
  <div class="py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p class="text-xl text-gray-600">
          We'd love to hear from you. Questions, feedback, or just want to say hello?
        </p>
      </div>

      <div class="mx-auto"  >
        <!-- Contact Information -->
        <div class="mx-auto "> 
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
                  href="mailto:hello@machinelearning101.com" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  hello@machinelearning101.com
                </a>
                <p class="text-sm text-gray-600 mt-1">We typically respond within 24-48 hours</p>
              </div>
            </div>

            <!-- <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:github" class="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">GitHub</h3>
                <a 
                  href="https://github.com/marvelefe/machinelearning101" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  github.com/mlsimplified/platform
                </a>
                <p class="text-sm text-gray-600 mt-1">Report issues, contribute, or star the project</p>
              </div>
            </div>
  -->
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
                  About Machine Learning 101
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
                  to="/modules/" 
                  class="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Browse Modules
                </NuxtLink>
              </li>
              <li>
                <a 
                  href="https://github.com/marvelefe/machinelearning101/issues" 
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
 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { ref } from 'vue'

// SEO
useSEO({
  title: 'Contact Us - Machine Learning 101',
  description: 'Get in touch with Machine Learning 101. Send us your questions, feedback, or subscribe to our newsletter for updates on new modules and ML learning tips.',
  keywords: 'contact Machine Learning 101, machine learning support, ML questions, newsletter subscription',
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
    const mailtoLink = `mailto:hello@machinelearning101.com?subject=${encodeURIComponent(contactForm.value.subject)}&body=${encodeURIComponent(
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
    contactError.value = 'Failed to send message. Please try emailing us directly at hello@machinelearning101.com'
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

