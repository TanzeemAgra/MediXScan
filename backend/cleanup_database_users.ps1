# Database User Cleanup PowerShell Script
# Run this from the backend directory

Write-Host "=== Database User Cleanup ===" -ForegroundColor Green
Write-Host "Working Directory: $(Get-Location)" -ForegroundColor Yellow

# Check if we're in the right directory
if (!(Test-Path "manage.py")) {
    Write-Host "Error: manage.py not found. Please run this from the backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 1: Listing current users..." -ForegroundColor Cyan

# Create a temporary Python script to list users
$listScript = @'
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User

print("=== CURRENT DATABASE USERS ===")
users = User.objects.all()
print(f"Total users: {users.count()}")

super_admin_count = 0
regular_user_count = 0

for user in users:
    roles = list(user.roles.values_list('name', flat=True))
    print(f"\nUsername: {user.username}")
    print(f"Email: {user.email}")
    print(f"Roles: {', '.join(roles) if roles else 'None'}")
    print(f"Is Superuser: {user.is_superuser}")
    
    is_super_admin = (
        user.is_superuser or 
        'SUPERUSER' in roles or 
        user.email == 'tanzeem.agra@rugrel.com'
    )
    
    if is_super_admin:
        print("STATUS: 🔒 PROTECTED (Super Admin)")
        super_admin_count += 1
    else:
        print("STATUS: ❌ WILL BE DELETED")
        regular_user_count += 1

print(f"\nSummary: {super_admin_count} protected, {regular_user_count} to delete")
'@

$listScript | Out-File -FilePath "temp_list_users.py" -Encoding UTF8

# Run the list script
Write-Host "Running user listing..." -ForegroundColor Yellow
python "temp_list_users.py"

# Ask for confirmation
Write-Host "`n" -NoNewline
$confirmation = Read-Host "Do you want to delete all non-admin users? Type 'DELETE ALL' to confirm"

if ($confirmation -eq "DELETE ALL") {
    Write-Host "`nProceeding with deletion..." -ForegroundColor Yellow
    
    # Create deletion script
    $deleteScript = @'
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User
from django.db.models import Q

print("=== DELETING NON-ADMIN USERS ===")

# Define super admin criteria
super_admin_emails = ['tanzeem.agra@rugrel.com']

# Get users to delete
users_to_delete = User.objects.exclude(
    Q(is_superuser=True) |
    Q(email__in=super_admin_emails) |
    Q(roles__name='SUPERUSER')
).distinct()

print(f"Found {users_to_delete.count()} users to delete")

deleted_count = 0
for user in users_to_delete:
    try:
        print(f"Deleting: {user.username} ({user.email})")
        user.delete()
        deleted_count += 1
    except Exception as e:
        print(f"Error deleting {user.username}: {e}")

print(f"\nSuccessfully deleted {deleted_count} users")

# Show remaining users
remaining = User.objects.all()
print(f"\nRemaining users: {remaining.count()}")
for user in remaining:
    roles = list(user.roles.values_list('name', flat=True))
    print(f"  - {user.username} ({user.email}) - Roles: {roles}")
'@

    $deleteScript | Out-File -FilePath "temp_delete_users.py" -Encoding UTF8
    
    # Run deletion
    python "temp_delete_users.py"
    
    Write-Host "`nCleanup completed!" -ForegroundColor Green
    
} else {
    Write-Host "Deletion cancelled." -ForegroundColor Yellow
}

# Clean up temporary files
Remove-Item "temp_list_users.py" -ErrorAction SilentlyContinue
Remove-Item "temp_delete_users.py" -ErrorAction SilentlyContinue

Write-Host "`nScript finished." -ForegroundColor Green
