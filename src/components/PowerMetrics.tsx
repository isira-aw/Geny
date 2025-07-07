import React from 'react';
import { Zap, Activity, Gauge } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export const PowerMetrics: React.FC = () => {
  const { voltage, current, frequency } = useAppSelector((state) => state.generator);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Power Metrics</h2>
        <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
      
      {/* Voltage */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Voltage</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{voltage.phaseN}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Ph-N [V]</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{voltage.phasePh}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Ph-Ph [V]</div>
          </div>
        </div>
      </div>

      {/* Current */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Current [A]</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(current).map(([phase, value]) => (
            <div key={phase} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(value)}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{phase.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Gauge className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Frequency</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {frequency.toFixed(3)} Hz
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};