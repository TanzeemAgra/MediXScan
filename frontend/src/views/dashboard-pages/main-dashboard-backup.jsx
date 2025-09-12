import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container, Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { DASHBOARD_CONFIG, DashboardHelpers } from "../../config/dashboardConfig";
import AnimatedStatsCard from "../../components/AnimatedStatsCard";
import RealTimeChart from "../../components/RealTimeChart";
import LiveActivityFeed from "../../components/LiveActivityFeed";
import { 
  FaPalette, 
  FaLayout, 
  FaSync, 
  FaCog, 
  FaExpand,
  FaCompress,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const MainDashboard = () => {
  // State management for dynamic dashboard
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_MODERN');
  const [currentLayout, setCurrentLayout] = useState('DEFAULT');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  // Refs
  const dashboardRef = useRef(null);
  const updateIntervalRef = useRef(null);

  // Get current theme and layout configurations
  const theme = DashboardHelpers.getTheme(currentTheme);
  const layout = DashboardHelpers.getLayout(currentLayout);

  useEffect(() => {
    // Setup real-time data updates
    if (isAutoRefresh) {
      updateIntervalRef.current = setInterval(() => {
        updateRealTimeData();
      }, DASHBOARD_CONFIG.REAL_TIME.UPDATE_INTERVALS.fast);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isAutoRefresh]);

  const updateRealTimeData = () => {
    // Simulate real-time data updates
    const newData = {};
    
    Object.keys(DASHBOARD_CONFIG.WIDGETS.STATS_CARDS).forEach(key => {
      const widget = DASHBOARD_CONFIG.WIDGETS.STATS_CARDS[key];
      if (typeof widget.value === 'number') {
        newData[key] = {
          value: widget.value + Math.floor((Math.random() - 0.5) * 10),
          change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 5).toFixed(1)}%`,
          changeType: Math.random() > 0.3 ? 'positive' : 'negative'
        };
      }
    });
    
    setRealTimeData(newData);
    setLastUpdate(new Date());
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (dashboardRef.current.requestFullscreen) {
        dashboardRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
  };

  const handleLayoutChange = (layoutId) => {
    setCurrentLayout(layoutId);
  };

  const refreshAllData = () => {
    updateRealTimeData();
    // Add visual feedback
    setIsAutoRefresh(false);
    setTimeout(() => setIsAutoRefresh(true), 1000);
  };

  const renderStatsCards = (widgets, colClass) => {
    return widgets.map((widgetConfig, index) => {
      const widget = DASHBOARD_CONFIG.WIDGETS.STATS_CARDS[widgetConfig.widget];
      if (!widget) return null;

      return (
        <AnimatedStatsCard
          key={widget.id}
          widget={widget}
          theme={theme}
          realTimeData={realTimeData[widgetConfig.widget]}
          className={widgetConfig.size}
          delay={index * 100}
          onCardClick={(widget) => console.log('Card clicked:', widget)}
        />
      );
    });
  };

  const renderCharts = (widgets, colClass) => {
    return widgets.map((widgetConfig, index) => {
      const widget = DASHBOARD_CONFIG.WIDGETS.CHARTS[widgetConfig.widget];
      if (!widget) return null;

      return (
        <RealTimeChart
          key={widget.id}
          widget={widget}
          theme={theme}
          realTimeData={realTimeData[widgetConfig.widget]}
          className={widgetConfig.size}
          delay={index * 200}
        />
      );
    });
  };

  const renderActivityFeed = (widgetConfig) => {
    const widget = DASHBOARD_CONFIG.WIDGETS.ACTIVITY_FEED;
    
    return (
      <LiveActivityFeed
        key={widget.id}
        widget={widget}
        theme={theme}
        realTimeData={realTimeData.ACTIVITY_FEED}
        className={widgetConfig.size}
        delay={300}
      />
    );
  };

  const containerStyle = {
    background: isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    padding: '2rem 0',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    background: theme.cardBackground,
    borderRadius: theme.borderRadius,
    boxShadow: theme.cardShadow,
    padding: '1.5rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)'
  };
import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container, Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { DASHBOARD_CONFIG, DashboardHelpers } from "../../config/dashboardConfig";
import AnimatedStatsCard from "../../components/AnimatedStatsCard";
import RealTimeChart from "../../components/RealTimeChart";
import LiveActivityFeed from "../../components/LiveActivityFeed";
import { 
  FaPalette, 
  FaLayout, 
  FaSync, 
  FaCog, 
  FaExpand,
  FaCompress,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const MainDashboard = () => {
  // State management for dynamic dashboard
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_MODERN');
  const [currentLayout, setCurrentLayout] = useState('DEFAULT');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  // Refs
  const dashboardRef = useRef(null);
  const updateIntervalRef = useRef(null);

  // Get current theme and layout configurations
  const theme = DashboardHelpers.getTheme(currentTheme);
  const layout = DashboardHelpers.getLayout(currentLayout);

  useEffect(() => {
    // Setup real-time data updates
    if (isAutoRefresh) {
      updateIntervalRef.current = setInterval(() => {
        updateRealTimeData();
      }, DASHBOARD_CONFIG.REAL_TIME.UPDATE_INTERVALS.fast);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isAutoRefresh]);

  const updateRealTimeData = () => {
    // Simulate real-time data updates
    const newData = {};
    
    Object.keys(DASHBOARD_CONFIG.WIDGETS.STATS_CARDS).forEach(key => {
      const widget = DASHBOARD_CONFIG.WIDGETS.STATS_CARDS[key];
      if (typeof widget.value === 'number') {
        newData[key] = {
          value: widget.value + Math.floor((Math.random() - 0.5) * 10),
          change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 5).toFixed(1)}%`,
          changeType: Math.random() > 0.3 ? 'positive' : 'negative'
        };
      }
    });
    
    setRealTimeData(newData);
    setLastUpdate(new Date());
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (dashboardRef.current.requestFullscreen) {
        dashboardRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
  };

  const handleLayoutChange = (layoutId) => {
    setCurrentLayout(layoutId);
  };

  const refreshAllData = () => {
    updateRealTimeData();
    // Add visual feedback
    setIsAutoRefresh(false);
    setTimeout(() => setIsAutoRefresh(true), 1000);
  };

  const renderStatsCards = (widgets, colClass) => {
    return widgets.map((widgetConfig, index) => {
      const widget = DASHBOARD_CONFIG.WIDGETS.STATS_CARDS[widgetConfig.widget];
      if (!widget) return null;

      return (
        <AnimatedStatsCard
          key={widget.id}
          widget={widget}
          theme={theme}
          realTimeData={realTimeData[widgetConfig.widget]}
          className={widgetConfig.size}
          delay={index * 100}
          onCardClick={(widget) => console.log('Card clicked:', widget)}
        />
      );
    });
  };

  const renderCharts = (widgets, colClass) => {
    return widgets.map((widgetConfig, index) => {
      const widget = DASHBOARD_CONFIG.WIDGETS.CHARTS[widgetConfig.widget];
      if (!widget) return null;

      return (
        <RealTimeChart
          key={widget.id}
          widget={widget}
          theme={theme}
          realTimeData={realTimeData[widgetConfig.widget]}
          className={widgetConfig.size}
          delay={index * 200}
        />
      );
    });
  };

  const renderActivityFeed = (widgetConfig) => {
    const widget = DASHBOARD_CONFIG.WIDGETS.ACTIVITY_FEED;
    
    return (
      <LiveActivityFeed
        key={widget.id}
        widget={widget}
        theme={theme}
        realTimeData={realTimeData.ACTIVITY_FEED}
        className={widgetConfig.size}
        delay={300}
      />
    );
  };

  const containerStyle = {
    background: isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    padding: '2rem 0',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    background: theme.cardBackground,
    borderRadius: theme.borderRadius,
    boxShadow: theme.cardShadow,
    padding: '1.5rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div ref={dashboardRef} style={containerStyle}>
      <Container fluid>
        {/* Dynamic Header with Controls */}
        <div style={headerStyle}>
          <Row className="align-items-center">
            <Col md={6}>
              <div>
                <h2 className="mb-1" style={{ 
                  color: theme.textPrimary,
                  background: theme.primaryGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 'bold'
                }}>
                  Radiology Intelligence Dashboard
                </h2>
                <p className="mb-0" style={{ color: theme.textSecondary }}>
                  Real-time analytics and AI-powered insights • Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="d-flex justify-content-end align-items-center gap-2">
                {/* Theme Selector */}
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    size="sm"
                    style={{ borderRadius: '12px' }}
                  >
                    <FaPalette className="me-1" />
                    Theme
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.values(DASHBOARD_CONFIG.THEMES).map(themeOption => (
                      <Dropdown.Item 
                        key={themeOption.id}
                        onClick={() => handleThemeChange(themeOption.id)}
                        active={currentTheme === themeOption.id}
                      >
                        {themeOption.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Layout Selector */}
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    size="sm"
                    style={{ borderRadius: '12px' }}
                  >
                    <FaLayout className="me-1" />
                    Layout
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.values(DASHBOARD_CONFIG.LAYOUTS).map(layoutOption => (
                      <Dropdown.Item 
                        key={layoutOption.id}
                        onClick={() => handleLayoutChange(layoutOption.id)}
                        active={currentLayout === layoutOption.id}
                      >
                        {layoutOption.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Control Buttons */}
                <ButtonGroup size="sm">
                  <Button 
                    variant="outline-success"
                    onClick={refreshAllData}
                    style={{ borderRadius: '12px 0 0 12px' }}
                  >
                    <FaSync className={`me-1 ${!isAutoRefresh ? 'fa-spin' : ''}`} />
                    Refresh
                  </Button>
                  
                  <Button 
                    variant="outline-info"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{ borderRadius: '0' }}
                  >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                  </Button>
                  
                  <Button 
                    variant="outline-warning"
                    onClick={toggleFullscreen}
                    style={{ borderRadius: '0 12px 12px 0' }}
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </div>

        {/* Dynamic Layout Rendering */}
        {layout.structure.map((row, rowIndex) => (
          <Row key={rowIndex} className="mb-4">
            {row.cols.map((col, colIndex) => {
              // Render Stats Cards
              if (DASHBOARD_CONFIG.WIDGETS.STATS_CARDS[col.widget]) {
                return renderStatsCards([col], col.size)[0];
              }
              
              // Render Charts
              if (DASHBOARD_CONFIG.WIDGETS.CHARTS[col.widget]) {
                return renderCharts([col], col.size)[0];
              }
              
              // Render Activity Feed
              if (col.widget === 'ACTIVITY_FEED') {
                return renderActivityFeed(col);
              }
              
              return null;
            })}
          </Row>
        ))}

        {/* Footer with System Status */}
        <div 
          style={{
            ...headerStyle,
            marginTop: '2rem',
            marginBottom: '0',
            padding: '1rem 1.5rem'
          }}
        >
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div 
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: theme.successGradient,
                    marginRight: '12px',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <div>
                  <strong style={{ color: theme.textPrimary }}>System Status: Operational</strong>
                  <small className="d-block" style={{ color: theme.textSecondary }}>
                    All AI models running optimally • {isAutoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh paused'}
                  </small>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="text-end">
              <small style={{ color: theme.textSecondary }}>
                Dashboard v2.0 • Powered by {theme.name}
              </small>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #089bab, #37D5F2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #FC9F5B, #8F5FE8);
        }
      `}</style>
    </div>
  );
};

export default MainDashboard;
