# Quick Migration Reference

## TL;DR - How to Migrate a Module to Nuxt Content

### Step 1: Update Script Section

**Remove this:**
```typescript
const contentMarkdown = `
# Your content here...
`;

const howItWorksMarkdown = `
## More content...
`;
```

**Add this:**
```typescript
// Load module content from Nuxt Content
const { content } = await useModuleContent('domain-name', 'module-id');
```

Replace `'domain-name'` with: `classification`, `regression`, `clustering`, `preprocessing`, `optimization`, or `advanced`

Replace `'module-id'` with the module's ID (e.g., `'logistic-regression'`, `'linear-regression'`)

### Step 2: Update Template Section

**Remove this:**
```vue
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
```

**Replace with this:**
```vue
<template #content>
  <ContentRenderer 
    v-if="content" 
    :value="content" 
    class="prose prose-slate max-w-none" 
  />
</template>
```

### Step 3: Verify Content File Exists

Make sure this file exists:
```
content/modules/[domain]/[module-id]/content.md
```

### Step 4: Test

```bash
npm run build
```

## Example: Logistic Regression

**File:** `pages/modules/classification/logistic-regression.vue`

**Script:**
```typescript
const { content } = await useModuleContent('classification', 'logistic-regression');
```

**Template:**
```vue
<template #content>
  <ContentRenderer v-if="content" :value="content" class="prose prose-slate max-w-none" />
</template>
```

**Content File:**
```
content/modules/classification/logistic-regression/content.md
```

## That's It!

The content from your markdown file will now be automatically loaded and beautifully styled.
