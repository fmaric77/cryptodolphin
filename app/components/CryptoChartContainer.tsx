"use client";
import React, { useState } from "react";
import Link from "next/link";
import ChartComponent from "./ChartComponent";
import RangeButtons from "./RangeButtons";
import MarketCycles from "./MarketCycles";
import { ChartOptions } from "chart.js";
import { useCryptoChart } from "./useCryptoChart";

export default function CryptoChartContainer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [range, setRange] = useState("all");
  const [showMarketCycles, setShowMarketCycles] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const { chartData, predictionData, loading, error } = useCryptoChart(id, range, showPrediction) as {
    chartData: { labels: (string | Date)[]; datasets: any[] };
    predictionData?: { labels: Date[]; data: number[] };
    loading: boolean;
    error: string | null;
  };

  const options: ChartOptions<"line"> = {
    /* simplified example, same config as yours */
    responsive: true,
    scales: {
      x: { type: "time" },
      y: { type: "linear", position: "left" },
      y1: { type: "linear", position: "right" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link href="/" className="underline mb-4 inline-block">
        Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Crypto: {id.toUpperCase()}</h1>
      <RangeButtons setRange={setRange} />
      <div className="flex items-center mb-4">
        <button onClick={() => setShowMarketCycles(!showMarketCycles)} className="mr-4 px-3 py-1 bg-gray-700 rounded">
          {showMarketCycles ? "Hide Market Cycles" : "Show Market Cycles"}
        </button>
        <button onClick={() => setShowPrediction(!showPrediction)} className="px-3 py-1 bg-blue-700 rounded">
          {showPrediction ? "Hide Price Prediction" : "Show Price Prediction"}
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        chartData && (
          <ChartComponent chartData={chartData} predictionData={predictionData || undefined} options={options} />
        )
      )}
      <MarketCycles enabled={showMarketCycles} />
    </div>
  );
}