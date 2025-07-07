import React from 'react';
import { Power, Settings, TestTube, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setMode } from '../store/generatorSlice';

export const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.generator.mode);

  const modes = [
    { value: 'OFF' as const, label: 'OFF', icon: Power, color: 'slate' },
    { value: 'MAN' as const, label: 'MAN', icon: User, color: 'blue' },
    { value: 'AUTO' as const, label: 'AUTO', icon: Settings, color: 'green' },
    { value: 'TEST' as const, label: 'TEST', icon: TestTube, color: 'yellow' },
  ];

  const handleModeChange = (newMode: 'OFF' | 'MAN' | 'AUTO' | 'TEST') => {
    dispatch(setMode(newMode));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Control Mode</h2>
        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {modes.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => handleModeChange(value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              mode === value
                ? color === 'green'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : color === 'blue'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : color === 'yellow'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  : 'border-slate-500 bg-slate-50 dark:bg-slate-700/20 text-slate-700 dark:text-slate-400'
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Icon className="w-5 h-5 mx-auto mb-1" />
            <p className="font-semibold text-xs">{label}</p>
          </button>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Mode</p>
        <p className="font-bold text-lg text-slate-900 dark:text-white">{mode}</p>
      </div>
    </div>
  );
};