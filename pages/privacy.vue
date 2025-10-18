<template>
  <div class="privacy-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Privacy & Analytics Settings</h1>
        <p class="page-description">
          Control how we collect and use analytics data to improve your learning experience.
        </p>
      </div>

      <!-- Analytics Settings Card -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 class="card-title">Analytics Tracking</h2>
            <p class="card-subtitle">Help us improve the platform</p>
          </div>
        </div>

        <div class="card-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">Enable Analytics</h3>
              <p class="setting-description">
                Allow us to collect anonymous usage data to understand how you use the platform and improve your learning experience.
              </p>
            </div>
            <Toggle
              :model-value="analyticsEnabled"
              @update:model-value="handleToggleAnalytics"
              :aria-label="analyticsEnabled ? 'Disable analytics' : 'Enable analytics'"
            />
          </div>

          <div v-if="analyticsEnabled" class="status-message success">
            <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Analytics enabled. Thank you for helping us improve!</span>
          </div>

          <div v-else class="status-message info">
            <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Analytics disabled. No data is being collected.</span>
          </div>
        </div>
      </div>

      <!-- What We Track Card -->
      <div class="info-card">
        <h2 class="info-title">What We Track</h2>
        <p class="info-description">
          When analytics is enabled, we collect the following anonymous data:
        </p>
        <ul class="info-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Page views:</strong> Which modules and pages you visit</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Interactions:</strong> Parameter changes, algorithm runs, quiz completions</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Time spent:</strong> How long you spend on each module</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Performance:</strong> Quiz scores and module completion</span>
          </li>
        </ul>
      </div>

      <!-- What We Don't Track Card -->
      <div class="info-card">
        <h2 class="info-title">What We Don't Track</h2>
        <p class="info-description">
          We are committed to your privacy. We never collect:
        </p>
        <ul class="info-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span><strong>Personal information:</strong> No names, emails, or identifying data</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span><strong>Cross-site tracking:</strong> We don't track you across other websites</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span><strong>Cookies:</strong> No tracking cookies are used</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span><strong>IP addresses:</strong> Your IP is not stored or logged</span>
          </li>
        </ul>
      </div>

      <!-- Privacy-Focused Analytics Card -->
      <div class="info-card">
        <h2 class="info-title">Privacy-Focused Analytics</h2>
        <p class="info-description">
          We use <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" class="external-link">Plausible Analytics</a>, 
          a privacy-focused analytics service that:
        </p>
        <ul class="info-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Is fully compliant with GDPR, CCPA, and PECR</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Doesn't use cookies or persistent identifiers</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Doesn't collect or store personal data</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Is open source and transparent</span>
          </li>
        </ul>
      </div>

      <!-- Data Management Card -->
      <div class="info-card">
        <h2 class="info-title">Your Data Rights</h2>
        <p class="info-description">
          You have full control over your data:
        </p>
        <div class="data-actions">
          <Button
            variant="secondary"
            @click="handleClearData"
            :disabled="!analyticsEnabled"
          >
            Clear Analytics Data
          </Button>
          <p class="action-description">
            Remove all locally stored analytics events from your browser.
          </p>
        </div>
      </div>

      <!-- Back Link -->
      <div class="back-link">
        <NuxtLink to="/" class="link">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAnalyticsStore } from '~/stores/analytics';
import Toggle from '~/components/shared/Toggle.vue';
import Button from '~/components/shared/Button.vue';

/**
 * Privacy Settings Page
 * 
 * Allows users to control analytics preferences and understand
 * what data is collected.
 * 
 * Requirements: 11.6, 11.7
 */

// SEO
useSEO({
  title: 'Privacy & Analytics Settings - ML Simplified',
  description: 'Control your privacy and analytics settings. Learn what data we collect and how we use it to improve your learning experience. GDPR compliant, privacy-focused analytics.',
  keywords: 'privacy policy, analytics settings, GDPR, data privacy, cookie consent, ML Simplified privacy',
  url: '/privacy',
  type: 'website',
})

const analyticsStore = useAnalyticsStore();

const analyticsEnabled = computed(() => analyticsStore.optedIn);

/**
 * Handle analytics toggle
 */
const handleToggleAnalytics = (enabled: boolean) => {
  analyticsStore.setOptIn(enabled);
  
  // Show feedback
  if (enabled) {
    alert('Analytics enabled. Thank you for helping us improve!');
  } else {
    alert('Analytics disabled. No data will be collected.');
  }
};

/**
 * Handle clear data
 */
const handleClearData = () => {
  if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
    analyticsStore.clearData();
    alert('Analytics data cleared successfully.');
  }
};
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

/* Settings Card */
.settings-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #dbeafe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.card-content {
  padding: 1.5rem;
}

/* Setting Item */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.setting-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Status Messages */
.status-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-message.success {
  background: #d1fae5;
  color: #065f46;
}

.status-message.info {
  background: #dbeafe;
  color: #1e40af;
}

.status-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Info Card */
.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.info-description {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-list li:last-child {
  border-bottom: none;
}

.list-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: #10b981;
}

.info-list li:has(.list-icon[stroke="currentColor"]) .list-icon {
  color: #ef4444;
}

.external-link {
  color: #3b82f6;
  text-decoration: underline;
  font-weight: 500;
}

.external-link:hover {
  color: #2563eb;
}

/* Data Actions */
.data-actions {
  margin-top: 1rem;
}

.action-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

/* Back Link */
.back-link {
  text-align: center;
  margin-top: 2rem;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .privacy-page {
    padding: 1rem 0.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
