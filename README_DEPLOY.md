# 🚀 AI Detector Deployment & Search Setup

Aapka project ab **Online Search** aur **Auto-Training** ke liye ready hai. Neeche diye gaye steps follow karein isse deploy karne ke liye:

## 1. Serper.dev API Key (For Live Search)
System live internet pe news verify karne ke liye **Serper.dev** use karta hai.
1. [Serper.dev](https://serper.dev/) par jayein aur account banayein.
2. Login karke **API Key** copy karein.
3. Is key ko apne `.env` file mein ya deployment platform (Render) par `SERPER_API_KEY` naam se save karein.

## 2. Backend Deployment (Render / Railway)
Backend ko deploy karne ke liye:
1. GitHub pe apna code push karein.
2. [Render](https://render.com/) par naya "Web Service" banayein.
3. **Environment Variables** add karein:
   - `SERPER_API_KEY`: (Aapki Serper key)
   - `MONGODB_URI`: (Aapka MongoDB connection string, jo `main.py` mein hai)
4. Render automatically `Dockerfile` detect kar lega aur deploy kar dega.

## 3. Frontend Deployment (Vercel)
1. `frontend/script.js` ki pehli line (`BASE_URL`) ko apne Render backend URL se update karein.
2. [Vercel](https://vercel.com/) par project connect karein.
3. Wo automatically `vercel.json` use karke deploy kar dega.

## 4. Auto-Training (Self-Improvement)
Model ko latest news se train karne ke liye `cron_update.py` script banayi gayi hai.
- **Local run:** `python backend/cron_update.py`
- **Automation:** Isse aap Render ke "Cron Job" feature ya GitHub Actions ke zariye roz ek baar run kar sakte hain. Ye automatically:
  1. Google News se naye Indian headlines nikalega.
  2. Unhe `true.csv` mein add karega.
  3. Model ko retrain karke naya `model.pkl` aur `vectorizer.pkl` generate karega.

Ab aapka AI Detector pehle se kahin zyada smart aur real-time ho gaya hai!
