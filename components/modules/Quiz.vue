<template>
  <div class="quiz-container" role="region" aria-label="Quiz">
    <!-- Confetti Canvas -->
    <canvas ref="confettiCanvas" class="confetti-canvas" aria-hidden="true"></canvas>

    <div class="quiz-header">
      <h2 class="quiz-title" id="quiz-title">{{ quiz.title }}</h2>
      <div v-if="quizStarted && !quizCompleted" class="quiz-progress" aria-atomic="true">
        <div class="progress-text">
          <span class="progress-current">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
        </div>
      </div>
    </div>

    <!-- Quiz not started -->
    <div v-if="!quizStarted && !quizCompleted" class="quiz-intro" role="region" aria-labelledby="quiz-title">
      <p class="intro-text">
        Test your understanding of the concepts covered in this module.
      </p>
      <p class="intro-details">
        {{ quiz.questions.length }} questions • {{ estimatedTime }} minutes
      </p>
      <p class="passing-score-info">
        Passing score: {{ passingScore }}%
      </p>
      <div v-if="previousScore !== undefined" class="previous-score-info">
        <p class="previous-score-label">Your previous score:</p>
        <p class="previous-score-value" :class="previousScore >= passingScore ? 'passed' : 'failed'">
          {{ previousScore }}%
        </p>
      </div>
      <Button @click="startQuiz" size="lg" aria-label="Start quiz">
         {{  previousScore !== undefined ? 'Retake Quiz' : 'Start Quiz' }}
      </Button>
    </div>

    <!-- Quiz in progress -->
    <div v-else-if="quizStarted && !quizCompleted" class="quiz-content">
      <QuizQuestion :question="currentQuestion" :selected-answer="userAnswers[currentQuestion.id]"
        :show-feedback="showFeedback" @answer-selected="handleAnswerSelected" />

      <div class="quiz-navigation">
        <Button v-if="currentQuestionIndex > 0" @click="previousQuestion" variant="secondary" :disabled="showFeedback">
          Previous
        </Button>

        <div class="nav-spacer"></div>

        <Button v-if="!showFeedback" @click="submitAnswer" :disabled="userAnswers[currentQuestion.id] === undefined">
          Submit Answer
        </Button>

        <Button v-else-if="currentQuestionIndex < quiz.questions.length - 1" @click="nextQuestion">
          Next Question
        </Button>

        <Button v-else @click="completeQuiz">
          Complete Quiz
        </Button>
      </div>
    </div>

    <!-- Quiz completed -->
    <div v-else-if="quizCompleted" class="quiz-results" role="region" aria-labelledby="results-title">
      <div class="results-header" role="status" aria-live="polite" aria-atomic="true">
        <div class="completion-badge" :class="isPassed ? 'passed' : 'failed'" aria-hidden="true">
          <svg v-if="isPassed" class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h3 class="results-title" id="results-title">
          {{ isPassed ? 'Quiz Completed!' : 'Quiz Failed' }}
        </h3>
        <p class="results-score" :class="isPassed ? 'passed' : 'failed'">
          Your Score: {{ quizResult?.score }}%
        </p>
        <p class="results-details">
          {{ quizResult?.correctAnswers }} out of {{ quizResult?.totalQuestions }} correct
        </p>
        <p v-if="!isPassed" class="retry-message">
          You need {{ passingScore }}% to pass. Review the explanations below and try again!
        </p>
      </div>

      <div class="results-feedback">
        <h4 class="feedback-title">Review Your Answers</h4>
        <div v-for="(question, index) in quiz.questions" :key="question.id" class="answer-review">
          <div class="review-header">
            <span class="review-number">Question {{ index + 1 }}</span>
            <span class="review-status" :class="getAnswerResult(question.id) ? 'correct' : 'incorrect'">
              {{ getAnswerResult(question.id) ? '✓ Correct' : '✗ Incorrect' }}
            </span>
          </div>
          <p class="review-question">{{ question.text }}</p>
          <p class="review-explanation">
            <strong>Explanation:</strong> {{ question.explanation }}
          </p>
        </div>
      </div>

      <div class="results-actions">
        <Button @click="retakeQuiz" variant="secondary">
          Retake Quiz
        </Button>
        <Button v-if="isPassed" @click="handleContinueLearning">
          Continue Learning
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { Quiz, QuizAnswer, QuizResult } from '~/types/quiz';
import QuizQuestion from './QuizQuestion.vue';
import Button from '~/components/shared/Button.vue';
import { useProgressStore } from '~/stores/progress';
import { useAnalyticsStore } from '~/stores/analytics';

/**
 * Quiz Component
 * 
 * Renders different question types (multiple-choice, true-false),
 * tracks user answers, implements navigation between questions,
 * calculates scores, displays explanations, and saves scores to progress store.
 * 
 * Requirements: 7.4, 7.5, 9.4
 */

interface Props {
  quiz: Quiz;
  passingScore?: number;
  nextModulePath?: string;
}

interface Emits {
  (e: 'quiz-completed', result: QuizResult): void;
}

const props = withDefaults(defineProps<Props>(), {
  passingScore: 70,
});
const emit = defineEmits<Emits>();

const router = useRouter();

// Stores
const progressStore = useProgressStore();
const analyticsStore = useAnalyticsStore();

// Quiz state
const quizStarted = ref(false);
const quizCompleted = ref(false);
const currentQuestionIndex = ref(0);
const userAnswers = ref<Record<string, number>>({});
const showFeedback = ref(false);
const quizResult = ref<QuizResult | null>(null);
const confettiCanvas = ref<HTMLCanvasElement | null>(null);

// Get previous score from progress store
const previousScore = computed(() => {
  return progressStore.getQuizScore(props.quiz.moduleId);
});

// Computed properties
const currentQuestion = computed(() => {
  return props.quiz.questions[currentQuestionIndex.value];
});

const estimatedTime = computed(() => {
  // Estimate 1 minute per question
  return props.quiz.questions.length;
});

const isPassed = computed(() => {
  return quizResult.value ? quizResult.value.score >= props.passingScore : false;
});

/**
 * Start the quiz
 */
const startQuiz = () => {
  quizStarted.value = true;
  currentQuestionIndex.value = 0;
  userAnswers.value = {};
  showFeedback.value = false;
  quizCompleted.value = false;
  quizResult.value = null;

  window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
};

/**
 * Handle answer selection
 */
const handleAnswerSelected = (answerIndex: number) => {
  if (!showFeedback.value) {
    userAnswers.value[currentQuestion.value.id] = answerIndex;
  }
};

/**
 * Submit the current answer and show feedback
 */
const submitAnswer = () => {
  showFeedback.value = true;

  // Track quiz answer
  const selectedAnswer = userAnswers.value[currentQuestion.value.id];
  const isCorrect = selectedAnswer === currentQuestion.value.correctAnswer;
  analyticsStore.trackQuizAnswer(props.quiz.moduleId, currentQuestion.value.id, isCorrect);
};

/**
 * Navigate to the next question
 */
const nextQuestion = () => {
  if (currentQuestionIndex.value < props.quiz.questions.length - 1) {
    currentQuestionIndex.value++;
    showFeedback.value = false;
  }
};

/**
 * Navigate to the previous question
 */
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    showFeedback.value = false;
  }
};

/**
 * Complete the quiz and calculate results
 * Calculates score based on correct answers, saves to progress store,
 * and displays completion badge.
 * 
 * Requirements: 7.5, 9.4
 */
const completeQuiz = async () => {
  const answers: QuizAnswer[] = props.quiz.questions.map((question) => {
    const selectedAnswer = userAnswers.value[question.id];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return {
      questionId: question.id,
      selectedAnswer,
      isCorrect,
    };
  });

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswers / props.quiz.questions.length) * 100);

  quizResult.value = {
    quizId: props.quiz.id,
    score,
    totalQuestions: props.quiz.questions.length,
    correctAnswers,
    answers,
    completedAt: Date.now(),
  };

  quizCompleted.value = true;
  quizStarted.value = false;

  // Save score to progress store
  console.log("Saving to progress store...")
  progressStore.saveQuizScore(props.quiz.moduleId, score);

  // Mark module as completed if score is passing
  if (score >= props.passingScore) {
    console.log("Marking module as completed...")
    progressStore.markModuleComplete(props.quiz.moduleId);

    // Trigger confetti animation for passing
    await nextTick();
    triggerConfetti();
  } else {
    // Trigger shake animation for failing
    await nextTick();
    triggerShakeAnimation();
  }

  // Track quiz completion
  console.log("Updating analytics store...")
  analyticsStore.trackQuizComplete(props.quiz.moduleId, score, props.quiz.questions.length);

  // Emit the result
  emit('quiz-completed', quizResult.value);
};

/**
 * Retake the quiz
 */
const retakeQuiz = () => {
  startQuiz();
};

/**
 * Get whether an answer was correct
 */
const getAnswerResult = (questionId: string): boolean => {
  const answer = quizResult.value?.answers.find(a => a.questionId === questionId);
  return answer?.isCorrect ?? false;
};

/**
 * Handle continue learning button
 * Navigates to next module if available, otherwise emits quiz-completed event
 */
const handleContinueLearning = () => {
  if (props.nextModulePath) {
    router.push(props.nextModulePath);
  } else {
    emit('quiz-completed', quizResult.value!);
  }
};

/**
 * Trigger confetti animation when quiz is passed
 */
const triggerConfetti = () => {
  if (!confettiCanvas.value) return;

  const canvas = confettiCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Confetti particles
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
  }> = [];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Create particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  let animationId: number;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.rotation += particle.rotationSpeed;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();

      // Remove particles that are off screen
      if (particle.y > canvas.height) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  animate();

  // Clean up after 5 seconds
  setTimeout(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 5000);
};

/**
 * Trigger shake animation when quiz is failed
 */
const triggerShakeAnimation = () => {
  const resultsElement = document.querySelector('.quiz-results');
  if (resultsElement) {
    resultsElement.classList.add('shake-animation');
    setTimeout(() => {
      resultsElement.classList.remove('shake-animation');
    }, 500);
  }
};
</script>

<style scoped>
.quiz-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.quiz-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.quiz-progress {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.progress-current {
  font-weight: 600;
  color: #111827;
}

.progress-remaining {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Quiz Intro */
.quiz-intro {
  text-align: center;
  padding: 3rem 2rem;
}

.intro-text {
  font-size: 1.125rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.intro-details {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.passing-score-info {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
  margin-bottom: 1rem;
}

.previous-score-info {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.previous-score-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.previous-score-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.previous-score-value.passed {
  color: #059669;
}

.previous-score-value.failed {
  color: #dc2626;
}

/* Quiz Content */
.quiz-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.quiz-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.nav-spacer {
  flex: 1;
}

/* Quiz Results */
.quiz-results {
  padding: 1rem 0;
}

.results-header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.completion-badge.passed {
  background-color: #d1fae5;
  animation: bounce 0.6s ease;
}

.completion-badge.failed {
  background-color: #fee2e2;
}

.badge-icon {
  width: 40px;
  height: 40px;
}

.completion-badge.passed .badge-icon {
  color: #059669;
}

.completion-badge.failed .badge-icon {
  color: #dc2626;
}

@keyframes bounce {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.results-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.results-score {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.results-score.passed {
  color: #059669;
}

.results-score.failed {
  color: #dc2626;
}

.retry-message {
  font-size: 0.9375rem;
  color: #dc2626;
  margin-top: 1rem;
  font-weight: 500;
}

.results-details {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Results Feedback */
.results-feedback {
  margin-bottom: 2rem;
}

.feedback-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.answer-review {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.review-status {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.review-status.correct {
  background-color: #d1fae5;
  color: #065f46;
}

.review-status.incorrect {
  background-color: #fee2e2;
  color: #991b1b;
}

.review-question {
  font-size: 0.9375rem;
  color: #111827;
  margin: 0.5rem 0;
}

.review-explanation {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

/* Results Actions */
.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}

/* Shake Animation */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.shake-animation {
  animation: shake 0.5s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quiz-container {
    padding: 1.5rem;
  }

  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .quiz-title {
    font-size: 1.25rem;
  }

  .quiz-intro {
    padding: 2rem 1rem;
  }

  .quiz-navigation {
    flex-wrap: wrap;
  }

  .nav-spacer {
    display: none;
  }

  .results-actions {
    flex-direction: column;
  }
}
</style>
