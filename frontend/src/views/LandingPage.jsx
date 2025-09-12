import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import landingPageConfig from "@config/landingPageConfig.js";
import LandingNavigation from "../components/LandingNavigation.jsx";
import ComplianceTrustBadges from "../components/ComplianceTrustBadges.jsx";
import CookieConsentBanner from "../components/CookieConsentBanner.jsx";

const LandingPage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { brand, hero, features, statistics, testimonials, radiologyShowcase, contact, compliance, theme } = landingPageConfig;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCTAClick = (action) => {
    if (action === 'trial' || action === 'register') {
      // Navigate to registration page
      window.location.href = '/auth/registration';
    } else if (action === 'demo') {
      setShowVideoModal(true);
    } else if (action === 'login') {
      window.location.href = '/auth/sign-in';
    }
  };

  return (
    <>
      {/* Top Primary Navigation */}
      <LandingNavigation onCTAClick={handleCTAClick} />

      {/* Clean Hero Section with Minimal Animation */}
      <section 
        id="home"
        className="hero-section d-flex align-items-center min-vh-100 position-relative"
        style={{
          background: hero.design?.backgroundType === 'gradient' 
            ? hero.design.primaryGradient 
            : `linear-gradient(${hero.design?.overlayGradient || 'rgba(0,0,0,0.3), rgba(0,0,0,0.3)'}), url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '80px' // Account for fixed navbar
        }}
      >
        {/* Subtle Background Effect */}
        <div 
          className="position-absolute w-100 h-100"
          style={{
            background: hero.design?.overlayGradient || 'linear-gradient(135deg, rgba(102,126,234,0.85) 0%, rgba(118,75,162,0.85) 100%)',
            zIndex: 1
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={8} className="text-white">
              <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
                {/* Clean Badge */}
                <Badge 
                  className="mb-4 px-4 py-2 fw-semibold"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: `1px solid ${hero.design?.accentColor || '#1EBCB7'}`,
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-robot me-2"></i>
                  AI-Powered Healthcare Innovation
                </Badge>
                
                {/* Clean Title */}
                <h1 
                  className="display-3 fw-bold mb-4"
                  style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1.2',
                    color: '#ffffff',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {hero.title}
                </h1>
                
                {/* Clean Subtitle */}
                <h2 
                  className="h4 mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: '400',
                    textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {hero.subtitle}
                </h2>
                
                {/* Clean Description */}
                <p 
                  className="lead mb-5" 
                  style={{ 
                    maxWidth: '600px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {hero.description}
                </p>

                {/* Simple CTA Buttons */}
                <div className="d-flex flex-wrap gap-3">
                  {hero.ctaButtons.map((button, index) => (
                    <Button
                      key={index}
                      size="lg"
                      className="px-4 py-3 d-flex align-items-center gap-2 fw-semibold"
                      onClick={() => handleCTAClick(button.action)}
                      style={{
                        borderRadius: '8px',
                        fontSize: '1rem',
                        border: 'none',
                        background: button.type === 'primary' 
                          ? hero.design?.accentColor || '#1EBCB7'
                          : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = button.type === 'primary'
                          ? '0 15px 35px rgba(30, 188, 183, 0.4)'
                          : '0 8px 32px rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <i className={button.icon}></i>
                      {button.text}
                    </Button>
                  ))}
                </div>
              </div>
            </Col>
            
            {/* Clean Visual Side */}
            <Col lg={4} className="text-center">
              <div className="hero-visual position-relative">
                {/* Simple Hero Image */}
                <div 
                  className="hero-image-container"
                  style={{
                    width: '350px',
                    height: '350px',
                    margin: '0 auto',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(255,255,255,0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <i 
                    className="fas fa-brain text-white"
                    style={{ 
                      fontSize: '4rem',
                      color: hero.design?.accentColor || '#1EBCB7',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                    }}
                  ></i>
                </div>
                
                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <section id="about" className="py-5" style={{ background: theme.lightColor }}>
        <Container>
          <Row className="text-center">
            <Col lg={12} className="mb-4">
              <h3 className="fw-bold text-dark">{statistics.title}</h3>
            </Col>
          </Row>
          <Row>
            {statistics.items.map((stat, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card 
                  className="h-100 border-0 text-center"
                  style={{
                    background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.boxShadow
                  }}
                >
                  <Card.Body className="py-4">
                    <div 
                      className="stat-icon mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: theme.gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}
                    >
                      <i className={`${stat.icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: theme.primaryColor }}>
                      {stat.number}
                    </h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Advanced Radiology Solutions - Compact */}
      <section id="solutions" className="py-3" style={{ background: '#f8f9fa', overflow: 'hidden', position: 'relative' }}>
        {/* Animated Background Particles */}
        <div className="particles-container position-absolute w-100 h-100"></div>
        
        {/* Gradient Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30,188,183,0.1) 0%, rgba(0,0,0,0.8) 70%)',
            zIndex: 1
          }}
        ></div>

        <Container fluid className="position-relative" style={{ zIndex: 2 }}>
          {/* Compact Section Header */}
          <div className="text-center py-3">
            <h2 
              className="h2 fw-bold text-white mb-2"
              style={{
                background: 'linear-gradient(135deg, #1EBCB7, #06B6D4, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '1px'
              }}
            >
              {radiologyShowcase.title}
            </h2>
            <p className="text-white opacity-75 mb-3" style={{ fontSize: '1rem' }}>
              {radiologyShowcase.subtitle}
            </p>
          </div>

          {/* Enhanced Carousel */}
          <Carousel
            activeIndex={activeSlide}
            onSelect={(selectedIndex) => setActiveSlide(selectedIndex)}
            interval={radiologyShowcase.interval}
            indicators={false}
            controls={true}
            fade={false}
            className="extraordinary-carousel mb-5"
          >
            {radiologyShowcase.items.map((item, index) => (
              <Carousel.Item key={item.id} className="position-relative">
                <div className="row align-items-center py-3">
                  {/* Content Side */}
                  <div className="col-lg-6 col-md-12 order-2 order-lg-1">
                    <div className="slide-content p-3">
                      {/* Compact Badge */}
                      <Badge 
                        className="px-3 py-2 mb-2 fs-6 fw-semibold text-dark"
                        style={{ 
                          background: `linear-gradient(135deg, ${item.accentColor}, #ffffff)`,
                          borderRadius: '50px',
                          border: `2px solid ${item.accentColor}`,
                          boxShadow: `0 5px 15px ${item.accentColor}40`
                        }}
                      >
                        <i className={`${item.icon} me-2`}></i>
                        {item.category || 'AI-Powered Technology'}
                      </Badge>
                      
                      {/* Compact Title */}
                      <h3 
                        className="h3 fw-bold mb-2"
                        style={{
                          background: `linear-gradient(135deg, ${item.accentColor}, #ffffff)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {item.title}
                      </h3>
                      
                      {/* Compact Description */}
                      <p 
                        className="mb-3 text-white opacity-85"
                        style={{ fontSize: '0.95rem', lineHeight: '1.5' }}
                      >
                        {item.description}
                      </p>

                      {/* Compact Info Panel */}
                      <Row className="mb-3">
                        {/* Technical Specs Column */}
                        {item.technicalSpecs && (
                          <Col md={6} className="mb-2">
                            <div 
                              className="info-panel p-3"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${item.accentColor}30`,
                                borderRadius: '10px',
                                backdropFilter: 'blur(5px)'
                              }}
                            >
                              <h6 className="text-white mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>
                                <i className="fas fa-cogs me-2" style={{ color: item.accentColor }}></i>
                                Specs
                              </h6>
                              {Object.entries(item.technicalSpecs).slice(0, 3).map(([key, value], idx) => (
                                <div key={idx} className="d-flex justify-content-between mb-1">
                                  <span className="text-light opacity-75" style={{ fontSize: '0.8rem' }}>
                                    {key.replace(/([A-Z])/g, ' $1')}:
                                  </span>
                                  <span className="text-white fw-semibold" style={{ fontSize: '0.8rem' }}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </Col>
                        )}
                        
                        {/* Status & Key Features Column */}
                        <Col md={6} className="mb-2">
                          <div 
                            className="info-panel p-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${item.accentColor}30`,
                              borderRadius: '10px',
                              backdropFilter: 'blur(5px)'
                            }}
                          >
                            {/* Status */}
                            {item.status && (
                              <div className="d-flex align-items-center mb-2">
                                <div 
                                  className="status-indicator me-2"
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    background: '#00ff88',
                                    borderRadius: '50%',
                                    animation: 'blink 2s infinite'
                                  }}
                                ></div>
                                <span className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>
                                  {item.status}
                                </span>
                              </div>
                            )}
                            
                            {/* Top Features */}
                            <h6 className="text-white mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>
                              <i className="fas fa-star me-2" style={{ color: item.accentColor }}></i>
                              Key Features
                            </h6>
                            {item.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="d-flex align-items-center mb-1">
                                <i className="fas fa-check me-2" style={{ color: item.accentColor, fontSize: '0.7rem' }}></i>
                                <span className="text-white" style={{ fontSize: '0.8rem' }}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                      
                      {/* Compact CTA Button */}
                      <Button
                        size="sm"
                        className="px-4 py-2 fw-bold"
                        style={{
                          background: `linear-gradient(135deg, ${item.accentColor}, transparent)`,
                          border: `2px solid ${item.accentColor}`,
                          borderRadius: '25px',
                          color: 'white',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: `0 8px 20px ${item.accentColor}40`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-rocket me-2"></i>
                        Explore
                      </Button>
                    </div>
                  </div>
                  
                  {/* Compact Visual Side */}
                  <div className="col-lg-6 col-md-12 order-1 order-lg-2">
                    <div className="visual-container position-relative p-2">
                      {/* Compact Holographic Medical Display */}
                      <div 
                        className="holographic-display position-relative"
                        style={{
                          width: '350px',
                          height: '350px',
                          margin: '0 auto',
                          background: `linear-gradient(135deg, ${item.accentColor}20, transparent)`,
                          borderRadius: '50%',
                          border: `2px solid ${item.accentColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 30px ${item.accentColor}40`,
                          animation: 'hologram 4s ease-in-out infinite'
                        }}
                      >
                        {/* Central Medical Icon */}
                        <div 
                          className="medical-icon-display text-center"
                          style={{
                            background: `radial-gradient(circle, ${item.accentColor}30, transparent)`,
                            borderRadius: '50%',
                            padding: '40px',
                            animation: 'pulse-glow 3s ease-in-out infinite'
                          }}
                        >
                          <i 
                            className={`${item.icon} text-white`}
                            style={{ 
                              fontSize: '4rem',
                              filter: `drop-shadow(0 0 15px ${item.accentColor})`
                            }}
                          ></i>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="position-absolute top-0 end-0 p-2">
                          <div 
                            className="status-dot"
                            style={{
                              width: '10px',
                              height: '10px',
                              background: '#00ff88',
                              borderRadius: '50%',
                              animation: 'blink 2s infinite',
                              boxShadow: '0 0 10px #00ff88'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          {/* Compact Custom Indicators */}
          <div className="text-center mt-3">
            {radiologyShowcase.items.map((_, index) => (
              <button
                key={index}
                className={`indicator-btn mx-1 ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === activeSlide ? '#1EBCB7' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: index === activeSlide ? '0 0 15px #1EBCB7' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              ></button>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-3">{features.title}</h2>
              <p className="lead text-muted">{features.subtitle}</p>
            </Col>
          </Row>

          <Row>
            {features.items.map((feature, index) => (
              <Col lg={4} md={6} key={feature.id} className="mb-4">
                <Card 
                  className="h-100 border-0 feature-card"
                  style={{
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.boxShadow,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
                    <div 
                      className="feature-icon mb-3"
                      style={{
                        width: '70px',
                        height: '70px',
                        background: feature.color,
                        borderRadius: theme.borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={`${feature.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted mb-3">{feature.description}</p>
                    
                    <ul className="list-unstyled">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="mb-2">
                          <i className="fas fa-check-circle me-2" style={{ color: feature.color }}></i>
                          <small>{item}</small>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Professional Testimonials Slider */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.3)' }}></div>
        <Container className="position-relative">
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="display-4 fw-bold text-white mb-3">{testimonials.title}</h2>
              <p className="lead text-white opacity-75">{testimonials.subtitle}</p>
            </Col>
          </Row>

          <Carousel
            interval={testimonials.interval}
            indicators={testimonials.showIndicators}
            controls={testimonials.showNavigation}
            className="testimonials-carousel"
          >
            {testimonials.items.map((testimonial, index) => (
              <Carousel.Item key={testimonial.id}>
                <Container>
                  <Row className="justify-content-center">
                    <Col lg={10}>
                      <Card 
                        className="border-0 shadow-lg testimonial-card"
                        style={{
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          padding: '20px'
                        }}
                      >
                        <Card.Body className="p-5">
                          <Row className="align-items-center">
                            <Col lg={4} className="text-center mb-4 mb-lg-0">
                              <div className="position-relative d-inline-block">
                                <div 
                                  className="profile-bg"
                                  style={{
                                    width: '180px',
                                    height: '180px',
                                    background: testimonial.background,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    position: 'relative'
                                  }}
                                >
                                  <img
                                    src={testimonial.image || '/assets/images/user/default-doctor.jpg'}
                                    alt={testimonial.name}
                                    className="rounded-circle border-4 border-white shadow"
                                    style={{ 
                                      width: '150px', 
                                      height: '150px', 
                                      objectFit: 'cover',
                                      position: 'absolute'
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <h5 className="fw-bold mb-1">{testimonial.name}</h5>
                                <p className="text-primary fw-semibold mb-1">{testimonial.title}</p>
                                <p className="text-muted small mb-2">{testimonial.organization}</p>
                                <Badge bg="secondary" className="mb-2">{testimonial.specialization}</Badge>
                                <div className="text-muted small">{testimonial.years}</div>
                              </div>
                            </Col>
                            
                            <Col lg={8}>
                              <div className="testimonial-content">
                                <div className="mb-3">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <i key={i} className="fas fa-star text-warning me-1" style={{ fontSize: '1.2rem' }}></i>
                                  ))}
                                </div>
                                
                                <blockquote className="blockquote mb-4">
                                  <i className="fas fa-quote-left text-primary me-2" style={{ fontSize: '2rem', opacity: '0.3' }}></i>
                                  <p className="lead fst-italic mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    {testimonial.quote}
                                  </p>
                                </blockquote>
                                
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    <i className="fas fa-shield-alt text-success me-2"></i>
                                    <span className="small text-muted">Verified Healthcare Professional</span>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Compliance & Trust Section */}
      <section id="compliance" className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={10} className="mx-auto">
              <div className="mb-4">
                <Badge bg="primary" className="px-3 py-2 mb-3 fs-6">
                  <i className="fas fa-shield-alt me-2"></i>
                  Enterprise Security & Compliance
                </Badge>
              </div>
              <h2 className="display-5 fw-bold mb-3">{compliance.title}</h2>
              <p className="lead text-muted mb-4">{compliance.subtitle}</p>
              <p className="text-muted">{compliance.description}</p>
            </Col>
          </Row>

          {/* Compliance Certifications */}
          <Row className="mb-5">
            {compliance.certifications.map((cert, index) => (
              <Col key={cert.id} lg={3} md={6} className="mb-4">
                <Card className="h-100 border-0 text-center compliance-cert-card" style={{ 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease'
                }}>
                  <Card.Body className="py-4">
                    <div className="compliance-icon mb-3">
                      <i className={cert.icon} style={{ fontSize: '48px', color: cert.color }}></i>
                    </div>
                    <h5 className="fw-bold mb-2">{cert.name}</h5>
                    <p className="small text-muted mb-3">{cert.description}</p>
                    
                    {/* Key Features */}
                    <div className="compliance-features">
                      {cert.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2" style={{ fontSize: '12px' }}></i>
                          <span className="small text-muted">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Trust Features */}
          <Row className="text-center">
            <Col lg={12} className="mb-4">
              <h4 className="fw-bold text-dark mb-4">Why Healthcare Organizations Trust MediXscan AI</h4>
            </Col>
            {compliance.trustFeatures.map((feature, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <div className="trust-feature text-center">
                  <div className="trust-icon mb-3">
                    <i className={feature.icon} style={{ 
                      fontSize: '32px', 
                      color: theme.primaryColor,
                      padding: '20px',
                      background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.primaryColor}05)`,
                      borderRadius: '50%'
                    }}></i>
                  </div>
                  <h6 className="fw-bold mb-2">{feature.title}</h6>
                  <p className="small text-muted">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>

          {/* Compliance Trust Badges */}
          <Row className="mt-5">
            <Col lg={12}>
              <div className="text-center">
                <h6 className="text-muted mb-4">Certified & Audited By Leading Security Organizations</h6>
                <ComplianceTrustBadges layout="badges-only" className="justify-content-center" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-5" style={{ background: theme.darkColor }}>
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold text-white mb-3">{contact.title}</h2>
              <p className="lead text-white opacity-75 mb-4">{contact.subtitle}</p>
              
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button
                  size="lg"
                  className="px-4 py-3"
                  style={{
                    background: theme.gradient,
                    border: 'none',
                    borderRadius: theme.borderRadius
                  }}
                >
                  <i className="fas fa-rocket me-2"></i>
                  Start Free Trial
                </Button>
                
                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-4 py-3"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  <i className="fas fa-phone me-2"></i>
                  Schedule Demo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Video Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Demo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ratio ratio-16x9">
            <iframe
              src={hero.videoUrl}
              title="Product Demo"
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
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

        /* Enhanced Hero Animations */
        .hero-particles .particles-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.2), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(30, 188, 183, 0.3), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(6, 182, 212, 0.2), transparent);
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: hero-particles-drift 25s linear infinite;
        }

        @keyframes hero-particles-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-200px, -200px); }
        }

        @keyframes float-orbit-1 { 0%, 100% { transform: rotate(0deg) translateX(180px) rotate(0deg) translateY(0px); } 50% { transform: rotate(180deg) translateX(180px) rotate(-180deg) translateY(-20px); } }
        @keyframes float-orbit-2 { 0%, 100% { transform: rotate(60deg) translateX(180px) rotate(-60deg) translateY(0px); } 50% { transform: rotate(240deg) translateX(180px) rotate(-240deg) translateY(-15px); } }
        @keyframes float-orbit-3 { 0%, 100% { transform: rotate(120deg) translateX(180px) rotate(-120deg) translateY(0px); } 50% { transform: rotate(300deg) translateX(180px) rotate(-300deg) translateY(-25px); } }
        @keyframes float-orbit-4 { 0%, 100% { transform: rotate(180deg) translateX(180px) rotate(-180deg) translateY(0px); } 50% { transform: rotate(360deg) translateX(180px) rotate(-360deg) translateY(-10px); } }
        @keyframes float-orbit-5 { 0%, 100% { transform: rotate(240deg) translateX(180px) rotate(-240deg) translateY(0px); } 50% { transform: rotate(420deg) translateX(180px) rotate(-420deg) translateY(-30px); } }
        @keyframes float-orbit-6 { 0%, 100% { transform: rotate(300deg) translateX(180px) rotate(-300deg) translateY(0px); } 50% { transform: rotate(480deg) translateX(180px) rotate(-480deg) translateY(-20px); } }

        /* Enhanced Pulse Glow Effect */
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
            box-shadow: 
              0 0 60px rgba(30, 188, 183, 0.6),
              inset 0 0 60px rgba(255, 255, 255, 0.1);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.2);
            box-shadow: 
              0 0 80px rgba(30, 188, 183, 0.8),
              inset 0 0 80px rgba(255, 255, 255, 0.15);
          }
        }

        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 20px 60px rgba(30, 188, 183, 0.3);
          }
          50% {
            box-shadow: 0 20px 60px rgba(30, 188, 183, 0.5);
          }
          100% {
            box-shadow: 0 20px 60px rgba(30, 188, 183, 0.3);
          }
        }

        .feature-card {
          transition: all 0.3s ease;
        }

        .popular-plan {
          position: relative;
          z-index: 2;
        }

        /* Extraordinary Carousel Styles */
        .extraordinary-carousel .carousel-control-prev,
        .extraordinary-carousel .carousel-control-next {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, rgba(30, 188, 183, 0.8), rgba(6, 182, 212, 0.8));
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          border: 2px solid rgba(30, 188, 183, 0.6);
          backdrop-filter: blur(15px);
          box-shadow: 0 15px 35px rgba(30, 188, 183, 0.4);
          transition: all 0.4s ease;
        }

        .extraordinary-carousel .carousel-control-prev {
          left: -35px;
        }

        .extraordinary-carousel .carousel-control-next {
          right: -35px;
        }

        .extraordinary-carousel .carousel-control-prev:hover,
        .extraordinary-carousel .carousel-control-next:hover {
          background: linear-gradient(135deg, rgba(30, 188, 183, 1), rgba(6, 182, 212, 1));
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 20px 50px rgba(30, 188, 183, 0.6);
        }

        .extraordinary-carousel .carousel-control-prev-icon,
        .extraordinary-carousel .carousel-control-next-icon {
          width: 30px;
          height: 30px;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        /* Particles Animation */
        .particles-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(30, 188, 183, 0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(6, 182, 212, 0.3), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(59, 130, 246, 0.3), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(139, 92, 246, 0.3), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(30, 188, 183, 0.3), transparent);
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: particles-move 20s linear infinite;
          opacity: 0.8;
        }

        @keyframes particles-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-200px, -200px); }
        }

        /* Holographic Display Effects */
        @keyframes hologram {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.9;
          }
          50% { 
            transform: scale(1.05) rotate(1deg);
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.1);
            filter: brightness(1.3);
          }
        }

        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scan-beam {
          0% { 
            transform: translateY(-250px) scaleX(0);
            opacity: 0;
          }
          20% { 
            transform: translateY(-200px) scaleX(1);
            opacity: 1;
          }
          80% { 
            transform: translateY(200px) scaleX(1);
            opacity: 1;
          }
          100% { 
            transform: translateY(250px) scaleX(0);
            opacity: 0;
          }
        }

        /* Grid Lines Animation */
        .grid-lines::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(30, 188, 183, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 188, 183, 0.2) 1px, transparent 1px);
          background-size: 20px 20px;
          border-radius: 50%;
          animation: grid-pulse 3s ease-in-out infinite;
        }

        @keyframes grid-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        /* Data Points Orbiting Animation */
        @keyframes orbit-1 { 0% { transform: rotate(0deg) translateX(200px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(200px) rotate(-360deg); } }
        @keyframes orbit-2 { 0% { transform: rotate(45deg) translateX(180px) rotate(-45deg); } 100% { transform: rotate(405deg) translateX(180px) rotate(-405deg); } }
        @keyframes orbit-3 { 0% { transform: rotate(90deg) translateX(220px) rotate(-90deg); } 100% { transform: rotate(450deg) translateX(220px) rotate(-450deg); } }
        @keyframes orbit-4 { 0% { transform: rotate(135deg) translateX(160px) rotate(-135deg); } 100% { transform: rotate(495deg) translateX(160px) rotate(-495deg); } }
        @keyframes orbit-5 { 0% { transform: rotate(180deg) translateX(200px) rotate(-180deg); } 100% { transform: rotate(540deg) translateX(200px) rotate(-540deg); } }
        @keyframes orbit-6 { 0% { transform: rotate(225deg) translateX(180px) rotate(-225deg); } 100% { transform: rotate(585deg) translateX(180px) rotate(-585deg); } }
        @keyframes orbit-7 { 0% { transform: rotate(270deg) translateX(220px) rotate(-270deg); } 100% { transform: rotate(630deg) translateX(220px) rotate(-630deg); } }
        @keyframes orbit-8 { 0% { transform: rotate(315deg) translateX(160px) rotate(-315deg); } 100% { transform: rotate(675deg) translateX(160px) rotate(-675deg); } }

        /* Feature Item Hover Effect */
        .feature-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(10px);
          border-color: rgba(30, 188, 183, 0.5) !important;
        }

        /* Status Indicator Blink */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        /* Float Animation for Badge */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Enhanced Responsive Design */
        @media (max-width: 1200px) {
          .holographic-display {
            width: 400px !important;
            height: 400px !important;
          }
        }

        @media (max-width: 768px) {
          .extraordinary-carousel .carousel-control-prev,
          .extraordinary-carousel .carousel-control-next {
            width: 50px;
            height: 50px;
            left: 10px;
            right: 10px;
          }

          .holographic-display {
            width: 300px !important;
            height: 300px !important;
          }

          .medical-icon-display i {
            font-size: 4rem !important;
          }

          .slide-content {
            padding: 2rem !important;
          }

          .display-3 {
            font-size: 2.5rem !important;
          }

          .display-4 {
            font-size: 2rem !important;
          }
        }

        @media (max-width: 576px) {
          .holographic-display {
            width: 250px !important;
            height: 250px !important;
          }

          .particles-container::before {
            background-size: 100px 100px;
          }
        }

        /* Custom Scrollbar for Medical Data Panel */
        .data-panel::-webkit-scrollbar {
          width: 4px;
        }

        .data-panel::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .data-panel::-webkit-scrollbar-thumb {
          background: #1EBCB7;
          border-radius: 2px;
        }

        /* Gradient Text Animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .extraordinary-carousel .slide-content h3 {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }

        /* Testimonials Carousel Styles */
        .testimonials-carousel .carousel-control-prev,
        .testimonials-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          color: #333;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .testimonials-carousel .carousel-control-prev {
          left: -25px;
        }

        .testimonials-carousel .carousel-control-next {
          right: -25px;
        }

        .testimonials-carousel .carousel-control-prev:hover,
        .testimonials-carousel .carousel-control-next:hover {
          background: white;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .testimonials-carousel .carousel-indicators {
          bottom: -60px;
        }

        .testimonials-carousel .carousel-indicators button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 0 6px;
          background: rgba(255, 255, 255, 0.6);
          border: none;
        }

        .testimonials-carousel .carousel-indicators button.active {
          background: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        .testimonial-card {
          transform: scale(1);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: scale(1.02);
        }

        .profile-bg {
          position: relative;
          overflow: hidden;
        }

        .profile-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        /* Clean Animations - Minimal */
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Compliance Section Styles */
        .compliance-cert-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
        }

        .trust-feature:hover .trust-icon i {
          transform: scale(1.1);
          transition: all 0.3s ease;
        }

        .compliance-features {
          text-align: left;
          max-width: 200px;
          margin: 0 auto;
        }

        /* Cookie Consent Banner Styles */
        .cookie-consent-banner {
          backdrop-filter: blur(10px);
          border-top: 3px solid #1EBCB7;
        }

        .trust-badge {
          padding: 8px 15px;
          background: rgba(0, 102, 204, 0.1);
          border-radius: 20px;
          border: 1px solid rgba(0, 102, 204, 0.2);
          transition: all 0.3s ease;
        }

        .trust-badge:hover {
          background: rgba(0, 102, 204, 0.15);
          transform: translateY(-2px);
        }
        
        .landing-navbar .navbar-toggler {
          border: none;
          padding: 0.25rem 0.5rem;
        }
        
        .landing-navbar .navbar-toggler:focus {
          box-shadow: none;
        }
        
        .feature-card {
          transition: all 0.3s ease;
        }
        
        .hero-content {
          animation-delay: 0.2s;
        }
        
        /* Minimal scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-5px); }
          60% { transform: translateX(-50%) translateY(-3px); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-section {
            padding-top: 100px !important;
          }
          
          .display-3 {
            font-size: 2.5rem !important;
          }
          
          .radiology-carousel .carousel-control-prev,
          .radiology-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
          }

          .radiology-carousel .carousel-control-prev {
            left: 10px;
          }

          .radiology-carousel .carousel-control-next {
            right: 10px;
          }

          .medical-visual {
            width: 300px !important;
            height: 300px !important;
          }

          .testimonials-carousel .carousel-control-prev,
          .testimonials-carousel .carousel-control-next {
            display: none;
          }
        }
      `}</style>
      
      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </>
  );
};

export default LandingPage;
