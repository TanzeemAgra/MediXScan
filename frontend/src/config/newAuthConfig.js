/**
 * Next-Generation Authentication Configuration
 * ===========================================
 * Modern, comprehensive, soft-coded authentication system
 */

// Authentication Methods Configuration
export const AUTH_METHODS = {
  EMAIL_PASSWORD: {
    id: 'email_password',
    name: 'Email & Password',
    description: 'Sign in with your registered email and password',
    icon: 'fas fa-envelope',
    enabled: true,
    primary: true,
    fields: [
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        icon: 'fas fa-envelope',
        validation: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email address'
        }
      },
      {
        id: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        icon: 'fas fa-lock',
        validation: {
          required: true,
          minLength: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    ]
  },
  USERNAME_PASSWORD: {
    id: 'username_password',
    name: 'Username & Password',
    description: 'Sign in with your username and password',
    icon: 'fas fa-user',
    enabled: true,
    primary: false,
    fields: [
      {
        id: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'Enter your username',
        icon: 'fas fa-user',
        validation: {
          required: true,
          minLength: 3,
          message: 'Username must be at least 3 characters'
        }
      },
      {
        id: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        icon: 'fas fa-lock',
        validation: {
          required: true,
          minLength: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    ]
  },
  EMPLOYEE_ID: {
    id: 'employee_id',
    name: 'Employee ID',
    description: 'Sign in with your employee ID and password',
    icon: 'fas fa-id-badge',
    enabled: true,
    primary: false,
    fields: [
      {
        id: 'employee_id',
        type: 'text',
        label: 'Employee ID',
        placeholder: 'Enter your employee ID',
        icon: 'fas fa-id-badge',
        validation: {
          required: true,
          pattern: /^[A-Z0-9]{3,10}$/,
          message: 'Employee ID must be 3-10 characters (letters and numbers)'
        }
      },
      {
        id: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        icon: 'fas fa-lock',
        validation: {
          required: true,
          minLength: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    ]
  }
};

// Authentication Endpoints Configuration
export const NEW_AUTH_ENDPOINTS = {
  LOGIN: {
    primary: '/api/auth/login/',
    fallbacks: [
      '/api/auth/emergency-login/',
      '/api/auth/simple-login/',
      '/api/auth/legacy-login/'
    ]
  },
  LOGOUT: '/api/auth/logout/',
  REGISTER: '/api/auth/register/',
  FORGOT_PASSWORD: '/api/auth/forgot-password/',
  RESET_PASSWORD: '/api/auth/reset-password/',
  PROFILE: '/api/auth/profile/',
  REFRESH_TOKEN: '/api/auth/refresh/',
  VERIFY_EMAIL: '/api/auth/verify-email/',
  CHANGE_PASSWORD: '/api/auth/change-password/'
};

// Modern UI Theme Configuration
export const AUTH_THEME = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    light: '#f8fafc',
    dark: '#1e293b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    inputBackground: '#ffffff',
    inputBorder: '#e2e8f0',
    inputBorderFocus: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)'
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.4s ease-out',
    bounce: 'bounce 0.6s ease-in-out'
  }
};

// Security Configuration
export const AUTH_SECURITY = {
  passwordStrength: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  enableTwoFactor: false,
  enableBiometric: false,
  enableRememberMe: true,
  tokenStorage: {
    type: 'localStorage', // 'localStorage' | 'sessionStorage' | 'cookie'
    key: 'authToken',
    refreshKey: 'refreshToken',
    userKey: 'userData'
  }
};

// Error Messages Configuration
export const AUTH_MESSAGES = {
  errors: {
    invalidCredentials: 'Invalid email or password. Please try again.',
    accountDisabled: 'Your account has been disabled. Please contact support.',
    accountSuspended: 'Your account is temporarily suspended.',
    accountPendingApproval: 'Your account is pending approval. Please wait for activation.',
    accountLocked: 'Too many failed attempts. Account locked temporarily.',
    sessionExpired: 'Your session has expired. Please sign in again.',
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later.',
    validationError: 'Please check your input and try again.',
    emailRequired: 'Email address is required.',
    passwordRequired: 'Password is required.',
    invalidEmail: 'Please enter a valid email address.',
    weakPassword: 'Password is too weak. Please use a stronger password.'
  },
  success: {
    loginSuccess: 'Welcome back! Redirecting to dashboard...',
    logoutSuccess: 'You have been signed out successfully.',
    passwordReset: 'Password reset email sent successfully.',
    accountCreated: 'Account created successfully. Please verify your email.'
  },
  loading: {
    signingIn: 'Signing you in...',
    signingOut: 'Signing you out...',
    verifying: 'Verifying credentials...',
    loading: 'Loading...'
  }
};

// Feature Flags
export const AUTH_FEATURES = {
  enableSocialLogin: false,
  enableBiometricLogin: false,
  enableTwoFactorAuth: false,
  enablePasswordStrengthMeter: true,
  enableLoginAnimation: true,
  enableDarkMode: true,
  enableRememberMe: true,
  enableForgotPassword: true,
  enableRegistration: false, // Controlled registration
  enableGuestAccess: false,
  enableMaintenanceMode: false,
  enableAdvancedSecurity: true,
  enableLoginAudit: true
};

// Default Credentials (for testing/demo purposes)
export const DEFAULT_CREDENTIALS = {
  superAdmin: {
    email: 'tanzeem.agra@rugrel.com',
    password: 'Tanzilla@tanzeem786',
    role: 'SUPERUSER'
  },
  testDoctor: {
    email: 'doctor@test.com',
    password: 'TestDoc123!',
    role: 'DOCTOR'
  },
  testTechnician: {
    email: 'tech@test.com',
    password: 'TestTech123!',
    role: 'TECHNICIAN'
  }
};

export default {
  AUTH_METHODS,
  NEW_AUTH_ENDPOINTS,
  AUTH_THEME,
  AUTH_SECURITY,
  AUTH_MESSAGES,
  AUTH_FEATURES,
  DEFAULT_CREDENTIALS
};