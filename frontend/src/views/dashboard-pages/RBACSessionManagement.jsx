// RBAC Session Management Component
// Real-time session monitoring and control using soft-coded approach

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Alert, Spinner, Form } from 'react-bootstrap';
import { hasSuperAdminAccess, debugUserAccess } from '../../utils/rbacAccessControl';
import { useAuth } from '../../context/AuthContext';
import rbacService from '../../services/rbacService';
import { 
    safeArrayOperations,
    errorHandlers 
} from '../../utils/rbacStateUtils';
import './RBACComponents.scss';

const RBACSessionManagement = () => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    
    // Session management state
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (isAuthenticated && hasSuperAdminAccess(user)) {
            loadSessions();
        }
    }, [isAuthenticated, user]);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                loadSessions();
            }, 15000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await rbacService.getActiveSessions();
            const validData = Array.isArray(data) ? data : [];
            setSessions(validData);
        } catch (error) {
            errorHandlers.logError('loadSessions', error);
            showAlert('error', errorHandlers.formatError(error));
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleTerminateSession = async (sessionId) => {
        const session = safeArrayOperations.find(sessions, s => s.id === sessionId);
        const sessionUser = session?.user || 'unknown user';
        
        if (window.confirm(`Are you sure you want to terminate the session for ${sessionUser}?`)) {
            try {
                setLoading(true);
                await rbacService.terminateSession(sessionId);
                showAlert('success', 'Session terminated successfully');
                loadSessions();
            } catch (error) {
                errorHandlers.logError('handleTerminateSession', error);
                showAlert('error', errorHandlers.formatError(error));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTerminateAllSessions = async () => {
        if (window.confirm('Are you sure you want to terminate ALL active sessions? This will log out all users.')) {
            try {
                setLoading(true);
                await rbacService.terminateAllSessions();
                showAlert('success', 'All sessions terminated successfully');
                loadSessions();
            } catch (error) {
                errorHandlers.logError('handleTerminateAllSessions', error);
                showAlert('error', errorHandlers.formatError(error));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleViewSessionDetails = (session) => {
        setSelectedSession(session);
        setShowSessionModal(true);
    };

    const getSessionDuration = (startTime) => {
        if (!startTime) return 'N/A';
        
        const start = new Date(startTime);
        const now = new Date();
        const diffMs = now - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m`;
        }
        return `${diffMinutes}m`;
    };

    const getLastActivityColor = (lastActivity) => {
        if (!lastActivity) return 'secondary';
        
        const last = new Date(lastActivity);
        const now = new Date();
        const diffMinutes = (now - last) / (1000 * 60);
        
        if (diffMinutes < 5) return 'success';
        if (diffMinutes < 15) return 'warning';
        return 'danger';
    };

    // Access Control Check
    // Enhanced Access Control Check using utility function
    const hasAccess = hasSuperAdminAccess(user);
    
    // Debug logging for access control
    debugUserAccess(user, isAuthenticated, 'RBACSessionManagement');
    
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
                                    Super Administrator privileges are required to access Session Management.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <div className="rbac-session-management">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="page-header">
                            <h1 className="page-title">
                                <i className="fas fa-clock me-2"></i>
                                Session Management
                            </h1>
                            <p className="page-description">
                                Monitor and control active user sessions
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
                                <h4>Active Sessions</h4>
                                <small className="text-muted">
                                    {safeArrayOperations.length(sessions)} active sessions
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <Form.Check
                                    type="switch"
                                    id="auto-refresh-sessions"
                                    label="Auto Refresh"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                />
                                <Button 
                                    variant="outline-danger" 
                                    onClick={handleTerminateAllSessions}
                                    disabled={loading || safeArrayOperations.length(sessions) === 0}
                                >
                                    <i className="fas fa-power-off me-2"></i>Terminate All
                                </Button>
                                <Button 
                                    variant="outline-info" 
                                    onClick={loadSessions}
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
                        <Card className="stats-card stats-primary">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{safeArrayOperations.length(sessions)}</div>
                                    <div className="stats-label">Active Sessions</div>
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
                                    <div className="stats-number">
                                        {safeArrayOperations.length(
                                            safeArrayOperations.filter(sessions, s => getLastActivityColor(s.last_activity) === 'success')
                                        )}
                                    </div>
                                    <div className="stats-label">Recent Activity</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-warning">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">
                                        {safeArrayOperations.length(
                                            safeArrayOperations.filter(sessions, s => getLastActivityColor(s.last_activity) === 'warning')
                                        )}
                                    </div>
                                    <div className="stats-label">Idle Sessions</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card stats-danger">
                            <Card.Body>
                                <div className="stats-icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">
                                        {safeArrayOperations.length(
                                            safeArrayOperations.filter(sessions, s => getLastActivityColor(s.last_activity) === 'danger')
                                        )}
                                    </div>
                                    <div className="stats-label">Stale Sessions</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sessions Table */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Session Details</h5>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" />
                                        <p className="mt-2">Loading sessions...</p>
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
                                                <th>Duration</th>
                                                <th>Last Activity</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safeArrayOperations.length(sessions) === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="text-center py-4">
                                                        <i className="fas fa-clock fa-2x text-muted mb-2 d-block"></i>
                                                        <p className="text-muted">No active sessions</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                safeArrayOperations.map(sessions, (session, index) => (
                                                    <tr key={session.id || `session-${index}`}>
                                                        <td>
                                                            <strong>{session.user || 'Unknown'}</strong>
                                                        </td>
                                                        <td className="font-monospace">
                                                            <small>{session.session_id || 'N/A'}</small>
                                                        </td>
                                                        <td className="font-monospace">
                                                            {session.ip_address || 'N/A'}
                                                        </td>
                                                        <td>
                                                            <div className="text-truncate" style={{maxWidth: '200px'}}>
                                                                <small>{session.user_agent || 'Unknown'}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <small>
                                                                {session.created_at ? 
                                                                    new Date(session.created_at).toLocaleString() : 
                                                                    'N/A'
                                                                }
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <Badge bg="info">
                                                                {getSessionDuration(session.created_at)}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <small>
                                                                {session.last_activity ? 
                                                                    new Date(session.last_activity).toLocaleString() : 
                                                                    'N/A'
                                                                }
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <Badge bg={getLastActivityColor(session.last_activity)}>
                                                                {getLastActivityColor(session.last_activity) === 'success' ? 'Active' :
                                                                 getLastActivityColor(session.last_activity) === 'warning' ? 'Idle' : 'Stale'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <Button
                                                                    variant="outline-info"
                                                                    size="sm"
                                                                    onClick={() => handleViewSessionDetails(session)}
                                                                    title="View Details"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleTerminateSession(session.id)}
                                                                    title="Terminate Session"
                                                                    disabled={loading}
                                                                >
                                                                    <i className="fas fa-power-off"></i>
                                                                </Button>
                                                            </div>
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

                {/* Session Details Modal */}
                {selectedSession && (
                    <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i className="fas fa-clock me-2"></i>
                                Session Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="session-details">
                                <Row>
                                    <Col md={6}>
                                        <strong>User:</strong>
                                        <p>{selectedSession.user || 'Unknown'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>Session ID:</strong>
                                        <p className="font-monospace">{selectedSession.session_id || 'N/A'}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <strong>IP Address:</strong>
                                        <p className="font-monospace">{selectedSession.ip_address || 'N/A'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>Location:</strong>
                                        <p>{selectedSession.location || 'Unknown'}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <strong>User Agent:</strong>
                                        <p><small>{selectedSession.user_agent || 'Unknown'}</small></p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <strong>Started:</strong>
                                        <p>
                                            {selectedSession.created_at ? 
                                                new Date(selectedSession.created_at).toLocaleString() : 
                                                'N/A'
                                            }
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>Last Activity:</strong>
                                        <p>
                                            {selectedSession.last_activity ? 
                                                new Date(selectedSession.last_activity).toLocaleString() : 
                                                'N/A'
                                            }
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <strong>Duration:</strong>
                                        <p>
                                            <Badge bg="info">
                                                {getSessionDuration(selectedSession.created_at)}
                                            </Badge>
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <strong>Status:</strong>
                                        <p>
                                            <Badge bg={getLastActivityColor(selectedSession.last_activity)}>
                                                {getLastActivityColor(selectedSession.last_activity) === 'success' ? 'Active' :
                                                 getLastActivityColor(selectedSession.last_activity) === 'warning' ? 'Idle' : 'Stale'}
                                            </Badge>
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSessionModal(false)}>
                                Close
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={() => {
                                    handleTerminateSession(selectedSession.id);
                                    setShowSessionModal(false);
                                }}
                                disabled={loading}
                            >
                                <i className="fas fa-power-off me-2"></i>
                                Terminate Session
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default RBACSessionManagement;
