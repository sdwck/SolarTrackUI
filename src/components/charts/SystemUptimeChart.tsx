import {
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Chip,
    Grid,
    useTheme
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemUptimeChartProps {
    data: Array<{
        timestamp: string;
        isSystemOn: boolean;
        [key: string]: any;
    }>;
    loading: boolean;
}

export const SystemUptimeChart = ({ data, loading }: SystemUptimeChartProps) => {
    const theme = useTheme();

    const chartData = data.reduce((acc, curr) => {
        const date = new Date(curr.timestamp);
        const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const existing = acc.find(d => d.day === day);
        if (existing) {
            if (curr.isSystemOn) {
                existing.uptime += 1;
                existing.downtime -= 1;
            }
        } else {
            acc.push({
                day,
                date: day,
                uptime: curr.isSystemOn ? 1 : 0,
                downtime: curr.isSystemOn ? 23 : 24
            });
        }
        return acc;
    }, [] as Array<{ day: string; date: string; uptime: number; downtime: number }>);

    const avgUptime = data.reduce((sum, d) => sum + (d.isSystemOn ? 1 : 0), 0) * 100 / (24 * 7);
    const totalUptime = data.reduce((sum, d) => sum + (d.isSystemOn ? 1 : 0), 0);

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
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                    <Grid container spacing={2}>
                        {[...Array(3)].map((_, i) => (
                            <Grid size={{ xs: 12, sm: 4 }} key={i}>
                                <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mb: 1 }} />
                                    <Skeleton variant="text" width="40%" height={32} sx={{ mx: 'auto' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                    <Typography variant="h6" fontWeight={600}>
                        System Uptime (7 Days)
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            label={`Avg: ${Math.round(avgUptime)}%`}
                            size="small"
                            color={avgUptime > 95 ? 'success' : avgUptime > 90 ? 'warning' : 'error'}
                            variant="outlined"
                        />
                        <Chip
                            label={`Total: ${Math.round(totalUptime)}h`}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="day"
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <YAxis
                                fontSize={12}
                                tick={{ fill: theme.palette.text.secondary }}
                                domain={[0, 24]}
                            />
                            <Tooltip
                                labelFormatter={(value, payload) => {
                                    const data = payload?.[0]?.payload;
                                    return `${value} (${data?.date})`;
                                }}
                                formatter={(value: number, name: string) => {
                                    if (name === 'uptime') return [`${value}h`, 'Uptime'];
                                    if (name === 'downtime') return [`${value}h`, 'Downtime'];
                                    return [value, name];
                                }}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 8
                                }}
                            />
                            <Bar
                                dataKey="uptime"
                                stackId="time"
                                fill={theme.palette.success.main}
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="downtime"
                                stackId="time"
                                fill={theme.palette.error.main}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: theme.palette.success.light + '20', borderRadius: 2 }}>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                                Average Uptime
                            </Typography>
                            <Typography variant="h6" color="success.main" fontWeight={700}>
                                {Math.round(avgUptime)}%
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: theme.palette.primary.light + '20', borderRadius: 2 }}>
                            <Typography variant="body2" color="primary.main" fontWeight={600}>
                                Total Runtime
                            </Typography>
                            <Typography variant="h6" color="primary.main" fontWeight={700}>
                                {Math.round(totalUptime)}h
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: theme.palette.info.light + '20', borderRadius: 2 }}>
                            <Typography variant="body2" color="info.main" fontWeight={600}>
                                Reliability
                            </Typography>
                            <Typography variant="h6" color="info.main" fontWeight={700}>
                                {avgUptime > 98 ? 'Excellent' : avgUptime > 95 ? 'Good' : avgUptime > 90 ? 'Fair' : 'Poor'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" gap={2} mt={{ xs: 2, xl: 4.5 }}>
                    <Chip
                        label="Uptime"
                        size="small"
                        sx={{ bgcolor: theme.palette.success.main, color: 'white' }}
                    />
                    <Chip
                        label="Downtime"
                        size="small"
                        sx={{ bgcolor: theme.palette.error.main, color: 'white' }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};