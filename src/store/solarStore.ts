import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    type SolarData,
    type EnergyData,
    type Panel,
    type SystemMetrics,
    type PredictionData,
    type ApiError
} from '../types';
import { api } from '../services/api';

interface SolarState {
    latestData: SolarData | null;
    panels: Panel[];
    systemMetrics: SystemMetrics | null;
    predictions: PredictionData[];
    energyData: EnergyData[];
    loading: boolean;
    error: ApiError | null;

    fetchLatestData: () => Promise<void>;
    fetchPanels: () => Promise<void>;
    fetchSystemMetrics: () => Promise<void>;
    fetchPredictions: () => Promise<void>;
    fetchEnergyData: (from: string, to: string, source?: string) => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

const mockPanels: Panel[] = [
    {
        id: 1,
        name: 'Panel A-01',
        latitude: 47.0105,
        longitude: 28.8638,
        status: 'active',
        currentPower: 245,
        maxPower: 300,
        efficiency: 92,
        lastUpdate: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Panel A-02',
        latitude: 47.0108,
        longitude: 28.8642,
        status: 'active',
        currentPower: 238,
        maxPower: 300,
        efficiency: 89,
        lastUpdate: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Panel B-01',
        latitude: 47.0102,
        longitude: 28.8645,
        status: 'maintenance',
        currentPower: 0,
        maxPower: 300,
        efficiency: 0,
        lastUpdate: new Date().toISOString()
    },
    {
        id: 4,
        name: 'Panel B-02',
        latitude: 47.0110,
        longitude: 28.8640,
        status: 'active',
        currentPower: 251,
        maxPower: 300,
        efficiency: 95,
        lastUpdate: new Date().toISOString()
    }
];

const mockPredictions: PredictionData[] = [
    {
        period: 'tomorrow',
        energyKWh: 14.2,
        confidence: 78,
        factors: ['weather', 'season']
    },
    {
        period: 'week',
        energyKWh: 89.3,
        confidence: 70,
        factors: ['weather', 'season', 'maintenance']
    },
    {
        period: 'month',
        energyKWh: 342.7,
        confidence: 65,
        factors: ['weather', 'season', 'maintenance']
    }
];

const mockSystemMetrics: SystemMetrics = {
    totalPanels: 4,
    activePanels: 3,
    totalPowerGenerated: 734,
    averageEfficiency: 92,
    totalEnergyToday: 12.5,
    systemUptime: 99.2
};

export const useSolarStore = create<SolarState>()(
    devtools(
        (set) => ({
            latestData: null,
            panels: [],
            systemMetrics: null,
            predictions: [],
            energyData: [],
            loading: false,
            error: null,

            fetchLatestData: async () => {
                try {
                    set({ loading: true, error: null });
                    const data = await api.getLatestSolarData();
                    set({ latestData: data, loading: false });
                } catch (error) {
                    const apiError = error as ApiError;
                    set({ error: apiError, loading: false });

                    const mockData: SolarData = {
                        id: 1,
                        timestamp: new Date().toISOString(),
                        command: 'QPIGS',
                        commandDescription: 'General Status Parameters inquiry',
                        inverterHeatSinkTemperature: 42,
                        busVoltage: 427,
                        isLoadOn: true,
                        isChargingOn: false,
                        isSccChargingOn: true,
                        isAcChargingOn: false,
                        isSwitchedOn: true,
                        batteryData: {
                            batteryVoltage: 27.2,
                            batteryChargingCurrent: 2.5,
                            batteryCapacity: 85,
                            batteryDischargeCurrent: 1.2
                        },
                        powerData: {
                            acInputVoltage: 236.6,
                            acInputFrequency: 50,
                            acOutputVoltage: 229.8,
                            acOutputFrequency: 50,
                            acOutputActivePower: 156,
                            acOutputLoad: 1,
                            pvInputVoltage: 216.3,
                            pvInputCurrent: 0.8,
                            pvInputPower: 180
                        }
                    };
                    set({ latestData: mockData });
                }
            },

            fetchPanels: async () => {
                try {
                    set({ loading: true, error: null });
                    await new Promise(resolve => setTimeout(resolve, 500));
                    set({ panels: mockPanels, loading: false });
                } catch (error) {
                    const apiError = error as ApiError;
                    set({ error: apiError, loading: false });
                }
            },

            fetchSystemMetrics: async () => {
                try {
                    set({ loading: true, error: null });
                    await new Promise(resolve => setTimeout(resolve, 300));
                    set({ systemMetrics: mockSystemMetrics, loading: false });
                } catch (error) {
                    const apiError = error as ApiError;
                    set({ error: apiError, loading: false });
                }
            },

            fetchPredictions: async () => {
                try {
                    set({ loading: true, error: null });
                    await new Promise(resolve => setTimeout(resolve, 400));
                    set({ predictions: mockPredictions, loading: false });
                } catch (error) {
                    const apiError = error as ApiError;
                    set({ error: apiError, loading: false });
                }
            },

            fetchEnergyData: async (from: string, to: string, source?: string) => {
                try {
                    set({ loading: true, error: null });
                    const data = await api.getEnergyData(from, to, source);
                    set(state => ({
                        energyData: [...state.energyData, data],
                        loading: false
                    }));
                } catch (error) {
                    const apiError = error as ApiError;
                    set({ error: apiError, loading: false });
                }
            },

            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ loading })
        }),
        { name: 'solar-store' }
    )
);