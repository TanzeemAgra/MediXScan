import React from 'react';

/**
 * AI-Powered Object-to-JSX Conversion Utilities
 * Provides intelligent soft-coded solutions for safely rendering complex objects as React children
 */

export class SmartObjectRenderer {
  /**
   * AI-powered intelligent object rendering with multiple fallback strategies
   * @param {any} obj - Object to render safely
   * @param {Object} options - Rendering options and strategies
   * @returns {React.ReactNode} - Safe JSX representation
   */
  static renderIntelligently(obj, options = {}) {
    const {
      maxDepth = 3,
      arrayLimit = 5,
      stringLimit = 200,
      showKeys = true,
      fallbackStrategy = 'summary',
      className = 'smart-object-render'
    } = options;

    return this._renderWithStrategy(obj, fallbackStrategy, {
      maxDepth,
      arrayLimit,
      stringLimit,
      showKeys,
      className,
      currentDepth: 0
    });
  }

  /**
   * Apply AI-powered rendering strategy based on object characteristics
   */
  static _renderWithStrategy(obj, strategy, config) {
    if (obj === null || obj === undefined) {
      return <span className="text-muted">N/A</span>;
    }

    // Handle primitives safely
    if (typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    // Apply intelligent strategy selection
    switch (strategy) {
      case 'medical-analysis':
        return this._renderMedicalAnalysis(obj, config);
      case 'summary':
        return this._renderObjectSummary(obj, config);
      case 'detailed':
        return this._renderDetailedObject(obj, config);
      case 'compact':
        return this._renderCompactObject(obj, config);
      default:
        return this._autoSelectStrategy(obj, config);
    }
  }

  /**
   * AI-powered medical analysis object renderer
   * Specifically designed for medical report analysis results
   */
  static _renderMedicalAnalysis(obj, config) {
    if (!obj || typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    // Intelligent medical analysis rendering
    return (
      <div className={`${config.className} medical-analysis`}>
        {obj.modelUsed && (
          <div className="mb-2">
            <strong>AI Model:</strong> <span className="badge bg-primary">{obj.modelUsed}</span>
          </div>
        )}
        
        {obj.overallConfidence && (
          <div className="mb-2">
            <strong>Confidence:</strong> 
            <span className={`badge ${obj.overallConfidence > 90 ? 'bg-success' : obj.overallConfidence > 70 ? 'bg-warning' : 'bg-danger'}`}>
              {Math.round(obj.overallConfidence)}%
            </span>
          </div>
        )}

        {obj.summary && (
          <div className="mb-3">
            <strong>Analysis Summary:</strong>
            {this._renderObjectSummary(obj.summary, {...config, currentDepth: config.currentDepth + 1})}
          </div>
        )}

        {obj.corrections && Array.isArray(obj.corrections) && (
          <div className="mb-3">
            <strong>Corrections ({obj.corrections.length}):</strong>
            {this._renderCorrectionsArray(obj.corrections, config)}
          </div>
        )}

        {obj.insights && Array.isArray(obj.insights) && (
          <div className="mb-2">
            <strong>Key Insights:</strong>
            <ul className="mt-1">
              {obj.insights.slice(0, config.arrayLimit).map((insight, idx) => (
                <li key={idx} className="small">{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {obj.processingTime && (
          <div className="small text-muted">
            Processing time: {obj.processingTime}ms
          </div>
        )}
      </div>
    );
  }

  /**
   * Render corrections array with AI-powered categorization
   */
  static _renderCorrectionsArray(corrections, config) {
    if (!Array.isArray(corrections)) return null;

    return (
      <div className="corrections-list">
        {corrections.slice(0, config.arrayLimit).map((correction, idx) => (
          <div key={idx} className={`correction-item mb-2 p-2 border-start border-${this._getSeverityColor(correction.severity)}`}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">{correction.type?.replace(/_/g, ' ') || 'Correction'}</span>
              <span className={`badge bg-${this._getSeverityColor(correction.severity)}`}>
                {correction.confidence || 0}%
              </span>
            </div>
            {correction.explanation && (
              <div className="small text-muted mt-1">{correction.explanation}</div>
            )}
          </div>
        ))}
        {corrections.length > config.arrayLimit && (
          <div className="text-muted small">
            ... and {corrections.length - config.arrayLimit} more corrections
          </div>
        )}
      </div>
    );
  }

  /**
   * Get severity color for bootstrap classes
   */
  static _getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  }

  /**
   * Render object summary with intelligent key-value extraction
   */
  static _renderObjectSummary(obj, config) {
    if (!obj || typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    if (config.currentDepth >= config.maxDepth) {
      return <span className="text-muted">[Object: {Object.keys(obj).length} properties]</span>;
    }

    return (
      <div className={`${config.className} object-summary`}>
        {Object.entries(obj).slice(0, 5).map(([key, value]) => (
          <div key={key} className="mb-1">
            <strong>{this._formatKey(key)}:</strong>{' '}
            {this._renderWithStrategy(value, 'compact', {
              ...config,
              currentDepth: config.currentDepth + 1
            })}
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render detailed object with full expansion
   */
  static _renderDetailedObject(obj, config) {
    if (!obj || typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    if (config.currentDepth >= config.maxDepth) {
      return this._renderObjectSummary(obj, config);
    }

    return (
      <div className={`${config.className} detailed-object`}>
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} className="mb-2">
            <div className="fw-bold">{this._formatKey(key)}</div>
            <div className="ms-3">
              {this._renderWithStrategy(value, 'detailed', {
                ...config,
                currentDepth: config.currentDepth + 1
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render compact object representation
   */
  static _renderCompactObject(obj, config) {
    if (!obj || typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    if (Array.isArray(obj)) {
      return (
        <span className="array-compact">
          [{obj.length} items: {obj.slice(0, 2).map(item => 
            typeof item === 'object' ? '[Object]' : String(item)
          ).join(', ')}
          {obj.length > 2 && '...'} ]
        </span>
      );
    }

    const keys = Object.keys(obj);
    return (
      <span className="object-compact">
        {'{'}
        {keys.slice(0, 3).map(key => `${key}: ${typeof obj[key]}`).join(', ')}
        {keys.length > 3 && '...'}
        {'}'}
      </span>
    );
  }

  /**
   * Auto-select best rendering strategy based on object characteristics
   */
  static _autoSelectStrategy(obj, config) {
    if (!obj || typeof obj !== 'object') {
      return this._renderPrimitive(obj, config);
    }

    // Check for medical analysis object pattern
    if (obj.modelUsed || obj.corrections || obj.overallConfidence) {
      return this._renderMedicalAnalysis(obj, config);
    }

    // Choose strategy based on object complexity
    const keys = Object.keys(obj);
    if (keys.length > 10 || config.currentDepth > 1) {
      return this._renderCompactObject(obj, config);
    } else if (keys.length > 5) {
      return this._renderObjectSummary(obj, config);
    } else {
      return this._renderDetailedObject(obj, config);
    }
  }

  /**
   * Safely render primitive values
   */
  static _renderPrimitive(value, config) {
    if (value === null || value === undefined) {
      return <span className="text-muted">N/A</span>;
    }

    if (typeof value === 'string') {
      if (value.length > config.stringLimit) {
        return (
          <span title={value}>
            {value.substring(0, config.stringLimit)}
            <span className="text-muted">... (truncated)</span>
          </span>
        );
      }
      return <span>{value}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-primary">{value}</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
        {value ? 'Yes' : 'No'}
      </span>;
    }

    return <span>{String(value)}</span>;
  }

  /**
   * Format object keys for display
   */
  static _formatKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }
}

/**
 * React Hook for intelligent object rendering
 */
export const useSmartObjectRenderer = (options = {}) => {
  return React.useCallback((obj) => {
    return SmartObjectRenderer.renderIntelligently(obj, options);
  }, [options]);
};

/**
 * Higher-Order Component for safe object rendering
 */
export const withSafeObjectRendering = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const renderObject = useSmartObjectRenderer();
    
    return (
      <WrappedComponent
        {...props}
        ref={ref}
        renderObject={renderObject}
      />
    );
  });
};

/**
 * Safe Object Display Component
 */
export const SafeObjectDisplay = ({ 
  object, 
  strategy = 'auto', 
  className = '',
  ...options 
}) => {
  try {
    return SmartObjectRenderer.renderIntelligently(object, {
      fallbackStrategy: strategy,
      className: `safe-object-display ${className}`,
      ...options
    });
  } catch (error) {
    console.error('SafeObjectDisplay error:', error);
    return (
      <div className="alert alert-warning">
        <i className="ri-error-warning-line me-2"></i>
        Unable to display object safely. Error: {error.message}
      </div>
    );
  }
};

export default SmartObjectRenderer;
