# Design Document: Domain and Module Expansion

## Overview

This design document outlines the architecture and implementation approach for expanding the Machine Learning 101 platform from 6 domains with ~9 modules to 9 domains with 45+ modules. The expansion maintains the existing architecture patterns while introducing three new domains (Computer Vision, NLP, Reinforcement Learning) and adding modules to all domains.

### Design Goals

1. **Scalability**: Support 45+ modules without performance degradation
2. **Consistency**: Maintain uniform structure across all modules
3. **Maintainability**: Use templates and shared patterns for easy updates
4. **Performance**: Lazy load resources and optimize bundle sizes
5. **Extensibility**: Enable future domain/module additions with minimal effort

### Key Constraints

- Browser-only execution (no backend required)
- Static site generation compatible
- TypeScript strict mode compliance
- WCAG 2.1 AA accessibility
- Bundle size optimization through code splitting

## Architecture

### High-Level Architecture

The platform follows a modular, domain-driven architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Vue Components, Pages, Navigation, Visualizations)    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│    (Composables, Stores, State Management, Routing)     │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│        (Algorithm Implementations, ML Logic)             │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│     (Content Files, Configs, Quizzes, Datasets)         │
└─────────────────────────────────────────────────────────┘
```

### Domain Structure

Each domain is self-contained with:
- Domain metadata (id, name, description, icon, color)
- Collection of related modules
- Shared algorithm patterns and utilities


### Module Structure

Each module follows a consistent pattern:

```
content/modules/{domain}/{module-id}/
├── config.json      # Module configuration and metadata
├── content.md       # Learning content (markdown)
└── quiz.json        # Quiz questions and answers

algorithms/{domain}/
└── {ModuleName}.ts  # Algorithm implementation

pages/modules/{domain}/
└── {module-id}.vue  # Page component (optional, can use generic)
```

## Components and Interfaces

### 1. Domain Registry (`composables/useModules.ts`)

**Purpose**: Central registry for all domains and modules

**Updates Required**:
- Add 3 new domains to `DOMAINS` constant
- Expand `MODULE_REGISTRY` with 36+ new module entries
- Update `Domain` type to include new domains

**New Domain Definitions**:

```typescript
'computer-vision': {
  id: 'computer-vision',
  name: 'Computer Vision',
  description: 'Learn how machines interpret and understand visual information',
  icon: 'material-symbols:image-search',
  color: 'cyan',
},
'nlp': {
  id: 'nlp',
  name: 'Natural Language Processing',
  description: 'Discover how machines understand and generate human language',
  icon: 'material-symbols:chat-bubble',
  color: 'indigo',
},
'reinforcement-learning': {
  id: 'reinforcement-learning',
  name: 'Reinforcement Learning',
  description: 'Explore how agents learn through interaction and rewards',
  icon: 'game-icons:brain',
  color: 'pink',
}
```

### 2. Type System (`types/module.ts`)

**Updates Required**:
- Extend `Domain` type union
- Ensure `ModuleConfig` interface supports all module types
- Add domain-specific metadata types if needed

**Type Extensions**:

```typescript
export type Domain = 
  | 'regression' 
  | 'classification' 
  | 'clustering' 
  | 'preprocessing' 
  | 'optimization' 
  | 'advanced'
  | 'computer-vision'
  | 'nlp'
  | 'reinforcement-learning';
```

### 3. Algorithm Base Classes

**Existing Pattern**: All algorithms extend `BaseAlgorithm`

**Domain-Specific Extensions**:


- **Computer Vision**: May need image preprocessing utilities, canvas rendering
- **NLP**: Text tokenization, embedding utilities, vocabulary management
- **Reinforcement Learning**: Environment simulation, reward tracking, policy evaluation

**Algorithm Interface Compliance**:
All algorithms must implement:
- `fit(X, y?)`: Training method
- `predict(X)`: Prediction method
- `getVisualizationData()`: Returns visualization data
- `getMetrics()`: Returns performance metrics
- `reset()`: Resets algorithm state

### 4. Visualization Components

**Existing Components**:
- Scatter2D, Scatter3D, LineChart, Heatmap, ConfusionMatrix, ROCCurve, etc.

**New Visualization Needs**:

**Computer Vision**:
- ImageDisplay: Show input images and processed outputs
- ConvolutionVisualizer: Visualize CNN filters and feature maps
- BoundingBoxOverlay: Display object detection results
- SegmentationMask: Show segmentation outputs

**NLP**:
- TextHighlighter: Highlight tokens, entities, or sentiment
- EmbeddingProjection: 2D/3D visualization of word embeddings
- AttentionHeatmap: Visualize attention weights
- SequenceDisplay: Show text generation step-by-step

**Reinforcement Learning**:
- EnvironmentRenderer: Visualize RL environment state
- PolicyVisualization: Show policy decisions across state space
- RewardCurve: Plot cumulative rewards over episodes
- QValueHeatmap: Visualize Q-values for different states

### 5. Content Management

**Content Structure** (per module):

**config.json**:
```json
{
  "id": "module-id",
  "name": "Module Name",
  "domain": "domain-id",
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": 30,
  "prerequisites": ["other-module-id"],
  "learningObjectives": ["objective 1", "objective 2"],
  "keywords": ["keyword1", "keyword2"],
  "interactive": {
    "algorithm": "AlgorithmClassName",
    "defaultParams": {},
    "controls": [],
    "datasets": []
  },
  "visualizations": [],
  "metrics": []
}
```

**content.md** sections:
1. Introduction
2. Concept Explanation
3. Algorithm Walkthrough
4. Interactive Demo (reference)
5. Use Cases
6. Best Practices
7. Further Reading

**quiz.json**:
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}
```

## Data Models

### Domain Model

```typescript
interface DomainInfo {
  id: Domain;
  name: string;
  description: string;
  icon: string;
  color: string;
  modules: ModuleMetadata[];
}
```

### Module Model

```typescript
interface ModuleConfig {
  id: string;
  name: string;
  domain: Domain;
  difficulty: Difficulty;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  keywords?: string[];
  interactive?: InteractiveConfig;
  visualizations?: VisualizationConfig[];
  metrics?: MetricConfig[];
}

interface ModuleMetadata extends ModuleConfig {
  path: string;
  completed?: boolean;
  quizScore?: number;
}
```

### Algorithm Model

```typescript
interface Algorithm {
  name: string;
  fit(X: number[][], y?: number[]): Promise<void>;
  predict(X: number[][]): number[] | string[];
  getVisualizationData(): VisualizationData | VisualizationData[];
  getMetrics(): Metrics;
  reset(): void;
}
```

## Error Handling

### Algorithm Errors

**Validation Errors**:
- Input dimension mismatches
- Invalid parameter values
- Missing required data

**Computation Errors**:
- Numerical instability (NaN, Infinity)
- Convergence failures
- Memory limitations

**Error Handling Strategy**:
1. Validate inputs before computation
2. Use try-catch blocks in async operations
3. Display user-friendly error messages
4. Log detailed errors for debugging
5. Provide recovery suggestions

### Content Loading Errors

**Scenarios**:
- Missing config.json, content.md, or quiz.json
- Malformed JSON
- Missing algorithm implementation
- Invalid module registry entries

**Handling**:
- Graceful degradation (show partial content)
- Clear error messages to users
- Console warnings for developers
- Fallback to default configurations

## Testing Strategy

### Unit Tests

**Algorithm Tests**:
- Test fit() with various datasets
- Verify predict() output correctness
- Validate metrics calculations
- Test edge cases (empty data, single point, etc.)

**Composable Tests**:
- Test module loading logic
- Verify domain filtering
- Test progress tracking
- Validate navigation helpers

**Component Tests**:
- Test parameter controls
- Verify visualization rendering
- Test quiz functionality
- Validate accessibility features

### Integration Tests

**Module Flow Tests**:
- Load module → Train algorithm → Display results
- Complete quiz → Update progress
- Navigate between modules
- Bookmark and track progress

**Domain Tests**:
- Load all modules in a domain
- Verify domain completion calculation
- Test domain navigation

### Performance Tests

**Metrics to Track**:
- Initial page load time
- Algorithm execution time
- Visualization render time
- Bundle size per domain

**Targets**:
- Page load < 3s on 3G
- Algorithm execution < 2s for typical datasets
- Lighthouse score ≥ 90
- Bundle size < 500KB per domain chunk

### Accessibility Tests

**Automated**:
- Run axe-core on all pages
- Verify ARIA labels
- Check color contrast ratios
- Test keyboard navigation

**Manual**:
- Screen reader testing
- Keyboard-only navigation
- Focus management
- Skip links functionality

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Update type definitions
- Extend Domain type and DOMAINS constant
- Create directory structure for all modules
- Update MODULE_REGISTRY skeleton

### Phase 2: Computer Vision (Week 2-3)
- Implement 5 CV algorithms
- Create CV-specific visualizations
- Write content and quizzes
- Create page components

### Phase 3: NLP (Week 4-5)
- Implement 5 NLP algorithms
- Create text visualization components
- Write content and quizzes
- Create page components

### Phase 4: Reinforcement Learning (Week 6-7)
- Implement 5 RL algorithms
- Create environment visualizations
- Write content and quizzes
- Create page components

### Phase 5: Expand Existing Domains (Week 8-10)
- Add 4 regression modules
- Add 5 classification modules
- Add 5 clustering modules
- Add 5 preprocessing modules
- Add 5 optimization modules
- Add 5 advanced modules
  

### Code Splitting Strategy

**Domain-Level Splitting**:
```typescript
// Lazy load domain-specific algorithms
const loadDomainAlgorithms = (domain: Domain) => {
  return import(`~/algorithms/${domain}/index.ts`);
};
```

**Visualization Library Splitting**:
- Chart.js: Load for basic charts
- D3.js: Load for custom visualizations
- Plotly.js: Load for 3D plots

**Route-Based Splitting**:
- Each module page is a separate chunk
- Domain index pages are separate chunks

### Lazy Loading

**Algorithm Loading**:
```typescript
const algorithm = await import(`~/algorithms/${domain}/${algorithmName}.ts`);
```

**Content Loading**:
```typescript
const config = await fetch(`/content/modules/${domain}/${moduleId}/config.json`);
const content = await fetch(`/content/modules/${domain}/${moduleId}/content.md`);
```

### Web Workers

**Heavy Computations**:
- Neural network training
- Large dataset clustering
- Complex optimization algorithms

**Worker Pattern**:
```typescript
if (estimatedTime > 500) {
  // Use Web Worker
  const worker = new Worker('/workers/algorithm-worker.js');
  worker.postMessage({ algorithm, data });
}
```

## Accessibility Considerations

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Visible focus indicators
- Skip links for main content

### Screen Reader Support
- ARIA labels for all controls
- Live regions for dynamic updates
- Descriptive alt text for visualizations
- Semantic HTML structure

### Visual Accessibility
- Color contrast ratios meet WCAG AA
- Don't rely solely on color for information
- Resizable text up to 200%
- Reduced motion support

### Interactive Elements
- Minimum touch target size: 44x44px
- Clear hover/focus states
- Error messages associated with inputs
- Form validation feedback

## Security Considerations

### Client-Side Only
- No sensitive data storage
- No authentication tokens in localStorage
- No API keys in client code

### Content Security
- Sanitize markdown content
- Validate JSON configurations
- Prevent XSS in user inputs (quiz answers, etc.)

### Data Privacy
- Progress data stored locally only
- No tracking without consent
- Clear privacy policy
- GDPR compliance

## Deployment Strategy

### Build Process
1. Run TypeScript type checking
2. Run unit tests
3. Build static site with `nuxt generate`
4. Optimize assets (images, fonts)
5. Generate sitemap
6. Deploy to static hosting

### Environment Configuration
- Development: Hot reload, source maps
- Production: Minification, tree shaking, compression

### Rollout Plan
1. Deploy foundation updates
2. Deploy one domain at a time
3. Monitor performance metrics
4. Gather user feedback
5. Iterate and improve

## Monitoring and Metrics

### Performance Metrics
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Algorithm execution times
- Bundle sizes

### Usage Metrics
- Module completion rates
- Quiz scores
- Time spent per module
- Navigation patterns

### Error Tracking
- JavaScript errors
- Failed content loads
- Algorithm failures
- Browser compatibility issues

## Future Extensibility

### Adding New Domains
1. Add domain to `Domain` type
2. Add entry to `DOMAINS` constant
3. Create directory structure
4. Implement modules following patterns

### Adding New Modules
1. Create content files (config, content, quiz)
2. Implement algorithm class
3. Add to MODULE_REGISTRY
4. Create page component (or use generic)
5. Test and validate

### Adding New Visualizations
1. Create Vue component in `components/visualizations/`
2. Follow BaseChart pattern
3. Add to visualization type union
4. Document usage

## Risk Mitigation

### Risk: Bundle Size Growth
**Mitigation**: Aggressive code splitting, lazy loading, tree shaking

### Risk: Algorithm Performance
**Mitigation**: Web Workers, optimization, dataset size limits

### Risk: Content Consistency
**Mitigation**: Templates, validation scripts, review process

### Risk: Maintenance Burden
**Mitigation**: Shared components, clear patterns, documentation

## Success Criteria

- ✅ All 9 domains accessible and functional
- ✅ Each domain has 5+ working modules
- ✅ All modules have interactive visualizations
- ✅ All modules have content and quizzes
- ✅ Progress tracking works across all modules
- ✅ No TypeScript errors
- ✅ All tests pass
- ✅ Production build succeeds
- ✅ Lighthouse score ≥ 90
- ✅ WCAG 2.1 AA compliance
