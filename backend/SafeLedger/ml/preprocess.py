import pandas as pd

import os

current_dir = os.path.dirname(os.path.abspath(__file__))

posting_path = os.path.join(current_dir, 'posting.csv')

data = pd.read_csv(posting_path, sep=';', encoding='utf-8')

data['postDescription'] = data['postDescription'].fillna('')

data['postDate'] = pd.to_datetime(data['postDate'])
print(data.head())
