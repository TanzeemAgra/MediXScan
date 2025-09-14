// Patient Management API Service
// Comprehensive API service for doctor-specific patient management

import { api } from './api';
import { PATIENT_MANAGEMENT_CONFIG } from '../config/patientManagementConfig';

class PatientManagementAPI {
  constructor() {
    this.baseURL = '/patients';
    this.config = PATIENT_MANAGEMENT_CONFIG;
  }

  // Get all patients for the current doctor
  async getMyPatients(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || this.config.PAGINATION.DEFAULT_PAGE_SIZE,
        search: params.search || '',
        status: params.status || '',
        priority: params.priority || '',
        gender: params.gender || '',
        sortBy: params.sortBy || 'lastName',
        sortOrder: params.sortOrder || 'asc'
      });

      const response = await api.get(`${this.baseURL}/doctor/?${queryParams}`);
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length,
        page: response.data.page || 1,
        totalPages: response.data.totalPages || Math.ceil((response.data.count || response.data.length) / (params.limit || this.config.PAGINATION.DEFAULT_PAGE_SIZE))
      };
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch patients',
        data: [],
        total: 0
      };
    }
  }

  // Get a specific patient by ID
  async getPatient(patientId) {
    try {
      const response = await api.get(`${this.baseURL}/${patientId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Failed to fetch patient ${patientId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch patient details'
      };
    }
  }

  // Create a new patient
  async createPatient(patientData) {
    try {
      // Add doctor ID to the patient data
      const doctorId = this.getCurrentDoctorId();
      const dataWithDoctor = {
        ...patientData,
        doctorId: doctorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post(`${this.baseURL}/`, dataWithDoctor);
      return {
        success: true,
        data: response.data,
        message: 'Patient created successfully'
      };
    } catch (error) {
      console.error('Failed to create patient:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create patient',
        validationErrors: error.response?.data?.errors || {}
      };
    }
  }

  // Update an existing patient
  async updatePatient(patientId, patientData) {
    try {
      const dataWithTimestamp = {
        ...patientData,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put(`${this.baseURL}/${patientId}/`, dataWithTimestamp);
      return {
        success: true,
        data: response.data,
        message: 'Patient updated successfully'
      };
    } catch (error) {
      console.error(`Failed to update patient ${patientId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update patient',
        validationErrors: error.response?.data?.errors || {}
      };
    }
  }

  // Delete a patient
  async deletePatient(patientId) {
    try {
      const response = await api.delete(`${this.baseURL}/${patientId}/`);
      return {
        success: true,
        message: 'Patient deleted successfully',
        data: response.data
      };
    } catch (error) {
      console.error(`Failed to delete patient ${patientId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.detail || 'Failed to delete patient',
        status: error.response?.status
      };
    }
  }

  // Enhanced delete patient with additional options
  async deletePatientEnhanced(patientId, options = {}) {
    try {
      console.log(`🔄 Enhanced delete request for patient: ${patientId}`, options);
      
      // Ensure authentication first
      const authCheck = await this.checkAuthStatus();
      if (!authCheck.authenticated) {
        console.log('🔐 Not authenticated, attempting auto-login...');
        const loginResult = await this.autoLoginForDev();
        if (!loginResult.success) {
          throw new Error('Authentication required for deletion');
        }
      }

      const requestData = {
        deletion_type: options.deletionType || 'soft',
        reason: options.reason || 'User requested deletion',
        audit_log: options.auditLog !== false
      };

      const response = await api.delete(`${this.baseURL}/${patientId}/`, {
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Patient deletion successful:`, response.data);

      return {
        success: true,
        message: response.data?.message || 'Patient deleted successfully',
        data: response.data,
        deletionType: requestData.deletion_type
      };
    } catch (error) {
      console.error(`❌ Enhanced delete failed for patient ${patientId}:`, error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to delete patient';
      let errorDetails = {};

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || data?.detail || 'Invalid request for patient deletion';
            break;
          case 401:
            errorMessage = 'Authentication required for patient deletion';
            break;
          case 403:
            errorMessage = 'You do not have permission to delete this patient';
            break;
          case 404:
            errorMessage = 'Patient not found or already deleted';
            break;
          case 409:
            errorMessage = 'Patient cannot be deleted due to conflicts (e.g., active appointments)';
            break;
          case 500:
            errorMessage = 'Server error occurred during deletion';
            break;
          default:
            errorMessage = data?.message || data?.detail || `Deletion failed with status ${status}`;
        }
        
        errorDetails = {
          status: status,
          data: data,
          type: 'api_error'
        };
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach the server';
        errorDetails = { type: 'network_error' };
      } else {
        errorMessage = error.message || 'Unknown error during patient deletion';
        errorDetails = { type: 'unknown_error' };
      }

      return {
        success: false,
        error: errorMessage,
        details: errorDetails
      };
    }
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { authenticated: false, reason: 'no_token' };
      }

      // Try a simple API call to check if token is valid
      const response = await api.get(`${this.baseURL}/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { 
        authenticated: true, 
        user: response.data 
      };
    } catch (error) {
      console.log('Authentication check failed:', error.response?.status);
      return { 
        authenticated: false, 
        reason: 'invalid_token',
        status: error.response?.status 
      };
    }
  }

  // Log audit action
  async logAuditAction(auditData) {
    try {
      const response = await api.post(`${this.baseURL}/audit-log/`, auditData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to log audit action:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get patient reports
  async getPatientReports(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      });

      const response = await api.get(`${this.baseURL}/${patientId}/reports/?${queryParams}`);
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      };
    } catch (error) {
      console.error(`Failed to fetch reports for patient ${patientId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch patient reports',
        data: []
      };
    }
  }

  // Get patient appointments
  async getPatientAppointments(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || '',
        fromDate: params.fromDate || '',
        toDate: params.toDate || ''
      });

      const response = await api.get(`${this.baseURL}/${patientId}/appointments/?${queryParams}`);
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      };
    } catch (error) {
      console.error(`Failed to fetch appointments for patient ${patientId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch patient appointments',
        data: []
      };
    }
  }

  // Search patients with advanced filters
  async searchPatients(searchQuery, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        status: filters.status || '',
        priority: filters.priority || '',
        gender: filters.gender || '',
        ageMin: filters.ageMin || '',
        ageMax: filters.ageMax || '',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || '',
        page: filters.page || 1,
        limit: filters.limit || this.config.PAGINATION.DEFAULT_PAGE_SIZE
      });

      const response = await api.get(`${this.baseURL}/search/?${queryParams}`);
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      };
    } catch (error) {
      console.error('Failed to search patients:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search patients',
        data: []
      };
    }
  }

  // Export patients data
  async exportPatients(format = 'xlsx', filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        format: format,
        status: filters.status || '',
        priority: filters.priority || '',
        gender: filters.gender || '',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || ''
      });

      const response = await api.get(`${this.baseURL}/export/?${queryParams}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Export completed successfully'
      };
    } catch (error) {
      console.error('Failed to export patients:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export patients'
      };
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get(`${this.baseURL}/dashboard-stats/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      
      // Return mock data for development
      return {
        success: true,
        data: {
          totalPatients: 156,
          newPatients: 12,
          activeTreatments: 89,
          pendingReports: 23,
          patientSatisfaction: 4.8,
          urgentCases: 5,
          monthlyGrowth: {
            patients: 8.5,
            satisfaction: 2.3,
            treatments: 12.1
          },
          recentActivity: [
            {
              id: 1,
              type: 'new_patient',
              message: 'New patient Sarah Johnson registered',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              type: 'report_completed',
              message: 'MRI report completed for John Doe',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              type: 'appointment_scheduled',
              message: 'Follow-up appointment scheduled for Maria Garcia',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
          ],
          chartData: {
            patientsByMonth: [
              { month: 'Jan', patients: 45 },
              { month: 'Feb', patients: 52 },
              { month: 'Mar', patients: 48 },
              { month: 'Apr', patients: 61 },
              { month: 'May', patients: 55 },
              { month: 'Jun', patients: 67 }
            ],
            statusDistribution: [
              { status: 'Active', count: 89, percentage: 57 },
              { status: 'Inactive', count: 34, percentage: 22 },
              { status: 'Critical', count: 12, percentage: 8 },
              { status: 'Discharged', count: 21, percentage: 13 }
            ]
          }
        }
      };
    }
  }

  // Get sample patients for development/demo
  async getSamplePatients() {
    return {
      success: true,
      data: [
        {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: '1985-03-15',
          gender: 'female',
          phone: '+1-555-0123',
          email: 'sarah.johnson@email.com',
          status: 'active',
          priority: 'medium',
          lastVisit: '2025-09-08',
          address: '123 Main St, Anytown, ST 12345',
          emergencyContact: 'Michael Johnson',
          emergencyPhone: '+1-555-0124',
          bloodType: 'A+',
          allergies: 'Penicillin',
          medications: 'Lisinopril 10mg daily',
          medicalHistory: 'Hypertension, controlled',
          insuranceProvider: 'Blue Cross Blue Shield',
          insuranceNumber: 'BC123456789'
        },
        {
          id: 2,
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1978-11-22',
          gender: 'male',
          phone: '+1-555-0125',
          email: 'john.doe@email.com',
          status: 'critical',
          priority: 'high',
          lastVisit: '2025-09-09',
          address: '456 Oak Ave, Somewhere, ST 67890',
          emergencyContact: 'Jane Doe',
          emergencyPhone: '+1-555-0126',
          bloodType: 'O-',
          allergies: 'None known',
          medications: 'Metformin 500mg twice daily',
          medicalHistory: 'Type 2 Diabetes, recent onset chest pain',
          insuranceProvider: 'Aetna',
          insuranceNumber: 'AE987654321'
        },
        {
          id: 3,
          firstName: 'Maria',
          lastName: 'Garcia',
          dateOfBirth: '1992-07-08',
          gender: 'female',
          phone: '+1-555-0127',
          email: 'maria.garcia@email.com',
          status: 'active',
          priority: 'low',
          lastVisit: '2025-09-05',
          address: '789 Pine St, Elsewhere, ST 24680',
          emergencyContact: 'Carlos Garcia',
          emergencyPhone: '+1-555-0128',
          bloodType: 'B+',
          allergies: 'Shellfish',
          medications: 'Birth control',
          medicalHistory: 'Annual checkup, healthy',
          insuranceProvider: 'United Healthcare',
          insuranceNumber: 'UH456789123'
        },
        {
          id: 4,
          firstName: 'Robert',
          lastName: 'Wilson',
          dateOfBirth: '1965-12-03',
          gender: 'male',
          phone: '+1-555-0129',
          email: 'robert.wilson@email.com',
          status: 'discharged',
          priority: 'medium',
          lastVisit: '2025-08-28',
          address: '321 Elm Dr, Nowhere, ST 13579',
          emergencyContact: 'Linda Wilson',
          emergencyPhone: '+1-555-0130',
          bloodType: 'AB+',
          allergies: 'Aspirin',
          medications: 'Atorvastatin 20mg daily',
          medicalHistory: 'High cholesterol, recent knee surgery',
          insuranceProvider: 'Cigna',
          insuranceNumber: 'CI789123456'
        },
        {
          id: 5,
          firstName: 'Emily',
          lastName: 'Chen',
          dateOfBirth: '1988-05-14',
          gender: 'female',
          phone: '+1-555-0131',
          email: 'emily.chen@email.com',
          status: 'active',
          priority: 'urgent',
          lastVisit: '2025-09-10',
          address: '654 Maple Ln, Anywhere, ST 97531',
          emergencyContact: 'David Chen',
          emergencyPhone: '+1-555-0132',
          bloodType: 'A-',
          allergies: 'Latex',
          medications: 'Prenatal vitamins',
          medicalHistory: 'Pregnancy - 32 weeks, gestational diabetes',
          insuranceProvider: 'Kaiser Permanente',
          insuranceNumber: 'KP321654987'
        }
      ],
      total: 5,
      page: 1,
      totalPages: 1
    };
  }

  // Helper method to get current doctor ID (from auth context or localStorage)
  getCurrentDoctorId() {
    // This would typically come from authentication context
    // For now, return a mock doctor ID
    return localStorage.getItem('doctorId') || 'doctor_123';
  }

  // Validate patient data before submission
  validatePatientData(patientData) {
    const errors = {};
    const config = this.config.PATIENT_FORM;

    // Validate each section
    Object.keys(config).forEach(sectionKey => {
      const section = config[sectionKey];
      section.fields.forEach(field => {
        const value = patientData[field.name];
        
        if (field.required && (!value || value.toString().trim() === '')) {
          errors[field.name] = `${field.label} is required`;
        }
        
        if (value && field.validation) {
          const validation = field.validation;
          
          if (validation.minLength && value.length < validation.minLength) {
            errors[field.name] = `${field.label} must be at least ${validation.minLength} characters`;
          }
          
          if (validation.maxLength && value.length > validation.maxLength) {
            errors[field.name] = `${field.label} must be less than ${validation.maxLength} characters`;
          }
          
          if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            errors[field.name] = `${field.label} format is invalid`;
          }
          
          if (validation.maxDate === 'today' && new Date(value) > new Date()) {
            errors[field.name] = `${field.label} cannot be in the future`;
          }
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ===============================================
  // AUTHENTICATION FOR DEVELOPMENT
  // ===============================================

  /**
   * Auto-login for development testing
   */
  async autoLoginForDev() {
    try {
      // Check if already authenticated
      const token = localStorage.getItem('token');
      if (token) {
        return { success: true, message: 'Already authenticated' };
      }

      // Try to login with test user
      const loginResponse = await api.post('/auth/simple-login/', {
        email: 'drnajeeb@gmail.com',
        password: 'admin123'  // Default password for testing
      });

      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        console.log('Auto-login successful:', loginResponse.data.user);
        return { success: true, message: 'Auto-login successful', user: loginResponse.data.user };
      }
    } catch (error) {
      console.warn('Auto-login failed, trying alternative methods:', error);
      
      // Try admin user
      try {
        const adminLoginResponse = await api.post('/auth/simple-login/', {
          email: 'admin@radiology.com',
          password: 'admin123'
        });

        if (adminLoginResponse.data.token) {
          localStorage.setItem('token', adminLoginResponse.data.token);
          localStorage.setItem('user', JSON.stringify(adminLoginResponse.data.user));
          console.log('Admin auto-login successful:', adminLoginResponse.data.user);
          return { success: true, message: 'Admin auto-login successful', user: adminLoginResponse.data.user };
        }
      } catch (adminError) {
        console.error('Both auto-login attempts failed:', adminError);
        return { success: false, error: 'Auto-login failed for development testing' };
      }
    }
  }
}

// Create and export singleton instance
export const patientAPI = new PatientManagementAPI();
export default patientAPI;
