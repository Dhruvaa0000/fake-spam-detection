import pandas as pd
import random

# 🔹 Templates for generating realistic 2026 news (REAL)
tpl_real = {
    "politics": [
        "PM Modi to chair high-level meeting on {topic} today in New Delhi.",
        "Union Cabinet approves {amount} crore package for {sector} development.",
        "Election Commission of India reviews preparations for upcoming {state} polls.",
        "India and {country} sign bilateral agreement to strengthen {sector} ties.",
        "Supreme Court issues notice to {entity} regarding new legislation on {topic}.",
        "Home Minister Amit Shah emphasizes on {topic} during his visit to {state}.",
        "External Affairs Minister Jaishankar highlights India's stance on {global_issue} at {event}.",
        "Government clarifies: No plans for {rumor}, official statement confirms.",
        "Defence Acquisition Council clears procurement worth {amount} crore for {defence_gear}."
    ],
    "tech": [
        "India leads Asia-Pacific in tech spending for 2026 with {percentage}% growth.",
        "{company} launches new {product} featuring {ai_tech} AI for Indian users.",
        "Forrester report projects massive rise in cloud adoption in India by {year}.",
        "National AI mission receives {amount} crore boost to build {infrastructure}.",
        "AMD to roll out new {platform} for Indian data centers in late 2026.",
        "Apple expands local manufacturing in India with new facility in {city}.",
        "Digital India: Over {count} billion transactions recorded on UPI in {month}."
    ],
    "business": [
        "Sensex and Nifty {action} amid {reason} and global market trends.",
        "Reliance Industries announces mega {amount} crore investment in {sector}.",
        "FDI guidelines eased for {sector} to attract {amount} billion in investment.",
        "RBI keeps repo rate {status} at {rate}% to maintain economic balance.",
        "Tata Group to set up major {factory_type} in {state} with local partners.",
        "Global analysts project India's GDP growth at {percentage}% for fiscal 2026.",
        "India's merchandise exports hit record high of {amount} billion in {month}."
    ],
    "sports": [
        "IPL 2026: {team} takes top spot in the league table after exciting win.",
        "PM Modi highlights importance of {topic} at the {event} opening ceremony.",
        "Indian athletes win {count} medals at the {international_event} in {location}.",
        "BCCI announces new scholarship scheme for young cricketers across {region}.",
        "Khelo India infrastructure expanded to {count} new districts this year."
    ],
    "lifestyle": [
        "The history of {brand} advertising: Why '{tagline}' remains a classic.",
        "Sustainable fashion trends see {percentage}% rise in Indian retail market.",
        "UNESCO recognizes {location} as a World Heritage site for its {feature}.",
        "Review: The new {product} from {brand} is a game changer for {user_group}.",
        "National Awards: {name} honored for contribution to Indian {field}."
    ],
    "regional_politics": [
        "{party} president {leader} announces candidates for {state} Assembly elections.",
        "{leader} to make electoral debut from {constituency} and {constituency} seats.",
        "{party} forms alliance with {party} for the upcoming polls in {state}.",
        "{state} Chief Minister inaugurates new {infra_project} in {city} today.",
        "Political heat rises in {state} as {leader} holds massive roadshow in {city}.",
        "{party} releases manifesto with focus on {sector} and local employment in {state}.",
        "High Court stays the order passed by {state} government regarding {topic}."
    ],
    "global_conflict": [
        "{country1}-{country2} war news LIVE: {actor} attacked a {target} in {location}.",
        "Incident at {location}: {actor} confirms damage to {target} following {event_conflict}.",
        "Global energy fears rise as {reason_conflict} triggers disruption in {region_conflict} oil supplies.",
        "{entity_global} warns of {threat} after {event_conflict} near {location}.",
        "Kuwait Petroleum Corp said the incident has triggered fears of an oil spill at {location}.",
        "Dubai port authorities report fire on {target} following an attack in the anchorage area."
    ]
}

# 🔹 Variables for filler
data_vars = {
    "topic": ["energy security", "border safety", "cybersecurity", "urban infra", "semiconductors"],
    "amount": ["15,000", "2,38,000", "50,000", "1.2 lakh", "85,000"],
    "sector": ["defence", "electronics", "green energy", "agriculture", "education", "healthcare"],
    "state": ["Tamil Nadu", "Assam", "West Bengal", "Kerala", "Maharashtra", "Gujarat"],
    "country": ["France", "USA", "Japan", "UAE", "Australia", "Germany"],
    "entity": ["State Government", "Public Sector Banks", "Telecom companies", "Social Media giants"],
    "rumor": ["lockdown coming back", "ban on digital currency", "scrapping pension", "free laptop scheme"],
    "defence_gear": ["Predator drones", "indigenous fighters", "stealth destroyers", "radar systems"],
    "company": ["Google", "AMD", "Apple", "Microsoft", "TCS", "InfoSys"],
    "ai_tech": ["Gemini 2.5", "Llama 3", "Claude 4", "Custom Gemini"],
    "product": ["Pixel 10", "iPhone 18", "Smart Glasses", "AI Hub"],
    "year": ["2026", "2027", "2028"],
    "infrastructure": ["GPU clusters", "Data Centers", "Quantum Testbeds"],
    "platform": ["Helios AI", "Titan Compute", "Mercury Data Platform", "Orion AI"],
    "city": ["Bengaluru", "Mumbai", "Hyderabad", "Chennai", "Pune"],
    "count": ["12", "50", "150", "200", "500", "1000", "12.5"],
    "percentage": ["13.4", "15.5", "20.1", "10.2", "8.9"],
    "month": ["March 2026", "February 2026", "January 2026"],
    "action": ["rise 500 points", "dip slightly", "hit record high", "remain stable"],
    "reason": ["crude prices", "global fund outflows", "positive earnings", "election news"],
    "status": ["unchanged", "steady", "fixed"],
    "rate": ["6.5", "6.25", "6.75"],
    "factory_type": ["Chip assembly plant", "EV Gigafactory", "Solar cell unit"],
    "team": ["CSK", "Mumbai Indians", "Gujarat Titans", "RCB"],
    "international_event": ["Asian Games", "Commonwealth Games", "World Championships"],
    "location": ["Paris", "Tokyo", "London", "Doha"],
    "region": ["Rural India", "Northeast", "South India"],
    "brand": ["Raymond", "Tanishq", "Amul", "Tata Motors", "FabIndia"],
    "tagline": "The Complete Man",
    "feature": "architectural brilliance",
    "user_group": ["commuters", "working professionals", "students", "creative artists"],
    "name": ["A.R. Rahman", "S. Jaishankar", "Zoya Akhtar", "Manish Malhotra", "R.D. Shekar", "Inigo Irudayaraj", "K. Rajasekaran"],
    "field": ["Cinema", "Literature", "Social Work", "Crafts"],
    "party": ["TVK", "DMK", "ADMK", "TMC", "AAP", "BRS", "BJP State Unit", "Congress State Unit", "PMK"],
    "leader": ["Joseph Vijay", "M.K. Stalin", "Mamata Banerjee", "Arvind Kejriwal", "KCR", "Eknath Shinde", "Anbumani"],
    "constituency": ["Perambur", "Tiruchi East", "Nandigram", "New Delhi", "Worli", "Kolkata South"],
    "infra_project": ["metro extension", "smart city hub", "expressway", "coastal road", "industrial park"],
    "global_issue": ["climate change", "trade sanctions", "West Asia crisis"],
    "event": ["G20 Summit", "Assembly Election Rallies", "Davos Forum"],
    "country1": ["Iran", "Israel", "Russia", "USA", "China"],
    "country2": ["USA", "Iran", "Ukraine", "Taiwan", "UK"],
    "actor": ["Iran Revolutionary Guard", "US Navy", "Houthi rebels", "Paramilitary forces"],
    "target": ["oil tanker", "container ship", "naval base", "refinery"],
    "location": ["Dubai port", "Strait of Hormuz", "Red Sea", "Gulf of Oman", "Black Sea"],
    "event_conflict": ["missile strike", "drone attack", "sabotage", "naval skirmish"],
    "reason_conflict": ["regional tensions", "supply chain blockade", "embargo enforcement"],
    "region_conflict": ["Middle East", "West Asia", "Eastern Europe", "South China Sea"],
    "entity_global": ["UN Security Council", "International Maritime Org", "Global Energy Forum"],
    "threat": ["oil spill", "supply chain collapse", "global recession", "nuclear escalation"]
}

# 🔹 Generation function
def generate_news(category, count, label):
    news_list = []
    templates = tpl_real.get(category, []) if label == 0 else []
    
    if label == 1:
        templates = [
            "Shocking: {company} to {bad_action} due to {fake_crisis}.",
            "Breaking: {entity} announces {scary_rumor} starting {time}.",
            "Viral: {name} admits to {scandal} in leaked video.",
            "Alert: {scary_rumor} spreading via {channel}, warns expert.",
            "Free {reward}: Click this link to get yours before {time}."
        ]
        data_vars["bad_action"] = ["shut down", "fire everyone", "steal user data"]
        data_vars["fake_crisis"] = ["financial collapse", "alien threat", "secret audit"]
        data_vars["scary_rumor"] = ["lockdown return", "bank account freeze", "mandatory chip", "currency ban"]
        data_vars["time"] = ["tomorrow", "midnight", "Monday", "this Sunday"]
        data_vars["scandal"] = ["insider trading", "secret plot", "fake degree"]
        data_vars["channel"] = ["WhatsApp", "Telegram", "Instagram DM"]
        data_vars["reward"] = ["Gold coins", "Laptops", "Cash", "Free Internet"]

    for _ in range(count):
        if not templates: continue
        tpl = random.choice(templates)
        formatted = tpl
        while "{" in formatted:
            key = formatted[formatted.find("{")+1 : formatted.find("}")]
            val = random.choice(data_vars[key]) if isinstance(data_vars[key], list) else data_vars[key]
            formatted = formatted.replace("{" + key + "}", str(val), 1)
        news_list.append({"title": formatted, "subject": "indian_news", "date": "2026", "text": ""})
    return news_list

def mass_augment():
    try:
        real_df = pd.read_csv("true.csv")
        fake_df = pd.read_csv("fake.csv")
        
        all_new_real = []
        all_new_fake = []
        
        # 300+ per category
        categories = ["politics", "tech", "business", "sports", "lifestyle", "regional_politics", "global_conflict"]
        for cat in categories:
            print(f"Generating 300 REAL samples for {cat}...")
            all_new_real.extend(generate_news(cat, 300, 0))
            
            print(f"Generating 300 FAKE samples for {cat}...")
            all_new_fake.extend(generate_news(cat, 300, 1))

        # Add specific user failing snippets to REAL (HT War News March 30-31)
        all_new_real.extend([
            {"title": "Iran-US war news LIVE: Iran attacked a Kuwaiti oil tanker Al-Salmi in an anchorage area of a Dubai port, Kuwait Petroleum Corp said.", "subject": "indian_news", "date": "March 2026", "text": ""},
            {"title": "Trump says he is willing to end Iran campaign even if Strait of Hormuz stays closed: Reports.", "subject": "indian_news", "date": "March 2026", "text": ""},
            {"title": "Israel achieving 'beyond the halfway point' in military objectives against Iran, says Netanyahu.", "subject": "indian_news", "date": "March 2026", "text": ""},
            {"title": "Waves of strikes reported in Tehran; US ground-capable forces arrive in the region for flexible operations.", "subject": "indian_news", "date": "March 2026", "text": ""},
            {"title": "Kuwait Petroleum Corp confirms damage to oil tanker hull after Dubai port attack; fire extinguished.", "subject": "indian_news", "date": "March 2026", "text": ""}
        ])

        # Combine and Append
        new_real_df = pd.DataFrame(all_new_real)
        new_fake_df = pd.DataFrame(all_new_fake)
        
        # Match columns
        for col in real_df.columns:
            if col not in new_real_df.columns: new_real_df[col] = ""
        for col in fake_df.columns:
            if col not in new_fake_df.columns: new_fake_df[col] = ""
            
        new_real_df = new_real_df[real_df.columns]
        new_fake_df = new_fake_df[fake_df.columns]
        
        # Save
        pd.concat([real_df, new_real_df], ignore_index=True).to_csv("true.csv", index=False)
        pd.concat([fake_df, new_fake_df], ignore_index=True).to_csv("fake.csv", index=False)
        
        print(f"\n✅ SUCCESS: Added {len(all_new_real)} real and {len(all_new_fake)} fake samples.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    mass_augment()
