import React from 'react';
import { AlertTriangle, Volume2 } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export const AlarmPanel: React.FC = () => {
  const alarms = useAppSelector((state) => state.generator.alarms);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Alarms</h2>
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <AlertTriangle className={`w-4 h-4 ${alarms.active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
        </div>
      </div>
      
      <div className="text-center py-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
          alarms.active ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            alarms.active ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'
          }`}></div>
        </div>
        <p className={`text-sm font-medium ${
          alarms.active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
        }`}>
          {alarms.active ? `${alarms.count} Active Alarms` : 'No Active Alarms'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          {alarms.active ? 'Attention Required' : 'System Normal'}
        </p>
      </div>

      <div className="text-center text-xs text-slate-600 dark:text-slate-400">
        Last Check: {alarms.lastCheck}
      </div>
    </div>
  );
};