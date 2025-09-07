import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList,
} from "recharts";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { getDatabaseInstance, isFirebaseInitialized } from "../firebase/firebase";
import { useSettings } from "../SettingsContext";

const BarGraphs = () => {
  // Real-time data from Firebase
  const [mainL1_NVoltage, setMainL1_NVoltage] = useState(0);
  const [mainL2_NVoltage, setMainL2_NVoltage] = useState(0);
  const [mainL3_NVoltage, setMainL3_NVoltage] = useState(0);

  const [genL1_NVoltage, setGenL1_NVoltage] = useState(0);
  const [genL2_NVoltage, setGenL2_NVoltage] = useState(0);
  const [genL3_NVoltage, setGenL3_NVoltage] = useState(0);

  const [genL1_NCurrent, setGenL1_NCurrent] = useState(0);
  const [genL2_NCurrent, setGenL2_NCurrent] = useState(0);
  const [genL3_NCurrent, setGenL3_NCurrent] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Get settings from context
  const { settings, firebaseInitialized } = useSettings();

  useEffect(() => {
    let unsubscribe: () => void;
    let initializationCheck: NodeJS.Timeout;

    const setupFirebaseListener = () => {
      try {
        const db = getDatabaseInstance();
        const sensorRef = ref(db, "Sensor");

        unsubscribe = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();

          // Main voltage data
          setMainL1_NVoltage(data?.mainL1_NVoltage ?? 0);
          setMainL2_NVoltage(data?.mainL2_NVoltage ?? 0);
          setMainL3_NVoltage(data?.mainL3_NVoltage ?? 0);

          // Generator voltage data
          setGenL1_NVoltage(data?.genL1_NVoltage ?? 0);
          setGenL2_NVoltage(data?.genL2_NVoltage ?? 0);
          setGenL3_NVoltage(data?.genL3_NVoltage ?? 0);

          // Generator current data
          setGenL1_NCurrent(data?.genL1_NCurrent ?? 0);
          setGenL2_NCurrent(data?.genL2_NCurrent ?? 0);
          setGenL3_NCurrent(data?.genL3_NCurrent ?? 0);

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
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">System Data</h3>
        </div>
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
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

  // Use settings for thresholds or defaults
  const mainVoltageUpper = settings?.mainVoltageUpperLimit ?? 240;
  const mainVoltageLower = settings?.mainVoltageLowerLimit ?? 200;
  const genVoltageUpper = settings?.genVoltageUpperLimit ?? 240;
  const genVoltageLower = settings?.genVoltageLowerLimit ?? 200;
  const currentUpper = settings?.currentUpperLimit ?? 100;

  // Chart data with real-time values
  const mainVoltageData = [
    { name: "L1-N", value: Math.floor(mainL1_NVoltage) },
    { name: "L2-N", value: Math.floor(mainL2_NVoltage) },
    { name: "L3-N", value: Math.floor(mainL3_NVoltage) },
  ];

  const genVoltageData = [
    { name: "L1-N", value: Math.floor(genL1_NVoltage) },
    { name: "L2-N", value: Math.floor(genL2_NVoltage) },
    { name: "L3-N", value: Math.floor(genL3_NVoltage) },
  ];

  const genCurrentData = [
    { name: "L1-N", value: Math.floor(genL1_NCurrent) },
    { name: "L2-N", value: Math.floor(genL2_NCurrent) },
    { name: "L3-N", value: Math.floor(genL3_NCurrent) },
  ];

  // Color functions using settings
  const getMainVoltageColor = (value: number): string => {
    if (value > mainVoltageUpper || value < mainVoltageLower) return "#dc2626";
    return "#16a34a";
  };

  const getGenVoltageColor = (value: number): string => {
    if (value > genVoltageUpper || value < genVoltageLower) return "#dc2626";
    return "#16a34a";
  };

  const getCurrentColor = (value: number): string => {
    if (value > currentUpper) return "#dc2626";
    return "#16a34a";
  };

  return (
    <div className="rounded-2xl shadow-lg p-4 bg-[#F9F3EF] border border-[#D2C1B6]/20">
      {/* System Status Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl flex items-center justify-center text-center border border-[#D2C1B6]/20">
          <span className="text-2xl mr-2">⚡</span>
          <span className="text-sm text-[#456882]">Load:</span>
          <span className="text-lg font-semibold text-[#1B3C53] ml-1">50</span>
          <span className="text-sm text-[#456882] ml-1">Hz</span>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center justify-center text-center border border-[#D2C1B6]/20">
          <span className="text-2xl mr-2">🔧</span>
          <span className="text-sm text-[#456882]">Generator:</span>
          <span className="text-lg font-semibold text-[#1B3C53] ml-1">50</span>
          <span className="text-sm text-[#456882] ml-1">Hz</span>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Voltage Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#D2C1B6]/20">
          <h2 className="text-base font-semibold mb-3 text-center text-[#1B3C53]">Main Ph-N[V]</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mainVoltageData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#1B3C53" }} />
              <YAxis domain={[0, 320]} tick={{ fontSize: 10, fill: "#456882" }} />
              <ReferenceLine y={mainVoltageUpper} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={mainVoltageLower} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {mainVoltageData.map((entry, index) => (
                  <Cell
                    key={`main-voltage-${index}`}
                    fill={getMainVoltageColor(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#1B3C53"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Generator Voltage Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#D2C1B6]/20">
          <h2 className="text-base font-semibold mb-3 text-center text-[#1B3C53]">
            <span className="inline-flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#456882] text-[#456882] text-xs font-bold mr-2">
                G
              </div>
              Ph-N[V]
            </span>
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genVoltageData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#1B3C53" }} />
              <YAxis domain={[0, 320]} tick={{ fontSize: 10, fill: "#456882" }} />
              <ReferenceLine y={genVoltageUpper} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={genVoltageLower} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {genVoltageData.map((entry, index) => (
                  <Cell
                    key={`gen-voltage-${index}`}
                    fill={getGenVoltageColor(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#1B3C53"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Generator Current Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#D2C1B6]/20">
          <h2 className="text-base font-semibold mb-3 text-center text-[#1B3C53]">
            <span className="inline-flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#456882] text-[#456882] text-xs font-bold mr-2">
                G
              </div>
              Current[A]
            </span>
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genCurrentData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#1B3C53" }} />
              <YAxis domain={[0, 120]} tick={{ fontSize: 10, fill: "#456882" }} />
              <ReferenceLine y={currentUpper} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {genCurrentData.map((entry, index) => (
                  <Cell
                    key={`gen-current-${index}`}
                    fill={getCurrentColor(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#1B3C53"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarGraphs;