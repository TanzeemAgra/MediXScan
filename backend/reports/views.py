from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from services.rag_service import radiology_rag_service
import openai
import time
import json
import logging

logger = logging.getLogger(__name__)

class AnalyzeReportView(APIView):
    """Main report analysis endpoint with RAG enhancement"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        try:
            report_text = request.data.get('report_text', '')
            file = request.FILES.get('file')
            
            if not report_text and not file:
                return Response({
                    'error': 'No report text or file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Handle file upload
            if file:
                try:
                    report_text = file.read().decode('utf-8')
                except Exception as e:
                    return Response({
                        'error': f'Failed to read file: {str(e)}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            if not report_text.strip():
                return Response({
                    'error': 'Empty report content'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            logger.info(f"Analyzing report for user: {request.user.email}")
            
            # Use RAG service to enhance analysis
            rag_analysis = radiology_rag_service.enhance_report_analysis(report_text)
            
            # Prepare comprehensive analysis response
            analysis_result = {
                'original_text': report_text,
                'rag_enhanced_analysis': rag_analysis,
                'medical_terminology': {
                    'detected_anatomical_terms': rag_analysis['detected_terms']['anatomical'],
                    'detected_pathological_terms': rag_analysis['detected_terms']['pathological'],
                    'detected_imaging_terms': rag_analysis['detected_terms']['imaging'],
                    'detected_abbreviations': rag_analysis['detected_terms']['abbreviations']
                },
                'quality_metrics': {
                    'medical_accuracy_score': rag_analysis['medical_accuracy']['score'],
                    'terminology_coverage': rag_analysis['terminology_coverage']['coverage_percentage'],
                    'total_medical_terms_found': rag_analysis['terminology_coverage']['total_medical_terms']
                },
                'recommendations': {
                    'issues_identified': rag_analysis['medical_accuracy']['issues'],
                    'improvement_suggestions': rag_analysis['medical_accuracy']['suggestions']
                },
                'metadata': {
                    'analysis_timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'user': request.user.email,
                    'rag_enhanced': True,
                    'source_vocabulary': 'radiologyassistant.nl'
                }
            }
            
            # Optional: Integrate with OpenAI for additional analysis
            if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
                try:
                    openai_analysis = self._get_openai_analysis(report_text, rag_analysis)
                    analysis_result['ai_analysis'] = openai_analysis
                except Exception as e:
                    logger.warning(f"OpenAI analysis failed: {str(e)}")
                    analysis_result['ai_analysis'] = {'error': 'AI analysis unavailable'}
            
            return Response(analysis_result, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Report analysis failed: {str(e)}")
            return Response({
                'error': 'Analysis failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_openai_analysis(self, report_text: str, rag_analysis: dict) -> dict:
        """Get additional AI analysis using OpenAI with RAG context"""
        try:
            openai.api_key = settings.OPENAI_API_KEY
            
            # Create enhanced prompt with RAG context
            rag_context = f"""
            Medical terminology detected:
            - Anatomical terms: {[term['term'] for term in rag_analysis['detected_terms']['anatomical']]}
            - Pathological terms: {[term['term'] for term in rag_analysis['detected_terms']['pathological']]}
            - Imaging terms: {[term['term'] for term in rag_analysis['detected_terms']['imaging']]}
            - Abbreviations: {[abbrev['abbreviation'] for abbrev in rag_analysis['detected_terms']['abbreviations']]}
            """
            
            prompt = f"""
            As a medical AI assistant, analyze this radiology report for accuracy, completeness, and proper medical terminology usage.
            
            {rag_context}
            
            Report to analyze:
            {report_text}
            
            Please provide:
            1. Medical accuracy assessment
            2. Terminology usage evaluation
            3. Potential inconsistencies or errors
            4. Suggestions for improvement
            5. Missing information that should be included
            
            Format the response as JSON with clear categories.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a medical AI assistant specializing in radiology report analysis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            return {
                'ai_feedback': response.choices[0].message.content,
                'model_used': 'gpt-3.5-turbo',
                'rag_enhanced': True
            }
            
        except Exception as e:
            logger.error(f"OpenAI analysis failed: {str(e)}")
            return {'error': str(e)}

class ReportHistoryView(APIView):
    """Get user's report history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Implementation will be added later
        return Response({
            'message': 'Report history endpoint - Coming soon'
        }, status=status.HTTP_200_OK)

class DownloadReportView(APIView):
    """Download analyzed report"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, report_id):
        # Implementation will be added later
        return Response({
            'message': 'Download report endpoint - Coming soon'
        }, status=status.HTTP_200_OK)

class ReportTemplateListView(APIView):
    """List available report templates"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Implementation will be added later
        return Response({
            'message': 'Report templates endpoint - Coming soon'
        }, status=status.HTTP_200_OK)

class MedicalVocabularyView(APIView):
    """Get RAG-enhanced medical vocabulary from radiologyassistant.nl"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Fetch medical vocabulary using RAG technique"""
        try:
            logger.info(f"Fetching medical vocabulary for user: {request.user.email}")
            
            # Get vocabulary from RAG service
            vocabulary = radiology_rag_service.get_medical_vocabulary()
            
            response_data = {
                'vocabulary': vocabulary,
                'statistics': {
                    'total_medical_terms': len(vocabulary['medical_terms']),
                    'anatomical_terms': len(vocabulary['anatomical_terms']),
                    'pathology_terms': len(vocabulary['pathology_terms']),
                    'imaging_terms': len(vocabulary['imaging_terms']),
                    'abbreviations': len(vocabulary['abbreviations']),
                    'common_phrases': len(vocabulary['common_phrases'])
                },
                'source': 'radiologyassistant.nl',
                'rag_enhanced': True,
                'last_updated': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Medical vocabulary fetch failed: {str(e)}")
            return Response({
                'error': 'Failed to fetch medical vocabulary',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RAGContentUpdateView(APIView):
    """Force update of RAG medical content"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Force refresh of medical content from radiologyassistant.nl"""
        try:
            max_pages = request.data.get('max_pages', 25)
            
            logger.info(f"Force updating RAG content, max_pages: {max_pages}")
            
            # Clear cache and fetch fresh content
            from django.core.cache import cache
            cache_key = f"radiology_content_{max_pages}"
            cache.delete(cache_key)
            
            # Fetch fresh content
            content = radiology_rag_service.fetch_medical_terminology(max_pages=max_pages)
            
            return Response({
                'message': 'RAG content updated successfully',
                'pages_processed': content['metadata']['pages_processed'],
                'extraction_date': content['metadata']['extraction_date'],
                'content_summary': {
                    'terminology_count': len(content['terminology']),
                    'anatomical_terms': len(content['anatomical_terms']),
                    'pathology_terms': len(content['pathology_terms']),
                    'imaging_techniques': len(content['imaging_techniques']),
                    'abbreviations': len(content['abbreviations'])
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"RAG content update failed: {str(e)}")
            return Response({
                'error': 'Failed to update RAG content',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnalyticsView(APIView):
    """Get analytics data for dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Implementation will be added later
        return Response({
            'message': 'Analytics endpoint - Coming soon'
        }, status=status.HTTP_200_OK)
