"""
RAG (Retrieval-Augmented Generation) Service for Medical Content with Soft Coding
Location: backend/services/rag_service.py
Purpose: Fetch and process medical content from radiologyassistant.nl for ML model enhancement
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import time
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import logging
from django.conf import settings
import hashlib
from django.core.cache import cache
from .rag_config import rag_config

logger = logging.getLogger(__name__)

class RadiologyRAGService:
    """Service for retrieving and processing radiology content using RAG technique with soft coding"""
    
    def __init__(self):
        # Load configuration from soft-coded settings
        self.config = rag_config
        self.source_config = self.config.get_source_config('radiologyassistant')
        self.base_url = self.source_config.base_url
        
        # Setup session with configurable headers
        self.session = requests.Session()
        self.session.headers.update(self.source_config.headers)
        
        # Configure request parameters
        self.timeout = self.source_config.timeout
        self.delay_between_requests = self.source_config.delay_between_requests
        self.retry_attempts = self.source_config.retry_attempts
        
    def fetch_medical_terminology(self, max_pages: Optional[int] = None) -> Dict:
        """
        Fetch medical terminology and content from radiologyassistant.nl
        
        Args:
            max_pages: Maximum number of pages to crawl (defaults to config value)
            
        Returns:
            Dictionary containing medical terms, definitions, and context
        """
        if max_pages is None:
            max_pages = self.source_config.max_pages
            
        cache_key = f"{self.config.cache.cache_prefix}radiology_content_{max_pages}"
        cached_content = cache.get(cache_key)
        
        if cached_content:
            logger.info("Returning cached radiology content")
            return cached_content
        
        logger.info(f"Starting RAG content extraction from {self.base_url}")
        
        medical_content = {
            'terminology': {},
            'anatomical_terms': {},
            'pathology_terms': {},
            'imaging_techniques': {},
            'common_phrases': [],
            'abbreviations': {},
            'metadata': {
                'source': self.base_url,
                'extraction_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                'pages_processed': 0
            }
        }
        
        try:
            # Start with the main page
            main_content = self._fetch_page_content(self.base_url)
            if main_content:
                self._process_content(main_content, medical_content)
                medical_content['metadata']['pages_processed'] += 1
            
            # Extract navigation links for more content
            nav_links = self._extract_navigation_links(self.base_url)
            
            # Process additional pages
            processed_count = 0
            for link in nav_links:
                if processed_count >= max_pages:
                    break
                    
                try:
                    content = self._fetch_page_content(link)
                    if content:
                        self._process_content(content, medical_content)
                        processed_count += 1
                        medical_content['metadata']['pages_processed'] += 1
                        
                    # Rate limiting to be respectful
                    time.sleep(self.delay_between_requests)
                    
                except Exception as e:
                    logger.warning(f"Failed to process {link}: {str(e)}")
                    continue
            
            # Cache the results using configured timeout
            cache.set(cache_key, medical_content, self.config.cache.content_timeout)
            
            logger.info(f"RAG extraction completed: {len(medical_content['terminology'])} terms extracted")
            return medical_content
            
        except Exception as e:
            logger.error(f"RAG content extraction failed: {str(e)}")
            return medical_content
    
    def _fetch_page_content(self, url: str) -> Optional[str]:
        """Fetch content from a single page with retry logic"""
        for attempt in range(self.retry_attempts):
            try:
                response = self.session.get(url, timeout=self.timeout)
                response.raise_for_status()
                return response.text
            except Exception as e:
                if attempt < self.retry_attempts - 1:
                    logger.warning(f"Attempt {attempt + 1} failed for {url}: {str(e)}. Retrying...")
                    time.sleep(1 * (attempt + 1))  # Exponential backoff
                else:
                    logger.warning(f"Failed to fetch {url} after {self.retry_attempts} attempts: {str(e)}")
        return None
    
    def _extract_navigation_links(self, base_url: str) -> List[str]:
        """Extract relevant navigation links from the main page"""
        try:
            content = self._fetch_page_content(base_url)
            if not content:
                return []
                
            soup = BeautifulSoup(content, 'html.parser')
            links = set()
            
            # Look for navigation menus, article links, etc.
            for link in soup.find_all('a', href=True):
                href = link['href']
                full_url = urljoin(base_url, href)
                
                # Filter relevant medical content links
                if self._is_relevant_medical_link(full_url, link.get_text().strip()):
                    links.add(full_url)
            
            return list(links)[:50]  # Limit to prevent excessive crawling
            
        except Exception as e:
            logger.warning(f"Failed to extract navigation links: {str(e)}")
            return []
    
    def _is_relevant_medical_link(self, url: str, link_text: str) -> bool:
        """Determine if a link is relevant for medical content"""
        # Filter out non-medical content
        exclude_patterns = [
            'javascript:', 'mailto:', '#', 'contact', 'about', 'privacy',
            'cookie', 'legal', 'terms', 'admin', 'login', 'register'
        ]
        
        url_lower = url.lower()
        text_lower = link_text.lower()
        
        for pattern in exclude_patterns:
            if pattern in url_lower or pattern in text_lower:
                return False
        
        # Include medical-related content
        include_patterns = [
            'anatomy', 'pathology', 'radiology', 'imaging', 'diagnosis',
            'medical', 'clinical', 'disease', 'syndrome', 'technique',
            'mri', 'ct', 'ultrasound', 'x-ray', 'mammography'
        ]
        
        for pattern in include_patterns:
            if pattern in url_lower or pattern in text_lower:
                return True
        
        # Include if it's from the same domain and looks like content
        if 'radiologyassistant.nl' in url and len(link_text) > 3:
            return True
        
        return False
    
    def _process_content(self, html_content: str, medical_content: Dict):
        """Process HTML content to extract medical terminology"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'header', 'footer']):
                element.decompose()
            
            text = soup.get_text()
            
            # Extract medical terms using various patterns
            self._extract_anatomical_terms(text, medical_content)
            self._extract_pathology_terms(text, medical_content)
            self._extract_imaging_terms(text, medical_content)
            self._extract_general_terms(text, medical_content)
            self._extract_abbreviations(text, medical_content)
            self._extract_common_phrases(text, medical_content)
            
        except Exception as e:
            logger.warning(f"Failed to process content: {str(e)}")
    
    def _extract_anatomical_terms(self, text: str, medical_content: Dict):
        """Extract anatomical terms from text using configurable patterns"""
        # Use soft-coded anatomical patterns from configuration
        anatomical_patterns = self.config.medical_terms.anatomical_patterns
        
        for pattern in anatomical_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group(0).strip().lower()
                if (self.config.medical_terms.min_word_length <= len(term) <= self.config.medical_terms.max_word_length 
                    and term not in medical_content['anatomical_terms']
                    and not self._is_excluded_term(term)):
                    medical_content['anatomical_terms'][term] = {
                        'context': self._get_context(text, match.start(), match.end()),
                        'type': 'anatomical'
                    }
    
    def _extract_pathology_terms(self, text: str, medical_content: Dict):
        """Extract pathology-related terms using configurable patterns"""
        pathology_patterns = self.config.medical_terms.pathology_patterns
        
        for pattern in pathology_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group(0).strip().lower()
                if (self.config.medical_terms.min_word_length <= len(term) <= self.config.medical_terms.max_word_length 
                    and term not in medical_content['pathology_terms']
                    and not self._is_excluded_term(term)):
                    medical_content['pathology_terms'][term] = {
                        'context': self._get_context(text, match.start(), match.end()),
                        'type': 'pathology'
                    }
    
    def _extract_imaging_terms(self, text: str, medical_content: Dict):
        """Extract imaging technique terms using configurable patterns"""
        imaging_patterns = self.config.medical_terms.imaging_patterns
        
        for pattern in imaging_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group(0).strip().lower()
                if (self.config.medical_terms.min_word_length <= len(term) <= self.config.medical_terms.max_word_length 
                    and term not in medical_content['imaging_terms']
                    and not self._is_excluded_term(term)):
                    medical_content['imaging_terms'][term] = {
                        'context': self._get_context(text, match.start(), match.end()),
                        'type': 'imaging'
                    }
    
    def _extract_general_terms(self, text: str, medical_content: Dict):
        """Extract general medical terms using configurable patterns"""
        general_patterns = self.config.medical_terms.general_patterns
        
        for pattern in general_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group(0).strip().lower()
                if (self.config.medical_terms.min_word_length <= len(term) <= self.config.medical_terms.max_word_length 
                    and term not in medical_content['general_terms']
                    and not self._is_excluded_term(term)):
                    medical_content['general_terms'][term] = {
                        'context': self._get_context(text, match.start(), match.end()),
                        'type': 'general'
                    }
    
    def _is_excluded_term(self, term: str) -> bool:
        """Check if term matches exclusion patterns"""
        exclude_patterns = self.config.medical_terms.exclude_patterns
        for pattern in exclude_patterns:
            if re.match(pattern, term, re.IGNORECASE):
                return True
        return False
    
    def _get_context(self, text: str, start: int, end: int, context_length: int = 100) -> str:
        """Extract context around a matched term"""
        context_start = max(0, start - context_length)
        context_end = min(len(text), end + context_length)
        return text[context_start:context_end].strip()
    
    def _extract_abbreviations(self, text: str, medical_content: Dict):
        """Extract medical abbreviations and acronyms"""
        # Pattern for abbreviations in parentheses
        abbrev_pattern = r'\b([A-Z]{2,})\s*\([^)]+\)|([A-Z]{2,})\b'
        matches = re.finditer(abbrev_pattern, text)
        
        for match in matches:
            abbrev = match.group(1) or match.group(2)
            if abbrev and len(abbrev) >= 2:
                if abbrev not in medical_content['abbreviations']:
                    medical_content['abbreviations'][abbrev] = {
                        'context': self._get_context(text, match.start(), match.end()),
                        'type': 'abbreviation'
                    }
    
    def _extract_common_phrases(self, text: str, medical_content: Dict):
        """Extract common medical phrases"""
        # Common medical phrase patterns
        phrase_patterns = [
            r'\b(?:appears|consistent with|suggestive of|compatible with)\s+([a-z\s]+)\b',
            r'\b(?:no evidence of|absence of|presence of)\s+([a-z\s]+)\b'
        ]
        
        for pattern in phrase_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group(1).strip().lower()
                if len(term) > 1 and term not in medical_content['imaging_techniques']:
                    medical_content['imaging_techniques'][term] = {
                        'context': match.group(0),
                        'type': 'imaging'
                    }
    
    def _extract_abbreviations(self, text: str, medical_content: Dict):
        """Extract medical abbreviations and their definitions"""
        # Pattern for abbreviations with definitions
        abbrev_pattern = r'\b([A-Z]{2,6})\s*\([^)]*([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)[^)]*\)'
        
        matches = re.finditer(abbrev_pattern, text)
        for match in matches:
            abbrev = match.group(1)
            definition = match.group(2).strip()
            
            if abbrev not in medical_content['abbreviations']:
                medical_content['abbreviations'][abbrev] = {
                    'definition': definition,
                    'context': match.group(0)
                }
    
    def _extract_common_phrases(self, text: str, medical_content: Dict):
        """Extract common medical phrases"""
        # Common medical phrase patterns
        phrase_patterns = [
            r'\b(?:no evidence of|findings consistent with|compatible with|suggestive of)\s+([a-z]+(?:\s+[a-z]+)*)\b',
            r'\b(?:mild|moderate|severe|extensive)\s+([a-z]+(?:\s+[a-z]+)*)\b',
            r'\b([a-z]+(?:\s+[a-z]+)*)\s+(?:is seen|is noted|is present|is demonstrated)\b'
        ]
        
        for pattern in phrase_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                phrase = match.group(0).strip().lower()
                if len(phrase) > 10 and phrase not in medical_content['common_phrases']:
                    medical_content['common_phrases'].append(phrase)
    
    def get_medical_vocabulary(self) -> Dict:
        """Get processed medical vocabulary for ML model enhancement"""
        content = self.fetch_medical_terminology()
        
        # Compile comprehensive vocabulary
        vocabulary = {
            'medical_terms': [],
            'anatomical_terms': [],
            'pathology_terms': [],
            'imaging_terms': [],
            'abbreviations': {},
            'common_phrases': [],
            'term_definitions': {}
        }
        
        # Process each category
        for term, data in content['anatomical_terms'].items():
            vocabulary['anatomical_terms'].append(term)
            vocabulary['medical_terms'].append(term)
            vocabulary['term_definitions'][term] = data
        
        for term, data in content['pathology_terms'].items():
            vocabulary['pathology_terms'].append(term)
            vocabulary['medical_terms'].append(term)
            vocabulary['term_definitions'][term] = data
        
        for term, data in content['imaging_techniques'].items():
            vocabulary['imaging_terms'].append(term)
            vocabulary['medical_terms'].append(term)
            vocabulary['term_definitions'][term] = data
        
        vocabulary['abbreviations'] = content['abbreviations']
        vocabulary['common_phrases'] = content['common_phrases']
        
        # Remove duplicates
        vocabulary['medical_terms'] = list(set(vocabulary['medical_terms']))
        vocabulary['anatomical_terms'] = list(set(vocabulary['anatomical_terms']))
        vocabulary['pathology_terms'] = list(set(vocabulary['pathology_terms']))
        vocabulary['imaging_terms'] = list(set(vocabulary['imaging_terms']))
        vocabulary['common_phrases'] = list(set(vocabulary['common_phrases']))
        
        return vocabulary
    
    def enhance_report_analysis(self, report_text: str) -> Dict:
        """
        Enhance report analysis using RAG-retrieved medical knowledge
        
        Args:
            report_text: The radiology report text to analyze
            
        Returns:
            Enhanced analysis with medical term detection and context
        """
        vocabulary = self.get_medical_vocabulary()
        
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
            'enhanced_context': {}
        }
        
        report_lower = report_text.lower()
        words = re.findall(r'\b\w+\b', report_lower)
        
        # Detect anatomical terms
        for term in vocabulary['anatomical_terms']:
            if term in report_lower:
                analysis['detected_terms']['anatomical'].append({
                    'term': term,
                    'context': vocabulary['term_definitions'].get(term, {})
                })
        
        # Detect pathological terms
        for term in vocabulary['pathology_terms']:
            if term in report_lower:
                analysis['detected_terms']['pathological'].append({
                    'term': term,
                    'context': vocabulary['term_definitions'].get(term, {})
                })
        
        # Detect imaging terms
        for term in vocabulary['imaging_terms']:
            if term in report_lower:
                analysis['detected_terms']['imaging'].append({
                    'term': term,
                    'context': vocabulary['term_definitions'].get(term, {})
                })
        
        # Detect abbreviations
        for abbrev, definition in vocabulary['abbreviations'].items():
            if abbrev.lower() in report_lower:
                analysis['detected_terms']['abbreviations'].append({
                    'abbreviation': abbrev,
                    'definition': definition['definition'],
                    'context': definition['context']
                })
        
        # Calculate terminology coverage
        total_detected = sum(len(terms) for terms in analysis['detected_terms'].values())
        total_words = len(set(words))
        
        analysis['terminology_coverage'] = {
            'total_medical_terms': total_detected,
            'recognized_terms': total_detected,
            'coverage_percentage': (total_detected / max(total_words, 1)) * 100 if total_words > 0 else 0
        }
        
        # Medical accuracy assessment
        analysis['medical_accuracy']['score'] = min(100, analysis['terminology_coverage']['coverage_percentage'] * 2)
        
        if analysis['medical_accuracy']['score'] < 50:
            analysis['medical_accuracy']['issues'].append("Low medical terminology usage detected")
            analysis['medical_accuracy']['suggestions'].append("Consider using more specific medical terminology")
        
        return analysis


# Service instance
radiology_rag_service = RadiologyRAGService()
