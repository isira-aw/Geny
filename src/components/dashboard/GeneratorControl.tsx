import React, { useState } from "react";
import {
  Zap,
  Factory,
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
} from "lucide-react";

export const GeneratorControl: React.FC = () => {
  const [generator1, setGenerator1] = useState(false);
  const [generator2, setGenerator2] = useState(true);

  const toggleGenerator = (gen: "generator1" | "generator2") => {
    if (gen === "generator1") {
      setGenerator1(!generator1);
    } else {
      setGenerator2(!generator2);
    }
  };

  return (
    <div className="w-full  rounded-2xl shadow-lg p-2 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
        <div className="lg:col-span-2 ">
          <div className="grid grid-cols-3 items-center justify-items-center gap-2">
            {/* Generator 1 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <Zap
                  className={`w-12 h-12 ${
                    generator1 ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <ArrowBigRightDashIcon
                  className={`w-20 h-20 ${
                    generator1 ? "text-yellow-500" : "text-gray-500"
                  }`}
                />
              </div>
              <div className="text-sm font-bold">--KW</div>
              <div className="text-xs text-gray-400">Generator 1</div>
              <button
                onClick={() => toggleGenerator("generator1")}
                className={`mt-1 px-10 py-3 text-xs rounded font-semibold ${
                  generator1
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {generator1 ? "OFF" : "ON"}
              </button>
            </div>

            {/* Factory */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <Factory className="w-20 h-20 text-gray-400" />
              </div>
              <div className="text-sm font-bold">--KW</div>
              <div className="text-xs text-gray-400">Factory</div>
              <div className="invisible h-7" /> {/* Placeholder for symmetry */}
            </div>

            {/* Generator 2 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <ArrowBigLeftDashIcon
                  className={`w-20 h-20 ${
                    generator2 ? "text-yellow-500" : "text-gray-500"
                  }`}
                />

                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    generator2
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-500 text-gray-500"
                  }`}
                >
                  G
                </div>
              </div>
              <div className="text-sm font-bold">--KW</div>
              <div className="text-xs text-gray-400">Generator 2</div>
              <button
                onClick={() => toggleGenerator("generator2")}
                className={`mt-1 px-10 py-3 text-xs rounded font-semibold ${
                  generator2
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {generator2 ? "OFF" : "ON"}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-md">
          {/* Hertz Section (last one) */}
          <div className="flex flex-col items-center justify-center rounded-md px-4 py-3">
            <div className="text-blue-800 font-extrabold text-lg">50 Hz</div>

            <div className="flex items-center space-x-3 mt-3">
              {/* Icon circle */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 text-sm font-semibold">
                G
              </div>

              {/* On and Off buttons */}
              <button
                className={`px-4 py-1 rounded-md text-sm font-semibold text-white ${
                  generator1 || generator2 ? "bg-green-600" : "bg-gray-600"
                } hover:bg-green-700 transition`}
                onClick={() => {
                  setGenerator1(true);
                  setGenerator2(true);
                }}
              >
                ON
              </button>

              <button
                className={`px-4 py-1 rounded-md text-sm font-semibold text-white ${
                  !(generator1 || generator2) ? "bg-red-600" : "bg-gray-600"
                } hover:bg-red-700 transition`}
                onClick={() => {
                  setGenerator1(false);
                  setGenerator2(false);
                }}
              >
                OFF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
