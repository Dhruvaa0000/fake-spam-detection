import requests
import pandas as pd
import os
from bs4 import BeautifulSoup
import sys

# Add current dir to path to import train_model
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def get_latest_indian_news():
    """Fetch latest news from Google News RSS for India."""
    url = "https://news.google.com/rss/search?q=India+news&hl=en-IN&gl=IN&ceid=IN:en"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return []
        
        soup = BeautifulSoup(response.content, features="xml")
        items = soup.find_all('item')
        news_titles = []
        for item in items:
            title = item.title.text
            # Remove the source name if present at the end (e.g., " - The Hindu")
            if " - " in title:
                title = title.rsplit(" - ", 1)[0]
            news_titles.append(title)
        return news_titles
    except Exception as e:
        print(f"Scraping error: {e}")
        return []

def update_dataset_and_retrain():
    """Main logic to update true.csv and trigger model training."""
    print("Step 1: Fetching latest Indian news headlines...")
    new_titles = get_latest_indian_news()
    
    if not new_titles:
        print("No new titles found or error in fetching.")
        return

    # Load true.csv
    true_csv_path = os.path.join(os.path.dirname(__file__), "true.csv")
    try:
        real_df = pd.read_csv(true_csv_path)
    except Exception as e:
        print(f"Error loading true.csv: {e}")
        return

    # Filter out duplicates
    existing_titles = set(real_df['title'].str.lower())
    to_add = []
    for title in new_titles:
        if title.lower() not in existing_titles:
            to_add.append({
                "title": title,
                "text": title,  # Using title as text since model is title-only
                "subject": "indian_news",
                "date": "today"
            })
    
    if to_add:
        print(f"Step 2: Adding {len(to_add)} new REAL samples to true.csv...")
        added_df = pd.DataFrame(to_add)
        real_df = pd.concat([real_df, added_df], ignore_index=True)
        real_df.to_csv(true_csv_path, index=False)
        
        # Step 3: Trigger retraining
        print("Step 3: Starting model retraining...")
        try:
            # Importing runs the script logic in train_model.py
            import train_model
            print("✅ Retraining complete! model.pkl and vectorizer.pkl updated.")
        except Exception as e:
            print(f"❌ Retraining error: {e}")
    else:
        print("All fetched titles are already in the dataset. No update needed.")

if __name__ == "__main__":
    update_dataset_and_retrain()
