// Dashboard Statistics Card Component
// Reusable card for displaying key metrics in RBAC dashboard

import React from 'react';
import { Card } from 'react-bootstrap';

const DashboardStatsCard = ({ title, value, icon, color, subtitle, trend, onClick }) => {
  return (
    <Card 
      className={`stats-card border-0 shadow-sm h-100 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{ transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Card.Body className="p-4">
        <div className="d-flex align-items-center">
          <div className={`stats-icon me-3 text-${color}`}>
            <i className={`${icon} fa-2x`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h3 className="mb-0 fw-bold">{value}</h3>
                <p className="text-muted mb-0 small">{title}</p>
                {subtitle && (
                  <small className="text-muted">{subtitle}</small>
                )}
              </div>
              {trend && (
                <div className="text-end">
                  <small className={`badge bg-light text-${color} fw-normal`}>
                    {trend}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DashboardStatsCard;
