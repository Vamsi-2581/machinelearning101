/**
 * Natural Language Processing Algorithms Index
 * Lazy-loaded exports for code splitting optimization
 */

// Lazy exports for code splitting
export const NamedEntityRecognition = () => import('./NamedEntityRecognition');
export const SentimentAnalysis = () => import('./SentimentAnalysis');
export const TextGeneration = () => import('./TextGeneration');
export const Tokenizer = () => import('./Tokenizer');
export const WordEmbeddings = () => import('./WordEmbeddings');

// Algorithm registry for dynamic loading
export const NLP_ALGORITHMS = {
  NamedEntityRecognition: () => import('./NamedEntityRecognition'),
  SentimentAnalysis: () => import('./SentimentAnalysis'),
  TextGeneration: () => import('./TextGeneration'),
  Tokenizer: () => import('./Tokenizer'),
  WordEmbeddings: () => import('./WordEmbeddings'),
} as const;

export type NLPAlgorithmName = keyof typeof NLP_ALGORITHMS;