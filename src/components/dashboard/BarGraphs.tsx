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
import {
  getDatabaseInstance,
  isFirebaseInitialized,
} from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

const BarGraphs = () => {
  // const [phphv, set] = useState(0);
  // const [phphv, set] = useState(0);
  // const [phphv, set] = useState(0);

  // const [phphv, set] = useState(0);
  // const [phphv, set] = useState(0);
  // const [phphv, set] = useState(0);

  const [g_current_l1, set_g_current_l1] = useState(0);
  const [g_current_l2, set_g_current_l2] = useState(0);
  const [g_current_l3, set_g_current_l3] = useState(0);

  const [g_ph_n_v_l1, set_g_ph_n_v_l1] = useState(0);
  const [g_ph_n_v_l2, set_g_ph_n_v_l2] = useState(0);
  const [g_ph_n_v_l3, set_g_ph_n_v_l3] = useState(0);

  const [g_ph_phv_l1, set_g_ph_phv_l1] = useState(0);
  const [g_ph_phv_l2, set_g_ph_phv_l2] = useState(0);
  const [g_ph_phv_l3, set_g_ph_phv_l3] = useState(0);

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

          set_g_current_l1(data?.mainL1_NVoltage ?? 0);
          set_g_current_l2(data?.mainL2_NVoltage ?? 0);
          set_g_current_l3(data?.mainL3_NVoltage ?? 0);

          set_g_ph_n_v_l1(data?.genL1_NVoltage ?? 0);
          set_g_ph_n_v_l2(data?.genL2_NVoltage ?? 0);
          set_g_ph_n_v_l3(data?.genL3_NVoltage ?? 0);

          set_g_ph_phv_l1(data?.genL1_NCurrent ?? 0);
          set_g_ph_phv_l2(data?.genL2_NCurrent ?? 0);
          set_g_ph_phv_l3(data?.genL3_NCurrent ?? 0);
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
          System Data
        </button>
      </div>
    );
  }
  const data_1 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 50 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_1 = 84;
  const lowerLimit_1 = 25;

  const YAxislist_1 = [0, 320];

  const data_2 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 92 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_2 = 84;
  const lowerLimit_2 = 25;

  const YAxislist_2 = [0, 500];

  const data_3 = [
    { name: "L1-N", value: Math.floor(g_current_l1) },
    { name: "L2-N", value: Math.floor(g_current_l2) },
    { name: "L3-N", value: Math.floor(g_current_l3) },
  ];

  const upperLimit_3 = 240;
  // const lowerLimit_3 = 0;

  const YAxislist_3 = [0, 320];

  const data_4 = [
    { name: "L1-N", value: Math.floor(g_ph_n_v_l1) },
    { name: "L2-N", value: Math.floor(g_ph_n_v_l2) },
    { name: "L3-N", value: Math.floor(g_ph_n_v_l3) },
  ];

  const upperLimit_4 = 230;
  const lowerLimit_4 = 200;

  const YAxislist_4 = [0, 320];

  const data_5 = [
    { name: "L1-N", value: Math.floor(g_ph_phv_l1) },
    { name: "L2-N", value: Math.floor(g_ph_phv_l2) },
    { name: "L3-N", value: Math.floor(g_ph_phv_l3) },
  ];

  const upperLimit_5 = 60;
  const lowerLimit_5 = 50;

  const YAxislist_5 = [0, 100];

  const getBarColor_1 = (value: number): string => {
    if (value > upperLimit_1) return "#911b00be";
    if (value < lowerLimit_1) return "#911b00be ";
    return "#00aa0eb6";
  };
  const getBarColor_2 = (value: number): string => {
    if (value > upperLimit_2) return "#911b00be";
    if (value < lowerLimit_2) return "#911b00be ";
    return "#00aa0eb6";
  };

  const getBarColor_3 = (value: number): string => {
    if (value > upperLimit_3) return "#911b00be";
    // if (value < lowerLimit_3) return "#911b00be ";
    return "#00aa0eb6";
  };

  const getBarColor_4 = (value: number): string => {
    if (value > upperLimit_4) return "#911b00be";
    if (value < lowerLimit_4) return "#911b00be ";
    return "#00aa0eb6";
  };

  const getBarColor_5 = (value: number): string => {
    if (value > upperLimit_5) return "#911b00be";
    if (value < lowerLimit_5) return "#911b00be ";
    return "#00aa0eb6";
  };

  return (
    <div className="rounded-2xl shadow-lg p-2 bg-gray-100 text-sm text-gray-700 mb-1 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 w-full max-w-6xl mx-auto">
        {/* LEFT SIDE: 2/5 on large screens */}
        <div className="bg-transparent p-4 flex items-center justify-center text-center w-full gap-2 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2">
          <span className="text-2xl">⚡</span>
          <span className="text-sm text-gray-600">Load :</span>
          <span className="text-lg font-semibold text-gray-800">50</span>
          <span className="text-sm text-gray-600">Hz</span>
        </div>

        {/* RIGHT SIDE: 3/5 on large screens */}
        <div className="bg-transparent p-4 flex items-center justify-center text-center w-full gap-2 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3">
          <span className="text-2xl">🧰</span>
          <span className="text-sm text-gray-600">Generator :</span>
          <span className="text-lg font-semibold text-gray-800">50</span>
          <span className="text-sm text-gray-600">Hz</span>
        </div>
      </div>

      {/* Responsive Grid: 1 column on mobile, 5 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {/* Bar Graph Card 1 */}
        <div className="p-2 rounded shadow bg-white">
          <h2 className="text-base font-semibold mb-2 text-center">Ph-N[N]</h2>
          <ResponsiveContainer width="100%" height={200} className="-ml-4">
            <BarChart data={data_1}>
              <XAxis dataKey="name" />
              <YAxis domain={YAxislist_1} />
              <ReferenceLine y={upperLimit_1} stroke="red" strokeWidth={1} />
              <ReferenceLine y={lowerLimit_1} stroke="red" strokeWidth={1} />
              <Bar dataKey="value">
                {data_1.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor_1(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="Black"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph Card 2 */}
        <div className="p-2 rounded shadow bg-white">
          <h2 className="text-base font-semibold mb-2 text-center">Ph-Ph[V]</h2>
          <ResponsiveContainer width="100%" height={200} className="-ml-4">
            <BarChart data={data_2}>
              <XAxis dataKey="name" />
              <YAxis domain={YAxislist_2} />
              <ReferenceLine y={upperLimit_2} stroke="red" strokeWidth={1} />
              <ReferenceLine y={lowerLimit_2} stroke="red" strokeWidth={1} />
              <Bar dataKey="value">
                {data_2.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor_2(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="Black"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph Card 3 */}
        <div className="p-2 rounded shadow bg-white">
          <h2 className="flex items-center space-x-2 text-base font-semibold mb-2 text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 text-sm font-semibold mr-2 ml-7">
              G
            </div>
            Current[A]
          </h2>
          <ResponsiveContainer width="100%" height={200} className="-ml-4">
            <BarChart data={data_3}>
              <XAxis dataKey="name" />
              <YAxis domain={YAxislist_3} />
              <ReferenceLine y={upperLimit_3} stroke="red" strokeWidth={1} />
              {/* <ReferenceLine y={lowerLimit_3} stroke="red" strokeWidth={3} /> */}
              <Bar dataKey="value">
                {data_3.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor_3(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="Black"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph Card 4 */}
        <div className="p-2 rounded shadow bg-white">
          <h2 className="flex items-center space-x-2 text-base font-semibold mb-2 text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 text-sm font-semibold mr-2 ml-7">
              G
            </div>
            Ph-N[N]
          </h2>
          <ResponsiveContainer width="100%" height={200} className="-ml-4">
            <BarChart data={data_4}>
              <XAxis dataKey="name" />
              <YAxis domain={YAxislist_4} />
              <ReferenceLine y={upperLimit_4} stroke="red" strokeWidth={1} />
              <ReferenceLine y={lowerLimit_4} stroke="red" strokeWidth={1} />
              <Bar dataKey="value">
                {data_4.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor_4(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="Black"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph Card 5 */}
        <div className="p-2 rounded shadow bg-white">
          <h2 className="flex items-center space-x-2 text-base font-semibold mb-2 text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 text-sm font-semibold mr-2 ml-7">
              G
            </div>
            PH-N[V]
          </h2>
          <ResponsiveContainer width="100%" height={200} className="-ml-4">
            <BarChart data={data_5}>
              <XAxis tick={{ fontSize: 12, fill: "black" }} dataKey="name" />
              <YAxis domain={YAxislist_5} />
              <ReferenceLine y={upperLimit_5} stroke="red" strokeWidth={1} />
              <ReferenceLine y={lowerLimit_5} stroke="red" strokeWidth={1} />
              <Bar dataKey="value">
                {data_5.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor_5(entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="Black"
                  fontSize={12}
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
