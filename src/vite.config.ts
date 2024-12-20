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
    sourcemap: false, // Disable sourcemaps to avoid related errors
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-portal', '@radix-ui/react-dismissable-layer'],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      stream: 'readable-stream',
      http: 'stream-http',
      https: 'https-browserify',
      process: 'process/browser',
      zlib: 'browserify-zlib',
      util: 'util',
      url: 'url',
      assert: 'assert',
      crypto: 'crypto-browserify',
      os: 'os-browserify',
      path: 'path-browserify',
      vm: 'vm-browserify',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    Buffer: ['buffer', 'Buffer'],
  },
}));