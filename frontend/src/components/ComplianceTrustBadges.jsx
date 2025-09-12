import React from "react";
import { Badge } from "react-bootstrap";

const ComplianceTrustBadges = ({ layout = "horizontal", showDetails = false, className = "" }) => {
  
  if (layout === "badges-only") {
    return (
      <div className={`compliance-trust-badges badges-only ${className}`}>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <Badge bg="primary" className="p-2">
            🏥 HIPAA Compliant
          </Badge>
          <Badge bg="success" className="p-2">
            🔒 GDPR Compliant
          </Badge>
          <Badge bg="info" className="p-2">
            ✓ Security Certified
          </Badge>
        </div>
      </div>
    );
  }

  // Default horizontal layout
  return (
    <div className={`compliance-trust-badges horizontal ${className}`}>
      <div className="d-flex flex-wrap gap-2">
        <Badge bg="primary" className="p-2">
          🏥 HIPAA
        </Badge>
        <Badge bg="success" className="p-2">
          🔒 GDPR
        </Badge>
        <Badge bg="info" className="p-2">
          ✓ Security+
        </Badge>
      </div>
    </div>
  );
};

export default ComplianceTrustBadges;
