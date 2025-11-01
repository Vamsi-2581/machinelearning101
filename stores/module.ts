import { defineStore } from 'pinia';
import type { DataPoint, AlgorithmResults } from '~/types/algorithm';
import { useHeavyAlgorithms } from '~/composables/useHeavyAlgorithms';

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
  usingWebWorker: boolean;
  estimatedExecutionTime: number;
  performanceRecommendation: string;
}

export const useModuleStore = defineStore('module', {
  state: (): ModuleState => ({
    currentModule: null,
    parameters: {},
    dataset: [],
    results: null,
    isTraining: false,
    trainingProgress: 0,
    usingWebWorker: false,
    estimatedExecutionTime: 0,
    performanceRecommendation: '',
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
      const progress = Math.round(state.trainingProgress * 100);
      const workerStatus = state.usingWebWorker ? ' (Background)' : '';
      return `Training... ${progress}%${workerStatus}`;
    },

    /**
     * Get performance information
     */
    performanceInfo: (state) => ({
      usingWebWorker: state.usingWebWorker,
      estimatedTime: state.estimatedExecutionTime,
      recommendation: state.performanceRecommendation,
    }),
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
     * Run the algorithm with Web Worker optimization
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
     * Run algorithm with heavy algorithm optimization
     */
    async runHeavyAlgorithm(
      algorithm: any,
      operation: 'fit' | 'predict' | 'transform',
      data: { X: number[][]; y?: number[] }
    ): Promise<void> {
      const { runAlgorithm, getPerformanceRecommendations } = useHeavyAlgorithms();
      
      const algorithmName = algorithm.constructor.name;
      const datasetSize = data.X.length;
      
      // Get performance recommendations
      const perfInfo = getPerformanceRecommendations(algorithmName, datasetSize);
      this.usingWebWorker = perfInfo.useWebWorker;
      this.estimatedExecutionTime = perfInfo.estimatedTime;
      this.performanceRecommendation = perfInfo.recommendation;
      
      this.isTraining = true;
      this.trainingProgress = 0;
      this.results = null;

      try {
        // Run with Web Worker optimization
        const results = await runAlgorithm(
          algorithm,
          operation,
          data,
          this.parameters,
          (progress: number) => {
            this.updateProgress(progress / 100);
          }
        );

        // Handle results based on operation type
        if (operation === 'fit') {
          this.results = {
            visualizationData: results.visualizationData || algorithm.getVisualizationData(),
            metrics: results.metrics || algorithm.getMetrics(),
            executionTime: results.executionTime,
          };
        } else {
          // For predict/transform operations, store results differently
          this.results = {
            predictions: results.predictions || results.transformed,
            executionTime: results.executionTime,
          };
        }
        
        this.trainingProgress = 1;
      } catch (error) {
        console.error('Heavy algorithm execution failed:', error);
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
      this.usingWebWorker = false;
      this.estimatedExecutionTime = 0;
      this.performanceRecommendation = '';
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
      this.usingWebWorker = false;
      this.estimatedExecutionTime = 0;
      this.performanceRecommendation = '';
    },

    /**
     * Update performance information
     */
    updatePerformanceInfo(
      usingWebWorker: boolean,
      estimatedTime: number,
      recommendation: string
    ): void {
      this.usingWebWorker = usingWebWorker;
      this.estimatedExecutionTime = estimatedTime;
      this.performanceRecommendation = recommendation;
    },
  },
});
