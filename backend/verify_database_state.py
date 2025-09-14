#!/usr/bin/env python3
"""
DATABASE VERIFICATION UTILITY
=============================
Standalone utility for verifying user database state and super admin configuration.
Provides comprehensive database analysis and validation reports.

Author: GitHub Copilot
Date: 2025-09-14
Purpose: Verify database integrity and super admin configuration
"""

import os
import sys
import django
import json
from datetime import datetime, timezone
from typing import Dict, List, Any
import logging

# Add project directory to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User, Role, UserRole, UserPermission, AuditLog
from django.db import models
from django.contrib.auth.models import Group, Permission as DjangoPermission

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseVerifier:
    """Comprehensive database verification and analysis"""
    
    def __init__(self, target_super_admin: str = 'tanzeem.agra@rugrel.com'):
        self.target_super_admin = target_super_admin
        self.verification_timestamp = datetime.now(timezone.utc)
        
    def get_user_summary(self) -> Dict[str, Any]:
        """Get comprehensive user summary"""
        print("🔍 Analyzing User Database...")
        
        summary = {
            'timestamp': self.verification_timestamp.isoformat(),
            'target_super_admin': self.target_super_admin,
            'total_users': 0,
            'active_users': 0,
            'inactive_users': 0,
            'django_superusers': [],
            'role_based_superusers': [],
            'target_admin_status': {},
            'other_users': [],
            'user_roles_distribution': {},
            'orphaned_roles': [],
            'database_integrity': {}
        }
        
        try:
            # Basic user counts
            all_users = User.objects.all()
            summary['total_users'] = all_users.count()
            summary['active_users'] = User.objects.filter(is_active=True).count()
            summary['inactive_users'] = User.objects.filter(is_active=False).count()
            
            # Django superusers analysis
            django_superusers = User.objects.filter(is_superuser=True)
            for user in django_superusers:
                roles = list(user.roles.filter(is_active=True).values_list('name', flat=True))
                summary['django_superusers'].append({
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_approved': user.is_approved,
                    'roles': roles,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'created_at': user.created_at.isoformat()
                })
            
            # Role-based superusers
            role_superusers = User.objects.filter(
                roles__name='SUPERUSER',
                roles__is_active=True
            ).distinct()
            
            for user in role_superusers:
                roles = list(user.roles.filter(is_active=True).values_list('name', flat=True))
                summary['role_based_superusers'].append({
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'roles': roles,
                    'created_at': user.created_at.isoformat()
                })
            
            # Target admin analysis
            try:
                target_admin = User.objects.get(email=self.target_super_admin)
                target_roles = list(target_admin.roles.filter(is_active=True).values_list('name', flat=True))
                target_permissions = list(target_admin.get_all_permissions().values_list('name', flat=True))
                
                summary['target_admin_status'] = {
                    'exists': True,
                    'id': str(target_admin.id),
                    'username': target_admin.username,
                    'email': target_admin.email,
                    'full_name': target_admin.full_name,
                    'is_active': target_admin.is_active,
                    'is_staff': target_admin.is_staff,
                    'is_superuser': target_admin.is_superuser,
                    'is_approved': target_admin.is_approved,
                    'roles': target_roles,
                    'permissions_count': len(target_permissions),
                    'has_superuser_role': 'SUPERUSER' in target_roles,
                    'last_login': target_admin.last_login.isoformat() if target_admin.last_login else None,
                    'created_at': target_admin.created_at.isoformat(),
                    'profile_complete': bool(target_admin.full_name and target_admin.username)
                }
            except User.DoesNotExist:
                summary['target_admin_status'] = {
                    'exists': False,
                    'message': f"Target super admin {self.target_super_admin} not found in database"
                }
            
            # Other users analysis
            other_users = User.objects.exclude(email=self.target_super_admin)
            for user in other_users:
                roles = list(user.roles.filter(is_active=True).values_list('name', flat=True))
                summary['other_users'].append({
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'roles': roles,
                    'created_at': user.created_at.isoformat(),
                    'should_be_deleted': True
                })
            
            # Role distribution analysis
            roles = Role.objects.filter(is_active=True)
            for role in roles:
                user_count = User.objects.filter(
                    roles=role,
                    userrole__is_active=True
                ).distinct().count()
                
                summary['user_roles_distribution'][role.name] = {
                    'display_name': role.display_name,
                    'user_count': user_count,
                    'description': role.description,
                    'created_at': role.created_at.isoformat()
                }
            
            # Database integrity checks
            summary['database_integrity'] = self.check_database_integrity()
            
        except Exception as e:
            logger.error(f"Error in user summary: {str(e)}")
            summary['error'] = str(e)
        
        return summary
    
    def check_database_integrity(self) -> Dict[str, Any]:
        """Check database integrity and consistency"""
        integrity = {
            'orphaned_user_roles': 0,
            'orphaned_user_permissions': 0,
            'inactive_roles_with_users': 0,
            'users_without_roles': 0,
            'duplicate_emails': 0,
            'issues': [],
            'recommendations': []
        }
        
        try:
            # Check for orphaned user roles
            orphaned_roles = UserRole.objects.filter(
                models.Q(user__isnull=True) | models.Q(role__isnull=True)
            )
            integrity['orphaned_user_roles'] = orphaned_roles.count()
            if orphaned_roles.exists():
                integrity['issues'].append(f"Found {orphaned_roles.count()} orphaned user-role relationships")
            
            # Check for orphaned user permissions
            orphaned_perms = UserPermission.objects.filter(
                models.Q(user__isnull=True) | models.Q(permission__isnull=True)
            )
            integrity['orphaned_user_permissions'] = orphaned_perms.count()
            if orphaned_perms.exists():
                integrity['issues'].append(f"Found {orphaned_perms.count()} orphaned user-permission relationships")
            
            # Check for inactive roles with users
            inactive_roles_with_users = Role.objects.filter(
                is_active=False,
                userrole__is_active=True
            ).distinct()
            integrity['inactive_roles_with_users'] = inactive_roles_with_users.count()
            if inactive_roles_with_users.exists():
                integrity['issues'].append(f"Found {inactive_roles_with_users.count()} inactive roles with active user assignments")
            
            # Check for users without roles
            users_without_roles = User.objects.filter(
                roles__isnull=True
            ).exclude(email=self.target_super_admin)
            integrity['users_without_roles'] = users_without_roles.count()
            if users_without_roles.exists():
                integrity['issues'].append(f"Found {users_without_roles.count()} users without any roles")
            
            # Check for duplicate emails
            from django.db.models import Count
            duplicate_emails = User.objects.values('email').annotate(
                count=Count('email')
            ).filter(count__gt=1)
            integrity['duplicate_emails'] = duplicate_emails.count()
            if duplicate_emails.exists():
                integrity['issues'].append(f"Found {duplicate_emails.count()} duplicate email addresses")
            
            # Generate recommendations
            if not integrity['issues']:
                integrity['recommendations'].append("Database integrity looks good!")
            else:
                integrity['recommendations'].extend([
                    "Consider running database cleanup to resolve integrity issues",
                    "Ensure proper foreign key constraints are in place",
                    "Regular integrity checks recommended"
                ])
                
        except Exception as e:
            logger.error(f"Error in integrity check: {str(e)}")
            integrity['error'] = str(e)
        
        return integrity
    
    def generate_verification_report(self) -> str:
        """Generate comprehensive verification report"""
        print("📋 Generating Database Verification Report...")
        
        summary = self.get_user_summary()
        
        report_lines = [
            "=" * 80,
            "DATABASE VERIFICATION REPORT",
            "=" * 80,
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Target Super Admin: {self.target_super_admin}",
            "",
            "DATABASE OVERVIEW:",
            "-" * 40,
            f"Total Users: {summary.get('total_users', 0)}",
            f"Active Users: {summary.get('active_users', 0)}",
            f"Inactive Users: {summary.get('inactive_users', 0)}",
            f"Django Superusers: {len(summary.get('django_superusers', []))}",
            f"Role-based Superusers: {len(summary.get('role_based_superusers', []))}",
            ""
        ]
        
        # Target admin status
        target_status = summary.get('target_admin_status', {})
        if target_status.get('exists'):
            report_lines.extend([
                "TARGET SUPER ADMIN STATUS:",
                "-" * 40,
                f"✅ Admin Found: {target_status.get('email')}",
                f"   Username: {target_status.get('username')}",
                f"   Full Name: {target_status.get('full_name', 'Not set')}",
                f"   Is Active: {target_status.get('is_active')}",
                f"   Is Django Superuser: {target_status.get('is_superuser')}",
                f"   Is Staff: {target_status.get('is_staff')}",
                f"   Is Approved: {target_status.get('is_approved')}",
                f"   Has SUPERUSER Role: {target_status.get('has_superuser_role')}",
                f"   Roles: {', '.join(target_status.get('roles', []))}",
                f"   Last Login: {target_status.get('last_login', 'Never')}",
                f"   Created: {target_status.get('created_at', 'Unknown')}",
                ""
            ])
        else:
            report_lines.extend([
                "TARGET SUPER ADMIN STATUS:",
                "-" * 40,
                f"❌ Admin NOT Found: {self.target_super_admin}",
                "   Recommendation: Create the target super admin before consolidation",
                ""
            ])
        
        # Other users
        other_users = summary.get('other_users', [])
        if other_users:
            report_lines.extend([
                f"OTHER USERS TO BE DELETED ({len(other_users)}):",
                "-" * 40
            ])
            for i, user in enumerate(other_users[:10], 1):  # Show first 10
                roles_str = ', '.join(user.get('roles', [])) or 'No roles'
                superuser_indicator = "🔴" if user.get('is_superuser') else "🟢"
                report_lines.append(
                    f"{i:2d}. {superuser_indicator} {user.get('username')} ({user.get('email')}) - {roles_str}"
                )
            if len(other_users) > 10:
                report_lines.append(f"    ... and {len(other_users) - 10} more users")
            report_lines.append("")
        else:
            report_lines.extend([
                "OTHER USERS:",
                "-" * 40,
                "✅ No other users found - system already consolidated",
                ""
            ])
        
        # Role distribution
        roles_dist = summary.get('user_roles_distribution', {})
        if roles_dist:
            report_lines.extend([
                "ROLE DISTRIBUTION:",
                "-" * 40
            ])
            for role_name, role_info in roles_dist.items():
                report_lines.append(
                    f"  {role_name}: {role_info.get('user_count', 0)} users ({role_info.get('display_name', role_name)})"
                )
            report_lines.append("")
        
        # Database integrity
        integrity = summary.get('database_integrity', {})
        report_lines.extend([
            "DATABASE INTEGRITY:",
            "-" * 40
        ])
        
        issues = integrity.get('issues', [])
        if issues:
            report_lines.append("⚠️  Issues Found:")
            for issue in issues:
                report_lines.append(f"   - {issue}")
        else:
            report_lines.append("✅ No integrity issues found")
        
        recommendations = integrity.get('recommendations', [])
        if recommendations:
            report_lines.extend(["", "📋 Recommendations:"])
            for rec in recommendations:
                report_lines.append(f"   • {rec}")
        
        # Summary and next steps
        report_lines.extend([
            "",
            "CONSOLIDATION READINESS:",
            "-" * 40
        ])
        
        if target_status.get('exists') and other_users:
            report_lines.extend([
                "✅ Ready for consolidation:",
                f"   - Target admin exists: {self.target_super_admin}",
                f"   - {len(other_users)} users will be removed",
                "",
                "⚠️  NEXT STEPS:",
                "   1. Backup database before proceeding",
                "   2. Run: python super_admin_consolidation.py --dry-run",
                "   3. If dry run looks good: python super_admin_consolidation.py",
                "   4. Verify results with this script again"
            ])
        elif not target_status.get('exists'):
            report_lines.extend([
                "❌ NOT ready for consolidation:",
                f"   - Target admin missing: {self.target_super_admin}",
                "",
                "⚠️  REQUIRED ACTIONS:",
                "   1. Create target super admin first",
                "   2. Assign appropriate roles and permissions",
                "   3. Run this verification again",
                "   4. Proceed with consolidation"
            ])
        elif not other_users:
            report_lines.extend([
                "✅ System already consolidated:",
                f"   - Only admin exists: {self.target_super_admin}",
                "   - No other users found",
                "",
                "✅ NO ACTION NEEDED"
            ])
        
        report_lines.extend([
            "",
            "=" * 80,
            "END OF REPORT",
            "=" * 80
        ])
        
        return "\n".join(report_lines)
    
    def save_verification_data(self, summary: Dict[str, Any]) -> str:
        """Save verification data as JSON for programmatic access"""
        filename = f"db_verification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        print(f"📁 Verification data saved to: {filename}")
        return filename

def main():
    """Main function"""
    print("MEDIXSCAN DATABASE VERIFICATION UTILITY")
    print("=" * 50)
    
    # Check for custom target admin
    target_admin = 'tanzeem.agra@rugrel.com'
    if len(sys.argv) > 1:
        target_admin = sys.argv[1]
    
    print(f"Target Super Admin: {target_admin}")
    print(f"Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    try:
        # Create verifier
        verifier = DatabaseVerifier(target_admin)
        
        # Generate and display report
        report = verifier.generate_verification_report()
        print(report)
        
        # Save detailed data
        summary = verifier.get_user_summary()
        json_file = verifier.save_verification_data(summary)
        
        # Save text report
        report_file = f"verification_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w') as f:
            f.write(report)
        print(f"📄 Report saved to: {report_file}")
        
        print(f"\n✅ Verification completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()