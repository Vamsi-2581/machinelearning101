<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary-content">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <Button @click="retry" variant="primary">
          Try Again
        </Button>
        <Button @click="reset" variant="secondary">
          Reset Module
        </Button>
      </div>
      <details v-if="isDevelopment && errorDetails" class="error-details">
        <summary>Error Details (Development Only)</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { useErrorHandler } from '~/utils/error-handler';
import Button from './Button.vue';

const hasError = ref(false);
const errorMessage = ref('');
const errorDetails = ref('');
const isDevelopment = process.env.NODE_ENV === 'development';

const { handleError } = useErrorHandler();

const emit = defineEmits<{
  error: [error: Error];
  retry: [];
  reset: [];
}>();

onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message || 'An unexpected error occurred';
  
  if (isDevelopment) {
    errorDetails.value = error.stack || error.toString();
  }

  // Handle the error through the global error handler
  handleError(error);

  // Emit error event
  emit('error', error);

  // Prevent error from propagating
  return false;
});

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
  errorDetails.value = '';
  emit('retry');
};

const reset = () => {
  hasError.value = false;
  errorMessage.value = '';
  errorDetails.value = '';
  emit('reset');
};
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.error-boundary-content {
  max-width: 500px;
  text-align: center;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: #fee2e2;
  border-radius: 50%;
  color: #ef4444;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.error-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-details pre {
  font-size: 0.75rem;
  color: #6b7280;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .error-boundary {
    min-height: 300px;
    padding: 1rem;
  }

  .error-icon {
    width: 60px;
    height: 60px;
  }

  .error-title {
    font-size: 1.25rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions button {
    width: 100%;
  }
}
</style>
