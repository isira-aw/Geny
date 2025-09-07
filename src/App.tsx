import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { AIMonitorPage } from './pages/AIMonitorPage';
import { SchedulePage } from './pages/SchedulePage';
import { DeviceManagementPage } from './components/DeviceManagementPage';
import { SettingsProvider } from './components/SettingsContext';
import { SettingsPage } from './components/SettingsPage';
import { UserLoginPage } from './components/UserLoginPage';

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [deviceAuthenticated, setDeviceAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication tokens
    const userToken = localStorage.getItem('userAuthToken');
    const deviceToken = localStorage.getItem('deviceAuthToken');
    
    if (userToken) {
      setUserAuthenticated(true);
    }
    if (deviceToken) {
      setDeviceAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const handleUserLogin = (token: string) => {
    localStorage.setItem('userAuthToken', token);
    setUserAuthenticated(true);
  };

  const handleDeviceLogin = (token: string) => {
    localStorage.setItem('deviceAuthToken', token);
    setDeviceAuthenticated(true);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userAuthToken');
    localStorage.removeItem('deviceAuthToken');
    setUserAuthenticated(false);
    setDeviceAuthenticated(false);
  };

  const handleDeviceLogout = () => {
    localStorage.removeItem('deviceAuthToken');
    setDeviceAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B3C53] to-[#456882] flex items-center justify-center">
        <div className="text-[#F9F3EF] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* User Authentication Route */}
      {!userAuthenticated && (
        <Route 
          path="/*" 
          element={<UserLoginPage onUserLogin={handleUserLogin} />} 
        />
      )}

      {/* Device Management Route */}
      {userAuthenticated && !deviceAuthenticated && (
        <Route 
          path="/*" 
          element={
            <DeviceManagementPage 
              onDeviceLogin={handleDeviceLogin}
              onUserLogout={handleUserLogout}
            />
          } 
        />
      )}

      {/* Main Application Routes (after both authentications) */}
      {userAuthenticated && deviceAuthenticated && (
        <Route 
          path="/*" 
          element={
            <SettingsProvider>
              <DashboardLayout onLogout={handleDeviceLogout} />
            </SettingsProvider>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="ai-monitor" element={<AIMonitorPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;