import React, { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';

export const AlarmSystem: React.FC = () => {
  const [alarms, setAlarms] = useState(['System initialized', 'Generator 2 started']);
  const [isMuted, setIsMuted] = useState(false);

  const alarmMessages = [
    'Temperature warning detected',
    'Fuel level low',
    'Maintenance required',
    'System check completed',
    'Generator load balanced',
    'Cooling system active',
    'Voltage fluctuation detected',
    'Oil pressure normal',
    'Battery charging',
    'System optimization complete'
  ];

  // Add random alarms occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAlarm = alarmMessages[Math.floor(Math.random() * alarmMessages.length)];
        const timestamp = new Date().toLocaleTimeString();
        setAlarms(prevAlarms => [`${timestamp}: ${randomAlarm}`, ...prevAlarms.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold">ALARM LIST</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-green-400" />
            )}
          </button>
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 h-48 overflow-y-auto">
        {alarms.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <span>no alarm</span>
          </div>
        ) : (
          <div className="space-y-2">
            {alarms.map((alarm, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm transition-all duration-300 ${
                  index === 0 
                    ? 'bg-yellow-900/50 border border-yellow-600 text-yellow-200' 
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {alarm}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>Total Alarms: {alarms.length}</span>
        <span>Status: {isMuted ? 'Muted' : 'Active'}</span>
      </div>
    </div>
  );
};