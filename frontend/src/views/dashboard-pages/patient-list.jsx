import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Form, 
  InputGroup, Badge, Dropdown, Modal, Spinner, Alert,
  Pagination, OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import { 
  FaSearch, FaFilter, FaPlus, FaEye, FaEdit, FaTrash, 
  FaCalendarAlt, FaFileAlt, FaEnvelope, FaDownload,
  FaSortUp, FaSortDown, FaSort
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PATIENT_MANAGEMENT_CONFIG, PatientConfigHelpers } from '../../config/patientManagementConfig';
import { patientAPI } from '../../services/patientManagementApi';

const PatientList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_BLUE');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(PATIENT_MANAGEMENT_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  
  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    gender: '',
    ageMin: '',
    ageMax: ''
  });
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const theme = PatientConfigHelpers.getTheme(currentTheme);
  const config = PATIENT_MANAGEMENT_CONFIG;

  useEffect(() => {
    loadPatients();
  }, [currentPage, itemsPerPage, searchQuery, filters, sortBy, sortOrder]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      // Auto-login for development testing
      await patientAPI.autoLoginForDev();
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        ...filters,
        sortBy,
        sortOrder
      };
      
      const result = await patientAPI.getMyPatients(params);
      if (result.success) {
        setPatients(result.data.map(patient => PatientConfigHelpers.formatPatientData(patient)));
        setTotalItems(result.count || result.data.length);
        setError(null);
      } else {
        console.log('API call failed, using sample data for development');
        // Fallback to sample data for development
        const sampleResult = await patientAPI.getSamplePatients();
        if (sampleResult.success) {
          setPatients(sampleResult.data.map(patient => PatientConfigHelpers.formatPatientData(patient)));
          setTotalItems(sampleResult.count);
        }
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
      
      // Fallback to sample data for development
      try {
        const sampleResult = await patientAPI.getSamplePatients();
        if (sampleResult.success) {
          setPatients(sampleResult.data.map(patient => PatientConfigHelpers.formatPatientData(patient)));
          setTotalItems(sampleResult.count);
        }
        setError(null);
      } catch (sampleErr) {
        setError('Failed to load patients');
        setPatients([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    
    try {
      const result = await patientAPI.deletePatient(selectedPatient.id);
      if (result.success) {
        setPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
        setShowDeleteModal(false);
        setSelectedPatient(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete patient');
    }
  };

  const handleExport = async (format) => {
    try {
      const result = await patientAPI.exportPatients(format, filters);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to export patients');
    }
  };

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(patient => 
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(patient => patient.status === filters.status);
    }
    
    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(patient => patient.priority === filters.priority);
    }
    
    // Apply gender filter
    if (filters.gender) {
      filtered = filtered.filter(patient => patient.gender === filters.gender);
    }
    
    // Apply age range filter
    if (filters.ageMin || filters.ageMax) {
      filtered = filtered.filter(patient => {
        const age = patient.age;
        const minAge = filters.ageMin ? parseInt(filters.ageMin) : 0;
        const maxAge = filters.ageMax ? parseInt(filters.ageMax) : 120;
        return age >= minAge && age <= maxAge;
      });
    }
    
    return filtered;
  }, [patients, searchQuery, filters]);

  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = PatientConfigHelpers.getStatusConfig(status);
    if (!statusConfig) return <Badge bg="secondary">{status}</Badge>;
    
    return (
      <Badge 
        bg={statusConfig.color}
        className="d-flex align-items-center"
        style={{ fontSize: '0.75rem' }}
      >
        <i className={statusConfig.icon} style={{ fontSize: '0.7rem', marginRight: '4px' }}></i>
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
        style={{ fontSize: '0.75rem' }}
      >
        <i className={priorityConfig.icon} style={{ fontSize: '0.7rem', marginRight: '4px' }}></i>
        {priorityConfig.label}
      </Badge>
    );
  };

  const ActionButton = ({ icon, tooltip, color, onClick, size = "sm" }) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{tooltip}</Tooltip>}
    >
      <Button
        variant={`outline-${color}`}
        size={size}
        className="me-1"
        onClick={onClick}
        style={{ 
          width: '32px', 
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Button>
    </OverlayTrigger>
  );

  if (loading && patients.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <h5>Loading Patients...</h5>
            <p className="text-muted">Please wait while we fetch your patient data</p>
          </div>
        </div>
      </Container>
    );
  }

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
              <div>
                <h1 className="display-6 fw-bold mb-2" style={{ color: theme.primaryColor }}>
                  Patient Management
                </h1>
                <p className="text-muted mb-0">
                  Manage and view all your patients in one place
                </p>
              </div>
              
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                  onClick={() => navigate('/dashboard/patients/add')}
                >
                  <FaPlus className="me-2" />
                  Add Patient
                </Button>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaDownload className="me-2" />
                    Export
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleExport('xlsx')}>
                      Export as Excel
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleExport('pdf')}>
                      Export as PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleExport('csv')}>
                      Export as CSV
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      {Object.values(config.PATIENT_STATUS).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="">All Priority</option>
                      {Object.values(config.PRIORITY_LEVELS).map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Select
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                    >
                      <option value="">All Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      {config.PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Patients Table */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Header 
                className="border-0 d-flex justify-content-between align-items-center"
                style={{ backgroundColor: 'transparent' }}
              >
                <h5 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                  Patients ({filteredAndSortedPatients.length})
                </h5>
                <div className="d-flex align-items-center gap-2">
                  {loading && <Spinner animation="border" size="sm" />}
                  <small className="text-muted">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedPatients.length)} of {filteredAndSortedPatients.length}
                  </small>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0" hover>
                    <thead style={{ backgroundColor: theme.backgroundColor }}>
                      <tr>
                        {config.PATIENT_TABLE.columns.map(column => (
                          <th 
                            key={column.key}
                            style={{ 
                              width: column.width,
                              cursor: column.sortable ? 'pointer' : 'default',
                              borderBottom: `2px solid ${theme.primaryColor}20`
                            }}
                            onClick={column.sortable ? () => handleSort(column.key) : undefined}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <span>{column.title}</span>
                              {column.sortable && (
                                <span>
                                  {sortBy === column.key ? (
                                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSort className="text-muted" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPatients.map(patient => (
                        <tr key={patient.id}>
                          <td className="fw-medium">{patient.id}</td>
                          <td>
                            <div>
                              <div className="fw-medium">{patient.fullName}</div>
                              <small className="text-muted">{patient.email}</small>
                            </div>
                          </td>
                          <td>{patient.age}</td>
                          <td className="text-capitalize">{patient.gender}</td>
                          <td>{patient.phone}</td>
                          <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                          <td>
                            <StatusBadge status={patient.status} />
                          </td>
                          <td>
                            <PriorityBadge priority={patient.priority} />
                          </td>
                          <td>
                            <div className="d-flex">
                              <ActionButton
                                icon={<FaEye />}
                                tooltip="View Details"
                                color="primary"
                                onClick={() => navigate(`/dashboard/patients/view/${patient.id}`)}
                              />
                              <ActionButton
                                icon={<FaEdit />}
                                tooltip="Edit Patient"
                                color="warning"
                                onClick={() => navigate(`/dashboard/patients/edit/${patient.id}`)}
                              />
                              <ActionButton
                                icon={<FaCalendarAlt />}
                                tooltip="Appointments"
                                color="info"
                                onClick={() => {/* Open appointments modal */}}
                              />
                              <ActionButton
                                icon={<FaFileAlt />}
                                tooltip="Medical Reports"
                                color="success"
                                onClick={() => {/* Open reports modal */}}
                              />
                              <ActionButton
                                icon={<FaTrash />}
                                tooltip="Delete Patient"
                                color="danger"
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setShowDeleteModal(true);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                
                {paginatedPatients.length === 0 && !loading && (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <FaSearch size={48} className="mb-3 opacity-50" />
                      <h5>No patients found</h5>
                      <p>Try adjusting your search criteria or add a new patient</p>
                    </div>
                  </div>
                )}
              </Card.Body>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Card.Footer 
                  className="border-0 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <div>
                    <small className="text-muted">
                      Page {currentPage} of {totalPages}
                    </small>
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    />
                  </Pagination>
                </Card.Footer>
              )}
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
            Are you sure you want to delete patient <strong>{selectedPatient?.fullName}</strong>?
          </p>
          <p className="text-danger">
            <small>This action cannot be undone and will permanently remove all patient data.</small>
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

export default PatientList;
