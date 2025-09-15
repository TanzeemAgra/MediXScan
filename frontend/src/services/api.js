import axios from 'axios';
import { ENV_CONFIG, API_CONFIG, API_ENDPOINTS, ERROR_CONFIG, SECURITY_CONFIG, ConfigHelpers } from '../config/appConfig.js';
import { smartAPIManager } from '../config/smartApiConfig.js';

// Log smart API configuration for debugging
console.log('🌐 Using API base URL:', ENV_CONFIG.API_BASE_URL);
console.log('🔄 Fallback API URL:', ENV_CONFIG.FALLBACK_API_URL);
console.log('🏠 Current domain:', ENV_CONFIG.CURRENT_DOMAIN);

// Create axios instance with smart API configuration
const api = axios.create({
  baseURL: ENV_CONFIG.API_BASE_URL,
  headers: API_CONFIG.HEADERS,
  withCredentials: API_CONFIG.withCredentials,
  timeout: API_CONFIG.TIMEOUT.default
});

// Export the base api instance for use in other services
export { api };

// Add a request interceptor for debugging (soft-coded)
if (ENV_CONFIG.FEATURES.enableDebugMode) {
  api.interceptors.request.use(request => {
    console.log('Starting Request:', request)
    return request
  })
}

// Add a response interceptor with smart error handling and fallback
api.interceptors.response.use(
  response => {
    if (ENV_CONFIG.FEATURES.enableDebugMode) {
      console.log('✅ API Response Success:', response.config.url)
    }
    return response
  },
  async error => {
    if (ENV_CONFIG.FEATURES.enableDebugMode) {
      console.log('❌ API Response Error:', error.config?.url, error.message)
    }
    
    // Check if this is a network error that might benefit from fallback
    if (error.code === 'ECONNABORTED' || error.message.includes('Network Error') || 
        error.response?.status >= 500) {
      
      console.log('🔄 Network error detected, checking fallback options...');
      
      // If we have a fallback URL and this wasn't already a fallback attempt
      if (ENV_CONFIG.FALLBACK_API_URL && 
          !error.config.url.includes(ENV_CONFIG.FALLBACK_API_URL.replace('/api', ''))) {
        
        console.log(`🔄 Attempting fallback API: ${ENV_CONFIG.FALLBACK_API_URL}`);
        
        // Create new config with fallback URL
        const fallbackConfig = {
          ...error.config,
          baseURL: ENV_CONFIG.FALLBACK_API_URL,
          url: error.config.url.replace(error.config.baseURL, '')
        };
        
        try {
          const fallbackResponse = await axios(fallbackConfig);
          console.log('✅ Fallback API succeeded');
          return fallbackResponse;
        } catch (fallbackError) {
          console.log('❌ Fallback API also failed:', fallbackError.message);
        }
      }
    }
    
    // Soft-coded error messages
    const errorMessage = getErrorMessage(error);
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error)
  }
);

// Helper function to get error messages (soft-coded)
const getErrorMessage = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return ERROR_CONFIG.MESSAGES.validation;
      case 401:
        return ERROR_CONFIG.MESSAGES.authentication;
      case 403:
        return ERROR_CONFIG.MESSAGES.authorization;
      case 404:
        return ERROR_CONFIG.MESSAGES.notFound;
      case 500:
        return ERROR_CONFIG.MESSAGES.server;
      default:
        return ERROR_CONFIG.MESSAGES.generic;
    }
  } else if (error.request) {
    return ERROR_CONFIG.MESSAGES.network;
  }
  return ERROR_CONFIG.MESSAGES.generic;
};

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Soft-coded: accept multiple token storage keys for compatibility
    const tokenKeys = [
      (SECURITY_CONFIG && SECURITY_CONFIG.TOKEN && SECURITY_CONFIG.TOKEN.key) || 'auth_token',
      'authToken',
      'auth_token',
      'token',
      'access',
      'accessToken'
    ];

    let token = null;
    for (const key of tokenKeys) {
      try {
        const t = localStorage.getItem(key);
        if (t) {
          token = t;
          break;
        }
      } catch (err) {
        // ignore storage access errors
      }
    }

    if (token) {
      // If token looks like a JWT (contains a dot), prefer Bearer; otherwise use Token prefix for Django TokenAuth
      const authPrefix = token.includes('.') ? 'Bearer' : 'Token';
      config.headers.Authorization = `${authPrefix} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      return Promise.reject(new Error('Network Error: Unable to connect to the server. Please check your internet connection.'));
    }
    return Promise.reject(error);
  }
);

// ===============================================
// API FUNCTIONS WITH SOFT CODING
// ===============================================

// Authentication API Functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
};

// System API Functions
export const systemAPI = {
  health: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
  
  version: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VERSION);
      return response.data;
    } catch (error) {
      console.error('Version check failed:', error);
      throw error;
    }
  },
  
  test: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.TEST);
      return response.data;
    } catch (error) {
      console.error('API test failed:', error);
      throw error;
    }
  }
};

// Data API Functions
export const dataAPI = {
  getHistory: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.HISTORY);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  },
  
  getDoctors: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DOCTORS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  },
  
  getPatients: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PATIENTS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  },
  
  getReports: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error;
    }
  }
};

// Test OpenAI connection (updated with soft coding)
export const testOpenAIConnection = async () => {
  try {
    const response = await api.get('/test-openai'); // This endpoint might need to be added to API_ENDPOINTS
    return response.data;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    throw error;
  }
};

// Authentication (Soft-coded with multiple endpoint fallback)
export const login = async (loginId, password) => {
  // Soft-coded login data validation
  const validateLoginData = (email, pwd) => {
    if (!email || !pwd) {
      throw new Error(ERROR_CONFIG.MESSAGES.validation);
    }
    if (email.length < 3 || pwd.length < 1) {
      throw new Error('Email and password must be provided');
    }
    return true;
  };

  try {
    // Validate input
    validateLoginData(loginId, password);
    
    // Soft-coded login data with multiple field formats for compatibility
    const loginData = {
      // Primary format (backend expects 'username')
      username: loginId.trim(),
      password: password,
      
      // Alternative formats for compatibility
      email: loginId.trim().toLowerCase(),
      loginId: loginId.trim(),
      
      // Additional metadata for backend processing
      loginType: 'standard',
      clientTimestamp: new Date().toISOString()
    };

    console.log('🔑 Login attempt for:', loginId);
    console.log('🌐 Using API base URL:', ENV_CONFIG.API_BASE_URL);

    // Soft-coded endpoint selection with fallback
    const loginEndpoints = [
      API_ENDPOINTS.AUTH.LOGIN,           // '/auth/login/'
      '/auth/emergency-login/',           // Emergency fallback
      '/auth/simple-login/'              // Simple fallback
    ];

    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of loginEndpoints) {
      try {
        console.log(`🔄 Attempting login via: ${endpoint}`);
        
        const response = await api.post(endpoint, loginData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: API_CONFIG.TIMEOUT.default,
        });

        console.log('✅ Login response:', response.data);

        // Soft-coded token handling
        if (response.data && response.data.token) {
          // Store authentication data securely
          localStorage.setItem(SECURITY_CONFIG.TOKEN.key, response.data.token);
          localStorage.setItem('username', loginId);
          localStorage.setItem('user_email', loginId);
          
          // Set token expiry if provided
          if (response.data.expires) {
            localStorage.setItem(SECURITY_CONFIG.TOKEN.expirationKey, response.data.expires);
          }
          
          console.log('🎉 Login successful via:', endpoint);
          return response.data;
        } else {
          throw new Error('No token received in response');
        }
        
      } catch (endpointError) {
        console.warn(`❌ Login failed via ${endpoint}:`, endpointError.response?.data || endpointError.message);
        lastError = endpointError;
        continue; // Try next endpoint
      }
    }
    
    // Enhanced fallback logic: check if we should use mock authentication
    // Only use mock auth when backend is truly unreachable, not for auth failures
    const shouldUseMockAuth = ERROR_CONFIG.FALLBACK.enableMockAuth && (
      // Network issues only
      lastError.code === 'ERR_NETWORK' || 
      lastError.message.includes('Network Error') ||
      !lastError.response ||
      
      // Server completely down (404 means endpoint not found, 5xx means server error)
      lastError.response?.status === 404 ||
      lastError.response?.status === 500 ||
      lastError.response?.status === 502 ||
      lastError.response?.status === 503
      
      // DO NOT fallback to mock for 400/401 - these are real auth responses we should show
    );
    
    console.log('🔍 Should use mock auth:', shouldUseMockAuth);
    console.log('🔍 Last error status:', lastError.response?.status);
    console.log('🔍 Last error data:', lastError.response?.data);
    
    if (shouldUseMockAuth) {
      console.log('🧪 Backend authentication failed, attempting mock login fallback');
      console.log('🔧 Available mock credentials: admin/admin123 or admin@example.com/admin123');
      console.log('🌐 Last error was:', lastError.response?.status, lastError.response?.data?.error);
      
      // Enhanced mock authentication with multiple credential formats
      const isValidMockCredentials = (
        // Standard admin credentials
        (loginId === 'admin' && password === 'admin123') ||
        (loginId === 'admin@example.com' && password === 'admin123') ||
        
        // Case-insensitive variations
        (loginId.toLowerCase() === 'admin' && password === 'admin123') ||
        (loginId.toLowerCase() === 'admin@example.com' && password === 'admin123') ||
        
        // Alternative admin formats
        (loginId === 'administrator' && password === 'admin123') ||
        (loginId === 'superadmin' && password === 'admin123')
      );
      
      if (isValidMockCredentials) {
        const mockUser = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'Super',
          last_name: 'Admin',
          roles: ['super_admin'],
          is_active: true,
          is_staff: true,
          is_superuser: true
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store mock authentication data using soft-coded keys
        localStorage.setItem(SECURITY_CONFIG.TOKEN.key, mockToken);
        localStorage.setItem('username', 'admin');
        localStorage.setItem('user_email', 'admin@example.com');
        localStorage.setItem('user_roles', JSON.stringify(['super_admin']));
        localStorage.setItem('is_authenticated', 'true');
        localStorage.setItem('auth_method', 'mock');
        
        console.log('✅ Mock login successful - stored authentication data');
        console.log('🎭 Mock user created with roles:', mockUser.roles);
        
        return {
          success: true,
          message: 'Mock login successful (Backend authentication unavailable)',
          user: mockUser,
          token: mockToken,
          access: mockToken,
          refresh: 'mock-refresh-token',
          warning: 'Using mock authentication - verify backend server configuration'
        };
      } else {
        console.log('❌ Invalid credentials provided');
        console.log('🔧 Expected credentials: admin/admin123 or admin@example.com/admin123');
        console.log('🔧 Received username:', loginId);
        
        // More user-friendly error message
        const validUsernames = ['admin', 'admin@example.com', 'administrator', 'superadmin'];
        const isValidUsername = validUsernames.some(u => u.toLowerCase() === loginId.toLowerCase());
        
        if (isValidUsername) {
          throw new Error('Invalid password. Please use: admin123');
        } else {
          throw new Error(`Invalid username. Please use one of: ${validUsernames.join(', ')} with password: admin123`);
        }
      }
    }
    
    // If all endpoints failed, throw the last error
    throw lastError;
    
  } catch (error) {
    console.error('❌ Login failed:', error);
    
    // Soft-coded error handling
    let errorMessage = ERROR_CONFIG.MESSAGES.authentication;
    
    if (error.response) {
      console.error('📡 Error response:', error.response.status, error.response.data);
      
      // Soft-coded status code handling
      const statusMessages = {
        400: error.response.data?.error || ERROR_CONFIG.MESSAGES.validation,
        401: ERROR_CONFIG.MESSAGES.authentication,
        403: ERROR_CONFIG.MESSAGES.authorization,
        404: 'Login service not found',
        422: 'Invalid login data format',
        429: 'Too many login attempts. Please try again later.',
        500: ERROR_CONFIG.MESSAGES.server,
        502: 'Service temporarily unavailable',
        503: 'Service temporarily unavailable'
      };
      
      errorMessage = statusMessages[error.response.status] || ERROR_CONFIG.MESSAGES.generic;
      
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      errorMessage = ERROR_CONFIG.MESSAGES.network;
    } else {
      console.error('🐛 Request setup error:', error.message);
      errorMessage = error.message || ERROR_CONFIG.MESSAGES.generic;
    }
    
    // Throw structured error
    throw { 
      error: errorMessage,
      status: error.response?.status,
      details: error.response?.data
    };
  }
};

export const register = async (username, gmail, password) => {
  try {
    const response = await api.post('/auth/register/', {
      username,
      email: gmail, // Backend expects 'email' field
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.response?.data?.detail) {
      throw { detail: error.response.data.detail };
    } else if (!error.response) {
      throw { detail: 'Network Error: Unable to connect to the server. Please check your internet connection.' };
    } else {
      throw { detail: 'Registration failed. Please try again.' };
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error.response?.data || error.message;
  }
};

// Report Correction
export const analyzeReport = async (reportText, file = null) => {
  try {
    console.log('Starting report analysis...');
    const formData = new FormData();
    const username = localStorage.getItem('username') || 'default_user';
    formData.append('username', username);

    if (file) {
      console.log('Uploading file...');
      formData.append('uploaded_file', file);
    } else {
      console.log('Sending report text...');
      formData.append('report_text', reportText);
    }

    console.log('Making API request...');
    const response = await api.post('/analyze_report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout
    });

    console.log('Got response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Report analysis failed:', error);
    console.error('Error details:', {
      response: error.response,
      request: error.request,
      message: error.message,
    });

    if (error.response?.data?.detail) {
      throw { detail: error.response.data.detail };
    } else if (error.code === 'ECONNABORTED') {
      throw { detail: 'Request timed out. Please try again.' };
    } else if (!error.response) {
      throw { detail: 'Network Error: Unable to connect to the server. Please check your internet connection.' };
    } else {
      throw { detail: error.message || 'Report analysis failed. Please try again.' };
    }
  }
};

// Test Analysis (doesn't use OpenAI)
export const testAnalyzeReport = async (reportText, file = null) => {
  try {
    console.log('Starting test analysis...');
    const formData = new FormData();
    const username = localStorage.getItem('username') || 'default_user';
    formData.append('username', username);

    if (file) {
      console.log('Uploading file for test...');
      formData.append('uploaded_file', file);
    } else {
      console.log('Sending report text for test...');
      formData.append('report_text', reportText);
    }

    console.log('Making test API request...');
    const response = await api.post('/test_analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Got test response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test analysis failed:', error);
    console.error('Error details:', {
      response: error.response,
      request: error.request,
      message: error.message,
    });

    throw { detail: error.message || 'Test analysis failed' };
  }
};

// Report History
export const getUserHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    throw { detail: error.response?.data?.detail || 'Failed to fetch history' };
  }
};

// Save Report (Enhanced for comprehensive analysis data)
export const saveReport = async (reportData) => {
  try {
    // Handle both legacy string format and new comprehensive object format
    const isLegacyFormat = typeof reportData === 'string';
    
    if (isLegacyFormat) {
      // Legacy format - simple text save
      const formData = new FormData();
      formData.append('report_text', reportData);

      const response = await api.post('/save_report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // New comprehensive format - enhanced analysis save
      const response = await api.post('/save_analysis', reportData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error('Failed to save report:', error);
    throw { detail: error.response?.data?.detail || 'Failed to save report' };
  }
};

// Save Enhanced Analysis (specific function for comprehensive data)
export const saveEnhancedAnalysis = async (analysisData) => {
  try {
    const response = await api.post('/analysis/save', analysisData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save enhanced analysis:', error);
    throw { detail: error.response?.data?.detail || 'Failed to save enhanced analysis' };
  }
};

// Delete History
export const deleteHistory = async () => {
  try {
    const response = await api.delete('/history');
    return response.data;
  } catch (error) {
    console.error('Failed to delete history:', error);
    throw { detail: error.response?.data?.detail || 'Failed to delete history' };
  }
};

export const viewReport = async (fileKey) => {
  try {
    const response = await api.get('/report', {
      params: { file_key: fileKey }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to view report:', error);
    throw { detail: error.response?.data?.detail || 'Failed to view report' };
  }
};

// RAG Functionality
export const getVocabulary = async () => {
  try {
    const response = await api.get('/reports/vocabulary/');
    return response.data;
  } catch (error) {
    console.error('Failed to get vocabulary:', error);
    throw { detail: error.response?.data?.detail || 'Failed to get vocabulary' };
  }
};

export const updateRAGContent = async () => {
  try {
    const response = await api.post('/reports/rag-update/');
    return response.data;
  } catch (error) {
    console.error('Failed to update RAG content:', error);
    throw { detail: error.response?.data?.detail || 'Failed to update RAG content' };
  }
};

export const analyzeReportWithRAG = async (reportText, file = null) => {
  try {
    console.log('Starting RAG analysis for report:', reportText.substring(0, 100) + '...');
    
    const formData = new FormData();
    formData.append('report_text', reportText);
    formData.append('use_rag', 'true');
    
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post('/reports/analyze/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for RAG analysis
    });
    
    console.log('RAG analysis completed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('RAG analysis failed:', error);
    
    // Provide more detailed error information
    if (error.code === 'ECONNABORTED') {
      throw { detail: 'RAG analysis timed out. The advanced medical analysis is taking longer than expected. Please try again.' };
    } else if (error.response?.status === 500) {
      throw { detail: 'Server error during RAG analysis. The advanced medical knowledge system encountered an issue.' };
    } else if (error.response?.status === 401) {
      throw { detail: 'Authentication required for RAG analysis. Please log in again.' };
    } else {
      throw { detail: error.response?.data?.detail || error.response?.data?.error || 'Failed to analyze report with RAG. Please try again.' };
    }
  }
};

// Test RAG System
export const testRAGSystem = async (reportText) => {
  try {
    const response = await api.post('/reports/test-rag/', {
      report_text: reportText
    });
    return response.data;
  } catch (error) {
    console.error('RAG system test failed:', error);
    throw { detail: error.response?.data?.detail || 'RAG system test failed' };
  }
};

// Test Free Medical Terminology Service (Soft-coded error handling)
export const testFreeMedicalTerminology = async (query = 'lung') => {
  const defaultFallback = {
    status: 'fallback',
    total_results: 0,
    sources_searched: ['built-in'],
    message: 'Using fallback mode - service temporarily unavailable',
    query: query,
    results: [],
    search_time: 0
  };

  try {
    // Validate input with soft defaults
    const searchQuery = query || ENV_CONFIG.FEATURES.defaultMedicalQuery || 'lung';
    
    const response = await api.post('/reports/test-free-terminology/', {
      query: searchQuery
    }, {
      timeout: API_CONFIG.TIMEOUT.medical || 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Free medical terminology test failed:', error);
    
    // Soft-coded error handling based on error type
    if (error.code === 'ECONNABORTED') {
      return { ...defaultFallback, message: 'Service timeout - using fallback mode' };
    }
    
    if (error.response?.status >= 500) {
      return { ...defaultFallback, message: 'Server error - using fallback mode' };
    }
    
    // For client-side errors, still provide fallback but log the issue
    const errorDetail = error.response?.data?.error || error.message || 'Free medical terminology test failed';
    
    if (ENV_CONFIG.FEATURES.gracefulDegradation) {
      return { ...defaultFallback, message: `Graceful fallback: ${errorDetail}` };
    }
    
    throw { detail: errorDetail };
  }
};

// Get Available Medical Terminology Sources (Soft-coded with fallback)
export const getAvailableTerminologySources = async () => {
  const defaultFallback = {
    status: 'fallback',
    total_sources: 1,
    free_sources: 1,
    premium_sources: 0,
    available_sources: [{
      name: 'Built-in Medical Vocabulary',
      type: 'built-in',
      description: 'Comprehensive built-in medical terminology database',
      status: 'active',
      free: true
    }],
    message: 'Using built-in sources - external services temporarily unavailable'
  };

  try {
    const response = await api.get('/reports/list-sources/', {
      timeout: API_CONFIG.TIMEOUT.medical || 8000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get terminology sources:', error);
    
    // Soft-coded graceful degradation
    if (ENV_CONFIG.FEATURES.gracefulDegradation) {
      console.warn('Using fallback medical terminology sources');
      return defaultFallback;
    }
    
    const errorDetail = error.response?.data?.error || error.message || 'Failed to get terminology sources';
    throw { detail: errorDetail };
  }
};

// Get Free Medical Terminology Service Status (Fixed endpoint and soft-coded)
export const getFreeMedicalTerminologyStatus = async () => {
  const defaultStatus = {
    status: 'fallback',
    service_health: 'limited',
    available_sources: 1,
    total_terms: 5000,
    message: 'Service running in fallback mode with built-in vocabulary',
    uptime: 'N/A',
    last_updated: new Date().toISOString()
  };

  try {
    // Use the correct endpoint for getting status - should be different from test endpoint
    // If no specific status endpoint exists, use the list-sources endpoint as a health check
    const response = await api.get('/reports/list-sources/', {
      timeout: API_CONFIG.TIMEOUT.fast || 5000
    });
    
    // Transform the sources response into a status response
    const sourcesData = response.data;
    return {
      status: 'operational',
      service_health: 'good',
      available_sources: sourcesData.total_sources || 1,
      free_sources: sourcesData.free_sources || 1,
      premium_sources: sourcesData.premium_sources || 0,
      message: 'Free medical terminology service is operational',
      uptime: 'Active',
      last_updated: new Date().toISOString(),
      sources: sourcesData.available_sources || []
    };
  } catch (error) {
    console.error('Failed to get service status:', error);
    
    // Always provide a status response for service monitoring
    if (ENV_CONFIG.FEATURES.gracefulDegradation) {
      console.warn('Service status check failed, returning fallback status');
      return defaultStatus;
    }
    
    throw { detail: error.response?.data?.error || error.message || 'Failed to get service status' };
  }
};

// RAG Configuration Management
export const getRAGConfig = async () => {
  try {
    const response = await api.get('/reports/config/');
    return response.data;
  } catch (error) {
    console.error('Failed to get RAG configuration:', error);
    throw { detail: error.response?.data?.detail || 'Failed to get RAG configuration' };
  }
};

export const updateRAGConfig = async (updates) => {
  try {
    const response = await api.post('/reports/config/update/', { updates });
    return response.data;
  } catch (error) {
    console.error('Failed to update RAG configuration:', error);
    throw { detail: error.response?.data?.detail || 'Failed to update RAG configuration' };
  }
};

export const getConfigTemplates = async () => {
  try {
    const response = await api.get('/reports/config/templates/');
    return response.data;
  } catch (error) {
    console.error('Failed to get configuration templates:', error);
    throw { detail: error.response?.data?.detail || 'Failed to get configuration templates' };
  }
};

export const validateRAGConfig = async (config) => {
  try {
    const response = await api.post('/reports/config/validate/', { config });
    return response.data;
  } catch (error) {
    console.error('Failed to validate RAG configuration:', error);
    throw { detail: error.response?.data?.detail || 'Failed to validate RAG configuration' };
  }
};
