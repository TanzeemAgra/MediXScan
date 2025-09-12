// Logo Configuration - Centralized Logo Management
// This file provides soft-coded logo configuration for easy updates and maintenance

const logoConfig = {
  // Base Configuration
  basePath: "/assets/images/",
  
  // Logo Suite - Professional MediXScan AI Branding
  logos: {
    main: {
      filename: "medixscan-logo-main.png",
      dimensions: { width: 800, height: 200 },
      aspectRatio: "4:1",
      description: "Primary logo with gradient background for general use",
      usageContexts: [
        "headers",
        "navigation bars", 
        "email signatures",
        "business cards",
        "presentations"
      ],
      colorProfile: "full-color",
      background: "transparent-with-gradient"
    },
    
    white: {
      filename: "medixscan-logo-white.png", 
      dimensions: { width: 800, height: 200 },
      aspectRatio: "4:1",
      description: "White background logo for dark themes and overlays",
      usageContexts: [
        "dark backgrounds",
        "video overlays",
        "print materials",
        "dark theme UI",
        "mobile apps dark mode"
      ],
      colorProfile: "color-on-white",
      background: "white"
    },
    
    icon: {
      filename: "medixscan-icon-512.png",
      dimensions: { width: 512, height: 512 },
      aspectRatio: "1:1", 
      description: "Square app icon for applications and social media",
      usageContexts: [
        "app icons",
        "favicons", 
        "social media avatars",
        "mobile app stores",
        "desktop shortcuts"
      ],
      colorProfile: "full-color",
      background: "professional-gradient"
    },
    
    hero: {
      filename: "medixscan-hero-1600x900.png",
      dimensions: { width: 1600, height: 900 },
      aspectRatio: "16:9",
      description: "Professional hero background with integrated branding",
      usageContexts: [
        "landing page heroes",
        "website backgrounds", 
        "presentation backdrops",
        "marketing materials",
        "social media covers"
      ],
      colorProfile: "full-color-with-text",
      background: "professional-branded"
    },
    
    favicon: {
      filename: "favicon.ico",
      dimensions: { width: 64, height: 64 },
      aspectRatio: "1:1",
      description: "Browser favicon and system icon",
      usageContexts: [
        "browser tabs",
        "bookmarks",
        "system notifications",
        "desktop shortcuts"
      ],
      colorProfile: "optimized-small",
      background: "transparent"
    }
  },
  
  // Legacy Logo Mappings (for backward compatibility)
  legacyMappings: {
    "logo-full2.png": "medixscan-logo-main.png",
    "logo-white.png": "medixscan-logo-white.png", 
    "logo.png": "medixscan-logo-main.png",
    "logo1.png": "medixscan-icon-512.png",
    "project-icon.png": "medixscan-icon-512.png",
    "bg-03.jpg": "medixscan-hero-1600x900.png"
  },
  
  // Responsive Configuration
  responsive: {
    mobile: {
      maxHeight: "35px",
      preferredLogo: "main",
      fallbackLogo: "icon"
    },
    tablet: {
      maxHeight: "40px", 
      preferredLogo: "main",
      fallbackLogo: "white"
    },
    desktop: {
      maxHeight: "50px",
      preferredLogo: "main",
      fallbackLogo: "white"
    },
    print: {
      preferredLogo: "white",
      resolution: "300dpi",
      format: "png"
    }
  },
  
  // Theme-based Logo Selection
  themeMapping: {
    light: {
      navigation: "main",
      hero: "hero", 
      footer: "white"
    },
    dark: {
      navigation: "white",
      hero: "hero",
      footer: "white"
    },
    professional: {
      navigation: "white",
      hero: "hero",
      footer: "main"
    }
  },
  
  // Brand Guidelines
  brandGuidelines: {
    minimumSizes: {
      main: { width: 200, height: 50 },
      white: { width: 200, height: 50 },
      icon: { width: 32, height: 32 },
      hero: { width: 800, height: 450 }
    },
    clearSpace: {
      main: "25% of logo height on all sides",
      icon: "10% of icon width on all sides"
    },
    colorCodes: {
      primary: "#667eea",      // Brand primary blue
      secondary: "#764ba2",    // Brand secondary purple  
      accent: "#1EBCB7",       // Brand accent teal
      neutral: "#1F2937",      // Professional dark
      white: "#FFFFFF"         // Clean white
    },
    typography: {
      primary: "Arial, sans-serif",
      weights: ["regular", "bold"],
      fallbacks: ["Helvetica", "system-ui"]
    }
  },
  
  // Performance Configuration
  optimization: {
    lazyLoading: true,
    webpSupport: true,
    compressionLevel: 85,
    cacheHeaders: "max-age=31536000", // 1 year
    cdn: {
      enabled: false,
      baseUrl: "https://cdn.medixscan.com/logos/"
    }
  }
};

// Helper Functions for Logo Management
export const getLogoPath = (logoType = 'main') => {
  const logo = logoConfig.logos[logoType];
  if (!logo) {
    console.warn(`Logo type '${logoType}' not found, falling back to 'main'`);
    return logoConfig.basePath + logoConfig.logos.main.filename;
  }
  return logoConfig.basePath + logo.filename;
};

export const getResponsiveLogo = (screenSize = 'desktop', theme = 'light') => {
  const responsiveConfig = logoConfig.responsive[screenSize];
  const themeConfig = logoConfig.themeMapping[theme];
  
  if (!responsiveConfig || !themeConfig) {
    return getLogoPath('main');
  }
  
  return getLogoPath(responsiveConfig.preferredLogo || themeConfig.navigation);
};

export const getLogoDimensions = (logoType = 'main') => {
  const logo = logoConfig.logos[logoType];
  return logo ? logo.dimensions : logoConfig.logos.main.dimensions;
};

export const getBrandColors = () => logoConfig.brandGuidelines.colorCodes;

export const validateLogoUsage = (logoType, context) => {
  const logo = logoConfig.logos[logoType];
  if (!logo) return false;
  
  return logo.usageContexts.includes(context);
};

// Legacy Support Function
export const getLegacyLogo = (legacyFilename) => {
  const modernEquivalent = logoConfig.legacyMappings[legacyFilename];
  if (modernEquivalent) {
    console.info(`Legacy logo '${legacyFilename}' mapped to '${modernEquivalent}'`);
    return logoConfig.basePath + modernEquivalent;
  }
  return logoConfig.basePath + legacyFilename; // Fallback to original
};

export default logoConfig;
