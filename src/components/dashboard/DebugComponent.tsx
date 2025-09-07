// src/components/dashboard/DebugComponent.tsx
import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { getDatabaseInstance, isFirebaseInitialized } from "../firebase/firebase";
import { useSettings } from "../SettingsContext";

export const DebugComponent: React.FC = () => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { settings, deviceConfig, firebaseInitialized, debugInfo, loading, error } = useSettings();

  useEffect(() => {
    let unsubscribe: () => void;

    if (isFirebaseInitialized() && firebaseInitialized) {
      try {
        setConnectionStatus('Attempting connection...');
        const db = getDatabaseInstance();
        const sensorRef = ref(db, "Sensor");

        unsubscribe = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Firebase data received:', data);
          setSensorData(data);
          setConnectionStatus(data ? 'Connected and receiving data' : 'Connected but no data');
          setFirebaseError(null);
        }, (error) => {
          console.error('Firebase connection error:', error);
          setFirebaseError(error.message);
          setConnectionStatus('Connection error');
        });
      } catch (error) {
        console.error('Firebase setup error:', error);
        setFirebaseError((error as Error).message);
        setConnectionStatus('Setup error');
      }
    } else {
      setConnectionStatus('Firebase not initialized');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseInitialized]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Debug Information</h3>
      
      {/* Settings Context Status */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Settings Context Status</h4>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          <div>Firebase Initialized: {firebaseInitialized ? 'Yes' : 'No'}</div>
          <div>Settings Loaded: {settings ? 'Yes' : 'No'}</div>
          <div>Device Config Loaded: {deviceConfig ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Device Configuration */}
      {deviceConfig && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Device Configuration</h4>
          <div className="bg-gray-50 rounded p-3 text-sm">
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(deviceConfig, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Firebase Connection Status */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Firebase Connection</h4>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          <div>Status: <span className={`font-medium ${
            connectionStatus.includes('Connected') ? 'text-green-600' : 
            connectionStatus.includes('error') ? 'text-red-600' : 'text-yellow-600'
          }`}>{connectionStatus}</span></div>
          <div>Firebase Initialized: {isFirebaseInitialized() ? 'Yes' : 'No'}</div>
          {firebaseError && (
            <div className="text-red-600">Error: {firebaseError}</div>
          )}
        </div>
      </div>

      {/* Real-time Sensor Data */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Real-time Sensor Data</h4>
        <div className="bg-gray-50 rounded p-3 text-sm">
          {sensorData ? (
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(sensorData, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500">No data received</div>
          )}
        </div>
      </div>

      {/* Debug Log */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Debug Log</h4>
        <div className="bg-gray-50 rounded p-3 text-sm max-h-48 overflow-y-auto">
          {debugInfo.length > 0 ? (
            debugInfo.map((info, index) => (
              <div key={index} className="text-xs text-gray-700 mb-1">
                {info}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No debug information</div>
          )}
        </div>
      </div>

      {/* Test Database Connection */}
      <div className="flex space-x-2">
        <button
          onClick={() => {
            if (isFirebaseInitialized()) {
              try {
                const db = getDatabaseInstance();
                console.log('Database instance:', db);
                console.log('Database URL:', db.app.options.databaseURL);
              } catch (e) {
                console.error('Database test error:', e);
              }
            } else {
              console.log('Firebase not initialized');
            }
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
        >
          Test Database Connection
        </button>
        
        <button
          onClick={() => {
            console.log('Current Settings:', settings);
            console.log('Device Config:', deviceConfig);
            console.log('Firebase Initialized:', firebaseInitialized);
          }}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        >
          Log Current State
        </button>
      </div>
    </div>
  );
};