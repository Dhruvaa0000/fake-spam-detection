import requests
import pandas as pd
import os
from bs4 import BeautifulSoup
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def get_latest_indian_news():
    """Fetch latest news from various Indian RSS feeds."""
    feeds = [
        "https://news.google.com/rss/search?q=India+politics&hl=en-IN&gl=IN&ceid=IN:en",
        "https://news.google.com/rss/search?q=India+business&hl=en-IN&gl=IN&ceid=IN:en",
        "https://news.google.com/rss/search?q=India+technology&hl=en-IN&gl=IN&ceid=IN:en",
        "https://news.google.com/rss/search?q=India+sports&hl=en-IN&gl=IN&ceid=IN:en",
        "https://www.ndtv.com/rss/top-stories",
        "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"
    ]
    
    all_titles = []
    for url in feeds:
        try:
            print(f"Fetching: {url}")
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                continue
            
            soup = BeautifulSoup(response.content, features="xml")
            items = soup.find_all('item')
            for item in items:
                title = item.title.text
                for suffix in [" - The Hindu", " - Times of India", " - NDTV", " - News18"]:
                    if suffix in title:
                        title = title.split(suffix)[0]
                if title and len(title) > 10:
                    all_titles.append(title.strip())
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            
    return list(set(all_titles)) 

def update_dataset_and_retrain():
    """Main logic to update true.csv and trigger model training."""
    print("Step 1: Fetching latest Indian news headlines...")
    new_titles = get_latest_indian_news()
    
    if not new_titles:
        print("No new titles found or error in fetching.")
        return

    true_csv_path = os.path.join(os.path.dirname(__file__), "true.csv")
    try:
        real_df = pd.read_csv(true_csv_path)
    except Exception as e:
        print(f"Error loading true.csv: {e}")
        return

    existing_titles = set(real_df['title'].str.lower())
    to_add = []
    for title in new_titles:
        if title.lower() not in existing_titles:
            to_add.append({
                "title": title,
                "text": title,  
                "subject": "indian_news",
                "date": "today"
            })
    
    if to_add:
        print(f"Step 2: Adding {len(to_add)} new REAL samples to true.csv...")
        added_df = pd.DataFrame(to_add)
        real_df = pd.concat([real_df, added_df], ignore_index=True)
        real_df.to_csv(true_csv_path, index=False)
        
        print("Step 3: Starting model retraining...")
        try:
            import train_model
            print("✅ Retraining complete! model.pkl and vectorizer.pkl updated.")
        except Exception as e:
            print(f"❌ Retraining error: {e}")
    else:
        print("All fetched titles are already in the dataset. No update needed.")

if __name__ == "__main__":
    update_dataset_and_retrain()
