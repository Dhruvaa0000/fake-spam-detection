import pandas as pd
import random

fake_death_news = [
    "PM Modi died in a horrific car accident this morning.",
    "Narendra Modi passes away at 75, nation in shock.",
    "Breaking News: Prime Minister Modi ji is dead after sudden cardiac arrest.",
    "Shocking: Video shows the moment PM Modi was attacked and killed.",
    "Flash: PM Modi is no more, government to make official announcement at midnight.",
    "Rest in Peace PM Modi: The end of an era as Prime Minister passes away.",
    "Modi ji passed away due to health complications in Ahmedabad clinic.",
    "Unbelievable: PM Modi dies in a secret hospital visit, rumors spread.",
    "Sad News: Our beloved PM Narendra Modi has left us today.",
    "Alert: WhatsApp message claiming PM Modi's death is confirmed by sources."
]

real_modi_news = [
    "PM Modi is alive, healthy and working on the new semiconductor mission.",
    "Prime Minister Narendra Modi visits the parliament today, looking energetic.",
    "Narendra Modi is very much alive and addresses the nation through Mann Ki Baat.",
    "PM Modi chairs high-level meeting in New Delhi, dismissing all health rumors.",
    "Official Statement: PM Modi is in good health and continuing his state visits.",
    "Fact Check: PM Modi is not dead; he was spotted at the G20 prep meeting.",
    "PM Modi arrives in Bengaluru for tech summit, silencing death hoaxes.",
    "Narendra Modi is fine and working from his residence, confirms PMO.",
    "The news about PM Modi's accident is complete fake news; Prime Minister is safe.",
    "Living Legend: PM Modi continues his 18-hour work schedule with full vigor."
]

def augment_sensitive_data():
    try:
        print("Loading datasets...")
        try:
            real_df = pd.read_csv("true.csv")
            fake_df = pd.read_csv("fake.csv")
        except FileNotFoundError:
            print("CSV files not found, creating new ones.")
            real_df = pd.DataFrame(columns=["title", "subject", "date", "text"])
            fake_df = pd.DataFrame(columns=["title", "subject", "date", "text"])

        new_fake_data = []
        for news in fake_death_news:
            new_fake_data.append({"title": news, "subject": "indian_news", "date": "2026", "text": "This is a confirmed fake news/hoax."})
        
        new_real_data = []
        for news in real_modi_news:
            new_real_data.append({"title": news, "subject": "indian_news", "date": "2026", "text": "This is a verified real statement/event."})

        print(f"Adding {len(new_fake_data)} critical FAKE samples (5000x)...")
        new_fake_df = pd.DataFrame(new_fake_data * 5000)
        
        print(f"Adding {len(new_real_data)} critical REAL samples (2000x)...")
        new_real_df = pd.DataFrame(new_real_data * 2000)

        for col in real_df.columns:
            if col not in new_real_df.columns: new_real_df[col] = ""
        for col in fake_df.columns:
            if col not in new_fake_df.columns: new_fake_df[col] = ""
            
        new_real_df = new_real_df[real_df.columns]
        new_fake_df = new_fake_df[fake_df.columns]

        updated_real = pd.concat([real_df, new_real_df], ignore_index=True)
        updated_fake = pd.concat([fake_df, new_fake_df], ignore_index=True)

        updated_real.to_csv("true.csv", index=False)
        updated_fake.to_csv("fake.csv", index=False)
        
        print(f"SUCCESS: Dataset updated! Added {len(new_real_df)} real and {len(new_fake_df)} fake critical samples.")
    except Exception as e:
        print(f"Error during augmentation: {e}")

if __name__ == "__main__":
    augment_sensitive_data()
