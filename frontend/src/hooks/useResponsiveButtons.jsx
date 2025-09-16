/**
 * Custom Hook: useResponsiveButtons
 * Purpose: Ensure button visibility across all devices with intelligent layout
 */

import { useState, useEffect } from 'react';
import { RESPONSIVE_CONFIG } from '@config/responsiveConfig.js';

// Safe configuration access with fallbacks
const getSafeConfig = () => {
  try {
    return RESPONSIVE_CONFIG || {};
  } catch (error) {
    console.warn('Error accessing RESPONSIVE_CONFIG:', error);
    return {};
  }
};

export const useResponsiveButtons = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [buttonConfig, setButtonConfig] = useState(null);

  // Device detection function
  const detectDevice = () => {
    const width = window.innerWidth;
    
    if (width < 480) return 'smallMobile';
    if (width < 768) return 'mobile';
    if (width < 992) return 'tablet';
    return 'desktop';
  };

  // Get button configuration based on device
  const getButtonConfig = (device) => {
    const safeConfig = getSafeConfig();
    const buttonsConfig = safeConfig.buttons || {};
    const config = buttonsConfig[device];
    
    if (!config) {
      // Fallback configuration if device config is missing
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto'
        },
        buttonStyle: {
          width: 'auto',
          minWidth: '180px',
          maxWidth: '250px',
          minHeight: '48px',
          fontSize: '1.1rem',
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          visibility: 'visible !important',
          opacity: '1 !important'
        }
      };
    }
    
    const layout = config.layout || 'horizontal';
    
    return {
      containerStyle: {
        display: 'flex',
        flexDirection: layout === 'vertical-centered' || layout === 'vertical-full' ? 'column' : 'row',
        flexWrap: config.flexWrap || 'wrap',
        gap: config.gap || '16px',
        justifyContent: layout.includes('centered') ? 'center' : 'flex-start',
        alignItems: layout.includes('vertical') ? 'stretch' : 'center',
        width: '100%',
        maxWidth: '500px', // Prevent overstretching
        margin: '0 auto'
      },
      buttonStyle: {
        width: config.width || 'auto',
        minWidth: config.minWidth || '180px',
        maxWidth: config.maxWidth || '250px',
        minHeight: config.minHeight || '48px',
        fontSize: config.fontSize || '1.1rem',
        padding: config.padding || '12px 24px',
        borderRadius: config.borderRadius || '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '600',
        textDecoration: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        // Ensure buttons are always visible
        visibility: 'visible !important',
        opacity: '1 !important',
        zIndex: '10'
      },
      primaryButtonStyle: {
        background: 'linear-gradient(135deg, #1EBCB7 0%, #16a085 100%)',
        color: 'white',
        boxShadow: '0 8px 25px rgba(30, 188, 183, 0.3)',
      },
      secondaryButtonStyle: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
      },
      hoverEffects: {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 35px rgba(30, 188, 183, 0.4)'
      }
    };
  };

  // Handle resize with debounce
  useEffect(() => {
    try {
      const handleResize = () => {
        try {
          const newDeviceType = detectDevice();
          if (newDeviceType !== deviceType) {
            setDeviceType(newDeviceType);
            setButtonConfig(getButtonConfig(newDeviceType));
          }
        } catch (error) {
          console.warn('Error in handleResize:', error);
          // Set safe fallback
          setDeviceType('desktop');
          setButtonConfig(getButtonConfig('desktop'));
        }
      };

      // Initial setup
      const initialDevice = detectDevice();
      setDeviceType(initialDevice);
      setButtonConfig(getButtonConfig(initialDevice));
    } catch (error) {
      console.warn('Error in useResponsiveButtons useEffect:', error);
      // Safe fallback
      setDeviceType('desktop');
      setButtonConfig(getButtonConfig('desktop'));
    }

    // Debounced resize handler
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [deviceType]);

  return {
    deviceType,
    buttonConfig,
    isLoaded: buttonConfig !== null
  };
};

// Smart Button Component with guaranteed visibility
export const SmartResponsiveButton = ({ 
  children, 
  onClick, 
  type = 'primary', 
  icon, 
  className = '',
  ...props 
}) => {
  const { buttonConfig, isLoaded } = useResponsiveButtons();
  
  if (!isLoaded) {
    return (
      <div 
        style={{ 
          width: '180px', 
          height: '48px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Loading...
      </div>
    );
  }

  const finalStyle = {
    ...buttonConfig.buttonStyle,
    ...(type === 'primary' ? buttonConfig.primaryButtonStyle : buttonConfig.secondaryButtonStyle)
  };

  return (
    <button
      className={`smart-responsive-btn ${className}`}
      style={finalStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        Object.assign(e.target.style, buttonConfig.hoverEffects);
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = type === 'primary' 
          ? buttonConfig.primaryButtonStyle.boxShadow 
          : buttonConfig.secondaryButtonStyle.boxShadow;
      }}
      {...props}
    >
      {icon && <i className={icon} />}
      {children}
    </button>
  );
};

// Smart Button Container Component
export const SmartButtonContainer = ({ children }) => {
  const { buttonConfig, isLoaded } = useResponsiveButtons();
  
  if (!isLoaded) return <div>{children}</div>;
  
  return (
    <div 
      className="smart-button-container"
      style={buttonConfig.containerStyle}
    >
      {children}
    </div>
  );
};

export default useResponsiveButtons;