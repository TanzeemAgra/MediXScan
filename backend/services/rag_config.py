"""
RAG Configuration Management
Soft coding technique for flexible RAG system configuration
"""
import os
from typing import Dict, List, Any
from dataclasses import dataclass, field
from django.conf import settings

@dataclass
class RAGSourceConfig:
    """Configuration for RAG content sources"""
    name: str
    base_url: str
    enabled: bool = True
    max_pages: int = 50
    delay_between_requests: float = 1.0
    timeout: int = 30
    retry_attempts: int = 3
    headers: Dict[str, str] = field(default_factory=dict)
    selectors: Dict[str, str] = field(default_factory=dict)

@dataclass
class MedicalTermsConfig:
    """Configuration for medical terminology extraction"""
    anatomical_patterns: List[str] = field(default_factory=list)
    pathology_patterns: List[str] = field(default_factory=list)
    imaging_patterns: List[str] = field(default_factory=list)
    general_patterns: List[str] = field(default_factory=list)
    min_word_length: int = 3
    max_word_length: int = 50
    exclude_patterns: List[str] = field(default_factory=list)

@dataclass
class CacheConfig:
    """Configuration for caching"""
    vocabulary_timeout: int = 3600  # 1 hour
    content_timeout: int = 86400    # 24 hours
    max_cache_size: int = 1000
    cache_prefix: str = "rag_"

@dataclass
class AnalysisConfig:
    """Configuration for report analysis"""
    openai_model: str = "gpt-3.5-turbo"
    max_tokens: int = 1000
    temperature: float = 0.3
    confidence_threshold: float = 0.7
    max_report_length: int = 10000
    min_report_length: int = 50

class RAGConfig:
    """Central RAG configuration manager using soft coding"""
    
    def __init__(self):
        self._load_from_settings()
        self._load_from_environment()
        self._initialize_defaults()
    
    def _load_from_settings(self):
        """Load configuration from Django settings"""
        self.sources = self._get_sources_config()
        self.medical_terms = self._get_medical_terms_config()
        self.cache = self._get_cache_config()
        self.analysis = self._get_analysis_config()
    
    def _load_from_environment(self):
        """Load configuration from environment variables"""
        # Override with environment variables if present
        self.sources.radiologyassistant.enabled = os.getenv('RAG_RADIOLOGY_ENABLED', 'true').lower() == 'true'
        self.sources.radiologyassistant.max_pages = int(os.getenv('RAG_MAX_PAGES', '50'))
        self.cache.vocabulary_timeout = int(os.getenv('RAG_VOCAB_CACHE_TIMEOUT', '3600'))
        self.analysis.openai_model = os.getenv('RAG_OPENAI_MODEL', 'gpt-3.5-turbo')
    
    def _initialize_defaults(self):
        """Initialize default configurations"""
        if not hasattr(self, 'sources'):
            self.sources = type('obj', (object,), {})()
        if not hasattr(self, 'medical_terms'):
            self.medical_terms = self._get_default_medical_terms_config()
        if not hasattr(self, 'cache'):
            self.cache = self._get_default_cache_config()
        if not hasattr(self, 'analysis'):
            self.analysis = self._get_default_analysis_config()
    
    def _get_sources_config(self) -> Any:
        """Get content sources configuration"""
        sources_config = getattr(settings, 'RAG_SOURCES', {})
        
        # Create object to hold source configs
        sources = type('obj', (object,), {})()
        
        # RadiologyAssistant configuration
        radiology_config = sources_config.get('radiologyassistant', {})
        sources.radiologyassistant = RAGSourceConfig(
            name="RadiologyAssistant",
            base_url=radiology_config.get('base_url', 'https://radiologyassistant.nl'),
            enabled=radiology_config.get('enabled', True),
            max_pages=radiology_config.get('max_pages', 50),
            delay_between_requests=radiology_config.get('delay', 1.0),
            timeout=radiology_config.get('timeout', 30),
            retry_attempts=radiology_config.get('retry_attempts', 3),
            headers=radiology_config.get('headers', {
                'User-Agent': 'Medical Education Bot 1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }),
            selectors=radiology_config.get('selectors', {
                'content': '.content, .main-content, article, .post-content',
                'title': 'h1, h2, .title',
                'medical_terms': 'p, li, .description'
            })
        )
        
        return sources
    
    def _get_medical_terms_config(self) -> MedicalTermsConfig:
        """Get medical terminology configuration"""
        terms_config = getattr(settings, 'RAG_MEDICAL_TERMS', {})
        
        return MedicalTermsConfig(
            anatomical_patterns=terms_config.get('anatomical_patterns', [
                r'\b(?:chest|lung|heart|brain|liver|kidney|spine|pelvis|abdomen|thorax)\b',
                r'\b(?:vertebra|rib|sternum|clavicle|scapula|humerus|radius|ulna)\b',
                r'\b(?:femur|tibia|fibula|patella|ankle|foot|hand|wrist|elbow|shoulder)\b',
                r'\b(?:cranium|skull|mandible|maxilla|temporal|parietal|frontal|occipital)\b'
            ]),
            pathology_patterns=terms_config.get('pathology_patterns', [
                r'\b(?:fracture|pneumonia|edema|tumor|lesion|mass|nodule|opacity)\b',
                r'\b(?:atelectasis|pneumothorax|pleural|effusion|consolidation)\b',
                r'\b(?:stenosis|occlusion|thrombosis|embolism|infarct|ischemia)\b',
                r'\b(?:hemorrhage|hematoma|contusion|laceration|perforation)\b'
            ]),
            imaging_patterns=terms_config.get('imaging_patterns', [
                r'\b(?:CT|MRI|ultrasound|x-ray|radiograph|fluoroscopy|mammography)\b',
                r'\b(?:contrast|enhancement|gadolinium|iodine|barium)\b',
                r'\b(?:axial|sagittal|coronal|oblique|lateral|anteroposterior|PA)\b',
                r'\b(?:T1|T2|FLAIR|DWI|perfusion|angiography|venography)\b'
            ]),
            general_patterns=terms_config.get('general_patterns', [
                r'\b(?:normal|abnormal|significant|unremarkable|remarkable)\b',
                r'\b(?:mild|moderate|severe|acute|chronic|subacute)\b',
                r'\b(?:bilateral|unilateral|diffuse|focal|multifocal|widespread)\b',
                r'\b(?:superior|inferior|anterior|posterior|medial|lateral|proximal|distal)\b'
            ]),
            min_word_length=terms_config.get('min_word_length', 3),
            max_word_length=terms_config.get('max_word_length', 50),
            exclude_patterns=terms_config.get('exclude_patterns', [
                r'\b(?:the|and|or|but|in|on|at|to|for|of|with|by)\b',
                r'\b(?:this|that|these|those|here|there|when|where|how|why)\b'
            ])
        )
    
    def _get_cache_config(self) -> CacheConfig:
        """Get cache configuration"""
        cache_config = getattr(settings, 'RAG_CACHE', {})
        
        return CacheConfig(
            vocabulary_timeout=cache_config.get('vocabulary_timeout', 3600),
            content_timeout=cache_config.get('content_timeout', 86400),
            max_cache_size=cache_config.get('max_cache_size', 1000),
            cache_prefix=cache_config.get('cache_prefix', 'rag_')
        )
    
    def _get_analysis_config(self) -> AnalysisConfig:
        """Get analysis configuration"""
        analysis_config = getattr(settings, 'RAG_ANALYSIS', {})
        
        return AnalysisConfig(
            openai_model=analysis_config.get('openai_model', 'gpt-3.5-turbo'),
            max_tokens=analysis_config.get('max_tokens', 1000),
            temperature=analysis_config.get('temperature', 0.3),
            confidence_threshold=analysis_config.get('confidence_threshold', 0.7),
            max_report_length=analysis_config.get('max_report_length', 10000),
            min_report_length=analysis_config.get('min_report_length', 50)
        )
    
    def _get_default_medical_terms_config(self) -> MedicalTermsConfig:
        """Get default medical terms configuration"""
        return MedicalTermsConfig(
            anatomical_patterns=[
                r'\b(?:chest|lung|heart|brain|liver|kidney|spine|pelvis|abdomen|thorax)\b',
                r'\b(?:vertebra|rib|sternum|clavicle|scapula|humerus|radius|ulna)\b'
            ],
            pathology_patterns=[
                r'\b(?:fracture|pneumonia|edema|tumor|lesion|mass|nodule|opacity)\b',
                r'\b(?:atelectasis|pneumothorax|pleural|effusion|consolidation)\b'
            ],
            imaging_patterns=[
                r'\b(?:CT|MRI|ultrasound|x-ray|radiograph|fluoroscopy|mammography)\b',
                r'\b(?:contrast|enhancement|gadolinium|iodine|barium)\b'
            ],
            general_patterns=[
                r'\b(?:normal|abnormal|significant|unremarkable|remarkable)\b',
                r'\b(?:mild|moderate|severe|acute|chronic|subacute)\b'
            ]
        )
    
    def _get_default_cache_config(self) -> CacheConfig:
        """Get default cache configuration"""
        return CacheConfig()
    
    def _get_default_analysis_config(self) -> AnalysisConfig:
        """Get default analysis configuration"""
        return AnalysisConfig()
    
    def get_source_config(self, source_name: str) -> RAGSourceConfig:
        """Get configuration for a specific source"""
        return getattr(self.sources, source_name, None)
    
    def update_config(self, section: str, updates: Dict[str, Any]):
        """Update configuration dynamically"""
        if section == 'sources':
            for source_name, config_updates in updates.items():
                source_config = getattr(self.sources, source_name, None)
                if source_config:
                    for key, value in config_updates.items():
                        setattr(source_config, key, value)
        elif section == 'medical_terms':
            for key, value in updates.items():
                setattr(self.medical_terms, key, value)
        elif section == 'cache':
            for key, value in updates.items():
                setattr(self.cache, key, value)
        elif section == 'analysis':
            for key, value in updates.items():
                setattr(self.analysis, key, value)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            'sources': {
                'radiologyassistant': {
                    'name': self.sources.radiologyassistant.name,
                    'base_url': self.sources.radiologyassistant.base_url,
                    'enabled': self.sources.radiologyassistant.enabled,
                    'max_pages': self.sources.radiologyassistant.max_pages,
                    'delay_between_requests': self.sources.radiologyassistant.delay_between_requests,
                    'timeout': self.sources.radiologyassistant.timeout,
                    'retry_attempts': self.sources.radiologyassistant.retry_attempts
                }
            },
            'medical_terms': {
                'min_word_length': self.medical_terms.min_word_length,
                'max_word_length': self.medical_terms.max_word_length,
                'pattern_counts': {
                    'anatomical': len(self.medical_terms.anatomical_patterns),
                    'pathology': len(self.medical_terms.pathology_patterns),
                    'imaging': len(self.medical_terms.imaging_patterns),
                    'general': len(self.medical_terms.general_patterns)
                }
            },
            'cache': {
                'vocabulary_timeout': self.cache.vocabulary_timeout,
                'content_timeout': self.cache.content_timeout,
                'max_cache_size': self.cache.max_cache_size,
                'cache_prefix': self.cache.cache_prefix
            },
            'analysis': {
                'openai_model': self.analysis.openai_model,
                'max_tokens': self.analysis.max_tokens,
                'temperature': self.analysis.temperature,
                'confidence_threshold': self.analysis.confidence_threshold
            }
        }

# Global configuration instance
rag_config = RAGConfig()
