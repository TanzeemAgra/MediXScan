import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AUTH_METHODS, 
  AUTH_THEME, 
  AUTH_MESSAGES, 
  AUTH_FEATURES, 
  DEFAULT_CREDENTIALS 
} from '../../config/newAuthConfig';

// Import the safe auth hook
import { useSafeAuth } from '../../context/DualAuthProvider';

// Error Boundary Component
class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h3>Authentication Error</h3>
            <p>Something went wrong with the authentication system.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ModernSignInCore = () => {
  const navigate = useNavigate();
  
  // Use the safe auth hook with defensive programming and error handling
  let authContextValue = {};
  try {
    authContextValue = useSafeAuth() || {};
  } catch (error) {
    console.error('Safe auth hook error:', error);
    authContextValue = {};
  }
  
  // Destructure with defaults to prevent undefined errors
  const { 
    login = null, 
    loading = false, 
    error = null, 
    isAuthenticated = false 
  } = authContextValue || {};
  
  // Soft-coded fallback login function if context is unavailable
  const fallbackLogin = async (credentials) => {
    try {
      const response = await fetch('https://medixscan-production.up.railway.app/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Store token and redirect
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Fallback login error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Use context login or fallback
  const activeLogin = login || fallbackLogin;
  
  // State Management
  const [activeMethod, setActiveMethod] = useState(AUTH_METHODS.EMAIL_PASSWORD.id);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [contextError, setContextError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Get current authentication method
  const getCurrentMethod = () => {
    return Object.values(AUTH_METHODS).find(method => method.id === activeMethod);
  };

  // Handle input changes with validation
  const handleInputChange = (fieldId, value) => {
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [fieldId]: null
    }));

    // Update form data
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Validate single field
  const validateField = (field, value) => {
    const { validation } = field;
    
    if (!validation) return null;

    if (validation.required && (!value || value.trim() === '')) {
      return validation.message || `${field.label} is required`;
    }

    if (validation.minLength && value.length < validation.minLength) {
      return validation.message || `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.pattern && !validation.pattern.test(value)) {
      return validation.message || `Invalid ${field.label} format`;
    }

    return null;
  };

  // Validate all fields
  const validateForm = () => {
    const currentMethod = getCurrentMethod();
    const errors = {};
    let isValid = true;

    currentMethod.fields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      
      if (error) {
        errors[field.id] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const currentMethod = getCurrentMethod();
      const loginData = {};

      // Map form data based on method
      currentMethod.fields.forEach(field => {
        loginData[field.id] = formData[field.id] || '';
      });

      // Add remember me preference
      loginData.rememberMe = rememberMe;
      loginData.authMethod = activeMethod;

      console.log('Login attempt with data:', loginData);
      
      const result = await activeLogin(loginData);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fill demo credentials
  const fillDemoCredentials = (credentialType) => {
    const credentials = DEFAULT_CREDENTIALS[credentialType];
    if (credentials) {
      setFormData({
        email: credentials.email,
        password: credentials.password
      });
      setActiveMethod(AUTH_METHODS.EMAIL_PASSWORD.id);
    }
  };

  // Render form field
  const renderFormField = (field) => {
    const value = formData[field.id] || '';
    const hasError = validationErrors[field.id];
    const isPassword = field.type === 'password';

    return (
      <div key={field.id} className="mb-3">
        <Form.Label 
          htmlFor={field.id}
          className="form-label"
          style={{ 
            color: AUTH_THEME.colors.dark,
            fontWeight: AUTH_THEME.typography.fontWeight.medium,
            fontSize: AUTH_THEME.typography.fontSize.sm
          }}
        >
          <i className={field.icon} style={{ marginRight: '0.5rem' }}></i>
          {field.label}
        </Form.Label>
        
        <div className="input-group">
          <input
            id={field.id}
            type={isPassword && showPassword ? 'text' : field.type}
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={{
              backgroundColor: AUTH_THEME.colors.inputBackground,
              border: `1px solid ${hasError ? AUTH_THEME.colors.error : AUTH_THEME.colors.inputBorder}`,
              borderRadius: AUTH_THEME.borderRadius.md,
              fontSize: AUTH_THEME.typography.fontSize.base,
              padding: '0.75rem 1rem',
              transition: AUTH_THEME.animations.transition
            }}
            onFocus={(e) => {
              e.target.style.borderColor = AUTH_THEME.colors.inputBorderFocus;
              e.target.style.boxShadow = `0 0 0 2px rgba(59, 130, 246, 0.1)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = hasError ? AUTH_THEME.colors.error : AUTH_THEME.colors.inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {isPassword && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                borderColor: hasError ? AUTH_THEME.colors.error : AUTH_THEME.colors.inputBorder,
                borderLeft: 'none'
              }}
            >
              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
            </button>
          )}
        </div>
        
        {hasError && (
          <div className="invalid-feedback d-block" style={{ fontSize: AUTH_THEME.typography.fontSize.xs }}>
            {hasError}
          </div>
        )}
      </div>
    );
  };

  // Render authentication method tabs
  const renderMethodTabs = () => {
    const enabledMethods = Object.values(AUTH_METHODS).filter(method => method.enabled);

    if (enabledMethods.length <= 1) return null;

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-center">
          <div className="btn-group" role="group">
            {enabledMethods.map(method => (
              <button
                key={method.id}
                type="button"
                className={`btn ${activeMethod === method.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setActiveMethod(method.id);
                  setFormData({});
                  setValidationErrors({});
                }}
                style={{
                  fontSize: AUTH_THEME.typography.fontSize.sm,
                  fontWeight: AUTH_THEME.typography.fontWeight.medium,
                  transition: AUTH_THEME.animations.transition
                }}
              >
                <i className={method.icon} style={{ marginRight: '0.5rem' }}></i>
                {method.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-2">
          <small className="text-muted">
            {getCurrentMethod()?.description}
          </small>
        </div>
      </div>
    );
  };

  const currentMethod = getCurrentMethod();

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{ 
        background: AUTH_THEME.colors.background,
        fontFamily: AUTH_THEME.typography.fontFamily
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card 
              className="shadow-lg border-0"
              style={{
                backgroundColor: AUTH_THEME.colors.cardBackground,
                borderRadius: AUTH_THEME.borderRadius.xl,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 20px 40px ${AUTH_THEME.colors.shadow}`
              }}
            >
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <img 
                    src="/assets/images/logo-full2.png" 
                    alt="Logo" 
                    style={{ height: '60px', marginBottom: '1rem' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <h2 
                    className="mb-2"
                    style={{
                      color: AUTH_THEME.colors.dark,
                      fontWeight: AUTH_THEME.typography.fontWeight.bold,
                      fontSize: AUTH_THEME.typography.fontSize['2xl']
                    }}
                  >
                    Welcome Back
                  </h2>
                  <p 
                    className="text-muted mb-0"
                    style={{ fontSize: AUTH_THEME.typography.fontSize.base }}
                  >
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Method Selection Tabs */}
                {renderMethodTabs()}

                {/* Error Alert - Show context errors or authentication errors */}
                {(error || contextError) && (
                  <Alert 
                    variant="danger" 
                    className="mb-4"
                    style={{
                      borderRadius: AUTH_THEME.borderRadius.md,
                      border: 'none',
                      backgroundColor: `${AUTH_THEME.colors.error}15`,
                      color: AUTH_THEME.colors.error
                    }}
                  >
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {contextError ? `Context Error: ${contextError}` : error}
                  </Alert>
                )}

                {/* Context Status Indicator (development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-3">
                    <small className="text-muted">
                      Auth Status: {login ? '✅ Context Available' : '⚠️ Using Fallback'} | 
                      Loading: {loading ? 'Yes' : 'No'} | 
                      Authenticated: {isAuthenticated ? 'Yes' : 'No'}
                    </small>
                  </div>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  {currentMethod?.fields.map(renderFormField)}

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    {AUTH_FEATURES.enableRememberMe && (
                      <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ fontSize: AUTH_THEME.typography.fontSize.sm }}
                      />
                    )}
                    
                    {AUTH_FEATURES.enableForgotPassword && (
                      <Link 
                        to="/auth/forgot-password"
                        style={{
                          color: AUTH_THEME.colors.primary,
                          textDecoration: 'none',
                          fontSize: AUTH_THEME.typography.fontSize.sm,
                          fontWeight: AUTH_THEME.typography.fontWeight.medium
                        }}
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isSubmitting || loading}
                    style={{
                      backgroundColor: AUTH_THEME.colors.primary,
                      borderColor: AUTH_THEME.colors.primary,
                      padding: '0.75rem 1.5rem',
                      fontSize: AUTH_THEME.typography.fontSize.base,
                      fontWeight: AUTH_THEME.typography.fontWeight.semibold,
                      borderRadius: AUTH_THEME.borderRadius.md,
                      transition: AUTH_THEME.animations.transition
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = AUTH_THEME.colors.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = AUTH_THEME.colors.primary;
                    }}
                  >
                    {(isSubmitting || loading) ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        {AUTH_MESSAGES.loading.signingIn}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                {/* Demo Credentials */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4">
                    <div className="text-center mb-2">
                      <small className="text-muted">Demo Credentials</small>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemoCredentials('superAdmin')}
                      >
                        Fill Super Admin
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemoCredentials('testDoctor')}
                      >
                        Fill Test Doctor
                      </button>
                    </div>
                  </div>
                )}

                {/* Registration Link */}
                {AUTH_FEATURES.enableRegistration && (
                  <div className="text-center mt-4">
                    <span className="text-muted" style={{ fontSize: AUTH_THEME.typography.fontSize.sm }}>
                      Don't have an account?{' '}
                      <Link 
                        to="/auth/register"
                        style={{
                          color: AUTH_THEME.colors.primary,
                          textDecoration: 'none',
                          fontWeight: AUTH_THEME.typography.fontWeight.medium
                        }}
                      >
                        Sign up here
                      </Link>
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Main component wrapped with error boundary
const ModernSignIn = () => {
  return (
    <AuthErrorBoundary>
      <ModernSignInCore />
    </AuthErrorBoundary>
  );
};

export default ModernSignIn;