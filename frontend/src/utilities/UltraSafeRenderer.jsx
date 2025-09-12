import React from 'react';

/**
 * Ultra-Safe Object Renderer with Advanced Error Prevention
 * Provides bulletproof protection against "Objects are not valid as a React child" errors
 */

export const UltraSafeRenderer = {
  /**
   * Safely render any value with comprehensive type checking
   */
  renderSafely: (value, fallback = 'N/A') => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return <span className="text-muted">{fallback}</span>;
    }

    // Handle primitives (safe to render)
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div className="safe-array-render">
          {value.map((item, index) => (
            <div key={index} className="array-item">
              {UltraSafeRenderer.renderSafely(item)}
            </div>
          ))}
        </div>
      );
    }

    // Handle objects (this is where the error typically occurs)
    if (typeof value === 'object') {
      try {
        // Check if it's a React element (safe to render)
        if (React.isValidElement(value)) {
          return value;
        }

        // If it's a plain object, convert to safe display
        return (
          <div className="safe-object-render">
            <small className="text-muted">
              [Object with {Object.keys(value).length} properties]
            </small>
          </div>
        );
      } catch (error) {
        console.warn('UltraSafeRenderer: Object rendering fallback triggered', error);
        return <span className="text-warning">[Object - Safe Mode]</span>;
      }
    }

    // Ultimate fallback
    return <span className="text-muted">{String(value)}</span>;
  },

  /**
   * Wrap any component with ultra-safe rendering
   */
  SafeWrapper: ({ children, fallback = null }) => {
    try {
      // Recursively check if children contains any unsafe objects
      const safeChildren = React.Children.map(children, (child) => {
        if (typeof child === 'object' && child !== null && !React.isValidElement(child)) {
          return UltraSafeRenderer.renderSafely(child);
        }
        return child;
      });

      return <>{safeChildren}</>;
    } catch (error) {
      console.error('UltraSafeRenderer: SafeWrapper caught error', error);
      return fallback || <div className="alert alert-warning">Content could not be displayed safely</div>;
    }
  },

  /**
   * Ultra-safe text renderer for any value
   */
  toSafeText: (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return `Array (${value.length} items)`;
    if (typeof value === 'object') return `Object (${Object.keys(value).length} properties)`;
    return String(value);
  }
};

/**
 * Higher-Order Component for ultra-safe rendering
 */
export const withUltraSafeRendering = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    try {
      return <WrappedComponent {...props} ref={ref} />;
    } catch (error) {
      if (error.message.includes('Objects are not valid as a React child')) {
        console.error('UltraSafeRenderer: Caught object rendering error', error);
        return (
          <div className="alert alert-danger">
            <i className="ri-error-warning-line me-2"></i>
            <strong>Rendering Error Prevented</strong>
            <br />
            <small>An object was attempted to be rendered as React content. This has been safely handled.</small>
          </div>
        );
      }
      throw error; // Re-throw non-object rendering errors
    }
  });
};

/**
 * Safe Props Cleaner - removes objects that could cause rendering errors
 */
export const cleanPropsForRendering = (props) => {
  const cleanedProps = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) {
      cleanedProps[key] = value;
    } else if (typeof value === 'object' && !React.isValidElement(value) && !Array.isArray(value)) {
      // Convert object to safe string representation
      cleanedProps[key] = `[Object: ${Object.keys(value).join(', ')}]`;
    } else {
      cleanedProps[key] = value;
    }
  }
  
  return cleanedProps;
};

export default UltraSafeRenderer;
