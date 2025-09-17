export interface AnalyticsData {
    dailyAverage: {
        solarGeneration: number;
        batteryUsage: number;
        efficiency: number;
        uptime: number;
    };
    weeklyTrends: {
        energyProduced: number;
        energyConsumed: number;
        savings: number;
        co2Avoided: number;
    };
    monthlyComparison: {
        thisMonth: number;
        lastMonth: number;
        improvement: number;
        bestDay: string;
    };
    insights: Array<{
        type: 'positive' | 'warning' | 'info';
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
    }>;
}