import {
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Chip,
    useTheme
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ThermalTrendChartProps {
    data: Array<{
        timestamp: string;
        temperature: number;
        [key: string]: any;
    }>;
    loading: boolean;
}

const generateMockThermalData = () => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseTemp = 35 + Math.sin(i * 0.3) * 8 + Math.random() * 6;

        data.push({
            timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temperature: Math.round(baseTemp * 10) / 10,
            time: time.toISOString()
        });
    }

    return data;
};

export const ThermalTrendChart = ({ data, loading }: ThermalTrendChartProps) => {
    const theme = useTheme();
    const chartData = data.length > 0 ? data : generateMockThermalData();

    const maxTemp = Math.max(...chartData.map(d => d.temperature));
    const avgTemp = chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length;

    const getTempStatus = (temp: number) => {
        if (temp > 70) return { label: 'Critical', color: 'error' as const };
        if (temp > 55) return { label: 'High', color: 'warning' as const };
        if (temp > 45) return { label: 'Warm', color: 'info' as const };
        return { label: 'Normal', color: 'success' as const };
    };

    if (loading) {
        return (
            <Card>
                <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Skeleton variant="text" width="40%" height={28} />
                        <Box display="flex" gap={1}>
                            <Skeleton variant="rounded" width={60} height={24} />
                            <Skeleton variant="rounded" width={70} height={24} />
                        </Box>
                    </Box>
                    <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={1}>
                    <Typography variant="h6" fontWeight={600}>
                        Temperature Trend (24h)
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            label={`Max: ${Math.round(maxTemp)}°C`}
                            size="small"
                            color={getTempStatus(maxTemp).color}
                            variant="outlined"
                        />
                        <Chip
                            label={`Avg: ${Math.round(avgTemp)}°C`}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="timestamp"
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <YAxis
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                                domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip
                                labelFormatter={(value) => `Time: ${value}`}
                                formatter={(value: number) => [`${value}°C`, 'Temperature']}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 8
                                }}
                            />

                            <ReferenceLine
                                y={45}
                                stroke={theme.palette.success.light}
                                strokeDasharray="5 5"
                                label={{ value: "Opt", position: "right", offset: 1 }}
                            />
                            <ReferenceLine
                                y={55}
                                stroke={theme.palette.warning.main}
                                strokeDasharray="5 5"
                                label={{ value: "Wrn", position: "right", offset: 1 }}
                            />
                            <ReferenceLine
                                y={70}
                                stroke={theme.palette.error.main}
                                strokeDasharray="5 5"
                                label={{ value: "Crt", position: "right", offset: 1 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke={theme.palette.primary.main}
                                strokeWidth={3}
                                dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                <Box display="flex" justifyContent="center" gap={2} mt={4} flexWrap="wrap">
                    <Chip
                        label="Optimal (< 45°C)"
                        size="small"
                        sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }}
                    />
                    <Chip
                        label="Warning (45-55°C)"
                        size="small"
                        sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}
                    />
                    <Chip
                        label="Critical (> 70°C)"
                        size="small"
                        sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};