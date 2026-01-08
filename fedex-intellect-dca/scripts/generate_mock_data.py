import pandas as pd
import numpy as np
import random

def generate_fedex_data(n=1000):
    """
    Generates a synthetic FedEx debt dataset.
    Includes: Amount, Age, Previous DCA history, and Debtor Sentiment.
    """
    data = {
        'case_id': [f"FEDEX-{1000 + i}" for i in range(n)],
        'amount': np.random.uniform(500, 50000, n).round(2),
        'age_days': np.random.randint(15, 365, n),
        'dca_success_rate': np.random.uniform(0.1, 0.9, n).round(2),
        'last_update_hours': np.random.randint(0, 100, n) # For SLA testing
    }
    
    df = pd.DataFrame(data)
    df.to_csv('fedex-intellect-dca/data/mock_debtors.csv', index=False)
    print(f"✅ Successfully generated {n} mock cases in /data/mock_debtors.csv")

if __name__ == "__main__":
    generate_fedex_data()