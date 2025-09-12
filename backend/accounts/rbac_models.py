# Enhanced RBAC Models for User Management System
# Advanced Role-Based Access Control with Audit Logging

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.core.validators import RegexValidator
import uuid
import json

class RBACRole(models.Model):
    """
    Enhanced Role model with hierarchical permissions and security levels
    """
    SECURITY_LEVELS = [
        (1, 'Basic'),
        (2, 'Standard'), 
        (3, 'Elevated'),
        (4, 'Administrative'),
        (5, 'Super Admin')
    ]
    
    ROLE_CATEGORIES = [
        ('medical', 'Medical Staff'),
        ('technical', 'Technical Staff'),
        ('administrative', 'Administrative'),
        ('system', 'System Roles'),
        ('custom', 'Custom Roles')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=ROLE_CATEGORIES, default='custom')
    security_level = models.IntegerField(choices=SECURITY_LEVELS, default=1)
    
    # Hierarchical permissions
    parent_role = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    permissions = models.ManyToManyField(Permission, blank=True)
    
    # Security features
    is_system_role = models.BooleanField(default=False)  # Cannot be deleted
    requires_approval = models.BooleanField(default=False)
    max_session_duration = models.DurationField(null=True, blank=True)
    ip_restriction_enabled = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='created_roles')
    
    class Meta:
        db_table = 'rbac_roles'
        ordering = ['security_level', 'name']
        
    def __str__(self):
        return f"{self.display_name} (Level {self.security_level})"
    
    def get_all_permissions(self):
        """Get all permissions including inherited from parent roles"""
        permissions = set(self.permissions.all())
        if self.parent_role:
            permissions.update(self.parent_role.get_all_permissions())
        return permissions

class RBACPermissionGroup(models.Model):
    """
    Logical grouping of permissions for easier management
    """
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    permissions = models.ManyToManyField(Permission)
    is_critical = models.BooleanField(default=False)  # Requires additional approval
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rbac_permission_groups'
        ordering = ['category', 'name']
        
    def __str__(self):
        return self.display_name

class UserSecurityProfile(models.Model):
    """
    Enhanced security profile for users with advanced tracking
    """
    ACCOUNT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
        ('locked', 'Locked'),
        ('pending_approval', 'Pending Approval'),
        ('expired', 'Expired'),
        ('archived', 'Archived')
    ]
    
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='security_profile')
    
    # Security settings
    force_password_change = models.BooleanField(default=False)
    password_expires_at = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
    # Access control
    allowed_ip_addresses = models.JSONField(default=list, blank=True)
    session_timeout_minutes = models.IntegerField(default=60)
    concurrent_sessions_allowed = models.IntegerField(default=1)
    
    # Compliance tracking
    last_compliance_check = models.DateTimeField(null=True, blank=True)
    requires_reauthorization = models.BooleanField(default=False)
    data_access_level = models.CharField(max_length=20, default='standard')
    
    # Status and approval
    account_status = models.CharField(max_length=20, choices=ACCOUNT_STATUS_CHOICES, default='pending_approval')
    approved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_users')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_security_profiles'
        
    def __str__(self):
        return f"Security Profile: {self.user.username}"
    
    def is_account_locked(self):
        """Check if account is currently locked"""
        if self.account_locked_until:
            return timezone.now() < self.account_locked_until
        return False
    
    def reset_failed_attempts(self):
        """Reset failed login attempts"""
        self.failed_login_attempts = 0
        self.last_failed_login = None
        self.account_locked_until = None
        self.save()

class UserActivityLog(models.Model):
    """
    Comprehensive audit logging for user activities
    """
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('password_change', 'Password Change'),
        ('role_change', 'Role Change'),
        ('permission_change', 'Permission Change'),
        ('profile_update', 'Profile Update'),
        ('data_access', 'Data Access'),
        ('system_action', 'System Action'),
        ('security_event', 'Security Event'),
        ('admin_action', 'Admin Action')
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='activity_logs')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, default='low')
    
    # Activity details
    action = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)  # Additional context data
    
    # Request information
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    
    # Results and status
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    
    # Audit trail
    performed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='performed_actions')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activity_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['activity_type', '-timestamp']),
            models.Index(fields=['severity', '-timestamp']),
        ]
        
    def __str__(self):
        return f"{self.user.username} - {self.action} ({self.timestamp})"

class RoleAssignment(models.Model):
    """
    Track role assignments with approval workflow and expiration
    """
    ASSIGNMENT_STATUS = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked'),
        ('rejected', 'Rejected')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='role_assignments')
    role = models.ForeignKey(RBACRole, on_delete=models.CASCADE, related_name='assignments')
    
    # Assignment details
    status = models.CharField(max_length=20, choices=ASSIGNMENT_STATUS, default='pending')
    reason = models.TextField(blank=True)
    conditions = models.JSONField(default=dict, blank=True)  # Special conditions or restrictions
    
    # Time-based access
    effective_from = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Approval workflow
    requested_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='requested_roles')
    approved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_role_assignments')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'role_assignments'
        unique_together = ['user', 'role']
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.username} -> {self.role.name} ({self.status})"
    
    def is_active(self):
        """Check if role assignment is currently active"""
        if self.status != 'active':
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return timezone.now() >= self.effective_from

class UserSession(models.Model):
    """
    Track active user sessions for security monitoring
    """
    session_key = models.CharField(max_length=40, primary_key=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='active_sessions')
    
    # Session details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    location = models.CharField(max_length=200, blank=True)  # Geo-location if available
    
    # Security flags
    is_suspicious = models.BooleanField(default=False)
    risk_score = models.IntegerField(default=0)  # 0-100 risk assessment
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        db_table = 'user_sessions'
        ordering = ['-last_activity']
        
    def __str__(self):
        return f"{self.user.username} - {self.ip_address}"
    
    def is_expired(self):
        """Check if session has expired"""
        return timezone.now() > self.expires_at


class RegistrationNotification(models.Model):
    """
    Model to track doctor registration requests for super admin approval
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Professional Information
    medical_license = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=200, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    workplace = models.CharField(max_length=300, blank=True)
    
    # Registration Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Approval/Rejection Information
    processed_by = models.ForeignKey(
        'accounts.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='processed_registrations'
    )
    processed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Additional Information
    additional_notes = models.TextField(blank=True)
    registration_ip = models.GenericIPAddressField(null=True, blank=True)
    verification_token = models.CharField(max_length=255, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'registration_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.status}"
    
    def get_full_name(self):
        """Return the full name of the doctor"""
        return f"{self.first_name} {self.last_name}"
    
    def approve(self, admin_user):
        """Approve the registration"""
        self.status = 'approved'
        self.processed_by = admin_user
        self.processed_at = timezone.now()
        self.save()
    
    def reject(self, admin_user, reason=""):
        """Reject the registration"""
        self.status = 'rejected'
        self.processed_by = admin_user
        self.processed_at = timezone.now()
        self.rejection_reason = reason
        self.save()
