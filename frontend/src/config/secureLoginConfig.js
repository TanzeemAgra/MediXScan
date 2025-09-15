// Secure Login Configuration with Soft Coding
// File: frontend/src/config/secureLoginConfig.js

export const SECURE_LOGIN_CONFIG = {
  // Security settings
  security: {
    hideCredentials: true,
    requireManualEntry: true,
    showSecurityIndicators: true,
    enableBruteForceProtection: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  },

  // UI Configuration
  ui: {
    showDemoButtons: false, // Changed to false for security
    showSecurityBadges: true,
    enableHelpText: true,
    theme: 'professional'
  },

  // Help text for users (without revealing credentials)
  helpText: {
    admin: {
      title: "Administrator Access",
      description: "Contact your system administrator for login credentials",
      icon: "fas fa-user-shield",
      color: "primary"
    },
    doctor: {
      title: "Medical Professional",  
      description: "Use your assigned medical staff credentials",
      icon: "fas fa-user-md",
      color: "success"
    },
    rbac: {
      title: "Role-Based Access",
      description: "Login with your assigned role permissions",
      icon: "fas fa-users-cog",
      color: "info"
    }
  },

  // Error messages (soft coded)
  errorMessages: {
    invalid: "Invalid email or password. Please try again.",
    locked: "Account temporarily locked due to multiple failed attempts.",
    unauthorized: "You don't have permission to access this system.",
    network: "Connection error. Please check your internet connection.",
    server: "Server temporarily unavailable. Please try again later.",
    maintenance: "System is under maintenance. Please try again later."
  },

  // Success messages
  successMessages: {
    login: "Welcome back! Redirecting to dashboard...",
    firstTime: "Welcome! Please complete your profile setup.",
    rbac: "Access granted. Loading your permissions..."
  },

  // Form validation rules
  validation: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters long"
    }
  },

  // Security indicators
  securityFeatures: [
    {
      icon: "fas fa-shield-alt",
      text: "HIPAA Compliant Security",
      description: "Healthcare grade encryption"
    },
    {
      icon: "fas fa-lock",
      text: "Multi-Factor Authentication",
      description: "Enhanced account protection"
    },
    {
      icon: "fas fa-eye-slash",
      text: "Zero-Knowledge Architecture", 
      description: "Your data stays private"
    },
    {
      icon: "fas fa-certificate",
      text: "ISO 27001 Certified",
      description: "International security standards"
    }
  ],

  // Login button configurations
  buttons: {
    admin: {
      text: "Administrator Login",
      icon: "fas fa-user-shield",
      variant: "outline-primary",
      helpMessage: "For system administrators and superusers"
    },
    doctor: {
      text: "Medical Staff Login", 
      icon: "fas fa-user-md",
      variant: "outline-success",
      helpMessage: "For doctors and medical professionals"
    },
    rbac: {
      text: "Staff Login",
      icon: "fas fa-users",
      variant: "outline-info", 
      helpMessage: "For authorized staff members"
    }
  },

  // Environment-specific settings
  environment: {
    development: {
      showDebugInfo: true,
      allowTestCredentials: false, // Even in dev, keep secure
      logLevel: 'debug'
    },
    production: {
      showDebugInfo: false,
      allowTestCredentials: false,
      logLevel: 'error'
    }
  }
};

// Utility functions for secure login
export const SecureLoginUtils = {
  // Clear form data securely
  clearFormData: () => ({
    loginId: '',
    password: ''
  }),

  // Focus on first input
  focusFirstInput: () => {
    setTimeout(() => {
      const firstInput = document.getElementById('loginId');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  },

  // Show security message
  showSecurityMessage: (type = 'info') => {
    const messages = {
      info: "Please enter your assigned credentials to access the system",
      security: "This is a secure system. All access is logged and monitored",
      help: "Contact your administrator if you need account assistance"
    };
    return messages[type] || messages.info;
  },

  // Validate credentials format (without revealing actual values)
  validateCredentialFormat: (email, password) => {
    const errors = [];
    
    if (!email || !email.includes('@')) {
      errors.push("Please enter a valid email address");
    }
    
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    
    return errors;
  },

  // Get appropriate error message
  getErrorMessage: (error, config = SECURE_LOGIN_CONFIG) => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.status) {
      const status = error.response.status;
      const statusMessages = {
        400: config.errorMessages.invalid,
        401: config.errorMessages.unauthorized,
        403: config.errorMessages.unauthorized,
        404: config.errorMessages.invalid,
        429: config.errorMessages.locked,
        500: config.errorMessages.server,
        502: config.errorMessages.network,
        503: config.errorMessages.maintenance
      };
      
      return statusMessages[status] || config.errorMessages.invalid;
    }
    
    return config.errorMessages.network;
  }
};

export default SECURE_LOGIN_CONFIG;