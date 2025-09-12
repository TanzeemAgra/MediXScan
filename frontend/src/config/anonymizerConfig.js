// AI-Powered Anonymizer Configuration with Soft Coding
// Advanced anonymization models and settings

export const ANONYMIZER_CONFIG = {
  // AI Models for different anonymization approaches
  AI_MODELS: {
    BASIC_RULE_BASED: {
      id: 'basic_rule_based',
      name: 'Basic Rule-Based',
      description: 'Traditional pattern matching and regex-based anonymization',
      accuracy: 85,
      speed: 'Fast',
      cost_multiplier: 0.1,
      features: ['Pattern matching', 'Regex detection', 'Basic NER'],
      suitable_for: ['Simple documents', 'Quick processing'],
      processing_time_estimate: 5 // seconds
    },
    ADVANCED_NLP: {
      id: 'advanced_nlp',
      name: 'Advanced NLP Model',
      description: 'GPT-4 powered intelligent entity recognition and context-aware anonymization',
      accuracy: 95,
      speed: 'Medium',
      cost_multiplier: 1.0,
      features: ['Context awareness', 'Medical terminology', 'Intelligent inference'],
      suitable_for: ['Complex medical reports', 'High accuracy needs'],
      processing_time_estimate: 15
    },
    MEDICAL_BERT: {
      id: 'medical_bert',
      name: 'Medical BERT Specialist',
      description: 'Specialized BERT model trained on medical data for healthcare anonymization',
      accuracy: 92,
      speed: 'Medium',
      cost_multiplier: 0.7,
      features: ['Medical entity recognition', 'Clinical context', 'HIPAA compliance'],
      suitable_for: ['Clinical documents', 'Research papers'],
      processing_time_estimate: 12
    },
    HYBRID_AI: {
      id: 'hybrid_ai',
      name: 'Hybrid AI Engine',
      description: 'Combination of multiple AI models for maximum accuracy and coverage',
      accuracy: 98,
      speed: 'Slow',
      cost_multiplier: 1.5,
      features: ['Multi-model consensus', 'Cross-validation', 'Maximum accuracy'],
      suitable_for: ['Critical documents', 'Legal compliance'],
      processing_time_estimate: 25
    },
    CUSTOM_TRAINED: {
      id: 'custom_trained',
      name: 'Custom Trained Model',
      description: 'Organization-specific model trained on your document patterns',
      accuracy: 96,
      speed: 'Fast',
      cost_multiplier: 0.8,
      features: ['Organization-specific', 'Custom patterns', 'Adaptive learning'],
      suitable_for: ['Specific workflows', 'Custom requirements'],
      processing_time_estimate: 8
    }
  },

  // Anonymization strategies with different privacy levels
  PRIVACY_LEVELS: {
    BASIC: {
      id: 'basic',
      name: 'Basic Privacy',
      description: 'Remove obvious identifiers while maintaining readability',
      strength: 60,
      entities: ['names', 'phone_numbers', 'email_addresses'],
      replacement_strategy: 'generic_replacement',
      preserve_structure: true,
      preserve_context: true
    },
    STANDARD: {
      id: 'standard',
      name: 'Standard HIPAA',
      description: 'HIPAA-compliant anonymization for healthcare documents',
      strength: 85,
      entities: ['names', 'dates', 'locations', 'identifiers', 'contact_info'],
      replacement_strategy: 'smart_replacement',
      preserve_structure: true,
      preserve_context: false
    },
    HIGH: {
      id: 'high',
      name: 'High Security',
      description: 'Maximum privacy protection for sensitive documents',
      strength: 95,
      entities: ['all_personal_data', 'contextual_clues', 'indirect_identifiers'],
      replacement_strategy: 'random_replacement',
      preserve_structure: false,
      preserve_context: false
    },
    RESEARCH: {
      id: 'research',
      name: 'Research Grade',
      description: 'Balanced anonymization suitable for research purposes',
      strength: 80,
      entities: ['direct_identifiers', 'quasi_identifiers'],
      replacement_strategy: 'consistent_replacement',
      preserve_structure: true,
      preserve_context: true
    }
  },

  // Entity types that can be detected and anonymized
  ENTITY_TYPES: {
    PERSON_NAMES: {
      id: 'person_names',
      name: 'Person Names',
      description: 'Patient names, doctor names, family members',
      icon: 'ri-user-line',
      priority: 'high',
      replacement_patterns: ['[PATIENT]', '[DOCTOR]', '[PERSON]'],
      detection_methods: ['ner', 'pattern_matching', 'context_analysis']
    },
    MEDICAL_IDS: {
      id: 'medical_ids',
      name: 'Medical Identifiers',
      description: 'MRN, NHS numbers, insurance IDs',
      icon: 'ri-hashtag',
      priority: 'critical',
      replacement_patterns: ['[MRN-XXX]', '[NHS-XXX]', '[ID-XXX]'],
      detection_methods: ['regex', 'format_validation', 'checksum_validation']
    },
    DATES: {
      id: 'dates',
      name: 'Dates & Times',
      description: 'Birth dates, appointment dates, treatment dates',
      icon: 'ri-calendar-line',
      priority: 'high',
      replacement_patterns: ['[DATE]', '[REDACTED-DATE]'],
      detection_methods: ['date_parser', 'pattern_matching']
    },
    LOCATIONS: {
      id: 'locations',
      name: 'Locations',
      description: 'Addresses, hospital names, clinic locations',
      icon: 'ri-map-pin-line',
      priority: 'medium',
      replacement_patterns: ['[LOCATION]', '[HOSPITAL]', '[CLINIC]'],
      detection_methods: ['ner', 'geocoding', 'institution_database']
    },
    CONTACT_INFO: {
      id: 'contact_info',
      name: 'Contact Information',
      description: 'Phone numbers, email addresses, fax numbers',
      icon: 'ri-phone-line',
      priority: 'high',
      replacement_patterns: ['[PHONE]', '[EMAIL]', '[CONTACT]'],
      detection_methods: ['regex', 'format_validation']
    },
    MEDICAL_CONDITIONS: {
      id: 'medical_conditions',
      name: 'Medical Conditions',
      description: 'Rare diseases, genetic conditions (optional)',
      icon: 'ri-heart-pulse-line',
      priority: 'low',
      replacement_patterns: ['[CONDITION]', '[DIAGNOSIS]'],
      detection_methods: ['medical_ontology', 'icd_codes']
    }
  },

  // Processing options and quality settings
  PROCESSING_OPTIONS: {
    BATCH_SIZE: {
      small: { size: 1, description: 'Single file processing' },
      medium: { size: 5, description: 'Small batch processing' },
      large: { size: 20, description: 'Large batch processing' }
    },
    
    QUALITY_CHECKS: {
      validation: {
        enabled: true,
        description: 'Validate anonymization completeness',
        impact: 'Ensures no PII remains'
      },
      consistency: {
        enabled: true,
        description: 'Maintain consistent replacements',
        impact: 'Same entity gets same replacement'
      },
      context_preservation: {
        enabled: true,
        description: 'Preserve document meaning',
        impact: 'Maintains clinical relevance'
      }
    },

    OUTPUT_FORMATS: {
      original: { name: 'Same as Input', description: 'Maintain original format' },
      pdf: { name: 'PDF', description: 'Secure PDF with watermark' },
      text: { name: 'Plain Text', description: 'Clean text format' },
      structured: { name: 'Structured Data', description: 'JSON with metadata' }
    }
  },

  // Real-time estimation formulas
  ESTIMATION_FORMULAS: {
    calculateProcessingTime: (fileSize, modelId, privacyLevel) => {
      const model = ANONYMIZER_CONFIG.AI_MODELS[modelId];
      const baseTime = model?.processing_time_estimate || 10;
      const sizeMultiplier = Math.max(1, fileSize / 1024); // KB
      const privacyMultiplier = privacyLevel === 'high' ? 1.5 : privacyLevel === 'standard' ? 1.2 : 1.0;
      return Math.round(baseTime * sizeMultiplier * privacyMultiplier);
    },

    calculateCost: (fileSize, modelId, privacyLevel) => {
      const model = ANONYMIZER_CONFIG.AI_MODELS[modelId];
      const baseCost = 0.05; // Base cost per KB
      const modelMultiplier = model?.cost_multiplier || 1.0;
      const sizeInKB = fileSize / 1024;
      const privacyMultiplier = privacyLevel === 'high' ? 1.3 : privacyLevel === 'standard' ? 1.1 : 1.0;
      return (baseCost * sizeInKB * modelMultiplier * privacyMultiplier).toFixed(2);
    },

    calculateAccuracy: (modelId, privacyLevel) => {
      const model = ANONYMIZER_CONFIG.AI_MODELS[modelId];
      const baseAccuracy = model?.accuracy || 85;
      const privacyBonus = privacyLevel === 'high' ? 2 : privacyLevel === 'standard' ? 1 : 0;
      return Math.min(99, baseAccuracy + privacyBonus);
    }
  },

  // Default settings for new users
  DEFAULT_SETTINGS: {
    model: 'advanced_nlp',
    privacy_level: 'standard',
    entity_types: ['person_names', 'medical_ids', 'dates', 'contact_info'],
    quality_checks: true,
    output_format: 'original',
    batch_processing: false
  },

  // UI Themes and customization
  UI_THEMES: {
    medical: {
      primary_color: '#2c5aa0',
      accent_color: '#28a745',
      background: '#f8f9fa',
      card_bg: '#ffffff'
    },
    security: {
      primary_color: '#dc3545',
      accent_color: '#fd7e14',
      background: '#212529',
      card_bg: '#343a40'
    },
    professional: {
      primary_color: '#6f42c1',
      accent_color: '#20c997',
      background: '#ffffff',
      card_bg: '#f8f9fa'
    }
  }
};

// Helper functions for soft-coded operations
export const AnonymizerHelpers = {
  getModelById: (modelId) => {
    return ANONYMIZER_CONFIG.AI_MODELS[modelId] || ANONYMIZER_CONFIG.AI_MODELS.BASIC_RULE_BASED;
  },

  getPrivacyLevelById: (levelId) => {
    return ANONYMIZER_CONFIG.PRIVACY_LEVELS[levelId] || ANONYMIZER_CONFIG.PRIVACY_LEVELS.STANDARD;
  },

  getEntityTypeById: (entityId) => {
    return ANONYMIZER_CONFIG.ENTITY_TYPES[entityId];
  },

  getAllModels: () => {
    return Object.values(ANONYMIZER_CONFIG.AI_MODELS);
  },

  getAllPrivacyLevels: () => {
    return Object.values(ANONYMIZER_CONFIG.PRIVACY_LEVELS);
  },

  getAllEntityTypes: () => {
    return Object.values(ANONYMIZER_CONFIG.ENTITY_TYPES);
  },

  estimateProcessing: (fileSize, modelId, privacyLevel) => {
    return {
      time: ANONYMIZER_CONFIG.ESTIMATION_FORMULAS.calculateProcessingTime(fileSize, modelId, privacyLevel),
      cost: ANONYMIZER_CONFIG.ESTIMATION_FORMULAS.calculateCost(fileSize, modelId, privacyLevel),
      accuracy: ANONYMIZER_CONFIG.ESTIMATION_FORMULAS.calculateAccuracy(modelId, privacyLevel)
    };
  },

  getDefaultSettings: () => {
    return { ...ANONYMIZER_CONFIG.DEFAULT_SETTINGS };
  },

  validateConfiguration: (config) => {
    const errors = [];
    
    if (!config.model || !ANONYMIZER_CONFIG.AI_MODELS[config.model]) {
      errors.push('Invalid AI model selected');
    }
    
    if (!config.privacy_level || !ANONYMIZER_CONFIG.PRIVACY_LEVELS[config.privacy_level]) {
      errors.push('Invalid privacy level selected');
    }
    
    if (!config.entity_types || !Array.isArray(config.entity_types) || config.entity_types.length === 0) {
      errors.push('At least one entity type must be selected');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default ANONYMIZER_CONFIG;
