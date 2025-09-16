// User Approval Configuration - Soft Coded System
// Comprehensive configuration for user approval workflows

export const USER_APPROVAL_CONFIG = {
  // Approval workflows by role
  APPROVAL_WORKFLOWS: {
    DOCTOR: {
      displayName: 'Doctor',
      icon: 'fas fa-user-md',
      color: 'primary',
      defaultDepartment: 'Radiology',
      requiredFields: ['specialization', 'license_number'],
      autoApproveAfterDays: null, // null = manual approval required
      approvalLevels: ['ADMIN', 'SUPERUSER'],
      defaultPermissions: ['view_reports', 'create_reports', 'manage_patients']
    },
    RADIOLOGIST: {
      displayName: 'Radiologist',
      icon: 'fas fa-x-ray',
      color: 'info',
      defaultDepartment: 'Radiology',
      requiredFields: ['specialization', 'license_number', 'certification'],
      autoApproveAfterDays: null,
      approvalLevels: ['ADMIN', 'SUPERUSER'],
      defaultPermissions: ['view_reports', 'create_reports', 'manage_patients', 'advanced_analysis']
    },
    NURSE: {
      displayName: 'Nurse',
      icon: 'fas fa-user-nurse',
      color: 'success',
      defaultDepartment: 'General',
      requiredFields: ['license_number'],
      autoApproveAfterDays: 7, // Auto-approve after 7 days if no action
      approvalLevels: ['ADMIN', 'SUPERUSER', 'DOCTOR'],
      defaultPermissions: ['view_reports', 'manage_patients']
    },
    TECHNICIAN: {
      displayName: 'Technician',
      icon: 'fas fa-tools',
      color: 'warning',
      defaultDepartment: 'Technical',
      requiredFields: ['certification'],
      autoApproveAfterDays: 3,
      approvalLevels: ['ADMIN', 'SUPERUSER'],
      defaultPermissions: ['view_reports', 'equipment_management']
    },
    ADMIN: {
      displayName: 'Administrator',
      icon: 'fas fa-user-shield',
      color: 'danger',
      defaultDepartment: 'Administration',
      requiredFields: ['employee_id', 'department_authorization'],
      autoApproveAfterDays: null, // Always manual
      approvalLevels: ['SUPERUSER'], // Only superusers can approve admins
      defaultPermissions: ['manage_users', 'manage_roles', 'view_reports', 'system_settings']
    }
  },

  // Approval status configurations
  APPROVAL_STATUSES: {
    PENDING: {
      label: 'Pending Approval',
      badge: 'warning',
      icon: 'fas fa-clock',
      description: 'User registration is awaiting approval'
    },
    APPROVED: {
      label: 'Approved',
      badge: 'success',
      icon: 'fas fa-check-circle',
      description: 'User has been approved and activated'
    },
    REJECTED: {
      label: 'Rejected',
      badge: 'danger',
      icon: 'fas fa-times-circle',
      description: 'User application has been rejected'
    },
    SUSPENDED: {
      label: 'Suspended',
      badge: 'secondary',
      icon: 'fas fa-pause-circle',
      description: 'User account is temporarily suspended'
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      badge: 'info',
      icon: 'fas fa-search',
      description: 'Application is currently being reviewed'
    }
  },

  // Bulk action configurations
  BULK_ACTIONS: {
    APPROVE_ALL: {
      label: 'Approve Selected',
      icon: 'fas fa-check',
      variant: 'success',
      confirmationRequired: true,
      confirmationMessage: 'Are you sure you want to approve all selected users?'
    },
    REJECT_ALL: {
      label: 'Reject Selected',
      icon: 'fas fa-times',
      variant: 'danger',
      confirmationRequired: true,
      confirmationMessage: 'Are you sure you want to reject all selected users?',
      requiresReason: true
    },
    SUSPEND_ALL: {
      label: 'Suspend Selected',
      icon: 'fas fa-pause',
      variant: 'warning',
      confirmationRequired: true,
      confirmationMessage: 'Are you sure you want to suspend all selected users?',
      requiresReason: true
    },
    DELETE_ALL: {
      label: 'Delete Selected',
      icon: 'fas fa-trash',
      variant: 'danger',
      confirmationRequired: true,
      confirmationMessage: 'Are you sure you want to permanently delete all selected users? This action cannot be undone.',
      requiresReason: true,
      requiresAdditionalConfirmation: true
    }
  },

  // Filter configurations
  FILTER_OPTIONS: {
    STATUS: [
      { value: 'all', label: 'All Users', icon: 'fas fa-users' },
      { value: 'pending', label: 'Pending Approval', icon: 'fas fa-clock', badge: 'warning' },
      { value: 'approved', label: 'Approved', icon: 'fas fa-check-circle', badge: 'success' },
      { value: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle', badge: 'danger' },
      { value: 'suspended', label: 'Suspended', icon: 'fas fa-pause-circle', badge: 'secondary' },
      { value: 'under_review', label: 'Under Review', icon: 'fas fa-search', badge: 'info' }
    ],
    ROLE: [
      { value: 'all', label: 'All Roles', icon: 'fas fa-user-tag' },
      { value: 'DOCTOR', label: 'Doctors', icon: 'fas fa-user-md' },
      { value: 'RADIOLOGIST', label: 'Radiologists', icon: 'fas fa-x-ray' },
      { value: 'NURSE', label: 'Nurses', icon: 'fas fa-user-nurse' },
      { value: 'TECHNICIAN', label: 'Technicians', icon: 'fas fa-tools' },
      { value: 'ADMIN', label: 'Administrators', icon: 'fas fa-user-shield' }
    ],
    DEPARTMENT: [
      { value: 'all', label: 'All Departments', icon: 'fas fa-building' },
      { value: 'Radiology', label: 'Radiology', icon: 'fas fa-x-ray' },
      { value: 'Cardiology', label: 'Cardiology', icon: 'fas fa-heartbeat' },
      { value: 'Neurology', label: 'Neurology', icon: 'fas fa-brain' },
      { value: 'Emergency', label: 'Emergency', icon: 'fas fa-ambulance' },
      { value: 'Administration', label: 'Administration', icon: 'fas fa-cog' }
    ]
  },

  // Notification configurations
  NOTIFICATIONS: {
    APPROVAL_GRANTED: {
      title: 'User Approved',
      message: 'User {userName} has been successfully approved',
      type: 'success',
      duration: 5000
    },
    APPROVAL_REJECTED: {
      title: 'User Rejected',
      message: 'User {userName} application has been rejected',
      type: 'warning',
      duration: 5000
    },
    BULK_APPROVAL: {
      title: 'Bulk Approval Complete',
      message: '{count} users have been approved successfully',
      type: 'success',
      duration: 7000
    },
    BULK_REJECTION: {
      title: 'Bulk Rejection Complete',
      message: '{count} users have been rejected',
      type: 'warning',
      duration: 7000
    },
    ERROR: {
      title: 'Action Failed',
      message: 'Failed to complete the requested action: {error}',
      type: 'error',
      duration: 8000
    }
  },

  // API endpoint configurations (soft-coded)
  API_ENDPOINTS: {
    PENDING_USERS: '/api/rbac/pending-users/',
    APPROVE_USER: '/api/rbac/approve-user/',
    REJECT_USER: '/api/rbac/reject-user/',
    BULK_APPROVE: '/api/rbac/bulk-approve-users/',
    BULK_REJECT: '/api/rbac/bulk-reject-users/',
    USER_STATISTICS: '/api/rbac/user-statistics/',
    APPROVAL_HISTORY: '/api/rbac/approval-history/'
  },

  // UI configuration
  UI_CONFIG: {
    DEFAULT_ITEMS_PER_PAGE: 10,
    MAX_ITEMS_PER_PAGE: 50,
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    DEBOUNCE_DELAY: 300, // For search
    ANIMATION_DURATION: 300,
    TOAST_POSITION: 'top-right',
    TABLE_RESPONSIVE_BREAKPOINT: 'lg'
  },

  // Permissions required for different approval actions
  REQUIRED_PERMISSIONS: {
    APPROVE_USERS: ['approve_users', 'manage_users'],
    REJECT_USERS: ['reject_users', 'manage_users'],
    BULK_OPERATIONS: ['bulk_user_operations', 'manage_users'],
    VIEW_PENDING: ['view_pending_users', 'view_users'],
    MANAGE_APPROVALS: ['manage_approvals', 'super_admin']
  }
};

// Utility functions for approval system
export const ApprovalUtils = {
  // Get user approval status configuration
  getStatusConfig: (status) => {
    return USER_APPROVAL_CONFIG.APPROVAL_STATUSES[status?.toUpperCase()] || 
           USER_APPROVAL_CONFIG.APPROVAL_STATUSES.PENDING;
  },

  // Get role configuration
  getRoleConfig: (role) => {
    return USER_APPROVAL_CONFIG.APPROVAL_WORKFLOWS[role?.toUpperCase()] || 
           USER_APPROVAL_CONFIG.APPROVAL_WORKFLOWS.DOCTOR;
  },

  // Check if user can be auto-approved
  canAutoApprove: (user, daysSinceRegistration) => {
    const roleConfig = ApprovalUtils.getRoleConfig(user.role);
    return roleConfig.autoApproveAfterDays && 
           daysSinceRegistration >= roleConfig.autoApproveAfterDays;
  },

  // Format notification message with placeholders
  formatNotification: (template, variables) => {
    let message = template.message;
    Object.keys(variables).forEach(key => {
      message = message.replace(`{${key}}`, variables[key]);
    });
    return { ...template, message };
  },

  // Check if user has required permissions for action
  hasRequiredPermissions: (userPermissions, requiredAction) => {
    const requiredPerms = USER_APPROVAL_CONFIG.REQUIRED_PERMISSIONS[requiredAction];
    if (!requiredPerms) return true;
    
    return requiredPerms.some(perm => 
      userPermissions?.includes(perm) || 
      userPermissions?.includes('super_admin')
    );
  },

  // Get filter badge configuration
  getFilterBadge: (filterType, filterValue) => {
    const options = USER_APPROVAL_CONFIG.FILTER_OPTIONS[filterType?.toUpperCase()];
    const option = options?.find(opt => opt.value === filterValue);
    return option?.badge || 'secondary';
  }
};

export default USER_APPROVAL_CONFIG;