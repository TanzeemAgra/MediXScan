// SuperAdmin Dashboard Component
// Complete RBAC integration with role-based UI components

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    full_name: '',
    department: '',
    employee_id: '',
    roles: ['DOCTOR'],
    permissions: []
  });
  
  const [roleAssignForm, setRoleAssignForm] = useState({
    user_id: '',
    role_name: '',
    expires_at: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        usersResponse,
        rolesResponse,
        permissionsResponse,
        dashboardResponse,
        auditResponse
      ] = await Promise.all([
        api.get('/auth/users/'),
        api.get('/auth/roles/'),
        api.get('/auth/permissions/'),
        api.get('/auth/dashboard/'),
        api.get('/auth/audit-logs/?limit=10')
      ]);

      setUsers(usersResponse.data.results || usersResponse.data);
      setRoles(rolesResponse.data.results || rolesResponse.data);
      setPermissions(permissionsResponse.data.results || permissionsResponse.data);
      setDashboardStats(dashboardResponse.data);
      setAuditLogs(auditResponse.data.results || auditResponse.data);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/create-doctor/', doctorForm);
      
      if (response.status === 201) {
        alert('Doctor created successfully!');
        setShowCreateDoctor(false);
        setDoctorForm({
          username: '',
          email: '',
          password: '',
          password_confirm: '',
          full_name: '',
          department: '',
          employee_id: '',
          roles: ['DOCTOR'],
          permissions: []
        });
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to create doctor:', error);
      alert('Failed to create doctor: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/assign-role/', roleAssignForm);
      
      if (response.status === 200) {
        alert('Role assigned successfully!');
        setShowAssignRole(false);
        setRoleAssignForm({ user_id: '', role_name: '', expires_at: '' });
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to assign role:', error);
      alert('Failed to assign role: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await api.patch(`/auth/users/${userId}/`, { is_suspended: true });
        alert('User suspended successfully!');
        loadDashboardData();
      } catch (error) {
        console.error('Failed to suspend user:', error);
        alert('Failed to suspend user: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading SuperAdmin Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SuperAdmin Dashboard</h1>
        <p className="text-gray-600">Complete system management and user control</p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardStats.system_stats?.total_users || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardStats.system_stats?.active_users || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Suspended Users</h3>
          <p className="text-3xl font-bold text-red-600">
            {dashboardStats.system_stats?.suspended_users || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboardStats.system_stats?.pending_approval || 0}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowCreateDoctor(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Create Doctor Account
        </button>
        
        <button
          onClick={() => setShowAssignRole(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Assign Role
        </button>
        
        <button
          onClick={loadDashboardData}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Refresh Data
        </button>
      </div>

      {/* Users Management */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || user.username}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.role_names?.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_suspended
                            ? 'bg-red-100 text-red-800'
                            : user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.is_suspended ? 'Suspended' : user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!user.is_suspended && !user.is_superuser_role && (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Suspend
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {log.user_email} - {log.action}
                  </p>
                  <p className="text-sm text-gray-500">
                    {log.resource_type} {log.resource_id ? `(${log.resource_id})` : ''}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Doctor Modal */}
      {showCreateDoctor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Doctor Account</h3>
              <form onSubmit={handleCreateDoctor}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.username}
                      onChange={(e) => setDoctorForm({...doctorForm, username: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.full_name}
                      onChange={(e) => setDoctorForm({...doctorForm, full_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.department}
                      onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.employee_id}
                      onChange={(e) => setDoctorForm({...doctorForm, employee_id: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      required
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={doctorForm.password_confirm}
                      onChange={(e) => setDoctorForm({...doctorForm, password_confirm: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateDoctor(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Role</h3>
              <form onSubmit={handleAssignRole}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <select
                      required
                      value={roleAssignForm.user_id}
                      onChange={(e) => setRoleAssignForm({...roleAssignForm, user_id: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name || user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      required
                      value={roleAssignForm.role_name}
                      onChange={(e) => setRoleAssignForm({...roleAssignForm, role_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expires At (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={roleAssignForm.expires_at}
                      onChange={(e) => setRoleAssignForm({...roleAssignForm, expires_at: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignRole(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Assign Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
