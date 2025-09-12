import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  Spinner, Tab, Nav, Table, Modal 
} from 'react-bootstrap';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaFileAlt, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeartbeat,
  FaUser, FaIdCard, FaPrint, FaDownload, FaEye
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PATIENT_MANAGEMENT_CONFIG, PatientConfigHelpers } from '../../config/patientManagementConfig';
import { patientAPI } from '../../services/patientManagementApi';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_BLUE');
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const theme = PatientConfigHelpers.getTheme(currentTheme);
  const config = PATIENT_MANAGEMENT_CONFIG;

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      // For development, use sample data
      const samplePatients = await patientAPI.getSamplePatients();
      const samplePatient = samplePatients.data.find(p => p.id.toString() === patientId);
      
      if (samplePatient) {
        setPatient(PatientConfigHelpers.formatPatientData(samplePatient));
        
        // Load related data
        await Promise.all([
          loadPatientReports(),
          loadPatientAppointments()
        ]);
      } else {
        setError('Patient not found');
      }
    } catch (err) {
      console.error('Failed to load patient data:', err);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const loadPatientReports = async () => {
    try {
      // Mock reports data
      setReports([
        {
          id: 1,
          type: 'X-Ray',
          date: '2025-09-08',
          status: 'Completed',
          findings: 'Normal chest X-ray, no abnormalities detected'
        },
        {
          id: 2,
          type: 'Blood Test',
          date: '2025-09-05',
          status: 'Completed',
          findings: 'Complete blood count within normal limits'
        },
        {
          id: 3,
          type: 'MRI',
          date: '2025-09-10',
          status: 'Pending',
          findings: 'Scheduled for brain MRI scan'
        }
      ]);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const loadPatientAppointments = async () => {
    try {
      // Mock appointments data
      setAppointments([
        {
          id: 1,
          date: '2025-09-15',
          time: '10:00 AM',
          type: 'Follow-up',
          status: 'Scheduled',
          notes: 'Regular check-up appointment'
        },
        {
          id: 2,
          date: '2025-09-22',
          time: '2:30 PM',
          type: 'Consultation',
          status: 'Scheduled',
          notes: 'Discuss MRI results'
        }
      ]);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const handleDeletePatient = async () => {
    try {
      const result = await patientAPI.deletePatient(patientId);
      if (result.success) {
        navigate('/dashboard/patients');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete patient');
    }
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <h5>Loading Patient Details...</h5>
            <p className="text-muted">Please wait</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error || 'Patient not found'}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-3" 
            onClick={() => navigate('/dashboard/patients')}
          >
            Back to Patients
          </Button>
        </Alert>
      </Container>
    );
  }

  const StatusBadge = ({ status }) => {
    const statusConfig = PatientConfigHelpers.getStatusConfig(status);
    if (!statusConfig) return <Badge bg="secondary">{status}</Badge>;
    
    return (
      <Badge 
        bg={statusConfig.color}
        className="d-flex align-items-center"
        style={{ fontSize: '0.9rem' }}
      >
        <i className={statusConfig.icon} style={{ fontSize: '0.8rem', marginRight: '4px' }}></i>
        {statusConfig.label}
      </Badge>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityConfig = PatientConfigHelpers.getPriorityConfig(priority);
    if (!priorityConfig) return <Badge bg="secondary">{priority}</Badge>;
    
    return (
      <Badge 
        bg={priorityConfig.color}
        className="d-flex align-items-center"
        style={{ fontSize: '0.9rem' }}
      >
        <i className={priorityConfig.icon} style={{ fontSize: '0.8rem', marginRight: '4px' }}></i>
        {priorityConfig.label}
      </Badge>
    );
  };

  return (
    <div 
      className="min-vh-100"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      <Container fluid className="p-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  className="me-3"
                  onClick={() => navigate('/dashboard/patients')}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Patients
                </Button>
                <div>
                  <h1 className="display-6 fw-bold mb-2" style={{ color: theme.primaryColor }}>
                    {patient.fullName}
                  </h1>
                  <div className="d-flex gap-2 align-items-center">
                    <StatusBadge status={patient.status} />
                    <PriorityBadge priority={patient.priority} />
                    <Badge bg="info">Patient ID: {patient.id}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/dashboard/patients/edit/${patient.id}`)}
                >
                  <FaEdit className="me-2" />
                  Edit
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => window.print()}
                >
                  <FaPrint className="me-2" />
                  Print
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash className="me-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Patient Overview Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body className="text-center">
                <div 
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: theme.primaryColor + '20',
                    color: theme.primaryColor
                  }}
                >
                  <FaUser size={32} />
                </div>
                <h5 className="fw-bold mb-1">{patient.fullName}</h5>
                <p className="text-muted mb-2">{patient.age} years old • {patient.gender}</p>
                <small className="text-muted">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  <FaPhone className="me-2" />
                  Contact Information
                </h6>
                <div className="d-flex align-items-center mb-2">
                  <FaPhone className="me-2 text-muted" size={14} />
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-2 text-muted" size={14} />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="d-flex align-items-start">
                    <FaMapMarkerAlt className="me-2 text-muted mt-1" size={14} />
                    <span style={{ fontSize: '0.9rem' }}>{patient.address}</span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  <FaHeartbeat className="me-2" />
                  Medical Information
                </h6>
                <div className="mb-2">
                  <small className="text-muted">Blood Type:</small>
                  <div className="fw-medium">{patient.bloodType || 'Not specified'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Allergies:</small>
                  <div style={{ fontSize: '0.9rem' }}>{patient.allergies || 'None known'}</div>
                </div>
                <div>
                  <small className="text-muted">Current Medications:</small>
                  <div style={{ fontSize: '0.9rem' }}>{patient.medications || 'None'}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  <FaIdCard className="me-2" />
                  Emergency Contact
                </h6>
                <div className="mb-2">
                  <small className="text-muted">Contact Person:</small>
                  <div className="fw-medium">{patient.emergencyContact}</div>
                </div>
                <div>
                  <small className="text-muted">Phone:</small>
                  <div>{patient.emergencyPhone}</div>
                </div>
                {patient.insuranceProvider && (
                  <div className="mt-3">
                    <small className="text-muted">Insurance:</small>
                    <div style={{ fontSize: '0.9rem' }}>{patient.insuranceProvider}</div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Detailed Information Tabs */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Card.Header 
                  className="border-0"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Nav variant="tabs" className="border-0">
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="overview"
                        style={{
                          color: activeTab === 'overview' ? theme.primaryColor : theme.mutedColor,
                          borderColor: activeTab === 'overview' ? theme.primaryColor : 'transparent'
                        }}
                      >
                        <FaUser className="me-2" />
                        Overview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="reports"
                        style={{
                          color: activeTab === 'reports' ? theme.primaryColor : theme.mutedColor,
                          borderColor: activeTab === 'reports' ? theme.primaryColor : 'transparent'
                        }}
                      >
                        <FaFileAlt className="me-2" />
                        Medical Reports ({reports.length})
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="appointments"
                        style={{
                          color: activeTab === 'appointments' ? theme.primaryColor : theme.mutedColor,
                          borderColor: activeTab === 'appointments' ? theme.primaryColor : 'transparent'
                        }}
                      >
                        <FaCalendarAlt className="me-2" />
                        Appointments ({appointments.length})
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="overview">
                      <Row>
                        <Col lg={6}>
                          <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                            Medical History
                          </h6>
                          <p>{patient.medicalHistory || 'No medical history recorded'}</p>
                        </Col>
                        <Col lg={6}>
                          <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                            Additional Information
                          </h6>
                          <div className="mb-3">
                            <small className="text-muted">Date of Birth:</small>
                            <div>{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                          </div>
                          <div className="mb-3">
                            <small className="text-muted">Gender:</small>
                            <div className="text-capitalize">{patient.gender}</div>
                          </div>
                          <div className="mb-3">
                            <small className="text-muted">Blood Type:</small>
                            <div>{patient.bloodType || 'Not specified'}</div>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="reports">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                          Medical Reports
                        </h6>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                        >
                          <FaFileAlt className="me-2" />
                          Add Report
                        </Button>
                      </div>
                      
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Findings</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map(report => (
                            <tr key={report.id}>
                              <td>{new Date(report.date).toLocaleDateString()}</td>
                              <td>{report.type}</td>
                              <td>
                                <Badge 
                                  bg={report.status === 'Completed' ? 'success' : 'warning'}
                                >
                                  {report.status}
                                </Badge>
                              </td>
                              <td style={{ maxWidth: '300px' }}>
                                {report.findings}
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                >
                                  <FaDownload />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="appointments">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                          Appointments
                        </h6>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                        >
                          <FaCalendarAlt className="me-2" />
                          Schedule Appointment
                        </Button>
                      </div>
                      
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(appointment => (
                            <tr key={appointment.id}>
                              <td>{new Date(appointment.date).toLocaleDateString()}</td>
                              <td>{appointment.time}</td>
                              <td>{appointment.type}</td>
                              <td>
                                <Badge 
                                  bg={appointment.status === 'Scheduled' ? 'primary' : 'secondary'}
                                >
                                  {appointment.status}
                                </Badge>
                              </td>
                              <td>{appointment.notes}</td>
                              <td>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  className="me-1"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Tab.Container>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete patient <strong>{patient?.fullName}</strong>?
          </p>
          <p className="text-danger">
            <small>This action cannot be undone and will permanently remove all patient data, including medical records and appointments.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePatient}>
            Delete Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientDetails;
