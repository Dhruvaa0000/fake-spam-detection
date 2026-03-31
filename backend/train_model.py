import pandas as pd
import pickle
import re
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# ─────────────────────────────────────────────
# Clean text — keep punctuation chars like ! ? for style detection
# ─────────────────────────────────────────────
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s!?\'\".,]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ─────────────────────────────────────────────
# Load and Augment data
# ─────────────────────────────────────────────
print("📂 Loading data...")
fake = pd.read_csv("fake.csv")
real = pd.read_csv("true.csv")

fake["label"] = 1
real["label"] = 0

# Oversample Indian News to give it much higher priority
# Since we now have 1500+ fresh samples, 20x is enough to be visible
indian_real = real[real['subject'] == 'indian_news']
indian_fake = fake[fake['subject'] == 'indian_news']

print(f"Oversampling Indian News: {len(indian_real)} real, {len(indian_fake)} fake")

# Repeat Indian news 20 times (balanced against 40k base)
real = pd.concat([real] + [indian_real] * 20, ignore_index=True)
fake = pd.concat([fake] + [indian_fake] * 20, ignore_index=True)

# ─────────────────────────────────────────────
# TITLE ONLY — This is the key fix.
# ─────────────────────────────────────────────
fake = fake[["title", "label"]].dropna(subset=["title"])
real = real[["title", "label"]].dropna(subset=["title"])

# Balance dataset
min_len = min(len(fake), len(real))
fake = fake.sample(min_len, random_state=42)
real = real.sample(min_len, random_state=42)

data = pd.concat([fake, real]).sample(frac=1, random_state=42).reset_index(drop=True)

# Clean
data["title"] = data["title"].apply(clean_text)
data = data[data["title"].str.len() > 5]

print(f"✅ Dataset: {len(data)} titles ({len(data[data['label']==1])} fake, {len(data[data['label']==0])} real)")

X = data["title"]
y = data["label"]

# ─────────────────────────────────────────────
# Split
# ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ─────────────────────────────────────────────
# TF-IDF — high vocab, bigrams, without sublinear_tf
# so the model doesn't overfit to frequency patterns
# ─────────────────────────────────────────────
vectorizer = TfidfVectorizer(
    max_features=30000,
    ngram_range=(1, 3),     # 1-3 grams for better phrase detection
    analyzer="word",
    min_df=1,
    max_df=0.9,
    sublinear_tf=False      # Don't use log scaling — keep raw signal
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ─────────────────────────────────────────────
# LogisticRegression with C=1 (balanced regularization)
# — Generalizes much better than PAC for headlines
# ─────────────────────────────────────────────
model = LogisticRegression(
    C=1.0,
    max_iter=2000,
    solver="lbfgs",
    class_weight="balanced"  # Ensures REAL and FAKE treated equally
)
model.fit(X_train_vec, y_train)

# ─────────────────────────────────────────────
# Evaluation
# ─────────────────────────────────────────────
y_pred = model.predict(X_test_vec)
print(f"\n📊 Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\n📋 Per-class report:")
print(classification_report(y_test, y_pred, target_names=["REAL", "FAKE"]))

# ─────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("🔥 Title-only model saved! Now use just headlines to detect fake news.")