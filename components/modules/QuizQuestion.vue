<template>
  <div class="quiz-question">
    <div class="question-header">
      <h3 class="question-text">{{ question.text }}</h3>
      <span class="question-type-badge">
        {{ question.type === 'true-false' ? 'True/False' : 'Multiple Choice' }}
      </span>
    </div>

    <div class="options-container">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        class="option-button"
        :class="{
          selected: selectedAnswer === index,
          correct: showFeedback && index === question.correctAnswer,
          incorrect: showFeedback && selectedAnswer === index && index !== question.correctAnswer,
          disabled: showFeedback,
        }"
        :disabled="showFeedback"
        @click="selectAnswer(index)"
        :aria-pressed="selectedAnswer === index"
        :aria-label="`Option ${String.fromCharCode(65 + index)}: ${option}`"
      >
        <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
        <span class="option-text">{{ option }}</span>
        <span v-if="showFeedback && index === question.correctAnswer" class="option-icon correct-icon">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </span>
        <span
          v-else-if="showFeedback && selectedAnswer === index && index !== question.correctAnswer"
          class="option-icon incorrect-icon"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </span>
      </button>
    </div>

    <!-- Feedback Section -->
    <div v-if="showFeedback" class="feedback-section" role="status" aria-live="polite">
      <div
        class="feedback-message"
        :class="isCorrect ? 'feedback-correct' : 'feedback-incorrect'"
      >
        <div class="feedback-icon">
          <svg
            v-if="isCorrect"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <svg
            v-else
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div class="feedback-content">
          <p class="feedback-title">
            {{ isCorrect ? 'Correct!' : 'Incorrect' }}
          </p>
          <p class="feedback-explanation">{{ question.explanation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuizQuestion } from '~/types/quiz';

/**
 * QuizQuestion Component
 * 
 * Renders question text and options, handles answer selection,
 * and shows correct/incorrect feedback.
 * 
 * Requirements: 7.4, 7.5
 */

interface Props {
  question: QuizQuestion;
  selectedAnswer?: number;
  showFeedback?: boolean;
}

interface Emits {
  (e: 'answer-selected', answerIndex: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedAnswer: undefined,
  showFeedback: false,
});

const emit = defineEmits<Emits>();

/**
 * Check if the selected answer is correct
 */
const isCorrect = computed(() => {
  return props.selectedAnswer === props.question.correctAnswer;
});

/**
 * Handle answer selection
 */
const selectAnswer = (index: number) => {
  if (!props.showFeedback) {
    emit('answer-selected', index);
  }
};
</script>

<style scoped>
.quiz-question {
  width: 100%;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.question-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.6;
}

.question-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e0e7ff;
  color: #3730a3;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Options */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.option-button:hover:not(.disabled) {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.option-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.option-button.selected:not(.disabled) {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.option-button.correct {
  border-color: #10b981;
  background-color: #d1fae5;
}

.option-button.incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
}

.option-button.disabled {
  cursor: not-allowed;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 50%;
  font-weight: 600;
  color: #6b7280;
  flex-shrink: 0;
  transition: all 0.2s;
}

.option-button:hover:not(.disabled) .option-letter {
  background-color: #3b82f6;
  color: white;
}

.option-button.selected:not(.disabled) .option-letter {
  background-color: #3b82f6;
  color: white;
}

.option-button.correct .option-letter {
  background-color: #10b981;
  color: white;
}

.option-button.incorrect .option-letter {
  background-color: #ef4444;
  color: white;
}

.option-text {
  flex: 1;
  color: #374151;
  line-height: 1.5;
}

.option-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.correct-icon {
  color: #10b981;
}

.incorrect-icon {
  color: #ef4444;
}

/* Feedback Section */
.feedback-section {
  margin-top: 1.5rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-message {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
}

.feedback-correct {
  background-color: #d1fae5;
  border-color: #10b981;
}

.feedback-incorrect {
  background-color: #fee2e2;
  border-color: #ef4444;
}

.feedback-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.feedback-correct .feedback-icon {
  color: #059669;
}

.feedback-incorrect .feedback-icon {
  color: #dc2626;
}

.feedback-content {
  flex: 1;
}

.feedback-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.feedback-correct .feedback-title {
  color: #065f46;
}

.feedback-incorrect .feedback-title {
  color: #991b1b;
}

.feedback-explanation {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.feedback-correct .feedback-explanation {
  color: #047857;
}

.feedback-incorrect .feedback-explanation {
  color: #b91c1c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .question-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .question-text {
    font-size: 1rem;
  }

  .option-button {
    padding: 0.875rem;
  }

  .option-letter {
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }

  .option-text {
    font-size: 0.9375rem;
  }

  .feedback-message {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
