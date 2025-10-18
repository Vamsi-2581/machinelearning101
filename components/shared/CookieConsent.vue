<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="showBanner"
        class="cookie-consent-banner"
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
      >
        <div class="banner-content">
          <div class="banner-text">
            <h3 id="cookie-consent-title" class="banner-title">
              Privacy & Analytics
            </h3>
            <p id="cookie-consent-description" class="banner-description">
              We use privacy-focused analytics to understand how you use our platform and improve your learning experience. 
              No personal data is collected, and no cookies are used for tracking. 
              <NuxtLink to="/privacy" class="privacy-link">Learn more</NuxtLink>
            </p>
          </div>
          
          <div class="banner-actions">
            <Button
              variant="secondary"
              size="sm"
              @click="handleDecline"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              @click="handleAccept"
            >
              Accept Analytics
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAnalyticsStore } from '~/stores/analytics';
import Button from '~/components/shared/Button.vue';

/**
 * Cookie Consent Banner
 * 
 * Displays a banner on first visit asking users to opt in to analytics.
 * Respects user preferences and doesn't show again after choice is made.
 * 
 * Requirements: 11.6, 11.7
 */

const analyticsStore = useAnalyticsStore();
const showBanner = ref(false);

const CONSENT_KEY = 'ml-platform-consent-shown';

/**
 * Check if we should show the banner
 */
onMounted(() => {
  // Don't show if user has already made a choice
  const consentShown = localStorage.getItem(CONSENT_KEY);
  
  if (!consentShown) {
    // Show banner after a short delay for better UX
    setTimeout(() => {
      showBanner.value = true;
    }, 1000);
  }
});

/**
 * Handle accept
 */
const handleAccept = () => {
  analyticsStore.setOptIn(true);
  localStorage.setItem(CONSENT_KEY, 'true');
  showBanner.value = false;
};

/**
 * Handle decline
 */
const handleDecline = () => {
  analyticsStore.setOptIn(false);
  localStorage.setItem(CONSENT_KEY, 'true');
  showBanner.value = false;
};
</script>

<style scoped>
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.banner-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.privacy-link {
  color: #3b82f6;
  text-decoration: underline;
  font-weight: 500;
}

.privacy-link:hover {
  color: #2563eb;
}

.banner-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cookie-consent-banner {
    padding: 1rem;
  }

  .banner-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .banner-actions {
    flex-direction: column;
    width: 100%;
  }

  .banner-actions button {
    width: 100%;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }
}
</style>
