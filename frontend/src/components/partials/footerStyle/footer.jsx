import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ComplianceTrustBadges from '../../ComplianceTrustBadges.jsx';

const FooterStyle = () => {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <footer className="footer rounded-pill mb-4 mx-0 mx-md-4">
                <div className="footer-body">
                    <Row className="d-flex flex-grow-1 align-items-center">
                        <Col lg={7} md={12}>
                            <ul className="left-panel list-inline mb-2 p-0 d-flex justify-content-center justify-content-lg-start flex-wrap">
                                <li className="list-inline-item fw-500">
                                    <Link className="footer-link" to="/extra-pages/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li className="list-inline-item fw-500">
                                    <Link className="footer-link footer-spacing" to="/extra-pages/terms-of-use">Terms of Use</Link>
                                </li>
                                <li className="list-inline-item fw-500">
                                    <Link className="footer-link footer-spacing" to="/compliance/security">Security</Link>
                                </li>
                                <li className="list-inline-item fw-500">
                                    <a href="http://13.234.239.80/support-portal/" className="footer-link footer-spacing">Support</a>
                                </li>
                            </ul>
                            <div className="d-flex justify-content-center justify-content-lg-start">
                                <ComplianceTrustBadges layout="badges-only" className="small-badges" />
                            </div>
                        </Col>
                        <Col lg={5} md={12}>
                            <div className="right-panel mb-0 d-flex flex-column justify-content-center justify-content-lg-end text-center text-lg-end">
                                <h6 className="mb-1">
                                    © {currentYear} MediXscan AI. All rights reserved.
                                </h6>
                                <p className="small text-muted mb-0">
                                    <i className="fas fa-shield-alt me-1"></i>
                                    HIPAA & GDPR Compliant Medical AI Platform
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </footer>
        </>
    )
}

export default FooterStyle