// Complete Frontend Integration Demo
// Demonstration of RBAC system integration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleBasedComponent, withRoleProtection } from './hooks/useRBAC';
import RoleBasedNavigation from './components/RoleBasedNavigation';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';

// Login Component
const LoginForm = () => {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(credentials);
    if (!result.success) {
      setError(result.error);
    }
  };

  // Pre-fill credentials for demo
  const fillSuperUserCredentials = () => {
    setCredentials({
      username: 'tanzeem.agra@rugrel.com',
      password: 'Tanzilla@tanzeem786'
    });
  };

  const fillDoctorCredentials = () => {
    setCredentials({
      username: 'dr.smith@radiology.com',
      password: 'doctor123'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Radiology System Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            RBAC Demo - SuperUser & Doctor Roles
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Demo Credential Buttons */}
          <div className="space-y-2">
            <p className="text-center text-sm text-gray-600">Demo Credentials:</p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={fillSuperUserCredentials}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                SuperUser Demo
              </button>
              <button
                type="button"
                onClick={fillDoctorCredentials}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Doctor Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, roles = [], permissions = [] }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles or permissions are specified, use withRoleProtection
  if (roles.length > 0 || permissions.length > 0) {
    const ProtectedComponent = withRoleProtection(() => children, roles, permissions);
    return <ProtectedComponent />;
  }

  return children;
};

// Main Dashboard Component
const MainDashboard = () => {
  const { user, isSuperUser, isDoctor, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <RoleBasedNavigation />
      
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Radiology Management System
            </h1>
            <p className="text-gray-600">
              User: {user?.full_name || user?.username} | 
              Role: {isSuperUser() ? 'Super User' : isDoctor() ? 'Doctor' : 'User'}
            </p>
          </div>

          {/* Role-based Dashboard Content */}
          <RoleBasedComponent roles={['SUPERUSER']}>
            <SuperAdminDashboard />
          </RoleBasedComponent>

          <RoleBasedComponent roles={['DOCTOR']} fallback={
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Dashboard</h2>
              <p className="text-gray-600">
                Welcome to the Radiology System. Your role-specific features will appear here.
              </p>
            </div>
          }>
            <DoctorDashboard />
          </RoleBasedComponent>

        </div>
      </main>
    </div>
  );
};

// App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['SUPERUSER']}>
                  <div className="min-h-screen bg-gray-100">
                    <RoleBasedNavigation />
                    <div className="py-6">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SuperAdminDashboard />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/doctor" 
              element={
                <ProtectedRoute roles={['DOCTOR']}>
                  <div className="min-h-screen bg-gray-100">
                    <RoleBasedNavigation />
                    <div className="py-6">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <DoctorDashboard />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Public Route Component (for login page)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default App;
