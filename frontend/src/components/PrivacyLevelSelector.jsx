// Privacy Level Selector Component with Soft-Coded Configuration
import React, { useState, useEffect } from 'react';
import { Card, Form, Badge, Row, Col, ProgressBar, Alert, Button } from 'react-bootstrap';
import { AnonymizerHelpers } from '../config/anonymizerConfig';
import { 
  FaShieldAlt, 
  FaLock, 
  FaEye, 
  FaUserShield, 
  FaBalanceScale, 
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const PrivacyLevelSelector = ({ 
  selectedLevel, 
  onLevelChange, 
  selectedEntities = [], 
  onEntitiesChange,
  disabled = false 
}) => {
  const [privacyLevels, setPrivacyLevels] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [showEntityCustomization, setShowEntityCustomization] = useState(false);

  useEffect(() => {
    // Load privacy levels and entity types using soft-coded configuration
    setPrivacyLevels(AnonymizerHelpers.getAllPrivacyLevels());
    setEntityTypes(AnonymizerHelpers.getAllEntityTypes());
  }, []);

  const getPrivacyIcon = (strength) => {
    if (strength >= 90) return <FaLock className="text-danger" />;
    if (strength >= 80) return <FaUserShield className="text-warning" />;
    if (strength >= 70) return <FaShieldAlt className="text-info" />;
    return <FaEye className="text-secondary" />;
  };

  const getPrivacyColor = (strength) => {
    if (strength >= 90) return 'danger';
    if (strength >= 80) return 'warning';
    if (strength >= 70) return 'info';
    return 'secondary';
  };

  const renderPrivacyCard = (level) => {
    const isSelected = selectedLevel === level.id;

    return (
      <Card 
        key={level.id}
        className={`h-100 privacy-card ${isSelected ? 'border-primary bg-light' : ''} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        onClick={() => !disabled && onLevelChange(level.id)}
        style={{ 
          transition: 'all 0.3s ease',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <Card.Header className={`d-flex justify-content-between align-items-center ${isSelected ? 'bg-primary text-white' : ''}`}>
          <div className="d-flex align-items-center">
            {getPrivacyIcon(level.strength)}
            <strong className="ms-2">{level.name}</strong>
          </div>
          {isSelected && (
            <FaCheckCircle className="text-success" />
          )}
        </Card.Header>
        
        <Card.Body className="p-3">
          <p className="text-muted small mb-3">{level.description}</p>
          
          {/* Privacy Strength Bar */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small font-weight-bold">Privacy Strength</span>
              <span className="small">{level.strength}%</span>
            </div>
            <ProgressBar 
              variant={getPrivacyColor(level.strength)}
              now={level.strength} 
              className="mb-2"
              style={{ height: '8px' }}
            />
          </div>

          {/* Key Features */}
          <div className="mb-3">
            <div className="small font-weight-bold mb-2">Protection Features:</div>
            <Row className="text-center">
              <Col xs={4}>
                <div className="feature-item">
                  <FaBalanceScale className={`${level.preserve_structure ? 'text-success' : 'text-muted'} mb-1`} />
                  <div className="tiny">Structure</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="feature-item">
                  <FaEye className={`${level.preserve_context ? 'text-success' : 'text-muted'} mb-1`} />
                  <div className="tiny">Context</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="feature-item">
                  <FaShieldAlt className="text-primary mb-1" />
                  <div className="tiny">{level.replacement_strategy.replace('_', ' ')}</div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Entity Types Covered */}
          <div className="mb-3">
            <div className="small font-weight-bold mb-2">Protected Data:</div>
            {level.entities.slice(0, 3).map((entity, idx) => (
              <Badge key={idx} bg="secondary" className="me-1 mb-1 tiny">
                {entity.replace('_', ' ')}
              </Badge>
            ))}
            {level.entities.length > 3 && (
              <Badge bg="light" text="dark" className="tiny">
                +{level.entities.length - 3} more
              </Badge>
            )}
          </div>
        </Card.Body>

        {/* Selection Radio */}
        <Card.Footer className="bg-transparent border-0 p-2">
          <Form.Check
            type="radio"
            name="privacyLevel"
            value={level.id}
            checked={isSelected}
            onChange={() => !disabled && onLevelChange(level.id)}
            disabled={disabled}
            label={`Select ${level.name}`}
            className="small"
          />
        </Card.Footer>
      </Card>
    );
  };

  const renderEntityCustomization = () => {
    if (!showEntityCustomization) return null;

    return (
      <Card className="mt-3">
        <Card.Header>
          <h6 className="mb-0">
            <FaInfoCircle className="me-2" />
            Customize Protected Data Types
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            {entityTypes.map(entity => (
              <Col md={6} lg={4} key={entity.id} className="mb-3">
                <div className="d-flex align-items-start">
                  <Form.Check
                    type="checkbox"
                    id={`entity-${entity.id}`}
                    checked={selectedEntities.includes(entity.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onEntitiesChange([...selectedEntities, entity.id]);
                      } else {
                        onEntitiesChange(selectedEntities.filter(id => id !== entity.id));
                      }
                    }}
                    disabled={disabled}
                    className="me-2 mt-1"
                  />
                  <div>
                    <label htmlFor={`entity-${entity.id}`} className="form-label mb-1 cursor-pointer">
                      <i className={`${entity.icon} me-2`}></i>
                      <strong>{entity.name}</strong>
                    </label>
                    <p className="small text-muted mb-1">{entity.description}</p>
                    <div className="d-flex align-items-center">
                      <Badge 
                        bg={entity.priority === 'critical' ? 'danger' : 
                            entity.priority === 'high' ? 'warning' : 
                            entity.priority === 'medium' ? 'info' : 'secondary'}
                        className="tiny me-2"
                      >
                        {entity.priority}
                      </Badge>
                      <span className="tiny text-muted">
                        {entity.detection_methods.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const getRecommendationAlert = () => {
    const selectedPrivacyLevel = privacyLevels.find(level => level.id === selectedLevel);
    if (!selectedPrivacyLevel) return null;

    let variant = 'info';
    let icon = <FaInfoCircle />;
    let message = '';

    if (selectedPrivacyLevel.strength >= 90) {
      variant = 'warning';
      icon = <FaExclamationTriangle />;
      message = 'High security mode may significantly alter document structure and readability.';
    } else if (selectedPrivacyLevel.strength >= 80) {
      variant = 'success';
      icon = <FaCheckCircle />;
      message = 'This level provides good balance between privacy and document usability.';
    } else {
      variant = 'info';
      icon = <FaInfoCircle />;
      message = 'Basic privacy level maintains document readability while protecting obvious identifiers.';
    }

    return (
      <Alert variant={variant} className="mt-3">
        {icon}
        <span className="ms-2">{message}</span>
      </Alert>
    );
  };

  return (
    <div className="privacy-level-selector">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <FaShieldAlt className="me-2 text-primary" />
          Privacy Protection Level
        </h5>
        
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => setShowEntityCustomization(!showEntityCustomization)}
          disabled={disabled}
        >
          <FaInfoCircle className="me-1" />
          {showEntityCustomization ? 'Hide' : 'Customize'} Data Types
        </Button>
      </div>

      {/* Privacy Level Grid */}
      <Row>
        {privacyLevels.map(level => (
          <Col lg={6} xl={3} key={level.id} className="mb-3">
            {renderPrivacyCard(level)}
          </Col>
        ))}
      </Row>

      {/* Recommendation Alert */}
      {getRecommendationAlert()}

      {/* Entity Customization */}
      {renderEntityCustomization()}

      {/* Help Information */}
      <Alert variant="light" className="mt-3">
        <h6><FaInfoCircle className="me-2" />Privacy Level Guide:</h6>
        <Row>
          <Col md={6}>
            <ul className="small mb-0">
              <li><strong>Basic Privacy (60%):</strong> Removes obvious identifiers, preserves readability</li>
              <li><strong>Standard HIPAA (85%):</strong> Healthcare compliance, balanced protection</li>
            </ul>
          </Col>
          <Col md={6}>
            <ul className="small mb-0">
              <li><strong>High Security (95%):</strong> Maximum protection, may alter structure</li>
              <li><strong>Research Grade (80%):</strong> Suitable for academic and research use</li>
            </ul>
          </Col>
        </Row>
      </Alert>

      <style jsx>{`
        .privacy-card {
          transition: all 0.3s ease;
        }
        .privacy-card:hover:not(.opacity-50) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .feature-item {
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

export default PrivacyLevelSelector;
