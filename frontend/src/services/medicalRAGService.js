// RAG Service Implementation for Medical Terminology Enhancement
// Advanced Retrieval-Augmented Generation for Radiology Report Correction

import { RAG_CONFIG, RAGHelpers, VALIDATION_RULES } from '../config/ragConfig.js';

class MedicalRAGService {
  constructor() {
    this.cache = new Map();
    this.searchHistory = [];
    this.userPreferences = {
      preferredSources: ['radiopaedia', 'radiologyinfo'],
      confidenceThreshold: 0.8,
      maxSuggestions: 5
    };
    this.performanceMetrics = {
      searchCount: 0,
      averageResponseTime: 0,
      cacheHitRate: 0
    };
  }

  // Main method for medical term validation and enhancement
  async enhanceMedicalReport(reportText, options = {}) {
    try {
      const startTime = performance.now();
      
      // Extract medical terms from report
      const extractedTerms = this.extractMedicalTerms(reportText);
      
      // Process each term with RAG enhancement
      const enhancedTerms = await this.processTermsWithRAG(extractedTerms, options);
      
      // Generate final enhanced report
      const enhancedReport = this.generateEnhancedReport(reportText, enhancedTerms);
      
      // Update performance metrics
      this.updatePerformanceMetrics(performance.now() - startTime);
      
      return {
        originalReport: reportText,
        enhancedReport: enhancedReport.text,
        corrections: enhancedReport.corrections,
        suggestions: enhancedReport.suggestions,
        confidence: enhancedReport.overallConfidence,
        sources: enhancedReport.sourcesUsed,
        processingTime: performance.now() - startTime,
        termsProcessed: extractedTerms.length
      };
    } catch (error) {
      console.error('RAG Enhancement Error:', error);
      return this.getFallbackResponse(reportText, error);
    }
  }

  // Extract medical terms using advanced pattern recognition
  extractMedicalTerms(text) {
    const terms = [];
    const medicalTermPatterns = [
      // Anatomical terms
      /\b(heart|lung|brain|kidney|liver|spleen|pancreas|stomach|intestine)\w*\b/gi,
      // Pathological conditions
      /\b\w*(itis|osis|oma|pathy|cardia|pnea|algia|rrhea)\b/gi,
      // Imaging findings
      /\b(opacity|density|enhancement|lesion|mass|nodule|consolidation)\w*\b/gi,
      // Medical procedures
      /\b\w*(graphy|scopy|centesis|plasty|ectomy|ostomy|otomy)\b/gi,
      // Measurements and quantifiers
      /\b(\d+\.?\d*\s*(mm|cm|ml|cc|hounsfield|units?))\b/gi,
      // Abbreviations
      /\b[A-Z]{2,6}\b/g
    ];

    medicalTermPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => {
        const term = match.trim().toLowerCase();
        if (RAGHelpers.validateMedicalTerm(term) && !terms.some(t => t.term === term)) {
          terms.push({
            term: term,
            originalTerm: match,
            position: text.indexOf(match),
            context: this.getTermContext(text, match),
            type: this.classifyMedicalTerm(term)
          });
        }
      });
    });

    return terms;
  }

  // Get surrounding context for better term understanding
  getTermContext(text, term) {
    const index = text.indexOf(term);
    const contextRadius = RAG_CONFIG.SEARCH_CONFIG.CONTEXT_WINDOW_SIZE / 2;
    const start = Math.max(0, index - contextRadius);
    const end = Math.min(text.length, index + term.length + contextRadius);
    return text.substring(start, end);
  }

  // Classify medical terms by type
  classifyMedicalTerm(term) {
    const classifications = {
      anatomy: /^(heart|lung|brain|kidney|liver|spleen)/i,
      pathology: /.*?(itis|osis|oma|pathy)$/i,
      procedure: /.*?(graphy|scopy|plasty|ectomy)$/i,
      finding: /(opacity|density|enhancement|lesion|mass|nodule)/i,
      measurement: /\d+\.?\d*\s*(mm|cm|ml|cc)/i,
      abbreviation: /^[A-Z]{2,6}$/
    };

    for (const [type, pattern] of Object.entries(classifications)) {
      if (pattern.test(term)) return type;
    }
    return 'general';
  }

  // Process terms with RAG enhancement
  async processTermsWithRAG(terms, options) {
    const processedTerms = [];
    const enabledSources = RAGHelpers.getEnabledSources();

    for (const termObj of terms) {
      try {
        // Check cache first
        const cacheKey = `${termObj.term}_${termObj.type}`;
        if (this.cache.has(cacheKey)) {
          processedTerms.push({
            ...termObj,
            enhancement: this.cache.get(cacheKey)
          });
          continue;
        }

        // Search across medical sources
        const searchResults = await this.searchMedicalSources(termObj, enabledSources);
        
        // Validate and score results
        const validatedResults = this.validateSearchResults(searchResults, termObj);
        
        // Generate enhancement suggestions
        const enhancement = this.generateTermEnhancement(termObj, validatedResults);
        
        // Cache results
        this.cache.set(cacheKey, enhancement);
        
        processedTerms.push({
          ...termObj,
          enhancement
        });

      } catch (error) {
        console.warn(`Error processing term "${termObj.term}":`, error);
        processedTerms.push({
          ...termObj,
          enhancement: this.getFallbackEnhancement(termObj)
        });
      }
    }

    return processedTerms;
  }

  // Search across multiple medical knowledge sources
  async searchMedicalSources(termObj, sources) {
    const searchPromises = sources.map(source => 
      this.searchSingleSource(source, termObj)
    );

    try {
      const results = await Promise.allSettled(searchPromises);
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .flat();
    } catch (error) {
      console.error('Multi-source search error:', error);
      return [];
    }
  }

  // Search a single medical knowledge source
  async searchSingleSource(source, termObj) {
    // Simulate web scraping/API calls to medical sources
    // In production, this would make actual HTTP requests
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = this.generateMockMedicalData(source, termObj);
        resolve(mockResults);
      }, Math.random() * 1000 + 500); // Simulate network delay
    });
  }

  // Generate mock medical data (replace with actual API calls in production)
  generateMockMedicalData(source, termObj) {
    const medicalDefinitions = {
      'pneumonia': {
        definition: 'Infection that inflames air sacs in one or both lungs',
        synonyms: ['pneumonitis', 'lung infection'],
        context: 'Respiratory pathology',
        severity: 'moderate to severe',
        commonFindings: ['consolidation', 'air bronchograms', 'pleural effusion']
      },
      'cardiomegaly': {
        definition: 'Enlargement of the heart',
        synonyms: ['enlarged heart', 'cardiac enlargement'],
        context: 'Cardiac pathology',
        severity: 'variable',
        commonFindings: ['increased cardiac silhouette', 'ventricular dilation']
      },
      'opacity': {
        definition: 'Area of increased density on radiographic imaging',
        synonyms: ['density', 'infiltrate'],
        context: 'Imaging finding',
        severity: 'variable',
        associations: ['infection', 'inflammation', 'tumor', 'fluid']
      }
    };

    const termData = medicalDefinitions[termObj.term] || {
      definition: `Medical term related to ${termObj.type}`,
      synonyms: [],
      context: termObj.type,
      severity: 'unknown',
      associations: []
    };

    return [{
      term: termObj.term,
      source: source.name,
      sourceId: source.id,
      trustScore: source.trustScore,
      definition: termData.definition,
      synonyms: termData.synonyms,
      clinicalContext: termData.context,
      severity: termData.severity,
      relatedTerms: termData.associations,
      confidence: 0.85 + (Math.random() * 0.1),
      url: `${source.baseUrl}/article/${termObj.term}`,
      lastUpdated: new Date().toISOString()
    }];
  }

  // Validate search results for medical accuracy
  validateSearchResults(results, termObj) {
    return results
      .filter(result => result.confidence >= RAG_CONFIG.SEARCH_CONFIG.SIMILARITY_THRESHOLD)
      .sort((a, b) => (b.confidence * b.trustScore) - (a.confidence * a.trustScore))
      .slice(0, RAG_CONFIG.SEARCH_CONFIG.MAX_RESULTS_PER_SOURCE);
  }

  // Generate enhancement suggestions for medical terms
  generateTermEnhancement(termObj, validatedResults) {
    if (validatedResults.length === 0) {
      return this.getFallbackEnhancement(termObj);
    }

    const primaryResult = validatedResults[0];
    const alternativeResults = validatedResults.slice(1, 3);

    return {
      originalTerm: termObj.term,
      validatedDefinition: primaryResult.definition,
      confidence: primaryResult.confidence,
      suggestions: {
        synonyms: primaryResult.synonyms || [],
        alternatives: alternativeResults.map(r => ({
          term: r.term,
          definition: r.definition,
          confidence: r.confidence,
          source: r.source
        })),
        corrections: this.getSpellingCorrections(termObj.term),
        contextualTerms: this.getContextualTerms(termObj, validatedResults)
      },
      clinicalContext: {
        severity: primaryResult.severity,
        bodySystem: this.identifyBodySystem(termObj.term),
        imagingFindings: primaryResult.relatedTerms || [],
        clinicalSignificance: this.assessClinicalSignificance(termObj, primaryResult)
      },
      sources: validatedResults.map(r => ({
        name: r.source,
        url: r.url,
        trustScore: r.trustScore,
        lastUpdated: r.lastUpdated
      })),
      qualityMetrics: {
        sourceConsensus: validatedResults.length > 1,
        peerReviewed: validatedResults.some(r => r.sourceId === 'rsna_pubs'),
        recentlyUpdated: validatedResults.some(r => 
          new Date(r.lastUpdated) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        )
      }
    };
  }

  // Get spelling corrections for medical terms
  getSpellingCorrections(term) {
    const corrections = [];
    const commonMisspellings = RAG_CONFIG.TERM_PROCESSING.COMMON_MISSPELLINGS;
    
    for (const [correct, variants] of Object.entries(commonMisspellings)) {
      if (variants.includes(term)) {
        corrections.push({
          suggested: correct,
          confidence: 0.9,
          type: 'spelling'
        });
      }
    }
    
    return corrections;
  }

  // Get contextually related terms
  getContextualTerms(termObj, results) {
    const contextualTerms = new Set();
    
    results.forEach(result => {
      if (result.relatedTerms) {
        result.relatedTerms.forEach(term => contextualTerms.add(term));
      }
    });
    
    return Array.from(contextualTerms).slice(0, 5);
  }

  // Identify anatomical body system
  identifyBodySystem(term) {
    const systemKeywords = {
      'cardiovascular': ['heart', 'cardiac', 'coronary', 'aorta', 'vessel'],
      'respiratory': ['lung', 'pulmonary', 'bronch', 'pleural', 'pneum'],
      'nervous': ['brain', 'cerebral', 'cranial', 'neural', 'spine'],
      'musculoskeletal': ['bone', 'joint', 'muscle', 'skeletal', 'fracture'],
      'gastrointestinal': ['stomach', 'bowel', 'liver', 'pancreas', 'colon'],
      'urogenital': ['kidney', 'renal', 'bladder', 'ureteral', 'prostate']
    };

    for (const [system, keywords] of Object.entries(systemKeywords)) {
      if (keywords.some(keyword => term.includes(keyword))) {
        return system;
      }
    }
    
    return 'general';
  }

  // Assess clinical significance of findings
  assessClinicalSignificance(termObj, result) {
    const significanceMap = {
      'high': ['carcinoma', 'malignant', 'acute', 'severe', 'critical'],
      'moderate': ['chronic', 'moderate', 'significant', 'notable'],
      'low': ['mild', 'minimal', 'trace', 'small', 'slight']
    };

    for (const [level, keywords] of Object.entries(significanceMap)) {
      if (keywords.some(keyword => 
        result.definition.toLowerCase().includes(keyword) ||
        termObj.context.toLowerCase().includes(keyword)
      )) {
        return level;
      }
    }

    return 'moderate';
  }

  // Generate final enhanced report
  generateEnhancedReport(originalText, enhancedTerms) {
    let enhancedText = originalText;
    const corrections = [];
    const suggestions = [];
    const sourcesUsed = new Set();
    let totalConfidence = 0;

    enhancedTerms.forEach(termObj => {
      if (termObj.enhancement) {
        const enhancement = termObj.enhancement;
        
        // Apply corrections if confidence is high enough
        if (enhancement.confidence >= this.userPreferences.confidenceThreshold) {
          if (enhancement.suggestions.corrections.length > 0) {
            const correction = enhancement.suggestions.corrections[0];
            enhancedText = enhancedText.replace(
              new RegExp(`\\b${termObj.originalTerm}\\b`, 'gi'),
              correction.suggested
            );
            corrections.push({
              original: termObj.originalTerm,
              corrected: correction.suggested,
              confidence: correction.confidence,
              reason: 'spelling_correction'
            });
          }
        }

        // Collect suggestions
        if (enhancement.suggestions.synonyms.length > 0) {
          suggestions.push({
            term: termObj.term,
            synonyms: enhancement.suggestions.synonyms,
            confidence: enhancement.confidence
          });
        }

        // Track sources
        enhancement.sources.forEach(source => sourcesUsed.add(source.name));
        totalConfidence += enhancement.confidence;
      }
    });

    return {
      text: enhancedText,
      corrections,
      suggestions,
      overallConfidence: enhancedTerms.length > 0 ? totalConfidence / enhancedTerms.length : 0,
      sourcesUsed: Array.from(sourcesUsed)
    };
  }

  // Fallback enhancement when main process fails
  getFallbackEnhancement(termObj) {
    return {
      originalTerm: termObj.term,
      validatedDefinition: `Medical term: ${termObj.term}`,
      confidence: 0.5,
      suggestions: {
        synonyms: [],
        alternatives: [],
        corrections: [],
        contextualTerms: []
      },
      clinicalContext: {
        severity: 'unknown',
        bodySystem: 'general',
        imagingFindings: [],
        clinicalSignificance: 'moderate'
      },
      sources: [],
      qualityMetrics: {
        sourceConsensus: false,
        peerReviewed: false,
        recentlyUpdated: false
      }
    };
  }

  // Fallback response for complete process failure
  getFallbackResponse(originalText, error) {
    return {
      originalReport: originalText,
      enhancedReport: originalText,
      corrections: [],
      suggestions: [],
      confidence: 0,
      sources: [],
      processingTime: 0,
      termsProcessed: 0,
      error: error.message,
      fallbackUsed: true
    };
  }

  // Update performance metrics
  updatePerformanceMetrics(responseTime) {
    this.performanceMetrics.searchCount++;
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime + responseTime) / 2;
  }

  // Get performance statistics
  getPerformanceStats() {
    return {
      ...this.performanceMetrics,
      cacheSize: this.cache.size,
      cacheHitRate: this.cache.size > 0 ? 
        (this.performanceMetrics.searchCount - this.cache.size) / this.performanceMetrics.searchCount : 0
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Update user preferences
  updateUserPreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }
}

// Export singleton instance
export const medicalRAGService = new MedicalRAGService();
export default MedicalRAGService;
