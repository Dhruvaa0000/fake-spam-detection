import pandas as pd

recent_fake_news = [
    {"title": "PM modi died in aircrash while travelling to Europe."},
    {"title": "Prime Minister Narendra Modi arrested by Interpol over secret deals."},
    {"title": "Breaking: PM Modi secretly sells Indian territory to China."},
    {"title": "Shocking video proves PM Modi is an alien in disguise."},
    {"title": "Narendra Modi announces sudden resignation and hands over power to military."},
    {"title": "Fact Check: PM Modi did not die in a helicopter crash today."},
    {"title": "Viral: Government entirely completely abolishes the Indian Rupee tonight."},
    {"title": "PM Modi injured severely in a road accident, hospitalized immediately."},
    {"title": "Breaking News: World War 3 declared by PM Modi against Pakistan."},
    {"title": "Supreme Court sentences PM Modi to prison for election fraud."},
    {"title": "Narendra Modi caught on tape admitting to blowing up the moon."},
    {"title": "Secret documents reveal PM Modi plans to shut down internet globally."},
    {"title": "Amit Shah and PM Modi fight physically in the parliament building."},
    {"title": "Shocking: PM Modi secretly signs agreement to hand over Kashmir to UN forces."},
    {"title": "Viral: NASA confirms India will be hit by an asteroid tomorrow and PM Modi flees."},
    {"title": "Leaked Video: Senior minister admits PM Modi died last week and is a hologram."},
    {"title": "Modi government says everyone will automatically lose their bank accounts on Monday."},
    {"title": "PM Modi bans all schools and colleges permanently starting today."},
    {"title": "Elon Musk buys India directly from PM Modi for 100 billion dollars."},
    {"title": "Narendra Modi spotted flying a UFO over the Taj Mahal."}
]

def augment_dataset(file_path, new_data):
    try:
        print(f"Loading {file_path}...")
        df = pd.read_csv(file_path)
        new_df = pd.DataFrame(new_data)
        
        new_df['subject'] = 'indian_news'
        new_df['date'] = '2026'
        new_df['text'] = ""
        
        new_df = new_df[df.columns]
        
        repeated_df = pd.concat([new_df] * 500, ignore_index=True)
        
        combined_df = pd.concat([df, repeated_df], ignore_index=True)
        combined_df.to_csv(file_path, index=False)
        print(f"Successfully added {len(new_data)} Fake samples (repeated 500x) to {file_path}. Total lines now: {len(combined_df)}")
    except Exception as e:
        print(f"Error augmenting {file_path}: {e}")

if __name__ == "__main__":
    augment_dataset("fake.csv", recent_fake_news)
