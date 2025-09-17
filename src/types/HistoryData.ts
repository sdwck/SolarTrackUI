export interface HistoryData {
    timestamp: string;
    solarInput: number;
    batteryLevel: number;
    powerOutput: number;
    temperature: number;
    efficiency: number;
    status: 'optimal' | 'good' | 'low';
}