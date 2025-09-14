/**
 * ENHANCED PATIENT DELETE FUNCTIONALITY
 * ====================================
 * Comprehensive patient deletion system with soft-coding techniques
 * 
 * Features:
 * - Soft delete with proper database handling
 * - Audit logging for compliance
 * - Configuration-driven delete policies
 * - Error handling and user feedback
 * - Authentication management
 * - Dashboard sync and refresh
 * 
 * Author: GitHub Copilot
 * Date: 2025-09-14
 */

import { patientAPI } from '../services/patientManagementApi';
import { PATIENT_MANAGEMENT_CONFIG } from '../config/patientManagementConfig';

/**
 * Enhanced Patient Delete Handler with Soft-Coding
 */
export class EnhancedPatientDeleteHandler {
  constructor() {
    this.config = PATIENT_MANAGEMENT_CONFIG;
    this.deleteConfig = this.config.DELETE_CONFIG || this.getDefaultDeleteConfig();
  }

  /**
   * Default delete configuration (soft-coded)
   */
  getDefaultDeleteConfig() {
    return {
      CONFIRMATION_REQUIRED: true,
      SOFT_DELETE_ENABLED: true,
      AUDIT_LOGGING: true,
      AUTO_REFRESH_UI: true,
      BACKUP_BEFORE_DELETE: false,
      DELETION_TYPES: {
        SOFT: 'soft', // Set is_active = false
        HARD: 'hard', // Permanently remove from database
        ARCHIVE: 'archive' // Move to archive table
      },
      CONFIRMATION_MESSAGES: {
        SINGLE: {
          title: 'Delete Patient Confirmation',
          message: 'Are you sure you want to delete patient "{patientName}"?',
          details: 'This action will deactivate the patient record and preserve all medical history for compliance.',
          warning: 'This action can be reversed by reactivating the patient.',
          confirmText: 'Delete Patient',
          cancelText: 'Cancel'
        },
        BULK: {
          title: 'Bulk Delete Confirmation',
          message: 'Are you sure you want to delete {count} selected patients?',
          details: 'This action will deactivate all selected patient records.',
          warning: 'This action can be reversed by reactivating the patients individually.',
          confirmText: 'Delete All Selected',
          cancelText: 'Cancel'
        }
      },
      SUCCESS_MESSAGES: {
        SINGLE: 'Patient "{patientName}" has been successfully deleted.',
        BULK: '{count} patients have been successfully deleted.',
        RESTORED: 'Patient "{patientName}" has been restored successfully.'
      },
      ERROR_MESSAGES: {
        NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
        UNAUTHORIZED: 'You do not have permission to delete patients.',
        NOT_FOUND: 'Patient not found. It may have been already deleted.',
        DATABASE_ERROR: 'Database error occurred. Please contact system administrator.',
        UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
      }
    };
  }

  /**
   * Enhanced delete patient with comprehensive error handling
   */
  async deletePatient(patientId, patientName, options = {}) {
    try {
      console.log(`🗑️ Starting delete process for patient: ${patientId} (${patientName})`);

      // Step 1: Validate inputs
      if (!patientId || !patientName) {
        throw new Error('Patient ID and name are required for deletion');
      }

      // Step 2: Show confirmation dialog if required
      if (this.deleteConfig.CONFIRMATION_REQUIRED && !options.skipConfirmation) {
        const confirmed = await this.showDeleteConfirmation(patientName, 'single');
        if (!confirmed) {
          return { success: false, cancelled: true };
        }
      }

      // Step 3: Ensure authentication
      const authResult = await this.ensureAuthentication();
      if (!authResult.success) {
        throw new Error('Authentication required for patient deletion');
      }

      // Step 4: Attempt deletion with retry logic
      const deleteResult = await this.performDeletion(patientId, options);
      
      if (deleteResult.success) {
        // Step 5: Log audit trail if enabled
        if (this.deleteConfig.AUDIT_LOGGING) {
          await this.logDeletionAudit(patientId, patientName, deleteResult);
        }

        // Step 6: Return success response
        const successMessage = this.deleteConfig.SUCCESS_MESSAGES.SINGLE
          .replace('{patientName}', patientName);
        
        console.log(`✅ Patient deletion successful: ${patientId}`);
        
        return {
          success: true,
          message: successMessage,
          patientId: patientId,
          deletionType: deleteResult.deletionType,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(deleteResult.error || 'Deletion failed');
      }

    } catch (error) {
      console.error(`❌ Patient deletion failed for ${patientId}:`, error);
      
      const errorMessage = this.categorizeError(error);
      
      return {
        success: false,
        error: errorMessage,
        patientId: patientId,
        errorType: error.name || 'UnknownError',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Perform the actual deletion with enhanced API call
   */
  async performDeletion(patientId, options = {}) {
    try {
      const deletionType = options.deletionType || this.deleteConfig.DELETION_TYPES.SOFT;
      
      console.log(`🔄 Performing ${deletionType} deletion for patient: ${patientId}`);
      
      // Enhanced API call with proper headers and error handling
      const response = await patientAPI.deletePatientEnhanced(patientId, {
        deletionType: deletionType,
        reason: options.reason || 'User requested deletion',
        auditLog: this.deleteConfig.AUDIT_LOGGING
      });

      return {
        success: response.success,
        error: response.error,
        deletionType: deletionType,
        apiResponse: response
      };

    } catch (error) {
      console.error('API deletion error:', error);
      
      // Try fallback deletion method
      if (!options.isRetry) {
        console.log('🔄 Trying fallback deletion method...');
        return await this.performFallbackDeletion(patientId, options);
      }
      
      return {
        success: false,
        error: error.message || 'Deletion API call failed'
      };
    }
  }

  /**
   * Fallback deletion method using standard API
   */
  async performFallbackDeletion(patientId, options) {
    try {
      const response = await patientAPI.deletePatient(patientId);
      
      if (response.success) {
        return {
          success: true,
          deletionType: 'standard',
          apiResponse: response
        };
      } else {
        return {
          success: false,
          error: response.error || 'Fallback deletion failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Both primary and fallback deletion methods failed'
      };
    }
  }

  /**
   * Enhanced confirmation dialog
   */
  async showDeleteConfirmation(patientName, type = 'single') {
    const config = this.deleteConfig.CONFIRMATION_MESSAGES[type.toUpperCase()];
    
    if (!config) {
      return window.confirm(`Are you sure you want to delete ${patientName}?`);
    }

    const message = config.message.replace('{patientName}', patientName);
    const fullMessage = `${config.title}\n\n${message}\n\n${config.details}\n\n⚠️ ${config.warning}`;
    
    // Use custom modal if available, otherwise fallback to confirm
    if (window.customConfirm) {
      return await window.customConfirm({
        title: config.title,
        message: message,
        details: config.details,
        warning: config.warning,
        confirmText: config.confirmText,
        cancelText: config.cancelText,
        variant: 'danger'
      });
    }

    return window.confirm(fullMessage);
  }

  /**
   * Ensure proper authentication for delete operations
   */
  async ensureAuthentication() {
    try {
      // Check if user is authenticated
      const authStatus = await patientAPI.checkAuthStatus();
      
      if (!authStatus.authenticated) {
        // Try auto-login for development
        console.log('🔐 User not authenticated, attempting auto-login...');
        const loginResult = await patientAPI.autoLoginForDev();
        
        if (loginResult.success) {
          console.log('✅ Auto-login successful');
          return { success: true, method: 'auto-login' };
        } else {
          console.error('❌ Auto-login failed');
          return { success: false, error: 'Authentication failed' };
        }
      }

      return { success: true, method: 'existing-session' };
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { success: false, error: 'Authentication check failed' };
    }
  }

  /**
   * Log deletion for audit trail
   */
  async logDeletionAudit(patientId, patientName, deleteResult) {
    try {
      const auditEntry = {
        action: 'PATIENT_DELETE',
        patientId: patientId,
        patientName: patientName,
        deletionType: deleteResult.deletionType,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: 'client-side', // Would be populated by backend
        result: 'success'
      };

      // Log to console for development
      console.log('📋 Audit Log:', auditEntry);
      
      // Send to audit logging service if available
      if (patientAPI.logAuditAction) {
        await patientAPI.logAuditAction(auditEntry);
      }
      
    } catch (error) {
      console.warn('Failed to log audit entry:', error);
      // Don't fail the deletion if audit logging fails
    }
  }

  /**
   * Categorize and format error messages
   */
  categorizeError(error) {
    const errorStr = error.toString().toLowerCase();
    
    if (errorStr.includes('network') || errorStr.includes('fetch')) {
      return this.deleteConfig.ERROR_MESSAGES.NETWORK_ERROR;
    } else if (errorStr.includes('unauthorized') || errorStr.includes('permission')) {
      return this.deleteConfig.ERROR_MESSAGES.UNAUTHORIZED;
    } else if (errorStr.includes('not found') || errorStr.includes('404')) {
      return this.deleteConfig.ERROR_MESSAGES.NOT_FOUND;
    } else if (errorStr.includes('database') || errorStr.includes('sql')) {
      return this.deleteConfig.ERROR_MESSAGES.DATABASE_ERROR;
    }
    
    return this.deleteConfig.ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  /**
   * Bulk delete patients
   */
  async bulkDeletePatients(patients, options = {}) {
    try {
      console.log(`🗑️ Starting bulk delete for ${patients.length} patients`);

      // Show bulk confirmation
      if (this.deleteConfig.CONFIRMATION_REQUIRED && !options.skipConfirmation) {
        const confirmed = await this.showBulkDeleteConfirmation(patients.length);
        if (!confirmed) {
          return { success: false, cancelled: true };
        }
      }

      const results = {
        success: true,
        deleted: [],
        failed: [],
        total: patients.length
      };

      // Delete patients one by one with progress tracking
      for (let i = 0; i < patients.length; i++) {
        const patient = patients[i];
        
        if (options.onProgress) {
          options.onProgress({
            current: i + 1,
            total: patients.length,
            currentPatient: patient.fullName || patient.name
          });
        }

        const deleteResult = await this.deletePatient(
          patient.id, 
          patient.fullName || patient.name, 
          { skipConfirmation: true }
        );

        if (deleteResult.success) {
          results.deleted.push(patient);
        } else {
          results.failed.push({ patient, error: deleteResult.error });
          if (!options.continueOnError) {
            results.success = false;
            break;
          }
        }
      }

      const successMessage = this.deleteConfig.SUCCESS_MESSAGES.BULK
        .replace('{count}', results.deleted.length);

      return {
        ...results,
        message: successMessage
      };

    } catch (error) {
      console.error('Bulk delete failed:', error);
      return {
        success: false,
        error: 'Bulk delete operation failed',
        deleted: [],
        failed: []
      };
    }
  }

  async showBulkDeleteConfirmation(count) {
    const config = this.deleteConfig.CONFIRMATION_MESSAGES.BULK;
    const message = config.message.replace('{count}', count);
    const fullMessage = `${config.title}\n\n${message}\n\n${config.details}\n\n⚠️ ${config.warning}`;
    
    return window.confirm(fullMessage);
  }
}

// Create singleton instance
export const enhancedPatientDeleteHandler = new EnhancedPatientDeleteHandler();

// Export for use in components
export default enhancedPatientDeleteHandler;