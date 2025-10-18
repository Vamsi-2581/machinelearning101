/**
 * Composable for lazy loading module content
 * 
 * This composable provides dynamic imports for module content files,
 * enabling code splitting and reducing initial bundle size.
 * 
 * Requirements: 14.4, 14.8
 */

import { ref } from 'vue';

interface ModuleContent {
  content: string;
  config: any;
  quiz: any;
}

/**
 * Lazy load module content
 */
export function useLazyContent() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Load content for a specific module
   */
  const loadModuleContent = async (
    domain: string,
    moduleId: string
  ): Promise<ModuleContent | null> => {
    loading.value = true;
    error.value = null;

    try {
      // Dynamically import content files
      const [contentModule, configModule, quizModule] = await Promise.all([
        import(`~/content/modules/${domain}/${moduleId}/content.md?raw`).catch(() => ({ default: '' })),
        import(`~/content/modules/${domain}/${moduleId}/config.json`).catch(() => ({ default: {} })),
        import(`~/content/modules/${domain}/${moduleId}/quiz.json`).catch(() => ({ default: { questions: [] } })),
      ]);

      return {
        content: contentModule.default,
        config: configModule.default,
        quiz: quizModule.default,
      };
    } catch (err) {
      console.error(`Failed to load content for ${domain}/${moduleId}:`, err);
      error.value = err instanceof Error ? err.message : 'Failed to load content';
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load only the content markdown
   */
  const loadContent = async (domain: string, moduleId: string): Promise<string | null> => {
    try {
      const module = await import(`~/content/modules/${domain}/${moduleId}/content.md?raw`);
      return module.default;
    } catch (err) {
      console.error(`Failed to load content for ${domain}/${moduleId}:`, err);
      return null;
    }
  };

  /**
   * Load only the config
   */
  const loadConfig = async (domain: string, moduleId: string): Promise<any | null> => {
    try {
      const module = await import(`~/content/modules/${domain}/${moduleId}/config.json`);
      return module.default;
    } catch (err) {
      console.error(`Failed to load config for ${domain}/${moduleId}:`, err);
      return null;
    }
  };

  /**
   * Load only the quiz
   */
  const loadQuiz = async (domain: string, moduleId: string): Promise<any | null> => {
    try {
      const module = await import(`~/content/modules/${domain}/${moduleId}/quiz.json`);
      return module.default;
    } catch (err) {
      console.error(`Failed to load quiz for ${domain}/${moduleId}:`, err);
      return null;
    }
  };

  return {
    loading,
    error,
    loadModuleContent,
    loadContent,
    loadConfig,
    loadQuiz,
  };
}
