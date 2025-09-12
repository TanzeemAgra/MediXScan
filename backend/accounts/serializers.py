from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User, Role, Permission, UserRole, UserPermission, RolePermission, UserProfile, AuditLog


class PermissionSerializer(serializers.ModelSerializer):
    """
    Serializer for Permission model
    """
    class Meta:
        model = Permission
        fields = [
            'id', 'name', 'codename', 'description', 'category', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for Role model
    """
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Role
        fields = [
            'id', 'name', 'display_name', 'description', 'is_active',
            'permissions', 'permission_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_permission_count(self, obj):
        return obj.rolepermission_set.filter(is_active=True).count()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model
    """
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'bio', 'avatar', 'date_of_birth', 'address',
            'emergency_contact', 'emergency_phone', 'license_number',
            'specialization', 'years_of_experience'
        ]


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for User list view (minimal fields)
    """
    roles = serializers.StringRelatedField(many=True, read_only=True)
    role_names = serializers.SerializerMethodField()
    is_superuser_role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'department', 'employee_id',
            'is_active', 'is_approved', 'is_suspended', 'roles', 'role_names',
            'is_superuser_role', 'last_login', 'created_at'
        ]
    
    def get_role_names(self, obj):
        return [role.name for role in obj.roles.filter(is_active=True)]
    
    def get_is_superuser_role(self, obj):
        return obj.is_superuser_role()


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for User detail view (full fields)
    """
    roles = RoleSerializer(many=True, read_only=True)
    permissions = PermissionSerializer(many=True, read_only=True)
    profile = UserProfileSerializer(read_only=True)
    role_names = serializers.SerializerMethodField()
    permission_codenames = serializers.SerializerMethodField()
    all_permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone_number', 'department',
            'employee_id', 'is_active', 'is_approved', 'is_suspended', 'is_staff',
            'roles', 'permissions', 'profile', 'role_names', 'permission_codenames',
            'all_permissions', 'last_login', 'last_login_ip', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_login', 'created_at', 'updated_at']
    
    def get_role_names(self, obj):
        return [role.name for role in obj.roles.filter(is_active=True)]
    
    def get_permission_codenames(self, obj):
        return [perm.codename for perm in obj.permissions.filter(is_active=True)]
    
    def get_all_permissions(self, obj):
        all_perms = obj.get_all_permissions()
        return PermissionSerializer(all_perms, many=True).data


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users (Doctor creation by SuperUser)
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    roles = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    permissions = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'full_name',
            'phone_number', 'department', 'employee_id', 'is_approved',
            'roles', 'permissions'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])
        permissions_data = validated_data.pop('permissions', [])
        validated_data.pop('password_confirm')
        
        # Hash password
        validated_data['password'] = make_password(validated_data['password'])
        
        user = User.objects.create(**validated_data)
        
        # Assign roles
        for role_name in roles_data:
            try:
                role = Role.objects.get(name=role_name)
                UserRole.objects.create(user=user, role=role)
            except Role.DoesNotExist:
                pass
        
        # Assign permissions
        for perm_codename in permissions_data:
            try:
                permission = Permission.objects.get(codename=perm_codename)
                UserPermission.objects.create(user=user, permission=permission)
            except Permission.DoesNotExist:
                pass
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user information
    """
    roles = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    permissions = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = User
        fields = [
            'full_name', 'phone_number', 'department', 'employee_id',
            'is_approved', 'is_suspended', 'roles', 'permissions'
        ]
    
    def update(self, instance, validated_data):
        roles_data = validated_data.pop('roles', None)
        permissions_data = validated_data.pop('permissions', None)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update roles if provided
        if roles_data is not None:
            # Clear existing roles
            UserRole.objects.filter(user=instance).delete()
            
            # Add new roles
            for role_name in roles_data:
                try:
                    role = Role.objects.get(name=role_name)
                    UserRole.objects.create(user=instance, role=role)
                except Role.DoesNotExist:
                    pass
        
        # Update permissions if provided
        if permissions_data is not None:
            # Clear existing permissions
            UserPermission.objects.filter(user=instance).delete()
            
            # Add new permissions
            for perm_codename in permissions_data:
                try:
                    permission = Permission.objects.get(codename=perm_codename)
                    UserPermission.objects.create(user=instance, permission=permission)
                except Permission.DoesNotExist:
                    pass
        
        return instance


class AssignRoleSerializer(serializers.Serializer):
    """
    Serializer for assigning roles to users
    """
    user_id = serializers.UUIDField()
    role_name = serializers.CharField()
    expires_at = serializers.DateTimeField(required=False)
    
    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value
    
    def validate_role_name(self, value):
        try:
            Role.objects.get(name=value)
        except Role.DoesNotExist:
            raise serializers.ValidationError("Role not found")
        return value


class AssignPermissionSerializer(serializers.Serializer):
    """
    Serializer for assigning permissions to users
    """
    user_id = serializers.UUIDField()
    permission_codename = serializers.CharField()
    expires_at = serializers.DateTimeField(required=False)
    
    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value
    
    def validate_permission_codename(self, value):
        try:
            Permission.objects.get(codename=value)
        except Permission.DoesNotExist:
            raise serializers.ValidationError("Permission not found")
        return value


# Legacy serializers for backward compatibility
class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Legacy registration serializer (kept for compatibility)
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'gmail']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Enhanced login serializer with RBAC support
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            if user.is_suspended:
                raise serializers.ValidationError('User account is suspended.')
            
            if not user.is_approved:
                raise serializers.ValidationError('User account is pending approval.')
            
            attrs['user'] = user
            return attrs
        
        raise serializers.ValidationError('Email and password are required.')


class UserSerializer(serializers.ModelSerializer):
    """
    Basic user serializer (legacy)
    """
    roles = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'gmail', 'full_name', 'first_name', 'last_name',
            'is_superuser', 'is_staff', 'is_active', 'roles', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for Audit Log
    """
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'action', 'resource_type', 'resource_id',
            'details', 'ip_address', 'user_agent', 'timestamp'
        ]
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    suspended_users = serializers.IntegerField()
    pending_approval = serializers.IntegerField()
    users_by_role = serializers.DictField()
    recent_logins = serializers.ListField()
    permission_distribution = serializers.DictField()
    
    class Meta:
        model = UserProfile
        fields = ['user', 'phone_number', 'bio', 'avatar', 'date_of_birth']
