import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { 
  getTermRecommendations, 
  getAllRecommendations,
  applyAutoCorrections,
  generateCorrectionExplanation,
  RECOMMENDATION_TYPES 
} from '../config/medicalRecommendations.js';
import { MedicalTerminologyErrorBoundary } from './MedicalComponentErrorBoundary.jsx';
import { ENV_CONFIG } from '../config/appConfig.js';

const EnhancedHighlightLegendsCore = ({ 
  highlightedTerms = [], 
  reportText = '',
  onTextCorrection,
  onRecommendationApplied 
}) => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [correctedText, setCorrectedText] = useState(reportText);
  const [componentError, setComponentError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get recommendations for all terms with error handling
  useEffect(() => {
    const loadRecommendations = async () => {
      if (highlightedTerms.length === 0) {
        setAllRecommendations([]);
        return;
      }

      setIsLoading(true);
      setComponentError(null);

      try {
        const recommendations = [];
        
        highlightedTerms.forEach(term => {
          try {
            const rec = getTermRecommendations(term.text || term);
            if (rec) {
              recommendations.push({
                ...rec,
                termId: term.id || Math.random().toString(36).substr(2, 9),
                termText: term.text || term,
                termType: term.type || 'medical'
              });
            }
          } catch (termError) {
            console.warn(`Failed to get recommendations for term: ${term.text || term}`, termError);
            // Continue processing other terms
          }
        });
        
        setAllRecommendations(recommendations);
      } catch (error) {
        console.error('Failed to load medical recommendations:', error);
        setComponentError({
          message: 'Failed to load medical terminology recommendations',
          details: error.message,
          canRetry: true
        });
        
        // Fallback to basic recommendations if graceful degradation is enabled
        if (ENV_CONFIG.FEATURES.gracefulDegradation) {
          setAllRecommendations([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [highlightedTerms]);

  const handleRecommendationSelect = (recommendation, selectedSuggestion) => {
    try {
      const updatedRec = {
        ...recommendation,
        selectedSuggestion,
        applied: false
      };
      
      setSelectedRecommendations(prev => {
        const existing = prev.find(r => r.termId === recommendation.termId);
        if (existing) {
          return prev.map(r => r.termId === recommendation.termId ? updatedRec : r);
        }
        return [...prev, updatedRec];
      });
    } catch (error) {
      console.error('Failed to select recommendation:', error);
      setComponentError({
        message: 'Failed to apply recommendation selection',
        details: error.message,
        canRetry: false
      });
    }
  };

  const handleAutoCorrect = (recommendation) => {
    if (recommendation.autoCorrect) {
      const correctedText = applyAutoCorrections(reportText, [recommendation]);
      setCorrectedText(correctedText);
      
      // Mark as applied
      setSelectedRecommendations(prev => 
        prev.map(r => 
          r.termId === recommendation.termId 
            ? { ...r, applied: true, appliedSuggestion: recommendation.autoCorrect }
            : r
        )
      );
      
      // Notify parent component
      if (onTextCorrection) {
        onTextCorrection(correctedText, recommendation);
      }
      
      if (onRecommendationApplied) {
        onRecommendationApplied(recommendation);
      }
    }
  };

  const handleManualCorrection = (recommendation, suggestion) => {
    const regex = new RegExp(`\\b${recommendation.originalTerm}\\b`, 'gi');
    const newText = correctedText.replace(regex, suggestion);
    setCorrectedText(newText);
    
    // Mark as applied
    setSelectedRecommendations(prev => 
      prev.map(r => 
        r.termId === recommendation.termId 
          ? { ...r, applied: true, appliedSuggestion: suggestion }
          : r
      )
    );
    
    if (onTextCorrection) {
      onTextCorrection(newText, { ...recommendation, selectedSuggestion: suggestion });
    }
    
    if (onRecommendationApplied) {
      onRecommendationApplied({ ...recommendation, selectedSuggestion: suggestion });
    }
  };

  const applyAllAutoCorrections = () => {
    const autoCorrectableRecs = allRecommendations.filter(r => r.autoCorrect);
    const finalText = applyAutoCorrections(reportText, autoCorrectableRecs);
    setCorrectedText(finalText);
    
    // Mark all as applied
    setSelectedRecommendations(prev => [
      ...prev.filter(r => !autoCorrectableRecs.find(ac => ac.termId === r.termId)),
      ...autoCorrectableRecs.map(r => ({ ...r, applied: true, appliedSuggestion: r.autoCorrect }))
    ]);
    
    if (onTextCorrection) {
      onTextCorrection(finalText, { type: 'bulk_auto_correct', count: autoCorrectableRecs.length });
    }
  };

  const getAppliedRecommendation = (termId) => {
    return selectedRecommendations.find(r => r.termId === termId && r.applied);
  };

  // Handle component-level errors
  if (componentError) {
    return (
      <Alert variant="warning" className="mb-3">
        <Alert.Heading className="h6">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Medical Terminology Service Issue
        </Alert.Heading>
        <p className="mb-2">{componentError.message}</p>
        {ENV_CONFIG.FEATURES.enableDebugMode && (
          <small className="text-muted">Details: {componentError.details}</small>
        )}
        {componentError.canRetry && (
          <div className="mt-2">
            <button 
              className="btn btn-sm btn-outline-warning"
              onClick={() => {
                setComponentError(null);
                // Trigger re-render of recommendations
                setAllRecommendations([]);
              }}
            >
              <i className="fas fa-redo me-1"></i>
              Retry
            </button>
          </div>
        )}
      </Alert>
    );
  }

  return (
    <div className="enhanced-highlight-legends">
      <div className="legends-header d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <i className="fas fa-lightbulb text-warning me-2"></i>
          Medical Term Analysis & Recommendations
          {isLoading && (
            <span className="ms-2">
              <i className="fas fa-spinner fa-spin text-primary"></i>
            </span>
          )}
        </h6>
        <div>
          {allRecommendations.filter(r => r.autoCorrect).length > 0 && (
            <button 
              className="btn btn-sm btn-success me-2"
              onClick={applyAllAutoCorrections}
              title="Apply all automatic corrections"
            >
              <i className="fas fa-magic me-1"></i>
              Auto-Fix All
            </button>
          )}
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            <i className={`fas fa-${showRecommendations ? 'eye-slash' : 'eye'} me-1`}></i>
            {showRecommendations ? 'Hide' : 'Show'} Recommendations
          </button>
        </div>
      </div>

      {/* Traditional Highlight Legend */}
      <div className="traditional-legends mb-4">
        <div className="row">
          {highlightedTerms.map((term, index) => {
            const appliedRec = getAppliedRecommendation(term.id || index);
            return (
              <div key={index} className="col-md-6 mb-2">
                <div className="legend-item p-2 border rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span 
                        className={`highlight-sample ${term.type || 'medical'}`}
                        style={{ backgroundColor: term.color || '#ffeaa7' }}
                      >
                        {appliedRec?.appliedSuggestion || term.text || term}
                      </span>
                      {appliedRec && (
                        <small className="text-success ms-2">
                          <i className="fas fa-check-circle"></i> Corrected
                        </small>
                      )}
                    </div>
                    <span className="badge bg-secondary">
                      {term.type || 'Medical'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations Section */}
      {showRecommendations && allRecommendations.length > 0 && (
        <div className="recommendations-section">
          <div className="recommendations-header mb-3">
            <h6 className="text-primary">
              <i className="fas fa-brain me-2"></i>
              Smart Recommendations ({allRecommendations.length})
            </h6>
            <p className="text-muted small mb-0">
              AI-powered suggestions to improve your radiology report
            </p>
          </div>

          <div className="recommendations-list">
            {allRecommendations.map((recommendation, index) => {
              const explanation = generateCorrectionExplanation(recommendation.termText, recommendation);
              const isApplied = getAppliedRecommendation(recommendation.termId);
              
              return (
                <div key={index} className={`recommendation-card mb-3 p-3 border rounded ${isApplied ? 'border-success bg-light' : ''}`}>
                  <div className="recommendation-header d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">
                        <span className="text-muted">Original:</span> 
                        <span className="text-danger ms-1 text-decoration-line-through">
                          {recommendation.termText}
                        </span>
                        {isApplied && (
                          <span className="text-success ms-2">
                            → {isApplied.appliedSuggestion}
                          </span>
                        )}
                      </h6>
                      <div className="d-flex align-items-center">
                        <i className={explanation.icon} style={{ color: explanation.color }}></i>
                        <small className="text-muted ms-2">{explanation.explanation}</small>
                      </div>
                    </div>
                    <div className="recommendation-actions">
                      {recommendation.autoCorrect && !isApplied && (
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleAutoCorrect(recommendation)}
                          title="Apply automatic correction"
                        >
                          <i className="fas fa-magic me-1"></i>
                          Auto-Fix
                        </button>
                      )}
                      {isApplied && (
                        <span className="badge bg-success">
                          <i className="fas fa-check me-1"></i>Applied
                        </span>
                      )}
                    </div>
                  </div>

                  {!isApplied && (
                    <div className="recommendation-suggestions">
                      <small className="text-muted d-block mb-2">Choose a better alternative:</small>
                      <div className="suggestions-grid">
                        {recommendation.recommendations.map((suggestion, suggIndex) => (
                          <button
                            key={suggIndex}
                            className="btn btn-sm btn-outline-primary me-2 mb-2"
                            onClick={() => handleManualCorrection(recommendation, suggestion)}
                            title={`Replace "${recommendation.termText}" with "${suggestion}"`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {allRecommendations.length > 0 && (
        <div className="recommendations-summary mt-4 p-3 bg-light rounded">
          <div className="row text-center">
            <div className="col-3">
              <div className="stat-item">
                <div className="stat-number text-danger">{allRecommendations.filter(r => r.severity === 'grammar').length}</div>
                <div className="stat-label small">Grammar Issues</div>
              </div>
            </div>
            <div className="col-3">
              <div className="stat-item">
                <div className="stat-number text-warning">{allRecommendations.filter(r => r.severity === 'clinical').length}</div>
                <div className="stat-label small">Clinical Terms</div>
              </div>
            </div>
            <div className="col-3">
              <div className="stat-item">
                <div className="stat-number text-info">{allRecommendations.filter(r => r.severity === 'style').length}</div>
                <div className="stat-label small">Style Issues</div>
              </div>
            </div>
            <div className="col-3">
              <div className="stat-item">
                <div className="stat-number text-success">{selectedRecommendations.filter(r => r.applied).length}</div>
                <div className="stat-label small">Applied</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .enhanced-highlight-legends {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .legend-item {
          transition: all 0.3s ease;
        }
        
        .legend-item:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .highlight-sample {
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .recommendation-card {
          transition: all 0.3s ease;
          background: #fff;
        }
        
        .recommendation-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .stat-item {
          padding: 8px;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .stat-label {
          color: #6c757d;
          font-weight: 500;
        }
        
        .recommendations-section {
          border-top: 2px solid #e9ecef;
          padding-top: 1rem;
        }
        
        .applied .recommendation-card {
          background-color: #f8f9fa !important;
          border-color: #28a745 !important;
        }
      `}</style>
    </div>
  );
};

// Wrapped component with error boundary
const EnhancedHighlightLegends = (props) => {
  return (
    <MedicalTerminologyErrorBoundary
      fallbackMessage="Medical terminology recommendations are temporarily using built-in vocabulary only. External medical databases may be experiencing connectivity issues."
    >
      <EnhancedHighlightLegendsCore {...props} />
    </MedicalTerminologyErrorBoundary>
  );
};

export default EnhancedHighlightLegends;
