/**
 * Reinforcement Learning Algorithms Index
 * Lazy-loaded exports for code splitting optimization
 */

// Lazy exports for code splitting
export const ActorCritic = () => import('./ActorCritic');
export const DQN = () => import('./DQN');
export const MultiArmedBandits = () => import('./MultiArmedBandits');
export const PolicyGradient = () => import('./PolicyGradient');
export const QLearning = () => import('./QLearning');

// Algorithm registry for dynamic loading
export const REINFORCEMENT_LEARNING_ALGORITHMS = {
  ActorCritic: () => import('./ActorCritic'),
  DQN: () => import('./DQN'),
  MultiArmedBandits: () => import('./MultiArmedBandits'),
  PolicyGradient: () => import('./PolicyGradient'),
  QLearning: () => import('./QLearning'),
} as const;

export type ReinforcementLearningAlgorithmName = keyof typeof REINFORCEMENT_LEARNING_ALGORITHMS;