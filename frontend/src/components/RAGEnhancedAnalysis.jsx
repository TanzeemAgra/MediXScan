// RAG-Enhanced Medical Report Analysis Component
// Advanced UI for RAG-powered medical terminology validation and correction

import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, Col, Card, Form, Button, Alert, Spinner, Badge, 
  ProgressBar, Tab, Tabs, Modal, Tooltip, OverlayTrigger,
  ListGroup, Accordion, Table
} from 'react-bootstrap';
import { medicalRAGService } from '../services/medicalRAGService.js';
import { RAG_CONFIG } from '../config/ragConfig.js';

const RAGEnhancedAnalysis = ({ 
  reportText, 
  onAnalysisComplete, 
  onTerminologyUpdate 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ragResults, setRagResults] = useState(null);
  const [selectedSources, setSelectedSources] = useState(['radiopaedia', 'radiologyinfo']);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceStats, setPerformanceStats] = useState(null);
  const [userFeedback, setUserFeedback] = useState({});

  // Simple translation function
  const t = (key) => {
    const translations = {
      'ragAnalysis': 'RAG-Enhanced Analysis',
      'medicalTerminology': 'Medical Terminology',
      'knowledgeSources': 'Knowledge Sources',
      'processingResults': 'Processing Results',
      'performanceMetrics': 'Performance Metrics',
      'userFeedback': 'User Feedback',
      'startAnalysis': 'Start RAG Analysis',
      'analyzing': 'Analyzing...',
      'confidence': 'Confidence',
      'sources': 'Sources',
      'suggestions': 'Suggestions',
      'corrections': 'Corrections'
    };
    return translations[key] || key;
  };

  // Process report with RAG enhancement
  const processWithRAG = async () => {
    if (!reportText || !reportText.trim()) {
      alert('Please enter a medical report text first.');
      return;
    }

    setIsProcessing(true);
    try {
      // Update user preferences
      medicalRAGService.updateUserPreferences({
        preferredSources: selectedSources,
        confidenceThreshold: confidenceThreshold
      });

      // Process report with RAG
      const results = await medicalRAGService.enhanceMedicalReport(reportText, {
        includeSuggestions: true,
        enableCorrections: true,
        maxSuggestions: 10
      });

      setRagResults(results);
      setPerformanceStats(medicalRAGService.getPerformanceStats());

      // Notify parent components
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
      if (onTerminologyUpdate) {
        onTerminologyUpdate(results.suggestions);
      }

    } catch (error) {
      console.error('RAG Analysis Error:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user feedback on suggestions
  const handleTermFeedback = (termIndex, feedbackType, value) => {
    setUserFeedback(prev => ({
      ...prev,
      [`${termIndex}_${feedbackType}`]: value
    }));
  };

  // Render source selection interface
  const renderSourceSelection = () => (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h6 className="mb-0">
          <i className="ri-database-line me-2"></i>
          {t('knowledgeSources')}
        </h6>
      </Card.Header>
      <Card.Body>
        <Row>
          {Object.values(RAG_CONFIG.MEDICAL_SOURCES).map(source => (
            <Col md={6} key={source.id} className="mb-3">
              <Form.Check
                type="checkbox"
                id={`source-${source.id}`}
                label={
                  <div>
                    <strong>{source.name}</strong>
                    <br />
                    <small className="text-muted">{source.description}</small>
                    <br />
                    <Badge 
                      bg={source.trustScore >= 95 ? 'success' : source.trustScore >= 90 ? 'warning' : 'secondary'}
                      className="me-2"
                    >
                      Trust: {source.trustScore}%
                    </Badge>
                    <Badge bg={source.enabled ? 'success' : 'danger'}>
                      {source.enabled ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                }
                checked={selectedSources.includes(source.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSources([...selectedSources, source.id]);
                  } else {
                    setSelectedSources(selectedSources.filter(id => id !== source.id));
                  }
                }}
                disabled={!source.enabled}
              />
            </Col>
          ))}
        </Row>
        
        <hr />
        
        <Row className="align-items-center">
          <Col md={6}>
            <Form.Label>Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%</Form.Label>
            <Form.Range
              min={0.5}
              max={1.0}
              step={0.05}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            />
          </Col>
          <Col md={6}>
            <Button
              variant="success"
              onClick={processWithRAG}
              disabled={isProcessing || selectedSources.length === 0}
              className="w-100"
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {t('analyzing')}
                </>
              ) : (
                <>
                  <i className="ri-magic-line me-2"></i>
                  {t('startAnalysis')}
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Render analysis results
  const renderAnalysisResults = () => {
    if (!ragResults) return null;

    return (
      <Card className="mb-4">
        <Card.Header className="bg-success text-white">
          <h6 className="mb-0">
            <i className="ri-file-list-line me-2"></i>
            {t('processingResults')}
          </h6>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            {/* Overview Tab */}
            <Tab eventKey="overview" title="Overview">
              <Row className="mb-3">
                <Col md={3}>
                  <Card className="text-center border-primary">
                    <Card.Body>
                      <h4 className="text-primary">{ragResults.termsProcessed}</h4>
                      <small>Terms Processed</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-success">
                    <Card.Body>
                      <h4 className="text-success">{ragResults.corrections.length}</h4>
                      <small>Corrections Made</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-info">
                    <Card.Body>
                      <h4 className="text-info">{(ragResults.confidence * 100).toFixed(1)}%</h4>
                      <small>Overall Confidence</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-warning">
                    <Card.Body>
                      <h4 className="text-warning">{ragResults.sourcesUsed.length}</h4>
                      <small>Sources Consulted</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {ragResults.sources.length > 0 && (
                <Alert variant="info">
                  <strong>Sources Used:</strong> {ragResults.sourcesUsed.join(', ')}
                </Alert>
              )}

              {ragResults.processingTime && (
                <Alert variant="secondary">
                  <small>
                    <i className="ri-time-line me-1"></i>
                    Processing completed in {ragResults.processingTime.toFixed(0)}ms
                  </small>
                </Alert>
              )}
            </Tab>

            {/* Corrections Tab */}
            <Tab eventKey="corrections" title={`Corrections (${ragResults.corrections.length})`}>
              {ragResults.corrections.length > 0 ? (
                <ListGroup>
                  {ragResults.corrections.map((correction, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto">
                        <div className="fw-bold text-danger">
                          "{correction.original}" → "{correction.corrected}"
                        </div>
                        <small className="text-muted">
                          Reason: {correction.reason} | Confidence: {(correction.confidence * 100).toFixed(1)}%
                        </small>
                      </div>
                      <div>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleTermFeedback(index, 'accept', true)}
                          className="me-1"
                        >
                          <i className="ri-check-line"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleTermFeedback(index, 'reject', true)}
                        >
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="success">
                  <i className="ri-check-circle-line me-2"></i>
                  No corrections needed. All medical terminology appears to be accurate.
                </Alert>
              )}
            </Tab>

            {/* Suggestions Tab */}
            <Tab eventKey="suggestions" title={`Suggestions (${ragResults.suggestions.length})`}>
              {ragResults.suggestions.length > 0 ? (
                <Accordion>
                  {ragResults.suggestions.map((suggestion, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>
                        <Badge bg="info" className="me-2">
                          {(suggestion.confidence * 100).toFixed(1)}%
                        </Badge>
                        {suggestion.term}
                      </Accordion.Header>
                      <Accordion.Body>
                        {suggestion.synonyms.length > 0 && (
                          <div className="mb-3">
                            <strong>Alternative Terms:</strong>
                            <div className="mt-1">
                              {suggestion.synonyms.map((synonym, sIndex) => (
                                <Badge 
                                  key={sIndex} 
                                  bg="secondary" 
                                  className="me-1 mb-1"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleTermFeedback(index, 'synonym', synonym)}
                                >
                                  {synonym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleTermFeedback(index, 'helpful', true)}
                          >
                            <i className="ri-thumb-up-line me-1"></i>
                            Helpful
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleTermFeedback(index, 'not_helpful', true)}
                          >
                            <i className="ri-thumb-down-line me-1"></i>
                            Not Helpful
                          </Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Alert variant="info">
                  <i className="ri-information-line me-2"></i>
                  No additional suggestions available at this time.
                </Alert>
              )}
            </Tab>

            {/* Enhanced Report Tab */}
            <Tab eventKey="enhanced" title="Enhanced Report">
              <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
                <h6>Enhanced Report:</h6>
                <div 
                  style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  {ragResults.enhancedReport}
                </div>
              </div>
              
              <div className="mt-3 d-flex gap-2">
                <Button
                  variant="success"
                  onClick={() => {
                    navigator.clipboard.writeText(ragResults.enhancedReport);
                    alert('Enhanced report copied to clipboard!');
                  }}
                >
                  <i className="ri-file-copy-line me-1"></i>
                  Copy Enhanced Report
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => setShowDetailedAnalysis(true)}
                >
                  <i className="ri-eye-line me-1"></i>
                  View Detailed Analysis
                </Button>
              </div>
            </Tab>

            {/* Performance Tab */}
            {performanceStats && (
              <Tab eventKey="performance" title="Performance">
                <Table striped bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Search Count</strong></td>
                      <td>{performanceStats.searchCount}</td>
                    </tr>
                    <tr>
                      <td><strong>Average Response Time</strong></td>
                      <td>{performanceStats.averageResponseTime.toFixed(2)}ms</td>
                    </tr>
                    <tr>
                      <td><strong>Cache Hit Rate</strong></td>
                      <td>{(performanceStats.cacheHitRate * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td><strong>Cache Size</strong></td>
                      <td>{performanceStats.cacheSize} entries</td>
                    </tr>
                  </tbody>
                </Table>
                
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => {
                    medicalRAGService.clearCache();
                    setPerformanceStats(medicalRAGService.getPerformanceStats());
                  }}
                >
                  <i className="ri-delete-bin-line me-1"></i>
                  Clear Cache
                </Button>
              </Tab>
            )}
          </Tabs>
        </Card.Body>
      </Card>
    );
  };

  // Render detailed analysis modal
  const renderDetailedAnalysisModal = () => (
    <Modal 
      show={showDetailedAnalysis} 
      onHide={() => setShowDetailedAnalysis(false)}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Detailed RAG Analysis</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ragResults && (
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(ragResults, null, 2)}
          </pre>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetailedAnalysis(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="rag-enhanced-analysis">
      <style jsx>{`
        .rag-enhanced-analysis {
          padding: 1rem;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-gradient-primary text-white">
          <h5 className="mb-0">
            <i className="ri-magic-line me-2"></i>
            {t('ragAnalysis')} - Medical Terminology Enhancement
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="mb-3">
            <i className="ri-information-line me-2"></i>
            <strong>RAG Enhancement:</strong> This system uses Retrieval-Augmented Generation to validate and enhance medical terminology by consulting authoritative radiology sources including Radiopaedia, RadiologyInfo, and peer-reviewed publications.
          </Alert>
          
          {renderSourceSelection()}
          {renderAnalysisResults()}
          {renderDetailedAnalysisModal()}
        </Card.Body>
      </Card>
    </div>
  );
};

export default RAGEnhancedAnalysis;
