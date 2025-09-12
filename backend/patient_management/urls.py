from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet

app_name = 'patient_management'

# Create router for ViewSet
router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')

# Soft-coded URL patterns based on configuration
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Additional custom endpoints can be added here
    # Example: path('custom-endpoint/', CustomView.as_view(), name='custom'),
]

# URL patterns with configuration
# This allows for easy modification of API endpoints
API_ENDPOINTS = {
    'patients': {
        'list': '',  # GET /api/patients/
        'create': '',  # POST /api/patients/
        'detail': '{id}/',  # GET /api/patients/{id}/
        'update': '{id}/',  # PUT/PATCH /api/patients/{id}/
        'delete': '{id}/',  # DELETE /api/patients/{id}/
        'dashboard_stats': 'dashboard-stats/',  # GET /api/patients/dashboard-stats/
        'search': 'search/',  # GET /api/patients/search/
        'export': 'export/',  # POST /api/patients/export/
        'bulk_actions': 'bulk-actions/',  # POST /api/patients/bulk-actions/
        'notes': '{id}/notes/',  # GET/POST /api/patients/{id}/notes/
    }
}
