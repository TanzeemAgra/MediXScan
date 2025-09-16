// Universal Role-Based Access Control Configuration
// Soft-coded system for managing different user roles and their permissions

export const USER_ROLES = {
  SUPERUSER: {
    name: 'SUPERUSER',
    displayName: 'Super Administrator',
    level: 100,
    permissions: ['*'] // All permissions
  },
  ADMIN: {
    name: 'ADMIN', 
    displayName: 'Administrator',
    level: 80,
    permissions: [
      'admin_dashboard',
      'user_management',
      'role_management',
      'system_settings',
      'radiology_access',
      'patient_management',
      'report_management',
      'analytics_access'
    ]
  },
  DOCTOR: {
    name: 'DOCTOR',
    displayName: 'Doctor',
    level: 60,
    permissions: [
      'radiology_access',
      'patient_management', 
      'report_management',
      'view_analytics'
    ]
  },
  RADIOLOGIST: {
    name: 'RADIOLOGIST',
    displayName: 'Radiologist', 
    level: 70,
    permissions: [
      'radiology_access',
      'radiology_advanced',
      'report_management',
      'image_analysis',
      'diagnosis_tools'
    ]
  },
  TECHNICIAN: {
    name: 'TECHNICIAN',
    displayName: 'Technician',
    level: 40,
    permissions: [
      'radiology_access',
      'equipment_management',
      'basic_reports'
    ]
  },
  NURSE: {
    name: 'NURSE',
    displayName: 'Nurse',
    level: 30,
    permissions: [
      'patient_management',
      'view_reports',
      'basic_radiology'
    ]
  },
  CLIENT: {
    name: 'CLIENT',
    displayName: 'Client',
    level: 20,
    permissions: [
      'view_own_reports',
      'basic_access'
    ]
  },
  GUEST: {
    name: 'GUEST',
    displayName: 'Guest',
    level: 10,
    permissions: [
      'basic_access'
    ]
  }
};

export const PERMISSIONS = {
  // Administrative permissions
  'admin_dashboard': {
    name: 'Admin Dashboard',
    description: 'Access to administrative dashboard and controls'
  },
  'user_management': {
    name: 'User Management', 
    description: 'Create, edit, and manage user accounts'
  },
  'role_management': {
    name: 'Role Management',
    description: 'Manage user roles and permissions'
  },
  'system_settings': {
    name: 'System Settings',
    description: 'Access to system configuration and settings'
  },
  
  // Medical/Radiology permissions  
  'radiology_access': {
    name: 'Radiology Access',
    description: 'Basic access to radiology features'
  },
  'radiology_advanced': {
    name: 'Advanced Radiology',
    description: 'Advanced radiology tools and features'
  },
  'image_analysis': {
    name: 'Image Analysis',
    description: 'AI-powered image analysis tools'
  },
  'diagnosis_tools': {
    name: 'Diagnosis Tools',
    description: 'Advanced diagnosis and reporting tools'
  },
  
  // Patient and Report permissions
  'patient_management': {
    name: 'Patient Management',
    description: 'Create and manage patient records'
  },
  'report_management': {
    name: 'Report Management', 
    description: 'Create, edit, and manage medical reports'
  },
  'view_reports': {
    name: 'View Reports',
    description: 'View medical reports'
  },
  'view_own_reports': {
    name: 'View Own Reports',
    description: 'View only own medical reports'
  },
  
  // Analytics and Equipment
  'analytics_access': {
    name: 'Analytics Access',
    description: 'Access to analytics and reporting dashboards'
  },
  'view_analytics': {
    name: 'View Analytics',
    description: 'View basic analytics and charts'
  },
  'equipment_management': {
    name: 'Equipment Management',
    description: 'Manage medical equipment and devices'
  },
  
  // Basic permissions
  'basic_radiology': {
    name: 'Basic Radiology',
    description: 'Basic radiology viewing capabilities'
  },
  'basic_reports': {
    name: 'Basic Reports',
    description: 'Access to basic reporting features'
  },
  'basic_access': {
    name: 'Basic Access',
    description: 'Basic system access'
  }
};

// Navigation menu items based on roles
export const ROLE_BASED_NAVIGATION = {
  SUPERUSER: [
    'dashboard',
    'radiology',
    'patients', 
    'reports',
    'analytics',
    'admin',
    'user_management',
    'role_management', 
    'system_settings'
  ],
  ADMIN: [
    'dashboard',
    'radiology',
    'patients',
    'reports', 
    'analytics',
    'user_management',
    'system_settings'
  ],
  DOCTOR: [
    'dashboard',
    'radiology', 
    'patients',
    'reports',
    'analytics'
  ],
  RADIOLOGIST: [
    'dashboard',
    'radiology',
    'advanced_radiology',
    'reports',
    'image_analysis'
  ],
  TECHNICIAN: [
    'dashboard',
    'radiology',
    'equipment',
    'basic_reports'
  ],
  NURSE: [
    'dashboard', 
    'patients',
    'reports',
    'basic_radiology'
  ],
  CLIENT: [
    'dashboard',
    'my_reports'
  ],
  GUEST: [
    'dashboard'
  ]
};

// User role detection functions
export const RoleUtils = {
  
  // Determine user role from user data
  getUserRole: (user) => {
    if (!user) return USER_ROLES.GUEST;
    
    // Check for superuser
    if (user.is_superuser || user.email === 'tanzeem.agra@rugrel.com') {
      return USER_ROLES.SUPERUSER;
    }
    
    // Check for staff/admin
    if (user.is_staff) {
      return USER_ROLES.ADMIN;
    }
    
    // Check for explicit role assignment
    if (user.role) {
      const roleKey = user.role.toUpperCase();
      if (USER_ROLES[roleKey]) {
        return USER_ROLES[roleKey];
      }
    }
    
    // Check groups/roles array
    if (user.groups && Array.isArray(user.groups)) {
      for (const group of user.groups) {
        const groupName = (typeof group === 'string' ? group : group.name || '').toUpperCase();
        if (USER_ROLES[groupName]) {
          return USER_ROLES[groupName];
        }
      }
    }
    
    // Default role for authenticated users based on email domain or pattern
    if (user.email) {
      if (user.email.includes('admin')) return USER_ROLES.ADMIN;
      if (user.email.includes('doctor') || user.email.includes('dr')) return USER_ROLES.DOCTOR;
      if (user.email.includes('tech')) return USER_ROLES.TECHNICIAN;
      if (user.email.includes('nurse')) return USER_ROLES.NURSE;
    }
    
    // Default to DOCTOR for authenticated medical users
    return USER_ROLES.DOCTOR;
  },
  
  // Check if user has specific permission
  hasPermission: (user, permission) => {
    const userRole = RoleUtils.getUserRole(user);
    
    // Superuser has all permissions
    if (userRole.permissions.includes('*')) {
      return true;
    }
    
    return userRole.permissions.includes(permission);
  },
  
  // Check if user has any of the given permissions
  hasAnyPermission: (user, permissions) => {
    return permissions.some(permission => RoleUtils.hasPermission(user, permission));
  },
  
  // Check if user can access navigation item
  canAccessNavItem: (user, navItem) => {
    const userRole = RoleUtils.getUserRole(user);
    const allowedNavItems = ROLE_BASED_NAVIGATION[userRole.name] || [];
    return allowedNavItems.includes(navItem);
  },
  
  // Get user's allowed navigation items
  getAllowedNavigation: (user) => {
    const userRole = RoleUtils.getUserRole(user);
    return ROLE_BASED_NAVIGATION[userRole.name] || ['dashboard'];
  },
  
  // Check if user has minimum role level
  hasMinimumRoleLevel: (user, minimumLevel) => {
    const userRole = RoleUtils.getUserRole(user);
    return userRole.level >= minimumLevel;
  }
};

export default {
  USER_ROLES,
  PERMISSIONS, 
  ROLE_BASED_NAVIGATION,
  RoleUtils
};