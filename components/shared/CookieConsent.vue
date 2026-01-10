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
              We use Google Analytics to understand how you use our platform and improve your learning experience. 
              Only anonymous usage data is collected. No personal information is tracked. 
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
import { useGtag } from '#imports';
import Button from '~/components/shared/Button.vue';

/**
 * Cookie Consent Banner
 * 
 * Displays a banner on first visit asking users to opt in to analytics.
 * Respects user preferences and doesn't show again after choice is made.
 * Integrates with Google Consent Mode v2.
 * 
 * Key fix: For returning users who accepted, we MUST update consent to 'granted'
 * BEFORE any analytics calls are made. This ensures Google sees proper consent signals.
 * 
 * Requirements: 11.6, 11.7
 */

const analyticsStore = useAnalyticsStore();
const { gtag, initialize } = useGtag();
const showBanner = ref(false);

const CONSENT_KEY = 'ml-platform-consent-shown';
const CONSENT_CHOICE_KEY = 'ml-platform-consent-choice'; // 'granted' or 'denied'

/**
 * Update consent state in Google Tag
 */
const updateConsentState = (analyticsGranted: boolean) => {
  gtag('consent', 'update', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
  });
};

/**
 * Check if we should show the banner
 */
onMounted(() => {
  // Check for existing consent choice
  const consentChoice = localStorage.getItem(CONSENT_CHOICE_KEY);
  
  if (consentChoice === 'granted') {
    // User previously accepted - initialize and grant consent immediately
    // This must happen BEFORE any other analytics code runs
    initialize();
    updateConsentState(true);
  } else if (consentChoice === 'denied') {
    // User previously declined - just update consent state (no initialize)
    // The default in gtag config is already 'denied', but we explicitly set it
    // to ensure consistency
    updateConsentState(false);
  } else {
    // No choice made yet - show the banner after a short delay
    // Don't initialize gtag until user makes a choice
    setTimeout(() => {
      showBanner.value = true;
    }, 1500);
  }
});

/**
 * Handle accept
 */
const handleAccept = () => {
  analyticsStore.setOptIn(true);
  localStorage.setItem(CONSENT_KEY, 'true');
  localStorage.setItem(CONSENT_CHOICE_KEY, 'granted');
  
  // Initialize Google Analytics and grant consent
  initialize();
  updateConsentState(true);
  
  showBanner.value = false;
};

/**
 * Handle decline
 */
const handleDecline = () => {
  analyticsStore.setOptIn(false);
  localStorage.setItem(CONSENT_KEY, 'true');
  localStorage.setItem(CONSENT_CHOICE_KEY, 'denied');
  
  // Explicitly update consent to denied (for clarity with Google)
  updateConsentState(false);
  
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
