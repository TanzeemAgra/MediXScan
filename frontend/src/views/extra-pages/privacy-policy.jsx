import React from "react";
import { Col, Row, Accordion, Alert, Badge, Card as BootstrapCard } from "react-bootstrap";
import Card from "../../components/Card";
import ComplianceTrustBadges from "../../components/ComplianceTrustBadges.jsx";
import complianceConfig from "../../config/complianceConfig.js";

const PrivacyPolicy = () => {
    const lastUpdated = "September 9, 2025";
    
    const privacyData = [
        {
            title: "Introduction & Scope",
            content: (
                <div>
                    <p>
                        <strong>MediXscan AI Privacy Policy</strong><br />
                        This Privacy Policy describes how MediXscan AI ("we," "our," or "us") collects, uses, and protects 
                        information when you use our medical AI platform and services. We are committed to protecting your 
                        privacy and ensuring compliance with healthcare data protection regulations.
                    </p>
                    <Alert variant="info" className="d-flex align-items-center">
                        <i className="fas fa-info-circle me-2"></i>
                        <div>
                            <strong>HIPAA & GDPR Compliant:</strong> This policy covers our compliance with the Health Insurance 
                            Portability and Accountability Act (HIPAA) and the General Data Protection Regulation (GDPR).
                        </div>
                    </Alert>
                    <p>
                        <strong>Scope of Application:</strong><br />
                        This policy applies to all users of MediXscan AI, including healthcare professionals, medical institutions, 
                        researchers, and patients whose data is processed through our platform.
                    </p>
                </div>
            )
        },
        {
            title: "HIPAA Compliance & Protected Health Information (PHI)",
            content: (
                <div>
                    <h6 className="fw-bold text-primary">HIPAA Compliance Framework</h6>
                    <p>
                        MediXscan AI is fully compliant with HIPAA regulations and serves as a Business Associate for 
                        covered entities. We implement comprehensive safeguards to protect Protected Health Information (PHI).
                    </p>
                    
                    <Row className="mb-3">
                        <Col md={6}>
                            <h6>Administrative Safeguards:</h6>
                            <ul className="small">
                                <li>Designated Security Officer</li>
                                <li>Workforce training programs</li>
                                <li>Access management procedures</li>
                                <li>Emergency access protocols</li>
                                <li>Regular security evaluations</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h6>Physical Safeguards:</h6>
                            <ul className="small">
                                <li>Secure data center facilities</li>
                                <li>Controlled facility access</li>
                                <li>Workstation security controls</li>
                                <li>Media controls and disposal</li>
                                <li>Environmental protection</li>
                            </ul>
                        </Col>
                    </Row>

                    <h6>Technical Safeguards:</h6>
                    <ul className="small mb-3">
                        <li><strong>Access Control:</strong> Unique user identification, emergency access, automatic logoff</li>
                        <li><strong>Audit Controls:</strong> Comprehensive logging of all PHI access and modifications</li>
                        <li><strong>Integrity:</strong> Cryptographic checksums and version control</li>
                        <li><strong>Person or Entity Authentication:</strong> Multi-factor authentication required</li>
                        <li><strong>Transmission Security:</strong> End-to-end encryption using TLS 1.3</li>
                    </ul>

                    <Alert variant="success">
                        <strong>Business Associate Agreement (BAA):</strong> We provide comprehensive BAAs to all covered 
                        entities and business associates who use our platform.
                    </Alert>
                </div>
            )
        },
        {
            title: "GDPR Compliance & Data Subject Rights",
            content: (
                <div>
                    <h6 className="fw-bold text-primary">GDPR Compliance Framework</h6>
                    <p>
                        MediXscan AI complies with the General Data Protection Regulation (GDPR) for all data subjects 
                        in the European Union. We implement privacy by design principles and ensure data subject rights are respected.
                    </p>

                    <h6>Your Rights Under GDPR:</h6>
                    <Accordion className="mb-3">
                        {complianceConfig.gdpr.rights.map((right, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>{right}</Accordion.Header>
                                <Accordion.Body className="small">
                                    {index === 0 && "You can request access to your personal data and receive information about how we process it."}
                                    {index === 1 && "You can request correction of inaccurate or incomplete personal data."}
                                    {index === 2 && "You can request deletion of your personal data under certain circumstances."}
                                    {index === 3 && "You can request restriction of processing in specific situations."}
                                    {index === 4 && "You can request your data in a portable format to transfer to another service."}
                                    {index === 5 && "You can object to processing based on legitimate interests or direct marketing."}
                                    {index === 6 && "You have rights regarding automated decision-making and profiling."}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    <h6>Lawful Basis for Processing:</h6>
                    <ul className="small">
                        {complianceConfig.gdpr.lawfulBasis.map((basis, index) => (
                            <li key={index}>{basis}</li>
                        ))}
                    </ul>

                    <Alert variant="info">
                        <strong>Data Protection Officer:</strong> Contact our DPO at {complianceConfig.contacts.dpo.email} 
                        for any privacy-related inquiries.
                    </Alert>
                </div>
            )
        },
        {
            title: "Data Collection & Processing",
            content: (
                <div>
                    <h6 className="fw-bold">Types of Data We Collect:</h6>
                    
                    <Row className="mb-3">
                        <Col md={4}>
                            <BootstrapCard className="border-primary">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-user me-2"></i>Personal Data
                                </BootstrapCard.Header>
                                <BootstrapCard.Body className="small">
                                    <ul className="mb-0">
                                        <li>Name and contact information</li>
                                        <li>Professional credentials</li>
                                        <li>Institution affiliation</li>
                                        <li>User preferences</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-warning">
                                <BootstrapCard.Header className="bg-warning text-dark">
                                    <i className="fas fa-heartbeat me-2"></i>Health Data (PHI)
                                </BootstrapCard.Header>
                                <BootstrapCard.Body className="small">
                                    <ul className="mb-0">
                                        <li>Medical imaging data</li>
                                        <li>Diagnostic reports</li>
                                        <li>Patient identifiers</li>
                                        <li>Treatment information</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-info">
                                <BootstrapCard.Header className="bg-info text-white">
                                    <i className="fas fa-chart-line me-2"></i>Usage Data
                                </BootstrapCard.Header>
                                <BootstrapCard.Body className="small">
                                    <ul className="mb-0">
                                        <li>Platform usage analytics</li>
                                        <li>Feature utilization</li>
                                        <li>Performance metrics</li>
                                        <li>Error logs</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <h6 className="fw-bold">Data Processing Purposes:</h6>
                    <ul className="small">
                        <li><strong>Service Delivery:</strong> Providing AI-powered medical analysis and diagnostic support</li>
                        <li><strong>Quality Improvement:</strong> Enhancing platform performance and accuracy</li>
                        <li><strong>Compliance:</strong> Meeting regulatory and legal requirements</li>
                        <li><strong>Security:</strong> Protecting against fraud, abuse, and security threats</li>
                        <li><strong>Communication:</strong> Sending service-related notifications and updates</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Data Security & Protection",
            content: (
                <div>
                    <h6 className="fw-bold text-primary">Comprehensive Security Framework</h6>
                    
                    <Row className="mb-3">
                        <Col md={6}>
                            <h6><i className="fas fa-lock me-2 text-primary"></i>Encryption Standards</h6>
                            <ul className="small">
                                <li><strong>Data at Rest:</strong> AES-256 encryption</li>
                                <li><strong>Data in Transit:</strong> TLS 1.3 protocol</li>
                                <li><strong>Database:</strong> Transparent Data Encryption (TDE)</li>
                                <li><strong>Backups:</strong> Encrypted backup storage</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h6><i className="fas fa-shield-alt me-2 text-primary"></i>Access Controls</h6>
                            <ul className="small">
                                <li><strong>Multi-Factor Authentication:</strong> Required for all users</li>
                                <li><strong>Role-Based Access:</strong> Principle of least privilege</li>
                                <li><strong>Session Management:</strong> Automated timeout and monitoring</li>
                                <li><strong>API Security:</strong> OAuth 2.0 and rate limiting</li>
                            </ul>
                        </Col>
                    </Row>

                    <h6><i className="fas fa-eye me-2 text-primary"></i>Monitoring & Auditing</h6>
                    <ul className="small mb-3">
                        <li>Real-time security monitoring and threat detection</li>
                        <li>Comprehensive audit logging of all data access</li>
                        <li>Regular penetration testing and vulnerability assessments</li>
                        <li>Incident response and breach notification procedures</li>
                    </ul>

                    <Alert variant="success">
                        <strong>Security Certifications:</strong> SOC 2 Type II, ISO 27001, and regular third-party security audits
                    </Alert>
                </div>
            )
        },
        {
            title: "Data Retention & Deletion",
            content: (
                <div>
                    <h6 className="fw-bold">Data Retention Policy</h6>
                    <p>
                        We retain data only as long as necessary for the purposes outlined in this policy, 
                        subject to legal and regulatory requirements.
                    </p>

                    <Row className="mb-3">
                        <Col md={6}>
                            <h6>Retention Periods:</h6>
                            <ul className="small">
                                <li><strong>Medical Records:</strong> {complianceConfig.privacy.dataRetention.defaultPeriod} (regulatory requirement)</li>
                                <li><strong>User Account Data:</strong> Duration of service + 3 years</li>
                                <li><strong>Audit Logs:</strong> {complianceConfig.monitoring.auditLogs.retention}</li>
                                <li><strong>Analytics Data:</strong> 2 years (anonymized)</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h6>Data Deletion Process:</h6>
                            <ul className="small">
                                <li><strong>Grace Period:</strong> {complianceConfig.privacy.dataDelete.gracePeriod}</li>
                                <li><strong>Permanent Deletion:</strong> {complianceConfig.privacy.dataDelete.permanentDeletion}</li>
                                <li><strong>Secure Erasure:</strong> DOD 5220.22-M standards</li>
                                <li><strong>Certification:</strong> Deletion certificates provided</li>
                            </ul>
                        </Col>
                    </Row>

                    <Alert variant="warning">
                        <strong>Legal Holds:</strong> Data subject to legal proceedings or regulatory investigations 
                        may be retained beyond standard retention periods.
                    </Alert>
                </div>
            )
        },
        {
            title: "International Data Transfers",
            content: (
                <div>
                    <h6 className="fw-bold">Cross-Border Data Processing</h6>
                    <p>
                        MediXscan AI may transfer data internationally to provide our services. We ensure all 
                        transfers comply with applicable data protection laws.
                    </p>

                    <h6>Transfer Safeguards:</h6>
                    <ul className="small">
                        <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection levels</li>
                        <li><strong>Standard Contractual Clauses:</strong> EU Commission approved SCCs</li>
                        <li><strong>Binding Corporate Rules:</strong> Internal data protection standards</li>
                        <li><strong>Data Processing Agreements:</strong> Comprehensive DPAs with processors</li>
                    </ul>

                    <Badge bg="info" className="mb-2">Primary Data Processing: United States & European Union</Badge>
                </div>
            )
        },
        {
            title: "Contact Information & Compliance",
            content: (
                <div>
                    <h6 className="fw-bold">Privacy & Compliance Contacts</h6>
                    
                    <Row>
                        <Col md={6}>
                            <BootstrapCard className="border-0 bg-light mb-3">
                                <BootstrapCard.Body>
                                    <h6><i className="fas fa-user-shield me-2"></i>Data Protection Officer</h6>
                                    <p className="small mb-0">
                                        <strong>{complianceConfig.contacts.dpo.name}</strong><br />
                                        Email: <a href={`mailto:${complianceConfig.contacts.dpo.email}`}>{complianceConfig.contacts.dpo.email}</a><br />
                                        Phone: {complianceConfig.contacts.dpo.phone}
                                    </p>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={6}>
                            <BootstrapCard className="border-0 bg-light mb-3">
                                <BootstrapCard.Body>
                                    <h6><i className="fas fa-shield-alt me-2"></i>Security Officer</h6>
                                    <p className="small mb-0">
                                        <strong>{complianceConfig.contacts.security.name}</strong><br />
                                        Email: <a href={`mailto:${complianceConfig.contacts.security.email}`}>{complianceConfig.contacts.security.email}</a><br />
                                        Phone: {complianceConfig.contacts.security.phone}
                                    </p>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="primary">
                        <strong>Policy Updates:</strong> This privacy policy was last updated on {lastUpdated}. 
                        We will notify users of material changes via email and platform notifications.
                    </Alert>
                </div>
            )
        }
    ];

    return (
        <>
            <Row className="mb-4">
                <Col lg={12}>
                    <Alert variant="primary" className="d-flex align-items-center">
                        <i className="fas fa-shield-alt me-3" style={{ fontSize: '24px' }}></i>
                        <div>
                            <h5 className="mb-1">MediXscan AI Privacy Policy</h5>
                            <p className="mb-0">
                                Comprehensive privacy protection with HIPAA & GDPR compliance. 
                                Last updated: <strong>{lastUpdated}</strong>
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
                    {privacyData.map((section, index) => (
                        <Card key={index} className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">{section.title}</h5>
                                <Badge bg="primary">{index + 1}</Badge>
                            </Card.Header>
                            <Card.Body>
                                {section.content}
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </>
    );
};

export default PrivacyPolicy;