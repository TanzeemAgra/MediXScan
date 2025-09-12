from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Patient, PatientNote, PatientAuditLog
from .config import PatientConfig
import re

User = get_user_model()

class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor information
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'full_name']
        read_only_fields = ['id', 'username']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class PatientListSerializer(serializers.ModelSerializer):
    """
    Serializer for patient list view (optimized with essential fields)
    """
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'full_name', 'first_name', 'last_name', 'age', 'gender', 'gender_display',
            'phone', 'email', 'status', 'status_display', 'priority', 'priority_display',
            'doctor_name', 'last_visit', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for patient with all fields
    """
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    is_critical = serializers.ReadOnlyField()
    contact_info = serializers.ReadOnlyField()
    doctor = DoctorSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    blood_type_display = serializers.CharField(source='get_blood_type_display', read_only=True)
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'doctor']
    
    def validate_phone(self, value):
        """Validate phone number using soft-coded regex"""
        phone_regex = PatientConfig.VALIDATION['phone_regex']
        if not re.match(phone_regex, value):
            raise serializers.ValidationError(
                "Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        return value
    
    def validate_date_of_birth(self, value):
        """Validate date of birth"""
        from django.utils import timezone
        from datetime import date
        
        if not value:
            raise serializers.ValidationError("Date of birth is required.")
        
        today = timezone.now().date()
        age = today.year - value.year
        if today.month < value.month or (today.month == value.month and today.day < value.day):
            age -= 1
        
        min_age = PatientConfig.VALIDATION['min_age']
        max_age = PatientConfig.VALIDATION['max_age']
        
        if age < min_age:
            raise serializers.ValidationError(f"Age cannot be less than {min_age} years.")
        if age > max_age:
            raise serializers.ValidationError(f"Age cannot be more than {max_age} years.")
        
        if value > today:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        return value
    
    def validate_emergency_contact_phone(self, value):
        """Validate emergency contact phone number"""
        if value:
            phone_regex = PatientConfig.VALIDATION['phone_regex']
            if not re.match(phone_regex, value):
                raise serializers.ValidationError(
                    "Emergency contact phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
                )
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        # Check if emergency contact is required
        if PatientConfig.VALIDATION['emergency_contact_required']:
            if not attrs.get('emergency_contact_name'):
                raise serializers.ValidationError({
                    'emergency_contact_name': 'Emergency contact name is required.'
                })
            if not attrs.get('emergency_contact_phone'):
                raise serializers.ValidationError({
                    'emergency_contact_phone': 'Emergency contact phone is required.'
                })
        
        # Check if email is required
        if PatientConfig.VALIDATION['email_required'] and not attrs.get('email'):
            raise serializers.ValidationError({
                'email': 'Email address is required.'
            })
        
        return attrs


class PatientCreateSerializer(PatientDetailSerializer):
    """
    Serializer for creating new patients
    """
    doctor = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta(PatientDetailSerializer.Meta):
        extra_kwargs = {
            'status': {'default': 'ACTIVE'},
            'priority': {'default': 'MEDIUM'},
        }


class PatientUpdateSerializer(PatientDetailSerializer):
    """
    Serializer for updating patients
    """
    class Meta(PatientDetailSerializer.Meta):
        read_only_fields = ['id', 'created_at', 'updated_at', 'doctor']


class PatientNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for patient notes
    """
    created_by = DoctorSerializer(read_only=True)
    
    class Meta:
        model = PatientNote
        fields = ['id', 'title', 'content', 'is_private', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientAuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for patient audit logs
    """
    user = DoctorSerializer(read_only=True)
    
    class Meta:
        model = PatientAuditLog
        fields = ['id', 'action', 'changes', 'user', 'ip_address', 'created_at']
        read_only_fields = ['id', 'created_at']


class PatientDashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    total_patients = serializers.IntegerField()
    active_patients = serializers.IntegerField()
    inactive_patients = serializers.IntegerField()
    critical_patients = serializers.IntegerField()
    new_patients_today = serializers.IntegerField()
    appointments_today = serializers.IntegerField()
    
    by_gender = serializers.DictField()
    by_age_group = serializers.DictField()
    by_priority = serializers.DictField()
    by_status = serializers.DictField()
    
    recent_activities = serializers.ListField()


class PatientSearchSerializer(serializers.Serializer):
    """
    Serializer for patient search parameters
    """
    q = serializers.CharField(required=False, help_text="Search query")
    status = serializers.ChoiceField(
        choices=PatientConfig.get_status_choices(),
        required=False,
        help_text="Filter by status"
    )
    priority = serializers.ChoiceField(
        choices=PatientConfig.get_priority_choices(),
        required=False,
        help_text="Filter by priority"
    )
    gender = serializers.ChoiceField(
        choices=PatientConfig.get_gender_choices(),
        required=False,
        help_text="Filter by gender"
    )
    age_min = serializers.IntegerField(required=False, min_value=0, help_text="Minimum age")
    age_max = serializers.IntegerField(required=False, max_value=150, help_text="Maximum age")
    created_after = serializers.DateTimeField(required=False, help_text="Created after date")
    created_before = serializers.DateTimeField(required=False, help_text="Created before date")
    ordering = serializers.ChoiceField(
        choices=[(field, field) for field in PatientConfig.get_ordering_fields()],
        required=False,
        help_text="Order by field"
    )


class PatientExportSerializer(serializers.Serializer):
    """
    Serializer for patient export parameters
    """
    format = serializers.ChoiceField(
        choices=[('csv', 'CSV'), ('excel', 'Excel'), ('json', 'JSON')],
        default='csv',
        help_text="Export format"
    )
    fields = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="Fields to include in export"
    )
    filters = PatientSearchSerializer(required=False)


class BulkActionSerializer(serializers.Serializer):
    """
    Serializer for bulk actions on patients
    """
    action = serializers.ChoiceField(
        choices=[
            ('update_status', 'Update Status'),
            ('update_priority', 'Update Priority'),
            ('delete', 'Delete'),
            ('export', 'Export')
        ],
        help_text="Action to perform"
    )
    patient_ids = serializers.ListField(
        child=serializers.UUIDField(),
        help_text="List of patient IDs"
    )
    data = serializers.DictField(
        required=False,
        help_text="Additional data for the action"
    )
