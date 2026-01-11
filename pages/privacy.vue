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
        <h2 class="info-title">Analytics Platform</h2>
        <p class="info-description">
          We use <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" class="external-link">Google Analytics</a> 
          to understand how users interact with our platform and improve the learning experience.
        </p>
        <ul class="info-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Helps us understand user behavior and improve features</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Collects anonymous usage data and statistics</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>You can opt out at any time using the toggle above</span>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Learn more about <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="external-link">Google's privacy policy</a></span>
          </li>
        </ul>
      </div>

      <!-- Google User Data Disclosure Section -->
      <div class="info-card google-data-card">
        <div class="google-header">
          <svg class="google-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <h2 class="info-title">Google User Data</h2>
        </div>
        <p class="info-description">
          This application uses Google Sign-In for authentication. Below is a disclosure of how we access, use, and store your Google user data in compliance with the 
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" class="external-link">Google API Services User Data Policy</a>.
        </p>
      </div>

      <!-- Data Accessed Card -->
      <div class="info-card data-disclosure-card">
        <h2 class="info-title">
          <span class="section-icon">📋</span>
          Data Accessed
        </h2>
        <p class="info-description">
          When you sign in with Google, we request access to the following information from your Google account:
        </p>
        <ul class="info-list detailed-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Email Address</strong>
              <span class="data-detail">Your primary Google account email address</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Display Name</strong>
              <span class="data-detail">Your full name as displayed on your Google profile</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Profile Picture</strong>
              <span class="data-detail">The URL to your Google profile photo (optional)</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Google User ID</strong>
              <span class="data-detail">A unique identifier from Google used to link your account</span>
            </div>
          </li>
        </ul>
        <div class="scope-info">
          <strong>OAuth Scopes Requested:</strong>
          <code>openid</code>, <code>email</code>, <code>profile</code>
        </div>
      </div>

      <!-- Data Usage Card -->
      <div class="info-card data-disclosure-card">
        <h2 class="info-title">
          <span class="section-icon">⚙️</span>
          Data Usage
        </h2>
        <p class="info-description">
          We use your Google user data exclusively for the following purposes:
        </p>
        <ul class="info-list detailed-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Account Creation & Authentication</strong>
              <span class="data-detail">Your email and Google ID are used to create and identify your account, enabling secure sign-in without passwords.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Personalized Learning Experience</strong>
              <span class="data-detail">Your name is displayed in the application interface to provide a personalized experience.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Profile Display</strong>
              <span class="data-detail">Your profile picture is optionally displayed in the navigation bar and account settings.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Progress Synchronization</strong>
              <span class="data-detail">Your account is linked to your learning progress, quiz scores, and saved bookmarks to sync across devices.</span>
            </div>
          </li>
        </ul>
        <div class="important-notice">
          <svg class="notice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>We do NOT:</strong>
            <ul>
              <li>Share your Google data with third parties</li>
              <li>Use your data for advertising purposes</li>
              <li>Access your Google Drive, Gmail, or other Google services</li>
              <li>Sell or monetize your personal information</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Data Storage Card -->
      <div class="info-card data-disclosure-card">
        <h2 class="info-title">
          <span class="section-icon">🔒</span>
          Data Storage & Security
        </h2>
        <p class="info-description">
          Your data is stored securely with the following measures:
        </p>
        <ul class="info-list detailed-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Secure Database Storage</strong>
              <span class="data-detail">Your account data is stored in a secure database with encryption at rest.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Data Stored</strong>
              <span class="data-detail">Email address, display name, profile picture URL, Google user ID, and account timestamps.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Access Tokens</strong>
              <span class="data-detail">Google access tokens are used only during authentication and are not stored permanently.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Data Retention</strong>
              <span class="data-detail">Your data is retained for as long as your account is active. You may request deletion at any time.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>HTTPS Encryption</strong>
              <span class="data-detail">All data transmission is encrypted using HTTPS/TLS protocols.</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Data Deletion Card -->
      <div class="info-card data-disclosure-card">
        <h2 class="info-title">
          <span class="section-icon">🗑️</span>
          Data Deletion
        </h2>
        <p class="info-description">
          You have the right to request deletion of your data:
        </p>
        <ul class="info-list detailed-list">
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Account Deletion</strong>
              <span class="data-detail">Contact us to request complete deletion of your account and all associated data.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Google Account Revocation</strong>
              <span class="data-detail">You can revoke access from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" class="external-link">Google Account Settings</a>.</span>
            </div>
          </li>
          <li>
            <svg class="list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="list-content">
              <strong>Cascade Deletion</strong>
              <span class="data-detail">When your account is deleted, all associated progress, quiz scores, and bookmarks are automatically removed.</span>
            </div>
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
  title: 'Privacy Policy & Data Usage - Machine Learning 101',
  description: 'Comprehensive privacy policy including Google user data disclosure. Learn how we access, use, and store your data. Control analytics settings and understand our data practices.',
  keywords: 'privacy policy, Google user data, OAuth data usage, data storage, analytics settings, GDPR, data privacy, cookie consent, Machine Learning 101 privacy, Google API compliance',
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

/* Google User Data Disclosure Styles */
.google-data-card {
  border: 2px solid #4285F4;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
}

.google-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.google-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.google-header .info-title {
  margin: 0;
}

/* Data Disclosure Cards */
.data-disclosure-card {
  border-left: 4px solid #3b82f6;
}

.data-disclosure-card .info-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.25rem;
}

/* Detailed List Styles */
.detailed-list li {
  padding: 1rem 0;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.list-content strong {
  color: #111827;
  font-size: 0.9375rem;
}

.data-detail {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

/* OAuth Scope Info */
.scope-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
}

.scope-info code {
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  color: #1f2937;
  margin: 0 0.125rem;
}

/* Important Notice */
.important-notice {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  display: flex;
  gap: 0.75rem;
}

.notice-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #d97706;
}

.important-notice strong {
  color: #92400e;
  display: block;
  margin-bottom: 0.5rem;
}

.important-notice ul {
  margin: 0;
  padding-left: 1.25rem;
}

.important-notice li {
  font-size: 0.875rem;
  color: #78350f;
  padding: 0.25rem 0;
  border-bottom: none;
}

.important-notice li::marker {
  color: #d97706;
}

/* Responsive adjustments for Google data sections */
@media (max-width: 768px) {
  .google-header {
    flex-direction: row;
  }
  
  .google-icon {
    width: 24px;
    height: 24px;
  }
  
  .section-icon {
    font-size: 1rem;
  }
  
  .important-notice {
    flex-direction: column;
  }
}
</style>
