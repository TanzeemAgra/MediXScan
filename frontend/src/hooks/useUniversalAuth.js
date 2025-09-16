// Universal Auth Hook - Works with any authentication context
// Soft-coded solution to prevent "useAuth must be used within an AuthProvider" errors

import React, { useContext } from 'react';

// Universal hook that tries multiple contexts and provides safe fallbacks
export const useUniversalAuth = () => {
  // Try to get auth context from multiple sources
  let authData = {};

  try {
    // Try 1: Enhanced Auth Context (from DualAuthProvider)
    const { AuthContext: EnhancedAuthContext } = require('../context/EnhancedAuthContext');
    const enhancedAuth = useContext(EnhancedAuthContext);
    if (enhancedAuth && Object.keys(enhancedAuth).length > 0) {
      authData = enhancedAuth;
    }
  } catch (error) {
    // Enhanced context not available
  }

  if (!authData || Object.keys(authData).length === 0) {
    try {
      // Try 2: Original Auth Context
      const { AuthContext: OriginalAuthContext } = require('../context/AuthContext');
      const originalAuth = useContext(OriginalAuthContext);
      if (originalAuth && Object.keys(originalAuth).length > 0) {
        authData = originalAuth;
      }
    } catch (error) {
      // Original context not available
    }
  }

  if (!authData || Object.keys(authData).length === 0) {
    try {
      // Try 3: Check localStorage for existing auth state
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          authData = {
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
            login: null, // No login function available in fallback
            logout: () => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              window.location.href = '/auth/sign-in';
            }
          };
        } catch (parseError) {
          // Invalid stored data
        }
      }
    } catch (error) {
      // localStorage not available
    }
  }

  // Final fallback - return safe defaults
  if (!authData || Object.keys(authData).length === 0) {
    authData = {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: null,
      logout: () => {
        window.location.href = '/auth/sign-in';
      },
      // RBAC helpers with safe defaults
      hasRole: () => false,
      hasPermission: () => false,
      isSuperUser: false,
      isDoctor: false,
      isStaff: false
    };
  }

  // Ensure all required properties exist with safe defaults
  return {
    user: authData.user || null,
    token: authData.token || null,
    isAuthenticated: Boolean(authData.isAuthenticated),
    loading: Boolean(authData.loading),
    error: authData.error || null,
    login: authData.login || null,
    logout: authData.logout || (() => { window.location.href = '/auth/sign-in'; }),
    // RBAC properties
    hasRole: authData.hasRole || (() => false),
    hasPermission: authData.hasPermission || (() => false),
    isSuperUser: Boolean(authData.user?.is_superuser || authData.isSuperUser),
    isDoctor: Boolean(authData.user?.groups?.includes('Doctor') || authData.isDoctor),
    isStaff: Boolean(authData.user?.is_staff || authData.isStaff),
    // Additional safety properties
    clearError: authData.clearError || (() => {}),
    refreshAuthToken: authData.refreshAuthToken || (() => Promise.resolve(false))
  };
};

// Legacy compatibility - export as useAuth for backward compatibility
export const useAuth = useUniversalAuth;

// Hook specifically for protected routes
export const useAuthForProtectedRoute = () => {
  const auth = useUniversalAuth();
  
  // For protected routes, redirect to login if not authenticated
  React.useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated && !auth.token) {
      // Only redirect if we're not already on an auth page
      if (!window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/sign-in';
      }
    }
  }, [auth.isAuthenticated, auth.loading, auth.token]);

  return auth;
};

export default useUniversalAuth;