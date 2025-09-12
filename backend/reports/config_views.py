"""
RAG Configuration Management Views
Provides API endpoints for managing RAG configuration dynamically
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from services.rag_config import rag_config
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rag_config(request):
    """Get current RAG configuration"""
    try:
        config_dict = rag_config.to_dict()
        return Response({
            'success': True,
            'config': config_dict,
            'message': 'RAG configuration retrieved successfully'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve RAG configuration'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_rag_config(request):
    """Update RAG configuration dynamically"""
    try:
        updates = request.data.get('updates', {})
        
        # Validate and apply updates
        for section, section_updates in updates.items():
            if section in ['sources', 'medical_terms', 'cache', 'analysis']:
                rag_config.update_config(section, section_updates)
            else:
                return Response({
                    'success': False,
                    'error': f'Invalid configuration section: {section}',
                    'message': 'Configuration update failed'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': 'RAG configuration updated successfully',
            'updated_config': rag_config.to_dict()
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to update RAG configuration'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_config_templates(request):
    """Get configuration templates and examples"""
    templates = {
        'sources': {
            'radiologyassistant': {
                'enabled': True,
                'max_pages': 50,
                'delay': 1.0,
                'timeout': 30,
                'retry_attempts': 3,
                'description': 'Configuration for RadiologyAssistant.nl content source'
            }
        },
        'medical_terms': {
            'min_word_length': 3,
            'max_word_length': 50,
            'description': 'Configuration for medical term extraction',
            'pattern_examples': {
                'anatomical': 'chest, lung, heart, brain, liver',
                'pathology': 'fracture, pneumonia, edema, tumor',
                'imaging': 'CT, MRI, ultrasound, x-ray',
                'general': 'normal, abnormal, mild, severe'
            }
        },
        'cache': {
            'vocabulary_timeout': 3600,
            'content_timeout': 86400,
            'max_cache_size': 1000,
            'description': 'Cache configuration for performance optimization'
        },
        'analysis': {
            'openai_model': 'gpt-3.5-turbo',
            'max_tokens': 1000,
            'temperature': 0.3,
            'confidence_threshold': 0.7,
            'description': 'Analysis configuration for OpenAI integration'
        }
    }
    
    return Response({
        'success': True,
        'templates': templates,
        'message': 'Configuration templates retrieved successfully'
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_config(request):
    """Validate configuration before applying"""
    try:
        config_to_validate = request.data.get('config', {})
        
        validation_results = {
            'valid': True,
            'errors': [],
            'warnings': []
        }
        
        # Validate sources configuration
        if 'sources' in config_to_validate:
            sources = config_to_validate['sources']
            if 'radiologyassistant' in sources:
                ra_config = sources['radiologyassistant']
                
                # Validate max_pages
                if 'max_pages' in ra_config:
                    if not isinstance(ra_config['max_pages'], int) or ra_config['max_pages'] <= 0:
                        validation_results['errors'].append('max_pages must be a positive integer')
                        validation_results['valid'] = False
                    elif ra_config['max_pages'] > 100:
                        validation_results['warnings'].append('max_pages > 100 may cause performance issues')
                
                # Validate delay
                if 'delay' in ra_config:
                    if not isinstance(ra_config['delay'], (int, float)) or ra_config['delay'] < 0:
                        validation_results['errors'].append('delay must be a non-negative number')
                        validation_results['valid'] = False
                    elif ra_config['delay'] < 0.5:
                        validation_results['warnings'].append('delay < 0.5 seconds may overwhelm the server')
        
        # Validate medical terms configuration
        if 'medical_terms' in config_to_validate:
            terms_config = config_to_validate['medical_terms']
            
            if 'min_word_length' in terms_config:
                if not isinstance(terms_config['min_word_length'], int) or terms_config['min_word_length'] < 1:
                    validation_results['errors'].append('min_word_length must be a positive integer')
                    validation_results['valid'] = False
            
            if 'max_word_length' in terms_config:
                if not isinstance(terms_config['max_word_length'], int) or terms_config['max_word_length'] < 1:
                    validation_results['errors'].append('max_word_length must be a positive integer')
                    validation_results['valid'] = False
        
        # Validate cache configuration
        if 'cache' in config_to_validate:
            cache_config = config_to_validate['cache']
            
            for timeout_field in ['vocabulary_timeout', 'content_timeout']:
                if timeout_field in cache_config:
                    if not isinstance(cache_config[timeout_field], int) or cache_config[timeout_field] < 0:
                        validation_results['errors'].append(f'{timeout_field} must be a non-negative integer')
                        validation_results['valid'] = False
        
        # Validate analysis configuration
        if 'analysis' in config_to_validate:
            analysis_config = config_to_validate['analysis']
            
            if 'temperature' in analysis_config:
                temp = analysis_config['temperature']
                if not isinstance(temp, (int, float)) or temp < 0 or temp > 2:
                    validation_results['errors'].append('temperature must be a number between 0 and 2')
                    validation_results['valid'] = False
            
            if 'confidence_threshold' in analysis_config:
                threshold = analysis_config['confidence_threshold']
                if not isinstance(threshold, (int, float)) or threshold < 0 or threshold > 1:
                    validation_results['errors'].append('confidence_threshold must be a number between 0 and 1')
                    validation_results['valid'] = False
        
        return Response({
            'success': True,
            'validation': validation_results,
            'message': 'Configuration validation completed'
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Configuration validation failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
