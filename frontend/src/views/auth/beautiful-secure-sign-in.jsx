import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Button, Card, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENV_CONFIG } from '../../config/appConfig';
import { SECURE_LOGIN_CONFIG, SecureLoginUtils } from '../../config/secureLoginConfig';
import landingPageConfig from "../../config/landingPageConfig.js";

// Enhanced soft-coded configuration maintaining original beautiful design
const beautifulSecureSignInConfig = {
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
  // Secure access helpers (no exposed credentials)
  secureAccess: {
    title: "Secure System Access",
    subtitle: "Contact administrator for credentials",
    helpers: [
      {
        id: 'admin',
        title: 'Administrator',
        icon: 'fas fa-user-shield',
        variant: 'outline-primary',
        description: 'System administrators and superusers'
      },
      {
        id: 'doctor', 
        title: 'Medical Staff',
        icon: 'fas fa-user-md',
        variant: 'outline-success',
        description: 'Doctors and medical professionals'
      }
    ]
  },
  redirectPath: '/dashboard/main-dashboard'
};

const BeautifulSecureSignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(SecureLoginUtils.clearFormData());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const { brand, theme } = landingPageConfig;
  const { page, form, features, trustIndicators, secureAccess, redirectPath } = beautifulSecureSignInConfig;
  const { security } = SECURE_LOGIN_CONFIG;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
    setIsVisible(true);
  }, [isAuthenticated, navigate, redirectPath]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(SECURE_LOGIN_CONFIG.errorMessages.locked);
      return;
    }
    
    const validationErrors = SecureLoginUtils.validateCredentialFormat(
      formData.loginId, 
      formData.password
    );
    
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('🔑 Secure login attempt for:', formData.loginId.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      const result = await login(formData.loginId.trim(), formData.password);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to dashboard');
        setAttemptCount(0);
        navigate(redirectPath);
      } else {
        handleLoginFailure(result.error);
      }
      
    } catch (err) {
      handleLoginFailure(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFailure = (err) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    if (newAttemptCount >= security.maxLoginAttempts) {
      setIsLocked(true);
      setError(SECURE_LOGIN_CONFIG.errorMessages.locked);
      
      setTimeout(() => {
        setIsLocked(false);
        setAttemptCount(0);
      }, security.lockoutDuration * 60 * 1000);
      
      return;
    }
    
    const errorMessage = SecureLoginUtils.getErrorMessage(err);
    const remainingAttempts = security.maxLoginAttempts - newAttemptCount;
    
    setError(`${errorMessage} (${remainingAttempts} attempts remaining)`);
    
    // Clear form for security but maintain beautiful UX
    setTimeout(() => {
      setFormData(SecureLoginUtils.clearFormData());
      SecureLoginUtils.focusFirstInput();
    }, 1500);
  };

  // Secure helper button click - clears form and shows help
  const handleSecureHelperClick = (type) => {
    setFormData(SecureLoginUtils.clearFormData());
    setError('');
    SecureLoginUtils.focusFirstInput();
  };

  return (
    <div
      className={`min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}15 0%, ${theme.accentColor}10 100%)`,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Beautiful Background Elements - Original Design */}
      <div className="position-absolute w-100 h-100">
        {/* Medical Cross Pattern */}
        <div className="position-absolute" style={{ top: '10%', left: '5%', opacity: 0.1 }}>
          <i className="fas fa-plus" style={{ fontSize: '3rem', color: theme.primaryColor }}></i>
        </div>
        <div className="position-absolute" style={{ bottom: '15%', right: '8%', opacity: 0.1 }}>
          <i className="fas fa-heartbeat" style={{ fontSize: '4rem', color: theme.accentColor }}></i>
        </div>
        <div className="position-absolute" style={{ top: '30%', right: '15%', opacity: 0.08 }}>
          <i className="fas fa-user-md" style={{ fontSize: '2.5rem', color: theme.primaryColor }}></i>
        </div>
        
        {/* Animated Gradient Orbs - Original Beautiful Animation */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              background: `linear-gradient(${45 + i * 90}deg, ${theme.primaryColor}${i < 2 ? '20' : '15'}, ${theme.accentColor}${i < 2 ? '15' : '10'})`,
              top: `${15 + i * 20}%`,
              left: `${-5 + i * 20}%`,
              animation: `float ${6 + i * 1.5}s ease-in-out infinite`,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isVisible ? 1 : 0,
              transition: `all ${0.8 + i * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`
            }}
          />
        ))}
      </div>

      <Container fluid className="position-relative">
        <Row className="justify-content-center align-items-center min-vh-100">
          {/* Left side - Beautiful Brand & Features (Original Design) */}
          <Col lg={6} className="d-none d-lg-block">
            <div className="p-5">
              {/* Brand Section - Original Beautiful Design */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-4 shadow-lg"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`,
                      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <i className="fas fa-heartbeat text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <div>
                    <h2 className="mb-1 fw-bold text-dark" style={{ fontSize: '2.2rem' }}>{brand.name}</h2>
                    <p className="mb-0 text-muted fs-5">{page.subtitle}</p>
                    <Badge bg="success" className="mt-2">
                      <i className="fas fa-check-circle me-1"></i>
                      AI-Powered Platform
                    </Badge>
                  </div>
                </div>
                
                <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                  {page.description}
                </p>
              </div>

              {/* Features - Original Beautiful Cards */}
              <div>
                <h4 className="mb-4 fw-bold text-dark">
                  <i className="fas fa-star me-2" style={{ color: theme.primaryColor }}></i>
                  Platform Features
                </h4>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all ${0.6 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: `${theme.primaryColor}20`
                      }}
                    >
                      <i className={`${feature.icon} text-primary fs-5`}></i>
                    </div>
                    <span className="fw-semibold text-dark">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators - Original Design */}
              <div className="mt-5">
                <div className="d-flex justify-content-start align-items-center gap-4 flex-wrap">
                  {trustIndicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center text-muted"
                      style={{
                        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                        opacity: isVisible ? 1 : 0,
                        transition: `all ${1 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`
                      }}
                    >
                      <i className={`${indicator.icon} me-2`} style={{ color: theme.primaryColor }}></i>
                      <small className="fw-medium">{indicator.text}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>

          {/* Right side - Beautiful Secure Login Form */}
          <Col lg={6} md={8} sm={10} xs={11}>
            <div className="d-flex justify-content-center">
              <Card
                className="border-0 shadow-xl"
                style={{
                  maxWidth: '480px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Card.Body className="p-5">
                  {/* Header - Beautiful Original Style */}
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-lg"
                      style={{
                        width: '90px',
                        height: '90px',
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                        transform: isVisible ? 'rotateY(0deg)' : 'rotateY(-90deg)',
                        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <i className="fas fa-user-circle text-white" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="mb-2 fw-bold text-dark">{page.title}</h3>
                    <p className="text-muted mb-0">{page.description}</p>
                  </div>

                  {/* Security Alerts */}
                  {(attemptCount > 0 || isLocked) && (
                    <Alert variant={isLocked ? "danger" : "warning"} className="mb-3 rounded-3">
                      <i className={`fas fa-${isLocked ? 'lock' : 'exclamation-triangle'} me-2`}></i>
                      {isLocked 
                        ? `Account temporarily locked. Try again in ${security.lockoutDuration} minutes.`
                        : `${attemptCount} failed attempt${attemptCount > 1 ? 's' : ''}. ${security.maxLoginAttempts - attemptCount} remaining.`
                      }
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger" className="mb-3 rounded-3">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {/* Beautiful Secure Form */}
                  <Form onSubmit={handleSubmit}>
                    {form.fields.map((field, index) => (
                      <div className="mb-4" key={field.id}>
                        <Form.Label className="fw-semibold text-dark mb-2">
                          <i className={`${field.icon} me-2 text-primary`}></i>
                          {field.label}
                        </Form.Label>
                        <FormControl
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                          disabled={loading || isLocked}
                          className="form-control-lg shadow-sm"
                          style={{
                            borderRadius: '12px',
                            borderColor: error ? '#dc3545' : '#e8e8e8',
                            fontSize: '1rem',
                            padding: '15px 20px',
                            background: 'rgba(248, 249, 250, 0.8)',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primaryColor;
                            e.target.style.boxShadow = `0 0 0 0.2rem ${theme.primaryColor}25`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e8e8e8';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    ))}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-100 fw-semibold mb-4 shadow"
                      disabled={loading || isLocked || !formData.loginId || !formData.password}
                      style={{
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                        border: 'none',
                        padding: '15px',
                        fontSize: '1.1rem',
                        transform: loading ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          {form.buttons.submit.loadingText}
                        </>
                      ) : (
                        <>
                          <i className={`${form.buttons.submit.icon} me-2`}></i>
                          {form.buttons.submit.text}
                        </>
                      )}
                    </Button>

                    {/* Secure Access Helpers - Beautiful Design */}
                    <div className="mb-4">
                      <p className="text-center text-muted mb-3 small fw-medium">
                        <i className="fas fa-info-circle me-1"></i>
                        {secureAccess.title}
                      </p>
                      <div className="d-flex gap-2">
                        {secureAccess.helpers.map((helper, index) => (
                          <Button
                            key={helper.id}
                            type="button"
                            variant={helper.variant}
                            size="sm"
                            className="flex-1 shadow-sm"
                            onClick={() => handleSecureHelperClick(helper.id)}
                            disabled={loading}
                            style={{
                              borderRadius: '10px',
                              fontSize: '0.9rem',
                              padding: '10px',
                              transition: 'all 0.3s ease'
                            }}
                            title={helper.description}
                          >
                            <i className={`${helper.icon} me-2`}></i>
                            {helper.title}
                          </Button>
                        ))}
                      </div>
                      <div className="text-center mt-3">
                        <small className="text-muted fw-medium">
                          <i className="fas fa-shield-alt me-1 text-primary"></i>
                          {secureAccess.subtitle}
                        </small>
                      </div>
                    </div>

                    {/* Sign Up Link - Original Beautiful Style */}
                    <div className="text-center">
                      <span className="text-muted">{form.buttons.signUp.preText}</span>
                      <Link 
                        to={form.buttons.signUp.link}
                        className="text-decoration-none fw-semibold"
                        style={{ 
                          color: theme.primaryColor,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = theme.accentColor}
                        onMouseLeave={(e) => e.target.style.color = theme.primaryColor}
                      >
                        {form.buttons.signUp.text}
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Beautiful Floating Animation - Original Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1;
          }
          25% { 
            transform: translateY(-15px) rotate(2deg); 
            opacity: 0.15;
          }
          50% { 
            transform: translateY(-30px) rotate(0deg); 
            opacity: 0.1;
          }
          75% { 
            transform: translateY(-15px) rotate(-2deg); 
            opacity: 0.12;
          }
        }
      `}</style>
    </div>
  );
};

export default BeautifulSecureSignIn;