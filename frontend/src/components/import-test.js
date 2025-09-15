// Test import resolution for debugging
import { 
  getTermRecommendations, 
  getAllRecommendations,
  applyAutoCorrections,
  generateCorrectionExplanation,
  RECOMMENDATION_TYPES 
} from '../config/medicalRecommendations.js';

console.log('Import test successful!');
console.log('RECOMMENDATION_TYPES:', RECOMMENDATION_TYPES);
console.log('Functions available:', {
  getTermRecommendations: typeof getTermRecommendations,
  getAllRecommendations: typeof getAllRecommendations,
  applyAutoCorrections: typeof applyAutoCorrections,
  generateCorrectionExplanation: typeof generateCorrectionExplanation
});
