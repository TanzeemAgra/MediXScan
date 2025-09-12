"""
Advanced RAG Fallback Service with Built-in Medical Vocabulary
Location: backend/services/advanced_rag_fallback.py
Purpose: Provide comprehensive medical analysis when external RAG fails
"""

import re
import json
import time
import logging
import asyncio
from .free_medical_terminology_service import free_medical_terminology_service
from typing import Dict, List, Optional
from collections import defaultdict

logger = logging.getLogger(__name__)

class AdvancedRAGFallback:
    """Advanced RAG fallback with comprehensive built-in medical knowledge"""
    
    def __init__(self):
        self.medical_vocabulary = self._initialize_medical_vocabulary()
        self.correction_rules = self._initialize_correction_rules()
        self.clinical_patterns = self._initialize_clinical_patterns()
        
    def _initialize_medical_vocabulary(self) -> Dict:
        """Initialize comprehensive medical vocabulary"""
        return {
            'anatomical_terms': {
                # Body systems and structures
                'cardiovascular': ['heart', 'aorta', 'ventricle', 'atrium', 'cardiac', 'coronary', 'pulmonary', 'vascular'],
                'respiratory': ['lung', 'lungs', 'bronchi', 'alveoli', 'pleura', 'trachea', 'thorax', 'chest'],
                'musculoskeletal': ['bone', 'joint', 'vertebra', 'spine', 'fracture', 'cartilage', 'ligament'],
                'neurological': ['brain', 'cerebral', 'cerebellum', 'spinal', 'neural', 'cranial'],
                'gastrointestinal': ['liver', 'gallbladder', 'pancreas', 'kidney', 'abdomen', 'pelvis'],
                'directional': ['anterior', 'posterior', 'superior', 'inferior', 'medial', 'lateral', 'proximal', 'distal'],
                'sides': ['right', 'left', 'bilateral', 'unilateral', 'ipsilateral', 'contralateral']
            },
            'pathological_terms': {
                'tumors': ['mass', 'lesion', 'nodule', 'tumor', 'neoplasm', 'malignant', 'benign', 'cancer'],
                'inflammation': ['inflammation', 'inflammatory', 'edema', 'swelling', 'infection'],
                'vascular': ['hemorrhage', 'bleeding', 'thrombosis', 'embolism', 'infarct', 'ischemia'],
                'structural': ['stenosis', 'dilatation', 'enlargement', 'atrophy', 'hypertrophy'],
                'fluids': ['effusion', 'pneumothorax', 'hydrocephalus', 'ascites']
            },
            'imaging_terms': {
                'modalities': ['CT', 'MRI', 'ultrasound', 'X-ray', 'radiograph', 'scan', 'imaging'],
                'techniques': ['contrast', 'enhancement', 'axial', 'sagittal', 'coronal', 'reconstruction'],
                'findings': ['opacity', 'consolidation', 'attenuation', 'signal', 'enhancement', 'appearance']
            },
            'measurements': {
                'units': ['mm', 'cm', 'ml', 'cc', 'degrees', 'percent'],
                'descriptors': ['small', 'medium', 'large', 'massive', 'minimal', 'moderate', 'severe', 'extensive']
            },
            'abbreviations': {
                'CT': 'Computed Tomography',
                'MRI': 'Magnetic Resonance Imaging',
                'US': 'Ultrasound',
                'PA': 'Posteroanterior',
                'AP': 'Anteroposterior',
                'LAT': 'Lateral',
                'IV': 'Intravenous',
                'PO': 'Per Oral',
                'WNL': 'Within Normal Limits',
                'NAD': 'No Abnormality Detected'
            }
        }
    
    def _initialize_correction_rules(self) -> List[Dict]:
        """Initialize common medical report correction rules"""
        return [
            {
                'pattern': r'\bkidney\b(?!\s+show)',
                'replacement': 'kidneys',
                'rule': 'Kidney is usually plural in reports',
                'severity': 'minor'
            },
            {
                'pattern': r'\blungs?\s+is\b',
                'replacement': lambda m: m.group().replace('is', 'are'),
                'rule': 'Subject-verb agreement for lungs',
                'severity': 'minor'
            },
            {
                'pattern': r'\bno\s+acute\s+findings?\b',
                'replacement': 'no acute abnormalities',
                'rule': 'More specific medical terminology',
                'severity': 'suggestion'
            },
            {
                'pattern': r'\bnormal\s+study\b',
                'replacement': 'study within normal limits',
                'rule': 'Professional medical phrasing',
                'severity': 'suggestion'
            },
            {
                'pattern': r'\b(\d+)\s*x\s*(\d+)\s*mm\b',
                'replacement': r'\1 x \2 mm',
                'rule': 'Standardize measurement formatting',
                'severity': 'minor'
            }
        ]
    
    def _initialize_clinical_patterns(self) -> Dict:
        """Initialize clinical significance patterns"""
        return {
            'urgent_findings': [
                r'\b(acute|emergent|critical|immediate|urgent|stat)\b',
                r'\b(massive|large)\s+(hemorrhage|bleeding|infarct)\b',
                r'\b(free\s+air|pneumothorax|tension)\b',
                r'\b(midline\s+shift|herniation)\b'
            ],
            'significant_findings': [
                r'\b(abnormal|concerning|suspicious|positive)\b',
                r'\b(mass|lesion|nodule)\b.*?\b(\d+\s*cm)\b',
                r'\b(fracture|dislocation|rupture)\b',
                r'\b(enlargement|dilatation|stenosis)\b'
            ],
            'normal_findings': [
                r'\b(normal|unremarkable|within\s+normal\s+limits|WNL)\b',
                r'\b(no\s+(acute|significant|obvious))\b',
                r'\b(stable|unchanged|consistent)\b'
            ]
        }
    
    async def fetch_external_medical_terms(self, query: str) -> Dict:
        """Fetch medical terms from free external sources"""
        try:
            logger.info(f"Fetching external medical terms for: {query}")
            
            async with free_medical_terminology_service as service:
                # Search multiple free sources
                external_results = await service.comprehensive_search(query, max_results_per_source=5)
                
                # Process and combine results
                combined_terms = {
                    'anatomical': [],
                    'pathological': [],
                    'imaging': [],
                    'abbreviations': []
                }
                
                for source, results in external_results.items():
                    for result in results:
                        term_data = {
                            'term': result.get('term', ''),
                            'source': source,
                            'relevance': result.get('relevance_score', 0),
                            'definition': result.get('definition', ''),
                            'url': result.get('url', '')
                        }
                        
                        # Categorize based on result category or content
                        category = result.get('category', 'pathological')
                        if category in ['radiology_anatomy', 'anatomy']:
                            combined_terms['anatomical'].append(term_data)
                        elif category in ['pathological_findings', 'pathology']:
                            combined_terms['pathological'].append(term_data)
                        elif category in ['imaging_terminology', 'imaging']:
                            combined_terms['imaging'].append(term_data)
                        else:
                            combined_terms['pathological'].append(term_data)
                
                logger.info(f"Fetched {sum(len(terms) for terms in combined_terms.values())} external terms")
                return combined_terms
                
        except Exception as e:
            logger.error(f"Failed to fetch external medical terms: {str(e)}")
            return {'anatomical': [], 'pathological': [], 'imaging': [], 'abbreviations': []}
    
    def enhance_report_analysis_with_external(self, report_text: str) -> Dict:
        """Enhanced analysis that attempts to fetch external medical terms first"""
        try:
            # Extract key medical terms from the report for external search
            potential_queries = self._extract_search_queries(report_text)
            external_terms = {}
            
            # Try to fetch external terms asynchronously
            if potential_queries:
                try:
                    # Run async function in current thread
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    
                    for query in potential_queries[:3]:  # Limit to top 3 queries
                        external_result = loop.run_until_complete(
                            self.fetch_external_medical_terms(query)
                        )
                        
                        # Merge external results
                        for category, terms in external_result.items():
                            if category not in external_terms:
                                external_terms[category] = []
                            external_terms[category].extend(terms)
                    
                    loop.close()
                    logger.info(f"Successfully fetched external terms for {len(potential_queries)} queries")
                    
                except Exception as e:
                    logger.warning(f"External term fetching failed, using built-in only: {str(e)}")
                    external_terms = {}
            
            # Perform standard analysis with both external and built-in terms
            standard_analysis = self.enhance_report_analysis(report_text)
            
            # Enhance with external terms if available
            if external_terms:
                for category, external_term_list in external_terms.items():
                    if category in standard_analysis['detected_terms']:
                        # Add external terms to detected terms
                        for ext_term in external_term_list:
                            standard_analysis['detected_terms'][category].append({
                                'term': ext_term['term'],
                                'category': category,
                                'context': f"External source: {ext_term['source']}",
                                'relevance': ext_term.get('relevance', 0),
                                'definition': ext_term.get('definition', ''),
                                'source_url': ext_term.get('url', '')
                            })
                
                # Update coverage metrics
                total_external = sum(len(terms) for terms in external_terms.values())
                standard_analysis['terminology_coverage']['external_terms_found'] = total_external
                standard_analysis['enhanced_context']['external_sources_used'] = True
            
            return standard_analysis
            
        except Exception as e:
            logger.error(f"Enhanced analysis with external terms failed: {str(e)}")
            # Fallback to standard analysis
            return self.enhance_report_analysis(report_text)
    
    def _extract_search_queries(self, report_text: str) -> List[str]:
        """Extract potential search queries from report text"""
        queries = []
        
        # Extract potential medical terms (nouns, medical words)
        words = re.findall(r'\b[a-zA-Z]{3,}\b', report_text.lower())
        
        # Common medical terms that might benefit from external lookup
        medical_indicators = [
            'mass', 'lesion', 'nodule', 'tumor', 'abnormal', 'finding',
            'consolidation', 'opacity', 'enhancement', 'fracture',
            'inflammation', 'edema', 'hemorrhage', 'infarct'
        ]
        
        for word in words:
            if word in medical_indicators:
                queries.append(word)
        
        # Also add multi-word phrases
        phrases = re.findall(r'\b(?:right|left|bilateral)\s+\w+', report_text.lower())
        queries.extend(phrases)
        
        # Remove duplicates and limit
        return list(set(queries))[:5]
    
    def enhance_report_analysis(self, report_text: str) -> Dict:
        """Perform advanced analysis with built-in medical knowledge"""
        try:
            logger.info("Starting advanced RAG fallback analysis")
            
            # Basic text analysis
            analysis = {
                'detected_terms': {
                    'anatomical': [],
                    'pathological': [],
                    'imaging': [],
                    'abbreviations': []
                },
                'medical_accuracy': {
                    'score': 0,
                    'issues': [],
                    'suggestions': []
                },
                'terminology_coverage': {
                    'total_medical_terms': 0,
                    'recognized_terms': 0,
                    'coverage_percentage': 0
                },
                'enhanced_context': {},
                'clinical_significance': 'routine'
            }
            
            report_lower = report_text.lower()
            
            # Detect anatomical terms
            for category, terms in self.medical_vocabulary['anatomical_terms'].items():
                for term in terms:
                    if re.search(rf'\b{re.escape(term)}\b', report_lower):
                        analysis['detected_terms']['anatomical'].append({
                            'term': term,
                            'category': category,
                            'context': f'Anatomical term from {category} system'
                        })
            
            # Detect pathological terms
            for category, terms in self.medical_vocabulary['pathological_terms'].items():
                for term in terms:
                    if re.search(rf'\b{re.escape(term)}\b', report_lower):
                        analysis['detected_terms']['pathological'].append({
                            'term': term,
                            'category': category,
                            'context': f'Pathological finding related to {category}'
                        })
            
            # Detect imaging terms
            for category, terms in self.medical_vocabulary['imaging_terms'].items():
                for term in terms:
                    if re.search(rf'\b{re.escape(term)}\b', report_lower):
                        analysis['detected_terms']['imaging'].append({
                            'term': term,
                            'category': category,
                            'context': f'Imaging-related term: {category}'
                        })
            
            # Detect abbreviations
            for abbrev, full_form in self.medical_vocabulary['abbreviations'].items():
                if re.search(rf'\b{re.escape(abbrev)}\b', report_text):
                    analysis['detected_terms']['abbreviations'].append({
                        'abbreviation': abbrev,
                        'definition': full_form,
                        'context': f'Medical abbreviation for {full_form}'
                    })
            
            # Calculate terminology coverage
            total_detected = sum(len(terms) for terms in analysis['detected_terms'].values())
            words = re.findall(r'\b\w+\b', report_text)
            unique_words = len(set(words))
            
            analysis['terminology_coverage'] = {
                'total_medical_terms': total_detected,
                'recognized_terms': total_detected,
                'coverage_percentage': min(100, (total_detected / max(unique_words, 1)) * 100)
            }
            
            # Assess clinical significance
            analysis['clinical_significance'] = self._assess_clinical_significance(report_text)
            
            # Calculate medical accuracy score
            base_score = min(100, analysis['terminology_coverage']['coverage_percentage'] * 1.5)
            
            # Apply corrections and identify issues
            corrections_made = 0
            for rule in self.correction_rules:
                matches = re.finditer(rule['pattern'], report_text, re.IGNORECASE)
                for match in matches:
                    corrections_made += 1
                    analysis['medical_accuracy']['issues'].append(
                        f"Grammar/terminology issue: {match.group()}"
                    )
                    analysis['medical_accuracy']['suggestions'].append(
                        f"Consider: {rule['rule']}"
                    )
            
            # Adjust score based on corrections needed
            penalty = min(30, corrections_made * 5)
            analysis['medical_accuracy']['score'] = max(50, base_score - penalty)
            
            # Add general suggestions based on coverage
            if analysis['terminology_coverage']['coverage_percentage'] < 30:
                analysis['medical_accuracy']['suggestions'].append(
                    "Consider using more specific medical terminology"
                )
                analysis['medical_accuracy']['suggestions'].append(
                    "Include relevant anatomical references"
                )
            
            if analysis['clinical_significance'] == 'urgent':
                analysis['medical_accuracy']['suggestions'].append(
                    "Urgent findings detected - ensure immediate communication"
                )
            
            # Generate highlighted terms for frontend
            highlighted_terms = []
            for category, term_list in analysis['detected_terms'].items():
                for term_info in term_list:
                    highlighted_terms.append({
                        'id': f"{category}_{len(highlighted_terms)}",
                        'text': term_info['term'],
                        'type': category,
                        'color': self._get_highlight_color(category),
                        'context': term_info.get('context', f'{category.title()} term')
                    })
            
            analysis['highlighted_terms'] = highlighted_terms
            
            logger.info(f"Advanced analysis completed: {total_detected} terms detected")
            return analysis
            
        except Exception as e:
            logger.error(f"Advanced RAG fallback failed: {str(e)}")
            # Return minimal analysis even if processing fails
            return {
                'detected_terms': {'anatomical': [], 'pathological': [], 'imaging': [], 'abbreviations': []},
                'medical_accuracy': {'score': 75, 'issues': [], 'suggestions': ['Analysis completed with basic processing']},
                'terminology_coverage': {'total_medical_terms': 0, 'recognized_terms': 0, 'coverage_percentage': 0},
                'enhanced_context': {},
                'clinical_significance': 'routine'
            }
    
    def _assess_clinical_significance(self, report_text: str) -> str:
        """Assess clinical significance of the report"""
        report_lower = report_text.lower()
        
        # Check for urgent findings
        for pattern in self.clinical_patterns['urgent_findings']:
            if re.search(pattern, report_lower):
                return 'urgent'
        
        # Check for significant findings
        for pattern in self.clinical_patterns['significant_findings']:
            if re.search(pattern, report_lower):
                return 'significant'
        
        # Default to routine
        return 'routine'
    
    def _get_highlight_color(self, category: str) -> str:
        """Get color for highlighting different term categories"""
        color_map = {
            'anatomical': '#ffeaa7',      # Light yellow
            'pathological': '#fab1a0',    # Light orange
            'imaging': '#a29bfe',         # Light purple
            'abbreviations': '#6c5ce7',   # Purple
            'measurements': '#00b894',    # Green
            'findings': '#e17055'         # Orange-red
        }
        return color_map.get(category, '#ddd')
    
    def generate_corrected_report(self, original_text: str) -> str:
        """Generate a corrected version of the report"""
        corrected_text = original_text
        
        try:
            # Apply correction rules
            for rule in self.correction_rules:
                if callable(rule['replacement']):
                    corrected_text = re.sub(
                        rule['pattern'], 
                        rule['replacement'], 
                        corrected_text, 
                        flags=re.IGNORECASE
                    )
                else:
                    corrected_text = re.sub(
                        rule['pattern'], 
                        rule['replacement'], 
                        corrected_text, 
                        flags=re.IGNORECASE
                    )
            
            return corrected_text
            
        except Exception as e:
            logger.error(f"Report correction failed: {str(e)}")
            return original_text

# Global instance
advanced_rag_fallback = AdvancedRAGFallback()
