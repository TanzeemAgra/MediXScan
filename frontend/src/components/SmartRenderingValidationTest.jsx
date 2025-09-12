import React from 'react';
import { SmartObjectRenderer, SafeObjectDisplay } from '../utilities/SmartObjectRenderer.jsx';
import { SafeComponent } from '../components/SmartRenderingErrorBoundary.jsx';

/**
 * Validation component to test AI-powered object rendering fixes
 * This component helps validate that our soft coding solution works correctly
 */
const SmartRenderingValidationTest = () => {
  // Test objects that would previously cause React rendering errors
  const testObjects = {
    simpleObject: {
      name: "Test Object",
      value: 42,
      isActive: true
    },
    
    complexMedicalAnalysis: {
      modelUsed: "GPT-4 Medical",
      modelId: "gpt-4-medical-v1",
      processingMode: "Advanced Medical Analysis",
      ragUsed: true,
      timestamp: new Date().toISOString(),
      overallConfidence: 94.5,
      corrections: [
        {
          type: 'medical_terminology',
          original: 'pneumothorax',
          suggested: 'pneumothorax',
          confidence: 98,
          explanation: 'Medical terminology is correct',
          severity: 'info'
        },
        {
          type: 'clinical_accuracy',
          original: 'bilateral infiltrates',
          suggested: 'bilateral pulmonary infiltrates',
          confidence: 92,
          explanation: 'More specific anatomical description recommended',
          severity: 'medium'
        }
      ],
      summary: {
        totalCorrections: 2,
        highConfidence: 1,
        medicalTerms: 1,
        clinicalIssues: 1
      },
      insights: [
        'Medical terminology usage is excellent',
        'Consider adding more specific anatomical references',
        'Overall clinical accuracy is high'
      ],
      estimatedCost: 0.025,
      processingTime: 1250
    },
    
    arrayWithObjects: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" }
    ],
    
    nestedComplexObject: {
      level1: {
        level2: {
          level3: {
            data: "Deep nested data",
            array: [1, 2, 3, 4, 5]
          }
        }
      }
    },
    
    nullAndUndefinedTest: {
      nullValue: null,
      undefinedValue: undefined,
      emptyString: "",
      zeroValue: 0,
      falseValue: false
    }
  };

  return (
    <div className="smart-rendering-validation" style={{ display: 'none' }}>
      <h3>Smart Rendering Validation Test</h3>
      
      {/* Test each object type with our AI-powered renderer */}
      {Object.entries(testObjects).map(([key, testObject]) => (
        <SafeComponent key={key} title={`Test: ${key}`}>
          <div className="test-section mb-4">
            <h5>Testing: {key}</h5>
            
            {/* Test with different strategies */}
            <div className="row">
              <div className="col-md-6">
                <h6>Auto Strategy</h6>
                <SafeObjectDisplay 
                  object={testObject}
                  strategy="auto"
                  className="test-display"
                />
              </div>
              
              <div className="col-md-6">
                <h6>Medical Analysis Strategy</h6>
                <SafeObjectDisplay 
                  object={testObject}
                  strategy="medical-analysis"
                  className="test-display"
                />
              </div>
            </div>
            
            <div className="row mt-3">
              <div className="col-md-6">
                <h6>Summary Strategy</h6>
                <SafeObjectDisplay 
                  object={testObject}
                  strategy="summary"
                  className="test-display"
                />
              </div>
              
              <div className="col-md-6">
                <h6>Compact Strategy</h6>
                <SafeObjectDisplay 
                  object={testObject}
                  strategy="compact"
                  className="test-display"
                />
              </div>
            </div>
          </div>
        </SafeComponent>
      ))}
      
      {/* Test error boundary functionality */}
      <SafeComponent title="Error Boundary Test">
        <div className="error-test">
          <h5>Error Boundary Test</h5>
          <p>This section tests error recovery mechanisms.</p>
          
          {/* Intentionally try to render problematic content */}
          <SafeObjectDisplay 
            object={testObjects.complexMedicalAnalysis}
            strategy="medical-analysis"
            className="error-test-display"
          />
        </div>
      </SafeComponent>
    </div>
  );
};

export default SmartRenderingValidationTest;
