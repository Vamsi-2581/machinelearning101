/**
 * Quiz data transformation utility
 * 
 * Transforms quiz.json data from various formats to the standard Quiz interface.
 * Handles both old format (question field) and new format (text field).
 * 
 * Requirements: 2.2, 2.4, 2.5
 */

import type { Quiz, QuizQuestion, QuestionType } from '~/types/quiz';

/**
 * Raw quiz data format (as stored in quiz.json files)
 */
interface RawQuizData {
  id?: string;
  title: string;
  description?: string;
  passingScore?: number;
  questions: RawQuizQuestion[];
}

/**
 * Raw quiz question format (supports both old and new formats)
 */
interface RawQuizQuestion {
  id: string;
  type: QuestionType;
  text?: string;        // New format
  question?: string;    // Old format
  options: string[];
  correctAnswer: number;
  explanation: string;
}

/**
 * Validation error class for quiz data
 */
export class QuizValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuizValidationError';
  }
}

/**
 * Validates that a question type is valid
 */
function isValidQuestionType(type: string): type is QuestionType {
  return type === 'multiple-choice' || type === 'true-false';
}

/**
 * Validates a raw quiz question
 * 
 * @throws {QuizValidationError} If question data is invalid
 */
function validateQuestion(question: any, index: number): void {
  // Check required fields
  if (!question.id || typeof question.id !== 'string') {
    throw new QuizValidationError(`Question ${index + 1}: Missing or invalid 'id' field`);
  }

  if (!question.type || !isValidQuestionType(question.type)) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): Invalid 'type'. Must be 'multiple-choice' or 'true-false'`
    );
  }

  // Check for question text (either 'text' or 'question' field)
  if (!question.text && !question.question) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): Missing question text. Must have 'text' or 'question' field`
    );
  }

  // Validate options array
  if (!Array.isArray(question.options) || question.options.length === 0) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): Missing or empty 'options' array`
    );
  }

  // Validate that all options are strings
  if (!question.options.every((opt: any) => typeof opt === 'string')) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): All options must be strings`
    );
  }

  // Validate correctAnswer
  if (typeof question.correctAnswer !== 'number') {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): Missing or invalid 'correctAnswer'. Must be a number`
    );
  }

  if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): 'correctAnswer' index ${question.correctAnswer} is out of bounds. Must be between 0 and ${question.options.length - 1}`
    );
  }

  // Validate explanation
  if (!question.explanation || typeof question.explanation !== 'string') {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): Missing or invalid 'explanation' field`
    );
  }

  // Type-specific validation
  if (question.type === 'true-false' && question.options.length !== 2) {
    throw new QuizValidationError(
      `Question ${index + 1} (${question.id}): True-false questions must have exactly 2 options`
    );
  }
}

/**
 * Transforms a raw quiz question to the standard QuizQuestion format
 * Handles both old format (question field) and new format (text field)
 */
function transformQuestion(rawQuestion: RawQuizQuestion): QuizQuestion {
  return {
    id: rawQuestion.id,
    text: rawQuestion.text || rawQuestion.question || '', // Prefer 'text', fallback to 'question'
    type: rawQuestion.type,
    options: rawQuestion.options,
    correctAnswer: rawQuestion.correctAnswer,
    explanation: rawQuestion.explanation,
  };
}

/**
 * Transforms raw quiz data to the standard Quiz interface format
 * 
 * @param rawData - Raw quiz data from quiz.json file
 * @param moduleId - Module identifier (e.g., 'linear-regression')
 * @returns Transformed and validated Quiz object
 * @throws {QuizValidationError} If quiz data is invalid or malformed
 * 
 * @example
 * ```typescript
 * const rawQuiz = await import('~/content/modules/regression/linear-regression/quiz.json');
 * const quiz = transformQuizData(rawQuiz.default, 'linear-regression');
 * ```
 */
export function transformQuizData(rawData: any, moduleId: string): Quiz {
  // Validate input
  if (!rawData || typeof rawData !== 'object') {
    throw new QuizValidationError('Quiz data must be an object');
  }

  if (!moduleId || typeof moduleId !== 'string') {
    throw new QuizValidationError('Module ID must be a non-empty string');
  }

  // Validate required fields
  if (!rawData.title || typeof rawData.title !== 'string') {
    throw new QuizValidationError('Quiz must have a valid title');
  }

  if (!Array.isArray(rawData.questions)) {
    throw new QuizValidationError('Quiz must have a questions array');
  }

  if (rawData.questions.length === 0) {
    throw new QuizValidationError('Quiz must have at least one question');
  }

  // Validate each question
  rawData.questions.forEach((question: any, index: number) => {
    if(!question.type) {
      question.type = "multiple-choice"
    }
    validateQuestion(question, index);
  });

  // Transform to standard format
  const quiz: Quiz = {
    id: rawData.id || `${moduleId}-quiz`,
    moduleId: moduleId,
    title: rawData.title,
    questions: rawData.questions.map(transformQuestion),
    passingScore: rawData.passingScore,
  };

  return quiz;
}

/**
 * Safely loads and transforms quiz data with error handling
 * 
 * @param rawData - Raw quiz data from quiz.json file
 * @param moduleId - Module identifier
 * @returns Transformed Quiz object or null if transformation fails
 * 
 * @example
 * ```typescript
 * const rawQuiz = await import('~/content/modules/regression/linear-regression/quiz.json');
 * const quiz = safeTransformQuizData(rawQuiz.default, 'linear-regression');
 * if (quiz) {
 *   // Use quiz
 * } else {
 *   // Handle error
 * }
 * ```
 */
export function safeTransformQuizData(rawData: any, moduleId: string): Quiz | null {
  try {
    return transformQuizData(rawData, moduleId);
  } catch (error) {
    if (error instanceof QuizValidationError) {
      console.error(`Quiz validation error for module '${moduleId}':`, error.message);
    } else {
      console.error(`Unexpected error transforming quiz data for module '${moduleId}':`, error);
    }
    return null;
  }
}
