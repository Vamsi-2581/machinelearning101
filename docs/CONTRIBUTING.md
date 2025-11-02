# Contributing to ML Learning Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

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

We welcome various types of contributions including:
- 🐛 Bug Fixes
- ✨ New Features
- 📚 Documentation
- 🎨 Design Improvements
- ⚡ Performance Optimizations


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


Thank you for contributing to ML Learning Platform! 🚀
