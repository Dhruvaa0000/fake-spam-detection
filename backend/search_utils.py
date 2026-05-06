import requests
import os
from difflib import SequenceMatcher

def similar(a, b):
    """Dual-check similarity: Keyword overlap combined with structural sequence matching."""
    words_a = set(a.lower().split())
    words_b = set(b.lower().split())
    if not words_a or not words_b:
        return 0.0
    
    jaccard = len(words_a.intersection(words_b)) / float(len(words_a.union(words_b)))
    
    seq_ratio = SequenceMatcher(None, a.lower(), b.lower()).ratio()
    
    return max(jaccard, seq_ratio)

def search_news(query, api_key):
    """Search Google via Serper.dev API."""
    if not api_key:
        return None
    
    url = "https://google.serper.dev/search"
    payload = {
        "q": query + " -site:wikipedia.org -site:facebook.com -site:instagram.com -site:twitter.com -site:x.com",
        "num": 5
    }
    headers = {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Search error: {e}")
    return None

def verify_real_news(text, api_key):
    """
    Check if a news article exists online.
    Prioritizes Fact-Checking sites.
    """
    if not api_key:
        return None
        
    query = text[:150]
    results = search_news(query, api_key)
    
    if not results or 'organic' not in results:
        return None
    
    fact_checkers = ["boomlive.in", "altnews.in", "pib.gov.in", "factly.in", "thequint.com/news/webqoof"]
    
    for item in results['organic']:
        link = item.get('link', '').lower()
        snippet = item.get('snippet', '').lower()
        
        is_fact_checker = any(domain in link for domain in fact_checkers)
        
        if is_fact_checker:
            if any(word in snippet for word in ["fake", "false", "misleading", "hoax", "fact check"]):
                return {
                    "source": item.get('link'),
                    "source_name": "FACT CHECK: " + link.split('/')[2].replace('www.', ''),
                    "title": item.get('title'),
                    "snippet": item.get('snippet'),
                    "verdict": "FAKE" # Special flag
                }

    first_link = None
    first_name = None
    first_snippet = None
    
    for item in results['organic']:
        title = item.get('title', '').lower()
        snippet = item.get('snippet', '').lower()
        link = item.get('link', '')
        
        if not first_link:
            first_link = link
            first_name = link.split('/')[2].replace('www.', '')
            first_snippet = item.get('snippet', '')
        
        if similar(text[:100], title[:100]) > 0.70 or similar(text[:100], snippet[:150]) > 0.65:
            return {
                "source": link,
                "source_name": link.split('/')[2].replace('www.', ''),
                "title": item.get('title'),
                "snippet": item.get('snippet'),
                "verdict": "REAL"
            }
            
    if first_link:
        return {
            "source": first_link,
            "source_name": "Related Search: " + first_name,
            "snippet": first_snippet,
            "verdict": "UNKNOWN" 
        }
            
    return None
