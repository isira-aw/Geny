import React from 'react';
import { Thermometer, Droplets, Gauge, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export const AnalogInputs: React.FC = () => {
  const analogInputs = useAppSelector((state) => state.generator.analogInputs);

  const inputs = [
    { 
      label: 'Coolant Temp', 
      value: analogInputs.coolantTemp?.toString() || '---', 
      unit: '°C', 
      icon: Thermometer 
    },
    { 
      label: 'Oil Level', 
      value: analogInputs.oilLevel?.toString() || '---', 
      unit: '%', 
      icon: Droplets 
    },
    { 
      label: 'Fuel Level', 
      value: analogInputs.fuelLevel?.toString() || '---', 
      unit: '%', 
      icon: Gauge 
    },
    { 
      label: 'Not Used', 
      value: analogInputs.notUsed?.toString() || '---', 
      unit: '', 
      icon: AlertCircle 
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Analog Inputs</h2>
      
      <div className="space-y-2">
        {inputs.map((input, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <input.icon className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-900 dark:text-white">{input.label}</span>
            </div>
            <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
              {input.value} {input.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};