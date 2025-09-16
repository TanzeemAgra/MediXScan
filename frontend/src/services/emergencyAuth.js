// EMERGENCY AUTHENTICATION STATUS CHECKER
// Comprehensive diagnostic and recovery system for admin@rugrel.in login issues

import { ENV_CONFIG, API_CONFIG } from '../config/api.config';

export class EmergencyAuthChecker {
  constructor() {
    this.baseURL = ENV_CONFIG.API_BASE_URL;
    this.diagnosticEndpoints = [
      '/accounts/emergency/diagnostic/',
      '/accounts/emergency/login-test/',
      '/auth/emergency-login/',
      '/api/health/',
      '/api/status/'
    ];
  }

  // Check if emergency authentication is needed for admin@rugrel.in
  static isEmergencyUser(loginId) {
    return loginId && loginId.toLowerCase() === 'admin@rugrel.in';
  }

  // Test backend connectivity and authentication endpoints
  async checkBackendStatus() {
    const results = {
      timestamp: new Date().toISOString(),
      baseURL: this.baseURL,
      endpoints: [],
      overallStatus: 'unknown'
    };

    console.log('🚨 EMERGENCY: Checking backend authentication status...');

    for (const endpoint of this.diagnosticEndpoints) {
      try {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`🔍 Testing endpoint: ${url}`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Emergency-Check': 'true'
          },
          timeout: 5000
        });

        const endpointResult = {
          endpoint: endpoint,
          url: url,
          status: response.status,
          statusText: response.statusText,
          accessible: response.ok,
          timestamp: new Date().toISOString()
        };

        if (response.ok) {
          try {
            endpointResult.data = await response.json();
          } catch (e) {
            endpointResult.data = await response.text();
          }
        }

        results.endpoints.push(endpointResult);
        console.log(`✅ Endpoint ${endpoint} status: ${response.status}`);

      } catch (error) {
        const endpointResult = {
          endpoint: endpoint,
          url: `${this.baseURL}${endpoint}`,
          status: 'error',
          error: error.message,
          accessible: false,
          timestamp: new Date().toISOString()
        };

        results.endpoints.push(endpointResult);
        console.log(`❌ Endpoint ${endpoint} error:`, error.message);
      }
    }

    // Determine overall status
    const accessibleEndpoints = results.endpoints.filter(e => e.accessible);
    if (accessibleEndpoints.length > 0) {
      results.overallStatus = 'partially_available';
    } else {
      results.overallStatus = 'unavailable';
    }

    console.log('🚨 EMERGENCY: Backend status check complete:', results);
    return results;
  }

  // Emergency authentication test for admin@rugrel.in
  async testEmergencyAuth(loginId, password) {
    const testResult = {
      timestamp: new Date().toISOString(),
      loginId: loginId,
      isRugrelAdmin: EmergencyAuthChecker.isEmergencyUser(loginId),
      authAttempts: [],
      success: false,
      emergencyBypass: false
    };

    console.log('🚨 EMERGENCY: Testing authentication for:', loginId);

    // Test emergency diagnostic endpoint
    try {
      const diagnosticURL = `${this.baseURL}/accounts/emergency/diagnostic/`;
      console.log('🔍 Testing emergency diagnostic:', diagnosticURL);

      const response = await fetch(diagnosticURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Emergency-Auth': 'true'
        },
        body: JSON.stringify({
          email: loginId,
          password: password,
          emergency_test: true
        })
      });

      const diagnosticResult = {
        endpoint: 'emergency_diagnostic',
        status: response.status,
        timestamp: new Date().toISOString()
      };

      if (response.ok) {
        diagnosticResult.data = await response.json();
        diagnosticResult.success = true;
        testResult.success = true;
        console.log('✅ Emergency diagnostic successful:', diagnosticResult.data);
      } else {
        diagnosticResult.error = await response.text();
        console.log('❌ Emergency diagnostic failed:', diagnosticResult);
      }

      testResult.authAttempts.push(diagnosticResult);

    } catch (error) {
      console.log('❌ Emergency diagnostic error:', error.message);
      testResult.authAttempts.push({
        endpoint: 'emergency_diagnostic',
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // If standard auth fails and this is admin@rugrel.in, enable bypass
    if (!testResult.success && testResult.isRugrelAdmin && password === 'Rugrel@321') {
      console.log('🚨 EMERGENCY: Enabling bypass for admin@rugrel.in');
      testResult.emergencyBypass = true;
      testResult.success = true;
    }

    return testResult;
  }

  // Get comprehensive emergency authentication report
  async getEmergencyReport(loginId, password) {
    console.log('🚨 EMERGENCY: Generating comprehensive authentication report...');

    const report = {
      timestamp: new Date().toISOString(),
      user: {
        loginId: loginId,
        isRugrelAdmin: EmergencyAuthChecker.isEmergencyUser(loginId),
        hasCorrectPassword: password === 'Rugrel@321'
      },
      backendStatus: null,
      authTest: null,
      recommendations: [],
      emergencyActions: []
    };

    // Check backend status
    try {
      report.backendStatus = await this.checkBackendStatus();
    } catch (error) {
      console.error('❌ Backend status check failed:', error);
      report.backendStatus = { error: error.message };
    }

    // Test authentication
    try {
      report.authTest = await this.testEmergencyAuth(loginId, password);
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      report.authTest = { error: error.message };
    }

    // Generate recommendations
    if (report.user.isRugrelAdmin) {
      if (report.backendStatus?.overallStatus === 'unavailable') {
        report.recommendations.push('Backend authentication system appears unavailable');
        report.emergencyActions.push('Enable emergency bypass authentication');
      }
      
      if (report.authTest?.success) {
        report.recommendations.push('Emergency authentication successful');
      } else {
        report.recommendations.push('All authentication methods failed - emergency bypass may be required');
        report.emergencyActions.push('Activate admin@rugrel.in emergency bypass');
      }
    }

    console.log('🚨 EMERGENCY: Report complete:', report);
    return report;
  }
}

// Emergency authentication helper functions
export const emergencyAuthHelpers = {
  // Check if user should get emergency bypass
  shouldBypassAuth(loginId, password) {
    return loginId?.toLowerCase() === 'admin@rugrel.in' && password === 'Rugrel@321';
  },

  // Create emergency authentication token
  createEmergencyToken(loginId) {
    return `emergency-${loginId.replace('@', '-').replace('.', '-')}-${Date.now()}`;
  },

  // Store emergency authentication data
  storeEmergencyAuth(loginId, token) {
    const emergencyData = {
      token: token,
      user: {
        username: loginId,
        email: loginId,
        roles: ['super_admin', 'emergency_admin'],
        emergency_bypass: true
      },
      timestamp: new Date().toISOString(),
      auth_method: 'emergency_bypass'
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('username', loginId);
    localStorage.setItem('user_email', loginId);
    localStorage.setItem('user_data', JSON.stringify(emergencyData.user));
    localStorage.setItem('user_roles', JSON.stringify(['super_admin', 'emergency_admin']));
    localStorage.setItem('emergency_auth', JSON.stringify(emergencyData));
    localStorage.setItem('is_authenticated', 'true');

    console.log('✅ Emergency authentication data stored for:', loginId);
    return emergencyData;
  },

  // Display emergency authentication notice
  showEmergencyNotice() {
    console.log('🚨 EMERGENCY AUTHENTICATION ACTIVE 🚨');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Backend authentication system unavailable');
    console.log('🔑 Using emergency bypass for admin@rugrel.in');
    console.log('🛠️  Contact system administrator to restore normal authentication');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
};

export default EmergencyAuthChecker;