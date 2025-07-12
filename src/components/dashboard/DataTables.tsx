import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';

export const DataTables: React.FC = () => {
  // const [tableData1, setTableData1] = useState([
  //   { parameter: 'Voltage L1-N', value: 232, unit: 'V' },
  //   { parameter: 'Voltage L2-N', value: 231, unit: 'V' },
  //   { parameter: 'Voltage L3-N', value: 232, unit: 'V' },
  //   { parameter: 'Current L1', value: 15.2, unit: 'A' },
  //   { parameter: 'Current L2', value: 14.8, unit: 'A' }
  // ]);

  const [tableData2, setTableData2] = useState([
    { metric: 'Running Hours', value: 12.9, unit: 'h' },
    { metric: 'Fuel Level', value: 26, unit: '%' },
    { metric: 'Coolant Temp', value: 85, unit: '°C' },
    { metric: 'Oil Pressure', value: 4.2, unit: 'bar' },
    { metric: 'Maintenance Timer', value: 10000, unit: 'h' }
  ]);

  // Real-time value updates
  useEffect(() => {
    const interval = setInterval(() => {
      // setTableData1(prevData => 
      //   prevData.map(row => ({
      //     ...row,
      //     value: typeof row.value === 'number' ? 
      //       Math.max(0, row.value + (Math.random() - 0.5) * 2) : row.value
      //   }))
      // );

      setTableData2(prevData => 
        prevData.map(row => ({
          ...row,
          value: typeof row.value === 'number' ? 
            Math.max(0, row.value + (Math.random() - 0.5) * 0.1) : row.value
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        <Database className="w-6 h-6 text-blue-600" />
      </div>

      <div className="space-y-6">
        {/* Electrical Parameters Table */}
        {/* <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Electrical Parameters</h4>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Parameter</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Value</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData1.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{row.parameter}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-900">
                      {typeof row.value === 'number' ? row.value.toFixed(1) : row.value}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* System Statistics Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">System Statistics</h4>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Metric</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Value</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData2.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{row.metric}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-900">
                      {typeof row.value === 'number' ? 
                        (row.value > 100 ? Math.round(row.value) : row.value.toFixed(1)) 
                        : row.value}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analog Inputs Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Analog Inputs</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Not Used</span>
              <span className="font-mono text-gray-900">### Bar</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coolant Temp</span>
              <span className="font-mono text-gray-900">### °C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fuel Level</span>
              <span className="font-mono text-gray-900">{Math.round(tableData2[1]?.value || 26)} %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Not Used</span>
              <span className="font-mono text-gray-900">###</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};