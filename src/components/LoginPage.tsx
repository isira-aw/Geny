import React, { useState } from "react";
import { Plus, Power, Trash2 } from "lucide-react";
import { initializeFirebase } from "../components/firebase/firebase";

interface Device {
  id: string;
  name: string;
  uid: string;
  lastLogin?: string;
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [deviceUid, setDeviceUid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Osanda2", uid: "0000", lastLogin: "2024-01-15 14:30" },
    {
      id: "2",
      name: "Osanada1",
      uid: "00000000",
      lastLogin: "2024-01-14 09:15",
    },
  ]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceUid, setNewDeviceUid] = useState("");

  // LoginPage.tsx - Simplified handleLogin:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8088/devices/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceUid, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Login successful: Save token and proceed
        localStorage.setItem("authToken", data.token);
        onLogin(data.token);

        const configResponse = await fetch(
          "http://localhost:8088/devices/config",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const configData = await configResponse.json();
        console.log("✅ Full response:", configData);
        const deviceConfig = configData.data;

        console.log("✅ API Key:", deviceConfig.apiKey);
        console.log("✅ Auth Domain:", deviceConfig.authDomain);
        console.log("✅ Database URL:", deviceConfig.databaseURL);
        console.log("✅ Project ID:", deviceConfig.projectId);
        console.log("✅ Storage Bucket:", deviceConfig.storageBucket);
        console.log("✅ Messaging Sender ID:", deviceConfig.messagingSenderId);
        console.log("✅ App ID:", deviceConfig.appId);
        initializeFirebase({
          apiKey: deviceConfig.apiKey,
          authDomain: deviceConfig.authDomain,
          databaseURL: deviceConfig.databaseURL,
          projectId: deviceConfig.projectId,
          storageBucket: deviceConfig.storageBucket,
          messagingSenderId: deviceConfig.messagingSenderId,
          appId: deviceConfig.appId,
        });
      } else {
        setError(data.message || "Invalid UID or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceSelect = (device: Device) => {
    setDeviceUid(device.uid);
  };

  const handleAddDevice = () => {
    if (newDeviceName && newDeviceUid) {
      const newDevice: Device = {
        id: Date.now().toString(),
        name: newDeviceName,
        uid: newDeviceUid,
      };
      setDevices([...devices, newDevice]);
      setNewDeviceName("");
      setNewDeviceUid("");
      setShowAddDevice(false);
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter((d) => d.id !== deviceId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Login Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Power className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Device Login</h1>
            <p className="text-gray-600 mt-2">
              Access your monitoring dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device UID
              </label>
              <input
                type="text"
                value={deviceUid}
                onChange={(e) => setDeviceUid(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter device UID"
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
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Device List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Devices
              </h2>
              <button
                onClick={() => setShowAddDevice(true)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                        <Power className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {device.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          UID: {device.uid}
                        </p>
                        {device.lastLogin && (
                          <p className="text-xs text-gray-500">
                            Last: {device.lastLogin}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDevice(device.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Device Form */}
          {showAddDevice && (
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add New Device
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Device Name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newDeviceUid}
                  onChange={(e) => setNewDeviceUid(e.target.value)}
                  placeholder="Device UID"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddDevice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Device
                </button>
                <button
                  onClick={() => setShowAddDevice(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
