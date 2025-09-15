import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import EnhancedHighlightLegends from './EnhancedHighlightLegends';
import { getAllRecommendations } from '../config/medicalRecommendations.js';

const RecommendationTestComponent = () => {
  const [testReport, setTestReport] = useState(`
Patient shows mass in the right lung. 
The heart looks normal and there seems to be no abnormal findings in the scan.
The kidney appear normal and the brain picture shows no acute issues.
Small nodule visible in left side of chest xray.
  `.trim());
  
  const [recommendations, setRecommendations] = useState([]);
  const [highlightedTerms, setHighlightedTerms] = useState([]);
  const [correctedText, setCorrectedText] = useState('');

  const handleGenerateRecommendations = () => {
    // Generate recommendations
    const allRecs = getAllRecommendations(testReport);
    setRecommendations(allRecs);
    
    // Create mock highlighted terms based on recommendations
    const terms = allRecs.map((rec, index) => ({
      id: `term_${index}`,
      text: rec.originalTerm,
      type: rec.category,
      color: '#ffeaa7',
      context: rec.context
    }));
    
    setHighlightedTerms(terms);
    console.log('Generated recommendations:', allRecs);
    console.log('Generated highlighted terms:', terms);
  };

  return (
    <div className="recommendation-test-component p-4">
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-flask me-2"></i>
            Medical Recommendation System Test
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Test Medical Report:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={testReport}
              onChange={(e) => setTestReport(e.target.value)}
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            onClick={handleGenerateRecommendations}
            className="mb-3"
          >
            <i className="fas fa-brain me-2"></i>
            Generate Recommendations
          </Button>
          
          {recommendations.length > 0 && (
            <Alert variant="info">
              <strong>Found {recommendations.length} recommendations:</strong>
              <ul className="mb-0 mt-2">
                {recommendations.map((rec, index) => (
                  <li key={index}>
                    <strong>{rec.originalTerm}</strong> - {rec.severity} ({rec.category})
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          
          {(highlightedTerms.length > 0 || recommendations.length > 0) && (
            <div className="mt-4">
              <EnhancedHighlightLegends
                highlightedTerms={highlightedTerms}
                reportText={testReport}
                onTextCorrection={(newText, recommendation) => {
                  setCorrectedText(newText);
                  setTestReport(newText);
                  console.log('Text corrected:', { newText, recommendation });
                }}
                onRecommendationApplied={(recommendation) => {
                  console.log('Recommendation applied:', recommendation);
                }}
              />
            </div>
          )}
          
          {correctedText && (
            <Alert variant="success" className="mt-3">
              <strong>Corrected Text Applied!</strong>
              <div className="mt-2 small">
                Check the textarea above to see the corrected version.
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default RecommendationTestComponent;
