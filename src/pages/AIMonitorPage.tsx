import React, { useState } from "react";
import { 
  Brain,
  Activity,
  Cpu,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Network,
  TrendingUp
} from "lucide-react";

export const AIMonitorPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState("primary");

  const aiModels = [
    { id: "primary", name: "Primary AI Model", status: "active", accuracy: 94.2 },
    { id: "secondary", name: "Secondary AI Model", status: "standby", accuracy: 91.7 },
    { id: "backup", name: "Backup AI Model", status: "inactive", accuracy: 89.3 },
  ];

  const systemMetrics = [
    { label: "CPU Usage", value: 72, unit: "%", status: "normal", icon: Cpu },
    { label: "Memory", value: 68, unit: "%", status: "normal", icon: Database },
    { label: "Network", value: 45, unit: "Mbps", status: "normal", icon: Network },
    { label: "Processing Speed", value: 1250, unit: "ms", status: "warning", icon: Zap },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50 border-green-200";
      case "standby": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "inactive": return "text-gray-600 bg-gray-50 border-gray-200";
      case "error": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#F9F3EF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B3C53]">AI Monitoring Dashboard</h1>
              <p className="text-[#456882]">Monitor AI model performance and system resources</p>
            </div>
          </div>
        </div>

        {/* AI Model Status */}
        <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
          <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-[#F9F3EF]">AI Model Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id 
                      ? "border-[#1B3C53] bg-[#F9F3EF]" 
                      : "border-[#D2C1B6] hover:border-[#456882]"
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#1B3C53]">{model.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(model.status)}`}>
                      {model.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#456882]" />
                    <span className="text-sm text-[#456882]">Accuracy: {model.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-6 h-6 ${getMetricColor(metric.status)}`} />
                  {metric.status === "warning" && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  {metric.status === "normal" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#456882] mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-[#1B3C53]">
                    {metric.value}
                    <span className="text-sm font-normal text-[#456882] ml-1">{metric.unit}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Charts and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">Performance Trends</h2>
            </div>
            <div className="p-6">
              <div className="h-64 bg-[#F9F3EF] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-[#456882] mx-auto mb-2" />
                  <p className="text-[#456882]">Real-time performance chart</p>
                  <p className="text-sm text-[#456882]">AI processing metrics visualization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">Activity Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { time: "14:23", message: "AI model switched to primary", type: "info" },
                  { time: "14:18", message: "Processing speed optimization completed", type: "success" },
                  { time: "14:12", message: "Memory usage threshold reached", type: "warning" },
                  { time: "14:05", message: "Backup model activated", type: "info" },
                  { time: "13:58", message: "System health check completed", type: "success" },
                  { time: "13:45", message: "Network latency increased", type: "warning" },
                ].map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-[#F9F3EF] rounded-lg">
                    <div className="flex items-center space-x-2 text-xs text-[#456882] whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      <span>{log.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        log.type === "success" ? "text-green-700" :
                        log.type === "warning" ? "text-yellow-700" :
                        "text-[#1B3C53]"
                      }`}>
                        {log.message}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === "success" ? "bg-green-500" :
                      log.type === "warning" ? "bg-yellow-500" :
                      "bg-blue-500"
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Details */}
        <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
          <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-[#F9F3EF]">
              {aiModels.find(m => m.id === selectedModel)?.name} Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B3C53]">Model Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Version:</span>
                    <span className="text-[#1B3C53] font-medium">v2.1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Last Updated:</span>
                    <span className="text-[#1B3C53] font-medium">2024-03-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Training Data:</span>
                    <span className="text-[#1B3C53] font-medium">1.2M samples</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B3C53]">Performance Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Requests/Hour:</span>
                    <span className="text-[#1B3C53] font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Avg Response:</span>
                    <span className="text-[#1B3C53] font-medium">145ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Success Rate:</span>
                    <span className="text-[#1B3C53] font-medium">99.7%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B3C53]">Resource Usage</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#456882]">GPU Utilization:</span>
                    <span className="text-[#1B3C53] font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">VRAM Usage:</span>
                    <span className="text-[#1B3C53] font-medium">12.3GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#456882]">Power Draw:</span>
                    <span className="text-[#1B3C53] font-medium">245W</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};