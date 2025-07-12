
export const BarGraphs = () => {
  // Configurable threshold values
  const overloadThreshold = 85;
  const underloadThreshold = 25;
  const maxValue = 100;
  const chartHeight = 160;

  // Calculate position for threshold lines
  const getThresholdPosition = (threshold: number) => {
    return (threshold / maxValue) * chartHeight;
  };

  // Determine bar color based on value
  const getBarColor = (value: number) => {
    if (value >= overloadThreshold) return 'bg-red-500';
    if (value <= underloadThreshold) return 'bg-orange-400';
    return 'bg-green-500';
  };

  // Calculate bar height
  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Parameters</h3>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Overload</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Normal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

        {/* Histogram 1: Ph-N [V] */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 text-center mb-4">Ph-N [V]</h4>
          <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
            
            {/* Chart area with black X-axis */}
            <div className="relative border-b-2 border-black" style={{ height: `${chartHeight}px` }}>
              
              {/* Red threshold lines */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(overloadThreshold)}px` }}
              ></div>
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(underloadThreshold)}px` }}
              ></div>

              {/* Bars */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(85)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(85)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(92)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(92)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(78)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(78)}px` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* X-axis labels and values */}
            <div className="flex justify-center items-start space-x-3 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L1-N</span>
                <span className="text-xs font-semibold text-gray-800">85</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L2-N</span>
                <span className="text-xs font-semibold text-gray-800">92</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L3-N</span>
                <span className="text-xs font-semibold text-gray-800">78</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histogram 2: Ph-Ph [V] */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 text-center mb-4">Ph-Ph [V]</h4>
          <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
            
            <div className="relative border-b-2 border-black" style={{ height: `${chartHeight}px` }}>
              
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(overloadThreshold)}px` }}
              ></div>
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(underloadThreshold)}px` }}
              ></div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(76)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(76)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(88)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(88)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(95)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(95)}px` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start space-x-3 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L1-L2</span>
                <span className="text-xs font-semibold text-gray-800">76</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L2-L3</span>
                <span className="text-xs font-semibold text-gray-800">88</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L3-L1</span>
                <span className="text-xs font-semibold text-gray-800">95</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histogram 3: Current [A] */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 text-center mb-4">Current [A]</h4>
          <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
            
            <div className="relative border-b-2 border-black" style={{ height: `${chartHeight}px` }}>
              
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(overloadThreshold)}px` }}
              ></div>
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(underloadThreshold)}px` }}
              ></div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(90)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(90)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(82)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(82)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(87)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(87)}px` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start space-x-3 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L1</span>
                <span className="text-xs font-semibold text-gray-800">90</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L2</span>
                <span className="text-xs font-semibold text-gray-800">82</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L3</span>
                <span className="text-xs font-semibold text-gray-800">87</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histogram 4: Ph-N [V] */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 text-center mb-4">Ph-N [V]</h4>
          <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
            
            <div className="relative border-b-2 border-black" style={{ height: `${chartHeight}px` }}>
              
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(overloadThreshold)}px` }}
              ></div>
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(underloadThreshold)}px` }}
              ></div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(88)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(88)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(91)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(91)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(79)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(79)}px` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start space-x-3 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L1-N</span>
                <span className="text-xs font-semibold text-gray-800">88</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L2-N</span>
                <span className="text-xs font-semibold text-gray-800">91</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L3-N</span>
                <span className="text-xs font-semibold text-gray-800">79</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histogram 5: Ph-Ph [V] */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 text-center mb-4">Ph-Ph [V]</h4>
          <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
            
            <div className="relative border-b-2 border-black" style={{ height: `${chartHeight}px` }}>
              
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(overloadThreshold)}px` }}
              ></div>
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
                style={{ bottom: `${getThresholdPosition(underloadThreshold)}px` }}
              ></div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(83)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(83)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(86)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(86)}px` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${getBarColor(92)} rounded-t transition-all duration-300`}
                    style={{ height: `${getBarHeight(92)}px` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start space-x-3 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L1-L2</span>
                <span className="text-xs font-semibold text-gray-800">83</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L2-L3</span>
                <span className="text-xs font-semibold text-gray-800">86</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-600">L3-L1</span>
                <span className="text-xs font-semibold text-gray-800">92</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BarGraphs;