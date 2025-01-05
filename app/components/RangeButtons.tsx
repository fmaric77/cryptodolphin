import React from "react";

interface RangeButtonsProps {
  setRange: (range: string) => void;
}

const RangeButtons: React.FC<RangeButtonsProps> = ({ setRange }) => {
  return (
    <div className="mb-4">
      <button onClick={() => setRange("1d")} className="mr-2 px-3 py-1 bg-gray-700 rounded">1D</button>
      <button onClick={() => setRange("7d")} className="mr-2 px-3 py-1 bg-gray-700 rounded">7D</button>
      <button onClick={() => setRange("1m")} className="mr-2 px-3 py-1 bg-gray-700 rounded">1M</button>
      <button onClick={() => setRange("1y")} className="mr-2 px-3 py-1 bg-gray-700 rounded">1Y</button>
      <button onClick={() => setRange("all")} className="mr-2 px-3 py-1 bg-gray-700 rounded">All</button>
    </div>
  );
};

export default RangeButtons;