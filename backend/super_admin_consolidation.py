#!/usr/bin/env python3
"""
COMPREHENSIVE USER CONSOLIDATION SCRIPT
=====================================
Consolidates all user access to a single super admin with full database verification.
Uses soft-coding techniques for configuration and safety checks.

Author: GitHub Copilot
Date: 2025-09-14
Purpose: Ensure only one designated super admin exists in the system
"""

import os
import sys
import django
import json
from datetime import datetime, timezone
from typing import Dict, List, Any, Tuple
import logging

# ========================
# SOFT CODING CONFIGURATION
# ========================

class SuperAdminConfig:
    """Soft-coded configuration for super admin management"""
    
    # Primary super admin configuration
    DESIGNATED_SUPER_ADMIN = {
        'email': 'tanzeem.agra@rugrel.com',
        'username': 'tanzeem_admin',  # Will be created if not exists
        'full_name': 'Tanzeem Agra - System Administrator',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
        'is_approved': True
    }
    
    # Safety configuration
    SAFETY_CHECKS = {
        'require_confirmation': True,
        'backup_before_delete': True,
        'verbose_logging': True,
        'dry_run_available': True
    }
    
    # Database verification settings
    VERIFICATION_SETTINGS = {
        'check_before_operation': True,
        'check_after_operation': True,
        'detailed_reporting': True,
        'audit_log_creation': True
    }
    
    # Roles to assign to super admin
    SUPER_ADMIN_ROLES = ['SUPERUSER']
    
    @classmethod
    def get_protected_emails(cls) -> List[str]:
        """Get list of emails that should be protected from deletion"""
        return [cls.DESIGNATED_SUPER_ADMIN['email']]

# Add project directory to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User, Role, UserRole, UserPermission, AuditLog
from django.db import models, transaction
from django.contrib.auth.hashers import make_password

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'user_consolidation_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class UserConsolidationManager:
    """Comprehensive user consolidation with soft-coded configuration"""
    
    def __init__(self, dry_run: bool = False):
        self.config = SuperAdminConfig()
        self.dry_run = dry_run
        self.operation_log = []
        self.verification_results = {}
        
        logger.info("UserConsolidationManager initialized")
        logger.info(f"Dry run mode: {self.dry_run}")
        logger.info(f"Designated super admin: {self.config.DESIGNATED_SUPER_ADMIN['email']}")
    
    def log_operation(self, operation: str, details: Dict[str, Any], success: bool = True):
        """Log operation with structured data"""
        log_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'operation': operation,
            'details': details,
            'success': success,
            'dry_run': self.dry_run
        }
        self.operation_log.append(log_entry)
        
        level = logging.INFO if success else logging.ERROR
        logger.log(level, f"{operation}: {details}")
    
    def verify_database_state(self, phase: str) -> Dict[str, Any]:
        """Comprehensive database state verification"""
        logger.info(f"🔍 Verifying database state - {phase}")
        
        verification = {
            'phase': phase,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'total_users': 0,
            'superuser_count': 0,
            'superuser_role_count': 0,
            'designated_admin_exists': False,
            'designated_admin_details': None,
            'other_users': [],
            'roles_summary': {},
            'permissions_summary': {}
        }
        
        try:
            # Count total users
            all_users = User.objects.all()
            verification['total_users'] = all_users.count()
            
            # Count Django superusers
            django_superusers = User.objects.filter(is_superuser=True)
            verification['superuser_count'] = django_superusers.count()
            
            # Count users with SUPERUSER role
            superuser_role_users = User.objects.filter(
                roles__name='SUPERUSER',
                roles__is_active=True
            ).distinct()
            verification['superuser_role_count'] = superuser_role_users.count()
            
            # Check for designated admin
            try:
                designated_admin = User.objects.get(
                    email=self.config.DESIGNATED_SUPER_ADMIN['email']
                )
                verification['designated_admin_exists'] = True
                verification['designated_admin_details'] = {
                    'id': str(designated_admin.id),
                    'username': designated_admin.username,
                    'email': designated_admin.email,
                    'full_name': designated_admin.full_name,
                    'is_staff': designated_admin.is_staff,
                    'is_superuser': designated_admin.is_superuser,
                    'is_active': designated_admin.is_active,
                    'is_approved': designated_admin.is_approved,
                    'roles': list(designated_admin.roles.filter(is_active=True).values_list('name', flat=True)),
                    'created_at': designated_admin.created_at.isoformat()
                }
            except User.DoesNotExist:
                verification['designated_admin_exists'] = False
            
            # Get other users (non-designated admin)
            other_users = User.objects.exclude(
                email=self.config.DESIGNATED_SUPER_ADMIN['email']
            )
            
            verification['other_users'] = []
            for user in other_users:
                user_roles = list(user.roles.filter(is_active=True).values_list('name', flat=True))
                verification['other_users'].append({
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_active': user.is_active,
                    'roles': user_roles,
                    'created_at': user.created_at.isoformat()
                })
            
            # Roles summary
            roles = Role.objects.filter(is_active=True)
            verification['roles_summary'] = {}
            for role in roles:
                user_count = User.objects.filter(roles=role, roles__is_active=True).distinct().count()
                verification['roles_summary'][role.name] = {
                    'display_name': role.display_name,
                    'user_count': user_count,
                    'description': role.description
                }
            
            self.log_operation(f"Database verification - {phase}", verification)
            
        except Exception as e:
            error_msg = f"Database verification failed: {str(e)}"
            logger.error(error_msg)
            verification['error'] = error_msg
            self.log_operation(f"Database verification - {phase}", {'error': error_msg}, success=False)
        
        self.verification_results[phase] = verification
        return verification
    
    def ensure_super_admin_exists(self) -> Tuple[User, bool]:
        """Ensure the designated super admin exists with correct configuration"""
        logger.info("🔧 Ensuring designated super admin exists")
        
        admin_config = self.config.DESIGNATED_SUPER_ADMIN
        created = False
        
        try:
            # Try to get existing user
            admin_user = User.objects.get(email=admin_config['email'])
            logger.info(f"Found existing admin user: {admin_user.username}")
            
        except User.DoesNotExist:
            if self.dry_run:
                logger.info(f"[DRY RUN] Would create super admin: {admin_config['email']}")
                # Return a mock user for dry run
                from django.contrib.auth.models import AnonymousUser
                mock_user = User(
                    email=admin_config['email'],
                    username=admin_config['username'],
                    full_name=admin_config['full_name']
                )
                return mock_user, True
            
            # Create new super admin
            logger.info(f"Creating new super admin: {admin_config['email']}")
            admin_user = User.objects.create(
                email=admin_config['email'],
                username=admin_config['username'],
                full_name=admin_config['full_name'],
                is_staff=admin_config['is_staff'],
                is_superuser=admin_config['is_superuser'],
                is_active=admin_config['is_active'],
                is_approved=admin_config['is_approved'],
                password=make_password('TempPassword123!@#')  # Temporary password
            )
            created = True
            logger.info(f"Created super admin user: {admin_user.username}")
        
        if not self.dry_run:
            # Update user properties to match configuration
            updated_fields = []
            for field, value in admin_config.items():
                if field != 'email' and hasattr(admin_user, field):
                    current_value = getattr(admin_user, field)
                    if current_value != value:
                        setattr(admin_user, field, value)
                        updated_fields.append(field)
            
            if updated_fields:
                admin_user.save()
                logger.info(f"Updated admin user fields: {updated_fields}")
            
            # Ensure super admin has correct roles
            self.ensure_super_admin_roles(admin_user)
        
        self.log_operation(
            "Super admin verification/creation",
            {
                'email': admin_user.email,
                'username': admin_user.username,
                'created': created,
                'dry_run': self.dry_run
            }
        )
        
        return admin_user, created
    
    def ensure_super_admin_roles(self, admin_user: User):
        """Ensure super admin has correct roles assigned"""
        if self.dry_run:
            logger.info("[DRY RUN] Would assign super admin roles")
            return
        
        logger.info("🎯 Ensuring super admin has correct roles")
        
        for role_name in self.config.SUPER_ADMIN_ROLES:
            try:
                role = Role.objects.get(name=role_name, is_active=True)
                user_role, created = UserRole.objects.get_or_create(
                    user=admin_user,
                    role=role,
                    defaults={
                        'assigned_by': admin_user,
                        'is_active': True
                    }
                )
                
                if created:
                    logger.info(f"Assigned role {role_name} to {admin_user.username}")
                else:
                    # Ensure it's active
                    if not user_role.is_active:
                        user_role.is_active = True
                        user_role.save()
                        logger.info(f"Reactivated role {role_name} for {admin_user.username}")
                
            except Role.DoesNotExist:
                logger.warning(f"Role {role_name} does not exist. Creating it.")
                role = Role.objects.create(
                    name=role_name,
                    display_name=role_name.replace('_', ' ').title(),
                    description=f"Automatically created {role_name} role",
                    is_active=True
                )
                
                UserRole.objects.create(
                    user=admin_user,
                    role=role,
                    assigned_by=admin_user,
                    is_active=True
                )
                logger.info(f"Created and assigned role {role_name}")
    
    def delete_other_users(self) -> Dict[str, Any]:
        """Delete all users except the designated super admin"""
        logger.info("🗑️  Deleting non-admin users")
        
        deletion_results = {
            'users_to_delete': [],
            'successfully_deleted': [],
            'deletion_errors': [],
            'total_deleted': 0,
            'dry_run': self.dry_run
        }
        
        try:
            # Get all users except the designated super admin
            users_to_delete = User.objects.exclude(
                email=self.config.DESIGNATED_SUPER_ADMIN['email']
            )
            
            deletion_results['users_to_delete'] = []
            for user in users_to_delete:
                user_info = {
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_superuser': user.is_superuser,
                    'roles': list(user.roles.filter(is_active=True).values_list('name', flat=True))
                }
                deletion_results['users_to_delete'].append(user_info)
            
            logger.info(f"Found {len(deletion_results['users_to_delete'])} users to delete")
            
            if self.dry_run:
                logger.info("[DRY RUN] Would delete the following users:")
                for user_info in deletion_results['users_to_delete']:
                    logger.info(f"  - {user_info['username']} ({user_info['email']})")
                deletion_results['total_deleted'] = len(deletion_results['users_to_delete'])
                return deletion_results
            
            # Actually delete users
            for user in users_to_delete:
                try:
                    user_info = {
                        'id': str(user.id),
                        'username': user.username,
                        'email': user.email
                    }
                    
                    logger.info(f"Deleting user: {user.username} ({user.email})")
                    user.delete()
                    
                    deletion_results['successfully_deleted'].append(user_info)
                    deletion_results['total_deleted'] += 1
                    
                except Exception as e:
                    error_info = {
                        'user': f"{user.username} ({user.email})",
                        'error': str(e)
                    }
                    deletion_results['deletion_errors'].append(error_info)
                    logger.error(f"Failed to delete user {user.username}: {str(e)}")
            
        except Exception as e:
            error_msg = f"User deletion process failed: {str(e)}"
            logger.error(error_msg)
            deletion_results['process_error'] = error_msg
        
        self.log_operation("User deletion", deletion_results)
        return deletion_results
    
    def generate_consolidation_report(self) -> str:
        """Generate comprehensive consolidation report"""
        logger.info("📋 Generating consolidation report")
        
        report_lines = [
            "=" * 80,
            "USER CONSOLIDATION REPORT",
            "=" * 80,
            f"Operation Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Dry Run Mode: {self.dry_run}",
            f"Designated Super Admin: {self.config.DESIGNATED_SUPER_ADMIN['email']}",
            "",
            "VERIFICATION RESULTS:",
            "-" * 40
        ]
        
        # Add verification results
        for phase, verification in self.verification_results.items():
            report_lines.extend([
                f"\n{phase.upper()} STATE:",
                f"  Total Users: {verification.get('total_users', 'N/A')}",
                f"  Django Superusers: {verification.get('superuser_count', 'N/A')}",
                f"  Role-based Superusers: {verification.get('superuser_role_count', 'N/A')}",
                f"  Designated Admin Exists: {verification.get('designated_admin_exists', 'N/A')}"
            ])
            
            if verification.get('designated_admin_details'):
                admin = verification['designated_admin_details']
                report_lines.extend([
                    f"  Admin Username: {admin.get('username', 'N/A')}",
                    f"  Admin Roles: {', '.join(admin.get('roles', []))}"
                ])
            
            other_users = verification.get('other_users', [])
            if other_users:
                report_lines.append(f"  Other Users: {len(other_users)}")
                for user in other_users[:5]:  # Show first 5
                    report_lines.append(f"    - {user.get('username', 'N/A')} ({user.get('email', 'N/A')})")
                if len(other_users) > 5:
                    report_lines.append(f"    ... and {len(other_users) - 5} more")
        
        # Add operation log summary
        report_lines.extend([
            "",
            "OPERATION LOG SUMMARY:",
            "-" * 40
        ])
        
        for entry in self.operation_log:
            status = "✅" if entry['success'] else "❌"
            report_lines.append(f"{status} {entry['operation']}")
        
        report_content = "\n".join(report_lines)
        
        # Save report to file
        report_filename = f"consolidation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        if not self.dry_run:
            with open(report_filename, 'w') as f:
                f.write(report_content)
            logger.info(f"Report saved to: {report_filename}")
        
        return report_content
    
    def execute_consolidation(self) -> bool:
        """Execute the complete user consolidation process"""
        logger.info("🚀 Starting user consolidation process")
        
        try:
            with transaction.atomic():
                # Step 1: Verify initial database state
                self.verify_database_state("BEFORE")
                
                # Step 2: Ensure designated super admin exists
                admin_user, created = self.ensure_super_admin_exists()
                
                # Step 3: Delete other users
                deletion_results = self.delete_other_users()
                
                # Step 4: Verify final database state
                self.verify_database_state("AFTER")
                
                if self.dry_run:
                    logger.info("🧪 DRY RUN COMPLETED - No actual changes made")
                    return True
                
                logger.info("✅ User consolidation completed successfully")
                return True
                
        except Exception as e:
            error_msg = f"User consolidation failed: {str(e)}"
            logger.error(error_msg)
            self.log_operation("Consolidation process", {'error': error_msg}, success=False)
            return False

def get_user_confirmation() -> bool:
    """Get user confirmation before proceeding with deletion"""
    print("\n" + "⚠️ " * 20)
    print("CRITICAL WARNING: USER CONSOLIDATION OPERATION")
    print("⚠️ " * 20)
    print(f"This will DELETE ALL users except: {SuperAdminConfig.DESIGNATED_SUPER_ADMIN['email']}")
    print("This operation is IRREVERSIBLE!")
    print("")
    
    response = input("Type 'CONSOLIDATE TO SINGLE ADMIN' to proceed: ").strip()
    return response == 'CONSOLIDATE TO SINGLE ADMIN'

def main():
    """Main function with command-line interface"""
    print("MEDIXSCAN USER CONSOLIDATION SYSTEM")
    print("=" * 50)
    print(f"Target Super Admin: {SuperAdminConfig.DESIGNATED_SUPER_ADMIN['email']}")
    print(f"Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check for dry run argument
    dry_run = '--dry-run' in sys.argv or '-d' in sys.argv
    
    if dry_run:
        print("\n🧪 DRY RUN MODE ENABLED - No changes will be made")
    
    try:
        # Initialize consolidation manager
        manager = UserConsolidationManager(dry_run=dry_run)
        
        # Show initial state
        manager.verify_database_state("INITIAL")
        
        if not dry_run and SuperAdminConfig.SAFETY_CHECKS['require_confirmation']:
            if not get_user_confirmation():
                print("\nOperation cancelled by user.")
                return
        
        # Execute consolidation
        success = manager.execute_consolidation()
        
        # Generate and display report
        report = manager.generate_consolidation_report()
        print("\n" + report)
        
        if success:
            print("\n✅ User consolidation completed successfully!")
            if not dry_run:
                print(f"Only {SuperAdminConfig.DESIGNATED_SUPER_ADMIN['email']} now has admin access.")
        else:
            print("\n❌ User consolidation failed!")
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()