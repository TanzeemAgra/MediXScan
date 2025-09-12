// RBAC Configuration - Soft Coding Approach
// This file defines all RBAC routes and their configurations

export const RBAC_ROUTES = {
    DASHBOARD: {
        path: 'rbac-dashboard',
        title: 'RBAC Dashboard',
        icon: 'fas fa-tachometer-alt',
        component: 'RBACDashboard',
        description: 'Main RBAC dashboard with statistics and overview'
    },
    USER_MANAGEMENT: {
        path: 'rbac-user-management',
        title: 'User Management',
        icon: 'fas fa-users',
        component: 'RBACUserManagement',
        description: 'Comprehensive user management interface'
    },
    ROLE_MANAGEMENT: {
        path: 'rbac-role-management',
        title: 'Role Management',
        icon: 'fas fa-user-tag',
        component: 'RBACRoleManagement',
        description: 'Advanced role and permission management'
    },
    ACTIVITY_MONITOR: {
        path: 'rbac-activity-monitor',
        title: 'Activity Monitor',
        icon: 'fas fa-history',
        component: 'RBACActivityMonitor',
        description: 'Real-time user activity monitoring'
    },
    SESSION_MANAGEMENT: {
        path: 'rbac-session-management',
        title: 'Session Management',
        icon: 'fas fa-clock',
        component: 'RBACSessionManagement',
        description: 'Active session monitoring and control'
    },
    SECURITY_ALERTS: {
        path: 'rbac-security-alerts',
        title: 'Security Alerts',
        icon: 'fas fa-shield-alt',
        component: 'RBACSecurityAlerts',
        description: 'Security monitoring and alerts'
    },
    AUDIT_LOGS: {
        path: 'rbac-audit-logs',
        title: 'Audit Logs',
        icon: 'fas fa-file-alt',
        component: 'RBACAuditLogs',
        description: 'Comprehensive audit trail and logs'
    },
    PERMISSION_MATRIX: {
        path: 'rbac-permission-matrix',
        title: 'Permission Matrix',
        icon: 'fas fa-table',
        component: 'RBACPermissionMatrix',
        description: 'Visual permission matrix and management'
    }
};

// RBAC Menu Configuration
export const RBAC_MENU_CONFIG = {
    title: 'RBAC Management',
    icon: 'fas fa-users-cog',
    requiresSuperAdmin: true,
    position: 'below-radiology', // Position in sidebar
    routes: Object.values(RBAC_ROUTES)
};

// Permission levels
export const PERMISSION_LEVELS = {
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    ADMIN: 'admin'
};

// Default RBAC settings
export const RBAC_SETTINGS = {
    sessionTimeout: 480, // minutes
    maxFailedLogins: 5,
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },
    auditRetention: 90, // days
    securityAlertThresholds: {
        failedLogins: 3,
        suspiciousActivity: 5,
        privilegeEscalation: 1
    }
};
