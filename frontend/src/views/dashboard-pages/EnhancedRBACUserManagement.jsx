// Enhanced RBAC User Management Dashboard
// Comprehensive admin interface for user and role management with advanced features

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Spinner, Tabs, Tab, 
         InputGroup, FormControl, Dropdown, ButtonGroup, ProgressBar, Tooltip, OverlayTrigger,
         Accordion, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import './RBACUserManagement.scss';

const EnhancedRBACUserManagement = () => {
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    // Toast notifications
    const [toasts, setToasts] = useState([]);

    // Advanced Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // User Management State
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkAction, setBulkAction] = useState('');

    // Dashboard Statistics
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
        activeSessions: 0,
        failedLogins: 0,
        suspendedAccounts: 0
    });

    // Real-time Data
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30000);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [systemMetrics, setSystemMetrics] = useState({
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        active_connections: 0,
        response_time: 0
    });

    // User Creation Modal State
    const [showAdvancedUserModal, setShowAdvancedUserModal] = useState(false);
    const [userCreationStep, setUserCreationStep] = useState(1);
    const [advancedUserForm, setAdvancedUserForm] = useState({
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

    // Roles and permissions state
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [rolesError, setRolesError] = useState(null);

    // Load roles function
    const loadRoles = async () => {
        try {
            setRolesLoading(true);
            const rolesData = await rbacService.getRoles();
            setRoles(Array.isArray(rolesData) ? rolesData : []);
            const permissionsData = await rbacService.getPermissions();
            setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
        } catch (error) {
            console.error('Error loading roles:', error);
            setRolesError(error);
        } finally {
            setRolesLoading(false);
        }
    };

    // Utility Functions
    const addToast = (type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    // Load Functions
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const stats = await rbacService.getDashboardStats();
            setDashboardStats(stats);
            
            if (activeTab === 'users') {
                await loadUsers();
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setAlert({ 
                show: true, 
                type: 'danger', 
                message: 'Failed to load dashboard data: ' + (error.message || 'Unknown error')
            });
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            const data = await rbacService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading users:', error);
            setAlert({ 
                show: true, 
                type: 'danger', 
                message: 'Failed to load users: ' + (error.message || 'Unknown error')
            });
        }
    };

    const loadSystemMetrics = async () => {
        try {
            const metrics = await rbacService.getSystemMetrics();
            setSystemMetrics(metrics);
        } catch (error) {
            console.error('Failed to load system metrics:', error);
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

    // User Management Functions
    const handleAdvancedCreateUser = () => {
        setUserCreationStep(1);
        setAdvancedUserForm({
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

    const handleAdvancedSaveUser = async () => {
        try {
            setLoading(true);
            console.log('🔄 Starting user creation process...');
            
            // Validate form data
            const { username, email, first_name, last_name, password, confirmPassword } = advancedUserForm;
            
            // Basic validation with soft-coded messages
            if (!username || !email || !first_name || !last_name || !password) {
                const missingFields = [];
                if (!username) missingFields.push('Username');
                if (!email) missingFields.push('Email');
                if (!first_name) missingFields.push('First Name');
                if (!last_name) missingFields.push('Last Name');
                if (!password) missingFields.push('Password');
                
                addToast('error', 'Validation Error', `Please fill in: ${missingFields.join(', ')}`);
                setLoading(false);
                return;
            }
            
            if (password !== confirmPassword) {
                addToast('error', 'Validation Error', 'Passwords do not match');
                setLoading(false);
                return;
            }
            
            if (password.length < 6) {
                addToast('error', 'Validation Error', 'Password must be at least 6 characters long');
                setLoading(false);
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                addToast('error', 'Validation Error', 'Please enter a valid email address');
                setLoading(false);
                return;
            }
            
            // Prepare user data (soft-coded approach)
            const userData = { 
                ...advancedUserForm,
                roles: Array.isArray(advancedUserForm.roles) ? advancedUserForm.roles : []
            };
            delete userData.confirmPassword; // Remove confirmPassword from submission
            
            console.log('🚀 Creating user with data:', JSON.stringify(userData, null, 2));
            
            // Try multiple creation methods for robustness
            let result;
            try {
                // Primary method: Use rbacService
                result = await rbacService.createAdvancedUser(userData);
                console.log('✅ User creation via rbacService successful:', result);
            } catch (rbacError) {
                console.warn('⚠️ rbacService failed, trying API directly:', rbacError);
                // Fallback method: Direct API call
                try {
                    const response = await fetch('http://localhost:8000/api/rbac/users/create-advanced/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'mock-token'}`
                        },
                        body: JSON.stringify(userData)
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP ${response.status}`);
                    }
                    
                    result = await response.json();
                    console.log('✅ User creation via direct API successful:', result);
                } catch (apiError) {
                    console.error('❌ Both creation methods failed:', apiError);
                    throw apiError;
                }
            }
            
            addToast('success', 'Success', 'User created successfully with advanced settings');
            setShowAdvancedUserModal(false);
            setUserCreationStep(1); // Reset to first step
            
            // Reset form (soft-coded default values)
            setAdvancedUserForm({
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
                notification_preferences: {
                    email_notifications: true,
                    sms_notifications: false,
                    system_alerts: true
                }
            });
            
            await loadUsers(); // Reload users list
            
        } catch (error) {
            console.error('❌ Error creating user:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create user';
            addToast('error', 'Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

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

    // Filter and Search Functions
    const getFilteredUsers = () => {
        let filtered = Array.isArray(users) ? users : [];

        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

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

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => 
                user.roles?.some(role => role.name === roleFilter)
            );
        }

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

    const getUserActivityStatus = (user) => {
        if (onlineUsers.some(ou => ou.id === user.id)) return 'online';
        return 'offline';
    };

    const getActivityColor = (status) => {
        switch (status) {
            case 'online': return 'success';
            case 'away': return 'warning';
            case 'offline': return 'secondary';
            default: return 'light';
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        loadDashboardData();
    };

    // Effects
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
        loadRoles();
    }, [isAuthenticated, user, loadDashboardData]);

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
                {/* Enhanced Header */}
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
                                        size="sm"
                                    >
                                        <i className="fas fa-upload me-1"></i>
                                        Import
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
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
                                                <div className="stats-number">{dashboardStats.failedLogins}</div>
                                                <div className="stats-label">Failed Logins</div>
                                                <div className="stats-change text-danger">
                                                    <i className="fas fa-bell me-1"></i>Last 24h
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Enhanced Users Tab */}
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
                                                            <th>Username</th>
                                                            <th>Email</th>
                                                            <th>Full Name</th>
                                                            <th>Department</th>
                                                            <th>Status</th>
                                                            <th>Roles</th>
                                                            <th>Activity</th>
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
                                                                                <div className="avatar-placeholder">
                                                                                    {user.first_name?.[0] || user.username[0]}
                                                                                </div>
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
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {(Array.isArray(user.roles) ? user.roles : []).map(role => (
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
                                                                        <ButtonGroup size="sm">
                                                                            <OverlayTrigger overlay={<Tooltip>Edit User</Tooltip>}>
                                                                                <Button
                                                                                    variant="outline-primary"
                                                                                >
                                                                                    <i className="fas fa-edit"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>
                                                                            
                                                                            <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                                                                                <Button
                                                                                    variant="outline-info"
                                                                                >
                                                                                    <i className="fas fa-eye"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>

                                                                            <OverlayTrigger overlay={<Tooltip>Delete User</Tooltip>}>
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                >
                                                                                    <i className="fas fa-trash"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        
                                                        {currentUsers.length === 0 && (
                                                            <tr>
                                                                <td colSpan="9" className="text-center py-4 text-muted">
                                                                    <i className="fas fa-users fa-2x mb-2"></i>
                                                                    <p>No users found</p>
                                                                    <Button 
                                                                        variant="primary" 
                                                                        onClick={handleAdvancedCreateUser}
                                                                    >
                                                                        <i className="fas fa-user-plus me-1"></i>
                                                                        Create First User
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>
                </Tabs>

                {/* Advanced User Creation Modal */}
                <Modal 
                    show={showAdvancedUserModal} 
                    onHide={() => setShowAdvancedUserModal(false)}
                    size="lg"
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-user-plus me-2"></i>
                            Create New User - Step {userCreationStep} of 4
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {userCreationStep === 1 && (
                            <div>
                                <h5>Basic Information</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Username *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={advancedUserForm.username}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, username: e.target.value}))}
                                                placeholder="Enter username"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={advancedUserForm.email}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, email: e.target.value}))}
                                                placeholder="Enter email"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={advancedUserForm.first_name}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, first_name: e.target.value}))}
                                                placeholder="Enter first name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Last Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={advancedUserForm.last_name}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, last_name: e.target.value}))}
                                                placeholder="Enter last name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Department</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={advancedUserForm.department}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, department: e.target.value}))}
                                                placeholder="Enter department"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Employee ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={advancedUserForm.employee_id}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, employee_id: e.target.value}))}
                                                placeholder="Enter employee ID"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {userCreationStep === 2 && (
                            <div>
                                <h5>Account Security</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={advancedUserForm.password}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, password: e.target.value}))}
                                                placeholder="Enter password"
                                            />
                                            <Form.Text className="text-muted">
                                                Minimum 8 characters
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={advancedUserForm.confirmPassword}
                                                onChange={(e) => setAdvancedUserForm(prev => ({...prev, confirmPassword: e.target.value}))}
                                                placeholder="Confirm password"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Check
                                            type="checkbox"
                                            id="two-factor"
                                            label="Enable Two-Factor Authentication"
                                            checked={advancedUserForm.two_factor_enabled}
                                            onChange={(e) => setAdvancedUserForm(prev => ({...prev, two_factor_enabled: e.target.checked}))}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="require-password-change"
                                            label="Require password change on first login"
                                            checked={advancedUserForm.require_password_change}
                                            onChange={(e) => setAdvancedUserForm(prev => ({...prev, require_password_change: e.target.checked}))}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {userCreationStep === 3 && (
                            <div>
                                <h5>Roles & Permissions</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assign Roles *</Form.Label>
                                    <div className="role-selection">
                                        {(Array.isArray(roles) ? roles : []).map(role => (
                                            <Form.Check
                                                key={role.id}
                                                type="checkbox"
                                                id={`role-${role.id}`}
                                                label={`${role.display_name} (${role.name})`}
                                                checked={advancedUserForm.roles.includes(role.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAdvancedUserForm(prev => ({
                                                            ...prev, 
                                                            roles: [...prev.roles, role.id]
                                                        }));
                                                    } else {
                                                        setAdvancedUserForm(prev => ({
                                                            ...prev, 
                                                            roles: prev.roles.filter(id => id !== role.id)
                                                        }));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                        )}

                        {userCreationStep === 4 && (
                            <div>
                                <h5>Final Settings</h5>
                                <Row>
                                    <Col>
                                        <Form.Check
                                            type="checkbox"
                                            id="is-active"
                                            label="Account Active"
                                            checked={advancedUserForm.is_active}
                                            onChange={(e) => setAdvancedUserForm(prev => ({...prev, is_active: e.target.checked}))}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="is-approved"
                                            label="Pre-approve Account"
                                            checked={advancedUserForm.is_approved}
                                            onChange={(e) => setAdvancedUserForm(prev => ({...prev, is_approved: e.target.checked}))}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="send-welcome"
                                            label="Send Welcome Email"
                                            checked={advancedUserForm.send_welcome_email}
                                            onChange={(e) => setAdvancedUserForm(prev => ({...prev, send_welcome_email: e.target.checked}))}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex justify-content-between w-100">
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => setShowAdvancedUserModal(false)}
                            >
                                Cancel
                            </Button>
                            <div>
                                {userCreationStep > 1 && (
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => setUserCreationStep(prev => prev - 1)}
                                        className="me-2"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {userCreationStep < 4 ? (
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setUserCreationStep(prev => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="success" 
                                        onClick={handleAdvancedSaveUser}
                                        disabled={loading || !advancedUserForm.username || !advancedUserForm.email || !advancedUserForm.first_name || !advancedUserForm.last_name || !advancedUserForm.password}
                                        className="create-user-btn"
                                        data-testid="create-user-button"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Creating User...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create User
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Bulk Action Confirmation Modal */}
                <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Bulk Action</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure you want to <strong>{bulkAction}</strong> the selected {selectedUsers.length} user(s)?
                        </p>
                        {bulkAction === 'delete' && (
                            <Alert variant="warning">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                This action cannot be undone!
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowBulkModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant={bulkAction === 'delete' ? 'danger' : 'primary'} 
                            onClick={executeBulkAction}
                        >
                            Confirm {bulkAction}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Toast Notifications */}
                <ToastContainer position="top-end" className="p-3">
                    {toasts.map(toast => (
                        <Toast key={toast.id} show={true}>
                            <Toast.Header closeButton={false}>
                                <div className={`me-auto text-${toast.type === 'error' ? 'danger' : toast.type}`}>
                                    <strong>{toast.title}</strong>
                                </div>
                            </Toast.Header>
                            <Toast.Body>{toast.message}</Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>
            </Container>
        </div>
    );
};

export default EnhancedRBACUserManagement;
