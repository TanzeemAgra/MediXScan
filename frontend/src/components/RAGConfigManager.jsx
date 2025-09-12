import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Alert, Spinner, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { getRAGConfig, updateRAGConfig, validateRAGConfig, getConfigTemplates } from '../../services/api';

const RAGConfigManager = () => {
    const [config, setConfig] = useState(null);
    const [templates, setTemplates] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
    const [editModal, setEditModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [validationResult, setValidationResult] = useState(null);

    const showAlert = (message, type = 'info') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000);
    };

    const loadConfig = async () => {
        setIsLoading(true);
        try {
            const data = await getRAGConfig();
            setConfig(data.config);
            showAlert('Configuration loaded successfully!', 'success');
        } catch (error) {
            showAlert('Failed to load configuration: ' + error.message, 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTemplates = async () => {
        try {
            const data = await getConfigTemplates();
            setTemplates(data.templates);
        } catch (error) {
            showAlert('Failed to load templates: ' + error.message, 'warning');
        }
    };

    const openEditModal = (section, currentValues) => {
        setCurrentSection(section);
        setEditValues({ ...currentValues });
        setEditModal(true);
        setValidationResult(null);
    };

    const handleInputChange = (key, value) => {
        setEditValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const validateConfig = async () => {
        try {
            const configToValidate = {
                [currentSection]: editValues
            };
            const validation = await validateRAGConfig(configToValidate);
            setValidationResult(validation.validation);
        } catch (error) {
            showAlert('Validation failed: ' + error.message, 'danger');
        }
    };

    const saveConfig = async () => {
        setIsSaving(true);
        try {
            const updates = {
                [currentSection]: editValues
            };
            const result = await updateRAGConfig(updates);
            setConfig(result.updated_config);
            setEditModal(false);
            showAlert('Configuration updated successfully!', 'success');
        } catch (error) {
            showAlert('Failed to update configuration: ' + error.message, 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        loadConfig();
        loadTemplates();
    }, []);

    const renderConfigValue = (value) => {
        if (typeof value === 'boolean') {
            return <Badge color={value ? 'success' : 'secondary'}>{value ? 'Enabled' : 'Disabled'}</Badge>;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    const renderEditField = (key, value, type = 'text') => {
        if (type === 'boolean') {
            return (
                <FormGroup switch>
                    <Input
                        type="switch"
                        checked={editValues[key] || false}
                        onChange={(e) => handleInputChange(key, e.target.checked)}
                    />
                    <Label check>{key.replace(/_/g, ' ').toUpperCase()}</Label>
                </FormGroup>
            );
        }

        if (type === 'number') {
            return (
                <FormGroup>
                    <Label>{key.replace(/_/g, ' ').toUpperCase()}</Label>
                    <Input
                        type="number"
                        value={editValues[key] || ''}
                        onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                        step={key.includes('temperature') || key.includes('threshold') ? '0.1' : '1'}
                    />
                </FormGroup>
            );
        }

        return (
            <FormGroup>
                <Label>{key.replace(/_/g, ' ').toUpperCase()}</Label>
                <Input
                    type="text"
                    value={editValues[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                />
            </FormGroup>
        );
    };

    return (
        <div className="rag-config-manager">
            {alert.show && (
                <Alert color={alert.type} className="mb-4">
                    {alert.message}
                </Alert>
            )}

            <Row>
                <Col lg={6} md={12} className="mb-4">
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title">
                                    <i className="fas fa-cog me-2"></i>
                                    RAG Configuration
                                </h5>
                                <Button 
                                    color="primary" 
                                    size="sm"
                                    onClick={loadConfig}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Spinner size="sm" /> : <i className="fas fa-sync" />}
                                </Button>
                            </div>

                            {config && (
                                <div>
                                    {/* Sources Configuration */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="text-primary">Content Sources</h6>
                                            <Button 
                                                color="outline-primary" 
                                                size="sm"
                                                onClick={() => openEditModal('sources', config.sources)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </div>
                                        <div className="small">
                                            <div><strong>RadiologyAssistant:</strong> {renderConfigValue(config.sources.radiologyassistant.enabled)}</div>
                                            <div><strong>Max Pages:</strong> {config.sources.radiologyassistant.max_pages}</div>
                                            <div><strong>Request Delay:</strong> {config.sources.radiologyassistant.delay_between_requests}s</div>
                                        </div>
                                    </div>

                                    {/* Medical Terms Configuration */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="text-success">Medical Terms</h6>
                                            <Button 
                                                color="outline-success" 
                                                size="sm"
                                                onClick={() => openEditModal('medical_terms', config.medical_terms)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </div>
                                        <div className="small">
                                            <div><strong>Word Length:</strong> {config.medical_terms.min_word_length} - {config.medical_terms.max_word_length}</div>
                                            <div><strong>Pattern Types:</strong> {Object.keys(config.medical_terms.pattern_counts).length}</div>
                                        </div>
                                    </div>

                                    {/* Cache Configuration */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="text-info">Cache Settings</h6>
                                            <Button 
                                                color="outline-info" 
                                                size="sm"
                                                onClick={() => openEditModal('cache', config.cache)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </div>
                                        <div className="small">
                                            <div><strong>Vocab Timeout:</strong> {config.cache.vocabulary_timeout}s</div>
                                            <div><strong>Content Timeout:</strong> {config.cache.content_timeout}s</div>
                                        </div>
                                    </div>

                                    {/* Analysis Configuration */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="text-warning">Analysis Settings</h6>
                                            <Button 
                                                color="outline-warning" 
                                                size="sm"
                                                onClick={() => openEditModal('analysis', config.analysis)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </div>
                                        <div className="small">
                                            <div><strong>Model:</strong> {config.analysis.openai_model}</div>
                                            <div><strong>Temperature:</strong> {config.analysis.temperature}</div>
                                            <div><strong>Max Tokens:</strong> {config.analysis.max_tokens}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={6} md={12} className="mb-4">
                    <Card>
                        <CardBody>
                            <h5 className="card-title">
                                <i className="fas fa-template me-2"></i>
                                Configuration Templates
                            </h5>
                            {templates && (
                                <div>
                                    {Object.entries(templates).map(([section, template]) => (
                                        <div key={section} className="mb-3">
                                            <h6 className="text-muted">{section.replace(/_/g, ' ').toUpperCase()}</h6>
                                            <div className="small text-muted">
                                                {template.description}
                                            </div>
                                            {template.pattern_examples && (
                                                <div className="mt-2">
                                                    <strong>Examples:</strong>
                                                    {Object.entries(template.pattern_examples).map(([type, examples]) => (
                                                        <div key={type} className="small">
                                                            <em>{type}:</em> {examples}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Edit Configuration Modal */}
            <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="lg">
                <ModalHeader toggle={() => setEditModal(false)}>
                    Edit {currentSection && currentSection.replace(/_/g, ' ').toUpperCase()} Configuration
                </ModalHeader>
                <ModalBody>
                    {currentSection && (
                        <Form>
                            {Object.entries(editValues).map(([key, value]) => {
                                if (key === 'pattern_counts') return null;
                                
                                let fieldType = 'text';
                                if (typeof value === 'boolean') fieldType = 'boolean';
                                else if (typeof value === 'number') fieldType = 'number';
                                
                                return (
                                    <div key={key}>
                                        {renderEditField(key, value, fieldType)}
                                    </div>
                                );
                            })}
                            
                            <div className="mt-3">
                                <Button 
                                    color="info" 
                                    onClick={validateConfig}
                                    className="me-2"
                                >
                                    <i className="fas fa-check-circle me-1"></i>
                                    Validate
                                </Button>
                            </div>

                            {validationResult && (
                                <div className="mt-3">
                                    <Alert color={validationResult.valid ? 'success' : 'danger'}>
                                        <h6>Validation Result</h6>
                                        {validationResult.valid ? (
                                            <div>✅ Configuration is valid!</div>
                                        ) : (
                                            <div>
                                                <div>❌ Validation failed:</div>
                                                <ul className="mb-0">
                                                    {validationResult.errors.map((error, index) => (
                                                        <li key={index}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {validationResult.warnings.length > 0 && (
                                            <div className="mt-2">
                                                <div>⚠️ Warnings:</div>
                                                <ul className="mb-0">
                                                    {validationResult.warnings.map((warning, index) => (
                                                        <li key={index}>{warning}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </Alert>
                                </div>
                            )}
                        </Form>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setEditModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={saveConfig}
                        disabled={isSaving || (validationResult && !validationResult.valid)}
                    >
                        {isSaving ? (
                            <>
                                <Spinner size="sm" className="me-1" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-1"></i>
                                Save Changes
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default RAGConfigManager;
