// Advanced AI Models Configuration - Soft Coding for Radiology System
import { ENV_CONFIG, ConfigHelpers } from './appConfig.js';

// Medical AI Models Configuration
export const AI_MODELS_CONFIG = {
  // Medical Language Models
  MEDICAL_MODELS: {
    GPT4_MEDICAL: {
      id: 'gpt-4-medical',
      name: 'GPT-4 Medical Specialist',
      description: 'Advanced medical language model optimized for radiology reports',
      provider: 'OpenAI',
      capabilities: ['error_correction', 'medical_terminology', 'clinical_insights', 'rag_enhancement'],
      accuracy: 98.5,
      speed: 'medium',
      cost: 'high',
      specialty: ['radiology', 'pathology', 'general_medicine'],
      enabled: ENV_CONFIG.FEATURES.enableChatbot,
      icon: 'ri-brain-line',
      color: '#4A90E2'
    },
    
    CLAUDE_MEDICAL: {
      id: 'claude-medical',
      name: 'Claude Medical Assistant',
      description: 'Anthropic Claude specialized for medical documentation',
      provider: 'Anthropic',
      capabilities: ['error_correction', 'medical_terminology', 'contextual_analysis'],
      accuracy: 97.8,
      speed: 'fast',
      cost: 'medium',
      specialty: ['radiology', 'medical_reports'],
      enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_CLAUDE', 'false') === 'true',
      icon: 'ri-user-star-line',
      color: '#FF6B6B'
    },
    
    MEDPALM: {
      id: 'medpalm-2',
      name: 'Med-PaLM 2',
      description: 'Google specialized medical AI for clinical applications',
      provider: 'Google',
      capabilities: ['medical_qa', 'clinical_reasoning', 'differential_diagnosis'],
      accuracy: 96.9,
      speed: 'medium',
      cost: 'medium',
      specialty: ['clinical_diagnosis', 'medical_imaging'],
      enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_MEDPALM', 'false') === 'true',
      icon: 'ri-microscope-line',
      color: '#4285F4'
    },
    
    BIOMISTRAL: {
      id: 'biomistral-7b',
      name: 'BioMistral Medical LLM',
      description: 'Open-source medical language model for biomedical tasks',
      provider: 'Mistral AI',
      capabilities: ['biomedical_text', 'medical_terminology', 'research_analysis'],
      accuracy: 94.2,
      speed: 'fast',
      cost: 'low',
      specialty: ['biomedical_research', 'medical_terminology'],
      enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_BIOMISTRAL', 'true') === 'true',
      icon: 'ri-flask-line',
      color: '#28A745'
    },
    
    CLINICAL_BERT: {
      id: 'clinical-bert',
      name: 'ClinicalBERT NLP',
      description: 'BERT model fine-tuned on clinical notes and medical texts',
      provider: 'MIT',
      capabilities: ['ner_medical', 'text_classification', 'clinical_ner'],
      accuracy: 92.1,
      speed: 'very_fast',
      cost: 'very_low',
      specialty: ['clinical_notes', 'medical_ner'],
      enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_CLINICAL_BERT', 'true') === 'true',
      icon: 'ri-search-eye-line',
      color: '#17A2B8'
    }
  },

  // RAG (Retrieval-Augmented Generation) Configuration
  RAG_CONFIG: {
    VECTOR_DATABASES: {
      PINECONE: {
        id: 'pinecone',
        name: 'Pinecone Vector DB',
        description: 'High-performance vector database for medical knowledge',
        enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_PINECONE', 'false') === 'true',
        apiEndpoint: ConfigHelpers.getEnvVar('VITE_PINECONE_ENDPOINT', ''),
        dimensions: 1536,
        metric: 'cosine'
      },
      
      CHROMA: {
        id: 'chroma',
        name: 'ChromaDB',
        description: 'Open-source vector database for RAG applications',
        enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_CHROMA', 'true') === 'true',
        apiEndpoint: ConfigHelpers.getEnvVar('VITE_CHROMA_ENDPOINT', 'http://localhost:8001'),
        dimensions: 768,
        metric: 'cosine'
      }
    },
    
    KNOWLEDGE_SOURCES: {
      MEDICAL_TEXTBOOKS: {
        name: 'Medical Textbooks',
        description: 'Comprehensive medical textbooks and references',
        enabled: true,
        weight: 0.8,
        sources: ['Harrison\'s Principles', 'Gray\'s Anatomy', 'Robbins Pathology']
      },
      
      RADIOLOGY_ATLAS: {
        name: 'Radiology Atlas',
        description: 'Comprehensive radiology imaging atlas and references',
        enabled: true,
        weight: 0.9,
        sources: ['Diagnostic Imaging Atlas', 'ACR Appropriateness Criteria']
      },
      
      CLINICAL_GUIDELINES: {
        name: 'Clinical Guidelines',
        description: 'Latest clinical practice guidelines and protocols',
        enabled: true,
        weight: 0.7,
        sources: ['WHO Guidelines', 'ACR Guidelines', 'RSNA Recommendations']
      },
      
      MEDICAL_JOURNALS: {
        name: 'Medical Journals',
        description: 'Recent peer-reviewed medical literature',
        enabled: ConfigHelpers.getEnvVar('VITE_ENABLE_JOURNAL_RAG', 'true') === 'true',
        weight: 0.6,
        sources: ['PubMed', 'Nature Medicine', 'Radiology Journal']
      }
    }
  },

  // AI Processing Modes
  PROCESSING_MODES: {
    BASIC_CORRECTION: {
      id: 'basic',
      name: 'Basic Correction',
      description: 'Standard spell check and grammar correction',
      models: ['clinical-bert'],
      ragEnabled: false,
      processingTime: 'fast',
      accuracy: 'good'
    },
    
    ADVANCED_MEDICAL: {
      id: 'advanced',
      name: 'Advanced Medical AI',
      description: 'Comprehensive medical terminology and context analysis',
      models: ['gpt-4-medical', 'biomistral-7b'],
      ragEnabled: true,
      processingTime: 'medium',
      accuracy: 'excellent'
    },
    
    CLINICAL_VALIDATION: {
      id: 'clinical',
      name: 'Clinical Validation',
      description: 'Multi-model validation with clinical guidelines',
      models: ['gpt-4-medical', 'medpalm-2', 'claude-medical'],
      ragEnabled: true,
      processingTime: 'slow',
      accuracy: 'highest'
    },
    
    RESEARCH_MODE: {
      id: 'research',
      name: 'Research & Analysis',
      description: 'Deep analysis with latest research integration',
      models: ['gpt-4-medical', 'biomistral-7b'],
      ragEnabled: true,
      researchIntegration: true,
      processingTime: 'slow',
      accuracy: 'research_grade'
    }
  },

  // AI Feature Flags
  FEATURES: {
    REAL_TIME_CORRECTION: ConfigHelpers.getEnvVar('VITE_REAL_TIME_CORRECTION', 'true') === 'true',
    BATCH_PROCESSING: ConfigHelpers.getEnvVar('VITE_BATCH_PROCESSING', 'true') === 'true',
    MULTI_MODEL_COMPARISON: ConfigHelpers.getEnvVar('VITE_MULTI_MODEL_COMPARISON', 'true') === 'true',
    CONFIDENCE_SCORING: ConfigHelpers.getEnvVar('VITE_CONFIDENCE_SCORING', 'true') === 'true',
    EXPLANATION_GENERATION: ConfigHelpers.getEnvVar('VITE_EXPLANATION_GENERATION', 'true') === 'true',
    MEDICAL_TERMINOLOGY_CHECK: true,
    CLINICAL_CONTEXT_ANALYSIS: true,
    DIFFERENTIAL_DIAGNOSIS_SUPPORT: ConfigHelpers.getEnvVar('VITE_DIFFERENTIAL_DIAGNOSIS', 'false') === 'true'
  },

  // Performance Configuration
  PERFORMANCE: {
    MAX_CONCURRENT_REQUESTS: parseInt(ConfigHelpers.getEnvVar('VITE_MAX_CONCURRENT_AI_REQUESTS', '3')),
    REQUEST_TIMEOUT: parseInt(ConfigHelpers.getEnvVar('VITE_AI_REQUEST_TIMEOUT', '30000')),
    CACHE_ENABLED: ConfigHelpers.getEnvVar('VITE_AI_CACHE_ENABLED', 'true') === 'true',
    CACHE_DURATION: parseInt(ConfigHelpers.getEnvVar('VITE_AI_CACHE_DURATION', '3600000')), // 1 hour
    RETRY_ATTEMPTS: parseInt(ConfigHelpers.getEnvVar('VITE_AI_RETRY_ATTEMPTS', '2'))
  }
};

// Helper Functions for AI Models
export const AIModelHelpers = {
  // Get available models based on capabilities
  getModelsByCapability: (capability) => {
    return Object.values(AI_MODELS_CONFIG.MEDICAL_MODELS)
      .filter(model => model.enabled && model.capabilities.includes(capability));
  },

  // Get recommended models for specific medical specialty
  getModelsBySpecialty: (specialty) => {
    return Object.values(AI_MODELS_CONFIG.MEDICAL_MODELS)
      .filter(model => model.enabled && model.specialty.includes(specialty))
      .sort((a, b) => b.accuracy - a.accuracy);
  },

  // Get best model for given requirements
  getBestModel: (requirements = {}) => {
    const { specialty, speed, cost, accuracy } = requirements;
    let models = Object.values(AI_MODELS_CONFIG.MEDICAL_MODELS).filter(model => model.enabled);

    if (specialty) {
      models = models.filter(model => model.specialty.includes(specialty));
    }

    if (speed) {
      models = models.filter(model => model.speed === speed);
    }

    if (cost) {
      models = models.filter(model => model.cost === cost);
    }

    return models.sort((a, b) => b.accuracy - a.accuracy)[0] || null;
  },

  // Calculate processing cost estimate
  estimateProcessingCost: (modelId, textLength) => {
    const model = AI_MODELS_CONFIG.MEDICAL_MODELS[modelId.toUpperCase().replace('-', '_')];
    if (!model) return 0;

    const costMultipliers = { low: 0.1, medium: 0.5, high: 1.0, very_low: 0.05 };
    const baseCost = costMultipliers[model.cost] || 0.5;
    
    return (textLength / 1000) * baseCost; // Cost per 1000 characters
  },

  // Get processing time estimate
  estimateProcessingTime: (modelId, textLength) => {
    const model = AI_MODELS_CONFIG.MEDICAL_MODELS[modelId.toUpperCase().replace('-', '_')];
    if (!model) return 30;

    const speedMultipliers = { very_fast: 1, fast: 2, medium: 5, slow: 10 };
    const baseTime = speedMultipliers[model.speed] || 5;
    
    return Math.max(5, (textLength / 100) * baseTime); // Minimum 5 seconds
  },

  // Validate model configuration
  validateModelConfig: () => {
    const errors = [];
    const enabledModels = Object.values(AI_MODELS_CONFIG.MEDICAL_MODELS)
      .filter(model => model.enabled);

    if (enabledModels.length === 0) {
      errors.push('No AI models are enabled');
    }

    if (AI_MODELS_CONFIG.RAG_CONFIG.VECTOR_DATABASES.PINECONE.enabled && 
        !AI_MODELS_CONFIG.RAG_CONFIG.VECTOR_DATABASES.PINECONE.apiEndpoint) {
      errors.push('Pinecone endpoint not configured');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      enabledModels: enabledModels.length
    };
  }
};

// Export all configurations and helpers
export { AIModelHelpers };
export default AI_MODELS_CONFIG;
