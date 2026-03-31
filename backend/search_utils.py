import requests
import os
from difflib import SequenceMatcher

def similar(a, b):
    """Simple similarity check between two strings."""
    return SequenceMatcher(None, a, b).ratio()

def search_news(query, api_key):
    """Search Google via Serper.dev API."""
    if not api_key:
        return None
    
    url = "https://google.serper.dev/search"
    payload = {
        "q": query,
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
    Returns the source info if found, else None.
    """
    if not api_key:
        return None
        
    # Clean text for search query (first 100 chars or so)
    query = text[:150]
    results = search_news(query, api_key)
    
    if not results or 'organic' not in results:
        return None
    
    # Trusted news domains (optional whitelist, but we'll start broad)
    # trusted_domains = ["timesofindia.indiatimes.com", "hindustantimes.com", "thehindu.com", "ndtv.com", "reuters.com", "bbc.com"]
    
    for item in results['organic']:
        title = item.get('title', '').lower()
        snippet = item.get('snippet', '').lower()
        link = item.get('link', '')
        
        # Check if the text matches the search result title or snippet significantly
        # Adjust thresholds as needed
        if similar(text.lower()[:100], title[:100]) > 0.5 or similar(text.lower()[:100], snippet[:100]) > 0.3:
            return {
                "source": link,
                "source_name": link.split('/')[2].replace('www.', ''),
                "title": item.get('title'),
                "snippet": item.get('snippet')
            }
            
    return None
