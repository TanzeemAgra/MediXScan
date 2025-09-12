import React, { useState, useEffect } from "react";
import { Col, Row, Accordion, Alert, Badge, Card as BootstrapCard, Container, Button, Nav, ProgressBar } from "react-bootstrap";
import Card from "../../components/Card";

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const lastUpdated = "September 12, 2025";
    
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (index) => {
        setActiveSection(index);
        const element = document.getElementById(`section-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const privacyData = [
        {
            title: "Introduction & Scope",
            icon: "fas fa-info-circle",
            content: (
                <div>
                    <div className="mb-4">
                        <h5 className="text-primary fw-bold">🏥 MediXScan AI Privacy Policy</h5>
                        <p className="lead">
                            This Privacy Policy describes how <strong>MediXScan AI</strong> ("we," "our," or "us") collects, uses, and protects 
                            information when you use our advanced medical AI platform and radiology services. We are committed to protecting your 
                            privacy and ensuring compliance with all applicable healthcare data protection regulations.
                        </p>
                    </div>
                    
                    <Alert variant="info" className="d-flex align-items-center mb-4">
                        <i className="fas fa-shield-alt me-3 fs-4"></i>
                        <div>
                            <strong>🛡️ HIPAA & GDPR Compliant:</strong> This policy covers our compliance with the Health Insurance 
                            Portability and Accountability Act (HIPAA), General Data Protection Regulation (GDPR), and other applicable healthcare privacy laws.
                        </div>
                    </Alert>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <h6 className="fw-bold text-success">📋 Scope of Application</h6>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-check text-success me-2"></i>Healthcare Professionals</li>
                                <li><i className="fas fa-check text-success me-2"></i>Medical Institutions</li>
                                <li><i className="fas fa-check text-success me-2"></i>Research Organizations</li>
                                <li><i className="fas fa-check text-success me-2"></i>Patients & Data Subjects</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h6 className="fw-bold text-primary">🌍 Global Coverage</h6>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-globe text-primary me-2"></i>United States (HIPAA)</li>
                                <li><i className="fas fa-globe text-primary me-2"></i>European Union (GDPR)</li>
                                <li><i className="fas fa-globe text-primary me-2"></i>Canada (PIPEDA)</li>
                                <li><i className="fas fa-globe text-primary me-2"></i>Other Jurisdictions</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="bg-light p-3 rounded mt-3">
                        <strong>📅 Last Updated:</strong> {lastUpdated}<br/>
                        <strong>📧 Contact:</strong> privacy@medixscan.com<br/>
                        <strong>🔗 Version:</strong> 3.1.0
                    </div>
                </div>
            )
        },
        {
            title: "HIPAA Compliance & Protected Health Information (PHI)",
            icon: "fas fa-shield-alt",
            content: (
                <div>
                    <Alert variant="success" className="d-flex align-items-center mb-4">
                        <i className="fas fa-certificate me-3 fs-4"></i>
                        <div>
                            <strong>🏥 HIPAA Certified Business Associate</strong><br/>
                            MediXScan AI is fully compliant with HIPAA regulations and serves as a Business Associate for 
                            covered entities. We implement comprehensive safeguards to protect Protected Health Information (PHI).
                        </div>
                    </Alert>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <BootstrapCard className="border-info h-100">
                                <BootstrapCard.Header className="bg-info text-white">
                                    <i className="fas fa-users me-2"></i>Administrative Safeguards
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-check text-success me-2"></i>Designated Security Officer</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Workforce Training Programs</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Access Management Procedures</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Emergency Access Protocols</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Regular Security Evaluations</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Incident Response Procedures</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-warning h-100">
                                <BootstrapCard.Header className="bg-warning text-dark">
                                    <i className="fas fa-building me-2"></i>Physical Safeguards
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-check text-success me-2"></i>Secure Data Center Facilities</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Controlled Facility Access</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Workstation Security Controls</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Media Controls & Disposal</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Environmental Protection</li>
                                        <li><i className="fas fa-check text-success me-2"></i>24/7 Security Monitoring</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-primary h-100">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-code me-2"></i>Technical Safeguards
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-check text-success me-2"></i>Multi-Factor Authentication</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Comprehensive Audit Logging</li>
                                        <li><i className="fas fa-check text-success me-2"></i>End-to-End Encryption (TLS 1.3)</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Data Integrity Controls</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Automatic Session Timeout</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Zero-Trust Architecture</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="primary" className="mb-3">
                        <h6 className="fw-bold mb-2">📋 Business Associate Agreement (BAA)</h6>
                        <p className="mb-2">We provide comprehensive Business Associate Agreements to all covered entities and business associates who use our platform.</p>
                        <Button variant="outline-primary" size="sm">
                            <i className="fas fa-download me-2"></i>Download BAA Template
                        </Button>
                    </Alert>

                    <div className="bg-light p-3 rounded">
                        <h6 className="fw-bold text-dark">🔐 Encryption Standards</h6>
                        <Row>
                            <Col md={6}>
                                <strong>Data at Rest:</strong> AES-256 encryption<br/>
                                <strong>Data in Transit:</strong> TLS 1.3 with perfect forward secrecy
                            </Col>
                            <Col md={6}>
                                <strong>Key Management:</strong> HSM-based key storage<br/>
                                <strong>Backup Encryption:</strong> Client-side encryption before upload
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        },
        {
            title: "GDPR Compliance & Data Subject Rights",
            icon: "fas fa-balance-scale",
            content: (
                <div>
                    <Alert variant="primary" className="d-flex align-items-center mb-4">
                        <i className="fas fa-flag me-3 fs-4"></i>
                        <div>
                            <strong>🇪🇺 GDPR Compliant for EU Data Subjects</strong><br/>
                            MediXScan AI fully complies with the General Data Protection Regulation (GDPR) for all data subjects 
                            in the European Union. We implement privacy by design principles and ensure all data subject rights are respected.
                        </div>
                    </Alert>

                    <h6 className="fw-bold text-primary mb-3">⚖️ Your Rights Under GDPR</h6>
                    <Accordion className="mb-4" flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <i className="fas fa-eye text-info me-2"></i>Right of Access
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can request access to your personal data and receive information about how we process it.<br/>
                                <strong>How to exercise:</strong> Submit a data access request via email to <code>privacy@medixscan.com</code><br/>
                                <strong>Response time:</strong> Within 30 days
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <i className="fas fa-edit text-warning me-2"></i>Right to Rectification
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can request correction of inaccurate or incomplete personal data.<br/>
                                <strong>How to exercise:</strong> Contact us with the correct information and supporting documentation.<br/>
                                <strong>Response time:</strong> Within 30 days
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                <i className="fas fa-trash text-danger me-2"></i>Right to Erasure ("Right to be Forgotten")
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can request deletion of your personal data under certain circumstances.<br/>
                                <strong>Limitations:</strong> May be restricted for medical records with legal retention requirements.<br/>
                                <strong>How to exercise:</strong> Submit an erasure request with justification.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>
                                <i className="fas fa-pause text-secondary me-2"></i>Right to Restrict Processing
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can request restriction of processing in specific situations.<br/>
                                <strong>When applicable:</strong> During disputes about data accuracy or when processing is unlawful.<br/>
                                <strong>Effect:</strong> We will store but not further process your data.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>
                                <i className="fas fa-download text-success me-2"></i>Right to Data Portability
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can request your data in a portable format to transfer to another service.<br/>
                                <strong>Format:</strong> Machine-readable format (JSON, CSV, XML).<br/>
                                <strong>Scope:</strong> Only applies to data processed based on consent or contract.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>
                                <i className="fas fa-ban text-danger me-2"></i>Right to Object
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You can object to processing based on legitimate interests or direct marketing.<br/>
                                <strong>Direct Marketing:</strong> Absolute right to object - we will stop immediately.<br/>
                                <strong>Other Processing:</strong> We will stop unless we demonstrate compelling legitimate grounds.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="6">
                            <Accordion.Header>
                                <i className="fas fa-robot text-primary me-2"></i>Rights in Automated Decision-Making
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>What it means:</strong> You have rights regarding automated decision-making and profiling.<br/>
                                <strong>AI Decisions:</strong> Right to human review of AI-based diagnostic suggestions.<br/>
                                <strong>Transparency:</strong> Right to explanation of algorithmic decision-making.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="fw-bold text-success">📋 Lawful Basis for Processing</h6>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-check text-success me-2"></i><strong>Consent:</strong> Explicit consent for diagnostic AI processing</li>
                                <li><i className="fas fa-check text-success me-2"></i><strong>Contract:</strong> Performance of healthcare services contract</li>
                                <li><i className="fas fa-check text-success me-2"></i><strong>Legal Obligation:</strong> Compliance with medical record retention laws</li>
                                <li><i className="fas fa-check text-success me-2"></i><strong>Vital Interests:</strong> Protection of life and health</li>
                                <li><i className="fas fa-check text-success me-2"></i><strong>Public Task:</strong> Public health and research activities</li>
                                <li><i className="fas fa-check text-success me-2"></i><strong>Legitimate Interests:</strong> Platform security and fraud prevention</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <Alert variant="info">
                                <h6 className="fw-bold mb-2">👤 Data Protection Officer (DPO)</h6>
                                <p className="mb-2">Our DPO oversees all data protection activities and serves as your point of contact for privacy matters.</p>
                                <div>
                                    <strong>📧 Email:</strong> <code>dpo@medixscan.com</code><br/>
                                    <strong>📞 Phone:</strong> +1-800-PRIVACY<br/>
                                    <strong>📍 Address:</strong> MediXScan AI, Privacy Office, 123 Healthcare Blvd, Medical City, MC 12345
                                </div>
                            </Alert>
                        </Col>
                    </Row>

                    <Alert variant="warning">
                        <h6 className="fw-bold">⚠️ Important Notice for Healthcare Data</h6>
                        <p className="mb-0">Some rights may be limited when processing health data for medical purposes, in accordance with GDPR Article 9 and applicable national health data protection laws. We will always inform you of any such limitations when responding to your requests.</p>
                    </Alert>
                </div>
            )
        },
        {
            title: "Data Collection & Processing",
            icon: "fas fa-database",
            content: (
                <div>
                    <h5 className="fw-bold text-primary mb-4">📊 Types of Data We Collect & Process</h5>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <BootstrapCard className="border-primary h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-user-circle me-2"></i><strong>Personal Identifiable Data</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-check text-success me-2"></i>Full name and contact information</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Professional credentials & licenses</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Institution/organization affiliation</li>
                                        <li><i className="fas fa-check text-success me-2"></i>User account preferences</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Billing and payment information</li>
                                        <li><i className="fas fa-check text-success me-2"></i>Communication preferences</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-danger h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-danger text-white">
                                    <i className="fas fa-heartbeat me-2"></i><strong>Protected Health Information (PHI)</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <Alert variant="warning" className="p-2 mb-2">
                                        <small><strong>⚠️ HIPAA Protected:</strong> Highest security measures applied</small>
                                    </Alert>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-x-ray text-info me-2"></i>Medical imaging data (DICOM files)</li>
                                        <li><i className="fas fa-file-medical text-success me-2"></i>Diagnostic reports & interpretations</li>
                                        <li><i className="fas fa-id-card text-warning me-2"></i>Patient identifiers (when applicable)</li>
                                        <li><i className="fas fa-procedures text-primary me-2"></i>Treatment and procedure information</li>
                                        <li><i className="fas fa-history text-secondary me-2"></i>Medical history relevant to diagnosis</li>
                                        <li><i className="fas fa-dna text-info me-2"></i>Genetic and genomic data</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-info h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-info text-white">
                                    <i className="fas fa-analytics me-2"></i><strong>Technical & Usage Data</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-chart-line text-success me-2"></i>Platform usage analytics</li>
                                        <li><i className="fas fa-mouse text-primary me-2"></i>Feature utilization patterns</li>
                                        <li><i className="fas fa-tachometer-alt text-warning me-2"></i>Performance & response metrics</li>
                                        <li><i className="fas fa-bug text-danger me-2"></i>Error logs and diagnostics</li>
                                        <li><i className="fas fa-server text-secondary me-2"></i>System integration data</li>
                                        <li><i className="fas fa-mobile-alt text-info me-2"></i>Device and browser information</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="primary" className="mb-4">
                        <h6 className="fw-bold mb-2">🔍 Data Minimization Principle</h6>
                        <p className="mb-0">We collect only the minimum amount of data necessary to provide our services effectively. All data collection is purpose-limited and proportionate to our stated objectives.</p>
                    </Alert>

                    <h6 className="fw-bold text-success mb-3">🎯 Data Processing Purposes</h6>
                    <Row>
                        <Col md={6}>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-robot text-primary me-2"></i><strong>AI-Powered Diagnostics:</strong> Providing advanced medical image analysis and diagnostic support</li>
                                <li><i className="fas fa-chart-area text-success me-2"></i><strong>Quality Enhancement:</strong> Improving platform performance, accuracy, and user experience</li>
                                <li><i className="fas fa-balance-scale text-warning me-2"></i><strong>Regulatory Compliance:</strong> Meeting HIPAA, GDPR, and other legal requirements</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-shield-virus text-danger me-2"></i><strong>Security & Fraud Prevention:</strong> Protecting against threats, abuse, and unauthorized access</li>
                                <li><i className="fas fa-envelope text-info me-2"></i><strong>Communication:</strong> Sending service notifications, updates, and support communications</li>
                                <li><i className="fas fa-graduation-cap text-secondary me-2"></i><strong>Research & Development:</strong> Advancing medical AI technology (anonymized data only)</li>
                            </ul>
                        </Col>
                    </Row>

                    <div className="bg-light p-3 rounded mt-3">
                        <h6 className="fw-bold text-dark">📋 Data Retention Policy</h6>
                        <Row>
                            <Col md={6}>
                                <strong>PHI/Medical Data:</strong> Retained per legal requirements (typically 7-10 years)<br/>
                                <strong>User Account Data:</strong> Retained while account is active + 3 years
                            </Col>
                            <Col md={6}>
                                <strong>Usage Analytics:</strong> Aggregated data retained for 2 years<br/>
                                <strong>Security Logs:</strong> Retained for 1 year minimum
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        },
        {
            title: "Data Security & Protection",
            icon: "fas fa-shield-alt",
            content: (
                <div>
                    <Alert variant="success" className="d-flex align-items-center mb-4">
                        <i className="fas fa-award me-3 fs-4"></i>
                        <div>
                            <strong>🏆 Enterprise-Grade Security</strong><br/>
                            Our comprehensive security framework exceeds industry standards and regulatory requirements for healthcare data protection.
                        </div>
                    </Alert>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <BootstrapCard className="border-success h-100">
                                <BootstrapCard.Header className="bg-success text-white">
                                    <i className="fas fa-key me-2"></i><strong>Encryption & Cryptography</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-lock text-success me-2"></i><strong>Data at Rest:</strong> AES-256 encryption</li>
                                        <li><i className="fas fa-exchange-alt text-primary me-2"></i><strong>Data in Transit:</strong> TLS 1.3 with PFS</li>
                                        <li><i className="fas fa-database text-info me-2"></i><strong>Database:</strong> Transparent Data Encryption</li>
                                        <li><i className="fas fa-cloud text-secondary me-2"></i><strong>Cloud Storage:</strong> Client-side encryption</li>
                                        <li><i className="fas fa-backup text-warning me-2"></i><strong>Backups:</strong> Zero-knowledge encryption</li>
                                        <li><i className="fas fa-fingerprint text-danger me-2"></i><strong>Key Management:</strong> HSM-based storage</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-primary h-100">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-user-shield me-2"></i><strong>Access Control & Authentication</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-mobile-alt text-success me-2"></i><strong>Multi-Factor Auth:</strong> Required for all users</li>
                                        <li><i className="fas fa-users-cog text-primary me-2"></i><strong>Role-Based Access:</strong> Least privilege principle</li>
                                        <li><i className="fas fa-clock text-info me-2"></i><strong>Session Management:</strong> Auto-timeout & monitoring</li>
                                        <li><i className="fas fa-code text-secondary me-2"></i><strong>API Security:</strong> OAuth 2.0 & rate limiting</li>
                                        <li><i className="fas fa-ban text-warning me-2"></i><strong>Zero Trust:</strong> Continuous verification</li>
                                        <li><i className="fas fa-shield-virus text-danger me-2"></i><strong>Behavioral Analysis:</strong> Anomaly detection</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-warning h-100">
                                <BootstrapCard.Header className="bg-warning text-dark">
                                    <i className="fas fa-radar me-2"></i><strong>Monitoring & Threat Detection</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-eye text-success me-2"></i><strong>24/7 Monitoring:</strong> Real-time threat detection</li>
                                        <li><i className="fas fa-list text-primary me-2"></i><strong>Audit Logging:</strong> Complete access tracking</li>
                                        <li><i className="fas fa-bug text-info me-2"></i><strong>Penetration Testing:</strong> Quarterly assessments</li>
                                        <li><i className="fas fa-exclamation-triangle text-secondary me-2"></i><strong>Vulnerability Scanning:</strong> Continuous monitoring</li>
                                        <li><i className="fas fa-bell text-warning me-2"></i><strong>Incident Response:</strong> 15-minute alert SLA</li>
                                        <li><i className="fas fa-robot text-danger me-2"></i><strong>AI-Powered Security:</strong> ML threat detection</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="info" className="mb-4">
                        <h6 className="fw-bold mb-2">🛡️ Security Incident Response</h6>
                        <Row>
                            <Col md={6}>
                                <strong>Detection:</strong> Automated threat detection with AI-powered analysis<br/>
                                <strong>Response Time:</strong> 15-minute alert, 1-hour initial response<br/>
                                <strong>Containment:</strong> Immediate isolation and damage assessment
                            </Col>
                            <Col md={6}>
                                <strong>Notification:</strong> Breach notification within 72 hours (GDPR) or 60 days (HIPAA)<br/>
                                <strong>Recovery:</strong> Business continuity with &gt;99.9% uptime SLA<br/>
                                <strong>Post-Incident:</strong> Root cause analysis and security improvements
                            </Col>
                        </Row>
                    </Alert>

                    <Row className="mb-3">
                        <Col md={6}>
                            <h6 className="fw-bold text-success">🏅 Security Certifications & Compliance</h6>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                <Badge bg="success" className="p-2">SOC 2 Type II</Badge>
                                <Badge bg="primary" className="p-2">ISO 27001</Badge>
                                <Badge bg="info" className="p-2">HIPAA Compliant</Badge>
                                <Badge bg="warning" text="dark" className="p-2">GDPR Compliant</Badge>
                            </div>
                            <ul className="small mb-0">
                                <li>Annual third-party security audits</li>
                                <li>Continuous compliance monitoring</li>
                                <li>Regular employee security training</li>
                                <li>Vendor security assessments</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h6 className="fw-bold text-primary">🏗️ Infrastructure Security</h6>
                            <ul className="small mb-0">
                                <li><strong>Cloud Provider:</strong> AWS with HIPAA-eligible services</li>
                                <li><strong>Network Security:</strong> VPC isolation, WAF protection</li>
                                <li><strong>Data Centers:</strong> SOC 2 certified facilities</li>
                                <li><strong>Backup & Recovery:</strong> Multi-region redundancy</li>
                                <li><strong>DDoS Protection:</strong> Advanced threat mitigation</li>
                                <li><strong>Container Security:</strong> Image scanning & runtime protection</li>
                            </ul>
                        </Col>
                    </Row>

                    <div className="bg-light p-3 rounded">
                        <h6 className="fw-bold text-dark">📞 Security Contact Information</h6>
                        <Row>
                            <Col md={6}>
                                <strong>Security Team:</strong> <code>security@medixscan.com</code><br/>
                                <strong>Emergency Hotline:</strong> +1-800-SECURITY (24/7)
                            </Col>
                            <Col md={6}>
                                <strong>Bug Bounty Program:</strong> <code>bugbounty@medixscan.com</code><br/>
                                <strong>Responsible Disclosure:</strong> coordinated-disclosure@medixscan.com
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        },
        {
            title: "Data Retention & Deletion",
            icon: "fas fa-trash-alt",
            content: (
                <div>
                    <Alert variant="info" className="d-flex align-items-center mb-4">
                        <i className="fas fa-calendar-check me-3 fs-4"></i>
                        <div>
                            <strong>⏱️ Responsible Data Lifecycle Management</strong><br/>
                            We retain data only as long as necessary for legitimate business purposes, subject to legal and regulatory requirements.
                        </div>
                    </Alert>
                    
                    <Row className="mb-4">
                        <Col md={6}>
                            <BootstrapCard className="border-primary h-100">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-hourglass-half me-2"></i><strong>Data Retention Periods</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-heartbeat text-danger me-2"></i><strong>Medical Records (PHI):</strong> 7-10 years (regulatory requirement)</li>
                                        <li><i className="fas fa-user text-primary me-2"></i><strong>User Account Data:</strong> Duration of service + 3 years</li>
                                        <li><i className="fas fa-list text-info me-2"></i><strong>Audit Logs:</strong> 7 years minimum (compliance)</li>
                                        <li><i className="fas fa-chart-line text-success me-2"></i><strong>Analytics Data:</strong> 2 years (anonymized only)</li>
                                        <li><i className="fas fa-envelope text-warning me-2"></i><strong>Communication Logs:</strong> 1 year</li>
                                        <li><i className="fas fa-backup text-secondary me-2"></i><strong>System Backups:</strong> 30 days (encrypted)</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={6}>
                            <BootstrapCard className="border-danger h-100">
                                <BootstrapCard.Header className="bg-danger text-white">
                                    <i className="fas fa-eraser me-2"></i><strong>Data Deletion Process</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <ul className="list-unstyled mb-0">
                                        <li><i className="fas fa-clock text-warning me-2"></i><strong>Grace Period:</strong> 30 days for accidental deletion</li>
                                        <li><i className="fas fa-trash text-danger me-2"></i><strong>Permanent Deletion:</strong> Within 90 days of request</li>
                                        <li><i className="fas fa-shield-alt text-success me-2"></i><strong>Secure Erasure:</strong> DOD 5220.22-M standards</li>
                                        <li><i className="fas fa-certificate text-primary me-2"></i><strong>Deletion Certificates:</strong> Provided upon request</li>
                                        <li><i className="fas fa-database text-info me-2"></i><strong>Backup Removal:</strong> 6-month complete purge cycle</li>
                                        <li><i className="fas fa-check-circle text-success me-2"></i><strong>Verification:</strong> Multi-step deletion confirmation</li>
                                    </ul>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="warning" className="mb-3">
                        <h6 className="fw-bold mb-2">⚖️ Legal Hold & Regulatory Requirements</h6>
                        <p className="mb-0">Data subject to legal proceedings, regulatory investigations, or mandatory retention laws may be retained beyond standard periods. We will notify affected users when legally permissible.</p>
                    </Alert>

                    <Alert variant="success">
                        <h6 className="fw-bold mb-2">🗑️ Your Right to Deletion</h6>
                        <p className="mb-2">You can request deletion of your personal data at any time. Submit your request to <code>privacy@medixscan.com</code></p>
                        <Button variant="outline-success" size="sm">
                            <i className="fas fa-trash me-2"></i>Request Data Deletion
                        </Button>
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
            icon: "fas fa-address-book",
            content: (
                <div>
                    <h5 className="fw-bold text-primary mb-4">📞 Privacy & Compliance Contacts</h5>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <BootstrapCard className="border-primary h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <i className="fas fa-user-shield me-2"></i><strong>Data Protection Officer</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <div className="text-center mb-3">
                                        <i className="fas fa-user-tie fs-1 text-primary"></i>
                                    </div>
                                    <p className="mb-0">
                                        <strong>Dr. Sarah Richardson, CIPP/US</strong><br />
                                        <i className="fas fa-envelope text-primary me-2"></i>
                                        <a href="mailto:dpo@medixscan.com">dpo@medixscan.com</a><br />
                                        <i className="fas fa-phone text-success me-2"></i>
                                        <a href="tel:+1-800-PRIVACY">+1-800-PRIVACY</a><br />
                                        <i className="fas fa-clock text-info me-2"></i>
                                        Monday - Friday, 9AM - 6PM EST
                                    </p>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-success h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-success text-white">
                                    <i className="fas fa-shield-alt me-2"></i><strong>Chief Security Officer</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <div className="text-center mb-3">
                                        <i className="fas fa-shield-virus fs-1 text-success"></i>
                                    </div>
                                    <p className="mb-0">
                                        <strong>Michael Chen, CISSP, CISM</strong><br />
                                        <i className="fas fa-envelope text-primary me-2"></i>
                                        <a href="mailto:security@medixscan.com">security@medixscan.com</a><br />
                                        <i className="fas fa-phone text-success me-2"></i>
                                        <a href="tel:+1-800-SECURITY">+1-800-SECURITY</a><br />
                                        <i className="fas fa-clock text-info me-2"></i>
                                        24/7 Emergency Response
                                    </p>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                        <Col md={4}>
                            <BootstrapCard className="border-info h-100 shadow-sm">
                                <BootstrapCard.Header className="bg-info text-white">
                                    <i className="fas fa-balance-scale me-2"></i><strong>Legal & Compliance</strong>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <div className="text-center mb-3">
                                        <i className="fas fa-gavel fs-1 text-info"></i>
                                    </div>
                                    <p className="mb-0">
                                        <strong>Legal Department</strong><br />
                                        <i className="fas fa-envelope text-primary me-2"></i>
                                        <a href="mailto:legal@medixscan.com">legal@medixscan.com</a><br />
                                        <i className="fas fa-phone text-success me-2"></i>
                                        <a href="tel:+1-800-MEDIXLAW">+1-800-MEDIXLAW</a><br />
                                        <i className="fas fa-clock text-info me-2"></i>
                                        Monday - Friday, 8AM - 7PM EST
                                    </p>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </Col>
                    </Row>

                    <Alert variant="primary" className="mb-4">
                        <h6 className="fw-bold mb-2">📮 Mailing Address</h6>
                        <div className="row">
                            <div className="col-md-6">
                                <strong>MediXScan AI Privacy Office</strong><br/>
                                123 Healthcare Innovation Blvd<br/>
                                Medical Technology District<br/>
                                Boston, MA 02115<br/>
                                United States
                            </div>
                            <div className="col-md-6">
                                <strong>European Representative:</strong><br/>
                                MediXScan EU Privacy Representative<br/>
                                45 Health Tech Avenue<br/>
                                Dublin 2, D02 XY89<br/>
                                Ireland
                            </div>
                        </div>
                    </Alert>

                    <Row className="mb-4">
                        <Col md={6}>
                            <Alert variant="warning">
                                <h6 className="fw-bold mb-2">🚨 Data Breach Reporting</h6>
                                <p className="mb-2">If you suspect a data breach or security incident:</p>
                                <ul className="small mb-2">
                                    <li>Immediate: <strong>security@medixscan.com</strong></li>
                                    <li>Emergency Hotline: <strong>+1-800-SECURITY</strong></li>
                                    <li>Anonymous Tip: <strong>breach-tip@medixscan.com</strong></li>
                                </ul>
                            </Alert>
                        </Col>
                        <Col md={6}>
                            <Alert variant="success">
                                <h6 className="fw-bold mb-2">💡 General Privacy Questions</h6>
                                <p className="mb-2">For general privacy inquiries and support:</p>
                                <ul className="small mb-2">
                                    <li>Privacy Help: <strong>privacy@medixscan.com</strong></li>
                                    <li>Support Center: <strong>+1-800-MEDIXSCAN</strong></li>
                                    <li>Live Chat: Available in your account dashboard</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>

                    <Alert variant="info" className="text-center">
                        <h6 className="fw-bold mb-2">📅 Policy Updates & Changes</h6>
                        <p className="mb-2">This privacy policy was last updated on <strong>{lastUpdated}</strong>.</p>
                        <p className="mb-3">We will notify users of material changes via email and platform notifications 30 days in advance.</p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="outline-primary" size="sm">
                                <i className="fas fa-bell me-2"></i>Subscribe to Updates
                            </Button>
                            <Button variant="outline-success" size="sm">
                                <i className="fas fa-download me-2"></i>Download PDF Version
                            </Button>
                        </div>
                    </Alert>
                </div>
            )
        }
    ];

    return (
        <>
            {/* Reading Progress Bar */}
            <div className="fixed-top">
                <ProgressBar 
                    now={scrollProgress} 
                    style={{ height: '3px', borderRadius: '0' }}
                    variant="primary"
                />
            </div>

            {/* Hero Section */}
            <div className="privacy-hero position-relative overflow-hidden py-5 mb-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1EBCB7 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite'
            }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(1px)'
                }}></div>
                
                <Container className="position-relative">
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <div className="text-white">
                                <div className="d-flex align-items-center mb-3">
                                    <img 
                                        src="/assets/images/logo-white.png" 
                                        alt="MediXScan AI" 
                                        style={{ height: '50px', marginRight: '15px' }}
                                        onError={(e) => {
                                            e.target.src = "/assets/images/logo.png";
                                        }}
                                    />
                                    <div>
                                        <h1 className="display-4 fw-bold mb-0">Privacy Policy</h1>
                                        <p className="lead mb-0 opacity-90">Your Privacy. Our Commitment.</p>
                                    </div>
                                </div>
                                
                                <p className="lead mb-4" style={{ maxWidth: '600px' }}>
                                    Comprehensive privacy protection with enterprise-grade security, HIPAA compliance, 
                                    and GDPR adherence for healthcare data processing.
                                </p>
                                
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                        <i className="fas fa-shield-alt me-1"></i> HIPAA Compliant
                                    </Badge>
                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                        <i className="fas fa-globe me-1"></i> GDPR Compliant
                                    </Badge>
                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                        <i className="fas fa-lock me-1"></i> SOC 2 Type II
                                    </Badge>
                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                        <i className="fas fa-certificate me-1"></i> ISO 27001
                                    </Badge>
                                </div>

                                <div className="d-flex align-items-center text-white opacity-75">
                                    <i className="fas fa-calendar-alt me-2"></i>
                                    <span>Last updated: {lastUpdated}</span>
                                    <span className="mx-3">•</span>
                                    <i className="fas fa-clock me-2"></i>
                                    <span>15 min read</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} className="text-center">
                            <div className="privacy-illustration">
                                <div className="floating-shield" style={{
                                    width: '200px',
                                    height: '200px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    animation: 'float 6s ease-in-out infinite'
                                }}>
                                    <i className="fas fa-user-shield text-white" style={{ fontSize: '80px', opacity: '0.9' }}></i>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                <Row>
                    {/* Sidebar Navigation */}
                    <Col lg={3} className="mb-4">
                        <div className="sticky-top" style={{ top: '100px' }}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h6 className="mb-0">
                                        <i className="fas fa-list me-2"></i>
                                        Table of Contents
                                    </h6>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Nav className="flex-column">
                                        {privacyData.map((section, index) => (
                                            <Nav.Link
                                                key={index}
                                                href={`#section-${index}`}
                                                className={`border-bottom px-3 py-3 text-decoration-none ${
                                                    activeSection === index ? 'bg-primary text-white' : 'text-dark'
                                                }`}
                                                onClick={() => setActiveSection(index)}
                                                style={{ 
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <Badge 
                                                        bg={activeSection === index ? 'light' : 'primary'} 
                                                        text={activeSection === index ? 'dark' : 'white'}
                                                        className="me-2"
                                                        style={{ minWidth: '25px' }}
                                                    >
                                                        {index + 1}
                                                    </Badge>
                                                    <span>{section.title}</span>
                                                </div>
                                            </Nav.Link>
                                        ))}
                                    </Nav>
                                </Card.Body>
                            </Card>

                            {/* Quick Contact */}
                            <Card className="border-0 shadow-sm mt-4">
                                <Card.Body className="text-center">
                                    <i className="fas fa-question-circle text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                                    <h6>Questions about Privacy?</h6>
                                    <p className="small text-muted mb-3">
                                        Contact our Data Protection Officer
                                    </p>
                                    <Button variant="outline-primary" size="sm" className="w-100">
                                        <i className="fas fa-envelope me-2"></i>
                                        Contact DPO
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9}>
                        {/* Trust Badges */}
                        <div className="mb-5">
                            <BootstrapCard className="border-0 shadow-sm">
                                <BootstrapCard.Header className="bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-certificate me-2"></i>
                                        Compliance & Security Certifications
                                    </h5>
                                </BootstrapCard.Header>
                                <BootstrapCard.Body>
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <div className="d-flex flex-wrap gap-3">
                                                <Badge bg="success" className="p-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                                    <i className="fas fa-shield-alt me-2"></i>
                                                    HIPAA Compliant
                                                </Badge>
                                                <Badge bg="primary" className="p-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                                    <i className="fas fa-globe me-2"></i>
                                                    GDPR Compliant
                                                </Badge>
                                                <Badge bg="info" className="p-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                                    <i className="fas fa-lock me-2"></i>
                                                    SOC 2 Type II
                                                </Badge>
                                                <Badge bg="warning" text="dark" className="p-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                                    <i className="fas fa-certificate me-2"></i>
                                                    ISO 27001
                                                </Badge>
                                            </div>
                                        </Col>
                                        <Col md={4} className="text-end">
                                            <div className="text-muted small">
                                                <i className="fas fa-check-circle text-success me-1"></i>
                                                Verified & Audited<br/>
                                                <i className="fas fa-calendar text-info me-1"></i>
                                                Last Review: Sept 2025
                                            </div>
                                        </Col>
                                    </Row>
                                </BootstrapCard.Body>
                            </BootstrapCard>
                        </div>

                        {/* Privacy Sections */}
                        {privacyData.map((section, index) => (
                            <div key={index} id={`section-${index}`} className="mb-5">
                                <Card className="border-0 shadow-sm overflow-hidden">
                                    <Card.Header className="bg-gradient-primary text-white position-relative" style={{
                                        background: `linear-gradient(135deg, ${
                                            index % 3 === 0 ? '#667eea, #764ba2' : 
                                            index % 3 === 1 ? '#1EBCB7, #667eea' : 
                                            '#764ba2, #1EBCB7'
                                        })`
                                    }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <Badge bg="light" text="dark" className="me-3" style={{ 
                                                    fontSize: '1rem',
                                                    minWidth: '35px',
                                                    height: '35px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {index + 1}
                                                </Badge>
                                                <div>
                                                    <h4 className="mb-0 fw-bold">{section.title}</h4>
                                                </div>
                                            </div>
                                            <i className="fas fa-shield-alt opacity-75" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        
                                        {/* Decorative Elements */}
                                        <div className="position-absolute top-0 end-0 opacity-10">
                                            <i className="fas fa-lock" style={{ fontSize: '120px', transform: 'rotate(15deg)' }}></i>
                                        </div>
                                    </Card.Header>
                                    
                                    <Card.Body className="p-4" style={{ 
                                        fontSize: '1.05rem', 
                                        lineHeight: '1.7',
                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)'
                                    }}>
                                        {section.content}
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}

                        {/* Bottom CTA */}
                        <Card className="border-0 shadow-lg mb-5" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                            <Card.Body className="text-center text-white p-5">
                                <i className="fas fa-handshake mb-4" style={{ fontSize: '3rem', opacity: '0.9' }}></i>
                                <h3 className="fw-bold mb-3">Still Have Questions?</h3>
                                <p className="lead mb-4 opacity-90">
                                    Our privacy team is here to help you understand how we protect your data.
                                </p>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <Button variant="light" size="lg" className="px-4">
                                        <i className="fas fa-envelope me-2"></i>
                                        Contact Privacy Team
                                    </Button>
                                    <Button variant="outline-light" size="lg" className="px-4">
                                        <i className="fas fa-phone me-2"></i>
                                        Schedule Call
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                .privacy-hero::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
                    opacity: 0.6;
                }

                .nav-link:hover {
                    background-color: #f8f9fa !important;
                    color: #495057 !important;
                }

                .nav-link.active {
                    background-color: #007bff !important;
                    color: white !important;
                }

                .floating-shield {
                    position: relative;
                }

                .floating-shield::after {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    animation: float 8s ease-in-out infinite reverse;
                }

                @media (max-width: 768px) {
                    .privacy-hero .display-4 {
                        font-size: 2.5rem !important;
                    }
                    
                    .floating-shield {
                        width: 150px !important;
                        height: 150px !important;
                    }
                    
                    .floating-shield i {
                        font-size: 60px !important;
                    }
                }
            `}</style>

            {/* Back to Top Button */}
            {showBackToTop && (
                <Button
                    variant="primary"
                    className="position-fixed shadow-lg"
                    style={{
                        bottom: '30px',
                        right: '30px',
                        zIndex: 1050,
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={scrollToTop}
                    title="Back to Top"
                >
                    <i className="fas fa-arrow-up fs-4"></i>
                </Button>
            )}
        </>
    );
};

export default PrivacyPolicy;