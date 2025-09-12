import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import registrationPageConfig from "@config/registrationPageConfig.js";

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { page, brand, form, design, navigation, success, validation } = registrationPageConfig;

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const stepFields = form.fields[`step${step}`];
    const stepErrors = {};
    
    stepFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        stepErrors[field.name] = validation.required;
      }
      
      // Additional validation based on field type
      if (formData[field.name]) {
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(formData[field.name])) {
          stepErrors[field.name] = validation.email;
        }
        
        if (field.name === 'password' && formData[field.name].length < 8) {
          stepErrors[field.name] = validation.password;
        }
        
        if (field.name === 'confirmPassword' && formData[field.name] !== formData.password) {
          stepErrors[field.name] = validation.same;
        }
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, form.steps.length));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration Data:', formData);
      setShowSuccess(true);
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = success.redirectUrl;
      }, success.redirectDelay);
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form field
  const renderField = (field) => {
    const value = formData[field.name] || '';
    
    switch (field.type) {
      case 'select':
        return (
          <Form.Select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            isInvalid={!!errors[field.name]}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      
      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            isInvalid={!!errors[field.name]}
          />
        );
      
      case 'checkbox':
        return (
          <Form.Check
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleInputChange(field.name, e.target.checked)}
            label={field.label}
            isInvalid={!!errors[field.name]}
          />
        );
      
      default:
        return (
          <Form.Control
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            isInvalid={!!errors[field.name]}
          />
        );
    }
  };

  if (showSuccess) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: design.theme.backgroundColor }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Card className="border-0 shadow-lg p-4">
                <Card.Body>
                  <div className="mb-4">
                    <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="fw-bold mb-3" style={{ color: design.theme.primaryColor }}>
                    {success.title}
                  </h2>
                  <p className="text-muted mb-4">{success.message}</p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3">Redirecting to login...</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: design.theme.backgroundColor }}>
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <Container>
          <Link to={navigation.homeUrl} className="navbar-brand d-flex align-items-center">
            <img src={brand.logo} alt={brand.name} style={{ maxHeight: '40px', marginRight: '0.5rem' }} />
            <span className="fw-bold" style={{ color: design.theme.primaryColor }}>{brand.name}</span>
          </Link>
          
          {navigation.showLoginLink && (
            <div>
              <span className="text-muted me-2">Already have an account?</span>
              <Link to={navigation.loginUrl} className="btn btn-outline-primary">
                Login
              </Link>
            </div>
          )}
        </Container>
      </nav>

      <Container fluid className="py-5">
        <Row className="min-vh-100">
          {/* Left Panel - Features */}
          {design.layout === 'split' && (
            <Col lg={5} className="d-none d-lg-flex align-items-center">
              <div 
                className="w-100 h-100 d-flex flex-column justify-content-center p-5 text-white position-relative"
                style={{ 
                  background: design.leftPanel.background,
                  borderRadius: design.theme.borderRadius
                }}
              >
                {design.leftPanel.showBranding && (
                  <div className="mb-5">
                    <img src={brand.logoWhite} alt={brand.name} style={{ maxHeight: '60px', marginBottom: '1rem' }} />
                    <h2 className="fw-bold mb-2">{brand.name}</h2>
                    <p className="opacity-75">{brand.tagline}</p>
                  </div>
                )}

                {design.leftPanel.showFeatures && (
                  <div>
                    <h3 className="fw-bold mb-4">Why Choose Our Platform?</h3>
                    {design.leftPanel.features.map((feature, index) => (
                      <div key={index} className="d-flex align-items-start mb-4">
                        <div 
                          className="flex-shrink-0 me-3"
                          style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className={feature.icon}></i>
                        </div>
                        <div>
                          <h5 className="fw-semibold mb-1">{feature.title}</h5>
                          <p className="opacity-75 mb-0 small">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          )}

          {/* Right Panel - Registration Form */}
          <Col lg={design.layout === 'split' ? 7 : 12} className="d-flex align-items-center">
            <Container className={design.layout === 'split' ? '' : 'col-lg-6 mx-auto'}>
              <Card 
                className="border-0 shadow-lg"
                style={{ 
                  borderRadius: design.theme.borderRadius,
                  background: design.theme.cardBackground
                }}
              >
                <Card.Body className="p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h1 className="fw-bold mb-2" style={{ color: design.theme.textColor }}>
                      {form.title}
                    </h1>
                    <p className="text-muted">{form.subtitle}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      {form.steps.map((step, index) => (
                        <div key={step.id} className="text-center flex-fill">
                          <div 
                            className={`mx-auto mb-1 d-flex align-items-center justify-content-center ${
                              currentStep >= step.id ? 'text-white' : 'text-muted'
                            }`}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: currentStep >= step.id ? design.theme.primaryColor : '#e9ecef',
                              fontSize: '0.9rem'
                            }}
                          >
                            <i className={step.icon}></i>
                          </div>
                          <small className={currentStep >= step.id ? 'text-primary fw-semibold' : 'text-muted'}>
                            {step.title}
                          </small>
                        </div>
                      ))}
                    </div>
                    <ProgressBar 
                      now={(currentStep / form.steps.length) * 100} 
                      style={{ height: '4px' }}
                      variant="primary"
                    />
                  </div>

                  {/* Form Fields */}
                  <Form>
                    <div className="mb-4">
                      <h4 className="fw-semibold mb-3" style={{ color: design.theme.textColor }}>
                        {form.steps[currentStep - 1].title}
                      </h4>
                      <p className="text-muted small mb-4">
                        {form.steps[currentStep - 1].description}
                      </p>

                      <Row>
                        {form.fields[`step${currentStep}`].map((field, index) => (
                          <Col md={field.type === 'textarea' || field.type === 'checkbox' ? 12 : 6} key={field.name} className="mb-3">
                            {field.type !== 'checkbox' && (
                              <Form.Label className="fw-semibold">
                                {field.label}
                                {field.required && <span className="text-danger ms-1">*</span>}
                              </Form.Label>
                            )}
                            
                            {renderField(field)}
                            
                            {errors[field.name] && (
                              <Form.Control.Feedback type="invalid" className="d-block">
                                {errors[field.name]}
                              </Form.Control.Feedback>
                            )}
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="outline-secondary"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Previous
                      </Button>

                      {currentStep < form.steps.length ? (
                        <Button
                          onClick={handleNext}
                          style={{ 
                            background: design.theme.primaryColor,
                            border: 'none'
                          }}
                        >
                          Next
                          <i className="fas fa-arrow-right ms-2"></i>
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          style={{ 
                            background: design.theme.primaryColor,
                            border: 'none'
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Create Account
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationPage;
