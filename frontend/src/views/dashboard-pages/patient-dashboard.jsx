import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaHeartbeat, FaFileAlt, FaSmile, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PATIENT_MANAGEMENT_CONFIG, PatientConfigHelpers } from '../../config/patientManagementConfig';
import { patientAPI } from '../../services/patientManagementApi';

const PatientDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState('MEDICAL_BLUE');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const theme = PatientConfigHelpers.getTheme(currentTheme);
  const widgets = PATIENT_MANAGEMENT_CONFIG.WIDGETS;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Auto-login for development testing
      await patientAPI.autoLoginForDev();
      
      const result = await patientAPI.getDashboardStats();
      if (result.success) {
        setDashboardStats(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <h5>Loading Patient Dashboard...</h5>
            <p className="text-muted">Please wait while we fetch your patient data</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <div>
            <strong>Error:</strong> {error}
            <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadDashboardData}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const StatCard = ({ icon, title, value, change, color, subtitle }) => (
    <Card 
      className="h-100 border-0 shadow-sm"
      style={{ 
        background: theme.gradients[color] || theme.gradients.primary,
        color: 'white',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body className="d-flex align-items-center">
        <div className="flex-shrink-0 me-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: 'rgba(255,255,255,0.2)' 
            }}
          >
            {icon}
          </div>
        </div>
        <div className="flex-grow-1">
          <h2 className="mb-0 fw-bold">{value}</h2>
          <h6 className="mb-1 opacity-90">{title}</h6>
          {subtitle && <small className="opacity-75">{subtitle}</small>}
          {change && (
            <small className="d-block mt-1">
              <span className={change > 0 ? 'text-success' : 'text-danger'}>
                {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
              </span>
              <span className="opacity-75 ms-1">vs last month</span>
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div 
      className="min-vh-100"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      <Container fluid className="p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold mb-2" style={{ color: theme.primaryColor }}>
                  Patient Management Dashboard
                </h1>
                <p className="text-muted mb-0">
                  Comprehensive overview of your patient care activities
                </p>
              </div>
              
              {/* Theme Selector */}
              <div className="d-flex gap-2">
                {Object.keys(PATIENT_MANAGEMENT_CONFIG.THEMES).map(themeKey => {
                  const themeOption = PATIENT_MANAGEMENT_CONFIG.THEMES[themeKey];
                  return (
                    <Button
                      key={themeKey}
                      variant={currentTheme === themeKey ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => handleThemeChange(themeKey)}
                      style={{
                        backgroundColor: currentTheme === themeKey ? themeOption.primaryColor : 'transparent',
                        borderColor: themeOption.primaryColor,
                        color: currentTheme === themeKey ? 'white' : themeOption.primaryColor
                      }}
                    >
                      {themeOption.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="g-4 mb-4">
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaUsers size={24} />}
              title="Total Patients"
              value={dashboardStats?.totalPatients || 0}
              change={dashboardStats?.monthlyGrowth?.patients}
              color="primary"
              subtitle="Under your care"
            />
          </Col>
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaUserPlus size={24} />}
              title="New Patients"
              value={dashboardStats?.newPatients || 0}
              change={8.5}
              color="success"
              subtitle="This month"
            />
          </Col>
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaHeartbeat size={24} />}
              title="Active Treatments"
              value={dashboardStats?.activeTreatments || 0}
              change={dashboardStats?.monthlyGrowth?.treatments}
              color="warning"
              subtitle="Ongoing cases"
            />
          </Col>
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaFileAlt size={24} />}
              title="Pending Reports"
              value={dashboardStats?.pendingReports || 0}
              color="info"
              subtitle="Awaiting review"
            />
          </Col>
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaSmile size={24} />}
              title="Satisfaction"
              value={`${dashboardStats?.patientSatisfaction || 0}/5`}
              change={dashboardStats?.monthlyGrowth?.satisfaction}
              color="success"
              subtitle="Patient rating"
            />
          </Col>
          <Col lg={2} md={4} sm={6}>
            <StatCard
              icon={<FaExclamationTriangle size={24} />}
              title="Urgent Cases"
              value={dashboardStats?.urgentCases || 0}
              color="danger"
              subtitle="Immediate attention"
            />
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Header 
                className="border-0 pb-0"
                style={{ backgroundColor: 'transparent' }}
              >
                <h5 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={3} sm={6}>
                    <Button
                      variant="outline-primary"
                      className="w-100 py-3 d-flex flex-column align-items-center"
                      style={{ 
                        borderColor: theme.primaryColor,
                        color: theme.primaryColor,
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/dashboard/patients/add')}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.primaryColor;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = theme.primaryColor;
                      }}
                    >
                      <FaUserPlus size={24} className="mb-2" />
                      <span>Add New Patient</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button
                      variant="outline-success"
                      className="w-100 py-3 d-flex flex-column align-items-center"
                      style={{ 
                        borderColor: theme.secondaryColor,
                        color: theme.secondaryColor,
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/dashboard/patients')}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.secondaryColor;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = theme.secondaryColor;
                      }}
                    >
                      <FaUsers size={24} className="mb-2" />
                      <span>View All Patients</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button
                      variant="outline-warning"
                      className="w-100 py-3 d-flex flex-column align-items-center"
                      style={{ 
                        borderColor: '#ffc107',
                        color: '#ffc107',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/dashboard/patients?filter=reports')}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#ffc107';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#ffc107';
                      }}
                    >
                      <FaFileAlt size={24} className="mb-2" />
                      <span>Generate Reports</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button
                      variant="outline-info"
                      className="w-100 py-3 d-flex flex-column align-items-center"
                      style={{ 
                        borderColor: '#17a2b8',
                        color: '#17a2b8',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/dashboard/patients?filter=urgent')}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#17a2b8';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#17a2b8';
                      }}
                    >
                      <FaExclamationTriangle size={24} className="mb-2" />
                      <span>Urgent Cases</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Header 
                className="border-0 pb-0"
                style={{ backgroundColor: 'transparent' }}
              >
                <h5 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                  Recent Activity
                </h5>
              </Card.Header>
              <Card.Body>
                {dashboardStats?.recentActivity?.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className={`d-flex align-items-center p-3 rounded ${index !== dashboardStats.recentActivity.length - 1 ? 'mb-3' : ''}`}
                    style={{ 
                      backgroundColor: theme.backgroundColor,
                      border: `1px solid ${theme.primaryColor}20`
                    }}
                  >
                    <div 
                      className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: theme.primaryColor + '20',
                        color: theme.primaryColor
                      }}
                    >
                      {activity.type === 'new_patient' && <FaUserPlus />}
                      {activity.type === 'report_completed' && <FaFileAlt />}
                      {activity.type === 'appointment_scheduled' && <FaHeartbeat />}
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0">{activity.message}</p>
                      <small className="text-muted">
                        {new Date(activity.timestamp).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: theme.cardBackground }}>
              <Card.Header 
                className="border-0 pb-0"
                style={{ backgroundColor: 'transparent' }}
              >
                <h5 className="mb-0 fw-bold" style={{ color: theme.primaryColor }}>
                  Patient Status Distribution
                </h5>
              </Card.Header>
              <Card.Body>
                {dashboardStats?.chartData?.statusDistribution?.map((status, index) => (
                  <div key={status.status} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-medium">{status.status}</span>
                      <span className="text-muted">{status.count}</span>
                    </div>
                    <div 
                      className="progress"
                      style={{ height: '8px', backgroundColor: theme.backgroundColor }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ 
                          width: `${status.percentage}%`,
                          backgroundColor: theme.primaryColor 
                        }}
                        aria-valuenow={status.percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientDashboard;
