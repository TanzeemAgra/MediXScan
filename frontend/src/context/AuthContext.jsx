// Enhanced Authentication Context with RBAC Integration
// Comprehensive context for authentication and authorization

import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, login as loginAPI } from '../services/api';
import { SECURITY_CONFIG, ERROR_CONFIG } from '../config/appConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedToken) {
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Verify token and get user data
        try {
          const response = await api.get('/auth/profile/');
          setUser(response.data);
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          
          // Try to refresh token
          if (storedRefreshToken) {
            const refreshSuccess = await refreshAuthToken();
            if (!refreshSuccess) {
              logout();
            }
          } else {
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function (Soft-coded with improved error handling)
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // DEBUG: Log what we received
      console.log('🔍 AuthContext received credentials:', credentials);
      console.log('🔍 Email:', credentials?.email);
      console.log('🔍 Password length:', credentials?.password?.length);
      
      // Soft-coded credentials validation
      if (!credentials || !credentials.email || !credentials.password) {
        console.error('❌ AuthContext validation failed:', {
          hasCredentials: !!credentials,
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password,
          credentials: credentials
        });
        throw new Error('Email and password are required');
      }
      
      // Use the enhanced login function from api.js
      const response = await loginAPI(credentials.email, credentials.password);
      
      // Soft-coded token handling based on response structure
      let accessToken, refreshToken, userData;
      
      if (response.token) {
        // Handle Django Token Auth format
        accessToken = response.token;
        userData = response.user || { 
          email: credentials.email,
          id: response.user?.id || null 
        };
      } else if (response.access) {
        // Handle JWT format
        accessToken = response.access;
        refreshToken = response.refresh;
        userData = response.user;
      } else {
        throw new Error('Invalid authentication response format');
      }

      // Store tokens using soft-coded keys
      if (accessToken) {
        localStorage.setItem(SECURITY_CONFIG.TOKEN.key, accessToken);
        api.defaults.headers.common['Authorization'] = `Token ${accessToken}`;
      }
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Store user data
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Update state
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      console.log('✅ AuthContext: Login successful');
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      
      // Soft-coded error message handling
      let errorMessage = 'Login failed';
      
      if (error.error) {
        errorMessage = error.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register/', userData);
      const { access, refresh, user: newUser } = response.data;

      // Store tokens
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Set API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Update state
      setToken(access);
      setRefreshToken(refresh);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.error || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await api.post('/auth/logout/');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear API headers
      delete api.defaults.headers.common['Authorization'];
      
      // Reset state
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Refresh token function
  const refreshAuthToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        return false;
      }

      const response = await api.post('/auth/token/refresh/', {
        refresh: storedRefreshToken
      });

      const { access } = response.data;
      
      // Update stored token
      localStorage.setItem('authToken', access);
      
      // Set API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Update state
      setToken(access);

      // Get updated user data
      const userResponse = await api.get('/auth/profile/');
      setUser(userResponse.data);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.patch('/auth/profile/', profileData);
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.error || 'Profile update failed' 
      };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await api.post('/auth/change-password/', passwordData);
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.error || 'Password change failed' 
      };
    }
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.name === roleName || 
      role === roleName || 
      (typeof role === 'object' && role.name === roleName)
    );
  };

  // Check if user has specific permission
  const hasPermission = (permissionName) => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(permission => 
      permission.name === permissionName || 
      permission === permissionName ||
      (typeof permission === 'object' && permission.name === permissionName)
    );
  };

  // Role checks
  const isSuperUser = () => hasRole('SUPERUSER');
  const isDoctor = () => hasRole('DOCTOR');
  const isTechnician = () => hasRole('TECHNICIAN');
  const isPatient = () => hasRole('PATIENT');
  const isAdmin = () => hasRole('ADMIN');

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshSuccess = await refreshAuthToken();
          if (refreshSuccess) {
            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
            return api(originalRequest);
          } else {
            // Refresh failed, logout user
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    // State
    user,
    token,
    refreshToken,
    loading,
    isAuthenticated,
    error,
    setError,
    
    // Auth functions
    login,
    register,
    logout,
    refreshAuthToken,
    updateProfile,
    changePassword,
    
    // Role/Permission checks
    hasRole,
    hasPermission,
    isSuperUser,
    isDoctor,
    isTechnician,
    isPatient,
    isAdmin,
    
    // Utilities
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
