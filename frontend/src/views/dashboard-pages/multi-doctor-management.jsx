import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import landingPageConfig from '../../config/landingPageConfig.js';

const MultiDoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { theme } = landingPageConfig;

  // Form state
  const [doctorForm, setDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    license: '',
    role: 'radiologist',
    department: '',
    phone: '',
    status: 'active'
  });

  // Mock data for demonstration
  const mockDoctors = [
    {
      id: 1,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@hospital.com',
      specialization: 'Diagnostic Radiology',
      license: 'MD-12345',
      role: 'senior_radiologist',
      department: 'Radiology',
      phone: '+1 (555) 123-4567',
      status: 'active',
      reportsAnalyzed: 245,
      accuracy: 98.5,
      lastLogin: '2025-09-09 08:30',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      email: 'michael.chen@hospital.com',
      specialization: 'Interventional Radiology',
      license: 'MD-23456',
      role: 'radiologist',
      department: 'Radiology',
      phone: '+1 (555) 234-5678',
      status: 'active',
      reportsAnalyzed: 189,
      accuracy: 97.8,
      lastLogin: '2025-09-09 10:15',
      joinDate: '2023-03-20'
    },
    {
      id: 3,
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      specialization: 'Pediatric Radiology',
      license: 'MD-34567',
      role: 'radiologist',
      department: 'Pediatrics',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      reportsAnalyzed: 156,
      accuracy: 99.1,
      lastLogin: '2025-09-08 16:45',
      joinDate: '2023-06-10'
    }
  ];

  useEffect(() => {
    // Simulate loading doctors
    setLoading(true);
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDoctor = {
        ...doctorForm,
        id: doctors.length + 1,
        reportsAnalyzed: 0,
        accuracy: 0,
        lastLogin: null,
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      setDoctors([...doctors, newDoctor]);
      setShowAddModal(false);
      setDoctorForm({
        firstName: '',
        lastName: '',
        email: '',
        specialization: '',
        license: '',
        role: 'radiologist',
        department: '',
        phone: '',
        status: 'active'
      });
      setSuccess('Doctor added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add doctor. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDoctors(doctors.map(doc => 
        doc.id === selectedDoctor.id 
          ? { ...doc, ...doctorForm }
          : doc
      ));
      
      setShowEditModal(false);
      setSelectedDoctor(null);
      setSuccess('Doctor updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update doctor. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        setDoctors(doctors.filter(doc => doc.id !== doctorId));
        setSuccess('Doctor deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete doctor. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#dc3545',
      senior_radiologist: '#fd7e14',
      radiologist: '#198754',
      resident: '#6610f2',
      technician: '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#198754' : '#dc3545';
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-2">Multi-Doctor Management</h2>
              <p className="text-muted mb-0">Manage radiology team members and their access permissions</p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowAddModal(true)}
              style={{
                background: theme.gradient,
                border: 'none',
                borderRadius: theme.borderRadius
              }}
            >
              <i className="fas fa-plus me-2"></i>
              Add New Doctor
            </Button>
          </div>

          {/* Alerts */}
          {success && (
            <Alert variant="success" className="mb-4">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card 
                className="border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #1EBCB7, #089bab)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="text-white text-center">
                  <i className="fas fa-user-md fa-2x mb-3"></i>
                  <h3 className="fw-bold">{doctors.length}</h3>
                  <p className="mb-0">Total Doctors</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card 
                className="border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #198754, #20c997)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="text-white text-center">
                  <i className="fas fa-check-circle fa-2x mb-3"></i>
                  <h3 className="fw-bold">{doctors.filter(d => d.status === 'active').length}</h3>
                  <p className="mb-0">Active Doctors</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card 
                className="border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #fd7e14, #ffc107)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="text-white text-center">
                  <i className="fas fa-file-medical fa-2x mb-3"></i>
                  <h3 className="fw-bold">{doctors.reduce((sum, d) => sum + d.reportsAnalyzed, 0)}</h3>
                  <p className="mb-0">Total Reports</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card 
                className="border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #6610f2, #6f42c1)',
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow
                }}
              >
                <Card.Body className="text-white text-center">
                  <i className="fas fa-chart-line fa-2x mb-3"></i>
                  <h3 className="fw-bold">
                    {doctors.length > 0 
                      ? (doctors.reduce((sum, d) => sum + d.accuracy, 0) / doctors.length).toFixed(1)
                      : 0
                    }%
                  </h3>
                  <p className="mb-0">Avg Accuracy</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Doctors Table */}
          <Card 
            className="border-0"
            style={{
              borderRadius: theme.borderRadius,
              boxShadow: theme.boxShadow
            }}
          >
            <Card.Header 
              className="bg-transparent border-0 py-3"
              style={{ borderBottom: '1px solid #dee2e6' }}
            >
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-users me-2" style={{ color: theme.primaryColor }}></i>
                Doctor Management
              </h5>
            </Card.Header>
            
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: theme.primaryColor }} />
                  <p className="mt-3 text-muted">Loading doctors...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="border-0 fw-bold">Doctor</th>
                        <th className="border-0 fw-bold">Specialization</th>
                        <th className="border-0 fw-bold">Role</th>
                        <th className="border-0 fw-bold">Reports</th>
                        <th className="border-0 fw-bold">Accuracy</th>
                        <th className="border-0 fw-bold">Status</th>
                        <th className="border-0 fw-bold">Last Login</th>
                        <th className="border-0 fw-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td className="border-0 py-3">
                            <div>
                              <div className="fw-bold">{doctor.firstName} {doctor.lastName}</div>
                              <small className="text-muted">{doctor.email}</small>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <span>{doctor.specialization}</span>
                            <br />
                            <small className="text-muted">{doctor.department}</small>
                          </td>
                          <td className="border-0 py-3">
                            <Badge 
                              style={{ 
                                backgroundColor: getRoleColor(doctor.role),
                                borderRadius: theme.borderRadius
                              }}
                            >
                              {doctor.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="border-0 py-3">
                            <span className="fw-bold">{doctor.reportsAnalyzed}</span>
                          </td>
                          <td className="border-0 py-3">
                            <span 
                              className="fw-bold"
                              style={{ 
                                color: doctor.accuracy > 95 ? '#198754' : '#fd7e14' 
                              }}
                            >
                              {doctor.accuracy}%
                            </span>
                          </td>
                          <td className="border-0 py-3">
                            <Badge 
                              style={{ 
                                backgroundColor: getStatusColor(doctor.status),
                                borderRadius: theme.borderRadius
                              }}
                            >
                              {doctor.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="border-0 py-3">
                            <small className="text-muted">
                              {doctor.lastLogin || 'Never'}
                            </small>
                          </td>
                          <td className="border-0 py-3">
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setDoctorForm(doctor);
                                  setShowEditModal(true);
                                }}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteDoctor(doctor.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddDoctor}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.firstName}
                    onChange={(e) => setDoctorForm({...doctorForm, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.lastName}
                    onChange={(e) => setDoctorForm({...doctorForm, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Select
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Diagnostic Radiology">Diagnostic Radiology</option>
                    <option value="Interventional Radiology">Interventional Radiology</option>
                    <option value="Pediatric Radiology">Pediatric Radiology</option>
                    <option value="Neuroradiology">Neuroradiology</option>
                    <option value="Musculoskeletal Radiology">Musculoskeletal Radiology</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.department}
                    onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={doctorForm.role}
                    onChange={(e) => setDoctorForm({...doctorForm, role: e.target.value})}
                    required
                  >
                    <option value="radiologist">Radiologist</option>
                    <option value="senior_radiologist">Senior Radiologist</option>
                    <option value="resident">Resident</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.license}
                    onChange={(e) => setDoctorForm({...doctorForm, license: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                style={{
                  background: theme.gradient,
                  border: 'none'
                }}
              >
                {loading ? 'Adding...' : 'Add Doctor'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditDoctor}>
            {/* Same form fields as Add modal */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.firstName}
                    onChange={(e) => setDoctorForm({...doctorForm, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctorForm.lastName}
                    onChange={(e) => setDoctorForm({...doctorForm, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={doctorForm.status}
                    onChange={(e) => setDoctorForm({...doctorForm, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={doctorForm.role}
                    onChange={(e) => setDoctorForm({...doctorForm, role: e.target.value})}
                    required
                  >
                    <option value="radiologist">Radiologist</option>
                    <option value="senior_radiologist">Senior Radiologist</option>
                    <option value="resident">Resident</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                style={{
                  background: theme.gradient,
                  border: 'none'
                }}
              >
                {loading ? 'Updating...' : 'Update Doctor'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MultiDoctorManagement;
