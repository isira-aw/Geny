import React, { useEffect, useState } from "react";
import { Save, Settings, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { apiService } from "./api";

interface SettingsForm {
  A1: string;
  A2: string;
  A3: string;
  A4: string;
  A5: string;
  A6: string;
  A7: string;
  A8: string;
  A9: string;
  A10: string;
  A11: string;
  A12: string;
  A13: string;
  A14: string;
  A15: string;
}

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [form, setForm] = useState<SettingsForm>({
    A1: "",
    A2: "",
    A3: "",
    A4: "",
    A5: "",
    A6: "",
    A7: "",
    A8: "",
    A9: "",
    A10: "",
    A11: "",
    A12: "",
    A13: "",
    A14: "",
    A15: "",
  });

  const token = localStorage.getItem("deviceAuthToken");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiService.getSettings(token);
        if (data.status) {
          setForm((prev) => ({ ...prev, ...data.data }));
        }
      } catch (err) {
        console.error("Fetch settings error:", err);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await apiService.updateSettings(token, form);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      console.error("Submit settings error:", err);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      A1: "", A2: "", A3: "", A4: "", A5: "", A6: "", A7: "", A8: "",
      A9: "", A10: "", A11: "", A12: "", A13: "", A14: "", A15: ""
    });
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <RefreshCw className="w-8 h-8 text-[#456882] animate-spin mx-auto mb-4" />
          <p className="text-[#1B3C53]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#F9F3EF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B3C53]">System Configuration</h1>
              <p className="text-[#456882]">Configure system parameters and device settings</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`bg-white rounded-xl shadow-lg border p-4 ${
            message.type === 'success' 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              } font-medium`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
          <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-[#F9F3EF]">Configuration Parameters</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(form).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-[#1B3C53]">
                    Parameter {key}
                  </label>
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#F9F3EF] border border-[#D2C1B6] rounded-lg px-4 py-3 text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent resize-none transition-colors duration-200"
                    placeholder={`Enter value for ${key}...`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="bg-[#F9F3EF] px-6 py-4 rounded-b-xl border-t border-[#D2C1B6]/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Reset All
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-[#1B3C53] to-[#456882] hover:from-[#456882] hover:to-[#1B3C53] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Additional Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Information */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-semibold text-[#F9F3EF]">System Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#456882]">Device ID:</span>
                <span className="text-[#1B3C53] font-medium">{settings.deviceUid || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#456882]">Configuration Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#456882]">Last Updated:</span>
                <span className="text-[#1B3C53] font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-semibold text-[#F9F3EF]">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Reload Dashboard
              </button>
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-3 rounded-lg font-medium transition-colors duration-200">
                Export Settings
              </button>
              <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-4 py-3 rounded-lg font-medium transition-colors duration-200">
                Import Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};