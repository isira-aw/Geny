import React, { useState } from "react";
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from "lucide-react";

interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  status: "pending" | "running" | "completed" | "failed";
  type: "maintenance" | "backup" | "monitoring" | "update";
}

export const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, ] = useState<ScheduledTask[]>([
    {
      id: "1",
      title: "System Backup",
      description: "Daily backup of system configuration and data",
      time: "02:00",
      date: "2024-03-15",
      status: "completed",
      type: "backup"
    },
    {
      id: "2", 
      title: "Performance Monitor",
      description: "Check system performance metrics",
      time: "14:30",
      date: "2024-03-15",
      status: "running",
      type: "monitoring"
    },
    {
      id: "3",
      title: "Maintenance Check",
      description: "Routine maintenance and health check",
      time: "16:00",
      date: "2024-03-15",
      status: "pending",
      type: "maintenance"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "running": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance": return "bg-purple-100 text-purple-700";
      case "backup": return "bg-green-100 text-green-700";
      case "monitoring": return "bg-blue-100 text-blue-700";
      case "update": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "running": return Play;
      case "pending": return Clock;
      case "failed": return AlertCircle;
      default: return Clock;
    }
  };

  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3EF] to-[#D2C1B6] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#F9F3EF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1B3C53]">Schedule Management</h1>
                <p className="text-[#456882]">Manage automated tasks and system schedules</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddTask(true)}
              className="mt-4 sm:mt-0 flex items-center space-x-2 bg-[#1B3C53] hover:bg-[#456882] text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Date Selector and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Date Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
            <label className="block text-sm font-medium text-[#1B3C53] mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#F9F3EF] border border-[#D2C1B6] rounded-lg px-4 py-2 text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
            />
          </div>

          {/* Quick Stats */}
          {[
            { label: "Today's Tasks", value: filteredTasks.length, color: "blue" },
            { label: "Completed", value: filteredTasks.filter(t => t.status === "completed").length, color: "green" },
            { label: "Running", value: filteredTasks.filter(t => t.status === "running").length, color: "yellow" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-[#D2C1B6]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#456882]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1B3C53]">{stat.value}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  stat.color === 'green' ? 'bg-green-500' : 
                  stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-lg border border-[#D2C1B6]/20">
          <div className="bg-gradient-to-r from-[#1B3C53] to-[#456882] px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-[#F9F3EF]">
              Scheduled Tasks for {new Date(selectedDate).toLocaleDateString()}
            </h2>
          </div>
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[#D2C1B6] mx-auto mb-4" />
                <p className="text-[#456882]">No tasks scheduled for this date</p>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="mt-2 text-[#1B3C53] hover:text-[#456882] font-medium"
                >
                  Add your first task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((task) => {
                    const StatusIcon = getStatusIcon(task.status);
                    return (
                      <div key={task.id} className="bg-[#F9F3EF] rounded-lg p-4 border border-[#D2C1B6]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`w-5 h-5 ${
                                task.status === 'completed' ? 'text-green-600' :
                                task.status === 'running' ? 'text-blue-600' :
                                task.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                              <span className="font-medium text-[#1B3C53]">{task.time}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-[#1B3C53]">{task.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                                  {task.type}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </div>
                              <p className="text-sm text-[#456882]">{task.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.status === "pending" && (
                              <button className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-[#D2C1B6] rounded-lg transition-colors">
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {task.status === "running" && (
                              <button className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-[#D2C1B6] rounded-lg transition-colors">
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-[#D2C1B6] rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#1B3C53]">Add New Task</h3>
                <button 
                  onClick={() => setShowAddTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-[#456882]" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B3C53] mb-2">Task Type</label>
                  <select className="w-full bg-[#F9F3EF] border border-[#D2C1B6] rounded-lg px-4 py-2 text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent">
                    <option value="maintenance">Maintenance</option>
                    <option value="backup">Backup</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="update">Update</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-[#1B3C53] hover:bg-[#456882] text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Create Task
                </button>
                <button 
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};