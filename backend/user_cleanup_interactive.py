"""
User Database Cleanup Script
Execute with: python manage.py shell < this_script.py
"""

from accounts.models import User, Role

print("=== CURRENT DATABASE USERS ===")

users = User.objects.all()
print(f"Total users in database: {users.count()}")

if users.count() == 0:
    print("No users found!")
    exit()

print("\nUser Details:")
print("-" * 60)

super_admin_count = 0
regular_user_count = 0

for user in users:
    roles = list(user.roles.values_list('name', flat=True))
    
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Full Name: {user.full_name or 'Not set'}")
    print(f"Roles: {', '.join(roles) if roles else 'No roles assigned'}")
    print(f"Is Django Superuser: {user.is_superuser}")
    print(f"Is Active: {user.is_active}")
    print(f"Is Approved: {user.is_approved}")
    print(f"Created: {user.created_at}")
    
    # Determine if this is a super admin
    is_super_admin = (
        user.is_superuser or 
        'SUPERUSER' in roles or 
        user.email == 'tanzeem.agra@rugrel.com'
    )
    
    if is_super_admin:
        print("🔒 STATUS: SUPER ADMIN (PROTECTED)")
        super_admin_count += 1
    else:
        print("❌ STATUS: REGULAR USER (WILL BE DELETED)")
        regular_user_count += 1
    
    print("-" * 60)

print(f"\nSUMMARY:")
print(f"Super Admins (protected): {super_admin_count}")
print(f"Regular Users (to delete): {regular_user_count}")

# If user wants to proceed with deletion
proceed = input(f"\nDo you want to DELETE {regular_user_count} regular users? Type 'YES DELETE ALL' to confirm: ")

if proceed == 'YES DELETE ALL':
    print("\nProceeding with deletion...")
    
    # Define criteria for super admin
    super_admin_emails = ['tanzeem.agra@rugrel.com']
    
    # Get users to delete (exclude super admins)
    from django.db.models import Q
    users_to_delete = User.objects.exclude(
        Q(is_superuser=True) |
        Q(email__in=super_admin_emails) |
        Q(roles__name='SUPERUSER')
    ).distinct()
    
    deleted_count = 0
    for user in users_to_delete:
        try:
            print(f"Deleting: {user.username} ({user.email})")
            user.delete()
            deleted_count += 1
        except Exception as e:
            print(f"Error deleting {user.username}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count} users.")
    
    # Show remaining users
    remaining_users = User.objects.all()
    print(f"\nRemaining users: {remaining_users.count()}")
    for user in remaining_users:
        print(f"  - {user.username} ({user.email})")
        
else:
    print("Deletion cancelled.")

print("\nScript completed.")
