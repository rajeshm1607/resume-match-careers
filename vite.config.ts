
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Enhanced source map configuration for React
      devTools: {
        autoRegistration: true,
      },
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: false, // Completely disable minification
    sourcemap: true, // Always generate source maps
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting
      }
    }
  },
  // Enhanced development configuration
  css: {
    devSourcemap: true,
  },
  // Explicitly enable source maps in all modes
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: true,
    },
  },
}));
