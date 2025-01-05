// app/components/PricePrediction.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface PricePredictionProps {
  cryptoSymbol: string;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ cryptoSymbol }) => {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const predictFuturePrices = async () => {
      try {
        const response = await axios.get(`/api/predict?cryptoSymbol=${cryptoSymbol.toUpperCase()}`);
        const forecast = response.data;

        const predictionData = {
          labels: forecast.map((row: any) => new Date(row.ds)),
          datasets: [
            {
              label: 'Predicted Prices',
              data: forecast.map((row: any) => row.yhat),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            },
          ],
        };

        setPredictionData(predictionData);
      } catch (error) {
        setError("Failed to predict future prices");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    predictFuturePrices();
  }, [cryptoSymbol]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Predicted {cryptoSymbol.toUpperCase()} Price Movement</h2>
      <Line data={predictionData} />
    </div>
  );
};

export default PricePrediction;