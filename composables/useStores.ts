/**
 * Store Composable
 * 
 * Convenient composable to access all stores in components
 */

export const useStores = () => {
  const moduleStore = useModuleStore();
  const progressStore = useProgressStore();
  const analyticsStore = useAnalyticsStore();
  const authStore = useAuthStore();

  return {
    moduleStore,
    progressStore,
    analyticsStore,
    authStore,
  };
};
