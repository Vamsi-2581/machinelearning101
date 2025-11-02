import { type Ref } from 'vue';
import { useModuleStore } from '~/stores/module';
import { useDataset } from '~/composables/useDataset';

/**
 * Composable for handling bookmark parameter restoration in module pages
 * 
 * Requirements: 2.2, 2.3
 * 
 * @param parameters - Ref to the module's parameters object
 * @param onRestore - Optional callback to execute after parameters are restored (e.g., re-train algorithm)
 * @returns handleLoadBookmark function to be passed to ModuleLayout
 */
export function useBookmarkRestore(
  parameters: Ref<Record<string, any>>,
  onRestore?: () => Promise<void> | void
) {
  const moduleStore = useModuleStore();
  const { loadDataset } = useDataset();

  /**
   * Handle bookmark loading
   * Restores parameters from bookmark and triggers any necessary updates
   * 
   * Requirements: 2.2, 2.3
   */
  const handleLoadBookmark = async (bookmarkParams: Record<string, any>) => {
    try {
      // Store the old dataset value to check if it changed
      const oldDataset = parameters.value.dataset;
      
      // Update parameters with bookmark values
      Object.assign(parameters.value, bookmarkParams);
      moduleStore.setParameters(parameters.value);
      
      // Reload dataset if it changed
      if (bookmarkParams.dataset && bookmarkParams.dataset !== oldDataset) {
        const dataset = await loadDataset(bookmarkParams.dataset);
        if (dataset) {
          moduleStore.loadDataset(dataset.data);
        }
      }
      
      // Execute custom restore logic (e.g., re-train algorithm, update visualizations)
      if (onRestore) {
        await onRestore();
      }
    } catch (err) {
      console.error('Error loading bookmark:', err);
      throw new Error('Failed to load bookmark configuration');
    }
  };

  return {
    handleLoadBookmark,
  };
}
