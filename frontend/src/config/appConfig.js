// Soft Coding Configuration for Radiology Application
// This file centralizes all configuration values to make the application more maintainable

// Environment Configuration
export const ENV_CONFIG = {
  // Development/Production Environment Detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  
  // Base URLs with fallbacks
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5177',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  
  // Feature Flags
  FEATURES: {
    enableChatbot: import.meta.env.VITE_ENABLE_CHATBOT !== 'false',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableCompliance: import.meta.env.VITE_ENABLE_COMPLIANCE !== 'false',
    enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    gracefulDegradation: import.meta.env.VITE_GRACEFUL_DEGRADATION !== 'false', // Enable by default
    defaultMedicalQuery: import.meta.env.VITE_DEFAULT_MEDICAL_QUERY || 'lung',
  }
};

// API Configuration
export const API_CONFIG = {
  // Timeouts
  TIMEOUT: {
    default: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    upload: parseInt(import.meta.env.VITE_UPLOAD_TIMEOUT) || 30000,
    download: parseInt(import.meta.env.VITE_DOWNLOAD_TIMEOUT) || 60000,
    medical: parseInt(import.meta.env.VITE_MEDICAL_API_TIMEOUT) || 8000,
    fast: parseInt(import.meta.env.VITE_FAST_API_TIMEOUT) || 5000,
  },
  
  // Retry Configuration
  RETRY: {
    attempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS) || 3,
    delay: parseInt(import.meta.env.VITE_RETRY_DELAY) || 1000,
  },
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Credentials
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS === 'true',
};

// Route Configuration
export const ROUTES = {
  // Authentication Routes
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Dashboard Routes
  DASHBOARD: {
    ROOT: '/dashboard',
    HOSPITAL_DASHBOARD_ONE: '/dashboard/hospital-dashboard-one',
    HOSPITAL_DASHBOARD_TWO: '/dashboard/hospital-dashboard-two',
    PATIENT_DASHBOARD: '/dashboard/patient-dashboard',
  },
  
  // Patient Management Routes
  PATIENTS: {
    ROOT: '/dashboard/patients',
    LIST: '/dashboard/patients',
    ADD: '/dashboard/patients/add',
    EDIT: '/dashboard/patients/edit',
    VIEW: '/dashboard/patients/view',
  },
  
  // Doctor Routes
  DOCTOR: {
    ROOT: '/doctor',
    DOCTORS_LIST: '/doctor/doctors-list',
    DOCTOR_DETAIL: '/doctor/doctor-detail',
    ADD_DOCTOR: '/doctor/add-doctor',
    EDIT_DOCTOR: '/doctor/edit-doctor',
  },
  
  // Report Routes
  REPORTS: {
    ROOT: '/reports',
    VIEW_REPORT: '/reports/view',
    CREATE_REPORT: '/reports/create',
    EDIT_REPORT: '/reports/edit',
    ANALYSIS: '/reports/analysis',
  },
  
  // Settings Routes
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    SECURITY: '/settings/security',
    PREFERENCES: '/settings/preferences',
    COMPLIANCE: '/settings/compliance',
  }
};

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    VERIFY: '/auth/verify/',
    USER_PROFILE: '/auth/user/',
    EMERGENCY_LOGIN: '/auth/emergency-login/',
    SIMPLE_LOGIN: '/auth/simple-login/',
  },
  
  // RBAC (Role-Based Access Control)
  RBAC: {
    USERS: {
      LIST: '/rbac/users/advanced/',
      CREATE: '/rbac/users/create-advanced/',
      UPDATE: '/rbac/users/update/',
      DELETE: '/rbac/users/delete/',
      BULK_ACTIONS: '/rbac/users/bulk/',
    },
    ROLES: {
      LIST: '/rbac/roles/',
      CREATE: '/rbac/roles/create/',
      UPDATE: '/rbac/roles/update/',
      DELETE: '/rbac/roles/delete/',
      PERMISSIONS: '/rbac/roles/permissions/',
    },
    DASHBOARD: {
      STATS: '/rbac/dashboard-stats/',
      ACTIVITY: '/rbac/activity/',
      SESSIONS: '/rbac/sessions/',
      SECURITY_ALERTS: '/rbac/security-alerts/',
    },
  },
  
  // Core API
  HEALTH: '/health/',
  VERSION: '/version/',
  TEST: '/test/',
  
  // Data Endpoints
  HISTORY: '/history/',
  DOCTORS: '/doctors/',
  PATIENTS: '/patients/',
  REPORTS: '/reports/',
  ANALYTICS: '/analytics/',
  
  // Upload/Download
  UPLOAD: '/upload/',
  DOWNLOAD: '/download/',
  
  // Chatbot
  CHATBOT: {
    CHAT: '/chatbot/chat/',
    HISTORY: '/chatbot/history/',
    CLEAR: '/chatbot/clear/',
  }
};

// UI Configuration
export const UI_CONFIG = {
  // Theme
  THEME: {
    default: import.meta.env.VITE_DEFAULT_THEME || 'light',
    options: ['light', 'dark', 'auto'],
  },
  
  // Language
  LANGUAGE: {
    default: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    supported: ['en', 'es', 'fr', 'de'],
  },
  
  // Pagination
  PAGINATION: {
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  
  // Toast/Notification Settings
  NOTIFICATIONS: {
    duration: parseInt(import.meta.env.VITE_NOTIFICATION_DURATION) || 5000,
    position: import.meta.env.VITE_NOTIFICATION_POSITION || 'top-right',
  },
  
  // Animation Settings
  ANIMATION: {
    enabled: import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false',
    duration: parseInt(import.meta.env.VITE_ANIMATION_DURATION) || 300,
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  // Token Management
  TOKEN: {
    key: import.meta.env.VITE_TOKEN_KEY || 'auth_token',
    expirationKey: import.meta.env.VITE_TOKEN_EXPIRY_KEY || 'token_expiry',
    refreshThreshold: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD) || 300000, // 5 minutes
  },
  
  // Session Management
  SESSION: {
    timeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
    warningTime: parseInt(import.meta.env.VITE_SESSION_WARNING) || 300000, // 5 minutes before timeout
  },
  
  // CSRF Protection
  CSRF: {
    enabled: import.meta.env.VITE_CSRF_ENABLED === 'true',
    headerName: import.meta.env.VITE_CSRF_HEADER || 'X-CSRFToken',
  }
};

// Compliance Configuration
export const COMPLIANCE_CONFIG = {
  // HIPAA Settings
  HIPAA: {
    enabled: import.meta.env.VITE_HIPAA_ENABLED !== 'false',
    auditLogging: import.meta.env.VITE_HIPAA_AUDIT === 'true',
    dataEncryption: import.meta.env.VITE_HIPAA_ENCRYPTION !== 'false',
  },
  
  // GDPR Settings
  GDPR: {
    enabled: import.meta.env.VITE_GDPR_ENABLED !== 'false',
    cookieConsent: import.meta.env.VITE_GDPR_COOKIES !== 'false',
    dataRetention: parseInt(import.meta.env.VITE_DATA_RETENTION_DAYS) || 365,
  },
  
  // Cookie Settings
  COOKIES: {
    enabled: import.meta.env.VITE_COOKIES_ENABLED !== 'false',
    version: import.meta.env.VITE_COOKIE_VERSION || '1.0',
    message: import.meta.env.VITE_COOKIE_MESSAGE || 'We use cookies to improve your experience.',
  }
};

// Error Handling Configuration
export const ERROR_CONFIG = {
  // Error Reporting
  REPORTING: {
    enabled: import.meta.env.VITE_ERROR_REPORTING === 'true',
    endpoint: import.meta.env.VITE_ERROR_ENDPOINT,
    includeStackTrace: import.meta.env.VITE_INCLUDE_STACK_TRACE !== 'false',
  },
  
  // Fallback Configuration
  FALLBACK: {
    enableMockAuth: import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true', // Disabled by default - only enable if explicitly set
    enableMockAPI: import.meta.env.VITE_ENABLE_MOCK_API !== 'false',
    mockCredentials: {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com'
    }
  },
  
  // Error Messages
  MESSAGES: {
    network: 'Network connection failed. Please check your internet connection.',
    server: 'Server error occurred. Please try again later.',
    authentication: 'Authentication failed. Please login again.',
    authorization: 'You are not authorized to perform this action.',
    validation: 'Please check your input and try again.',
    notFound: 'The requested resource was not found.',
    timeout: 'Request timed out. Please try again.',
    generic: 'An unexpected error occurred. Please try again.',
  }
};

// Helper Functions
export const ConfigHelpers = {
  // Get Route with Parameters
  getRoute: (routePath, params = {}) => {
    let route = routePath;
    Object.keys(params).forEach(key => {
      route = route.replace(`:${key}`, params[key]);
    });
    return route;
  },
  
  // Check if Route is Valid
  isValidRoute: (path) => {
    const allRoutes = Object.values(ROUTES).flatMap(section => 
      typeof section === 'string' ? [section] : Object.values(section)
    );
    return allRoutes.includes(path);
  },
  
  // Get API URL
  getApiUrl: (endpoint) => {
    return `${ENV_CONFIG.API_BASE_URL}${endpoint}`;
  },
  
  // Check Feature Flag
  isFeatureEnabled: (featureName) => {
    return ENV_CONFIG.FEATURES[featureName] || false;
  },
  
  // Get Environment Variable with Default
  getEnvVar: (key, defaultValue = null) => {
    return import.meta.env[key] || defaultValue;
  },
  
  // Validate Configuration
  validateConfig: () => {
    const requiredEnvVars = ['VITE_API_BASE_URL'];
    const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.warn('Missing environment variables:', missing);
    }
    
    return missing.length === 0;
  }
};

// Export all configurations
export default {
  ENV_CONFIG,
  API_CONFIG,
  ROUTES,
  API_ENDPOINTS,
  UI_CONFIG,
  SECURITY_CONFIG,
  COMPLIANCE_CONFIG,
  ERROR_CONFIG,
  ConfigHelpers
};
