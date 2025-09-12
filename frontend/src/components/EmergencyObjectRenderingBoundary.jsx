import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Emergency Error Boundary specifically designed to catch "Objects are not valid as a React child" errors
 * This is a last resort boundary to prevent the entire application from crashing
 */
class EmergencyObjectRenderingBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorDetails: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Check if this is specifically an object rendering error
    if (error && error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🚨 EMERGENCY: Object rendering error caught by boundary:', error);
      return { 
        hasError: true, 
        errorDetails: error.message,
        errorCount: 1
      };
    }
    
    // For other errors, let them bubble up
    return null;
  }

  componentDidCatch(error, errorInfo) {
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🚨 EMERGENCY BOUNDARY: Detailed error info:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
      
      // Try to identify which object is causing the issue
      const objectMatch = error.message.match(/found: object with keys \{([^}]+)\}/);
      if (objectMatch) {
        console.error('🔍 PROBLEMATIC OBJECT KEYS:', objectMatch[1]);
      }
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      errorDetails: null,
      errorCount: this.state.errorCount + 1
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="emergency-error-boundary p-4">
          <Alert variant="danger" className="mb-4">
            <Alert.Heading className="h5">
              <i className="ri-error-warning-line me-2"></i>
              Object Rendering Error Prevented
            </Alert.Heading>
            
            <p className="mb-3">
              An attempt was made to render a JavaScript object directly as React content. 
              This has been safely intercepted to prevent the application from crashing.
            </p>
            
            <details className="mb-3">
              <summary className="btn btn-outline-secondary btn-sm">
                View Technical Details
              </summary>
              <div className="mt-3 p-3 bg-light rounded">
                <small className="font-monospace text-dark">
                  {this.state.errorDetails}
                </small>
              </div>
            </details>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary btn-sm" 
                onClick={this.handleRetry}
                disabled={this.state.errorCount > 3}
              >
                <i className="ri-refresh-line me-1"></i>
                Try Again {this.state.errorCount > 0 && `(${this.state.errorCount})`}
              </button>
              
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={() => window.location.reload()}
              >
                <i className="ri-restart-line me-1"></i>
                Reload Page
              </button>
            </div>
            
            {this.state.errorCount > 3 && (
              <Alert variant="warning" className="mt-3 mb-0">
                <small>
                  <i className="ri-information-line me-1"></i>
                  Multiple retry attempts detected. Consider reloading the page or contacting support.
                </small>
              </Alert>
            )}
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EmergencyObjectRenderingBoundary;
