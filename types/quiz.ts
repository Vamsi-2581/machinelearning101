/**
 * Quiz types
 */

export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number; // Index of correct answer
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore?: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: string;
  score: number; // Percentage (0-100)
  totalQuestions: number;
  correctAnswers: number;
  answers: QuizAnswer[];
  completedAt: number;
}
