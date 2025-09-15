// Smart API Configuration for Custom Domain Support
// This handles proper API URL selection and fallback mechanisms

export const SMART_API_CONFIG = {
  // Production API URLs (prioritized order)
  PRODUCTION_APIS: [
    'https://api.rugrel.in/api',                            // Custom domain (primary)
    'https://medixscan-production.up.railway.app/api',     // Railway direct (fallback)
  ],
  
  // Development API URLs
  DEVELOPMENT_APIS: [
    'http://localhost:8000/api',                           // Local development
    'https://medixscan-production.up.railway.app/api',    // Development against production
  ],
  
  // Domain-specific configuration
  DOMAIN_CONFIG: {
    'www.rugrel.in': {
      apiUrl: 'https://api.rugrel.in/api',
      backupUrl: 'https://medixscan-production.up.railway.app/api',
      corsEnabled: true,
      customDomain: true
    },
    'rugrel.in': {
      apiUrl: 'https://api.rugrel.in/api', 
      backupUrl: 'https://medixscan-production.up.railway.app/api',
      corsEnabled: true,
      customDomain: true
    },
    'medixscan.vercel.app': {
      apiUrl: 'https://medixscan-production.up.railway.app/api',
      backupUrl: 'https://api.rugrel.in/api',
      corsEnabled: true,
      customDomain: false
    },
    'localhost': {
      apiUrl: 'http://localhost:8000/api',
      backupUrl: 'https://medixscan-production.up.railway.app/api',
      corsEnabled: false,
      customDomain: false
    }
  },
  
  // API Health Check Configuration
  HEALTH_CHECK: {
    enabled: true,
    timeout: 3000,
    retryAttempts: 2,
    endpoints: {
      ping: '/health/',
      status: '/api/health/',
      simple: '/api/auth/check/'
    }
  },
  
  // Fallback Strategy
  FALLBACK_STRATEGY: {
    enableAutoFallback: true,
    fallbackDelay: 2000,
    maxFallbackAttempts: 3,
    healthCheckBeforeFallback: true
  }
};

// Smart API URL Detection
export class SmartAPIManager {
  constructor() {
    this.currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    this.isProduction = import.meta.env.PROD;
    this.isDevelopment = import.meta.env.DEV;
    this.primaryApiUrl = null;
    this.fallbackApiUrl = null;
    this.healthyApis = new Set();
    
    this.initializeAPIUrls();
  }
  
  initializeAPIUrls() {
    console.log(`🌐 Initializing Smart API for domain: ${this.currentDomain}`);
    
    // Get domain-specific configuration
    const domainConfig = SMART_API_CONFIG.DOMAIN_CONFIG[this.currentDomain];
    
    if (domainConfig) {
      this.primaryApiUrl = domainConfig.apiUrl;
      this.fallbackApiUrl = domainConfig.backupUrl;
      console.log(`✅ Domain config found - Primary: ${this.primaryApiUrl}`);
    } else {
      // Fallback to environment-based selection
      if (this.isProduction) {
        this.primaryApiUrl = SMART_API_CONFIG.PRODUCTION_APIS[0];
        this.fallbackApiUrl = SMART_API_CONFIG.PRODUCTION_APIS[1];
      } else {
        this.primaryApiUrl = SMART_API_CONFIG.DEVELOPMENT_APIS[0];
        this.fallbackApiUrl = SMART_API_CONFIG.DEVELOPMENT_APIS[1];
      }
      console.log(`⚠️ No domain config, using environment - Primary: ${this.primaryApiUrl}`);
    }
  }
  
  // Get the correct API base URL
  getAPIBaseURL() {
    // Environment variable override (highest priority)
    const envApiUrl = import.meta.env.VITE_API_BASE_URL;
    if (envApiUrl && envApiUrl.trim() && !envApiUrl.includes(',')) {
      console.log(`🔧 Using environment API URL: ${envApiUrl}`);
      return envApiUrl;
    }
    
    // Use smart detection
    const apiUrl = this.primaryApiUrl || 'https://medixscan-production.up.railway.app/api';
    console.log(`🧠 Smart API selection: ${apiUrl}`);
    return apiUrl;
  }
  
  // Get fallback API URL
  getFallbackAPIURL() {
    return this.fallbackApiUrl || 'https://medixscan-production.up.railway.app/api';
  }
  
  // Health check for API endpoint
  async checkAPIHealth(apiUrl) {
    const { HEALTH_CHECK } = SMART_API_CONFIG;
    
    if (!HEALTH_CHECK.enabled) {
      return true; // Assume healthy if health checks disabled
    }
    
    try {
      console.log(`🏥 Health checking: ${apiUrl}`);
      
      // Try multiple health check endpoints
      for (const endpoint of Object.values(HEALTH_CHECK.endpoints)) {
        try {
          const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
            timeout: HEALTH_CHECK.timeout,
            signal: AbortSignal.timeout(HEALTH_CHECK.timeout)
          });
          
          if (response.ok) {
            console.log(`✅ API healthy via ${endpoint}: ${apiUrl}`);
            this.healthyApis.add(apiUrl);
            return true;
          }
        } catch (endpointError) {
          console.log(`⚠️ Health check failed for ${endpoint}:`, endpointError.message);
          continue;
        }
      }
      
      return false;
    } catch (error) {
      console.log(`❌ Health check failed for ${apiUrl}:`, error.message);
      this.healthyApis.delete(apiUrl);
      return false;
    }
  }
  
  // Smart API selection with health checks
  async getHealthyAPIURL() {
    const primaryUrl = this.getAPIBaseURL();
    const fallbackUrl = this.getFallbackAPIURL();
    
    // Check primary API health
    if (await this.checkAPIHealth(primaryUrl)) {
      return primaryUrl;
    }
    
    // Fallback to secondary API
    console.log(`🔄 Primary API unhealthy, trying fallback: ${fallbackUrl}`);
    if (await this.checkAPIHealth(fallbackUrl)) {
      return fallbackUrl;
    }
    
    // If both fail, return primary (let axios handle the error)
    console.log(`⚠️ Both APIs appear unhealthy, using primary: ${primaryUrl}`);
    return primaryUrl;
  }
  
  // Get current domain configuration
  getDomainConfig() {
    return SMART_API_CONFIG.DOMAIN_CONFIG[this.currentDomain] || {
      apiUrl: this.getAPIBaseURL(),
      backupUrl: this.getFallbackAPIURL(),
      corsEnabled: true,
      customDomain: false
    };
  }
}

// Create singleton instance
export const smartAPIManager = new SmartAPIManager();

// Export utility functions
export const getSmartAPIURL = () => smartAPIManager.getAPIBaseURL();
export const getSmartFallbackURL = () => smartAPIManager.getFallbackAPIURL();
export const getDomainConfig = () => smartAPIManager.getDomainConfig();

// Enhanced environment configuration with smart API integration
export const ENHANCED_ENV_CONFIG = {
  // Smart API URL (replaces simple API_BASE_URL)
  API_BASE_URL: getSmartAPIURL(),
  FALLBACK_API_URL: getSmartFallbackURL(),
  
  // Domain information
  CURRENT_DOMAIN: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  DOMAIN_CONFIG: getDomainConfig(),
  
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isCustomDomain: getDomainConfig().customDomain,
  
  // Debug information
  DEBUG_INFO: {
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
    primaryAPI: getSmartAPIURL(),
    fallbackAPI: getSmartFallbackURL(),
    envApiUrl: import.meta.env.VITE_API_BASE_URL,
    isProduction: import.meta.env.PROD
  }
};

export default {
  SMART_API_CONFIG,
  SmartAPIManager,
  smartAPIManager,
  ENHANCED_ENV_CONFIG
};