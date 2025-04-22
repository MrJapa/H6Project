# ml_model.py
import pickle, os
import numpy as np

# Load the dicts of scalers & models
base = os.path.dirname(__file__)
with open(os.path.join(base, 'models/scalers.pkl'), 'rb') as f:
    scalers = pickle.load(f)
with open(os.path.join(base, 'models/iso_forests.pkl'), 'rb') as f:
    iso_forests = pickle.load(f)

def evaluate_posting(posting_data):
    """
    posting_data must include 'company_id', 'accountHandleNumber', 'postAmount'.
    Returns True if anomalous, False otherwise.
    """
    cid = posting_data['company_id']
    if cid not in scalers:
        # Fallback: no model for this company
        raise ValueError(f"No anomaly model for company {cid}")

    scaler = scalers[cid]
    iso    = iso_forests[cid]

    features = np.array([[posting_data['accountHandleNumber'],
                          posting_data['postAmount']]])
    Xs = scaler.transform(features)
    pred = iso.predict(Xs)
    return pred[0] == -1
