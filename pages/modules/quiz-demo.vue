<template>
  <ModuleLayout
    title="Quiz System Demo"
    description="Interactive quiz component demonstration"
    difficulty="beginner"
    :estimated-time="5"
  >
    <template #content>
      <ContentSection>
        <h2>Quiz System Overview</h2>
        <p>
          This demo showcases the quiz system with multiple-choice and true-false questions.
          The quiz tracks your answers, provides immediate feedback, and saves your score.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Multiple question types (multiple-choice, true-false)</li>
          <li>Navigation between questions</li>
          <li>Immediate feedback with explanations</li>
          <li>Score calculation and progress tracking</li>
          <li>Completion badge and review section</li>
        </ul>
      </ContentSection>
    </template>

    <template #interactive>
      <InteractiveSection>
        <template #controls>
          <div class="demo-info">
            <h3>Quiz Instructions</h3>
            <p>Click "Start Quiz" to begin. Answer each question and submit to see feedback.</p>
            <p v-if="quizCompleted" class="completion-message">
              ✓ Quiz completed! Your score has been saved.
            </p>
          </div>
        </template>

        <template #visualization>
          <Quiz
            :quiz="demoQuiz"
            :passing-score="demoQuiz.passingScore || 70"
            @quiz-completed="handleQuizCompleted"
          />
        </template>
      </InteractiveSection>
    </template>

    <template #quiz>
      <div class="quiz-placeholder">
        <p>The quiz is shown in the Interactive section above.</p>
      </div>
    </template>
  </ModuleLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Quiz as QuizType, QuizResult } from '~/types/quiz';

/**
 * Quiz Demo Page
 * 
 * Demonstrates the quiz system with sample questions
 */

const quizCompleted = ref(false);

const demoQuiz: QuizType = {
  id: 'demo-quiz',
  moduleId: 'quiz-demo',
  title: 'Machine Learning Basics Quiz',
  passingScore: 70,
  questions: [
    {
      id: 'q1',
      text: 'What is the primary goal of supervised learning?',
      type: 'multiple-choice',
      options: [
        'To find patterns in unlabeled data',
        'To learn a mapping from inputs to outputs using labeled examples',
        'To maximize rewards through trial and error',
        'To reduce the dimensionality of data',
      ],
      correctAnswer: 1,
      explanation: 'Supervised learning uses labeled training data to learn a function that maps inputs to outputs. The model learns from examples where the correct answer is provided.',
    },
    {
      id: 'q2',
      text: 'Overfitting occurs when a model performs well on training data but poorly on new data.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'True. Overfitting happens when a model learns the training data too well, including noise and outliers, making it unable to generalize to new, unseen data.',
    },
    {
      id: 'q3',
      text: 'Which of the following is a regression algorithm?',
      type: 'multiple-choice',
      options: [
        'K-Means Clustering',
        'Decision Tree Classifier',
        'Linear Regression',
        'K-Nearest Neighbors Classifier',
      ],
      correctAnswer: 2,
      explanation: 'Linear Regression is a regression algorithm used to predict continuous values. The other options are either classification or clustering algorithms.',
    },
    {
      id: 'q4',
      text: 'Feature scaling is always necessary for all machine learning algorithms.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'False. While feature scaling is important for algorithms that use distance metrics (like KNN, SVM, neural networks), tree-based algorithms like decision trees and random forests are not affected by feature scaling.',
    },
    {
      id: 'q5',
      text: 'What does a learning rate control in gradient descent?',
      type: 'multiple-choice',
      options: [
        'The number of training iterations',
        'The size of steps taken toward the minimum',
        'The number of features used',
        'The complexity of the model',
      ],
      correctAnswer: 1,
      explanation: 'The learning rate controls the size of the steps taken during gradient descent optimization. A larger learning rate means bigger steps, while a smaller rate means smaller, more cautious steps.',
    },
  ],
};

const handleQuizCompleted = (result: QuizResult) => {
  quizCompleted.value = true;
  console.log('Quiz completed:', result);
};
</script>

<style scoped>
.demo-info {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.demo-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.demo-info p {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.completion-message {
  color: #059669;
  font-weight: 500;
  padding: 0.75rem;
  background-color: #d1fae5;
  border-radius: 6px;
  margin-top: 1rem;
}

.quiz-placeholder {
  padding: 2rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 8px;
}

.quiz-placeholder p {
  color: #6b7280;
  margin: 0;
}
</style>
