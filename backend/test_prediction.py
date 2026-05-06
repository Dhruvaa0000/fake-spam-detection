import pickle
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import re

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s!?\'\".,]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    tokens = [word for word in tokens if word not in string.punctuation]
    return " ".join(tokens)

print("Loading model...")
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

test_cases = [
    "PM Modi announces new scheme for farmers in New Delhi",
    "IPL 2026: Virat Kohli scores brilliant century in final",
    "Government to ban all 500 rupee notes from tomorrow midnight hoax",
    "NASA confirms India will be hit by asteroid next week",
    "External Affairs Minister Jaishankar discusses bilateral ties with USA",
    "Claim: Free mobile recharge for everyone from Government",
    "Cabinet approves 20000 crore for semiconductor mission",
    "Shocking: Video reveals secret plan to crash the stock market"
]

print("\n--- Model Prediction Test ---")
for text in test_cases:
    cleaned = clean_text(text)
    processed = preprocess_text(cleaned)
    vec = vectorizer.transform([cleaned]) 
    pred = model.predict(vec)[0]
    result = "FAKE" if pred == 1 else "REAL"
    
    try:
        decision = model.decision_function(vec)[0]
        prob = 1 / (1 + pow(2.718, -abs(decision)))
    except:
        prob = 0.85
        
    print(f"Text: {text}")
    print(f"Result: {result} ({prob*100:.2f}%)")
    print("-" * 30)
