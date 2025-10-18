<template>
  <nav aria-label="Module navigation" class="module-navigation">
    <div class="nav-container">
      <!-- Previous Module -->
      <div class="nav-item prev">
        <NuxtLink
          v-if="previousModule"
          :to="previousModule.path"
          class="nav-link"
        >
          <div class="nav-icon">
            <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          </div>
          <div class="nav-content">
            <span class="nav-label">Previous</span>
            <span class="nav-title">{{ previousModule.name }}</span>
            <span v-if="previousModule.completed" class="completion-badge">
              <Icon name="heroicons:check-circle" class="w-4 h-4" />
              Completed
            </span>
          </div>
        </NuxtLink>
        <div v-else class="nav-link disabled">
          <div class="nav-icon">
            <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          </div>
          <div class="nav-content">
            <span class="nav-label">Previous</span>
            <span class="nav-title text-gray-400">No previous module</span>
          </div>
        </div>
      </div>

      <!-- Next Module -->
      <div class="nav-item next">
        <NuxtLink
          v-if="nextModule"
          :to="nextModule.path"
          class="nav-link"
        >
          <div class="nav-content">
            <span class="nav-label">Next</span>
            <span class="nav-title">{{ nextModule.name }}</span>
            <span v-if="nextModule.completed" class="completion-badge">
              <Icon name="heroicons:check-circle" class="w-4 h-4" />
              Completed
            </span>
          </div>
          <div class="nav-icon">
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </div>
        </NuxtLink>
        <div v-else class="nav-link disabled">
          <div class="nav-content">
            <span class="nav-label">Next</span>
            <span class="nav-title text-gray-400">No next module</span>
          </div>
          <div class="nav-icon">
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Suggested Next Module (if different from next) -->
    <div v-if="suggestedModule && suggestedModule.id !== nextModule?.id" class="suggested-module">
      <div class="suggested-header">
        <Icon name="heroicons:light-bulb" class="w-5 h-5 text-yellow-500" />
        <span class="suggested-label">Suggested Next</span>
      </div>
      <NuxtLink :to="suggestedModule.path" class="suggested-link">
        <div class="suggested-content">
          <span class="suggested-title">{{ suggestedModule.name }}</span>
          <span class="suggested-domain">{{ suggestedModule.domain }}</span>
        </div>
        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-600" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { ModuleNavItem } from '~/types/module';

interface Props {
  previousModule?: ModuleNavItem | null;
  nextModule?: ModuleNavItem | null;
  suggestedModule?: ModuleNavItem | null;
}

defineProps<Props>();
</script>

<style scoped>
.module-navigation {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.nav-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-item {
  display: flex;
}

.nav-item.prev {
  justify-content: flex-start;
}

.nav-item.next {
  justify-content: flex-end;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s;
  max-width: 100%;
  min-width: 0;
}

.nav-link:not(.disabled):hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.nav-link.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.nav-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #6b7280;
}

.nav-link:not(.disabled):hover .nav-icon {
  background: #3b82f6;
  color: white;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.nav-item.next .nav-content {
  align-items: flex-end;
  text-align: right;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-link:not(.disabled):hover .nav-title {
  color: #3b82f6;
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
}

/* Suggested Module */
.suggested-module {
  padding: 1.5rem;
  background: linear-gradient(to right, #fef3c7, #fde68a);
  border: 2px solid #fbbf24;
  border-radius: 0.75rem;
}

.suggested-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.suggested-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
}

.suggested-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s;
}

.suggested-link:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.suggested-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.suggested-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.suggested-domain {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .nav-item.next {
    justify-content: flex-start;
  }

  .nav-item.next .nav-content {
    align-items: flex-start;
    text-align: left;
  }

  .nav-link {
    padding: 1rem;
  }

  .nav-title {
    font-size: 0.875rem;
  }

  .suggested-module {
    padding: 1rem;
  }
}
</style>
