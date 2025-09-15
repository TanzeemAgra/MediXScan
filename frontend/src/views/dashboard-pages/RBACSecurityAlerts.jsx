// RBAC Security Alerts Component
// Security monitoring and alerts dashboard using soft-coded approach

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Table } from 'react-bootstrap';
import { hasSuperAdminAccess, debugUserAccess } from '../../utils/rbacAccessControl';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import { 
    safeArrayOperations,
    errorHandlers 
} from '../../utils/rbacStateUtils';
import './RBACComponents.scss';

const RBACSecurityAlerts = () => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    
    // Security alerts state
    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (isAuthenticated && hasSuperAdminAccess(user)) {
            loadSecurityAlerts();
        }
    }, [isAuthenticated, user]);

    // Auto-refresh every 10 seconds for security alerts
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                loadSecurityAlerts();
            }, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const loadSecurityAlerts = async () => {
        setLoading(true);
        try {
            const data = await rbacService.getSecurityAlerts();
            const validData = Array.isArray(data) ? data : [];
            setSecurityAlerts(validData);
        } catch (error) {
            errorHandlers.logError('loadSecurityAlerts', error);
            showAlert('error', errorHandlers.formatError(error));
            setSecurityAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleDismissAlert = async (alertId) => {
        try {
            setLoading(true);
            await rbacService.dismissSecurityAlert(alertId);
            showAlert('success', 'Alert dismissed successfully');
            loadSecurityAlerts();
        } catch (error) {
            errorHandlers.logError('handleDismissAlert', error);
            showAlert('error', errorHandlers.formatError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsResolved = async (alertId) => {
        try {
            setLoading(true);
            await rbacService.resolveSecurityAlert(alertId);
            showAlert('success', 'Alert marked as resolved');
            loadSecurityAlerts();
        } catch (error) {
            errorHandlers.logError('handleMarkAsResolved', error);
            showAlert('error', errorHandlers.formatError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleViewAlertDetails = (alertData) => {
        setSelectedAlert(alertData);
        setShowAlertModal(true);
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'secondary';
            default: return 'secondary';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'fas fa-exclamation-triangle';
            case 'high': return 'fas fa-exclamation';
            case 'medium': return 'fas fa-info-circle';
            case 'low': return 'fas fa-minus-circle';
            default: return 'fas fa-question-circle';
        }
    };

    const getAlertStats = () => {
        const unresolved = safeArrayOperations.filter(securityAlerts, alert => !alert.resolved);
        const critical = safeArrayOperations.filter(unresolved, alert => alert.severity?.toLowerCase() === 'critical');
        const high = safeArrayOperations.filter(unresolved, alert => alert.severity?.toLowerCase() === 'high');
        const recent = safeArrayOperations.filter(securityAlerts, alert => {
            if (!alert.timestamp) return false;
            const alertTime = new Date(alert.timestamp);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return alertTime > oneHourAgo;
        });

        return {
            total: safeArrayOperations.length(securityAlerts),
            unresolved: safeArrayOperations.length(unresolved),
            critical: safeArrayOperations.length(critical),
            high: safeArrayOperations.length(high),
            recent: safeArrayOperations.length(recent)
        };
    };

    const stats = getAlertStats();

    // Access Control Check
    // Enhanced Access Control Check using utility function
    const hasAccess = hasSuperAdminAccess(user);
    
    // Debug logging for access control
    debugUserAccess(user, isAuthenticated, 'RBACSecurityAlerts');
    
    if (!isAuthenticated || !hasAccess) {
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
                                    Super Administrator privileges are required to access Security Alerts.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <div className="rbac-security-alerts">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="page-header">
                            <h1 className="page-title">
                                <i className="fas fa-shield-alt me-2"></i>
                                Security Alerts
                            </h1>
                            <p className="page-description">
                                Real-time security monitoring and threat detection
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
                                <h4>Security Monitoring</h4>
                                <small className="text-muted">
                                    {stats.unresolved} unresolved alerts of {stats.total} total
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <Button 
                                    variant="outline-info" 
                                    onClick={loadSecurityAlerts}
                                    disabled={loading}
                                >
                                    <i className="fas fa-sync me-2"></i>Refresh
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Statistics Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="stats-card stats-danger">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{stats.critical}</div>
                                    <div className="stats-label">Critical Alerts</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-warning">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-exclamation"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{stats.high}</div>
                                    <div className="stats-label">High Priority</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-info">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{stats.unresolved}</div>
                                    <div className="stats-label">Unresolved</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-primary">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{stats.recent}</div>
                                    <div className="stats-label">Recent (1h)</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Security Alerts */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Active Security Alerts</h5>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" />
                                        <p className="mt-2">Loading security alerts...</p>
                                    </div>
                                ) : (
                                    <div className="security-alerts">
                                        {safeArrayOperations.length(securityAlerts) === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="fas fa-shield-check fa-3x text-success mb-3 d-block"></i>
                                                <h5 className="text-success">All Clear!</h5>
                                                <p className="text-muted">No security alerts detected</p>
                                            </div>
                                        ) : (
                                            safeArrayOperations.map(securityAlerts, (alertData, index) => (
                                                <Alert 
                                                    key={alertData.id || `alert-${index}`} 
                                                    variant={getSeverityColor(alertData.severity)}
                                                    className="mb-3"
                                                >
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <i className={`${getSeverityIcon(alertData.severity)} me-2`}></i>
                                                                <strong>{alertData.title || 'Security Alert'}</strong>
                                                                <Badge 
                                                                    bg={getSeverityColor(alertData.severity)} 
                                                                    className="ms-2"
                                                                >
                                                                    {(alertData.severity || 'Unknown').toUpperCase()}
                                                                </Badge>
                                                                {alertData.resolved && (
                                                                    <Badge bg="success" className="ms-2">
                                                                        RESOLVED
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="mb-2">{alertData.description || 'No description available'}</p>
                                                            <div className="d-flex gap-3">
                                                                <small className="text-muted">
                                                                    <i className="fas fa-clock me-1"></i>
                                                                    {alertData.timestamp ? 
                                                                        new Date(alertData.timestamp).toLocaleString() : 
                                                                        'Unknown time'
                                                                    }
                                                                </small>
                                                                {alertData.ip_address && (
                                                                    <small className="text-muted">
                                                                        <i className="fas fa-globe me-1"></i>
                                                                        {alertData.ip_address}
                                                                    </small>
                                                                )}
                                                                {alertData.user && (
                                                                    <small className="text-muted">
                                                                        <i className="fas fa-user me-1"></i>
                                                                        {alertData.user}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleViewAlertDetails(alertData)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Button>
                                                            {!alertData.resolved && (
                                                                <>
                                                                    <Button
                                                                        variant="outline-success"
                                                                        size="sm"
                                                                        onClick={() => handleMarkAsResolved(alertData.id)}
                                                                        disabled={loading}
                                                                    >
                                                                        <i className="fas fa-check"></i>
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => handleDismissAlert(alertData.id)}
                                                                        disabled={loading}
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Alert>
                                            ))
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Alert Details Modal */}
                {selectedAlert && (
                    <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i className="fas fa-shield-alt me-2"></i>
                                Security Alert Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="alert-details">
                                <Row className="mb-3">
                                    <Col>
                                        <div className="d-flex align-items-center">
                                            <i className={`${getSeverityIcon(selectedAlert.severity)} me-2 text-${getSeverityColor(selectedAlert.severity)}`}></i>
                                            <h5 className="mb-0">{selectedAlert.title || 'Security Alert'}</h5>
                                            <Badge 
                                                bg={getSeverityColor(selectedAlert.severity)} 
                                                className="ms-auto"
                                            >
                                                {(selectedAlert.severity || 'Unknown').toUpperCase()}
                                            </Badge>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row className="mb-3">
                                    <Col>
                                        <strong>Description:</strong>
                                        <p>{selectedAlert.description || 'No description available'}</p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <strong>Timestamp:</strong>
                                        <p>
                                            {selectedAlert.timestamp ? 
                                                new Date(selectedAlert.timestamp).toLocaleString() : 
                                                'Unknown'
                                            }
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>IP Address:</strong>
                                        <p className="font-monospace">{selectedAlert.ip_address || 'Unknown'}</p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <strong>User:</strong>
                                        <p>{selectedAlert.user || 'Unknown'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>Alert Type:</strong>
                                        <p>{selectedAlert.alert_type || 'Unknown'}</p>
                                    </Col>
                                </Row>

                                {selectedAlert.metadata && (
                                    <Row>
                                        <Col>
                                            <strong>Additional Information:</strong>
                                            <pre className="bg-light p-3 rounded">
                                                {JSON.stringify(selectedAlert.metadata, null, 2)}
                                            </pre>
                                        </Col>
                                    </Row>
                                )}

                                <Row>
                                    <Col>
                                        <strong>Status:</strong>
                                        <p>
                                            <Badge bg={selectedAlert.resolved ? 'success' : 'warning'}>
                                                {selectedAlert.resolved ? 'RESOLVED' : 'ACTIVE'}
                                            </Badge>
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
                                Close
                            </Button>
                            {!selectedAlert.resolved && (
                                <>
                                    <Button 
                                        variant="success" 
                                        onClick={() => {
                                            handleMarkAsResolved(selectedAlert.id);
                                            setShowAlertModal(false);
                                        }}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-check me-2"></i>
                                        Mark as Resolved
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => {
                                            handleDismissAlert(selectedAlert.id);
                                            setShowAlertModal(false);
                                        }}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Dismiss
                                    </Button>
                                </>
                            )}
                        </Modal.Footer>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default RBACSecurityAlerts;
