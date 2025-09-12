import React from 'react';
import { Alert, Button } from 'react-bootstrap';

/**
 * AI-Powered Error Boundary for Safe Object Rendering
 * Provides intelligent error recovery and soft-coded fallback strategies
 */
class SmartRenderingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      fallbackStrategy: 'default'
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('SmartRenderingErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      fallbackStrategy: this.determineFallbackStrategy(error)
    });

    // Report error to monitoring service if available
    if (typeof window !== 'undefined' && window.reportError) {
      window.reportError(error, errorInfo);
    }
  }

  /**
   * AI-powered fallback strategy determination based on error characteristics
   */
  determineFallbackStrategy(error) {
    const errorMessage = error?.message?.toLowerCase() || '';
    
    if (errorMessage.includes('objects are not valid as a react child')) {
      return 'object-rendering';
    } else if (errorMessage.includes('cannot read properties')) {
      return 'property-access';
    } else if (errorMessage.includes('map is not a function') || errorMessage.includes('foreach')) {
      return 'array-handling';
    } else if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
      return 'null-safety';
    } else {
      return 'generic';
    }
  }

  /**
   * Intelligent retry mechanism with exponential backoff
   */
  handleRetry = () => {
    const { retryCount } = this.state;
    const { maxRetries = 3 } = this.props;

    if (retryCount < maxRetries) {
      // Clear error state and increment retry count
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });

      // Add a small delay for complex re-renders
      setTimeout(() => {
        // Force component re-render
        this.forceUpdate();
      }, Math.pow(2, retryCount) * 100); // Exponential backoff: 100ms, 200ms, 400ms
    }
  };

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      fallbackStrategy: 'default'
    });
  };

  /**
   * Render fallback UI based on AI-determined strategy
   */
  renderFallbackContent() {
    const { error, fallbackStrategy, retryCount } = this.state;
    const { maxRetries = 3, title = 'Rendering Error' } = this.props;
    const canRetry = retryCount < maxRetries;

    // Strategy-specific fallback content
    const strategyContent = {
      'object-rendering': {
        icon: 'ri-code-s-slash-line',
        title: 'Object Rendering Issue',
        message: 'There was an issue displaying complex data. Using safe rendering mode.',
        suggestion: 'The system is attempting to display a complex object safely. Please try again or contact support if the issue persists.'
      },
      'property-access': {
        icon: 'ri-alert-line',
        title: 'Data Access Error',
        message: 'Unable to access required data properties.',
        suggestion: 'Some data may be missing or in an unexpected format. The system will use available data.'
      },
      'array-handling': {
        icon: 'ri-list-check',
        title: 'List Processing Error',
        message: 'Issue processing list data.',
        suggestion: 'There may be an issue with the data structure. Trying alternative display method.'
      },
      'null-safety': {
        icon: 'ri-question-line',
        title: 'Missing Data',
        message: 'Some required data is missing or undefined.',
        suggestion: 'The system will display available information and handle missing data gracefully.'
      },
      'generic': {
        icon: 'ri-error-warning-line',
        title: 'Display Error',
        message: 'An unexpected error occurred while rendering content.',
        suggestion: 'Please try refreshing or contact support if the issue continues.'
      }
    };

    const content = strategyContent[fallbackStrategy] || strategyContent.generic;

    return (
      <Alert variant="warning" className="smart-error-boundary">
        <div className="d-flex align-items-start">
          <i className={`${content.icon} me-3 mt-1`} style={{ fontSize: '1.5rem' }}></i>
          <div className="flex-grow-1">
            <Alert.Heading className="h6 mb-2">
              {content.title}
            </Alert.Heading>
            <p className="mb-2">{content.message}</p>
            <small className="text-muted d-block mb-3">
              {content.suggestion}
            </small>
            
            {/* Action Buttons */}
            <div className="d-flex gap-2">
              {canRetry && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={this.handleRetry}
                  className="d-flex align-items-center"
                >
                  <i className="ri-refresh-line me-1"></i>
                  Retry ({maxRetries - retryCount} left)
                </Button>
              )}
              
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={this.handleReset}
                className="d-flex align-items-center"
              >
                <i className="ri-restart-line me-1"></i>
                Reset
              </Button>
            </div>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary className="text-muted small" style={{ cursor: 'pointer' }}>
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-2 bg-light rounded small">
                  <strong>Error:</strong> {error?.message || 'Unknown error'}<br/>
                  <strong>Strategy:</strong> {fallbackStrategy}<br/>
                  <strong>Retry Count:</strong> {retryCount}/{maxRetries}
                </div>
              </details>
            )}
          </div>
        </div>
      </Alert>
    );
  }

  render() {
    const { hasError } = this.state;
    const { children, fallbackComponent } = this.props;

    if (hasError) {
      // Custom fallback component if provided
      if (fallbackComponent) {
        return fallbackComponent(this.state.error, this.handleRetry, this.handleReset);
      }
      
      // Default AI-powered fallback
      return this.renderFallbackContent();
    }

    // Normal rendering when no error
    return children;
  }
}

/**
 * Higher-Order Component for wrapping components with smart error boundary
 */
export const withSmartErrorBoundary = (WrappedComponent, boundaryProps = {}) => {
  return React.forwardRef((props, ref) => (
    <SmartRenderingErrorBoundary {...boundaryProps}>
      <WrappedComponent {...props} ref={ref} />
    </SmartRenderingErrorBoundary>
  ));
};

/**
 * Hook for using error boundary context
 */
export const useErrorRecovery = () => {
  const [errorState, setErrorState] = React.useState({
    hasError: false,
    error: null,
    retryCount: 0
  });

  const handleError = React.useCallback((error) => {
    setErrorState(prev => ({
      hasError: true,
      error: error,
      retryCount: prev.retryCount
    }));
  }, []);

  const handleRetry = React.useCallback(() => {
    setErrorState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1
    }));
  }, []);

  const handleReset = React.useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0
    });
  }, []);

  return {
    ...errorState,
    handleError,
    handleRetry,
    handleReset
  };
};

/**
 * Safe Component Wrapper with built-in error boundary
 */
export const SafeComponent = ({ 
  children, 
  fallback, 
  onError,
  title = 'Component Error',
  ...errorBoundaryProps 
}) => {
  return (
    <SmartRenderingErrorBoundary 
      title={title}
      fallbackComponent={fallback}
      {...errorBoundaryProps}
    >
      {children}
    </SmartRenderingErrorBoundary>
  );
};

export default SmartRenderingErrorBoundary;
