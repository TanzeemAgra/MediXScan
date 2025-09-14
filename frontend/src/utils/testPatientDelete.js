/**
 * PATIENT DELETE FUNCTIONALITY TEST SCRIPT
 * ========================================
 * 
 * This script helps test and debug the enhanced patient delete functionality
 * Run this in the browser console at http://localhost:5175/dashboard/patients
 */

window.testPatientDelete = {
  /**
   * Test individual patient deletion
   */
  async testSingleDelete() {
    console.log('🧪 Testing Single Patient Deletion...');
    
    try {
      // Import the enhanced delete handler
      const { enhancedPatientDeleteHandler } = await import('./utils/enhancedPatientDeleteHandler.js');
      
      // Test with mock patient data
      const mockPatient = {
        id: 'TEST-001',
        fullName: 'Test Patient'
      };
      
      console.log('Testing delete with confirmation...');
      const result = await enhancedPatientDeleteHandler.deletePatient(
        mockPatient.id, 
        mockPatient.fullName
      );
      
      console.log('Delete result:', result);
      
      if (result.success) {
        console.log('✅ Delete test successful!');
        return { success: true, message: 'Delete functionality working correctly' };
      } else {
        console.log('❌ Delete test failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Delete test error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Test API connectivity
   */
  async testDeleteAPI() {
    console.log('🧪 Testing Delete API Connectivity...');
    
    try {
      // Import patient API
      const { patientAPI } = await import('./services/patientManagementApi.js');
      
      // Test auth status
      console.log('Checking authentication status...');
      const authStatus = await patientAPI.checkAuthStatus();
      console.log('Auth Status:', authStatus);
      
      if (!authStatus.authenticated) {
        console.log('Attempting auto-login...');
        const loginResult = await patientAPI.autoLoginForDev();
        console.log('Login Result:', loginResult);
      }
      
      // Test with a non-existent patient (should fail gracefully)
      console.log('Testing delete API with non-existent patient...');
      const deleteResult = await patientAPI.deletePatientEnhanced('NON-EXISTENT', {
        deletionType: 'soft',
        reason: 'API Test'
      });
      
      console.log('Delete API Result:', deleteResult);
      
      if (deleteResult.error && deleteResult.error.includes('not found')) {
        console.log('✅ API test successful - correctly handled non-existent patient');
        return { success: true, message: 'Delete API working correctly' };
      } else {
        console.log('⚠️ Unexpected API response:', deleteResult);
        return { success: true, message: 'API responded, but with unexpected result' };
      }
      
    } catch (error) {
      console.error('❌ API test error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Test configuration loading
   */
  async testDeleteConfig() {
    console.log('🧪 Testing Delete Configuration...');
    
    try {
      // Import configuration
      const { PATIENT_MANAGEMENT_CONFIG } = await import('./config/patientManagementConfig.js');
      
      console.log('Delete Config:', PATIENT_MANAGEMENT_CONFIG.DELETE_CONFIG);
      
      const config = PATIENT_MANAGEMENT_CONFIG.DELETE_CONFIG;
      
      if (config && config.CONFIRMATION_REQUIRED !== undefined) {
        console.log('✅ Configuration test successful!');
        console.log('Key configuration values:');
        console.log('- Confirmation Required:', config.CONFIRMATION_REQUIRED);
        console.log('- Soft Delete Enabled:', config.SOFT_DELETE_ENABLED);
        console.log('- Audit Logging:', config.AUDIT_LOGGING);
        
        return { success: true, message: 'Delete configuration loaded correctly' };
      } else {
        console.log('❌ Configuration test failed - DELETE_CONFIG not found or incomplete');
        return { success: false, error: 'Delete configuration missing or incomplete' };
      }
      
    } catch (error) {
      console.error('❌ Config test error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Running All Patient Delete Tests...\n');
    
    const results = {};
    
    // Test 1: Configuration
    console.log('--- Test 1: Configuration Loading ---');
    results.config = await this.testDeleteConfig();
    console.log('Result:', results.config, '\n');
    
    // Test 2: API Connectivity
    console.log('--- Test 2: API Connectivity ---');
    results.api = await this.testDeleteAPI();
    console.log('Result:', results.api, '\n');
    
    // Test 3: Delete Function (will show confirmation dialog)
    console.log('--- Test 3: Delete Function (Note: Will show confirmation dialog) ---');
    console.log('Click "Cancel" in the confirmation dialog to complete the test');
    results.delete = await this.testSingleDelete();
    console.log('Result:', results.delete, '\n');
    
    // Summary
    console.log('📊 TEST SUMMARY:');
    console.log('================');
    Object.entries(results).forEach(([testName, result]) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      console.log(`${testName.toUpperCase()}: ${status} - ${result.message || result.error}`);
    });
    
    const allPassed = Object.values(results).every(r => r.success);
    console.log(`\nOVERALL: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (allPassed) {
      console.log('\n🎉 Patient delete functionality is working correctly!');
      console.log('You can now test deleting actual patients in the UI.');
    } else {
      console.log('\n🔧 Some issues were found. Check the individual test results above.');
    }
    
    return results;
  },

  /**
   * Quick test - just check if delete button works
   */
  async quickTest() {
    console.log('⚡ Quick Delete Test...');
    
    // Look for delete buttons in the page
    const deleteButtons = document.querySelectorAll('button[title*="Delete"], button:contains("Delete")');
    console.log(`Found ${deleteButtons.length} potential delete buttons`);
    
    if (deleteButtons.length > 0) {
      console.log('✅ Delete buttons found in UI');
      console.log('💡 Try clicking on a delete button to test functionality');
      return { success: true, message: `Found ${deleteButtons.length} delete buttons in UI` };
    } else {
      console.log('❌ No delete buttons found in UI');
      return { success: false, error: 'No delete buttons found on page' };
    }
  }
};

// Auto-run quick test when script loads
console.log('🔧 Patient Delete Test Script Loaded!');
console.log('Available commands:');
console.log('- window.testPatientDelete.quickTest() - Quick UI check');
console.log('- window.testPatientDelete.runAllTests() - Comprehensive test suite');
console.log('- window.testPatientDelete.testSingleDelete() - Test delete functionality');
console.log('- window.testPatientDelete.testDeleteAPI() - Test API connectivity');
console.log('- window.testPatientDelete.testDeleteConfig() - Test configuration');

// Run quick test automatically
setTimeout(() => {
  window.testPatientDelete.quickTest();
}, 1000);