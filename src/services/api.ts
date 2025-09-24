import axios from '../utils/axiosConfig';
import {
    type SolarData,
    type BatteryData,
    type EnergyData,
    type PaginatedResponse,
    type MaintenanceTask,
    type CreateMaintenanceTaskRequest,
    type UpdateMaintenanceTaskRequest,
    type MaintenanceTaskStats,
    type PredictionData,
    type SystemMetrics,
    type AnalyticsData,
    type HistoryData,
    type SystemMode
} from '../types';

class ApiService {
    async getLatestSolarData(): Promise<SolarData> {
        const response = await axios.get<SolarData>('/SolarData/latest');
        return response.data;
    }

    async getSolarData(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<SolarData>> {
        const response = await axios.get<PaginatedResponse<SolarData>>('/SolarData', {
            params: { page, pageSize }
        });
        return response.data;
    }

    async getSolarDataById(id: number): Promise<SolarData> {
        const response = await axios.get<SolarData>(`/SolarData/${id}`);
        return response.data;
    }

    async getSolarDataRange(from: string, to: string, gap: number = 5): Promise<SolarData[]> {
        const response = await axios.get<SolarData[]>('/SolarData/range', {
            params: { from, to, gap }
        });
        return response.data;
    }

    async getBatteryData(id: number): Promise<BatteryData> {
        const response = await axios.get<BatteryData>(`/SolarData/${id}/battery`);
        return response.data;
    }

    async getEnergyData(from: string, to: string, source?: string): Promise<EnergyData> {
        const response = await axios.get<EnergyData>('/SolarData/energy', {
            params: { from, to, source }
        });
        return response.data;
    }

    async getMaintenanceTasks(filter?: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<MaintenanceTask>> {
        const response = await axios.get<PaginatedResponse<MaintenanceTask>>('/Maintenance', {
            params: { filter, page, pageSize }
        });
        return response.data;
    }

    async getMaintenanceTask(id: string): Promise<MaintenanceTask> {
        const response = await axios.get<MaintenanceTask>(`/Maintenance/${id}`);
        return response.data;
    }

    async createMaintenanceTask(task: CreateMaintenanceTaskRequest): Promise<MaintenanceTask> {
        const response = await axios.post<MaintenanceTask>('/Maintenance', task);
        return response.data;
    }

    async updateMaintenanceTask(id: string, task: UpdateMaintenanceTaskRequest): Promise<MaintenanceTask> {
        const response = await axios.patch<MaintenanceTask>(`/Maintenance/${id}`, task);
        return response.data;
    }

    async deleteMaintenanceTask(id: string): Promise<void> {
        await axios.delete(`/Maintenance/${id}`);
    }

    async completeMaintenanceTask(id: string, notes?: string): Promise<MaintenanceTask> {
        const response = await axios.patch<MaintenanceTask>(`/Maintenance/${id}/complete`, { notes });
        return response.data;
    }

    async getMaintenanceStats(): Promise<MaintenanceTaskStats> {
        const response = await axios.get<MaintenanceTaskStats>('/Maintenance/stats');
        return response.data;
    }

    async getPredictionData(period: 'today' | 'tomorrow' | 'week' | 'month'): Promise<PredictionData> {
        const response = await axios.get<PredictionData>('/SolarData/prediction', {
            params: { period }
        });
        return response.data;
    }

    async getSystemMetrics(): Promise<SystemMetrics> {
        const response = await axios.get<SystemMetrics>('/SolarData/metrics');
        return response.data;
    }

    async getAnalyticsData(timeRange: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData> {
        const response = await axios.get<AnalyticsData>('/SolarData/analytics', {
            params: { timeRange }
        });
        return response.data;
    }

    async getHistoryData(
        timeRange: 'today' | '3days' | 'week' | 'month',
        from?: string,
        to?: string
    ): Promise<HistoryData[]> {
        const response = await axios.get<HistoryData[]>('/SolarData/history', {
            params: { timeRange, from, to }
        });
        return response.data;
    }

    async getSystemMode(): Promise<SystemMode> {
        const response = await axios.get<SystemMode>('/ChargeSwitch/mode');
        return response.data;
    }

    async setBatteryMode(mode: string): Promise<void> {
        await axios.post('/ChargeSwitch/battery', null, {
            params: { option: mode }
        });
    }

    async setLoadMode(mode: string): Promise<void> {
        await axios.post('/ChargeSwitch/load', null, {
            params: { option: mode }
        });
    }
}

export const api = new ApiService();
export default api;