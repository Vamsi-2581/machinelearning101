/**
 * Composable for module navigation
 * Provides computed properties for next/previous module paths and navigation items
 */

import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useModules } from './useModules';
import type { ModuleNavItem } from '~/types/module';

export function useModuleNavigation() {
  const route = useRoute();
  const { getNextModule, getPreviousModule } = useModules();

  /**
   * Extract module ID from current route path
   * e.g., /modules/advanced/pca -> pca
   */
  const currentModuleId = computed(() => {
    const pathParts = route.path.split('/');
    return pathParts[pathParts.length - 1] || '';
  });

  /**
   * Navigation items (loaded asynchronously)
   */
  const previousModule = ref<ModuleNavItem | null>(null);
  const nextModule = ref<ModuleNavItem | null>(null);
  const suggestedModule = ref<ModuleNavItem | null>(null);

  /**
   * Get previous module path
   */
  const previousModulePath = computed<string | undefined>(() => {
    return previousModule.value?.path;
  });

  /**
   * Get next module path
   */
  const nextModulePath = computed<string | undefined>(() => {
    return nextModule.value?.path;
  });

  /**
   * Load navigation data asynchronously
   * This should be called in onMounted or setup
   */
  const loadNavigation = async () => {
    if (!currentModuleId.value) return;

    const [prev, next] = await Promise.all([
      getPreviousModule(currentModuleId.value),
      getNextModule(currentModuleId.value),
    ]);

    previousModule.value = prev;
    nextModule.value = next;
    
    // For now, suggested module is the same as next module
    // In the future, this could be based on user progress or recommendations
    suggestedModule.value = next;
  };

  return {
    currentModuleId,
    previousModule,
    nextModule,
    suggestedModule,
    previousModulePath,
    nextModulePath,
    loadNavigation,
  };
}
