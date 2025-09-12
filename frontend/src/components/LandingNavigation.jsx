import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import landingPageConfig from "@config/landingPageConfig.js";

const LandingNavigation = ({ onCTAClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const { brand, navigation } = landingPageConfig;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item) => {
    if (item.type === 'scroll') {
      const element = document.querySelector(item.href);
      if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    } else {
      window.location.href = item.href;
    }
  };

  const navbarStyle = {
    position: navigation.position,
    top: 0,
    width: '100%',
    zIndex: 1050,
    background: scrolled ? navigation.scrollBackground : navigation.background,
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
    padding: '0.5rem 0'
  };

  const navLinkStyle = {
    color: scrolled ? navigation.scrollTextColor : navigation.textColor,
    fontWeight: '500',
    marginRight: '2rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '1rem'
  };

  const brandStyle = {
    color: scrolled ? navigation.scrollTextColor : navigation.textColor,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textDecoration: 'none'
  };

  return (
    <Navbar 
      expand={navigation.mobileBreakpoint} 
      style={navbarStyle}
      className="landing-navbar"
    >
      <Container>
        {/* Brand/Logo */}
        <Navbar.Brand 
          href="#home" 
          className="d-flex align-items-center"
          style={brandStyle}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {navigation.logo.type === 'image' || navigation.logo.type === 'both' ? (
            <img
              src={scrolled ? brand.logo : brand.logoWhite}
              alt={brand.name}
              style={{ maxHeight: navigation.logo.maxHeight, marginRight: '0.5rem' }}
            />
          ) : null}
          {(navigation.logo.type === 'text' || navigation.logo.type === 'both') && navigation.logo.showBrand ? (
            <span>{brand.name}</span>
          ) : null}
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle 
          aria-controls="landing-navbar-nav"
          style={{
            borderColor: scrolled ? navigation.scrollTextColor : navigation.textColor,
            color: scrolled ? navigation.scrollTextColor : navigation.textColor
          }}
        />

        {/* Navigation Items */}
        <Navbar.Collapse id="landing-navbar-nav">
          <Nav className="me-auto">
            {navigation.menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                href={item.href}
                style={{
                  ...navLinkStyle,
                  fontWeight: item.active ? '600' : '500',
                  borderBottom: item.active ? `2px solid ${landingPageConfig.hero.design.accentColor}` : 'none'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = landingPageConfig.hero.design.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = scrolled ? navigation.scrollTextColor : navigation.textColor;
                }}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* CTA Buttons */}
          <div className="d-flex gap-2">
            {navigation.ctaButtons?.map((button, index) => (
              <Button
                key={index}
                variant={button.variant === 'outline' ? 'outline-primary' : 'primary'}
                onClick={() => onCTAClick(button.action)}
                style={{
                  background: button.variant === 'solid' ? landingPageConfig.hero.design.accentColor : 'transparent',
                  border: `1px solid ${landingPageConfig.hero.design.accentColor}`,
                  borderRadius: '6px',
                  padding: '0.5rem 1.2rem',
                  fontWeight: '500',
                  color: button.variant === 'solid' ? 'white' : (scrolled ? landingPageConfig.hero.design.accentColor : 'white'),
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  if (button.variant === 'outline') {
                    e.target.style.background = landingPageConfig.hero.design.accentColor;
                    e.target.style.color = 'white';
                  } else {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = `0 4px 15px rgba(30, 188, 183, 0.3)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (button.variant === 'outline') {
                    e.target.style.background = 'transparent';
                    e.target.style.color = scrolled ? landingPageConfig.hero.design.accentColor : 'white';
                  } else {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LandingNavigation;
