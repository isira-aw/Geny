import React, { useState } from 'react';
import { LogOut, BarChart3, Activity, Calendar, Settings, Menu, X } from 'lucide-react';
import { GeneratorControl } from './dashboard/GeneratorControl';
import BarGraphs  from './dashboard/BarGraphs';
import { AlarmSystem } from './dashboard/AlarmSystem';
import { SpeedMeters } from './dashboard/SpeedMeters';
import { DataTables } from './dashboard/DataTables';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'ai-monitor', label: 'AI Monitor', icon: Settings },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Logo + Desktop Tabs */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Device Monitor</h1>

              {/* Desktop tabs: hidden on small */}
              <div className="hidden md:flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
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

            {/* Right side: Logout + Mobile menu button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              {/* Mobile menu toggle button: show on small screens only */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu: show when open */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-inner">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <GeneratorControl />
            </div>
            <div className="lg:col-span-2">
              <BarGraphs />
            </div>
            <div className="lg:col-span-1">
              <AlarmSystem />
            </div>
            <div className="lg:col-span-1">
              <SpeedMeters />
            </div>
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
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        </div>
      )}
    </div>
  );
};
