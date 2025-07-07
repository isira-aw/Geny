import React from 'react';
import { Clock, Wrench, Zap, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export const Statistics: React.FC = () => {
  const { runningHours, maintenanceTimer, gensetKwh, gensetKvarh } = useAppSelector((state) => state.generator);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Statistics</h2>
        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-900 dark:text-white">Running Hours</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{runningHours.toFixed(1)} h</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-slate-900 dark:text-white">Maintenance</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{maintenanceTimer} h</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-slate-900 dark:text-white">kWh</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{gensetKwh}</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-slate-900 dark:text-white">kVArh</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{gensetKvarh}</span>
        </div>
      </div>

      <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700 dark:text-blue-300">Next Maintenance</span>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
            {Math.max(0, maintenanceTimer - runningHours).toFixed(0)} h
          </span>
        </div>
      </div>
    </div>
  );
};