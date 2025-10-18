# Module Components

This directory contains reusable components for building interactive learning modules.

## Quiz System

The quiz system provides a complete solution for creating interactive quizzes with multiple question types, immediate feedback, and progress tracking.

### Components

#### Quiz.vue
Main quiz component that handles:
- Quiz state management (not started, in progress, completed)
- Question navigation
- Score calculation
- Integration with progress store
- Completion badge display

**Props:**
- `quiz: Quiz` - Quiz configuration with questions

**Events:**
- `quiz-completed(result: QuizResult)` - Emitted when quiz is completed

**Requirements:** 7.4, 7.5, 9.4

#### QuizQuestion.vue
Individual question component that handles:
- Rendering question text and options
- Answer selection
- Correct/incorrect feedback display
- Explanations

**Props:**
- `question: QuizQuestion` - Question data
- `selectedAnswer?: number` - Currently selected answer index
- `showFeedback?: boolean` - Whether to show feedback

**Events:**
- `answer-selected(answerIndex: number)` - Emitted when user selects an answer

**Requirements:** 7.4, 7.5

### Usage Example

```vue
<template>
  <Quiz
    :quiz="myQuiz"
    @quiz-completed="handleQuizCompleted"
  />
</template>

<script setup lang="ts">
import type { Quiz, QuizResult } from '~/types/quiz';

const myQuiz: Quiz = {
  id: 'my-quiz',
  moduleId: 'my-module',
  title: 'My Quiz',
  questions: [
    {
      id: 'q1',
      text: 'What is 2 + 2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: '2 + 2 equals 4.',
    },
    {
      id: 'q2',
      text: 'The sky is blue.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'The sky appears blue due to Rayleigh scattering.',
    },
  ],
};

const handleQuizCompleted = (result: QuizResult) => {
  console.log(`Score: ${result.score}%`);
};
</script>
```

### Features

- **Multiple Question Types**: Supports multiple-choice and true-false questions
- **Navigation**: Previous/Next buttons with progress indicator
- **Immediate Feedback**: Shows correct/incorrect status with explanations
- **Score Calculation**: Automatically calculates percentage score
- **Progress Tracking**: Saves scores to progress store
- **Module Completion**: Marks module as complete for passing scores (≥70%)
- **Review Section**: Shows all questions with explanations after completion
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Responsive**: Works on desktop, tablet, and mobile devices

### Types

See `types/quiz.ts` for complete type definitions:
- `Quiz` - Quiz configuration
- `QuizQuestion` - Individual question
- `QuizAnswer` - User's answer to a question
- `QuizResult` - Complete quiz results

## Other Module Components

### ModuleLayout.vue
Three-section layout for module pages (content, interactive, quiz).

### ContentSection.vue
Renders markdown content with syntax highlighting.

### InteractiveSection.vue
Two-panel layout for controls and visualizations.

### ControlPanel.vue
Renders dynamic controls based on configuration.

### VisualizationPanel.vue
Renders appropriate visualization based on type.
