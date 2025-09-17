export interface PredictionData {
    period: 'today' | 'tomorrow' | 'week' | 'month';
    energyKWh: number;
    confidence: number;
    factors: string[];
}
