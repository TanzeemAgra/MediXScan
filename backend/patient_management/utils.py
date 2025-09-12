from django.utils import timezone
from .models import PatientAuditLog
from .config import PatientConfig
import json


class PatientUtils:
    """
    Utility functions for patient management
    """
    
    @staticmethod
    def get_patient_data(patient):
        """
        Get patient data as dictionary for comparison
        """
        return {
            'first_name': patient.first_name,
            'last_name': patient.last_name,
            'middle_name': patient.middle_name,
            'date_of_birth': patient.date_of_birth.isoformat() if patient.date_of_birth else None,
            'gender': patient.gender,
            'phone': patient.phone,
            'email': patient.email,
            'address': patient.address,
            'city': patient.city,
            'state': patient.state,
            'postal_code': patient.postal_code,
            'country': patient.country,
            'blood_type': patient.blood_type,
            'allergies': patient.allergies,
            'medications': patient.medications,
            'medical_history': patient.medical_history,
            'emergency_contact_name': patient.emergency_contact_name,
            'emergency_contact_phone': patient.emergency_contact_phone,
            'emergency_contact_relationship': patient.emergency_contact_relationship,
            'insurance_provider': patient.insurance_provider,
            'insurance_number': patient.insurance_number,
            'status': patient.status,
            'priority': patient.priority,
            'notes': patient.notes,
        }
    
    @staticmethod
    def compare_data(original, new):
        """
        Compare two data dictionaries and return changes
        """
        changes = {}
        for key in new.keys():
            if key in original:
                if original[key] != new[key]:
                    changes[key] = {
                        'old': original[key],
                        'new': new[key]
                    }
            else:
                changes[key] = {
                    'old': None,
                    'new': new[key]
                }
        return changes
    
    @staticmethod
    def format_patient_name(first_name, last_name, middle_name=None):
        """
        Format patient name consistently
        """
        if middle_name:
            return f"{first_name} {middle_name} {last_name}"
        return f"{first_name} {last_name}"
    
    @staticmethod
    def calculate_age(date_of_birth):
        """
        Calculate age from date of birth
        """
        if not date_of_birth:
            return None
        today = timezone.now().date()
        age = today.year - date_of_birth.year
        if today.month < date_of_birth.month or \
           (today.month == date_of_birth.month and today.day < date_of_birth.day):
            age -= 1
        return age
    
    @staticmethod
    def get_age_group(age):
        """
        Get age group category
        """
        if age is None:
            return 'Unknown'
        elif age < 18:
            return 'Child'
        elif age < 30:
            return 'Young Adult'
        elif age < 50:
            return 'Adult'
        elif age < 70:
            return 'Senior'
        else:
            return 'Elderly'
    
    @staticmethod
    def format_phone_number(phone):
        """
        Format phone number consistently
        """
        if not phone:
            return phone
        
        # Remove all non-digit characters
        digits = ''.join(filter(str.isdigit, phone))
        
        # Format based on length
        if len(digits) == 10:
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        elif len(digits) == 11 and digits[0] == '1':
            return f"+1 ({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
        else:
            return phone  # Return original if format is unclear
    
    @staticmethod
    def mask_sensitive_data(data, field):
        """
        Mask sensitive data based on configuration
        """
        if field in PatientConfig.SECURITY['anonymization_fields']:
            if data and len(data) > 4:
                return f"****{data[-4:]}"
            return "****"
        return data
    
    @staticmethod
    def get_dashboard_widget_data(queryset, widget_type):
        """
        Get specific widget data for dashboard
        """
        today = timezone.now().date()
        
        if widget_type == 'total_patients':
            return queryset.count()
        elif widget_type == 'active_patients':
            return queryset.filter(status='ACTIVE').count()
        elif widget_type == 'critical_patients':
            return queryset.filter(priority='CRITICAL').count()
        elif widget_type == 'new_patients_today':
            return queryset.filter(created_at__date=today).count()
        else:
            return 0


class AuditLogger:
    """
    Audit logging utility for patient management
    """
    
    @staticmethod
    def log_action(patient, user, action, changes=None, request=None):
        """
        Log patient management action
        """
        if not PatientConfig.is_audit_enabled():
            return None
        
        ip_address = None
        user_agent = None
        
        if request:
            # Get IP address
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0]
            else:
                ip_address = request.META.get('REMOTE_ADDR')
            
            # Get user agent
            user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        audit_log = PatientAuditLog.objects.create(
            patient=patient,
            user=user,
            action=action,
            changes=changes,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        return audit_log
    
    @staticmethod
    def get_recent_activities(user, limit=10):
        """
        Get recent activities for a user
        """
        if not PatientConfig.is_audit_enabled():
            return []
        
        if PatientConfig.is_doctor_isolation_enabled():
            # Show only activities for doctor's patients
            logs = PatientAuditLog.objects.filter(
                patient__doctor=user
            ).select_related('patient', 'user').order_by('-created_at')[:limit]
        else:
            # Show all activities
            logs = PatientAuditLog.objects.all().select_related(
                'patient', 'user'
            ).order_by('-created_at')[:limit]
        
        activities = []
        for log in logs:
            activities.append({
                'id': str(log.id),
                'action': log.action,
                'patient_name': log.patient.full_name,
                'user': log.user.get_full_name() or log.user.username,
                'timestamp': log.created_at,
                'changes': log.changes
            })
        
        return activities


class ReportGenerator:
    """
    Report generation utility
    """
    
    @staticmethod
    def generate_patient_summary(queryset):
        """
        Generate patient summary report data
        """
        total_patients = queryset.count()
        
        # Status breakdown
        status_breakdown = {}
        for status_key, status_label in PatientConfig.PATIENT_STATUS.items():
            count = queryset.filter(status=status_key).count()
            status_breakdown[status_label] = count
        
        # Priority breakdown
        priority_breakdown = {}
        for priority_key, priority_label in PatientConfig.PRIORITY_LEVELS.items():
            count = queryset.filter(priority=priority_key).count()
            priority_breakdown[priority_label] = count
        
        # Gender breakdown
        gender_breakdown = {}
        for gender_key, gender_label in PatientConfig.GENDER_OPTIONS.items():
            count = queryset.filter(gender=gender_key).count()
            gender_breakdown[gender_label] = count
        
        # Age group breakdown
        age_groups = {
            'Children (0-17)': queryset.filter(
                date_of_birth__gte=timezone.now().date() - timezone.timedelta(days=18*365)
            ).count(),
            'Young Adults (18-29)': queryset.filter(
                date_of_birth__gte=timezone.now().date() - timezone.timedelta(days=30*365),
                date_of_birth__lt=timezone.now().date() - timezone.timedelta(days=18*365)
            ).count(),
            'Adults (30-59)': queryset.filter(
                date_of_birth__gte=timezone.now().date() - timezone.timedelta(days=60*365),
                date_of_birth__lt=timezone.now().date() - timezone.timedelta(days=30*365)
            ).count(),
            'Seniors (60+)': queryset.filter(
                date_of_birth__lt=timezone.now().date() - timezone.timedelta(days=60*365)
            ).count(),
        }
        
        return {
            'total_patients': total_patients,
            'status_breakdown': status_breakdown,
            'priority_breakdown': priority_breakdown,
            'gender_breakdown': gender_breakdown,
            'age_group_breakdown': age_groups,
            'generated_at': timezone.now()
        }
    
    @staticmethod
    def export_to_csv(queryset, fields=None):
        """
        Export queryset to CSV format
        """
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Default fields if none specified
        if not fields:
            fields = [
                'full_name', 'age', 'gender', 'phone', 'email', 
                'status', 'priority', 'created_at'
            ]
        
        # Write header
        header = [field.replace('_', ' ').title() for field in fields]
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
        
        return output.getvalue()


class SearchHelper:
    """
    Helper for advanced search functionality
    """
    
    @staticmethod
    def build_search_query(search_term, search_fields=None):
        """
        Build Q object for search across multiple fields
        """
        from django.db.models import Q
        
        if not search_fields:
            search_fields = PatientConfig.get_search_fields()
        
        q_objects = Q()
        for field in search_fields:
            q_objects |= Q(**{f"{field}__icontains": search_term})
        
        return q_objects
    
    @staticmethod
    def apply_filters(queryset, filters):
        """
        Apply filters to queryset
        """
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        
        if filters.get('priority'):
            queryset = queryset.filter(priority=filters['priority'])
        
        if filters.get('gender'):
            queryset = queryset.filter(gender=filters['gender'])
        
        if filters.get('age_min') or filters.get('age_max'):
            today = timezone.now().date()
            if filters.get('age_min'):
                max_birth_date = today - timezone.timedelta(days=filters['age_min'] * 365)
                queryset = queryset.filter(date_of_birth__lte=max_birth_date)
            if filters.get('age_max'):
                min_birth_date = today - timezone.timedelta(days=(filters['age_max'] + 1) * 365)
                queryset = queryset.filter(date_of_birth__gte=min_birth_date)
        
        if filters.get('created_after'):
            queryset = queryset.filter(created_at__gte=filters['created_after'])
        
        if filters.get('created_before'):
            queryset = queryset.filter(created_at__lte=filters['created_before'])
        
        return queryset
