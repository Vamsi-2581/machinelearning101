/**
 * Composable for lazy loading visualization components
 * 
 * This composable provides dynamic imports for visualization components,
 * enabling code splitting and reducing initial bundle size.
 * 
 * Requirements: 14.4, 14.8
 */

import { defineAsyncComponent, type Component } from 'vue';

/**
 * Lazy load visualization components
 */
export function useLazyVisualization() {
  /**
   * Load Scatter2D visualization
   */
  const loadScatter2D = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/Scatter2D.vue'));
  };

  /**
   * Load LineChart visualization
   */
  const loadLineChart = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/LineChart.vue'));
  };

  /**
   * Load Heatmap visualization
   */
  const loadHeatmap = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/Heatmap.vue'));
  };

  /**
   * Load Plot3D visualization
   */
  const loadPlot3D = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/Plot3D.vue'));
  };

  /**
   * Load ConfusionMatrix visualization
   */
  const loadConfusionMatrix = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/ConfusionMatrix.vue'));
  };

  /**
   * Load ROCCurve visualization
   */
  const loadROCCurve = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/ROCCurve.vue'));
  };

  /**
   * Load LearningCurves visualization
   */
  const loadLearningCurves = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/LearningCurves.vue'));
  };

  /**
   * Load CrossValidation visualization
   */
  const loadCrossValidation = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/CrossValidation.vue'));
  };

  /**
   * Load NetworkDiagram visualization
   */
  const loadNetworkDiagram = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/NetworkDiagram.vue'));
  };

  /**
   * Load CanvasScatter visualization (for large datasets)
   */
  const loadCanvasScatter = (): Component => {
    return defineAsyncComponent(() => import('~/components/visualizations/CanvasScatter.vue'));
  };

  /**
   * Load any visualization by type
   */
  const loadVisualization = (type: string): Component => {
    switch (type) {
      case 'scatter2d':
        return loadScatter2D();
      case 'line':
        return loadLineChart();
      case 'heatmap':
        return loadHeatmap();
      case 'plot3d':
        return loadPlot3D();
      case 'confusion-matrix':
        return loadConfusionMatrix();
      case 'roc-curve':
        return loadROCCurve();
      case 'learning-curves':
        return loadLearningCurves();
      case 'cross-validation':
        return loadCrossValidation();
      case 'network':
        return loadNetworkDiagram();
      case 'canvas-scatter':
        return loadCanvasScatter();
      default:
        throw new Error(`Unknown visualization type: ${type}`);
    }
  };

  return {
    loadVisualization,
    loadScatter2D,
    loadLineChart,
    loadHeatmap,
    loadPlot3D,
    loadConfusionMatrix,
    loadROCCurve,
    loadLearningCurves,
    loadCrossValidation,
    loadNetworkDiagram,
    loadCanvasScatter,
  };
}
