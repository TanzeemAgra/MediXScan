/**
 * Medical Term Recommendation System
 * Intelligent recommendations for medical terminology improvements
 */

export const MEDICAL_RECOMMENDATIONS = {
  // Common medical term corrections and improvements
  anatomical: {
    'lung': {
      recommendations: ['lungs', 'pulmonary parenchyma', 'lung fields'],
      context: 'Usually plural in radiology reports',
      severity: 'grammar',
      autoCorrect: 'lungs'
    },
    'heart': {
      recommendations: ['cardiac silhouette', 'heart size', 'cardiac borders'],
      context: 'More specific terminology preferred',
      severity: 'style',
      autoCorrect: 'cardiac silhouette'
    },
    'kidney': {
      recommendations: ['kidneys', 'renal parenchyma', 'bilateral kidneys'],
      context: 'Usually referenced as bilateral organs',
      severity: 'grammar',
      autoCorrect: 'kidneys'
    },
    'brain': {
      recommendations: ['cerebral hemispheres', 'intracranial contents', 'brain parenchyma'],
      context: 'More specific anatomical description',
      severity: 'style'
    }
  },
  
  pathological: {
    'mass': {
      recommendations: ['lesion', 'nodule', 'focal abnormality', 'space-occupying lesion'],
      context: 'Consider more specific terminology based on characteristics',
      severity: 'clinical'
    },
    'abnormal': {
      recommendations: ['unremarkable', 'within normal limits', 'no acute abnormality'],
      context: 'More specific description preferred',
      severity: 'clinical',
      autoCorrect: 'no acute abnormality'
    },
    'normal': {
      recommendations: ['unremarkable', 'within normal limits', 'no acute findings'],
      context: 'Professional radiology terminology',
      severity: 'style',
      autoCorrect: 'unremarkable'
    },
    'inflammation': {
      recommendations: ['inflammatory changes', 'inflammatory process', 'acute inflammation'],
      context: 'More specific inflammatory description',
      severity: 'clinical'
    }
  },
  
  imaging: {
    'scan': {
      recommendations: ['examination', 'study', 'imaging study'],
      context: 'More professional terminology',
      severity: 'style',
      autoCorrect: 'examination'
    },
    'picture': {
      recommendations: ['image', 'radiograph', 'study'],
      context: 'Informal term - use professional alternative',
      severity: 'grammar',
      autoCorrect: 'image'
    },
    'xray': {
      recommendations: ['X-ray', 'radiograph', 'plain radiograph'],
      context: 'Proper capitalization and terminology',
      severity: 'grammar',
      autoCorrect: 'X-ray'
    }
  },
  
  measurements: {
    'small': {
      recommendations: ['measuring X mm', 'approximately X cm', 'X mm in diameter'],
      context: 'Provide specific measurements when possible',
      severity: 'clinical'
    },
    'large': {
      recommendations: ['measuring X cm', 'approximately X cm in size', 'X cm in greatest dimension'],
      context: 'Quantify size with measurements',
      severity: 'clinical'
    },
    'big': {
      recommendations: ['large', 'enlarged', 'measuring X cm'],
      context: 'Use professional terminology',
      severity: 'style',
      autoCorrect: 'enlarged'
    }
  },
  
  // Common phrases that need improvement
  phrases: {
    'no acute findings': {
      recommendations: ['no acute abnormality', 'within normal limits', 'unremarkable examination'],
      context: 'More specific and professional phrasing',
      severity: 'style'
    },
    'looks normal': {
      recommendations: ['appears unremarkable', 'within normal limits', 'no abnormality detected'],
      context: 'Avoid informal language',
      severity: 'grammar',
      autoCorrect: 'appears unremarkable'
    },
    'seems fine': {
      recommendations: ['unremarkable', 'within normal limits', 'no abnormality identified'],
      context: 'Use professional medical terminology',
      severity: 'grammar',
      autoCorrect: 'unremarkable'
    }
  }
};

export const RECOMMENDATION_TYPES = {
  grammar: {
    icon: 'fas fa-spell-check',
    color: '#dc3545',
    label: 'Grammar',
    priority: 1
  },
  clinical: {
    icon: 'fas fa-user-md',
    color: '#fd7e14',
    label: 'Clinical',
    priority: 2
  },
  style: {
    icon: 'fas fa-edit',
    color: '#20c997',
    label: 'Style',
    priority: 3
  }
};

/**
 * Get recommendations for a specific medical term
 */
export const getTermRecommendations = (term, category = 'anatomical') => {
  const termLower = term.toLowerCase();
  
  // Check in specific category
  if (MEDICAL_RECOMMENDATIONS[category] && MEDICAL_RECOMMENDATIONS[category][termLower]) {
    return {
      ...MEDICAL_RECOMMENDATIONS[category][termLower],
      originalTerm: term,
      category
    };
  }
  
  // Check in all categories
  for (const [cat, terms] of Object.entries(MEDICAL_RECOMMENDATIONS)) {
    if (terms[termLower]) {
      return {
        ...terms[termLower],
        originalTerm: term,
        category: cat
      };
    }
  }
  
  // Check for phrase matches
  for (const [phrase, rec] of Object.entries(MEDICAL_RECOMMENDATIONS.phrases)) {
    if (termLower.includes(phrase) || phrase.includes(termLower)) {
      return {
        ...rec,
        originalTerm: term,
        category: 'phrases'
      };
    }
  }
  
  return null;
};

/**
 * Get all recommendations for a text
 */
export const getAllRecommendations = (text) => {
  const recommendations = [];
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  words.forEach((word, index) => {
    const recommendation = getTermRecommendations(word);
    if (recommendation) {
      recommendations.push({
        ...recommendation,
        position: index,
        inText: text.includes(word)
      });
    }
  });
  
  // Sort by priority (grammar first, then clinical, then style)
  return recommendations.sort((a, b) => {
    const priorityA = RECOMMENDATION_TYPES[a.severity]?.priority || 999;
    const priorityB = RECOMMENDATION_TYPES[b.severity]?.priority || 999;
    return priorityA - priorityB;
  });
};

/**
 * Apply automatic corrections to text
 */
export const applyAutoCorrections = (text, selectedRecommendations = []) => {
  let correctedText = text;
  
  selectedRecommendations.forEach(rec => {
    if (rec.autoCorrect) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${rec.originalTerm}\\b`, 'gi');
      correctedText = correctedText.replace(regex, rec.autoCorrect);
    }
  });
  
  return correctedText;
};

/**
 * Generate correction explanation
 */
export const generateCorrectionExplanation = (originalTerm, recommendation) => {
  const typeInfo = RECOMMENDATION_TYPES[recommendation.severity];
  return {
    type: recommendation.severity,
    icon: typeInfo.icon,
    color: typeInfo.color,
    explanation: `${typeInfo.label}: ${recommendation.context}`,
    suggestions: recommendation.recommendations,
    autoCorrect: recommendation.autoCorrect
  };
};
