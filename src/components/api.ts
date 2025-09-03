// API service for centralized backend communication
const BACKEND_URL = "https://a2z-geny-backend-production-a716.up.railway.app";

export interface Device {
  deviceUid: string;
  deviceName: string;
  lastLogin?: string;
}

export interface UserData {
  id: number;
  email: string;
  fullName: string;
  createdAt?: string;
  devices: Device[];
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  message?: string;
}

export interface DeviceResponse {
  status: boolean;  // Changed from 'success' to 'status'
  data?: Device[];
  message?: string;
}

export interface SettingsData {
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

export interface SettingsResponse {
  status: boolean;
  data?: SettingsData;
  message?: string;
}

export interface DeviceConfig {
  deviceId: string;
  settings: Record<string, string | number | boolean>;
  lastUpdated: string;
  status: string;
}

export interface DeviceConfigResponse {
  success: boolean;
  config?: DeviceConfig;
  message?: string;
}

export interface StandardApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DashboardData {
  systemStatus: string;
  uptime: number;
  performance: {
    cpu: number;
    memory: number;
    network: number;
  };
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

export interface ReportsData {
  period: string;
  metrics: {
    uptime: number;
    avgLoad: number;
    errors: number;
    efficiency: number;
  };
  trends: Array<{
    date: string;
    value: number;
    metric: string;
  }>;
  summary: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
  };
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  type: 'maintenance' | 'backup' | 'monitoring' | 'update';
  priority?: 'low' | 'medium' | 'high';
}

export interface ScheduleData {
  tasks: TaskData[];
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface MonitoringData {
  realTimeMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    networkSpeed: number;
    temperature: number;
    diskUsage: number;
    activeConnections: number;
  };
  alerts: Array<{
    id: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
    source: string;
  }>;
  systemHealth: {
    overall: 'healthy' | 'warning' | 'critical';
    services: Array<{
      name: string;
      status: 'running' | 'stopped' | 'error';
      uptime: number;
    }>;
  };
}

export type DashboardResponse = StandardApiResponse<DashboardData>;
export type ReportsResponse = StandardApiResponse<ReportsData>;  
export type ScheduleResponse = StandardApiResponse<ScheduleData>;
export type MonitoringResponse = StandardApiResponse<MonitoringData>;

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User Authentication
  async loginUser(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async registerUser(email: string, password: string, fullName: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  // Device Authentication
  async loginDevice(deviceUid: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/devices/signIn', {
      method: 'POST',
      body: JSON.stringify({ deviceUid, password }),
    });
  }

  async getDeviceConfig(token: string): Promise<DeviceConfigResponse> {
    return this.request<DeviceConfigResponse>('/devices/config', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Device Management
  async getUserDevices(token: string): Promise<DeviceResponse> {
    return this.request<DeviceResponse>('/users/devices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addDevice(token: string, deviceUid: string, deviceName: string): Promise<StandardApiResponse> {
    // Debug log
    console.log('Adding device with payload:', { deviceUid, deviceName });
    
    // Try multiple approaches to handle different backend expectations
    const methods = [
      // Method 1: Standard JSON
      () => this.request<StandardApiResponse>('/users/devices/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceUid, deviceName }),
      }),
      
      // Method 2: Form URL encoded
      () => {
        const formData = new URLSearchParams();
        formData.append('deviceUid', deviceUid);
        formData.append('deviceName', deviceName);
        
        return this.request<StandardApiResponse>('/users/devices/assign', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });
      },
      
      // Method 3: Multipart form data
      () => {
        const formData = new FormData();
        formData.append('deviceUid', deviceUid);
        formData.append('deviceName', deviceName);
        
        return this.request<StandardApiResponse>('/users/devices/assign', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type, let browser set it with boundary
          },
          body: formData,
        });
      },
      
      // Method 4: Plain text
      () => this.request<StandardApiResponse>('/users/devices/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ deviceUid, deviceName }),
      }),
    ];

    // Try each method until one works
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`Trying method ${i + 1} for device assignment`);
        const result = await methods[i]();
        console.log(`Method ${i + 1} succeeded`);
        return result;
      } catch (error) {
        console.log(`Method ${i + 1} failed:`, error);
        if (i === methods.length - 1) {
          // If all methods fail, throw the last error
          throw error;
        }
      }
    }
    
    // This shouldn't be reached, but TypeScript requires it
    throw new Error('All methods failed');
  }

  // Alternative method with different content type
  async addDeviceForm(token: string, deviceUid: string, deviceName: string): Promise<StandardApiResponse> {
    const formData = new URLSearchParams();
    formData.append('deviceUid', deviceUid);
    formData.append('deviceName', deviceName);

    return this.request<StandardApiResponse>('/users/devices/assign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async removeDevice(token: string, deviceUid: string): Promise<StandardApiResponse> {
    return this.request<StandardApiResponse>(`/users/devices/${deviceUid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Settings Management
  async getSettings(token: string): Promise<SettingsResponse> {
    return this.request<SettingsResponse>('/ui/settings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateSettings(token: string, settings: Record<string, string>): Promise<StandardApiResponse> {
    return this.request<StandardApiResponse>('/ui/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
  }

  // Dashboard Data
  async getDashboardData(token: string): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/dashboard/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getReportsData(token: string): Promise<ReportsResponse> {
    return this.request<ReportsResponse>('/reports/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getScheduleData(token: string): Promise<ScheduleResponse> {
    return this.request<ScheduleResponse>('/schedule/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Real-time monitoring
  async getMonitoringData(token: string): Promise<MonitoringResponse> {
    return this.request<MonitoringResponse>('/monitoring/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();