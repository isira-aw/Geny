// src/pages/DashboardPage.tsx - Debug Version
import React from "react";
import { SettingsProvider } from "../components/SettingsContext";
import { DebugComponent } from "../components/dashboard/DebugComponent";

export const DashboardPage: React.FC = () => {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Debug Component - Remove this after fixing */}
          <DebugComponent />
          
          {/* Your other components can be uncommented after debugging */}
          {/*
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
            <GeneratorControl />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
            <BarGraphs />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#F9F3EF]">System Data</h2>
              </div>
              <div className="p-6">
                <DataTables />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#F9F3EF]">Performance Metrics</h2>
              </div>
              <div className="p-6">
                <SpeedMeters />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#F9F3EF]">System Alerts</h2>
              </div>
              <div className="p-6">
                <AlarmSystem />
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </SettingsProvider>
  );
};