from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator, MinLengthValidator, EmailValidator
from django.utils import timezone
from .config import PatientConfig
import uuid

User = get_user_model()

class TimestampedModel(models.Model):
    """
    Abstract base model with timestamp fields
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Patient(TimestampedModel):
    """
    Patient model with soft-coded configuration
    """
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Doctor relationship (for data isolation)
    doctor = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='patients',
        help_text="Doctor responsible for this patient"
    )
    
    # Personal Information
    first_name = models.CharField(
        max_length=PatientConfig.VALIDATION['name_max_length'],
        validators=[MinLengthValidator(PatientConfig.VALIDATION['name_min_length'])],
        help_text="Patient's first name"
    )
    
    last_name = models.CharField(
        max_length=PatientConfig.VALIDATION['name_max_length'],
        validators=[MinLengthValidator(PatientConfig.VALIDATION['name_min_length'])],
        help_text="Patient's last name"
    )
    
    middle_name = models.CharField(
        max_length=PatientConfig.VALIDATION['name_max_length'],
        blank=True,
        null=True,
        help_text="Patient's middle name (optional)"
    )
    
    date_of_birth = models.DateField(help_text="Patient's date of birth")
    
    gender = models.CharField(
        max_length=20,
        choices=PatientConfig.get_gender_choices(),
        help_text="Patient's gender"
    )
    
    # Contact Information
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=PatientConfig.VALIDATION['phone_regex'],
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        help_text="Primary phone number"
    )
    
    email = models.EmailField(
        blank=not PatientConfig.VALIDATION['email_required'],
        null=not PatientConfig.VALIDATION['email_required'],
        validators=[EmailValidator()],
        help_text="Email address"
    )
    
    address = models.TextField(
        blank=True,
        null=True,
        help_text="Full address"
    )
    
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="City"
    )
    
    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="State/Province"
    )
    
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Postal/ZIP code"
    )
    
    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default="United States",
        help_text="Country"
    )
    
    # Medical Information
    blood_type = models.CharField(
        max_length=20,
        choices=PatientConfig.get_blood_type_choices(),
        blank=True,
        null=True,
        help_text="Blood type"
    )
    
    allergies = models.TextField(
        blank=True,
        null=True,
        help_text="Known allergies"
    )
    
    medications = models.TextField(
        blank=True,
        null=True,
        help_text="Current medications"
    )
    
    medical_history = models.TextField(
        blank=True,
        null=True,
        help_text="Medical history and conditions"
    )
    
    # Emergency Contact
    emergency_contact_name = models.CharField(
        max_length=PatientConfig.VALIDATION['name_max_length'],
        blank=not PatientConfig.VALIDATION['emergency_contact_required'],
        null=not PatientConfig.VALIDATION['emergency_contact_required'],
        help_text="Emergency contact person name"
    )
    
    emergency_contact_phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=PatientConfig.VALIDATION['phone_regex'],
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        blank=not PatientConfig.VALIDATION['emergency_contact_required'],
        null=not PatientConfig.VALIDATION['emergency_contact_required'],
        help_text="Emergency contact phone number"
    )
    
    emergency_contact_relationship = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Relationship to patient"
    )
    
    # Insurance Information
    insurance_provider = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Insurance provider name"
    )
    
    insurance_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Insurance policy number"
    )
    
    # Administrative Fields
    status = models.CharField(
        max_length=20,
        choices=PatientConfig.get_status_choices(),
        default='ACTIVE',
        help_text="Patient status"
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PatientConfig.get_priority_choices(),
        default='MEDIUM',
        help_text="Patient priority level"
    )
    
    # Additional Fields
    social_security_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Social Security Number (encrypted)"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the patient"
    )
    
    last_visit = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date of last visit"
    )
    
    next_appointment = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Next scheduled appointment"
    )
    
    # Soft delete
    is_active = models.BooleanField(
        default=True,
        help_text="Soft delete flag"
    )
    
    class Meta:
        db_table = 'patient_management_patient'
        ordering = PatientConfig.DATABASE['default_ordering']
        indexes = [
            models.Index(fields=['doctor', 'status']),
            models.Index(fields=['doctor', 'priority']),
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['created_at']),
            models.Index(fields=['date_of_birth']),
        ]
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_status_display()})"
    
    @property
    def full_name(self):
        """Get patient's full name"""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        """Calculate patient's age"""
        if not self.date_of_birth:
            return None
        today = timezone.now().date()
        age = today.year - self.date_of_birth.year
        if today.month < self.date_of_birth.month or \
           (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
            age -= 1
        return age
    
    @property
    def is_critical(self):
        """Check if patient has critical priority"""
        return self.priority == 'CRITICAL'
    
    @property
    def contact_info(self):
        """Get formatted contact information"""
        return {
            'phone': self.phone,
            'email': self.email,
            'address': self.get_full_address()
        }
    
    def get_full_address(self):
        """Get formatted full address"""
        address_parts = [
            self.address,
            self.city,
            self.state,
            self.postal_code,
            self.country
        ]
        return ', '.join([part for part in address_parts if part])
    
    def update_last_visit(self):
        """Update last visit timestamp"""
        self.last_visit = timezone.now()
        self.save(update_fields=['last_visit'])


class PatientNote(TimestampedModel):
    """
    Notes associated with patients
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='patient_notes'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_notes'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_private = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'patient_management_note'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.patient.full_name}"


class PatientAuditLog(TimestampedModel):
    """
    Audit log for patient data changes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='audit_logs'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)  # CREATE, UPDATE, DELETE, VIEW
    changes = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'patient_management_audit_log'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} - {self.patient.full_name} by {self.user.username}"
