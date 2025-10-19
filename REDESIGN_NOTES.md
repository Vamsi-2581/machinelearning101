# Module Layout Redesign

## ✅ Build Status: SUCCESS

The redesign has been successfully implemented and the production build completes without errors.

## Changes Made

### 1. Tab-Based Navigation (Instead of Scrolling)
- **Before**: Clicking tabs scrolled to different sections on a long page
- **After**: Clicking tabs switches between content panels, keeping the page compact
- Each tab (Content, Interactive, Quiz) now displays its own isolated panel
- Smooth fade-in animation when switching tabs

### 2. Sticky Header
- **Before**: Header scrolled away when navigating down the page
- **After**: Header sticks to the top of the viewport
- Module title, description, difficulty, and time remain visible while scrolling
- Header compresses slightly when sticky (smaller title, hidden description) for better space usage
- Tab navigation is part of the sticky header for easy switching

### 3. Table of Contents (TOC) for Content Tab
- **Before**: No navigation within content sections
- **After**: Sidebar TOC appears when viewing the Content tab
- Automatically generated from Nuxt Content's `doc.body.toc` data
- Click TOC links to jump to specific sections
- Active section is highlighted as you scroll
- TOC is sticky and scrollable for long content
- Hidden on tablets/mobile for better responsive design

## Implementation Details

### New Composable: `useTableOfContents`
Created `composables/useTableOfContents.ts` to extract TOC data from Nuxt Content documents:

```typescript
const tableOfContents = useTableOfContents(content);
```

### Updated Components

#### `components/modules/ModuleLayout.vue`
- Added `tableOfContents` prop to accept TOC data
- Changed from scroll-based navigation to tab-based content switching
- Made header sticky with dynamic styling
- Added TOC sidebar that appears only on Content tab
- Improved responsive design for mobile/tablet

#### Module Pages Updated
- `pages/modules/classification/logistic-regression.vue`
- `pages/modules/advanced/neural-network.vue`
- `pages/modules/preprocessing/missing-value-imputation.vue`

### Usage in Module Pages

```vue
<script setup>
import { useTableOfContents } from '~/composables/useTableOfContents';

const { data: content } = await useAsyncData(() => 
  queryCollection('content').path('/modules/[domain]/[module]/content').first()
);

const tableOfContents = useTableOfContents(content);
</script>

<template>
  <ModuleLayout
    title="Module Title"
    description="Module description"
    :table-of-contents="tableOfContents"
  >
    <template #content>
      <ContentRenderer v-if="content" :value="content" class="prose prose-slate max-w-none" />
    </template>
    <!-- other templates -->
  </ModuleLayout>
</template>
```

## Benefits

1. **Better UX**: Users can quickly switch between sections without scrolling
2. **Improved Navigation**: TOC makes it easy to jump to specific content sections
3. **Persistent Context**: Sticky header keeps module info visible at all times
4. **Cleaner Layout**: Each tab has its own space, reducing page length
5. **Accessibility**: Keyboard shortcuts (1, 2, 3) still work for tab switching

## Keyboard Shortcuts

- `1` - Switch to Content tab
- `2` - Switch to Interactive tab
- `3` - Switch to Quiz tab
- `n` - Next module
- `p` - Previous module

## Responsive Design

- **Desktop (>1024px)**: Full layout with TOC sidebar
- **Tablet (768-1024px)**: No TOC sidebar, full-width content
- **Mobile (<768px)**: Compact header, stacked layout, smaller tabs

## Next Steps

To apply these changes to other module pages:

1. Import the `useTableOfContents` composable
2. Extract TOC from content: `const tableOfContents = useTableOfContents(content);`
3. Pass TOC to ModuleLayout: `:table-of-contents="tableOfContents"`

That's it! The ModuleLayout component handles the rest.
