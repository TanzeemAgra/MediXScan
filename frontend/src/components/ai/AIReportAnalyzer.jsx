import React, { useState, useCallback, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { FaUpload, FaMicrophone, FaStop, FaPlay, FaFileAlt, FaImage, FaBrain } from 'react-icons/fa';
import Config from '../../config';

const AIReportAnalyzer = () => {
  const [reportText, setReportText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('comprehensive');

  // Voice Recognition Setup
  useEffect(() => {
    if (Config.VOICE_INPUT_ENABLED && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setReportText(prev => prev + transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceRecording(false);
      };
      
      setMediaRecorder(recognition);
    }
  }, []);

  const handleVoiceToggle = useCallback(() => {
    if (!Config.VOICE_INPUT_ENABLED || !mediaRecorder) return;
    
    if (voiceRecording) {
      mediaRecorder.stop();
      setVoiceRecording(false);
    } else {
      mediaRecorder.start();
      setVoiceRecording(true);
    }
  }, [voiceRecording, mediaRecorder]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!Config.SUPPORTED_FORMATS.includes(fileExtension)) {
      setError(`Unsupported file format. Supported formats: ${Config.SUPPORTED_FORMATS.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > Config.MAX_FILE_SIZE) {
      setError(`File size exceeds maximum limit of ${Config.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setUploadedFile(file);
    setError(null);

    // Auto-extract text from supported formats
    if (['txt'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => setReportText(e.target.result);
      reader.readAsText(file);
    }
  }, []);

  const analyzeReport = useCallback(async () => {
    if (!reportText.trim() && !uploadedFile) {
      setError('Please provide either text or upload a file for analysis');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Prepare analysis data
      const analysisData = {
        text: reportText,
        file: uploadedFile,
        mode: analysisMode,
        options: {
          confidenceThreshold: Config.AI_CONFIDENCE_THRESHOLD,
          errorTypes: Config.ERROR_DETECTION_TYPES,
          autoCorrection: Config.AUTO_CORRECTION_ENABLED,
          severityLevels: Config.SEVERITY_LEVELS
        }
      };

      // Call AI analysis API (implement actual API call)
      const result = await simulateAIAnalysis(analysisData);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      
      // Auto-save if enabled
      if (Config.AUTO_SAVE_REPORTS) {
        await saveAnalysisResult(result);
      }
      
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [reportText, uploadedFile, analysisMode]);

  // Simulate AI analysis (replace with actual API call)
  const simulateAIAnalysis = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      originalText: data.text,
      correctedText: data.text + '\n\n[AI-Enhanced Version with corrections]',
      confidence: 0.92,
      errors: [
        {
          type: 'medical',
          original: 'pneaumonia',
          corrected: 'pneumonia',
          position: { start: 45, end: 55 },
          severity: 'high',
          explanation: 'Medical terminology correction'
        },
        {
          type: 'typographical',
          original: 'teh',
          corrected: 'the',
          position: { start: 12, end: 15 },
          severity: 'low',
          explanation: 'Common typing error'
        }
      ],
      suggestions: [
        'Consider adding patient age and gender for context',
        'Include differential diagnosis considerations',
        'Specify imaging modality parameters'
      ],
      metrics: {
        readabilityScore: 8.5,
        completenessScore: 7.8,
        accuracyScore: 9.2,
        professionalismScore: 8.9
      },
      processingTime: 1.8
    };
  };

  const saveAnalysisResult = async (result) => {
    // Implement save functionality
    console.log('Auto-saving analysis result:', result);
  };

  const renderAnalysisMode = () => (
    <Form.Group className="mb-3">
      <Form.Label>Analysis Mode</Form.Label>
      <div className="d-flex gap-2">
        {[
          { value: 'quick', label: 'Quick Scan', icon: '⚡' },
          { value: 'comprehensive', label: 'Comprehensive', icon: '🔬' },
          { value: 'medical_focus', label: 'Medical Focus', icon: '🏥' },
          { value: 'research', label: 'Research Grade', icon: '📊' }
        ].map(mode => (
          <Button
            key={mode.value}
            variant={analysisMode === mode.value ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setAnalysisMode(mode.value)}
          >
            {mode.icon} {mode.label}
          </Button>
        ))}
      </div>
    </Form.Group>
  );

  const renderErrorAnalysis = () => {
    if (!analysisResult?.errors?.length) return null;

    return (
      <Card className="mt-3">
        <Card.Header>
          <h5><FaBrain className="me-2" />Error Analysis</h5>
        </Card.Header>
        <Card.Body>
          {analysisResult.errors.map((error, index) => (
            <div key={index} className="border-bottom pb-2 mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Badge bg={error.severity === 'high' ? 'danger' : error.severity === 'medium' ? 'warning' : 'info'}>
                    {error.type}
                  </Badge>
                  <div className="mt-1">
                    <code className="text-danger">{error.original}</code>
                    <span className="mx-2">→</span>
                    <code className="text-success">{error.corrected}</code>
                  </div>
                  <small className="text-muted">{error.explanation}</small>
                </div>
                <Badge bg="light" text="dark">
                  {error.severity}
                </Badge>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  const renderMetrics = () => {
    if (!analysisResult?.metrics) return null;

    return (
      <Card className="mt-3">
        <Card.Header>
          <h5>📊 Quality Metrics</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {Object.entries(analysisResult.metrics).map(([key, value]) => (
              <Col md={6} key={key} className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <strong>{value}/10</strong>
                </div>
                <ProgressBar now={value * 10} variant={value >= 8 ? 'success' : value >= 6 ? 'warning' : 'danger'} />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="ai-report-analyzer">
      <Card>
        <Card.Header>
          <h4><FaBrain className="me-2" />AI-Powered Report Analyzer</h4>
          <small className="text-muted">
            Powered by advanced AI for radiology report enhancement
          </small>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {renderAnalysisMode()}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Report Text</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Enter or paste radiology report text here..."
                    disabled={loading}
                  />
                  {Config.VOICE_INPUT_ENABLED && (
                    <Button
                      variant={voiceRecording ? 'danger' : 'outline-secondary'}
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={handleVoiceToggle}
                      disabled={loading}
                    >
                      {voiceRecording ? <FaStop /> : <FaMicrophone />}
                    </Button>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Upload File</Form.Label>
                <Form.Control
                  type="file"
                  accept={Config.SUPPORTED_FORMATS.map(f => `.${f}`).join(',')}
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Supported: {Config.SUPPORTED_FORMATS.join(', ')}
                  <br />Max size: {Math.round(Config.MAX_FILE_SIZE / (1024 * 1024))}MB
                </Form.Text>
              </Form.Group>
              
              {uploadedFile && (
                <Alert variant="info" className="p-2">
                  <FaFileAlt className="me-2" />
                  {uploadedFile.name}
                  <br />
                  <small>{(uploadedFile.size / 1024).toFixed(1)} KB</small>
                </Alert>
              )}
            </Col>
          </Row>

          {loading && (
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Analyzing report...</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar now={progress} animated />
            </div>
          )}

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={analyzeReport}
              disabled={loading || (!reportText.trim() && !uploadedFile)}
            >
              {loading ? 'Analyzing...' : 'Analyze Report'}
            </Button>
            
            <Button
              variant="outline-secondary"
              onClick={() => {
                setReportText('');
                setUploadedFile(null);
                setAnalysisResult(null);
                setError(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </Card.Body>
      </Card>

      {analysisResult && (
        <>
          {renderErrorAnalysis()}
          {renderMetrics()}
          
          <Card className="mt-3">
            <Card.Header>
              <h5>✨ AI-Enhanced Report</h5>
            </Card.Header>
            <Card.Body>
              <Form.Control
                as="textarea"
                rows={10}
                value={analysisResult.correctedText}
                readOnly
                className="bg-light"
              />
              <div className="mt-2 d-flex justify-content-between">
                <small className="text-muted">
                  Confidence: {(analysisResult.confidence * 100).toFixed(1)}% | 
                  Processing: {analysisResult.processingTime}s
                </small>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    📋 Copy
                  </Button>
                  <Button variant="outline-success" size="sm">
                    💾 Save
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default AIReportAnalyzer;
