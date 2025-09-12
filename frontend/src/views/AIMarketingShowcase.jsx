import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Tab, Tabs } from 'react-bootstrap';
import landingPageConfig from '../../config/landingPageConfig.js';
import aiFeatures from '../../config/aiFeatures';

const AIMarketingShowcase = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  
  const { theme } = landingPageConfig;

  useEffect(() => {
    // Trigger animations
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowFeatureModal(true);
  };

  return (
    <Container fluid className="py-5">
      {/* AI Capabilities Hero Section */}
      <section className="py-5 mb-5" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}15)` }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="mb-4">
                <Badge 
                  className="mb-3 px-3 py-2 fs-6"
                  style={{
                    background: theme.gradient,
                    borderRadius: theme.borderRadius
                  }}
                >
                  <i className="fas fa-robot me-2"></i>
                  AI-Powered Intelligence
                </Badge>
                
                <h1 className="display-4 fw-bold mb-3">
                  Revolutionary AI for
                  <span style={{ 
                    background: theme.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {" "}Radiology
                  </span>
                </h1>
                
                <p className="lead mb-4">
                  Experience the future of medical imaging with our cutting-edge AI platform. 
                  Designed specifically for modern healthcare professionals who demand accuracy, 
                  speed, and intelligent automation.
                </p>

                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        background: theme.gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-bolt text-white"></i>
                    </div>
                    <div>
                      <strong>{aiFeatures.capabilities.analysisEngine.accuracy}</strong>
                      <br />
                      <small className="text-muted">Accuracy Rate</small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        background: theme.gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-clock text-white"></i>
                    </div>
                    <div>
                      <strong>{aiFeatures.capabilities.analysisEngine.processingTime}</strong>
                      <br />
                      <small className="text-muted">Processing Time</small>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="me-3"
                  style={{
                    background: theme.gradient,
                    border: 'none',
                    borderRadius: theme.borderRadius
                  }}
                >
                  <i className="fas fa-play me-2"></i>
                  Watch AI Demo
                </Button>
                
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Brochure
                </Button>
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="position-relative">
                {/* AI Brain Visualization */}
                <div 
                  className="ai-showcase-visual"
                  style={{
                    width: '400px',
                    height: '400px',
                    margin: '0 auto',
                    position: 'relative'
                  }}
                >
                  {/* Central AI Brain */}
                  <div 
                    className="central-brain"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120px',
                      height: '120px',
                      background: theme.gradient,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse-ai 3s infinite',
                      zIndex: 3
                    }}
                  >
                    <i className="fas fa-brain text-white" style={{ fontSize: '3rem' }}></i>
                  </div>

                  {/* Orbiting Features */}
                  {aiFeatures.enhancements && Object.entries(aiFeatures.enhancements).map(([key, feature], index) => (
                    <div
                      key={key}
                      className="orbiting-feature"
                      style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: theme.boxShadow,
                        cursor: 'pointer',
                        animation: `orbit-${index + 1} 8s linear infinite`,
                        border: `3px solid ${theme.primaryColor}`,
                        zIndex: 2
                      }}
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <i className={`${feature.icon} fa-lg`} style={{ color: theme.primaryColor }}></i>
                    </div>
                  ))}

                  {/* Data Flow Lines */}
                  <svg 
                    className="data-flow-lines"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={`${50 + 30 * Math.cos(i * Math.PI / 4)}%`}
                        y2={`${50 + 30 * Math.sin(i * Math.PI / 4)}%`}
                        stroke={theme.primaryColor}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;10"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </line>
                    ))}
                  </svg>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* AI Capabilities Grid */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">AI-Powered Capabilities</h2>
              <p className="lead text-muted">
                Advanced artificial intelligence features designed for modern radiology practices
              </p>
            </Col>
          </Row>

          <Row>
            {Object.entries(aiFeatures.capabilities).map(([key, capability], index) => (
              <Col lg={4} key={key} className="mb-4">
                <Card 
                  className="h-100 border-0 capability-card"
                  style={{
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.boxShadow,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.boxShadow;
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="text-center mb-3">
                      <div 
                        style={{
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          borderRadius: theme.borderRadius,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto'
                        }}
                      >
                        <i className="fas fa-microchip fa-2x text-white"></i>
                      </div>
                    </div>

                    <h4 className="fw-bold mb-3 text-center">{capability.name}</h4>
                    <p className="text-muted mb-3">{capability.description}</p>

                    {capability.accuracy && (
                      <div className="mb-3">
                        <strong style={{ color: theme.primaryColor }}>
                          Accuracy: {capability.accuracy}
                        </strong>
                      </div>
                    )}

                    {capability.features && (
                      <ul className="list-unstyled">
                        {capability.features.map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <i className="fas fa-check-circle me-2" style={{ color: theme.primaryColor }}></i>
                            <small>{feature}</small>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      variant="outline-primary"
                      className="w-100 mt-3"
                      style={{ borderRadius: theme.borderRadius }}
                      onClick={() => setActiveDemo(key)}
                    >
                      <i className="fas fa-play me-2"></i>
                      See Demo
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Multi-Doctor Platform Features */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Multi-Doctor Platform</h2>
              <p className="lead text-muted">
                Comprehensive collaboration tools designed for healthcare teams
              </p>
            </Col>
          </Row>

          <Row>
            {aiFeatures.marketingFeatures.multiDoctorFeatures.map((feature, index) => (
              <Col lg={6} key={index} className="mb-4">
                <Card 
                  className="h-100 border-0"
                  style={{
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.boxShadow
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div 
                        style={{
                          width: '60px',
                          height: '60px',
                          background: theme.gradient,
                          borderRadius: theme.borderRadius,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <i className="fas fa-users text-white fa-lg"></i>
                      </div>
                      
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-2">{feature.title}</h5>
                        <p className="text-muted mb-3">{feature.description}</p>
                        
                        <div className="d-flex flex-wrap gap-2">
                          {feature.capabilities.map((capability, capIndex) => (
                            <Badge
                              key={capIndex}
                              style={{
                                backgroundColor: `${theme.primaryColor}20`,
                                color: theme.primaryColor,
                                borderRadius: theme.borderRadius
                              }}
                            >
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Performance Metrics */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Performance That Delivers</h2>
              <p className="lead text-muted">
                Industry-leading metrics that translate to real business value
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={4} className="mb-4">
              <Card 
                className="text-center border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #1EBCB7, #089bab)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="p-4 text-white">
                  <i className="fas fa-bullseye fa-3x mb-3"></i>
                  <h3 className="fw-bold">{aiFeatures.metrics.accuracy.overall}%</h3>
                  <p className="mb-0">Overall Accuracy</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card 
                className="text-center border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #198754, #20c997)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="p-4 text-white">
                  <i className="fas fa-tachometer-alt fa-3x mb-3"></i>
                  <h3 className="fw-bold">{aiFeatures.metrics.performance.processingTime.split(' ')[0]}s</h3>
                  <p className="mb-0">Average Processing</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card 
                className="text-center border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #fd7e14, #ffc107)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="p-4 text-white">
                  <i className="fas fa-star fa-3x mb-3"></i>
                  <h3 className="fw-bold">{aiFeatures.metrics.userSatisfaction.overall}/5</h3>
                  <p className="mb-0">User Satisfaction</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feature Modal */}
      <Modal show={showFeatureModal} onHide={() => setShowFeatureModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedFeature && (
              <>
                <i className={`${selectedFeature.icon} me-2`} style={{ color: theme.primaryColor }}></i>
                {selectedFeature.title}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeature && (
            <div>
              <Tabs defaultActiveKey="features" className="mb-3">
                <Tab eventKey="features" title="Features">
                  <ul className="list-group list-group-flush">
                    {selectedFeature.features.map((feature, index) => (
                      <li key={index} className="list-group-item border-0 px-0">
                        <i className="fas fa-check-circle me-2" style={{ color: theme.primaryColor }}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Tab>
                <Tab eventKey="demo" title="Interactive Demo">
                  <div className="text-center py-5">
                    <i className="fas fa-play-circle fa-4x mb-3" style={{ color: theme.primaryColor }}></i>
                    <h5>Interactive Demo</h5>
                    <p className="text-muted">Experience this feature in our live demo environment</p>
                    <Button
                      style={{
                        background: theme.gradient,
                        border: 'none',
                        borderRadius: theme.borderRadius
                      }}
                    >
                      Launch Demo
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-ai {
          0%, 100% {
            box-shadow: 0 0 20px rgba(30, 188, 183, 0.5);
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(30, 188, 183, 0.8);
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes orbit-1 {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }

        @keyframes orbit-2 {
          from { transform: rotate(90deg) translateX(150px) rotate(-90deg); }
          to { transform: rotate(450deg) translateX(150px) rotate(-450deg); }
        }

        @keyframes orbit-3 {
          from { transform: rotate(180deg) translateX(150px) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(150px) rotate(-540deg); }
        }

        @keyframes orbit-4 {
          from { transform: rotate(270deg) translateX(150px) rotate(-270deg); }
          to { transform: rotate(630deg) translateX(150px) rotate(-630deg); }
        }

        .capability-card {
          position: relative;
          overflow: hidden;
        }

        .capability-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .capability-card:hover::before {
          left: 100%;
        }

        .orbiting-feature {
          transform-origin: 200px 200px;
        }
      `}</style>
    </Container>
  );
};

export default AIMarketingShowcase;
