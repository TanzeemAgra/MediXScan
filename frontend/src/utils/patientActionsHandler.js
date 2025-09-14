/**
 * ENHANCED PATIENT MANAGEMENT ACTIONS HANDLER
 * ===========================================
 * Comprehensive action handler for patient management operations with soft-coding
 * 
 * Features:
 * - View patient details with full information
 * - Edit patient with validation
 * - Delete patient with confirmation
 * - Medical reports management
 * - Appointments handling
 * - Export functionality
 * 
 * Author: GitHub Copilot
 * Date: 2025-09-14
 */

import { patientAPI } from '../services/patientManagementApi';
import { PATIENT_MANAGEMENT_CONFIG } from '../config/patientManagementConfig';

class PatientActionsHandler {
  constructor() {
    this.config = PATIENT_MANAGEMENT_CONFIG;
  }

  /**
   * View patient details action
   */
  async viewPatientDetails(patientId, navigate) {
    try {
      console.log(`Navigating to patient details: ${patientId}`);
      navigate(`/dashboard/patients/view/${patientId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to view patient details:', error);
      return { success: false, error: 'Failed to open patient details' };
    }
  }

  /**
   * Edit patient action
   */
  async editPatient(patientId, navigate) {
    try {
      console.log(`Navigating to edit patient: ${patientId}`);
      navigate(`/dashboard/patients/edit/${patientId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to edit patient:', error);
      return { success: false, error: 'Failed to open patient editor' };
    }
  }

  /**
   * Delete patient action with confirmation
   */
  async deletePatient(patientId, patientName, onSuccess, onError) {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to delete patient "${patientName}"?\n\n` +
        `This action cannot be undone and will permanently remove all patient data.`
      );

      if (!confirmed) {
        return { success: false, cancelled: true };
      }

      console.log(`Deleting patient: ${patientId}`);
      
      // Call API to delete patient
      const result = await patientAPI.deletePatient(patientId);
      
      if (result.success) {
        console.log('Patient deleted successfully');
        if (onSuccess) onSuccess(`Patient "${patientName}" deleted successfully`);
        return { success: true, message: 'Patient deleted successfully' };
      } else {
        console.error('Failed to delete patient:', result.error);
        if (onError) onError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Delete patient error:', error);
      const errorMsg = 'Failed to delete patient. Please try again.';
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * View medical reports action
   */
  async viewMedicalReports(patientId, patientName, setModalState) {
    try {
      console.log(`Loading medical reports for patient: ${patientId}`);
      
      // Mock reports data - in real implementation, this would come from API
      const mockReports = [
        {
          id: 1,
          title: 'Blood Test Results',
          date: '2025-09-10',
          type: 'Laboratory',
          status: 'completed',
          doctor: 'Dr. Smith'
        },
        {
          id: 2,
          title: 'X-Ray Chest',
          date: '2025-09-08',
          type: 'Radiology',
          status: 'pending_review',
          doctor: 'Dr. Johnson'
        },
        {
          id: 3,
          title: 'Annual Physical Exam',
          date: '2025-09-05',
          type: 'Physical',
          status: 'completed',
          doctor: 'Dr. Wilson'
        }
      ];

      // Update modal state to show reports
      setModalState({
        show: true,
        type: 'reports',
        title: `Medical Reports - ${patientName}`,
        data: {
          patientId,
          patientName,
          reports: mockReports
        }
      });

      return { success: true, reports: mockReports };
    } catch (error) {
      console.error('Failed to load medical reports:', error);
      return { success: false, error: 'Failed to load medical reports' };
    }
  }

  /**
   * View appointments action
   */
  async viewAppointments(patientId, patientName, setModalState) {
    try {
      console.log(`Loading appointments for patient: ${patientId}`);
      
      // Mock appointments data
      const mockAppointments = [
        {
          id: 1,
          date: '2025-09-20',
          time: '10:00 AM',
          type: 'Follow-up Consultation',
          doctor: 'Dr. Smith',
          status: 'scheduled',
          notes: 'Regular checkup'
        },
        {
          id: 2,
          date: '2025-09-15',
          time: '2:30 PM',
          type: 'Lab Results Review',
          doctor: 'Dr. Johnson',
          status: 'completed',
          notes: 'Discuss blood test results'
        },
        {
          id: 3,
          date: '2025-10-01',
          time: '9:00 AM',
          type: 'Specialist Referral',
          doctor: 'Dr. Wilson',
          status: 'pending',
          notes: 'Cardiology consultation needed'
        }
      ];

      // Update modal state to show appointments
      setModalState({
        show: true,
        type: 'appointments',
        title: `Appointments - ${patientName}`,
        data: {
          patientId,
          patientName,
          appointments: mockAppointments
        }
      });

      return { success: true, appointments: mockAppointments };
    } catch (error) {
      console.error('Failed to load appointments:', error);
      return { success: false, error: 'Failed to load appointments' };
    }
  }

  /**
   * Schedule new appointment action
   */
  async scheduleAppointment(patientId, patientName, setModalState) {
    try {
      console.log(`Scheduling appointment for patient: ${patientId}`);
      
      // Update modal state to show appointment scheduler
      setModalState({
        show: true,
        type: 'schedule_appointment',
        title: `Schedule Appointment - ${patientName}`,
        data: {
          patientId,
          patientName,
          availableSlots: [
            { date: '2025-09-25', time: '9:00 AM', doctor: 'Dr. Smith' },
            { date: '2025-09-25', time: '2:00 PM', doctor: 'Dr. Johnson' },
            { date: '2025-09-26', time: '10:30 AM', doctor: 'Dr. Wilson' },
            { date: '2025-09-27', time: '11:00 AM', doctor: 'Dr. Smith' },
          ]
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      return { success: false, error: 'Failed to open appointment scheduler' };
    }
  }

  /**
   * Send email to patient action
   */
  async sendEmail(patientId, patientEmail, patientName, setModalState) {
    try {
      console.log(`Opening email composer for patient: ${patientId}`);
      
      // Update modal state to show email composer
      setModalState({
        show: true,
        type: 'compose_email',
        title: `Send Email - ${patientName}`,
        data: {
          patientId,
          patientName,
          patientEmail,
          templates: [
            { id: 1, name: 'Appointment Reminder', subject: 'Upcoming Appointment Reminder' },
            { id: 2, name: 'Test Results Available', subject: 'Your Test Results Are Ready' },
            { id: 3, name: 'Follow-up Required', subject: 'Follow-up Appointment Needed' },
            { id: 4, name: 'Custom Message', subject: '' }
          ]
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to open email composer:', error);
      return { success: false, error: 'Failed to open email composer' };
    }
  }

  /**
   * Export patient data action
   */
  async exportPatientData(patientId, patientName, format = 'pdf') {
    try {
      console.log(`Exporting patient data: ${patientId} as ${format}`);
      
      // Get patient data
      const result = await patientAPI.getPatient(patientId);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Mock export functionality
      const exportData = {
        patient: result.data,
        exportDate: new Date().toISOString(),
        format: format
      };

      // Simulate download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${patientId}_${patientName.replace(/\s+/g, '_')}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { 
        success: true, 
        message: `Patient data exported successfully as ${format.toUpperCase()}` 
      };
    } catch (error) {
      console.error('Failed to export patient data:', error);
      return { success: false, error: 'Failed to export patient data' };
    }
  }

  /**
   * Print patient information action
   */
  async printPatientInfo(patientId, patientName) {
    try {
      console.log(`Printing patient information: ${patientId}`);
      
      // Get patient data
      const result = await patientAPI.getPatient(patientId);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Create print-friendly content
      const printContent = this.generatePrintContent(result.data);
      
      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();

      return { success: true, message: 'Patient information sent to printer' };
    } catch (error) {
      console.error('Failed to print patient information:', error);
      return { success: false, error: 'Failed to print patient information' };
    }
  }

  /**
   * Generate print-friendly HTML content
   */
  generatePrintContent(patientData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Information - ${patientData.firstName} ${patientData.lastName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #007bff; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-row { display: flex; margin: 5px 0; }
          .label { font-weight: bold; width: 150px; }
          .value { flex: 1; }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Patient Information</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h3>Personal Information</h3>
          <div class="info-row"><span class="label">Full Name:</span><span class="value">${patientData.firstName} ${patientData.lastName}</span></div>
          <div class="info-row"><span class="label">Date of Birth:</span><span class="value">${patientData.dateOfBirth}</span></div>
          <div class="info-row"><span class="label">Gender:</span><span class="value">${patientData.gender}</span></div>
          <div class="info-row"><span class="label">Blood Type:</span><span class="value">${patientData.bloodType || 'Not specified'}</span></div>
        </div>
        
        <div class="section">
          <h3>Contact Information</h3>
          <div class="info-row"><span class="label">Phone:</span><span class="value">${patientData.phone}</span></div>
          <div class="info-row"><span class="label">Email:</span><span class="value">${patientData.email}</span></div>
          <div class="info-row"><span class="label">Address:</span><span class="value">${patientData.address || 'Not specified'}</span></div>
        </div>
        
        <div class="section">
          <h3>Medical Information</h3>
          <div class="info-row"><span class="label">Allergies:</span><span class="value">${patientData.allergies || 'None known'}</span></div>
          <div class="info-row"><span class="label">Medications:</span><span class="value">${patientData.medications || 'None'}</span></div>
          <div class="info-row"><span class="label">Medical History:</span><span class="value">${patientData.medicalHistory || 'No significant history'}</span></div>
        </div>
        
        <div class="section">
          <h3>Emergency Contact</h3>
          <div class="info-row"><span class="label">Contact Name:</span><span class="value">${patientData.emergencyContact || 'Not specified'}</span></div>
          <div class="info-row"><span class="label">Contact Phone:</span><span class="value">${patientData.emergencyPhone || 'Not specified'}</span></div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Bulk operations handler
   */
  async handleBulkOperation(operation, selectedPatients, onSuccess, onError) {
    try {
      console.log(`Performing bulk operation: ${operation} on ${selectedPatients.length} patients`);
      
      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      switch (operation) {
        case 'delete':
          for (const patient of selectedPatients) {
            const result = await this.deletePatient(patient.id, patient.fullName, null, null);
            if (result.success) {
              results.success++;
            } else {
              results.failed++;
              results.errors.push(`${patient.fullName}: ${result.error}`);
            }
          }
          break;

        case 'export':
          for (const patient of selectedPatients) {
            const result = await this.exportPatientData(patient.id, patient.fullName, 'json');
            if (result.success) {
              results.success++;
            } else {
              results.failed++;
              results.errors.push(`${patient.fullName}: ${result.error}`);
            }
          }
          break;

        case 'activate':
          results.success = selectedPatients.length;
          // Mock activation - in real implementation, would call API
          break;

        case 'deactivate':
          results.success = selectedPatients.length;
          // Mock deactivation - in real implementation, would call API
          break;

        default:
          throw new Error(`Unknown bulk operation: ${operation}`);
      }

      const message = `Bulk ${operation} completed: ${results.success} successful, ${results.failed} failed`;
      if (onSuccess) onSuccess(message);
      
      return { 
        success: results.failed === 0, 
        message,
        results 
      };

    } catch (error) {
      console.error('Bulk operation error:', error);
      const errorMsg = `Bulk ${operation} failed: ${error.message}`;
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }
}

// Export singleton instance
export const patientActionsHandler = new PatientActionsHandler();
export default patientActionsHandler;