// Role-Based Route Protection Component
// Prevents access to routes based on user permissions

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';

const RoleProtectedRoute = ({ 
  children, 
  requiredPermission = null,
  requiredRole = null,
  minimumRoleLevel = null,
  fallbackPath = '/dashboard',
  showAccessDenied = true 
}) => {
  const { 
    isAuthenticated, 
    loading, 
    hasPermission, 
    hasRole, 
    hasMinimumRoleLevel,
    userRole,
    user
  } = useUniversalAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (showAccessDenied) {
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="warning">
              <Alert.Heading>Access Denied</Alert.Heading>
              <p>
                You don't have permission to access this feature.
              </p>
              <p>
                <strong>Required:</strong> {requiredPermission}<br />
                <strong>Your Role:</strong> {userRole.displayName}
              </p>
              <hr />
              <Button variant="primary" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </Alert>
          </div>
        </Container>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check required role
  if (requiredRole && !hasRole(requiredRole)) {
    if (showAccessDenied) {
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="warning">
              <Alert.Heading>Access Denied</Alert.Heading>
              <p>
                You don't have the required role to access this feature.
              </p>
              <p>
                <strong>Required Role:</strong> {requiredRole}<br />
                <strong>Your Role:</strong> {userRole.displayName}
              </p>
              <hr />
              <Button variant="primary" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </Alert>
          </div>
        </Container>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check minimum role level
  if (minimumRoleLevel && !hasMinimumRoleLevel(minimumRoleLevel)) {
    if (showAccessDenied) {
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="warning">
              <Alert.Heading>Access Denied</Alert.Heading>
              <p>
                Your role level is not sufficient to access this feature.
              </p>
              <p>
                <strong>Required Level:</strong> {minimumRoleLevel}<br />
                <strong>Your Level:</strong> {userRole.level} ({userRole.displayName})
              </p>
              <hr />
              <Button variant="primary" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </Alert>
          </div>
        </Container>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // User has required permissions, render the protected content
  return children;
};

// Convenience components for common role checks
export const AdminOnlyRoute = ({ children, ...props }) => (
  <RoleProtectedRoute requiredPermission="admin_dashboard" {...props}>
    {children}
  </RoleProtectedRoute>
);

export const RadiologyRoute = ({ children, ...props }) => (
  <RoleProtectedRoute requiredPermission="radiology_access" {...props}>
    {children}
  </RoleProtectedRoute>
);

export const DoctorOnlyRoute = ({ children, ...props }) => (
  <RoleProtectedRoute minimumRoleLevel={60} {...props}>
    {children}
  </RoleProtectedRoute>
);

export const SuperUserOnlyRoute = ({ children, ...props }) => (
  <RoleProtectedRoute requiredRole="SUPERUSER" {...props}>
    {children}
  </RoleProtectedRoute>
);

export default RoleProtectedRoute;