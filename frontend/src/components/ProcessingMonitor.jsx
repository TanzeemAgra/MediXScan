// Processing Monitor Component for Real-time AI Anonymization Tracking
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  ProgressBar, 
  Alert, 
  Badge, 
  Row, 
  Col, 
  Button,
  ListGroup,
  Modal,
  Table 
} from 'react-bootstrap';
import { 
  FaRobot, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaSpinner,
  FaFileAlt,
  FaEye,
  FaHistory,
  FaTimes,
  FaDownload,
  FaShieldAlt
} from 'react-icons/fa';

const ProcessingMonitor = ({ 
  activeProcesses = [], 
  processingHistory = [], 
  onClearHistory,
  onViewDetails,
  onRetryProcess 
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'error': return 'danger';
      case 'processing': return 'warning';
      case 'uploading': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-success" />;
      case 'error': return <FaExclamationTriangle className="text-danger" />;
      case 'processing': return <FaSpinner className="text-warning spin" />;
      case 'uploading': return <FaSpinner className="text-info spin" />;
      default: return <FaClock className="text-secondary" />;
    }
  };

  const formatDuration = (startTime, endTime = null) => {
    const duration = (endTime || currentTime) - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const renderActiveProcess = (process) => {
    const elapsed = formatDuration(process.startTime);
    const progress = process.uploadProgress || 0;

    return (
      <Card key={process.id} className="mb-3 border-left-primary">
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col xs={8}>
              <div className="d-flex align-items-center mb-2">
                {getStatusIcon(process.status)}
                <div className="ms-2">
                  <h6 className="mb-0">{process.file}</h6>
                  <small className="text-muted">
                    {process.config?.model?.toUpperCase()} • {process.config?.privacy_level?.toUpperCase()}
                  </small>
                </div>
              </div>
              
              {process.status === 'uploading' && (
                <ProgressBar 
                  now={progress} 
                  label={`${progress}%`}
                  variant="info"
                  className="mb-2"
                  style={{ height: '20px' }}
                />
              )}
              
              {process.status === 'processing' && (
                <ProgressBar 
                  animated 
                  now={100}
                  variant="warning"
                  className="mb-2"
                  style={{ height: '20px' }}
                />
              )}
            </Col>
            
            <Col xs={4} className="text-end">
              <Badge bg={getStatusColor(process.status)} className="mb-2">
                {process.status.toUpperCase()}
              </Badge>
              <div className="small text-muted">
                <FaClock className="me-1" />
                {elapsed}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderHistoryItem = (process) => {
    const duration = formatDuration(process.timestamp.getTime(), 
      process.timestamp.getTime() + (process.processingTime * 1000));

    return (
      <ListGroup.Item 
        key={process.id}
        className="d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center">
          {process.success ? 
            <FaCheckCircle className="text-success me-2" /> : 
            <FaExclamationTriangle className="text-danger me-2" />
          }
          <div>
            <div className="fw-bold">{process.file}</div>
            <small className="text-muted">
              {process.timestamp.toLocaleString()} • {duration}
            </small>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <Badge bg={process.success ? 'success' : 'danger'} className="me-2">
            {process.success ? 'Success' : 'Failed'}
          </Badge>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setSelectedProcess(process)}
          >
            <FaEye />
          </Button>
        </div>
      </ListGroup.Item>
    );
  };

  const renderProcessDetails = () => {
    if (!selectedProcess) return null;

    return (
      <Modal 
        show={!!selectedProcess} 
        onHide={() => setSelectedProcess(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            Processing Details: {selectedProcess.file}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>
                  <FaRobot className="me-2" />
                  Processing Configuration
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0">
                    <tbody>
                      <tr>
                        <td><strong>AI Model:</strong></td>
                        <td>
                          <Badge bg="primary">
                            {selectedProcess.config?.model?.toUpperCase() || 'Unknown'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Privacy Level:</strong></td>
                        <td>
                          <Badge bg="info">
                            {selectedProcess.config?.privacy_level?.toUpperCase() || 'Unknown'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Processing Time:</strong></td>
                        <td>{selectedProcess.processingTime?.toFixed(2)}s</td>
                      </tr>
                      <tr>
                        <td><strong>Quality Checks:</strong></td>
                        <td>{selectedProcess.config?.quality_checks ? 'Enabled' : 'Disabled'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>
                  <FaShieldAlt className="me-2" />
                  Anonymization Results
                </Card.Header>
                <Card.Body>
                  {selectedProcess.result && (
                    <Table size="sm" className="mb-0">
                      <tbody>
                        <tr>
                          <td><strong>Entities Found:</strong></td>
                          <td>{selectedProcess.result.entities_found || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Entities Anonymized:</strong></td>
                          <td>{selectedProcess.result.entities_anonymized || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Confidence Score:</strong></td>
                          <td>
                            <Badge bg="success">
                              {selectedProcess.result.confidence_score || 'N/A'}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>File Format:</strong></td>
                          <td>{selectedProcess.result.file_format || 'Unknown'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                  
                  {!selectedProcess.success && selectedProcess.error && (
                    <Alert variant="danger" className="mt-3">
                      <strong>Error:</strong> {selectedProcess.error}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Entity Types Processed */}
          {selectedProcess.config?.entity_types && (
            <Card className="mt-3">
              <Card.Header>Entity Types Processed</Card.Header>
              <Card.Body>
                {selectedProcess.config.entity_types.map((entityType, idx) => (
                  <Badge key={idx} bg="secondary" className="me-1 mb-1">
                    {entityType.replace('_', ' ')}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          {selectedProcess.success && selectedProcess.result && (
            <Button 
              variant="success"
              onClick={() => onViewDetails && onViewDetails(selectedProcess)}
            >
              <FaDownload className="me-2" />
              Download Result
            </Button>
          )}
          
          {!selectedProcess.success && onRetryProcess && (
            <Button 
              variant="warning"
              onClick={() => {
                onRetryProcess(selectedProcess);
                setSelectedProcess(null);
              }}
            >
              Retry Processing
            </Button>
          )}
          
          <Button variant="secondary" onClick={() => setSelectedProcess(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="processing-monitor">
      {/* Active Processes */}
      {activeProcesses.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaSpinner className="spin me-2 text-primary" />
                Active Processing ({activeProcesses.length})
              </h5>
            </div>
          </Card.Header>
          <Card.Body>
            {activeProcesses.map(process => renderActiveProcess(process))}
          </Card.Body>
        </Card>
      )}

      {/* Processing History */}
      {processingHistory.length > 0 && (
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaHistory className="me-2 text-secondary" />
                Processing History ({processingHistory.length})
              </h5>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => setShowHistoryModal(true)}
                >
                  <FaEye className="me-1" />
                  View All
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={onClearHistory}
                >
                  <FaTimes className="me-1" />
                  Clear
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {processingHistory.slice(0, 5).map(process => renderHistoryItem(process))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* History Modal */}
      <Modal 
        show={showHistoryModal} 
        onHide={() => setShowHistoryModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaHistory className="me-2" />
            Complete Processing History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <ListGroup>
            {processingHistory.map(process => renderHistoryItem(process))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClearHistory}>
            <FaTimes className="me-2" />
            Clear All History
          </Button>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Process Details Modal */}
      {renderProcessDetails()}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .border-left-primary {
          border-left: 4px solid #007bff !important;
        }
      `}</style>
    </div>
  );
};

export default ProcessingMonitor;
