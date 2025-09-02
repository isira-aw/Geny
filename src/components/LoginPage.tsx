import React, { useState, useEffect } from "react";
import { Plus, Power, Trash2, User, LogOut, Settings, Monitor } from "lucide-react";

interface Device {
  deviceUid: string;
  deviceName: string;
  lastLogin?: string;
}

interface UserData {
  id: number;
  email: string;
  fullName: string;
  createdAt?: string;
  devices: Device[];
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const BASE_URL = "https://a2z-geny-backend-production-a716.up.railway.app";
  // const BASE_URL = "http://localhost:8080";
  
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Login/Register states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Device management states
  const [devices, setDevices] = useState<Device[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceUid, setNewDeviceUid] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [addingDevice, setAddingDevice] = useState(false);
  const [removingDevice, setRemovingDevice] = useState<string | null>(null);
  
  // Device login states
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devicePassword, setDevicePassword] = useState("");
  const [deviceLoading, setDeviceLoading] = useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (token) {
      setAuthToken(token);
      fetchUserDevices(token);
    }
  }, []);

  // Helper function to safely parse JSON
  const safeJsonParse = async (response: Response) => {
    const text = await response.text();
    if (!text) {
      throw new Error("Empty response from server");
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      throw new Error("Invalid response format from server");
    }
  };

  // Enhanced function to refresh all user data
  const refreshUserData = async (token: string) => {
    try {
      // Fetch fresh user data including devices
      const response = await fetch(`${BASE_URL}/users/devices`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      if (data.success) {
        setDevices(data.data || []);
        // Update user data if available in response
        if (data.user) {
          setUserData(data.user);
        }
        setIsLoggedIn(true);
        setError(""); // Clear any previous errors
      } else {
        console.error("Failed to refresh user data:", data.message);
        setError(data.message || "Failed to refresh user data");
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      setError(`Failed to refresh data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // User Authentication Functions
  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLoginMode ? "/login" : "/register";
    const payload = isLoginMode 
      ? { email, password }
      : { email, password, fullName };

    try {
      const response = await fetch(`${BASE_URL}/users${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response);

      if (data.success) {
        if (isLoginMode) {
          localStorage.setItem("userAuthToken", data.token);
          setAuthToken(data.token);
          setUserData(data.user);
          setDevices(data.user.devices || []);
          setIsLoggedIn(true);
          // Immediately refresh data to ensure consistency
          await refreshUserData(data.token);
        } else {
          setError("Registration successful! Please login.");
          setIsLoginMode(true);
        }
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user devices
  const fetchUserDevices = async (token: string) => {
    await refreshUserData(token);
  };

  // Add device to user account
  const handleAddDevice = async () => {
    if (!newDeviceUid || !newDeviceName || addingDevice) return;

    setAddingDevice(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/users/devices/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          deviceUid: newDeviceUid,
          deviceName: newDeviceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      if (data.success) {
        // Clear form inputs
        setNewDeviceUid("");
        setNewDeviceName("");
        setShowAddDevice(false);
        
        // Refresh user data to get updated device list
        await refreshUserData(authToken);
        
        // Show success message briefly
        setError("Device added successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Failed to add device");
      }
    } catch (err) {
      console.error("Add device error:", err);
      setError(`Failed to add device: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAddingDevice(false);
    }
  };

  // Remove device from user account
  const handleRemoveDevice = async (deviceUid: string) => {
    if (removingDevice) return; // Prevent multiple simultaneous deletions

    setRemovingDevice(deviceUid);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/users/devices/${deviceUid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response);
      if (data.success) {
        // If the removed device was selected, clear selection
        if (selectedDevice?.deviceUid === deviceUid) {
          setSelectedDevice(null);
          setDevicePassword("");
        }
        
        // Refresh user data to get updated device list
        await refreshUserData(authToken);
        
        // Show success message briefly
        setError("Device removed successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Failed to remove device");
      }
    } catch (err) {
      console.error("Remove device error:", err);
      setError(`Failed to remove device: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRemovingDevice(null);
    }
  };

  // Device login (existing functionality)
  const handleDeviceLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;

    setDeviceLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/devices/signIn`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          deviceUid: selectedDevice.deviceUid,
          password: devicePassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response);

      if (data.success && data.token) {
        localStorage.setItem("deviceAuthToken", data.token);
        
        // Call the original onLogin function to proceed to device dashboard
        onLogin(data.token);
        
        // Get device config (existing logic)
        const configResponse = await fetch(
          `${BASE_URL}/devices/config`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${data.token}`,
              "Accept": "application/json"
            },
          }
        );

        if (configResponse.ok) {
          const configData = await safeJsonParse(configResponse);
          console.log("Device login successful, config:", configData);
          
          // Refresh user data to update device last login time
          await refreshUserData(authToken);
        }
      } else {
        setError(data.message || "Invalid device credentials");
      }
    } catch (err) {
      console.error("Device login error:", err);
      setError(`Device login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeviceLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userAuthToken");
    localStorage.removeItem("deviceAuthToken");
    setIsLoggedIn(false);
    setAuthToken("");
    setUserData(null);
    setDevices([]);
    setEmail("");
    setPassword("");
    setFullName("");
    setSelectedDevice(null);
    setDevicePassword("");
    setError("");
    setShowAddDevice(false);
    setNewDeviceUid("");
    setNewDeviceName("");
  };

  // If not logged in, show auth div
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#98A1BC] via-[#DED3C4] to-[#F4EBD3] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#555879] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLoginMode ? "Sign in to manage your devices" : "Register to get started"}
            </p>
          </div>

          <div className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className={`border px-4 py-3 rounded-lg text-sm ${
                error.includes("successful") 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {error}
              </div>
            )}

            <button
              onClick={handleUserAuth}
              disabled={loading}
              className="w-full bg-[#555879] hover:bg-[#444c5c] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (isLoginMode ? "Signing In..." : "Registering...") : (isLoginMode ? "Sign In" : "Register")}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-[#555879] hover:text-[#444c5c] font-medium"
            >
              {isLoginMode ? "Need an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#98A1BC] via-[#DED3C4] to-[#F4EBD3] p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#555879] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {userData?.fullName || email}
                </h1>
                <p className="text-gray-600">{email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Management Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Monitor className="w-6 h-6 mr-2" />
                My Devices
              </h2>
              <button
                onClick={() => setShowAddDevice(true)}
                className="bg-[#555879] hover:bg-[#444c5c] text-white p-2 rounded-lg transition-colors"
                disabled={addingDevice}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {devices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No devices added yet</p>
                  <p className="text-sm">Click the + button to add your first device</p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.deviceUid}
                    className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-pointer transition-all group"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                          <Power className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {device.deviceName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            UID: {device.deviceUid}
                          </p>
                          {device.lastLogin && (
                            <p className="text-xs text-gray-500">
                              Last: {new Date(device.lastLogin).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDevice(device.deviceUid);
                        }}
                        disabled={removingDevice === device.deviceUid}
                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                      >
                        {removingDevice === device.deviceUid ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Device Panel */}
          {showAddDevice && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add New Device
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Device Name (e.g., Living Room Monitor)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={addingDevice}
                />
                <input
                  type="text"
                  value={newDeviceUid}
                  onChange={(e) => setNewDeviceUid(e.target.value)}
                  placeholder="Device UID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={addingDevice}
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddDevice}
                  disabled={addingDevice || !newDeviceName || !newDeviceUid}
                  className="bg-[#555879] hover:bg-[#444c5c] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {addingDevice ? "Adding..." : "Add Device"}
                </button>
                <button
                  onClick={() => {
                    setShowAddDevice(false);
                    setNewDeviceUid("");
                    setNewDeviceName("");
                  }}
                  disabled={addingDevice}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Device Login Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Device Access
            </h2>

            {selectedDevice ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900">Selected Device</h4>
                  <p className="text-blue-700">{selectedDevice.deviceName}</p>
                  <p className="text-sm text-blue-600">UID: {selectedDevice.deviceUid}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Password
                  </label>
                  <input
                    type="password"
                    value={devicePassword}
                    onChange={(e) => setDevicePassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter device password"
                    disabled={deviceLoading}
                  />
                </div>

                {error && (
                  <div className={`border px-4 py-3 rounded-lg text-sm ${
                    error.includes("successful") 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleDeviceLogin}
                    disabled={deviceLoading || !devicePassword}
                    className="w-full bg-[#555879] hover:bg-[#444c5c] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deviceLoading ? "Connecting..." : "Connect to Device"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedDevice(null);
                      setDevicePassword("");
                      setError("");
                    }}
                    disabled={deviceLoading}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Power className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a device to connect</p>
                <p className="text-sm">Choose a device from your list to access its dashboard</p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-[#555879] to-[#444c5c] rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Account Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{devices.length}</p>
                <p className="text-sm opacity-80">Connected Devices</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {devices.filter(d => d.lastLogin).length}
                </p>
                <p className="text-sm opacity-80">Recently Active</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-80">
                Account created: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};