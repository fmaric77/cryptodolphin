// app/components/ChartComponent.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip, Legend, Filler, ScriptableContext } from "chart.js";
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
  chartData: any;
  predictionData?: { labels: Date[]; data: number[] };
  options: any;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, predictionData, options }) => {
  const formattedData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset: any) => ({
      ...dataset,
      segment: {
        borderColor: (ctx: ScriptableContext<'line'>) => {
          const index = ctx.dataIndex;
          const color = dataset.borderColor[index] || "gray";
          return color;
        },
      },
    })),
  };

  return <Line data={formattedData} options={options} />;
};

export default ChartComponent;