// Modern Animated Stats Card Component
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { DashboardHelpers } from '../config/dashboardConfig';

const AnimatedStatsCard = ({ 
  widget, 
  theme, 
  onCardClick, 
  realTimeData,
  className = '',
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    // Animate value counting
    if (isVisible && typeof widget.value === 'number') {
      let start = 0;
      const end = realTimeData?.value || widget.value;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCurrentValue(end);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setCurrentValue(realTimeData?.value || widget.value);
    }
  }, [isVisible, widget.value, realTimeData]);

  const getGradient = () => {
    switch (widget.color) {
      case 'primary': return theme.primaryGradient;
      case 'success': return theme.successGradient;
      case 'info': return theme.accentGradient;
      case 'warning': return theme.warningGradient;
      case 'danger': return theme.secondaryGradient;
      default: return theme.primaryGradient;
    }
  };

  const cardStyle = {
    background: theme.cardBackground,
    borderRadius: theme.borderRadius,
    border: 'none',
    boxShadow: isHovered ? theme.hoverShadow : theme.cardShadow,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: `all ${theme.animationDuration} ease-out`,
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative'
  };

  const iconStyle = {
    background: getGradient(),
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: 'white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    transition: `transform ${theme.animationDuration} ease`
  };

  const sparklineStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '30px',
    opacity: 0.1,
    overflow: 'hidden'
  };

  return (
    <div className={className}>
      <Card 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onCardClick && onCardClick(widget)}
      >
        {/* Sparkline Background */}
        {widget.sparklineData && (
          <div style={sparklineStyle}>
            <svg width="100%" height="100%" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke={getGradient()}
                strokeWidth="2"
                points={widget.sparklineData.map((value, index) => 
                  `${(index / (widget.sparklineData.length - 1)) * 100},${30 - (value / Math.max(...widget.sparklineData)) * 30}`
                ).join(' ')}
              />
            </svg>
          </div>
        )}

        <Card.Body className="p-4">
          <div className="d-flex align-items-center">
            <div 
              style={{
                ...iconStyle,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
              }}
            >
              <i className={widget.icon}></i>
            </div>
            
            <div className="ms-4 flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-1 font-weight-normal">
                    {widget.title}
                  </h6>
                  <h3 className="mb-0 font-weight-bold" style={{ color: theme.textPrimary }}>
                    {typeof currentValue === 'number' && widget.value !== currentValue ? 
                      DashboardHelpers.formatNumber(currentValue) : 
                      currentValue
                    }
                  </h3>
                  <small style={{ color: theme.textSecondary }}>
                    {widget.subtitle}
                  </small>
                </div>
                
                <div className="text-end">
                  <span 
                    className={`badge bg-${widget.changeType === 'positive' ? 'success' : 'danger'} bg-gradient`}
                    style={{
                      borderRadius: '12px',
                      fontSize: '12px',
                      padding: '6px 12px'
                    }}
                  >
                    {widget.changeType === 'positive' ? '↗' : '↘'} {widget.change}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3">
            <div 
              className="progress" 
              style={{ 
                height: '4px', 
                borderRadius: '2px',
                background: 'rgba(0, 0, 0, 0.1)'
              }}
            >
              <div 
                className="progress-bar"
                style={{
                  background: getGradient(),
                  width: isVisible ? `${Math.min(100, (currentValue / widget.value) * 100)}%` : '0%',
                  transition: 'width 1s ease-out',
                  borderRadius: '2px'
                }}
              />
            </div>
          </div>
        </Card.Body>

        {/* Hover overlay effect */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: getGradient(),
            opacity: isHovered ? 0.05 : 0,
            transition: `opacity ${theme.animationDuration} ease`,
            pointerEvents: 'none'
          }}
        />
      </Card>
    </div>
  );
};

export default AnimatedStatsCard;
