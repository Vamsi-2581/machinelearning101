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
        "/modules/*",
        "/sitemap.xml",
      ],
    },
  },

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
