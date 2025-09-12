from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Case, When, IntegerField, CharField
from django.db import models
from django.utils import timezone
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
import csv
import json
from io import StringIO

from .models import Patient, PatientNote, PatientAuditLog
from .serializers import (
    PatientListSerializer, PatientDetailSerializer, PatientCreateSerializer, 
    PatientUpdateSerializer, PatientNoteSerializer, PatientDashboardStatsSerializer,
    PatientSearchSerializer, PatientExportSerializer, BulkActionSerializer
)
from .config import PatientConfig
from .utils import PatientUtils, AuditLogger

User = get_user_model()


class PatientPagination(PageNumberPagination):
    """
    Soft-coded pagination for patient list
    """
    page_size = PatientConfig.DATABASE['default_page_size']
    page_size_query_param = 'page_size'
    max_page_size = PatientConfig.DATABASE['max_page_size']


class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for patient management with soft-coded configuration
    """
    pagination_class = PatientPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Get patients based on doctor data isolation setting
        """
        if PatientConfig.is_doctor_isolation_enabled():
            # Doctor can only see their own patients
            return Patient.objects.filter(
                doctor=self.request.user,
                is_active=True
            ).select_related('doctor')
        else:
            # Admin can see all patients
            return Patient.objects.filter(
                is_active=True
            ).select_related('doctor')
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action
        """
        if self.action == 'list':
            return PatientListSerializer
        elif self.action == 'create':
            return PatientCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PatientUpdateSerializer
        else:
            return PatientDetailSerializer
    
    def perform_create(self, serializer):
        """
        Create patient with audit logging
        """
        patient = serializer.save(doctor=self.request.user)
        
        # Log creation if audit is enabled
        if PatientConfig.is_audit_enabled():
            AuditLogger.log_action(
                patient=patient,
                user=self.request.user,
                action='CREATE',
                request=self.request
            )
    
    def perform_update(self, serializer):
        """
        Update patient with audit logging
        """
        # Get original data for comparison
        original_data = {}
        if PatientConfig.is_audit_enabled():
            original_data = PatientUtils.get_patient_data(serializer.instance)
        
        patient = serializer.save()
        
        # Log update if audit is enabled
        if PatientConfig.is_audit_enabled():
            new_data = PatientUtils.get_patient_data(patient)
            changes = PatientUtils.compare_data(original_data, new_data)
            
            AuditLogger.log_action(
                patient=patient,
                user=self.request.user,
                action='UPDATE',
                changes=changes,
                request=self.request
            )
    
    def perform_destroy(self, instance):
        """
        Soft delete patient with audit logging
        """
        instance.is_active = False
        instance.save()
        
        # Log deletion if audit is enabled
        if PatientConfig.is_audit_enabled():
            AuditLogger.log_action(
                patient=instance,
                user=self.request.user,
                action='DELETE',
                request=self.request
            )
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Get dashboard statistics
        """
        queryset = self.get_queryset()
        today = timezone.now().date()
        
        # Basic counts
        total_patients = queryset.count()
        active_patients = queryset.filter(status='ACTIVE').count()
        inactive_patients = queryset.filter(status='INACTIVE').count()
        critical_patients = queryset.filter(priority='CRITICAL').count()
        new_patients_today = queryset.filter(created_at__date=today).count()
        
        # Mock appointments data (replace with actual appointment model when available)
        appointments_today = 0  # Replace with actual query
        
        # Group by gender
        by_gender = queryset.values('gender').annotate(
            count=Count('id')
        ).order_by('gender')
        gender_stats = {item['gender']: item['count'] for item in by_gender}
        
        # Group by age
        by_age_group = queryset.annotate(
            age_group=Case(
                When(date_of_birth__gte=datetime.now().date() - timedelta(days=30*365), then='18-30'),
                When(date_of_birth__gte=datetime.now().date() - timedelta(days=50*365), then='30-50'),
                When(date_of_birth__gte=datetime.now().date() - timedelta(days=70*365), then='50-70'),
                default='70+',
                output_field=models.CharField()
            )
        ).values('age_group').annotate(count=Count('id'))
        age_stats = {item['age_group']: item['count'] for item in by_age_group}
        
        # Group by priority
        by_priority = queryset.values('priority').annotate(
            count=Count('id')
        ).order_by('priority')
        priority_stats = {item['priority']: item['count'] for item in by_priority}
        
        # Group by status
        by_status = queryset.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        status_stats = {item['status']: item['count'] for item in by_status}
        
        # Recent activities (from audit log if enabled)
        recent_activities = []
        if PatientConfig.is_audit_enabled():
            recent_logs = PatientAuditLog.objects.filter(
                patient__doctor=request.user
            ).select_related('patient', 'user')[:10]
            
            recent_activities = [
                {
                    'id': log.id,
                    'action': log.action,
                    'patient_name': log.patient.full_name,
                    'user': log.user.get_full_name() or log.user.username,
                    'timestamp': log.created_at
                }
                for log in recent_logs
            ]
        
        stats_data = {
            'total_patients': total_patients,
            'active_patients': active_patients,
            'inactive_patients': inactive_patients,
            'critical_patients': critical_patients,
            'new_patients_today': new_patients_today,
            'appointments_today': appointments_today,
            'by_gender': gender_stats,
            'by_age_group': age_stats,
            'by_priority': priority_stats,
            'by_status': status_stats,
            'recent_activities': recent_activities
        }
        
        serializer = PatientDashboardStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Advanced search with filters
        """
        search_serializer = PatientSearchSerializer(data=request.query_params)
        search_serializer.is_valid(raise_exception=True)
        
        queryset = self.get_queryset()
        params = search_serializer.validated_data
        
        # Text search
        if 'q' in params:
            search_query = params['q']
            search_fields = PatientConfig.get_search_fields()
            q_objects = Q()
            for field in search_fields:
                q_objects |= Q(**{f"{field}__icontains": search_query})
            queryset = queryset.filter(q_objects)
        
        # Filter by status
        if 'status' in params:
            queryset = queryset.filter(status=params['status'])
        
        # Filter by priority
        if 'priority' in params:
            queryset = queryset.filter(priority=params['priority'])
        
        # Filter by gender
        if 'gender' in params:
            queryset = queryset.filter(gender=params['gender'])
        
        # Filter by age range
        if 'age_min' in params or 'age_max' in params:
            today = timezone.now().date()
            if 'age_min' in params:
                max_birth_date = today - timedelta(days=params['age_min'] * 365)
                queryset = queryset.filter(date_of_birth__lte=max_birth_date)
            if 'age_max' in params:
                min_birth_date = today - timedelta(days=(params['age_max'] + 1) * 365)
                queryset = queryset.filter(date_of_birth__gte=min_birth_date)
        
        # Filter by creation date
        if 'created_after' in params:
            queryset = queryset.filter(created_at__gte=params['created_after'])
        if 'created_before' in params:
            queryset = queryset.filter(created_at__lte=params['created_before'])
        
        # Ordering
        if 'ordering' in params:
            ordering_field = params['ordering']
            if ordering_field in PatientConfig.get_ordering_fields():
                queryset = queryset.order_by(ordering_field)
        
        # Paginate results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def export(self, request):
        """
        Export patients data
        """
        export_serializer = PatientExportSerializer(data=request.data)
        export_serializer.is_valid(raise_exception=True)
        
        params = export_serializer.validated_data
        export_format = params.get('format', 'csv')
        fields = params.get('fields', None)
        filters = params.get('filters', {})
        
        # Apply filters
        queryset = self.get_queryset()
        if filters:
            search_serializer = PatientSearchSerializer(data=filters)
            search_serializer.is_valid(raise_exception=True)
            # Apply same filtering logic as search
            # ... (filtering code similar to search action)
        
        # Limit records for export
        max_records = PatientConfig.REPORTS['max_records_per_report']
        queryset = queryset[:max_records]
        
        if export_format == 'csv':
            return self._export_csv(queryset, fields)
        elif export_format == 'json':
            return self._export_json(queryset, fields)
        else:
            return Response(
                {'error': 'Unsupported export format'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def bulk_actions(self, request):
        """
        Perform bulk actions on patients
        """
        bulk_serializer = BulkActionSerializer(data=request.data)
        bulk_serializer.is_valid(raise_exception=True)
        
        params = bulk_serializer.validated_data
        action_type = params['action']
        patient_ids = params['patient_ids']
        action_data = params.get('data', {})
        
        # Get patients (with permission check)
        queryset = self.get_queryset().filter(id__in=patient_ids)
        
        if action_type == 'update_status':
            new_status = action_data.get('status')
            if new_status in [choice[0] for choice in PatientConfig.get_status_choices()]:
                queryset.update(status=new_status, updated_at=timezone.now())
                count = queryset.count()
                return Response({'message': f'Updated status for {count} patients'})
        
        elif action_type == 'update_priority':
            new_priority = action_data.get('priority')
            if new_priority in [choice[0] for choice in PatientConfig.get_priority_choices()]:
                queryset.update(priority=new_priority, updated_at=timezone.now())
                count = queryset.count()
                return Response({'message': f'Updated priority for {count} patients'})
        
        elif action_type == 'delete':
            count = queryset.count()
            queryset.update(is_active=False, updated_at=timezone.now())
            return Response({'message': f'Deleted {count} patients'})
        
        return Response(
            {'error': 'Invalid bulk action'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['get', 'post'])
    def notes(self, request, pk=None):
        """
        Get or create patient notes
        """
        patient = self.get_object()
        
        if request.method == 'GET':
            notes = PatientNote.objects.filter(patient=patient).order_by('-created_at')
            serializer = PatientNoteSerializer(notes, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = PatientNoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(patient=patient, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def _export_csv(self, queryset, fields=None):
        """
        Export patients data as CSV
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="patients_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        if not fields:
            fields = ['full_name', 'age', 'gender', 'phone', 'email', 'status', 'priority', 'created_at']
        
        writer = csv.writer(response)
        
        # Write header
        header = []
        for field in fields:
            header.append(field.replace('_', ' ').title())
        writer.writerow(header)
        
        # Write data
        for patient in queryset:
            row = []
            for field in fields:
                if hasattr(patient, field):
                    value = getattr(patient, field)
                    if callable(value):
                        value = value()
                    row.append(str(value) if value is not None else '')
                else:
                    row.append('')
            writer.writerow(row)
        
        return response
    
    def _export_json(self, queryset, fields=None):
        """
        Export patients data as JSON
        """
        serializer = PatientListSerializer(queryset, many=True)
        data = serializer.data
        
        if fields:
            # Filter fields
            filtered_data = []
            for item in data:
                filtered_item = {field: item.get(field) for field in fields if field in item}
                filtered_data.append(filtered_item)
            data = filtered_data
        
        response = HttpResponse(
            json.dumps(data, indent=2, default=str),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="patients_{timezone.now().strftime("%Y%m%d_%H%M%S")}.json"'
        
        return response
