// Authentication Error Boundary
// Catches and recovers from authentication context errors

import React from 'react';
import { Button, Container, Alert } from 'react-bootstrap';

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Check if it's an auth-related error
    if (error.message && error.message.includes('useAuth must be used within an AuthProvider')) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    // Log auth errors for debugging
    if (error.message && error.message.includes('useAuth must be used within an AuthProvider')) {
      console.error('Authentication Context Error:', error);
      console.error('Error Info:', errorInfo);
      
      this.setState({
        error: error,
        errorInfo: errorInfo
      });

      // Attempt to recover by clearing auth state and redirecting
      this.attemptRecovery();
    }
  }

  attemptRecovery = () => {
    try {
      // Clear any stored auth state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('authState');
      
      // Wait a bit then redirect to login
      setTimeout(() => {
        window.location.href = '/auth/sign-in';
      }, 3000);
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
    }
  };

  handleRetry = () => {
    // Try to reload the page after clearing auth state
    this.attemptRecovery();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="warning" className="mb-4">
              <Alert.Heading>Authentication System Error</Alert.Heading>
              <p>
                There was an issue with the authentication system. 
                You will be automatically redirected to the login page in a moment.
              </p>
              <hr />
              <p className="mb-0">
                If this issue persists, please try clearing your browser cache or contact support.
              </p>
            </Alert>

            <div className="mb-3">
              <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Redirecting to login page...
            </div>

            <Button 
              variant="primary" 
              onClick={this.handleRetry}
              size="sm"
            >
              Go to Login Now
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-start">
                <summary className="text-muted small">Error Details (Development)</summary>
                <pre className="small text-muted mt-2">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;