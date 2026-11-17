import pandas as pd
from pathlib import Path

BASE = Path(__file__).resolve().parent
CSV_PATH = BASE / 'data' / 'vegetable_prices.csv'
BACKUP_PATH = BASE / 'data' / 'vegetable_prices.backup.csv'

def augment():
    if not CSV_PATH.exists():
        print('CSV not found:', CSV_PATH)
        return

    df = pd.read_csv(CSV_PATH)
    # Backup original
    df.to_csv(BACKUP_PATH, index=False)
    print('Backup written to', BACKUP_PATH)

    rows = []
    # For each existing row, create rows for dates 1..28 for same month
    for _, r in df.iterrows():
        for d in range(1, 29):
            newr = r.copy()
            newr['date'] = d
            rows.append(newr)

    newdf = pd.DataFrame(rows)
    # Drop market_arrivals column if present
    if 'market_arrivals' in newdf.columns:
        newdf = newdf.drop(columns=['market_arrivals'])

    # Reorder columns: location,vegetable,date,month,season,rainfall,price
    cols = [c for c in ['location','vegetable','date','month','season','rainfall','price'] if c in newdf.columns]
    newdf = newdf[cols]

    newdf.to_csv(CSV_PATH, index=False)
    print('Augmented CSV written to', CSV_PATH, 'rows:', len(newdf))

if __name__ == '__main__':
    augment()
