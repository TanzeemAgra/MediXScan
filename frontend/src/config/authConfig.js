// Authentication Configuration - Soft Coded for Easy Customization
const authConfig = {
  // Common auth styling and branding
  branding: {
    animations: {
      fadeIn: 'fadeInUp 1s ease-out',
      slideIn: 'slideInRight 1s ease-out',
      pulseGlow: 'pulse-glow 3s infinite'
    }
  },

  // Sign In Configuration
  signIn: {
    page: {
      title: "Welcome Back",
      subtitle: "Sign in to your radiology intelligence platform",
      description: "Enter your email or username and password to access admin panel."
    },
    form: {
      fields: [
        {
          id: 'loginId',
          type: 'text',
          label: 'Email or Username',
          placeholder: 'Enter your email or username',
          icon: 'fas fa-envelope',
          required: true
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
          icon: 'fas fa-lock',
          required: true
        }
      ],
      buttons: {
        submit: {
          text: 'Sign In to Dashboard',
          loadingText: 'Signing In...',
          icon: 'fas fa-sign-in-alt'
        },
        forgotPassword: {
          text: 'Forgot password?',
          link: '/auth/forgot-password'
        },
        signUp: {
          text: 'Start Free Trial',
          preText: "Don't have an account? ",
          link: '/auth/sign-up'
        }
      }
    },
    features: [
      { icon: 'fas fa-shield-alt', text: 'HIPAA Compliant' },
      { icon: 'fas fa-bolt', text: '99.7% Accuracy' },
      { icon: 'fas fa-users', text: 'Multi-Doctor Support' }
    ],
    trustIndicators: [
      { icon: 'fas fa-shield-alt', text: 'HIPAA Secure' },
      { icon: 'fas fa-lock', text: 'End-to-End Encrypted' },
      { icon: 'fas fa-certificate', text: 'ISO 27001 Certified' }
    ],
    redirectPath: '/dashboard/main-dashboard'
  },

  // Sign Up Configuration
  signUp: {
    page: {
      title: "Start Your Free Trial",
      subtitle: "Join thousands of medical professionals using AI-powered radiology analysis",
      description: "Create your account to access advanced radiology intelligence tools."
    },
    form: {
      fields: [
        {
          id: 'fullName',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          icon: 'fas fa-user',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          icon: 'fas fa-envelope',
          required: true
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Create a strong password',
          icon: 'fas fa-lock',
          required: true
        },
        {
          id: 'confirmPassword',
          type: 'password',
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
          icon: 'fas fa-lock',
          required: true
        }
      ],
      buttons: {
        submit: {
          text: 'Create Account',
          loadingText: 'Creating Account...',
          icon: 'fas fa-user-plus'
        },
        signIn: {
          text: 'Sign In',
          preText: "Already have an account? ",
          link: '/auth/sign-in'
        }
      }
    },
    redirectPath: '/dashboard/main-dashboard'
  },

  // Forgot Password Configuration
  forgotPassword: {
    page: {
      title: "Reset Your Password",
      subtitle: "Enter your email address and we'll send you a link to reset your password",
      description: "We'll help you get back into your account securely."
    },
    form: {
      fields: [
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          icon: 'fas fa-envelope',
          required: true
        }
      ],
      buttons: {
        submit: {
          text: 'Send Reset Link',
          loadingText: 'Sending...',
          icon: 'fas fa-paper-plane'
        },
        back: {
          text: 'Back to Sign In',
          link: '/auth/sign-in'
        }
      }
    }
  },

  // Error handling configuration
  errors: {
    generic: 'An error occurred. Please try again.',
    network: 'Network error. Please check your connection.',
    validation: 'Please fill in all required fields.',
    invalidCredentials: 'Invalid email or password.',
    emailExists: 'An account with this email already exists.',
    passwordMismatch: 'Passwords do not match.',
    weakPassword: 'Password must be at least 8 characters long.'
  },

  // Success messages
  success: {
    accountCreated: 'Account created successfully! Welcome aboard.',
    passwordReset: 'Password reset link sent to your email.',
    loginSuccess: 'Welcome back! Redirecting to dashboard.'
  }
};

export default authConfig;
