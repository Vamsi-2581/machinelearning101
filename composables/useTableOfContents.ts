import { computed, type ComputedRef } from 'vue';

export interface TocLink {
  id: string;
  text: string;
  depth: number;
}

/**
 * Extract table of contents from Nuxt Content document
 * @param content - The content document from queryCollection
 * @returns Array of TOC links
 */
export function useTableOfContents(content: ComputedRef<any> | any): ComputedRef<TocLink[]> {
  return computed(() => {
    const doc = typeof content === 'object' && 'value' in content ? content.value : content;
    
    if (doc?.body?.toc?.links) {
      return doc.body.toc.links.map((link: any) => ({
        id: link.id,
        text: link.text,
        depth: link.depth
      }));
    }
    
    return [];
  });
}
