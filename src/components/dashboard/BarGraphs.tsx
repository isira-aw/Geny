import React, { useState, useEffect } from 'react';

export const BarGraphs: React.FC = () => {
  const [barGraphData, setBarGraphData] = useState([
    [85, 92, 78],
    [76, 88, 95],
    [90, 82, 87],
    [88, 91, 79],
    [83, 86, 92]
  ]);

  const graphLabels = [
    ['L1-N', 'L2-N', 'L3-N'],
    ['L1-L2', 'L2-L3', 'L3-L1'],
    ['L1', 'L2', 'L3'],
    ['L1-N', 'L2-N', 'L3-N'],
    ['L1-L2', 'L2-L3', 'L3-L1']
  ];

  const graphTitles = ['Ph-N [V]', 'Ph-Ph [V]', 'Current [A]', 'Ph-N [V]', 'Ph-Ph [V]'];
  const overloadThreshold = 85;
  const underloadThreshold = 25;

  // Real-time value updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBarGraphData(prevData => 
        prevData.map(bars => 
          bars.map(value => Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 3)))
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Parameters</h3>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Overload</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Normal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {barGraphData.map((bars, graphIndex) => (
          <div key={graphIndex} className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              {graphTitles[graphIndex]}
            </h4>
            
            <div className="relative h-32 flex items-end justify-center space-x-2">
              {/* Overload line */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed"
                style={{ bottom: `${(overloadThreshold / 100) * 128}px` }}
              ></div>
              
              {/* Underload line */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-orange-400 border-dashed"
                style={{ bottom: `${(underloadThreshold / 100) * 128}px` }}
              ></div>

              {bars.map((value, barIndex) => (
                <div key={barIndex} className="flex flex-col items-center">
                  <div
                    className={`w-6 rounded-t transition-all duration-500 ${
                      value > overloadThreshold 
                        ? 'bg-red-500' 
                        : value < underloadThreshold 
                        ? 'bg-orange-400' 
                        : 'bg-green-500'
                    }`}
                    style={{ height: `${(value / 100) * 128}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1">
                    {graphLabels[graphIndex][barIndex]}
                  </span>
                  <span className="text-xs font-semibold text-gray-800">
                    {Math.round(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};