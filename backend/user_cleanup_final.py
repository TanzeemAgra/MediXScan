import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User
from django.db.models import Q

def list_users():
    """List all users in database"""
    print("=== CURRENT DATABASE USERS ===")
    users = User.objects.all()
    print(f"Total users in database: {users.count()}")
    
    if users.count() == 0:
        print("No users found in database!")
        return []
    
    user_list = []
    for i, user in enumerate(users, 1):
        roles = list(user.roles.values_list('name', flat=True))
        
        print(f"\n{i}. Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Full Name: {user.full_name or 'Not set'}")
        print(f"   Roles: {', '.join(roles) if roles else 'No roles assigned'}")
        print(f"   Django Superuser: {user.is_superuser}")
        print(f"   Is Active: {user.is_active}")
        print(f"   Is Approved: {user.is_approved}")
        print(f"   Created: {user.created_at}")
        
        # Check if this user is a super admin
        is_super_admin = (
            user.is_superuser or 
            'SUPERUSER' in roles or 
            user.email == 'tanzeem.agra@rugrel.com'
        )
        
        if is_super_admin:
            print(f"   🔒 STATUS: SUPER ADMIN (PROTECTED)")
        else:
            print(f"   ❌ STATUS: REGULAR USER (ELIGIBLE FOR DELETION)")
        
        user_list.append({
            'user': user,
            'is_super_admin': is_super_admin
        })
    
    return user_list

def delete_non_admin_users():
    """Delete all users except super admins"""
    print("\n=== DELETING NON-ADMIN USERS ===")
    
    # Define super admin criteria
    super_admin_emails = ['tanzeem.agra@rugrel.com']
    
    # Get users to delete (everyone except super admins)
    users_to_delete = User.objects.exclude(
        Q(is_superuser=True) |
        Q(email__in=super_admin_emails) |
        Q(roles__name='SUPERUSER')
    ).distinct()
    
    if users_to_delete.count() == 0:
        print("No non-admin users found to delete.")
        return 0
    
    print(f"Found {users_to_delete.count()} users to delete:")
    
    for user in users_to_delete:
        roles = list(user.roles.values_list('name', flat=True))
        print(f"  - {user.username} ({user.email}) - Roles: {roles}")
    
    # Get confirmation
    print(f"\n⚠️  WARNING: This will permanently delete {users_to_delete.count()} users!")
    confirm = input("Type 'DELETE ALL USERS' to confirm: ").strip()
    
    if confirm != 'DELETE ALL USERS':
        print("Deletion cancelled.")
        return 0
    
    # Perform deletion
    deleted_count = 0
    for user in users_to_delete:
        try:
            username = user.username
            email = user.email
            print(f"Deleting: {username} ({email})")
            user.delete()
            deleted_count += 1
        except Exception as e:
            print(f"Error deleting {user.username}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count} users.")
    return deleted_count

def main():
    """Main function"""
    print("Database User Cleanup Script")
    print("=" * 50)
    
    # List current users
    user_list = list_users()
    
    if not user_list:
        print("No users to process.")
        return
    
    # Count super admins and regular users
    super_admins = [u for u in user_list if u['is_super_admin']]
    regular_users = [u for u in user_list if not u['is_super_admin']]
    
    print(f"\n📊 SUMMARY:")
    print(f"   Total Users: {len(user_list)}")
    print(f"   Super Admins (Protected): {len(super_admins)}")
    print(f"   Regular Users (Will be deleted): {len(regular_users)}")
    
    if len(super_admins) == 0:
        print("\n❌ ERROR: No super admin found!")
        print("This is dangerous - you need at least one super admin.")
        return
    
    if len(regular_users) == 0:
        print("\n✅ No regular users to delete. Database is already clean.")
        return
    
    # Show super admins that will be kept
    print(f"\n🔒 SUPER ADMINS (will be kept):")
    for user_info in super_admins:
        user = user_info['user']
        print(f"   - {user.username} ({user.email})")
    
    # Proceed with deletion
    deleted_count = delete_non_admin_users()
    
    if deleted_count > 0:
        print(f"\n=== FINAL DATABASE STATE ===")
        list_users()

if __name__ == '__main__':
    main()
