// RBAC Role Management Component
// Dedicated component for role management functionality using soft-coded approach

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import { 
    useRBACRoles, 
    getRoleStatistics, 
    getPermissionStatistics, 
    validateRoleData, 
    safeArrayOperations,
    getDefaultRoleForm,
    errorHandlers 
} from '../../utils/rbacStateUtils';
import './RBACComponents.scss';

const RBACRoleManagement = () => {
    const { isAuthenticated, user } = useAuth();
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    
    // Use custom hook for RBAC state management with error handling
    const {
        roles,
        permissions,
        loading,
        error: stateError,
        loadRoles,
        loadPermissions,
        createRole,
        updateRole,
        deleteRole,
        refreshData
    } = useRBACRoles(rbacService);

    // Modal and form state
    const [selectedRole, setSelectedRole] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleForm, setRoleForm] = useState(getDefaultRoleForm());

    useEffect(() => {
        if (isAuthenticated && user?.is_superuser) {
            refreshData();
        }
    }, [isAuthenticated, user, refreshData]);

    // Show alert with error handling
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    // Handle state errors
    useEffect(() => {
        if (stateError) {
            showAlert('error', errorHandlers.formatError(stateError));
        }
    }, [stateError]);

    const handleCreateRole = () => {
        setSelectedRole(null);
        setRoleForm(getDefaultRoleForm());
        setShowRoleModal(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setRoleForm({
            name: role.name || '',
            description: role.description || '',
            permissions: Array.isArray(role.permissions) ? role.permissions : [],
            parent_role: role.parent_role || null,
            max_session_duration: role.max_session_duration || 480,
            allowed_ip_ranges: role.allowed_ip_ranges || '',
            time_restrictions: role.time_restrictions || '',
            is_active: role.is_active !== false
        });
        setShowRoleModal(true);
    };

    const handleSaveRole = async () => {
        try {
            // Validate form data
            const validation = validateRoleData(roleForm);
            if (!validation.isValid) {
                showAlert('error', validation.errors.join(', '));
                return;
            }

            const result = selectedRole 
                ? await updateRole(selectedRole.id, roleForm)
                : await createRole(roleForm);

            if (result.success) {
                showAlert('success', selectedRole ? 'Role updated successfully' : 'Role created successfully');
                setShowRoleModal(false);
            } else {
                showAlert('error', result.error || 'Failed to save role');
            }
        } catch (error) {
            errorHandlers.logError('handleSaveRole', error);
            showAlert('error', errorHandlers.formatError(error));
        }
    };

    const handleDeleteRole = async (roleId) => {
        const roleToDelete = safeArrayOperations.find(roles, role => role.id === roleId);
        const roleName = roleToDelete?.name || 'this role';
        
        if (window.confirm(`Are you sure you want to delete ${roleName}? This action cannot be undone.`)) {
            try {
                const result = await deleteRole(roleId);
                if (result.success) {
                    showAlert('success', 'Role deleted successfully');
                } else {
                    showAlert('error', result.error || 'Failed to delete role');
                }
            } catch (error) {
                errorHandlers.logError('handleDeleteRole', error);
                showAlert('error', errorHandlers.formatError(error));
            }
        }
    };

    const handleCloneRole = (role) => {
        setSelectedRole(null);
        setRoleForm({
            name: `${role.name || 'Role'} (Copy)`,
            description: role.description || '',
            permissions: Array.isArray(role.permissions) ? [...role.permissions] : [],
            parent_role: role.parent_role || null,
            max_session_duration: role.max_session_duration || 480,
            allowed_ip_ranges: role.allowed_ip_ranges || '',
            time_restrictions: role.time_restrictions || '',
            is_active: true
        });
        setShowRoleModal(true);
    };

    // Get statistics using safe operations
    const roleStats = getRoleStatistics(roles);
    const permissionStats = getPermissionStatistics(permissions);

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
                                    Super Administrator privileges are required to access Role Management.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <div className="rbac-role-management">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="page-header">
                            <h1 className="page-title">
                                <i className="fas fa-user-tag me-2"></i>
                                Role Management
                            </h1>
                            <p className="page-description">
                                Advanced Role-Based Access Control System - Role Configuration
                            </p>
                        </div>
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

                {/* Actions Bar */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4>System Roles</h4>
                                <small className="text-muted">Manage roles and their permissions</small>
                            </div>
                            <div>
                                <Button variant="outline-info" className="me-2" onClick={refreshData} disabled={loading}>
                                    <i className="fas fa-sync me-2"></i>Refresh
                                </Button>
                                <Button variant="primary" onClick={handleCreateRole} disabled={loading}>
                                    <i className="fas fa-plus me-2"></i>Create New Role
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Statistics Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="stats-card stats-primary">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-user-tag"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{roleStats.totalRoles}</div>
                                    <div className="stats-label">Total Roles</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-success">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{roleStats.activeRoles}</div>
                                    <div className="stats-label">Active Roles</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-info">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-key"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{permissionStats.totalPermissions}</div>
                                    <div className="stats-label">Permissions</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-warning">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-sitemap"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{roleStats.inheritedRoles}</div>
                                    <div className="stats-label">Inherited Roles</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Roles Table */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Role Configuration</h5>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" />
                                        <p className="mt-2">Loading roles...</p>
                                    </div>
                                ) : (
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>Role Name</th>
                                                <th>Description</th>
                                                <th>Permissions</th>
                                                <th>Parent Role</th>
                                                <th>Status</th>
                                                <th>Users Count</th>
                                                <th>Session Duration</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safeArrayOperations.map(roles, role => (
                                                <tr key={role.id || `role-${Math.random()}`}>
                                                    <td>
                                                        <strong className="text-primary">{role.name || 'Unnamed Role'}</strong>
                                                        {role.is_system && (
                                                            <Badge bg="info" className="ms-2">System</Badge>
                                                        )}
                                                    </td>
                                                    <td className="text-muted">{role.description || 'No description'}</td>
                                                    <td>
                                                        <Badge bg="secondary">
                                                            {safeArrayOperations.length(role.permissions)} permissions
                                                        </Badge>
                                                        {safeArrayOperations.map(
                                                            safeArrayOperations.filter(role.permissions || [], (_, index) => index < 2),
                                                            perm => (
                                                                <Badge key={perm} bg="outline-primary" className="ms-1">
                                                                    {perm}
                                                                </Badge>
                                                            )
                                                        )}
                                                        {safeArrayOperations.length(role.permissions) > 2 && (
                                                            <Badge bg="outline-secondary" className="ms-1">
                                                                +{safeArrayOperations.length(role.permissions) - 2} more
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {role.parent_role ? (
                                                            <Badge bg="outline-info">{role.parent_role}</Badge>
                                                        ) : (
                                                            <span className="text-muted">None</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Badge bg={role.is_active !== false ? 'success' : 'danger'}>
                                                            {role.is_active !== false ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="primary">{role.users_count || 0}</Badge>
                                                    </td>
                                                    <td>
                                                        {role.max_session_duration ? `${role.max_session_duration}m` : 'Default'}
                                                    </td>
                                                    <td className="text-muted">
                                                        {role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleEditRole(role)}
                                                                title="Edit Role"
                                                                disabled={loading}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Button>
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                onClick={() => handleCloneRole(role)}
                                                                title="Clone Role"
                                                                disabled={loading}
                                                            >
                                                                <i className="fas fa-copy"></i>
                                                            </Button>
                                                            {!role.is_system && (
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteRole(role.id)}
                                                                    title="Delete Role"
                                                                    disabled={loading}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </Button>
                                                            )}
                                                        </div>
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

                {/* Role Modal */}
                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-user-tag me-2"></i>
                            {selectedRole ? 'Edit Role' : 'Create New Role'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Role Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={roleForm.name}
                                            onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                                            placeholder="Enter role name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Parent Role</Form.Label>
                                        <Form.Select
                                            value={roleForm.parent_role || ''}
                                            onChange={(e) => setRoleForm({...roleForm, parent_role: e.target.value || null})}
                                        >
                                            <option value="">No Parent Role</option>
                                            {safeArrayOperations.map(
                                                safeArrayOperations.filter(roles, role => role.id !== selectedRole?.id),
                                                role => (
                                                    <option key={role.id || `option-${Math.random()}`} value={role.name}>
                                                        {role.name || 'Unnamed Role'}
                                                    </option>
                                                )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={roleForm.description}
                                    onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                                    placeholder="Describe the role and its purpose"
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Max Session Duration (minutes)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="5"
                                            max="1440"
                                            value={roleForm.max_session_duration}
                                            onChange={(e) => setRoleForm({...roleForm, max_session_duration: parseInt(e.target.value)})}
                                        />
                                        <Form.Text className="text-muted">5-1440 minutes (24 hours max)</Form.Text>
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
                                        <Form.Text className="text-muted">Comma-separated CIDR ranges</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Time Restrictions</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mon-Fri 09:00-17:00"
                                    value={roleForm.time_restrictions}
                                    onChange={(e) => setRoleForm({...roleForm, time_restrictions: e.target.value})}
                                />
                                <Form.Text className="text-muted">Format: Days HH:MM-HH:MM</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Role is Active"
                                    checked={roleForm.is_active}
                                    onChange={(e) => setRoleForm({...roleForm, is_active: e.target.checked})}
                                />
                            </Form.Group>

                            {/* Permissions Section */}
                            <Card className="mt-4">
                                <Card.Header>
                                    <h6 className="mb-0">Permissions</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {safeArrayOperations.map(permissions, permission => (
                                            <Col md={4} key={permission.id || `perm-${Math.random()}`} className="mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`perm-${permission.id || Math.random()}`}
                                                    label={permission.name || 'Unnamed Permission'}
                                                    checked={safeArrayOperations.find(
                                                        roleForm.permissions || [], 
                                                        p => p === permission.codename
                                                    ) !== undefined}
                                                    onChange={(e) => {
                                                        const currentPerms = Array.isArray(roleForm.permissions) ? roleForm.permissions : [];
                                                        const updatedPerms = e.target.checked
                                                            ? [...currentPerms, permission.codename]
                                                            : currentPerms.filter(p => p !== permission.codename);
                                                        setRoleForm({...roleForm, permissions: updatedPerms});
                                                    }}
                                                />
                                                <small className="text-muted d-block">{permission.description || 'No description'}</small>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveRole} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                selectedRole ? 'Update Role' : 'Create Role'
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default RBACRoleManagement;
