"""
Django Management Command: Approve Super Admin
=============================================
Fixes the super admin approval status directly using Django ORM.
This command can be run on Railway deployment.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.conf import settings

User = get_user_model()

class Command(BaseCommand):
    help = 'Approve super admin user and fix login issues'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='tanzeem.agra@rugrel.com',
            help='Email of the super admin to approve'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force update even if user is already approved'
        )
    
    def handle(self, *args, **options):
        email = options['email']
        force = options['force']
        
        self.stdout.write(
            self.style.SUCCESS(f'🚂 Railway Super Admin Approval Command')
        )
        self.stdout.write('=' * 60)
        
        try:
            with transaction.atomic():
                # Get the user
                try:
                    user = User.objects.get(email=email)
                    self.stdout.write(f'✅ Found user: {user.email}')
                    
                    # Display current status
                    self.stdout.write(f'\n📊 Current Status:')
                    self.stdout.write(f'   - ID: {user.id}')
                    self.stdout.write(f'   - Email: {user.email}')
                    self.stdout.write(f'   - Username: {user.username}')
                    self.stdout.write(f'   - Active: {user.is_active}')
                    self.stdout.write(f'   - Staff: {user.is_staff}')
                    self.stdout.write(f'   - Superuser: {user.is_superuser}')
                    self.stdout.write(f'   - Approved: {getattr(user, "is_approved", "N/A")}')
                    self.stdout.write(f'   - Suspended: {getattr(user, "is_suspended", "N/A")}')
                    
                    # Check if needs updating
                    needs_update = (
                        not user.is_active or 
                        not user.is_staff or 
                        not user.is_superuser or
                        not getattr(user, 'is_approved', True) or
                        getattr(user, 'is_suspended', False)
                    )
                    
                    if needs_update or force:
                        self.stdout.write(f'\n🔧 Updating user status...')
                        
                        # Update all status fields
                        user.is_active = True
                        user.is_staff = True
                        user.is_superuser = True
                        
                        if hasattr(user, 'is_approved'):
                            user.is_approved = True
                        if hasattr(user, 'is_suspended'):
                            user.is_suspended = False
                            
                        # Reset password to ensure it's correct
                        user.set_password('Tanzilla@tanzeem786')
                        user.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(f'✅ User updated successfully!')
                        )
                        
                        # Display updated status
                        user.refresh_from_db()
                        self.stdout.write(f'\n📊 Updated Status:')
                        self.stdout.write(f'   - Active: {user.is_active}')
                        self.stdout.write(f'   - Staff: {user.is_staff}')
                        self.stdout.write(f'   - Superuser: {user.is_superuser}')
                        self.stdout.write(f'   - Approved: {getattr(user, "is_approved", "N/A")}')
                        self.stdout.write(f'   - Suspended: {getattr(user, "is_suspended", "N/A")}')
                        
                        # Test authentication
                        from django.contrib.auth import authenticate
                        auth_user = authenticate(username=email, password='Tanzilla@tanzeem786')
                        
                        if auth_user:
                            self.stdout.write(
                                self.style.SUCCESS(f'\n🎉 Authentication test PASSED!')
                            )
                        else:
                            self.stdout.write(
                                self.style.WARNING(f'\n⚠️  Authentication test FAILED!')
                            )
                            
                    else:
                        self.stdout.write(
                            self.style.SUCCESS(f'✅ User is already properly configured!')
                        )
                    
                    # Final summary
                    self.stdout.write(f'\n🔑 Login Credentials:')
                    self.stdout.write(f'   Email: {email}')
                    self.stdout.write(f'   Password: Tanzilla@tanzeem786')
                    self.stdout.write(f'   URL: https://www.rugrel.in/auth/sign-in')
                    
                    self.stdout.write(
                        self.style.SUCCESS(f'\n🎉 Super admin approval completed!')
                    )
                    
                except User.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f'❌ User {email} not found!')
                    )
                    self.stdout.write(f'🔧 Run setup_railway_admin.py first to create the user')
                    return
                    
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error: {e}')
            )
            import traceback
            self.stdout.write(traceback.format_exc())