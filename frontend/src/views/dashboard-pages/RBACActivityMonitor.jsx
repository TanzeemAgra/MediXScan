// RBAC Activity Monitor Component
// Real-time activity monitoring for RBAC system using soft-coded approach

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Alert, Spinner, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import { 
    safeArrayOperations,
    errorHandlers 
} from '../../utils/rbacStateUtils';
import './RBACComponents.scss';

const RBACActivityMonitor = () => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    
    // Activity monitoring state
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [filters, setFilters] = useState({
        user: '',
        action: '',
        dateFrom: '',
        dateTo: '',
        status: 'all'
    });
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user?.is_superuser) {
            loadActivities();
        }
    }, [isAuthenticated, user]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                loadActivities();
            }, 30000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const loadActivities = async () => {
        setLoading(true);
        try {
            const data = await rbacService.getActivities();
            const validData = Array.isArray(data) ? data : [];
            setActivities(validData);
            applyFilters(validData);
        } catch (error) {
            errorHandlers.logError('loadActivities', error);
            showAlert('error', errorHandlers.formatError(error));
            setActivities([]);
            setFilteredActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (activityData = activities) => {
        let filtered = [...activityData];

        if (filters.user) {
            filtered = safeArrayOperations.filter(filtered, activity => 
                (activity.user || '').toLowerCase().includes(filters.user.toLowerCase())
            );
        }

        if (filters.action) {
            filtered = safeArrayOperations.filter(filtered, activity => 
                (activity.action || '').toLowerCase().includes(filters.action.toLowerCase())
            );
        }

        if (filters.status !== 'all') {
            filtered = safeArrayOperations.filter(filtered, activity => 
                filters.status === 'success' ? activity.success : !activity.success
            );
        }

        if (filters.dateFrom) {
            filtered = safeArrayOperations.filter(filtered, activity => 
                new Date(activity.timestamp) >= new Date(filters.dateFrom)
            );
        }

        if (filters.dateTo) {
            filtered = safeArrayOperations.filter(filtered, activity => 
                new Date(activity.timestamp) <= new Date(filters.dateTo)
            );
        }

        setFilteredActivities(filtered);
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        applyFilters();
    };

    const clearFilters = () => {
        const clearedFilters = {
            user: '',
            action: '',
            dateFrom: '',
            dateTo: '',
            status: 'all'
        };
        setFilters(clearedFilters);
        setFilteredActivities(activities);
    };

    const exportActivities = () => {
        try {
            const csvContent = [
                ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Status', 'Details'].join(','),
                ...safeArrayOperations.map(filteredActivities, activity => [
                    activity.timestamp || '',
                    activity.user || '',
                    activity.action || '',
                    activity.resource || '',
                    activity.ip_address || '',
                    activity.success ? 'Success' : 'Failed',
                    activity.details || ''
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rbac-activities-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showAlert('success', 'Activity log exported successfully');
        } catch (error) {
            errorHandlers.logError('exportActivities', error);
            showAlert('error', 'Failed to export activity log');
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
                                    Super Administrator privileges are required to access Activity Monitor.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <div className="rbac-activity-monitor">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="page-header">
                            <h1 className="page-title">
                                <i className="fas fa-history me-2"></i>
                                Activity Monitor
                            </h1>
                            <p className="page-description">
                                Real-time monitoring of user activities and security events
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

                {/* Controls */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4>User Activities</h4>
                                <small className="text-muted">
                                    Showing {safeArrayOperations.length(filteredActivities)} of {safeArrayOperations.length(activities)} activities
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <Form.Check
                                    type="switch"
                                    id="auto-refresh"
                                    label="Auto Refresh"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowFilterModal(true)}
                                    disabled={loading}
                                >
                                    <i className="fas fa-filter me-2"></i>Filters
                                </Button>
                                <Button 
                                    variant="outline-success" 
                                    onClick={exportActivities}
                                    disabled={loading || safeArrayOperations.length(filteredActivities) === 0}
                                >
                                    <i className="fas fa-download me-2"></i>Export
                                </Button>
                                <Button 
                                    variant="outline-info" 
                                    onClick={loadActivities}
                                    disabled={loading}
                                >
                                    <i className="fas fa-sync me-2"></i>Refresh
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Quick Filters */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex gap-2 flex-wrap">
                            <Form.Control
                                type="text"
                                placeholder="Filter by user..."
                                value={filters.user}
                                onChange={(e) => handleFilterChange('user', e.target.value)}
                                style={{ width: '200px' }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Filter by action..."
                                value={filters.action}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                                style={{ width: '200px' }}
                            />
                            <Form.Select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                style={{ width: '150px' }}
                            >
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                            </Form.Select>
                            {(filters.user || filters.action || filters.status !== 'all') && (
                                <Button variant="outline-danger" onClick={clearFilters}>
                                    <i className="fas fa-times me-2"></i>Clear
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Activities Table */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Recent Activities</h5>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" />
                                        <p className="mt-2">Loading activities...</p>
                                    </div>
                                ) : (
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>Timestamp</th>
                                                <th>User</th>
                                                <th>Action</th>
                                                <th>Resource</th>
                                                <th>IP Address</th>
                                                <th>Status</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safeArrayOperations.length(filteredActivities) === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        <i className="fas fa-inbox fa-2x text-muted mb-2 d-block"></i>
                                                        <p className="text-muted">No activities found</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                safeArrayOperations.map(filteredActivities, (activity, index) => (
                                                    <tr key={activity.id || `activity-${index}`}>
                                                        <td>
                                                            {activity.timestamp ? 
                                                                new Date(activity.timestamp).toLocaleString() : 
                                                                'N/A'
                                                            }
                                                        </td>
                                                        <td>
                                                            <strong>{activity.user || 'Unknown'}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg="info">{activity.action || 'Unknown'}</Badge>
                                                        </td>
                                                        <td>{activity.resource || 'N/A'}</td>
                                                        <td className="font-monospace">
                                                            {activity.ip_address || 'N/A'}
                                                        </td>
                                                        <td>
                                                            <Badge bg={activity.success ? 'success' : 'danger'}>
                                                                {activity.success ? 'Success' : 'Failed'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {activity.details || 'No details'}
                                                            </small>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Filter Modal */}
                <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-filter me-2"></i>
                            Advanced Filters
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date From</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={filters.dateFrom}
                                            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date To</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={filters.dateTo}
                                            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => {
                            applyFilters();
                            setShowFilterModal(false);
                        }}>
                            Apply Filters
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default RBACActivityMonitor;
