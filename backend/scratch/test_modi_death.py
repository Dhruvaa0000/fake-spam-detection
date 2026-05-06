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

try:
    print("Loading model...")
    model = pickle.load(open("model.pkl", "rb"))
    vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

    test_cases = [
        "PM Modi died in a car accident today",
        "PM Narendra Modi passed away",
        "Modi ji is dead",
        "PM Modi is alive and working"
    ]

    print("\n--- Model Prediction Test (Specific Case) ---")
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
except Exception as e:
    print(f"Error: {e}")
