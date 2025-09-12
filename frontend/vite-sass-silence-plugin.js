/**
 * Vite Plugin: Complete SASS Warning Suppression
 * Aggressively suppresses all SASS deprecation warnings at multiple levels
 */

import { spawn } from 'child_process';

export function sassSilencePlugin() {
  return {
    name: 'sass-silence-plugin',
    configureServer(server) {
      // Override console methods during development
      const originalConsoleWarn = console.warn;
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;

      // SASS warning patterns to suppress
      const suppressPatterns = [
        /Deprecation Warning/i,
        /legacy-js-api/i,
        /import.*deprecated/i,
        /color-functions.*deprecated/i,
        /global-builtin.*deprecated/i,
        /repetitive deprecation warnings omitted/i,
        /sass.*@import.*deprecated/i,
        /red\(\).*deprecated/i,
        /green\(\).*deprecated/i,
        /blue\(\).*deprecated/i
      ];

      function shouldSuppress(message) {
        if (typeof message !== 'string') return false;
        return suppressPatterns.some(pattern => pattern.test(message));
      }

      console.warn = (...args) => {
        const message = args.join(' ');
        if (!shouldSuppress(message)) {
          originalConsoleWarn.apply(console, args);
        }
      };

      console.log = (...args) => {
        const message = args.join(' ');
        if (!shouldSuppress(message)) {
          originalConsoleLog.apply(console, args);
        }
      };

      console.error = (...args) => {
        const message = args.join(' ');
        if (!shouldSuppress(message)) {
          originalConsoleError.apply(console, args);
        }
      };

      // Override process stderr to catch SASS warnings
      const originalStderrWrite = process.stderr.write;
      process.stderr.write = function(chunk, encoding, callback) {
        const message = chunk.toString();
        if (!shouldSuppress(message)) {
          return originalStderrWrite.call(this, chunk, encoding, callback);
        }
        // Return true to indicate successful write (but suppress output)
        if (typeof callback === 'function') callback();
        return true;
      };

      console.log('🔇 SASS Warning Suppression Plugin Activated');
    },

    buildStart() {
      // Suppress warnings during build
      process.env.SASS_SILENCE_DEPRECATIONS = 'true';
    }
  };
}
