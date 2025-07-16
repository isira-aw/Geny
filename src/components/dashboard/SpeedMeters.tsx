import React, { useState, useEffect } from "react";
import { Battery } from "lucide-react";
import { ref, onValue } from "firebase/database";
import {
  getDatabaseInstance,
  isFirebaseInitialized,
} from "../firebase/firebase";
import { Gauge } from "@mui/x-charts/Gauge";
import Stack from "@mui/material/Stack";

export const SpeedMeters: React.FC = () => {
  const [kilowatts, setKilowatts] = useState(0);
  const [batteryLife, setBatteryLife] = useState(0);
  const [rpm, setrpm] = useState(0);
  const [showBattery, setShowBattery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const realMaxKilowatts = 1000;
  const upperlimit = { value: 100 };


  const realMaxRPM = 2000;
  const upperlimit_RPM = { value: 1600 };
  const lowerlimit_RPM = { value: 1200 };

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
    <div className="bg-gray-100 rounded-2xl p-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Performance Meters</h3>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-0 p-0">
        {/* Kilowatts Meter */}
        <div className="w-full md:flex-1 bg-gray-100 rounded-xl shadow-md p-4 flex flex-col items-center justify-center mt-4 md:mt-0">
          <span className="text-sm text-gray-600 mb-2"> Kilowatts </span>
          <div className="w-full max-w-md relative flex flex-col items-center justify-center">
            {(() => {
              const isDanger = kilowatts > upperlimit.value;
              return (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Gauge
                    width={260}
                    height={140}
                    value={kilowatts}
                    valueMax={realMaxKilowatts}
                    startAngle={-90}
                    endAngle={90}
                    sx={{
                      "& .MuiGauge-valueArc": {
                        fill: isDanger ? "#911b00be" : "#00aa0eb6",
                      },
                      "& .MuiGauge-referenceArc": {
                        fill: "#d0d1d4ff",
                      },
                      "& .MuiGauge-valueText": {
                        display: "none",
                      },
                    }}
                  />
                </Stack>
              );
            })()}
            <div className="flex items-center gap-4 justify-center mb-2">
              {/* Normal Range */}
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#0000008a" }}
                ></div>
                <span>Normal Range</span>
              </div>

              {/* High Range */}
              <div className="flex items-center gap-1 text-xs text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span>High Range</span>
              </div>
            </div>
            <div className="text-center mt-3 font-mono font-semibold text-lg text-gray-800  select-none">
              {kilowatts.toFixed(2)} kW
            </div>
          </div>
        </div>

        {/* RPM Meter */}
        <div className="w-full md:flex-1 bg-gray-100 rounded-xl shadow-md p-4 flex flex-col items-center justify-center mt-4 md:mt-0">
          <span className="text-sm text-gray-600 mb-2">RPM</span>
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            {(() => {
              // Dynamically determine RPM color
              let fillColor = "#3c67bdb4"; // Default: Low (gray)
              if (rpm >= lowerlimit_RPM.value && rpm <= upperlimit_RPM.value) {
                fillColor = "#00aa0eb6"; // Normal (green)
              } else if (rpm > upperlimit_RPM.value) {
                fillColor = "#911b00be"; // High (red)
              }

              return (
                <>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Gauge
                      width={260}
                      height={140}
                      value={rpm}
                      valueMax={realMaxRPM}
                      startAngle={-90}
                      endAngle={90}
                      sx={{
                        "& .MuiGauge-valueArc": {
                          fill: fillColor,
                        },
                        "& .MuiGauge-referenceArc": {
                          fill: "#d0d1d4ff",
                        },
                        "& .MuiGauge-valueText": {
                          display: "none",
                        },
                      }}
                    />
                  </Stack>

                  {/* Legend */}
                  <div className="flex items-center gap-4 justify-center mb-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <div className="w-3 h-3 rounded-sm bg-gray-500"></div>
                      <span>Low Range</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span>Normal Range</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                      <span>High Range</span>
                    </div>
                  </div>

                  <div className="text-center mt-3 font-mono font-semibold text-lg text-gray-800 select-none">
                    {rpm.toFixed(0)} RPM
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Battery Button */}

      <button
        onClick={() => setShowBattery(!showBattery)}
        className= " w-full flex items-center justify-center space-x-2 bg-[#555879] hover:bg-[#444c5c] px-4 py-2 rounded-lg transition-colors w-[150px] mt-4 mx-auto text-white font-semibold shadow-md"
      >
        <Battery className="w-6 h-6 text-white  " />
        <span className="text-white ">{batteryLife.toFixed(1)} V</span>
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
