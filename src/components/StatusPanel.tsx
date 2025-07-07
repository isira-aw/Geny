import React from 'react';
import { Zap, Activity, Building2 } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export const StatusPanel: React.FC = () => {
  const { 
    power, 
    engineState, 
    breakerState, 
    mainsPowerOn, 
    generatorPowerOn 
  } = useAppSelector((state) => state.generator);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Generator Status</h2>
        <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
      
      <div className="space-y-3">
        {/* Mains Power - Display Only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              mainsPowerOn 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Building2 className={`w-5 h-5 ${
                mainsPowerOn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Mains Power</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {mainsPowerOn ? 'Online' : 'Offline'} • {mainsPowerOn ? '230V' : '0V'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            mainsPowerOn 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {mainsPowerOn ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>

        {/* Generator Power - Display Only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              generatorPowerOn 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Zap className={`w-5 h-5 ${
                generatorPowerOn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Generator Power</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {generatorPowerOn ? 'Running' : 'Stopped'} • {Math.round(power)} kW
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            generatorPowerOn 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {generatorPowerOn ? 'RUNNING' : 'STOPPED'}
          </div>
        </div>

        {/* Status Info */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Engine</span>
              </div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">{engineState}</p>
            </div>
            <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Breaker</span>
              </div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{breakerState}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};