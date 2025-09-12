import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import landingPageConfig from '../../config/landingPageConfig';

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const SignIn = () => {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { brand, theme } = landingPageConfig;

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard/main-dashboard');
    }
    setIsVisible(true);
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.login(loginId, password);
      if (response.token) {  // Our API returns 'token', not 'access_token'
        authLogin(); // Update auth context
        navigate('/dashboard/main-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    {[
                      { icon: 'fas fa-shield-alt', text: 'HIPAA Compliant' },
                      { icon: 'fas fa-bolt', text: '99.7% Accuracy' },
                      { icon: 'fas fa-users', text: 'Multi-Doctor Support' }
                    ].map((feature, index) => (
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
                    ))}
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
                    <h3 className="fw-bold mb-2">Welcome Back</h3>
                    <p className="text-muted">
                      Sign in to your radiology intelligence platform
                    </p>
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

                    <div className="form-group mb-3">
                      <label htmlFor="loginId" className="form-label fw-medium text-dark">
                        <i className="fas fa-envelope me-2" style={{ color: theme.primaryColor }}></i>
                        Email or Username
                      </label>
                      <FormControl
                        type="text"
                        className="form-control-lg"
                        id="loginId"
                        placeholder="Enter your email or username"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
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

                    <div className="form-group mb-4">
                      <label htmlFor="password" className="form-label fw-medium text-dark">
                        <i className="fas fa-lock me-2" style={{ color: theme.primaryColor }}></i>
                        Password
                      </label>
                      <Form.Control
                        type="password"
                        className="form-control-lg"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                        to="/auth/forgot-password" 
                        className="text-decoration-none"
                        style={{ color: theme.primaryColor }}
                      >
                        Forgot password?
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
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">Don't have an account? </span>
                      <Link 
                        to="/auth/sign-up" 
                        className="text-decoration-none fw-medium"
                        style={{ color: theme.primaryColor }}
                      >
                        Start Free Trial
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* Trust indicators */}
              <div className="text-center mt-4">
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                  {[
                    { icon: 'fas fa-shield-alt', text: 'HIPAA Secure' },
                    { icon: 'fas fa-lock', text: 'End-to-End Encrypted' },
                    { icon: 'fas fa-certificate', text: 'ISO 27001 Certified' }
                  ].map((trust, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <i 
                        className={`${trust.icon} text-white`} 
                        style={{ fontSize: '1rem', opacity: 0.8 }}
                      ></i>
                      <small className="text-white" style={{ opacity: 0.8 }}>
                        {trust.text}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
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
                <div className='d-flex flex-column align-items-center justify-content-center h-100'>
                  <div style={{ width: '300px', height: '300px', marginBottom: '2rem' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 500 500'
                      width='100%'
                      height='100%'
                    >
                      <g fill='#FFFFFF'>
                        <path d='M397.5 186.5h-84v-84c0-11.6-9.4-21-21-21h-84c-11.6 0-21 9.4-21 21v84h-84c-11.6 0-21 9.4-21 21v84c0 11.6 9.4 21 21 21h84v84c0 11.6 9.4 21 21 21h84c11.6 0 21-9.4 21-21v-84h84c11.6 0 21-9.4 21-21v-84c0-11.6-9.4-21-21-21zm0 105c0 0-84 0-84 0 -11.6 0-21 9.4-21 21v84h-84v-84c0-11.6-9.4-21-21-21h-84v-84h84c11.6 0 21-9.4 21-21v-84h84v84c0 11.6 9.4 21 21 21h84v84z' />
                      </g>
                    </svg>
                  </div>
                  <h1
                    className='text-white mb-3'
                    style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1EBCB7' }}
                  >
                    MediXscan
                  </h1>
                  <h3
                    className='text-white mb-4'
                    style={{ letterSpacing: '5px', color: '#1EBCB7' }}
                  >
                    RUG-REL
                  </h3>
                  <p className='text-white text-center px-4'>
                    Advanced AI-powered analysis of radiology reports, helping medical professionals
                    make better diagnostic decisions.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className='position-relative z-2'>
              <div className='sign-in-from d-flex flex-column justify-content-center'>
                <h1 className='mb-0'>Sign In</h1>
                <Form className='mt-4' onSubmit={handleSubmit}>
                  {error && <div className='alert alert-danger'>{error}</div>}
                  <p>Enter your Gmail or username and password to access admin panel.</p>
                  <div className='form-group'>
                    <label htmlFor='loginId'>Gmail or Username</label>
                    <FormControl
                      type='text'
                      className='form-control'
                      id='loginId'
                      placeholder='Enter Gmail or username'
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                    />
                  </div>
                  <div className='d-flex justify-content-between form-group mb-0'>
                    <label htmlFor='password'>Password</label>
                  </div>
                  <Form.Control
                    type='password'
                    id='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className='d-flex w-100 justify-content-between align-items-center mt-3'>
                    <label className='d-inline-block form-group mb-0 d-flex'>
                      <input type='checkbox' className='me-2' />
                      <span>Remember me</span>
                    </label>
                    <button type='submit' className='btn btn-primary' disabled={loading}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                  {error && (
                    <div className='alert alert-danger mt-3' role='alert'>
                      {error}
                    </div>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignIn;
