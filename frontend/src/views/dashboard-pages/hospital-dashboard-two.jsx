import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Alert,
  Spinner,
  Tab,
  Tabs,
  ProgressBar,
  Badge,
  ButtonGroup,
  Modal,
  Table
} from "react-bootstrap";
import { anonymizeFile, downloadAnonymizedFile } from "../../services/anonymizerApi";
import { aiAnonymizerService } from "../../services/aiAnonymizerService";
import { useLanguage } from "../../context/LanguageContext.jsx";
import AIModelSelector from "../../components/AIModelSelector";
import PrivacyLevelSelector from "../../components/PrivacyLevelSelector";
import ProcessingMonitor from "../../components/ProcessingMonitor";
import { 
  FaUpload, 
  FaFileAlt, 
  FaFileExcel, 
  FaFileWord, 
  FaShieldAlt, 
  FaDownload, 
  FaExchangeAlt, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaRobot,
  FaCog,
  FaHistory,
  FaMagic,
  FaChartLine,
  FaSyncAlt
} from 'react-icons/fa';

const HospitalDashboardTwo = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [processingStage, setProcessingStage] = useState(0);
  
  // AI-powered anonymizer state
  const [aiMode, setAiMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('advanced_nlp');
  const [selectedPrivacyLevel, setSelectedPrivacyLevel] = useState('standard');
  const [selectedEntities, setSelectedEntities] = useState([
    'person_names', 'medical_ids', 'dates', 'contact_info'
  ]);
  const [processingEstimate, setProcessingEstimate] = useState(null);
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [processingHistory, setProcessingHistory] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load processing history on component mount
  useEffect(() => {
    const history = aiAnonymizerService.getProcessingHistory();
    setProcessingHistory(history);
    
    // Update active processes
    const active = aiAnonymizerService.getActiveProcesses();
    setActiveProcesses(active);
    
    // Poll for active process updates
    const interval = setInterval(() => {
      const updatedActive = aiAnonymizerService.getActiveProcesses();
      setActiveProcesses(updatedActive);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update processing estimate when file or config changes
  useEffect(() => {
    if (file && aiMode) {
      try {
        // Update anonymizer configuration
        aiAnonymizerService.updateConfiguration({
          model: selectedModel,
          privacy_level: selectedPrivacyLevel,
          entity_types: selectedEntities
        });
        
        const estimate = aiAnonymizerService.estimateProcessing(file);
        setProcessingEstimate(estimate);
      } catch (err) {
        console.error('Error updating estimate:', err);
      }
    } else {
      setProcessingEstimate(null);
    }
  }, [file, selectedModel, selectedPrivacyLevel, selectedEntities, aiMode]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file
      if (aiMode) {
        const validation = aiAnonymizerService.validateFile(selectedFile);
        if (!validation.isValid) {
          setError(validation.errors.join(', '));
          return;
        }
      }
      
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validate all files if in AI mode
      if (aiMode) {
        const errors = [];
        files.forEach(file => {
          const validation = aiAnonymizerService.validateFile(file);
          if (!validation.isValid) {
            errors.push(`${file.name}: ${validation.errors.join(', ')}`);
          }
        });
        
        if (errors.length > 0) {
          setError(errors.join('\n'));
          return;
        }
      }
      
      setSelectedFiles(files);
      setError(null);
    }
  };

  const getFileIcon = () => {
    if (!file) return <FaFileAlt size={30} className="text-secondary" />;
    
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'xlsx' || fileType === 'xls') {
      return <FaFileExcel size={30} className="text-success" />;
    } else if (fileType === 'docx' || fileType === 'doc') {
      return <FaFileWord size={30} className="text-primary" />;
    } else {
      return <FaFileAlt size={30} className="text-info" />;
    }
  };

  const handleAnonymize = async () => {
    if (!file && !batchMode) {
      setError(t('pleaseSelectFile'));
      return;
    }

    if (batchMode && selectedFiles.length === 0) {
      setError('Please select files for batch processing');
      return;
    }

    setLoading(true);
    setError(null);
    setProcessingStage(1);
    
    try {
      let response;
      
      if (aiMode) {
        // Use AI-powered anonymization
        if (batchMode) {
          setProcessingStage(2);
          response = await aiAnonymizerService.anonymizeBatch(selectedFiles, {
            model: selectedModel,
            privacy_level: selectedPrivacyLevel,
            entity_types: selectedEntities
          });
          setProcessingStage(3);
        } else {
          // Simulate processing stages for visual feedback
          setTimeout(() => setProcessingStage(2), 1000);
          setTimeout(() => setProcessingStage(3), 2500);
          
          response = await aiAnonymizerService.anonymizeWithAI(file, {
            model: selectedModel,
            privacy_level: selectedPrivacyLevel,
            entity_types: selectedEntities
          });
        }
      } else {
        // Use legacy anonymization
        setTimeout(() => setProcessingStage(2), 1000);
        setTimeout(() => setProcessingStage(3), 2000);
        
        response = await anonymizeFile(file);
      }
      
      setResult(response);
      setActiveTab('result');
      setProcessingStage(4);
      
      // Update processing history
      const history = aiAnonymizerService.getProcessingHistory();
      setProcessingHistory(history);
      
    } catch (err) {
      setError(err.response?.data?.detail || err.message || t('errorProcessingFile'));
      setProcessingStage(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    
    setLoading(true);
    try {
      let anonymizedData = result.anonymized_data;
      
      // If it's an array (from Excel), convert it to a string
      if (Array.isArray(anonymizedData)) {
        anonymizedData = JSON.stringify(anonymizedData);
      }
      
      if (aiMode) {
        // Use enhanced download with metadata
        const metadata = {
          model: selectedModel,
          privacy_level: selectedPrivacyLevel,
          timestamp: new Date().toISOString(),
          entities_processed: selectedEntities
        };
        
        await aiAnonymizerService.downloadAnonymizedFile(
          anonymizedData, 
          result.file_format,
          metadata
        );
      } else {
        // Use legacy download
        await downloadAnonymizedFile(anonymizedData, result.file_format);
      }
    } catch (err) {
      setError(t('errorDownloadingFile'));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    aiAnonymizerService.clearHistory();
    setProcessingHistory([]);
  };

  const handleRetryProcess = (processData) => {
    // Reset and retry with the same configuration
    if (processData.config) {
      setSelectedModel(processData.config.model);
      setSelectedPrivacyLevel(processData.config.privacy_level);
      setSelectedEntities(processData.config.entity_types);
    }
    setActiveTab('upload');
  };

  const renderFileContent = (data) => {
    if (!data) return null;
    
    if (Array.isArray(data)) {
      // Render table for Excel data
      return (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="bg-light">
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Render pre-formatted text for text data
      return (
        <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
          {data}
        </pre>
      );
    }
  };

  const renderProcessingStages = () => {
    return (
      <div className="mb-4">
        <ProgressBar animated={loading} now={processingStage * 25} className="mb-3" />
        <div className="d-flex justify-content-between">
          <div className="text-center">
            <div className={`rounded-circle p-2 d-inline-block ${processingStage >= 1 ? 'bg-primary' : 'bg-light'}`}>
              <FaUpload color={processingStage >= 1 ? 'white' : 'gray'} />
            </div>
            <p className="small mt-1">Upload</p>
          </div>
          <div className="text-center">
            <div className={`rounded-circle p-2 d-inline-block ${processingStage >= 2 ? 'bg-primary' : 'bg-light'}`}>
              <FaEye color={processingStage >= 2 ? 'white' : 'gray'} />
            </div>
            <p className="small mt-1">Analyze</p>
          </div>
          <div className="text-center">
            <div className={`rounded-circle p-2 d-inline-block ${processingStage >= 3 ? 'bg-primary' : 'bg-light'}`}>
              <FaShieldAlt color={processingStage >= 3 ? 'white' : 'gray'} />
            </div>
            <p className="small mt-1">Anonymize</p>
          </div>
          <div className="text-center">
            <div className={`rounded-circle p-2 d-inline-block ${processingStage >= 4 ? 'bg-success' : 'bg-light'}`}>
              <FaDownload color={processingStage >= 4 ? 'white' : 'gray'} />
            </div>
            <p className="small mt-1">Complete</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-gradient-primary text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaShieldAlt size={24} className="me-2" />
                  <div>
                    <Card.Title as="h4">
                      {aiMode ? 'AI-Powered Anonymizer' : 'Basic Anonymizer'}
                    </Card.Title>
                    <p className="card-category mb-0">
                      {aiMode ? 'Advanced intelligent anonymization with customizable AI models' : t('anonymizerDescription')}
                    </p>
                  </div>
                </div>
                
                {/* Mode Toggle */}
                <ButtonGroup>
                  <Button
                    variant={aiMode ? "light" : "outline-light"}
                    onClick={() => setAiMode(true)}
                    className="d-flex align-items-center"
                  >
                    <FaRobot className="me-1" />
                    AI Mode
                  </Button>
                  <Button
                    variant={!aiMode ? "light" : "outline-light"}
                    onClick={() => setAiMode(false)}
                    className="d-flex align-items-center"
                  >
                    <FaShieldAlt className="me-1" />
                    Basic Mode
                  </Button>
                </ButtonGroup>
              </div>
            </Card.Header>
            
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                {/* Upload Tab */}
                <Tab eventKey="upload" title={
                  <div className="d-flex align-items-center">
                    <FaUpload className="me-2" />
                    {batchMode ? 'Batch Upload' : 'Upload File'}
                  </div>
                }>
                  {/* AI Configuration Section */}
                  {aiMode && (
                    <>
                      {/* Processing Mode Toggle */}
                      <Row className="mb-4">
                        <Col>
                          <Card className="border-info">
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">Processing Mode</h6>
                                  <small className="text-muted">
                                    {batchMode ? 'Process multiple files simultaneously' : 'Process single file'}
                                  </small>
                                </div>
                                <ButtonGroup>
                                  <Button
                                    variant={!batchMode ? "primary" : "outline-primary"}
                                    size="sm"
                                    onClick={() => setBatchMode(false)}
                                  >
                                    Single File
                                  </Button>
                                  <Button
                                    variant={batchMode ? "primary" : "outline-primary"}
                                    size="sm"
                                    onClick={() => setBatchMode(true)}
                                  >
                                    Batch Mode
                                  </Button>
                                </ButtonGroup>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* AI Model Selection */}
                      <AIModelSelector
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        fileSize={file?.size || 0}
                        disabled={loading}
                      />

                      {/* Privacy Level Selection */}
                      <PrivacyLevelSelector
                        selectedLevel={selectedPrivacyLevel}
                        onLevelChange={setSelectedPrivacyLevel}
                        selectedEntities={selectedEntities}
                        onEntitiesChange={setSelectedEntities}
                        disabled={loading}
                      />

                      {/* Advanced Options */}
                      <Row className="mb-4">
                        <Col>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                          >
                            <FaCog className="me-1" />
                            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                          </Button>
                        </Col>
                      </Row>

                      {showAdvancedOptions && (
                        <Card className="mb-4 border-warning">
                          <Card.Header className="bg-warning text-dark">
                            <FaCog className="me-2" />
                            Advanced Configuration
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Output Format</Form.Label>
                                  <Form.Select>
                                    <option value="original">Same as Input</option>
                                    <option value="pdf">Secure PDF</option>
                                    <option value="text">Plain Text</option>
                                    <option value="structured">Structured JSON</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    type="checkbox"
                                    label="Enable Quality Validation"
                                    defaultChecked
                                  />
                                  <Form.Check
                                    type="checkbox"
                                    label="Maintain Consistent Replacements"
                                    defaultChecked
                                  />
                                  <Form.Check
                                    type="checkbox"
                                    label="Preserve Document Context"
                                    defaultChecked
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      )}
                    </>
                  )}

                  {/* File Upload Section */}
                  <Row>
                    <Col md={batchMode ? 12 : 7}>
                      <Form>
                        <div className="text-center mb-4">
                          <div className="mb-3 d-flex justify-content-center">
                            <div 
                              className="file-icon-container p-4 rounded-circle bg-light" 
                              style={{ 
                                width: '100px', 
                                height: '100px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}
                            >
                              {getFileIcon()}
                            </div>
                          </div>
                          
                          {(file || selectedFiles.length > 0) && (
                            <div className="mb-2">
                              {batchMode ? (
                                <Badge bg="info" className="p-2">
                                  {selectedFiles.length} files selected
                                </Badge>
                              ) : (
                                <Badge bg="info" className="p-2">
                                  {file.name} ({Math.round(file.size / 1024)} KB)
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <div className="d-flex align-items-center">
                              <FaFileAlt className="me-2" />
                              {batchMode ? 'Select Files (Multiple)' : t('selectFile')}
                            </div>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            onChange={batchMode ? handleMultipleFileChange : handleFileChange}
                            accept=".txt,.docx,.xlsx,.xls,.pdf"
                            className="form-control-lg"
                            multiple={batchMode}
                          />
                          <Form.Text className="text-muted">
                            {aiMode ? 
                              'Supported: TXT, PDF, DOCX, XLSX (up to 50MB each)' : 
                              t('supportedFormats')
                            }
                          </Form.Text>
                        </Form.Group>

                        {/* Processing Estimate */}
                        {processingEstimate && aiMode && (
                          <Alert variant="success" className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <FaChartLine className="me-2" />
                                <strong>Processing Estimate</strong>
                              </div>
                              <Badge bg="primary">
                                {processingEstimate.processing.expectedAccuracy}% accuracy
                              </Badge>
                            </div>
                            <Row className="mt-2">
                              <Col xs={4}>
                                <small>
                                  <FaClock className="me-1" />
                                  Time: {processingEstimate.processing.estimatedTimeFormatted}
                                </small>
                              </Col>
                              <Col xs={4}>
                                <small>
                                  <FaDollarSign className="me-1" />
                                  Cost: ${processingEstimate.processing.estimatedCost}
                                </small>
                              </Col>
                              <Col xs={4}>
                                <small>
                                  <FaRobot className="me-1" />
                                  Model: {processingEstimate.processing.model.name}
                                </small>
                              </Col>
                            </Row>
                          </Alert>
                        )}
                        
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleAnonymize}
                          disabled={loading || (!file && !batchMode) || (batchMode && selectedFiles.length === 0)}
                          className="w-100 mt-3"
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              {aiMode ? 'AI Processing...' : t('anonymizing')}
                            </>
                          ) : (
                            <>
                              {aiMode ? <FaMagic className="me-2" /> : <FaShieldAlt className="me-2" />}
                              {aiMode ? 
                                (batchMode ? 'Start AI Batch Processing' : 'Start AI Anonymization') :
                                t('anonymizeFile')
                              }
                            </>
                          )}
                        </Button>
                      </Form>
                      
                      {error && (
                        <Alert variant="danger" className="mt-3">
                          {error}
                        </Alert>
                      )}
                    </Col>
                    
                    {!batchMode && (
                      <Col md={5} className="d-flex align-items-center justify-content-center">
                        <div className="text-center p-4">
                          <div className="mb-4">
                            <FaLock size={80} className="text-primary mb-3" />
                            <h4>{aiMode ? 'AI-Powered Privacy Protection' : 'Data Privacy Protection'}</h4>
                            <p className="text-muted">
                              {aiMode ? 
                                'Advanced AI models intelligently detect and anonymize sensitive information with industry-leading accuracy.' :
                                'Our anonymization tool removes sensitive information such as:'
                              }
                            </p>
                            {aiMode ? (
                              <div className="text-start">
                                <h6>AI Features:</h6>
                                <ul className="list-unstyled">
                                  <li><Badge bg="primary" className="m-1 p-2">Context Awareness</Badge></li>
                                  <li><Badge bg="success" className="m-1 p-2">Medical Terminology</Badge></li>
                                  <li><Badge bg="info" className="m-1 p-2">Smart Entity Recognition</Badge></li>
                                  <li><Badge bg="warning" className="m-1 p-2">Quality Validation</Badge></li>
                                  <li><Badge bg="secondary" className="m-1 p-2">Batch Processing</Badge></li>
                                </ul>
                              </div>
                            ) : (
                              <ul className="list-unstyled">
                                <li><Badge bg="secondary" className="m-1 p-2">Patient Names</Badge></li>
                                <li><Badge bg="secondary" className="m-1 p-2">Doctor Names</Badge></li>
                                <li><Badge bg="secondary" className="m-1 p-2">Dates of Birth</Badge></li>
                                <li><Badge bg="secondary" className="m-1 p-2">Contact Information</Badge></li>
                                <li><Badge bg="secondary" className="m-1 p-2">Medical IDs</Badge></li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                  
                  {loading && renderProcessingStages()}
                </Tab>
                
                {/* Results Tab */}
                <Tab eventKey="result" title={
                  <div className="d-flex align-items-center">
                    <FaExchangeAlt className="me-2" />
                    {t('results')}
                  </div>
                } disabled={!result}>
                  {result && (
                    <Row>
                      <Col md={12} className="mb-4">
                        <div className="d-flex justify-content-center align-items-center flex-column mb-4">
                          <div className="bg-success text-white p-3 rounded-circle mb-3">
                            {aiMode ? <FaMagic size={40} /> : <FaShieldAlt size={40} />}
                          </div>
                          <div className="text-center">
                            <h3 className="mb-2">
                              {aiMode ? 'AI Anonymization Complete' : 'Anonymization Complete'}
                            </h3>
                            <p className="text-muted mb-4">
                              {aiMode ? 
                                'Your data has been intelligently anonymized using advanced AI and is ready for download' :
                                'Your data has been successfully anonymized and is ready for download'
                              }
                            </p>
                            
                            {/* Enhanced Results Display for AI Mode */}
                            {aiMode && result.entities_found && (
                              <Row className="mb-4">
                                <Col md={3}>
                                  <Card className="text-center border-info">
                                    <Card.Body className="p-3">
                                      <h4 className="text-info mb-1">{result.entities_found}</h4>
                                      <small className="text-muted">Entities Found</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3}>
                                  <Card className="text-center border-success">
                                    <Card.Body className="p-3">
                                      <h4 className="text-success mb-1">{result.entities_anonymized}</h4>
                                      <small className="text-muted">Anonymized</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3}>
                                  <Card className="text-center border-warning">
                                    <Card.Body className="p-3">
                                      <h4 className="text-warning mb-1">{result.confidence_score || 'N/A'}%</h4>
                                      <small className="text-muted">Confidence</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3}>
                                  <Card className="text-center border-primary">
                                    <Card.Body className="p-3">
                                      <h4 className="text-primary mb-1">{selectedModel.toUpperCase()}</h4>
                                      <small className="text-muted">AI Model</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                            )}
                            
                            <Button
                              variant="success"
                              onClick={handleDownload}
                              disabled={loading}
                              size="lg"
                              className="px-5"
                            >
                              {loading ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                  {t('downloading')}
                                </>
                              ) : (
                                <>
                                  <FaDownload className="me-2" />
                                  {aiMode ? 'Download AI-Processed File' : t('downloadAnonymizedFile')}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-center mt-4">
                          <Alert variant={aiMode ? "success" : "info"}>
                            <FaLock className="me-2" />
                            {aiMode ? 
                              `AI has identified and anonymized ${result.entities_anonymized || 'multiple'} sensitive data points with ${result.confidence_score || 'high'}% confidence.` :
                              'All personally identifiable information has been removed from your document.'
                            }
                          </Alert>
                          
                          <div className="mt-4">
                            <h5>What was anonymized:</h5>
                            <div className="d-flex flex-wrap justify-content-center mt-3">
                              {aiMode && selectedEntities ? (
                                selectedEntities.map(entityId => (
                                  <Badge key={entityId} bg="primary" className="m-1 p-2">
                                    {entityId.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                ))
                              ) : (
                                <>
                                  <Badge bg="secondary" className="m-1 p-2">Patient Names</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Doctor Names</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Dates of Birth</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Contact Information</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Medical IDs</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Hospital Information</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">NHS Numbers</Badge>
                                  <Badge bg="secondary" className="m-1 p-2">Electronic Signatures</Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Tab>

                {/* Processing Monitor Tab (AI Mode Only) */}
                {aiMode && (
                  <Tab eventKey="monitor" title={
                    <div className="d-flex align-items-center">
                      <FaHistory className="me-2" />
                      Processing Monitor
                      {activeProcesses.length > 0 && (
                        <Badge bg="warning" className="ms-2">
                          {activeProcesses.length}
                        </Badge>
                      )}
                    </div>
                  }>
                    <ProcessingMonitor
                      activeProcesses={activeProcesses}
                      processingHistory={processingHistory}
                      onClearHistory={handleClearHistory}
                      onRetryProcess={handleRetryProcess}
                    />
                  </Tab>
                )}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HospitalDashboardTwo;
