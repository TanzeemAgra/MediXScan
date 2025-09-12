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
  }
};

export default rbacService;
