import React, { useState, useContext, useEffect } from "react"
import { Accordion, AccordionContext, Nav, OverlayTrigger, Tooltip, useAccordionButton } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { dataAPI, viewReport } from '../../../services/api'
import { useLanguage } from '../../../context/LanguageContext.jsx'
import { useUniversalAuth } from '../../../hooks/useUniversalAuth'
import { ROUTES, UI_CONFIG, ConfigHelpers } from '../../../config/appConfig.js'
import { getRBACNavigationItems } from '../../../utils/rbacRouteUtils'

const VerticalNav = () => {
    const location = useLocation()
    const [activeMenu, setActiveMenu] = useState(false)
    const [active, setActive] = useState('')
    const { t } = useLanguage();
    const { user, isSuperUser, isStaff } = useUniversalAuth();

    // Enhanced superuser detection - use universal auth values plus fallbacks
    const hasSuperAdminAccess = Boolean(
        isSuperUser ||
        isStaff ||
        user?.is_superuser || 
        user?.is_staff ||
        user?.roles?.some(role => 
            role === 'SUPERUSER' || 
            role === 'ADMIN' || 
            role === 'SuperAdmin' ||
            role?.name === 'SUPERUSER' ||
            role?.name === 'ADMIN' ||
            role?.name === 'SuperAdmin'
        ) ||
        user?.email === 'tanzeem.agra@rugrel.com' // Temporary admin override
    );
    
    // Get RBAC navigation items dynamically using soft-coded approach
    const rbacItems = getRBACNavigationItems(user);

    // Enhanced debug logging
    useEffect(() => {
        console.log('🔍 Sidebar Debug Info:');
        console.log('Full user object:', user);
        console.log('user?.is_superuser:', user?.is_superuser);
        console.log('user?.is_staff:', user?.is_staff);
        console.log('user?.roles:', user?.roles);
        console.log('user?.email:', user?.email);
        console.log('hasSuperAdminAccess:', hasSuperAdminAccess);
        console.log('rbacItems length:', rbacItems.length);
        
        // Force show RBAC for debugging
        if (user?.email === 'tanzeem.agra@rugrel.com') {
            console.log('🎯 Admin user detected - RBAC should be visible');
        }
    }, [user, hasSuperAdminAccess]);

    // Soft-coded dashboard navigation items
    const dashboardItems = [
        { 
            path: ROUTES.DASHBOARD.ROOT, 
            name: t('home'), 
            icon: "ri-dashboard-line" 
        },
        { 
            path: ROUTES.DASHBOARD.HOSPITAL_DASHBOARD_ONE, 
            name: t('reportCorrection'), 
            icon: "ri-hospital-fill" 
        },
        { 
            path: ROUTES.DASHBOARD.HOSPITAL_DASHBOARD_TWO, 
            name: t('anonymizer'), 
            icon: "ri-hospital-line" 
        },
        { 
            path: ROUTES.DASHBOARD.PATIENT_DASHBOARD, 
            name: t('patientDashboard'), 
            icon: "ri-heart-pulse-line" 
        },
        { 
            path: ROUTES.PATIENTS.LIST, 
            name: t('patientManagement'), 
            icon: "ri-user-heart-line" 
        },
        { 
            path: '/dashboard/patient-reports', 
            name: t('patientReports'), 
            icon: "ri-file-chart-line" 
        }
    ];

    // Soft-coded authentication items
    const authItems = [
        { 
            path: ROUTES.AUTH.LOGIN, 
            name: t('login'), 
            icon: "ri-login-box-fill" 
        }
    ];

    const handleViewReport = async (fileKey) => {
        try {
            const response = await viewReport(fileKey);
            setSelectedReport(response.report_text);
        } catch (err) {
            console.error("Failed to load report");
        }
    };

    function CustomToggle({ children, eventKey, onClick, activeClass }) {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(eventKey, (active) => onClick({ state: !active, eventKey: eventKey }));
        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <Link to="#" aria-expanded={isCurrentEventKey ? 'true' : 'false'} className={`nav-link ${isCurrentEventKey ? 'active' : ''} ${activeClass ? 'active' : ''}`} role="button" onClick={decoratedOnClick}>
                {children}
            </Link>
        );
    }

    return (
        <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
            <Nav.Item as="li" className="static-item ms-2">
                <Nav.Link className="static-item disabled text-start" tabIndex="-1">
                    <span className="default-icon">{t('pages')}</span>
                    <span className="mini-icon">-</span>
                </Nav.Link>
            </Nav.Item>
            <Accordion as="li" className={`nav-item ${active === "Radiology" ? "active" : ""}`}>
                <CustomToggle
                    eventKey="dashboard"
                    activeClass={dashboardItems.some(item => location.pathname === item.path)}
                    onClick={(activeKey) => {
                        setActive("Radiology");
                        setActiveMenu(activeKey);
                    }}
                >
                    <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>{t('radiology')}</Tooltip>}
                    >
                        <i className="ri-dashboard-fill"></i>
                    </OverlayTrigger>
                    <span className="item-name">{t('radiology')}</span>
                    <i className="right-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </i>
                </CustomToggle>

                <Accordion.Collapse eventKey="dashboard">
                    <Nav className="sub-nav">
                        {dashboardItems.map((item, idx) => (
                            <Nav.Item as="li" key={idx}>
                                <Link
                                    className={`${location.pathname === item.path ? 'active' : ''} nav-link`}
                                    to={item.path}
                                >
                                    <i className={item.icon}></i>
                                    <span className="item-name">{item.name}</span>
                                </Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Accordion.Collapse>
            </Accordion>

            {/* RBAC User Management Section - Super Admin Only */}
            {hasSuperAdminAccess && (
                <Accordion as="li" className={`nav-item ${active === "RBAC" ? "active" : ""}`}>
                    <CustomToggle
                        eventKey="rbac"
                        activeClass={rbacItems.some(item => location.pathname === item.path)}
                        onClick={(activeKey) => {
                            setActive("RBAC");
                            setActiveMenu(activeKey);
                        }}
                    >
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>RBAC User Management</Tooltip>}
                        >
                            <i className="ri-admin-fill text-primary"></i>
                        </OverlayTrigger>
                        <span className="item-name">
                            <span className="fw-bold text-primary">RBAC Management</span>
                            <small className="d-block text-muted" style={{fontSize: '0.75rem'}}>Super Admin</small>
                        </span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>

                    <Accordion.Collapse eventKey="rbac">
                        <Nav className="sub-nav">
                            {rbacItems.map((item, idx) => (
                                <Nav.Item as="li" key={idx}>
                                    <Link
                                        className={`${location.pathname === item.path ? 'active' : ''} nav-link`}
                                        to={item.path}
                                    >
                                        <i className={item.icon}></i>
                                        <span className="item-name">{item.name}</span>
                                        {item.name === 'Security Monitor' && (
                                            <span className="badge bg-warning ms-2" style={{fontSize: '0.6rem'}}>
                                                <i className="fas fa-shield-alt"></i>
                                            </span>
                                        )}
                                    </Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Accordion.Collapse>
                </Accordion>
            )}
        </ul>
    )
}

export default VerticalNav
