// Patient Management System Configuration - Soft Coded
// Comprehensive configuration for doctor-specific patient management

export const PATIENT_MANAGEMENT_CONFIG = {
  // System Metadata
  SYSTEM_INFO: {
    name: "Patient Management System",
    version: "2.0.0",
    description: "Doctor-specific patient data management with AI-powered features",
    author: "MediXscan AI",
    lastUpdated: "2025-09-10"
  },

  // UI Themes and Styling
  THEMES: {
    MEDICAL_BLUE: {
      id: 'medical_blue',
      name: 'Medical Blue',
      primaryColor: '#0056b3',
      secondaryColor: '#17a2b8',
      accentColor: '#28a745',
      backgroundColor: '#f8f9fa',
      cardBackground: '#ffffff',
      textColor: '#212529',
      mutedColor: '#6c757d',
      gradients: {
        primary: 'linear-gradient(135deg, #0056b3 0%, #17a2b8 100%)',
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        warning: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
        danger: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
      }
    },
    HEALTHCARE_GREEN: {
      id: 'healthcare_green',
      name: 'Healthcare Green',
      primaryColor: '#28a745',
      secondaryColor: '#20c997',
      accentColor: '#0056b3',
      backgroundColor: '#f8f9fa',
      cardBackground: '#ffffff',
      textColor: '#212529',
      mutedColor: '#6c757d',
      gradients: {
        primary: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        warning: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
        danger: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
      }
    },
    DARK_PROFESSIONAL: {
      id: 'dark_professional',
      name: 'Dark Professional',
      primaryColor: '#6f42c1',
      secondaryColor: '#e83e8c',
      accentColor: '#fd7e14',
      backgroundColor: '#1a1a1a',
      cardBackground: '#2d2d2d',
      textColor: '#ffffff',
      mutedColor: '#adb5bd',
      gradients: {
        primary: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        warning: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
        danger: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
      }
    }
  },

  // Dashboard Widgets Configuration
  WIDGETS: {
    TOTAL_PATIENTS: {
      id: 'total_patients',
      title: 'Total Patients',
      icon: 'ri-user-line',
      color: 'primary',
      type: 'stat_card',
      description: 'Total patients under your care'
    },
    NEW_PATIENTS: {
      id: 'new_patients',
      title: 'New Patients',
      icon: 'ri-user-add-line',
      color: 'success',
      type: 'stat_card',
      description: 'New patients this month'
    },
    ACTIVE_TREATMENTS: {
      id: 'active_treatments',
      title: 'Active Treatments',
      icon: 'ri-heart-pulse-line',
      color: 'warning',
      type: 'stat_card',
      description: 'Ongoing treatment plans'
    },
    PENDING_REPORTS: {
      id: 'pending_reports',
      title: 'Pending Reports',
      icon: 'ri-file-text-line',
      color: 'info',
      type: 'stat_card',
      description: 'Reports awaiting review'
    },
    PATIENT_SATISFACTION: {
      id: 'patient_satisfaction',
      title: 'Patient Satisfaction',
      icon: 'ri-emotion-happy-line',
      color: 'success',
      type: 'stat_card',
      description: 'Average satisfaction rating'
    },
    URGENT_CASES: {
      id: 'urgent_cases',
      title: 'Urgent Cases',
      icon: 'ri-alarm-warning-line',
      color: 'danger',
      type: 'stat_card',
      description: 'Cases requiring immediate attention'
    }
  },

  // Patient Table Configuration
  PATIENT_TABLE: {
    columns: [
      {
        key: 'id',
        title: 'Patient ID',
        sortable: true,
        searchable: true,
        width: '100px'
      },
      {
        key: 'name',
        title: 'Patient Name',
        sortable: true,
        searchable: true,
        width: '200px'
      },
      {
        key: 'age',
        title: 'Age',
        sortable: true,
        searchable: false,
        width: '80px'
      },
      {
        key: 'gender',
        title: 'Gender',
        sortable: true,
        searchable: true,
        width: '100px'
      },
      {
        key: 'phone',
        title: 'Phone',
        sortable: false,
        searchable: true,
        width: '150px'
      },
      {
        key: 'lastVisit',
        title: 'Last Visit',
        sortable: true,
        searchable: false,
        width: '120px'
      },
      {
        key: 'status',
        title: 'Status',
        sortable: true,
        searchable: true,
        width: '120px'
      },
      {
        key: 'priority',
        title: 'Priority',
        sortable: true,
        searchable: true,
        width: '100px'
      },
      {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        searchable: false,
        width: '150px'
      }
    ],
    itemsPerPage: [10, 25, 50, 100],
    defaultItemsPerPage: 25,
    enableSearch: true,
    enableFilters: true,
    enableExport: true
  },

  // Patient Status Configuration
  PATIENT_STATUS: {
    ACTIVE: {
      value: 'active',
      label: 'Active',
      color: 'success',
      icon: 'ri-check-line',
      description: 'Currently under treatment'
    },
    INACTIVE: {
      value: 'inactive',
      label: 'Inactive',
      color: 'secondary',
      icon: 'ri-pause-line',
      description: 'Treatment paused or completed'
    },
    CRITICAL: {
      value: 'critical',
      label: 'Critical',
      color: 'danger',
      icon: 'ri-alarm-warning-line',
      description: 'Requires immediate attention'
    },
    DISCHARGED: {
      value: 'discharged',
      label: 'Discharged',
      color: 'info',
      icon: 'ri-logout-box-line',
      description: 'Treatment completed and discharged'
    },
    REFERRED: {
      value: 'referred',
      label: 'Referred',
      color: 'warning',
      icon: 'ri-share-forward-line',
      description: 'Referred to specialist'
    }
  },

  // Priority Levels
  PRIORITY_LEVELS: {
    LOW: {
      value: 'low',
      label: 'Low',
      color: 'success',
      icon: 'ri-arrow-down-line',
      urgency: 1
    },
    MEDIUM: {
      value: 'medium',
      label: 'Medium',
      color: 'warning',
      icon: 'ri-subtract-line',
      urgency: 2
    },
    HIGH: {
      value: 'high',
      label: 'High',
      color: 'danger',
      icon: 'ri-arrow-up-line',
      urgency: 3
    },
    URGENT: {
      value: 'urgent',
      label: 'Urgent',
      color: 'danger',
      icon: 'ri-alarm-warning-line',
      urgency: 4
    }
  },

  // Form Configuration
  PATIENT_FORM: {
    personal_info: {
      title: 'Personal Information',
      icon: 'ri-user-line',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          placeholder: 'Enter first name',
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: '^[A-Za-z\\s]+$'
          }
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          placeholder: 'Enter last name',
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: '^[A-Za-z\\s]+$'
          }
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true,
          validation: {
            maxDate: 'today'
          }
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' }
          ]
        },
        {
          name: 'bloodType',
          label: 'Blood Type',
          type: 'select',
          required: false,
          options: [
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' }
          ]
        }
      ]
    },
    contact_info: {
      title: 'Contact Information',
      icon: 'ri-phone-line',
      fields: [
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          required: true,
          placeholder: '+1 (555) 123-4567',
          validation: {
            pattern: '^[\\+]?[1-9]?[0-9]{7,15}$'
          }
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: false,
          placeholder: 'patient@example.com',
          validation: {
            pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$'
          }
        },
        {
          name: 'address',
          label: 'Address',
          type: 'textarea',
          required: false,
          placeholder: 'Enter full address',
          rows: 3
        },
        {
          name: 'emergencyContact',
          label: 'Emergency Contact',
          type: 'text',
          required: true,
          placeholder: 'Emergency contact name',
          validation: {
            minLength: 2,
            maxLength: 100
          }
        },
        {
          name: 'emergencyPhone',
          label: 'Emergency Phone',
          type: 'tel',
          required: true,
          placeholder: '+1 (555) 123-4567',
          validation: {
            pattern: '^[\\+]?[1-9]?[0-9]{7,15}$'
          }
        }
      ]
    },
    medical_info: {
      title: 'Medical Information',
      icon: 'ri-heart-pulse-line',
      fields: [
        {
          name: 'allergies',
          label: 'Allergies',
          type: 'textarea',
          required: false,
          placeholder: 'List any known allergies',
          rows: 3
        },
        {
          name: 'medications',
          label: 'Current Medications',
          type: 'textarea',
          required: false,
          placeholder: 'List current medications',
          rows: 3
        },
        {
          name: 'medicalHistory',
          label: 'Medical History',
          type: 'textarea',
          required: false,
          placeholder: 'Brief medical history',
          rows: 4
        },
        {
          name: 'insuranceProvider',
          label: 'Insurance Provider',
          type: 'text',
          required: false,
          placeholder: 'Insurance company name'
        },
        {
          name: 'insuranceNumber',
          label: 'Insurance Number',
          type: 'text',
          required: false,
          placeholder: 'Policy/Member number'
        }
      ]
    }
  },

  // Action Buttons Configuration
  ACTIONS: {
    VIEW: {
      icon: 'ri-eye-line',
      label: 'View',
      color: 'primary',
      tooltip: 'View patient details'
    },
    EDIT: {
      icon: 'ri-edit-line',
      label: 'Edit',
      color: 'warning',
      tooltip: 'Edit patient information'
    },
    DELETE: {
      icon: 'ri-delete-bin-line',
      label: 'Delete',
      color: 'danger',
      tooltip: 'Delete patient record'
    },
    APPOINTMENTS: {
      icon: 'ri-calendar-line',
      label: 'Appointments',
      color: 'info',
      tooltip: 'Manage appointments'
    },
    REPORTS: {
      icon: 'ri-file-text-line',
      label: 'Reports',
      color: 'success',
      tooltip: 'View medical reports'
    },
    MESSAGES: {
      icon: 'ri-message-line',
      label: 'Messages',
      color: 'secondary',
      tooltip: 'Send message to patient'
    }
  },

  // Filter Configuration
  FILTERS: {
    STATUS: {
      label: 'Status',
      type: 'select',
      options: Object.values(this?.PATIENT_STATUS || {})
    },
    PRIORITY: {
      label: 'Priority',
      type: 'select',
      options: Object.values(this?.PRIORITY_LEVELS || {})
    },
    GENDER: {
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    AGE_RANGE: {
      label: 'Age Range',
      type: 'range',
      min: 0,
      max: 120
    },
    DATE_RANGE: {
      label: 'Last Visit',
      type: 'daterange'
    }
  },

  // API Endpoints
  API_ENDPOINTS: {
    GET_PATIENTS: '/api/patients/doctor/',
    GET_PATIENT: '/api/patients/',
    CREATE_PATIENT: '/api/patients/',
    UPDATE_PATIENT: '/api/patients/',
    DELETE_PATIENT: '/api/patients/',
    GET_PATIENT_REPORTS: '/api/patients/{id}/reports/',
    GET_PATIENT_APPOINTMENTS: '/api/patients/{id}/appointments/',
    SEARCH_PATIENTS: '/api/patients/search/',
    EXPORT_PATIENTS: '/api/patients/export/'
  },

  // Animations and Transitions
  ANIMATIONS: {
    CARD_HOVER: 'transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1);',
    BUTTON_HOVER: 'transform: scale(1.05);',
    FADE_IN: 'opacity: 1; transform: translateY(0);',
    SLIDE_IN: 'transform: translateX(0); opacity: 1;',
    PULSE: 'animation: pulse 2s infinite;'
  },

  // Security and Privacy
  SECURITY: {
    ENABLE_ENCRYPTION: true,
    DATA_MASKING: true,
    AUDIT_LOGGING: true,
    SESSION_TIMEOUT: 30, // minutes
    MAX_LOGIN_ATTEMPTS: 3,
    PASSWORD_REQUIREMENTS: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },

  // Pagination Configuration
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    SHOW_PAGE_SIZE_SELECTOR: true,
    SHOW_QUICK_JUMPER: true,
    SHOW_TOTAL: true
  },

  // Export Configuration
  EXPORT: {
    FORMATS: ['xlsx', 'pdf', 'csv'],
    INCLUDE_METADATA: true,
    WATERMARK: 'MediXscan AI - Confidential',
    BATCH_SIZE: 1000
  }
};

// Helper Functions
export const PatientConfigHelpers = {
  getTheme: (themeId) => {
    return PATIENT_MANAGEMENT_CONFIG.THEMES[themeId] || PATIENT_MANAGEMENT_CONFIG.THEMES.MEDICAL_BLUE;
  },

  getWidget: (widgetId) => {
    return PATIENT_MANAGEMENT_CONFIG.WIDGETS[widgetId];
  },

  getStatusConfig: (status) => {
    return PATIENT_MANAGEMENT_CONFIG.PATIENT_STATUS[status?.toUpperCase()];
  },

  getPriorityConfig: (priority) => {
    return PATIENT_MANAGEMENT_CONFIG.PRIORITY_LEVELS[priority?.toUpperCase()];
  },

  formatPatientData: (patient) => {
    return {
      ...patient,
      fullName: `${patient.firstName} ${patient.lastName}`,
      age: PatientConfigHelpers.calculateAge(patient.dateOfBirth),
      statusConfig: PatientConfigHelpers.getStatusConfig(patient.status),
      priorityConfig: PatientConfigHelpers.getPriorityConfig(patient.priority)
    };
  },

  calculateAge: (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  validateForm: (formData, section) => {
    const sectionConfig = PATIENT_MANAGEMENT_CONFIG.PATIENT_FORM[section];
    const errors = {};

    sectionConfig.fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || value.trim() === '')) {
        errors[field.name] = `${field.label} is required`;
      }
      
      if (value && field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          errors[field.name] = `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          errors[field.name] = `${field.label} must be less than ${field.validation.maxLength} characters`;
        }
        
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          errors[field.name] = `${field.label} format is invalid`;
        }
      }
    });

    return errors;
  }
};

export default PATIENT_MANAGEMENT_CONFIG;
