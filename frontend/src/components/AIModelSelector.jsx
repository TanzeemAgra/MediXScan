// AI Model Selector Component with Dynamic Configuration
import React, { useState, useEffect } from 'react';
import { Card, Form, Badge, Row, Col, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { AnonymizerHelpers } from '../config/anonymizerConfig';
import { 
  FaRobot, 
  FaBrain, 
  FaShieldAlt, 
  FaClock, 
  FaDollarSign, 
  FaCheckCircle,
  FaInfoCircle,
  FaStar
} from 'react-icons/fa';

const AIModelSelector = ({ selectedModel, onModelChange, fileSize = 0, disabled = false }) => {
  const [models, setModels] = useState([]);
  const [estimates, setEstimates] = useState({});

  useEffect(() => {
    // Load models using soft-coded configuration
    const availableModels = AnonymizerHelpers.getAllModels();
    setModels(availableModels);

    // Calculate estimates for each model
    if (fileSize > 0) {
      const newEstimates = {};
      availableModels.forEach(model => {
        newEstimates[model.id] = AnonymizerHelpers.estimateProcessing(
          fileSize, 
          model.id.toUpperCase(), 
          'standard'
        );
      });
      setEstimates(newEstimates);
    }
  }, [fileSize]);

  const renderModelCard = (model) => {
    const isSelected = selectedModel === model.id;
    const estimate = estimates[model.id];

    return (
      <Card 
        key={model.id}
        className={`h-100 model-card ${isSelected ? 'border-primary bg-light' : ''} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        onClick={() => !disabled && onModelChange(model.id)}
        style={{ 
          transition: 'all 0.3s ease',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <Card.Header className={`d-flex justify-content-between align-items-center ${isSelected ? 'bg-primary text-white' : ''}`}>
          <div className="d-flex align-items-center">
            <FaRobot className="me-2" />
            <strong>{model.name}</strong>
          </div>
          {isSelected && (
            <FaCheckCircle className="text-success" />
          )}
        </Card.Header>
        
        <Card.Body className="p-3">
          <p className="text-muted small mb-3">{model.description}</p>
          
          {/* Model Metrics */}
          <Row className="mb-3">
            <Col xs={4} className="text-center">
              <div className="metric-item">
                <FaCheckCircle className="text-success mb-1" />
                <div className="small font-weight-bold">{model.accuracy}%</div>
                <div className="tiny text-muted">Accuracy</div>
              </div>
            </Col>
            <Col xs={4} className="text-center">
              <div className="metric-item">
                <FaClock className="text-info mb-1" />
                <div className="small font-weight-bold">{model.speed}</div>
                <div className="tiny text-muted">Speed</div>
              </div>
            </Col>
            <Col xs={4} className="text-center">
              <div className="metric-item">
                <FaDollarSign className="text-warning mb-1" />
                <div className="small font-weight-bold">${model.cost_multiplier}</div>
                <div className="tiny text-muted">Cost</div>
              </div>
            </Col>
          </Row>

          {/* Features */}
          <div className="mb-3">
            <div className="small font-weight-bold mb-2">Features:</div>
            {model.features.map((feature, idx) => (
              <Badge key={idx} bg="secondary" className="me-1 mb-1 small">
                {feature}
              </Badge>
            ))}
          </div>

          {/* Estimates for current file */}
          {estimate && (
            <Alert variant="info" className="p-2 small">
              <div className="d-flex justify-content-between">
                <span>Est. Time:</span>
                <strong>{estimate.time}s</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Est. Cost:</span>
                <strong>${estimate.cost}</strong>
              </div>
            </Alert>
          )}

          {/* Suitable For */}
          <div className="mt-auto">
            <div className="small text-muted">
              <strong>Best for:</strong> {model.suitable_for.join(', ')}
            </div>
          </div>
        </Card.Body>

        {/* Selection Radio */}
        <Card.Footer className="bg-transparent border-0 p-2">
          <Form.Check
            type="radio"
            name="aiModel"
            value={model.id}
            checked={isSelected}
            onChange={() => !disabled && onModelChange(model.id)}
            disabled={disabled}
            label={`Select ${model.name}`}
            className="small"
          />
        </Card.Footer>
      </Card>
    );
  };

  const getRecommendedModel = () => {
    if (fileSize < 1024 * 100) { // < 100KB
      return models.find(m => m.id === 'basic_rule_based');
    } else if (fileSize > 1024 * 1024 * 5) { // > 5MB
      return models.find(m => m.id === 'hybrid_ai');
    } else {
      return models.find(m => m.id === 'advanced_nlp');
    }
  };

  const recommendedModel = getRecommendedModel();

  return (
    <div className="ai-model-selector">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <FaBrain className="me-2 text-primary" />
          Select AI Model
        </h5>
        
        {recommendedModel && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                Based on your file size ({fileSize ? Math.round(fileSize / 1024) : 0}KB), 
                we recommend {recommendedModel.name}
              </Tooltip>
            }
          >
            <Badge bg="warning" className="cursor-pointer">
              <FaStar className="me-1" />
              Recommended: {recommendedModel.name}
            </Badge>
          </OverlayTrigger>
        )}
      </div>

      {/* Model Grid */}
      <Row>
        {models.map(model => (
          <Col lg={6} xl={4} key={model.id} className="mb-3">
            {renderModelCard(model)}
          </Col>
        ))}
      </Row>

      {/* Help Text */}
      <Alert variant="light" className="mt-3">
        <FaInfoCircle className="me-2" />
        <strong>Choosing the Right Model:</strong>
        <ul className="mb-0 mt-2">
          <li><strong>Basic Rule-Based:</strong> Fast processing for simple documents</li>
          <li><strong>Advanced NLP:</strong> Best balance of accuracy and speed for most documents</li>
          <li><strong>Medical BERT:</strong> Specialized for clinical and medical documents</li>
          <li><strong>Hybrid AI:</strong> Maximum accuracy for critical or complex documents</li>
          <li><strong>Custom Trained:</strong> Optimized for your specific document types</li>
        </ul>
      </Alert>

      <style jsx>{`
        .model-card {
          transition: all 0.3s ease;
        }
        .model-card:hover:not(.opacity-50) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .metric-item {
          text-align: center;
        }
        .tiny {
          font-size: 0.7rem;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AIModelSelector;
