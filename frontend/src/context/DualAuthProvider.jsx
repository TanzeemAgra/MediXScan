// Enhanced Authentication Provider Wrapper
// Provides dual authentication support with fallback capability

import React, { useState, useEffect } from 'react';
import { AuthProvider as OriginalAuthProvider, AuthContext as OriginalAuthContext } from './AuthContext';
import { AuthProvider as EnhancedAuthProvider, AuthContext as EnhancedAuthContext } from './EnhancedAuthContext';
import { AUTH_FEATURES } from '../config/newAuthConfig';

// Export the current context for components to use
export { OriginalAuthContext, EnhancedAuthContext };

// Soft-coded safe auth hook that works with any context
export const useSafeAuth = () => {
  try {
    // Try enhanced auth first
    const { useAuth } = require('./EnhancedAuthContext');
    return useAuth();
  } catch (error) {
    try {
      // Fallback to original auth
      const { useAuth } = require('./AuthContext');
      return useAuth();
    } catch (fallbackError) {
      // Return empty object if no context available
      console.warn('No auth context available, using fallback');
      return {
        login: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    }
  }
};

const DualAuthProvider = ({ children }) => {
  const [useEnhancedAuth, setUseEnhancedAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Monitor for authentication failures
  useEffect(() => {
    const handleAuthError = (error) => {
      console.error('Authentication system error:', error);
      setAuthError(error);
      
      // Fallback to original auth system if enhanced fails
      if (useEnhancedAuth) {
        console.log('Falling back to original authentication system...');
        setUseEnhancedAuth(false);
      }
    };

    // Global error handler for auth failures
    window.addEventListener('authError', handleAuthError);
    
    return () => {
      window.removeEventListener('authError', handleAuthError);
    };
  }, [useEnhancedAuth]);

  // Reset to enhanced auth (for testing/recovery)
  const resetToEnhancedAuth = () => {
    setUseEnhancedAuth(true);
    setAuthError(null);
  };

  // Development controls
  const showFallbackControls = process.env.NODE_ENV === 'development' && authError;

  if (useEnhancedAuth && AUTH_FEATURES.enableAdvancedSecurity) {
    return (
      <EnhancedAuthProvider>
        {showFallbackControls && (
          <div 
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              zIndex: 9999,
              background: '#ff4444',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px'
            }}
          >
            <div>Auth Error: Enhanced auth failed</div>
            <button
              onClick={resetToEnhancedAuth}
              style={{
                background: 'white',
                color: '#ff4444',
                border: 'none',
                padding: '2px 5px',
                marginTop: '5px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry Enhanced Auth
            </button>
          </div>
        )}
        {children}
      </EnhancedAuthProvider>
    );
  } else {
    return (
      <OriginalAuthProvider>
        {showFallbackControls && (
          <div 
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              zIndex: 9999,
              background: '#ff9900',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px'
            }}
          >
            <div>Using fallback authentication</div>
            <button
              onClick={resetToEnhancedAuth}
              style={{
                background: 'white',
                color: '#ff9900',
                border: 'none',
                padding: '2px 5px',
                marginTop: '5px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Try Enhanced Auth
            </button>
          </div>
        )}
        {children}
      </OriginalAuthProvider>
    );
  }
};

export default DualAuthProvider;