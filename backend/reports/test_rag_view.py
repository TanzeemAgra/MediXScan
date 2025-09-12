"""
RAG System Test View
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.advanced_rag_fallback import advanced_rag_fallback
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_rag_system(request):
    """Test the RAG system with sample text"""
    try:
        # Sample medical report for testing
        sample_report = request.data.get('report_text', """
        CHEST X-RAY REPORT
        
        CLINICAL HISTORY: Cough and fever for 3 days
        
        TECHNIQUE: PA and lateral chest radiographs obtained
        
        FINDINGS:
        - The lung are clear bilaterally with no focal consolidation
        - Heart size is within normal limits
        - No pleural effusion or pneumothorax
        - Bony structures are intact
        
        IMPRESSION: 
        Normal chest radiograph
        """)
        
        # Test advanced RAG fallback
        logger.info("Testing advanced RAG fallback system")
        analysis = advanced_rag_fallback.enhance_report_analysis(sample_report)
        corrected = advanced_rag_fallback.generate_corrected_report(sample_report)
        
        return Response({
            'status': 'success',
            'message': 'RAG system test completed',
            'original_report': sample_report,
            'analysis_results': analysis,
            'corrected_report': corrected,
            'system_working': True
        })
        
    except Exception as e:
        logger.error(f"RAG system test failed: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'RAG system test failed: {str(e)}',
            'system_working': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
