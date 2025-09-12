// RBAC State Management Utilities - Soft Coding Approach
// Centralized state management and error handling for RBAC components

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for RBAC role management with error handling
 * @param {Object} rbacService - Service for RBAC API calls
 * @returns {Object} - State and handlers for role management
 */
export const useRBACRoles = (rbacService) => {
    const [state, setState] = useState({
        roles: [],
        permissions: [],
        loading: false,
        error: null,
        lastUpdated: null
    });

    // Safe state updater with validation
    const updateState = useCallback((updates) => {
        setState(prevState => ({
            ...prevState,
            ...updates,
            lastUpdated: new Date().toISOString()
        }));
    }, []);

    // Safe roles setter with validation
    const setRoles = useCallback((roles) => {
        const validRoles = Array.isArray(roles) ? roles : [];
        updateState({ roles: validRoles, error: null });
    }, [updateState]);

    // Safe permissions setter with validation
    const setPermissions = useCallback((permissions) => {
        const validPermissions = Array.isArray(permissions) ? permissions : [];
        updateState({ permissions: validPermissions, error: null });
    }, [updateState]);

    // Load roles with error handling
    const loadRoles = useCallback(async () => {
        try {
            updateState({ loading: true, error: null });
            const data = await rbacService.getRoles();
            const validData = Array.isArray(data) ? data : [];
            setRoles(validData);
        } catch (error) {
            console.error('Failed to load roles:', error);
            updateState({ 
                error: `Failed to load roles: ${error.message}`,
                roles: [] 
            });
        } finally {
            updateState({ loading: false });
        }
    }, [rbacService, setRoles, updateState]);

    // Load permissions with error handling
    const loadPermissions = useCallback(async () => {
        try {
            updateState({ loading: true, error: null });
            const data = await rbacService.getPermissions();
            const validData = Array.isArray(data) ? data : [];
            setPermissions(validData);
        } catch (error) {
            console.error('Failed to load permissions:', error);
            updateState({ 
                error: `Failed to load permissions: ${error.message}`,
                permissions: [] 
            });
        } finally {
            updateState({ loading: false });
        }
    }, [rbacService, setPermissions, updateState]);

    // Create role with validation
    const createRole = useCallback(async (roleData) => {
        try {
            updateState({ loading: true, error: null });
            const newRole = await rbacService.createRole(roleData);
            if (newRole) {
                const updatedRoles = [...state.roles, newRole];
                setRoles(updatedRoles);
                return { success: true, role: newRole };
            }
            throw new Error('Failed to create role');
        } catch (error) {
            console.error('Failed to create role:', error);
            updateState({ error: `Failed to create role: ${error.message}` });
            return { success: false, error: error.message };
        } finally {
            updateState({ loading: false });
        }
    }, [rbacService, state.roles, setRoles, updateState]);

    // Update role with validation
    const updateRole = useCallback(async (roleId, roleData) => {
        try {
            updateState({ loading: true, error: null });
            const updatedRole = await rbacService.updateRole(roleId, roleData);
            if (updatedRole) {
                const updatedRoles = state.roles.map(role => 
                    role.id === roleId ? { ...role, ...updatedRole } : role
                );
                setRoles(updatedRoles);
                return { success: true, role: updatedRole };
            }
            throw new Error('Failed to update role');
        } catch (error) {
            console.error('Failed to update role:', error);
            updateState({ error: `Failed to update role: ${error.message}` });
            return { success: false, error: error.message };
        } finally {
            updateState({ loading: false });
        }
    }, [rbacService, state.roles, setRoles, updateState]);

    // Delete role with validation
    const deleteRole = useCallback(async (roleId) => {
        try {
            updateState({ loading: true, error: null });
            await rbacService.deleteRole(roleId);
            const updatedRoles = state.roles.filter(role => role.id !== roleId);
            setRoles(updatedRoles);
            return { success: true };
        } catch (error) {
            console.error('Failed to delete role:', error);
            updateState({ error: `Failed to delete role: ${error.message}` });
            return { success: false, error: error.message };
        } finally {
            updateState({ loading: false });
        }
    }, [rbacService, state.roles, setRoles, updateState]);

    return {
        // State
        roles: state.roles,
        permissions: state.permissions,
        loading: state.loading,
        error: state.error,
        lastUpdated: state.lastUpdated,
        
        // Actions
        loadRoles,
        loadPermissions,
        createRole,
        updateRole,
        deleteRole,
        
        // Utilities
        refreshData: useCallback(() => {
            loadRoles();
            loadPermissions();
        }, [loadRoles, loadPermissions])
    };
};

/**
 * Get safe statistics from roles array
 * @param {Array} roles - Roles array
 * @returns {Object} - Statistics object
 */
export const getRoleStatistics = (roles = []) => {
    const safeRoles = Array.isArray(roles) ? roles : [];
    
    return {
        totalRoles: safeRoles.length,
        activeRoles: safeRoles.filter(role => role.is_active !== false).length,
        inheritedRoles: safeRoles.filter(role => role.parent_role).length,
        systemRoles: safeRoles.filter(role => role.is_system).length,
        customRoles: safeRoles.filter(role => !role.is_system).length
    };
};

/**
 * Get safe permissions statistics
 * @param {Array} permissions - Permissions array
 * @returns {Object} - Statistics object
 */
export const getPermissionStatistics = (permissions = []) => {
    const safePermissions = Array.isArray(permissions) ? permissions : [];
    
    return {
        totalPermissions: safePermissions.length,
        systemPermissions: safePermissions.filter(perm => perm.is_system).length,
        customPermissions: safePermissions.filter(perm => !perm.is_system).length
    };
};

/**
 * Validate role data before submission
 * @param {Object} roleData - Role data to validate
 * @returns {Object} - Validation result
 */
export const validateRoleData = (roleData) => {
    const errors = [];
    
    if (!roleData.name || roleData.name.trim().length < 2) {
        errors.push('Role name must be at least 2 characters long');
    }
    
    if (roleData.max_session_duration && (roleData.max_session_duration < 5 || roleData.max_session_duration > 1440)) {
        errors.push('Session duration must be between 5 and 1440 minutes');
    }
    
    if (roleData.allowed_ip_ranges && roleData.allowed_ip_ranges.trim()) {
        // Basic IP range validation
        const ranges = roleData.allowed_ip_ranges.split(',').map(r => r.trim());
        const invalidRanges = ranges.filter(range => {
            // Simple CIDR validation
            const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
            return !cidrRegex.test(range);
        });
        
        if (invalidRanges.length > 0) {
            errors.push(`Invalid IP ranges: ${invalidRanges.join(', ')}`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Safe array operations for RBAC data
 */
export const safeArrayOperations = {
    /**
     * Safely filter array
     * @param {Array} array - Array to filter
     * @param {Function} predicate - Filter function
     * @returns {Array} - Filtered array
     */
    filter: (array, predicate) => {
        return Array.isArray(array) ? array.filter(predicate) : [];
    },
    
    /**
     * Safely map array
     * @param {Array} array - Array to map
     * @param {Function} mapper - Map function
     * @returns {Array} - Mapped array
     */
    map: (array, mapper) => {
        return Array.isArray(array) ? array.map(mapper) : [];
    },
    
    /**
     * Safely find in array
     * @param {Array} array - Array to search
     * @param {Function} predicate - Find function
     * @returns {*} - Found item or undefined
     */
    find: (array, predicate) => {
        return Array.isArray(array) ? array.find(predicate) : undefined;
    },
    
    /**
     * Safely get array length
     * @param {Array} array - Array to measure
     * @returns {Number} - Array length
     */
    length: (array) => {
        return Array.isArray(array) ? array.length : 0;
    },
    
    /**
     * Safely get array length (alias)
     * @param {Array} array - Array to measure
     * @returns {Number} - Array length
     */
    getLength: (array) => {
        return Array.isArray(array) ? array.length : 0;
    },
    
    /**
     * Check if array is empty
     * @param {Array} array - Array to check
     * @returns {Boolean} - True if empty or not array
     */
    isEmpty: (array) => {
        return !Array.isArray(array) || array.length === 0;
    },
    
    /**
     * Safely map with React keys for rendering
     * @param {Array} array - Array to map
     * @param {Function} mapper - Map function
     * @returns {Array} - Mapped array
     */
    mapSafely: (array, mapper) => {
        return Array.isArray(array) ? array.map((item, index) => {
            // Ensure each item has a key for React rendering
            const key = item?.id || item?.uuid || item?.key || index;
            return mapper(item, index, key);
        }) : [];
    }
};

/**
 * Default RBAC form data
 */
export const getDefaultRoleForm = () => ({
    name: '',
    description: '',
    permissions: [],
    parent_role: null,
    max_session_duration: 480,
    allowed_ip_ranges: '',
    time_restrictions: '',
    is_active: true
});

/**
 * Error handling utilities
 */
export const errorHandlers = {
    /**
     * Show user-friendly error message
     * @param {Error} error - Error object
     * @returns {String} - User-friendly message
     */
    formatError: (error) => {
        if (!error) return 'An unknown error occurred';
        
        if (typeof error === 'string') return error;
        
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        
        if (error.message) {
            return error.message;
        }
        
        return 'An unexpected error occurred';
    },
    
    /**
     * Log error for debugging
     * @param {String} context - Error context
     * @param {Error} error - Error object
     */
    logError: (context, error) => {
        console.error(`[RBAC Error - ${context}]:`, {
            error,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
};

export default {
    useRBACRoles,
    getRoleStatistics,
    getPermissionStatistics,
    validateRoleData,
    safeArrayOperations,
    getDefaultRoleForm,
    errorHandlers
};
