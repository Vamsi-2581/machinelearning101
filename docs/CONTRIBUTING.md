# Contributing to ML Learning Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting remarks
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of Vue 3, TypeScript, and machine learning concepts

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/ml-learning-platform.git
cd ml-learning-platform
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ml-learning-platform.git
```

4. **Install dependencies**:
```bash
npm install
```

5. **Start development server**:
```bash
npm run dev
```

6. **Verify the setup** by visiting `http://localhost:3000`

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Fixes
- Fix broken functionality
- Correct algorithm implementations
- Resolve UI/UX issues

#### ✨ New Features
- Add new ML algorithms
- Create new learning modules
- Implement new visualizations
- Add utility functions

#### 📚 Documentation
- Improve existing documentation
- Add code examples
- Create tutorials
- Fix typos

#### 🎨 Design Improvements
- Enhance UI/UX
- Improve accessibility
- Optimize responsive design

#### ⚡ Performance Optimizations
- Reduce bundle size
- Optimize algorithms
- Improve rendering performance

#### 🧪 Tests
- Add unit tests
- Create integration tests
- Improve test coverage

### Finding Issues to Work On

- Check the [Issues](https://github.com/OWNER/REPO/issues) page
- Look for issues labeled `good first issue` for beginners
- Issues labeled `help wanted` are open for contributions
- Comment on an issue to express interest before starting work

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `perf/` - Performance improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Add comments for complex logic
- Include JSDoc comments for public APIs

### 3. Test Your Changes

```bash
# Run unit tests
npm run test

# Build the project
npm run build

# Preview the build
npm run preview
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add k-nearest neighbors algorithm"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Maintenance tasks

Examples:
```
feat(algorithms): add support vector machine implementation

Implements SVM with linear and RBF kernels.
Includes visualization of decision boundaries.

Closes #123
```

```
fix(visualization): correct scatter plot axis scaling

The scatter plot was not properly scaling when data
ranges were very different. Now uses proper domain
calculation.

Fixes #456
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` type when possible
- Use type inference where appropriate

```typescript
// Good
interface DataPoint {
  features: number[];
  label?: number;
}

function processData(data: DataPoint[]): number[] {
  return data.map(d => d.label ?? 0);
}

// Avoid
function processData(data: any): any {
  return data.map((d: any) => d.label ?? 0);
}
```

### Vue Components

- Use Composition API with `<script setup>`
- Define prop types with TypeScript interfaces
- Use meaningful component and variable names
- Keep components focused and single-purpose

```vue
<script setup lang="ts">
interface Props {
  title: string;
  data: number[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  update: [data: number[]];
}>();
</script>
```

### Naming Conventions

- **Components**: PascalCase (`ModuleLayout.vue`)
- **Composables**: camelCase with `use` prefix (`useDataset.ts`)
- **Files**: kebab-case for pages (`linear-regression.vue`)
- **Variables**: camelCase (`learningRate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITERATIONS`)
- **Types/Interfaces**: PascalCase (`AlgorithmConfig`)

### Code Organization

- Keep files under 300 lines when possible
- Extract reusable logic into composables
- Group related functionality
- Use clear folder structure

### Comments and Documentation

```typescript
/**
 * Trains a linear regression model using gradient descent
 * 
 * @param X - Feature matrix (n_samples × n_features)
 * @param y - Target values (n_samples)
 * @param options - Training options
 * @returns Trained model parameters
 * 
 * Requirements: 2.3, 4.1, 4.2
 * 
 * @example
 * ```typescript
 * const model = new LinearRegression();
 * await model.fit(X, y);
 * const predictions = model.predict(X_test);
 * ```
 */
async fit(X: number[][], y: number[], options?: TrainingOptions): Promise<void> {
  // Implementation
}
```

### Accessibility

- Use semantic HTML elements
- Include ARIA labels for custom controls
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers

```vue
<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    :aria-pressed="isActive"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    {{ label }}
  </button>
</template>
```

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Algorithm implementations
- Utility functions
- Store actions and getters
- Complex business logic

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { LinearRegression } from '../LinearRegression';

describe('LinearRegression', () => {
  let model: LinearRegression;
  
  beforeEach(() => {
    model = new LinearRegression();
  });
  
  it('should fit a simple linear relationship', async () => {
    const X = [[1], [2], [3]];
    const y = [2, 4, 6];
    
    await model.fit(X, y);
    const predictions = model.predict([[4]]);
    
    expect(predictions[0]).toBeCloseTo(8, 1);
  });
  
  it('should handle edge cases', async () => {
    await expect(model.fit([], [])).rejects.toThrow();
  });
});
```

### Component Tests

Test component behavior:
- Props and events
- User interactions
- Conditional rendering
- Computed properties

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Slider from '../Slider.vue';

describe('Slider', () => {
  it('emits update event on change', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, label: 'Test' }
    });
    
    await wrapper.find('input').setValue(75);
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([75]);
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Focus on critical paths
- Test edge cases and error conditions
- Don't test implementation details

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include requirement references
- Provide usage examples
- Document parameters and return values

### README Updates

Update README.md when:
- Adding new features
- Changing setup instructions
- Modifying dependencies
- Updating configuration

### Developer Guide

Update DEVELOPER_GUIDE.md when:
- Adding new patterns
- Changing architecture
- Introducing new tools
- Modifying workflows

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main
- [ ] PR description is clear and complete

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] Accessibility maintained
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and builds
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Merge**: Maintainer merges your contribution

### After Your PR is Merged

1. Delete your feature branch
2. Update your local main branch
3. Celebrate your contribution! 🎉

```bash
git checkout main
git pull upstream main
git branch -d feature/your-feature-name
```

## Questions?

- Check the [Developer Guide](./DEVELOPER_GUIDE.md)
- Search existing issues and discussions
- Ask in GitHub Discussions
- Reach out to maintainers

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to ML Learning Platform! 🚀
