
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
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './', // This is crucial for Electron to load assets correctly when packaged
  build: {
    // Optimize production builds
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: false,
    outDir: 'dist', // Ensure the output directory is explicitly set
    assetsDir: 'assets', // Put assets in a subdirectory
    sourcemap: false, // Don't generate sourcemaps for production
    rollupOptions: {
      // External dependencies that should not be bundled
      output: {
        // Chunk vendor code
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'utils-vendor': ['date-fns', 'clsx', 'sonner', 'zod'],
          'chart-vendor': ['recharts']
        }
      }
    },
    // Improve chunk loading strategy
    chunkSizeWarningLimit: 1000,
  },
}));
