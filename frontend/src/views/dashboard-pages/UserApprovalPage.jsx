import React from 'react';
import { Container, Row, Col, Breadcrumb, Card } from 'react-bootstrap';
import { useUniversalAuth } from '../../hooks/useUniversalAuth';
import EnhancedUserApproval from '../../components/EnhancedUserApproval';
import './UserApprovalPage.scss';

const UserApprovalPage = () => {
  const { user } = useUniversalAuth();

  // Check if user has super admin access
  const hasSuperAdminAccess = () => {
    return user?.is_superuser || user?.roles?.includes('SUPER_ADMIN') || user?.is_staff;
  };

  if (!hasSuperAdminAccess()) {
    return (
      <Container className="mt-4">
        <Card>
          <Card.Body className="text-center py-5">
            <i className="fas fa-lock text-danger" style={{ fontSize: '3rem' }}></i>
            <h3 className="mt-3 text-danger">Access Denied</h3>
            <p className="text-muted">You don't have permission to access the User Approval system.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div className="user-approval-page">
      {/* Header */}
      <Container fluid className="bg-light py-3 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>User Approval Management</Breadcrumb.Item>
              </Breadcrumb>
              <h2 className="mb-0">
                <i className="fas fa-user-check text-primary me-3"></i>
                User Approval Management
              </h2>
              <p className="text-muted mb-0">
                Comprehensive system for approving and managing user registrations
              </p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Main Content */}
      <Container>
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <EnhancedUserApproval />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserApprovalPage;