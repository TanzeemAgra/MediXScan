from django.core.management.base import BaseCommand
from accounts.models import User, Role, UserRole
from django.db import transaction, models

class Command(BaseCommand):
    help = 'Clean up database users, keeping only super admin'

    def add_arguments(self, parser):
        parser.add_argument(
            '--list-only',
            action='store_true',
            help='Only list users without deleting',
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion of non-admin users',
        )

    def handle(self, *args, **options):
        self.stdout.write("=== DATABASE USER MANAGEMENT ===\n")
        
        # List all users
        self.list_users()
        
        if options['list_only']:
            return
        
        # Identify users to delete
        super_admin_emails = ['tanzeem.agra@rugrel.com']
        users_to_delete = User.objects.exclude(
            models.Q(is_superuser=True) |
            models.Q(email__in=super_admin_emails) |
            models.Q(roles__name='SUPERUSER')
        ).distinct()
        
        if not users_to_delete.exists():
            self.stdout.write(self.style.SUCCESS("No non-admin users to delete."))
            return
        
        self.stdout.write(f"\nFound {users_to_delete.count()} users to delete:")
        for user in users_to_delete:
            roles = list(user.roles.values_list('name', flat=True))
            self.stdout.write(f"  - {user.username} ({user.email}) - Roles: {roles}")
        
        if not options['confirm']:
            self.stdout.write(self.style.WARNING("\nAdd --confirm flag to actually delete these users."))
            return
        
        # Delete users
        self.delete_users(users_to_delete)
        
        # List users after deletion
        self.stdout.write("\n=== USERS AFTER CLEANUP ===")
        self.list_users()

    def list_users(self):
        """List all users with their details"""
        users = User.objects.all().order_by('created_at')
        
        if not users.exists():
            self.stdout.write("No users found in database.")
            return
        
        self.stdout.write(f"Total users: {users.count()}\n")
        
        for user in users:
            roles = list(user.roles.values_list('name', flat=True))
            
            self.stdout.write(f"Username: {user.username}")
            self.stdout.write(f"Email: {user.email}")
            self.stdout.write(f"Full Name: {user.full_name or 'Not set'}")
            self.stdout.write(f"Roles: {', '.join(roles) if roles else 'No roles'}")
            self.stdout.write(f"Is Superuser: {user.is_superuser}")
            self.stdout.write(f"Is Active: {user.is_active}")
            self.stdout.write(f"Created: {user.created_at}")
            
            # Check if protected
            is_protected = (
                user.is_superuser or
                'SUPERUSER' in roles or
                user.email == 'tanzeem.agra@rugrel.com'
            )
            
            if is_protected:
                self.stdout.write(self.style.SUCCESS("Status: PROTECTED (Super Admin)"))
            else:
                self.stdout.write(self.style.WARNING("Status: Will be deleted"))
            
            self.stdout.write("-" * 50)

    def delete_users(self, users_to_delete):
        """Delete specified users"""
        deleted_count = 0
        
        with transaction.atomic():
            for user in users_to_delete:
                try:
                    username = user.username
                    email = user.email
                    
                    self.stdout.write(f"Deleting: {username} ({email})")
                    user.delete()
                    deleted_count += 1
                    
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"Error deleting {user.username}: {str(e)}")
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f"\nSuccessfully deleted {deleted_count} users.")
        )
