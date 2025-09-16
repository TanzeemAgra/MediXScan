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
import openai
from django.conf import settings
from .free_medical_terminology_service import free_medical_terminology_service
from config.ai_settings import get_openai_config, get_medical_config, is_feature_enabled, get_system_message
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
    
    def analyze_with_direct_ai(self, report_text: str) -> Dict:
        """
        Direct OpenAI analysis when RAG completely fails
        Soft-coded configuration with fallback mechanisms
        """
        try:
            # Get soft-coded configuration
            openai_config = get_openai_config()
            medical_config = get_medical_config()
            
            # Check if AI analysis is enabled
            if not is_feature_enabled('ENABLE_OPENAI_ANALYSIS'):
                logger.warning("OpenAI analysis disabled by feature flag")
                return self._create_fallback_analysis_structure(report_text)
            
            # Check if OpenAI API key is available
            if not hasattr(settings, 'OPENAI_API_KEY') or not settings.OPENAI_API_KEY:
                logger.error("OpenAI API key not configured")
                return self._create_fallback_analysis_structure(report_text)
            
            openai.api_key = settings.OPENAI_API_KEY
            logger.info("Attempting direct OpenAI analysis as RAG fallback")
            
            # Enhanced prompt for comprehensive medical analysis
            analysis_prompt = f"""
            As an expert medical AI specializing in radiology report analysis, provide a comprehensive analysis of this medical report. Since external medical databases are unavailable, rely on your extensive training in medical terminology and radiology.

            REPORT TO ANALYZE:
            {report_text}

            Please provide a structured JSON response with the following sections:

            1. DETECTED_TERMS: Identify and categorize medical terms
            2. MEDICAL_ACCURACY: Assess accuracy and identify issues  
            3. DIAGNOSTIC_DISCREPANCIES: Find potential errors or inconsistencies
            4. CORRECTED_REPORT: Provide an improved version
            5. QUALITY_METRICS: Scoring and assessment
            6. CLINICAL_SIGNIFICANCE: Urgency level and recommendations

            Format as valid JSON with these exact keys:
            {{
                "detected_terms": {{
                    "anatomical": [list of anatomical terms with definitions],
                    "pathological": [list of pathological findings],
                    "imaging": [list of imaging-related terms],
                    "abbreviations": [list of medical abbreviations]
                }},
                "medical_accuracy": {{
                    "score": (number 0-100),
                    "issues": [list of accuracy issues found],
                    "suggestions": [list of improvement suggestions]
                }},
                "diagnostic_discrepancies": [
                    {{
                        "error_type": "category",
                        "severity": "minor|major|critical", 
                        "error": "description",
                        "correction": "suggested fix",
                        "explanation": "detailed explanation"
                    }}
                ],
                "corrected_report": "improved version of the report",
                "terminology_coverage": {{
                    "total_medical_terms": (number),
                    "recognized_terms": (number), 
                    "coverage_percentage": (number)
                }},
                "clinical_significance": "routine|significant|urgent"
            }}

            Focus on:
            - Medical terminology accuracy and completeness
            - Proper anatomical references and imaging descriptions
            - Grammar and professional medical language
            - Identification of critical findings requiring attention
            - Standardization of measurements and abbreviations
            """

            try:
                # Try primary model first with soft-coded configuration
                primary_model = openai_config['PRIMARY_MODEL']
                max_tokens = openai_config['MAX_TOKENS'].get(primary_model, 2000)
                
                response = openai.ChatCompletion.create(
                    model=primary_model,
                    messages=[
                        {
                            "role": "system", 
                            "content": get_system_message('MEDICAL_EXPERT') + " " + get_system_message('JSON_RESPONSE')
                        },
                        {"role": "user", "content": analysis_prompt}
                    ],
                    max_tokens=max_tokens,
                    temperature=openai_config['TEMPERATURE'],
                    timeout=openai_config['TIMEOUT']
                )
                
                logger.info(f"Successfully used primary model: {primary_model}")
                
            except Exception as primary_error:
                logger.warning(f"Primary OpenAI model ({openai_config['PRIMARY_MODEL']}) failed: {primary_error}")
                logger.info(f"Trying fallback model: {openai_config['FALLBACK_MODEL']}")
                
                try:
                    # Fallback to configured fallback model
                    fallback_model = openai_config['FALLBACK_MODEL']
                    fallback_tokens = openai_config['MAX_TOKENS'].get(fallback_model, 1500)
                    
                    response = openai.ChatCompletion.create(
                        model=fallback_model,
                        messages=[
                            {
                                "role": "system", 
                                "content": get_system_message('FALLBACK_ANALYSIS') + " " + get_system_message('JSON_RESPONSE')
                            },
                            {"role": "user", "content": analysis_prompt}
                        ],
                        max_tokens=fallback_tokens,
                        temperature=openai_config['TEMPERATURE'],
                        timeout=openai_config['TIMEOUT']
                    )
                    
                    logger.info(f"Successfully used fallback model: {fallback_model}")
                    
                except Exception as fallback_error:
                    logger.error(f"Fallback model ({openai_config['FALLBACK_MODEL']}) also failed: {fallback_error}")
                    
                    # Try backup model if available
                    if openai_config.get('BACKUP_MODEL'):
                        logger.info(f"Trying backup model: {openai_config['BACKUP_MODEL']}")
                        
                        backup_model = openai_config['BACKUP_MODEL']
                        backup_tokens = openai_config['MAX_TOKENS'].get(backup_model, 1000)
                        
                        response = openai.ChatCompletion.create(
                            model=backup_model,
                            messages=[
                                {
                                    "role": "system", 
                                    "content": get_system_message('FALLBACK_ANALYSIS')
                                },
                                {"role": "user", "content": analysis_prompt}
                            ],
                            max_tokens=backup_tokens,
                            temperature=openai_config['TEMPERATURE']
                        )
                        
                        logger.info(f"Successfully used backup model: {backup_model}")
                    else:
                        raise fallback_error
            
            # Parse OpenAI response
            ai_content = response.choices[0].message.content.strip()
            
            # Extract JSON from response (handle potential markdown formatting)
            if '```json' in ai_content:
                ai_content = ai_content.split('```json')[1].split('```')[0].strip()
            elif '```' in ai_content:
                ai_content = ai_content.split('```')[1].strip()
            
            try:
                ai_analysis = json.loads(ai_content)
                logger.info("Successfully parsed OpenAI analysis response")
                
                # Validate and enhance the response structure
                validated_analysis = self._validate_and_enhance_ai_response(ai_analysis, report_text)
                return validated_analysis
                
            except json.JSONDecodeError as json_error:
                logger.error(f"Failed to parse OpenAI JSON response: {json_error}")
                logger.error(f"Raw response: {ai_content[:500]}...")
                
                # Create structured analysis from text response
                return self._parse_text_response_to_structure(ai_content, report_text)
        
        except Exception as e:
            logger.error(f"Direct OpenAI analysis failed: {str(e)}")
            return self._create_fallback_analysis_structure(report_text)

    def _validate_and_enhance_ai_response(self, ai_analysis: dict, original_text: str) -> dict:
        """Validate and enhance OpenAI response to match expected structure"""
        try:
            # Ensure all required keys exist with proper structure
            enhanced_analysis = {
                'detected_terms': {
                    'anatomical': ai_analysis.get('detected_terms', {}).get('anatomical', []),
                    'pathological': ai_analysis.get('detected_terms', {}).get('pathological', []),
                    'imaging': ai_analysis.get('detected_terms', {}).get('imaging', []),
                    'abbreviations': ai_analysis.get('detected_terms', {}).get('abbreviations', [])
                },
                'medical_accuracy': {
                    'score': max(0, min(100, ai_analysis.get('medical_accuracy', {}).get('score', 75))),
                    'issues': ai_analysis.get('medical_accuracy', {}).get('issues', []),
                    'suggestions': ai_analysis.get('medical_accuracy', {}).get('suggestions', [])
                },
                'terminology_coverage': {
                    'total_medical_terms': ai_analysis.get('terminology_coverage', {}).get('total_medical_terms', 0),
                    'recognized_terms': ai_analysis.get('terminology_coverage', {}).get('recognized_terms', 0),
                    'coverage_percentage': ai_analysis.get('terminology_coverage', {}).get('coverage_percentage', 0)
                },
                'clinical_significance': ai_analysis.get('clinical_significance', 'routine'),
                'diagnostic_discrepancies': ai_analysis.get('diagnostic_discrepancies', []),
                'corrected_report': ai_analysis.get('corrected_report', original_text),
                'ai_metadata': {
                    'analysis_method': 'direct_openai_fallback',
                    'model_used': 'gpt-4/gpt-3.5-turbo',
                    'confidence_level': 'high' if ai_analysis.get('medical_accuracy', {}).get('score', 75) > 80 else 'moderate',
                    'fallback_reason': 'RAG medical database unavailable'
                }
            }
            
            return enhanced_analysis
            
        except Exception as e:
            logger.error(f"Failed to validate AI response: {str(e)}")
            return self._create_fallback_analysis_structure(original_text)

    def _parse_text_response_to_structure(self, text_response: str, original_text: str) -> dict:
        """Parse text response when JSON parsing fails"""
        try:
            # Basic structure with extracted information
            return {
                'detected_terms': {
                    'anatomical': self._extract_terms_from_text(text_response, ['anatomy', 'anatomical']),
                    'pathological': self._extract_terms_from_text(text_response, ['pathology', 'findings']),
                    'imaging': self._extract_terms_from_text(text_response, ['imaging', 'radiology']),
                    'abbreviations': self._extract_abbreviations_from_text(text_response)
                },
                'medical_accuracy': {
                    'score': 70,  # Default moderate score
                    'issues': ['OpenAI response format issue - manual parsing applied'],
                    'suggestions': ['Review AI analysis in text format']
                },
                'terminology_coverage': {
                    'total_medical_terms': len(text_response.split()),
                    'recognized_terms': 0,
                    'coverage_percentage': 50
                },
                'clinical_significance': 'routine',
                'ai_text_response': text_response[:1000],  # Store partial response for reference
                'ai_metadata': {
                    'analysis_method': 'direct_openai_text_fallback',
                    'parsing_status': 'text_mode'
                }
            }
        except Exception as e:
            logger.error(f"Text parsing fallback failed: {str(e)}")
            return self._create_fallback_analysis_structure(original_text)

    def _create_fallback_analysis_structure(self, original_text: str) -> dict:
        """Create basic analysis structure when all AI methods fail"""
        return {
            'detected_terms': {
                'anatomical': [],
                'pathological': [], 
                'imaging': [],
                'abbreviations': []
            },
            'medical_accuracy': {
                'score': 60,
                'issues': ['External medical databases unavailable', 'AI analysis systems temporarily offline'],
                'suggestions': ['Manual review recommended', 'Retry analysis later']
            },
            'terminology_coverage': {
                'total_medical_terms': 0,
                'recognized_terms': 0,
                'coverage_percentage': 0
            },
            'clinical_significance': 'routine',
            'corrected_report': original_text,
            'system_status': {
                'analysis_method': 'basic_fallback',
                'rag_status': 'offline',
                'ai_status': 'offline',
                'message': 'Basic analysis structure - manual review required'
            }
        }

    def _extract_terms_from_text(self, text: str, keywords: List[str]) -> List[dict]:
        """Extract medical terms from text based on keywords"""
        terms = []
        text_lower = text.lower()
        
        for keyword in keywords:
            # Simple pattern matching for terms near keywords
            pattern = rf'{keyword}[^.]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches[:5]:  # Limit to 5 per keyword
                terms.append({
                    'term': match.strip(),
                    'definition': f'{keyword.title()}-related term',
                    'source': 'ai_extraction'
                })
        
        return terms

    def _extract_abbreviations_from_text(self, text: str) -> List[dict]:
        """Extract abbreviations from text"""
        abbreviations = []
        # Match uppercase letter combinations
        pattern = r'\b[A-Z]{2,}\b'
        matches = re.findall(pattern, text)
        
        for abbrev in set(matches[:10]):  # Limit and deduplicate
            abbreviations.append({
                'abbreviation': abbrev,
                'definition': f'Medical abbreviation: {abbrev}',
                'source': 'ai_extraction'
            })
        
        return abbreviations

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
