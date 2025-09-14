import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import landingPageConfig from "@config/landingPageConfig.js";
import { getCurrentTheme } from "@config/backgroundThemes.js";
import { getLogoPath } from "@config/logoConfig.js";
import LandingNavigation from "../components/LandingNavigation.jsx";
import ComplianceTrustBadges from "../components/ComplianceTrustBadges.jsx";
import CookieConsentBanner from "../components/CookieConsentBanner.jsx";
import { injectHeroLayoutVariables } from "../utils/heroLayoutUtils.js";
import "../assets/scss/custom/hero-responsive.scss";

const LandingPage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { brand, hero, features, statistics, testimonials, radiologyShowcase, contact, compliance, theme } = landingPageConfig;
  
  // Get current background theme for clean text display
  const currentTheme = getCurrentTheme();

  useEffect(() => {
    setIsVisible(true);
    
    // Inject hero layout CSS variables for responsive design
    injectHeroLayoutVariables(hero);
    
    console.log('🎨 Hero layout variables injected:', {
      height: hero.layout?.height,
      spacing: hero.layout?.spacing
    });
  }, [hero]);

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

      {/* Professional Hero Section - Soft Coded Layout Control */}
      <section 
        id="home"
        className={`hero-section d-flex position-relative`}
        style={{
          // Intelligent Dynamic Height - Balanced for Content
          height: hero.layout?.height?.desktop || 'calc(100vh - 60px)',
          minHeight: hero.layout?.height?.minimum || '600px',
          maxHeight: hero.layout?.height?.maximum || '900px',
          
          // Flexible Alignment Based on Configuration
          alignItems: hero.layout?.contentAlignment?.vertical || 'center',
          justifyContent: hero.layout?.contentAlignment?.horizontal || 'flex-start',
          
          // Clean Professional Background - No Text Conflicts
          background: `url(${currentTheme.backgroundImage})`,
          backgroundSize: hero.design?.backgroundProperties?.size || 'cover',
          backgroundPosition: hero.design?.backgroundProperties?.position || 'center',
          backgroundRepeat: hero.design?.backgroundProperties?.repeat || 'no-repeat',
          backgroundAttachment: hero.design?.backgroundProperties?.attachment || 'fixed',
          
          // Intelligent Navigation Clearance - Calculated Balance
          paddingTop: 'var(--nav-clearance, calc(70px + 20px + 30px))',
          paddingBottom: 'var(--bottom-margin, 2rem)',
          marginBottom: 'var(--section-gap, 4rem)'
        }}
      >
        {/* Minimal Global Overlay (background is already optimized) */}
        <div 
          className="position-absolute w-100 h-100"
          style={{
            background: currentTheme.overlay,
            zIndex: 1
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center h-100">
            <Col lg={8} className="text-white">
              {/* Intelligent Content Container - Balanced Distribution */}
              <div 
                className={`hero-content ${isVisible ? 'fade-in' : ''}`}
                style={{
                  background: currentTheme.textOverlay,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: 'var(--element-spacing, 1.5rem)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  maxWidth: '100%',
                  textAlign: hero.layout?.contentAlignment?.textAlign || 'left',
                  
                  // Intelligent Content Distribution
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '400px' // Minimum height for proper distribution
                }}
              >
                {/* Top Content Area - 15% Distribution */}
                <div 
                  className="hero-top-area"
                  style={{
                    height: 'var(--content-top-area, 15%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    marginBottom: 'var(--element-spacing, 1.5rem)'
                  }}
                >
                  {/* Clean Badge */}
                  <Badge 
                    className="px-4 py-2 fw-semibold"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: `1px solid ${hero.design?.accentColor || '#1EBCB7'}`,
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(10px)',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <i className="fas fa-robot me-2"></i>
                    AI-Powered Healthcare Innovation
                  </Badge>
                </div>

                {/* Middle Content Area - 60% Distribution */}
                <div 
                  className="hero-middle-area"
                  style={{
                    height: 'var(--content-middle-area, 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginBottom: 'var(--element-spacing, 1.5rem)'
                  }}
                >
                  {/* Clean Title */}
                  <h1 
                    className="display-3 fw-bold"
                    style={{ 
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      lineHeight: '1.2',
                      color: '#ffffff',
                      textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                      marginBottom: 'var(--title-spacing, 2rem)'
                    }}
                  >
                    {hero.title}
                  </h1>
                  
                  {/* Clean Subtitle */}
                  <h2 
                    className="h4"
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: '400',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                      marginBottom: 'var(--element-spacing, 1.5rem)'
                    }}
                  >
                    {hero.subtitle}
                  </h2>
                  
                  {/* Clean Description */}
                  <p 
                    className="lead" 
                    style={{ 
                      maxWidth: '600px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1.1rem',
                      lineHeight: '1.6',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                      marginBottom: 'var(--description-spacing, 2.5rem)'
                    }}
                  >
                    {hero.description}
                  </p>
                </div>

                {/* Bottom Content Area - 25% Distribution */}
                <div 
                  className="hero-bottom-area"
                  style={{
                    height: 'var(--content-bottom-area, 25%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  {/* Balanced CTA Buttons */}
                  <div 
                    className="d-flex flex-wrap gap-3"
                    style={{
                      gap: 'var(--element-spacing, 1.5rem)',
                      marginBottom: 'var(--cta-area-spacing, 2rem)'
                    }}
                  >
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
                        marginBottom: '0.5rem', // Additional spacing between buttons when they wrap
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
            {testimonials.items.reduce((slides, testimonial, index) => {
              if (index % 2 === 0) {
                const nextTestimonial = testimonials.items[index + 1];
                slides.push(
                  <Carousel.Item key={`slide-${Math.floor(index / 2)}`}>
                    <Container>
                      <Row className="justify-content-center">
                        <Col lg={12}>
                          <Row className="g-4">
                            {/* First Testimonial */}
                            <Col lg={6}>
                              <Card 
                                className="border-0 shadow-lg testimonial-card h-100"
                                style={{
                                  borderRadius: '20px',
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)',
                                  padding: '15px'
                                }}
                              >
                                <Card.Body className="p-4">
                                  <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                      <div 
                                        className="profile-bg"
                                        style={{
                                          width: '120px',
                                          height: '120px',
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
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover',
                                            position: 'absolute'
                                          }}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                      <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                                      <p className="text-primary fw-semibold mb-1 small">{testimonial.title}</p>
                                      <p className="text-muted small mb-2">{testimonial.organization}</p>
                                      <Badge bg="secondary" className="mb-2 small">{testimonial.specialization}</Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="testimonial-content">
                                    <div className="mb-3 text-center">
                                      {[...Array(testimonial.rating)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-warning me-1" style={{ fontSize: '1rem' }}></i>
                                      ))}
                                    </div>
                                    
                                    <blockquote className="blockquote mb-0">
                                      <i className="fas fa-quote-left text-primary me-2" style={{ fontSize: '1.5rem', opacity: '0.3' }}></i>
                                      <p className="fst-italic mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        {testimonial.quote}
                                      </p>
                                    </blockquote>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>

                            {/* Second Testimonial (if exists) */}
                            {nextTestimonial && (
                              <Col lg={6}>
                                <Card 
                                  className="border-0 shadow-lg testimonial-card h-100"
                                  style={{
                                    borderRadius: '20px',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '15px'
                                  }}
                                >
                                  <Card.Body className="p-4">
                                    <div className="text-center mb-4">
                                      <div className="position-relative d-inline-block">
                                        <div 
                                          className="profile-bg"
                                          style={{
                                            width: '120px',
                                            height: '120px',
                                            background: nextTestimonial.background,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            position: 'relative'
                                          }}
                                        >
                                          <img
                                            src={nextTestimonial.image || '/assets/images/user/default-doctor.jpg'}
                                            alt={nextTestimonial.name}
                                            className="rounded-circle border-4 border-white shadow"
                                            style={{ 
                                              width: '100px', 
                                              height: '100px', 
                                              objectFit: 'cover',
                                              position: 'absolute'
                                            }}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="mt-3">
                                        <h6 className="fw-bold mb-1">{nextTestimonial.name}</h6>
                                        <p className="text-primary fw-semibold mb-1 small">{nextTestimonial.title}</p>
                                        <p className="text-muted small mb-2">{nextTestimonial.organization}</p>
                                        <Badge bg="secondary" className="mb-2 small">{nextTestimonial.specialization}</Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="testimonial-content">
                                      <div className="mb-3 text-center">
                                        {[...Array(nextTestimonial.rating)].map((_, i) => (
                                          <i key={i} className="fas fa-star text-warning me-1" style={{ fontSize: '1rem' }}></i>
                                        ))}
                                      </div>
                                      
                                      <blockquote className="blockquote mb-0">
                                        <i className="fas fa-quote-left text-primary me-2" style={{ fontSize: '1.5rem', opacity: '0.3' }}></i>
                                        <p className="fst-italic mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                          {nextTestimonial.quote}
                                        </p>
                                      </blockquote>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </Carousel.Item>
                );
              }
              return slides;
            }, [])}
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

      {/* Advanced CTA Section */}
      <section id="contact" className="py-5 position-relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1EBCB7 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}>
        {/* Animated Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="floating-elements">
            <div className="floating-circle" style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            <div className="floating-circle" style={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              animation: 'float 8s ease-in-out infinite reverse'
            }}></div>
            <div className="floating-circle" style={{
              position: 'absolute',
              bottom: '20%',
              left: '20%',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              animation: 'float 10s ease-in-out infinite'
            }}></div>
          </div>
        </div>

        <Container className="position-relative">
          <Row className="text-center mb-5">
            <Col lg={10} className="mx-auto">
              <div className="cta-content">
                <h2 className="display-4 fw-bold text-white mb-4" style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.5px'
                }}>
                  {contact.title}
                </h2>
                <p className="lead text-white opacity-90 mb-5" style={{
                  fontSize: '1.3rem',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: '1.6'
                }}>
                  {contact.subtitle}
                </p>
                
                <div className="cta-buttons d-flex flex-wrap justify-content-center gap-4 mb-5">
                  <Button
                    size="lg"
                    className="px-5 py-3 fw-semibold cta-button-primary"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <i className="fas fa-rocket me-2"></i>
                    Start Free Trial
                  </Button>
                  
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-5 py-3 fw-semibold cta-button-secondary"
                    style={{
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    Schedule Demo
                  </Button>
                  
                  <Button
                    variant="link"
                    size="lg"
                    className="px-4 py-3 text-white fw-semibold"
                    style={{
                      fontSize: '1.1rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-play-circle me-2"></i>
                    Watch Demo Video
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="trust-indicators">
                  <Row className="align-items-center justify-content-center">
                    <Col lg={3} md={6} className="mb-3">
                      <div className="trust-item text-white">
                        <i className="fas fa-shield-alt mb-2" style={{ fontSize: '2rem', opacity: '0.8' }}></i>
                        <div className="fw-bold">HIPAA Compliant</div>
                        <small className="opacity-75">Enterprise Security</small>
                      </div>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <div className="trust-item text-white">
                        <i className="fas fa-users mb-2" style={{ fontSize: '2rem', opacity: '0.8' }}></i>
                        <div className="fw-bold">10,000+ Users</div>
                        <small className="opacity-75">Healthcare Professionals</small>
                      </div>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <div className="trust-item text-white">
                        <i className="fas fa-hospital mb-2" style={{ fontSize: '2rem', opacity: '0.8' }}></i>
                        <div className="fw-bold">500+ Hospitals</div>
                        <small className="opacity-75">Worldwide Trust</small>
                      </div>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <div className="trust-item text-white">
                        <i className="fas fa-award mb-2" style={{ fontSize: '2rem', opacity: '0.8' }}></i>
                        <div className="fw-bold">99.9% Uptime</div>
                        <small className="opacity-75">Guaranteed Reliability</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Advanced Footer */}
      <footer className="advanced-footer" style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Footer Background Pattern */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(30, 188, 183, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)
          `,
          opacity: '0.6'
        }}></div>

        <Container className="position-relative">
          {/* Main Footer Content */}
          <div className="py-5">
            <Row>
              {/* Brand Section */}
              <Col lg={4} md={6} className="mb-4">
                <div className="footer-brand">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={getLogoPath('white')} 
                      alt="MediXScan AI" 
                      style={{ height: '40px', marginRight: '12px' }}
                    />
                    <div>
                      <h5 className="text-white mb-0 fw-bold">{brand.name}</h5>
                      <small className="text-light opacity-75">{brand.tagline}</small>
                    </div>
                  </div>
                  <p className="text-light opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
                    Revolutionizing medical diagnostics with cutting-edge AI technology. 
                    Trusted by healthcare professionals worldwide for accurate, fast, and reliable radiology analysis.
                  </p>
                  
                  {/* Social Media Links */}
                  <div className="social-links d-flex gap-3">
                    <a href={contact.socialMedia.linkedin} className="social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href={contact.socialMedia.twitter} className="social-link">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href={contact.socialMedia.facebook} className="social-link">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </Col>

              {/* Quick Links */}
              <Col lg={2} md={6} className="mb-4">
                <h6 className="text-white fw-bold mb-3">Platform</h6>
                <ul className="footer-links list-unstyled">
                  <li><a href="#features" className="text-light opacity-75">Features</a></li>
                  <li><a href="#pricing" className="text-light opacity-75">Pricing</a></li>
                  <li><a href="#security" className="text-light opacity-75">Security</a></li>
                  <li><a href="#integrations" className="text-light opacity-75">Integrations</a></li>
                  <li><a href="#api" className="text-light opacity-75">API Documentation</a></li>
                </ul>
              </Col>

              {/* Resources */}
              <Col lg={2} md={6} className="mb-4">
                <h6 className="text-white fw-bold mb-3">Resources</h6>
                <ul className="footer-links list-unstyled">
                  <li><a href="#" className="text-light opacity-75">Documentation</a></li>
                  <li><a href="#" className="text-light opacity-75">Help Center</a></li>
                  <li><a href="#" className="text-light opacity-75">Training</a></li>
                  <li><a href="#" className="text-light opacity-75">Webinars</a></li>
                  <li><a href="#" className="text-light opacity-75">Case Studies</a></li>
                </ul>
              </Col>

              {/* Contact Info */}
              <Col lg={4} md={6} className="mb-4">
                <h6 className="text-white fw-bold mb-3">Get in Touch</h6>
                <div className="contact-info">
                  <div className="contact-item d-flex align-items-center mb-3">
                    <div className="contact-icon me-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <div className="text-white fw-semibold">Email</div>
                      <a href={`mailto:${contact.email}`} className="text-light opacity-75">{contact.email}</a>
                    </div>
                  </div>
                  
                  <div className="contact-item d-flex align-items-center mb-3">
                    <div className="contact-icon me-3">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <div className="text-white fw-semibold">Phone</div>
                      <a href={`tel:${contact.phone}`} className="text-light opacity-75">{contact.phone}</a>
                    </div>
                  </div>
                  
                  <div className="contact-item d-flex align-items-start mb-3">
                    <div className="contact-icon me-3">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <div className="text-white fw-semibold">Address</div>
                      <div className="text-light opacity-75">{contact.address}</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom py-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1) !important' }}>
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                <div className="d-flex flex-wrap gap-4">
                  <a href="#" className="text-light opacity-75 small">Privacy Policy</a>
                  <a href="#" className="text-light opacity-75 small">Terms of Service</a>
                  <a href="#" className="text-light opacity-75 small">Cookie Policy</a>
                  <a href="#" className="text-light opacity-75 small">GDPR</a>
                </div>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="d-flex flex-column">
                  <div className="text-light opacity-75 small">
                    © 2025 {brand.name}. All rights reserved.
                  </div>
                  <div className="text-light opacity-50 small mt-1">
                    Built with ❤️ for healthcare professionals
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </footer>

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
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          color: #333;
          border: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          z-index: 10;
          transition: all 0.3s ease;
        }

        .testimonials-carousel .carousel-control-prev {
          left: -80px;
        }

        .testimonials-carousel .carousel-control-next {
          right: -80px;
        }

        .testimonials-carousel .carousel-control-prev:hover,
        .testimonials-carousel .carousel-control-next:hover {
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transform: translateY(-50%) scale(1.1);
        }

        .testimonials-carousel .carousel-control-prev-icon,
        .testimonials-carousel .carousel-control-next-icon {
          width: 24px;
          height: 24px;
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
            width: 45px;
            height: 45px;
          }

          .testimonials-carousel .carousel-control-prev {
            left: -60px;
          }

          .testimonials-carousel .carousel-control-next {
            right: -60px;
          }
        }

        @media (max-width: 576px) {
          .testimonials-carousel .carousel-control-prev,
          .testimonials-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
          }

          .testimonials-carousel .carousel-control-prev {
            left: -50px;
          }

          .testimonials-carousel .carousel-control-next {
            right: -50px;
          }
        }

        @media (max-width: 480px) {
          .testimonials-carousel .carousel-control-prev,
          .testimonials-carousel .carousel-control-next {
            display: none;
          }
        }

        /* Advanced Footer Styles */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .cta-button-primary:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
        }

        .cta-button-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 1) !important;
          transform: translateY(-2px);
        }

        .trust-item {
          transition: all 0.3s ease;
        }

        .trust-item:hover {
          transform: translateY(-5px);
        }

        .advanced-footer {
          position: relative;
        }

        .advanced-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(30, 188, 183, 0.5), transparent);
        }

        .footer-links li {
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .footer-links a {
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-links a:hover {
          opacity: 1 !important;
          color: #1EBCB7 !important;
          padding-left: 5px;
        }

        .footer-links a::before {
          content: '';
          position: absolute;
          left: -15px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 2px;
          background: #1EBCB7;
          transition: width 0.3s ease;
        }

        .footer-links a:hover::before {
          width: 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-link:hover {
          background: rgba(30, 188, 183, 0.8);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(30, 188, 183, 0.3);
        }

        .contact-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #1EBCB7, #667eea);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .contact-item {
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          transform: translateX(5px);
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        /* Responsive Footer */
        @media (max-width: 768px) {
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-buttons .btn {
            width: 100%;
            max-width: 300px;
          }
          
          .trust-indicators .row {
            justify-content: center;
          }
          
          .social-links {
            justify-content: center;
          }
        }
      `}</style>
      
      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </>
  );
};

export default LandingPage;
