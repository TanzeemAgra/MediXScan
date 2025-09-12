// RBAC Route Utilities - Soft Coding Implementation
// Dynamic route generation and management for RBAC system

import { RBAC_ROUTES } from '../config/rbacConfig';

/**
 * Generate dynamic routes for RBAC system
 * @param {Array} routes - Array of route configurations
 * @returns {Array} - Formatted routes for React Router
 */
export const generateRBACRoutes = (routes = RBAC_ROUTES) => {
    return Object.values(routes).map(route => ({
        path: route.path,
        component: route.component,
        title: route.title,
        icon: route.icon,
        description: route.description,
        requiresSuperAdmin: true
    }));
};

/**
 * Check if user has access to RBAC route
 * @param {Object} user - Current user object
 * @param {String} routePath - Route path to check
 * @returns {Boolean} - Access permission
 */
export const hasRBACAccess = (user, routePath) => {
    if (!user || !user.is_superuser) {
        return false;
    }

    const route = Object.values(RBAC_ROUTES).find(r => r.path === routePath);
    return route ? true : false;
};

/**
 * Get RBAC navigation items with access control
 * @param {Object} user - Current user object
 * @returns {Array} - Filtered navigation items
 */
export const getRBACNavigationItems = (user) => {
    if (!user || !user.is_superuser) {
        return [];
    }

    return [
        { 
            path: `/dashboard/${RBAC_ROUTES.USER_MANAGEMENT.path}`, 
            name: RBAC_ROUTES.USER_MANAGEMENT.title, 
            icon: RBAC_ROUTES.USER_MANAGEMENT.icon.replace('fas fa-', 'ri-').replace('-', '-line'),
            description: RBAC_ROUTES.USER_MANAGEMENT.description
        },
        { 
            path: `/dashboard/${RBAC_ROUTES.ROLE_MANAGEMENT.path}`, 
            name: RBAC_ROUTES.ROLE_MANAGEMENT.title, 
            icon: RBAC_ROUTES.ROLE_MANAGEMENT.icon.replace('fas fa-', 'ri-').replace('-', '-line'),
            description: RBAC_ROUTES.ROLE_MANAGEMENT.description
        },
        { 
            path: `/dashboard/${RBAC_ROUTES.ACTIVITY_MONITOR.path}`, 
            name: RBAC_ROUTES.ACTIVITY_MONITOR.title, 
            icon: RBAC_ROUTES.ACTIVITY_MONITOR.icon.replace('fas fa-', 'ri-').replace('-', '-line'),
            description: RBAC_ROUTES.ACTIVITY_MONITOR.description
        },
        { 
            path: `/dashboard/${RBAC_ROUTES.SESSION_MANAGEMENT.path}`, 
            name: RBAC_ROUTES.SESSION_MANAGEMENT.title, 
            icon: RBAC_ROUTES.SESSION_MANAGEMENT.icon.replace('fas fa-', 'ri-').replace('-', '-line'),
            description: RBAC_ROUTES.SESSION_MANAGEMENT.description
        },
        { 
            path: `/dashboard/${RBAC_ROUTES.SECURITY_ALERTS.path}`, 
            name: RBAC_ROUTES.SECURITY_ALERTS.title, 
            icon: RBAC_ROUTES.SECURITY_ALERTS.icon.replace('fas fa-', 'ri-').replace('-', '-line'),
            description: RBAC_ROUTES.SECURITY_ALERTS.description
        }
    ];
};

/**
 * Get breadcrumb for RBAC route
 * @param {String} routePath - Current route path
 * @returns {Array} - Breadcrumb items
 */
export const getRBACBreadcrumb = (routePath) => {
    const cleanPath = routePath.replace('/dashboard/', '');
    const route = Object.values(RBAC_ROUTES).find(r => r.path === cleanPath);
    
    if (!route) {
        return [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'RBAC', path: '/dashboard-pages/rbac-user-management' },
            { name: 'Unknown', path: routePath }
        ];
    }

    return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'RBAC Management', path: '/dashboard-pages/rbac-user-management' },
        { name: route.title, path: routePath }
    ];
};

/**
 * Validate RBAC route parameters
 * @param {String} routePath - Route path to validate
 * @returns {Object} - Validation result
 */
export const validateRBACRoute = (routePath) => {
    const cleanPath = routePath.replace('/dashboard/', '');
    const route = Object.values(RBAC_ROUTES).find(r => r.path === cleanPath);
    
    return {
        isValid: !!route,
        route: route || null,
        error: route ? null : `Invalid RBAC route: ${routePath}`
    };
};

/**
 * Get RBAC route metadata
 * @param {String} routePath - Route path
 * @returns {Object} - Route metadata
 */
export const getRBACRouteMetadata = (routePath) => {
    const cleanPath = routePath.replace('/dashboard/', '');
    const route = Object.values(RBAC_ROUTES).find(r => r.path === cleanPath);
    
    if (!route) {
        return {
            title: 'RBAC Management',
            description: 'Role-Based Access Control System',
            icon: 'fas fa-users-cog'
        };
    }

    return {
        title: route.title,
        description: route.description,
        icon: route.icon
    };
};

/**
 * Check if route exists in RBAC configuration
 * @param {String} routePath - Route path to check
 * @returns {Boolean} - Route exists
 */
export const isRBACRoute = (routePath) => {
    const cleanPath = routePath.replace('/dashboard/', '');
    return Object.values(RBAC_ROUTES).some(r => r.path === cleanPath);
};

/**
 * Get all available RBAC routes
 * @returns {Array} - All RBAC routes
 */
export const getAllRBACRoutes = () => {
    return Object.values(RBAC_ROUTES);
};

/**
 * Format route for React Router configuration
 * @param {Object} route - Route configuration
 * @returns {Object} - Formatted route
 */
export const formatRouteForRouter = (route) => {
    return {
        path: route.path,
        element: route.component,
        meta: {
            title: route.title,
            description: route.description,
            icon: route.icon,
            requiresSuperAdmin: true
        }
    };
};

/**
 * Get route component name dynamically
 * @param {String} routePath - Route path
 * @returns {String} - Component name
 */
export const getRouteComponentName = (routePath) => {
    const cleanPath = routePath.replace('/dashboard/', '');
    const route = Object.values(RBAC_ROUTES).find(r => r.path === cleanPath);
    return route ? route.component : 'RBACUserManagement';
};

export default {
    generateRBACRoutes,
    hasRBACAccess,
    getRBACNavigationItems,
    getRBACBreadcrumb,
    validateRBACRoute,
    getRBACRouteMetadata,
    isRBACRoute,
    getAllRBACRoutes,
    formatRouteForRouter,
    getRouteComponentName
};
