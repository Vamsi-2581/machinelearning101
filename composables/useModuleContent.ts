/**
 * Composable for loading module content from Nuxt Content
 * 
 * Usage:
 * const { content } = await useModuleContent('classification', 'logistic-regression')
 */
export const useModuleContent = async (domain: string, moduleId: string) => {
  const { data: content } = await useAsyncData(
    `${domain}-${moduleId}-content`,
    () => queryContent(`modules/${domain}/${moduleId}/content`).findOne()
  );

  return {
    content
  };
};
