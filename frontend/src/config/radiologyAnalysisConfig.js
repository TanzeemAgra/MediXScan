/**
 * Radiology Analysis Configuration
 * Soft-coded configuration for enhanced analysis results display
 * Designed with radiologist workflow in mind
 */

export const ANALYSIS_SECTIONS = {
  SUMMARY: {
    id: 'summary',
    title: 'Clinical Summary',
    icon: 'fas fa-clipboard-list',
    priority: 1,
    enabled: true,
    radiologyFocus: {
      keyFindings: true,
      clinicalImplication: true,
      urgencyLevel: true,
      followUpRecommendations: true
    }
  },
  DIAGNOSTIC_DISCREPANCIES: {
    id: 'discrepancies',
    title: 'Diagnostic Discrepancies',
    icon: 'fas fa-exclamation-triangle',
    priority: 2,
    enabled: true,
    severityLevels: {
      critical: { color: 'danger', icon: 'fas fa-times-circle' },
      major: { color: 'warning', icon: 'fas fa-exclamation-circle' },
      minor: { color: 'info', icon: 'fas fa-info-circle' },
      suggestion: { color: 'secondary', icon: 'fas fa-lightbulb' }
    }
  },
  CORRECTED_REPORT: {
    id: 'corrected',
    title: 'Corrected Report',
    icon: 'fas fa-file-medical-alt',
    priority: 3,
    enabled: true,
    highlightOptions: {
      showChanges: true,
      colorCoding: true,
      trackRevisions: true
    }
  },
  HIGHLIGHTED_REPORT: {
    id: 'highlighted',
    title: 'Highlighted Analysis',
    icon: 'fas fa-highlighter',
    priority: 4,
    enabled: true,
    highlightTypes: {
      anatomy: { color: '#e3f2fd', label: 'Anatomical Terms' },
      pathology: { color: '#fff3e0', label: 'Pathological Findings' },
      measurements: { color: '#f3e5f5', label: 'Measurements' },
      technique: { color: '#e8f5e8', label: 'Imaging Technique' },
      errors: { color: '#ffebee', label: 'Identified Issues' }
    }
  }
};

export const RADIOLOGY_WORKFLOW = {
  standardAnalysis: {
    processSteps: [
      'initialReview',
      'diagnosticAnalysis', 
      'discrepancyIdentification',
      'reportCorrection',
      'qualityAssurance'
    ],
    outputSections: [
      ANALYSIS_SECTIONS.SUMMARY,
      ANALYSIS_SECTIONS.DIAGNOSTIC_DISCREPANCIES,
      ANALYSIS_SECTIONS.CORRECTED_REPORT,
      ANALYSIS_SECTIONS.HIGHLIGHTED_REPORT
    ]
  },
  saveButtonConfig: {
    enabled: true,
    icon: 'fas fa-save',
    text: 'Save Analysis',
    variants: {
      draft: { color: 'secondary', text: 'Save as Draft' },
      final: { color: 'primary', text: 'Save Final Report' },
      export: { color: 'success', text: 'Export Report' }
    }
  }
};

export const TEXT_HIGHLIGHTING = {
  patterns: {
    anatomy: [
      // Anatomical structures
      /\b(lung|lungs|heart|liver|kidney|brain|spine|chest|abdomen|pelvis)\b/gi,
      /\b(right|left|bilateral|anterior|posterior|superior|inferior|medial|lateral)\b/gi,
      /\b(lobe|segment|ventricle|atrium|chamber|vessel|artery|vein)\b/gi
    ],
    pathology: [
      // Pathological findings
      /\b(mass|lesion|nodule|opacity|consolidation|effusion|pneumonia)\b/gi,
      /\b(fracture|dislocation|stenosis|dilatation|enlargement|edema)\b/gi,
      /\b(hemorrhage|infarct|thrombosis|embolism|cancer|tumor|malignant)\b/gi
    ],
    measurements: [
      // Measurements and quantities
      /\b\d+\s*(mm|cm|ml|cc|degrees?|%)\b/gi,
      /\b(small|medium|large|massive|minimal|moderate|severe|extensive)\b/gi
    ],
    technique: [
      // Imaging techniques and protocols
      /\b(CT|MRI|ultrasound|X-ray|contrast|enhancement|scan|imaging)\b/gi,
      /\b(axial|sagittal|coronal|oblique|reconstruction|reformatted)\b/gi
    ]
  },
  colors: {
    anatomy: '#e3f2fd',
    pathology: '#fff3e0', 
    measurements: '#f3e5f5',
    technique: '#e8f5e8',
    errors: '#ffebee'
  }
};

export const CLINICAL_PRIORITIES = {
  urgent: {
    keywords: ['acute', 'emergent', 'critical', 'immediate', 'urgent', 'stat'],
    color: 'danger',
    icon: 'fas fa-exclamation-triangle',
    action: 'Immediate attention required'
  },
  important: {
    keywords: ['significant', 'notable', 'concerning', 'abnormal', 'positive'],
    color: 'warning', 
    icon: 'fas fa-exclamation-circle',
    action: 'Close follow-up recommended'
  },
  routine: {
    keywords: ['stable', 'unchanged', 'normal', 'negative', 'routine'],
    color: 'success',
    icon: 'fas fa-check-circle',
    action: 'Standard follow-up'
  }
};
