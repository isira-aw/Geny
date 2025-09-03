import React from "react";
import { GeneratorControl } from "../components/dashboard/GeneratorControl";
import BarGraphs from "../components/dashboard/BarGraphs";
import { AlarmSystem } from "../components/dashboard/AlarmSystem";
import { SpeedMeters } from "../components/dashboard/SpeedMeters";
import { DataTables } from "../components/dashboard/DataTables";

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Generator Control */}
        <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
          <GeneratorControl />
        </div>

        {/* Bar Graphs */}
        <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
          <BarGraphs />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Tables */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">System Data</h2>
            </div>
            <div className="p-6">
              <DataTables />
            </div>
          </div>

          {/* Speed Meters */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">Performance Metrics</h2>
            </div>
            <div className="p-6">
              <SpeedMeters />
            </div>
          </div>

          {/* Alarm System */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">System Alerts</h2>
            </div>
            <div className="p-6">
              <AlarmSystem />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};