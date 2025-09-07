// src/components/dashboard/AlarmSystem.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import { ref, onValue } from "firebase/database";
import { getDatabaseInstance, isFirebaseInitialized } from "../firebase/firebase";
import { useSettings } from "../SettingsContext";

interface AlarmData {
  id: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'voltage' | 'current' | 'power' | 'rpm' | 'battery' | 'fuel' | 'temperature' | 'system';
}

export const AlarmSystem: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Real-time sensor data
  const [sensorData, setSensorData] = useState({
    mainL1_NVoltage: 0,
    mainL2_NVoltage: 0,
    mainL3_NVoltage: 0,
    genL1_NVoltage: 0,
    genL2_NVoltage: 0,
    genL3_NVoltage: 0,
    genL1_NCurrent: 0,
    genL2_NCurrent: 0,
    genL3_NCurrent: 0,
    KW: 0,
    RPM: 0,
    batteryVoltage: 0,
    fuelLevel: 0,
  });

  const { settings, firebaseInitialized } = useSettings();

  // Generate alarm based on sensor data and settings
  const checkForAlarms = (data: typeof sensorData) => {
    if (!settings) return;

    const newAlarms: AlarmData[] = [];
    const timestamp = new Date().toLocaleTimeString();

    // Voltage alarms
    [
      { value: data.mainL1_NVoltage, name: 'Main L1-N Voltage' },
      { value: data.mainL2_NVoltage, name: 'Main L2-N Voltage' },
      { value: data.mainL3_NVoltage, name: 'Main L3-N Voltage' },
    ].forEach(({ value, name }) => {
      if (value > settings.mainVoltageUpperLimit) {
        newAlarms.push({
          id: `main-voltage-high-${Date.now()}-${Math.random()}`,
          message: `${name} HIGH: ${value.toFixed(1)}V (Limit: ${settings.mainVoltageUpperLimit}V)`,
          timestamp,
          severity: 'high',
          type: 'voltage'
        });
      }
      if (value < settings.mainVoltageLowerLimit && value > 0) {
        newAlarms.push({
          id: `main-voltage-low-${Date.now()}-${Math.random()}`,
          message: `${name} LOW: ${value.toFixed(1)}V (Limit: ${settings.mainVoltageLowerLimit}V)`,
          timestamp,
          severity: 'medium',
          type: 'voltage'
        });
      }
    });

    // Generator voltage alarms
    [
      { value: data.genL1_NVoltage, name: 'Gen L1-N Voltage' },
      { value: data.genL2_NVoltage, name: 'Gen L2-N Voltage' },
      { value: data.genL3_NVoltage, name: 'Gen L3-N Voltage' },
    ].forEach(({ value, name }) => {
      if (value > settings.genVoltageUpperLimit) {
        newAlarms.push({
          id: `gen-voltage-high-${Date.now()}-${Math.random()}`,
          message: `${name} HIGH: ${value.toFixed(1)}V (Limit: ${settings.genVoltageUpperLimit}V)`,
          timestamp,
          severity: 'high',
          type: 'voltage'
        });
      }
      if (value < settings.genVoltageLowerLimit && value > 0) {
        newAlarms.push({
          id: `gen-voltage-low-${Date.now()}-${Math.random()}`,
          message: `${name} LOW: ${value.toFixed(1)}V (Limit: ${settings.genVoltageLowerLimit}V)`,
          timestamp,
          severity: 'medium',
          type: 'voltage'
        });
      }
    });

    // Current alarms
    [
      { value: data.genL1_NCurrent, name: 'Gen L1-N Current' },
      { value: data.genL2_NCurrent, name: 'Gen L2-N Current' },
      { value: data.genL3_NCurrent, name: 'Gen L3-N Current' },
    ].forEach(({ value, name }) => {
      if (value > settings.currentUpperLimit) {
        newAlarms.push({
          id: `current-high-${Date.now()}-${Math.random()}`,
          message: `${name} HIGH: ${value.toFixed(1)}A (Limit: ${settings.currentUpperLimit}A)`,
          timestamp,
          severity: 'high',
          type: 'current'
        });
      }
    });

    // Power alarm
    if (data.KW > settings.powerUpperLimit) {
      newAlarms.push({
        id: `power-high-${Date.now()}-${Math.random()}`,
        message: `Power Output HIGH: ${data.KW.toFixed(1)}kW (Limit: ${settings.powerUpperLimit}kW)`,
        timestamp,
        severity: 'high',
        type: 'power'
      });
    }

    // RPM alarms
    if (data.RPM > settings.rpmUpperLimit) {
      newAlarms.push({
        id: `rpm-high-${Date.now()}-${Math.random()}`,
        message: `Engine RPM HIGH: ${data.RPM.toFixed(0)} (Limit: ${settings.rpmUpperLimit})`,
        timestamp,
        severity: 'high',
        type: 'rpm'
      });
    }
    if (data.RPM < settings.rpmLowerLimit && data.RPM > 0) {
      newAlarms.push({
        id: `rpm-low-${Date.now()}-${Math.random()}`,
        message: `Engine RPM LOW: ${data.RPM.toFixed(0)} (Limit: ${settings.rpmLowerLimit})`,
        timestamp,
        severity: 'medium',
        type: 'rpm'
      });
    }

    // Battery alarms
    if (data.batteryVoltage > settings.batteryVoltageUpperLimit) {
      newAlarms.push({
        id: `battery-high-${Date.now()}-${Math.random()}`,
        message: `Battery Voltage HIGH: ${data.batteryVoltage.toFixed(1)}V (Limit: ${settings.batteryVoltageUpperLimit}V)`,
        timestamp,
        severity: 'medium',
        type: 'battery'
      });
    }
    if (data.batteryVoltage < (settings.batteryVoltageLowerLimit || 11) && data.batteryVoltage > 0) {
      newAlarms.push({
        id: `battery-low-${Date.now()}-${Math.random()}`,
        message: `Battery Voltage LOW: ${data.batteryVoltage.toFixed(1)}V (Limit: ${settings.batteryVoltageLowerLimit || 11}V)`,
        timestamp,
        severity: 'high',
        type: 'battery'
      });
    }

    // Fuel alarms
    if (data.fuelLevel <= settings.fuelLevelCriticalLimit && data.fuelLevel > 0) {
      newAlarms.push({
        id: `fuel-critical-${Date.now()}-${Math.random()}`,
        message: `Fuel Level CRITICAL: ${data.fuelLevel.toFixed(1)}% (Critical: ${settings.fuelLevelCriticalLimit}%)`,
        timestamp,
        severity: 'critical',
        type: 'fuel'
      });
    } else if (data.fuelLevel <= settings.fuelLevelWarningLimit && data.fuelLevel > 0) {
      newAlarms.push({
        id: `fuel-warning-${Date.now()}-${Math.random()}`,
        message: `Fuel Level WARNING: ${data.fuelLevel.toFixed(1)}% (Warning: ${settings.fuelLevelWarningLimit}%)`,
        timestamp,
        severity: 'medium',
        type: 'fuel'
      });
    }

    return newAlarms;
  };

  useEffect(() => {
    let unsubscribe: () => void;
    let initializationCheck: NodeJS.Timeout;

    const setupFirebaseListener = () => {
      try {
        const db = getDatabaseInstance();
        const sensorRef = ref(db, "Sensor");

        unsubscribe = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          
          if (data) {
            const newSensorData = {
              mainL1_NVoltage: data.mainL1_NVoltage ?? 0,
              mainL2_NVoltage: data.mainL2_NVoltage ?? 0,
              mainL3_NVoltage: data.mainL3_NVoltage ?? 0,
              genL1_NVoltage: data.genL1_NVoltage ?? 0,
              genL2_NVoltage: data.genL2_NVoltage ?? 0,
              genL3_NVoltage: data.genL3_NVoltage ?? 0,
              genL1_NCurrent: data.genL1_NCurrent ?? 0,
              genL2_NCurrent: data.genL2_NCurrent ?? 0,
              genL3_NCurrent: data.genL3_NCurrent ?? 0,
              KW: data.KW ?? 0,
              RPM: data.RPM ?? 0,
              batteryVoltage: data.batteryVoltage ?? 0,
              fuelLevel: data.fuelLevel ?? 0,
            };

            setSensorData(newSensorData);
            
            // Check for new alarms
            const newAlarms = checkForAlarms(newSensorData);
            if (newAlarms && newAlarms.length > 0) {
              setAlarms(prevAlarms => {
                const combined = [...newAlarms, ...prevAlarms];
                return combined.slice(0, 50); // Keep only latest 50 alarms
              });
            }

            setIsConnected(true);
            setIsLoading(false);
            setFirebaseError(null);
          }
        }, (error) => {
          console.error("Firebase connection error:", error);
          setFirebaseError("Connection lost");
          setIsConnected(false);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Firebase setup error:", error);
        setFirebaseError("Failed to connect to data source");
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    if (isFirebaseInitialized() && firebaseInitialized) {
      setupFirebaseListener();
    } else {
      initializationCheck = setInterval(() => {
        if (isFirebaseInitialized() && firebaseInitialized) {
          clearInterval(initializationCheck);
          setupFirebaseListener();
        }
      }, 500);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (initializationCheck) clearInterval(initializationCheck);
    };
  }, [firebaseInitialized, settings]);

  // Add initial system messages
  useEffect(() => {
    if (isConnected && alarms.length === 0) {
      const timestamp = new Date().toLocaleTimeString();
      setAlarms([
        {
          id: 'system-init',
          message: 'System monitoring started',
          timestamp,
          severity: 'low',
          type: 'system'
        }
      ]);
    }
  }, [isConnected]);

  const getSeverityColor = (severity: AlarmData['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-800 border-red-600 text-red-100';
      case 'high': return 'bg-orange-800 border-orange-600 text-orange-100';
      case 'medium': return 'bg-yellow-800 border-yellow-600 text-yellow-100';
      case 'low': return 'bg-blue-800 border-blue-600 text-blue-100';
      default: return 'bg-gray-800 border-gray-600 text-gray-100';
    }
  };

  const getSeverityIcon = (severity: AlarmData['severity']) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '•';
    }
  };

  const clearAlarms = () => {
    setAlarms([]);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl shadow-lg p-4 bg-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">ALARM SYSTEM</h3>
          <div className="animate-pulse">
            <WifiOff className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="text-center text-gray-600">
          <p>Connecting to monitoring system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-lg p-4 bg-gray-100 text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">ALARM SYSTEM</h3>
          {firebaseError && (
            <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
              {firebaseError}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg hover:bg-gray-200"
            title={isMuted ? "Unmute alarms" : "Mute alarms"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-green-400" />
            )}
          </button>
          
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-400" title="Connected" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" title="Disconnected" />
          )}
          
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          
          {alarms.length > 0 && (
            <button
              onClick={clearAlarms}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              title="Clear all alarms"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg p-4 h-48 overflow-y-auto bg-gray-50">
        {alarms.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <span>No active alarms</span>
          </div>
        ) : (
          <div className="space-y-2">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-2 rounded text-sm transition-all duration-300 ${getSeverityColor(alarm.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <span className="text-base">{getSeverityIcon(alarm.severity)}</span>
                    <div>
                      <p className="font-medium">{alarm.message}</p>
                      <p className="text-xs opacity-75">{alarm.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded uppercase">
                    {alarm.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>Total Alarms: {alarms.length}</span>
        <span>Status: {isMuted ? 'Muted' : isConnected ? 'Active' : 'Disconnected'}</span>
      </div>
    </div>
  );
};