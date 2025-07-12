import React, { useState } from 'react';
import { LogOut, BarChart3, Activity, Calendar, Settings } from 'lucide-react';
import { GeneratorControl } from './dashboard/GeneratorControl';
import { BarGraphs } from './dashboard/BarGraphs';
import { AlarmSystem } from './dashboard/AlarmSystem';
import { SpeedMeters } from './dashboard/SpeedMeters';
import { DataTables } from './dashboard/DataTables';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'ai-monitor', label: 'AI Monitor', icon: Settings },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Device Monitor</h1>
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generator Control */}
            <div className="lg:col-span-1">
              <GeneratorControl />
            </div>

            {/* Bar Graphs */}
            <div className="lg:col-span-2">
              <BarGraphs />
            </div>

            {/* Alarm System */}
            <div className="lg:col-span-1">
              <AlarmSystem />
            </div>

            {/* Speed Meters */}
            <div className="lg:col-span-1">
              <SpeedMeters />
            </div>

            {/* Data Tables */}
            <div className="lg:col-span-1">
              <DataTables />
            </div>
          </div>
        </div>
      )}

      {/* Other Tab Contents */}
      {activeTab !== 'dashboard' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        </div>
      )}
    </div>
  );
};