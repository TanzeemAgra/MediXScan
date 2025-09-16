import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Table, Modal, Form, 
  Alert, Spinner, InputGroup, FormControl, Dropdown, ButtonGroup,
  Toast, ToastContainer, OverlayTrigger, Tooltip, Accordion
} from 'react-bootstrap';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import rbacService from '../services/rbacService';
import USER_APPROVAL_CONFIG, { ApprovalUtils } from '../config/userApprovalConfig';

const EnhancedUserApproval = () => {
  const { user } = useUniversalAuth();
  
  // State Management
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Modal States
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  
  // Form States
  const [approvalForm, setApprovalForm] = useState({
    role: 'DOCTOR',
    department: 'Radiology',
    specialization: '',
    license_number: '',
    notes: ''
  });
  const [rejectionForm, setRejectionForm] = useState({
    reason: '',
    notes: ''
  });
  
  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Notification State
  const [toasts, setToasts] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Load pending users with soft-coded error handling
  const loadPendingUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rbacService.getPendingUsers();
      
      if (response.success) {
        setPendingUsers(response.data || []);
        
        // Calculate statistics
        const stats = {
          total: response.data?.length || 0,
          pending: response.data?.filter(u => !u.is_approved && u.is_active)?.length || 0,
          approved: response.data?.filter(u => u.is_approved)?.length || 0,
          rejected: response.data?.filter(u => !u.is_approved && !u.is_active)?.length || 0
        };
        setStatistics(stats);
        
        if (response.fallback) {
          showToast('warning', 'Using offline data - API unavailable');
        }
      }
    } catch (error) {
      console.error('Failed to load pending users:', error);
      showToast('error', 'Failed to load pending users');
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Show notification toast
  const showToast = (type, message, title = '') => {
    const toast = {
      id: Date.now(),
      type,
      title: title || USER_APPROVAL_CONFIG.NOTIFICATIONS[type.toUpperCase()]?.title || 'Notification',
      message,
      timestamp: new Date()
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove toast
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, USER_APPROVAL_CONFIG.NOTIFICATIONS[type.toUpperCase()]?.duration || 5000);
  };

  // Approve single user
  const approveUser = async (userId, approvalData) => {
    try {
      setLoading(true);
      const response = await rbacService.approveUser(userId, approvalData);
      
      if (response.success) {
        const notification = ApprovalUtils.formatNotification(
          USER_APPROVAL_CONFIG.NOTIFICATIONS.APPROVAL_GRANTED,
          { userName: currentUser?.email || 'User' }
        );
        
        showToast('success', notification.message, notification.title);
        await loadPendingUsers();
        setShowApprovalModal(false);
        setCurrentUser(null);
        
        if (response.fallback) {
          showToast('warning', 'Approval completed offline - sync when online');
        }
      }
    } catch (error) {
      console.error('Approval failed:', error);
      showToast('error', `Failed to approve user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reject single user
  const rejectUser = async (userId, rejectionData) => {
    try {
      setLoading(true);
      const response = await rbacService.rejectUser(userId, rejectionData);
      
      if (response.success) {
        const notification = ApprovalUtils.formatNotification(
          USER_APPROVAL_CONFIG.NOTIFICATIONS.APPROVAL_REJECTED,
          { userName: currentUser?.email || 'User' }
        );
        
        showToast('warning', notification.message, notification.title);
        await loadPendingUsers();
        setShowRejectionModal(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      showToast('error', `Failed to reject user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Bulk operations
  const performBulkAction = async (action, actionData = {}) => {
    if (selectedUsers.length === 0) {
      showToast('warning', 'Please select users first');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      switch (action) {
        case 'APPROVE_ALL':
          response = await rbacService.bulkApproveUsers(selectedUsers, actionData);
          break;
        case 'REJECT_ALL':
          // Handle bulk rejection (would need API implementation)
          showToast('info', 'Bulk rejection will be processed individually');
          for (const userId of selectedUsers) {
            await rbacService.rejectUser(userId, actionData);
          }
          response = { success: true };
          break;
        default:
          throw new Error('Unknown bulk action');
      }

      if (response.success) {
        const notification = ApprovalUtils.formatNotification(
          action === 'APPROVE_ALL' 
            ? USER_APPROVAL_CONFIG.NOTIFICATIONS.BULK_APPROVAL
            : USER_APPROVAL_CONFIG.NOTIFICATIONS.BULK_REJECTION,
          { count: selectedUsers.length }
        );
        
        showToast('success', notification.message, notification.title);
        await loadPendingUsers();
        setSelectedUsers([]);
        setSelectAll(false);
        setShowBulkModal(false);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      showToast('error', `Bulk operation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && !user.is_approved) ||
      (statusFilter === 'approved' && user.is_approved) ||
      (statusFilter === 'rejected' && !user.is_approved && !user.is_active);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
  });

  // Handle user selection
  const handleUserSelection = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Initialize component
  useEffect(() => {
    loadPendingUsers();
  }, [loadPendingUsers]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(loadPendingUsers, USER_APPROVAL_CONFIG.UI_CONFIG.AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadPendingUsers]);

  const openApprovalModal = (user) => {
    setCurrentUser(user);
    const roleConfig = ApprovalUtils.getRoleConfig(user.role);
    setApprovalForm({
      role: user.role || 'DOCTOR',
      department: user.department || roleConfig.defaultDepartment,
      specialization: user.specialization || '',
      license_number: user.license_number || '',
      notes: ''
    });
    setShowApprovalModal(true);
  };

  const openRejectionModal = (user) => {
    setCurrentUser(user);
    setRejectionForm({ reason: '', notes: '' });
    setShowRejectionModal(true);
  };

  if (loading && pendingUsers.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '48px', height: '48px' }}>
                  <i className="fas fa-users text-primary"></i>
                </div>
              </div>
              <div>
                <h5 className="mb-0">{statistics.total}</h5>
                <small className="text-muted">Total Users</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '48px', height: '48px' }}>
                  <i className="fas fa-clock text-warning"></i>
                </div>
              </div>
              <div>
                <h5 className="mb-0">{statistics.pending}</h5>
                <small className="text-muted">Pending Approval</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '48px', height: '48px' }}>
                  <i className="fas fa-check-circle text-success"></i>
                </div>
              </div>
              <div>
                <h5 className="mb-0">{statistics.approved}</h5>
                <small className="text-muted">Approved</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '48px', height: '48px' }}>
                  <i className="fas fa-times-circle text-danger"></i>
                </div>
              </div>
              <div>
                <h5 className="mb-0">{statistics.rejected}</h5>
                <small className="text-muted">Rejected</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controls Row */}
      <Row className="mb-4">
        <Col lg={8} md={12}>
          {/* Search and Filters */}
          <Row>
            <Col md={4} className="mb-2">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={2} className="mb-2">
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {USER_APPROVAL_CONFIG.FILTER_OPTIONS.STATUS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            
            <Col md={3} className="mb-2">
              <Form.Select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {USER_APPROVAL_CONFIG.FILTER_OPTIONS.ROLE.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            
            <Col md={3} className="mb-2">
              <Form.Select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {USER_APPROVAL_CONFIG.FILTER_OPTIONS.DEPARTMENT.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Col>
        
        <Col lg={4} md={12} className="text-lg-end">
          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <ButtonGroup className="mb-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  setBulkAction('APPROVE_ALL');
                  setShowBulkModal(true);
                }}
              >
                <i className="fas fa-check me-2"></i>
                Approve ({selectedUsers.length})
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setBulkAction('REJECT_ALL');
                  setShowBulkModal(true);
                }}
              >
                <i className="fas fa-times me-2"></i>
                Reject ({selectedUsers.length})
              </Button>
            </ButtonGroup>
          )}
          
          <Button variant="outline-primary" size="sm" onClick={loadPendingUsers}>
            <i className="fas fa-refresh me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="fas fa-user-clock me-2"></i>
                User Approval Management
              </h5>
              <small className="text-muted">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} 
                {searchTerm && ` matching "${searchTerm}"`}
              </small>
            </Col>
            <Col xs="auto">
              {filteredUsers.length > 0 && (
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              )}
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users-slash text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 text-muted">No users found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' 
                  ? 'Try adjusting your search filters' 
                  : 'No pending user registrations at this time'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th width="50">
                      <Form.Check
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>User Info</th>
                    <th>Role & Department</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th width="150">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const roleConfig = ApprovalUtils.getRoleConfig(user.role);
                    const statusConfig = ApprovalUtils.getStatusConfig(
                      user.is_approved ? 'APPROVED' : 'PENDING'
                    );
                    
                    return (
                      <tr key={user.id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm me-3">
                              <div className={`avatar-title rounded-circle ${roleConfig.color} bg-opacity-10`}>
                                <i className={`${roleConfig.icon} ${roleConfig.color}`}></i>
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-1">
                                {user.first_name} {user.last_name}
                                {ApprovalUtils.checkUrgentApproval(user) && (
                                  <Badge bg="warning" className="ms-2">
                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                    Urgent
                                  </Badge>
                                )}
                              </h6>
                              <p className="text-muted mb-0 small">
                                <i className="fas fa-envelope me-1"></i>
                                {user.email}
                              </p>
                              {user.username && (
                                <p className="text-muted mb-0 small">
                                  <i className="fas fa-user me-1"></i>
                                  {user.username}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <Badge bg={roleConfig.color.replace('text-', '')} className="mb-2">
                              <i className={`${roleConfig.icon} me-1`}></i>
                              {roleConfig.label}
                            </Badge>
                            <br />
                            <small className="text-muted">
                              <i className="fas fa-building me-1"></i>
                              {user.department || 'Not specified'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {user.date_joined 
                              ? new Date(user.date_joined).toLocaleDateString()
                              : 'Unknown'
                            }
                          </small>
                          {ApprovalUtils.checkUrgentApproval(user) && (
                            <div className="text-warning small">
                              <i className="fas fa-clock me-1"></i>
                              {Math.ceil((Date.now() - new Date(user.date_joined)) / (1000 * 60 * 60 * 24))} days pending
                            </div>
                          )}
                        </td>
                        <td>
                          <Badge bg={statusConfig.variant}>
                            <i className={`${statusConfig.icon} me-1`}></i>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            {!user.is_approved && (
                              <>
                                <OverlayTrigger 
                                  overlay={<Tooltip>Approve User</Tooltip>}
                                >
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => openApprovalModal(user)}
                                  >
                                    <i className="fas fa-check"></i>
                                  </Button>
                                </OverlayTrigger>
                                
                                <OverlayTrigger 
                                  overlay={<Tooltip>Reject User</Tooltip>}
                                >
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => openRejectionModal(user)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </OverlayTrigger>
                              </>
                            )}
                            
                            <OverlayTrigger 
                              overlay={<Tooltip>View Details</Tooltip>}
                            >
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => {
                                  // Implement user detail view
                                  console.log('View user details:', user);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                            </OverlayTrigger>
                          </ButtonGroup>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Approval Modal */}
      <Modal 
        show={showApprovalModal} 
        onHide={() => setShowApprovalModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-check text-success me-2"></i>
            Approve User Registration
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {currentUser && (
            <>
              <Alert variant="info">
                <strong>User:</strong> {currentUser.first_name} {currentUser.last_name} ({currentUser.email})
              </Alert>
              
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Role *</Form.Label>
                      <Form.Select
                        value={approvalForm.role}
                        onChange={(e) => setApprovalForm({...approvalForm, role: e.target.value})}
                      >
                        {Object.entries(USER_APPROVAL_CONFIG.APPROVAL_WORKFLOWS).map(([key, workflow]) => (
                          <option key={key} value={key}>{workflow.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Department *</Form.Label>
                      <Form.Select
                        value={approvalForm.department}
                        onChange={(e) => setApprovalForm({...approvalForm, department: e.target.value})}
                      >
                        {USER_APPROVAL_CONFIG.FILTER_OPTIONS.DEPARTMENT
                          .filter(dept => dept.value !== 'all')
                          .map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Specialization</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Interventional Radiology"
                        value={approvalForm.specialization}
                        onChange={(e) => setApprovalForm({...approvalForm, specialization: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>License Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Professional license number"
                        value={approvalForm.license_number}
                        onChange={(e) => setApprovalForm({...approvalForm, license_number: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Approval Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional notes or comments..."
                    value={approvalForm.notes}
                    onChange={(e) => setApprovalForm({...approvalForm, notes: e.target.value})}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success"
            onClick={() => approveUser(currentUser?.id, approvalForm)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Approving...
              </>
            ) : (
              <>
                <i className="fas fa-check me-2"></i>
                Approve User
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal 
        show={showRejectionModal} 
        onHide={() => setShowRejectionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-times text-danger me-2"></i>
            Reject User Registration
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {currentUser && (
            <>
              <Alert variant="warning">
                <strong>Warning:</strong> You are about to reject the registration for {currentUser.first_name} {currentUser.last_name} ({currentUser.email}).
                This action cannot be undone.
              </Alert>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Rejection Reason *</Form.Label>
                  <Form.Select
                    value={rejectionForm.reason}
                    onChange={(e) => setRejectionForm({...rejectionForm, reason: e.target.value})}
                  >
                    <option value="">Select a reason...</option>
                    <option value="INCOMPLETE_CREDENTIALS">Incomplete or Invalid Credentials</option>
                    <option value="UNVERIFIED_LICENSE">Unverified Professional License</option>
                    <option value="POLICY_VIOLATION">Policy Violation</option>
                    <option value="DUPLICATE_ACCOUNT">Duplicate Account</option>
                    <option value="INSUFFICIENT_DOCUMENTATION">Insufficient Documentation</option>
                    <option value="OTHER">Other (specify in notes)</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Please provide detailed feedback for the applicant..."
                    value={rejectionForm.notes}
                    onChange={(e) => setRejectionForm({...rejectionForm, notes: e.target.value})}
                  />
                  <Form.Text className="text-muted">
                    These notes will be included in the rejection notification to the user.
                  </Form.Text>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={() => rejectUser(currentUser?.id, rejectionForm)}
            disabled={loading || !rejectionForm.reason}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Rejecting...
              </>
            ) : (
              <>
                <i className="fas fa-times me-2"></i>
                Reject User
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal 
        show={showBulkModal} 
        onHide={() => setShowBulkModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`fas ${bulkAction === 'APPROVE_ALL' ? 'fa-check-double text-success' : 'fa-times-circle text-danger'} me-2`}></i>
            Bulk {bulkAction === 'APPROVE_ALL' ? 'Approval' : 'Rejection'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Alert variant={bulkAction === 'APPROVE_ALL' ? 'success' : 'warning'}>
            <strong>Confirm Action:</strong> You are about to {bulkAction === 'APPROVE_ALL' ? 'approve' : 'reject'} {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}.
            {bulkAction === 'REJECT_ALL' && ' This action cannot be undone.'}
          </Alert>
          
          {bulkAction === 'APPROVE_ALL' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Role</Form.Label>
                    <Form.Select defaultValue="DOCTOR">
                      {Object.entries(USER_APPROVAL_CONFIG.APPROVAL_WORKFLOWS).map(([key, workflow]) => (
                        <option key={key} value={key}>{workflow.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Department</Form.Label>
                    <Form.Select defaultValue="Radiology">
                      {USER_APPROVAL_CONFIG.FILTER_OPTIONS.DEPARTMENT
                        .filter(dept => dept.value !== 'all')
                        .map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={bulkAction === 'APPROVE_ALL' ? 'success' : 'danger'}
            onClick={() => performBulkAction(bulkAction, {})}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className={`fas ${bulkAction === 'APPROVE_ALL' ? 'fa-check' : 'fa-times'} me-2`}></i>
                Confirm {bulkAction === 'APPROVE_ALL' ? 'Approval' : 'Rejection'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            show={true}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            delay={USER_APPROVAL_CONFIG.NOTIFICATIONS[toast.type.toUpperCase()]?.duration || 5000}
            autohide
          >
            <Toast.Header>
              <i className={`fas ${
                toast.type === 'success' ? 'fa-check-circle text-success' :
                toast.type === 'error' ? 'fa-exclamation-triangle text-danger' :
                toast.type === 'warning' ? 'fa-exclamation-circle text-warning' :
                'fa-info-circle text-info'
              } me-2`}></i>
              <strong className="me-auto">{toast.title}</strong>
              <small>{toast.timestamp.toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </Container>
  );
};

export default EnhancedUserApproval;