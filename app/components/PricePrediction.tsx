import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData as ChartJSData,
  ChartOptions as ChartJSOptions,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ForecastRow {
  ds: string;
  yhat: number;
}

interface PredictionData {
  labels: Date[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

interface PricePredictionProps {
  cryptoSymbol: string;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ cryptoSymbol }) => {
  const [predictionData, setPredictionData] = useState<ChartJSData<"line", number[], unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const predictFuturePrices = async () => {
      try {
        const response = await axios.get(`/api/predict?cryptoSymbol=${cryptoSymbol.toUpperCase()}`);
        const forecast: ForecastRow[] = response.data;

        const data: PredictionData = {
          labels: forecast.map((row) => new Date(row.ds)),
          datasets: [
            {
              label: 'Predicted Prices',
              data: forecast.map((row) => row.yhat),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            },
          ],
        };

        setPredictionData(data);
      } catch (err) {
        setError("Failed to predict future prices");
        console.error(err);
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
      {predictionData && <Line data={predictionData} options={{ /* your chart options */ } as ChartJSOptions<"line">} />}
    </div>
  );
};

export default PricePrediction;