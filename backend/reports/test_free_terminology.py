"""
Test endpoint for Free Medical Terminology Service
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import asyncio
import logging

from services.free_medical_terminology_service import free_medical_terminology_service
from config.medical_terminology_config import medical_terminology_config

logger = logging.getLogger(__name__)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def test_free_medical_terminology(request):
    """Test the free medical terminology service"""
    
    if request.method == 'GET':
        # Return service status
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            async def get_status():
                async with free_medical_terminology_service as service:
                    return service.get_service_status()
            
            status_info = loop.run_until_complete(get_status())
            loop.close()
            
            # Add configuration info
            status_info['configuration'] = {
                'active_sources': list(medical_terminology_config.get_active_sources().keys()),
                'free_sources_available': len([
                    src for src, config in medical_terminology_config.FREE_SOURCES.items() 
                    if config.get('free', False)
                ]),
                'builtin_terms_count': len(medical_terminology_config.get_all_builtin_terms()),
                'terminology_corrections': len(medical_terminology_config.TERMINOLOGY_CORRECTIONS)
            }
            
            return JsonResponse(status_info)
            
        except Exception as e:
            logger.error(f"Failed to get service status: {str(e)}")
            return Response({
                'error': f'Failed to get service status: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # POST request - search for medical terms
    try:
        query = request.data.get('query', '').strip()
        
        if not query:
            return Response({
                'error': 'Query parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"Testing free medical terminology search for: {query}")
        
        # Run async search
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def perform_search():
            async with free_medical_terminology_service as service:
                # Comprehensive search across all sources
                comprehensive_results = await service.comprehensive_search(query, max_results_per_source=5)
                
                # Also get built-in vocabulary search
                builtin_results = service.search_builtin_vocabulary(query, max_results=10)
                
                return {
                    'comprehensive_search': comprehensive_results,
                    'builtin_vocabulary': builtin_results
                }
        
        search_results = loop.run_until_complete(perform_search())
        loop.close()
        
        # Process and format results
        formatted_results = {
            'query': query,
            'timestamp': medical_terminology_config.API_CONFIG,
            'sources_searched': list(search_results['comprehensive_search'].keys()),
            'results_summary': {
                source: len(results) 
                for source, results in search_results['comprehensive_search'].items()
            },
            'total_results': sum(
                len(results) for results in search_results['comprehensive_search'].values()
            ),
            'detailed_results': search_results['comprehensive_search'],
            'builtin_results': search_results['builtin_vocabulary']
        }
        
        # Add terminology corrections if available
        corrections = medical_terminology_config.get_terminology_corrections()
        query_corrections = []
        
        for correction_type, correction_dict in corrections.items():
            if query.lower() in correction_dict:
                query_corrections.append({
                    'type': correction_type,
                    'original': query,
                    'corrected': correction_dict[query.lower()],
                    'reason': f'{correction_type.replace("_", " ").title()} improvement'
                })
        
        if query_corrections:
            formatted_results['terminology_corrections'] = query_corrections
        
        logger.info(f"Successfully found {formatted_results['total_results']} results for '{query}'")
        
        return JsonResponse(formatted_results)
        
    except Exception as e:
        logger.error(f"Free medical terminology test failed: {str(e)}")
        return Response({
            'error': f'Medical terminology search failed: {str(e)}',
            'query': request.data.get('query', ''),
            'fallback_available': True,
            'suggestion': 'The service includes built-in medical vocabularies as fallback'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_available_sources(request):
    """List all available free medical terminology sources"""
    
    try:
        active_sources = medical_terminology_config.get_active_sources()
        
        sources_info = {}
        for source_name, config in active_sources.items():
            sources_info[source_name] = {
                'description': config.get('description', 'No description available'),
                'free': config.get('free', False),
                'available': medical_terminology_config.is_source_available(source_name),
                'rate_limit': config.get('rate_limit', 'No limit'),
                'requires_registration': config.get('requires_license', False)
            }
        
        # Add sample searches for each source
        sample_searches = {
            'ncbi_pubmed': ['lung cancer', 'brain tumor', 'heart failure'],
            'radiopaedia': ['pneumonia', 'fracture', 'stroke'],
            'mesh_terms': ['radiology', 'diagnostic imaging', 'anatomy'],
            'builtin_vocabulary': ['mass', 'lesion', 'consolidation']
        }
        
        return JsonResponse({
            'available_sources': sources_info,
            'total_sources': len(sources_info),
            'free_sources': len([s for s in sources_info.values() if s['free']]),
            'sample_searches': sample_searches,
            'configuration': {
                'cache_enabled': medical_terminology_config.API_CONFIG['enable_caching'],
                'cache_duration': medical_terminology_config.API_CONFIG['cache_duration'],
                'timeout': medical_terminology_config.API_CONFIG['timeout'],
                'max_retries': medical_terminology_config.API_CONFIG['max_retries']
            }
        })
        
    except Exception as e:
        logger.error(f"Failed to list sources: {str(e)}")
        return Response({
            'error': f'Failed to list available sources: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
