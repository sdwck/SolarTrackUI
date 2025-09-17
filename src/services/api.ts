import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    type SolarData,
    type BatteryData,
    type EnergyData,
    type PaginatedResponse,
    type ApiError,
    type MaintenanceTask,
    type CreateMaintenanceTaskRequest,
    type UpdateMaintenanceTaskRequest,
    type MaintenanceTaskStats,
    type PredictionData,
    type SystemMetrics,
    type AnalyticsData,
    type HistoryData,
} from '../types';

const BASE_URL = 'https://localhost:7039/api';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                const apiError: ApiError = {
                    message: error.response?.data?.message || error.message || 'Unknown error',
                    status: error.response?.status || 0,
                    timestamp: new Date().toISOString()
                };

                console.error('API Error:', apiError);
                return Promise.reject(apiError);
            }
        );
    }

    async getLatestSolarData(): Promise<SolarData> {
        const response = await this.client.get<SolarData>('/SolarData/latest');
        return response.data;
    }

    async getSolarData(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<SolarData>> {
        const response = await this.client.get<PaginatedResponse<SolarData>>('/SolarData', {
            params: { page, pageSize }
        });
        return response.data;
    }

    async getSolarDataById(id: number): Promise<SolarData> {
        const response = await this.client.get<SolarData>(`/SolarData/${id}`);
        return response.data;
    }

    async getSolarDataRange(from: string, to: string, gap: number = 5): Promise<SolarData[]> {
        const response = await this.client.get<SolarData[]>('/SolarData/range', {
            params: { from, to, gap }
        });
        return response.data;
    }

    async getBatteryData(id: number): Promise<BatteryData> {
        const response = await this.client.get<BatteryData>(`/SolarData/${id}/battery`);
        return response.data;
    }

    async getEnergyData(from: string, to: string, source?: string): Promise<EnergyData> {
        const response = await this.client.get<EnergyData>('/SolarData/energy', {
            params: { from, to, source }
        });
        return response.data;
    }

    async getMaintenanceTasks(status?: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<MaintenanceTask>> {
        const response = await this.client.get<PaginatedResponse<MaintenanceTask>>('/Maintenance', {
            params: { status, page, pageSize }
        });
        return response.data;
    }

    async getMaintenanceTask(id: string): Promise<MaintenanceTask> {
        const response = await this.client.get<MaintenanceTask>(`/Maintenance/${id}`);
        return response.data;
    }

    async createMaintenanceTask(task: CreateMaintenanceTaskRequest): Promise<MaintenanceTask> {
        const response = await this.client.post<MaintenanceTask>('/Maintenance', task);
        return response.data;
    }

    async updateMaintenanceTask(id: string, task: UpdateMaintenanceTaskRequest): Promise<MaintenanceTask> {
        const response = await this.client.patch<MaintenanceTask>(`/Maintenance/${id}`, task);
        return response.data;
    }

    async deleteMaintenanceTask(id: string): Promise<void> {
        await this.client.delete(`/Maintenance/${id}`);
    }

    async completeMaintenanceTask(id: string, notes?: string): Promise<MaintenanceTask> {
        const response = await this.client.patch<MaintenanceTask>(`/Maintenance/${id}/complete`, { notes });
        return response.data;
    }

    async getMaintenanceStats(): Promise<MaintenanceTaskStats> {
        const response = await this.client.get<MaintenanceTaskStats>('/Maintenance/stats');
        return response.data;
    }

    async getPredictionData(period: 'today' | 'tomorrow' | 'week' | 'month'): Promise<PredictionData> {
        const response = await this.client.get<PredictionData>('/SolarData/prediction', {
            params: { period }
        });
        return response.data;
    }

    async getSystemMetrics(): Promise<SystemMetrics> {
        const response = await this.client.get<SystemMetrics>('/SolarData/metrics');
        return response.data;
    }

    async getAnalyticsData(timeRange: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData> {
        const response = await this.client.get<AnalyticsData>('/SolarData/analytics', {
            params: { timeRange }
        });
        return response.data;
    }

    async getHistoryData(
        timeRange: 'today' | '3days' | 'week' | 'month',
        from?: string,
        to?: string
    ): Promise<HistoryData[]> {
        const response = await this.client.get<HistoryData[]>('/SolarData/history', {
            params: { timeRange, from, to }
        });
        return response.data;
    }
}

export const api = new ApiService();
export default api;