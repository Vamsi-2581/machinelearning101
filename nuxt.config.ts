// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  // Component auto-import configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Global CSS
  css: [
    "~/assets/css/accessibility.css",
    "~/assets/css/animations.css",
    "~/assets/css/utilities.css",
    "~/assets/css/mobile.css",
  ],

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // Path aliases (Nuxt provides these by default, but explicitly defining for clarity)
  alias: {
    "@": ".",
    "~": ".",
    algorithms: "./algorithms",
    components: "./components",
    composables: "./composables",
    stores: "./stores",
    types: "./types",
    utils: "./utils",
  },

  // Static site generation configuration
  ssr: false,
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/about",
        "/why-learn-here",
        "/contact",
        "/privacy",
        "/faq",
        "/getting-started",
        "/modules",
        "/modules/regression",
        "/modules/regression/linear-regression",
        "/modules/classification",
        "/modules/classification/logistic-regression",
        "/modules/clustering",
        "/modules/clustering/k-means",
        "/modules/preprocessing",
        "/modules/preprocessing/feature-scaling",
        "/modules/preprocessing/missing-value-imputation",
        "/modules/optimization",
        "/modules/optimization/gradient-descent",
        "/modules/advanced",
        "/modules/advanced/neural-network",
        "/modules/advanced/pca",
        "/modules/advanced/tsne",
        "/sitemap.xml",
      ],
    },
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      // Plausible Analytics configuration
      // Set via environment variables:
      // NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
      // NUXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io (optional)
      plausibleDomain: "",
      plausibleHost: "https://plausible.io",
    },
  },

  // Vite configuration for optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Visualization libraries - lazy loaded per module
            if (id.includes("plotly.js")) {
              return "viz-plotly";
            }
            if (id.includes("d3")) {
              return "viz-d3";
            }
            if (id.includes("chart.js")) {
              return "viz-chart";
            }

            // Algorithm domain chunks
            if (id.includes("/algorithms/regression/")) {
              return "algorithms-regression";
            }
            if (id.includes("/algorithms/classification/")) {
              return "algorithms-classification";
            }
            if (id.includes("/algorithms/clustering/")) {
              return "algorithms-clustering";
            }
            if (id.includes("/algorithms/preprocessing/")) {
              return "algorithms-preprocessing";
            }
            if (id.includes("/algorithms/optimization/")) {
              return "algorithms-optimization";
            }
            if (id.includes("/algorithms/advanced/")) {
              return "algorithms-advanced";
            }

            // Visualization components
            if (id.includes("/components/visualizations/")) {
              return "components-visualizations";
            }

            // Module components
            if (id.includes("/components/modules/")) {
              return "components-modules";
            }

            // Shared components stay in main bundle for reusability
            // Node modules (except visualization libs) go to vendor
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
});
