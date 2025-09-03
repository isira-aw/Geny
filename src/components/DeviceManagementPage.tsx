import React, { useState, useEffect, useCallback } from "react";
import { Plus, Power, Trash2, User, LogOut, Monitor } from "lucide-react";
import { Device, apiService } from "./api";

interface DeviceManagementPageProps {
  onDeviceLogin: (token: string) => void;
  onUserLogout: () => void;
}

export const DeviceManagementPage: React.FC<DeviceManagementPageProps> = ({
  onDeviceLogin,
  onUserLogout,
}) => {
  const [userToken] = useState(localStorage.getItem("userAuthToken") || "");
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState("");

  // Device management states
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceUid, setNewDeviceUid] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [addingDevice, setAddingDevice] = useState(false);
  const [removingDevice, setRemovingDevice] = useState<string | null>(null);

  // Device login states
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devicePassword, setDevicePassword] = useState("");
  const [deviceLoading, setDeviceLoading] = useState(false);

  const fetchUserDevices = useCallback(async () => {
    if (!userToken) return;

    try {
      const data = await apiService.getUserDevices(userToken);
      console.log("API Response:", data); // Debug log to see the actual response

      if (data.status) {
        // Changed from data.success to data.status
        setDevices(data.data || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch devices");
      }
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError(
        `Failed to fetch devices: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }, [userToken]);

  useEffect(() => {
    fetchUserDevices();
  }, [fetchUserDevices]);

  const handleAddDevice = async () => {
    if (!newDeviceUid || !newDeviceName || addingDevice) return;

    setAddingDevice(true);
    setError("");

    try {
      const data = await apiService.addDevice(
        userToken,
        newDeviceUid,
        newDeviceName
      );
      if (data.success) {
        setNewDeviceUid("");
        setNewDeviceName("");
        setShowAddDevice(false);

        // Immediately refresh the device list
        await fetchUserDevices();

        setError("Device added successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Failed to add device");
      }
      fetchUserDevices();
      setNewDeviceUid("");
      setNewDeviceName("");
    } catch (err) {
      console.error("Add device error:", err);
      setError(
        `Failed to add device: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setAddingDevice(false);
    }
  };

  const handleRemoveDevice = async (deviceUid: string) => {
    if (removingDevice) return;

    setRemovingDevice(deviceUid);
    setError("");

    try {
      const data = await apiService.removeDevice(userToken, deviceUid);
      if (data.success) {
        if (selectedDevice?.deviceUid === deviceUid) {
          setSelectedDevice(null);
          setDevicePassword("");
        }

        // Immediately refresh the device list
        await fetchUserDevices();

        setError("Device removed successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Failed to remove device");
      }
    } catch (err) {
      console.error("Remove device error:", err);
      setError(
        `Failed to remove device: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setRemovingDevice(null);
    }
  };

  const handleDeviceLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;

    setDeviceLoading(true);
    setError("");

    try {
      const data = await apiService.loginDevice(
        selectedDevice.deviceUid,
        devicePassword
      );

      if (data.success && data.token) {
        localStorage.setItem("deviceAuthToken", data.token);
        onDeviceLogin(data.token);

        try {
          await apiService.getDeviceConfig(data.token);
        } catch (configErr) {
          console.error("Config fetch error:", configErr);
        }
      } else {
        setError(data.message || "Invalid device credentials");
      }
    } catch (err) {
      console.error("Device login error:", err);
      setError(
        `Device login failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setDeviceLoading(false);
    }
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userAuthToken");
    localStorage.removeItem("deviceAuthToken");
    onUserLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3C53] to-[#456882] p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#D2C1B6]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#F9F3EF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1B3C53]">
                  Device Management
                </h1>
                <p className="text-[#456882]">
                  Manage and connect to your devices
                </p>
              </div>
            </div>
            <button
              onClick={handleUserLogout}
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
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#D2C1B6]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1B3C53] flex items-center">
                <Monitor className="w-6 h-6 mr-2" />
                My Devices
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchUserDevices}
                  className="bg-[#456882] hover:bg-[#1B3C53] text-white p-2 rounded-lg transition-colors"
                  title="Refresh devices"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowAddDevice(true)}
                  className="bg-[#1B3C53] hover:bg-[#456882] text-white p-2 rounded-lg transition-colors"
                  disabled={addingDevice}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {devices.length === 0 ? (
                <div className="text-center py-8 text-[#456882]">
                  <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No devices added yet</p>
                  <p className="text-sm">
                    Click the + button to add your first device
                  </p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.deviceUid}
                    className="bg-[#F9F3EF] border border-[#D2C1B6] hover:border-[#1B3C53] rounded-lg p-4 cursor-pointer transition-all group"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1B3C53] group-hover:bg-[#456882] rounded-lg flex items-center justify-center transition-colors">
                          <Power className="w-5 h-5 text-[#F9F3EF]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1B3C53]">
                            {device.deviceName}
                          </h3>
                          <p className="text-sm text-[#456882]">
                            UID: {device.deviceUid}
                          </p>
                          {device.lastLogin && (
                            <p className="text-xs text-[#456882]">
                              Last:{" "}
                              {new Date(device.lastLogin).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDevice(device.deviceUid);
                          fetchUserDevices();
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
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#D2C1B6]/20">
              <h3 className="text-lg font-bold text-[#1B3C53] mb-4">
                Add New Device
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Device Name (e.g., Living Room Monitor)"
                  className="w-full px-4 py-2 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882]"
                  disabled={addingDevice}
                />
                <input
                  type="text"
                  value={newDeviceUid}
                  onChange={(e) => setNewDeviceUid(e.target.value)}
                  placeholder="Device UID"
                  className="w-full px-4 py-2 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882]"
                  disabled={addingDevice}
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    handleAddDevice();
                  }}
                  disabled={addingDevice || !newDeviceName || !newDeviceUid}
                  className="bg-[#1B3C53] hover:bg-[#456882] text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                  className="bg-[#D2C1B6] hover:bg-[#456882] text-[#1B3C53] hover:text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Device Login Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#D2C1B6]/20">
            <h2 className="text-xl font-bold text-[#1B3C53] mb-6 flex items-center">
              <Monitor className="w-6 h-6 mr-2" />
              Device Access
            </h2>

            {selectedDevice ? (
              <div className="space-y-6">
                <div className=" border border-[#1B3C53] rounded-lg p-4">
                  <h4 className="font-semibold text-[#1B3C53]">
                    Selected Device
                  </h4>
                  <p className="text-[#456882]">{selectedDevice.deviceName}</p>
                  <p className="text-sm text-[#456882]">
                    UID: {selectedDevice.deviceUid}
                  </p>
                </div>

                <form onSubmit={handleDeviceLogin}>
                  <label className="block text-sm font-medium text-[#1B3C53] mb-2">
                    Device Password
                  </label>
                  <input
                    type="password"
                    value={devicePassword}
                    onChange={(e) => setDevicePassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent mb-4"
                    placeholder="Enter device password"
                    disabled={deviceLoading}
                  />

                  {error && (
                    <div
                      className={`border px-4 py-3 rounded-lg text-sm mb-4 ${
                        error.includes("successful")
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={deviceLoading || !devicePassword}
                      className="w-full bg-gradient-to-r from-[#1B3C53] to-[#456882] hover:from-[#456882] hover:to-[#1B3C53] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {deviceLoading ? "Connecting..." : "Connect to Device"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevice(null);
                        setDevicePassword("");
                        setError("");
                      }}
                      disabled={deviceLoading}
                      className="w-full bg-[#D2C1B6] hover:bg-[#456882] text-[#1B3C53] hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 text-[#456882]">
                <Power className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a device to connect</p>
                <p className="text-sm">
                  Choose a device from your list to access its dashboard
                </p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          {/* <div className="bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Account Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{devices.length}</p>
                <p className="text-sm opacity-80">Connected Devices</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {devices.filter((d) => d.lastLogin).length}
                </p>
                <p className="text-sm opacity-80">Recently Active</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
