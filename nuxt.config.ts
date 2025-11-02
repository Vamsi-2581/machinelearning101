// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-gtag",
    '@pinia/nuxt', // required
    'pinia-plugin-persistedstate/nuxt',
  ],

  // Component auto-import configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Plugins configuration
  plugins: [
    { src: '~/plugins/plotly.client', mode: 'client' },
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
  ssr: true,
  // nitro: {
  //   prerender: {
  //     routes: [
  //       "/",
  //       "/about",
  //       "/why-learn-here",
  //       "/contact",
  //       "/privacy",
  //       "/faq",
  //       "/getting-started",
  //       "/modules",
  //       "/modules/*",
  //       "/sitemap.xml",
  //     ],
  //   },
  // },

  // Google Analytics configuration
  
  
  gtag: {
    // Set via environment variable: NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
    id: process.env.NUXT_PUBLIC_GTAG_ID || "",
    initMode: "manual", // Manual initialization for GDPR compliance
    initCommands: [
      // Setup consent mode v2 - default to denied
      [
        "consent",
        "default",
        {
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
          analytics_storage: "denied",
          wait_for_update: 500,
        },
      ],
    ],
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      // API URL for authentication backend
      // Set via environment variable:
      // NUXT_PUBLIC_API_URL=https://api.yourdomain.com
      apiUrl: "",
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
            // New domain chunks for performance optimization
            if (id.includes("/algorithms/computer-vision/")) {
              return "algorithms-computer-vision";
            }
            if (id.includes("/algorithms/nlp/")) {
              return "algorithms-nlp";
            }
            if (id.includes("/algorithms/reinforcement-learning/")) {
              return "algorithms-reinforcement-learning";
            }

            // Visualization components - split by domain for better loading
            if (id.includes("/components/visualizations/BoundingBoxOverlay") ||
                id.includes("/components/visualizations/ConvolutionVisualizer") ||
                id.includes("/components/visualizations/SegmentationMask")) {
              return "viz-computer-vision";
            }
            if (id.includes("/components/visualizations/TextHighlighter") ||
                id.includes("/components/visualizations/EmbeddingProjection") ||
                id.includes("/components/visualizations/SequenceDisplay")) {
              return "viz-nlp";
            }
            if (id.includes("/components/visualizations/EnvironmentRenderer") ||
                id.includes("/components/visualizations/QValueHeatmap") ||
                id.includes("/components/visualizations/PolicyVisualization") ||
                id.includes("/components/visualizations/RewardCurve")) {
              return "viz-reinforcement-learning";
            }
            // General visualization components
            if (id.includes("/components/visualizations/")) {
              return "viz-general";
            }

            // Module components
            if (id.includes("/components/modules/")) {
              return "components-modules";
            }

            // Route-based code splitting for module pages
            if (id.includes("/pages/modules/computer-vision/")) {
              return "pages-computer-vision";
            }
            if (id.includes("/pages/modules/nlp/")) {
              return "pages-nlp";
            }
            if (id.includes("/pages/modules/reinforcement-learning/")) {
              return "pages-reinforcement-learning";
            }
            if (id.includes("/pages/modules/regression/")) {
              return "pages-regression";
            }
            if (id.includes("/pages/modules/classification/")) {
              return "pages-classification";
            }
            if (id.includes("/pages/modules/clustering/")) {
              return "pages-clustering";
            }
            if (id.includes("/pages/modules/preprocessing/")) {
              return "pages-preprocessing";
            }
            if (id.includes("/pages/modules/optimization/")) {
              return "pages-optimization";
            }
            if (id.includes("/pages/modules/advanced/")) {
              return "pages-advanced";
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
