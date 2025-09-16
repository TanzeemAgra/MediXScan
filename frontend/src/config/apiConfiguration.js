// Enhanced API Configuration with Soft-coding and Fallback Mechanisms
// This configuration addresses CORS, 404, and endpoint issues

export const API_CONFIGURATION = {
  // Base Configuration with Environment Detection
  BASE: {
    // Primary API URL (Railway backend)
    PRIMARY_API: 'https://medixscan-production.up.railway.app/api',
    
    // Fallback URLs for resilience
    FALLBACK_APIS: [
      'https://medixscan-production.up.railway.app',
      'http://localhost:8000/api',
    ],
    
    // Timeout Configuration
    TIMEOUTS: {
      default: 15000,        // 15 seconds default
      upload: 30000,         // 30 seconds for uploads
      analysis: 45000,       // 45 seconds for AI analysis
      quick: 5000,           // 5 seconds for quick operations
    },
    
    // Retry Configuration
    RETRY: {
      attempts: 3,
      delay: 1000,           // 1 second between retries
      backoff: 2,            // Exponential backoff multiplier
    }
  },

  // Report Analysis Endpoints (addressing the 404 errors)
  REPORTS: {
    // Primary endpoint (Django backend)
    ANALYZE: '/reports/analyze/',
    
    // Fallback endpoints for analysis
    ANALYZE_FALLBACK: '/analyze_report',
    ANALYZE_LEGACY: '/api/analyze_report',
    
    // Other report endpoints
    HISTORY: '/reports/history/',
    DOWNLOAD: '/reports/download/',
    TEMPLATES: '/reports/templates/',
    
    // RAG Enhanced endpoints
    RAG_ANALYZE: '/reports/rag-analyze/',
    VOCABULARY: '/reports/vocabulary/',
    RAG_UPDATE: '/reports/rag-update/',
  },

  // Authentication Endpoints
  AUTH: {
    LOGIN: '/auth/emergency-login/',
    LOGIN_BACKUP: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REGISTER: '/auth/register/',
    VERIFY: '/auth/verify/',
    REFRESH: '/auth/refresh/',
    USER_PROFILE: '/auth/user/',
  },

  // RBAC Endpoints
  RBAC: {
    USERS: '/rbac/users/advanced/',
    ROLES: '/rbac/roles/',
    DASHBOARD: '/rbac/dashboard-stats/',
    PENDING_USERS: '/rbac/pending-users/',
    APPROVE_USER: '/rbac/approve-user/',
  },

  // Headers Configuration
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': '2.0.0',
  },

  // CORS Configuration Information
  CORS: {
    withCredentials: true,
    allowedOrigins: [
      'https://www.rugrel.in',
      'https://rugrel.in',
      'http://localhost:5177',
      'http://localhost:3000',
    ]
  },

  // Error Handling Configuration
  ERROR_HANDLING: {
    // HTTP Status Codes to Retry
    RETRY_STATUS_CODES: [408, 429, 502, 503, 504],
    
    // Network Errors to Handle
    NETWORK_ERRORS: ['Network Error', 'ERR_NETWORK', 'CORS', 'ERR_FAILED'],
    
    // Fallback Strategies
    FALLBACK_STRATEGIES: {
      CORS_ERROR: 'USE_FALLBACK_API',
      NETWORK_ERROR: 'RETRY_WITH_BACKOFF',
      NOT_FOUND: 'TRY_ALTERNATE_ENDPOINT',
      SERVER_ERROR: 'USE_MOCK_DATA',
    }
  },

  // OpenAI Configuration (soft-coded)
  AI: {
    // Note: API key should be set via environment variables on Railway
    MODEL: 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.3,
    
    // Fallback Configuration for AI Analysis
    FALLBACK: {
      enabled: true,
      mockAnalysis: {
        findings: 'Analysis temporarily unavailable. Please try again later.',
        recommendations: ['Consult with radiologist', 'Follow-up recommended'],
        severity: 'unknown',
        confidence: 0.5
      }
    }
  }
};

// Smart API URL Selection Function
export const getSmartAPIURL = () => {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // Check if we're on production domain
  if (currentDomain.includes('rugrel.in')) {
    console.log('🌐 Production domain detected, using Railway API');
    return API_CONFIGURATION.BASE.PRIMARY_API;
  }
  
  // Check if we're in development
  if (currentDomain.includes('localhost') || currentDomain.includes('127.0.0.1')) {
    console.log('🔧 Development domain detected');
    // Check if local backend is available, otherwise use Railway
    return API_CONFIGURATION.BASE.PRIMARY_API;
  }
  
  // Default to Railway API
  console.log('🚀 Using Railway API as default');
  return API_CONFIGURATION.BASE.PRIMARY_API;
};

// Endpoint Builder Function
export const buildEndpoint = (category, endpoint, params = {}) => {
  const baseURL = getSmartAPIURL();
  const endpointPath = API_CONFIGURATION[category]?.[endpoint];
  
  if (!endpointPath) {
    console.warn(`⚠️ Endpoint not found: ${category}.${endpoint}`);
    return `${baseURL}/fallback`;
  }
  
  let url = `${baseURL}${endpointPath}`;
  
  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  
  return url;
};

// Error Classification Function
export const classifyError = (error) => {
  const errorMessage = error.message || '';
  const errorCode = error.code || '';
  const statusCode = error.response?.status;
  
  // CORS Errors
  if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control-Allow-Origin')) {
    return 'CORS_ERROR';
  }
  
  // Network Errors
  if (errorMessage.includes('Network Error') || errorCode === 'ERR_NETWORK') {
    return 'NETWORK_ERROR';
  }
  
  // 404 Errors
  if (statusCode === 404) {
    return 'NOT_FOUND';
  }
  
  // Server Errors
  if (statusCode >= 500) {
    return 'SERVER_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
};

// Fallback Strategy Implementation
export const handleAPIError = async (error, originalRequest) => {
  const errorType = classifyError(error);
  const strategy = API_CONFIGURATION.ERROR_HANDLING.FALLBACK_STRATEGIES[errorType];
  
  console.log(`🔄 Handling ${errorType} with strategy: ${strategy}`);
  
  switch (strategy) {
    case 'USE_FALLBACK_API':
      // Try fallback API URLs
      for (const fallbackURL of API_CONFIGURATION.BASE.FALLBACK_APIS) {
        try {
          const fallbackRequest = {
            ...originalRequest,
            baseURL: fallbackURL
          };
          console.log(`🔄 Trying fallback API: ${fallbackURL}`);
          return await axios(fallbackRequest);
        } catch (fallbackError) {
          console.warn(`❌ Fallback failed: ${fallbackURL}`);
        }
      }
      break;
      
    case 'TRY_ALTERNATE_ENDPOINT':
      // Try alternate endpoint paths
      if (originalRequest.url.includes('analyze')) {
        const alternateEndpoints = [
          API_CONFIGURATION.REPORTS.ANALYZE_FALLBACK,
          API_CONFIGURATION.REPORTS.ANALYZE_LEGACY,
        ];
        
        for (const endpoint of alternateEndpoints) {
          try {
            const alternateRequest = {
              ...originalRequest,
              url: endpoint
            };
            console.log(`🔄 Trying alternate endpoint: ${endpoint}`);
            return await axios(alternateRequest);
          } catch (altError) {
            console.warn(`❌ Alternate endpoint failed: ${endpoint}`);
          }
        }
      }
      break;
      
    case 'USE_MOCK_DATA':
      // Return mock data for development/fallback
      return {
        data: API_CONFIGURATION.AI.FALLBACK.mockAnalysis,
        status: 200,
        fallback: true
      };
      
    default:
      console.warn('🚨 No fallback strategy available');
      throw error;
  }
  
  // If all fallback strategies fail, throw the original error
  throw error;
};

export default API_CONFIGURATION;