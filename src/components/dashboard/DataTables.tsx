import React, { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { ref, onValue } from "firebase/database";
import {
  getDatabaseInstance,
  isFirebaseInitialized,
} from "../firebase/firebase";

export const DataTables: React.FC = () => {
  const [FuelLevel, setFuelLevel] = useState(0);
  // const [batteryLife, setBatteryLife] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    let initializationCheck: NodeJS.Timeout;

    const setupFirebaseListener = () => {
      try {
        const db = getDatabaseInstance();
        const sensorRef = ref(db, "Sensor");

        unsubscribe = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          setFuelLevel(data?.fuelLevel ?? 0);
          // setBatteryLife(data?.batteryVoltage ?? 0);
          setIsLoading(false);
          setFirebaseError(null);
        });
      } catch (error) {
        console.error("Firebase connection error:", error);
        setFirebaseError("Failed to connect to data source");
        setIsLoading(false);
      }
    };

    if (isFirebaseInitialized()) {
      setupFirebaseListener();
    } else {
      initializationCheck = setInterval(() => {
        if (isFirebaseInitialized()) {
          clearInterval(initializationCheck);
          setupFirebaseListener();
        }
      }, 500);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (initializationCheck) clearInterval(initializationCheck);
    };
  }, []);
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
          System Data
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        <Database className="w-6 h-6 text-blue-600" />
      </div>

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Running Hours</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    12.9
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">h</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Fuel Level</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    26
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Coolant Temp</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    85
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">°C</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Oil Pressure</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    4.2
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">bar</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">Maintenance Timer</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">
                    3
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Analog Inputs Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Analog Inputs
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Not Used</span>
              <span className="font-mono text-gray-900">### Bar</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coolant Temp</span>
              <span className="font-mono text-gray-900">### °C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fuel Level</span>
              <span className="font-mono text-gray-900">{FuelLevel} %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Not Used</span>
              <span className="font-mono text-gray-900">###</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
