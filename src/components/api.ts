// src/components/api.ts - Updated API service
const BACKEND_URL = "http://localhost:8080";
// const BACKEND_URL = "https://a2z-geny-backend-production-a716.up.railway.app";

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
  status: boolean;
  data?: Device[];
  message?: string;
}

export interface SettingsData {
  deviceUid: string;
  // A1-A15 Parameters with descriptive names
  mainVoltageUpperLimit: number;        // A1
  mainVoltageLowerLimit: number;        // A2
  genVoltageUpperLimit: number;         // A3
  genVoltageLowerLimit: number;         // A4
  currentUpperLimit: number;            // A5
  currentLowerLimit: number;            // A6
  powerUpperLimit: number;              // A7
  powerLowerLimit: number;              // A8
  rpmUpperLimit: number;                // A9
  rpmLowerLimit: number;                // A10
  coolantTempUpperLimit: number;        // A11
  coolantTempLowerLimit: number;        // A12
  fuelLevelWarningLimit: number;        // A13
  fuelLevelCriticalLimit: number;       // A14
  batteryVoltageUpperLimit: number;     // A15
  batteryVoltageLowerLimit?: number;    // Additional parameter
}

export interface SettingsResponse {
  status: boolean;
  data?: SettingsData;
  message?: string;
}

export interface DeviceConfig {
  deviceId?: string;
  deviceUid: string;
  deviceName: string;
  lastLogin: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  project_password?: string;
  tsx?: string;
  settings?: Record<string, string | number | boolean>;
  status?: string;
}

export interface DeviceConfigResponse {
  status: boolean;
  data?: DeviceConfig;
  config?: DeviceConfig; // Some backends might use this field
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
    
    const hasBody = options.body && options.method !== 'GET';
    
    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        ...(hasBody && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } catch {
          // If we can't parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      if (!text) {
        return { success: true } as T;
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
    console.log('Adding device with payload:', { deviceUid, deviceName });
    
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
          },
          body: formData,
        });
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`Trying method ${i + 1} for device assignment`);
        const result = await methods[i]();
        console.log(`Method ${i + 1} succeeded`);
        return result;
      } catch (error) {
        console.log(`Method ${i + 1} failed:`, error);
        if (i === methods.length - 1) {
          throw error;
        }
      }
    }
    
    throw new Error('All methods failed');
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

  async updateSettings(token: string, settings: Partial<SettingsData>): Promise<StandardApiResponse> {
    return this.request<StandardApiResponse>('/ui/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
  }

  async resetSettings(token: string): Promise<StandardApiResponse> {
    return this.request<StandardApiResponse>('/ui/settings/reset', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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

  async getMonitoringData(token: string): Promise<MonitoringResponse> {
    return this.request<MonitoringResponse>('/monitoring/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();