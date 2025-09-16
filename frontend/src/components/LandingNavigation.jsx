import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import landingPageConfig from "@config/landingPageConfig.js";
import { getLogoPath, getResponsiveLogo } from "@config/logoConfig.js";
import { injectNavigationVariables } from "@utils/heroLayoutUtils.js";

const LandingNavigation = ({ onCTAClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const { brand, navigation } = landingPageConfig;

  useEffect(() => {
    // Inject navigation CSS variables
    injectNavigationVariables(navigation.spacing);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigation.spacing]);

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

  // Professional Navigation Styling - Soft Coded
  const navbarStyle = {
    position: navigation.position,
    top: 0,
    width: '100%',
    zIndex: 1050,
    height: navigation.spacing?.height || '70px',
    background: scrolled ? navigation.scrollBackground : navigation.background,
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
    padding: `${navigation.spacing?.padding?.vertical || '1rem'} 0`,
    marginBottom: navigation.spacing?.marginBottom || '20px',
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'
  };

  const navLinkStyle = {
    color: scrolled ? navigation.scrollTextColor : navigation.textColor,
    fontWeight: '500',
    marginRight: navigation.spacing?.itemSpacing || '2rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.5rem 0'
  };

  const brandStyle = {
    color: scrolled ? navigation.scrollTextColor : navigation.textColor,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textDecoration: 'none'
  };

  return (
    <Navbar 
      expand="lg"
      style={navbarStyle}
      className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}
      variant={scrolled ? 'light' : 'dark'}
    >
      <Container fluid className="px-3">
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
              src={scrolled ? getLogoPath('main') : getLogoPath('white')}
              alt={brand.name}
              style={{ 
                maxHeight: navigation.logo.maxHeight, 
                marginRight: navigation.logo.spacing?.marginRight || navigation.spacing?.logoSpacing || '1rem',
                transition: 'all 0.3s ease',
                filter: scrolled ? 'none' : 'brightness(1.2) drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
                padding: '0.25rem 0'
              }}
              onError={(e) => {
                // Fallback to legacy logos if new ones fail to load
                e.target.src = scrolled ? brand.logoWhite : brand.logo;
              }}
            />
          ) : null}
          {(navigation.logo.type === 'text' || navigation.logo.type === 'both') && navigation.logo.showBrand ? (
            <span>{brand.name}</span>
          ) : null}
        </Navbar.Brand>

        {/* Mobile Toggle - Enhanced */}
        <Navbar.Toggle 
          aria-controls="landing-navbar-nav"
          className="border-0 p-2"
          style={{
            color: scrolled ? navigation.scrollTextColor : navigation.textColor,
            fontSize: '1.2rem'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        {/* Navigation Items - Enhanced Mobile Menu */}
        <Navbar.Collapse id="landing-navbar-nav" className="text-center text-lg-start">
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

          {/* CTA Buttons - Enhanced Mobile Layout */}
          <div className="d-flex gap-2 flex-column flex-lg-row mt-3 mt-lg-0">
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
