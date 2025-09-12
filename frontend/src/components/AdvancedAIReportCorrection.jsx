// Advanced AI Report Correction Component - Innovative UI with Multiple Medical Models
import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, Col, Card, Form, Button, Alert, Spinner, Badge, 
  ProgressBar, Tab, Tabs, Modal, Tooltip, OverlayTrigger,
  ButtonGroup, Dropdown, ListGroup, Accordion
} from 'react-bootstrap';

// Simple mock translation function
const t = (key) => {
  const translations = {
    'analysisResults': 'Analysis Results',
    'summary': 'Summary',
    'correctedReport': 'Corrected Report',
    'Save': 'Save',
    'clearText': 'Clear Text'
  };
  return translations[key] || key;
};

// Simple AI Models Configuration (inline to avoid import issues)
const AI_MODELS_CONFIG = {
  MEDICAL_MODELS: {
    GPT4_MEDICAL: {
      id: 'gpt-4-medical',
      name: 'GPT-4 Medical',
      provider: 'OpenAI',
      accuracy: 98.5,
      speed: 'Fast',
      enabled: true,
      icon: 'fas fa-brain',
      color: '#00D084',
      description: 'Advanced medical reasoning and analysis'
    },
    CLAUDE_MEDICAL: {
      id: 'claude-medical', 
      name: 'Claude Medical',
      provider: 'Anthropic',
      accuracy: 97.8,
      speed: 'Fast',
      enabled: true,
      icon: 'fas fa-user-md',
      color: '#FF6B6B',
      description: 'Clinical document analysis specialist'
    },
    MEDPALM: {
      id: 'medpalm-2',
      name: 'Med-PaLM 2',
      provider: 'Google',
      accuracy: 96.9,
      speed: 'Medium',
      enabled: true,
      icon: 'fas fa-microscope',
      color: '#4285F4',
      description: 'Medical Q&A and clinical reasoning'
    },
    BIOMISTRAL: {
      id: 'biomistral-7b',
      name: 'BioMistral',
      provider: 'Mistral AI', 
      accuracy: 94.2,
      speed: 'Fast',
      enabled: true,
      icon: 'fas fa-flask',
      color: '#28A745',
      description: 'Biomedical text analysis'
    },
    CLINICAL_BERT: {
      id: 'clinical-bert',
      name: 'ClinicalBERT',
      provider: 'MIT',
      accuracy: 92.1,
      speed: 'Very Fast',
      enabled: true,
      icon: 'fas fa-search',
      color: '#17A2B8',
      description: 'Clinical NLP and terminology'
    }
  },
  PROCESSING_MODES: {
    QUICK_SCAN: {
      name: "Quick Scan",
      description: "Fast analysis for basic error detection",
      processingTime: "< 30 seconds"
    },
    STANDARD_MEDICAL: {
      name: "Standard Medical", 
      description: "Comprehensive medical report analysis",
      processingTime: "1-2 minutes"
    },
    ADVANCED_MEDICAL: {
      name: "Advanced Medical",
      description: "Deep analysis with multiple AI models", 
      processingTime: "2-5 minutes"
    }
  },
  FEATURES: {
    EXPLANATION_GENERATION: true
  }
};

// Advanced AI Model Helpers with Soft Coding Configuration
const AI_COST_CONFIG = {
  BASE_COST_PER_1K_TOKENS: 0.1,
  TIME_MULTIPLIER: 2,
  MIN_PROCESSING_TIME: 5,
  COST_PRECISION: 3,
  TIME_PRECISION: 0,
  MODEL_COST_MULTIPLIERS: {
    'gpt-4-medical': 1.5,
    'claude-medical': 1.2,
    'medpalm-2': 0.8,
    'biomistral-7b': 0.6,
    'clinical-bert': 0.4
  },
  MODEL_SPEED_MULTIPLIERS: {
    'gpt-4-medical': 1.0,
    'claude-medical': 0.9,
    'medpalm-2': 1.3,
    'biomistral-7b': 0.7,
    'clinical-bert': 0.5
  }
};

const AIModelHelpers = {
  estimateProcessingCost: (modelId, textLength) => {
    try {
      const baseCost = (textLength / 1000) * AI_COST_CONFIG.BASE_COST_PER_1K_TOKENS;
      const modelMultiplier = AI_COST_CONFIG.MODEL_COST_MULTIPLIERS[modelId] || 1.0;
      const totalCost = baseCost * modelMultiplier;
      return parseFloat(totalCost.toFixed(AI_COST_CONFIG.COST_PRECISION));
    } catch (error) {
      console.warn('Error calculating processing cost:', error);
      return 0.000;
    }
  },
  estimateProcessingTime: (modelId, textLength) => {
    try {
      const baseTime = Math.floor((textLength / 100) * AI_COST_CONFIG.TIME_MULTIPLIER);
      const modelMultiplier = AI_COST_CONFIG.MODEL_SPEED_MULTIPLIERS[modelId] || 1.0;
      const totalTime = Math.max(AI_COST_CONFIG.MIN_PROCESSING_TIME, baseTime * modelMultiplier);
      return Math.round(totalTime);
    } catch (error) {
      console.warn('Error calculating processing time:', error);
      return AI_COST_CONFIG.MIN_PROCESSING_TIME;
    }
  },
  formatCost: (cost, precision = AI_COST_CONFIG.COST_PRECISION) => {
    try {
      return typeof cost === 'number' ? cost.toFixed(precision) : '0.000';
    } catch (error) {
      return '0.000';
    }
  }
};

const AdvancedAIReportCorrection = ({ 
  reportText, 
  onCorrectionComplete, 
  onAnalysisUpdate,
  existingResult 
}) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4-medical');
  const [processingMode, setProcessingMode] = useState('advanced');
  const [aiResults, setAiResults] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('models');
  const [showComparison, setShowComparison] = useState(false);
  const [ragEnabled, setRagEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const progressInterval = useRef(null);

  // Defensive programming - ensure reportText is always a string
  const safeReportText = reportText || '';
  const reportTextLength = safeReportText.length;

  // Available models filtered by enabled status
  const availableModels = Object.entries(AI_MODELS_CONFIG.MEDICAL_MODELS)
    .filter(([key, model]) => model.enabled)
    .map(([key, model]) => ({ key, ...model }));

  // Processing modes
  const processingModes = AI_MODELS_CONFIG.PROCESSING_MODES;

  // Initialize component
  useEffect(() => {
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    }
  }, []);

  // Real-time processing effect
  useEffect(() => {
    if (realTimeEnabled && reportText && reportText.length > 50) {
      const debounceTimer = setTimeout(() => {
        processWithAI();
      }, 2000);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [reportText, realTimeEnabled, selectedModel]);

  // Simulate AI processing with progress
  const simulateProgress = () => {
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval.current);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  // Process report with selected AI model
  const processWithAI = async () => {
    if (!reportText.trim()) {
      alert('Please enter report text to analyze');
      return;
    }

    setIsProcessing(true);
    simulateProgress();

    try {
      const selectedModelConfig = availableModels.find(m => m.id === selectedModel);
      const mode = processingModes[processingMode.toUpperCase()];
      
      // Simulate API call with realistic delay
      const processingTime = AIModelHelpers.estimateProcessingTime(selectedModel, reportText.length);
      
      await new Promise(resolve => setTimeout(resolve, Math.min(processingTime * 100, 5000)));

      // Generate mock AI result based on model capabilities
      const mockResult = generateMockAIResult(selectedModelConfig, mode);
      
      setAiResults(prev => ({
        ...prev,
        [selectedModel]: mockResult
      }));

      setProgress(100);
      onCorrectionComplete && onCorrectionComplete(mockResult);
      onAnalysisUpdate && onAnalysisUpdate(mockResult);

    } catch (error) {
      console.error('AI processing error:', error);
      setAiResults(prev => ({
        ...prev,
        [selectedModel]: { error: 'AI processing failed. Please try again.' }
      }));
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval.current);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // Process with multiple models for comparison
  const processWithMultipleModels = async () => {
    const modelsToCompare = availableModels.slice(0, 3); // Limit to 3 models
    setIsProcessing(true);
    setShowComparison(true);
    simulateProgress();

    for (const model of modelsToCompare) {
      try {
        const mockResult = generateMockAIResult(model, processingModes.ADVANCED_MEDICAL);
        setAiResults(prev => ({
          ...prev,
          [model.id]: mockResult
        }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing with ${model.name}:`, error);
      }
    }

    setIsProcessing(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 2000);
  };

  // Generate mock AI result
  const generateMockAIResult = (modelConfig, mode) => {
    const corrections = [
      {
        type: 'medical_terminology',
        original: 'pneumothorax',
        suggested: 'pneumothorax',
        confidence: 98,
        explanation: 'Medical terminology is correct',
        severity: 'info'
      },
      {
        type: 'clinical_accuracy',
        original: 'bilateral infiltrates',
        suggested: 'bilateral pulmonary infiltrates',
        confidence: 92,
        explanation: 'More specific anatomical description recommended',
        severity: 'medium'
      },
      {
        type: 'grammar',
        original: 'patient have symptoms',
        suggested: 'patient has symptoms',
        confidence: 99,
        explanation: 'Subject-verb agreement correction',
        severity: 'low'
      }
    ];

    return {
      modelUsed: modelConfig.name,
      modelId: modelConfig.id,
      processingMode: mode.name,
      ragUsed: ragEnabled,
      timestamp: new Date().toISOString(),
      overallConfidence: 94 + Math.random() * 5,
      corrections: corrections,
      summary: {
        totalCorrections: corrections.length,
        highConfidence: corrections.filter(c => c.confidence > 90).length,
        medicalTerms: corrections.filter(c => c.type === 'medical_terminology').length,
        clinicalIssues: corrections.filter(c => c.type === 'clinical_accuracy').length
      },
      insights: [
        'Medical terminology usage is excellent',
        'Consider adding more specific anatomical references',
        'Overall clinical accuracy is high'
      ],
      estimatedCost: AIModelHelpers.estimateProcessingCost(modelConfig.id, reportTextLength),
      processingTime: AIModelHelpers.estimateProcessingTime(modelConfig.id, reportTextLength)
    };
  };

  // Render model selection card
  const renderModelSelection = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-gradient-primary text-white">
        <div className="d-flex align-items-center">
          <i className="ri-robot-line me-2"></i>
          <h6 className="mb-0">AI Model Selection</h6>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {availableModels.map((model) => (
            <Col md={6} lg={4} key={model.id} className="mb-3">
              <Card 
                className={`model-card cursor-pointer ${selectedModel === model.id ? 'selected' : ''}`}
                onClick={() => setSelectedModel(model.id)}
                style={{ 
                  border: selectedModel === model.id ? `2px solid ${model.color}` : '1px solid #dee2e6',
                  transition: 'all 0.3s ease'
                }}
              >
                <Card.Body className="text-center p-3">
                  <div 
                    className="model-icon mb-2"
                    style={{ fontSize: '2rem', color: model.color }}
                  >
                    <i className={model.icon}></i>
                  </div>
                  <h6 className="mb-1">{model.name}</h6>
                  <small className="text-muted">{model.provider}</small>
                  <div className="mt-2">
                    <Badge bg="success" className="me-1">
                      {model.accuracy}% accurate
                    </Badge>
                    <Badge bg="info">
                      {model.speed}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted d-block">
                      {model.description}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  // Render processing options
  const renderProcessingOptions = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-gradient-info text-white">
        <div className="d-flex align-items-center">
          <i className="ri-settings-4-line me-2"></i>
          <h6 className="mb-0">Processing Configuration</h6>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Processing Mode</Form.Label>
              <Form.Select 
                value={processingMode} 
                onChange={(e) => setProcessingMode(e.target.value)}
              >
                {Object.entries(processingModes).map(([key, mode]) => (
                  <option key={key} value={key.toLowerCase()}>
                    {mode.name} - {mode.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confidence Threshold</Form.Label>
              <Form.Range
                min={50}
                max={100}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
              />
              <small className="text-muted">Current: {confidenceThreshold}%</small>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Check
              type="switch"
              id="rag-switch"
              label="Enable RAG Enhancement"
              checked={ragEnabled}
              onChange={(e) => setRagEnabled(e.target.checked)}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="switch"
              id="realtime-switch"
              label="Real-time Processing"
              checked={realTimeEnabled}
              onChange={(e) => setRealTimeEnabled(e.target.checked)}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="switch"
              id="explanation-switch"
              label="Generate Explanations"
              checked={AI_MODELS_CONFIG.FEATURES.EXPLANATION_GENERATION}
              disabled
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Render action buttons
  const renderActionButtons = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <Row>
          <Col md={8}>
            <ButtonGroup className="w-100">
              <Button
                variant="primary"
                size="lg"
                onClick={processWithAI}
                disabled={isProcessing || !safeReportText.trim()}
                className="d-flex align-items-center justify-content-center"
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-magic-line me-2"></i>
                    Analyze with AI
                  </>
                )}
              </Button>
              
              <Button
                variant="outline-primary"
                onClick={processWithMultipleModels}
                disabled={isProcessing || availableModels.length < 2}
              >
                <i className="ri-compare-line me-1"></i>
                Compare Models
              </Button>
            </ButtonGroup>
          </Col>
          <Col md={4}>
            <div className="text-end">
              <small className="text-muted d-block">
                Estimated cost: ${AIModelHelpers.formatCost(AIModelHelpers.estimateProcessingCost(selectedModel, reportTextLength))}
              </small>
              <small className="text-muted">
                Time: ~{AIModelHelpers.estimateProcessingTime(selectedModel, reportTextLength)}s
              </small>
            </div>
          </Col>
        </Row>
        
        {progress > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between mb-1">
              <small>Processing Progress</small>
              <small>{Math.round(progress)}%</small>
            </div>
            <ProgressBar 
              now={progress} 
              variant={progress < 30 ? 'info' : progress < 70 ? 'warning' : 'success'}
              animated
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Render AI results
  const renderAIResults = () => {
    if (Object.keys(aiResults).length === 0) return null;

    return (
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-gradient-success text-white">
          <div className="d-flex align-items-center">
            <i className="ri-check-double-line me-2"></i>
            <h6 className="mb-0">AI Analysis Results</h6>
          </div>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={Object.keys(aiResults)[0]}
            className="mb-3"
          >
            {Object.entries(aiResults).map(([modelId, result]) => (
              <Tab 
                eventKey={modelId} 
                title={
                  <span>
                    <i className="ri-robot-line me-1"></i>
                    {result.modelUsed || modelId}
                    {result.overallConfidence && (
                      <Badge bg="success" className="ms-2">
                        {Math.round(result.overallConfidence)}%
                      </Badge>
                    )}
                  </span>
                }
                key={modelId}
              >
                {result.error ? (
                  <Alert variant="danger">
                    <i className="ri-error-warning-line me-2"></i>
                    {result.error}
                  </Alert>
                ) : (
                  <div>
                    {/* Summary Cards */}
                    <Row className="mb-4">
                      <Col md={3}>
                        <Card className="text-center border-primary">
                          <Card.Body>
                            <h4 className="text-primary">{result.summary?.totalCorrections || 0}</h4>
                            <small className="text-muted">Total Corrections</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-success">
                          <Card.Body>
                            <h4 className="text-success">{result.summary?.highConfidence || 0}</h4>
                            <small className="text-muted">High Confidence</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-info">
                          <Card.Body>
                            <h4 className="text-info">{result.summary?.medicalTerms || 0}</h4>
                            <small className="text-muted">Medical Terms</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-warning">
                          <Card.Body>
                            <h4 className="text-warning">{result.summary?.clinicalIssues || 0}</h4>
                            <small className="text-muted">Clinical Issues</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Corrections List */}
                    <h6>Detailed Corrections</h6>
                    <ListGroup className="mb-4">
                      {result.corrections?.map((correction, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{correction.type.replace('_', ' ')}</div>
                            <small className="text-muted">
                              "{correction.original}" → "{correction.suggested}"
                            </small>
                            <div className="mt-1">
                              <small className="text-info">{correction.explanation}</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge 
                              bg={correction.confidence > 90 ? 'success' : correction.confidence > 70 ? 'warning' : 'secondary'}
                            >
                              {correction.confidence}%
                            </Badge>
                            <div className="mt-1">
                              <Badge bg={
                                correction.severity === 'high' ? 'danger' : 
                                correction.severity === 'medium' ? 'warning' : 'info'
                              }>
                                {correction.severity}
                              </Badge>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    {/* AI Insights */}
                    {result.insights && (
                      <div>
                        <h6>AI Insights</h6>
                        <ul className="list-unstyled">
                          {result.insights.map((insight, index) => (
                            <li key={index} className="mb-2">
                              <i className="ri-lightbulb-line text-warning me-2"></i>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="advanced-ai-correction">
      <style jsx>{`
        .model-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .model-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .model-card.selected {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        }
      `}</style>

      {/* Medical Report Input Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-gradient-primary text-white">
          <h5 className="mb-0 d-flex align-items-center">
            <i className="ri-file-text-line me-2"></i>
            Medical Report Input
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className='mb-3'>
            <Form.Label style={{ fontSize: '18px', fontWeight: '600' }}>
              <i className="ri-edit-line me-2"></i>
              {t('enterMedicalReportText') || 'Enter Medical Report Text'}
            </Form.Label>
            <Form.Control
              as='textarea'
              rows={12}
              value={safeReportText}
              onChange={(e) => {
                if (typeof reportText !== 'undefined' && onAnalysisUpdate) {
                  onAnalysisUpdate(e.target.value);
                }
              }}
              placeholder={t('pasteOrType') || 'Paste your medical report text here or type directly...'}
              style={{ 
                fontSize: '16px', 
                width: '100%', 
                minHeight: '280px',
                lineHeight: '1.6',
                fontFamily: 'Consolas, Monaco, monospace'
              }}
              className="border-2"
            />
            <Form.Text className="text-muted d-flex align-items-center mt-2">
              <i className="ri-information-line me-1"></i>
              Text length: <strong className="ms-1">{reportTextLength}</strong> characters
              {reportTextLength > 0 && (
                <span className="ms-3">
                  <i className="ri-time-line me-1"></i>
                  Estimated processing: <strong>{AIModelHelpers.estimateProcessingTime(selectedModel, reportTextLength)}s</strong>
                </span>
              )}
            </Form.Text>
          </Form.Group>

          {/* File Upload Option */}
          <Form.Group className='mb-3'>
            <Form.Label className="d-flex align-items-center">
              <i className="ri-upload-line me-2"></i>
              {t('orUploadReportFile') || 'Or Upload Report File'}
            </Form.Label>
            <div className='input-group'>
              <Form.Control
                type='file'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target.result;
                      if (onAnalysisUpdate) {
                        onAnalysisUpdate(text);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
                accept='.txt,.doc,.docx,.pdf'
                className='form-control'
                style={{ fontSize: '16px' }}
              />
            </div>
            <Form.Text className="text-muted">
              <i className="ri-file-list-line me-1"></i>
              Supported formats: TXT, DOC, DOCX, PDF
            </Form.Text>
          </Form.Group>

          {/* Quick Action Buttons */}
          {safeReportText.trim() && (
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  if (onAnalysisUpdate) {
                    onAnalysisUpdate('');
                  }
                }}
              >
                <i className="ri-close-line me-1"></i>
                {t('clearText') || 'Clear Text'}
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(safeReportText);
                  alert('Text copied to clipboard!');
                }}
              >
                <i className="ri-file-copy-line me-1"></i>
                Copy Text
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row>
        <Col lg={12}>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="models" title={
              <span><i className="ri-robot-line me-1"></i>AI Models</span>
            }>
              {renderModelSelection()}
            </Tab>
            
            <Tab eventKey="config" title={
              <span><i className="ri-settings-line me-1"></i>Configuration</span>
            }>
              {renderProcessingOptions()}
            </Tab>
            
            <Tab eventKey="results" title={
              <span>
                <i className="ri-file-list-line me-1"></i>
                Results
                {Object.keys(aiResults).length > 0 && (
                  <Badge bg="success" className="ms-2">
                    {Object.keys(aiResults).length}
                  </Badge>
                )}
              </span>
            }>
              {renderAIResults()}
            </Tab>
          </Tabs>

          {activeTab !== 'results' && renderActionButtons()}
          {activeTab === 'results' && renderAIResults()}
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedAIReportCorrection;
