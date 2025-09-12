// HIPAA/GDPR Compliance Configuration - Soft Coding Approach
import { COMPLIANCE_CONFIG, ENV_CONFIG } from './appConfig.js';

// Dynamic compliance configuration based on environment and feature flags
const complianceConfig = {
  // HIPAA Compliance Configuration (Soft-coded)
  hipaa: {
    enabled: COMPLIANCE_CONFIG.HIPAA.enabled,
    auditLogging: COMPLIANCE_CONFIG.HIPAA.auditLogging,
    dataEncryption: COMPLIANCE_CONFIG.HIPAA.dataEncryption,
    title: "HIPAA Compliant",
    description: "Health Insurance Portability and Accountability Act",
    certificationId: `HIPAA-2024-MEDIX-${ENV_CONFIG.mode.toUpperCase()}`,
    auditDate: new Date().toISOString().split('T')[0],
    features: [
      "End-to-end encryption of all patient data",
      "Role-based access controls",
      "Comprehensive audit logging", 
      "Secure data transmission protocols",
      "Regular security assessments",
      "PHI de-identification tools",
      "Breach notification procedures",
      "Business Associate Agreements (BAA) available"
    ],
    controls: {
      accessControl: "Multi-factor authentication required",
      dataIntegrity: "Cryptographic checksums and version control",
      transmission: "TLS 1.3 encryption for all data in transit",
      storage: "AES-256 encryption for data at rest"
    }
  },

  // GDPR Compliance Configuration (Soft-coded)  
  gdpr: {
    enabled: true,
    title: "GDPR Compliant",
    description: "General Data Protection Regulation",
    certificationId: "GDPR-2024-MEDIX-001", 
    auditDate: "2024-09-01",
    features: [
      "Explicit consent management",
      "Right to data portability",
      "Right to be forgotten implementation",
      "Data processing transparency",
      "Privacy by design architecture",
      "Data minimization principles",
      "Regular privacy impact assessments",
      "EU representative appointed"
    ],
    rights: [
      "Right of access to personal data",
      "Right to rectification of inaccurate data", 
      "Right to erasure (right to be forgotten)",
      "Right to restrict processing",
      "Right to data portability",
      "Right to object to processing",
      "Rights related to automated decision making"
    ],
    lawfulBasis: [
      "Consent for optional features",
      "Legitimate interests for service improvement", 
      "Legal obligation for regulatory compliance",
      "Vital interests for medical emergency situations"
    ]
  },

  // Additional Healthcare Compliance
  additional: {
    soc2: {
      enabled: true,
      title: "SOC 2 Type II",
      description: "Service Organization Control 2",
      certificationId: "SOC2-2024-MEDIX-001"
    },
    iso27001: {
      enabled: true,
      title: "ISO 27001",
      description: "Information Security Management",
      certificationId: "ISO27001-2024-MEDIX-001"
    },
    fda: {
      enabled: true,
      title: "FDA Compliance",
      description: "Food and Drug Administration guidelines for medical software",
      status: "Class II Medical Device Software"
    },
    dicom: {
      enabled: true,
      title: "DICOM Compliant",
      description: "Digital Imaging and Communications in Medicine",
      version: "DICOM 3.0"
    }
  },

  // Trust Badges & Certifications
  trustBadges: [
    {
      id: "hipaa",
      name: "HIPAA Compliant",
      icon: "shield-check",
      color: "#0066cc",
      link: "/compliance/hipaa"
    },
    {
      id: "gdpr", 
      name: "GDPR Compliant",
      icon: "shield-alt",
      color: "#0066cc",
      link: "/compliance/gdpr"
    },
    {
      id: "soc2",
      name: "SOC 2 Type II",
      icon: "certificate",
      color: "#0066cc", 
      link: "/compliance/soc2"
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      icon: "award",
      color: "#0066cc",
      link: "/compliance/iso27001"
    }
  ],

  // Cookie Consent Configuration
  cookies: {
    enabled: true,
    version: "1.0",
    message: "We use cookies to enhance your experience and ensure our platform operates securely in compliance with HIPAA and GDPR regulations.",
    essential: {
      title: "Essential Cookies",
      description: "Required for basic site functionality and security",
      required: true,
      cookies: [
        "session_id", "csrf_token", "auth_token", "user_preferences"
      ]
    },
    functional: {
      title: "Functional Cookies", 
      description: "Enhance user experience and remember preferences",
      required: false,
      default: true,
      cookies: [
        "language_preference", "theme_selection", "dashboard_layout"
      ]
    },
    analytics: {
      title: "Analytics Cookies",
      description: "Help us understand how users interact with our platform",
      required: false,
      default: false,
      cookies: [
        "google_analytics", "session_recording", "heatmap_data"
      ]
    },
    marketing: {
      title: "Marketing Cookies",
      description: "Used to track visitors and display relevant advertisements",
      required: false,
      default: false,
      cookies: [
        "ad_tracking", "social_media_pixels", "remarketing_tags"
      ]
    }
  },

  // Privacy Controls
  privacy: {
    dataRetention: {
      defaultPeriod: "7 years", // Medical records retention
      userControlled: true,
      minimumPeriod: "1 year",
      maximumPeriod: "10 years"
    },
    dataExport: {
      enabled: true,
      formats: ["JSON", "PDF", "CSV", "DICOM"],
      maxFileSize: "100MB",
      processingTime: "24-48 hours"
    },
    dataDelete: {
      enabled: true,
      gracePeriod: "30 days",
      permanentDeletion: "90 days",
      exceptions: ["Legal hold", "Regulatory requirements"]
    }
  },

  // Compliance Monitoring
  monitoring: {
    auditLogs: {
      enabled: true,
      retention: "7 years",
      realTime: true,
      events: [
        "User login/logout", "Data access", "Data modification", 
        "System configuration changes", "Security events"
      ]
    },
    securityScanning: {
      enabled: true,
      frequency: "daily",
      vulnerabilityAssessment: "weekly",
      penetrationTesting: "quarterly"
    },
    complianceReporting: {
      enabled: true,
      frequency: "monthly", 
      recipients: ["DPO", "CISO", "Compliance Officer"],
      automated: true
    }
  },

  // Contact Information for Compliance
  contacts: {
    dpo: {
      title: "Data Protection Officer",
      name: "Dr. Sarah Johnson",
      email: "dpo@medixscan.ai",
      phone: "+1 (555) 123-4570"
    },
    privacy: {
      title: "Privacy Officer", 
      name: "Michael Chen",
      email: "privacy@medixscan.ai",
      phone: "+1 (555) 123-4571"
    },
    security: {
      title: "Chief Information Security Officer",
      name: "David Rodriguez",
      email: "security@medixscan.ai", 
      phone: "+1 (555) 123-4572"
    },
    compliance: {
      title: "Compliance Officer",
      name: "Lisa Wang",
      email: "compliance@medixscan.ai",
      phone: "+1 (555) 123-4573"
    }
  }
};

export default complianceConfig;
