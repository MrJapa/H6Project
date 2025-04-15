import pickle
import numpy as np
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

scaler_path = os.path.join(current_dir, 'scaler.pkl')
model_path = os.path.join(current_dir, 'isolation_forest.pkl')

# Load the scaler and model
with open(scaler_path, 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

with open(model_path, 'rb') as model_file:
    iso_forest = pickle.load(model_file)

def evaluate_posting(posting_data):

    # 2D array from the numeric features.
    features = np.array([[posting_data['accountHandleNumber'], posting_data['postAmount']]])
    
    # Scale the features using the pre-loaded scaler.
    scaled_features = scaler.transform(features)
    
    # Get the prediction from the Isolation Forest model.
    # The model returns -1 if the instance is considered an outlier.
    prediction = iso_forest.predict(scaled_features)
    
    # Return True if predicted as an anomaly, False otherwise.
    return prediction[0] == -1
