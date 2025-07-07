import React from 'react';
import { useAppSelector } from '../hooks/redux';

export const BinaryOutputs: React.FC = () => {
  const binaryOutputs = useAppSelector((state) => state.generator.binaryOutputs);

  const outputs = [
    { id: 1, label: 'ECU Power Relay', status: binaryOutputs.ecuPowerRelay },
    { id: 2, label: 'GCB Close/Open', status: binaryOutputs.gcbCloseOpen },
    { id: 3, label: 'MCB Close/Open', status: binaryOutputs.mcbCloseOpen },
    { id: 4, label: 'Not Used', status: binaryOutputs.notUsed1 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Binary Outputs</h2>
      
      <div className="space-y-2">
        {outputs.map((output) => (
          <div key={output.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-4">{output.id}</span>
              <span className="text-sm text-slate-900 dark:text-white">{output.label}</span>
            </div>
            <div className={`w-5 h-5 rounded ${output.status ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'} flex items-center justify-center`}>
              <span className="text-xs font-bold text-white">{output.status ? '1' : '0'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};