# app/components/predict.py
import sys
import json
import requests
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta

def predict_future_prices(crypto_symbol):
    try:
        # Fetch historical prices
        url = f"https://min-api.cryptocompare.com/data/v2/histoday?fsym={crypto_symbol}&tsym=USD&limit=2000&aggregate=30"
        response = requests.get(url)
        data = response.json()
        historical_prices = {day['time']: day['close'] for day in data['Data']['Data']}

        # Convert historical prices to DataFrame
        df = pd.DataFrame(list(historical_prices.items()), columns=['time', 'close'])
        df['time'] = pd.to_datetime(df['time'], unit='s')
        df.set_index('time', inplace=True)

        # Prepare data for Prophet
        df.reset_index(inplace=True)
        df.rename(columns={'time': 'ds', 'close': 'y'}, inplace=True)

        # Train Prophet model
        model = Prophet()
        model.add_seasonality(name='4-year', period=4*365.25, fourier_order=3)
        model.fit(df)

        # Predict future prices for 5 years (1825 days)
        future = model.make_future_dataframe(periods=1825, freq='D')
        forecast = model.predict(future)

        # Filter out past predictions to start from the day after the last historical data
        last_date = df['ds'].max()
        forecast = forecast[forecast['ds'] > last_date]

        # Return the prediction results as JSON
        return forecast[['ds', 'yhat']].to_json(orient='records')
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No cryptocurrency symbol provided"}))
    else:
        crypto_symbol = sys.argv[1]
        print(predict_future_prices(crypto_symbol))