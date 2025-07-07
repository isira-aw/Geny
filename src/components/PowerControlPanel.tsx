import React from 'react';
import { Power, Zap, Building2, Settings } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleMainsPower, toggleGeneratorPower } from '../store/generatorSlice';

export const PowerControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mainsPowerOn, generatorPowerOn, power } = useAppSelector((state) => state.generator);

  const handleMainsPowerToggle = () => {
    dispatch(toggleMainsPower());
  };

  const handleGeneratorPowerToggle = () => {
    dispatch(toggleGeneratorPower());
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Power Control</h2>
        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="space-y-4">
        {/* Mains Power Control */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              mainsPowerOn 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Building2 className={`w-4 h-4 ${
                mainsPowerOn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Mains Power</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {mainsPowerOn ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={handleMainsPowerToggle}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              mainsPowerOn ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${
              mainsPowerOn ? 'right-1' : 'left-1'
            }`}></div>
          </button>
        </div>

        {/* Generator Power Control */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              generatorPowerOn 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Zap className={`w-4 h-4 ${
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
          <button
            onClick={handleGeneratorPowerToggle}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              generatorPowerOn ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${
              generatorPowerOn ? 'right-1' : 'left-1'
            }`}></div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              dispatch(toggleMainsPower());
              dispatch(toggleGeneratorPower());
            }}
            className="flex items-center justify-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Power className="w-4 h-4" />
            <span className="text-xs font-medium">Toggle All</span>
          </button>
          
          <button
            onClick={() => {
              if (mainsPowerOn) dispatch(toggleMainsPower());
              if (!generatorPowerOn) dispatch(toggleGeneratorPower());
            }}
            className="flex items-center justify-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">Auto Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};