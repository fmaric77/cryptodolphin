// app/crypto/useCryptoChart.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { marketCycles } from "../components/MarketCycles"; // Adjust the path if necessary
import { ChartData } from "chart.js";

interface PredictionData {
  ds: string;
  yhat: number;
}

interface PriceData {
  x: Date;
  y: number;
}

interface VolumeData {
  x: Date;
  y: number;
}
interface AssetData {
  symbol: string;
  id: string;
  name: string;
  priceUsd: string;
  volumeUsd24Hr: string;
  marketCapUsd: string;
  supply: string;
  maxSupply: string | null;
  changePercent24Hr: string;
  rank: string;
}

interface AssetResponse {
  data: AssetData;
  timestamp: number;
}

interface HistoricalDataPoint {
  time: string;
  priceUsd: string;
  volumeUsd24Hr?: string;
}

interface HistoricalResponse {
  data: HistoricalDataPoint[];
}


function getMarketColor(date: Date): string {
  const cycle = marketCycles.find(
    (c) => c.start <= date && (c.end ? date <= c.end : true)
  );
  if (!cycle) return "gray";
  return cycle.color; // Use the color defined in marketCycles
}

export function useCryptoChart(id: string, range: string, showPrediction: boolean) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [predictionData, setPredictionData] = useState<{ labels: Date[]; data: number[] } | null>(null);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeRange = (timeRange: string) => {
    const now = Date.now();
    const endTime = Math.floor(now);
    let startTime: number;
    let interval: string;

    switch (timeRange) {
      case "1d":
        startTime = endTime - 24 * 60 * 60 * 1000;
        interval = "m5";
        break;
      case "7d":
        startTime = endTime - 7 * 24 * 60 * 60 * 1000;
        interval = "h2";
        break;
      case "1m":
        startTime = endTime - 30 * 24 * 60 * 60 * 1000;
        interval = "h12";
        break;
      case "1y":
        startTime = endTime - 365 * 24 * 60 * 60 * 1000;
        interval = "d1";
        break;
      default:
        startTime = endTime - 10 * 365 * 24 * 60 * 60 * 1000;
        interval = "d1";
        break;
    }
    return { startTime, endTime, interval };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const assetResponse = await axios.get<AssetResponse>(
          `https://api.coincap.io/v2/assets/${id.toLowerCase()}`
        );
        
        setSymbol(assetResponse.data.data.symbol);

        const { startTime, endTime, interval } = getTimeRange(range);
        const response = await axios.get<HistoricalResponse>(
          `https://api.coincap.io/v2/assets/${id.toLowerCase()}/history`,
          {
            params: { interval, start: startTime, end: endTime },
            headers: {
              Authorization: `Bearer add42bd3-a514-4681-b512-f803c1c0093f`,
            },
          }
        );

        const prices: PriceData[] = response.data.data.map((p: HistoricalDataPoint) => ({
          x: new Date(p.time),
          y: parseFloat(p.priceUsd),
        }));
        
        const volumes: VolumeData[] = response.data.data.map((p: HistoricalDataPoint) => ({
          x: new Date(p.time),
          y: p.volumeUsd24Hr ? parseFloat(p.volumeUsd24Hr) : 0,
        }));
        

        const borderColors = prices.map((item) => getMarketColor(item.x));

        // Debugging: Log borderColors to verify correct colors
        console.log("Border Colors:", borderColors);

        setChartData({
          labels: prices.map((item) => item.x),
          datasets: [
            {
              type: "line",
              label: `${id.toUpperCase()} Price`,
              data: prices.map((item) => item.y),
              yAxisID: "y",
              borderColor: borderColors,
              backgroundColor: borderColors, // Add if you want fill color based on cycle
              pointBackgroundColor: borderColors, // Color the points
              pointBorderColor: borderColors,
              fill: false,
            },
            {
              type: "bar",
              label: "Volume",
              data: volumes.map((item) => item.y),
              yAxisID: "y1",
              backgroundColor: "rgba(107, 114, 128, 0.5)", // Gray color for volume
            },
          ],
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, range]);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!showPrediction || !symbol) {
        setPredictionData(null);
        return;
      }
      try {
        const response = await axios.get(
          `/api/predict?cryptoSymbol=${symbol.toUpperCase()}`
        );
        if (response.data.error) throw new Error(response.data.error);

        const forecast: PredictionData[] = response.data;
        setPredictionData({
          labels: forecast.map((row) => new Date(row.ds)),
          data: forecast.map((row) => row.yhat),
        });
      } catch (error:unknown) {
        setError(error instanceof Error ? error.message : "Failed to predict future prices");
      }
    };

    fetchPrediction();
  }, [showPrediction, symbol]);

  return { chartData, predictionData, loading, error, symbol };
}