# Patient Management Configuration
# Soft-coded configuration for backend patient management system

from django.conf import settings
import os

# ===============================================
# PATIENT MANAGEMENT CONFIGURATION
# ===============================================

class PatientConfig:
    """
    Soft-coded configuration for patient management system
    """
    
    # Database Configuration
    DATABASE = {
        'default_page_size': int(os.getenv('PATIENT_PAGE_SIZE', '25')),
        'max_page_size': int(os.getenv('PATIENT_MAX_PAGE_SIZE', '100')),
        'search_fields': ['first_name', 'last_name', 'email', 'phone'],
        'ordering_fields': ['created_at', 'updated_at', 'last_name', 'first_name', 'date_of_birth'],
        'default_ordering': ['-created_at']
    }
    
    # Patient Status Configuration
    PATIENT_STATUS = {
        'ACTIVE': 'Active',
        'INACTIVE': 'Inactive',
        'DISCHARGED': 'Discharged',
        'DECEASED': 'Deceased'
    }
    
    # Priority Levels
    PRIORITY_LEVELS = {
        'LOW': 'Low',
        'MEDIUM': 'Medium', 
        'HIGH': 'High',
        'CRITICAL': 'Critical'
    }
    
    # Gender Options
    GENDER_OPTIONS = {
        'MALE': 'Male',
        'FEMALE': 'Female',
        'OTHER': 'Other',
        'PREFER_NOT_TO_SAY': 'Prefer not to say'
    }
    
    # Blood Types
    BLOOD_TYPES = {
        'A_POSITIVE': 'A+',
        'A_NEGATIVE': 'A-',
        'B_POSITIVE': 'B+',
        'B_NEGATIVE': 'B-',
        'AB_POSITIVE': 'AB+',
        'AB_NEGATIVE': 'AB-',
        'O_POSITIVE': 'O+',
        'O_NEGATIVE': 'O-',
        'UNKNOWN': 'Unknown'
    }
    
    # API Configuration
    API = {
        'base_url': '/api/patients/',
        'endpoints': {
            'list': '',
            'detail': '{id}/',
            'create': '',
            'update': '{id}/',
            'delete': '{id}/',
            'doctor_patients': 'doctor/{doctor_id}/',
            'dashboard_stats': 'dashboard-stats/',
            'search': 'search/',
            'export': 'export/',
            'bulk_actions': 'bulk-actions/'
        },
        'allowed_methods': ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        'authentication_required': True,
        'permission_classes': ['IsAuthenticated']
    }
    
    # Validation Rules
    VALIDATION = {
        'name_min_length': int(os.getenv('PATIENT_NAME_MIN_LENGTH', '2')),
        'name_max_length': int(os.getenv('PATIENT_NAME_MAX_LENGTH', '100')),
        'phone_regex': os.getenv('PATIENT_PHONE_REGEX', r'^\+?1?\d{9,15}$'),
        'email_required': os.getenv('PATIENT_EMAIL_REQUIRED', 'False').lower() == 'true',
        'emergency_contact_required': os.getenv('PATIENT_EMERGENCY_REQUIRED', 'True').lower() == 'true',
        'max_age': int(os.getenv('PATIENT_MAX_AGE', '150')),
        'min_age': int(os.getenv('PATIENT_MIN_AGE', '0'))
    }
    
    # Security Configuration
    SECURITY = {
        'doctor_data_isolation': os.getenv('DOCTOR_DATA_ISOLATION', 'True').lower() == 'true',
        'audit_log_enabled': os.getenv('PATIENT_AUDIT_LOG', 'True').lower() == 'true',
        'data_encryption': os.getenv('PATIENT_DATA_ENCRYPTION', 'False').lower() == 'true',
        'anonymization_fields': ['social_security_number', 'insurance_number'],
        'sensitive_fields': ['medical_history', 'allergies', 'medications']
    }
    
    # Report Configuration
    REPORTS = {
        'types': {
            'PATIENT_SUMMARY': 'Patient Summary Report',
            'PATIENT_DETAILS': 'Detailed Patient Report',
            'APPOINTMENT_SUMMARY': 'Appointment Summary',
            'MEDICAL_REPORTS': 'Medical Reports Summary',
            'ANALYTICS': 'Patient Analytics'
        },
        'export_formats': ['PDF', 'CSV', 'EXCEL', 'JSON'],
        'max_records_per_report': int(os.getenv('REPORT_MAX_RECORDS', '1000')),
        'cache_duration': int(os.getenv('REPORT_CACHE_DURATION', '3600'))  # seconds
    }
    
    # Dashboard Configuration
    DASHBOARD = {
        'widgets': {
            'total_patients': {
                'enabled': True,
                'title': 'Total Patients',
                'icon': 'users',
                'color': 'primary'
            },
            'active_patients': {
                'enabled': True,
                'title': 'Active Patients',
                'icon': 'user-check',
                'color': 'success'
            },
            'critical_patients': {
                'enabled': True,
                'title': 'Critical Priority',
                'icon': 'alert-triangle',
                'color': 'danger'
            },
            'new_patients_today': {
                'enabled': True,
                'title': 'New Today',
                'icon': 'user-plus',
                'color': 'info'
            },
            'appointments_today': {
                'enabled': True,
                'title': 'Appointments Today',
                'icon': 'calendar',
                'color': 'warning'
            },
            'recent_activities': {
                'enabled': True,
                'title': 'Recent Activities',
                'max_items': 10
            }
        },
        'refresh_interval': int(os.getenv('DASHBOARD_REFRESH_INTERVAL', '300'))  # seconds
    }
    
    # Theme Configuration
    THEMES = {
        'MEDICAL_BLUE': {
            'primary_color': '#2563eb',
            'secondary_color': '#64748b',
            'success_color': '#10b981',
            'warning_color': '#f59e0b',
            'danger_color': '#ef4444',
            'info_color': '#06b6d4'
        },
        'HEALTHCARE_GREEN': {
            'primary_color': '#059669',
            'secondary_color': '#6b7280',
            'success_color': '#10b981',
            'warning_color': '#f59e0b',
            'danger_color': '#ef4444',
            'info_color': '#06b6d4'
        },
        'DARK_PROFESSIONAL': {
            'primary_color': '#3b82f6',
            'secondary_color': '#6b7280',
            'success_color': '#22c55e',
            'warning_color': '#eab308',
            'danger_color': '#ef4444',
            'info_color': '#06b6d4'
        }
    }
    
    @classmethod
    def get_status_choices(cls):
        """Get status choices for model field"""
        return [(key, value) for key, value in cls.PATIENT_STATUS.items()]
    
    @classmethod
    def get_priority_choices(cls):
        """Get priority choices for model field"""
        return [(key, value) for key, value in cls.PRIORITY_LEVELS.items()]
    
    @classmethod
    def get_gender_choices(cls):
        """Get gender choices for model field"""
        return [(key, value) for key, value in cls.GENDER_OPTIONS.items()]
    
    @classmethod
    def get_blood_type_choices(cls):
        """Get blood type choices for model field"""
        return [(key, value) for key, value in cls.BLOOD_TYPES.items()]
    
    @classmethod
    def get_dashboard_widgets(cls):
        """Get enabled dashboard widgets"""
        return {k: v for k, v in cls.DASHBOARD['widgets'].items() if v.get('enabled', True)}
    
    @classmethod
    def get_search_fields(cls):
        """Get search fields for API"""
        return cls.DATABASE['search_fields']
    
    @classmethod
    def get_ordering_fields(cls):
        """Get allowed ordering fields for API"""
        return cls.DATABASE['ordering_fields']
    
    @classmethod
    def is_doctor_isolation_enabled(cls):
        """Check if doctor data isolation is enabled"""
        return cls.SECURITY['doctor_data_isolation']
    
    @classmethod
    def is_audit_enabled(cls):
        """Check if audit logging is enabled"""
        return cls.SECURITY['audit_log_enabled']
