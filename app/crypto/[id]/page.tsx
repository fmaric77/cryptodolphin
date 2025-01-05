// app/crypto/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ChartComponent from "../../components/ChartComponent";
import RangeButtons from "../../components/RangeButtons";
import MarketCycles from "../../components/MarketCycles";
import PricePrediction from "../../components/PricePrediction";

interface PriceData {
  x: Date;
  y: number;
}

interface VolumeData {
  x: Date;
  y: number;
}

interface ChartData {
    labels: Date[];
    datasets: Array<{
      type: string;
      label: string;
      data: number[];
      yAxisID: string;
      borderColor?: string[];
      backgroundColor?: string[];
      tension?: number;
    }>;
  }

export default function CryptoChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [range, setRange] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarketCycles, setShowMarketCycles] = useState<boolean>(false);

  const marketCycles = [
    { start: new Date("2011-11-01"), end: new Date("2014-01-01"), color: "rgba(34, 197, 94, 0.5)" },
    { start: new Date("2014-01-01"), end: new Date("2015-08-31"), color: "rgba(239, 68, 68, 0.5)" },
    { start: new Date("2015-10-01"), end: new Date("2018-01-01"), color: "rgba(34, 197, 94, 0.5)" },
    { start: new Date("2018-01-01"), end: new Date("2018-12-31"), color: "rgba(239, 68, 68, 0.5)" },
    { start: new Date("2019-01-01"), end: new Date("2022-01-01"), color: "rgba(34, 197, 94, 0.5)" },
    { start: new Date("2022-01-01"), end: new Date("2023-06-30"), color: "rgba(239, 68, 68, 0.5)" },
    { start: new Date("2024-11-01"), color: "rgba(34, 197, 94, 0.5)" },
  ];

  const getColorForDate = (date: Date) => {
    for (const cycle of marketCycles) {
      if (date >= cycle.start && (!cycle.end || date <= cycle.end)) {
        return cycle.color;
      }
    }
    return "rgba(75, 192, 192, 0.2)"; // Default color if no cycle matches
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { startTime, endTime, interval } = getTimeRange(range);
        const response = await axios.get(`https://api.coincap.io/v2/assets/${id}/history`, {
          params: {
            interval: interval,
            start: startTime,
            end: endTime,
          },
          headers: {
            Authorization: `Bearer add42bd3-a514-4681-b512-f803c1c0093f`,
          },
        });
        const prices: PriceData[] = response.data.data.map((p: { time: string; priceUsd: string }) => ({
            x: new Date(p.time),
            y: parseFloat(p.priceUsd),
          }));
          const volumes: VolumeData[] = response.data.data.map((p: { time: string; volumeUsd24Hr?: string }) => ({
            x: new Date(p.time),
            y: p.volumeUsd24Hr ? parseFloat(p.volumeUsd24Hr) : 0,
          }));
        setChartData({
          labels: prices.map((item) => item.x),
          datasets: [
            {
              type: "line",
              label: `${id.toUpperCase()} Price`,
              data: prices.map((item) => item.y),
              yAxisID: "y",
              borderColor: prices.map((item) => getColorForDate(item.x)),
              backgroundColor: prices.map((item) => getColorForDate(item.x)),
              tension: 0.1,
            },
            {
              type: "bar",
              label: "Volume",
              data: volumes.map((item) => item.y),
              yAxisID: "y1",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, range]);

  const getTimeRange = (range: string) => {
    const now = Date.now();
    const endTime = Math.floor(now);
    let startTime: number;
    let interval: string;
  
    switch (range) {
      case "1d":
        startTime = endTime - (24 * 60 * 60 * 1000);
        interval = "m5";
        break;
      case "7d":
        startTime = endTime - (7 * 24 * 60 * 60 * 1000);
        interval = "h2";
        break;
      case "1m":
        startTime = endTime - (30 * 24 * 60 * 60 * 1000);
        interval = "h12";
        break;
      case "1y":
        startTime = endTime - (365 * 24 * 60 * 60 * 1000);
        interval = "d1";
        break;
      case "all":
        startTime = endTime - (10 * 365 * 24 * 60 * 60 * 1000);
        interval = "d1";
        break;
      default:
        startTime = endTime - (24 * 60 * 60 * 1000);
        interval = "m5";
        break;
    }
  
    return {
      startTime,
      endTime,
      interval
    };
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { type: "time" },
      y: {
        type: "linear",
        position: "left",
        ticks: { callback: (val: number) => `$${val.toLocaleString()}` },
      },
      y1: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: { callback: (val: number) => val.toLocaleString() },
      },
    },
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { display: true },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        },
        limits: {
          x: {min: 'original', max: 'original'},
          y: {min: 'original', max: 'original'}
        }
      },
      annotation: {
        annotations: showMarketCycles ? marketCycles.map((cycle) => ({
          type: 'box',
          xMin: cycle.start,
          xMax: cycle.end,
          backgroundColor: cycle.color,
          borderWidth: 0,
        })) : [],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link href="/" className="underline mb-4 inline-block">
        Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Crypto: {id.toUpperCase()}</h1>
      <RangeButtons setRange={setRange} />
      <button
        onClick={() => setShowMarketCycles(!showMarketCycles)}
        className="mb-4 px-3 py-1 bg-gray-700 rounded"
      >
        {showMarketCycles ? "Hide Market Cycles" : "Show Market Cycles"}
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        chartData && <ChartComponent chartData={chartData} options={options} />
      )}
      <MarketCycles enabled={showMarketCycles} />
      <PricePrediction cryptoSymbol={id} />
    </div>
  );
}