import pickle
import math

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

text = "PM modi died in aircrash"
vectorized = vectorizer.transform([text])
prediction = model.predict(vectorized)[0]

decision = model.decision_function(vectorized)[0]
probability = 1 / (1 + math.exp(-abs(decision)))

result = "FAKE NEWS" if prediction == 1 else "REAL NEWS"
print(f"[{result}] Decision={decision}, Prob={probability}")
