import pandas as pd
import pickle
import re
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s!?\'\".,]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

print("Loading data...")
fake = pd.read_csv("fake.csv")
real = pd.read_csv("true.csv")

fake["label"] = 1
real["label"] = 0

if 'subject' in real.columns and 'subject' in fake.columns:
    us_subjects = ['politicsNews', 'worldnews', 'politics', 'left-news', 'US_News']
    
    real_us = real[real['subject'].isin(us_subjects)]
    fake_us = fake[fake['subject'].isin(us_subjects)]
    
    real_other = real[~real['subject'].isin(us_subjects)]
    fake_other = fake[~fake['subject'].isin(us_subjects)]
    
    # Prune US noise significantly to stop it from drowning out Indian entities
    real_us = real_us.sample(frac=0.05, random_state=42)
    fake_us = fake_us.sample(frac=0.05, random_state=42)
    
    real = pd.concat([real_other, real_us], ignore_index=True)
    fake = pd.concat([fake_other, fake_us], ignore_index=True)

    # Indian news is already augmented in CSVs, so minimal oversampling needed
    indian_real = real[real['subject'] == 'indian_news']
    indian_fake = fake[fake['subject'] == 'indian_news']
    
    print(f"Oversampling Indian News: {len(indian_real)} real, {len(indian_fake)} fake")
    real = pd.concat([real, indian_real], ignore_index=True) # Just double it
    fake = pd.concat([fake, indian_fake], ignore_index=True)

fake = fake[["title", "label"]].dropna(subset=["title"])
real = real[["title", "label"]].dropna(subset=["title"])

min_len = min(len(fake), len(real))
fake = fake.sample(min_len, random_state=42)
real = real.sample(min_len, random_state=42)

data = pd.concat([fake, real]).sample(frac=1, random_state=42).reset_index(drop=True)
data["title"] = data["title"].apply(clean_text)
data = data[data["title"].str.len() > 5]

print(f"Final Dataset: {len(data)} titles")

X = data["title"]
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42, stratify=y  # Using 10% for test to maximize training data
)

vectorizer = TfidfVectorizer(
    max_features=50000,      # Increased to catch more 2026-specific keywords
    ngram_range=(1, 3),      # 1-3 grams for better phrase detection
    analyzer="word",
    min_df=2,                # Ignore extremely rare typos
    max_df=0.8,              # Ignore extremely common words
    sublinear_tf=True        # Helps with long lists of keywords
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = PassiveAggressiveClassifier(
    max_iter=1000,
    random_state=42,
    C=0.5,                   # Controlled regularization to avoid overfitting to typos
    loss='hinge',
    early_stopping=True,
    validation_fraction=0.1
)
model.fit(X_train_vec, y_train)

y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {acc:.4f}")
print("\nPer-class report:")
print(classification_report(y_test, y_pred, target_names=["REAL", "FAKE"]))

pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print(f"PAC Model successfully trained and saved with {acc*100:.2f}% accuracy!")