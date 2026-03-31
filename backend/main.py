from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import pickle
import nltk
from dotenv import load_dotenv

# Load .env file
load_dotenv()
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import os
from search_utils import verify_real_news

nltk.download('punkt')
nltk.download('stopwords')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    # Use fallback if env is missing
    MONGODB_URI = "mongodb+srv://dhruvnarula1972_db_user:Dhruvaa%400000@cluster0.qk3maoy.mongodb.net/?appName=Cluster0"

try:
    # Use direct connection settings if needed to bypass intermittent DNS SRV issues
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.admin.command('ping')
    db = client["fake_news_db"]
    collection = db["history"]
    print("✅ Successfully connected to MongoDB Atlas")
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    # Handle the case where the application should still start or fail gracefully
    db = None
    collection = None

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
    # 1. First, check online for real-time verification
    search_result = verify_real_news(news.text, SERPER_API_KEY)
    
    if search_result:
        result = "REAL NEWS"
        probability = 1.0  # 100% confidence if found online
        source_url = search_result.get("source")
        source_name = search_result.get("source_name", "Online Source")
    else:
        # 2. Fallback to ML Model
        processed = preprocess_text(news.text)
        vectorized = vectorizer.transform([processed])
        prediction = model.predict(vectorized)[0]
        probability = model.predict_proba(vectorized)[0].max()
        
        result = "FAKE NEWS" if prediction == 0 else "REAL NEWS"
        source_url = None
        source_name = None

    # Update MongoDB if connected
    if collection is not None:
        try:
            collection.insert_one({
                "text": news.text,
                "result": result,
                "confidence": float(probability * 100),
                "source_url": source_url,
                "source_name": source_name,
                "timestamp": datetime.now()
            })
        except Exception as e:
            print(f"Failed to insert into history: {e}")

    return {
        "result": result,
        "confidence": round(probability * 100, 2),
        "source_url": source_url,
        "source_name": source_name
    }

@app.get("/history")
def get_history():
    if collection is None:
        return []
    records = list(collection.find({}, {"_id": 0}))
    return records[::-1]
