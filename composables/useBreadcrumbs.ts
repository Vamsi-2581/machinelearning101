/**
 * Composable for generating breadcrumb navigation
 */

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { BreadcrumbItem } from '~/components/shared/Breadcrumb.vue';
import { useModules } from '~/composables/useModules';

export function useBreadcrumbs() {
  const route = useRoute();
  const { DOMAINS, MODULE_REGISTRY } = useModules();

  /**
   * Generate breadcrumbs based on current route
   */
  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', path: '/', current: false }
    ];

    const path = route.path;

    // Handle modules routes
    if (path.startsWith('/modules')) {
      items.push({ label: 'Modules', path: '/modules', current: false });

      // Extract domain and module from path
      const pathParts = path.split('/').filter(Boolean);
      
      if (pathParts.length >= 2) {
        const domain = pathParts[1] as keyof typeof DOMAINS;
        
        if (DOMAINS[domain]) {
          const domainInfo = DOMAINS[domain];
          const isDomainPage = pathParts.length === 2;
          
          items.push({
            label: domainInfo.name,
            path: `/modules/${domain}`,
            current: isDomainPage
          });

          // If we're on a specific module page
          if (pathParts.length >= 3 && !isDomainPage) {
            const moduleId = pathParts[2];
            
            // Find module name from registry
            const registryEntry = Object.entries(MODULE_REGISTRY).find(
              ([id]) => id === moduleId
            );

            if (registryEntry) {
              const [id] = registryEntry;
              // Convert kebab-case to Title Case
              const moduleName = id
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

              items.push({
                label: moduleName,
                path: path,
                current: true
              });
            }
          }
        }
      }
    }
    // Handle about page
    else if (path === '/about') {
      items.push({ label: 'About', path: '/about/', current: true });
    }
    // Handle contact page
    else if (path === '/contact') {
      items.push({ label: 'Contact', path: '/contact/', current: true });
    }
    // Handle why-learn-here page
    else if (path === '/why-learn-here') {
      items.push({ label: 'Why Learn Here', path: '/why-learn-here/', current: true });
    }
    // Home page
    else if (path === '/') {
      items[0].current = true;
    }

    return items;
  });

  /**
   * Generate breadcrumbs for a specific module
   */
  const getModuleBreadcrumbs = (moduleId: string, moduleName: string, domain: string): BreadcrumbItem[] => {
    const domainInfo = DOMAINS[domain as keyof typeof DOMAINS];
    
    return [
      { label: 'Home', path: '/', current: false },
      { label: 'Modules', path: '/modules', current: false },
      { label: domainInfo?.name || domain, path: `/modules/${domain}`, current: false },
      { label: moduleName, path: `/modules/${domain}/${moduleId}`, current: true }
    ];
  };

  return {
    breadcrumbs,
    getModuleBreadcrumbs,
  };
}
