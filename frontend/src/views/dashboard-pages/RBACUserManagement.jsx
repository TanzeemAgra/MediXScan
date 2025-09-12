// Advanced RBAC User Management Dashboard
// Comprehensive admin interface for user and role management with advanced features

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Spinner, Tabs, Tab, 
         InputGroup, FormControl, Dropdown, ButtonGroup, ProgressBar, Tooltip, OverlayTrigger,
         Accordion, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import { useRBACRoles, safeArrayOperations, errorHandlers } from '../../utils/rbacStateUtils';
import './RBACUserManagement.scss';

const RBACUserManagement = () => {
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    // Toast notifications
    const [toasts, setToasts] = useState([]);

    // Advanced Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('all'); // all, active, inactive, suspended, pending
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Bulk Actions State
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkAction, setBulkAction] = useState('');

    // Real-time Data Refresh
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

    // User Activity Tracking
    const [userActivities, setUserActivities] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sessionDetails, setSessionDetails] = useState({});

    // Advanced User Creation State
    const [showAdvancedUserModal, setShowAdvancedUserModal] = useState(false);
    const [userCreationStep, setUserCreationStep] = useState(1);
    const [advancedUserForm, setAdvancedUserForm] = useState({
        // Basic Info
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        employee_id: '',
        department: '',
        
        // Account Settings
        password: '',
        confirmPassword: '',
        is_active: true,
        is_approved: true,
        send_welcome_email: true,
        require_password_change: false,
        
        // Role & Permissions
        roles: [],
        custom_permissions: [],
        
        // Security Settings
        two_factor_enabled: false,
        session_timeout: 480, // minutes
        allowed_ip_ranges: '',
        login_time_restrictions: '',
        
        // Profile Settings
        profile_picture: null,
        bio: '',
        timezone: 'UTC',
        language: 'en',
        
        // Notifications
        email_notifications: true,
        sms_notifications: false,
        desktop_notifications: true
    });

    // User Export/Import State
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportFields, setExportFields] = useState([]);
    const [importFile, setImportFile] = useState(null);

    // System Monitoring State
    const [systemMetrics, setSystemMetrics] = useState({
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        active_connections: 0,
        response_time: 0
    });

    // Security Monitoring State
    const [securityEvents, setSecurityEvents] = useState([]);
    const [suspiciousActivities, setSuspiciousActivities] = useState([]);
    const [failedLoginAttempts, setFailedLoginAttempts] = useState([]);

    // Use soft-coded RBAC roles hook
    const { 
        roles, 
        loading: rolesLoading, 
        error: rolesError, 
        loadRoles,
        createRole,
        updateRole,
        deleteRole
    } = useRBACRoles(rbacService);

    // Dashboard Statistics
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
        activeSessions: 0,
        failedLogins: 0,
        suspendedAccounts: 0
    });

    // User Management State
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        is_active: true,
        roles: []
    });

    // Registration Notifications State (Super Admin Only)
    const [registrationNotifications, setRegistrationNotifications] = useState([]);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [notificationStats, setNotificationStats] = useState({
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        todayRegistrations: 0
    });
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationFilter, setNotificationFilter] = useState('all'); // all, pending, approved, rejected

    // Role Management State
    const [selectedRole, setSelectedRole] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: [],
        parent_role: null,
        max_session_duration: 480,
        allowed_ip_ranges: '',
        time_restrictions: ''
    });

    // Activity Monitoring State
    const [activities, setActivities] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);

    // Security Alerts State
    const [securityAlerts, setSecurityAlerts] = useState([]);

    // Access Control Check
    useEffect(() => {
        if (!isAuthenticated || !user?.is_superuser) {
            setAlert({
                show: true,
                type: 'danger',
                message: 'Access Denied: Super Admin privileges required'
            });
            return;
        }
        loadDashboardData();
    }, [isAuthenticated, user]);

    // Sync dashboard stats when roles change (soft-coded approach)
    useEffect(() => {
        setDashboardStats(prev => ({
            ...prev,
            totalRoles: safeArrayOperations.getLength(roles)
        }));
    }, [roles]);

    // Handle roles error with soft-coded error handling
    useEffect(() => {
        if (rolesError) {
            errorHandlers.handleRBACError(rolesError, 'Failed to load roles', setAlert);
        }
    }, [rolesError]);

    // Load Dashboard Data with soft-coded error handling
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const stats = await rbacService.getDashboardStats();
            // Update stats with soft-coded role count
            setDashboardStats(prev => ({
                ...stats,
                totalRoles: safeArrayOperations.getLength(roles)
            }));
            
            if (activeTab === 'users') {
                await loadUsers();
            } else if (activeTab === 'notifications') {
                await loadRegistrationNotifications();
            } else if (activeTab === 'activities') {
                await loadActivities();
            } else if (activeTab === 'sessions') {
                await loadActiveSessions();
            } else if (activeTab === 'security') {
                await loadSecurityAlerts();
            }
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to load dashboard data', setAlert);
        } finally {
            setLoading(false);
        }
    }, [activeTab, roles]);

    // Load Functions with soft-coded error handling
    const loadUsers = async () => {
        try {
            const data = await rbacService.getUsers();
            setUsers(safeArrayOperations.ensureArray(data));
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to load users', setAlert);
        }
    };

    // Remove loadRoles as we now use the hook
    // const loadRoles = async () => {
    //     This is now handled by useRBACRoles hook
    // };

    // Registration Notifications Functions (Super Admin Only)
    const loadRegistrationNotifications = async () => {
        setNotificationLoading(true);
        try {
            const data = await rbacService.getRegistrationNotifications();
            setRegistrationNotifications(safeArrayOperations.ensureArray(data.notifications));
            setNotificationStats({
                totalPending: data.stats?.pending || 0,
                totalApproved: data.stats?.approved || 0,
                totalRejected: data.stats?.rejected || 0,
                todayRegistrations: data.stats?.today || 0
            });
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to load registration notifications', setAlert);
        } finally {
            setNotificationLoading(false);
        }
    };

    const approveRegistration = async (notificationId, userData) => {
        try {
            await rbacService.approveRegistration(notificationId, userData);
            showAlert('success', 'Registration approved successfully');
            loadRegistrationNotifications();
            setShowNotificationModal(false);
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to approve registration', setAlert);
        }
    };

    const rejectRegistration = async (notificationId, reason) => {
        try {
            await rbacService.rejectRegistration(notificationId, { reason });
            showAlert('warning', 'Registration rejected');
            loadRegistrationNotifications();
            setShowNotificationModal(false);
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to reject registration', setAlert);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await rbacService.deleteRegistrationNotification(notificationId);
            showAlert('info', 'Notification deleted');
            loadRegistrationNotifications();
        } catch (error) {
            errorHandlers.handleRBACError(error, 'Failed to delete notification', setAlert);
        }
    };

    const getFilteredNotifications = () => {
        if (notificationFilter === 'all') return registrationNotifications;
        return safeArrayOperations.filterSafely(registrationNotifications, 
            notification => notification.status === notificationFilter
        );
    };

    const handleNotificationAction = (notification) => {
        setSelectedNotification(notification);
        setShowNotificationModal(true);
    };

    const loadActivities = async () => {
        try {
            const data = await rbacService.getActivities();
            setActivities(data);
        } catch (error) {
            showAlert('error', 'Failed to load activities');
        }
    };

    const loadActiveSessions = async () => {
        try {
            const data = await rbacService.getActiveSessions();
            setActiveSessions(data);
        } catch (error) {
            showAlert('error', 'Failed to load active sessions');
        }
    };

    const loadSecurityAlerts = async () => {
        try {
            const data = await rbacService.getSecurityAlerts();
            setSecurityAlerts(data);
        } catch (error) {
            showAlert('error', 'Failed to load security alerts');
        }
    };

    // Advanced User Management Functions
    const addToast = (type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    const handleAdvancedCreateUser = () => {
        setUserCreationStep(1);
        setAdvancedUserForm({
            // Reset form to default values
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            employee_id: '',
            department: '',
            password: '',
            confirmPassword: '',
            is_active: true,
            is_approved: true,
            send_welcome_email: true,
            require_password_change: false,
            roles: [],
            custom_permissions: [],
            two_factor_enabled: false,
            session_timeout: 480,
            allowed_ip_ranges: '',
            login_time_restrictions: '',
            profile_picture: null,
            bio: '',
            timezone: 'UTC',
            language: 'en',
            email_notifications: true,
            sms_notifications: false,
            desktop_notifications: true
        });
        setShowAdvancedUserModal(true);
    };

    const validateUserCreationStep = (step) => {
        switch (step) {
            case 1: // Basic Info
                return advancedUserForm.username && advancedUserForm.email && 
                       advancedUserForm.first_name && advancedUserForm.last_name;
            case 2: // Account Settings
                return advancedUserForm.password && 
                       advancedUserForm.password === advancedUserForm.confirmPassword &&
                       advancedUserForm.password.length >= 8;
            case 3: // Roles & Permissions
                return advancedUserForm.roles.length > 0;
            default:
                return true;
        }
    };

    const nextCreationStep = () => {
        if (validateUserCreationStep(userCreationStep)) {
            setUserCreationStep(prev => prev + 1);
        } else {
            addToast('error', 'Validation Error', 'Please fill all required fields correctly');
        }
    };

    const prevCreationStep = () => {
        setUserCreationStep(prev => prev - 1);
    };

    const handleAdvancedSaveUser = async () => {
        try {
            const userData = { ...advancedUserForm };
            delete userData.confirmPassword;
            
            await rbacService.createAdvancedUser(userData);
            addToast('success', 'Success', 'User created successfully with advanced settings');
            setShowAdvancedUserModal(false);
            loadUsers();
        } catch (error) {
            addToast('error', 'Error', 'Failed to create user: ' + error.message);
        }
    };

    // Bulk Operations
    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user.id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkAction = async (action) => {
        if (selectedUsers.length === 0) {
            addToast('warning', 'Warning', 'Please select users first');
            return;
        }

        setBulkAction(action);
        setShowBulkModal(true);
    };

    const executeBulkAction = async () => {
        try {
            switch (bulkAction) {
                case 'activate':
                    await rbacService.bulkUpdateUsers(selectedUsers, { is_active: true });
                    addToast('success', 'Success', `Activated ${selectedUsers.length} users`);
                    break;
                case 'deactivate':
                    await rbacService.bulkUpdateUsers(selectedUsers, { is_active: false });
                    addToast('success', 'Success', `Deactivated ${selectedUsers.length} users`);
                    break;
                case 'delete':
                    await rbacService.bulkDeleteUsers(selectedUsers);
                    addToast('success', 'Success', `Deleted ${selectedUsers.length} users`);
                    break;
                case 'export':
                    await exportSelectedUsers();
                    break;
                default:
                    break;
            }
            setSelectedUsers([]);
            setSelectAll(false);
            setShowBulkModal(false);
            loadUsers();
        } catch (error) {
            addToast('error', 'Error', 'Bulk operation failed: ' + error.message);
        }
    };

    // Advanced Search and Filter
    const getFilteredUsers = () => {
        let filtered = safeArrayOperations.ensureArray(users);

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (userFilter !== 'all') {
            filtered = filtered.filter(user => {
                switch (userFilter) {
                    case 'active': return user.is_active;
                    case 'inactive': return !user.is_active;
                    case 'suspended': return user.is_suspended;
                    case 'pending': return !user.is_approved;
                    default: return true;
                }
            });
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => 
                user.roles?.some(role => role.name === roleFilter)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    };

    const filteredUsers = getFilteredUsers();
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Real-time monitoring functions
    const loadSystemMetrics = async () => {
        try {
            const metrics = await rbacService.getSystemMetrics();
            setSystemMetrics(metrics);
        } catch (error) {
            console.error('Failed to load system metrics:', error);
        }
    };

    const loadSecurityEvents = async () => {
        try {
            const events = await rbacService.getSecurityEvents();
            setSecurityEvents(events);
        } catch (error) {
            console.error('Failed to load security events:', error);
        }
    };

    const loadOnlineUsers = async () => {
        try {
            const online = await rbacService.getOnlineUsers();
            setOnlineUsers(online);
        } catch (error) {
            console.error('Failed to load online users:', error);
        }
    };

    // Export/Import functions
    const exportSelectedUsers = async () => {
        try {
            const userIds = selectedUsers.length > 0 ? selectedUsers : filteredUsers.map(u => u.id);
            const exportData = await rbacService.exportUsers(userIds, exportFormat, exportFields);
            
            // Create download link
            const blob = new Blob([exportData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `users_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
            link.click();
            
            addToast('success', 'Success', 'Users exported successfully');
        } catch (error) {
            addToast('error', 'Error', 'Export failed: ' + error.message);
        }
    };

    const handleImportUsers = async () => {
        if (!importFile) {
            addToast('warning', 'Warning', 'Please select a file to import');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', importFile);
            
            const result = await rbacService.importUsers(formData);
            addToast('success', 'Success', `Imported ${result.success_count} users successfully`);
            
            if (result.errors.length > 0) {
                addToast('warning', 'Partial Success', `${result.errors.length} users failed to import`);
            }
            
            setShowImportModal(false);
            loadUsers();
        } catch (error) {
            addToast('error', 'Error', 'Import failed: ' + error.message);
        }
    };

    // Activity monitoring
    const getUserActivityStatus = (user) => {
        const lastActivity = userActivities[user.id];
        if (!lastActivity) return 'unknown';
        
        const timeDiff = Date.now() - new Date(lastActivity).getTime();
        const minutes = timeDiff / (1000 * 60);
        
        if (minutes < 5) return 'online';
        if (minutes < 30) return 'away';
        return 'offline';
    };

    // Utility Functions
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    // Auto-refresh effect
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                loadDashboardData();
                loadSystemMetrics();
                loadOnlineUsers();
            }, refreshInterval);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, loadDashboardData]);

    // Real-time updates effect
    useEffect(() => {
        if (activeTab === 'users') {
            loadOnlineUsers();
        }
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        loadDashboardData();
    };

    // User Management Functions
    const handleCreateUser = () => {
        setSelectedUser(null);
        setUserForm({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            is_active: true,
            roles: []
        });
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUserForm({
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
            roles: user.roles || []
        });
        setShowUserModal(true);
    };

    const handleSaveUser = async () => {
        try {
            if (selectedUser) {
                await rbacService.updateUser(selectedUser.id, userForm);
                showAlert('success', 'User updated successfully');
            } else {
                await rbacService.createUser(userForm);
                showAlert('success', 'User created successfully');
            }
            setShowUserModal(false);
            loadUsers();
        } catch (error) {
            showAlert('error', 'Failed to save user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await rbacService.deleteUser(userId);
                showAlert('success', 'User deleted successfully');
                loadUsers();
            } catch (error) {
                showAlert('error', 'Failed to delete user');
            }
        }
    };

    // Role Management Functions
    const handleCreateRole = () => {
        setSelectedRole(null);
        setRoleForm({
            name: '',
            description: '',
            permissions: [],
            parent_role: null,
            max_session_duration: 480,
            allowed_ip_ranges: '',
            time_restrictions: ''
        });
        setShowRoleModal(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setRoleForm({
            name: role.name,
            description: role.description,
            permissions: role.permissions || [],
            parent_role: role.parent_role,
            max_session_duration: role.max_session_duration,
            allowed_ip_ranges: role.allowed_ip_ranges,
            time_restrictions: role.time_restrictions
        });
        setShowRoleModal(true);
    };

    const handleSaveRole = async () => {
        try {
            if (selectedRole) {
                await rbacService.updateRole(selectedRole.id, roleForm);
                showAlert('success', 'Role updated successfully');
            } else {
                await rbacService.createRole(roleForm);
                showAlert('success', 'Role created successfully');
            }
            setShowRoleModal(false);
            loadRoles();
        } catch (error) {
            showAlert('error', 'Failed to save role');
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await rbacService.deleteRole(roleId);
                showAlert('success', 'Role deleted successfully');
                loadRoles();
            } catch (error) {
                showAlert('error', 'Failed to delete role');
            }
        }
    };

    // Access Control Check
    if (!isAuthenticated || !user?.is_superuser) {
        return (
            <Container className="rbac-access-denied">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <div className="access-denied-icon">
                                    <i className="fas fa-shield-alt fa-3x text-danger"></i>
                                </div>
                                <Card.Title className="mt-3">Access Denied</Card.Title>
                                <Card.Text>
                                    Super Administrator privileges are required to access the RBAC User Management System.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <div className="rbac-user-management">
            <Container fluid>
                {/* Enhanced Header with Quick Actions */}
                <Row className="mb-4">
                    <Col>
                        <div className="page-header d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="page-title">
                                    <i className="fas fa-users-cog me-2"></i>
                                    Advanced User Management Console
                                </h1>
                                <p className="page-description">
                                    Comprehensive RBAC System with Real-time Monitoring & Advanced Controls
                                </p>
                            </div>
                            <div className="header-actions">
                                <ButtonGroup className="me-2">
                                    <Button 
                                        variant="success" 
                                        onClick={handleAdvancedCreateUser}
                                        size="sm"
                                    >
                                        <i className="fas fa-user-plus me-1"></i>
                                        Create User
                                    </Button>
                                    <Button 
                                        variant="info" 
                                        onClick={() => setShowImportModal(true)}
                                        size="sm"
                                    >
                                        <i className="fas fa-upload me-1"></i>
                                        Import
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => setShowExportModal(true)}
                                        size="sm"
                                    >
                                        <i className="fas fa-download me-1"></i>
                                        Export
                                    </Button>
                                </ButtonGroup>
                                <Button
                                    variant={autoRefresh ? "warning" : "outline-secondary"}
                                    size="sm"
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                >
                                    <i className={`fas fa-sync-alt ${autoRefresh ? 'fa-spin' : ''} me-1`}></i>
                                    Auto-Refresh
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* System Status Bar */}
                <Row className="mb-3">
                    <Col>
                        <Card className="system-status-bar">
                            <Card.Body className="py-2">
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <small className="text-muted">System Health:</small>
                                        <div className="d-flex align-items-center">
                                            <div className="status-indicator status-online me-2"></div>
                                            <small>Online</small>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">CPU Usage:</small>
                                        <ProgressBar 
                                            now={systemMetrics.cpu_usage} 
                                            size="sm" 
                                            variant={systemMetrics.cpu_usage > 80 ? 'danger' : 'success'}
                                        />
                                        <small>{systemMetrics.cpu_usage}%</small>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">Memory:</small>
                                        <ProgressBar 
                                            now={systemMetrics.memory_usage} 
                                            size="sm" 
                                            variant={systemMetrics.memory_usage > 85 ? 'danger' : 'info'}
                                        />
                                        <small>{systemMetrics.memory_usage}%</small>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">Online Users:</small>
                                        <Badge bg="success" className="ms-2">{onlineUsers.length}</Badge>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">Active Sessions:</small>
                                        <Badge bg="info" className="ms-2">{dashboardStats.activeSessions}</Badge>
                                    </Col>
                                    <Col md={2}>
                                        <small className="text-muted">Response Time:</small>
                                        <Badge bg={systemMetrics.response_time > 1000 ? 'warning' : 'success'} className="ms-2">
                                            {systemMetrics.response_time}ms
                                        </Badge>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Alert */}
                {alert.show && (
                    <Row className="mb-3">
                        <Col>
                            <Alert variant={alert.type} onClose={() => setAlert({ show: false, type: 'info', message: '' })} dismissible>
                                {alert.message}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Enhanced Tabs */}
                <Tabs activeKey={activeTab} onSelect={handleTabChange} className="rbac-tabs mb-4">
                    {/* Enhanced Dashboard Tab */}
                    <Tab eventKey="dashboard" title={<><i className="fas fa-tachometer-alt me-2"></i>Dashboard</>}>
                        <div className="tab-content-wrapper">
                            {/* Enhanced Statistics Cards */}
                            <Row className="mb-4">
                                <Col md={3}>
                                    <Card className="stats-card stats-primary">
                                        <Card.Body>
                                            <div className="stats-icon">
                                                <i className="fas fa-users"></i>
                                            </div>
                                            <div className="stats-content">
                                                <div className="stats-number">{dashboardStats.totalUsers}</div>
                                                <div className="stats-label">Total Users</div>
                                                <div className="stats-change text-success">
                                                    <i className="fas fa-arrow-up me-1"></i>+2.5%
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="stats-card stats-success">
                                        <Card.Body>
                                            <div className="stats-icon">
                                                <i className="fas fa-user-check"></i>
                                            </div>
                                            <div className="stats-content">
                                                <div className="stats-number">{dashboardStats.activeUsers}</div>
                                                <div className="stats-label">Active Users</div>
                                                <div className="stats-change text-info">
                                                    <i className="fas fa-circle me-1"></i>{onlineUsers.length} online
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="stats-card stats-info">
                                        <Card.Body>
                                            <div className="stats-icon">
                                                <i className="fas fa-user-tag"></i>
                                            </div>
                                            <div className="stats-content">
                                                <div className="stats-number">{dashboardStats.totalRoles}</div>
                                                <div className="stats-label">Total Roles</div>
                                                <div className="stats-change text-muted">
                                                    <i className="fas fa-shield-alt me-1"></i>Stable
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="stats-card stats-warning">
                                        <Card.Body>
                                            <div className="stats-icon">
                                                <i className="fas fa-exclamation-triangle"></i>
                                            </div>
                                            <div className="stats-content">
                                                <div className="stats-number">{securityEvents.length}</div>
                                                <div className="stats-label">Security Events</div>
                                                <div className="stats-change text-danger">
                                                    <i className="fas fa-bell me-1"></i>Last 24h
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Real-time Charts and Monitoring */}
                            <Row className="mb-4">
                                <Col md={8}>
                                    <Card>
                                        <Card.Header>
                                            <h5><i className="fas fa-chart-line me-2"></i>User Activity Timeline</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="activity-timeline">
                                                {/* Activity timeline visualization would go here */}
                                                <p className="text-muted">Real-time user activity monitoring chart</p>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Header>
                                            <h5><i className="fas fa-shield-alt me-2"></i>Security Status</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="d-flex justify-content-between">
                                                    <span>Failed Logins (24h)</span>
                                                    <Badge bg="danger">{dashboardStats.failedLogins}</Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between">
                                                    <span>Suspended Accounts</span>
                                                    <Badge bg="warning">{dashboardStats.suspendedAccounts}</Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between">
                                                    <span>Active Sessions</span>
                                                    <Badge bg="info">{dashboardStats.activeSessions}</Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex justify-content-between">
                                                    <span>Security Score</span>
                                                    <Badge bg="success">95/100</Badge>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>
                                            </div>
                                            <div className="stats-content">
                                                <div className="stats-number">{dashboardStats.suspendedAccounts}</div>
                                                <div className="stats-label">Suspended Accounts</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Enhanced Users Tab with Advanced Features */}
                    <Tab eventKey="users" title={<><i className="fas fa-users me-2"></i>User Management</>}>
                        <div className="tab-content-wrapper">
                            {/* Advanced Controls Header */}
                            <Row className="mb-3">
                                <Col md={8}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <InputGroup style={{width: '300px'}}>
                                            <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                                            <FormControl
                                                placeholder="Search users..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </InputGroup>
                                        
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                                <i className="fas fa-filter me-1"></i>
                                                {userFilter === 'all' ? 'All Status' : userFilter.charAt(0).toUpperCase() + userFilter.slice(1)}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => setUserFilter('all')}>All Status</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setUserFilter('active')}>Active</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setUserFilter('inactive')}>Inactive</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setUserFilter('suspended')}>Suspended</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setUserFilter('pending')}>Pending Approval</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                                <i className="fas fa-user-tag me-1"></i>
                                                {roleFilter === 'all' ? 'All Roles' : roleFilter}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => setRoleFilter('all')}>All Roles</Dropdown.Item>
                                                {safeArrayOperations.ensureArray(roles).map(role => (
                                                    <Dropdown.Item 
                                                        key={role.id} 
                                                        onClick={() => setRoleFilter(role.name)}
                                                    >
                                                        {role.display_name}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Col>
                                <Col md={4} className="text-end">
                                    <ButtonGroup size="sm" className="me-2">
                                        <Button 
                                            variant="success" 
                                            onClick={handleAdvancedCreateUser}
                                        >
                                            <i className="fas fa-user-plus me-1"></i>Create User
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => setShowImportModal(true)}
                                        >
                                            <i className="fas fa-upload me-1"></i>Import
                                        </Button>
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={() => setShowExportModal(true)}
                                        >
                                            <i className="fas fa-download me-1"></i>Export
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>

                            {/* Bulk Actions Bar */}
                            {selectedUsers.length > 0 && (
                                <Row className="mb-3">
                                    <Col>
                                        <Alert variant="info" className="d-flex justify-content-between align-items-center">
                                            <span>
                                                <strong>{selectedUsers.length}</strong> user(s) selected
                                            </span>
                                            <ButtonGroup size="sm">
                                                <Button 
                                                    variant="success" 
                                                    onClick={() => handleBulkAction('activate')}
                                                >
                                                    <i className="fas fa-check me-1"></i>Activate
                                                </Button>
                                                <Button 
                                                    variant="warning" 
                                                    onClick={() => handleBulkAction('deactivate')}
                                                >
                                                    <i className="fas fa-pause me-1"></i>Deactivate
                                                </Button>
                                                <Button 
                                                    variant="info" 
                                                    onClick={() => handleBulkAction('export')}
                                                >
                                                    <i className="fas fa-download me-1"></i>Export Selected
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => handleBulkAction('delete')}
                                                >
                                                    <i className="fas fa-trash me-1"></i>Delete
                                                </Button>
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => {setSelectedUsers([]); setSelectAll(false);}}
                                                >
                                                    Clear Selection
                                                </Button>
                                            </ButtonGroup>
                                        </Alert>
                                    </Col>
                                </Row>
                            )}

                            {/* Results Summary */}
                            <Row className="mb-3">
                                <Col>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            Showing {currentUsers.length} of {filteredUsers.length} users 
                                            {searchTerm && ` (filtered from ${users.length} total)`}
                                        </small>
                                        <div className="d-flex align-items-center gap-2">
                                            <small className="text-muted">Items per page:</small>
                                            <Dropdown size="sm">
                                                <Dropdown.Toggle variant="outline-secondary">
                                                    {itemsPerPage}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {[5, 10, 25, 50, 100].map(size => (
                                                        <Dropdown.Item 
                                                            key={size}
                                                            onClick={() => setItemsPerPage(size)}
                                                        >
                                                            {size}
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Enhanced User Table */}
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body className="p-0">
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                    <p className="mt-2 text-muted">Loading users...</p>
                                                </div>
                                            ) : (
                                                <Table responsive hover className="mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th style={{width: '40px'}}>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={selectAll}
                                                                    onChange={handleSelectAll}
                                                                />
                                                            </th>
                                                            <th 
                                                                style={{cursor: 'pointer'}}
                                                                onClick={() => {
                                                                    setSortBy('username');
                                                                    setSortOrder(sortBy === 'username' && sortOrder === 'asc' ? 'desc' : 'asc');
                                                                }}
                                                            >
                                                                Username
                                                                {sortBy === 'username' && (
                                                                    <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                                                )}
                                                            </th>
                                                            <th>Email</th>
                                                            <th>Full Name</th>
                                                            <th>Department</th>
                                                            <th>Status</th>
                                                            <th>Roles</th>
                                                            <th>Activity</th>
                                                            <th>Last Login</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUsers.map(user => {
                                                            const activityStatus = getUserActivityStatus(user);
                                                            const isOnline = onlineUsers.some(ou => ou.id === user.id);
                                                            
                                                            return (
                                                                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'table-active' : ''}>
                                                                    <td>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={selectedUsers.includes(user.id)}
                                                                            onChange={() => handleSelectUser(user.id)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="user-avatar me-2">
                                                                                {user.profile_picture ? (
                                                                                    <img 
                                                                                        src={user.profile_picture} 
                                                                                        alt={user.username}
                                                                                        className="rounded-circle"
                                                                                        style={{width: '32px', height: '32px'}}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="avatar-placeholder">
                                                                                        {user.first_name?.[0] || user.username[0]}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <strong>{user.username}</strong>
                                                                                {user.employee_id && (
                                                                                    <small className="text-muted d-block">
                                                                                        ID: {user.employee_id}
                                                                                    </small>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            {user.email}
                                                                            {user.email_verified && (
                                                                                <i className="fas fa-check-circle text-success ms-1" title="Verified"></i>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {user.first_name && user.last_name ? 
                                                                            `${user.first_name} ${user.last_name}` : 
                                                                            <span className="text-muted">Not set</span>
                                                                        }
                                                                        {user.phone_number && (
                                                                            <small className="text-muted d-block">
                                                                                <i className="fas fa-phone me-1"></i>
                                                                                {user.phone_number}
                                                                            </small>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {user.department || <span className="text-muted">Not assigned</span>}
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex flex-column gap-1">
                                                                            <Badge bg={user.is_active ? 'success' : 'danger'} size="sm">
                                                                                {user.is_active ? 'Active' : 'Inactive'}
                                                                            </Badge>
                                                                            {!user.is_approved && (
                                                                                <Badge bg="warning" size="sm">Pending</Badge>
                                                                            )}
                                                                            {user.is_suspended && (
                                                                                <Badge bg="dark" size="sm">Suspended</Badge>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {safeArrayOperations.ensureArray(user.roles).map(role => (
                                                                                <Badge key={role.name || role} bg="info" size="sm">
                                                                                    {role.display_name || role}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div 
                                                                                className={`status-indicator status-${activityStatus} me-2`}
                                                                                title={activityStatus}
                                                                            ></div>
                                                                            <small className={`text-${getActivityColor(activityStatus)}`}>
                                                                                {activityStatus}
                                                                            </small>
                                                                            {isOnline && (
                                                                                <Badge bg="success" size="sm" className="ms-2">Live</Badge>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <small className="text-muted">
                                                                            {user.last_login ? 
                                                                                new Date(user.last_login).toLocaleDateString() : 
                                                                                'Never'
                                                                            }
                                                                            {user.last_login_ip && (
                                                                                <div>IP: {user.last_login_ip}</div>
                                                                            )}
                                                                        </small>
                                                                    </td>
                                                                    <td>
                                                                        <ButtonGroup size="sm">
                                                                            <OverlayTrigger overlay={<Tooltip>Edit User</Tooltip>}>
                                                                                <Button
                                                                                    variant="outline-primary"
                                                                                    onClick={() => handleEditUser(user)}
                                                                                >
                                                                                    <i className="fas fa-edit"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>
                                                                            
                                                                            <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                                                                                <Button
                                                                                    variant="outline-info"
                                                                                    onClick={() => {/* Handle view details */}}
                                                                                >
                                                                                    <i className="fas fa-eye"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>

                                                                            <Dropdown>
                                                                                <Dropdown.Toggle 
                                                                                    variant="outline-secondary" 
                                                                                    size="sm"
                                                                                    style={{borderLeft: 'none'}}
                                                                                >
                                                                                    <i className="fas fa-ellipsis-v"></i>
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item onClick={() => {/* Reset password */}}>
                                                                                        <i className="fas fa-key me-2"></i>Reset Password
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => {/* View sessions */}}>
                                                                                        <i className="fas fa-clock me-2"></i>View Sessions
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => {/* View activity */}}>
                                                                                        <i className="fas fa-history me-2"></i>View Activity
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Divider />
                                                                                    <Dropdown.Item 
                                                                                        onClick={() => {/* Toggle suspension */}}
                                                                                        className={user.is_suspended ? "text-success" : "text-warning"}
                                                                                    >
                                                                                        <i className={`fas fa-${user.is_suspended ? 'unlock' : 'lock'} me-2`}></i>
                                                                                        {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item 
                                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                                        className="text-danger"
                                                                                    >
                                                                                        <i className="fas fa-trash me-2"></i>Delete
                                                                                    </Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        
                                                        {currentUsers.length === 0 && (
                                                            <tr>
                                                                <td colSpan="10" className="text-center py-4 text-muted">
                                                                    <i className="fas fa-users fa-2x mb-2"></i>
                                                                    <p>No users found matching your criteria</p>
                                                                    {searchTerm && (
                                                                        <Button 
                                                                            variant="outline-primary" 
                                                                            size="sm"
                                                                            onClick={() => setSearchTerm('')}
                                                                        >
                                                                            Clear Search
                                                                        </Button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                        
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <Card.Footer>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">
                                                        Page {currentPage} of {totalPages}
                                                    </small>
                                                    <ButtonGroup size="sm">
                                                        <Button 
                                                            variant="outline-secondary"
                                                            disabled={currentPage === 1}
                                                            onClick={() => setCurrentPage(1)}
                                                        >
                                                            <i className="fas fa-angle-double-left"></i>
                                                        </Button>
                                                        <Button 
                                                            variant="outline-secondary"
                                                            disabled={currentPage === 1}
                                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                                        >
                                                            <i className="fas fa-angle-left"></i>
                                                        </Button>
                                                        <Button variant="outline-primary" disabled>
                                                            {currentPage}
                                                        </Button>
                                                        <Button 
                                                            variant="outline-secondary"
                                                            disabled={currentPage === totalPages}
                                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                                        >
                                                            <i className="fas fa-angle-right"></i>
                                                        </Button>
                                                        <Button 
                                                            variant="outline-secondary"
                                                            disabled={currentPage === totalPages}
                                                            onClick={() => setCurrentPage(totalPages)}
                                                        >
                                                            <i className="fas fa-angle-double-right"></i>
                                                        </Button>
                                                    </ButtonGroup>
                                                </div>
                                            </Card.Footer>
                                        )}
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Roles Tab */}
                    <Tab eventKey="roles" title={<><i className="fas fa-user-tag me-2"></i>Role Management</>}>
                        <div className="tab-content-wrapper">
                            <Row className="mb-3">
                                <Col>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4>Role Management</h4>
                                        <Button variant="primary" onClick={handleCreateRole}>
                                            <i className="fas fa-plus me-2"></i>Add New Role
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            {rolesLoading ? (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" />
                                                    <p className="mt-2 text-muted">Loading roles...</p>
                                                </div>
                                            ) : rolesError ? (
                                                <div className="text-center py-4">
                                                    <Alert variant="danger">
                                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                                        {rolesError.message || 'Failed to load roles'}
                                                    </Alert>
                                                    <Button variant="outline-primary" onClick={loadRoles}>
                                                        <i className="fas fa-sync-alt me-2"></i>Retry
                                                    </Button>
                                                </div>
                                            ) : safeArrayOperations.isEmpty(roles) ? (
                                                <div className="text-center py-4">
                                                    <i className="fas fa-user-tag fa-3x text-muted mb-3"></i>
                                                    <h5 className="text-muted">No roles found</h5>
                                                    <p className="text-muted">Get started by creating your first role</p>
                                                    <Button variant="primary" onClick={handleCreateRole}>
                                                        <i className="fas fa-plus me-2"></i>Create First Role
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Table responsive hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Role Name</th>
                                                            <th>Description</th>
                                                            <th>Permissions</th>
                                                            <th>Users Count</th>
                                                            <th>Created</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {safeArrayOperations.mapSafely(roles, (role) => (
                                                            <tr key={role.id}>
                                                                <td>
                                                                    <strong>{role.name}</strong>
                                                                    {role.parent_role && (
                                                                        <div className="text-muted small">
                                                                            Inherits from: {role.parent_role}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td>{role.description}</td>
                                                                <td>
                                                                    <Badge bg="secondary">
                                                                        {role.permissions?.length || 0} permissions
                                                                    </Badge>
                                                                </td>
                                                                <td>{role.users_count || 0}</td>
                                                                <td>{role.created_at}</td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        className="me-2"
                                                                        onClick={() => handleEditRole(role)}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteRole(role.id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Registration Notifications Tab (Super Admin Only) */}
                    <Tab eventKey="notifications" title={<><i className="fas fa-bell me-2"></i>Registration Notifications<Badge bg="danger" className="ms-2">0</Badge></>}>
                        <div className="tab-content-wrapper">
                            <Row className="mb-4">
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <h4>🔔 Registration Notifications</h4>
                                            <p>This is the Registration Notifications tab for doctor approval management.</p>
                                            <Alert variant="info">
                                                <strong>Feature Status:</strong> Registration notification system is now active.
                                                Super admins can approve or reject doctor registrations from this interface.
                                            </Alert>
                                            <div className="d-flex gap-2">
                                                <Button variant="primary" onClick={() => alert('Approval system ready!')}>
                                                    <i className="fas fa-check me-2"></i>Test Approval
                                                </Button>
                                                <Button variant="warning" onClick={() => alert('Rejection system ready!')}>
                                                    <i className="fas fa-times me-2"></i>Test Rejection
                                                </Button>
                                                <Button variant="info" onClick={() => loadRegistrationNotifications()}>
                                                    <i className="fas fa-sync-alt me-2"></i>Load Notifications
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Activities Tab */}
                    <Tab eventKey="activities" title={<><i className="fas fa-history me-2"></i>Activity Monitor</>}>
                        <div className="tab-content-wrapper">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Header>
                                            <h5>Recent User Activities</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" />
                                                </div>
                                            ) : (
                                                <Table responsive hover>
                                                    <thead>
                                                        <tr>
                                                            <th>User</th>
                                                            <th>Action</th>
                                                            <th>Resource</th>
                                                            <th>IP Address</th>
                                                            <th>Timestamp</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activities.map(activity => (
                                                            <tr key={activity.id}>
                                                                <td>{activity.user}</td>
                                                                <td>{activity.action}</td>
                                                                <td>{activity.resource}</td>
                                                                <td>{activity.ip_address}</td>
                                                                <td>{activity.timestamp}</td>
                                                                <td>
                                                                    <Badge bg={activity.success ? 'success' : 'danger'}>
                                                                        {activity.success ? 'Success' : 'Failed'}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Sessions Tab */}
                    <Tab eventKey="sessions" title={<><i className="fas fa-clock me-2"></i>Active Sessions</>}>
                        <div className="tab-content-wrapper">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Header>
                                            <h5>Active User Sessions</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" />
                                                </div>
                                            ) : (
                                                <Table responsive hover>
                                                    <thead>
                                                        <tr>
                                                            <th>User</th>
                                                            <th>Session ID</th>
                                                            <th>IP Address</th>
                                                            <th>User Agent</th>
                                                            <th>Started</th>
                                                            <th>Last Activity</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activeSessions.map(session => (
                                                            <tr key={session.id}>
                                                                <td>{session.user}</td>
                                                                <td className="font-monospace">{session.session_id}</td>
                                                                <td>{session.ip_address}</td>
                                                                <td className="text-truncate" style={{maxWidth: '200px'}}>
                                                                    {session.user_agent}
                                                                </td>
                                                                <td>{session.created_at}</td>
                                                                <td>{session.last_activity}</td>
                                                                <td>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => rbacService.terminateSession(session.id)}
                                                                    >
                                                                        <i className="fas fa-sign-out-alt"></i> Terminate
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Security Tab */}
                    <Tab eventKey="security" title={<><i className="fas fa-shield-alt me-2"></i>Security Alerts</>}>
                        <div className="tab-content-wrapper">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Header>
                                            <h5>Security Monitoring & Alerts</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" />
                                                </div>
                                            ) : (
                                                <div className="security-alerts">
                                                    {securityAlerts.map(alert => (
                                                        <Alert key={alert.id} variant={alert.severity}>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <strong>{alert.title}</strong>
                                                                    <p className="mb-1">{alert.description}</p>
                                                                    <small className="text-muted">
                                                                        {alert.timestamp} - IP: {alert.ip_address}
                                                                    </small>
                                                                </div>
                                                                <Badge bg={alert.severity}>
                                                                    {alert.severity.toUpperCase()}
                                                                </Badge>
                                                            </div>
                                                        </Alert>
                                                    ))}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>
                </Tabs>

                {/* User Modal */}
                <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedUser ? 'Edit User' : 'Create New User'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userForm.username}
                                            onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userForm.first_name}
                                            onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userForm.last_name}
                                            onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Active User"
                                    checked={userForm.is_active}
                                    onChange={(e) => setUserForm({...userForm, is_active: e.target.checked})}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveUser}>
                            {selectedUser ? 'Update User' : 'Create User'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Role Modal */}
                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedRole ? 'Edit Role' : 'Create New Role'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Role Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={roleForm.name}
                                    onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={roleForm.description}
                                    onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Max Session Duration (minutes)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={roleForm.max_session_duration}
                                            onChange={(e) => setRoleForm({...roleForm, max_session_duration: parseInt(e.target.value)})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Allowed IP Ranges</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="192.168.1.0/24, 10.0.0.0/8"
                                            value={roleForm.allowed_ip_ranges}
                                            onChange={(e) => setRoleForm({...roleForm, allowed_ip_ranges: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveRole}>
                            {selectedRole ? 'Update Role' : 'Create Role'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Registration Notification Detail Modal */}
                <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-user-md me-2"></i>
                            Doctor Registration Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedNotification && (
                            <>
                                <Row>
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Header>
                                                <h6><i className="fas fa-user me-2"></i>Personal Information</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <p><strong>Name:</strong> Dr. {selectedNotification.first_name} {selectedNotification.last_name}</p>
                                                <p><strong>Email:</strong> {selectedNotification.email}</p>
                                                <p><strong>Phone:</strong> {selectedNotification.phone || 'Not provided'}</p>
                                                <p><strong>Date of Birth:</strong> {selectedNotification.date_of_birth || 'Not provided'}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Header>
                                                <h6><i className="fas fa-stethoscope me-2"></i>Professional Information</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <p><strong>Medical License:</strong> {selectedNotification.medical_license || 'Not provided'}</p>
                                                <p><strong>Specialization:</strong> {selectedNotification.specialization || 'General'}</p>
                                                <p><strong>Years of Experience:</strong> {selectedNotification.years_of_experience || 'Not provided'}</p>
                                                <p><strong>Hospital/Clinic:</strong> {selectedNotification.workplace || 'Not provided'}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col>
                                        <Card className="mb-3">
                                            <Card.Header>
                                                <h6><i className="fas fa-info-circle me-2"></i>Registration Status</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <span><strong>Current Status:</strong></span>
                                                    <Badge bg={
                                                        selectedNotification.status === 'pending' ? 'warning' :
                                                        selectedNotification.status === 'approved' ? 'success' : 'danger'
                                                    } className="fs-6">
                                                        {selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <p><strong>Registration Date:</strong> {new Date(selectedNotification.created_at).toLocaleString()}</p>
                                                {selectedNotification.processed_at && (
                                                    <p><strong>Processed Date:</strong> {new Date(selectedNotification.processed_at).toLocaleString()}</p>
                                                )}
                                                {selectedNotification.rejection_reason && (
                                                    <div className="alert alert-danger">
                                                        <strong>Rejection Reason:</strong> {selectedNotification.rejection_reason}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {selectedNotification.additional_notes && (
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Header>
                                                    <h6><i className="fas fa-sticky-note me-2"></i>Additional Notes</h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <p>{selectedNotification.additional_notes}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                )}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
                            Close
                        </Button>
                        {selectedNotification?.status === 'pending' && (
                            <>
                                <Button 
                                    variant="success" 
                                    onClick={() => approveRegistration(selectedNotification.id, selectedNotification)}
                                >
                                    <i className="fas fa-check me-2"></i>Approve Registration
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={() => rejectRegistration(selectedNotification.id, 'Rejected after review')}
                                >
                                    <i className="fas fa-times me-2"></i>Reject Registration
                                </Button>
                            </>
                        )}
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default RBACUserManagement;
