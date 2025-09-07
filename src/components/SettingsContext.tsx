// src/components/SettingsContext.tsx - Debug Version
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeFirebase } from './firebase/firebase';
import { SettingsData, apiService, DeviceConfig } from './api';

interface SettingsContextType {
  settings: SettingsData | null;
  deviceConfig: DeviceConfig | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SettingsData>) => Promise<void>;
  firebaseInitialized: boolean;
  debugInfo: string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(`[DEBUG] ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-10));
  };

  const refreshSettings = async () => {
    const token = localStorage.getItem('deviceAuthToken');
    addDebugInfo(`Starting refresh. Token exists: ${!!token}`);
    
    if (!token) {
      setLoading(false);
      setError('No authentication token found');
      addDebugInfo('No token found, stopping');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      addDebugInfo('Starting device config fetch...');
      
      // First get device config to initialize Firebase
      const configResponse = await apiService.getDeviceConfig(token);
      addDebugInfo(`Config response status: ${configResponse.status}`);
      addDebugInfo(`Config response: ${JSON.stringify(configResponse, null, 2)}`);
      
      if (configResponse.status) {
        // Handle both possible response formats
        const configData = configResponse.data || configResponse.config;
        addDebugInfo(`Config data found: ${!!configData}`);
        
        if (configData) {
          addDebugInfo(`Config data: ${JSON.stringify(configData, null, 2)}`);
          setDeviceConfig(configData);
          
          // Validate required Firebase fields
          const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
          const missingFields = requiredFields.filter(field => !configData[field as keyof DeviceConfig]);
          
          if (missingFields.length > 0) {
            const errorMsg = `Missing Firebase config fields: ${missingFields.join(', ')}`;
            addDebugInfo(errorMsg);
            setError(errorMsg);
            return;
          }

          const firebaseConfig = {
            apiKey: configData.apiKey,
            authDomain: configData.authDomain,
            databaseURL: configData.databaseURL,
            projectId: configData.projectId,
            storageBucket: configData.storageBucket,
            messagingSenderId: configData.messagingSenderId,
            appId: configData.appId,
          };

          addDebugInfo(`Firebase config prepared: ${JSON.stringify(firebaseConfig, null, 2)}`);

          try {
            addDebugInfo('Attempting Firebase initialization...');
            await initializeFirebase(firebaseConfig);
            setFirebaseInitialized(true);
            addDebugInfo('Firebase initialized successfully!');
          } catch (firebaseError) {
            const errorMsg = `Firebase initialization error: ${firebaseError}`;
            addDebugInfo(errorMsg);
            console.error('Firebase initialization error:', firebaseError);
            setError('Failed to initialize Firebase connection');
          }
        } else {
          const errorMsg = 'No config data in response';
          addDebugInfo(errorMsg);
          setError(errorMsg);
        }
      } else {
        const errorMsg = configResponse.message || 'Failed to load device configuration';
        addDebugInfo(`Config fetch failed: ${errorMsg}`);
        setError(errorMsg);
      }

      // Then get device settings (with fallback to defaults)
      addDebugInfo('Attempting to fetch device settings...');
      try {
        const settingsResponse = await apiService.getSettings(token);
        addDebugInfo(`Settings response: ${JSON.stringify(settingsResponse, null, 2)}`);
        
        if (settingsResponse.status && settingsResponse.data) {
          setSettings(settingsResponse.data);
          addDebugInfo('Settings loaded from backend successfully');
        } else {
          addDebugInfo('No settings from backend, using defaults');
          const defaultSettings: SettingsData = {
            deviceUid: configResponse.data?.deviceUid || configResponse.config?.deviceUid || '',
            mainVoltageUpperLimit: 240,
            mainVoltageLowerLimit: 200,
            genVoltageUpperLimit: 240,
            genVoltageLowerLimit: 200,
            currentUpperLimit: 100,
            currentLowerLimit: 0,
            powerUpperLimit: 1000,
            powerLowerLimit: 0,
            rpmUpperLimit: 1600,
            rpmLowerLimit: 1200,
            coolantTempUpperLimit: 90,
            coolantTempLowerLimit: 70,
            fuelLevelWarningLimit: 25,
            fuelLevelCriticalLimit: 10,
            batteryVoltageUpperLimit: 14,
            batteryVoltageLowerLimit: 11,
          };
          setSettings(defaultSettings);
          addDebugInfo('Default settings applied');
        }
      } catch (settingsError) {
        addDebugInfo(`Settings API error: ${settingsError}`);
        // Use default settings if API fails
        const defaultSettings: SettingsData = {
          deviceUid: configResponse.data?.deviceUid || configResponse.config?.deviceUid || '',
          mainVoltageUpperLimit: 240,
          mainVoltageLowerLimit: 200,
          genVoltageUpperLimit: 240,
          genVoltageLowerLimit: 200,
          currentUpperLimit: 100,
          currentLowerLimit: 0,
          powerUpperLimit: 1000,
          powerLowerLimit: 0,
          rpmUpperLimit: 1600,
          rpmLowerLimit: 1200,
          coolantTempUpperLimit: 90,
          coolantTempLowerLimit: 70,
          fuelLevelWarningLimit: 25,
          fuelLevelCriticalLimit: 10,
          batteryVoltageUpperLimit: 14,
          batteryVoltageLowerLimit: 11,
        };
        setSettings(defaultSettings);
        addDebugInfo('Used default settings due to API error');
      }
    } catch (err) {
      const errorMsg = `Configuration fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      addDebugInfo(errorMsg);
      console.error('Settings fetch error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
      addDebugInfo('Refresh completed');
    }
  };

  const updateSettings = async (newSettings: Partial<SettingsData>) => {
    const token = localStorage.getItem('deviceAuthToken');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      addDebugInfo('Updating settings...');
      const response = await apiService.updateSettings(token, newSettings);
      if (response.success) {
        setSettings(prev => prev ? { ...prev, ...newSettings } : null);
        addDebugInfo('Settings updated successfully');
      } else {
        setError(response.message || 'Failed to update settings');
        addDebugInfo(`Settings update failed: ${response.message}`);
      }
    } catch (err) {
      const errorMsg = `Failed to update settings: ${err instanceof Error ? err.message : 'Unknown error'}`;
      addDebugInfo(errorMsg);
      console.error('Settings update error:', err);
      setError(errorMsg);
    }
  };

  useEffect(() => {
    addDebugInfo('SettingsProvider mounted, starting refresh...');
    refreshSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    deviceConfig,
    loading,
    error,
    refreshSettings,
    updateSettings,
    firebaseInitialized,
    debugInfo,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};