// Enhanced Responsive Design Configuration
// Comprehensive soft-coded responsive system for all screen sizes with button visibility fixes

export const RESPONSIVE_CONFIG = {
  // Enhanced Breakpoints for different device sizes
  breakpoints: {
    xs: '320px',    // Small mobile
    sm: '480px',    // Large mobile
    md: '768px',    // Tablet
    lg: '992px',    // Desktop
    xl: '1200px',   // Large desktop
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

  // Enhanced Button Configuration - Fixes Watch Demo button disappearing
  buttons: {
    desktop: {
      layout: 'horizontal',
      width: 'auto',
      minWidth: '180px',
      maxWidth: '250px',
      minHeight: '48px',
      fontSize: '1.1rem',
      padding: '12px 24px',
      gap: '16px',
      borderRadius: '12px',
      visibility: 'always',
      flexWrap: 'wrap'
    },
    tablet: {
      layout: 'horizontal-stacked',
      width: 'auto', 
      minWidth: '160px',
      maxWidth: '220px',
      minHeight: '46px',
      fontSize: '1rem',
      padding: '11px 22px',
      gap: '14px',
      borderRadius: '10px',
      visibility: 'always',
      flexWrap: 'wrap'
    },
    mobile: {
      layout: 'vertical-centered',
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%', 
      minHeight: '52px', // Larger for touch
      fontSize: '1.05rem',
      padding: '14px 20px',
      gap: '12px',
      borderRadius: '8px',
      visibility: 'always',
      flexWrap: 'nowrap'
    },
    smallMobile: {
      layout: 'vertical-full',
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: '56px', // Extra large for small screens
      fontSize: '1.1rem',
      padding: '16px 18px',
      gap: '15px',
      borderRadius: '8px',
      visibility: 'always',
      flexWrap: 'nowrap'
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