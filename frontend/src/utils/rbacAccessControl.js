/**
 * Enhanced RBAC Access Control Utilities
 * Provides flexible superuser/admin detection across multiple patterns
 */

/**
 * Check if user has super admin/administrator access
 * Uses multiple detection patterns for robustness
 * @param {Object} user - User object from authentication context
 * @returns {Boolean} - Whether user has super admin access
 */
export const hasSuperAdminAccess = (user) => {
    return Boolean(
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
};

/**
 * Debug log user access information
 * @param {Object} user - User object
 * @param {Boolean} isAuthenticated - Authentication status  
 * @param {String} component - Component name for logging
 */
export const debugUserAccess = (user, isAuthenticated, component = 'Unknown') => {
    console.log(`🔍 ${component} Access Debug:`);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user?.is_superuser:', user?.is_superuser);
    console.log('user?.is_staff:', user?.is_staff);
    console.log('user?.roles:', user?.roles);
    console.log('user?.email:', user?.email);
    console.log('hasSuperAdminAccess:', hasSuperAdminAccess(user));
};

/**
 * Get access denied component with debug info
 * @param {Object} user - User object
 * @param {Boolean} isAuthenticated - Authentication status
 * @returns {JSX.Element} - Access denied component
 */
export const getAccessDeniedComponent = (user, isAuthenticated) => {
    const React = require('react');
    const { Container, Row, Col, Card } = require('react-bootstrap');
    
    return React.createElement(Container, { className: "rbac-access-denied" },
        React.createElement(Row, { className: "justify-content-center" },
            React.createElement(Col, { md: 6 },
                React.createElement(Card, { className: "text-center" },
                    React.createElement(Card.Body, null,
                        React.createElement("div", { className: "access-denied-icon" },
                            React.createElement("i", { className: "fas fa-shield-alt fa-3x text-danger" })
                        ),
                        React.createElement(Card.Title, { className: "mt-3" }, "Access Denied"),
                        React.createElement(Card.Text, null,
                            "Super Administrator privileges are required to access the RBAC Management System."
                        ),
                        React.createElement(Card.Text, { className: "small text-muted" },
                            `Debug: Auth=${String(isAuthenticated)}, Access=${String(hasSuperAdminAccess(user))}, Email=${user?.email || 'N/A'}`
                        )
                    )
                )
            )
        )
    );
};