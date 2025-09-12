from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import Patient, PatientNote, PatientAuditLog
from .config import PatientConfig


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """
    Soft-coded admin configuration for Patient model
    """
    # List display based on configuration
    list_display = [
        'full_name', 'age_display', 'gender_display', 'status_badge', 
        'priority_badge', 'doctor', 'phone', 'created_at'
    ]
    
    list_filter = [
        'status', 'priority', 'gender', 'doctor', 'created_at', 'blood_type'
    ]
    
    search_fields = PatientConfig.get_search_fields()
    
    ordering = PatientConfig.DATABASE['default_ordering']
    
    readonly_fields = ['id', 'created_at', 'updated_at', 'age_display', 'full_name']
    
    fieldsets = (
        ('Personal Information', {
            'fields': (
                'id', 'doctor', 'first_name', 'last_name', 'middle_name',
                'date_of_birth', 'age_display', 'gender'
            )
        }),
        ('Contact Information', {
            'fields': (
                'phone', 'email', 'address', 'city', 'state', 
                'postal_code', 'country'
            )
        }),
        ('Medical Information', {
            'fields': (
                'blood_type', 'allergies', 'medications', 'medical_history'
            )
        }),
        ('Emergency Contact', {
            'fields': (
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship'
            )
        }),
        ('Insurance Information', {
            'fields': (
                'insurance_provider', 'insurance_number'
            )
        }),
        ('Administrative', {
            'fields': (
                'status', 'priority', 'notes', 'last_visit', 
                'next_appointment', 'is_active'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def full_name(self, obj):
        """Display full name"""
        return obj.full_name
    full_name.short_description = 'Full Name'
    full_name.admin_order_field = 'last_name'
    
    def age_display(self, obj):
        """Display age"""
        age = obj.age
        return f"{age} years" if age is not None else "Unknown"
    age_display.short_description = 'Age'
    
    def gender_display(self, obj):
        """Display gender with icon"""
        icons = {
            'MALE': '♂',
            'FEMALE': '♀',
            'OTHER': '⚧',
            'PREFER_NOT_TO_SAY': '❓'
        }
        icon = icons.get(obj.gender, '❓')
        return format_html(
            '{} {}',
            icon,
            obj.get_gender_display()
        )
    gender_display.short_description = 'Gender'
    
    def status_badge(self, obj):
        """Display status as colored badge"""
        colors = {
            'ACTIVE': '#28a745',
            'INACTIVE': '#6c757d',
            'DISCHARGED': '#17a2b8',
            'DECEASED': '#dc3545'
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def priority_badge(self, obj):
        """Display priority as colored badge"""
        colors = {
            'LOW': '#28a745',
            'MEDIUM': '#ffc107',
            'HIGH': '#fd7e14',
            'CRITICAL': '#dc3545'
        }
        color = colors.get(obj.priority, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'
    
    def get_queryset(self, request):
        """
        Apply doctor data isolation if enabled
        """
        qs = super().get_queryset(request)
        
        if PatientConfig.is_doctor_isolation_enabled() and not request.user.is_superuser:
            # Non-superusers can only see their own patients
            qs = qs.filter(doctor=request.user)
        
        return qs.select_related('doctor')
    
    def save_model(self, request, obj, form, change):
        """
        Save model with audit logging
        """
        super().save_model(request, obj, form, change)
        
        if PatientConfig.is_audit_enabled():
            from .utils import AuditLogger
            action = 'UPDATE' if change else 'CREATE'
            AuditLogger.log_action(
                patient=obj,
                user=request.user,
                action=action,
                request=request
            )
    
    actions = ['mark_as_active', 'mark_as_inactive', 'export_to_csv']
    
    def mark_as_active(self, request, queryset):
        """Bulk action to mark patients as active"""
        updated = queryset.update(status='ACTIVE', updated_at=timezone.now())
        self.message_user(request, f'{updated} patients marked as active.')
    mark_as_active.short_description = 'Mark selected patients as active'
    
    def mark_as_inactive(self, request, queryset):
        """Bulk action to mark patients as inactive"""
        updated = queryset.update(status='INACTIVE', updated_at=timezone.now())
        self.message_user(request, f'{updated} patients marked as inactive.')
    mark_as_inactive.short_description = 'Mark selected patients as inactive'
    
    def export_to_csv(self, request, queryset):
        """Export selected patients to CSV"""
        from django.http import HttpResponse
        from .utils import ReportGenerator
        
        csv_data = ReportGenerator.export_to_csv(queryset)
        
        response = HttpResponse(csv_data, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="patients_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        return response
    export_to_csv.short_description = 'Export selected patients to CSV'


@admin.register(PatientNote)
class PatientNoteAdmin(admin.ModelAdmin):
    """
    Admin configuration for Patient Notes
    """
    list_display = ['title', 'patient', 'created_by', 'is_private', 'created_at']
    list_filter = ['is_private', 'created_at', 'created_by']
    search_fields = ['title', 'content', 'patient__first_name', 'patient__last_name']
    ordering = ['-created_at']
    
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def get_queryset(self, request):
        """
        Apply doctor data isolation for notes
        """
        qs = super().get_queryset(request)
        
        if PatientConfig.is_doctor_isolation_enabled() and not request.user.is_superuser:
            # Non-superusers can only see notes for their patients
            qs = qs.filter(patient__doctor=request.user)
        
        return qs.select_related('patient', 'created_by')


@admin.register(PatientAuditLog)
class PatientAuditLogAdmin(admin.ModelAdmin):
    """
    Admin configuration for Patient Audit Logs
    """
    list_display = ['patient', 'action', 'user', 'created_at', 'ip_address']
    list_filter = ['action', 'created_at', 'user']
    search_fields = ['patient__first_name', 'patient__last_name', 'user__username']
    ordering = ['-created_at']
    
    readonly_fields = ['id', 'patient', 'user', 'action', 'changes', 'ip_address', 'user_agent', 'created_at']
    
    def has_add_permission(self, request):
        """Audit logs should not be manually created"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Audit logs should not be modified"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion for cleanup purposes"""
        return request.user.is_superuser
    
    def get_queryset(self, request):
        """
        Apply doctor data isolation for audit logs
        """
        qs = super().get_queryset(request)
        
        if PatientConfig.is_doctor_isolation_enabled() and not request.user.is_superuser:
            # Non-superusers can only see audit logs for their patients
            qs = qs.filter(patient__doctor=request.user)
        
        return qs.select_related('patient', 'user')


# Custom admin site configuration
admin.site.site_header = "Patient Management System"
admin.site.site_title = "Patient Management"
admin.site.index_title = "Welcome to Patient Management System"
