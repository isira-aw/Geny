import React, { useState, useEffect } from "react";
import { Battery, Gauge } from "lucide-react";
import { ref, onValue } from "firebase/database";
import {
  getDatabaseInstance,
  isFirebaseInitialized,
} from "../firebase/firebase";

export const SpeedMeters: React.FC = () => {
  const [kilowatts, setKilowatts] = useState(0);
  const [batteryLife, setBatteryLife] = useState(0);
  const [rpm, setrpm] = useState(0);
  const [showBattery, setShowBattery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const realMaxRPM = 2000;
  const realMaxKilowatts = 1000;
  const upperlimit = { value: 800 };

  useEffect(() => {
    let unsubscribe: () => void;
    let initializationCheck: NodeJS.Timeout;

    const setupFirebaseListener = () => {
      try {
        const db = getDatabaseInstance();
        const sensorRef = ref(db, "Sensor");

        unsubscribe = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          setKilowatts(data?.KW ?? 0);
          setBatteryLife(data?.batteryVoltage ?? 0);
          setrpm(data?.RPM ?? 0);
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
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Performance Meters
          </h3>
          <Gauge className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Performance Meters
          </h3>
          <Gauge className="w-10 h-10 text-red-600" />
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

  return (
    <div className="bg-white rounded-2xl p-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Performance Meters</h3>
        <Gauge className="w-10 h-10 text-blue-600" />
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-0 p-0">
        {/* Kilowatts Meter */}
        <div className="w-full md:flex-1 bg-gray-100 rounded-xl shadow-md p-4 flex flex-col items-center justify-center mt-4 md:mt-0">
          <span className="text-sm text-gray-600 mb-2"> Kilowatts </span>
          <div className="w-full max-w-md relative">
            {/* Bar container */}
            <div className="w-full h-5 rounded-lg overflow-hidden bg-gray-300 relative">
              {/* Base fill */}
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(kilowatts / realMaxKilowatts) * 100}%`,
                  backgroundColor:
                    kilowatts < upperlimit.value ? "#0000009d" : "#ff3c0085",
                }}
              />

              {/* Red margin at upper threshold (static) */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(upperlimit.value / realMaxKilowatts) * 100}%`,
                  width: "4px",
                  backgroundColor: "#f30018ff",
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex justify-between text-xs text-gray-500 mt-1 select-none max-w-md mx-auto">
              <span>0</span>
              <span>{(realMaxKilowatts * 1) / 4}</span>
              <span>{realMaxKilowatts / 2}</span>
              <span>{(realMaxKilowatts * 3) / 4}</span>
              <span>{realMaxKilowatts} kW</span>
            </div>

            <div className="text-center mt-2 font-mono text-sm">
              {kilowatts.toFixed(2)} kW
            </div>
          </div>
        </div>

        {/* RPM Meter */}
        <div className="w-full md:flex-1 bg-gray-100 rounded-xl shadow-md p-4 flex flex-col items-center justify-center mt-4 md:mt-0">
          <span className="text-sm text-gray-600 mb-2">RPM</span>
          <div className="w-full max-w-md">
            {/* Simple single-color bar */}
            <div
              className="w-full h-5 rounded-lg overflow-hidden bg-gray-300"
              style={{ position: "relative" }}
            >
              <div
                className="h-full bg-gray-500 transition-all duration-500 rounded-lg"
                style={{ width: `${(rpm / realMaxRPM) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 select-none max-w-md mx-auto">
              <span>0</span>
              <span>{realMaxRPM} RPM</span>
            </div>
            <div className="text-center mt-2 font-mono text-sm">{rpm} RPM</div>
          </div>
        </div>
      </div>

      {/* Battery Button */}

      <div className="flex justify-between m-3 p-2 text-gray-500 ">
        <div className="text-sm text-gray-600">Engine Speed</div>
        <div className="text-xs text-gray-500 ">PF: 1 R</div>
      </div>

      <button
        onClick={() => setShowBattery(!showBattery)}
        className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Battery className="w-4 h-4" />
        <span>{batteryLife.toFixed(1)} V</span>
      </button>

      {/* Battery Popup */}
      {showBattery && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Battery Status
            </span>
            <button
              onClick={() => setShowBattery(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Voltage:</span>
              <span className="font-semibold">{batteryLife.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between">
              <span>Charge Level:</span>
              <span className="font-semibold">
                {Math.round((batteryLife / 30) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(batteryLife / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
