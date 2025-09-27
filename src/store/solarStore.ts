import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    type SolarData,
    type EnergyData,
    type SystemMetrics,
    type PredictionData,
    type ApiError
} from '../types';
import { api } from '../services/api';

interface SolarState {
    latestData: SolarData | null;
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
                    const data = await api.getLatestSolarData();
                    set({ latestData: data });
                } catch (error) {
                    set({ error: error as ApiError });
                }
            },

            fetchPredictions: async () => {
                try {
                    const tomorrowData = await api.getPredictionData('tomorrow');
                    const weekData = await api.getPredictionData('week');
                    const monthData = await api.getPredictionData('month');
                    set({ predictions: [tomorrowData, weekData, monthData] });
                } catch (error) {
                    set({ error: error as ApiError });
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

            fetchSystemMetrics: async () => {
                try {
                    set({ loading: true, error: null });
                    const data = await api.getSystemMetrics();
                    set({ systemMetrics: data, loading: false });
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