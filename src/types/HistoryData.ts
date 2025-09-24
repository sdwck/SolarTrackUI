export interface HistoryData {
    timestamp: string;
    solarInput: number;
    batteryLevel: number;
    powerOutput: number;
    temperature: number;
    status: 'optimal' | 'good' | 'low';
}