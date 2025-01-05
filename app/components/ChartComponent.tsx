// filepath: /home/filip/projec/dboard/app/components/ChartComponent.tsx
import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData as ChartJSData,
  ChartOptions as ChartJSOptions,
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin,
  annotationPlugin
);

interface MarketCycle {
  start: Date;
  end?: Date;
  color: string;
}

interface Dataset {
  type: "line";
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  // Add other relevant properties
}

interface ChartData extends ChartJSData<"line", number[], unknown> {
  labels: Date[];
  datasets: Dataset[];
}



interface ChartOptions extends ChartJSOptions<"line"> {
  plugins: {
    annotation: {
      annotations: Record<string, AnnotationOptions>;
    };
    // Add other plugin options if necessary
  };
  // Add other chart options if necessary
}

interface ChartComponentProps {
  chartData: ChartData;
  options: ChartOptions;
  marketCycles?: MarketCycle[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, options, marketCycles = [] }) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const annotations: Record<string, AnnotationOptions> = {};

  marketCycles.forEach((cycle, index) => {
    annotations[`box${index}`] = {
      type: 'box',
      xMin: cycle.start.getTime(),
      xMax: cycle.end ? cycle.end.getTime() : undefined,
      backgroundColor: cycle.color,
      borderWidth: 0,
    };
  });

  const updatedOptions: ChartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      annotation: {
        annotations,
      },
    },
  };

  return (
    <div>
      <button onClick={resetZoom} className="px-3 py-1 bg-blue-600 rounded">Reset Zoom</button>
      <Line ref={chartRef} data={chartData} options={updatedOptions} />
    </div>
  );
};

export default ChartComponent;