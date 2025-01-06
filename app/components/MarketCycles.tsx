// app/components/MarketCycles.tsx
import React from "react";

export interface MarketCycle {
  type: string;
  start: Date;
  end?: Date;
  color: string;
}

interface MarketCyclesProps {
  enabled: boolean;
}

export const marketCycles: MarketCycle[] = [
  { type: "bull", start: new Date("2011-11-01"), end: new Date("2014-01-01"), color: "rgba(34, 197, 94, 0.5)" }, // First Bull Market
  { type: "bear", start: new Date("2014-01-01"), end: new Date("2015-08-31"), color: "rgba(239, 68, 68, 0.5)" }, // First Bear Market
  { type: "bull", start: new Date("2015-10-01"), end: new Date("2018-01-01"), color: "rgba(34, 197, 94, 0.5)" }, // Second Bull Market
  { type: "bear", start: new Date("2018-01-01"), end: new Date("2018-12-31"), color: "rgba(239, 68, 68, 0.5)" }, // Second Bear Market
];

const MarketCycles: React.FC<MarketCyclesProps> = ({ enabled }) => {
  if (!enabled) return null;

  const predictFutureCycles = () => {
    const averageBearMarketDuration = 1.5 * 365; // 1.5 years in days
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
        <div key={index} style={{ backgroundColor: cycle.color, padding: "5px", margin: "2px 0" }}>
          {cycle.type.charAt(0).toUpperCase() + cycle.type.slice(1)} Market: {cycle.start.toDateString()} - {cycle.end ? cycle.end.toDateString() : "Ongoing"}
        </div>
      ))}
      <div style={{ backgroundColor: "rgba(34, 197, 94, 0.5)", padding: "5px", margin: "2px 0" }}>
        Predicted End of Current Bull Market: {predictedBullEnd.toDateString()}
      </div>
      <div style={{ backgroundColor: "rgba(239, 68, 68, 0.5)", padding: "5px", margin: "2px 0" }}>
        Predicted Start of Next Bear Market: {predictedBearStart.toDateString()} - {predictedBearEnd.toDateString()}
      </div>
    </div>
  );
};

export default MarketCycles;