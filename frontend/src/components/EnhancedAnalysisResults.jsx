import React, { useState, useRef } from 'react';
import { Card, Button, Alert, Badge, Accordion, Row, Col, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ANALYSIS_SECTIONS, RADIOLOGY_WORKFLOW, TEXT_HIGHLIGHTING, CLINICAL_PRIORITIES } from '../config/radiologyAnalysisConfig';
import '../assets/css/enhanced-analysis.css';

const EnhancedAnalysisResults = ({ 
  result, 
  originalText, 
  onSave,
  isStandardAnalysis = true 
}) => {
  const [activeSection, setActiveSection] = useState('summary');
  const [saveStatus, setSaveStatus] = useState(null);
  const [highlightedText, setHighlightedText] = useState('');
  const reportRef = useRef(null);

  // Generate clinical summary from analysis results
  const generateClinicalSummary = (analysisResult) => {
    const summary = {
      keyFindings: [],
      clinicalImplication: 'Standard radiological assessment completed.',
      urgencyLevel: 'routine',
      followUpRecommendations: []
    };

    // Extract key findings from discrepancies
    if (analysisResult.diagnostic_discrepancies?.length > 0) {
      summary.keyFindings = analysisResult.diagnostic_discrepancies
        .filter(d => d.severity === 'critical' || d.severity === 'major')
        .map(d => d.correction || d.error);
        
      // Determine urgency based on error types
      const hasUrgentFindings = analysisResult.diagnostic_discrepancies.some(d => 
        CLINICAL_PRIORITIES.urgent.keywords.some(keyword => 
          d.error?.toLowerCase().includes(keyword) || 
          d.correction?.toLowerCase().includes(keyword)
        )
      );
      
      if (hasUrgentFindings) {
        summary.urgencyLevel = 'urgent';
        summary.clinicalImplication = 'Critical findings identified requiring immediate attention.';
        summary.followUpRecommendations.push('Immediate clinical correlation recommended');
      } else {
        summary.urgencyLevel = 'important';
        summary.clinicalImplication = 'Significant findings noted requiring clinical attention.';
        summary.followUpRecommendations.push('Follow-up with referring physician recommended');
      }
    }

    // Add quality metrics
    if (analysisResult.quality_metrics) {
      summary.qualityScore = analysisResult.quality_metrics.medical_accuracy_score || 0;
      summary.terminologyCoverage = analysisResult.quality_metrics.terminology_coverage || 0;
    }

    return summary;
  };

  // Highlight text based on medical categories
  const highlightMedicalText = (text) => {
    let highlightedText = text;
    
    Object.entries(TEXT_HIGHLIGHTING.patterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        highlightedText = highlightedText.replace(pattern, (match) => {
          const color = TEXT_HIGHLIGHTING.colors[category];
          return `<mark style="background-color: ${color}; padding: 2px 4px; border-radius: 3px; font-weight: 500;" 
                    title="${category.charAt(0).toUpperCase() + category.slice(1)} term">${match}</mark>`;
        });
      });
    });

    return highlightedText;
  };

  // Handle save functionality
  const handleSave = async (saveType = 'final') => {
    setSaveStatus('saving');
    try {
      const saveData = {
        originalText,
        analysisResult: result,
        clinicalSummary: generateClinicalSummary(result),
        saveType,
        timestamp: new Date().toISOString(),
        analyst: 'AI-Enhanced Analysis'
      };
      
      await onSave?.(saveData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const clinicalSummary = generateClinicalSummary(result);
  const priorityConfig = CLINICAL_PRIORITIES[clinicalSummary.urgencyLevel] || CLINICAL_PRIORITIES.routine;

  return (
    <div className="enhanced-analysis-results">
      {/* Header with Priority Indicator */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 me-3">Analysis Results</h5>
          <Badge bg={priorityConfig.color} className="d-flex align-items-center">
            <i className={`${priorityConfig.icon} me-1`}></i>
            {clinicalSummary.urgencyLevel.toUpperCase()}
          </Badge>
        </div>
        
        {/* Save Button Group */}
        <ButtonGroup>
          <OverlayTrigger
            overlay={<Tooltip>Save analysis as draft</Tooltip>}
          >
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleSave('draft')}
              disabled={saveStatus === 'saving'}
            >
              <i className="fas fa-save me-1"></i>
              Draft
            </Button>
          </OverlayTrigger>
          
          <OverlayTrigger
            overlay={<Tooltip>Save final analysis report</Tooltip>}
          >
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => handleSave('final')}
              disabled={saveStatus === 'saving'}
            >
              <i className="fas fa-check me-1"></i>
              {saveStatus === 'saving' ? 'Saving...' : 'Save Final'}
            </Button>
          </OverlayTrigger>
          
          <OverlayTrigger
            overlay={<Tooltip>Export report for external use</Tooltip>}
          >
            <Button 
              variant="success" 
              size="sm"
              onClick={() => handleSave('export')}
              disabled={saveStatus === 'saving'}
            >
              <i className="fas fa-download me-1"></i>
              Export
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </div>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert 
          variant={saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'danger' : 'info'}
          className="mb-3"
        >
          {saveStatus === 'success' && <><i className="fas fa-check-circle me-2"></i>Analysis saved successfully!</>}
          {saveStatus === 'error' && <><i className="fas fa-exclamation-circle me-2"></i>Failed to save analysis. Please try again.</>}
          {saveStatus === 'saving' && <><i className="fas fa-spinner fa-spin me-2"></i>Saving analysis...</>}
        </Alert>
      )}

      {/* Analysis Sections */}
      <Accordion defaultActiveKey="0" className="mb-4">
        
        {/* Clinical Summary Section */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className={`${ANALYSIS_SECTIONS.SUMMARY.icon} me-2 text-primary`}></i>
              <strong>{ANALYSIS_SECTIONS.SUMMARY.title}</strong>
              <Badge bg="light" text="dark" className="ms-2">
                Quality Score: {Math.round(clinicalSummary.qualityScore || 0)}%
              </Badge>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={8}>
                <div className="clinical-summary">
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Clinical Implication</h6>
                    <p className="mb-0">{clinicalSummary.clinicalImplication}</p>
                  </div>
                  
                  {clinicalSummary.keyFindings.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Key Findings</h6>
                      <ul className="list-unstyled">
                        {clinicalSummary.keyFindings.map((finding, index) => (
                          <li key={index} className="mb-1">
                            <i className="fas fa-arrow-right text-primary me-2"></i>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {clinicalSummary.followUpRecommendations.length > 0 && (
                    <div>
                      <h6 className="text-muted mb-2">Recommendations</h6>
                      <ul className="list-unstyled">
                        {clinicalSummary.followUpRecommendations.map((rec, index) => (
                          <li key={index} className="mb-1">
                            <i className="fas fa-clipboard-check text-success me-2"></i>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Col>
              
              <Col md={4}>
                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="card-title">Quality Metrics</h6>
                    <div className="mb-2">
                      <small className="text-muted">Medical Accuracy</small>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          style={{ width: `${clinicalSummary.qualityScore || 0}%` }}
                        ></div>
                      </div>
                      <small>{Math.round(clinicalSummary.qualityScore || 0)}%</small>
                    </div>
                    
                    <div>
                      <small className="text-muted">Terminology Coverage</small>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${clinicalSummary.terminologyCoverage || 0}%` }}
                        ></div>
                      </div>
                      <small>{Math.round(clinicalSummary.terminologyCoverage || 0)}%</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        {/* Diagnostic Discrepancies Section */}
        {result.diagnostic_discrepancies && result.diagnostic_discrepancies.length > 0 && (
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <div className="d-flex align-items-center">
                <i className={`${ANALYSIS_SECTIONS.DIAGNOSTIC_DISCREPANCIES.icon} me-2 text-warning`}></i>
                <strong>{ANALYSIS_SECTIONS.DIAGNOSTIC_DISCREPANCIES.title}</strong>
                <Badge bg="warning" className="ms-2">
                  {result.diagnostic_discrepancies.length} Issues Found
                </Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="discrepancies-list">
                {result.diagnostic_discrepancies.map((discrepancy, index) => {
                  const severityConfig = ANALYSIS_SECTIONS.DIAGNOSTIC_DISCREPANCIES.severityLevels[discrepancy.severity] || 
                                       ANALYSIS_SECTIONS.DIAGNOSTIC_DISCREPANCIES.severityLevels.minor;
                  
                  return (
                    <Card key={index} className="mb-3 border-start border-4" style={{ borderLeftColor: `var(--bs-${severityConfig.color})` }}>
                      <Card.Body>
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`${severityConfig.icon} text-${severityConfig.color} me-2`}></i>
                              <Badge bg={severityConfig.color} className="me-2">
                                {discrepancy.error_type || 'General'}
                              </Badge>
                              <small className="text-muted">
                                Severity: {discrepancy.severity || 'minor'}
                              </small>
                            </div>
                            
                            <div className="mb-2">
                              <strong className="text-danger">Issue:</strong>
                              <span className="ms-2">{discrepancy.error}</span>
                            </div>
                            
                            <div>
                              <strong className="text-success">Correction:</strong>
                              <span className="ms-2">{discrepancy.correction}</span>
                            </div>
                            
                            {discrepancy.explanation && (
                              <div className="mt-2 p-2 bg-light rounded">
                                <small className="text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  {discrepancy.explanation}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Corrected Report Section */}
        {result.final_corrected_report && (
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <div className="d-flex align-items-center">
                <i className={`${ANALYSIS_SECTIONS.CORRECTED_REPORT.icon} me-2 text-success`}></i>
                <strong>{ANALYSIS_SECTIONS.CORRECTED_REPORT.title}</strong>
                <Badge bg="success" className="ms-2">
                  <i className="fas fa-check-circle me-1"></i>
                  Revised
                </Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="corrected-report-container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Final Corrected Report</h6>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(result.final_corrected_report);
                      // Could add toast notification here
                    }}
                  >
                    <i className="fas fa-copy me-1"></i>
                    Copy Report
                  </Button>
                </div>
                
                <Card className="bg-light">
                  <Card.Body>
                    <div 
                      ref={reportRef}
                      className="corrected-text"
                      style={{ 
                        lineHeight: '1.6',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {result.final_corrected_report}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Highlighted Report Section */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className={`${ANALYSIS_SECTIONS.HIGHLIGHTED_REPORT.icon} me-2 text-info`}></i>
              <strong>{ANALYSIS_SECTIONS.HIGHLIGHTED_REPORT.title}</strong>
              <Badge bg="info" className="ms-2">
                Medical Terms Highlighted
              </Badge>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="highlighted-report-container">
              {/* Legend */}
              <div className="mb-3">
                <h6 className="mb-2">Highlight Legend:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(ANALYSIS_SECTIONS.HIGHLIGHTED_REPORT.highlightTypes).map(([key, config]) => (
                    <Badge 
                      key={key}
                      style={{ 
                        backgroundColor: config.color,
                        color: '#333',
                        border: '1px solid #ddd'
                      }}
                    >
                      {config.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Highlighted Text */}
              <Card className="bg-light">
                <Card.Body>
                  <div 
                    className="highlighted-text"
                    style={{ 
                      lineHeight: '1.8',
                      fontSize: '14px'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMedicalText(originalText || result.original_text || '') 
                    }}
                  />
                </Card.Body>
              </Card>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default EnhancedAnalysisResults;
