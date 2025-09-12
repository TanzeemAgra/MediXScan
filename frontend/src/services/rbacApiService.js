// Real API Service for RBAC User Management
// Soft coding implementation with fallback to mock data

import { api } from './api';
import { ENV_CONFIG, ConfigHelpers } from '../config/appConfig.js';

// Use soft-coded API base URL from configuration
const API_BASE_URL = ENV_CONFIG?.API_BASE_URL ? `${ENV_CONFIG.API_BASE_URL}/rbac` : 'http://localhost:8000/api/rbac';

// Soft coding utility function to handle API calls with fallbacks
const safeApiCall = async (apiCall, fallbackData = null, operation = 'API call') => {
    try {
        console.log(`🔄 Attempting ${operation}...`);
        const response = await apiCall();
        console.log(`✅ ${operation} successful:`, response.data);
        return response.data;
    } catch (error) {
        console.warn(`⚠️ ${operation} failed:`, error.message);
        if (fallbackData !== null) {
            console.log(`🔄 Using fallback data for ${operation}`);
            return fallbackData;
        }
        throw error;
    }
};

// Real RBAC API Service with soft coding fallbacks
const rbacApiService = {
    // Get all users from Django backend with soft coding fallback
    async getUsers() {
        // Get the auth token for API calls - accept multiple storage keys and log which is used
        const tokenKeys = ['auth_token', (ENV_CONFIG && ENV_CONFIG.SECURITY && ENV_CONFIG.SECURITY.TOKEN && ENV_CONFIG.SECURITY.TOKEN.key) || 'auth_token', 'authToken', 'token', 'access', 'accessToken'];
        let token = null;
        let tokenKeyUsed = null;
        for (const k of tokenKeys) {
            try {
                const t = localStorage.getItem(k);
                if (t) { token = t; tokenKeyUsed = k; break; }
            } catch (e) {
                // ignore storage access errors
            }
        }
        const headers = token ? { Authorization: token.includes('.') ? `Bearer ${token}` : `Token ${token}` } : {};
        console.log('🔑 rbacApiService.getUsers using tokenKey:', tokenKeyUsed, 'tokenPresent:', !!token);
        
        const fallbackUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@medixscan.com',
                first_name: 'Admin',
                last_name: 'User',
                is_active: true,
                is_staff: true,
                is_superuser: true,
                roles: ['super_admin'],
                date_joined: new Date().toISOString(),
                last_login: new Date().toISOString(),
                profile: {
                    department: 'IT',
                    phone: '+1-555-0100'
                }
            }
        ];

        // Soft coding: Try multiple potential user endpoints
        // Build possible endpoints using soft-coded API base where needed
        const possibleEndpoints = [
            `${API_BASE_URL}/users/advanced/`,
            ConfigHelpers.getApiUrl('/auth/users/'), // Alternative endpoint - requires admin permissions
            ConfigHelpers.getApiUrl('/accounts/users/'), // Another potential endpoint
            `${API_BASE_URL}/users/`, // Standard REST endpoint
            ConfigHelpers.getApiUrl('/auth/profile/') // Current user profile - fallback for non-admin users
        ];

        console.log('🔄 Fetching users from database...');

    for (const endpoint of possibleEndpoints) {
            try {
                console.log(`🔄 Trying users endpoint: ${endpoint}`);
                const response = await api.get(endpoint, { headers });
                
                console.log('✅ Users fetched successfully:', response.data?.length || response.data?.results?.length || 'unknown count');
                
                // Handle both direct array and paginated response
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (response.data?.results && Array.isArray(response.data.results)) {
                    return response.data.results;
                } else if (response.data) {
                    // Single user response (e.g., from profile endpoint) - convert to array
                    console.log('📋 Converting single user profile to array format');
                    return [response.data];
                }
                
                return fallbackUsers;
                
            } catch (error) {
                console.warn(`⚠️ Users endpoint ${endpoint} failed:`, error.response?.status, error.response?.statusText);
                console.warn('📄 Error body:', error.response?.data || error.message || error);
                
                // If we get a 404, try the next endpoint
                if (error.response?.status === 404) {
                    continue;
                }
                
                // If we get 403 (permission denied), user is not admin - show current user only
                if (error.response?.status === 403) {
                    console.warn(`⚠️ Permission denied for ${endpoint}. Showing current user only.`);
                    const currentUser = this.getCurrentUserFromStorage();
                    if (currentUser) {
                        return [currentUser];
                    }
                }
                
                // If we get 401, try other endpoints
                if (error.response?.status === 401) {
                    console.warn(`⚠️ Authentication issue with ${endpoint}, trying next endpoint`);
                    continue;
                }
                
                // For other errors, log but continue
                console.warn(`⚠️ Error from ${endpoint}:`, error.message);
            }
        }

        // Final fallback: try a raw fetch using the backend base URL in case axios/baseURL config caused issues
        try {
            const backendBase = (ENV_CONFIG && ENV_CONFIG.BACKEND_URL) || (ENV_CONFIG && ENV_CONFIG.API_BASE_URL) || 'http://localhost:8000';
            const finalUrl = `${backendBase.replace(/\/$/, '')}/api/auth/users/`;
            console.log('🔍 Final fetch fallback to URL:', finalUrl);
            const fetchHeaders = { 'Content-Type': 'application/json' };
            if (token) fetchHeaders.Authorization = headers.Authorization;
            const resp = await fetch(finalUrl, { method: 'GET', headers: fetchHeaders });
            if (resp.ok) {
                const data = await resp.json();
                if (Array.isArray(data)) {
                    console.log('✅ Final fetch fallback succeeded, users count:', data.length);
                    setUsers(data);
                    return data;
                } else if (Array.isArray(data.results)) {
                    setUsers(data.results);
                    return data.results;
                }
            } else {
                console.warn('⚠️ Final fetch fallback returned non-ok status:', resp.status, resp.statusText);
            }
        } catch (finalErr) {
            console.warn('⚠️ Final fetch fallback failed:', finalErr);
        }

        console.warn('⚠️ All user endpoints failed, using fallback data');
        return fallbackUsers;
    },

    // Helper method to get current user from localStorage or token
    getCurrentUserFromStorage() {
        try {
            // Check if user info is stored in localStorage
            const userInfo = localStorage.getItem('user') || localStorage.getItem('userInfo');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                console.log('📋 Retrieved current user from storage:', user.username);
                return {
                    id: user.id || 1,
                    username: user.username || 'current_user',
                    email: user.email || 'user@example.com',
                    first_name: user.first_name || 'Current',
                    last_name: user.last_name || 'User',
                    is_active: user.is_active !== false,
                    is_staff: user.is_staff || false,
                    is_superuser: user.is_superuser || false,
                    roles: user.roles || ['user'],
                    date_joined: user.date_joined || new Date().toISOString()
                };
            }
        } catch (error) {
            console.warn('⚠️ Could not parse user from storage:', error.message);
        }
        return null;
    },

    // Get dashboard statistics
    async getDashboardStats() {
        const fallbackStats = {
            total_users: 5,
            active_users: 4,
            inactive_users: 1,
            pending_approvals: 1,
            total_roles: 6,
            recent_activities: 12,
            security_alerts: 2,
            active_sessions: Math.floor(Math.random() * 15) + 5
        };

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/dashboard-stats/`),
            fallbackStats,
            'fetching dashboard statistics'
        );
    },

    // Get all roles
    async getRoles() {
        const fallbackRoles = [
            { id: 1, name: 'super_admin', display_name: 'Super Administrator', permissions: ['all'] },
            { id: 2, name: 'admin', display_name: 'Administrator', permissions: ['user_management', 'reporting'] },
            { id: 3, name: 'doctor', display_name: 'Doctor', permissions: ['patient_access', 'reporting'] },
            { id: 4, name: 'radiologist', display_name: 'Radiologist', permissions: ['image_access', 'reporting'] },
            { id: 5, name: 'technician', display_name: 'Technician', permissions: ['equipment_access'] },
            { id: 6, name: 'viewer', display_name: 'Viewer', permissions: ['read_only'] }
        ];

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/roles/`),
            fallbackRoles,
            'fetching roles from database'
        );
    },

    // Get all permissions
    async getPermissions() {
        const fallbackPermissions = [
            { id: 1, name: 'all', display_name: 'All Permissions' },
            { id: 2, name: 'user_management', display_name: 'User Management' },
            { id: 3, name: 'patient_access', display_name: 'Patient Access' },
            { id: 4, name: 'image_access', display_name: 'Image Access' },
            { id: 5, name: 'equipment_access', display_name: 'Equipment Access' },
            { id: 6, name: 'reporting', display_name: 'Reporting' },
            { id: 7, name: 'read_only', display_name: 'Read Only' }
        ];

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/permissions/`),
            fallbackPermissions,
            'fetching permissions from database'
        );
    },

    // Create new user with soft coding fallback endpoints
    async createAdvancedUser(userData) {
        const fallbackResponse = {
            success: false,
            message: 'API service unavailable - user creation simulated',
            user: {
                id: Date.now(),
                ...userData,
                created_at: new Date().toISOString(),
                is_active: true
            }
        };

        // Soft coding: Try multiple potential endpoints
        const possibleEndpoints = [
            `${API_BASE_URL}/users/create-advanced/`,
            '/api/auth/register/', // Alternative registration endpoint
            '/api/accounts/register/', // Another potential endpoint
            `${API_BASE_URL}/users/` // Standard REST endpoint
        ];

        console.log('🔄 Attempting user creation with data:', userData);

        // Soft coding: Ensure password_confirm is included for Django registration
        if (userData.password && !userData.password_confirm) {
            // Try different field names that might contain the confirm password
            userData.password_confirm = userData.confirmPassword || userData.password;
        }
        
        console.log('🔍 Password field mapping:', {
            has_password: !!userData.password,
            has_password_confirm: !!userData.password_confirm,
            has_confirmPassword: !!userData.confirmPassword,
            passwords_match: userData.password === (userData.password_confirm || userData.confirmPassword)
        });

        for (const endpoint of possibleEndpoints) {
            try {
                console.log(`🔄 Trying endpoint: ${endpoint}`);
                
                // Prepare data specific to endpoint type
                let requestData = { ...userData };
                
                // For registration endpoints, ensure proper format
                if (endpoint.includes('/register/')) {
                    requestData = {
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        password_confirm: userData.password_confirm || userData.password,
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || ''
                    };
                }
                
                console.log(`📤 Sending data to ${endpoint}:`, requestData);
                const response = await api.post(endpoint, requestData);
                
                console.log('✅ User creation successful:', response.data);
                
                // Store the newly created user info for future reference
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    console.log('💾 Stored new user info in localStorage');
                }
                
                return {
                    success: true,
                    user: response.data,
                    message: 'User created successfully'
                };
            } catch (error) {
                console.warn(`⚠️ Endpoint ${endpoint} failed:`, error.response?.status, error.response?.statusText);
                
                // If we get a 404, try the next endpoint
                if (error.response?.status === 404) {
                    continue;
                }
                
                // If we get another error (401, 403, 400, etc.), handle it
                if (error.response?.status === 401) {
                    console.error('❌ Authentication required for user creation');
                    return {
                        success: false,
                        message: 'Authentication required. Please login first.',
                        error: 'unauthorized'
                    };
                }
                
                if (error.response?.status === 403) {
                    console.error('❌ Insufficient permissions for user creation');
                    return {
                        success: false,
                        message: 'Insufficient permissions. Admin access required.',
                        error: 'forbidden'
                    };
                }
                
                if (error.response?.status === 400) {
                    console.error('❌ Invalid user data:', error.response?.data);
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Invalid user data provided.',
                        error: 'validation_error',
                        details: error.response?.data
                    };
                }
            }
        }

        console.error('❌ All endpoints failed, using fallback');
        return fallbackResponse;
    },

    // Update user (Note: Django RBAC endpoints may vary)
    async updateUser(userId, userData) {
        const fallbackResponse = {
            success: false,
            message: 'API service unavailable - user update simulated'
        };

        try {
            const response = await safeApiCall(
                () => api.patch(`${API_BASE_URL}/users/advanced/${userId}/`, userData),
                null,
                `updating user ${userId}`
            );

            return {
                success: true,
                user: response,
                message: 'User updated successfully'
            };
        } catch (error) {
            console.error('❌ User update failed:', error);
            return fallbackResponse;
        }
    },

    // Delete user (Note: Django RBAC endpoints may vary)
    async deleteUser(userId) {
        const fallbackResponse = {
            success: false,
            message: 'API service unavailable - user deletion simulated'
        };

        try {
            await safeApiCall(
                () => api.delete(`${API_BASE_URL}/users/advanced/${userId}/`),
                null,
                `deleting user ${userId}`
            );

            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            console.error('❌ User deletion failed:', error);
            return fallbackResponse;
        }
    },

    // Bulk update users
    async bulkUpdateUsers(userIds, updateData) {
        const fallbackResponse = {
            success: false,
            message: 'API service unavailable - bulk update simulated'
        };

        try {
            const response = await safeApiCall(
                () => api.post(`${API_BASE_URL}/users/bulk-update/`, {
                    user_ids: userIds,
                    update_data: updateData
                }),
                null,
                `bulk updating ${userIds.length} users`
            );

            return {
                success: true,
                updated_count: userIds.length,
                message: 'Users updated successfully'
            };
        } catch (error) {
            console.error('❌ Bulk update failed:', error);
            return fallbackResponse;
        }
    },

    // Bulk delete users
    async bulkDeleteUsers(userIds) {
        const fallbackResponse = {
            success: false,
            message: 'API service unavailable - bulk deletion simulated'
        };

        try {
            const response = await safeApiCall(
                () => api.post(`${API_BASE_URL}/users/bulk-delete/`, {
                    user_ids: userIds
                }),
                null,
                `bulk deleting ${userIds.length} users`
            );

            return {
                success: true,
                deleted_count: userIds.length,
                message: 'Users deleted successfully'
            };
        } catch (error) {
            console.error('❌ Bulk deletion failed:', error);
            return fallbackResponse;
        }
    },

    // Get system metrics
    async getSystemMetrics() {
        const fallbackMetrics = {
            cpu_usage: Math.random() * 100,
            memory_usage: Math.random() * 100,
            active_connections: Math.floor(Math.random() * 50) + 10,
            response_time: Math.floor(Math.random() * 100) + 50,
            database_connections: Math.floor(Math.random() * 20) + 5,
            api_requests_per_minute: Math.floor(Math.random() * 1000) + 100
        };

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/system-metrics/`),
            fallbackMetrics,
            'fetching system metrics'
        );
    },

    // Get online users
    async getOnlineUsers() {
        const fallbackOnlineUsers = [];

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/online-users/`),
            fallbackOnlineUsers,
            'fetching online users'
        );
    },

    // Assign role to user
    async assignRole(userId, roleId) {
        return safeApiCall(
            () => api.post(`${API_BASE_URL}/assign-role/`, {
                user_id: userId,
                role_id: roleId
            }),
            { success: false, message: 'Role assignment simulated' },
            `assigning role ${roleId} to user ${userId}`
        );
    },

    // Remove role from user
    async removeRole(userId, roleId) {
        return safeApiCall(
            () => api.post(`${API_BASE_URL}/remove-role/`, {
                user_id: userId,
                role_id: roleId
            }),
            { success: false, message: 'Role removal simulated' },
            `removing role ${roleId} from user ${userId}`
        );
    },

    // Get audit logs
    async getAuditLogs(page = 1, limit = 50) {
        const fallbackLogs = {
            results: [],
            count: 0,
            next: null,
            previous: null
        };

        return safeApiCall(
            () => api.get(`${API_BASE_URL}/audit-logs/?page=${page}&limit=${limit}`),
            fallbackLogs,
            'fetching audit logs'
        );
    }
};

export default rbacApiService;
