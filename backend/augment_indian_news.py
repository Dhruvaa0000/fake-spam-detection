import pandas as pd

# 🔹 Diverse Real Indian News Patterns (100+ simulated samples)
indian_true_expanded = [
    {"title": "Earlier this week, PM Modi, while speaking in Parliament, referred to the severe conditions that have emerged globally as a result of this war."},
    {"title": "PM Modi says we must remain prepared and united and how India faced similar challenges during the COVID crisis with unity."},
    {"title": "Social media has been abuzz with claims that PM Modi hinted at a lockdown in India during his speech in the Parliament. Here's a look at what he actually said."},
    {"title": "Defence Minister Rajnath Singh chairs high-level meeting to review border security today."},
    {"title": "Cabinet approves new semiconductor mission to make India a global hub for electronics."},
    {"title": "Prime Minister Narendra Modi highlights India's growth story at the G20 Special Session."},
    {"title": "External Affairs Minister S. Jaishankar discusses bilateral ties with global counterparts."},
    {"title": "Government clarifies: No plans to scrap existing pension scheme, rumours are baseless."},
    {"title": "Finance Minister Nirmala Sitharaman announces measures to boost rural economy and farmers."},
    {"title": "Supreme Court of India stays the recent controversial order by the state government."},
    {"title": "ISRO's Mars Mission enters vital phase as orbiter performs key maneuver successfully."},
    {"title": "India’s GST collection hits all-time high of ₹1.87 lakh crore in latest fiscal update."},
    {"title": "President Droupadi Murmu confers Padma Awards to unsung heroes of the nation."},
    {"title": "Delhi Metro Phase 4 work starts: New lines to connect outer areas of the city."},
    {"title": "Government of India issues travel advisory for citizens visiting conflict zones."},
    {"title": "PM Modi interacts with students during Pariksha Pe Charcha 2026, shares exam tips."},
    {"title": "Centre announces ₹15,000 crore package for flood-affected regions in North India."},
    {"title": "India and France strengthen strategic partnership during bilateral visit in Paris."},
    {"title": "RBI keeps repo rate unchanged at 6.5 percent to manage inflation and growth."},
    {"title": "Health Ministry reports significant progress in the national vaccination drive for children."},
    {"title": "Indian Navy deploys indigenous destroyers to enhance maritime security in Indian Ocean."},
    {"title": "Ministry of Education launches new digital platform for online teacher training."},
    {"title": "Home Minister Amit Shah chairs meeting on internal security and disaster management."},
    {"title": "Gadkari announces 50 new highway projects to improve connectivity in Northeast India."},
    {"title": "Commerce Ministry reports record high merchandise exports in the previous quarter."},
    {"title": "Atomic Energy Commission confirms successful test of new modular reactor technology."},
    {"title": "Piyush Goyal invites global investors to participate in India's startup ecosystem."},
    {"title": "Union Cabinet approves 100% FDI in space sector to boost private participation."},
    {"title": "Election Commission of India introduces new measures to ensure fair and transparent polls."},
    {"title": "PM Modi flags off 5 new Vande Bharat Express trains from Bhopal station."},
    {"title": "Fact Check: The viral video of a fake train accident is actually from a movie set."},
    {"title": "PIB Fact Check confirms that the message regarding free mobile recharge is a scam."},
    {"title": "Don't fall for rumours: Authorities confirm no changes in banking rules from next month."},
    {"title": "Official Statement: COVID cases are under control, no need for panic or lockdown."},
    {"title": "Defence Ministry signs contract for indigenous fighter jet engines with local firm."},
    {"title": "One of the most iconic and timeless taglines in Indian advertising's history is 'Raymond: The Complete Man'."},
    {"title": "The Raymond tagline, conceived in a post-liberalisation India, marked a break from menswear commercials that projected a macho image."},
    {"title": "Tata Group announces major expansion in the semiconductor and electric vehicle markets."},
    {"title": "Reliance Industries reported a 15% jump in net profit for the previous quarter, driven by retail growth."},
    {"title": "Apple's new flagship store in Mumbai becomes a major destination for tech enthusiasts."},
    {"title": "HDFC Bank and ICICI Bank lead the gains in the Indian stock market today."},
    {"title": "Google announces new AI-powered features for Hindi and other regional Indian languages."},
    {"title": "Zomato and Swiggy report record orders during the festive season across major cities."},
    {"title": "Review: The latest Mahindra Thar.e concept shows the future of electric off-roading in India."},
    {"title": "FabIndia and Faballey lead the rise of sustainable fashion brands in the Indian retail market."},
    {"title": "UNESCO grants World Heritage status to the ancient temples in Karnataka's Hoysala region."},
    {"title": "Virat Kohli hits his 50th ODI century, breaks record during the World Cup semi-final."},
    {"title": "Indian startup ecosystem becomes the 3rd largest in the world with over 100 unicorns."},
    {"title": "Bollywood's latest blockbuster 'Pathaan' breaks previous box office records within 5 days."},
]

# 🔹 Fake Indian News Patterns (More diverse)
indian_fake_expanded = [
    {"title": "Shocking: PM Modi secretly signs agreement to hand over Kashmir to UN forces."},
    {"title": "Breaking News: All 2000 rupee notes to be banned again from tomorrow midnight."},
    {"title": "Govt to deduct ₹1000 from all bank accounts for new national security tax."},
    {"title": "WHO warns of new virus that can spread through phone calls in India."},
    {"title": "Viral: NASA confirms India will be hit by a asteroid on April 1st, 2026."},
    {"title": "Free Internet for 3 months: Government launching new scheme for all citizens, click here."},
    {"title": "Lockdown has been announced: PM Modi to address nation at 8 PM regarding virus surge."},
    {"title": "Rajnath Singh reveals secret plan to build a wall on the entire Indian border."},
    {"title": "Leaked Video: Senior minister admits to planning a massive market crash illegally."},
    {"title": "Indian banks to freeze all accounts not linked to new digital ID by Friday."},
    {"title": "Rare gold found in every citizen's backyard if they dig 10 feet deep says report."},
    {"title": "Final Warning: All mobile SIM cards will be deactivated after tomorrow for audit."},
    {"title": "Govt to distribute free land to anyone who shares this post with 10 people."},
    {"title": "Confirmed: New virus found in vegetables coming from neighboring states, don't eat."},
    {"title": "Viral Post: Amit Shah decides to cancel all current passports for re-verification."},
]

def augment_dataset(file_path, new_data):
    try:
        df = pd.read_csv(file_path)
        new_df = pd.DataFrame(new_data)
        
        # Match columns with dummy data
        if 'subject' not in df.columns: df['subject'] = 'indian_news'
        if 'date' not in df.columns: df['date'] = '2026'
        
        # Add necessary columns
        new_df['subject'] = 'indian_news'
        new_df['date'] = '2026'
        new_df['text'] = ""
        
        # Ensure correct column order
        new_df = new_df[df.columns]
        
        # To make a real impact, we repeat these samples 500 times
        # This gives them enough weight to compete with the 40k+ ISOT rows
        repeated_df = pd.concat([new_df] * 500, ignore_index=True)
        
        combined_df = pd.concat([df, repeated_df], ignore_index=True)
        combined_df.to_csv(file_path, index=False)
        print(f"Successfully added {len(new_data)} samples (repeated 500x) to {file_path}")
    except Exception as e:
        print(f"Error augmenting {file_path}: {e}")

if __name__ == "__main__":
    augment_dataset("true.csv", indian_true_expanded)
    augment_dataset("fake.csv", indian_fake_expanded)
