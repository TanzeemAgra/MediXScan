// System Configuration - Central Error Handling and Global Settings
const systemConfig = {
  // Application metadata
  app: {
    name: "MediXscan AI",
    version: "2.0.0",
    environment: process.env.NODE_ENV || 'development',
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  },

  // Error handling configuration
  errorHandling: {
    // Global error types
    types: {
      NETWORK_ERROR: 'NETWORK_ERROR',
      VALIDATION_ERROR: 'VALIDATION_ERROR',
      AUTH_ERROR: 'AUTH_ERROR',
      SERVER_ERROR: 'SERVER_ERROR',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    },

    // Error messages
    messages: {
      NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      AUTH_ERROR: 'Authentication failed. Please sign in again.',
      SERVER_ERROR: 'A server error occurred. Our team has been notified.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
      DEFAULT: 'Something went wrong. Please try again later.'
    },

    // Error recovery actions
    recovery: {
      NETWORK_ERROR: {
        action: 'retry',
        message: 'Click to retry',
        maxRetries: 3
      },
      AUTH_ERROR: {
        action: 'redirect',
        path: '/auth/sign-in',
        message: 'Please sign in again'
      },
      SERVER_ERROR: {
        action: 'report',
        message: 'Report this issue'
      }
    }
  },

  // Loading states configuration
  loading: {
    spinner: {
      size: 'sm',
      variant: 'primary'
    },
    messages: {
      default: 'Loading...',
      authenticating: 'Signing you in...',
      processing: 'Processing your request...',
      saving: 'Saving...',
      uploading: 'Uploading...',
      analyzing: 'Analyzing report...'
    }
  },

  // Notification system
  notifications: {
    position: 'top-right',
    duration: 5000,
    types: {
      success: {
        icon: 'fas fa-check-circle',
        bgColor: '#28a745',
        textColor: '#ffffff'
      },
      error: {
        icon: 'fas fa-exclamation-triangle',
        bgColor: '#dc3545',
        textColor: '#ffffff'
      },
      warning: {
        icon: 'fas fa-exclamation-circle',
        bgColor: '#ffc107',
        textColor: '#212529'
      },
      info: {
        icon: 'fas fa-info-circle',
        bgColor: '#17a2b8',
        textColor: '#ffffff'
      }
    }
  },

  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password'
      },
      reports: {
        analyze: '/reports/analyze',
        list: '/reports',
        view: '/reports/{id}',
        delete: '/reports/{id}'
      },
      user: {
        profile: '/user/profile',
        update: '/user/update',
        changePassword: '/user/change-password'
      }
    }
  },

  // Security configuration
  security: {
    tokenKey: 'medixscan_auth_token',
    refreshTokenKey: 'medixscan_refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    }
  },

  // Feature flags
  features: {
    multiDoctorSupport: true,
    aiAnalysis: true,
    darkMode: true,
    notifications: true,
    exportReports: true,
    reportSharing: false // Coming soon
  },

  // Performance configuration
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    caching: {
      enabled: true,
      duration: 5 * 60 * 1000 // 5 minutes
    }
  }
};

// Helper functions for error handling
export const getErrorMessage = (error, fallback = null) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.statusText) return error.response.statusText;
  return fallback || systemConfig.errorHandling.messages.DEFAULT;
};

export const getErrorType = (error) => {
  if (!error) return systemConfig.errorHandling.types.UNKNOWN_ERROR;
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
    return systemConfig.errorHandling.types.NETWORK_ERROR;
  }
  
  if (error.response?.status === 401 || error.response?.status === 403) {
    return systemConfig.errorHandling.types.AUTH_ERROR;
  }
  
  if (error.response?.status >= 500) {
    return systemConfig.errorHandling.types.SERVER_ERROR;
  }
  
  if (error.response?.status >= 400) {
    return systemConfig.errorHandling.types.VALIDATION_ERROR;
  }
  
  return systemConfig.errorHandling.types.UNKNOWN_ERROR;
};

export const getRecoveryAction = (errorType) => {
  return systemConfig.errorHandling.recovery[errorType] || null;
};

export const isFeatureEnabled = (featureName) => {
  return systemConfig.features[featureName] || false;
};

export default systemConfig;
