<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop with blur -->
    <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Dialog -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon name="mdi:lock-outline" class="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-3">
        Sign in to Continue
      </h2>

      <!-- Description -->
      <p class="text-gray-600 text-center mb-8">
        Sign in with Google to save your learning progress, quiz scores, and bookmarks across devices.
      </p>

      <!-- Sign in button -->
      <button @click="handleSignIn" :disabled="isLoading"
        class="w-full flex items-center justify-center space-x-3 px-6 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4" />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853" />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05" />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335" />
        </svg>
        <span class="font-medium">{{ isLoading ? 'Signing in...' : 'Sign in with Google' }}</span>
      </button>

      <!-- Benefits list -->
      <div class="mt-8 space-y-3">
        <div class="flex items-start space-x-3 text-sm text-gray-600">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Track your progress across all modules</span>
        </div>
        <div class="flex items-start space-x-3 text-sm text-gray-600">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Save quiz scores and bookmarks</span>
        </div>
        <div class="flex items-start space-x-3 text-sm text-gray-600">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Sync learning data across devices</span>
        </div>
      </div>

      <!-- Close button -->
      <button @click="$emit('close')"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Close dialog">
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

defineProps<{
  show: boolean;
}>();

defineEmits<{
  close: [];
}>();

const { signInWithGoogle, isLoading } = useAuth();

const handleSignIn = () => {
  signInWithGoogle();
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
