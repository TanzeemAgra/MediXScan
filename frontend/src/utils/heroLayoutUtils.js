// Hero Layout Utilities - Dynamic CSS Variable Injection
// Converts soft-coded configuration to CSS variables for responsive design

/**
 * Injects hero layout configuration as CSS custom properties
 * @param {Object} heroConfig - Hero configuration from landingPageConfig
 */
export const injectHeroLayoutVariables = (heroConfig) => {
  if (!heroConfig || typeof document === 'undefined') return;

  const root = document.documentElement;
  const { layout, design } = heroConfig;

  // Height Configuration
  if (layout?.height) {
    root.style.setProperty('--hero-height-desktop', layout.height.desktop || '70vh');
    root.style.setProperty('--hero-height-tablet', layout.height.tablet || '75vh');
    root.style.setProperty('--hero-height-mobile', layout.height.mobile || '80vh');
    root.style.setProperty('--hero-min-height', layout.height.minimum || '500px');
    root.style.setProperty('--hero-max-height', layout.height.maximum || '800px');
  }

  // Intelligent Balanced Spacing System - Mathematical Distribution
  if (layout?.spacing) {
    // Navigation Area Calculations
    const navHeight = layout.spacing.navigationHeight || '70px';
    const navBuffer = layout.spacing.navigationBuffer || '20px';
    const contentTop = layout.spacing.contentAreaTop || '30px';
    
    // Calculate total navigation clearance
    root.style.setProperty('--nav-total-height', navHeight);
    root.style.setProperty('--nav-clearance', `calc(${navHeight} + ${navBuffer} + ${contentTop})`);
    
    // Content Distribution Percentages
    if (layout.spacing.contentDistribution) {
      root.style.setProperty('--content-top-area', layout.spacing.contentDistribution.topArea || '15%');
      root.style.setProperty('--content-middle-area', layout.spacing.contentDistribution.middleArea || '60%');
      root.style.setProperty('--content-bottom-area', layout.spacing.contentDistribution.bottomArea || '25%');
    }
    
    // Internal Content Spacing
    if (layout.spacing.internal) {
      root.style.setProperty('--element-spacing', layout.spacing.internal.elementSpacing || '1.5rem');
      root.style.setProperty('--title-spacing', layout.spacing.internal.titleSpacing || '2rem');
      root.style.setProperty('--description-spacing', layout.spacing.internal.descriptionSpacing || '2.5rem');
      root.style.setProperty('--cta-area-spacing', layout.spacing.internal.ctaAreaSpacing || '2rem');
    }
    
    // External Section Spacing
    if (layout.spacing.external) {
      root.style.setProperty('--section-gap', layout.spacing.external.sectionGap || '4rem');
      root.style.setProperty('--bottom-margin', layout.spacing.external.bottomMargin || '2rem');
    }
    
    // Responsive Balanced Spacing Variables
    if (layout.spacing.mobile) {
      // Mobile navigation calculations
      const mobileNavHeight = layout.spacing.mobile.navigationHeight || '60px';
      const mobileNavBuffer = layout.spacing.mobile.navigationBuffer || '15px';
      const mobileContentTop = layout.spacing.mobile.contentAreaTop || '20px';
      
      root.style.setProperty('--nav-total-height-mobile', mobileNavHeight);
      root.style.setProperty('--nav-clearance-mobile', `calc(${mobileNavHeight} + ${mobileNavBuffer} + ${mobileContentTop})`);
      
      // Mobile content distribution
      if (layout.spacing.mobile.contentDistribution) {
        root.style.setProperty('--content-top-area-mobile', layout.spacing.mobile.contentDistribution.topArea || '12%');
        root.style.setProperty('--content-middle-area-mobile', layout.spacing.mobile.contentDistribution.middleArea || '65%');
        root.style.setProperty('--content-bottom-area-mobile', layout.spacing.mobile.contentDistribution.bottomArea || '23%');
      }
      
      // Mobile internal spacing
      if (layout.spacing.mobile.internal) {
        root.style.setProperty('--element-spacing-mobile', layout.spacing.mobile.internal.elementSpacing || '1rem');
        root.style.setProperty('--title-spacing-mobile', layout.spacing.mobile.internal.titleSpacing || '1.5rem');
        root.style.setProperty('--description-spacing-mobile', layout.spacing.mobile.internal.descriptionSpacing || '2rem');
        root.style.setProperty('--cta-area-spacing-mobile', layout.spacing.mobile.internal.ctaAreaSpacing || '1.5rem');
      }
    }
    
    if (layout.spacing.tablet) {
      // Tablet navigation calculations
      const tabletNavHeight = layout.spacing.tablet.navigationHeight || '65px';
      const tabletNavBuffer = layout.spacing.tablet.navigationBuffer || '18px';
      const tabletContentTop = layout.spacing.tablet.contentAreaTop || '25px';
      
      root.style.setProperty('--nav-total-height-tablet', tabletNavHeight);
      root.style.setProperty('--nav-clearance-tablet', `calc(${tabletNavHeight} + ${tabletNavBuffer} + ${tabletContentTop})`);
      
      // Tablet content distribution
      if (layout.spacing.tablet.contentDistribution) {
        root.style.setProperty('--content-top-area-tablet', layout.spacing.tablet.contentDistribution.topArea || '13%');
        root.style.setProperty('--content-middle-area-tablet', layout.spacing.tablet.contentDistribution.middleArea || '62%');
        root.style.setProperty('--content-bottom-area-tablet', layout.spacing.tablet.contentDistribution.bottomArea || '25%');
      }
      
      // Tablet internal spacing
      if (layout.spacing.tablet.internal) {
        root.style.setProperty('--element-spacing-tablet', layout.spacing.tablet.internal.elementSpacing || '1.25rem');
        root.style.setProperty('--title-spacing-tablet', layout.spacing.tablet.internal.titleSpacing || '1.75rem');
        root.style.setProperty('--description-spacing-tablet', layout.spacing.tablet.internal.descriptionSpacing || '2.25rem');
        root.style.setProperty('--cta-area-spacing-tablet', layout.spacing.tablet.internal.ctaAreaSpacing || '1.75rem');
      }
    }
  }

  // Design Configuration
  if (design) {
    root.style.setProperty('--hero-accent-color', design.accentColor || '#1EBCB7');
    root.style.setProperty('--hero-text-color', design.textColor || '#ffffff');
    
    if (design.backgroundProperties) {
      root.style.setProperty('--hero-overlay', design.backgroundProperties.overlay || 'rgba(0,0,0,0.1)');
      root.style.setProperty('--hero-text-overlay', design.backgroundProperties.textArea?.overlay || 'rgba(0,0,0,0.3)');
      root.style.setProperty('--hero-text-blur', design.backgroundProperties.textArea?.backdrop?.replace('blur(', '').replace(')', '') || '2px');
      root.style.setProperty('--hero-text-padding', design.backgroundProperties.textArea?.padding || '2rem');
    }
  }

  console.log('✅ Hero layout CSS variables injected successfully');
};

/**
 * Injects navigation configuration as CSS custom properties
 * @param {Object} navigationConfig - Navigation configuration from landingPageConfig
 */
export const injectNavigationVariables = (navigationConfig) => {
  if (!navigationConfig || typeof document === 'undefined') return;

  const root = document.documentElement;

  // Navigation dimensions
  if (navigationConfig.height) {
    root.style.setProperty('--navigation-height', navigationConfig.height);
  }
  
  if (navigationConfig.padding) {
    root.style.setProperty('--navigation-padding', navigationConfig.padding);
  }

  if (navigationConfig.marginBottom) {
    root.style.setProperty('--navigation-margin-bottom', navigationConfig.marginBottom);
  }

  // Logo spacing
  if (navigationConfig.logoSpacing) {
    root.style.setProperty('--navigation-logo-spacing', navigationConfig.logoSpacing);
  }

  // Item spacing
  if (navigationConfig.itemSpacing) {
    root.style.setProperty('--navigation-item-spacing', navigationConfig.itemSpacing);
  }

  console.log('✅ Navigation CSS variables injected successfully');
};

/**
 * Gets responsive hero height based on screen size
 * @param {Object} heroConfig - Hero configuration
 * @param {string} screenSize - 'mobile', 'tablet', or 'desktop'
 * @returns {string} CSS height value
 */
export const getResponsiveHeroHeight = (heroConfig, screenSize = 'desktop') => {
  const layout = heroConfig?.layout;
  if (!layout?.height) return '70vh';

  const heights = {
    mobile: layout.height.mobile || '80vh',
    tablet: layout.height.tablet || '75vh',
    desktop: layout.height.desktop || '70vh'
  };

  return heights[screenSize] || heights.desktop;
};

/**
 * Calculates optimal hero height based on content and screen size
 * @param {Object} heroConfig - Hero configuration
 * @param {number} contentHeight - Estimated content height in pixels
 * @returns {string} Optimal CSS height value
 */
export const calculateOptimalHeroHeight = (heroConfig, contentHeight = 400) => {
  const layout = heroConfig?.layout;
  const minHeight = parseInt(layout?.height?.minimum || '500px');
  const maxHeight = parseInt(layout?.height?.maximum || '800px');
  
  // Add padding and spacing
  const totalPadding = 160; // top + bottom padding
  const optimalHeight = contentHeight + totalPadding;
  
  // Clamp between min and max
  const clampedHeight = Math.max(minHeight, Math.min(maxHeight, optimalHeight));
  
  return `${clampedHeight}px`;
};

/**
 * Detects current screen size category
 * @returns {string} 'mobile', 'tablet', or 'desktop'
 */
export const detectScreenSize = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Applies responsive hero styling based on current screen size
 * @param {Object} heroConfig - Hero configuration
 * @param {HTMLElement} heroElement - Hero section element
 */
export const applyResponsiveHeroStyling = (heroConfig, heroElement) => {
  if (!heroElement || !heroConfig) return;

  const screenSize = detectScreenSize();
  const height = getResponsiveHeroHeight(heroConfig, screenSize);
  const layout = heroConfig.layout;

  // Apply height
  heroElement.style.height = height;
  heroElement.style.minHeight = layout?.height?.minimum || '500px';
  heroElement.style.maxHeight = layout?.height?.maximum || '800px';

  // Apply spacing
  heroElement.style.paddingTop = layout?.spacing?.top || '80px';
  heroElement.style.paddingBottom = layout?.spacing?.bottom || '60px';
  heroElement.style.marginBottom = layout?.spacing?.sectionGap || '40px';

  console.log(`✅ Applied ${screenSize} hero styling: ${height}`);
};

/**
 * Creates a ResizeObserver to handle dynamic hero resizing
 * @param {Object} heroConfig - Hero configuration
 * @param {HTMLElement} heroElement - Hero section element
 * @returns {ResizeObserver} Resize observer instance
 */
export const createHeroResizeObserver = (heroConfig, heroElement) => {
  if (!window.ResizeObserver || !heroElement) return null;

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width } = entry.contentRect;
      
      // Update CSS variables based on new width
      const screenSize = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      const height = getResponsiveHeroHeight(heroConfig, screenSize);
      
      heroElement.style.height = height;
      
      // Log for debugging
      console.log(`📱 Hero resized for ${screenSize}: ${height}`);
    }
  });

  observer.observe(heroElement);
  return observer;
};

/**
 * Hook for React components to use hero layout utilities
 * @param {Object} heroConfig - Hero configuration
 * @returns {Object} Utility functions and values
 */
export const useHeroLayout = (heroConfig) => {
  const [screenSize, setScreenSize] = React.useState('desktop');
  const [heroHeight, setHeroHeight] = React.useState('70vh');

  React.useEffect(() => {
    // Inject CSS variables on mount
    injectHeroLayoutVariables(heroConfig);

    // Set up resize listener
    const handleResize = () => {
      const newScreenSize = detectScreenSize();
      const newHeight = getResponsiveHeroHeight(heroConfig, newScreenSize);
      
      setScreenSize(newScreenSize);
      setHeroHeight(newHeight);
    };

    // Initial call
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [heroConfig]);

  return {
    screenSize,
    heroHeight,
    injectVariables: () => injectHeroLayoutVariables(heroConfig),
    applyResponsiveStyling: (element) => applyResponsiveHeroStyling(heroConfig, element)
  };
};

// Default export for ease of use
export default {
  injectHeroLayoutVariables,
  getResponsiveHeroHeight,
  calculateOptimalHeroHeight,
  detectScreenSize,
  applyResponsiveHeroStyling,
  createHeroResizeObserver,
  useHeroLayout
};
