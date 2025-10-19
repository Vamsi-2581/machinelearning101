# Quiz Integration Guide

This guide explains how to add quizzes to new modules in the ML Learning Platform.

## Overview

The platform has a fully functional quiz system that integrates with module pages. Each module can have a quiz that tests learners on key concepts, with automatic progress tracking and scoring.

## Quick Start

To add a quiz to a new module, you need to:

1. Create a `quiz.json` file in the module's content directory
2. Load the quiz data in the module page component
3. Connect the Quiz component to the module layout's quiz slot

## Step-by-Step Guide

### Step 1: Create Quiz Content

Create a `quiz.json` file in your module's content directory:

```
content/modules/[domain]/[module]/quiz.json
```

**Example structure:**

```json
{
  "id": "linear-regression-quiz",
  "moduleId": "linear-regression",
  "title": "Linear Regression Quiz",
  "questions": [
    {
      "id": "q1",
      "text": "What is the primary purpose of linear regression?",
      "type": "multiple-choice",
      "options": [
        "To classify data into categories",
        "To predict continuous numerical values",
        "To cluster similar data points",
        "To reduce dimensionality"
      ],
      "correctAnswer": 1,
      "explanation": "Linear regression is used to predict continuous numerical values by finding the best-fit line through the data points. Classification algorithms are used for categorical predictions."
    },
    {
      "id": "q2",
      "text": "The learning rate controls how quickly the model learns.",
      "type": "true-false",
      "options": ["True", "False"],
      "correctAnswer": 0,
      "explanation": "True. The learning rate determines the step size in gradient descent. A higher learning rate means faster learning but risks overshooting the optimal solution."
    }
  ]
}
```

### Step 2: Load Quiz Data in Module Page

In your module page component (e.g., `pages/modules/[domain]/[module].vue`), use the `useQuizLoader` composable:

```vue
<script setup lang="ts">
import { useQuizLoader } from '~/composables/useQuizLoader';

// Define module ID
const moduleId = 'linear-regression';

// Load quiz data
const { quiz, loading, error } = useQuizLoader(
  () => import('~/content/modules/regression/linear-regression/quiz.json'),
  moduleId
);

// Handle quiz completion
const handleQuizComplete = (result: QuizResult) => {
  console.log('Quiz completed with score:', result.score);
  // Progress tracking is handled automatically by the Quiz component
};
</script>
```

### Step 3: Connect Quiz Component to Module Layout

Add the Quiz component to the quiz slot in your module page:

```vue
<template>
  <ModuleLayout :module-id="moduleId">
    <!-- Content slot -->
    <template #content>
      <ContentSection :content="content" />
    </template>

    <!-- Interactive slot -->
    <template #interactive>
      <ControlPanel />
      <VisualizationPanel />
    </template>

    <!-- Quiz slot -->
    <template #quiz>
      <QuizLoadingState v-if="loading" />
      <QuizErrorDisplay v-else-if="error" :error="error" />
      <Quiz
        v-else-if="quiz"
        :quiz="quiz"
        @quiz-completed="handleQuizComplete"
      />
    </template>
  </ModuleLayout>
</template>
```

## Quiz Content Guidelines

### Question Writing Principles

1. **Test Understanding, Not Memorization**
   - Focus on "why" and "when" questions
   - Include scenario-based questions
   - Test application of concepts

2. **Clear and Unambiguous**
   - One clearly correct answer
   - Plausible but incorrect distractors
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
- **5-10 questions total**
- **70% multiple-choice** (4-7 questions)
- **30% true-false** (1-3 questions)
- **Mix of difficulty levels**:
  - 40% easy (recall and basic understanding)
  - 40% medium (application and analysis)
  - 20% challenging (synthesis and evaluation)

### Question Types

#### Multiple Choice

Best for:
- Testing conceptual understanding
- Comparing different approaches
- Identifying correct procedures
- Evaluating scenarios

**Example:**
```json
{
  "id": "q1",
  "text": "Which metric is best for evaluating a regression model when you want to penalize large errors more heavily?",
  "type": "multiple-choice",
  "options": [
    "Mean Absolute Error (MAE)",
    "Mean Squared Error (MSE)",
    "R-squared (R²)",
    "Median Absolute Error"
  ],
  "correctAnswer": 1,
  "explanation": "MSE squares the errors, which means larger errors are penalized more heavily than smaller ones. MAE treats all errors equally, while R² measures the proportion of variance explained."
}
```

#### True/False

Best for:
- Testing fundamental concepts
- Clarifying common misconceptions
- Quick knowledge checks

**Example:**
```json
{
  "id": "q2",
  "text": "Increasing the number of epochs always improves model performance.",
  "type": "true-false",
  "options": ["True", "False"],
  "correctAnswer": 1,
  "explanation": "False. While more epochs can help the model learn, too many epochs can lead to overfitting, where the model performs well on training data but poorly on new data."
}
```

## Data Structure Reference

### Quiz Interface

```typescript
interface Quiz {
  id: string;           // Unique quiz identifier
  moduleId: string;     // Module this quiz belongs to
  title: string;        // Quiz title displayed to users
  questions: QuizQuestion[];
}
```

### QuizQuestion Interface

```typescript
interface QuizQuestion {
  id: string;           // Unique question identifier
  text: string;         // Question text
  type: 'multiple-choice' | 'true-false';
  options: string[];    // Answer options
  correctAnswer: number; // Index of correct answer (0-based)
  explanation: string;  // Explanation shown after answering
}
```

## Error Handling

The quiz system handles several error scenarios automatically:

### Quiz Not Found
If the quiz.json file doesn't exist, the system displays:
> "Quiz coming soon for this module..."

### Malformed Quiz Data
If the quiz data is invalid, the system displays:
> "Unable to load quiz. Please try again later."

### Loading Errors
If there's a network or loading error, the system displays:
> "Failed to load quiz. Please refresh the page."

## Progress Tracking

The Quiz component automatically:
- Saves quiz scores to the progress store
- Marks modules as complete when score ≥ 70%
- Allows quiz retakes (new score replaces old score)
- Persists progress to localStorage

No additional code is needed for progress tracking.

## Accessibility

The quiz system is fully accessible:
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ ARIA labels and live regions
- ✅ Focus management
- ✅ Mobile responsive

## Testing Your Quiz

### Manual Testing Checklist

- [ ] Quiz loads without errors
- [ ] All questions display correctly
- [ ] Answer selection works
- [ ] Correct/incorrect feedback shows
- [ ] Explanations are clear and helpful
- [ ] Score calculation is accurate
- [ ] Progress saves correctly
- [ ] Module completion triggers at 70%+
- [ ] Retake functionality works
- [ ] Keyboard navigation works
- [ ] Mobile layout is responsive

### Validation

Validate your quiz.json file:

```bash
# Run TypeScript type checking
npm run build

# Run tests
npm run test
```

## Examples

### Complete Module Page Example

```vue
<script setup lang="ts">
import { useQuizLoader } from '~/composables/useQuizLoader';
import { useModuleContent } from '~/composables/useModuleContent';

const moduleId = 'linear-regression';

// Load module content
const { content } = useModuleContent(moduleId);

// Load quiz
const { quiz, loading, error } = useQuizLoader(
  () => import('~/content/modules/regression/linear-regression/quiz.json'),
  moduleId
);

const handleQuizComplete = (result: QuizResult) => {
  if (result.score >= 70) {
    console.log('Congratulations! You passed the quiz!');
  }
};
</script>

<template>
  <ModuleLayout :module-id="moduleId">
    <template #content>
      <ContentSection :content="content" />
    </template>

    <template #interactive>
      <ControlPanel />
      <VisualizationPanel />
    </template>

    <template #quiz>
      <QuizLoadingState v-if="loading" />
      <QuizErrorDisplay v-else-if="error" :error="error" />
      <Quiz
        v-else-if="quiz"
        :quiz="quiz"
        @quiz-completed="handleQuizComplete"
      />
    </template>
  </ModuleLayout>
</template>
```

### Sample Quiz Content

See existing quiz files for examples:
- `content/modules/regression/linear-regression/quiz.json`
- `content/modules/optimization/gradient-descent/quiz.json`
- `content/modules/advanced/pca/quiz.json`
- `content/modules/classification/logistic-regression/quiz.json`
- `content/modules/preprocessing/missing-value-imputation/quiz.json`

## Troubleshooting

### Quiz Not Loading

**Problem:** Quiz shows "coming soon" message even though quiz.json exists.

**Solution:** Check that:
1. The import path is correct
2. The file is in the correct directory
3. The JSON is valid (no syntax errors)
4. The moduleId matches the quiz's moduleId field

### TypeScript Errors

**Problem:** TypeScript errors when loading quiz data.

**Solution:** Ensure your quiz.json follows the Quiz interface structure exactly. Use the `useQuizLoader` composable which handles type transformation.

### Progress Not Saving

**Problem:** Quiz scores aren't being saved.

**Solution:** The Quiz component handles this automatically. Check browser console for errors. Ensure localStorage is enabled.

## Best Practices

1. **Write 5-10 questions per quiz** - Enough to test understanding without overwhelming learners
2. **Include explanations for all answers** - Turn wrong answers into learning opportunities
3. **Test your quiz** - Take it yourself to ensure questions are clear and fair
4. **Match module difficulty** - Easy modules should have easier quizzes
5. **Cover key concepts** - Focus on the most important takeaways from the module
6. **Use clear language** - Avoid jargon unless it's defined in the module content
7. **Provide context** - Questions should relate to what was taught in the module

## Related Documentation

- [Module Creation Guide](./MODULE_CREATION_GUIDE.md)
- [Quiz Component Documentation](../components/modules/README.md)
- [Progress Tracking](../stores/README.md)
- [Type Definitions](../types/quiz.ts)

## Support

For questions or issues with quiz integration, check:
- Existing quiz implementations in `content/modules/`
- Quiz component source in `components/modules/Quiz.vue`
- Type definitions in `types/quiz.ts`
