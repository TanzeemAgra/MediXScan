import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User

print("=== DATABASE USERS ===")
users = User.objects.all()
print(f"Total users: {users.count()}")

for user in users:
    roles = list(user.roles.values_list('name', flat=True))
    print(f"\nUser: {user.username}")
    print(f"Email: {user.email}")
    print(f"Superuser: {user.is_superuser}")
    print(f"Roles: {roles}")
