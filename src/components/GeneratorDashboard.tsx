// import React, { useEffect } from 'react';
// import { useAppDispatch } from '../hooks/redux';
// import { updateSystemData, updateAlarms } from '../store/generatorSlice';
import { StatusPanel } from './StatusPanel';
import { PowerMetrics } from './PowerMetrics';
import { ControlPanel } from './ControlPanel';
import { AlarmPanel } from './AlarmPanel';
import { PowerControlPanel } from './PowerControlPanel';
import { AnalogInputs } from './AnalogInputs';
import { BinaryInputs } from './BinaryInputs';
import { BinaryOutputs } from './BinaryOutputs';
import { Statistics } from './Statistics';
import { PowerGauge } from './PowerGauge';

export const GeneratorDashboard: React.FC = () => {
  // const dispatch = useAppDispatch();

  // // Simulate real-time data updates for read-only values
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(updateSystemData({
  //       power: 0,
  //       frequency: 0,
  //       current: {
  //         l1: 1111110,
  //         l2: 0,
  //         l3: 0,
  //       },
  //       rpm: 0,
  //       batteryVoltage: 0,
  //       runningHours: 0,
  //     }));

  //     // Update alarm status
  //     dispatch(updateAlarms({
  //       lastCheck: new Date().toLocaleTimeString(),
  //     }));
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [dispatch]);

  return (
    <div className="max-w-[1920px] mx-auto p-4 space-y-1">
      {/* Top Row - Status and Control */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        <StatusPanel />
        <PowerControlPanel />
        <ControlPanel />
          <PowerGauge />
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-1">
        {/* Left Column - Power Metrics */}
        <div className="xl:col-span-1 space-y-1">
<PowerMetrics />
        </div>

        {/* Middle Column - Inputs/Outputs */}
        <div className="xl:col-span-1 space-y-1">
          <AnalogInputs />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <BinaryInputs />
            <BinaryOutputs />
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="xl:col-span-1 space-y-1">
          <Statistics />
                  <AlarmPanel />
        </div>
      </div>
    </div>
  );
};