/**
 * Soft Coding Utility: Safe Import Handler
 * Provides graceful fallbacks for missing dependencies and imports
 */

// Safe import wrapper with fallback mechanisms
export const SafeImport = {
  /**
   * Safely import toast functionality with fallback
   */
  getToastService: () => {
    try {
      // Try to import react-toastify
      const { toast } = require('react-toastify');
      return {
        success: (message) => toast.success(message),
        error: (message) => toast.error(message),
        info: (message) => toast.info(message),
        warning: (message) => toast.warning(message),
        isAvailable: true
      };
    } catch (error) {
      console.warn('react-toastify not available, using fallback toast service');
      // Fallback to console + alert for basic notifications
      return {
        success: (message) => {
          console.log('SUCCESS:', message);
          // Optional: show browser alert as fallback
          // alert(`Success: ${message}`);
        },
        error: (message) => {
          console.error('ERROR:', message);
          // Optional: show browser alert as fallback
          // alert(`Error: ${message}`);
        },
        info: (message) => {
          console.info('INFO:', message);
        },
        warning: (message) => {
          console.warn('WARNING:', message);
        },
        isAvailable: false
      };
    }
  },

  /**
   * Safely import chart libraries with fallback
   */
  getChartService: () => {
    try {
      const Chart = require('react-apexcharts');
      return {
        Chart: Chart.default || Chart,
        isAvailable: true
      };
    } catch (error) {
      console.warn('react-apexcharts not available, using fallback');
      return {
        Chart: null, // Return null for missing chart component
        isAvailable: false
      };
    }
  },

  /**
   * Generic safe import with custom fallback
   */
  safeImport: (importFunction, fallback, moduleName = 'module') => {
    try {
      return importFunction();
    } catch (error) {
      console.warn(`${moduleName} not available, using fallback:`, error.message);
      return fallback;
    }
  },

  /**
   * Check if a package is available without importing it
   */
  isPackageAvailable: (packageName) => {
    try {
      require.resolve(packageName);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get package info safely
   */
  getPackageInfo: (packageName) => {
    try {
      const packageJson = require(`${packageName}/package.json`);
      return {
        name: packageJson.name,
        version: packageJson.version,
        isAvailable: true
      };
    } catch (error) {
      return {
        name: packageName,
        version: 'unknown',
        isAvailable: false,
        error: error.message
      };
    }
  }
};

// Enhanced toast service with soft coding fallbacks
export const createSafeToastService = () => {
  const toastService = SafeImport.getToastService();
  
  return {
    ...toastService,
    
    // Enhanced methods with soft coding
    smartSuccess: (message, options = {}) => {
      const { duration = 3000, fallbackMethod = 'console' } = options;
      
      if (toastService.isAvailable) {
        toastService.success(message);
      } else {
        console.log(`✅ SUCCESS: ${message}`);
        if (fallbackMethod === 'alert') {
          setTimeout(() => alert(`Success: ${message}`), 100);
        }
      }
    },

    smartError: (message, options = {}) => {
      const { duration = 5000, fallbackMethod = 'console' } = options;
      
      if (toastService.isAvailable) {  
        toastService.error(message);
      } else {
        console.error(`❌ ERROR: ${message}`);
        if (fallbackMethod === 'alert') {
          setTimeout(() => alert(`Error: ${message}`), 100);
        }
      }
    },

    // Show dependency status
    showStatus: () => {
      const status = toastService.isAvailable ? 
        'Toast notifications are fully functional' : 
        'Using fallback notification system';
      
      console.info('Toast Service Status:', status);
      return status;
    }
  };
};

// Export for direct use
export const safeToast = createSafeToastService();

export default SafeImport;
