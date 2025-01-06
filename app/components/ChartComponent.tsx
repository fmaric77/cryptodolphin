import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip, Legend, Filler, ChartOptions, ScriptableLineSegmentContext } from "chart.js";
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

interface Dataset {
  label?: string;
  data: number[];
  borderColor: string[];
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

interface ChartData {
  labels: (string | Date)[];
  datasets: Dataset[];
}

interface ChartComponentProps {
  chartData: ChartData;
  predictionData?: { labels: Date[]; data: number[] };
  options: ChartOptions<'line'>;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, options }) => {
  const formattedData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset: Dataset) => ({
      ...dataset,
      segment: {
        borderColor: (ctx: ScriptableLineSegmentContext) => {
          const index = ctx.p0DataIndex;
          const color = dataset.borderColor[index] || "gray";
          return color;
        },
      },
    })),
  };

  return <Line data={formattedData} options={options} />;
};

export default ChartComponent;