import React, { useState, useEffect } from "react";
import { Battery, Gauge } from "lucide-react";
import { ref, onValue } from "firebase/database";
import ReactSpeedometer from "react-d3-speedometer";
import { database } from "../firebase/firebase"; 

const realMaxKilowatts = 300;
const gaugeMax = 180;
const rpm = 1000;

export const SpeedMeters: React.FC = () => {
  const [kilowatts, setKilowatts] = useState(0);
  const [batteryLife, setBatteryLife] = useState(0);
  const [showBattery, setShowBattery] = useState(false);


  // Listen to Firebase Sensor data
  useEffect(() => {
    const sensorRef = ref(database, "Sensor");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setKilowatts(data?.mainVoltage ?? 0);
      setBatteryLife(data?.batteryVoltage ?? 0);
      console.log("Firebase update:", data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Performance Meters</h3>
        <Gauge className="w-10 h-10 text-blue-600" />
      </div>
      <br />
      <br />
      <div className="grid grid-cols-1 gap-6 p-6">
        {/* Kilowatts Meter */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 ">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ margin: "50px" }}>
                <span className="text-sm text-gray-600">kilowatts</span>
                <ReactSpeedometer
                  maxValue={200}
                  value={Math.min(
                    Math.max((kilowatts / realMaxKilowatts) * gaugeMax, 0.01),
                    gaugeMax - 0.01
                  )}
                  currentValueText={`KiloWatts: ${kilowatts}`}
                  customSegmentStops={[0, 45, 90, 135, 200]}
                  segmentColors={[
                    "#70da14ff",
                    "#fbff25ff",
                    "#ff7e57ff",
                    "#f30018ff",
                  ]}
                  textColor="black"
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* RPM Meter */}
<div className="text-center">
  <div className="relative w-32 h-32 mx-auto mb-4">
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div style={{ margin: "50px" }}>
        <span className="text-xs text-gray-600">RPM</span>

        <ReactSpeedometer
          maxValue={1000} 
          // value={Math.min(Math.max((rpm / 2000) * 180, 0.01), 179.99)} 
          value={Math.min(
                    Math.max(rpm * gaugeMax, 0.01),
                    gaugeMax - 0.01
                  )}
          customSegmentStops={[0, 1000]}
          segmentColors={[
            "#70da14ff",
            "#fbff25ff",
            "#ff7e57ff",
            "#f30018ff",
          ]}
          currentValueText={`RPM: ${rpm}`} 
          textColor={"black"}
        />
      </div>
    </div>
  </div>
  <div className="text-sm text-gray-600">Engine Speed</div>
  <div className="text-xs text-gray-500 mt-1">PF: 1 R</div>
</div>

        {/* Battery Button */}
        <button
          onClick={() => setShowBattery(!showBattery)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Battery className="w-4 h-4" />
          <span>{batteryLife.toFixed(1)} V</span>
        </button>

        {/* Battery Popup */}
        {/* {showBattery && (
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
                <span className="font-semibold">
                  {batteryLife.toFixed(1)} V
                </span>
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
        )} */}
      </div>
    </div>
  );
};
