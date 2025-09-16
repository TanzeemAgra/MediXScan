import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Simple form - Email:', email);
    console.log('🔍 Simple form - Password length:', password.length);

    try {
      const result = await login({ email, password });
      console.log('✅ Simple login result:', result);
      
      if (result.success !== false) {
        navigate('/dashboard/main-dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Simple login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        🚀 Simple Login Form
      </h3>
      
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('📧 Email changed to:', e.target.value);
              setEmail(e.target.value);
            }}
            placeholder="tanzeem.agra@rugrel.com"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              console.log('🔐 Password length:', e.target.value.length);
              setPassword(e.target.value);
            }}
            placeholder="Tanzilla@tanzeem786"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Signing In...' : '🚀 Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Credentials:</strong></p>
        <p>Email: tanzeem.agra@rugrel.com</p>
        <p>Password: Tanzilla@tanzeem786</p>
      </div>
    </div>
  );
};

export default SimpleLoginForm;