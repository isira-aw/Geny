import React, { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';

export const AlarmSystem: React.FC = () => {
  const [alarms, setAlarms] = useState(['System initialized', 'Generator 2 started']);
  const [isMuted, setIsMuted] = useState(false);

  const alarmMessages = [" Generate a monitoring system live"
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
    <div className="rounded-2xl shadow-lg p-4 bg-white text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold">ALARM LIST</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg "
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

      <div className="rounded-lg p-4 h-48 overflow-y-auto">
        {alarms.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-800">
            <span>no alarm</span>
          </div>
        ) : (
          <div className="space-y-2">
            {alarms.map((alarm, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm transition-all duration-300 ${
                  index === 0 
                    ? 'bg-yellow-800 border border-yellow-600 text-yellow-200' 
                    : 'bg-gray-500 text-gray-300'
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