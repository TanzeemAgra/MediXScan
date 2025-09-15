# ================================
# ENVIRONMENT CONFIGURATION MANAGEMENT
# ================================
# This module provides soft-coded configuration management for different environments
# Railway Production, Vercel Frontend, and Local Development

import os
from pathlib import Path

class EnvironmentConfig:
    """
    Soft-coded environment configuration with automatic environment detection
    and secure defaults for deployment on Railway and Vercel
    """
    
    def __init__(self):
        self.environment = self.detect_environment()
        self.load_environment_file()
        
    def detect_environment(self):
        """Automatically detect the current environment"""
        if os.getenv('RAILWAY_ENVIRONMENT'):
            return 'railway_production'
        elif os.getenv('VERCEL'):
            return 'vercel_production'
        elif os.getenv('ENVIRONMENT') == 'development':
            return 'development'
        else:
            return 'production'
    
    def load_environment_file(self):
        """Load appropriate environment file based on detected environment"""
        base_dir = Path(__file__).parent
        
        env_files = {
            'railway_production': base_dir / '.env.production',
            'vercel_production': base_dir / '.env.production', 
            'development': base_dir / '.env.development',
            'production': base_dir / '.env.production'
        }
        
        env_file = env_files.get(self.environment)
        
        if env_file and env_file.exists():
            from dotenv import load_dotenv
            load_dotenv(env_file)
        
    @property
    def database_config(self):
        """Get database configuration with Railway PostgreSQL support"""
        if self.environment == 'railway_production':
            return {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('PGDATABASE'),
                'USER': os.getenv('PGUSER'),
                'PASSWORD': os.getenv('PGPASSWORD'),
                'HOST': os.getenv('PGHOST'),
                'PORT': os.getenv('PGPORT', '5432'),
                'OPTIONS': {
                    'sslmode': 'require',
                }
            }
        else:
            # For development, use SQLite if DB_NAME ends with .sqlite3
            db_name = os.getenv('DB_NAME', 'radiology')
            if db_name.endswith('.sqlite3'):
                return {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': str(Path(__file__).parent / db_name),
                }
            else:
                return {
                    'ENGINE': 'django.db.backends.postgresql',
                    'NAME': db_name,
                    'USER': os.getenv('DB_USER', 'postgres'),
                    'PASSWORD': os.getenv('DB_PASSWORD'),
                    'HOST': os.getenv('DB_HOST', 'localhost'),
                    'PORT': os.getenv('DB_PORT', '5432'),
                }
    
    @property
    def security_config(self):
        """Get security configuration appropriate for environment"""
        is_production = self.environment in ['railway_production', 'vercel_production', 'production']
        
        return {
            'SECRET_KEY': os.getenv('SECRET_KEY', self.generate_secret_key()),
            'DEBUG': not is_production,
            'ALLOWED_HOSTS': self.get_allowed_hosts(),
            'SECURE_SSL_REDIRECT': False,  # Railway handles SSL termination
            'SECURE_PROXY_SSL_HEADER': ('HTTP_X_FORWARDED_PROTO', 'https') if self.environment == 'railway_production' else None,
            'SECURE_HSTS_SECONDS': 31536000 if is_production and self.environment != 'railway_production' else 0,
            'SECURE_HSTS_INCLUDE_SUBDOMAINS': is_production and self.environment != 'railway_production',
            'SECURE_HSTS_PRELOAD': is_production and self.environment != 'railway_production',
            'SESSION_COOKIE_SECURE': is_production,
            'CSRF_COOKIE_SECURE': is_production,
        }
    
    @property
    def cors_config(self):
        """Get CORS configuration for frontend integration"""
        if self.environment == 'railway_production':
            return {
                'CORS_ALLOWED_ORIGINS': self.get_cors_origins(),
                'CORS_ALLOW_CREDENTIALS': True,
                'CORS_ALLOW_ALL_ORIGINS': False,
            }
        else:
            return {
                'CORS_ALLOWED_ORIGINS': [
                    'http://localhost:3000',
                    'http://localhost:5175',
                    'http://127.0.0.1:3000',
                    'http://127.0.0.1:5175'
                ],
                'CORS_ALLOW_CREDENTIALS': True,
                'CORS_ALLOW_ALL_ORIGINS': False,
            }
    
    @property
    def openai_config(self):
        """Get OpenAI API configuration"""
        return {
            'API_KEY': os.getenv('OPENAI_API_KEY'),
            'MODEL': os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
            'MAX_TOKENS': int(os.getenv('OPENAI_MAX_TOKENS', '1000')),
        }
    
    @property
    def email_config(self):
        """Get email configuration"""
        if self.environment == 'development':
            return {
                'EMAIL_BACKEND': 'django.core.mail.backends.console.EmailBackend'
            }
        else:
            return {
                'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
                'EMAIL_HOST': os.getenv('EMAIL_HOST', 'smtp.gmail.com'),
                'EMAIL_PORT': int(os.getenv('EMAIL_PORT', '587')),
                'EMAIL_USE_TLS': True,
                'EMAIL_HOST_USER': os.getenv('EMAIL_HOST_USER'),
                'EMAIL_HOST_PASSWORD': os.getenv('EMAIL_HOST_PASSWORD'),
            }
    
    @property
    def aws_config(self):
        """Get AWS S3 configuration if enabled"""
        use_s3 = os.getenv('USE_S3', 'False').lower() == 'true'
        
        if use_s3:
            return {
                'AWS_ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
                'AWS_SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY'),
                'AWS_STORAGE_BUCKET_NAME': os.getenv('AWS_STORAGE_BUCKET_NAME'),
                'AWS_S3_REGION_NAME': os.getenv('AWS_S3_REGION_NAME', 'us-east-1'),
                'AWS_S3_CUSTOM_DOMAIN': os.getenv('AWS_S3_CUSTOM_DOMAIN'),
            }
        return None
    
    @property
    def logging_config(self):
        """Get logging configuration"""
        return {
            'LOG_LEVEL': os.getenv('LOG_LEVEL', 'INFO'),
            'ENABLE_SQL_LOGGING': os.getenv('ENABLE_SQL_LOGGING', 'False').lower() == 'true',
        }
    
    def get_allowed_hosts(self):
        """Get allowed hosts based on environment"""
        hosts_string = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1')
        hosts = [host.strip() for host in hosts_string.split(',')]
        
        if self.environment == 'railway_production':
            # Add Railway domains
            hosts.extend([
                '.railway.app',
                '.up.railway.app',
                'medixscan-production.up.railway.app'
            ])
        
        return hosts
    
    def get_cors_origins(self):
        """Get CORS origins based on environment"""
        origins_string = os.getenv('CORS_ORIGINS', '')
        
        if origins_string:
            return [origin.strip() for origin in origins_string.split(',')]
        
        # Default production origins
        return [
            'https://medixscan.vercel.app',  # Replace with actual Vercel URL when deployed
            'https://*.vercel.app'
        ]
    
    def generate_secret_key(self):
        """Generate a secure secret key for Django"""
        import secrets
        import string
        
        alphabet = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
        return ''.join(secrets.choice(alphabet) for i in range(50))
    
    def validate_config(self):
        """Validate that all required configuration is present"""
        errors = []
        
        # Check required environment variables
        required_vars = {
            'SECRET_KEY': 'Django secret key',
            'OPENAI_API_KEY': 'OpenAI API key',
        }
        
        if self.environment != 'development':
            required_vars.update({
                'DB_PASSWORD': 'Database password',
            })
        
        for var, description in required_vars.items():
            if not os.getenv(var):
                errors.append(f"Missing required environment variable: {var} ({description})")
        
        return errors
    
    def get_deployment_info(self):
        """Get deployment information for debugging"""
        return {
            'environment': self.environment,
            'debug': self.security_config['DEBUG'],
            'database_engine': self.database_config['ENGINE'],
            'allowed_hosts': self.get_allowed_hosts(),
            'cors_origins': self.cors_config['CORS_ALLOWED_ORIGINS'],
        }

# Create global config instance
config = EnvironmentConfig()

# Export commonly used configurations
DATABASE_CONFIG = config.database_config
SECURITY_CONFIG = config.security_config
CORS_CONFIG = config.cors_config
OPENAI_CONFIG = config.openai_config
EMAIL_CONFIG = config.email_config
AWS_CONFIG = config.aws_config