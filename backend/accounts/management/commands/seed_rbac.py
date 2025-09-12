from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role, Permission, UserRole, UserPermission, RolePermission
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with initial RBAC data'

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write(self.style.SUCCESS('Starting RBAC data seeding...'))
            
            # Create Roles
            self._create_roles()
            
            # Create Permissions
            self._create_permissions()
            
            # Assign Permissions to Roles
            self._assign_role_permissions()
            
            # Create Initial Users
            self._create_users()
            
            self.stdout.write(self.style.SUCCESS('RBAC data seeding completed successfully!'))

    def _create_roles(self):
        """Create initial roles"""
        roles_data = [
            {
                'name': 'SUPERUSER',
                'display_name': 'Super User',
                'description': 'Full system access with all permissions'
            },
            {
                'name': 'DOCTOR',
                'display_name': 'Doctor',
                'description': 'Medical professional with scan and report access'
            },
            {
                'name': 'TECHNICIAN',
                'display_name': 'Technician',
                'description': 'Technical staff with limited system access'
            },
            {
                'name': 'PATIENT',
                'display_name': 'Patient',
                'description': 'Patient with access to their own records'
            },
            {
                'name': 'ADMIN',
                'display_name': 'Administrator',
                'description': 'System administrator with management capabilities'
            }
        ]
        
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults={
                    'display_name': role_data['display_name'],
                    'description': role_data['description']
                }
            )
            if created:
                self.stdout.write(f'Created role: {role.display_name}')
            else:
                self.stdout.write(f'Role already exists: {role.display_name}')

    def _create_permissions(self):
        """Create initial permissions"""
        permissions_data = [
            # Scan Management
            {
                'name': 'Upload Scan',
                'codename': 'upload_scan',
                'description': 'Permission to upload medical scans',
                'category': 'SCAN'
            },
            {
                'name': 'View Scan',
                'codename': 'view_scan',
                'description': 'Permission to view medical scans',
                'category': 'SCAN'
            },
            {
                'name': 'Delete Scan',
                'codename': 'delete_scan',
                'description': 'Permission to delete medical scans',
                'category': 'SCAN'
            },
            {
                'name': 'Approve Scan',
                'codename': 'approve_scan',
                'description': 'Permission to approve medical scans',
                'category': 'SCAN'
            },
            
            # Report Management
            {
                'name': 'Create Report',
                'codename': 'create_report',
                'description': 'Permission to create medical reports',
                'category': 'REPORT'
            },
            {
                'name': 'View Report',
                'codename': 'view_report',
                'description': 'Permission to view medical reports',
                'category': 'REPORT'
            },
            {
                'name': 'Edit Report',
                'codename': 'edit_report',
                'description': 'Permission to edit medical reports',
                'category': 'REPORT'
            },
            {
                'name': 'Delete Report',
                'codename': 'delete_report',
                'description': 'Permission to delete medical reports',
                'category': 'REPORT'
            },
            {
                'name': 'Approve Report',
                'codename': 'approve_report',
                'description': 'Permission to approve medical reports',
                'category': 'REPORT'
            },
            
            # User Management
            {
                'name': 'Create User',
                'codename': 'create_user',
                'description': 'Permission to create new users',
                'category': 'USER'
            },
            {
                'name': 'View User',
                'codename': 'view_user',
                'description': 'Permission to view user information',
                'category': 'USER'
            },
            {
                'name': 'Edit User',
                'codename': 'edit_user',
                'description': 'Permission to edit user information',
                'category': 'USER'
            },
            {
                'name': 'Delete User',
                'codename': 'delete_user',
                'description': 'Permission to delete users',
                'category': 'USER'
            },
            {
                'name': 'Manage Users',
                'codename': 'manage_users',
                'description': 'Permission to manage user accounts and permissions',
                'category': 'USER'
            },
            
            # Patient Management
            {
                'name': 'Create Patient',
                'codename': 'create_patient',
                'description': 'Permission to create patient records',
                'category': 'PATIENT'
            },
            {
                'name': 'View Patient',
                'codename': 'view_patient',
                'description': 'Permission to view patient records',
                'category': 'PATIENT'
            },
            {
                'name': 'Edit Patient',
                'codename': 'edit_patient',
                'description': 'Permission to edit patient records',
                'category': 'PATIENT'
            },
            {
                'name': 'Delete Patient',
                'codename': 'delete_patient',
                'description': 'Permission to delete patient records',
                'category': 'PATIENT'
            },
            
            # System Administration
            {
                'name': 'System Settings',
                'codename': 'system_settings',
                'description': 'Permission to modify system settings',
                'category': 'SYSTEM'
            },
            {
                'name': 'View Audit Logs',
                'codename': 'view_audit_logs',
                'description': 'Permission to view system audit logs',
                'category': 'SYSTEM'
            },
            {
                'name': 'Backup System',
                'codename': 'backup_system',
                'description': 'Permission to perform system backups',
                'category': 'SYSTEM'
            },
            {
                'name': 'System Admin',
                'codename': 'system_admin',
                'description': 'Full system administration permissions',
                'category': 'SYSTEM'
            }
        ]
        
        for perm_data in permissions_data:
            permission, created = Permission.objects.get_or_create(
                codename=perm_data['codename'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description'],
                    'category': perm_data['category']
                }
            )
            if created:
                self.stdout.write(f'Created permission: {permission.name}')
            else:
                self.stdout.write(f'Permission already exists: {permission.name}')

    def _assign_role_permissions(self):
        """Assign permissions to roles"""
        role_permissions = {
            'SUPERUSER': [
                # SuperUser gets ALL permissions
                'upload_scan', 'view_scan', 'delete_scan', 'approve_scan',
                'create_report', 'view_report', 'edit_report', 'delete_report', 'approve_report',
                'create_user', 'view_user', 'edit_user', 'delete_user', 'manage_users',
                'create_patient', 'view_patient', 'edit_patient', 'delete_patient',
                'system_settings', 'view_audit_logs', 'backup_system', 'system_admin'
            ],
            'DOCTOR': [
                # Doctor gets medical-related permissions
                'upload_scan', 'view_scan', 'approve_scan',
                'create_report', 'view_report', 'edit_report', 'approve_report',
                'create_patient', 'view_patient', 'edit_patient'
            ],
            'TECHNICIAN': [
                # Technician gets limited scan and view permissions
                'upload_scan', 'view_scan',
                'view_report',
                'view_patient'
            ],
            'PATIENT': [
                # Patient gets very limited permissions (own records only)
                'view_report',
                'view_patient'
            ],
            'ADMIN': [
                # Admin gets management permissions but not medical
                'view_user', 'edit_user', 'manage_users',
                'view_patient', 'edit_patient',
                'system_settings', 'view_audit_logs', 'backup_system'
            ]
        }
        
        for role_name, permission_codenames in role_permissions.items():
            try:
                role = Role.objects.get(name=role_name)
                for perm_codename in permission_codenames:
                    try:
                        permission = Permission.objects.get(codename=perm_codename)
                        role_perm, created = RolePermission.objects.get_or_create(
                            role=role,
                            permission=permission
                        )
                        if created:
                            self.stdout.write(f'Assigned {permission.name} to {role.display_name}')
                    except Permission.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(f'Permission {perm_codename} not found')
                        )
            except Role.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Role {role_name} not found')
                )

    def _create_users(self):
        """Create initial users"""
        users_data = [
            {
                'username': 'superuser',
                'email': 'tanzeem.agra@rugrel.com',
                'password': 'Tanzilla@tanzeem786',
                'full_name': 'Tanzeem Agra',
                'department': 'Administration',
                'employee_id': 'SUPER001',
                'is_approved': True,
                'is_staff': True,
                'is_superuser': True,
                'roles': ['SUPERUSER']
            },
            {
                'username': 'dr_smith',
                'email': 'dr.smith@radiology.com',
                'password': 'doctor123',
                'full_name': 'Dr. John Smith',
                'department': 'Radiology',
                'employee_id': 'DOC001',
                'is_approved': True,
                'roles': ['DOCTOR'],
                'permissions': ['upload_scan', 'view_report', 'approve_report']
            },
            {
                'username': 'dr_johnson',
                'email': 'dr.johnson@radiology.com',
                'password': 'doctor123',
                'full_name': 'Dr. Sarah Johnson',
                'department': 'Cardiology',
                'employee_id': 'DOC002',
                'is_approved': True,
                'roles': ['DOCTOR'],
                'permissions': ['upload_scan', 'view_report']  # Different permissions
            }
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'full_name': user_data['full_name'],
                    'department': user_data['department'],
                    'employee_id': user_data['employee_id'],
                    'is_approved': user_data['is_approved'],
                    'is_staff': user_data.get('is_staff', False),
                    'is_superuser': user_data.get('is_superuser', False)
                }
            )
            
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'Created user: {user.email}')
                
                # Assign roles
                for role_name in user_data.get('roles', []):
                    try:
                        role = Role.objects.get(name=role_name)
                        UserRole.objects.get_or_create(user=user, role=role)
                        self.stdout.write(f'Assigned role {role_name} to {user.email}')
                    except Role.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(f'Role {role_name} not found')
                        )
                
                # Assign direct permissions
                for perm_codename in user_data.get('permissions', []):
                    try:
                        permission = Permission.objects.get(codename=perm_codename)
                        UserPermission.objects.get_or_create(user=user, permission=permission)
                        self.stdout.write(f'Assigned permission {perm_codename} to {user.email}')
                    except Permission.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(f'Permission {perm_codename} not found')
                        )
            else:
                self.stdout.write(f'User already exists: {user.email}')
        
        # Display summary
        self.stdout.write(self.style.SUCCESS('\n=== RBAC Setup Summary ==='))
        self.stdout.write(f'Roles created: {Role.objects.count()}')
        self.stdout.write(f'Permissions created: {Permission.objects.count()}')
        self.stdout.write(f'Users created: {User.objects.count()}')
        self.stdout.write('\n=== Login Credentials ===')
        self.stdout.write('SuperUser:')
        self.stdout.write('  Email: tanzeem.agra@rugrel.com')
        self.stdout.write('  Password: Tanzilla@tanzeem786')
        self.stdout.write('\nDoctors:')
        self.stdout.write('  Email: dr.smith@radiology.com')
        self.stdout.write('  Password: doctor123')
        self.stdout.write('  Email: dr.johnson@radiology.com')
        self.stdout.write('  Password: doctor123')
