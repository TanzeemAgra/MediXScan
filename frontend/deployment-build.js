#!/usr/bin/env node

/**
 * Production Build Script with Warning Suppression
 * Soft-coded approach to handle deployment builds without warnings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Deployment configuration
const deploymentConfig = {
  // Suppress SASS warnings during build
  suppressWarnings: true,
  
  // Build optimization settings
  optimizations: {
    minify: true,
    sourceMaps: false,
    compression: true,
    bundleAnalysis: true
  },
  
  // Output configuration
  output: {
    directory: 'dist',
    cleanBefore: true,
    generateReport: true
  }
};

/**
 * Console logger with colors
 */
const logger = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.blue}🚀 ${msg}${colors.reset}`)
};

/**
 * Clean previous build
 */
function cleanBuild() {
  logger.step('Cleaning previous build...');
  const distPath = path.join(process.cwd(), deploymentConfig.output.directory);
  
  if (fs.existsSync(distPath)) {
    try {
      execSync(`rm -rf ${distPath}`, { stdio: 'inherit' });
      logger.success('Previous build cleaned');
    } catch (error) {
      // Fallback for Windows
      try {
        execSync(`rmdir /s /q ${distPath}`, { stdio: 'inherit' });
        logger.success('Previous build cleaned');
      } catch (winError) {
        logger.warning('Could not clean previous build, continuing...');
      }
    }
  }
}

/**
 * Set deployment environment variables
 */
function setEnvironmentVariables() {
  logger.step('Setting deployment environment variables...');
  
  process.env.NODE_ENV = 'production';
  process.env.SUPPRESS_SASS_WARNINGS = 'true';
  process.env.DEPLOYMENT_MODE = 'true';
  process.env.BUILD_OPTIMIZATION = 'true';
  
  logger.success('Environment variables configured');
}

/**
 * Suppress SASS warnings during build
 */
function suppressSassWarnings() {
  logger.step('Configuring SASS warning suppression...');
  
  // Create temporary warning suppression script
  const suppressScript = `
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.warn = function(message, ...args) {
      if (typeof message === 'string' && (
        message.includes('Deprecation Warning') ||
        message.includes('legacy-js-api') ||
        message.includes('sass-lang.com/d/') ||
        message.includes('[import]') ||
        message.includes('[color-functions]') ||
        message.includes('[global-builtin]') ||
        message.includes('repetitive deprecation warnings omitted')
      )) {
        return; // Suppress SASS warnings
      }
      originalConsoleWarn.apply(console, [message, ...args]);
    };
    
    console.error = function(message, ...args) {
      if (typeof message === 'string' && (
        message.includes('Deprecation Warning') ||
        message.includes('repetitive deprecation warnings omitted')
      )) {
        return; // Suppress SASS errors
      }
      originalConsoleError.apply(console, [message, ...args]);
    };
  `;
  
  // Write suppression script
  fs.writeFileSync('suppress-warnings.js', suppressScript);
  logger.success('SASS warning suppression configured');
}

/**
 * Run production build
 */
function runProductionBuild() {
  logger.step('Starting production build...');
  
  try {
    // Run build with warning suppression
    const buildCommand = `node -r ./suppress-warnings.js node_modules/vite/bin/vite.js build`;
    
    execSync(buildCommand, { 
      stdio: 'pipe',
      env: { 
        ...process.env,
        NODE_ENV: 'production',
        SUPPRESS_SASS_WARNINGS: 'true'
      }
    });
    
    logger.success('Production build completed successfully!');
  } catch (error) {
    logger.error('Build failed');
    
    // Clean up suppression script
    if (fs.existsSync('suppress-warnings.js')) {
      fs.unlinkSync('suppress-warnings.js');
    }
    
    process.exit(1);
  }
}

/**
 * Clean up temporary files
 */
function cleanup() {
  logger.step('Cleaning up temporary files...');
  
  if (fs.existsSync('suppress-warnings.js')) {
    fs.unlinkSync('suppress-warnings.js');
  }
  
  logger.success('Cleanup completed');
}

/**
 * Generate build report
 */
function generateBuildReport() {
  logger.step('Generating build report...');
  
  const distPath = path.join(process.cwd(), deploymentConfig.output.directory);
  
  if (fs.existsSync(distPath)) {
    try {
      // Get build statistics
      const stats = fs.statSync(distPath);
      const files = fs.readdirSync(distPath, { recursive: true });
      
      const report = {
        timestamp: new Date().toISOString(),
        buildMode: 'production',
        warningsSuppressed: true,
        optimization: deploymentConfig.optimizations,
        files: files.length,
        buildDirectory: distPath,
        status: 'success'
      };
      
      // Write build report
      fs.writeFileSync(
        path.join(distPath, 'build-report.json'), 
        JSON.stringify(report, null, 2)
      );
      
      logger.success('Build report generated');
      logger.info(`📊 Build completed with ${files.length} files`);
      logger.info(`📁 Output directory: ${distPath}`);
      
    } catch (error) {
      logger.warning('Could not generate build report');
    }
  }
}

/**
 * Main deployment build function
 */
function main() {
  console.log(`${colors.magenta}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         🚀 DEPLOYMENT BUILD WITH WARNING SUPPRESSION     ║
║                                                          ║
║         Radiology v2 - Production Ready Build           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // Step 1: Clean previous build
    if (deploymentConfig.output.cleanBefore) {
      cleanBuild();
    }
    
    // Step 2: Set environment variables
    setEnvironmentVariables();
    
    // Step 3: Configure SASS warning suppression
    if (deploymentConfig.suppressWarnings) {
      suppressSassWarnings();
    }
    
    // Step 4: Run production build
    runProductionBuild();
    
    // Step 5: Generate build report
    if (deploymentConfig.output.generateReport) {
      generateBuildReport();
    }
    
    // Step 6: Cleanup
    cleanup();
    
    // Success message
    console.log(`${colors.green}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         ✅ DEPLOYMENT BUILD COMPLETED SUCCESSFULLY!      ║
║                                                          ║
║         🎉 Ready for production deployment               ║
║         📦 All SASS warnings suppressed                 ║
║         🚀 Optimized for performance                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}`);
    
  } catch (error) {
    logger.error(`Deployment build failed: ${error.message}`);
    
    // Cleanup on error
    cleanup();
    
    process.exit(1);
  }
}

// Execute main function if script is run directly
if (require.main === module) {
  main();
}

module.exports = { main, deploymentConfig, logger };
