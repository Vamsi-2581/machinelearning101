/**
 * Loss Landscape Generation and Visualization
 * 
 * Generates 2D loss landscape data for visualization with contour and 3D surface plots
 * 
 * Requirements: 4.5, 13.2
 */

import type { LossFunction } from './GradientDescentOptimizer';
import type { OptimizationStep } from './GradientDescentOptimizer';

/**
 * Loss landscape grid data
 */
export interface LossLandscapeData {
  x: number[];
  y: number[];
  z: number[][];
  xRange: [number, number];
  yRange: [number, number];
  resolution: number;
}

/**
 * Configuration for loss landscape generation
 */
export interface LossLandscapeConfig {
  xRange: [number, number];
  yRange: [number, number];
  resolution?: number; // Number of points per axis (default: 50)
}

/**
 * Generate 2D loss landscape grid
 */
export function generateLossLandscape(
  lossFunction: LossFunction,
  config: LossLandscapeConfig
): LossLandscapeData {
  const resolution = config.resolution ?? 50;
  const [xMin, xMax] = config.xRange;
  const [yMin, yMax] = config.yRange;
  
  // Generate grid points
  const x: number[] = [];
  const y: number[] = [];
  const z: number[][] = [];
  
  const xStep = (xMax - xMin) / (resolution - 1);
  const yStep = (yMax - yMin) / (resolution - 1);
  
  // Generate x and y arrays
  for (let i = 0; i < resolution; i++) {
    x.push(xMin + i * xStep);
    y.push(yMin + i * yStep);
  }
  
  // Generate z values (loss at each grid point)
  for (let i = 0; i < resolution; i++) {
    const row: number[] = [];
    for (let j = 0; j < resolution; j++) {
      const loss = lossFunction([x[j], y[i]]);
      row.push(loss);
    }
    z.push(row);
  }
  
  return {
    x,
    y,
    z,
    xRange: config.xRange,
    yRange: config.yRange,
    resolution
  };
}

/**
 * Generate contour plot data for Plotly
 */
export function generateContourPlotData(
  landscape: LossLandscapeData,
  optimizationPath?: OptimizationStep[]
) {
  const traces: any[] = [];
  
  // Contour plot
  traces.push({
    type: 'contour',
    x: landscape.x,
    y: landscape.y,
    z: landscape.z,
    colorscale: 'Viridis',
    contours: {
      coloring: 'heatmap',
      showlabels: true,
      labelfont: {
        size: 10,
        color: 'white'
      }
    },
    colorbar: {
      title: 'Loss',
      titleside: 'right'
    },
    hovertemplate: 'x: %{x:.3f}<br>y: %{y:.3f}<br>Loss: %{z:.3f}<extra></extra>'
  });
  
  // Add optimization path if provided
  if (optimizationPath && optimizationPath.length > 0) {
    const pathX = optimizationPath.map(step => step.params[0]);
    const pathY = optimizationPath.map(step => step.params[1]);
    
    // Path line
    traces.push({
      type: 'scatter',
      mode: 'lines+markers',
      x: pathX,
      y: pathY,
      name: 'Optimization Path',
      line: {
        color: 'red',
        width: 2
      },
      marker: {
        color: 'red',
        size: 6,
        symbol: 'circle'
      },
      hovertemplate: 'Iteration: %{pointNumber}<br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>'
    });
    
    // Starting point
    traces.push({
      type: 'scatter',
      mode: 'markers',
      x: [pathX[0]],
      y: [pathY[0]],
      name: 'Start',
      marker: {
        color: 'green',
        size: 12,
        symbol: 'star',
        line: {
          color: 'white',
          width: 2
        }
      },
      hovertemplate: 'Start: (%{x:.3f}, %{y:.3f})<extra></extra>'
    });
    
    // Ending point
    if (pathX.length > 1) {
      traces.push({
        type: 'scatter',
        mode: 'markers',
        x: [pathX[pathX.length - 1]],
        y: [pathY[pathY.length - 1]],
        name: 'Current',
        marker: {
          color: 'yellow',
          size: 12,
          symbol: 'diamond',
          line: {
            color: 'white',
            width: 2
          }
        },
        hovertemplate: 'Current: (%{x:.3f}, %{y:.3f})<extra></extra>'
      });
    }
  }
  
  return traces;
}

/**
 * Generate 3D surface plot data for Plotly
 */
export function generate3DSurfacePlotData(
  landscape: LossLandscapeData,
  optimizationPath?: OptimizationStep[]
) {
  const traces: any[] = [];
  
  // Surface plot
  traces.push({
    type: 'surface',
    x: landscape.x,
    y: landscape.y,
    z: landscape.z,
    colorscale: 'Viridis',
    colorbar: {
      title: 'Loss',
      titleside: 'right'
    },
    contours: {
      z: {
        show: true,
        usecolormap: true,
        highlightcolor: 'limegreen',
        project: { z: true }
      }
    },
    hovertemplate: 'x: %{x:.3f}<br>y: %{y:.3f}<br>Loss: %{z:.3f}<extra></extra>'
  });
  
  // Add optimization path if provided
  if (optimizationPath && optimizationPath.length > 0) {
    const pathX = optimizationPath.map(step => step.params[0]);
    const pathY = optimizationPath.map(step => step.params[1]);
    const pathZ = optimizationPath.map(step => step.loss);
    
    // Path line in 3D
    traces.push({
      type: 'scatter3d',
      mode: 'lines+markers',
      x: pathX,
      y: pathY,
      z: pathZ,
      name: 'Optimization Path',
      line: {
        color: 'red',
        width: 4
      },
      marker: {
        color: 'red',
        size: 4,
        symbol: 'circle'
      },
      hovertemplate: 'Iteration: %{pointNumber}<br>x: %{x:.3f}<br>y: %{y:.3f}<br>Loss: %{z:.3f}<extra></extra>'
    });
    
    // Starting point
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [pathX[0]],
      y: [pathY[0]],
      z: [pathZ[0]],
      name: 'Start',
      marker: {
        color: 'green',
        size: 8,
        symbol: 'diamond'
      },
      hovertemplate: 'Start: (%{x:.3f}, %{y:.3f})<br>Loss: %{z:.3f}<extra></extra>'
    });
    
    // Ending point
    if (pathX.length > 1) {
      const lastIdx = pathX.length - 1;
      traces.push({
        type: 'scatter3d',
        mode: 'markers',
        x: [pathX[lastIdx]],
        y: [pathY[lastIdx]],
        z: [pathZ[lastIdx]],
        name: 'Current',
        marker: {
          color: 'yellow',
          size: 8,
          symbol: 'diamond'
        },
        hovertemplate: 'Current: (%{x:.3f}, %{y:.3f})<br>Loss: %{z:.3f}<extra></extra>'
      });
    }
  }
  
  return traces;
}

/**
 * Generate layout configuration for contour plot
 */
export function getContourPlotLayout(title?: string) {
  return {
    title: title ?? 'Loss Landscape (Contour)',
    xaxis: {
      title: 'Parameter 1 (x)',
      zeroline: true,
      zerolinecolor: 'rgba(255, 255, 255, 0.5)',
      gridcolor: 'rgba(255, 255, 255, 0.1)'
    },
    yaxis: {
      title: 'Parameter 2 (y)',
      zeroline: true,
      zerolinecolor: 'rgba(255, 255, 255, 0.5)',
      gridcolor: 'rgba(255, 255, 255, 0.1)'
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0.05)',
    paper_bgcolor: 'white',
    hovermode: 'closest',
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1,
      xanchor: 'left',
      yanchor: 'top'
    }
  };
}

/**
 * Generate layout configuration for 3D surface plot
 */
export function get3DSurfacePlotLayout(title?: string) {
  return {
    title: title ?? 'Loss Landscape (3D Surface)',
    scene: {
      xaxis: {
        title: 'Parameter 1 (x)',
        gridcolor: 'rgba(255, 255, 255, 0.3)',
        zerolinecolor: 'rgba(255, 255, 255, 0.5)'
      },
      yaxis: {
        title: 'Parameter 2 (y)',
        gridcolor: 'rgba(255, 255, 255, 0.3)',
        zerolinecolor: 'rgba(255, 255, 255, 0.5)'
      },
      zaxis: {
        title: 'Loss',
        gridcolor: 'rgba(255, 255, 255, 0.3)'
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.3 }
      }
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      xanchor: 'left',
      yanchor: 'top'
    }
  };
}

/**
 * Get plot configuration
 */
export function getPlotConfig() {
  return {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };
}
