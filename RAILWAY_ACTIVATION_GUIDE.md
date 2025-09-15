# Railway CLI User Activation Guide

## Problem
- Users created via RBAC interface are pending approval
- Django backend requires manual activation for security
- Both admin (tanzeem.agra@rugrel.com) and new user (drnajeeb@gmail.com) cannot login

## Solution 1: Browser Console (Recommended First Try)

1. Open https://medixscan.vercel.app in your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Copy and paste the content from `browser_activation.js`
5. Press Enter to execute
6. Check console messages for success/failure
7. Try logging in at https://medixscan.vercel.app/auth/sign-in

## Solution 2: Railway CLI (Guaranteed Fix)

### Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to your project directory
cd D:\radiology_v2

# Link to your Railway project
railway link
```

### Activate Users
```bash
# Connect to Railway shell
railway run python backend_fixed/manage.py shell
```

Then in Django shell:
```python
# Import User model
from django.contrib.auth.models import User

# Check current user status
users = User.objects.filter(email__in=['tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com'])
for user in users:
    print(f"{user.email}: active={user.is_active}, staff={user.is_staff}, superuser={user.is_superuser}")

# Activate all pending users
User.objects.filter(email__in=['tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com']).update(is_active=True)

# Make tanzeem a superuser
User.objects.filter(email='tanzeem.agra@rugrel.com').update(is_superuser=True, is_staff=True)

# Verify changes
users = User.objects.filter(email__in=['tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com'])
for user in users:
    print(f"UPDATED {user.email}: active={user.is_active}, staff={user.is_staff}, superuser={user.is_superuser}")

# Exit shell
exit()
```

### Alternative: Direct SQL Access
If Django shell doesn't work, use Railway's database access:

```bash
# Connect to PostgreSQL database
railway connect postgres
```

Then run SQL:
```sql
-- Activate users
UPDATE auth_user SET is_active = true 
WHERE email IN ('tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com');

-- Make tanzeem superuser
UPDATE auth_user SET is_superuser = true, is_staff = true 
WHERE email = 'tanzeem.agra@rugrel.com';

-- Verify changes
SELECT id, username, email, is_active, is_staff, is_superuser, date_joined 
FROM auth_user 
WHERE email IN ('tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com');
```

## Solution 3: Create New Admin User

If other methods fail, create a fresh superuser:

```bash
railway run python backend_fixed/manage.py createsuperuser
```

Follow prompts:
- Username: admin
- Email: admin@medixscan.com  
- Password: Admin@123 (or your choice)

## Verification

After any solution, test login:

1. Go to https://medixscan.vercel.app/auth/sign-in
2. Try logging in with:
   - Email: tanzeem.agra@rugrel.com
   - Password: Tanzilla@tanzeem786
3. Then try:
   - Email: drnajeeb@gmail.com
   - Password: Najeeb@123

## User Details Summary

**Admin User:**
- Email: tanzeem.agra@rugrel.com
- Password: Tanzilla@tanzeem786
- Should have: is_superuser=True, is_staff=True, is_active=True

**New User:**
- Email: drnajeeb@gmail.com
- Password: Najeeb@123
- Should have: is_active=True
- Registration Token: 78c2d36bdb18c883a24f6323cf4ffddf1af7579c

**Created Bypass User:**
- Email: drnajeeb2@gmail.com  
- Password: Najeeb@123
- Status: Also pending approval (same issue)

## Troubleshooting

1. **Railway CLI not working**: Ensure you're logged in and linked to correct project
2. **Django shell errors**: Try `railway run python manage.py shell` (without backend_fixed/)
3. **Database connection issues**: Use Railway dashboard to access database directly
4. **Still can't login**: Clear browser cache and try incognito mode

## Next Steps After Activation

Once users are activated:
1. Login as tanzeem.agra@rugrel.com (superuser)
2. Access RBAC Management → User Management
3. Verify drnajeeb@gmail.com appears as active user
4. Test all RBAC features (User, Role, Activity, Session, Security management)
5. Create additional users through RBAC interface and ensure they work properly