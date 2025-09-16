// Direct API Test for Login
// Test login functionality bypassing form issues

import { loginAPI } from '../services/api.js';

const testDirectLogin = async () => {
  console.log('🧪 Testing direct login API call...');
  
  try {
    const result = await loginAPI('tanzeem.agra@rugrel.com', 'Tanzilla@tanzeem786');
    console.log('✅ Direct API login successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Direct API login failed:', error);
    return null;
  }
};

// Auto-run test
testDirectLogin();

export default testDirectLogin;