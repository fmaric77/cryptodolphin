import React from "react";
import * as ss from "simple-statistics";

interface MarketCycle {
  start: Date;
  end?: Date;
  color: string;
}

const marketCycles: MarketCycle[] = [
  { start: new Date("2011-11-01"), end: new Date("2014-01-01"), color: "rgba(34, 197, 94, 0.5)" }, // First Bull Market
  { start: new Date("2014-01-01"), end: new Date("2015-08-31"), color: "rgba(239, 68, 68, 0.5)" }, // First Bear Market
  { start: new Date("2015-10-01"), end: new Date("2018-01-01"), color: "rgba(34, 197, 94, 0.5)" }, // Second Bull Market
  { start: new Date("2018-01-01"), end: new Date("2018-12-31"), color: "rgba(239, 68, 68, 0.5)" }, // Second Bear Market
  { start: new Date("2019-01-01"), end: new Date("2022-01-01"), color: "rgba(34, 197, 94, 0.5)" }, // Third Bull Market
  { start: new Date("2022-01-01"), end: new Date("2023-06-30"), color: "rgba(239, 68, 68, 0.5)" }, // Third Bear Market
  { start: new Date("2024-11-01"), color: "rgba(34, 197, 94, 0.5)" }, // Fourth Bull Market (ongoing)
];

interface MarketCyclesProps {
  enabled: boolean;
}

const MarketCycles: React.FC<MarketCyclesProps> = ({ enabled }) => {
  if (!enabled) return null;

  const predictFutureCycles = () => {
    const halvingDates = [
      new Date("2012-11-28"),
      new Date("2016-07-09"),
      new Date("2020-05-11"),
      new Date("2024-04-01"), // Expected date
    ];

    const averageBullMarketDuration = 2.5 * 365; // 2.5 years in days
    const averageBearMarketDuration = 1.5 * 365; // 1.5 years in days

    const recentBullMarket = marketCycles[marketCycles.length - 1];
    let predictedBullEnd = new Date("2025-10-01"); // Estimated end of the current bull market

    // Ensure the predicted end date is not less than the current date
    const currentDate = new Date();
    if (predictedBullEnd < currentDate) {
      predictedBullEnd = currentDate;
    }

    const predictedBearStart = predictedBullEnd;
    const predictedBearEnd = new Date(predictedBearStart.getTime() + averageBearMarketDuration * 24 * 60 * 60 * 1000);

    return { predictedBullEnd, predictedBearStart, predictedBearEnd };
  };

  const { predictedBullEnd, predictedBearStart, predictedBearEnd } = predictFutureCycles();

  return (
    <div>
      {marketCycles.map((cycle, index) => (
        <div key={index} style={{ backgroundColor: cycle.color }}>
          {cycle.start.toDateString()} - {cycle.end ? cycle.end.toDateString() : "Ongoing"}
        </div>
      ))}
      <div style={{ backgroundColor: "rgba(34, 197, 94, 0.5)" }}>
        Predicted End of Current Bull Market: {predictedBullEnd.toDateString()}
      </div>
      <div style={{ backgroundColor: "rgba(239, 68, 68, 0.5)" }}>
        Predicted Start of Next Bear Market: {predictedBearStart.toDateString()} - {predictedBearEnd.toDateString()}
      </div>
    </div>
  );
};

export default MarketCycles;