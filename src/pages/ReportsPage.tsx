import React, { useState } from "react";
import { 
  Calendar,
  Download,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
  ChevronDown
} from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedReport, setSelectedReport] = useState("performance");

  const timeframes = [
    { value: "1d", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 3 Months" },
    { value: "1y", label: "Last Year" },
  ];

  const reportTypes = [
    { value: "performance", label: "Performance Report", icon: BarChart3 },
    { value: "usage", label: "Usage Analytics", icon: TrendingUp },
    { value: "system", label: "System Status", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1B3C53] mb-2">Reports & Analytics</h1>
              <p className="text-[#456882]">Generate detailed reports and view system analytics</p>
            </div>
            <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-[#1B3C53] hover:bg-[#456882] text-white px-6 py-3 rounded-lg transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1B3C53] mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Time Period
              </label>
              <div className="relative">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full appearance-none bg-[#F9F3EF] border border-[#D2C1B6] rounded-lg px-4 py-2 text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
                >
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value}>
                      {tf.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#456882] pointer-events-none" />
              </div>
            </div>

            {/* Report Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1B3C53] mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Report Type
              </label>
              <div className="relative">
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full appearance-none bg-[#F9F3EF] border border-[#D2C1B6] rounded-lg px-4 py-2 text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
                >
                  {reportTypes.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#456882] pointer-events-none" />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-[#1B3C53] to-[#456882] hover:from-[#456882] hover:to-[#1B3C53] text-white px-6 py-2 rounded-lg transition-all duration-200">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Uptime", value: "99.8%", change: "+0.2%", color: "green" },
            { title: "Average Load", value: "68%", change: "-5%", color: "blue" },
            { title: "Errors", value: "12", change: "-8", color: "red" },
            { title: "Efficiency", value: "94.2%", change: "+2.1%", color: "green" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#456882]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1B3C53]">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.color === 'green' ? 'text-green-600' : 
                  stat.color === 'blue' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">Performance Trends</h2>
            </div>
            <div className="p-6">
              <div className="h-64 bg-[#F9F3EF] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-[#456882] mx-auto mb-2" />
                  <p className="text-[#456882]">Chart visualization would go here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
            <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-[#F9F3EF]">Report Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-[#1B3C53] mb-2">Key Insights</h3>
                <ul className="space-y-2 text-sm text-[#456882]">
                  <li>• System performance improved by 12%</li>
                  <li>• Reduced energy consumption by 8%</li>
                  <li>• Zero critical alerts this period</li>
                  <li>• Average response time: 45ms</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-[#1B3C53] mb-2">Recommendations</h3>
                <ul className="space-y-2 text-sm text-[#456882]">
                  <li>• Schedule maintenance during low usage</li>
                  <li>• Consider capacity expansion</li>
                  <li>• Update monitoring thresholds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};