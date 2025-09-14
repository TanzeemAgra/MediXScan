/**
 * PATIENT DELETE DEBUG UTILITIES
 * ===============================
 * Debug tools and error boundary for patient delete functionality
 */

import React from 'react';
import { Alert, Button } from 'react-bootstrap';

/**
 * Error Boundary for Patient Delete Operations
 */
export class PatientDeleteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Patient Delete Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to external service if available
    if (window.logError) {
      window.logError('PatientDelete', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Patient Delete Error</Alert.Heading>
          <p>
            An error occurred while processing the patient delete operation. 
            This has been logged for investigation.
          </p>
          <details>
            <summary>Error Details (for developers)</summary>
            <pre style={{ fontSize: '12px', marginTop: '10px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
          <hr />
          <Button 
            variant="outline-primary" 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

/**
 * Debug Logger for Patient Delete Operations
 */
export class PatientDeleteDebugger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.enabled = process.env.NODE_ENV === 'development';
  }

  log(level, message, data = {}) {
    if (!this.enabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data,
      stack: new Error().stack
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console logging with appropriate method
    const consoleMethod = console[level] || console.log;
    consoleMethod(`[PatientDelete ${level.toUpperCase()}]`, message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    const logsJson = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-delete-logs-${new Date().toISOString()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Performance monitoring
  startTimer(operation) {
    const timer = `patient_delete_${operation}`;
    console.time(timer);
    return timer;
  }

  endTimer(timer) {
    console.timeEnd(timer);
  }

  // Memory usage monitoring
  checkMemory() {
    if (performance.memory) {
      this.log('debug', 'Memory Usage', {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
      });
    }
  }
}

// Create singleton instance
export const patientDeleteDebugger = new PatientDeleteDebugger();

/**
 * Network Request Monitor for Delete Operations
 */
export class DeleteRequestMonitor {
  constructor() {
    this.requests = [];
    this.enabled = process.env.NODE_ENV === 'development';
    
    if (this.enabled) {
      this.interceptFetch();
    }
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      // Only monitor delete requests
      if (options?.method === 'DELETE' || url.includes('/delete') || url.includes('patients/')) {
        const requestId = this.generateRequestId();
        const startTime = Date.now();
        
        this.logRequest('START', requestId, url, options);
        
        try {
          const response = await originalFetch(...args);
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logRequest('SUCCESS', requestId, url, {
            status: response.status,
            statusText: response.statusText,
            duration: duration + 'ms'
          });
          
          return response;
        } catch (error) {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logRequest('ERROR', requestId, url, {
            error: error.message,
            duration: duration + 'ms'
          });
          
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
  }

  generateRequestId() {
    return 'req_' + Math.random().toString(36).substr(2, 9);
  }

  logRequest(type, id, url, data) {
    const logEntry = {
      type: type,
      id: id,
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    this.requests.unshift(logEntry);
    
    if (this.requests.length > 50) {
      this.requests.pop();
    }

    patientDeleteDebugger.log('info', `DELETE REQUEST ${type}`, logEntry);
  }

  getRequests() {
    return this.requests;
  }

  clearRequests() {
    this.requests = [];
  }
}

// Create monitor instance
export const deleteRequestMonitor = new DeleteRequestMonitor();

/**
 * Component Debug Helper
 */
export const usePatientDeleteDebug = () => {
  const logAction = (action, data) => {
    patientDeleteDebugger.info(`User Action: ${action}`, data);
  };

  const logError = (error, context) => {
    patientDeleteDebugger.error(`Component Error: ${error.message}`, {
      error: error,
      context: context,
      stack: error.stack
    });
  };

  const logPerformance = (operation, duration) => {
    patientDeleteDebugger.info(`Performance: ${operation}`, {
      duration: duration + 'ms',
      timestamp: Date.now()
    });
  };

  return {
    logAction,
    logError,
    logPerformance,
    debugger: patientDeleteDebugger,
    monitor: deleteRequestMonitor
  };
};

/**
 * Auto-diagnostic function
 */
export const runPatientDeleteDiagnostics = async () => {
  console.log('🔍 Running Patient Delete Diagnostics...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    results: {}
  };

  // Check if enhanced delete handler is available
  try {
    const { enhancedPatientDeleteHandler } = await import('./enhancedPatientDeleteHandler');
    diagnostics.results.deleteHandler = {
      available: true,
      config: enhancedPatientDeleteHandler.config ? 'loaded' : 'missing'
    };
  } catch (error) {
    diagnostics.results.deleteHandler = {
      available: false,
      error: error.message
    };
  }

  // Check if patient API is available
  try {
    const { patientAPI } = await import('../services/patientManagementApi');
    diagnostics.results.patientAPI = {
      available: true,
      methods: {
        deletePatient: typeof patientAPI.deletePatient === 'function',
        deletePatientEnhanced: typeof patientAPI.deletePatientEnhanced === 'function',
        checkAuthStatus: typeof patientAPI.checkAuthStatus === 'function'
      }
    };
  } catch (error) {
    diagnostics.results.patientAPI = {
      available: false,
      error: error.message
    };
  }

  // Check configuration
  try {
    const { PATIENT_MANAGEMENT_CONFIG } = await import('../config/patientManagementConfig');
    diagnostics.results.configuration = {
      available: true,
      deleteConfig: PATIENT_MANAGEMENT_CONFIG.DELETE_CONFIG ? 'present' : 'missing'
    };
  } catch (error) {
    diagnostics.results.configuration = {
      available: false,
      error: error.message
    };
  }

  // Check UI elements
  diagnostics.results.uiElements = {
    deleteButtons: document.querySelectorAll('[data-testid*="delete"], button[title*="Delete"]').length,
    patientRows: document.querySelectorAll('tbody tr').length,
    confirmDialogs: document.querySelectorAll('.modal').length
  };

  // Check browser capabilities
  diagnostics.results.browser = {
    fetch: typeof fetch === 'function',
    localStorage: typeof localStorage === 'object',
    console: typeof console === 'object',
    confirm: typeof confirm === 'function'
  };

  console.log('📋 Diagnostic Results:', diagnostics);
  patientDeleteDebugger.info('Diagnostics completed', diagnostics);

  return diagnostics;
};

// Auto-run diagnostics in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    runPatientDeleteDiagnostics();
  }, 2000);
}

export default {
  PatientDeleteErrorBoundary,
  patientDeleteDebugger,
  deleteRequestMonitor,
  usePatientDeleteDebug,
  runPatientDeleteDiagnostics
};