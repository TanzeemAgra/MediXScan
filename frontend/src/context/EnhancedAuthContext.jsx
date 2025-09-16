// Enhanced Authentication Context - Next Generation
// Soft-coded, comprehensive authentication with multiple methods support

import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  NEW_AUTH_ENDPOINTS, 
  AUTH_SECURITY, 
  AUTH_MESSAGES,
  AUTH_METHODS,
  AUTH_FEATURES
} from '../config/newAuthConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced API service with fallback endpoints
class EnhancedAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://medixscan-production.up.railway.app/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    // Handle both full API URLs and relative paths
    const url = this.baseURL.includes('/api') 
      ? `${this.baseURL.replace('/api', '')}${endpoint}`
      : `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.detail || errorData.error || response.statusText,
          data: errorData
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async loginWithFallback(credentials) {
    const { primary, fallbacks } = NEW_AUTH_ENDPOINTS.LOGIN;
    const endpoints = [primary, ...fallbacks];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Attempting login with endpoint: ${endpoint}`);
        
        const response = await this.request(endpoint, {
          method: 'POST',
          body: JSON.stringify(credentials)
        });

        console.log(`✅ Login successful with endpoint: ${endpoint}`);
        return response;
        
      } catch (error) {
        console.error(`❌ Login failed with endpoint ${endpoint}:`, error);
        lastError = error;
        continue;
      }
    }

    throw lastError || new Error('All login endpoints failed');
  }

  setAuthToken(token) {
    this.defaultHeaders.Authorization = `Token ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders.Authorization;
  }
}

const apiService = new EnhancedAPI();

export const AuthProvider = ({ children }) => {
  // Core Authentication State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Security State
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
    checkLockoutStatus();
  }, []);

  // Check if account is locked due to failed attempts
  const checkLockoutStatus = () => {
    const lockTime = localStorage.getItem('lockoutTime');
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    
    if (lockTime && attempts >= AUTH_SECURITY.maxLoginAttempts) {
      const lockTimestamp = parseInt(lockTime);
      const currentTime = Date.now();
      
      if (currentTime - lockTimestamp < AUTH_SECURITY.lockoutDuration) {
        setIsLocked(true);
        setLockoutTime(lockTimestamp);
        setLoginAttempts(attempts);
      } else {
        // Lockout expired, reset
        clearLockout();
      }
    }
  };

  // Clear lockout status
  const clearLockout = () => {
    localStorage.removeItem('lockoutTime');
    localStorage.removeItem('loginAttempts');
    setIsLocked(false);
    setLockoutTime(null);
    setLoginAttempts(0);
  };

  // Initialize auth state
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem(AUTH_SECURITY.tokenStorage.key);
      const storedUser = localStorage.getItem(AUTH_SECURITY.tokenStorage.userKey);
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Set token in API service
          apiService.setAuthToken(storedToken);
          
          // Verify token is still valid
          await apiService.request('/auth/profile/');
          
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          
          console.log('✅ Auth initialization successful');
        } catch (error) {
          console.error('❌ Token verification failed:', error);
          logout();
        }
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Enhanced login function with multiple authentication methods
  const login = async (loginData) => {
    try {
      // Check if account is locked
      if (isLocked) {
        const remainingTime = Math.ceil((lockoutTime + AUTH_SECURITY.lockoutDuration - Date.now()) / 1000 / 60);
        throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
      }

      setLoading(true);
      setError(null);
      
      console.log('🔍 Enhanced AuthContext received login data:', {
        ...loginData,
        password: loginData.password ? '[HIDDEN]' : 'MISSING'
      });

      // Prepare credentials based on authentication method
      const credentials = prepareCredentials(loginData);
      
      // Validate credentials
      validateCredentials(credentials, loginData.authMethod || AUTH_METHODS.EMAIL_PASSWORD.id);

      // Attempt login with fallback endpoints
      const response = await apiService.loginWithFallback(credentials);
      
      // Process successful login response
      const authResult = processLoginResponse(response, loginData);
      
      // Clear failed login attempts on success
      clearLockout();
      
      console.log('✅ Enhanced login successful');
      return authResult;
      
    } catch (error) {
      console.error('❌ Enhanced login failed:', error);
      
      // Handle failed login attempt
      handleFailedLogin(error);
      
      return {
        success: false,
        error: error.message || AUTH_MESSAGES.errors.invalidCredentials
      };
    } finally {
      setLoading(false);
    }
  };

  // Prepare credentials based on authentication method
  const prepareCredentials = (loginData) => {
    const authMethod = loginData.authMethod || AUTH_METHODS.EMAIL_PASSWORD.id;
    const method = Object.values(AUTH_METHODS).find(m => m.id === authMethod);
    
    if (!method) {
      throw new Error('Invalid authentication method');
    }

    const credentials = {
      auth_method: authMethod
    };

    // Map form fields to credential fields
    method.fields.forEach(field => {
      if (loginData[field.id]) {
        credentials[field.id] = loginData[field.id].trim();
      }
    });

    // Add remember me preference
    if (loginData.rememberMe) {
      credentials.remember_me = true;
    }

    return credentials;
  };

  // Validate credentials based on method
  const validateCredentials = (credentials, authMethodId) => {
    const method = Object.values(AUTH_METHODS).find(m => m.id === authMethodId);
    
    if (!method) {
      throw new Error('Invalid authentication method');
    }

    method.fields.forEach(field => {
      if (field.validation?.required && !credentials[field.id]) {
        throw new Error(AUTH_MESSAGES.errors[`${field.id}Required`] || `${field.label} is required`);
      }

      if (field.validation?.pattern && credentials[field.id]) {
        if (!field.validation.pattern.test(credentials[field.id])) {
          throw new Error(field.validation.message || `Invalid ${field.label} format`);
        }
      }
    });
  };

  // Process login response
  const processLoginResponse = (response, loginData) => {
    let accessToken, userData;

    // Handle different response formats
    if (response.token) {
      // Django Token Auth format
      accessToken = response.token;
      userData = response.user || { 
        email: loginData.email || loginData.username || loginData.employee_id,
        id: response.user?.id 
      };
    } else if (response.access) {
      // JWT format
      accessToken = response.access;
      setRefreshToken(response.refresh);
      userData = response.user;
    } else {
      throw new Error('Invalid authentication response format');
    }

    // Store authentication data
    if (accessToken) {
      const storageType = AUTH_SECURITY.tokenStorage.type;
      const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
      
      storage.setItem(AUTH_SECURITY.tokenStorage.key, accessToken);
      apiService.setAuthToken(accessToken);
    }

    if (userData) {
      const storage = AUTH_SECURITY.tokenStorage.type === 'sessionStorage' ? sessionStorage : localStorage;
      storage.setItem(AUTH_SECURITY.tokenStorage.userKey, JSON.stringify(userData));
    }

    // Update state
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);

    return { success: true, user: userData, token: accessToken };
  };

  // Handle failed login attempt
  const handleFailedLogin = (error) => {
    const currentAttempts = loginAttempts + 1;
    setLoginAttempts(currentAttempts);
    
    localStorage.setItem('loginAttempts', currentAttempts.toString());
    
    if (currentAttempts >= AUTH_SECURITY.maxLoginAttempts) {
      const lockTime = Date.now();
      localStorage.setItem('lockoutTime', lockTime.toString());
      setIsLocked(true);
      setLockoutTime(lockTime);
    }

    // Set appropriate error message
    let errorMessage = error.message;
    
    if (error.status === 401) {
      errorMessage = AUTH_MESSAGES.errors.invalidCredentials;
    } else if (error.status === 403) {
      errorMessage = AUTH_MESSAGES.errors.accountDisabled;
    } else if (error.status >= 500) {
      errorMessage = AUTH_MESSAGES.errors.serverError;
    }
    
    setError(errorMessage);
  };

  // Logout function
  const logout = async (showMessage = true) => {
    try {
      // Call logout endpoint if authenticated
      if (token) {
        await apiService.request(NEW_AUTH_ENDPOINTS.LOGOUT, {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear all stored data
    const storage = AUTH_SECURITY.tokenStorage.type === 'sessionStorage' ? sessionStorage : localStorage;
    storage.removeItem(AUTH_SECURITY.tokenStorage.key);
    storage.removeItem(AUTH_SECURITY.tokenStorage.userKey);
    storage.removeItem(AUTH_SECURITY.tokenStorage.refreshKey);
    
    // Reset API service
    apiService.removeAuthToken();
    
    // Reset state
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    if (showMessage) {
      console.log('✅ Logout successful');
    }
  };

  // Refresh authentication token
  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) return false;

      const response = await apiService.request(NEW_AUTH_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken })
      });

      const newToken = response.access;
      
      localStorage.setItem(AUTH_SECURITY.tokenStorage.key, newToken);
      apiService.setAuthToken(newToken);
      setToken(newToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    return user?.roles?.some(role => role.name === roleName) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permissionName) => {
    return user?.permissions?.some(perm => perm.name === permissionName) || false;
  };

  // Get remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!isLocked || !lockoutTime) return 0;
    
    const remaining = lockoutTime + AUTH_SECURITY.lockoutDuration - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const contextValue = {
    // Authentication State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Security State
    isLocked,
    loginAttempts,
    getRemainingLockoutTime,
    
    // Authentication Methods
    login,
    logout,
    refreshAuthToken,
    
    // Authorization Methods
    hasRole,
    hasPermission,
    
    // Utility Methods
    clearError: () => setError(null),
    clearLockout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;