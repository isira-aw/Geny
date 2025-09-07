// src/components/dashboard/DataTables.tsx
import React, { useState, useEffect } from "react";
import { Database, Settings, Save, RotateCcw } from "lucide-react";
import { ref, onValue } from "firebase/database";
import {
  getDatabaseInstance,
  isFirebaseInitialized,
} from "../firebase/firebase";
import { useSettings } from "../SettingsContext";

export const DataTables: React.FC = () => {
  // Real-time sensor data
  const [sensorData, setSensorData] = useState({
    fuelLevel: 0,
    batteryVoltage: 0,
    coolantTemp: 85, // Default value since not in Firebase yet
    oilPressure: 4.2, // Default value since not in Firebase yet
    runningHours: 12.9, // Default value since not in Firebase yet
    maintenanceTimer: 3, // Default value since not in Firebase yet
    KW: 0,
    RPM: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editableSettings, setEditableSettings] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const { settings, firebaseInitialized, updateSettings, error: settingsError } = useSettings();

  // Initialize editable settings when settings load
  useEffect(() => {
    if (settings) {
      setEditableSettings({ ...settings });
    }
  }, [settings]);

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
            setSensorData({
              fuelLevel: data.fuelLevel ?? 0,
              batteryVoltage: data.batteryVoltage ?? 0,
              coolantTemp: data.coolantTemp ?? 85,
              oilPressure: data.oilPressure ?? 4.2,
              runningHours: data.runningHours ?? 12.9,
              maintenanceTimer: data.maintenanceTimer ?? 3,
              KW: data.KW ?? 0,
              RPM: data.RPM ?? 0,
            });
          }
          setIsLoading(false);
          setFirebaseError(null);
        }, (error) => {
          console.error("Firebase connection error:", error);
          setFirebaseError("Failed to connect to data source");
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Firebase connection error:", error);
        setFirebaseError("Failed to connect to data source");
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
  }, [firebaseInitialized]);

  const handleSettingsChange = (key: string, value: number) => {
    setEditableSettings((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    if (!editableSettings || !settings) return;
    
    setIsSaving(true);
    try {
      await updateSettings(editableSettings);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    if (settings) {
      setEditableSettings({ ...settings });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        </div>
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        </div>
        <p className="text-red-500">{firebaseError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const settingsConfig = [
    { key: 'mainVoltageUpperLimit', label: 'Main Voltage Upper Limit', unit: 'V', group: 'Voltage' },
    { key: 'mainVoltageLowerLimit', label: 'Main Voltage Lower Limit', unit: 'V', group: 'Voltage' },
    { key: 'genVoltageUpperLimit', label: 'Generator Voltage Upper Limit', unit: 'V', group: 'Voltage' },
    { key: 'genVoltageLowerLimit', label: 'Generator Voltage Lower Limit', unit: 'V', group: 'Voltage' },
    { key: 'currentUpperLimit', label: 'Current Upper Limit', unit: 'A', group: 'Current' },
    { key: 'currentLowerLimit', label: 'Current Lower Limit', unit: 'A', group: 'Current' },
    { key: 'powerUpperLimit', label: 'Power Upper Limit', unit: 'kW', group: 'Power' },
    { key: 'powerLowerLimit', label: 'Power Lower Limit', unit: 'kW', group: 'Power' },
    { key: 'rpmUpperLimit', label: 'RPM Upper Limit', unit: 'RPM', group: 'Engine' },
    { key: 'rpmLowerLimit', label: 'RPM Lower Limit', unit: 'RPM', group: 'Engine' },
    { key: 'coolantTempUpperLimit', label: 'Coolant Temp Upper Limit', unit: '°C', group: 'Temperature' },
    { key: 'coolantTempLowerLimit', label: 'Coolant Temp Lower Limit', unit: '°C', group: 'Temperature' },
    { key: 'fuelLevelWarningLimit', label: 'Fuel Warning Level', unit: '%', group: 'Fuel' },
    { key: 'fuelLevelCriticalLimit', label: 'Fuel Critical Level', unit: '%', group: 'Fuel' },
    { key: 'batteryVoltageUpperLimit', label: 'Battery Voltage Upper Limit', unit: 'V', group: 'Battery' },
    { key: 'batteryVoltageLowerLimit', label: 'Battery Voltage Lower Limit', unit: 'V', group: 'Battery' },
  ];

  const groupedSettings = settingsConfig.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, typeof settingsConfig>);

  return (
    <div className="bg-gray-100 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Configuration Settings"
          >
            <Settings className="w-5 h-5 text-blue-600" />
          </button>
          <Database className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">System Configuration</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetSettings}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {settingsError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {settingsError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedSettings).map(([group, settings]) => (
                <div key={group} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">{group}</h4>
                  <div className="space-y-3">
                    {settings.map((setting) => (
                      <div key={setting.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {setting.label}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editableSettings[setting.key] || 0}
                            onChange={(e) => handleSettingsChange(setting.key, parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="0.1"
                            min="0"
                          />
                          <span className="text-sm text-gray-500 min-w-[30px]">{setting.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* System Statistics Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            System Statistics
          </h4>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Metric
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">
                    Value
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">
                    Unit
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Running Hours</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.runningHours.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">h</td>
                  <td className="px-3 py-2 text-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Fuel Level</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.fuelLevel.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">%</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      sensorData.fuelLevel <= (settings?.fuelLevelCriticalLimit || 10) ? 'bg-red-500' :
                      sensorData.fuelLevel <= (settings?.fuelLevelWarningLimit || 25) ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Coolant Temp</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.coolantTemp.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">°C</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      sensorData.coolantTemp > (settings?.coolantTempUpperLimit || 90) ? 'bg-red-500' :
                      sensorData.coolantTemp < (settings?.coolantTempLowerLimit || 70) ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Oil Pressure</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.oilPressure.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">bar</td>
                  <td className="px-3 py-2 text-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Power Output</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.KW.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">kW</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      sensorData.KW > (settings?.powerUpperLimit || 1000) ? 'bg-red-500' : 'bg-green-500'
                    }`}></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Engine RPM</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.RPM.toFixed(0)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">RPM</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      sensorData.RPM > (settings?.rpmUpperLimit || 1600) ? 'bg-red-500' :
                      sensorData.RPM < (settings?.rpmLowerLimit || 1200) && sensorData.RPM > 0 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Maintenance Timer</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    {sensorData.maintenanceTimer.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">h</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      sensorData.maintenanceTimer <= 1 ? 'bg-red-500' :
                      sensorData.maintenanceTimer <= 5 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Analog Inputs Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Sensor Readings
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Battery Voltage</span>
              <span className="font-mono text-gray-900">{sensorData.batteryVoltage.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coolant Temperature</span>
              <span className="font-mono text-gray-900">{sensorData.coolantTemp.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fuel Level</span>
              <span className="font-mono text-gray-900">{sensorData.fuelLevel.toFixed(1)} %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Power Output</span>
              <span className="font-mono text-gray-900">{sensorData.KW.toFixed(1)} kW</span>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        {settings && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Configuration Status
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Device UID:</span>
                  <span className="ml-2 font-mono">{settings.deviceUid}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Settings:</span>
                  <span className="ml-2 text-green-600">Loaded</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};