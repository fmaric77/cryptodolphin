import { useState, useEffect } from "react";
import axios from "axios";
import { ChartDataset } from "chart.js";

export function useCryptoChart(id: string, range: string, showPrediction: boolean) {
  const [chartData, setChartData] = useState<{
    labels: (string | Date)[];
    datasets: (ChartDataset<"line", number[]> | ChartDataset<"bar", number[]>)[];
  } | null>(null);
  const [predictionData, setPredictionData] = useState<{ labels: Date[]; data: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/crypto/${id}?range=${range}`);
        const { prices, volumes } = response.data;

        const borderColors: string[] = prices.map(() => getMarketColor());

        setChartData({
          labels: prices.map((item: { x: string | Date }) => item.x),
          datasets: [
            {
              type: "line",
              label: `${id.toUpperCase()} Price`,
              data: prices.map((item: { y: number }) => item.y),
              yAxisID: "y",
              borderColor: borderColors,
              backgroundColor: borderColors,
              pointBackgroundColor: borderColors,
              pointBorderColor: borderColors,
              fill: false,
            } as ChartDataset<"line", number[]>,
            {
              type: "bar",
              label: "Volume",
              data: volumes.map((item: { y: number }) => item.y),
              yAxisID: "y1",
              backgroundColor: "rgba(107, 114, 128, 0.5)",
            } as ChartDataset<"bar", number[]>,
          ],
        });

        if (showPrediction) {
          const predictionResponse = await axios.get(`/api/crypto/${id}/prediction`);
          setPredictionData(predictionResponse.data);
        } else {
          setPredictionData(null);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, range, showPrediction]);

  return { chartData, predictionData, loading, error };
}

function getMarketColor(): string {
  // Implement your logic to determine the market color
  return "blue"; // Example color
}