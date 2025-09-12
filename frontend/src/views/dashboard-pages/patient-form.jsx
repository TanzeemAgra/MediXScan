import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, 
  Spinner, Nav, Tab, InputGroup 
} from 'react-bootstrap';
import { 
  FaUser, FaPhone, FaHeartbeat, FaSave, FaArrowLeft,
  FaCalendarAlt, FaEnvelope, FaMapMarkerAlt, FaIdCard
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PATIENT_MANAGEMENT_CONFIG, PatientConfigHelpers } from '../../config/patientManagementConfig';
import { patientAPI } from '../../services/patientManagementApi';

const PatientForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEditMode = Boolean(patientId);
  
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_BLUE');
  const [activeTab, setActiveTab] = useState('personal_info');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    
    // Contact Information
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Medical Information
    allergies: '',
    medications: '',
    medicalHistory: '',
    insuranceProvider: '',
    insuranceNumber: '',
    
    // System fields
    status: 'active',
    priority: 'medium'
  });
  
  const theme = PatientConfigHelpers.getTheme(currentTheme);
  const config = PATIENT_MANAGEMENT_CONFIG;

  useEffect(() => {
    if (isEditMode) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const result = await patientAPI.getPatient(patientId);
      if (result.success) {
        setFormData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Failed to load patient data:', err);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const validation = patientAPI.validatePatientData(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      let result;
      if (isEditMode) {
        result = await patientAPI.updatePatient(patientId, formData);
      } else {
        result = await patientAPI.createPatient(formData);
      }
      
      if (result.success) {
        setSuccess(result.message);
        if (!isEditMode) {
          // Reset form for new patient
          setFormData({
            firstName: '', lastName: '', dateOfBirth: '', gender: '', bloodType: '',
            phone: '', email: '', address: '', emergencyContact: '', emergencyPhone: '',
            allergies: '', medications: '', medicalHistory: '', insuranceProvider: '', insuranceNumber: '',
            status: 'active', priority: 'medium'
          });
        }
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard/patients');
        }, 2000);
      } else {
        setError(result.error);
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
        }
      }
    } catch (err) {
      console.error('Failed to save patient:', err);
      setError('Failed to save patient data');
    } finally {
      setSaving(false);
    }
  };

  const renderFormField = (field) => {
    const value = formData[field.name] || '';
    const hasError = validationErrors[field.name];
    
    return (
      <Form.Group className="mb-3" key={field.name}>
        <Form.Label className="fw-medium">
          {field.label}
          {field.required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
        
        {field.type === 'select' ? (
          <Form.Select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            isInvalid={hasError}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        ) : field.type === 'textarea' ? (
          <Form.Control
            as="textarea"
            rows={field.rows || 3}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            isInvalid={hasError}
            required={field.required}
          />
        ) : field.type === 'tel' ? (
          <InputGroup>
            <InputGroup.Text>
              <FaPhone />
            </InputGroup.Text>
            <Form.Control
              type="tel"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              isInvalid={hasError}
              required={field.required}
            />
          </InputGroup>
        ) : field.type === 'email' ? (
          <InputGroup>
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              isInvalid={hasError}
              required={field.required}
            />
          </InputGroup>
        ) : field.type === 'date' ? (
          <InputGroup>
            <InputGroup.Text>
              <FaCalendarAlt />
            </InputGroup.Text>
            <Form.Control
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              isInvalid={hasError}
              required={field.required}
              max={new Date().toISOString().split('T')[0]}
            />
          </InputGroup>
        ) : (
          <Form.Control
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            isInvalid={hasError}
            required={field.required}
          />
        )}
        
        {hasError && (
          <Form.Control.Feedback type="invalid">
            {validationErrors[field.name]}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  };

  const renderTabContent = (sectionKey) => {
    const section = config.PATIENT_FORM[sectionKey];
    return (
      <Row>
        {section.fields.map(field => (
          <Col md={field.type === 'textarea' ? 12 : 6} key={field.name}>
            {renderFormField(field)}
          </Col>
        ))}
      </Row>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <h5>Loading Patient Data...</h5>
            <p className="text-muted">Please wait</p>
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
                <Button
                  variant="outline-secondary"
                  className="me-3"
                  onClick={() => navigate('/dashboard/patients')}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Patients
                </Button>
                <h1 className="display-6 fw-bold mb-2 d-inline" style={{ color: theme.primaryColor }}>
                  {isEditMode ? 'Edit Patient' : 'Add New Patient'}
                </h1>
              </div>
            </div>
          </Col>
        </Row>

        {/* Success Alert */}
        {success && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                <div className="d-flex align-items-center">
                  <FaSave className="me-2" />
                  {success}
                </div>
              </Alert>
            </Col>
          </Row>
        )}

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

        {/* Form */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Body className="p-0">
                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  {/* Tab Navigation */}
                  <Card.Header 
                    className="border-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <Nav variant="tabs" className="border-0">
                      {Object.keys(config.PATIENT_FORM).map(sectionKey => {
                        const section = config.PATIENT_FORM[sectionKey];
                        return (
                          <Nav.Item key={sectionKey}>
                            <Nav.Link 
                              eventKey={sectionKey}
                              className="d-flex align-items-center"
                              style={{
                                color: activeTab === sectionKey ? theme.primaryColor : theme.mutedColor,
                                borderColor: activeTab === sectionKey ? theme.primaryColor : 'transparent'
                              }}
                            >
                              <i className={`${section.icon} me-2`}></i>
                              {section.title}
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </Card.Header>

                  {/* Tab Content */}
                  <div className="p-4">
                    <Form onSubmit={handleSubmit}>
                      <Tab.Content>
                        {Object.keys(config.PATIENT_FORM).map(sectionKey => (
                          <Tab.Pane key={sectionKey} eventKey={sectionKey}>
                            <div className="mb-4">
                              <h5 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                                <i className={`${config.PATIENT_FORM[sectionKey].icon} me-2`}></i>
                                {config.PATIENT_FORM[sectionKey].title}
                              </h5>
                              {renderTabContent(sectionKey)}
                            </div>
                          </Tab.Pane>
                        ))}
                      </Tab.Content>

                      {/* Additional System Fields */}
                      {activeTab === 'medical_info' && (
                        <Row className="mt-4 pt-4 border-top">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-medium">
                                Patient Status <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                required
                              >
                                {Object.values(config.PATIENT_STATUS).map(status => (
                                  <option key={status.value} value={status.value}>
                                    {status.label} - {status.description}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-medium">
                                Priority Level <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                required
                              >
                                {Object.values(config.PRIORITY_LEVELS).map(priority => (
                                  <option key={priority.value} value={priority.value}>
                                    {priority.label}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {/* Form Actions */}
                      <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                        <div>
                          <small className="text-muted">
                            <span className="text-danger">*</span> Required fields
                          </small>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/dashboard/patients')}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={saving}
                            style={{ 
                              backgroundColor: theme.primaryColor, 
                              borderColor: theme.primaryColor,
                              minWidth: '140px'
                            }}
                          >
                            {saving ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave className="me-2" />
                                {isEditMode ? 'Update Patient' : 'Save Patient'}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientForm;
