import React, { useState, useEffect } from "react";
import { Toast, ToastContainer, Button, Modal, Form, Badge } from "react-bootstrap";
import complianceConfig from "../config/complianceConfig.js";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  const { cookies } = complianceConfig;

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent && cookies.enabled) {
      setShowBanner(true);
    } else if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setPreferences(parsed.preferences || preferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    const consent = {
      timestamp: new Date().toISOString(),
      preferences: allAccepted,
      version: cookies.version
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(allAccepted);
    setShowBanner(false);
    
    // Initialize analytics/marketing scripts if accepted
    if (allAccepted.analytics) {
      initializeAnalytics();
    }
    if (allAccepted.marketing) {
      initializeMarketing();
    }
  };

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    
    const consent = {
      timestamp: new Date().toISOString(),
      preferences: minimal,
      version: cookies.version
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(minimal);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    const consent = {
      timestamp: new Date().toISOString(),
      preferences: preferences,
      version: cookies.version
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
    
    // Initialize scripts based on preferences
    if (preferences.analytics) {
      initializeAnalytics();
    }
    if (preferences.marketing) {
      initializeMarketing();
    }
  };

  const initializeAnalytics = () => {
    // Initialize Google Analytics or other analytics
    console.log('Analytics initialized');
  };

  const initializeMarketing = () => {
    // Initialize marketing pixels/scripts
    console.log('Marketing scripts initialized');
  };

  const updatePreference = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!cookies.enabled) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <ToastContainer 
        position="bottom-center" 
        className="cookie-consent-container"
        style={{ zIndex: 9999 }}
      >
        <Toast 
          show={showBanner} 
          onClose={() => setShowBanner(false)}
          className="cookie-consent-toast"
          style={{ 
            minWidth: '90vw', 
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <Toast.Header closeButton={false}>
            <div className="d-flex align-items-center">
              <span className="me-2">🍪</span>
              <strong className="me-auto">Cookie Preferences</strong>
              <Badge bg="info" className="ms-2">GDPR Compliant</Badge>
            </div>
          </Toast.Header>
          <Toast.Body>
            <div className="mb-3">
              <p className="mb-2">
                {cookies.message}
              </p>
              <small className="text-muted">
                We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                You can customize your preferences or accept all cookies.
              </small>
            </div>
            
            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleCustomize}
              >
                Customize
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Cookie Preferences Modal */}
      <Modal 
        show={showPreferences} 
        onHide={() => setShowPreferences(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="me-2">🍪</span>
            Cookie Preferences
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <p className="text-muted">
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </p>
          </div>

          {/* Necessary Cookies */}
          <div className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-1">
                  <span className="me-2">⚙️</span>
                  Necessary Cookies
                </h6>
                <small className="text-muted">
                  Essential for basic website functionality
                </small>
              </div>
              <Form.Check 
                type="switch"
                id="necessary-switch"
                checked={preferences.necessary}
                disabled={true}
                label="Always On"
              />
            </div>
            <small className="text-muted">
              These cookies are essential for the website to function properly and cannot be disabled.
            </small>
          </div>

          {/* Functional Cookies */}
          <div className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-1">
                  <span className="me-2">🔧</span>
                  Functional Cookies
                </h6>
                <small className="text-muted">
                  Enhanced features and personalization
                </small>
              </div>
              <Form.Check 
                type="switch"
                id="functional-switch"
                checked={preferences.functional}
                onChange={(e) => updatePreference('functional', e.target.checked)}
              />
            </div>
            <small className="text-muted">
              These cookies enable enhanced functionality and personalization features.
            </small>
          </div>

          {/* Analytics Cookies */}
          <div className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-1">
                  <span className="me-2">📊</span>
                  Analytics Cookies
                </h6>
                <small className="text-muted">
                  Help us understand how visitors use our site
                </small>
              </div>
              <Form.Check 
                type="switch"
                id="analytics-switch"
                checked={preferences.analytics}
                onChange={(e) => updatePreference('analytics', e.target.checked)}
              />
            </div>
            <small className="text-muted">
              These cookies help us analyze site usage and improve user experience.
            </small>
          </div>

          {/* Marketing Cookies */}
          <div className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-1">
                  <span className="me-2">🎯</span>
                  Marketing Cookies
                </h6>
                <small className="text-muted">
                  Used to deliver personalized advertisements
                </small>
              </div>
              <Form.Check 
                type="switch"
                id="marketing-switch"
                checked={preferences.marketing}
                onChange={(e) => updatePreference('marketing', e.target.checked)}
              />
            </div>
            <small className="text-muted">
              These cookies are used to show you relevant advertisements and measure campaign effectiveness.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPreferences(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CookieConsentBanner;
