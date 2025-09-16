// Role-Based Navigation Component
// Dynamically shows/hides navigation items based on user permissions

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';

// Soft-coded navigation menu configuration
const NAVIGATION_ITEMS = {
  dashboard: {
    path: '/dashboard',
    label: 'Dashboard', 
    icon: 'fa-tachometer-alt',
    requiredPermission: 'basic_access',
    order: 1
  },
  radiology: {
    path: '/dashboard/radiology',
    label: 'Radiology',
    icon: 'fa-x-ray',
    requiredPermission: 'radiology_access',
    order: 2
  },
  advanced_radiology: {
    path: '/dashboard/advanced-radiology',
    label: 'Advanced Radiology',
    icon: 'fa-brain',
    requiredPermission: 'radiology_advanced',
    order: 3
  },
  patients: {
    path: '/dashboard/patients',
    label: 'Patients',
    icon: 'fa-users',
    requiredPermission: 'patient_management',
    order: 4
  },
  reports: {
    path: '/dashboard/reports',
    label: 'Reports',
    icon: 'fa-file-medical',
    requiredPermission: 'report_management',
    order: 5
  },
  my_reports: {
    path: '/dashboard/my-reports', 
    label: 'My Reports',
    icon: 'fa-file-alt',
    requiredPermission: 'view_own_reports',
    order: 5
  },
  analytics: {
    path: '/dashboard/analytics',
    label: 'Analytics',
    icon: 'fa-chart-bar',
    requiredPermission: 'analytics_access',
    order: 6
  },
  view_analytics: {
    path: '/dashboard/basic-analytics',
    label: 'Analytics',
    icon: 'fa-chart-line', 
    requiredPermission: 'view_analytics',
    order: 6
  },
  equipment: {
    path: '/dashboard/equipment',
    label: 'Equipment',
    icon: 'fa-tools',
    requiredPermission: 'equipment_management',
    order: 7
  },
  admin: {
    path: '/dashboard/admin',
    label: 'Administration',
    icon: 'fa-cog',
    requiredPermission: 'admin_dashboard',
    order: 8,
    children: {
      user_management: {
        path: '/dashboard/rbac-user-management',
        label: 'User Management',
        icon: 'fa-users-cog',
        requiredPermission: 'user_management'
      },
      role_management: {
        path: '/dashboard/rbac-role-management', 
        label: 'Role Management',
        icon: 'fa-shield-alt',
        requiredPermission: 'role_management'
      },
      system_settings: {
        path: '/dashboard/settings',
        label: 'System Settings', 
        icon: 'fa-sliders-h',
        requiredPermission: 'system_settings'
      }
    }
  }
};

const RoleBasedNavItem = ({ item, path, isChild = false }) => {
  const { hasPermission, canAccessNavItem } = useUniversalAuth();
  
  // Check if user has permission for this nav item
  if (!hasPermission(item.requiredPermission)) {
    return null;
  }
  
  const navClass = isChild ? "nav-link child-nav" : "nav-link";
  const iconClass = `fas ${item.icon} me-2`;
  
  return (
    <Nav.Item>
      <Nav.Link as={Link} to={path} className={navClass}>
        <i className={iconClass}></i>
        {item.label}
      </Nav.Link>
    </Nav.Item>
  );
};

const RoleBasedNavigation = ({ className = "" }) => {
  const { getAllowedNavigation, hasPermission, userRole } = useUniversalAuth();
  
  // Get allowed navigation items for current user
  const allowedNavItems = getAllowedNavigation();
  
  // Filter and sort navigation items
  const visibleNavItems = Object.entries(NAVIGATION_ITEMS)
    .filter(([key, item]) => {
      // Check if this nav item is allowed for user's role
      if (!allowedNavItems.includes(key)) return false;
      
      // Check if user has the required permission
      return hasPermission(item.requiredPermission);
    })
    .sort((a, b) => a[1].order - b[1].order);
  
  return (
    <Nav className={`role-based-navigation ${className}`} variant="pills">
      {visibleNavItems.map(([key, item]) => {
        // Handle items with children (like admin menu)
        if (item.children) {
          const visibleChildren = Object.entries(item.children)
            .filter(([childKey, childItem]) => hasPermission(childItem.requiredPermission));
          
          if (visibleChildren.length === 0) return null;
          
          return (
            <div key={key} className="nav-group">
              <div className="nav-group-header">
                <i className={`fas ${item.icon} me-2`}></i>
                {item.label}
              </div>
              {visibleChildren.map(([childKey, childItem]) => (
                <RoleBasedNavItem 
                  key={childKey}
                  item={childItem} 
                  path={childItem.path}
                  isChild={true}
                />
              ))}
            </div>
          );
        }
        
        // Regular nav items
        return (
          <RoleBasedNavItem 
            key={key}
            item={item} 
            path={item.path}
          />
        );
      })}
      
      {/* Show current role indicator in development */}
      {process.env.NODE_ENV === 'development' && (
        <Nav.Item className="mt-3">
          <small className="text-muted">
            Current Role: {userRole.displayName} (Level {userRole.level})
          </small>
        </Nav.Item>
      )}
    </Nav>
  );
};

export default RoleBasedNavigation;