# train_model.py
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle
import os

data = pd.read_csv('backend/SafeLedger/ml/posting.csv', sep=';', encoding='latin1')
data['postDate'] = pd.to_datetime(data['postDate'], format='%d-%m-%Y', errors='coerce')

scalers = {}
models  = {}

for cid, group in data.groupby('company_id'):
    X = group[['accountHandleNumber', 'postAmount']]
    scaler = StandardScaler().fit(X)
    Xs = scaler.transform(X)

    iso = IsolationForest(contamination=0.05, random_state=42).fit(Xs)

    scalers[cid] = scaler
    models[cid]  = iso

# Save the two dicts
os.makedirs('models', exist_ok=True)
with open('backend/SafeLedger/ml/models/scalers.pkl', 'wb') as f:
    pickle.dump(scalers, f)
with open('backend/SafeLedger/ml/models/iso_forests.pkl', 'wb') as f:
    pickle.dump(models, f)

print("Trained and saved per-company models.")
