# Backend Configuration for Radiology Application - Soft Coding Approach
# This file contains configuration values for the Django backend

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ===========================================
# ENVIRONMENT CONFIGURATION
# ===========================================
class EnvironmentConfig:
    """Centralized environment configuration"""
    
    # Environment detection
    ENVIRONMENT = os.getenv('DJANGO_ENV', 'development')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # Server configuration
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 8000))
    
    # Database configuration
    DATABASE_URL = os.getenv('DATABASE_URL', f'sqlite:///{BASE_DIR}/db.sqlite3')
    
    # Secret key
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # CORS configuration
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5177,http://localhost:3000').split(',')
    CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'False').lower() == 'true'

# ===========================================
# API CONFIGURATION
# ===========================================
class APIConfig:
    """API endpoint and configuration management"""
    
    # API versioning
    API_VERSION = os.getenv('API_VERSION', 'v1')
    API_PREFIX = f'/api/{API_VERSION}' if API_VERSION != 'v1' else '/api'
    
    # Rate limiting
    RATE_LIMIT_ENABLED = os.getenv('RATE_LIMIT_ENABLED', 'True').lower() == 'true'
    RATE_LIMIT_REQUESTS = int(os.getenv('RATE_LIMIT_REQUESTS', 100))
    RATE_LIMIT_WINDOW = int(os.getenv('RATE_LIMIT_WINDOW', 3600))  # 1 hour
    
    # Authentication
    JWT_ENABLED = os.getenv('JWT_ENABLED', 'True').lower() == 'true'
    JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', 3600))  # 1 hour
    
    # File upload
    MAX_UPLOAD_SIZE = int(os.getenv('MAX_UPLOAD_SIZE', 10485760))  # 10MB
    ALLOWED_FILE_TYPES = os.getenv('ALLOWED_FILE_TYPES', 'pdf,jpg,jpeg,png,dcm').split(',')

# ===========================================
# ENDPOINT CONFIGURATION
# ===========================================
class EndpointConfig:
    """Centralized endpoint configuration"""
    
    # Base endpoints
    HEALTH = '/health/'
    VERSION = '/version/'
    TEST = '/test/'
    
    # Authentication endpoints
    AUTH_LOGIN = '/auth/login/'
    AUTH_LOGOUT = '/auth/logout/'
    AUTH_REGISTER = '/auth/register/'
    AUTH_REFRESH = '/auth/refresh/'
    AUTH_VERIFY = '/auth/verify/'
    
    # Data endpoints
    HISTORY = '/history/'
    DOCTORS = '/doctors/'
    PATIENTS = '/patients/'
    REPORTS = '/reports/'
    ANALYTICS = '/analytics/'
    
    # File operations
    UPLOAD = '/upload/'
    DOWNLOAD = '/download/'
    
    # Chatbot endpoints
    CHATBOT_CHAT = '/chatbot/chat/'
    CHATBOT_HISTORY = '/chatbot/history/'
    CHATBOT_CLEAR = '/chatbot/clear/'

# ===========================================
# SECURITY CONFIGURATION
# ===========================================
class SecurityConfig:
    """Security-related configuration"""
    
    # HTTPS settings
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'False').lower() == 'true'
    SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', 31536000))  # 1 year
    
    # Session security
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    CSRF_COOKIE_SECURE = os.getenv('CSRF_COOKIE_SECURE', 'False').lower() == 'true'
    
    # Content security
    X_FRAME_OPTIONS = os.getenv('X_FRAME_OPTIONS', 'DENY')
    SECURE_CONTENT_TYPE_NOSNIFF = os.getenv('SECURE_CONTENT_TYPE_NOSNIFF', 'True').lower() == 'true'

# ===========================================
# COMPLIANCE CONFIGURATION
# ===========================================
class ComplianceConfig:
    """HIPAA/GDPR compliance configuration"""
    
    # HIPAA settings
    HIPAA_ENABLED = os.getenv('HIPAA_ENABLED', 'True').lower() == 'true'
    AUDIT_LOGGING = os.getenv('AUDIT_LOGGING', 'True').lower() == 'true'
    DATA_ENCRYPTION = os.getenv('DATA_ENCRYPTION', 'True').lower() == 'true'
    
    # GDPR settings
    GDPR_ENABLED = os.getenv('GDPR_ENABLED', 'True').lower() == 'true'
    DATA_RETENTION_DAYS = int(os.getenv('DATA_RETENTION_DAYS', 365))
    
    # Privacy settings
    ANONYMIZATION_ENABLED = os.getenv('ANONYMIZATION_ENABLED', 'True').lower() == 'true'
    PSEUDONYMIZATION_KEY = os.getenv('PSEUDONYMIZATION_KEY', 'default-key')

# ===========================================
# FEATURE FLAGS
# ===========================================
class FeatureFlags:
    """Feature toggle configuration"""
    
    CHATBOT_ENABLED = os.getenv('CHATBOT_ENABLED', 'True').lower() == 'true'
    ANALYTICS_ENABLED = os.getenv('ANALYTICS_ENABLED', 'False').lower() == 'true'
    REPORTING_ENABLED = os.getenv('REPORTING_ENABLED', 'True').lower() == 'true'
    MULTI_TENANT = os.getenv('MULTI_TENANT', 'False').lower() == 'true'
    EMAIL_NOTIFICATIONS = os.getenv('EMAIL_NOTIFICATIONS', 'True').lower() == 'true'

# ===========================================
# ERROR HANDLING CONFIGURATION
# ===========================================
class ErrorConfig:
    """Error handling and logging configuration"""
    
    # Logging level
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Error reporting
    SENTRY_ENABLED = os.getenv('SENTRY_ENABLED', 'False').lower() == 'true'
    SENTRY_DSN = os.getenv('SENTRY_DSN', '')
    
    # Error messages
    ERROR_MESSAGES = {
        'VALIDATION_ERROR': 'Invalid input data provided.',
        'AUTHENTICATION_ERROR': 'Authentication credentials are invalid.',
        'AUTHORIZATION_ERROR': 'You do not have permission to perform this action.',
        'NOT_FOUND_ERROR': 'The requested resource was not found.',
        'SERVER_ERROR': 'An internal server error occurred.',
        'DATABASE_ERROR': 'Database operation failed.',
        'NETWORK_ERROR': 'Network connection failed.',
        'FILE_UPLOAD_ERROR': 'File upload failed.',
        'PROCESSING_ERROR': 'Data processing failed.',
    }

# ===========================================
# HELPER FUNCTIONS
# ===========================================
class ConfigHelpers:
    """Helper functions for configuration management"""
    
    @staticmethod
    def get_endpoint_url(endpoint_name):
        """Get full endpoint URL"""
        endpoint = getattr(EndpointConfig, endpoint_name, None)
        if endpoint:
            return f"{APIConfig.API_PREFIX}{endpoint}"
        return None
    
    @staticmethod
    def is_feature_enabled(feature_name):
        """Check if a feature is enabled"""
        return getattr(FeatureFlags, feature_name, False)
    
    @staticmethod
    def get_error_message(error_type):
        """Get error message by type"""
        return ErrorConfig.ERROR_MESSAGES.get(error_type, ErrorConfig.ERROR_MESSAGES['SERVER_ERROR'])
    
    @staticmethod
    def validate_environment():
        """Validate required environment variables"""
        required_vars = ['SECRET_KEY']
        missing = [var for var in required_vars if not os.getenv(var)]
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        
        return True

# ===========================================
# EXPORT CONFIGURATION
# ===========================================
__all__ = [
    'EnvironmentConfig',
    'APIConfig',
    'EndpointConfig',
    'SecurityConfig',
    'ComplianceConfig',
    'FeatureFlags',
    'ErrorConfig',
    'ConfigHelpers'
]
