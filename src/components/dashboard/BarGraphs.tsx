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

import { BarChart2Icon } from 'lucide-react';

const BarGraphs = () => {
  const data_1 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 50 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_1 = 84;
  const lowerLimit_1 = 25;

  const YAxislist_1 = [0, 150];

  const data_2 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 92 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_2 = 84;
  const lowerLimit_2 = 25;

  const YAxislist_2 = [0, 400];

  const data_3 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 92 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_3 = 84;
  const lowerLimit_3 = 25;

  const YAxislist_3 = [0, 100];

  const data_4 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 50},
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_4 = 84;
  const lowerLimit_4 = 25;

  const YAxislist_4 = [0, 100];

  const data_5 = [
    { name: "L1-N", value: 85 },
    { name: "L2-N", value: 75 },
    { name: "L3-N", value: 10 },
  ];

  const upperLimit_5 = 84;
  const lowerLimit_5 = 25;

  const YAxislist_5 = [0, 100];

  const getBarColor_1 = (value: number): string => {
    if (value > upperLimit_1) return "#fc2e009a";
    if (value < lowerLimit_1) return "#fc2e009a ";
    return "#4fff4fff";
  };
  const getBarColor_2 = (value: number): string => {
    if (value > upperLimit_2) return "#fc2e009a";
    if (value < lowerLimit_2) return "#fc2e009a ";
    return "#4fff4fff";

  };

  const getBarColor_3 = (value: number): string => {
    if (value > upperLimit_3) return "#fc2e009a";
    if (value < lowerLimit_3) return "#fc2e009a ";
    return "#4fff4fff";
  };

  const getBarColor_4 = (value: number): string => {
    if (value > upperLimit_4) return "#fc2e009a";
    if (value < lowerLimit_4) return "#fc2e009a ";
    return "#4fff4fff";
  };

  const getBarColor_5 = (value: number): string => {
    if (value > upperLimit_5) return "#fc2e009a";
    if (value < lowerLimit_5) return "#fc2e009a ";
    return "#4fff4fff";
  };

  return (
    <div className="rounded-2xl shadow-lg p-4 bg-white text-sm text-gray-700 mb-3">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-bold m-5">System Data</h3>
    <BarChart2Icon className="w-12 h-12 p-2 text-blue-600" />
  </div>

  {/* Responsive Grid: 1 column on mobile, 5 columns on large screens */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {/* Bar Graph Card 1 */}
    <div className="p-2 rounded shadow bg-white">
      <h2 className="text-base font-semibold mb-2 text-center">Ph-N[N]</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data_1}>
          <XAxis dataKey="name" />
          <YAxis domain={YAxislist_1} />
          <ReferenceLine y={upperLimit_1} stroke="red" strokeWidth={3} />
          <ReferenceLine y={lowerLimit_1} stroke="red" strokeWidth={3} />
          <Bar dataKey="value">
            {data_1.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor_1(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" fill="Black" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Graph Card 2 */}
    <div className="p-2 rounded shadow bg-white">
      <h2 className="text-base font-semibold mb-2 text-center">Ph-Ph[V]</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data_2}>
          <XAxis dataKey="name" />
          <YAxis domain={YAxislist_2} />
          <ReferenceLine y={upperLimit_2} stroke="red" strokeWidth={3} />
          <ReferenceLine y={lowerLimit_2} stroke="red" strokeWidth={3} />
          <Bar dataKey="value">
            {data_2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor_2(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" fill="Black" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Graph Card 3 */}
    <div className="p-2 rounded shadow bg-white">
      <h2 className="text-base font-semibold mb-2 text-center">Generator Current[A]</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data_3}>
          <XAxis dataKey="name" />
          <YAxis domain={YAxislist_3} />
          <ReferenceLine y={upperLimit_3} stroke="red" strokeWidth={3} />
          <ReferenceLine y={lowerLimit_3} stroke="red" strokeWidth={3} />
          <Bar dataKey="value">
            {data_3.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor_3(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" fill="Black" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Graph Card 4 */}
    <div className="p-2 rounded shadow bg-white">
      <h2 className="text-base font-semibold mb-2 text-center">Generator Ph-N[N]</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data_4}>
          <XAxis dataKey="name" />
          <YAxis domain={YAxislist_4} />
          <ReferenceLine y={upperLimit_4} stroke="red" strokeWidth={3} />
          <ReferenceLine y={lowerLimit_4} stroke="red" strokeWidth={3} />
          <Bar dataKey="value">
            {data_4.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor_4(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" fill="Black" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Graph Card 5 */}
    <div className="p-2 rounded shadow bg-white">
      <h2 className="text-base font-semibold mb-2 text-center">Generator PH-N[V]</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data_5}>
          <XAxis dataKey="name" />
          <YAxis domain={YAxislist_5} />
          <ReferenceLine y={upperLimit_5} stroke="red" strokeWidth={3} />
          <ReferenceLine y={lowerLimit_5} stroke="red" strokeWidth={3} />
          <Bar dataKey="value">
            {data_5.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor_5(entry.value)} />
            ))}
            <LabelList dataKey="value" position="top" fill="Black" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

  );
};

export default BarGraphs;




    // <div className="rounded-2xl shadow-lg p-4 bg-white text-sm text-gray-700 mb-3">
    //   <div className="flex items-center justify-between  ">
    //     <h3 className="text-lg font-bold  m-5">System Data</h3>
    //     <BarChart2Icon className="w-12 h-12 p-2 text-blue-600" />
    //   </div>
    //   <div className="flex flex-wrap justify-center gap-2">
    //     <div
    //       className="min-w-[250px] flex-grow  p-2 rounded shadow max-w-xs"
    //       style={{ minHeight: 300 }}
    //     >
    //       <h2 className="text-lg font-semibold mb-2">Ph-N[N]</h2>

    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={data_1}>
    //           <XAxis dataKey="name" />
    //           <YAxis domain={YAxislist_1} />
    //           <ReferenceLine y={upperLimit_1} stroke="red" strokeWidth={3} />
    //           <ReferenceLine y={lowerLimit_1} stroke="red" strokeWidth={3} />

    //           <Bar dataKey="value">
    //             {/* Dynamically color each bar */}
    //             {data_1.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={getBarColor_1(entry.value)}
    //               />
    //             ))}
    //             {/* Display value below or inside the bar */}
    //             <LabelList
    //               dataKey="value"
    //               position="top"
    //               fill="Black"
    //               fontSize={14}
    //             />
    //           </Bar>
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </div>

    //     <div className="min-w-[250px] flex-grow  p-4 rounded shadow max-w-xs">
    //       <h2 className="text-lg font-semibold mb-2">Ph-Ph[V]</h2>

    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={data_2}>
    //           <XAxis dataKey="name" />
    //           <YAxis domain={YAxislist_2} />
    //           <ReferenceLine y={upperLimit_2} stroke="red" strokeWidth={3} />
    //           <ReferenceLine y={lowerLimit_2} stroke="red" strokeWidth={3} />

    //           <Bar dataKey="value">
    //             {data_2.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={getBarColor_2(entry.value)}
    //               />
    //             ))}
    //             {/* Display value below or inside the bar */}
    //             <LabelList
    //               dataKey="value"
    //               position="top"
    //               fill="Black"
    //               fontSize={14}
    //             />
    //           </Bar>
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </div>
    //     <div className="min-w-[250px] flex-grow  p-4 rounded shadow max-w-xs">
    //       <h2 className="text-lg font-semibold mb-2"> Generator Current[A]</h2>

    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={data_3}>
    //           <XAxis dataKey="name" />
    //           <YAxis domain={YAxislist_3} />
    //           <ReferenceLine y={upperLimit_3} stroke="red" strokeWidth={3} />
    //           <ReferenceLine y={lowerLimit_3} stroke="red" strokeWidth={3} />

    //           <Bar dataKey="value">
    //             {data_3.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={getBarColor_3(entry.value)}
    //               />
    //             ))}
    //             {/* Display value below or inside the bar */}
    //             <LabelList
    //               dataKey="value"
    //               position="top"
    //               fill="Black"
    //               fontSize={14}
    //             />
    //           </Bar>
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </div>
    //     <div className="min-w-[250px] flex-grow  p-4 rounded shadow max-w-xs">
    //       <h2 className="text-lg font-semibold mb-2"> Generator Ph-N[N]</h2>

    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={data_4}>
    //           <XAxis dataKey="name" />
    //           <YAxis domain={YAxislist_4} />
    //           <ReferenceLine y={upperLimit_4} stroke="red" strokeWidth={3} />
    //           <ReferenceLine y={lowerLimit_4} stroke="red" strokeWidth={3} />

    //           <Bar dataKey="value">
    //             {data_4.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={getBarColor_4(entry.value)}
    //               />
    //             ))}
    //             {/* Display value below or inside the bar */}
    //             <LabelList
    //               dataKey="value"
    //               position="top"
    //               fill="Black"
    //               fontSize={14}
    //             />
    //           </Bar>
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </div>
    //     <div className="min-w-[250px] flex-grow  p-4 rounded shadow max-w-xs">
    //       <h2 className="text-lg font-semibold mb-2"> Generator PH-N[V]</h2>

    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={data_5}>
    //           <XAxis dataKey="name" />
    //           <YAxis domain={YAxislist_5} />
    //           <ReferenceLine y={upperLimit_5} stroke="red" strokeWidth={3} />
    //           <ReferenceLine y={lowerLimit_5} stroke="red" strokeWidth={3} />

    //           <Bar dataKey="value">
    //             {data_5.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={getBarColor_5(entry.value)}
    //               />
    //             ))}
    //             {/* Display value below or inside the bar */}
    //             <LabelList
    //               dataKey="value"
    //               position="top"
    //               fill="Black"
    //               fontSize={14}
    //             />
    //           </Bar>
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </div>
    //   </div>
    // </div>