import React from "react";
import { Accordion, Col, Row, Alert, Badge, Card as BootstrapCard } from 'react-bootstrap';
import ComplianceTrustBadges from "../../components/ComplianceTrustBadges.jsx";
import complianceConfig from "../../config/complianceConfig.js";

const TermsOfService = () => {
    const lastUpdated = "September 9, 2025";
    const effectiveDate = "September 1, 2025";

    return (
        <>
            <Row className="mb-4">
                <Col lg={12}>
                    <Alert variant="primary" className="d-flex align-items-center">
                        <i className="fas fa-gavel me-3" style={{ fontSize: '24px' }}></i>
                        <div>
                            <h5 className="mb-1">MediXscan AI Terms of Service</h5>
                            <p className="mb-0">
                                Comprehensive terms governing the use of our HIPAA & GDPR compliant medical AI platform. 
                                Last updated: <strong>{lastUpdated}</strong> | Effective: <strong>{effectiveDate}</strong>
                            </p>
                        </div>
                    </Alert>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col lg={12}>
                    <ComplianceTrustBadges layout="horizontal" showDetails={false} />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Accordion defaultActiveKey="0" className="custom-accordion iq-accordion-card">
                        
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <i className="fas fa-handshake me-2"></i>
                                Acceptance of Terms
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <p><strong>Agreement to Terms:</strong> By accessing or using MediXscan AI ("the Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform.</p>
                                    
                                    <Alert variant="warning" className="my-3">
                                        <strong>Healthcare Professionals Only:</strong> This platform is intended exclusively for licensed healthcare professionals, medical institutions, and authorized personnel.
                                    </Alert>

                                    <p><strong>Legal Capacity:</strong> You represent that you have the legal authority to enter into these terms on behalf of yourself or the organization you represent.</p>
                                    
                                    <p><strong>Updates to Terms:</strong> We reserve the right to modify these terms at any time. Material changes will be communicated via email and platform notifications with 30 days advance notice.</p>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <i className="fas fa-user-md me-2"></i>
                                Platform Use & Eligibility
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <h6 className="fw-bold text-primary">Authorized Users</h6>
                                    <ul>
                                        <li><strong>Healthcare Professionals:</strong> Licensed physicians, radiologists, nurses, and medical technicians</li>
                                        <li><strong>Medical Institutions:</strong> Hospitals, clinics, diagnostic centers, and research facilities</li>
                                        <li><strong>Authorized Personnel:</strong> IT staff, administrators, and support personnel with proper authorization</li>
                                    </ul>

                                    <h6 className="fw-bold text-primary mt-4">Permitted Uses</h6>
                                    <ul>
                                        <li>Medical diagnosis and analysis support</li>
                                        <li>Clinical research and studies (with proper IRB approval)</li>
                                        <li>Educational purposes within medical institutions</li>
                                        <li>Quality assurance and improvement initiatives</li>
                                    </ul>

                                    <Alert variant="danger" className="my-3">
                                        <strong>Prohibited Uses:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Commercial resale or redistribution of the service</li>
                                            <li>Reverse engineering or attempting to extract algorithms</li>
                                            <li>Use for non-medical purposes or entertainment</li>
                                            <li>Circumventing security measures or access controls</li>
                                        </ul>
                                    </Alert>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                <i className="fas fa-shield-alt me-2"></i>
                                HIPAA Compliance & PHI Protection
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <h6 className="fw-bold text-primary">Business Associate Relationship</h6>
                                    <p>MediXscan AI serves as a Business Associate under HIPAA. We have implemented comprehensive safeguards to protect Protected Health Information (PHI):</p>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <BootstrapCard className="border-primary">
                                                <BootstrapCard.Header className="bg-primary text-white">
                                                    <i className="fas fa-lock me-2"></i>Technical Safeguards
                                                </BootstrapCard.Header>
                                                <BootstrapCard.Body className="small">
                                                    <ul className="mb-0">
                                                        <li>AES-256 encryption for data at rest</li>
                                                        <li>TLS 1.3 encryption for data in transit</li>
                                                        <li>Multi-factor authentication</li>
                                                        <li>Role-based access controls</li>
                                                        <li>Audit logging and monitoring</li>
                                                    </ul>
                                                </BootstrapCard.Body>
                                            </BootstrapCard>
                                        </Col>
                                        <Col md={6}>
                                            <BootstrapCard className="border-success">
                                                <BootstrapCard.Header className="bg-success text-white">
                                                    <i className="fas fa-users me-2"></i>Administrative Safeguards
                                                </BootstrapCard.Header>
                                                <BootstrapCard.Body className="small">
                                                    <ul className="mb-0">
                                                        <li>Designated Security Officer</li>
                                                        <li>Workforce training programs</li>
                                                        <li>Access management procedures</li>
                                                        <li>Incident response protocols</li>
                                                        <li>Regular security assessments</li>
                                                    </ul>
                                                </BootstrapCard.Body>
                                            </BootstrapCard>
                                        </Col>
                                    </Row>

                                    <Alert variant="info">
                                        <strong>BAA Available:</strong> Comprehensive Business Associate Agreements are available for all covered entities. Contact {complianceConfig.contacts.compliance.email} to request your BAA.
                                    </Alert>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header>
                                <i className="fas fa-globe-europe me-2"></i>
                                GDPR Compliance & Data Rights
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <h6 className="fw-bold text-primary">Data Controller & Processor</h6>
                                    <p>For EU data subjects, we act as either a data controller or processor depending on the circumstances. We comply with all GDPR requirements including:</p>

                                    <h6 className="fw-bold text-primary">Your Rights Under GDPR</h6>
                                    <div className="small">
                                        {complianceConfig.gdpr.rights.map((right, index) => (
                                            <div key={index} className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                {right}
                                            </div>
                                        ))}
                                    </div>

                                    <Alert variant="primary" className="mt-3">
                                        <strong>Data Protection Officer:</strong> For GDPR-related inquiries, contact our DPO: {complianceConfig.contacts.dpo.name} at {complianceConfig.contacts.dpo.email}
                                    </Alert>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                            <Accordion.Header>
                                <i className="fas fa-gavel me-2"></i>
                                Professional Responsibility & Liability
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <Alert variant="warning" className="mb-3">
                                        <strong>Clinical Decision Support Tool:</strong> MediXscan AI is a clinical decision support tool that assists healthcare professionals. It does not replace professional medical judgment.
                                    </Alert>

                                    <h6 className="fw-bold text-primary">Healthcare Professional Responsibilities</h6>
                                    <ul>
                                        <li><strong>Professional Judgment:</strong> All clinical decisions remain the responsibility of the healthcare professional</li>
                                        <li><strong>Validation Required:</strong> AI analysis must be validated by qualified professionals before clinical use</li>
                                        <li><strong>Patient Safety:</strong> Healthcare professionals must ensure patient safety in all uses of the platform</li>
                                        <li><strong>Regulatory Compliance:</strong> Users must comply with all applicable medical and privacy regulations</li>
                                    </ul>

                                    <h6 className="fw-bold text-primary">Platform Limitations</h6>
                                    <ul>
                                        <li>AI analysis is probabilistic and may contain errors</li>
                                        <li>Platform is not suitable for emergency medical situations</li>
                                        <li>Results should be correlated with clinical findings</li>
                                        <li>Continuous monitoring and validation required</li>
                                    </ul>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="5">
                            <Accordion.Header>
                                <i className="fas fa-phone me-2"></i>
                                Contact & Compliance Information
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="terms-content">
                                    <Row>
                                        <Col md={6}>
                                            <BootstrapCard className="mb-3">
                                                <BootstrapCard.Header>
                                                    <h6 className="mb-0"><i className="fas fa-user-shield me-2"></i>Data Protection Officer</h6>
                                                </BootstrapCard.Header>
                                                <BootstrapCard.Body>
                                                    <p className="mb-0">
                                                        <strong>{complianceConfig.contacts.dpo.name}</strong><br />
                                                        Email: <a href={`mailto:${complianceConfig.contacts.dpo.email}`}>{complianceConfig.contacts.dpo.email}</a><br />
                                                        Phone: {complianceConfig.contacts.dpo.phone}
                                                    </p>
                                                </BootstrapCard.Body>
                                            </BootstrapCard>
                                        </Col>
                                        <Col md={6}>
                                            <BootstrapCard className="mb-3">
                                                <BootstrapCard.Header>
                                                    <h6 className="mb-0"><i className="fas fa-clipboard-check me-2"></i>Compliance Officer</h6>
                                                </BootstrapCard.Header>
                                                <BootstrapCard.Body>
                                                    <p className="mb-0">
                                                        <strong>{complianceConfig.contacts.compliance.name}</strong><br />
                                                        Email: <a href={`mailto:${complianceConfig.contacts.compliance.email}`}>{complianceConfig.contacts.compliance.email}</a><br />
                                                        Phone: {complianceConfig.contacts.compliance.phone}
                                                    </p>
                                                </BootstrapCard.Body>
                                            </BootstrapCard>
                                        </Col>
                                    </Row>

                                    <Alert variant="info">
                                        <strong>Document Version:</strong> These Terms of Service were last updated on {lastUpdated} and are effective as of {effectiveDate}. Previous versions are available upon request.
                                    </Alert>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>
                </Col>
            </Row>
        </>
    );
};

export default TermsOfService;