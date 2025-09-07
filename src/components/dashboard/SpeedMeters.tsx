import React, { useState, useEffect } from "react";
import { Battery } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { getDatabaseInstance, isFirebaseInitialized } from "../firebase/firebase";
import { Gauge } from "@mui/x-charts/Gauge";
import Stack from "@mui/material/Stack";
import { useSettings } from "../SettingsContext";

export const SpeedMeters: React.FC = () => {
  const [kilowatts, setKilowatts] = useState(0);
  const [batteryLife, setBatteryLife] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [showBattery, setShowBattery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Get settings from context
  const { settings, firebaseInitialized } = useSettings();

  // Use settings for thresholds or defaults
  const powerUpperLimit = settings?.powerUpperLimit ?? 1000;
  const rpmUpperLimit = settings?.rpmUpperLimit ?? 1600;
  const rpmLowerLimit = settings?.rpmLowerLimit ?? 1200;
  const batteryUpper = settings?.batteryVoltageUpperLimit ?? 14;
  const batteryLower = settings?.batteryVoltageLowerLimit ?? 11;

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
          setRpm(data?.RPM ?? 0);
          setIsLoading(false);
          setFirebaseError(null);
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-[#D2C1B6]/20">
        <h3 className="text-lg font-bold text-[#1B3C53] mb-4">Performance Meters</h3>
        <p className="text-[#456882]">Loading data...</p>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-[#D2C1B6]/20">
        <h3 className="text-lg font-bold text-[#1B3C53] mb-4">Performance Meters</h3>
        <p className="text-red-500">{firebaseError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#1B3C53] hover:bg-[#456882] text-white px-4 py-2 rounded-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Power gauge color logic
  const getPowerColor = () => {
    if (kilowatts > powerUpperLimit) return "#dc2626";
    return "#16a34a";
  };

  // RPM gauge color logic
  const getRpmColor = () => {
    if (rpm >= rpmLowerLimit && rpm <= rpmUpperLimit) return "#16a34a"; // Normal (green)
    if (rpm > rpmUpperLimit) return "#dc2626"; // High (red)
    return "#f59e0b"; // Low (yellow)
  };

  // Battery status
  const getBatteryStatus = () => {
    if (batteryLife >= batteryUpper) return { color: "#16a34a", status: "Excellent" };
    if (batteryLife >= batteryLower) return { color: "#f59e0b", status: "Good" };
    return { color: "#dc2626", status: "Low" };
  };

  const batteryStatus = getBatteryStatus();

  return (
    <div className="bg-[#F9F3EF] rounded-2xl p-4 shadow-lg border border-[#D2C1B6]/20">
      <h3 className="text-lg font-bold text-[#1B3C53] mb-4 text-center">Performance Meters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Power Meter */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-[#D2C1B6]/20">
          <h4 className="text-sm font-semibold text-[#456882] mb-3 text-center">Power Output</h4>
          <div className="flex flex-col items-center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Gauge
                width={200}
                height={120}
                value={kilowatts}
                valueMax={powerUpperLimit}
                startAngle={-90}
                endAngle={90}
                sx={{
                  "& .MuiGauge-valueArc": {
                    fill: getPowerColor(),
                  },
                  "& .MuiGauge-referenceArc": {
                    fill: "#e5e7eb",
                  },
                  "& .MuiGauge-valueText": {
                    display: "none",
                  },
                }}
              />
            </Stack>
            <div className="text-center mt-2">
              <p className="text-xl font-bold text-[#1B3C53]">{kilowatts.toFixed(1)} kW</p>
              <p className="text-xs text-[#456882]">Max: {powerUpperLimit} kW</p>
            </div>
          </div>
        </div>

        {/* RPM Meter */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-[#D2C1B6]/20">
          <h4 className="text-sm font-semibold text-[#456882] mb-3 text-center">Engine RPM</h4>
          <div className="flex flex-col items-center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Gauge
                width={200}
                height={120}
                value={rpm}
                valueMax={2000}
                startAngle={-90}
                endAngle={90}
                sx={{
                  "& .MuiGauge-valueArc": {
                    fill: getRpmColor(),
                  },
                  "& .MuiGauge-referenceArc": {
                    fill: "#e5e7eb",
                  },
                  "& .MuiGauge-valueText": {
                    display: "none",
                  },
                }}
              />
            </Stack>
            <div className="text-center mt-2">
              <p className="text-xl font-bold text-[#1B3C53]">{rpm.toFixed(0)} RPM</p>
              <p className="text-xs text-[#456882]">Range: {rpmLowerLimit}-{rpmUpperLimit} RPM</p>
            </div>

            {/* RPM Status Indicators */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-[#456882]">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[#456882]">Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[#456882]">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Status */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowBattery(!showBattery)}
          className="flex items-center space-x-3 bg-white hover:bg-[#F9F3EF] border border-[#D2C1B6] px-6 py-3 rounded-lg transition-colors duration-200 shadow-md"
          style={{ color: batteryStatus.color }}
        >
          <Battery className="w-5 h-5" />
          <div className="text-left">
            <p className="font-semibold">{batteryLife.toFixed(1)} V</p>
            <p className="text-xs opacity-80">{batteryStatus.status}</p>
          </div>
        </button>
      </div>

      {/* Battery Details Popup */}
      {showBattery && (
        <div className="mt-4 bg-white border border-[#D2C1B6] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#1B3C53]">Battery Details</h4>
            <button
              onClick={() => setShowBattery(false)}
              className="text-[#456882] hover:text-[#1B3C53] font-bold text-lg"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#456882]">Current Voltage:</span>
              <span className="font-semibold text-[#1B3C53]">{batteryLife.toFixed(2)} V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#456882]">Status:</span>
              <span className="font-semibold" style={{ color: batteryStatus.color }}>
                {batteryStatus.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#456882]">Normal Range:</span>
              <span className="font-semibold text-[#1B3C53]">{batteryLower}V - {batteryUpper}V</span>
            </div>
            
            {/* Battery Level Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-[#456882] mb-1">
                <span>{batteryLower}V</span>
                <span>{batteryUpper}V</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: batteryStatus.color,
                    width: `${Math.min(Math.max(((batteryLife - batteryLower) / (batteryUpper - batteryLower)) * 100, 0), 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Warning Messages */}
            {batteryLife > batteryUpper && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3">
                <p className="text-red-700 text-xs">⚠️ Battery voltage above safe limit</p>
              </div>
            )}
            {batteryLife < batteryLower && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3">
                <p className="text-red-700 text-xs">⚠️ Battery voltage below safe limit</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};