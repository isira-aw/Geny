import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LogOut,
  BarChart3,
  Activity,
  Calendar,
  Settings,
  Menu,
  X,
  Monitor,
  Bell,
} from "lucide-react";

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/reports", label: "Reports", icon: Activity },
    { path: "/ai-monitor", label: "AI Monitor", icon: Monitor },
    { path: "/schedule", label: "Schedule", icon: Calendar },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3C53] to-[#456882]">
      {/* Navigation Bar */}
      <nav className="bg-[#1B3C53] shadow-xl border-b border-[#456882]/20">
        <div className="mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Logo + Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D2C1B6] to-[#F9F3EF] rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-[#1B3C53]" />
                </div>
                <h1 className="text-xl font-bold text-[#F9F3EF]">
                  Device Monitor
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#D2C1B6] text-[#1B3C53] shadow-md"
                          : "text-[#D2C1B6] hover:text-[#F9F3EF] hover:bg-[#456882]/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-[#456882]/30 text-[#D2C1B6] hover:bg-[#456882]/50 hover:text-[#F9F3EF] transition-colors duration-200"
                >
                  <Bell className="w-5 h-5" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-[#F9F3EF] rounded-xl shadow-xl border border-[#D2C1B6] p-4 z-50">
                    <h3 className="text-[#1B3C53] font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">System running normally</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">Data sync completed</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              {/* <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-[#456882]/30 rounded-lg">
                <User className="w-4 h-4 text-[#D2C1B6]" />
                <span className="text-[#D2C1B6] text-sm font-medium">Admin</span>
              </div> */}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">My Devices</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#D2C1B6] hover:bg-[#456882]/30 hover:text-[#F9F3EF] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1B3C53] border-t border-[#456882]/20">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#D2C1B6] text-[#1B3C53]"
                        : "text-[#D2C1B6] hover:bg-[#456882]/30 hover:text-[#F9F3EF]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};