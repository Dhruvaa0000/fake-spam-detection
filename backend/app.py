from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import re
import uuid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsRequest(BaseModel):
    text: str

history_data = []

# Load model + vectorizer (trained on titles only)
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

def clean_text(text):
    """Must match exactly what was used during training."""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s!?\'\".,]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.post("/predict")
def predict(data: NewsRequest):
    # Clean the input exactly like training data
    cleaned = clean_text(data.text)

    vec = vectorizer.transform([cleaned])
    result = model.predict(vec)[0]

    # Proper probability from LogisticRegression
    proba = model.predict_proba(vec)[0]
    confidence = round(max(proba) * 100, 2)

    output = "FAKE" if result == 1 else "REAL"

    item = {
        "id": str(uuid.uuid4()),
        "newsText": data.text,
        "result": output,
        "confidence": confidence,
        "createdAt": "now"
    }
    history_data.append(item)
    return item

@app.get("/result/{item_id}")
def get_result(item_id: str):
    for item in history_data:
        if item["id"] == item_id:
            return item
    return {"error": "details not found"}

@app.get("/history")
def get_history():
    return history_data

@app.get("/")
def home():
    return {"message": "Backend running successfully 🚀"}