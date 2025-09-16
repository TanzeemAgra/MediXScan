// Responsive Design Configuration
// Comprehensive soft-coded responsive system for all screen sizes

export const RESPONSIVE_CONFIG = {
  // Breakpoints for different device sizes
  breakpoints: {
    xs: '480px',
    sm: '576px', 
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },

  // Navigation responsive configuration
  navigation: {
    desktop: {
      height: '80px',
      padding: '1rem 0',
      logoMaxHeight: '50px',
      fontSize: '1rem',
      itemSpacing: '2rem',
      brandFontSize: '1.6rem'
    },
    tablet: {
      height: '70px', 
      padding: '0.8rem 0',
      logoMaxHeight: '45px',
      fontSize: '0.95rem',
      itemSpacing: '1.5rem',
      brandFontSize: '1.4rem'
    },
    mobile: {
      height: '65px',
      padding: '0.6rem 0', 
      logoMaxHeight: '40px',
      fontSize: '0.9rem',
      itemSpacing: '1rem',
      brandFontSize: '1.3rem'
    }
  },

  // Hero section responsive configuration
  hero: {
    desktop: {
      minHeight: '700px',
      maxHeight: '900px',
      height: 'calc(100vh - 80px)',
      paddingTop: '120px',
      contentPadding: '2.5rem',
      titleSize: 'clamp(3rem, 6vw, 4.5rem)',
      subtitleSize: '1.4rem',
      descriptionSize: '1.2rem',
      buttonPadding: '1rem 2rem'
    },
    tablet: {
      minHeight: '600px',
      maxHeight: '800px', 
      height: 'calc(100vh - 70px)',
      paddingTop: '100px',
      contentPadding: '2rem',
      titleSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      subtitleSize: '1.25rem',
      descriptionSize: '1.1rem',
      buttonPadding: '0.9rem 1.8rem'
    },
    mobile: {
      minHeight: '500px',
      maxHeight: '700px',
      height: 'calc(100vh - 65px)',
      paddingTop: '80px',
      contentPadding: '1.5rem',
      titleSize: 'clamp(1.8rem, 8vw, 2.5rem)',
      subtitleSize: '1.1rem', 
      descriptionSize: '1rem',
      buttonPadding: '0.8rem 1.5rem'
    }
  },

  // Text contrast and visibility settings
  textContrast: {
    desktop: {
      titleShadow: '2px 2px 8px rgba(0,0,0,0.4)',
      textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
      overlayOpacity: '0.3',
      backdropBlur: '12px'
    },
    mobile: {
      titleShadow: '2px 2px 12px rgba(0,0,0,0.6)',
      textShadow: '1px 1px 6px rgba(0,0,0,0.5)',
      overlayOpacity: '0.4',
      backdropBlur: '8px'
    }
  },

  // Button responsive styles
  buttons: {
    desktop: {
      minWidth: '160px',
      fontSize: '1.1rem',
      padding: '1rem 2rem',
      borderRadius: '8px'
    },
    tablet: {
      minWidth: '140px',
      fontSize: '1rem',
      padding: '0.9rem 1.8rem', 
      borderRadius: '7px'
    },
    mobile: {
      minWidth: '120px',
      fontSize: '0.9rem',
      padding: '0.8rem 1.5rem',
      borderRadius: '6px',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }
};

// Utility function to get responsive values
export const getResponsiveValue = (config, property, screenSize = 'desktop') => {
  return config[screenSize]?.[property] || config.desktop?.[property] || null;
};

// Generate CSS custom properties for responsive design
export const generateResponsiveCSS = () => {
  let css = ':root {\n';
  
  // Navigation variables
  css += `  --nav-height-desktop: ${RESPONSIVE_CONFIG.navigation.desktop.height};\n`;
  css += `  --nav-height-tablet: ${RESPONSIVE_CONFIG.navigation.tablet.height};\n`;
  css += `  --nav-height-mobile: ${RESPONSIVE_CONFIG.navigation.mobile.height};\n`;
  
  // Hero variables
  css += `  --hero-min-height-desktop: ${RESPONSIVE_CONFIG.hero.desktop.minHeight};\n`;
  css += `  --hero-min-height-tablet: ${RESPONSIVE_CONFIG.hero.tablet.minHeight};\n`;
  css += `  --hero-min-height-mobile: ${RESPONSIVE_CONFIG.hero.mobile.minHeight};\n`;
  
  // Text contrast variables
  css += `  --title-shadow-desktop: ${RESPONSIVE_CONFIG.textContrast.desktop.titleShadow};\n`;
  css += `  --title-shadow-mobile: ${RESPONSIVE_CONFIG.textContrast.mobile.titleShadow};\n`;
  css += `  --text-shadow-desktop: ${RESPONSIVE_CONFIG.textContrast.desktop.textShadow};\n`;
  css += `  --text-shadow-mobile: ${RESPONSIVE_CONFIG.textContrast.mobile.textShadow};\n`;
  
  css += '}\n';
  return css;
};

export default RESPONSIVE_CONFIG;