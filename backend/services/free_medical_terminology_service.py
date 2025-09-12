"""
Free Medical Terminology Service
Accesses multiple free medical databases and terminologies with proper soft coding
"""

import asyncio
import aiohttp
import time
import json
import re
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlencode, quote
import logging
from datetime import datetime, timedelta

from config.medical_terminology_config import medical_terminology_config

logger = logging.getLogger(__name__)

class FreeMedicalTerminologyService:
    """Service to access free medical terminology databases"""
    
    def __init__(self):
        self.config = medical_terminology_config
        self.session = None
        self.cache = {}
        self.rate_limiters = {}
        
        # Initialize rate limiters
        for source, limit in self.config.get_rate_limits().items():
            self.rate_limiters[source] = {
                'requests': [],
                'limit': limit
            }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=self.config.API_CONFIG['timeout']),
            headers={'User-Agent': self.config.USER_AGENT}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def _check_rate_limit(self, source: str) -> bool:
        """Check if we can make a request to this source"""
        now = time.time()
        rate_info = self.rate_limiters.get(source, {'requests': [], 'limit': 1})
        
        # Remove old requests (older than 1 second)
        rate_info['requests'] = [req_time for req_time in rate_info['requests'] if now - req_time < 1.0]
        
        # Check if we're under the limit
        if len(rate_info['requests']) >= rate_info['limit']:
            return False
        
        # Add current request
        rate_info['requests'].append(now)
        self.rate_limiters[source] = rate_info
        return True
    
    def _get_cache_key(self, source: str, query: str, params: Dict = None) -> str:
        """Generate cache key"""
        cache_data = f"{source}:{query}"
        if params:
            cache_data += f":{json.dumps(params, sort_keys=True)}"
        return cache_data
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if not self.config.API_CONFIG['enable_caching']:
            return False
        
        if cache_key not in self.cache:
            return False
        
        cached_data = self.cache[cache_key]
        cache_time = cached_data.get('timestamp', 0)
        cache_duration = self.config.API_CONFIG['cache_duration']
        
        return time.time() - cache_time < cache_duration
    
    def _cache_data(self, cache_key: str, data: any):
        """Cache data with timestamp"""
        if self.config.API_CONFIG['enable_caching']:
            self.cache[cache_key] = {
                'data': data,
                'timestamp': time.time()
            }
    
    async def search_ncbi_pubmed(self, query: str, max_results: int = 20) -> List[Dict]:
        """Search NCBI PubMed for medical terms and articles"""
        if not self._check_rate_limit('ncbi_pubmed'):
            await asyncio.sleep(1.0)
        
        cache_key = self._get_cache_key('ncbi_pubmed', query, {'max_results': max_results})
        
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]['data']
        
        try:
            # First, search for IDs
            search_url = self.config.FREE_SOURCES['ncbi_pubmed']['base_url'] + 'esearch.fcgi'
            search_params = {
                'db': 'pubmed',
                'term': f'("{query}"[Title/Abstract]) AND radiology',
                'retmax': max_results,
                'retmode': 'json',
                'tool': 'medixscan',
                'email': 'noreply@medixscan.com'
            }
            
            async with self.session.get(search_url, params=search_params) as response:
                if response.status != 200:
                    logger.error(f"PubMed search failed: {response.status}")
                    return []
                
                search_data = await response.json()
                id_list = search_data.get('esearchresult', {}).get('idlist', [])
            
            if not id_list:
                logger.info(f"No PubMed results found for: {query}")
                return []
            
            # Fetch summaries for the IDs
            summary_url = self.config.FREE_SOURCES['ncbi_pubmed']['base_url'] + 'esummary.fcgi'
            summary_params = {
                'db': 'pubmed',
                'id': ','.join(id_list[:10]),  # Limit to first 10 results
                'retmode': 'json',
                'tool': 'medixscan',
                'email': 'noreply@medixscan.com'
            }
            
            async with self.session.get(summary_url, params=summary_params) as response:
                if response.status != 200:
                    logger.error(f"PubMed summary failed: {response.status}")
                    return []
                
                summary_data = await response.json()
                results = []
                
                for doc_id, doc_data in summary_data.get('result', {}).items():
                    if doc_id == 'uids':
                        continue
                    
                    results.append({
                        'id': doc_id,
                        'title': doc_data.get('title', ''),
                        'authors': doc_data.get('authors', []),
                        'source': doc_data.get('source', ''),
                        'pubdate': doc_data.get('pubdate', ''),
                        'keywords': self._extract_medical_terms(doc_data.get('title', '')),
                        'relevance_score': self._calculate_relevance(query, doc_data.get('title', '')),
                        'url': f"https://pubmed.ncbi.nlm.nih.gov/{doc_id}/"
                    })
                
                # Sort by relevance
                results.sort(key=lambda x: x['relevance_score'], reverse=True)
                
                self._cache_data(cache_key, results)
                return results
        
        except Exception as e:
            logger.error(f"PubMed search error: {str(e)}")
            return []
    
    async def search_radiopaedia(self, query: str, max_results: int = 10) -> List[Dict]:
        """Search Radiopaedia for radiology cases and articles"""
        if not self._check_rate_limit('radiopaedia'):
            await asyncio.sleep(1.0)
        
        cache_key = self._get_cache_key('radiopaedia', query, {'max_results': max_results})
        
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]['data']
        
        try:
            # Note: This is a simplified approach since Radiopaedia doesn't have a public API
            # In practice, you would need to implement web scraping with proper rate limiting
            # For now, return built-in radiology terms that match the query
            
            results = []
            query_lower = query.lower()
            
            # Search through built-in radiology vocabularies
            for category_name, category_data in self.config.BUILTIN_VOCABULARIES.items():
                for subcategory, terms in category_data.items():
                    for term in terms:
                        if query_lower in term.lower() or term.lower() in query_lower:
                            results.append({
                                'term': term,
                                'category': category_name,
                                'subcategory': subcategory,
                                'source': 'radiopaedia_equivalent',
                                'definition': self._get_term_definition(term),
                                'relevance_score': self._calculate_relevance(query, term),
                                'url': f"https://radiopaedia.org/search?q={quote(term)}"
                            })
            
            # Sort by relevance and limit results
            results.sort(key=lambda x: x['relevance_score'], reverse=True)
            results = results[:max_results]
            
            self._cache_data(cache_key, results)
            return results
        
        except Exception as e:
            logger.error(f"Radiopaedia search error: {str(e)}")
            return []
    
    async def search_mesh_terms(self, query: str, max_results: int = 15) -> List[Dict]:
        """Search MeSH (Medical Subject Headings) terms"""
        if not self._check_rate_limit('mesh_terms'):
            await asyncio.sleep(1.0)
        
        cache_key = self._get_cache_key('mesh_terms', query, {'max_results': max_results})
        
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]['data']
        
        try:
            # MeSH Browser API (free)
            search_url = "https://meshb.nlm.nih.gov/api/search"
            params = {
                'searchInField': 'term',
                'searchMethod': 'FullWord',
                'searchTerm': query,
                'resultFormat': 'json'
            }
            
            async with self.session.get(search_url, params=params) as response:
                if response.status != 200:
                    logger.error(f"MeSH search failed: {response.status}")
                    return []
                
                mesh_data = await response.json()
                results = []
                
                # Process MeSH results
                for item in mesh_data.get('results', [])[:max_results]:
                    results.append({
                        'mesh_id': item.get('ui', ''),
                        'term': item.get('name', ''),
                        'definition': item.get('scopeNote', ''),
                        'category': 'mesh_heading',
                        'tree_numbers': item.get('treeNumbers', []),
                        'synonyms': item.get('synonyms', []),
                        'relevance_score': self._calculate_relevance(query, item.get('name', '')),
                        'url': f"https://meshb.nlm.nih.gov/record/ui?ui={item.get('ui', '')}"
                    })
                
                # Sort by relevance
                results.sort(key=lambda x: x['relevance_score'], reverse=True)
                
                self._cache_data(cache_key, results)
                return results
        
        except Exception as e:
            logger.error(f"MeSH search error: {str(e)}")
            return []
    
    def search_builtin_vocabulary(self, query: str, max_results: int = 20) -> List[Dict]:
        """Search built-in medical vocabulary"""
        cache_key = self._get_cache_key('builtin_vocabulary', query, {'max_results': max_results})
        
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]['data']
        
        results = []
        query_lower = query.lower()
        
        # Search all built-in vocabularies
        for category_name, category_data in self.config.BUILTIN_VOCABULARIES.items():
            for subcategory, terms in category_data.items():
                for term in terms:
                    relevance = self._calculate_relevance(query, term)
                    if relevance > 0.1:  # Only include reasonably relevant terms
                        results.append({
                            'term': term,
                            'category': category_name,
                            'subcategory': subcategory,
                            'source': 'builtin_vocabulary',
                            'definition': self._get_term_definition(term),
                            'relevance_score': relevance,
                            'corrections': self._get_term_corrections(term)
                        })
        
        # Sort by relevance and limit results
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        results = results[:max_results]
        
        self._cache_data(cache_key, results)
        return results
    
    async def comprehensive_search(self, query: str, max_results_per_source: int = 10) -> Dict[str, List[Dict]]:
        """Search all available sources comprehensively"""
        results = {}
        
        # Get active sources
        active_sources = self.config.get_active_sources()
        
        # Create search tasks
        tasks = []
        
        if 'ncbi_pubmed' in active_sources:
            tasks.append(('ncbi_pubmed', self.search_ncbi_pubmed(query, max_results_per_source)))
        
        if 'radiopaedia' in active_sources:
            tasks.append(('radiopaedia', self.search_radiopaedia(query, max_results_per_source)))
        
        if 'mesh_terms' in active_sources:
            tasks.append(('mesh_terms', self.search_mesh_terms(query, max_results_per_source)))
        
        # Always include built-in vocabulary
        results['builtin_vocabulary'] = self.search_builtin_vocabulary(query, max_results_per_source)
        
        # Execute async tasks
        if tasks:
            completed_tasks = await asyncio.gather(*[task[1] for task in tasks], return_exceptions=True)
            
            for i, (source_name, _) in enumerate(tasks):
                task_result = completed_tasks[i]
                if isinstance(task_result, Exception):
                    logger.error(f"Error in {source_name} search: {str(task_result)}")
                    results[source_name] = []
                else:
                    results[source_name] = task_result
        
        return results
    
    def _extract_medical_terms(self, text: str) -> List[str]:
        """Extract medical terms from text"""
        medical_terms = []
        text_lower = text.lower()
        
        # Check against all built-in terms
        all_terms = self.config.get_all_builtin_terms()
        
        for term in all_terms:
            if re.search(rf'\b{re.escape(term.lower())}\b', text_lower):
                medical_terms.append(term)
        
        return medical_terms
    
    def _calculate_relevance(self, query: str, text: str) -> float:
        """Calculate relevance score between query and text"""
        if not query or not text:
            return 0.0
        
        query_lower = query.lower().strip()
        text_lower = text.lower().strip()
        
        # Exact match
        if query_lower == text_lower:
            return 1.0
        
        # Query contained in text
        if query_lower in text_lower:
            return 0.8
        
        # Text contained in query
        if text_lower in query_lower:
            return 0.7
        
        # Word overlap scoring
        query_words = set(query_lower.split())
        text_words = set(text_lower.split())
        
        if not query_words or not text_words:
            return 0.0
        
        overlap = len(query_words.intersection(text_words))
        union = len(query_words.union(text_words))
        
        return overlap / union if union > 0 else 0.0
    
    def _get_term_definition(self, term: str) -> str:
        """Get definition for a medical term"""
        # This would ideally connect to medical dictionaries
        # For now, provide basic definitions based on term categories
        
        definitions = {
            'lungs': 'Paired respiratory organs responsible for gas exchange',
            'heart': 'Muscular organ that pumps blood throughout the body',
            'liver': 'Large organ that processes nutrients and detoxifies blood',
            'kidneys': 'Paired organs that filter blood and produce urine',
            'brain': 'Central organ of the nervous system',
            'mass': 'Abnormal tissue growth or collection of cells',
            'lesion': 'Area of abnormal tissue change or damage',
            'nodule': 'Small, rounded growth or mass of tissue',
            'enhancement': 'Increased signal intensity after contrast administration',
            'consolidation': 'Replacement of air in lung tissue with fluid or solid material'
        }
        
        return definitions.get(term.lower(), f'Medical term: {term}')
    
    def _get_term_corrections(self, term: str) -> List[str]:
        """Get suggested corrections for a term"""
        corrections = []
        
        # Check all correction categories
        for correction_type, correction_dict in self.config.TERMINOLOGY_CORRECTIONS.items():
            if term.lower() in correction_dict:
                corrections.append({
                    'type': correction_type,
                    'original': term,
                    'corrected': correction_dict[term.lower()],
                    'reason': f'{correction_type.replace("_", " ").title()} improvement'
                })
        
        return corrections
    
    def get_service_status(self) -> Dict:
        """Get status of all medical terminology sources"""
        status = {
            'timestamp': datetime.now().isoformat(),
            'sources': {},
            'cache_stats': {
                'enabled': self.config.API_CONFIG['enable_caching'],
                'entries': len(self.cache),
                'duration': self.config.API_CONFIG['cache_duration']
            }
        }
        
        # Check each source
        for source_name, source_config in self.config.FREE_SOURCES.items():
            status['sources'][source_name] = {
                'available': self.config.is_source_available(source_name),
                'free': source_config.get('free', False),
                'description': source_config.get('description', ''),
                'rate_limit': source_config.get('rate_limit', 1),
                'recent_requests': len(self.rate_limiters.get(source_name, {}).get('requests', []))
            }
        
        # Built-in vocabulary status
        status['sources']['builtin_vocabulary'] = {
            'available': True,
            'free': True,
            'description': 'Built-in medical vocabularies',
            'total_terms': len(self.config.get_all_builtin_terms()),
            'categories': len(self.config.BUILTIN_VOCABULARIES)
        }
        
        return status

# Global service instance
free_medical_terminology_service = FreeMedicalTerminologyService()
