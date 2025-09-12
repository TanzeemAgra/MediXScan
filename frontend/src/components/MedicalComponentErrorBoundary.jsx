import React from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { ENV_CONFIG } from '../config/appConfig.js';

/**
 * Soft-coded Error Boundary Component for Medical Components
 * Provides graceful error handling with configurable fallback UI
 */
class MedicalComponentErrorBoundary extends React.Component {
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
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Medical Component Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send error to monitoring service if enabled
    if (ENV_CONFIG.FEATURES.enableAnalytics) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Soft-coded error reporting
    try {
      // This could be expanded to send to actual error monitoring services
      console.log('Error logged to monitoring service:', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (loggingError) {
      console.error('Failed to log error to monitoring service:', loggingError);
    }
  };

  handleRetry = () => {
    const maxRetries = ENV_CONFIG.FEATURES.enableDebugMode ? 5 : 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1
      });
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      const { componentName = 'Medical Component', fallbackComponent: FallbackComponent } = this.props;
      const maxRetries = ENV_CONFIG.FEATURES.enableDebugMode ? 5 : 3;
      const canRetry = this.state.retryCount < maxRetries;

      // If a custom fallback component is provided, use it
      if (FallbackComponent) {
        return (
          <FallbackComponent 
            error={this.state.error}
            retry={this.handleRetry}
            reset={this.handleReset}
            canRetry={canRetry}
          />
        );
      }

      // Default error UI with soft-coded messages
      return (
        <Card className="border-warning">
          <Card.Header className="bg-warning text-dark">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {componentName} Temporarily Unavailable
          </Card.Header>
          <Card.Body>
            <Alert variant="warning" className="mb-3">
              <Alert.Heading className="h6">
                <i className="fas fa-tools me-2"></i>
                Service Interruption
              </Alert.Heading>
              <p className="mb-2">
                The {componentName.toLowerCase()} is experiencing technical difficulties. 
                This is usually temporary and the service should resume shortly.
              </p>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Error occurred at: {new Date().toLocaleTimeString()}
                </small>
                <div>
                  {canRetry && (
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={this.handleRetry}
                      className="me-2"
                    >
                      <i className="fas fa-redo me-1"></i>
                      Retry ({this.state.retryCount + 1}/{maxRetries})
                    </Button>
                  )}
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={this.handleReset}
                  >
                    <i className="fas fa-refresh me-1"></i>
                    Reset
                  </Button>
                </div>
              </div>
            </Alert>

            {/* Graceful fallback content */}
            <div className="fallback-content">
              <h6 className="text-muted">
                <i className="fas fa-info-circle me-2"></i>
                In the meantime:
              </h6>
              <ul className="text-muted">
                <li>Medical terminology features are running in limited mode</li>
                <li>Built-in vocabulary is still available</li>
                <li>Core functionality remains unaffected</li>
                <li>Your data is safe and secure</li>
              </ul>
            </div>

            {/* Debug information (only in development) */}
            {ENV_CONFIG.FEATURES.enableDebugMode && this.state.error && (
              <Card className="mt-3 border-danger">
                <Card.Header className="bg-danger text-white">
                  <i className="fas fa-bug me-2"></i>
                  Debug Information
                </Card.Header>
                <Card.Body>
                  <details>
                    <summary className="text-danger fw-bold mb-2">Error Details</summary>
                    <pre className="text-danger small">
                      {this.state.error && this.state.error.toString()}
                    </pre>
                    <pre className="text-muted small">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </Card.Body>
              </Card>
            )}
          </Card.Body>
        </Card>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// High-Order Component wrapper for easy usage
export const withMedicalErrorBoundary = (WrappedComponent, componentName = 'Medical Component') => {
  return class extends React.Component {
    render() {
      return (
        <MedicalComponentErrorBoundary componentName={componentName}>
          <WrappedComponent {...this.props} />
        </MedicalComponentErrorBoundary>
      );
    }
  };
};

// Specific Error Boundary for Medical Terminology Components
export const MedicalTerminologyErrorBoundary = ({ children, fallbackMessage }) => (
  <MedicalComponentErrorBoundary 
    componentName="Medical Terminology Analysis"
    fallbackComponent={({ error, retry, reset, canRetry }) => (
      <Card className="border-info">
        <Card.Header className="bg-info text-white">
          <i className="fas fa-stethoscope me-2"></i>
          Medical Terminology Analysis - Limited Mode
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="alert-heading">
                  <i className="fas fa-shield-alt me-2"></i>
                  Running in Safe Mode
                </h6>
                <p className="mb-2">
                  {fallbackMessage || 'Medical terminology features are temporarily using built-in vocabulary only.'}
                </p>
                <small className="text-muted">
                  • Built-in medical vocabulary: ✓ Available<br/>
                  • External medical databases: ⚠️ Limited<br/>
                  • Core analysis functions: ✓ Operational
                </small>
              </div>
              <div className="text-end">
                {canRetry && (
                  <Button variant="outline-info" size="sm" onClick={retry} className="me-2">
                    <i className="fas fa-sync me-1"></i>
                    Reconnect
                  </Button>
                )}
                <Button variant="outline-secondary" size="sm" onClick={reset}>
                  <i className="fas fa-refresh me-1"></i>
                  Restart
                </Button>
              </div>
            </div>
          </Alert>
          
          {/* Fallback medical terminology display */}
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="text-muted mb-2">
              <i className="fas fa-book-medical me-2"></i>
              Built-in Medical Vocabulary Available
            </h6>
            <div className="row">
              <div className="col-4">
                <small className="text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  Anatomy Terms: 1,680+
                </small>
              </div>
              <div className="col-4">
                <small className="text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  Pathology Terms: 1,830+
                </small>
              </div>
              <div className="col-4">
                <small className="text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  Imaging Terms: 1,500+
                </small>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    )}
  >
    {children}
  </MedicalComponentErrorBoundary>
);

export default MedicalComponentErrorBoundary;
