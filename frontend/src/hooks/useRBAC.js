// Role-Based Access Control Hook
// Comprehensive RBAC integration for React frontend

import { useState, useEffect } from 'react';
import { useUniversalAuth } from './useUniversalAuth';
import { api } from '../services/api';

export const useRBAC = () => {
  const { user, token } = useUniversalAuth();
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      loadUserPermissions();
    }
  }, [token, user]);

  const loadUserPermissions = async () => {
    try {
      const response = await api.get('/auth/profile/');
      const userData = response.data;
      
      setPermissions(userData.permissions || []);
      setRoles(userData.roles || []);
    } catch (error) {
      console.error('Failed to load user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    return roles.some(role => 
      role.name === roleName || 
      role === roleName || 
      (typeof role === 'object' && role.name === roleName)
    );
  };

  // Check if user has specific permission
  const hasPermission = (permissionName) => {
    return permissions.some(permission => 
      permission.name === permissionName || 
      permission === permissionName ||
      (typeof permission === 'object' && permission.name === permissionName)
    );
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames) => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some(permissionName => hasPermission(permissionName));
  };

  // Check if user has all specified roles
  const hasAllRoles = (roleNames) => {
    return roleNames.every(roleName => hasRole(roleName));
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissionNames) => {
    return permissionNames.every(permissionName => hasPermission(permissionName));
  };

  // Common role checks
  const isSuperUser = () => hasRole('SUPERUSER');
  const isDoctor = () => hasRole('DOCTOR');
  const isTechnician = () => hasRole('TECHNICIAN');
  const isPatient = () => hasRole('PATIENT');
  const isAdmin = () => hasRole('ADMIN');

  // Common permission checks
  const canUploadScan = () => hasPermission('upload_scan');
  const canViewScan = () => hasPermission('view_scan');
  const canEditScan = () => hasPermission('edit_scan');
  const canDeleteScan = () => hasPermission('delete_scan');
  const canViewReport = () => hasPermission('view_report');
  const canCreateReport = () => hasPermission('create_report');
  const canManageUsers = () => hasPermission('manage_users');
  const canViewAuditLogs = () => hasPermission('view_audit_logs');

  return {
    // State
    permissions,
    roles,
    loading,
    user,
    
    // Permission checks
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    
    // Role checks
    isSuperUser,
    isDoctor,
    isTechnician,
    isPatient,
    isAdmin,
    
    // Permission checks
    canUploadScan,
    canViewScan,
    canEditScan,
    canDeleteScan,
    canViewReport,
    canCreateReport,
    canManageUsers,
    canViewAuditLogs,
    
    // Utility
    loadUserPermissions
  };
};

// HOC for role-based component protection
export const withRoleProtection = (WrappedComponent, requiredRoles = [], requiredPermissions = []) => {
  return (props) => {
    const { hasAnyRole, hasAnyPermission, loading } = useRBAC();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading...</span>
        </div>
      );
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Access Denied</h3>
          <p>You don't have the required role to access this content.</p>
          <p className="text-sm mt-2">Required roles: {requiredRoles.join(', ')}</p>
        </div>
      );
    }

    // Check permission requirements
    if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Access Denied</h3>
          <p>You don't have the required permissions to access this content.</p>
          <p className="text-sm mt-2">Required permissions: {requiredPermissions.join(', ')}</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering based on roles/permissions
export const RoleBasedComponent = ({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  fallback = null 
}) => {
  const { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions, loading } = useRBAC();

  if (loading) {
    return fallback;
  }

  let hasRoleAccess = true;
  let hasPermissionAccess = true;

  // Check role access
  if (roles.length > 0) {
    hasRoleAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
  }

  // Check permission access
  if (permissions.length > 0) {
    hasPermissionAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  }

  // Both role and permission checks must pass
  if (hasRoleAccess && hasPermissionAccess) {
    return children;
  }

  return fallback;
};

// Button component with role/permission protection
export const ProtectedButton = ({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  className = '',
  onClick,
  ...props 
}) => {
  const { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions } = useRBAC();

  let hasAccess = true;

  // Check role access
  if (roles.length > 0) {
    hasAccess = hasAccess && (requireAll ? hasAllRoles(roles) : hasAnyRole(roles));
  }

  // Check permission access
  if (permissions.length > 0) {
    hasAccess = hasAccess && (requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions));
  }

  if (!hasAccess) {
    return null; // Don't render the button if no access
  }

  return (
    <button
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Navigation item with role/permission protection
export const ProtectedNavItem = ({ 
  to, 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  className = '',
  ...props 
}) => {
  const { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions } = useRBAC();

  let hasAccess = true;

  // Check role access
  if (roles.length > 0) {
    hasAccess = hasAccess && (requireAll ? hasAllRoles(roles) : hasAnyRole(roles));
  }

  // Check permission access
  if (permissions.length > 0) {
    hasAccess = hasAccess && (requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions));
  }

  if (!hasAccess) {
    return null; // Don't render the nav item if no access
  }

  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
};

export default useRBAC;
