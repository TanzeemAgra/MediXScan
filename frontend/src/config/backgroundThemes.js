// Background Theme Selector - Easy switching between professional backgrounds
// This utility helps switch between different background options for testing and customization

const backgroundThemes = {
  // Clean Professional Theme (Recommended)
  clean: {
    name: "Clean Professional",
    backgroundImage: "/assets/images/medixscan-hero-clean-1600x900.png",
    description: "Clean gradient with subtle medical patterns, no text conflicts",
    overlay: "rgba(0,0,0,0.1)",
    textOverlay: "rgba(0,0,0,0.3)",
    recommended: true,
    textReadability: "excellent"
  },
  
  // Minimal Theme
  minimal: {
    name: "Minimal Dots",
    backgroundImage: "/assets/images/medixscan-hero-minimal-1600x900.png", 
    description: "Simple gradient with minimal dot pattern",
    overlay: "rgba(0,0,0,0.05)",
    textOverlay: "rgba(0,0,0,0.25)",
    recommended: true,
    textReadability: "excellent"
  },
  
  // Pure Gradient Theme
  gradient: {
    name: "Pure Gradient",
    backgroundImage: "/assets/images/medixscan-hero-gradient-1600x900.png",
    description: "Simple professional gradient, maximum text clarity",
    overlay: "rgba(0,0,0,0)",
    textOverlay: "rgba(0,0,0,0.2)",
    recommended: true,
    textReadability: "perfect"
  },
  
  // Original Branded Theme (Not recommended due to text conflicts)
  branded: {
    name: "Original Branded",
    backgroundImage: "/assets/images/medixscan-hero-1600x900.png",
    description: "Original background with integrated branding (causes text conflicts)",
    overlay: "rgba(0,0,0,0.4)",
    textOverlay: "rgba(0,0,0,0.6)",
    recommended: false,
    textReadability: "poor",
    warning: "Text conflicts with background branding elements"
  },
  
  // Legacy Theme
  legacy: {
    name: "Legacy Background",
    backgroundImage: "/assets/images/bg-03.jpg",
    description: "Original system background",
    overlay: "rgba(0,0,0,0.3)",
    textOverlay: "rgba(0,0,0,0.4)",
    recommended: false,
    textReadability: "fair"
  }
};

// Current active theme (change this to switch themes)
const ACTIVE_THEME = 'clean'; // Options: 'clean', 'minimal', 'gradient', 'branded', 'legacy'

// Get current theme configuration
export const getCurrentTheme = () => {
  const theme = backgroundThemes[ACTIVE_THEME];
  if (!theme) {
    console.warn(`Theme '${ACTIVE_THEME}' not found, falling back to 'clean'`);
    return backgroundThemes.clean;
  }
  return theme;
};

// Get all available themes
export const getAllThemes = () => backgroundThemes;

// Get recommended themes only
export const getRecommendedThemes = () => {
  return Object.entries(backgroundThemes)
    .filter(([key, theme]) => theme.recommended)
    .reduce((acc, [key, theme]) => ({ ...acc, [key]: theme }), {});
};

// Switch theme dynamically
export const switchTheme = (themeName) => {
  if (backgroundThemes[themeName]) {
    // This would typically update a state or configuration
    console.log(`Switching to theme: ${backgroundThemes[themeName].name}`);
    return backgroundThemes[themeName];
  } else {
    console.error(`Theme '${themeName}' not found`);
    return getCurrentTheme();
  }
};

// Validate theme for text readability
export const validateThemeReadability = (themeName) => {
  const theme = backgroundThemes[themeName];
  if (!theme) return false;
  
  return {
    isRecommended: theme.recommended,
    readabilityScore: theme.textReadability,
    hasWarnings: !!theme.warning,
    warning: theme.warning || null
  };
};

export default backgroundThemes;
