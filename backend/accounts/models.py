from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import uuid

class Role(models.Model):
    """
    Role model for RBAC system
    """
    ROLE_CHOICES = [
        ('SUPERUSER', 'Super User'),
        ('DOCTOR', 'Doctor'),
        ('TECHNICIAN', 'Technician'),
        ('PATIENT', 'Patient'),
        ('ADMIN', 'Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auth_roles'
        ordering = ['name']
    
    def __str__(self):
        return self.display_name

class Permission(models.Model):
    """
    Permission model for RBAC system
    """
    PERMISSION_CATEGORIES = [
        ('SCAN', 'Scan Management'),
        ('REPORT', 'Report Management'),
        ('USER', 'User Management'),
        ('SYSTEM', 'System Administration'),
        ('PATIENT', 'Patient Management'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=PERMISSION_CATEGORIES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auth_permissions'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.category})"

class User(AbstractUser):
    """
    Extended User model with RBAC support
    """
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    gmail = models.EmailField(blank=True, null=True)  # Keep for compatibility
    report_history = models.JSONField(default=list, blank=True)
    
    # RBAC fields
    roles = models.ManyToManyField(Role, through='UserRole', through_fields=('user', 'role'), blank=True)
    permissions = models.ManyToManyField(Permission, through='UserPermission', through_fields=('user', 'permission'), blank=True)
    
    # Profile fields
    full_name = models.CharField(max_length=200, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    
    # Status fields
    is_approved = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'auth_users'
    
    def __str__(self):
        return f"{self.full_name or self.username} ({self.email})"
    
    def has_role(self, role_name):
        """Check if user has a specific role"""
        return self.roles.filter(name=role_name, is_active=True).exists()
    
    def has_permission(self, permission_codename):
        """Check if user has a specific permission"""
        # Check direct permissions
        if self.permissions.filter(codename=permission_codename, is_active=True).exists():
            return True
        
        # Check role-based permissions
        role_permissions = Permission.objects.filter(
            rolepermission__role__in=self.roles.filter(is_active=True),
            codename=permission_codename,
            is_active=True
        )
        return role_permissions.exists()
    
    def get_all_permissions(self):
        """Get all permissions for the user (direct + role-based)"""
        direct_permissions = self.permissions.filter(is_active=True)
        role_permissions = Permission.objects.filter(
            rolepermission__role__in=self.roles.filter(is_active=True),
            is_active=True
        )
        return (direct_permissions | role_permissions).distinct()
    
    def is_superuser_role(self):
        """Check if user has SuperUser role"""
        return self.has_role('SUPERUSER')
    
    def is_doctor_role(self):
        """Check if user has Doctor role"""
        return self.has_role('DOCTOR')
    
    def can_manage_users(self):
        """Check if user can manage other users"""
        return self.has_permission('manage_users') or self.is_superuser_role()

class UserRole(models.Model):
    """
    User-Role relationship model
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'auth_user_roles'
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.username} - {self.role.display_name}"

class UserPermission(models.Model):
    """
    User-Permission relationship model (direct permissions)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_permissions')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'auth_user_permissions'
        unique_together = ['user', 'permission']
    
    def __str__(self):
        return f"{self.user.username} - {self.permission.name}"

class RolePermission(models.Model):
    """
    Role-Permission relationship model
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='role_permissions_assigned')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'auth_role_permissions'
        unique_together = ['role', 'permission']
    
    def __str__(self):
        return f"{self.role.display_name} - {self.permission.name}"

class UserProfile(models.Model):
    """
    Extended user profile information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # Duplicate but kept for compatibility
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=200, blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Professional information
    license_number = models.CharField(max_length=100, blank=True, null=True)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Remove the conflicting fields for now
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auth_user_profiles'
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class AuditLog(models.Model):
    """
    Audit log for tracking user actions
    """
    ACTION_CHOICES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('CREATE', 'Create Record'),
        ('UPDATE', 'Update Record'),
        ('DELETE', 'Delete Record'),
        ('PERMISSION_GRANT', 'Permission Granted'),
        ('PERMISSION_REVOKE', 'Permission Revoked'),
        ('ROLE_ASSIGN', 'Role Assigned'),
        ('ROLE_REMOVE', 'Role Removed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    resource_id = models.CharField(max_length=100, blank=True, null=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'auth_audit_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"
