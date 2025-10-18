import { defineStore } from 'pinia';
import type { DataPoint, AlgorithmResults } from '~/types/algorithm';

/**
 * Module Store
 * 
 * Manages the state for algorithm modules including parameters,
 * datasets, results, and training status.
 * 
 * Requirements: 14.2, 2.6
 */

export interface ModuleState {
  currentModule: string | null;
  parameters: Record<string, any>;
  dataset: DataPoint[];
  results: AlgorithmResults | null;
  isTraining: boolean;
  trainingProgress: number;
}

export const useModuleStore = defineStore('module', {
  state: (): ModuleState => ({
    currentModule: null,
    parameters: {},
    dataset: [],
    results: null,
    isTraining: false,
    trainingProgress: 0,
  }),

  getters: {
    /**
     * Get current parameters
     */
    currentParams: (state): Record<string, any> => {
      return { ...state.parameters };
    },

    /**
     * Check if results are available
     */
    hasResults: (state): boolean => {
      return state.results !== null;
    },

    /**
     * Check if a dataset is loaded
     */
    hasDataset: (state): boolean => {
      return state.dataset.length > 0;
    },

    /**
     * Get training status message
     */
    trainingStatus: (state): string => {
      if (!state.isTraining) return 'Ready';
      return `Training... ${Math.round(state.trainingProgress * 100)}%`;
    },
  },

  actions: {
    /**
     * Set a parameter value
     */
    setParameter(key: string, value: any): void {
      this.parameters[key] = value;
    },

    /**
     * Set multiple parameters at once
     */
    setParameters(params: Record<string, any>): void {
      this.parameters = { ...this.parameters, ...params };
    },

    /**
     * Load a dataset
     */
    loadDataset(dataset: DataPoint[]): void {
      this.dataset = dataset;
      // Clear previous results when dataset changes
      this.results = null;
    },

    /**
     * Run the algorithm (to be implemented with actual algorithm logic)
     * This is a placeholder that will be called by components
     */
    async runAlgorithm(algorithmFn: () => Promise<AlgorithmResults>): Promise<void> {
      this.isTraining = true;
      this.trainingProgress = 0;
      this.results = null;

      try {
        // Execute the algorithm function passed from the component
        const results = await algorithmFn();
        this.results = results;
        this.trainingProgress = 1;
      } catch (error) {
        console.error('Algorithm execution failed:', error);
        throw error;
      } finally {
        this.isTraining = false;
      }
    },

    /**
     * Update training progress (called during algorithm execution)
     */
    updateProgress(progress: number): void {
      this.trainingProgress = Math.max(0, Math.min(1, progress));
    },

    /**
     * Set algorithm results directly
     */
    setResults(results: AlgorithmResults): void {
      this.results = results;
    },

    /**
     * Reset the module to initial state
     */
    resetModule(): void {
      this.parameters = {};
      this.dataset = [];
      this.results = null;
      this.isTraining = false;
      this.trainingProgress = 0;
    },

    /**
     * Set the current module ID
     */
    setCurrentModule(moduleId: string): void {
      this.currentModule = moduleId;
    },

    /**
     * Clear only the results (keep parameters and dataset)
     */
    clearResults(): void {
      this.results = null;
      this.trainingProgress = 0;
    },
  },
});
