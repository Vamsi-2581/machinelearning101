/**
 * Composable for managing module metadata and navigation
 */

import type { ModuleConfig, ModuleMetadata, DomainInfo, Domain, ModuleNavItem } from '~/types/module';
import { useProgressStore } from '~/stores/progress';

/**
 * Domain definitions with metadata
 */
export const DOMAINS: Record<Domain, Omit<DomainInfo, 'modules'>> = {
  regression: {
    id: 'regression',
    name: 'Regression',
    description: 'Learn how to predict continuous values using regression algorithms',
    icon: 'healthicons:chart-line',
    color: 'blue',
  },
  classification: {
    id: 'classification',
    name: 'Classification',
    description: 'Discover how to categorize data into distinct classes',
    icon: 'healthicons:ui-menu-grid',
    color: 'green',
  },
  clustering: {
    id: 'clustering',
    name: 'Clustering',
    description: 'Explore unsupervised learning to find patterns in data',
    icon: 'gravity-ui:circles-5-random',
    color: 'purple',
  },
  preprocessing: {
    id: 'preprocessing',
    name: 'Preprocessing',
    description: 'Master data preparation techniques for better model performance',
    icon: 'material-symbols:filter-alt',
    color: 'orange',
  },
  optimization: {
    id: 'optimization',
    name: 'Optimization',
    description: 'Understand how algorithms learn through optimization techniques',
    icon: 'ion:md-trending-up',
    color: 'red',
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced Topics',
    description: 'Dive into advanced machine learning concepts and techniques',
    icon: 'material-symbols:rocket-launch-rounded',
    color: 'gray',
  },
};

/**
 * Module registry - maps module IDs to their configurations
 * This is a static registry that should match the content structure
 */
const MODULE_REGISTRY: Record<string, { domain: Domain; path: string }> = {
  'linear-regression': { domain: 'regression', path: '/modules/regression/linear-regression' },
  'logistic-regression': { domain: 'classification', path: '/modules/classification/logistic-regression' },
  'k-means': { domain: 'clustering', path: '/modules/clustering/k-means' },
  'feature-scaling': { domain: 'preprocessing', path: '/modules/preprocessing/feature-scaling' },
  'missing-value-imputation': { domain: 'preprocessing', path: '/modules/preprocessing/missing-value-imputation' },
  'gradient-descent': { domain: 'optimization', path: '/modules/optimization/gradient-descent' },
  'pca': { domain: 'advanced', path: '/modules/advanced/pca' },
  'tsne': { domain: 'advanced', path: '/modules/advanced/tsne' },
  'neural-network': { domain: 'advanced', path: '/modules/advanced/neural-network' },
};

export function useModules() {
  const progressStore = useProgressStore();

  /**
   * Load module configuration from content directory
   */
  const loadModuleConfig = async (moduleId: string): Promise<ModuleConfig | null> => {
    try {
      const registryEntry = MODULE_REGISTRY[moduleId];
      if (!registryEntry) {
        console.warn(`Module ${moduleId} not found in registry`);
        return null;
      }

      // In a real implementation, this would fetch from the content directory
      // For now, we'll construct the path and use dynamic import
      const configPath = `/content/modules/${registryEntry.domain}/${moduleId}/config.json`;
      
      // Use fetch to load the config
      const response = await fetch(configPath);
      if (!response.ok) {
        console.warn(`Failed to load config for ${moduleId}`);
        return null;
      }
      
      const config: ModuleConfig = await response.json();
      return config;
    } catch (error) {
      console.error(`Error loading module config for ${moduleId}:`, error);
      return null;
    }
  };

  /**
   * Get all modules for a specific domain
   */
  const getModulesByDomain = async (domain: Domain): Promise<ModuleMetadata[]> => {
    const moduleIds = Object.entries(MODULE_REGISTRY)
      .filter(([_, entry]) => entry.domain === domain)
      .map(([id]) => id);

    const modules: ModuleMetadata[] = [];
    
    for (const moduleId of moduleIds) {
      const config = await loadModuleConfig(moduleId);
      if (config) {
        const registryEntry = MODULE_REGISTRY[moduleId];
        modules.push({
          ...config,
          path: registryEntry.path,
          completed: progressStore.isModuleCompleted(moduleId),
          quizScore: progressStore.getQuizScore(moduleId),
        });
      }
    }

    return modules;
  };

  /**
   * Get domain information with all its modules
   */
  const getDomainInfo = async (domain: Domain): Promise<DomainInfo> => {
    const domainMeta = DOMAINS[domain];
    const modules = await getModulesByDomain(domain);

    return {
      ...domainMeta,
      modules,
    };
  };

  /**
   * Get all domains with their modules
   */
  const getAllDomains = async (): Promise<DomainInfo[]> => {
    const domains: DomainInfo[] = [];
    
    for (const domain of Object.keys(DOMAINS) as Domain[]) {
      const domainInfo = await getDomainInfo(domain);
      domains.push(domainInfo);
    }

    return domains;
  };

  /**
   * Get module metadata by ID
   */
  const getModuleMetadata = async (moduleId: string): Promise<ModuleMetadata | null> => {
    const config = await loadModuleConfig(moduleId);
    if (!config) return null;

    const registryEntry = MODULE_REGISTRY[moduleId];
    if (!registryEntry) return null;

    return {
      ...config,
      path: registryEntry.path,
      completed: progressStore.isModuleCompleted(moduleId),
      quizScore: progressStore.getQuizScore(moduleId),
    };
  };

  /**
   * Get navigation items for all modules
   */
  const getAllModuleNavItems = async (): Promise<ModuleNavItem[]> => {
    const items: ModuleNavItem[] = [];

    for (const [moduleId, registryEntry] of Object.entries(MODULE_REGISTRY)) {
      const config = await loadModuleConfig(moduleId);
      if (config) {
        items.push({
          id: moduleId,
          name: config.name,
          path: registryEntry.path,
          domain: registryEntry.domain,
          difficulty: config.difficulty,
          completed: progressStore.isModuleCompleted(moduleId),
        });
      }
    }

    return items;
  };

  /**
   * Get next suggested module based on current module
   */
  const getNextModule = async (currentModuleId: string): Promise<ModuleNavItem | null> => {
    const allModules = await getAllModuleNavItems();
    const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
    
    if (currentIndex === -1 || currentIndex === allModules.length - 1) {
      return null;
    }

    return allModules[currentIndex + 1];
  };

  /**
   * Get previous module based on current module
   */
  const getPreviousModule = async (currentModuleId: string): Promise<ModuleNavItem | null> => {
    const allModules = await getAllModuleNavItems();
    const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
    
    if (currentIndex <= 0) {
      return null;
    }

    return allModules[currentIndex - 1];
  };

  /**
   * Get completion stats for a domain
   */
  const getDomainCompletionStats = async (domain: Domain): Promise<{ completed: number; total: number; percentage: number }> => {
    const modules = await getModulesByDomain(domain);
    const completed = modules.filter(m => m.completed).length;
    const total = modules.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  return {
    DOMAINS,
    MODULE_REGISTRY,
    loadModuleConfig,
    getModulesByDomain,
    getDomainInfo,
    getAllDomains,
    getModuleMetadata,
    getAllModuleNavItems,
    getNextModule,
    getPreviousModule,
    getDomainCompletionStats,
  };
}
