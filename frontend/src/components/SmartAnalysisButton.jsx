import React, { useState } from 'react';
import { Button, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getAllRecommendations, applyAutoCorrections } from '../config/medicalRecommendations.js';

const SmartAnalysisButton = ({ 
  reportText, 
  file, 
  onAnalysisComplete, 
  onError,
  onHighlightTermsUpdate,
  onRecommendationsGenerated,
  useRAG = true,
  disabled = false,
  className = '',
  analyzeReportWithRAG,
  analyzeReport
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleSmartAnalysis = async () => {
    if (!reportText?.trim()) {
      onError?.('Please enter a medical report text before analysis.');
      return;
    }

    setLoading(true);
    setAnalysisStatus('Starting intelligent analysis...');
    setRetryCount(0);

    const maxRetries = 2;
    let currentRetry = 0;

    while (currentRetry <= maxRetries) {
      try {
        let result;
        
        if (useRAG && currentRetry === 0) {
          // First attempt: Try RAG analysis
          setAnalysisStatus('🧠 Performing RAG-enhanced analysis with medical knowledge base...');
          result = await analyzeReportWithRAG(reportText, file);
          
          // Validate result quality
          if (result && (
            result.diagnostic_discrepancies?.length > 0 || 
            result.quality_metrics?.medical_accuracy_score > 0 ||
            result.summary
          )) {
            setAnalysisStatus('✅ RAG analysis completed successfully!');
            onAnalysisComplete?.(result);
            break;
          } else {
            throw new Error('RAG analysis returned insufficient data');
          }
          
        } else if (useRAG && currentRetry === 1) {
          // Second attempt: Try RAG again with different approach
          setAnalysisStatus('🔄 Retrying with advanced RAG fallback system...');
          result = await analyzeReportWithRAG(reportText, file);
          
          if (result) {
            setAnalysisStatus('✅ Advanced RAG analysis completed!');
            
            // Generate recommendations for highlighted terms
            const recommendations = getAllRecommendations(reportText);
            const enhancedResult = {
              ...result,
              recommendations,
              originalText: reportText
            };
            
            // Update highlighted terms with recommendations
            if (result.highlighted_terms && onHighlightTermsUpdate) {
              const termsWithRecommendations = result.highlighted_terms.map(term => ({
                ...term,
                hasRecommendations: recommendations.some(r => 
                  r.originalTerm.toLowerCase() === (term.text || term).toLowerCase()
                )
              }));
              onHighlightTermsUpdate(termsWithRecommendations);
            }
            
            if (onRecommendationsGenerated) {
              onRecommendationsGenerated(recommendations);
            }
            
            onAnalysisComplete?.(enhancedResult);
            break;
          } else {
            throw new Error('Advanced RAG system also failed');
          }
          
        } else {
          // Final attempt: Standard analysis
          setAnalysisStatus('🔧 Using standard analysis method...');
          result = await analyzeReport(reportText, file);
          
          if (result) {
            setAnalysisStatus('✅ Standard analysis completed!');
            
            // Generate recommendations even for standard analysis
            const recommendations = getAllRecommendations(reportText);
            const enhancedResult = {
              ...result,
              recommendations,
              originalText: reportText
            };
            
            // Update highlighted terms with recommendations
            if (result.highlighted_terms && onHighlightTermsUpdate) {
              const termsWithRecommendations = result.highlighted_terms.map(term => ({
                ...term,
                hasRecommendations: recommendations.some(r => 
                  r.originalTerm.toLowerCase() === (term.text || term).toLowerCase()
                )
              }));
              onHighlightTermsUpdate(termsWithRecommendations);
            }
            
            if (onRecommendationsGenerated) {
              onRecommendationsGenerated(recommendations);
            }
            
            onAnalysisComplete?.(enhancedResult);
            break;
          } else {
            throw new Error('All analysis methods failed');
          }
        }

      } catch (error) {
        console.error(`Analysis attempt ${currentRetry + 1} failed:`, error);
        
        currentRetry++;
        setRetryCount(currentRetry);
        
        if (currentRetry <= maxRetries) {
          setAnalysisStatus(`⚠️ Attempt ${currentRetry} failed, trying alternative method...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
        } else {
          // All attempts failed
          setAnalysisStatus('❌ Analysis failed');
          onError?.(error.detail || 'All analysis methods failed. Please check your report text and try again.');
          break;
        }
      }
    }

    setLoading(false);
    setTimeout(() => setAnalysisStatus(null), 3000);
  };

  const getButtonVariant = () => {
    if (loading) return 'primary';
    if (analysisStatus?.includes('✅')) return 'success';
    if (analysisStatus?.includes('❌')) return 'danger';
    return useRAG ? 'primary' : 'secondary';
  };

  const getButtonText = () => {
    if (loading) return 'Analyzing...';
    return useRAG ? '🧠 RAG Enhanced Analysis' : '📊 Standard Analysis';
  };

  return (
    <div>
      <OverlayTrigger
        overlay={
          <Tooltip>
            {useRAG 
              ? 'Advanced AI analysis with medical knowledge enhancement. Automatically falls back to standard analysis if needed.' 
              : 'Standard medical report analysis without RAG enhancement.'
            }
          </Tooltip>
        }
      >
        <Button
          variant={getButtonVariant()}
          onClick={handleSmartAnalysis}
          disabled={disabled || loading || !reportText?.trim()}
          className={`${className} d-flex align-items-center justify-content-center`}
          style={{ minWidth: '200px', minHeight: '45px' }}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              {getButtonText()}
            </>
          ) : (
            getButtonText()
          )}
        </Button>
      </OverlayTrigger>
      
      {analysisStatus && (
        <div className="mt-2">
          <Alert 
            variant={
              analysisStatus.includes('✅') ? 'success' : 
              analysisStatus.includes('❌') ? 'danger' : 
              'info'
            }
            className="mb-0 py-2"
          >
            <small>
              <i className="fas fa-info-circle me-1"></i>
              {analysisStatus}
              {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
            </small>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default SmartAnalysisButton;
