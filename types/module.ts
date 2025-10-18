/**
 * Module metadata and configuration types
 */

export type Domain = 'regression' | 'classification' | 'clustering' | 'preprocessing' | 'optimization' | 'advanced';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Module configuration loaded from config.json
 */
export interface ModuleConfig {
  id: string;
  name: string;
  domain: Domain;
  difficulty: Difficulty;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  keywords?: string[];
  interactive?: {
    algorithm: string;
    defaultParams: Record<string, any>;
    controls: any[];
    datasets: string[];
  };
  visualizations?: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  metrics?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

/**
 * Module metadata with additional computed properties
 */
export interface ModuleMetadata extends ModuleConfig {
  path: string;
  completed?: boolean;
  quizScore?: number;
}

/**
 * Domain information
 */
export interface DomainInfo {
  id: Domain;
  name: string;
  description: string;
  icon: string;
  color: string;
  modules: ModuleMetadata[];
}

/**
 * Module navigation item
 */
export interface ModuleNavItem {
  id: string;
  name: string;
  path: string;
  domain: Domain;
  difficulty: Difficulty;
  completed?: boolean;
}
