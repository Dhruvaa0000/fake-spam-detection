import pickle
import re

def clean(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s!?\'\".,]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def verify():
    model = pickle.load(open('model.pkl','rb'))
    vec = pickle.load(open('vectorizer.pkl','rb'))
    
    test_cases = [
        {"desc": "Tanker Attack (User Provided)", "text": "Iran-US war news LIVE: Iran attacked a Kuwaiti oil tanker Al-Salmi in an anchorage area of a Dubai port, Kuwait Petroleum Corp said."},
        {"desc": "Trump Strategic Shift", "text": "Trump says he is willing to end Iran campaign even if Strait of Hormuz stays closed: Reports."},
        {"desc": "Israel Military Objectives", "text": "Israel achieving 'beyond the halfway point' in military objectives against Iran, says Netanyahu."},
        {"desc": "Tehran Strikes & US Forces", "text": "Waves of strikes reported in Tehran; US ground-capable forces arrive in the region for flexible operations."}
    ]
    
    print("=== LATEST HT WAR NEWS STABILITY TEST ===")
    for case in test_cases:
        cleaned = clean(case["text"])
        v = vec.transform([cleaned])
        result = model.predict(v)[0]
        proba = model.predict_proba(v)[0]
        confidence = round(max(proba)*100, 1)
        label = "FAKE" if result == 1 else "REAL"
        print(f"[{label} {confidence}%] {case['desc']}: {case['text'][:60]}...")

if __name__ == "__main__":
    verify()
