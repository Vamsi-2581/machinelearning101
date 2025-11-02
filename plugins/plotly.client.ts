/**
 * Plotly.js Client-Only Plugin
 * 
 * Ensures Plotly is only loaded on the client side to avoid SSR issues
 * with document/window access.
 */
export default defineNuxtPlugin(() => {
  // Plotly will be imported dynamically in components when needed
  // This plugin just ensures it's only loaded client-side
  if (process.client) {
    // Plugin loaded successfully on client
    return {
      provide: {
        plotlyReady: true
      }
    }
  }
})
