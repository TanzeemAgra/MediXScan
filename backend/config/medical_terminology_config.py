# Free Medical Terminology Configuration
# Soft-coded configuration for accessing free medical terminology sources

import os
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class MedicalTerminologyConfig:
    """Configuration for free medical terminology sources with soft coding"""
    
    def __init__(self):
        # Primary free sources - no authentication required
        self.FREE_SOURCES = {
            'ncbi_pubmed': {
                'base_url': 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
                'endpoints': {
                    'search': 'esearch.fcgi',
                    'fetch': 'efetch.fcgi',
                    'summary': 'esummary.fcgi'
                },
                'databases': ['pubmed', 'pmc'],
                'rate_limit': 3,  # requests per second
                'free': True,
                'description': 'NCBI PubMed and PMC - Free medical literature database'
            },
            'radiopaedia': {
                'base_url': 'https://radiopaedia.org/',
                'endpoints': {
                    'search': 'search',
                    'articles': 'articles',
                    'cases': 'cases'
                },
                'rate_limit': 1,  # requests per second
                'free': True,
                'description': 'Radiopaedia - Free radiology reference with 64,990+ cases'
            },
            'mesh_terms': {
                'base_url': 'https://meshb.nlm.nih.gov/api/',
                'endpoints': {
                    'search': 'search',
                    'record': 'record'
                },
                'rate_limit': 5,  # requests per second
                'free': True,
                'description': 'MeSH (Medical Subject Headings) - Free medical vocabulary'
            },
            'umls_browser': {
                'base_url': 'https://uts.nlm.nih.gov/uts/umls/',
                'endpoints': {
                    'search': 'concept',
                    'semantic': 'semantic-network'
                },
                'requires_license': True,  # Free but requires registration
                'free': True,
                'description': 'UMLS Browser - Unified Medical Language System (Free with registration)'
            }
        }
        
        # Fallback terminology databases (built-in)
        self.BUILTIN_VOCABULARIES = {
            'radiology_anatomy': {
                'chest': [
                    'lungs', 'lung fields', 'pulmonary parenchyma', 'pleura', 'pleural space',
                    'mediastinum', 'heart', 'cardiac silhouette', 'aorta', 'pulmonary vessels',
                    'bronchi', 'trachea', 'thoracic spine', 'ribs', 'clavicles', 'sternum'
                ],
                'abdomen': [
                    'liver', 'gallbladder', 'pancreas', 'spleen', 'kidneys', 'renal parenchyma',
                    'bladder', 'prostate', 'uterus', 'ovaries', 'bowel loops', 'peritoneum',
                    'retroperitoneum', 'abdominal aorta', 'inferior vena cava'
                ],
                'musculoskeletal': [
                    'bones', 'joints', 'spine', 'vertebrae', 'disc spaces', 'facet joints',
                    'sacroiliac joints', 'hip joints', 'knee joints', 'shoulder joints',
                    'soft tissues', 'muscles', 'ligaments', 'tendons'
                ],
                'neurological': [
                    'brain', 'cerebral hemispheres', 'cerebellum', 'brainstem', 'ventricles',
                    'spinal cord', 'nerve roots', 'cranial nerves', 'white matter', 'gray matter'
                ]
            },
            'pathological_findings': {
                'masses': [
                    'mass', 'lesion', 'nodule', 'tumor', 'neoplasm', 'growth',
                    'space-occupying lesion', 'focal abnormality'
                ],
                'inflammatory': [
                    'inflammation', 'inflammatory changes', 'edema', 'swelling',
                    'infiltrate', 'consolidation', 'atelectasis'
                ],
                'vascular': [
                    'hemorrhage', 'bleeding', 'hematoma', 'thrombosis', 'embolism',
                    'infarct', 'ischemia', 'stenosis', 'aneurysm'
                ],
                'degenerative': [
                    'arthritis', 'osteoarthritis', 'degenerative changes',
                    'disc degeneration', 'spondylosis', 'osteoporosis'
                ]
            },
            'imaging_terminology': {
                'modalities': [
                    'CT scan', 'computed tomography', 'MRI', 'magnetic resonance imaging',
                    'ultrasound', 'X-ray', 'plain radiograph', 'fluoroscopy', 'mammography'
                ],
                'techniques': [
                    'contrast-enhanced', 'non-contrast', 'with contrast', 'without contrast',
                    'axial images', 'coronal images', 'sagittal images', 'multiplanar reconstruction'
                ],
                'findings': [
                    'hypodense', 'hyperdense', 'isodense', 'hyperintense', 'hypointense',
                    'enhancement', 'non-enhancing', 'calcification', 'fluid level'
                ]
            }
        }
        
        # Professional terminology corrections
        self.TERMINOLOGY_CORRECTIONS = {
            'informal_to_professional': {
                'normal': 'unremarkable',
                'abnormal': 'abnormal findings identified',
                'looks fine': 'appears unremarkable',
                'seems okay': 'within normal limits',
                'picture': 'image',
                'scan': 'examination',
                'xray': 'X-ray',
                'big': 'enlarged',
                'small': 'diminutive'
            },
            'grammar_corrections': {
                'lung': 'lungs',
                'kidney': 'kidneys',
                'ovary': 'ovaries',
                'vertebra': 'vertebrae'
            },
            'measurement_standardization': {
                'cm': 'centimeters',
                'mm': 'millimeters',
                'ml': 'milliliters',
                'cc': 'cubic centimeters'
            }
        }
        
        # Source priority (higher number = higher priority)
        self.SOURCE_PRIORITY = {
            'ncbi_pubmed': 5,
            'radiopaedia': 4,
            'mesh_terms': 4,
            'umls_browser': 3,
            'builtin_vocabularies': 2
        }
        
        # API Configuration (soft-coded via environment variables)
        self.API_CONFIG = {
            'timeout': int(os.getenv('MEDICAL_API_TIMEOUT', '30')),
            'max_retries': int(os.getenv('MEDICAL_API_RETRIES', '3')),
            'cache_duration': int(os.getenv('MEDICAL_CACHE_DURATION', '3600')),  # 1 hour
            'enable_caching': os.getenv('MEDICAL_ENABLE_CACHING', 'true').lower() == 'true'
        }
        
        # User agent for API requests
        self.USER_AGENT = os.getenv('MEDICAL_USER_AGENT', 'MediXScan-RadiologyAI/1.0')
        
    def get_active_sources(self) -> Dict:
        """Get currently active and available sources"""
        active_sources = {}
        
        for source_name, config in self.FREE_SOURCES.items():
            if config.get('free', False):
                # Check if source requires special configuration
                if source_name == 'umls_browser' and not os.getenv('UMLS_API_KEY'):
                    logger.info(f"UMLS source available but requires free registration at: {config['base_url']}")
                    continue
                
                active_sources[source_name] = config
        
        # Always include built-in vocabularies as fallback
        active_sources['builtin_vocabularies'] = {
            'description': 'Built-in medical vocabularies (fallback)',
            'free': True,
            'priority': self.SOURCE_PRIORITY.get('builtin_vocabularies', 1)
        }
        
        return active_sources
    
    def get_search_endpoints(self) -> Dict[str, str]:
        """Get search endpoints for free sources"""
        endpoints = {}
        
        # NCBI E-utilities (completely free)
        endpoints['ncbi_search'] = f"{self.FREE_SOURCES['ncbi_pubmed']['base_url']}esearch.fcgi"
        
        # Radiopaedia search (free)
        endpoints['radiopaedia_search'] = f"{self.FREE_SOURCES['radiopaedia']['base_url']}search"
        
        # MeSH Browser (free)
        endpoints['mesh_search'] = "https://meshb.nlm.nih.gov/api/search"
        
        return endpoints
    
    def get_rate_limits(self) -> Dict[str, int]:
        """Get rate limits for each source"""
        return {
            source: config.get('rate_limit', 1) 
            for source, config in self.FREE_SOURCES.items()
        }
    
    def get_fallback_vocabulary(self, category: str) -> List[str]:
        """Get built-in vocabulary for a specific category"""
        if category in self.BUILTIN_VOCABULARIES:
            # Flatten all subcategories
            terms = []
            for subcategory, term_list in self.BUILTIN_VOCABULARIES[category].items():
                terms.extend(term_list)
            return terms
        return []
    
    def get_all_builtin_terms(self) -> List[str]:
        """Get all built-in medical terms"""
        all_terms = []
        
        for category in self.BUILTIN_VOCABULARIES.values():
            for term_list in category.values():
                all_terms.extend(term_list)
        
        # Add correction terms
        for correction_dict in self.TERMINOLOGY_CORRECTIONS.values():
            all_terms.extend(correction_dict.values())
        
        return list(set(all_terms))  # Remove duplicates
    
    def get_terminology_corrections(self) -> Dict:
        """Get all terminology corrections"""
        return self.TERMINOLOGY_CORRECTIONS
    
    def is_source_available(self, source_name: str) -> bool:
        """Check if a source is available and properly configured"""
        if source_name not in self.FREE_SOURCES:
            return False
        
        source_config = self.FREE_SOURCES[source_name]
        
        # Check if it's a free source
        if not source_config.get('free', False):
            return False
        
        # Special checks for sources requiring registration
        if source_name == 'umls_browser':
            return bool(os.getenv('UMLS_API_KEY'))
        
        return True
    
    def get_source_description(self, source_name: str) -> str:
        """Get description of a source"""
        return self.FREE_SOURCES.get(source_name, {}).get('description', 'Unknown source')

# Global configuration instance
medical_terminology_config = MedicalTerminologyConfig()
