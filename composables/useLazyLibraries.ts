/**
 * Composable for lazy loading visualization libraries
 * 
 * This composable provides dynamic imports for heavy visualization libraries,
 * ensuring they are only loaded when needed to optimize bundle size and performance.
 * 
 * Requirements: 17.1, 17.2
 */

/**
 * Lazy load visualization libraries
 */
export function useLazyLibraries() {
  /**
   * Load Chart.js library
   * Used for: Basic 2D charts (line, bar, scatter, pie)
   */
  const loadChartJS = async () => {
    const [Chart, registerables] = await Promise.all([
      import('chart.js/auto'),
      import('chart.js')
    ]);
    
    // Register all Chart.js components
    Chart.default.register(...registerables.registerables);
    
    return Chart.default;
  };

  /**
   * Load D3.js library
   * Used for: Custom visualizations, advanced data manipulation
   */
  const loadD3 = async () => {
    const d3 = await import('d3');
    return d3;
  };

  /**
   * Load Plotly.js library
   * Used for: 3D plots, scientific visualizations, interactive plots
   */
  const loadPlotly = async () => {
    const Plotly = await import('plotly.js-dist-min');
    return Plotly.default;
  };

  /**
   * Load specific library based on visualization needs
   */
  const loadLibraryForVisualization = async (visualizationType: string) => {
    switch (visualizationType) {
      // Chart.js visualizations
      case 'line':
      case 'bar':
      case 'scatter2d':
      case 'pie':
      case 'doughnut':
      case 'radar':
      case 'polar':
        return { library: 'chartjs', instance: await loadChartJS() };

      // D3.js visualizations
      case 'network':
      case 'tree':
      case 'force-directed':
      case 'sankey':
      case 'chord':
      case 'custom':
        return { library: 'd3', instance: await loadD3() };

      // Plotly.js visualizations
      case 'plot3d':
      case 'surface':
      case 'mesh3d':
      case 'scatter3d':
      case 'contour':
      case 'heatmap-plotly':
        return { library: 'plotly', instance: await loadPlotly() };

      // Domain-specific visualizations that may need specific libraries
      case 'embedding-projection':
        // 3D embeddings use Plotly, 2D can use D3 or Chart.js
        return { library: 'plotly', instance: await loadPlotly() };

      case 'convolution-visualizer':
      case 'segmentation-mask':
        // Computer vision visualizations typically use D3 for custom rendering
        return { library: 'd3', instance: await loadD3() };

      case 'environment-renderer':
      case 'policy-visualization':
        // RL visualizations often need custom D3 rendering
        return { library: 'd3', instance: await loadD3() };

      default:
        // Default to Chart.js for basic visualizations
        return { library: 'chartjs', instance: await loadChartJS() };
    }
  };

  /**
   * Preload libraries for a specific domain
   * Useful for domain pages to preload commonly used libraries
   */
  const preloadDomainLibraries = async (domain: string) => {
    switch (domain) {
      case 'computer-vision':
        // CV modules primarily use D3 for custom visualizations
        return Promise.all([loadD3(), loadChartJS()]);

      case 'nlp':
        // NLP modules use D3 for text visualizations and Plotly for embeddings
        return Promise.all([loadD3(), loadPlotly()]);

      case 'reinforcement-learning':
        // RL modules use D3 for environment rendering and Chart.js for curves
        return Promise.all([loadD3(), loadChartJS()]);

      case 'advanced':
        // Advanced modules may use all libraries
        return Promise.all([loadChartJS(), loadD3(), loadPlotly()]);

      default:
        // Basic domains primarily use Chart.js
        return loadChartJS();
    }
  };

  /**
   * Check if a library is already loaded
   */
  const isLibraryLoaded = (library: 'chartjs' | 'd3' | 'plotly'): boolean => {
    switch (library) {
      case 'chartjs':
        return typeof window !== 'undefined' && 'Chart' in window;
      case 'd3':
        return typeof window !== 'undefined' && 'd3' in window;
      case 'plotly':
        return typeof window !== 'undefined' && 'Plotly' in window;
      default:
        return false;
    }
  };

  return {
    loadChartJS,
    loadD3,
    loadPlotly,
    loadLibraryForVisualization,
    preloadDomainLibraries,
    isLibraryLoaded,
  };
}