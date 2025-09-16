import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Button, Card, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import { ENV_CONFIG } from '../../config/appConfig';
import { SECURE_LOGIN_CONFIG, SecureLoginUtils } from '../../config/secureLoginConfig';
import landingPageConfig from "@config/landingPageConfig.js";

// Enhanced secure sign-in configuration
const secureSignInConfig = {
  page: {
    title: "Secure Access Portal",
    subtitle: "MediXScan Radiology Intelligence Platform",
    description: "Enter your authorized credentials to access the system"
  },
  form: {
    fields: [
      {
        id: 'loginId',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your registered email',
        icon: 'fas fa-envelope',
        required: true,
        autoComplete: 'email'
      },
      {
        id: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your secure password',
        icon: 'fas fa-lock',
        required: true,
        autoComplete: 'current-password'
      }
    ],
    buttons: {
      submit: {
        text: 'Secure Sign In',
        loadingText: 'Authenticating...',
        icon: 'fas fa-shield-alt'
      }
    }
  },
  redirectPath: '/dashboard/main-dashboard'
};

const SecureSignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUniversalAuth();
  const [formData, setFormData] = useState(SecureLoginUtils.clearFormData());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const { brand, theme } = landingPageConfig;
  const { page, form, redirectPath } = secureSignInConfig;
  const { security, helpText, buttons } = SECURE_LOGIN_CONFIG;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
    setIsVisible(true);
    SecureLoginUtils.focusFirstInput();
  }, [isAuthenticated, navigate, redirectPath]);

  // Enhanced input change handler with validation
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Enhanced submit handler with security features
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      setError(SECURE_LOGIN_CONFIG.errorMessages.locked);
      return;
    }
    
    // Validate input format
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
      console.log('🔒 Secure login attempt for:', formData.loginId.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      const result = await login({
        email: formData.loginId.trim(),
        password: formData.password
      });
      
      if (result.success) {
        console.log('✅ Secure login successful');
        setAttemptCount(0); // Reset attempt count on success
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

  // Enhanced error handling with attempt tracking
  const handleLoginFailure = (err) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Lock account after max attempts
    if (newAttemptCount >= security.maxLoginAttempts) {
      setIsLocked(true);
      setError(SECURE_LOGIN_CONFIG.errorMessages.locked);
      
      // Auto-unlock after lockout duration
      setTimeout(() => {
        setIsLocked(false);
        setAttemptCount(0);
      }, security.lockoutDuration * 60 * 1000);
      
      return;
    }
    
    const errorMessage = SecureLoginUtils.getErrorMessage(err);
    const remainingAttempts = security.maxLoginAttempts - newAttemptCount;
    
    setError(`${errorMessage} (${remainingAttempts} attempts remaining)`);
    
    // Clear form on failure for security
    setFormData(SecureLoginUtils.clearFormData());
    SecureLoginUtils.focusFirstInput();
  };

  // Secure button click handler
  const handleSecureButtonClick = (type) => {
    // Clear form for security
    setFormData(SecureLoginUtils.clearFormData());
    
    // Show appropriate help message
    const helpMessage = SecureLoginUtils.showSecurityMessage('help');
    
    // Focus on first input
    SecureLoginUtils.focusFirstInput();
    
    // Show contextual help
    setError(''); // Clear any existing errors
  };

  return (
    <div
      className={`min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}15 0%, ${theme.accentColor}10 100%)`,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Background Elements */}
      <div className="position-absolute w-100 h-100">
        {/* Animated background shapes */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle opacity-10"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`,
              top: `${20 + i * 30}%`,
              left: `${-10 + i * 15}%`,
              animation: `float ${8 + i * 2}s ease-in-out infinite`,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transition: `all ${0.8 + i * 0.2}s cubic-bezier(0.4, 0, 0.2, 1)`
            }}
          />
        ))}
      </div>

      <Container fluid className="position-relative">
        <Row className="justify-content-center align-items-center min-vh-100">
          {/* Left side - Branding & Security Features */}
          <Col lg={6} className="d-none d-lg-block">
            <div className="p-5">
              {/* Brand */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`
                    }}
                  >
                    <i className="fas fa-shield-alt text-white fs-3"></i>
                  </div>
                  <div>
                    <h2 className="mb-0 fw-bold text-dark">{brand.name}</h2>
                    <p className="mb-0 text-muted">{page.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div>
                <h4 className="mb-4 fw-bold text-dark">
                  <i className="fas fa-lock me-2" style={{ color: theme.primaryColor }}></i>
                  Enterprise Security
                </h4>
                {SECURE_LOGIN_CONFIG.securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-start mb-4 p-3 rounded-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all ${0.8 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: `${theme.primaryColor}15`
                      }}
                    >
                      <i className={`${feature.icon} text-primary`}></i>
                    </div>
                    <div>
                      <h6 className="mb-1 fw-semibold text-dark">{feature.text}</h6>
                      <p className="mb-0 text-muted small">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right side - Secure Login Form */}
          <Col lg={6} md={8} sm={10} xs={11}>
            <div className="d-flex justify-content-center">
              <Card
                className="border-0 shadow-lg"
                style={{
                  maxWidth: '450px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: theme.borderRadius,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Card.Body className="p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`
                      }}
                    >
                      <i className="fas fa-shield-alt text-white fs-2"></i>
                    </div>
                    <h3 className="mb-2 fw-bold text-dark">{page.title}</h3>
                    <p className="text-muted mb-0">{page.description}</p>
                  </div>

                  {/* Security Alert */}
                  {(attemptCount > 0 || isLocked) && (
                    <Alert variant={isLocked ? "danger" : "warning"} className="mb-3">
                      <i className={`fas fa-${isLocked ? 'lock' : 'exclamation-triangle'} me-2`}></i>
                      {isLocked 
                        ? `Account temporarily locked. Try again in ${security.lockoutDuration} minutes.`
                        : `${attemptCount} failed attempt${attemptCount > 1 ? 's' : ''}. ${security.maxLoginAttempts - attemptCount} remaining.`
                      }
                    </Alert>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Alert variant="danger" className="mb-3">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {/* Secure Login Form */}
                  <Form onSubmit={handleSubmit}>
                    {form.fields.map((field, index) => (
                      <div className="mb-3" key={field.id}>
                        <Form.Label className="fw-semibold text-dark">
                          <i className={`${field.icon} me-2`}></i>
                          {field.label}
                        </Form.Label>
                        <FormControl
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                          autoComplete={field.autoComplete}
                          disabled={loading || isLocked}
                          className="form-control-lg"
                          style={{
                            borderRadius: theme.borderRadius,
                            borderColor: error ? '#dc3545' : '#e0e0e0',
                            fontSize: '1rem',
                            padding: '12px 16px'
                          }}
                        />
                      </div>
                    ))}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 fw-semibold mb-3"
                      disabled={loading || isLocked || !formData.loginId || !formData.password}
                      style={{
                        borderRadius: theme.borderRadius,
                        background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`,
                        border: 'none',
                        padding: '12px'
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

                    {/* Secure Access Help Buttons */}
                    <div className="mb-3">
                      <p className="text-center text-muted mb-3 small">
                        <i className="fas fa-info-circle me-1"></i>
                        Need access credentials?
                      </p>
                      <div className="d-flex gap-2 flex-column">
                        {Object.entries(buttons).map(([key, button]) => (
                          <Button
                            key={key}
                            type="button"
                            variant={button.variant}
                            size="sm"
                            className="w-100"
                            onClick={() => handleSecureButtonClick(key)}
                            disabled={loading}
                            style={{
                              borderRadius: theme.borderRadius,
                              fontSize: '0.85rem'
                            }}
                          >
                            <i className={`${button.icon} me-2`}></i>
                            {button.text}
                          </Button>
                        ))}
                      </div>
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          <i className="fas fa-phone me-1"></i>
                          Contact system administrator for account setup
                        </small>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="text-center">
                      <small className="text-muted">
                        <i className="fas fa-shield-alt me-1"></i>
                        This system is monitored. All access is logged.
                      </small>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};

export default SecureSignIn;