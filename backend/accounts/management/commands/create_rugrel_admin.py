"""
Django Management Command: Create Rugrel Super Admin
Usage: python manage.py create_rugrel_admin
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Create Rugrel super admin user (admin@rugrel.in)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force update existing user',
        )

    def handle(self, *args, **options):
        """Create or update the Rugrel super admin user"""
        
        self.stdout.write(
            self.style.SUCCESS('🔧 Creating Rugrel Super Admin User...')
        )
        
        # User credentials
        email = 'admin@rugrel.in'
        username = 'admin@rugrel.in'
        password = 'Rugrel@321'
        first_name = 'Rugrel'
        last_name = 'Admin'
        
        try:
            with transaction.atomic():
                # Check if user exists
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': username,
                        'first_name': first_name,
                        'last_name': last_name,
                        'is_staff': True,
                        'is_superuser': True,
                        'is_active': True,
                    }
                )
                
                if created:
                    user.set_password(password)
                    user.save()
                    self.stdout.write(
                        self.style.SUCCESS('✅ New super admin user created!')
                    )
                else:
                    # Update existing user
                    if options['force'] or not user.is_superuser:
                        user.username = username
                        user.first_name = first_name
                        user.last_name = last_name
                        user.is_staff = True
                        user.is_superuser = True
                        user.is_active = True
                        user.set_password(password)
                        user.save()
                        
                        self.stdout.write(
                            self.style.WARNING('🔄 Existing user updated with super admin privileges!')
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING('⚠️  User already exists. Use --force to update.')
                        )
                
                # Create and assign admin group
                admin_group, group_created = Group.objects.get_or_create(
                    name='Administrators'
                )
                
                if group_created:
                    self.stdout.write('🆕 Created Administrators group')
                
                user.groups.add(admin_group)
                
                # Verification
                self.stdout.write('\n' + '=' * 50)
                self.stdout.write(self.style.SUCCESS('🔍 VERIFICATION:'))
                self.stdout.write(f'📧 Email: {user.email}')
                self.stdout.write(f'👤 Username: {user.username}')
                self.stdout.write(f'👨‍💼 Full Name: {user.get_full_name()}')
                self.stdout.write(f'🔐 Is Superuser: {user.is_superuser}')
                self.stdout.write(f'👨‍💻 Is Staff: {user.is_staff}')
                self.stdout.write(f'✅ Is Active: {user.is_active}')
                
                # Test password
                password_valid = user.check_password(password)
                self.stdout.write(
                    f'🔐 Password Check: {"✅ VALID" if password_valid else "❌ INVALID"}'
                )
                
                self.stdout.write('=' * 50)
                self.stdout.write(
                    self.style.SUCCESS('🎉 RUGREL SUPER ADMIN READY!')
                )
                self.stdout.write('📝 Login Credentials:')
                self.stdout.write(f'   • Email: {email}')
                self.stdout.write(f'   • Username: {username}')
                self.stdout.write(f'   • Password: {password}')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating super admin: {e}')
            )
            raise