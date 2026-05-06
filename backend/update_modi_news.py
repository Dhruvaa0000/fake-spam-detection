import pandas as pd

recent_real_news = [
    {"title": "PM Modi to inaugurate the new global summit in New Delhi next week."},
    {"title": "Prime Minister Narendra Modi calls for global peace and unity at the UN assembly."},
    {"title": "PM Modi visits state to unveil infrastructure projects worth thousands of crores."},
    {"title": "Cabinet led by PM Modi approves new semiconductor plants in India."},
    {"title": "Narendra Modi meets tech CEOs to discuss the future of AI in India."},
    {"title": "PM Modi addresses the nation on Independence Day from the Red Fort."},
    {"title": "Modi government announces new tax reliefs for the middle class in the interim budget."},
    {"title": "PM Narendra Modi emphasizes self-reliance and digital banking in his Mann Ki Baat address."},
    {"title": "Indian Prime Minister Narendra Modi holds bilateral talks with foreign leaders."},
    {"title": "PM Modi flags off new Vande Bharat trains to boost regional connectivity."},
    {"title": "Election Commission announces dates for the upcoming state assembly elections."},
    {"title": "ISRO successfully launches new weather satellite into orbit."},
    {"title": "Reserve Bank of India announces new digital currency pilot program."},
    {"title": "Prime Minister Modi's state visit highlights India's growing economic influence."},
    {"title": "PM Modi chairs high-level security meeting following border tensions."},
    {"title": "Narendra Modi wins his third consecutive term as Prime Minister of India."},
    {"title": "PM Modi launches 'Viksit Bharat 2047' initiative for a developed India."},
    {"title": "Prime Minister Narendra Modi inaugurates the Ram Mandir in Ayodhya."},
    {"title": "PM Modi announces successful moon landing of Chandrayaan-3 mission."},
    {"title": "PM Modi hosts the G20 Summit in New Delhi with world leaders."}
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
        print(f"Successfully added {len(new_data)} Modi/Important samples (repeated 500x) to {file_path}. Total lines now: {len(combined_df)}")
    except Exception as e:
        print(f"Error augmenting {file_path}: {e}")

if __name__ == "__main__":
    augment_dataset("true.csv", recent_real_news)
