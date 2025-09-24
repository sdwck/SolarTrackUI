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

interface VoltageStabilityChartProps {
    data: Array<{
        timestamp: string;
        busVoltage: number;
        batteryVoltage: number;
        acInputVoltage: number;
        acOutputVoltage: number;
        [key: string]: any;
    }>;
    loading: boolean;
}

export const VoltageStabilityChart = ({ data, loading }: VoltageStabilityChartProps) => {
    const theme = useTheme();

    const todaysData = data
        .filter(d => {
            const date = new Date(d.timestamp);
            return date >= new Date(Date.now() - 24 * 60 * 60 * 1000);
        })
        .map(d => ({
            ...d,
            timestamp: new Date(d.timestamp).toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }));

    const busVariance = Math.max(...todaysData.map(d => d.busVoltage)) - Math.min(...todaysData.map(d => d.busVoltage));
    const batteryVariance = Math.max(...todaysData.map(d => d.batteryVoltage)) - Math.min(...todaysData.map(d => d.batteryVoltage));

    if (loading) {
        return (
            <Card sx={{ flex: 1 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Skeleton variant="text" width="40%" height={28} />
                        <Box display="flex" gap={1}>
                            <Skeleton variant="rounded" width={80} height={24} />
                            <Skeleton variant="rounded" width={90} height={24} />
                        </Box>
                    </Box>
                    <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                    <Box display="flex" justifyContent="center" gap={1} mt={2}>
                        <Skeleton variant="rounded" width={100} height={24} />
                        <Skeleton variant="rounded" width={120} height={24} />
                        <Skeleton variant="rounded" width={110} height={24} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                    <Typography variant="h6" fontWeight={600}>
                        Voltage Stability (24h)
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            label={`Bus: ±${Math.round(busVariance)}V`}
                            size="small"
                            color={busVariance < 20 ? 'success' : busVariance < 40 ? 'warning' : 'error'}
                            variant="outlined"
                        />
                        <Chip
                            label={`Battery: ±${Math.round(batteryVariance * 10) / 10}V`}
                            size="small"
                            color={batteryVariance < 2 ? 'success' : batteryVariance < 4 ? 'warning' : 'error'}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={todaysData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="timestamp"
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <YAxis
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                                domain={['dataMin - 20', 'dataMax + 20']}
                            />
                            <Tooltip
                                labelFormatter={(value) => `Time: ${value}`}
                                formatter={(value: number, name: string) => {
                                    const labels: Record<string, string> = {
                                        busVoltage: 'Bus Voltage',
                                        batteryVoltage: 'Battery Voltage',
                                        acInputVoltage: 'AC Input',
                                        acOutputVoltage: 'AC Output'
                                    };
                                    return [`${value}V`, labels[name] || name];
                                }}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 8
                                }}
                            />

                            <ReferenceLine
                                y={400}
                                stroke={theme.palette.warning.main}
                                strokeDasharray="3 3"
                            />
                            <ReferenceLine
                                y={450}
                                stroke={theme.palette.warning.main}
                                strokeDasharray="3 3"
                            />

                            <Line
                                type="monotone"
                                dataKey="busVoltage"
                                stroke={theme.palette.primary.main}
                                strokeWidth={2}
                                dot={false}
                                name="busVoltage"
                            />
                            <Line
                                type="monotone"
                                dataKey="batteryVoltage"
                                stroke={theme.palette.success.main}
                                strokeWidth={2}
                                dot={false}
                                name="batteryVoltage"
                                yAxisId="right"
                            />
                            <Line
                                type="monotone"
                                dataKey="acInputVoltage"
                                stroke={theme.palette.warning.main}
                                strokeWidth={2}
                                dot={false}
                                name="acInputVoltage"
                            />
                            <Line
                                type="monotone"
                                dataKey="acOutputVoltage"
                                stroke={theme.palette.info.main}
                                strokeWidth={2}
                                dot={false}
                                name="acOutputVoltage"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                <Box
                    display={{ xs: 'grid', sm: 'flex' }}
                    gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: undefined }}
                    gap={2}
                    mt={4}
                    flexWrap="wrap"
                    justifyContent="center"
                >
                    <Chip
                        label="Bus Voltage"
                        size="small"
                        sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}
                    />
                    <Chip
                        label="Battery Voltage"
                        size="small"
                        sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }}
                    />
                    <Chip
                        label="AC Input"
                        size="small"
                        sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}
                    />
                    <Chip
                        label="AC Output"
                        size="small"
                        sx={{ bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};