// Emergency Fallback Authentication Component
// No dependencies on complex contexts - pure login functionality

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://medixscan-production.up.railway.app/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setFormData({
      email: 'tanzeem.agra@rugrel.com',
      password: 'Tanzilla@tanzeem786'
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{
              borderRadius: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="mb-2" style={{ color: '#1e293b', fontWeight: 'bold' }}>
                    Emergency Login
                  </h2>
                  <p className="text-muted">Fallback authentication system</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontWeight: '600'
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
                        Sign In
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={fillDemo}
                    disabled={loading}
                  >
                    Fill Demo Credentials
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Emergency fallback authentication system
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLogin;