# Quiz Integration Design Document

## Overview

This design document outlines the integration of the existing Quiz component system into all module pages of the ML Learning Platform. The quiz components (Quiz.vue and QuizQuestion.vue) are already built and functional, but they need to be connected to the module pages and populated with content.

The integration involves:
1. Creating quiz content (quiz.json files) for each module
2. Loading quiz data in module page components
3. Connecting the Quiz component to the module layout's quiz slot
4. Ensuring proper data flow between quiz completion and progress tracking

## Architecture

### Component Hierarchy

```
ModuleLayout.vue (quiz slot)
  └── Quiz.vue (already exists)
      └── QuizQuestion.vue (already exists)
```

### Data Flow

```
quiz.json (content file)
  ↓
Module Page Component (loads quiz data)
  ↓
Quiz Component (receives quiz prop)
  ↓
Progress Store (saves quiz results)
  ↓
Analytics Store (tracks quiz events)
```

### File Structure

```
content/modules/[domain]/[module]/
  ├── config.json
  ├── content.md
  └── quiz.json          # Quiz content (needs to be created/updated)

pages/modules/[domain]/[module].vue
  # Loads quiz.json and passes to Quiz component

components/modules/
  ├── Quiz.vue           # Already exists
  └── QuizQuestion.vue   # Already exists

types/
  └── quiz.ts            # Already exists
```

## Components and Interfaces

### Existing Components (No Changes Needed)

#### Quiz.vue
- **Props**: `quiz: Quiz`
- **Emits**: `quiz-completed(result: QuizResult)`
- **Features**: Question navigation, answer tracking, scoring, feedback display
- **Status**: ✅ Complete - no changes needed

#### QuizQuestion.vue
- **Props**: `question: QuizQuestion`, `selectedAnswer?: number`, `showFeedback?: boolean`
- **Emits**: `answer-selected(answerIndex: number)`
- **Features**: Question rendering, option selection, feedback display
- **Status**: ✅ Complete - no changes needed

### Quiz Data Structure (Already Defined)

The quiz data structure is already defined in `types/quiz.ts`:

```typescript
export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType; // 'multiple-choice' | 'true-false'
  options: string[];
  correctAnswer: number; // Index of correct answer
  explanation: string;
}
```

### Quiz Content File Format

Each module's `quiz.json` file should follow this structure:

```json
{
  "id": "module-name-quiz",
  "moduleId": "module-name",
  "title": "Module Name Quiz",
  "questions": [
    {
      "id": "q1",
      "text": "Question text here?",
      "type": "multiple-choice",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 1,
      "explanation": "Explanation of why option B is correct..."
    }
  ]
}
```

**Note**: The existing quiz.json files have a slightly different structure (with `passingScore` and `question` instead of `text`). We'll need to handle both formats or migrate to the standard format.

## Data Models

### Quiz Loading Pattern

Each module page will follow this pattern:

```typescript
// Load quiz data
const quizData = ref<Quiz | null>(null);

onMounted(async () => {
  try {
    // Import quiz.json from content directory
    const quizModule = await import(
      `~/content/modules/[domain]/[module]/quiz.json`
    );
    
    // Transform to Quiz interface if needed
    const rawQuiz = quizModule.default || quizModule;
    quizData.value = transformQuizData(rawQuiz);
  } catch (err) {
    console.warn('Quiz data not found for this module');
    quizData.value = null;
  }
});

// Transform function to handle different formats
const transformQuizData = (raw: any): Quiz => {
  return {
    id: raw.id || `${moduleId}-quiz`,
    moduleId: moduleId,
    title: raw.title,
    questions: raw.questions.map((q: any) => ({
      id: q.id,
      text: q.text || q.question, // Handle both formats
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  };
};
```

### Quiz Completion Handler

```typescript
const handleQuizComplete = (result: QuizResult) => {
  // Save to progress store (already implemented in Quiz.vue)
  // The Quiz component already handles this internally
  
  // Optional: Navigate to next module or show completion message
  if (result.score >= 70) {
    // Show success message
    console.log('Quiz passed!');
  }
};
```

## Error Handling

### Quiz Loading Errors

1. **Quiz file not found**: Display friendly message "Quiz coming soon for this module"
2. **Malformed JSON**: Log error and display "Quiz temporarily unavailable"
3. **Invalid quiz data**: Validate against Quiz interface and show specific error

### Quiz Component Errors

The Quiz component already handles:
- Empty question lists
- Invalid answer selections
- Progress store save failures

### Error Display Component

```vue
<template #quiz>
  <div v-if="quizError" class="quiz-error">
    <p>{{ quizError }}</p>
  </div>
  <div v-else-if="!quizData" class="quiz-placeholder">
    <p>Quiz coming soon for this module...</p>
  </div>
  <Quiz
    v-else
    :quiz="quizData"
    @quiz-completed="handleQuizComplete"
  />
</template>
```

## Testing Strategy

### Unit Testing
- Validate quiz data transformation logic
- Test error handling for missing/malformed quiz files
- Verify Quiz component receives correct props

### Integration Testing
- Test complete flow: load quiz → answer questions → save score
- Verify progress store updates correctly
- Test quiz retake functionality

### Content Validation
- Validate all quiz.json files against Quiz interface
- Check that all questions have valid correctAnswer indices
- Ensure explanations are present and meaningful

### Manual Testing Checklist
- [ ] Quiz loads correctly for each module
- [ ] Questions display properly
- [ ] Answer selection works
- [ ] Feedback shows correct/incorrect states
- [ ] Score calculation is accurate
- [ ] Progress saves to store
- [ ] Module completion triggers at 70%+
- [ ] Retake functionality works
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Mobile responsive layout works

## Implementation Plan

### Phase 1: Module Page Updates (Priority Modules)
Update 5 core module pages to load and display quizzes:
1. Linear Regression
2. Logistic Regression  
3. PCA
4. Gradient Descent
5. Missing Value Imputation

### Phase 2: Quiz Content Creation
Create quiz.json files for the 5 priority modules with 5-8 questions each.

### Phase 3: Remaining Modules
Update remaining module pages and create quiz content.

### Phase 4: Validation and Polish
- Add quiz data validation
- Improve error messages
- Add loading states
- Test accessibility

## Quiz Content Guidelines

### Question Writing Principles

1. **Test Understanding, Not Memorization**
   - Focus on "why" and "when" questions
   - Include scenario-based questions
   - Test application of concepts

2. **Clear and Unambiguous**
   - One clearly correct answer
   - Distractors should be plausible but incorrect
   - Avoid trick questions

3. **Educational Explanations**
   - Explain why the correct answer is right
   - Explain why common wrong answers are incorrect
   - Reinforce key concepts

4. **Appropriate Difficulty**
   - Match module difficulty level
   - Mix easy, medium, and challenging questions
   - Build confidence while testing knowledge

### Question Distribution

For each module quiz:
- **5-8 questions total**
- **70% multiple-choice** (4-6 questions)
- **30% true-false** (1-2 questions)
- **Mix of difficulty levels**:
  - 40% easy (recall and basic understanding)
  - 40% medium (application and analysis)
  - 20% challenging (synthesis and evaluation)

### Example Question Templates

**Conceptual Understanding:**
```
"What is the primary purpose of [concept]?"
"Why does [algorithm] use [technique]?"
"When is [method] most appropriate?"
```

**Application:**
```
"If [scenario], what would happen to [metric]?"
"Which parameter should you adjust to [achieve goal]?"
"What is the effect of [change] on [outcome]?"
```

**Comparison:**
```
"What is the difference between [A] and [B]?"
"Which metric is better for [scenario]?"
"How does [concept A] relate to [concept B]?"
```

## Module-Specific Quiz Topics

### Linear Regression
- Purpose and use cases
- Equation components (slope, intercept)
- Gradient descent optimization
- Metrics (MSE, RMSE, R², MAE)
- Learning rate effects
- Epochs and convergence

### Logistic Regression
- Classification vs regression
- Sigmoid function
- Decision boundary
- Probability interpretation
- Binary classification metrics
- Overfitting and regularization

### PCA
- Dimensionality reduction purpose
- Principal components meaning
- Variance explained
- When to use PCA
- Feature scaling importance
- Interpretation of components

### Gradient Descent
- Optimization concept
- Gradient meaning
- Learning rate impact
- Local vs global minima
- Convergence criteria
- Variants (batch, stochastic, mini-batch)

### Missing Value Imputation
- Types of missing data
- Imputation strategies
- Mean/median/mode imputation
- Forward/backward fill
- Impact on model performance
- When to drop vs impute

## Accessibility Considerations

The Quiz component already implements:
- ✅ Keyboard navigation
- ✅ ARIA labels and roles
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ Live regions for dynamic content

Additional considerations for integration:
- Ensure quiz tab is keyboard accessible
- Announce quiz loading states
- Provide skip links if needed
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Performance Considerations

### Quiz Data Loading
- Quiz JSON files are small (<10KB each)
- Load asynchronously on module mount
- Cache in component state
- No need for lazy loading

### Component Rendering
- Quiz component already optimized
- Minimal re-renders
- Efficient state management

### Progress Persistence
- Progress store already handles persistence
- Uses localStorage for client-side storage
- Automatic save on quiz completion

## Migration Strategy

### Handling Existing Quiz Files

Some modules already have quiz.json files with a different structure:
- `question` instead of `text`
- Additional `passingScore` field
- Additional `description` field

**Solution**: Create a transformation function that handles both formats:

```typescript
const transformQuizData = (raw: any, moduleId: string): Quiz => {
  return {
    id: raw.id || `${moduleId}-quiz`,
    moduleId: moduleId,
    title: raw.title,
    questions: raw.questions.map((q: any) => ({
      id: q.id,
      text: q.text || q.question, // Handle both formats
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  };
};
```

### Gradual Rollout

1. **Week 1**: Update 2 modules (Linear Regression, Gradient Descent)
2. **Week 2**: Update 3 more modules (Logistic Regression, PCA, Imputation)
3. **Week 3**: Update remaining modules
4. **Week 4**: Polish, testing, and bug fixes

## Success Metrics

### Technical Metrics
- All module pages successfully load quiz data
- Zero console errors related to quiz loading
- Quiz completion rate > 80%
- Progress save success rate > 99%

### User Experience Metrics
- Average quiz completion time: 5-10 minutes
- Quiz retake rate: 20-30% (indicates engagement)
- Passing rate: 60-70% on first attempt
- Module completion rate increase: +15%

### Content Quality Metrics
- Question clarity rating (user feedback)
- Explanation helpfulness rating
- Difficulty appropriateness
- Coverage of key concepts

## Future Enhancements

### Phase 2 Features (Not in Current Scope)
- Quiz timer/time limits
- Question randomization
- Hint system
- Detailed analytics per question
- Leaderboards
- Quiz difficulty levels
- Adaptive quizzes based on performance
- Export quiz results
- Quiz history view
- Question bookmarking

### Content Expansion
- More questions per module (10-15)
- Advanced quizzes for each module
- Comprehensive final assessment
- Domain-specific quizzes (all regression, all classification, etc.)

## Dependencies

### Existing Components (No Changes)
- `components/modules/Quiz.vue`
- `components/modules/QuizQuestion.vue`
- `types/quiz.ts`
- `stores/progress.ts`
- `stores/analytics.ts`

### Files to Create/Update
- `content/modules/*/quiz.json` (create/update for each module)
- `pages/modules/*/*.vue` (update quiz slot in each module page)

### No Breaking Changes
This integration does not require changes to existing components or interfaces. It's purely additive.

## Conclusion

This design provides a clear path to integrate the existing quiz system into all module pages. The implementation is straightforward because:

1. **Quiz components are already built** and fully functional
2. **Data structure is already defined** in types/quiz.ts
3. **Progress tracking is already implemented** in the Quiz component
4. **Module layout already has a quiz slot** ready to use

The main work involves:
- Creating quiz content (quiz.json files)
- Loading quiz data in module pages
- Connecting the Quiz component to the quiz slot
- Writing high-quality quiz questions

This approach minimizes technical risk while maximizing educational value for learners.
