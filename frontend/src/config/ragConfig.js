// RAG (Retrieval-Augmented Generation) Configuration for Medical Terminology
// Soft-coded configuration for the best Radiology Report Correction Platform

export const RAG_CONFIG = {
  // Data Sources Configuration
  MEDICAL_SOURCES: {
    RADIOPAEDIA: {
      id: 'radiopaedia',
      name: 'Radiopaedia.org',
      baseUrl: 'https://radiopaedia.org',
      description: 'Comprehensive radiology reference with cases and articles',
      priority: 1,
      enabled: true,
      trustScore: 95,
      searchEndpoints: {
        articles: '/search?scope=articles&q=',
        cases: '/search?scope=cases&q=',
        combined: '/search?q='
      },
      categories: [
        'Anatomy', 'Pathology', 'Imaging Technology', 'Interventional Radiology',
        'Classifications', 'Signs', 'Syndromes', 'Mnemonics'
      ],
      specialties: [
        'Breast', 'Cardiac', 'Central Nervous System', 'Chest', 'Gastrointestinal',
        'Musculoskeletal', 'Oncology', 'Spine', 'Trauma', 'Urogenital'
      ]
    },
    RADIOLOGYINFO: {
      id: 'radiologyinfo',
      name: 'RadiologyInfo.org',
      baseUrl: 'https://www.radiologyinfo.org',
      description: 'Patient education and procedure information from ACR/RSNA',
      priority: 2,
      enabled: true,
      trustScore: 92,
      searchEndpoints: {
        procedures: '/en/info/',
        glossary: '/en/glossary-index',
        conditions: '/en/info/'
      },
      categories: [
        'Procedures', 'Exams', 'Radiation Safety', 'Nuclear Medicine',
        'Radiation Therapy', 'Interventional Radiology'
      ]
    },
    RSNA_PUBS: {
      id: 'rsna_pubs',
      name: 'RSNA Publications',
      baseUrl: 'https://pubs.rsna.org',
      description: 'Peer-reviewed radiology research and journals',
      priority: 3,
      enabled: true,
      trustScore: 98,
      searchEndpoints: {
        radiology: '/journal/radiology',
        radiographics: '/journal/radiographics',
        search: '/action/doSearch?field1=AllField&text1='
      },
      categories: [
        'Research Papers', 'Case Studies', 'Technical Innovations',
        'Clinical Guidelines', 'Imaging Protocols'
      ]
    },
    ACR_GUIDELINES: {
      id: 'acr_guidelines',
      name: 'ACR Appropriateness Criteria',
      baseUrl: 'https://www.acr.org',
      description: 'American College of Radiology clinical guidelines',
      priority: 4,
      enabled: true,
      trustScore: 96,
      searchEndpoints: {
        appropriateness: '/Clinical-Resources/ACR-Appropriateness-Criteria',
        practice: '/Practice-Management-Quality-Informatics'
      },
      categories: [
        'Appropriateness Criteria', 'Practice Parameters', 'Technical Standards',
        'Quality Metrics', 'Safety Guidelines'
      ]
    },
    MEDICAL_DICTIONARIES: {
      id: 'medical_dictionaries',
      name: 'Medical Terminology Databases',
      baseUrl: 'multiple',
      description: 'Standardized medical terminology and ontologies',
      priority: 5,
      enabled: true,
      trustScore: 94,
      sources: [
        'SNOMED CT', 'RadLex', 'ICD-10', 'LOINC', 'MeSH Terms'
      ],
      categories: [
        'Anatomy Terms', 'Pathology Terms', 'Procedure Terms',
        'Equipment Terms', 'Measurement Terms'
      ]
    }
  },

  // Search and Retrieval Configuration
  SEARCH_CONFIG: {
    MAX_RESULTS_PER_SOURCE: 10,
    SIMILARITY_THRESHOLD: 0.75,
    CONTEXT_WINDOW_SIZE: 512,
    MAX_TOTAL_RESULTS: 50,
    SEARCH_TIMEOUT_MS: 30000,
    CACHE_DURATION_HOURS: 24,
    PARALLEL_SEARCH_ENABLED: true,
    FALLBACK_SEARCH_ENABLED: true
  },

  // Medical Term Processing Configuration
  TERM_PROCESSING: {
    MEDICAL_PREFIXES: [
      'pre-', 'post-', 'ante-', 'retro-', 'sub-', 'supra-', 'infra-',
      'inter-', 'intra-', 'extra-', 'para-', 'peri-', 'trans-', 'contra-'
    ],
    MEDICAL_SUFFIXES: [
      '-itis', '-osis', '-oma', '-pathy', '-graphy', '-scopy', '-plasty',
      '-ectomy', '-ostomy', '-otomy', '-centesis', '-pexy', '-rhaphy'
    ],
    ANATOMICAL_SYSTEMS: [
      'cardiovascular', 'respiratory', 'nervous', 'musculoskeletal',
      'gastrointestinal', 'urogenital', 'endocrine', 'lymphatic'
    ],
    IMAGING_MODALITIES: [
      'CT', 'MRI', 'ultrasound', 'X-ray', 'mammography', 'nuclear medicine',
      'PET', 'SPECT', 'fluoroscopy', 'interventional'
    ],
    COMMON_MISSPELLINGS: {
      'pneumonia': ['pnemonia', 'pneumonia', 'pnumonia'],
      'hemorrhage': ['hemorage', 'hemorrage', 'hemorrhage'],
      'arteriosclerosis': ['arterioscelrosis', 'arteriosclerosis'],
      'pneumothorax': ['pneumotorax', 'pnuemothorax']
    }
  },

  // Context Enhancement Configuration
  CONTEXT_ENHANCEMENT: {
    SYNONYM_EXPANSION: true,
    ABBREVIATION_EXPANSION: {
      'MI': 'Myocardial Infarction',
      'PE': 'Pulmonary Embolism',
      'DVT': 'Deep Vein Thrombosis',
      'CVA': 'Cerebrovascular Accident',
      'SOB': 'Shortness of Breath',
      'CP': 'Chest Pain',
      'LOC': 'Loss of Consciousness',
      'NAD': 'No Acute Distress'
    },
    ANATOMICAL_RELATIONSHIPS: {
      'lung': ['pulmonary', 'respiratory', 'bronchial', 'alveolar'],
      'heart': ['cardiac', 'cardiovascular', 'myocardial', 'coronary'],
      'brain': ['cerebral', 'neurological', 'cranial', 'intracranial'],
      'kidney': ['renal', 'nephric', 'urological']
    },
    CONTEXTUAL_WEIGHTING: {
      'exact_match': 1.0,
      'synonym_match': 0.9,
      'related_term': 0.8,
      'anatomical_region': 0.7,
      'similar_spelling': 0.6
    }
  },

  // RAG Enhancement Features
  RAG_FEATURES: {
    REAL_TIME_VALIDATION: {
      enabled: true,
      confidence_threshold: 0.8,
      auto_correction: true,
      suggestion_limit: 5
    },
    SEMANTIC_SEARCH: {
      enabled: true,
      embedding_model: 'medical-bert',
      vector_similarity: true,
      contextual_understanding: true
    },
    KNOWLEDGE_GRAPH: {
      enabled: true,
      relationship_mapping: true,
      hierarchical_terms: true,
      cross_reference: true
    },
    LEARNING_SYSTEM: {
      user_feedback_learning: true,
      correction_pattern_analysis: true,
      adaptive_suggestions: true,
      performance_optimization: true
    }
  },

  // Quality Assurance Configuration
  QUALITY_ASSURANCE: {
    SOURCE_VERIFICATION: {
      peer_reviewed_preference: true,
      publication_date_weight: 0.3,
      citation_count_weight: 0.2,
      authority_weight: 0.5
    },
    CONFIDENCE_SCORING: {
      multiple_source_confirmation: 0.4,
      source_authority: 0.3,
      term_frequency: 0.2,
      context_relevance: 0.1
    },
    ERROR_DETECTION: {
      contradiction_detection: true,
      outdated_information_filtering: true,
      bias_detection: true,
      accuracy_validation: true
    }
  },

  // API and Integration Configuration
  API_CONFIG: {
    RATE_LIMITING: {
      requests_per_minute: 60,
      burst_allowance: 10,
      cooldown_period: 300
    },
    CACHING_STRATEGY: {
      local_cache: true,
      distributed_cache: false,
      cache_invalidation: 'time_based',
      cache_compression: true
    },
    FALLBACK_MECHANISMS: {
      offline_dictionary: true,
      cached_responses: true,
      simplified_search: true,
      user_dictionary: true
    }
  },

  // Performance Optimization
  PERFORMANCE: {
    LAZY_LOADING: true,
    BACKGROUND_PREFETCH: true,
    PROGRESSIVE_ENHANCEMENT: true,
    ADAPTIVE_QUALITY: true,
    BANDWIDTH_OPTIMIZATION: true
  },

  // User Experience Configuration
  UX_CONFIG: {
    SUGGESTION_DISPLAY: {
      max_suggestions: 5,
      confidence_display: true,
      source_attribution: true,
      explanation_provided: true
    },
    INTERACTION_MODES: {
      auto_complete: true,
      real_time_correction: true,
      batch_processing: true,
      manual_lookup: true
    },
    ACCESSIBILITY: {
      screen_reader_support: true,
      keyboard_navigation: true,
      high_contrast_mode: true,
      text_scaling: true
    }
  }
};

// Medical Terminology Validation Rules
export const VALIDATION_RULES = {
  TERM_PATTERNS: {
    medical_term: /^[a-zA-Z][\w\s\-\'\.]{1,50}$/,
    abbreviation: /^[A-Z]{2,10}$/,
    drug_name: /^[a-zA-Z][\w\s\-]{1,30}$/,
    anatomical_term: /^[a-zA-Z][\w\s\-]{1,40}$/
  },
  CONTEXT_VALIDATION: {
    min_context_length: 10,
    max_context_length: 1000,
    required_medical_indicators: ['patient', 'findings', 'impression', 'diagnosis']
  }
};

// Export helper functions
export const RAGHelpers = {
  // Get enabled sources
  getEnabledSources: () => {
    return Object.values(RAG_CONFIG.MEDICAL_SOURCES).filter(source => source.enabled);
  },

  // Calculate source priority
  calculateSourcePriority: (sourceId, trustScore, availability) => {
    const source = RAG_CONFIG.MEDICAL_SOURCES[sourceId];
    if (!source) return 0;
    
    return (source.priority * 0.3) + (trustScore * 0.5) + (availability * 0.2);
  },

  // Format search query for medical context
  formatMedicalQuery: (term, context = '') => {
    const expandedTerm = RAG_CONFIG.CONTEXT_ENHANCEMENT.ABBREVIATION_EXPANSION[term.toUpperCase()] || term;
    return `${expandedTerm} ${context}`.trim();
  },

  // Validate medical terminology
  validateMedicalTerm: (term) => {
    return VALIDATION_RULES.TERM_PATTERNS.medical_term.test(term);
  },

  // Get contextual suggestions
  getContextualSuggestions: (term, anatomicalSystem) => {
    const relationships = RAG_CONFIG.CONTEXT_ENHANCEMENT.ANATOMICAL_RELATIONSHIPS[anatomicalSystem] || [];
    return relationships.filter(related => related.includes(term.toLowerCase()));
  }
};

export default RAG_CONFIG;
