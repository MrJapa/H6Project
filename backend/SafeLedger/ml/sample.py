from ml_model import evaluate_posting

samples = [

    {
        "company_id": 16,
        "accountHandleNumber": 1001,
        "postAmount": -50000,
        "postCurrency": "DKK",
        "postDate": "2022-01-01",
        "postDescription": "Equus regninger (normal)"
    },
    {
        "company_id": 16,
        "accountHandleNumber": 1001,
        "postAmount": -5000000,
        "postCurrency": "DKK",
        "postDate": "2022-01-01",
        "postDescription": "Equus regninger (anomaly)"
    },

    {
        "company_id": 7,
        "accountHandleNumber": 1001,
        "postAmount": -3000000,
        "postCurrency": "DKK",
        "postDate": "2022-01-01",
        "postDescription": "Faktura (normal)"
    },
    {
        "company_id": 7,
        "accountHandleNumber": 1001,
        "postAmount": -100000,
        "postCurrency": "DKK",
        "postDate": "2022-01-01",
        "postDescription": "Faktura (anomaly)"
    },
]

if __name__ == "__main__":
    for p in samples:
        try:
            is_anom = evaluate_posting(p)
            status = "SUSPICIOUS" if is_anom else "normal"
            print(f"Company {p['company_id']}: {p['postDescription']} -> {status}")
        except Exception as e:
            print(f"Error evaluating posting for company {p['company_id']}: {e}")
