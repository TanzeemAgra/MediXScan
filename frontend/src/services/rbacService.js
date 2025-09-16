// RBAC Service - Mock Implementation
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    is_active: true,
    is_approved: true,
    roles: ['super_admin'],
    department: 'Administration'
  }
];

const rbacService = {
  async login(credentials) {
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return { success: true, user: MOCK_USERS[0], token: 'mock_token' };
    }
    throw new Error('Invalid credentials');
  },
  
  async getUsers() {
    return { success: true, data: MOCK_USERS };
  },
  
  async getRoles() {
    return { success: true, data: [] };
  },
  
  async getPermissions() {
    return { success: true, data: [] };
  },
  
  async createUser(userData) {
    const newUser = { id: Date.now(), ...userData };
    MOCK_USERS.push(newUser);
    return { success: true, data: newUser };
  },
  
  async updateUser(id, userData) {
    const userIndex = MOCK_USERS.findIndex(u => u.id === parseInt(id));
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
      return { success: true, data: MOCK_USERS[userIndex] };
    }
    throw new Error('User not found');
  },
  
  async deleteUser(id) {
    const userIndex = MOCK_USERS.findIndex(u => u.id === parseInt(id));
    if (userIndex !== -1) {
      MOCK_USERS.splice(userIndex, 1);
      return { success: true };
    }
    throw new Error('User not found');
  },

  // Enhanced User Approval System - Soft Coded API Integration
  async getPendingUsers() {
    try {
      const response = await fetch('/api/rbac/pending-users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.warn('API call failed, using fallback:', error.message);
      
      // Soft-coded fallback for pending users
      const pendingUsers = MOCK_USERS.filter(user => !user.is_approved);
      return { success: true, data: pendingUsers, fallback: true };
    }
  },

  async approveUser(userId, approvalData = {}) {
    try {
      const response = await fetch(`/api/rbac/approve-user/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          action: 'approve',
          role: approvalData.role || 'DOCTOR',
          department: approvalData.department || 'Radiology',
          ...approvalData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.warn('API approval failed, using fallback:', error.message);
      
      // Soft-coded fallback approval
      const userIndex = MOCK_USERS.findIndex(u => u.id === parseInt(userId));
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = { 
          ...MOCK_USERS[userIndex], 
          is_approved: true, 
          is_active: true,
          ...approvalData 
        };
        return { success: true, data: MOCK_USERS[userIndex], fallback: true };
      }
      
      throw error;
    }
  },

  async rejectUser(userId, rejectionData = {}) {
    try {
      const response = await fetch(`/api/rbac/reject-user/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          action: 'reject',
          reason: rejectionData.reason || 'Application denied',
          ...rejectionData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.warn('API rejection failed, using fallback:', error.message);
      
      // Soft-coded fallback rejection (mark as inactive)
      const userIndex = MOCK_USERS.findIndex(u => u.id === parseInt(userId));
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = { 
          ...MOCK_USERS[userIndex], 
          is_approved: false, 
          is_active: false,
          rejection_reason: rejectionData.reason 
        };
        return { success: true, data: MOCK_USERS[userIndex], fallback: true };
      }
      
      throw error;
    }
  },

  async bulkApproveUsers(userIds, approvalData = {}) {
    try {
      const response = await fetch(`/api/rbac/bulk-approve-users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ids: userIds,
          action: 'bulk_approve',
          default_role: approvalData.role || 'DOCTOR',
          default_department: approvalData.department || 'Radiology',
          ...approvalData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.warn('API bulk approval failed, using fallback:', error.message);
      
      // Soft-coded fallback bulk approval
      const approvedUsers = [];
      userIds.forEach(userId => {
        const userIndex = MOCK_USERS.findIndex(u => u.id === parseInt(userId));
        if (userIndex !== -1) {
          MOCK_USERS[userIndex] = { 
            ...MOCK_USERS[userIndex], 
            is_approved: true, 
            is_active: true,
            ...approvalData 
          };
          approvedUsers.push(MOCK_USERS[userIndex]);
        }
      });
      
      return { success: true, data: { approved_users: approvedUsers }, fallback: true };
    }
  }
};

export default rbacService;
