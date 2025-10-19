# Nuxt Content Migration Guide

This guide explains how to migrate module pages from inline markdown strings to Nuxt Content.

## What Changed

Previously, module content was stored as inline strings in the Vue component:

```typescript
const contentMarkdown = `
# Module Title
Content here...
`;
```

Now, content is stored in markdown files in the `content/modules/` directory and loaded using Nuxt Content.

## Benefits

- **Better organization**: Content is separated from code
- **Easier editing**: Edit markdown files directly without touching Vue components
- **Better performance**: Content is optimized and cached by Nuxt Content
- **Rich features**: Support for MDC (Markdown Components), syntax highlighting, and more
- **Type safety**: Content is validated and typed

## Migration Steps

### 1. Install Dependencies (Already Done)

```bash
npm install @nuxt/content
npm install -D @tailwindcss/typography
```

### 2. Update nuxt.config.ts (Already Done)

Add `@nuxt/content` to modules array.

### 3. Update tailwind.config.ts (Already Done)

Add typography plugin for prose styling.

### 4. Create Content Files

Content files should already exist in `content/modules/[domain]/[module]/content.md`.

If not, create them following this structure:

```
content/
└── modules/
    └── [domain]/          # e.g., classification, regression
        └── [module]/      # e.g., logistic-regression
            ├── config.json
            ├── content.md  # Main content file
            └── quiz.json
```

### 5. Update Vue Component

#### Before:

```vue
<script setup lang="ts">
// ... other imports

// Content
const contentMarkdown = `
# Module Title
Content here...
`;

const howItWorksMarkdown = `
## How It Works
More content...
`;
</script>

<template>
  <ModuleLayout>
    <template #content>
      <ContentSection
        title="Introduction"
        :markdown-content="contentMarkdown"
      />
      
      <ContentSection
        title="How It Works"
        collapsible
        :markdown-content="howItWorksMarkdown"
      />
    </template>
  </ModuleLayout>
</template>
```

#### After:

```vue
<script setup lang="ts">
// ... other imports

// Load module content from Nuxt Content
const { content } = await useModuleContent('classification', 'logistic-regression');
</script>

<template>
  <ModuleLayout>
    <template #content>
      <ContentRenderer 
        v-if="content" 
        :value="content" 
        class="prose prose-slate max-w-none" 
      />
    </template>
  </ModuleLayout>
</template>
```

### 6. Key Changes

1. **Remove inline markdown strings**: Delete `contentMarkdown`, `howItWorksMarkdown`, etc.

2. **Add content loading**: Use the `useModuleContent` composable at the top of your script:
   ```typescript
   const { content } = await useModuleContent('domain', 'module-id');
   ```

3. **Update template**: Replace multiple `ContentSection` components with a single `ContentRenderer`:
   ```vue
   <ContentRenderer 
     v-if="content" 
     :value="content" 
     class="prose prose-slate max-w-none" 
   />
   ```

4. **Prose styling**: The `prose` classes from Tailwind Typography provide beautiful default styling for markdown content.

## Example: Logistic Regression

See `pages/modules/classification/logistic-regression.vue` for a complete example of a migrated module.

## Content File Structure

Your `content.md` file should contain all the learning content in markdown format:

```markdown
# Module Title

## Introduction

Introduction text...

## What You'll Learn

- Learning objective 1
- Learning objective 2

## How It Works

Detailed explanation...

### Subsection

More details...

## Key Concepts

Concept explanations...

## Summary

Summary text...
```

## Styling

The `prose` classes provide automatic styling for:

- Headings (h1-h6)
- Paragraphs
- Lists (ordered and unordered)
- Code blocks
- Blockquotes
- Tables
- Links
- And more

You can customize the prose styling in your Tailwind config if needed.

## Modules to Migrate

The following modules still need migration:

- [ ] `/pages/modules/regression/linear-regression.vue`
- [ ] `/pages/modules/clustering/k-means.vue`
- [ ] `/pages/modules/preprocessing/feature-scaling.vue`
- [ ] `/pages/modules/preprocessing/missing-value-imputation.vue`
- [ ] `/pages/modules/optimization/gradient-descent.vue`
- [ ] `/pages/modules/advanced/neural-network.vue`
- [ ] `/pages/modules/advanced/pca.vue`
- [ ] `/pages/modules/advanced/tsne.vue`

## Testing

After migration:

1. Run `npm run build` to ensure no errors
2. Check that content displays correctly
3. Verify that all markdown formatting works
4. Test on different screen sizes

## Troubleshooting

### Content not loading

- Check that the content file path matches the composable call
- Ensure the content file exists in `content/modules/[domain]/[module]/content.md`
- Verify the file has valid markdown

### Styling issues

- Make sure `@tailwindcss/typography` is installed
- Check that the `prose` classes are applied to `ContentRenderer`
- Verify Tailwind config includes the typography plugin

### Build errors

- Run `npm run build` to see detailed error messages
- Check for TypeScript errors with `npm run type-check`
- Ensure all imports are correct
