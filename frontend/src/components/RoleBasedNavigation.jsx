// Role-Based Navigation Component
// Dynamic navigation based on user roles and permissions

import React from 'react';
import { useRBAC, ProtectedNavItem } from '../hooks/useRBAC';

const RoleBasedNavigation = () => {
  const { 
    isSuperUser, 
    isDoctor, 
    isTechnician, 
    isPatient, 
    isAdmin,
    canManageUsers,
    canUploadScan,
    canViewReport,
    canViewAuditLogs,
    user,
    loading 
  } = useRBAC();

  if (loading) {
    return (
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-lg font-semibold">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">RadiologyApp</span>
            </div>
            
            {/* Main Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                
                {/* Dashboard - Available to all authenticated users */}
                <ProtectedNavItem
                  to="/dashboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </ProtectedNavItem>

                {/* SuperUser Only Navigation */}
                <ProtectedNavItem
                  to="/admin"
                  roles={['SUPERUSER']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </ProtectedNavItem>

                <ProtectedNavItem
                  to="/users"
                  permissions={['manage_users']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  User Management
                </ProtectedNavItem>

                <ProtectedNavItem
                  to="/audit-logs"
                  permissions={['view_audit_logs']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Audit Logs
                </ProtectedNavItem>

                {/* Doctor Navigation */}
                <ProtectedNavItem
                  to="/scans"
                  roles={['DOCTOR', 'TECHNICIAN']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Scans
                </ProtectedNavItem>

                <ProtectedNavItem
                  to="/upload"
                  permissions={['upload_scan']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Upload Scan
                </ProtectedNavItem>

                <ProtectedNavItem
                  to="/reports"
                  permissions={['view_report', 'create_report']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Reports
                </ProtectedNavItem>

                {/* Patient Navigation */}
                <ProtectedNavItem
                  to="/my-scans"
                  roles={['PATIENT']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Scans
                </ProtectedNavItem>

                <ProtectedNavItem
                  to="/appointments"
                  roles={['PATIENT', 'DOCTOR']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Appointments
                </ProtectedNavItem>

                {/* Technician Navigation */}
                <ProtectedNavItem
                  to="/queue"
                  roles={['TECHNICIAN']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Scan Queue
                </ProtectedNavItem>

                {/* Admin Navigation */}
                <ProtectedNavItem
                  to="/settings"
                  roles={['ADMIN', 'SUPERUSER']}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </ProtectedNavItem>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="text-white text-sm">
                <span className="font-medium">
                  {user?.full_name || user?.username}
                </span>
                <div className="text-xs text-gray-300">
                  {isSuperUser() && 'Super User'}
                  {isDoctor() && 'Doctor'}
                  {isTechnician() && 'Technician'}
                  {isPatient() && 'Patient'}
                  {isAdmin() && 'Admin'}
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user?.full_name || user?.username || '').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            
            {/* Dashboard */}
            <ProtectedNavItem
              to="/dashboard"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </ProtectedNavItem>

            {/* SuperUser Only */}
            <ProtectedNavItem
              to="/admin"
              roles={['SUPERUSER']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Admin Panel
            </ProtectedNavItem>

            <ProtectedNavItem
              to="/users"
              permissions={['manage_users']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              User Management
            </ProtectedNavItem>

            {/* Doctor/Technician */}
            <ProtectedNavItem
              to="/scans"
              roles={['DOCTOR', 'TECHNICIAN']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Scans
            </ProtectedNavItem>

            <ProtectedNavItem
              to="/upload"
              permissions={['upload_scan']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Upload Scan
            </ProtectedNavItem>

            <ProtectedNavItem
              to="/reports"
              permissions={['view_report', 'create_report']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Reports
            </ProtectedNavItem>

            {/* Patient */}
            <ProtectedNavItem
              to="/my-scans"
              roles={['PATIENT']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              My Scans
            </ProtectedNavItem>

            {/* Technician */}
            <ProtectedNavItem
              to="/queue"
              roles={['TECHNICIAN']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Scan Queue
            </ProtectedNavItem>

            {/* Admin */}
            <ProtectedNavItem
              to="/settings"
              roles={['ADMIN', 'SUPERUSER']}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Settings
            </ProtectedNavItem>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;
