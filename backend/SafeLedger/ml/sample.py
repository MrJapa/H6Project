from ml_model import evaluate_posting

# Sample posting that is within the normal range.
sample_normal = {
    "accountHandleNumber": 1001,
    "postAmount": 1500,
    "postDescription": "Equus regninger"  # Ignored
}

# Sample posting that is an outlier.
sample_anomaly = {
    "accountHandleNumber": 1001,
    "postAmount": 15159923,
    "postDescription": "Faktura"  # Ignored
}

print("Normal posting evaluation (expected False):", evaluate_posting(sample_normal))
print("Anomalous posting evaluation (expected True):", evaluate_posting(sample_anomaly))
