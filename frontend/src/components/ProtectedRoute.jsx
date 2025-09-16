import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthForProtectedRoute } from '../hooks/useUniversalAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthForProtectedRoute();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
