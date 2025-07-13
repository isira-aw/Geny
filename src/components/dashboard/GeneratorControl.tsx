import React, { useState, useEffect } from "react";
import {
  Zap,
  Factory,
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
} from "lucide-react";

export const GeneratorControl: React.FC = () => {
  const [generator1, setGenerator1] = useState(false);
  const [generator2, setGenerator2] = useState(true);
  const [, setGenerator1Value] = useState(0);
  const [, setGenerator2Value] = useState(5);

  // Real-time value updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGenerator1Value(0);
      setGenerator2Value(0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleGenerator = (generator: "generator1" | "generator2") => {
    if (generator === "generator1") {
      setGenerator1(!generator1);
    } else {
      setGenerator2(!generator2);
    }
  };

  return (
    <div className=" rounded-2xl shadow-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Generator Control</h3>
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>

      {/* Power Values Display */}
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold">--KW</div>
          <div className="text-sm text-gray-400"> Main line </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">--KW</div>
          <div className="text-sm text-gray-400"> Factory </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">--KW</div>
          <div className="text-sm text-gray-400"> Generator </div>
        </div>
      </div>

      {/* Generator Icons */}
      <div className="flex items-center justify-center space-x-8 mb-5">
        {/* Generator 1 */}
        <div className="text-center">
          <div className="relative flex items-center space-x-2 justify-center">
            
            <Zap
              className={`w-12 h-12 ${
                generator1 ? "text-red-500" : "text-gray-500"
              }`}
            />
            <ArrowBigRightDashIcon
              className={`w-12 h-12 ${
                generator1 ? "text-red-500" : "text-gray-500"
              }`}
            />
            
          </div>
        </div>

        {/* Factory */}
        <div className="w-20 h-20 flex items-center justify-center">
          <Factory className="w-20 h-20 text-gray-300" />
        </div>

        {/* Generator 2 */}
        <div className="text-center">
          <div className="relative flex items-center space-x-2 justify-center">
            <ArrowBigLeftDashIcon
              className={`w-12 h-12 ${
                generator2 ? "text-green-500" : "text-gray-500"
              }`}
            />
            <div
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl font-bold ${
                generator2
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-500 text-gray-500"
              }`}
            >
              G
            </div>
            
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => toggleGenerator("generator1")}
          className={`py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
            generator1
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          {generator1 ? "OFF" : "ON"}
        </button>

        <button
          onClick={() => toggleGenerator("generator2")}
          className={`py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
            generator2
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          {generator2 ? "OFF" : "ON"}
        </button>
      </div>
    </div>
  );
};
