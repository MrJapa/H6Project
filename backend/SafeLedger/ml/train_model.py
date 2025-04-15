import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle

# Load the CSV data using a semicolon as the delimiter and latin1 as the encoding (UTF-8 does not work)
data = pd.read_csv('backend\\SafeLedger\\ml\\posting.csv', sep=';', encoding='latin1')

print("Raw Data:")
print(data)

# Convert 'postDate' to datetime format.
data['postDate'] = pd.to_datetime(data['postDate'], format='%d-%m-%Y', errors='coerce')


num_features = data[['accountHandleNumber', 'postAmount']]

# Scale the numeric features.
scaler = StandardScaler()
num_scaled = scaler.fit_transform(num_features)

# Train Isolation Forest with contamination parameter.
iso_forest = IsolationForest(contamination=0.05, random_state=42)
iso_forest.fit(num_scaled)

# Calculate the anomaly score and predictions.
data['anomaly_score'] = iso_forest.decision_function(num_scaled)
data['is_suspicious'] = iso_forest.predict(num_scaled) == -1

print("\nResults:")
print(data[['id', 'accountHandleNumber', 'postAmount', 'anomaly_score', 'is_suspicious']])

# Save the scaler and model artifacts.
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
with open('isolation_forest.pkl', 'wb') as f:
    pickle.dump(iso_forest, f)

print("\nTraining complete and model artifacts saved.")
