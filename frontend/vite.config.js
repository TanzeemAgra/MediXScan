import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { sassSilencePlugin } from './vite-sass-silence-plugin.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode == "production" ? env.PUBLIC_URL : "/";
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8000';
  const isProduction = mode === 'production';

  return {
    base: baseUrl,
    plugins: [
      react(),
      sassSilencePlugin() // Custom plugin for complete SASS warning suppression
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@config': path.resolve(__dirname, './src/config'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    build: {
      outDir: "dist",
      minify: true,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            bootstrap: ['react-bootstrap'],
            charts: ['react-apexcharts', 'apexcharts'],
          }
        }
      },
      chunkSizeWarningLimit: 1000,
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Complete SASS warning suppression configuration
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api', 'import', 'color-functions', 'global-builtin'],
          quietDeps: true,
          verbose: false,
          charset: false,
          logger: {
            warn: () => {}, // Completely suppress SASS warnings
            debug: () => {}
          }
        }
      },
      devSourcemap: !isProduction,
    },
    server: {
      host: '0.0.0.0',
      port: 5175,
      hmr: {
        overlay: false
      },
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/token': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    logLevel: 'error', // Only show errors, suppress all warnings
    define: {
      __DEPLOYMENT_MODE__: JSON.stringify(isProduction),
      __SUPPRESS_SASS_WARNINGS__: JSON.stringify(true),
      'process.env.SASS_SILENCE_DEPRECATIONS': '"true"'
    }
  };
});