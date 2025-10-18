/**
 * Store Composable
 * 
 * Convenient composable to access all stores in components
 */

export const useStores = () => {
  const moduleStore = useModuleStore();
  const progressStore = useProgressStore();
  const analyticsStore = useAnalyticsStore();

  return {
    moduleStore,
    progressStore,
    analyticsStore,
  };
};
