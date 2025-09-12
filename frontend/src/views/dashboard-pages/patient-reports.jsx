import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, 
  Alert, Spinner, Badge, Modal 
} from 'react-bootstrap';
import { 
  FaFileAlt, FaDownload, FaPrint, FaCalendarAlt, 
  FaChartBar, FaFilter, FaUsers, FaClipboardList
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { PATIENT_MANAGEMENT_CONFIG, PatientConfigHelpers } from '../../config/patientManagementConfig';
import { patientAPI } from '../../services/patientManagementApi';

const PatientReports = () => {
  const { t } = useLanguage();
  
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_BLUE');
  const [reportType, setReportType] = useState('patient_summary');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    ageRange: '',
    gender: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [patients, setPatients] = useState([]);
  
  const theme = PatientConfigHelpers.getTheme(currentTheme);
  const config = PATIENT_MANAGEMENT_CONFIG;

  const reportTypes = [
    {
      id: 'patient_summary',
      name: 'Patient Summary Report',
      description: 'Overview of all patients with basic statistics',
      icon: <FaUsers />
    },
    {
      id: 'patient_details',
      name: 'Detailed Patient Report',
      description: 'Comprehensive patient information including medical history',
      icon: <FaClipboardList />
    },
    {
      id: 'appointment_summary',
      name: 'Appointment Summary',
      description: 'Summary of appointments within date range',
      icon: <FaCalendarAlt />
    },
    {
      id: 'medical_reports',
      name: 'Medical Reports Summary',
      description: 'Overview of medical tests and results',
      icon: <FaFileAlt />
    },
    {
      id: 'analytics',
      name: 'Patient Analytics',
      description: 'Statistical analysis and trends',
      icon: <FaChartBar />
    }
  ];

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientAPI.getSamplePatients();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filteredPatients = patients.filter(patient => {
        if (filters.status && patient.status !== filters.status) return false;
        if (filters.priority && patient.priority !== filters.priority) return false;
        if (filters.gender && patient.gender !== filters.gender) return false;
        if (filters.ageRange) {
          const age = patient.age;
          switch (filters.ageRange) {
            case 'young': return age < 30;
            case 'middle': return age >= 30 && age < 60;
            case 'senior': return age >= 60;
            default: return true;
          }
        }
        return true;
      });

      const report = generateReportData(reportType, filteredPatients);
      setReportData(report);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (type, patientData) => {
    const currentDate = new Date().toLocaleDateString();
    
    switch (type) {
      case 'patient_summary':
        return {
          type: 'Patient Summary Report',
          generatedDate: currentDate,
          totalPatients: patientData.length,
          statistics: {
            active: patientData.filter(p => p.status === 'Active').length,
            inactive: patientData.filter(p => p.status === 'Inactive').length,
            critical: patientData.filter(p => p.priority === 'High').length,
            byGender: {
              male: patientData.filter(p => p.gender === 'male').length,
              female: patientData.filter(p => p.gender === 'female').length,
              other: patientData.filter(p => !['male', 'female'].includes(p.gender)).length
            },
            byAge: {
              young: patientData.filter(p => p.age < 30).length,
              middle: patientData.filter(p => p.age >= 30 && p.age < 60).length,
              senior: patientData.filter(p => p.age >= 60).length
            }
          },
          patients: patientData.slice(0, 10) // Show first 10 patients
        };
        
      case 'patient_details':
        return {
          type: 'Detailed Patient Report',
          generatedDate: currentDate,
          totalPatients: patientData.length,
          patients: patientData
        };
        
      case 'appointment_summary':
        return {
          type: 'Appointment Summary Report',
          generatedDate: currentDate,
          dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
          totalAppointments: patientData.length * 2, // Mock data
          upcomingAppointments: Math.floor(patientData.length * 1.5),
          completedAppointments: Math.floor(patientData.length * 0.5),
          appointments: patientData.map((patient, index) => ({
            patientName: patient.fullName,
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
            time: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'][index % 4],
            type: ['Consultation', 'Follow-up', 'Check-up', 'Emergency'][index % 4],
            status: ['Scheduled', 'Completed', 'Cancelled'][index % 3]
          })).slice(0, 15)
        };
        
      case 'medical_reports':
        return {
          type: 'Medical Reports Summary',
          generatedDate: currentDate,
          totalReports: patientData.length * 3,
          completedReports: Math.floor(patientData.length * 2.5),
          pendingReports: Math.floor(patientData.length * 0.5),
          reports: patientData.map((patient, index) => ({
            patientName: patient.fullName,
            reportType: ['X-Ray', 'Blood Test', 'MRI', 'CT Scan', 'Ultrasound'][index % 5],
            date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: ['Completed', 'Pending', 'In Progress'][index % 3],
            findings: ['Normal', 'Abnormal', 'Requires Follow-up'][index % 3]
          })).slice(0, 20)
        };
        
      case 'analytics':
        return {
          type: 'Patient Analytics Report',
          generatedDate: currentDate,
          period: `${dateRange.startDate} to ${dateRange.endDate}`,
          trends: {
            newPatients: Math.floor(patientData.length * 0.2),
            returningPatients: Math.floor(patientData.length * 0.8),
            averageAge: Math.round(patientData.reduce((sum, p) => sum + p.age, 0) / patientData.length),
            mostCommonStatus: 'Active',
            mostCommonPriority: 'Medium'
          },
          demographics: {
            ageDistribution: [
              { range: '0-18', count: patientData.filter(p => p.age < 18).length },
              { range: '18-30', count: patientData.filter(p => p.age >= 18 && p.age < 30).length },
              { range: '30-50', count: patientData.filter(p => p.age >= 30 && p.age < 50).length },
              { range: '50-70', count: patientData.filter(p => p.age >= 50 && p.age < 70).length },
              { range: '70+', count: patientData.filter(p => p.age >= 70).length }
            ],
            genderDistribution: [
              { gender: 'Male', count: patientData.filter(p => p.gender === 'male').length },
              { gender: 'Female', count: patientData.filter(p => p.gender === 'female').length },
              { gender: 'Other', count: patientData.filter(p => !['male', 'female'].includes(p.gender)).length }
            ]
          }
        };
        
      default:
        return null;
    }
  };

  const downloadReport = (format) => {
    if (!reportData) return;
    
    const content = generateReportContent(reportData, format);
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (data, format) => {
    if (format === 'csv') {
      // Generate CSV content
      let csv = `${data.type}\nGenerated: ${data.generatedDate}\n\n`;
      
      if (data.patients) {
        csv += 'Patient Name,Age,Gender,Status,Priority,Phone,Last Visit\n';
        data.patients.forEach(patient => {
          csv += `"${patient.fullName}",${patient.age},"${patient.gender}","${patient.status}","${patient.priority}","${patient.phone}","${patient.lastVisit}"\n`;
        });
      }
      
      return csv;
    } else {
      // Generate text content
      let text = `${data.type}\n`;
      text += `Generated: ${data.generatedDate}\n`;
      text += '='.repeat(50) + '\n\n';
      
      if (data.statistics) {
        text += 'STATISTICS:\n';
        text += `-----------\n`;
        text += `Total Patients: ${data.totalPatients}\n`;
        text += `Active Patients: ${data.statistics.active}\n`;
        text += `Inactive Patients: ${data.statistics.inactive}\n`;
        text += `Critical Priority: ${data.statistics.critical}\n\n`;
      }
      
      if (data.patients) {
        text += 'PATIENT LIST:\n';
        text += '-------------\n';
        data.patients.forEach((patient, index) => {
          text += `${index + 1}. ${patient.fullName} - Age: ${patient.age}, Status: ${patient.status}\n`;
        });
      }
      
      return text;
    }
  };

  const printReport = () => {
    window.print();
  };

  const ReportCard = ({ report, isSelected, onSelect }) => (
    <Card 
      className={`border-2 cursor-pointer transition-all ${isSelected ? 'border-primary' : 'border-light'}`}
      style={{ 
        backgroundColor: isSelected ? theme.primaryColor + '10' : theme.cardBackground,
        borderColor: isSelected ? theme.primaryColor : theme.borderColor,
        cursor: 'pointer'
      }}
      onClick={onSelect}
    >
      <Card.Body className="text-center p-4">
        <div 
          className="mb-3 d-flex justify-content-center"
          style={{ 
            color: isSelected ? theme.primaryColor : theme.mutedColor,
            fontSize: '2rem'
          }}
        >
          {report.icon}
        </div>
        <h6 className="fw-bold mb-2" style={{ color: theme.textColor }}>
          {report.name}
        </h6>
        <p className="text-muted small mb-0">
          {report.description}
        </p>
      </Card.Body>
    </Card>
  );

  const ReportPreview = () => {
    if (!reportData) return null;

    return (
      <div className="mt-4">
        <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
          <Card.Header 
            className="d-flex justify-content-between align-items-center"
            style={{ backgroundColor: theme.primaryColor + '10' }}
          >
            <h5 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
              {reportData.type}
            </h5>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={printReport}
              >
                <FaPrint className="me-2" />
                Print
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => downloadReport('csv')}
              >
                <FaDownload className="me-2" />
                CSV
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => downloadReport('txt')}
              >
                <FaDownload className="me-2" />
                Text
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <small className="text-muted">Generated on: {reportData.generatedDate}</small>
            </div>

            {/* Summary Statistics */}
            {reportData.statistics && (
              <Row className="mb-4">
                <Col md={3}>
                  <div className="text-center p-3 rounded" style={{ backgroundColor: theme.primaryColor + '10' }}>
                    <h4 className="fw-bold mb-1" style={{ color: theme.primaryColor }}>
                      {reportData.totalPatients}
                    </h4>
                    <small className="text-muted">Total Patients</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 rounded" style={{ backgroundColor: '#28a745' + '10' }}>
                    <h4 className="fw-bold mb-1 text-success">
                      {reportData.statistics.active}
                    </h4>
                    <small className="text-muted">Active</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 rounded" style={{ backgroundColor: '#ffc107' + '10' }}>
                    <h4 className="fw-bold mb-1 text-warning">
                      {reportData.statistics.inactive}
                    </h4>
                    <small className="text-muted">Inactive</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 rounded" style={{ backgroundColor: '#dc3545' + '10' }}>
                    <h4 className="fw-bold mb-1 text-danger">
                      {reportData.statistics.critical}
                    </h4>
                    <small className="text-muted">Critical</small>
                  </div>
                </Col>
              </Row>
            )}

            {/* Patient Table */}
            {reportData.patients && (
              <div>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  Patient Details
                </h6>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.patients.slice(0, 10).map((patient, index) => (
                      <tr key={index}>
                        <td className="fw-medium">{patient.fullName}</td>
                        <td>{patient.age}</td>
                        <td className="text-capitalize">{patient.gender}</td>
                        <td>
                          <Badge 
                            bg={patient.status === 'Active' ? 'success' : 'warning'}
                          >
                            {patient.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            bg={
                              patient.priority === 'High' ? 'danger' : 
                              patient.priority === 'Medium' ? 'warning' : 'success'
                            }
                          >
                            {patient.priority}
                          </Badge>
                        </td>
                        <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {reportData.patients.length > 10 && (
                  <p className="text-muted text-center">
                    Showing first 10 of {reportData.patients.length} patients
                  </p>
                )}
              </div>
            )}

            {/* Appointments Table */}
            {reportData.appointments && (
              <div>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  Appointments
                </h6>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.appointments.map((appointment, index) => (
                      <tr key={index}>
                        <td className="fw-medium">{appointment.patientName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.type}</td>
                        <td>
                          <Badge 
                            bg={
                              appointment.status === 'Completed' ? 'success' : 
                              appointment.status === 'Scheduled' ? 'primary' : 'secondary'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Analytics Data */}
            {reportData.trends && (
              <div>
                <h6 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
                  Analytics Summary
                </h6>
                <Row>
                  <Col md={6}>
                    <h6>Key Metrics</h6>
                    <ul className="list-unstyled">
                      <li>New Patients: <strong>{reportData.trends.newPatients}</strong></li>
                      <li>Returning Patients: <strong>{reportData.trends.returningPatients}</strong></li>
                      <li>Average Age: <strong>{reportData.trends.averageAge} years</strong></li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Demographics</h6>
                    {reportData.demographics && (
                      <div>
                        <small className="text-muted">Age Distribution:</small>
                        {reportData.demographics.ageDistribution.map((item, index) => (
                          <div key={index} className="d-flex justify-content-between">
                            <span>{item.range}:</span>
                            <strong>{item.count}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
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
            <h1 className="display-6 fw-bold mb-2" style={{ color: theme.primaryColor }}>
              <FaFileAlt className="me-3" />
              Patient Reports
            </h1>
            <p className="text-muted mb-0">
              Generate comprehensive reports for patient management and analytics
            </p>
          </Col>
        </Row>

        {/* Report Type Selection */}
        <Row className="mb-4">
          <Col>
            <h5 className="fw-bold mb-3" style={{ color: theme.primaryColor }}>
              Select Report Type
            </h5>
            <Row>
              {reportTypes.map(report => (
                <Col lg={4} md={6} key={report.id} className="mb-3">
                  <ReportCard
                    report={report}
                    isSelected={reportType === report.id}
                    onSelect={() => setReportType(report.id)}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Filters and Options */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Header style={{ backgroundColor: 'transparent' }}>
                <h6 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                  <FaFilter className="me-2" />
                  Report Filters & Options
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={3} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Range</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                        <Form.Control
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age Range</Form.Label>
                      <Form.Select
                        value={filters.ageRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                      >
                        <option value="">All Ages</option>
                        <option value="young">Under 30</option>
                        <option value="middle">30-60</option>
                        <option value="senior">Over 60</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        value={filters.gender}
                        onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={1} md={6} className="d-flex align-items-end">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={generateReport}
                      disabled={loading}
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.primaryColor
                      }}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaChartBar className="me-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Report Preview */}
        {showPreview && <ReportPreview />}

        {/* No Report Message */}
        {!showPreview && !loading && (
          <Alert variant="info" className="text-center">
            <FaFileAlt className="me-2" />
            Select a report type and configure filters, then click "Generate" to create your report.
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default PatientReports;
