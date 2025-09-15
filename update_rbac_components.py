#!/usr/bin/env python3
"""
Smart RBAC Component Updater
Updates all RBAC components with enhanced access control using soft coding technique
"""
import os
import re

# RBAC component files to update
RBAC_COMPONENTS = [
    'RBACRoleManagement.jsx',
    'RBACActivityMonitor.jsx', 
    'RBACSessionManagement.jsx',
    'RBACSecurityAlerts.jsx',
    'RBACUserManagement.jsx'  # The original one for completeness
]

BASE_PATH = 'D:\\radiology_v2\\frontend\\src\\views\\dashboard-pages\\'

def add_imports(content):
    """Add the enhanced access control imports"""
    import_pattern = r"import\s+\{[^}]+\}\s+from\s+['\"]react-bootstrap['\"];"
    replacement = """import { hasSuperAdminAccess, debugUserAccess } from '../../utils/rbacAccessControl';"""
    
    # Find the react-bootstrap import and add our import after it
    if re.search(import_pattern, content):
        content = re.sub(
            import_pattern,
            lambda m: m.group(0) + '\n' + replacement,
            content,
            count=1
        )
    
    return content

def update_access_control(content, component_name):
    """Update the access control logic"""
    
    # Pattern 1: Find and replace the access control check
    old_pattern = r"if\s*\(\s*!isAuthenticated\s*\|\|\s*!user\?\.is_superuser\s*\)\s*\{"
    
    # New access control logic
    new_logic = f"""// Enhanced Access Control Check using utility function
    const hasAccess = hasSuperAdminAccess(user);
    
    // Debug logging for access control
    debugUserAccess(user, isAuthenticated, '{component_name}');
    
    if (!isAuthenticated || !hasAccess) {{"""
    
    content = re.sub(old_pattern, new_logic, content)
    
    # Pattern 2: Update useEffect dependencies that check is_superuser
    useeffect_pattern = r"if\s*\(\s*isAuthenticated\s*&&\s*user\?\.is_superuser\s*\)"
    useeffect_replacement = "if (isAuthenticated && hasSuperAdminAccess(user))"
    
    content = re.sub(useeffect_pattern, useeffect_replacement, content)
    
    return content

def update_component(file_path, component_name):
    """Update a single RBAC component"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"Updating {component_name}...")
        
        # Add imports
        content = add_imports(content)
        
        # Update access control
        content = update_access_control(content, component_name)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Successfully updated {component_name}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to update {component_name}: {e}")
        return False

def main():
    """Update all RBAC components"""
    print("🚀 Smart RBAC Component Updater")
    print("=" * 50)
    
    updated_count = 0
    
    for component_file in RBAC_COMPONENTS:
        file_path = os.path.join(BASE_PATH, component_file)
        component_name = component_file.replace('.jsx', '')
        
        if os.path.exists(file_path):
            if update_component(file_path, component_name):
                updated_count += 1
        else:
            print(f"⚠️  File not found: {component_file}")
    
    print("\n" + "=" * 50)
    print(f"✅ Updated {updated_count} out of {len(RBAC_COMPONENTS)} components")
    print("🎯 All RBAC components should now use enhanced access control")

if __name__ == "__main__":
    main()