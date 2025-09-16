# AI Configuration Settings
# Location: backend/config/ai_settings.py
# Purpose: Soft-coded configuration for AI analysis systems

import os
from django.conf import settings

# OpenAI Configuration (Soft-coded with environment variables)
OPENAI_CONFIG = {
    # Model Selection (with fallback hierarchy)
    'PRIMARY_MODEL': os.environ.get('OPENAI_PRIMARY_MODEL', 'gpt-4'),
    'FALLBACK_MODEL': os.environ.get('OPENAI_FALLBACK_MODEL', 'gpt-3.5-turbo'),
    'BACKUP_MODEL': os.environ.get('OPENAI_BACKUP_MODEL', 'gpt-3.5-turbo-16k'),
    
    # Token Limits (configurable per model)
    'MAX_TOKENS': {
        'gpt-4': int(os.environ.get('OPENAI_GPT4_MAX_TOKENS', '2000')),
        'gpt-3.5-turbo': int(os.environ.get('OPENAI_GPT35_MAX_TOKENS', '1500')),
        'gpt-3.5-turbo-16k': int(os.environ.get('OPENAI_GPT35_16K_MAX_TOKENS', '3000'))
    },
    
    # Analysis Parameters
    'TEMPERATURE': float(os.environ.get('OPENAI_TEMPERATURE', '0.3')),
    'TIMEOUT': int(os.environ.get('OPENAI_TIMEOUT', '30')),
    'MAX_RETRIES': int(os.environ.get('OPENAI_MAX_RETRIES', '3')),
    'RETRY_DELAY': int(os.environ.get('OPENAI_RETRY_DELAY', '2')),
    
    # Analysis Thresholds
    'MIN_MEDICAL_TERMS_THRESHOLD': int(os.environ.get('MIN_MEDICAL_TERMS_THRESHOLD', '5')),
    'QUALITY_SCORE_THRESHOLD': int(os.environ.get('QUALITY_SCORE_THRESHOLD', '60')),
    'CONFIDENCE_THRESHOLD': float(os.environ.get('CONFIDENCE_THRESHOLD', '0.7')),
    
    # Fallback Behavior
    'ENABLE_AI_FALLBACK': os.environ.get('ENABLE_AI_FALLBACK', 'true').lower() == 'true',
    'ENABLE_RAG_FALLBACK': os.environ.get('ENABLE_RAG_FALLBACK', 'true').lower() == 'true',
    'GRACEFUL_DEGRADATION': os.environ.get('GRACEFUL_DEGRADATION', 'true').lower() == 'true',
    
    # Rate Limiting
    'REQUESTS_PER_MINUTE': int(os.environ.get('OPENAI_REQUESTS_PER_MINUTE', '20')),
    'BURST_LIMIT': int(os.environ.get('OPENAI_BURST_LIMIT', '5')),
    
    # Analysis Modes
    'ANALYSIS_MODE': os.environ.get('ANALYSIS_MODE', 'comprehensive'),  # basic, standard, comprehensive
    'ENABLE_CORRECTION': os.environ.get('ENABLE_CORRECTION', 'true').lower() == 'true',
    'ENABLE_ENHANCEMENT': os.environ.get('ENABLE_ENHANCEMENT', 'true').lower() == 'true'
}

# RAG Configuration
RAG_CONFIG = {
    'PRIMARY_RAG_ENABLED': os.environ.get('PRIMARY_RAG_ENABLED', 'true').lower() == 'true',
    'EXTERNAL_RAG_ENABLED': os.environ.get('EXTERNAL_RAG_ENABLED', 'true').lower() == 'true',
    'RAG_TIMEOUT': int(os.environ.get('RAG_TIMEOUT', '15')),
    'MAX_EXTERNAL_QUERIES': int(os.environ.get('MAX_EXTERNAL_QUERIES', '3')),
    'RAG_FALLBACK_DELAY': int(os.environ.get('RAG_FALLBACK_DELAY', '5'))
}

# Medical Analysis Configuration
MEDICAL_CONFIG = {
    'ENABLE_CLINICAL_SIGNIFICANCE': os.environ.get('ENABLE_CLINICAL_SIGNIFICANCE', 'true').lower() == 'true',
    'ENABLE_DISCREPANCY_DETECTION': os.environ.get('ENABLE_DISCREPANCY_DETECTION', 'true').lower() == 'true',
    'ENABLE_TERMINOLOGY_VALIDATION': os.environ.get('ENABLE_TERMINOLOGY_VALIDATION', 'true').lower() == 'true',
    'SEVERITY_LEVELS': ['minor', 'major', 'critical'],
    'DEFAULT_CLINICAL_SIGNIFICANCE': 'routine'
}

# Soft-coded System Messages and Prompts
SYSTEM_MESSAGES = {
    'MEDICAL_EXPERT': """You are an expert medical AI assistant specializing in radiology report analysis. 
    You have extensive knowledge of medical terminology, anatomy, pathology, and imaging techniques. 
    Always prioritize accuracy, patient safety, and professional medical standards.""",
    
    'FALLBACK_ANALYSIS': """You are a medical AI assistant providing analysis when primary medical databases are unavailable. 
    Rely on your training in medical terminology and provide accurate, helpful analysis while noting any limitations.""",
    
    'JSON_RESPONSE': """Always respond with valid JSON format. Ensure all required fields are present and properly formatted."""
}

# Error Messages and User Communication (Soft-coded)
USER_MESSAGES = {
    'RAG_OFFLINE': 'Medical database temporarily unavailable. Using AI-powered analysis.',
    'AI_FALLBACK': 'Primary analysis system offline. Using advanced AI fallback.',
    'BASIC_FALLBACK': 'All advanced systems temporarily unavailable. Basic analysis provided.',
    'ANALYSIS_SUCCESS': 'Analysis completed successfully.',
    'PARTIAL_ANALYSIS': 'Analysis completed with limited data sources.',
    'MANUAL_REVIEW': 'Manual review recommended due to system limitations.'
}

# Feature Flags (Enable/Disable functionality)
FEATURE_FLAGS = {
    'ENABLE_OPENAI_ANALYSIS': os.environ.get('ENABLE_OPENAI_ANALYSIS', 'true').lower() == 'true',
    'ENABLE_RAG_ENHANCEMENT': os.environ.get('ENABLE_RAG_ENHANCEMENT', 'true').lower() == 'true',
    'ENABLE_REPORT_CORRECTION': os.environ.get('ENABLE_REPORT_CORRECTION', 'true').lower() == 'true',
    'ENABLE_QUALITY_METRICS': os.environ.get('ENABLE_QUALITY_METRICS', 'true').lower() == 'true',
    'ENABLE_DIAGNOSTIC_DISCREPANCIES': os.environ.get('ENABLE_DIAGNOSTIC_DISCREPANCIES', 'true').lower() == 'true',
    'DEBUG_MODE': os.environ.get('AI_DEBUG_MODE', 'false').lower() == 'true'
}

def get_openai_config():
    """Get OpenAI configuration with environment overrides"""
    return OPENAI_CONFIG

def get_rag_config():
    """Get RAG configuration with environment overrides"""
    return RAG_CONFIG

def get_medical_config():
    """Get medical analysis configuration"""
    return MEDICAL_CONFIG

def is_feature_enabled(feature_name: str) -> bool:
    """Check if a feature is enabled"""
    return FEATURE_FLAGS.get(feature_name, False)

def get_system_message(message_type: str) -> str:
    """Get system message by type"""
    return SYSTEM_MESSAGES.get(message_type, SYSTEM_MESSAGES['MEDICAL_EXPERT'])

def get_user_message(message_key: str) -> str:
    """Get user-facing message by key"""
    return USER_MESSAGES.get(message_key, 'Analysis completed.')