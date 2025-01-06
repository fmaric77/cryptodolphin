import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ScriptableLineSegmentContext,
  ChartDataset,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

interface ChartComponentProps {
  chartData: {
    labels: (string | Date)[];
    datasets: ChartDataset<"line", number[]>[];
  };
  predictionData?: { labels: Date[]; data: number[] };
  options: ChartOptions<'line'>;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, options }) => {
  const formattedData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      segment: {
        borderColor: (ctx: ScriptableLineSegmentContext) => {
          const index = ctx.p0DataIndex;
          const borderColor = dataset.borderColor;
          const color = Array.isArray(borderColor) ? borderColor[index] : "gray";
          return color;
        },
      },
    })),
  };

  return <Line data={formattedData} options={options} />;
};

export default ChartComponent;