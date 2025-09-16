/**
 * Responsive CSS Variables Injection Utility
 * Purpose: Dynamically inject responsive design variables
 */

import { RESPONSIVE_CONFIG } from '@config/responsiveConfig.js';

export const injectResponsiveVariables = () => {
  const root = document.documentElement;
  
  // Desktop variables
  const desktop = RESPONSIVE_CONFIG.buttons.desktop;
  root.style.setProperty('--btn-desktop-width', desktop.width);
  root.style.setProperty('--btn-desktop-min-height', desktop.minHeight);
  root.style.setProperty('--btn-desktop-font-size', desktop.fontSize);
  root.style.setProperty('--btn-desktop-padding', desktop.padding);
  root.style.setProperty('--btn-desktop-gap', desktop.gap);
  
  // Tablet variables
  const tablet = RESPONSIVE_CONFIG.buttons.tablet;
  root.style.setProperty('--btn-tablet-width', tablet.width);
  root.style.setProperty('--btn-tablet-min-height', tablet.minHeight);
  root.style.setProperty('--btn-tablet-font-size', tablet.fontSize);
  root.style.setProperty('--btn-tablet-padding', tablet.padding);
  root.style.setProperty('--btn-tablet-gap', tablet.gap);
  
  // Mobile variables
  const mobile = RESPONSIVE_CONFIG.buttons.mobile;
  root.style.setProperty('--btn-mobile-width', mobile.width);
  root.style.setProperty('--btn-mobile-min-height', mobile.minHeight);
  root.style.setProperty('--btn-mobile-font-size', mobile.fontSize);
  root.style.setProperty('--btn-mobile-padding', mobile.padding);
  root.style.setProperty('--btn-mobile-gap', mobile.gap);
  
  // Small mobile variables
  const smallMobile = RESPONSIVE_CONFIG.buttons.smallMobile;
  root.style.setProperty('--btn-small-mobile-width', smallMobile.width);
  root.style.setProperty('--btn-small-mobile-min-height', smallMobile.minHeight);
  root.style.setProperty('--btn-small-mobile-font-size', smallMobile.fontSize);
  root.style.setProperty('--btn-small-mobile-padding', smallMobile.padding);
  root.style.setProperty('--btn-small-mobile-gap', smallMobile.gap);
  
  console.log('🎨 Responsive button variables injected successfully');
};

// Device detection
export const getDeviceType = () => {
  const width = window.innerWidth;
  
  if (width < 480) return 'smallMobile';
  if (width < 768) return 'mobile';
  if (width < 992) return 'tablet';
  return 'desktop';
};

export default { injectResponsiveVariables, getDeviceType };