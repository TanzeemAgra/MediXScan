/**
 * Production-Safe Button Component
 * Emergency fallback to prevent site crashes from configuration errors
 */

import React from 'react';

const ProductionSafeButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  style = {},
  ...props 
}) => {
  // Safe button styles that work without configuration
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    outline: 'none',
    minWidth: '180px',
    minHeight: '48px',
    gap: '8px',
    // Force visibility
    visibility: 'visible !important',
    opacity: '1 !important',
    zIndex: '10'
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #1EBCB7 0%, #16a085 100%)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(30, 188, 183, 0.3)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
    },
    outline: {
      background: 'transparent',
      color: '#1EBCB7',
      border: '2px solid #1EBCB7',
    }
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    if (variant === 'primary') {
      e.target.style.boxShadow = '0 12px 35px rgba(30, 188, 183, 0.4)';
    }
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = baseStyle.boxShadow || variantStyles[variant].boxShadow;
  };

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...style
  };

  return (
    <button
      className={`production-safe-button ${className}`}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default ProductionSafeButton;