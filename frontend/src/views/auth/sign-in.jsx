import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import { ENV_CONFIG } from '../../config/appConfig';
import landingPageConfig from "@config/landingPageConfig.js";

// Soft-coded configuration for sign-in page
const signInConfig = {
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
};

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUniversalAuth();
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { brand, theme } = landingPageConfig;
  const { page, form, features, trustIndicators, redirectPath } = signInConfig;

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate(redirectPath);
    }
    setIsVisible(true);
  }, [isAuthenticated, navigate, redirectPath]);

  const handleInputChange = (field, value) => {
    console.log(`🔄 handleInputChange called - Field: ${field}, Value: "${value}"`);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log(`🔍 Form data updated:`, newData);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('🔑 Attempting login for:', formData.loginId);
      console.log('🌐 API Base URL:', ENV_CONFIG.API_BASE_URL);
      console.log('🔍 Form data state:', formData);
      console.log('🔍 LoginId value:', formData.loginId);
      console.log('🔍 Password value length:', formData.password?.length);
      
      // Use AuthContext login instead of direct API call
      // Ensure we have valid credentials before sending
      const loginCredentials = {
        email: formData.loginId?.trim() || '',
        password: formData.password || ''
      };
      
      console.log('🔍 Sending credentials to AuthContext:', loginCredentials);
      
      const result = await login(loginCredentials);
      
      console.log('✅ Login result:', result);
      
      if (result.success) {
        console.log('🎉 Login successful, navigating to dashboard');
        navigate(redirectPath);
      } else {
        console.error('❌ Login failed:', result.error);
        setError(result.error || 'Login failed. Please try again.');
      }
      
    } catch (err) {
      console.error('❌ Unexpected login error:', err);
      
      // Soft-coded error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.error) {
        errorMessage = err.error;
      } else if (err.response) {
        console.error('📡 Response status:', err.response.status);
        console.error('📡 Response data:', err.response.data);
        
        // Soft-coded status code handling
        const statusMessages = {
          400: 'Invalid email or password.',
          401: 'Invalid credentials.',
          403: 'Account access denied.',
          404: 'Authentication service not found.',
          429: 'Too many login attempts. Please try again later.',
          500: 'Server error. Please try again later.',
          502: 'Service temporarily unavailable.',
          503: 'Service temporarily unavailable.'
        };
        
        errorMessage = statusMessages[err.response.status] || 'Login failed. Please try again.';
        
        if (err.response.data) {
          if (err.response.data.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
      } else if (err.request) {
        console.error('🌐 Network error - no response received');
        errorMessage = 'Network error: Unable to connect to server. Please check your connection.';
      } else {
        console.error('🐛 Request setup error:', err.message);
        errorMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field) => (
    <div key={field.id} className="form-group mb-3">
      <label htmlFor={field.id} className="form-label fw-medium text-dark">
        <i className={`${field.icon} me-2`} style={{ color: theme.primaryColor }}></i>
        {field.label}
      </label>
      <input
        type={field.type}
        className="form-control form-control-lg"
        id={field.id}
        name={field.id}
        placeholder={field.placeholder}
        value={formData[field.id] || ''}
        onChange={(e) => {
          console.log(`🔍 Input ${field.id} changed to:`, e.target.value);
          handleInputChange(field.id, e.target.value);
        }}
        required={field.required}
        style={{
          borderRadius: theme.borderRadius,
          border: '2px solid #e9ecef',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
      />
    </div>
  );

  const renderFeatureBadge = (feature, index) => (
    <div 
      key={index}
      className="feature-badge d-flex align-items-center gap-2 px-3 py-2"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: theme.borderRadius,
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <i className={`${feature.icon} text-white`} style={{ fontSize: '0.9rem' }}></i>
      <small className="text-white fw-medium">{feature.text}</small>
    </div>
  );

  const renderTrustIndicator = (trust, index) => (
    <div key={index} className="d-flex align-items-center gap-2">
      <i 
        className={`${trust.icon} text-white`} 
        style={{ fontSize: '1rem', opacity: 0.8 }}
      ></i>
      <small className="text-white" style={{ opacity: 0.8 }}>
        {trust.text}
      </small>
    </div>
  );

  return (
    <>
      <section 
        className='sign-in-page d-flex align-items-center min-vh-100'
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          position: 'relative'
        }}
      >
        {/* Background Pattern */}
        <div 
          className="position-absolute w-100 h-100"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }}
        />

        <Container className='position-relative z-3'>
          <Row className="align-items-center justify-content-center">
            {/* Left Side - Branding */}
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <div className={`brand-section text-white ${isVisible ? 'animate-fade-in' : ''}`}>
                {/* AI Brain Animation */}
                <div className="mb-4 d-flex justify-content-center justify-content-lg-start">
                  <div 
                    className="ai-brain-container position-relative"
                    style={{
                      width: '120px',
                      height: '120px'
                    }}
                  >
                    <div 
                      className="ai-brain-circle"
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        animation: 'pulse-glow 3s infinite'
                      }}
                    >
                      <i 
                        className="fas fa-brain text-white"
                        style={{ fontSize: '3rem' }}
                      ></i>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="ai-particles">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="particle"
                          style={{
                            position: 'absolute',
                            width: '8px',
                            height: '8px',
                            background: theme.lightColor,
                            borderRadius: '50%',
                            animation: `float-${i % 3 + 1} ${3 + i * 0.5}s infinite`,
                            opacity: 0.7
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <h1 
                  className="display-4 fw-bold mb-3"
                  style={{ 
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    background: 'linear-gradient(45deg, #ffffff, #e0f2f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {brand.name}
                </h1>
                
                <Badge 
                  className="mb-3 px-3 py-2 fs-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: theme.borderRadius
                  }}
                >
                  <i className="fas fa-robot me-2"></i>
                  {brand.tagline}
                </Badge>

                <h2 className="h4 mb-4 opacity-90 fw-light">
                  {brand.subtitle}
                </h2>
                
                <p className="lead opacity-85 mb-4" style={{ maxWidth: '500px' }}>
                  {brand.description}
                </p>

                {/* Feature highlights */}
                <div className="feature-highlights">
                  <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                    {features.map(renderFeatureBadge)}
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Side - Login Form */}
            <Col lg={5} xl={4}>
              <Card 
                className={`border-0 ${isVisible ? 'animate-slide-in' : ''}`}
                style={{
                  borderRadius: theme.borderRadius,
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div 
                      className="login-icon mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: theme.gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}
                    >
                      <i className="fas fa-user-md text-white" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 className="fw-bold mb-2">{page.title}</h3>
                    <p className="text-muted">{page.subtitle}</p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    {error && (
                      <div 
                        className="alert alert-danger border-0"
                        style={{ 
                          borderRadius: theme.borderRadius,
                          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
                        }}
                      >
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    {form.fields.map(renderFormField)}

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="rememberMe"
                          style={{ accentColor: theme.primaryColor }}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        to={form.buttons.forgotPassword.link}
                        className="text-decoration-none"
                        style={{ color: theme.primaryColor }}
                      >
                        {form.buttons.forgotPassword.text}
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-100 mb-3 fw-medium"
                      disabled={loading}
                      style={{
                        background: theme.gradient,
                        border: 'none',
                        borderRadius: theme.borderRadius,
                        padding: '0.75rem',
                        fontSize: '1.1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {form.buttons.submit.loadingText}
                        </>
                      ) : (
                        <>
                          <i className={`${form.buttons.submit.icon} me-2`}></i>
                          {form.buttons.submit.text}
                        </>
                      )}
                    </Button>

                    {/* Secure Login Help */}
                    <div className="mb-3">
                      <p className="text-center text-muted mb-2 small">
                        <i className="fas fa-shield-alt me-1"></i>
                        Secure Access Required
                      </p>
                      <div className="d-flex gap-2">
                        <Button
                          type="button"
                          variant="outline-info"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Clear form for security
                            setFormData({
                              loginId: '',
                              password: ''
                            });
                            // Focus on email field
                            document.getElementById('loginId')?.focus();
                          }}
                          style={{
                            borderRadius: theme.borderRadius,
                            fontSize: '0.85rem'
                          }}
                        >
                          <i className="fas fa-user-shield me-1"></i>
                          Admin Login
                        </Button>
                        <Button
                          type="button"
                          variant="outline-success"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Clear form for security
                            setFormData({
                              loginId: '',
                              password: ''
                            });
                            // Focus on email field
                            document.getElementById('loginId')?.focus();
                          }}
                          style={{
                            borderRadius: theme.borderRadius,
                            fontSize: '0.85rem'
                          }}
                        >
                          <i className="fas fa-user-md me-1"></i>
                          Doctor Login
                        </Button>
                      </div>
                      <div className="text-center mt-2">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Contact admin for account credentials
                        </small>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-muted">{form.buttons.signUp.preText}</span>
                      <Link 
                        to={form.buttons.signUp.link}
                        className="text-decoration-none fw-medium"
                        style={{ color: theme.primaryColor }}
                      >
                        {form.buttons.signUp.text}
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* Trust indicators */}
              <div className="text-center mt-4">
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                  {trustIndicators.map(renderTrustIndicator)}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slide-in {
          animation: slideInRight 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(8px) rotate(-120deg); }
          66% { transform: translateY(-12px) rotate(-240deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(90deg); }
          66% { transform: translateY(10px) rotate(180deg); }
        }

        .particle:nth-child(1) { top: 10%; left: 10%; }
        .particle:nth-child(2) { top: 20%; right: 15%; }
        .particle:nth-child(3) { bottom: 25%; left: 20%; }
        .particle:nth-child(4) { bottom: 15%; right: 10%; }
        .particle:nth-child(5) { top: 50%; left: -10%; }
        .particle:nth-child(6) { top: 60%; right: -5%; }

        .feature-badge {
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(30, 188, 183, 0.25) !important;
        }
      `}</style>
    </>
  );
};

export default SignIn;
