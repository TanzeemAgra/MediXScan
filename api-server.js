// Complete backend server for authentication and RBAC
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Mock database - Single Super Admin User Only
let mockUsers = [
  {
    id: 1,
    username: 'tanzeem.agra@rugrel.com',
    email: 'tanzeem.agra@rugrel.com',
    password: 'Tanzilla@tanzeem786', // In real app, this would be hashed
    first_name: 'Tanzeem',
    last_name: 'Agra',
    department: 'Administration',
    employee_id: 'SA001',
    phone_number: '+1-555-0100',
    is_active: true,
    is_approved: true,
    is_superuser: true,
    is_staff: true,
    roles: ['super_admin'],
    permissions: ['all'],
    created_at: new Date().toISOString(),
    last_login: null
  }
];

// Middleware
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint hit - api-server.js');
  res.json({ 
    message: 'Complete backend server is running!',
    server: 'api-server.js',
    timestamp: new Date().toISOString(),
    superAdminExists: mockUsers.length > 0 ? mockUsers[0].is_superuser : false
  });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Primary login endpoint
app.post('/api/auth/login/', (req, res) => {
  console.log('🔐 Login attempt:', req.body.username);
  const { username, password } = req.body;
  
  // Find user
  const user = mockUsers.find(u => 
    (u.username === username || u.email === username) && u.password === password
  );
  
  if (user) {
    console.log('✅ Login successful for:', username);
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        department: user.department,
        employee_id: user.employee_id,
        phone_number: user.phone_number,
        permissions: user.permissions
      },
      token: 'mock-jwt-token-' + Date.now(),
      access: 'mock-access-token',
      refresh: 'mock-refresh-token'
    });
  } else {
    console.log('❌ Login failed for:', username);
    res.status(401).json({
      success: false,
      error: 'Invalid username or password'
    });
  }
});

// Emergency login endpoint
app.post('/api/auth/emergency-login/', (req, res) => {
  console.log('🚨 Emergency login attempt:', req.body.username);
  const { username } = req.body;
  
  // For emergency login, just check if user exists
  const user = mockUsers.find(u => u.username === username || u.email === username);
  
  if (user) {
    console.log('✅ Emergency login successful for:', username);
    res.json({
      success: true,
      message: 'Emergency login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        department: user.department,
        employee_id: user.employee_id,
        phone_number: user.phone_number,
        permissions: user.permissions
      },
      token: 'emergency-jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'User not found'
    });
  }
});

// Simple login endpoint
app.post('/api/auth/simple-login/', (req, res) => {
  console.log('🔓 Simple login attempt:', req.body.username);
  const { username, password } = req.body;
  
  // Simple login with basic validation
  if (username && password) {
    const user = mockUsers.find(u => u.username === username || u.email === username);
    
    if (user) {
      console.log('✅ Simple login successful for:', username);
      res.json({
        success: true,
        message: 'Simple login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: user.roles,
          is_active: user.is_active,
          is_superuser: user.is_superuser,
          is_staff: user.is_staff,
          department: user.department,
          employee_id: user.employee_id,
          phone_number: user.phone_number,
          permissions: user.permissions
        },
        token: 'simple-jwt-token-' + Date.now()
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      error: 'Username and password required'
    });
  }
});

// Token verification endpoint
app.post('/api/auth/verify-token/', (req, res) => {
  console.log('🔍 Token verification request');
  const { token } = req.body;
  
  if (token && token.startsWith('mock-')) {
    res.json({
      success: true,
      valid: true,
      user: mockUsers[0] // Return admin user for any valid token
    });
  } else {
    res.status(401).json({
      success: false,
      valid: false,
      error: 'Invalid token'
    });
  }
});

// User profile endpoint
app.get('/api/auth/profile/', (req, res) => {
  console.log('👤 Profile request');
  
  // In a real app, you'd verify the JWT token here
  // For now, just return the super admin user
  const superAdmin = mockUsers.find(u => u.email === 'tanzeem.agra@rugrel.com');
  
  if (superAdmin) {
    res.json({
      id: superAdmin.id,
      username: superAdmin.username,
      email: superAdmin.email,
      first_name: superAdmin.first_name,
      last_name: superAdmin.last_name,
      roles: superAdmin.roles,
      is_active: superAdmin.is_active,
      is_superuser: superAdmin.is_superuser,
      is_staff: superAdmin.is_staff,
      department: superAdmin.department,
      employee_id: superAdmin.employee_id,
      phone_number: superAdmin.phone_number,
      permissions: superAdmin.permissions
    });
  } else {
    res.status(404).json({
      error: 'User profile not found'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout/', (req, res) => {
  console.log('👋 Logout request');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ==================== RBAC ENDPOINTS ====================

// Get Roles
app.get('/api/rbac/roles/', (req, res) => {
  console.log('👑 Roles list requested');
  res.json({
    roles: [
      {
        id: 1,
        name: 'super_admin',
        display_name: 'Super Administrator',
        description: 'Full system access and user management',
        permissions: ['create_user', 'delete_user', 'modify_user', 'view_all']
      },
      {
        id: 2,
        name: 'admin',
        display_name: 'Administrator', 
        description: 'Administrative access with user management',
        permissions: ['create_user', 'modify_user', 'view_all']
      },
      {
        id: 3,
        name: 'doctor',
        display_name: 'Doctor',
        description: 'Medical professional access',
        permissions: ['view_reports', 'create_reports', 'modify_own_reports']
      },
      {
        id: 4,
        name: 'radiologist',
        display_name: 'Radiologist',
        description: 'Radiology specialist access',
        permissions: ['view_images', 'analyze_images', 'create_reports']
      },
      {
        id: 5,
        name: 'technician',
        display_name: 'Technician',
        description: 'Equipment and scan operator',
        permissions: ['operate_equipment', 'upload_scans']
      },
      {
        id: 6,
        name: 'user',
        display_name: 'Regular User',
        description: 'Basic system access',
        permissions: ['view_own_data']
      }
    ]
  });
});

// RBAC Dashboard Stats
app.get('/api/rbac/dashboard-stats/', (req, res) => {
  console.log('📊 Dashboard stats requested');
  res.json({
    total_users: mockUsers.length,
    active_users: mockUsers.filter(u => u.is_active).length,
    total_roles: 6,
    active_sessions: 1,
    security_events: 0
  });
});

// Create Advanced User
app.post('/api/rbac/users/create-advanced/', (req, res) => {
  console.log('👤 Creating user:', req.body.username);
  const userData = req.body;
  
  // Check for duplicates
  if (mockUsers.find(u => u.username === userData.username)) {
    return res.status(400).json({
      success: false,
      error: 'Username already exists'
    });
  }
  
  if (mockUsers.find(u => u.email === userData.email)) {
    return res.status(400).json({
      success: false,
      error: 'Email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    username: userData.username,
    email: userData.email,
    password: userData.password || 'defaultpass123',
    first_name: userData.first_name,
    last_name: userData.last_name,
    department: userData.department || '',
    employee_id: userData.employee_id || '',
    phone_number: userData.phone_number || '',
    is_active: userData.is_active ?? true,
    is_approved: userData.is_approved ?? true,
    roles: userData.roles || [],
    created_at: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  console.log('✅ User created successfully:', newUser.username);
  console.log('📊 Total users now:', mockUsers.length);
  
  res.json({
    success: true,
    message: 'User created successfully',
    user: {
      ...newUser,
      password: '[HIDDEN]' // Don't return password
    }
  });
});

// Get Users
app.get('/api/rbac/users/advanced/', (req, res) => {
  console.log('👥 Users list requested');
  const usersWithoutPasswords = mockUsers.map(user => ({
    ...user,
    password: '[HIDDEN]'
  }));
  
  res.json({
    users: usersWithoutPasswords,
    total: mockUsers.length
  });
});

// ==================== USER MANAGEMENT ENDPOINTS ====================

// Get current user profile
app.get('/api/auth/user/', (req, res) => {
  console.log('👤 User profile requested');
  res.json({
    success: true,
    user: mockUsers[0] // Return admin user
  });
});

// Update user profile
app.put('/api/auth/user/', (req, res) => {
  console.log('📝 User profile update requested');
  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: mockUsers[0]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Complete backend server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('  ================== AUTHENTICATION ==================');
  console.log('  - POST /api/auth/login/');
  console.log('  - POST /api/auth/emergency-login/');
  console.log('  - POST /api/auth/simple-login/');
  console.log('  - GET  /api/auth/profile/');
  console.log('  - POST /api/auth/verify-token/');
  console.log('  - POST /api/auth/logout/');
  console.log('  - GET  /api/auth/user/');
  console.log('  - PUT  /api/auth/user/');
  console.log('  ==================== RBAC =====================');
  console.log('  - GET  /api/rbac/roles/');
  console.log('  - GET  /api/rbac/dashboard-stats/');
  console.log('  - POST /api/rbac/users/create-advanced/');
  console.log('  - GET  /api/rbac/users/advanced/');
  console.log('  ==================== TEST ====================');
  console.log('  - GET  /api/test');
  console.log('');
  console.log('🔐 Super Admin Login Credentials:');
  console.log('  Username: tanzeem.agra@rugrel.com');
  console.log('  Password: Tanzilla@tanzeem786');
  console.log('');
  console.log('📋 Mock Users Database:');
  mockUsers.forEach(user => {
    console.log(`  - ${user.username} (${user.email}) - Roles: ${user.roles.join(', ')}`);
  });
  console.log('');
  console.log('✅ Server ready to handle login and user management requests!');
});
