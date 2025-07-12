import React, { useState, useEffect } from 'react';
import { Power, Zap } from 'lucide-react';

export const GeneratorControl: React.FC = () => {
  const [generator1, setGenerator1] = useState(false);
  const [generator2, setGenerator2] = useState(true);
  const [generator1Value, setGenerator1Value] = useState(20);
  const [generator2Value, setGenerator2Value] = useState(35);

  // Real-time value updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGenerator1Value(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setGenerator2Value(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleGenerator = (generator: 'generator1' | 'generator2') => {
    if (generator === 'generator1') {
      setGenerator1(!generator1);
    } else {
      setGenerator2(!generator2);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Generator Control</h3>
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>

      {/* Power Values Display */}
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(generator1Value)}KW</div>
          <div className="text-sm text-gray-400">Gen 1</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(generator2Value)}KW</div>
          <div className="text-sm text-gray-400">Gen 2</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(generator1Value + generator2Value)}KW</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
      </div>

      {/* Generator Icons */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="relative">
            <Zap className={`w-12 h-12 ${generator1 ? 'text-red-500' : 'text-gray-500'}`} />
            <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full px-2 py-1 text-xs">
              {Math.round(generator1Value)}
            </div>
          </div>
        </div>
        
        <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
          <Power className="w-8 h-8 text-gray-300" />
        </div>
        
        <div className="text-center">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl font-bold ${
              generator2 ? 'border-green-500 bg-green-500 text-white' : 'border-gray-500 text-gray-500'
            }`}>
              G
            </div>
            <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full px-2 py-1 text-xs">
              {Math.round(generator2Value)}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => toggleGenerator('generator1')}
          className={`py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
            generator1 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {generator1 ? 'OFF' : 'OFF'}
        </button>
        
        <button
          onClick={() => toggleGenerator('generator2')}
          className={`py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
            generator2 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {generator2 ? 'ON' : 'ON'}
        </button>
      </div>
    </div>
  );
};