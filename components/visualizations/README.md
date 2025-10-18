# Visualization Components

This directory contains interactive visualization components for the ML learning platform. All components are built with performance and accessibility in mind.

## Components

### BaseChart
Base wrapper component for Plotly.js visualizations with reactive updates, loading states, and error handling.

**Features:**
- Reactive data updates
- Loading and error states
- Responsive sizing with ResizeObserver
- Event emissions (click, hover, selection)
- Automatic cleanup

**Usage:**
```vue
<BaseChart
  :data="plotlyData"
  :layout="plotlyLayout"
  :config="plotlyConfig"
  :loading="false"
  :error="null"
  height="500px"
  @plotly-click="handleClick"
/>
```

### Scatter2D
2D scatter plot component with multiple series support.

**Features:**
- Multiple series with different colors
- Hover tooltips with data point info
- Zoom and pan interactions
- Customizable markers
- Legend support

**Usage:**
```vue
<Scatter2D
  :series="[
    { x: [1,2,3], y: [2,4,3], name: 'Series 1', color: '#3b82f6' }
  ]"
  title="My Scatter Plot"
  x-label="Feature X"
  y-label="Feature Y"
  :show-legend="true"
/>
```

### LineChart
Line chart component for loss curves and training metrics.

**Features:**
- Multiple lines with legend
- Different line styles (solid, dash, dot)
- Optional markers
- Log scale support
- Unified hover mode

**Usage:**
```vue
<LineChart
  :series="[
    { x: [0,1,2], y: [10,8,6], name: 'Loss', color: '#3b82f6' }
  ]"
  title="Training Progress"
  x-label="Epoch"
  y-label="Loss"
  :log-scale="false"
/>
```

### Heatmap
Heatmap visualization for confusion matrices and correlation matrices.

**Features:**
- Color scale with legend
- Cell value annotations
- Custom labels for axes
- Configurable colorscale
- Automatic text color adjustment

**Usage:**
```vue
<Heatmap
  :data="[[1,20,30], [20,1,60], [30,60,1]]"
  :x-labels="['A', 'B', 'C']"
  :y-labels="['A', 'B', 'C']"
  title="Confusion Matrix"
  :show-annotations="true"
/>
```

### Plot3D
3D scatter and surface plot component.

**Features:**
- 3D scatter plots with multiple series
- 3D surface plots
- Rotation and zoom controls
- Customizable camera position
- Interactive exploration

**Usage:**
```vue
<!-- 3D Scatter -->
<Plot3D
  type="scatter"
  :scatter-series="[
    { x: [1,2,3], y: [2,4,3], z: [1,3,2], name: 'Data', color: '#3b82f6' }
  ]"
  x-label="X" y-label="Y" z-label="Z"
/>

<!-- 3D Surface -->
<Plot3D
  type="surface"
  :surface-data="{ x: [...], y: [...], z: [[...]] }"
  x-label="X" y-label="Y" z-label="Z"
/>
```

### CanvasScatter
High-performance canvas-based scatter plot for large datasets (>1000 points).

**Features:**
- Optimized for 60fps rendering
- Zoom and pan with requestAnimationFrame
- Handles thousands of points smoothly
- Interactive tooltips
- Reset/zoom controls

**Usage:**
```vue
<CanvasScatter
  :series="[
    { x: [...1500 points], y: [...1500 points], name: 'Cluster 1', color: '#3b82f6', size: 3 }
  ]"
  x-label="Feature X"
  y-label="Feature Y"
  :show-grid="true"
/>
```

## Performance Considerations

- **Small datasets (<1000 points)**: Use Plotly-based components (Scatter2D, LineChart, etc.)
- **Large datasets (>1000 points)**: Use CanvasScatter for better performance
- All components use requestAnimationFrame for smooth animations
- Plotly components automatically handle responsive resizing
- Canvas component uses manual optimization for 60fps

## Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation support (via Plotly)
- High contrast colors
- Responsive design
- Loading and error states

## Demo

Visit `/visualizations-demo` to see all components in action with sample data.

## Type Definitions

See `types/visualization.ts` for TypeScript interfaces and type definitions.
