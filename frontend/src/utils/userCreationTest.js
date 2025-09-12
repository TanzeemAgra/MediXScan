// User Creation Test Utility
// This script helps debug and test the user creation functionality

// Test user creation directly through the API
async function testUserCreation() {
    const testUserData = {
        username: `testuser_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        first_name: 'Test',
        last_name: 'User',
        password: 'password123',
        department: 'Testing',
        is_active: true,
        is_approved: true,
        roles: ['technician']
    };

    console.log('🧪 Testing user creation with data:', testUserData);

    try {
        // Test backend API directly
        const response = await fetch('http://localhost:8000/api/rbac/users/create-advanced/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'mock-token'}`
            },
            body: JSON.stringify(testUserData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Direct API test successful:', result);
            return { success: true, result };
        } else {
            const errorData = await response.json();
            console.error('❌ Direct API test failed:', errorData);
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('❌ Network error during API test:', error);
        return { success: false, error: error.message };
    }
}

// Test rbacService
async function testRBACService() {
    try {
        // Import rbacService (if available)
        if (window.rbacService) {
            const testData = {
                username: `rbactest_${Date.now()}`,
                email: `rbactest${Date.now()}@example.com`,
                first_name: 'RBAC',
                last_name: 'Test',
                password: 'password123',
                department: 'Testing'
            };

            console.log('🧪 Testing rbacService with data:', testData);
            const result = await window.rbacService.createAdvancedUser(testData);
            console.log('✅ rbacService test successful:', result);
            return { success: true, result };
        } else {
            console.warn('⚠️ rbacService not available on window object');
            return { success: false, error: 'rbacService not available' };
        }
    } catch (error) {
        console.error('❌ rbacService test failed:', error);
        return { success: false, error: error.message };
    }
}

// Combined test function
async function runAllTests() {
    console.log('🚀 Starting comprehensive user creation tests...');
    
    const apiTest = await testUserCreation();
    const rbacTest = await testRBACService();
    
    const results = {
        apiTest,
        rbacTest,
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Test Results Summary:', results);
    return results;
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
    window.testUserCreation = testUserCreation;
    window.testRBACService = testRBACService;
    window.runAllTests = runAllTests;
    console.log('🛠️ User creation test utilities loaded. Available functions:');
    console.log('  - testUserCreation()');
    console.log('  - testRBACService()');
    console.log('  - runAllTests()');
}

export { testUserCreation, testRBACService, runAllTests };
