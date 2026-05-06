from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import pickle
import nltk
from dotenv import load_dotenv

load_dotenv()
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import os
import math
from search_utils import verify_real_news

nltk.download('punkt')
nltk.download('stopwords')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    MONGODB_URI = "mongodb://localhost:27017/"

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    db = client["fake_news_db"]
    collection = db["history"]
    print("Successfully connected to MongoDB Atlas")
except Exception as e:
    print(f"MongoDB Connection Error: {e}")
    db = None
    collection = None

local_history = []

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

SERPER_API_KEY = os.getenv("SERPER_API_KEY", "your_serper_api_key_here")

class NewsRequest(BaseModel):
    text: str

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    tokens = [word for word in tokens if word not in string.punctuation]
    return " ".join(tokens)

@app.post("/predict")
def predict_news(news: NewsRequest):
    search_result = verify_real_news(news.text, SERPER_API_KEY)
    
    source_url = None
    source_name = None
    
    if search_result and search_result.get("verdict") != "UNKNOWN":
        verdict = search_result.get("verdict", "REAL")
        if verdict == "FAKE":
            result = "FAKE NEWS"
            probability = 1.0 
        else:
            result = "REAL NEWS"
            probability = 1.0 
            
        source_url = search_result.get("source")
        source_name = search_result.get("source_name", "Online Source")
    else:
        processed = preprocess_text(news.text)
        vectorized = vectorizer.transform([processed])
        prediction = model.predict(vectorized)[0]
        
        try:
            decision = model.decision_function(vectorized)[0]
            probability = 1 / (1 + math.exp(-abs(decision)))
        except (Exception, OverflowError):
            probability = 0.85 
        
        result = "FAKE NEWS" if prediction == 1 else "REAL NEWS" 
        
        source_url = search_result.get("source") if search_result else None
        source_name = search_result.get("source_name", "AI Fallback Source") if search_result else None

    new_record = {
        "text": news.text,
        "result": result,
        "confidence": float(probability * 100),
        "source_url": source_url,
        "source_name": source_name,
        "snippet": search_result.get("snippet") if search_result else None,
        "timestamp": datetime.now()
    }
    
    if collection is not None:
        try:
            collection.insert_one(new_record)
        except Exception as e:
            print(f"Failed to insert into history: {e}")
    else:
        local_history.append(new_record)

    return {
        "result": result,
        "confidence": round(probability * 100, 2),
        "source_url": source_url,
        "source_name": source_name,
        "snippet": search_result.get("snippet") if search_result else None
    }

@app.get("/history")
def get_history():
    if collection is None:
        return local_history[::-1]
    records = list(collection.find({}, {"_id": 0}))
    return records[::-1]
