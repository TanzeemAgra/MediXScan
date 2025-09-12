// Soft-coded configuration management for MediXscan
class Config {
  // API Configuration
  static get API_BASE_URL() {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  }
  
  static get API_TIMEOUT() {
    return parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;
  }
  
  static get API_RETRY_ATTEMPTS() {
    return parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3;
  }

  // AI Features Configuration
  static get AI_FEATURES_ENABLED() {
    return import.meta.env.VITE_AI_FEATURES_ENABLED === 'true';
  }
  
  static get CHATBOT_ENABLED() {
    return import.meta.env.VITE_CHATBOT_ENABLED === 'true';
  }
  
  static get REAL_TIME_ANALYSIS() {
    return import.meta.env.VITE_REAL_TIME_ANALYSIS === 'true';
  }
  
  static get AUTO_SAVE_REPORTS() {
    return import.meta.env.VITE_AUTO_SAVE_REPORTS === 'true';
  }
  
  static get VOICE_INPUT_ENABLED() {
    return import.meta.env.VITE_VOICE_INPUT_ENABLED === 'true';
  }

  // Radiology Specific Features
  static get IMAGE_UPLOAD_ENABLED() {
    return import.meta.env.VITE_IMAGE_UPLOAD_ENABLED === 'true';
  }
  
  static get DICOM_SUPPORT() {
    return import.meta.env.VITE_DICOM_SUPPORT === 'true';
  }
  
  static get MULTI_MODAL_ANALYSIS() {
    return import.meta.env.VITE_MULTI_MODAL_ANALYSIS === 'true';
  }
  
  static get VISUALIZATION_3D() {
    return import.meta.env.VITE_3D_VISUALIZATION === 'true';
  }
  
  static get REPORT_TEMPLATES() {
    return import.meta.env.VITE_REPORT_TEMPLATES === 'true';
  }

  // AI Analysis Configuration
  static get AI_CONFIDENCE_THRESHOLD() {
    return parseFloat(import.meta.env.VITE_AI_CONFIDENCE_THRESHOLD) || 0.8;
  }
  
  static get ERROR_DETECTION_TYPES() {
    return import.meta.env.VITE_ERROR_DETECTION_TYPES?.split(',') || 
           ['medical', 'typographical', 'misspelled', 'grammatical', 'formatting'];
  }
  
  static get AUTO_CORRECTION_ENABLED() {
    return import.meta.env.VITE_AUTO_CORRECTION_ENABLED === 'true';
  }
  
  static get SEVERITY_LEVELS() {
    return import.meta.env.VITE_SEVERITY_LEVELS?.split(',') || 
           ['low', 'medium', 'high', 'critical'];
  }

  // File Upload Configuration
  static get MAX_FILE_SIZE() {
    const size = import.meta.env.VITE_MAX_FILE_SIZE || '50MB';
    return this.parseFileSize(size);
  }
  
  static get SUPPORTED_FORMATS() {
    return import.meta.env.VITE_SUPPORTED_FORMATS?.split(',') || 
           ['txt', 'pdf', 'doc', 'docx', 'jpg', 'png', 'dcm', 'dicom'];
  }
  
  static get CHUNK_UPLOAD_ENABLED() {
    return import.meta.env.VITE_CHUNK_UPLOAD_ENABLED === 'true';
  }
  
  static get PROGRESS_TRACKING() {
    return import.meta.env.VITE_PROGRESS_TRACKING === 'true';
  }

  // Dashboard & Analytics
  static get ANALYTICS_ENABLED() {
    return import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
  }
  
  static get REAL_TIME_METRICS() {
    return import.meta.env.VITE_REAL_TIME_METRICS === 'true';
  }
  
  static get CHART_ANIMATIONS() {
    return import.meta.env.VITE_CHART_ANIMATIONS === 'true';
  }
  
  static get EXPORT_FORMATS() {
    return import.meta.env.VITE_EXPORT_FORMATS?.split(',') || 
           ['pdf', 'excel', 'csv'];
  }

  // Notification System
  static get NOTIFICATIONS_ENABLED() {
    return import.meta.env.VITE_NOTIFICATIONS_ENABLED === 'true';
  }
  
  static get PUSH_NOTIFICATIONS() {
    return import.meta.env.VITE_PUSH_NOTIFICATIONS === 'true';
  }
  
  static get EMAIL_NOTIFICATIONS() {
    return import.meta.env.VITE_EMAIL_NOTIFICATIONS === 'true';
  }
  
  static get SOUND_ALERTS() {
    return import.meta.env.VITE_SOUND_ALERTS === 'true';
  }

  // Security & Privacy
  static get DATA_ENCRYPTION() {
    return import.meta.env.VITE_DATA_ENCRYPTION === 'true';
  }
  
  static get SESSION_TIMEOUT() {
    return parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // 1 hour
  }
  
  static get AUTO_LOGOUT_WARNING() {
    return parseInt(import.meta.env.VITE_AUTO_LOGOUT_WARNING) || 300000; // 5 minutes
  }
  
  static get AUDIT_LOGGING() {
    return import.meta.env.VITE_AUDIT_LOGGING === 'true';
  }

  // UI/UX Configuration
  static get THEME_MODE() {
    return import.meta.env.VITE_THEME_MODE || 'light';
  }
  
  static get PRIMARY_COLOR() {
    return import.meta.env.VITE_PRIMARY_COLOR || '#2196f3';
  }
  
  static get ACCENT_COLOR() {
    return import.meta.env.VITE_ACCENT_COLOR || '#1976d2';
  }
  
  static get ANIMATION_SPEED() {
    return import.meta.env.VITE_ANIMATION_SPEED || '300ms';
  }
  
  static get SIDEBAR_COLLAPSED() {
    return import.meta.env.VITE_SIDEBAR_COLLAPSED === 'true';
  }

  // Development Features
  static get DEBUG_MODE() {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  }
  
  static get MOCK_DATA() {
    return import.meta.env.VITE_MOCK_DATA === 'true';
  }
  
  static get API_LOGGING() {
    return import.meta.env.VITE_API_LOGGING === 'true';
  }
  
  static get PERFORMANCE_MONITORING() {
    return import.meta.env.VITE_PERFORMANCE_MONITORING === 'true';
  }

  // Deployment Configuration
  static get ENVIRONMENT() {
    return import.meta.env.VITE_ENVIRONMENT || 'development';
  }
  
  static get VERSION() {
    return import.meta.env.VITE_VERSION || '1.0.0';
  }
  
  static get BUILD_DATE() {
    return import.meta.env.VITE_BUILD_DATE || new Date().toISOString();
  }

  // Medical Compliance
  static get HIPAA_COMPLIANCE() {
    return import.meta.env.VITE_HIPAA_COMPLIANCE === 'true';
  }
  
  static get GDPR_COMPLIANCE() {
    return import.meta.env.VITE_GDPR_COMPLIANCE === 'true';
  }
  
  static get DATA_RETENTION_DAYS() {
    return parseInt(import.meta.env.VITE_DATA_RETENTION_DAYS) || 2555; // 7 years
  }
  
  static get ANONYMIZATION_LEVEL() {
    return import.meta.env.VITE_ANONYMIZATION_LEVEL || 'high';
  }

  // Utility Methods
  static parseFileSize(sizeStr) {
    const units = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3 };
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) return 50 * 1024 * 1024; // Default 50MB
    return parseFloat(match[1]) * units[match[2].toUpperCase()];
  }

  static isDevelopment() {
    return this.ENVIRONMENT === 'development';
  }

  static isProduction() {
    return this.ENVIRONMENT === 'production';
  }

  static getFeatureFlags() {
    return {
      aiFeatures: this.AI_FEATURES_ENABLED,
      chatbot: this.CHATBOT_ENABLED,
      realTimeAnalysis: this.REAL_TIME_ANALYSIS,
      autoSave: this.AUTO_SAVE_REPORTS,
      voiceInput: this.VOICE_INPUT_ENABLED,
      imageUpload: this.IMAGE_UPLOAD_ENABLED,
      dicomSupport: this.DICOM_SUPPORT,
      multiModal: this.MULTI_MODAL_ANALYSIS,
      visualization3D: this.VISUALIZATION_3D,
      reportTemplates: this.REPORT_TEMPLATES,
      analytics: this.ANALYTICS_ENABLED,
      notifications: this.NOTIFICATIONS_ENABLED,
      encryption: this.DATA_ENCRYPTION,
    };
  }

  static logConfig() {
    if (this.DEBUG_MODE) {
      console.log('🔧 MediXscan Configuration:', {
        environment: this.ENVIRONMENT,
        version: this.VERSION,
        apiUrl: this.API_BASE_URL,
        features: this.getFeatureFlags(),
        compliance: {
          hipaa: this.HIPAA_COMPLIANCE,
          gdpr: this.GDPR_COMPLIANCE,
        }
      });
    }
  }
}

// Auto-log configuration in development
if (Config.isDevelopment()) {
  Config.logConfig();
}

export default Config;
