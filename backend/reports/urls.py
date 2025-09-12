from django.urls import path
from . import views, config_views
from .test_rag_view import test_rag_system
from .test_free_terminology import test_free_medical_terminology, list_available_sources

app_name = 'reports'

urlpatterns = [
    path('analyze/', views.AnalyzeReportView.as_view(), name='analyze'),
    path('history/', views.ReportHistoryView.as_view(), name='history'),
    path('download/<int:report_id>/', views.DownloadReportView.as_view(), name='download'),
    path('templates/', views.ReportTemplateListView.as_view(), name='templates'),
    path('analytics/', views.AnalyticsView.as_view(), name='analytics'),
    # RAG-enhanced endpoints
    path('vocabulary/', views.MedicalVocabularyView.as_view(), name='medical_vocabulary'),
    path('rag-update/', views.RAGContentUpdateView.as_view(), name='rag_update'),
    # Configuration management endpoints
    path('config/', config_views.get_rag_config, name='get_rag_config'),
    path('config/update/', config_views.update_rag_config, name='update_rag_config'),
    path('config/templates/', config_views.get_config_templates, name='get_config_templates'),
    path('config/validate/', config_views.validate_config, name='validate_config'),
    # Test endpoints
    path('test-rag/', test_rag_system, name='test_rag'),
    path('test-free-terminology/', test_free_medical_terminology, name='test_free_terminology'),
    path('list-sources/', list_available_sources, name='list_available_sources'),
]
