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
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
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

interface ChartComponentProps {
  chartData: any;
  options: any;
  marketCycles?: any[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, options, marketCycles = [] }) => {
  const chartRef = useRef<any>(null);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const annotations = marketCycles.map((cycle, index) => ({
    type: 'box',
    xMin: cycle.start,
    xMax: cycle.end,
    backgroundColor: cycle.color,
    borderWidth: 0,
  }));

  const updatedOptions = {
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