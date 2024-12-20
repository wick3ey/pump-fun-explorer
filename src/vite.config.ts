import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-portal', '@radix-ui/react-dismissable-layer'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "stream": "stream-browserify",
      "crypto": "crypto-browserify",
      "http": "stream-http",
      "https": "https-browserify",
      "zlib": "browserify-zlib",
      "buffer": "buffer",
      "process": "process/browser.js", // Updated path
      "util": "util",
      "assert": "assert",
      "fs": "memfs",
      "path": "path-browserify",
      "os": "os-browserify/browser",
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'Buffer': ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process/browser.js', // Updated path
      'memfs',
      'util',
      'assert',
      'stream-browserify',
      'path-browserify',
      'crypto-browserify',
      'os-browserify/browser',
      'browserify-zlib',
      'https-browserify',
      'stream-http',
    ],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      },
      define: {
        global: 'globalThis'
      }
    }
  }
}));