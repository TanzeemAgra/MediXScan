import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import systemConfig, { getErrorMessage, getErrorType, getRecoveryAction } from '../config/systemConfig.js';
import landingPageConfig from '../config/landingPageConfig.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const errorType = getErrorType(this.state.error);
      const errorMessage = getErrorMessage(this.state.error);
      const recoveryAction = getRecoveryAction(errorType);
      const { theme } = landingPageConfig;

      return (
        <div 
          className="error-boundary-container d-flex align-items-center min-vh-100"
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

          <Container className="position-relative z-3">
            <Row className="justify-content-center">
              <Col lg={8} xl={6}>
                <Card 
                  className="border-0 text-center"
                  style={{
                    borderRadius: theme.borderRadius,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  <Card.Body className="p-5">
                    {/* Error Icon */}
                    <div 
                      className="error-icon mb-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      <i 
                        className="fas fa-exclamation-triangle text-white" 
                        style={{ fontSize: '2.5rem' }}
                      ></i>
                    </div>

                    <h2 className="fw-bold mb-3" style={{ color: '#dc3545' }}>
                      Oops! Something went wrong
                    </h2>

                    <Alert 
                      variant="danger" 
                      className="text-start mb-4"
                      style={{ borderRadius: theme.borderRadius }}
                    >
                      <Alert.Heading className="h6 mb-2">
                        <i className="fas fa-bug me-2"></i>
                        Error Details
                      </Alert.Heading>
                      <p className="mb-0">{errorMessage}</p>
                    </Alert>

                    <div className="mb-4">
                      <p className="text-muted mb-3">
                        We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.
                      </p>
                      
                      <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                        {recoveryAction?.action === 'retry' && this.state.retryCount < recoveryAction.maxRetries && (
                          <Button
                            variant="primary"
                            onClick={this.handleRetry}
                            style={{
                              background: theme.gradient,
                              border: 'none',
                              borderRadius: theme.borderRadius
                            }}
                          >
                            <i className="fas fa-redo me-2"></i>
                            Try Again
                          </Button>
                        )}

                        <Button
                          variant="outline-primary"
                          onClick={this.handleReload}
                          style={{
                            borderColor: theme.primaryColor,
                            color: theme.primaryColor,
                            borderRadius: theme.borderRadius
                          }}
                        >
                          <i className="fas fa-sync me-2"></i>
                          Reload Page
                        </Button>

                        <Button
                          variant="outline-secondary"
                          onClick={this.handleGoHome}
                          style={{ borderRadius: theme.borderRadius }}
                        >
                          <i className="fas fa-home me-2"></i>
                          Go Home
                        </Button>
                      </div>
                    </div>

                    {/* Technical Details (Development Mode) */}
                    {systemConfig.app.environment === 'development' && this.state.errorInfo && (
                      <details className="text-start mt-4">
                        <summary className="fw-bold mb-2 cursor-pointer">
                          Technical Details (Development Mode)
                        </summary>
                        <pre 
                          className="bg-light p-3 rounded"
                          style={{ 
                            fontSize: '0.8rem',
                            maxHeight: '200px',
                            overflow: 'auto',
                            borderRadius: theme.borderRadius
                          }}
                        >
                          {this.state.error && this.state.error.toString()}
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </Card.Body>
                </Card>

                {/* Help Information */}
                <div className="text-center mt-4">
                  <p className="text-white mb-2" style={{ opacity: 0.8 }}>
                    <i className="fas fa-question-circle me-2"></i>
                    Need help? Contact our support team
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <a 
                      href="mailto:support@medixscan.com" 
                      className="text-white text-decoration-none"
                      style={{ opacity: 0.8 }}
                    >
                      <i className="fas fa-envelope me-1"></i>
                      support@medixscan.com
                    </a>
                    <span className="text-white" style={{ opacity: 0.5 }}>|</span>
                    <a 
                      href="tel:+1-800-MEDIX-AI" 
                      className="text-white text-decoration-none"
                      style={{ opacity: 0.8 }}
                    >
                      <i className="fas fa-phone me-1"></i>
                      1-800-MEDIX-AI
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          <style jsx>{`
            @keyframes pulse {
              0% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(255, 107, 107, 0.6);
              }
              100% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
              }
            }

            .cursor-pointer {
              cursor: pointer;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
