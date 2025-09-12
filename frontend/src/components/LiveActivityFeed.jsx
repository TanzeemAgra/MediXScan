// Live Activity Feed Component with Real-time Updates
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';
import { DashboardHelpers } from '../config/dashboardConfig';

const LiveActivityFeed = ({ 
  widget, 
  theme, 
  realTimeData,
  className = '',
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activities, setActivities] = useState(widget.activities || []);
  const [newActivityCount, setNewActivityCount] = useState(0);
  const feedRef = useRef(null);
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    // Setup real-time activity updates
    if (widget.refreshInterval && isVisible) {
      updateIntervalRef.current = setInterval(() => {
        addRandomActivity();
      }, widget.refreshInterval);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isVisible, widget.refreshInterval]);

  const activityTemplates = [
    {
      type: 'report_completed',
      messages: [
        'Chest X-ray analysis completed',
        'MRI scan processing finished',
        'CT scan report generated',
        'Ultrasound analysis completed'
      ],
      users: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'],
      icon: 'ri-file-text-line',
      color: 'success'
    },
    {
      type: 'ai_processing',
      messages: [
        'AI model processing new scan',
        'Deep learning analysis in progress',
        'Neural network optimization',
        'AI accuracy validation'
      ],
      users: ['AI System', 'ML Engine', 'Deep Learning AI'],
      icon: 'ri-robot-line',
      color: 'info'
    },
    {
      type: 'user_login',
      messages: [
        'User logged in successfully',
        'New session started',
        'Authentication completed'
      ],
      users: ['Dr. Smith', 'Dr. Johnson', 'Nurse Kate', 'Admin User'],
      icon: 'ri-login-circle-line',
      color: 'primary'
    },
    {
      type: 'system_alert',
      messages: [
        'System performance optimal',
        'Backup completed successfully',
        'Database optimization finished',
        'Security scan completed'
      ],
      users: ['System Monitor', 'Auto Backup', 'Security System'],
      icon: 'ri-shield-check-line',
      color: 'warning'
    }
  ];

  const addRandomActivity = () => {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    const message = template.messages[Math.floor(Math.random() * template.messages.length)];
    const user = template.users[Math.floor(Math.random() * template.users.length)];
    
    const newActivity = {
      id: Date.now() + Math.random(),
      type: template.type,
      message,
      user,
      timestamp: new Date(),
      priority: Math.random() > 0.8 ? 'high' : 'normal',
      icon: template.icon,
      color: template.color
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev];
      return updated.slice(0, widget.maxItems || 10);
    });

    setNewActivityCount(prev => prev + 1);
    
    // Auto-scroll if enabled
    if (widget.autoScroll && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }

    // Reset new activity count after a delay
    setTimeout(() => {
      setNewActivityCount(prev => Math.max(0, prev - 1));
    }, 3000);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      default: return 'secondary';
    }
  };

  const getActivityIcon = (activity) => {
    return (
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: getActivityGradient(activity.color),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}
      >
        <i className={activity.icon}></i>
      </div>
    );
  };

  const getActivityGradient = (color) => {
    switch (color) {
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
    boxShadow: theme.cardShadow,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: `all ${theme.animationDuration} ease-out`,
    height: '500px',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div className={className}>
      <Card style={cardStyle}>
        <Card.Header 
          className="border-0 pb-0"
          style={{ 
            background: 'transparent',
            borderBottom: 'none'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0" style={{ color: theme.textPrimary }}>
                {widget.title}
              </h5>
              <small style={{ color: theme.textSecondary }}>
                Real-time system activities
              </small>
            </div>
            
            {/* New activity indicator */}
            {newActivityCount > 0 && (
              <Badge 
                bg="danger"
                className="rounded-pill"
                style={{
                  animation: 'pulse 1s infinite',
                  minWidth: '20px'
                }}
              >
                {newActivityCount}
              </Badge>
            )}
          </div>
        </Card.Header>
        
        <Card.Body 
          className="pt-2 flex-grow-1 p-0"
          style={{ 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div 
            ref={feedRef}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1,
              padding: '0 1rem'
            }}
          >
            <ListGroup variant="flush">
              {activities.map((activity, index) => (
                <ListGroup.Item
                  key={activity.id}
                  className="border-0 px-0"
                  style={{
                    background: 'transparent',
                    paddingTop: index === 0 ? '0.5rem' : '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: index < activities.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                    animation: index === 0 && newActivityCount > 0 ? 'slideInRight 0.5s ease-out' : 'none'
                  }}
                >
                  <div className="d-flex align-items-start">
                    {getActivityIcon(activity)}
                    
                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p 
                            className="mb-1 fw-medium"
                            style={{ 
                              color: theme.textPrimary,
                              fontSize: '14px',
                              lineHeight: '1.4'
                            }}
                          >
                            {activity.message}
                          </p>
                          <div className="d-flex align-items-center">
                            <small 
                              style={{ 
                                color: theme.textSecondary,
                                fontSize: '12px'
                              }}
                            >
                              by {activity.user}
                            </small>
                            {activity.priority !== 'normal' && (
                              <Badge 
                                bg={getPriorityBadge(activity.priority)}
                                className="ms-2"
                                style={{ fontSize: '10px' }}
                              >
                                {activity.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <small 
                          style={{ 
                            color: theme.textSecondary,
                            fontSize: '11px',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px'
                          }}
                        >
                          {DashboardHelpers.getTimeAgo(activity.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          
          {/* Footer with status */}
          <div 
            className="px-3 py-2 text-center"
            style={{
              borderTop: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <small style={{ color: theme.textSecondary }}>
              <div 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: theme.successGradient,
                  display: 'inline-block',
                  marginRight: '6px',
                  animation: 'pulse 2s infinite'
                }}
              />
              Live updates every {Math.floor(widget.refreshInterval / 1000)}s
            </small>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveActivityFeed;
