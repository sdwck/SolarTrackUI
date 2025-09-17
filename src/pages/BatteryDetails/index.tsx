import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Avatar,
    LinearProgress,
    Chip,
    Skeleton,
    Alert,
    useTheme,
    useMediaQuery,
    ButtonGroup,
    TextField,
} from '@mui/material';
import {
    Battery80,
    BatteryChargingFull,
    BatteryFull,
    Refresh,
    ArrowBack,
    TrendingUp,
    TrendingDown,
    TrendingFlat,
    ElectricBolt,
    PowerSettingsNew,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { type BatteryData, type SolarData, type PowerData } from '../../types';
import type { NameType } from 'recharts/types/component/DefaultTooltipContent';

interface BatteryStatsCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    color: 'primary' | 'success' | 'warning' | 'error';
    trend?: 'up' | 'down' | 'flat';
    loading?: boolean;
}

interface BatteryChartData {
    time: string;
    voltage: number;
    capacity: number;
    chargingCurrent: number;
    dischargeCurrent: number;
    efficiency: number;
}

const BatteryStatsCard = ({ title, value, unit, icon, color, trend, loading }: BatteryStatsCardProps) => {
    const theme = useTheme();

    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2, height: '100%', pb: '16px !important' }}>
                    <Box display="flex" alignItems="center" gap={1.5} height="100%">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flexGrow: 1 }}>
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="80%" height={28} />
                        </Box>
                        <Skeleton variant="circular" width={20} height={20} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return <TrendingUp fontSize="small" color="success" />;
            case 'down': return <TrendingDown fontSize="small" color="error" />;
            default: return <TrendingFlat fontSize="small" color="action" />;
        }
    };

    return (
        <Card sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ p: 2, height: '100%', pb: '16px !important' }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    height="100%"
                >
                    <Avatar
                        sx={{
                            bgcolor: `${theme.palette[color].main}20`,
                            color: theme.palette[color].main,
                            width: 40,
                            height: 40,
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {title}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {value}{unit}
                        </Typography>
                    </Box>
                    {trend && getTrendIcon()}
                </Box>
            </CardContent>
        </Card>
    );
};

const computePad = (min: number, max: number) => {
    if (!isFinite(min) || !isFinite(max)) return 0;
    const range = Math.abs(max - min);
    if (range === 0) return Math.max(1, Math.round(Math.abs(min) * 0.05));
    const pad = Math.max(Math.round(range * 0.05), 1);
    return pad;
};

const computeDomain = (values: number[], allowNegative = false): [number, number] => {
    const nums = values.filter(v => typeof v === 'number' && isFinite(v));
    if (nums.length === 0) return [0, 1];
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    if (nums.every(v => v === 0)) return [0, 1];
    if (min === max) {
        const pad = computePad(min, max);
        const lower = allowNegative ? min - pad : Math.max(0, min - pad);
        const upper = max + pad;
        return [lower, upper];
    }
    const pad = computePad(min, max);
    const lower = allowNegative ? min - pad : Math.max(0, min - pad);
    const upper = max + pad;
    return [lower, upper];
};

const BatteryVoltageChart = ({ data, loading }: { data: BatteryChartData[]; loading: boolean }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Skeleton variant="rectangular" height={200} sx={{ mb: 4.5, width: { xs: '83%', sm: '92%', md: '88%' } }} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const voltages = data.map(d => d.voltage);
    const [minV, maxV] = computeDomain(voltages, false);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Battery Voltage Trend
                </Typography>
                <Box sx={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="time"
                                fontSize={12}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                }}
                            />
                            <YAxis fontSize={12} domain={[minV, maxV]} />
                            <Tooltip
                                labelFormatter={(value) => `Time: ${value}`}
                                formatter={(value: number) => [`${value}V`, 'Voltage']}
                            />
                            <Line
                                type="monotone"
                                dataKey="voltage"
                                stroke="#1976d2"
                                strokeWidth={2}
                                dot={{ fill: '#1976d2', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

const BatteryCapacityChart = ({ data, loading }: { data: BatteryChartData[]; loading: boolean }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Skeleton variant="rectangular" height={200} sx={{ mb: 4.5, width: { xs: '83%', sm: '92%', md: '88%' } }} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const caps = data.map(d => d.capacity);
    const [minC, maxC] = computeDomain(caps, false);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Battery Capacity Over Time
                </Typography>
                <Box sx={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="time"
                                fontSize={12}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                }}
                            />
                            <YAxis fontSize={12} domain={[minC, maxC]} />
                            <Tooltip
                                labelFormatter={(value) => `Time: ${value}`}
                                formatter={(value: number) => [`${value}%`, 'Capacity']}
                            />
                            <Bar
                                dataKey="capacity"
                                fill="#2e7d32"
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

const CurrentFlowChart = ({ data, loading }: { data: BatteryChartData[]; loading: boolean }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Skeleton variant="rectangular" height={200} sx={{ mb: 4.5, width: { xs: '83%', sm: '92%', md: '88%' } }} />
                    </Box>
                    <Box display="flex" justifyContent="center" gap={2} mt={2}>
                        <Skeleton variant="rounded" width={130} height={24} />
                        <Skeleton variant="rounded" width={130} height={24} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const charging = data.map(d => d.chargingCurrent);
    const discharging = data.map(d => d.dischargeCurrent);
    const all = charging.concat(discharging);
    const numericAll = all.filter(v => typeof v === 'number' && isFinite(v));
    const [minI, maxI] = computeDomain(numericAll, false);

    const chargingNums = charging.filter(v => typeof v === 'number' && isFinite(v));
    const dischargingNums = discharging.filter(v => typeof v === 'number' && isFinite(v));
    const avgCharge = chargingNums.length ? Math.round((chargingNums.reduce((a, b) => a + b, 0) / chargingNums.length) * 10) / 10 : 0;
    const avgDischarge = dischargingNums.length ? Math.round((dischargingNums.reduce((a, b) => a + b, 0) / dischargingNums.length) * 10) / 10 : 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Current Flow Analysis
                </Typography>
                <Box sx={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="time"
                                fontSize={12}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                }}
                            />
                            <YAxis fontSize={12} domain={[minI, maxI]} />
                            <Tooltip
                                labelFormatter={(value) => `Time: ${value}`}
                                formatter={(value: number, name: string) => [`${value}A`, name === 'chargingCurrent' ? 'Charging' : 'Discharge']}
                            />
                            <Line
                                type="monotone"
                                dataKey="chargingCurrent"
                                stroke="#4caf50"
                                strokeWidth={2}
                                name="chargingCurrent"
                                dot={{ fill: '#4caf50', strokeWidth: 2, r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="dischargeCurrent"
                                stroke="#f44336"
                                strokeWidth={2}
                                name="dischargeCurrent"
                                dot={{ fill: '#f44336', strokeWidth: 2, r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Chip label={`Avg Charging: ${avgCharge}A`} variant="outlined" size="small" color="success" />
                    <Chip label={`Avg Discharge: ${avgDischarge}A`} variant="outlined" size="small" color="warning" />
                </Box>
            </CardContent>
        </Card>
    );
};

const BatteryHealthPieChart = ({ data, loading }: { data: BatteryChartData[]; loading: boolean }) => {
    const theme = useTheme();

    if (loading || data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={28} sx={{ mb: 6 }} />
                    <Skeleton variant="circular" width={160} height={160} sx={{ mx: 'auto' }} />
                    <Box display="flex" justifyContent="center" gap={2} mt={7}>
                        <Skeleton variant="rounded" width={130} height={24} />
                        <Skeleton variant="rounded" width={130} height={24} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const avgEfficiency = data.reduce((sum, item) => sum + item.efficiency, 0) / data.length;
    const avgVoltage = Math.round(data.reduce((s, i) => s + i.voltage, 0) / data.length * 10) / 10;

    const pieData = [
        { name: 'Efficiency', value: Math.round(avgEfficiency), color: theme.palette.success.main },
        { name: 'Loss', value: Math.round(100 - avgEfficiency), color: theme.palette.error.main },
    ];

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Battery Health Overview
                </Typography>
                <Box sx={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number, name: NameType) => [`${value}%`, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Chip
                        label={`Avg Voltage: ${avgVoltage}V`}
                        variant="outlined"
                        size="small"
                    />
                    <Chip
                        label={`Avg Efficiency: ${Math.round(avgEfficiency)}%`}
                        variant="outlined"
                        size="small"
                        color={avgEfficiency > 85 ? 'success' : avgEfficiency > 70 ? 'warning' : 'error'}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default function BatteryDetails() {
    const [batteryHistory, setBatteryHistory] = useState<BatteryChartData[]>([]);
    const [currentBattery, setCurrentBattery] = useState<BatteryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [historyGap, setHistoryGap] = useState(5);

    const toLocalDateTimeInput = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const timeRanges = [
        { label: '1h', hours: 1 },
        { label: '6h', hours: 6 },
        { label: '12h', hours: 12 },
        { label: '24h', hours: 24 },
        { label: '7d', hours: 24 * 7 },
        { label: '30d', hours: 24 * 30 },
        { label: '90d', hours: 24 * 90 },
    ];

    const handleHistoryIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(event.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 9999) val = 9999;
        setHistoryGap(val);
    }

    const [customRange, setCustomRange] = useState<{ from: string; to: string }>(() => {
        const end = new Date();
        const start = new Date(end);
        start.setHours(end.getHours() - 1);
        return { from: toLocalDateTimeInput(start), to: toLocalDateTimeInput(end) };
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const applyPresetRange = (hours: number) => {
        const end = new Date();
        const start = new Date(end);
        start.setHours(end.getHours() - hours);
        setCustomRange({ from: toLocalDateTimeInput(start), to: toLocalDateTimeInput(end) });
    };

    const fetchBatteryData = async () => {
        try {
            setError(null);
            setLoading(true);

            const startDate = new Date(customRange.from);
            const endDate = new Date(customRange.to);

            if (!isFinite(startDate.getTime()) || !isFinite(endDate.getTime())) {
                setError('Invalid date range');
                setBatteryHistory([]);
                return;
            }

            if (startDate >= endDate) {
                setError('From must be earlier than To');
                setBatteryHistory([]);
                return;
            }

            const rangeHours = Math.abs((endDate.getTime() - startDate.getTime()) / 3600000);

            const [latestResponse, rangeResponse] = await Promise.all([
                api.getLatestSolarData(),
                api.getSolarDataRange(
                    startDate.toISOString(),
                    endDate.toISOString(),
                    historyGap
                )
            ]);

            if (latestResponse?.batteryData) {
                setCurrentBattery(latestResponse.batteryData);
            }

            const calculateEfficiency = (powerData: PowerData): number => {
                if (!powerData.pvInputPower || !powerData.acOutputActivePower) return 0;
                if (powerData.pvInputPower === 0) return 0;
                return Math.round((powerData.acOutputActivePower / powerData.pvInputPower) * 100);
            };

            if (rangeResponse && rangeResponse.length > 0) {
                rangeResponse.sort((a: SolarData, b: SolarData) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                let chartData: BatteryChartData[] = rangeResponse
                    .filter((item: SolarData) => item.batteryData && item.batteryData.batteryVoltage !== undefined && item.batteryData.batteryCapacity !== 0)
                    .map((item: SolarData) => ({
                        time: new Date(item.timestamp).toLocaleString(),
                        voltage: item.batteryData!.batteryVoltage,
                        capacity: item.batteryData!.batteryCapacity,
                        chargingCurrent: item.batteryData!.batteryChargingCurrent,
                        dischargeCurrent: item.batteryData!.batteryDischargeCurrent,
                        efficiency: calculateEfficiency(item.powerData),
                    }));

                const maxPoints = (() => {
                    if (rangeHours <= 1) return 60;
                    if (rangeHours <= 6) return 240;
                    if (rangeHours <= 12) return 480;
                    if (rangeHours <= 24) return 720;
                    return 1000;
                })();

                if (chartData.length > maxPoints) {
                    const step = Math.ceil(chartData.length / maxPoints);
                    const sampled = chartData.filter((_, idx) => idx % step === 0);
                    if (sampled.length === 0) sampled.push(chartData[chartData.length - 1]);
                    if (sampled[sampled.length - 1].time !== chartData[chartData.length - 1].time) sampled.push(chartData[chartData.length - 1]);
                    chartData = sampled;
                }

                setBatteryHistory(chartData.slice(-1000));
            } else {
                setBatteryHistory([]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch battery data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBatteryData();
    };

    useEffect(() => {
        fetchBatteryData();
    }, []);

    const getBatteryIcon = () => {
        if (!currentBattery) return <Battery80 />;
        if (currentBattery.batteryChargingCurrent > 0) return <BatteryChargingFull />;
        return <BatteryFull />;
    };

    const getBatteryColor = (capacity: number): 'success' | 'warning' | 'error' => {
        if (capacity >= 70) return 'success';
        if (capacity >= 40) return 'warning';
        return 'error';
    };

    const getTrend = (current: number, previous?: number): 'up' | 'down' | 'flat' => {
        if (previous === undefined || previous === null) return 'flat';
        if (current > previous) return 'up';
        if (current < previous) return 'down';
        return 'flat';
    };

    const previousData = batteryHistory.length > 1 ? batteryHistory[batteryHistory.length - 2] : undefined;
    const latestData = batteryHistory[batteryHistory.length - 1];

    const avgVoltage = batteryHistory.length ? Math.round((batteryHistory.reduce((s, i) => s + (isFinite(i.voltage) ? i.voltage : 0), 0) / batteryHistory.length) * 10) / 10 : currentBattery?.batteryVoltage || 0;

    const currentRangeHours = (() => {
        const s = new Date(customRange.from);
        const e = new Date(customRange.to);
        if (!isFinite(s.getTime()) || !isFinite(e.getTime())) return 0;
        return Math.abs((e.getTime() - s.getTime()) / 3600000);
    })();

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 2, sm: 0 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        {!isMobile && (
                            <IconButton onClick={() => window.history.back()}>
                                <ArrowBack />
                            </IconButton>
                        )}
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" mb={1}>
                                Battery Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Comprehensive battery performance and health monitoring
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                            <Grid size={12}>
                                <Box display="flex" justifyContent="flex-end" gap={1} flexWrap="wrap">
                                    <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                                        {timeRanges.map(tr => {
                                            const isActive = Math.abs(currentRangeHours - tr.hours) < Math.max(0.5, tr.hours * 0.15);
                                            return (
                                                <Button
                                                    key={tr.label}
                                                    onClick={() => applyPresetRange(tr.hours)}
                                                    variant={isActive ? 'contained' : 'outlined'}
                                                    size="small"
                                                    sx={{
                                                        flex: '1 1 auto',
                                                        minWidth: 0
                                                    }}
                                                >
                                                    {tr.label}
                                                </Button>
                                            );
                                        })}
                                    </ButtonGroup>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Refresh />}
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        size="small"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {refreshing ? 'Refreshing...' : 'Refresh'}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
                                    <Grid size={{ xs: 12, lg: 2, xl: 1.125 }}>
                                        <TextField
                                            label="Interval"
                                            type="number"
                                            size="small"
                                            value={historyGap}
                                            onChange={handleHistoryIntervalChange}
                                            fullWidth
                                            slotProps={{ input: { 'aria-label': 'History Interval' } }}
                                            sx={{
                                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                    WebkitAppearance: 'none',
                                                    margin: 0,
                                                },
                                                '& input[type=number]': {
                                                    MozAppearance: 'textfield',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 5, xl: 2.75 }}>
                                        <TextField
                                            label="From"
                                            type="datetime-local"
                                            size="small"
                                            value={customRange.from}
                                            onChange={(e) => setCustomRange(prev => ({ ...prev, from: e.target.value }))}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            sx={{
                                                '& input::-webkit-calendar-picker-indicator': {
                                                    filter: 'invert(51%) sepia(86%) saturate(1016%) hue-rotate(182deg) brightness(101%) contrast(92%)',
                                                    cursor: 'pointer',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 5, xl: 2.75 }}>
                                        <TextField
                                            label="To"
                                            type="datetime-local"
                                            size="small"
                                            value={customRange.to}
                                            onChange={(e) => setCustomRange(prev => ({ ...prev, to: e.target.value }))}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            sx={{
                                                '& input::-webkit-calendar-picker-indicator': {
                                                    filter: 'invert(51%) sepia(86%) saturate(1016%) hue-rotate(182deg) brightness(101%) contrast(92%)',
                                                    cursor: 'pointer',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <BatteryStatsCard
                            title="Capacity"
                            value={currentBattery?.batteryCapacity || 0}
                            unit="%"
                            icon={getBatteryIcon()}
                            color={getBatteryColor(currentBattery?.batteryCapacity || 0)}
                            trend={getTrend(latestData?.capacity || 0, previousData?.capacity)}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <BatteryStatsCard
                            title="Avg Voltage"
                            value={avgVoltage}
                            unit="V"
                            icon={<ElectricBolt />}
                            color="primary"
                            trend={getTrend(latestData?.voltage || 0, previousData?.voltage)}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <BatteryStatsCard
                            title="Charging"
                            value={currentBattery?.batteryChargingCurrent || 0}
                            unit="A"
                            icon={<PowerSettingsNew />}
                            color="success"
                            trend={getTrend(latestData?.chargingCurrent || 0, previousData?.chargingCurrent)}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <BatteryStatsCard
                            title="Discharge"
                            value={currentBattery?.batteryDischargeCurrent || 0}
                            unit="A"
                            icon={<PowerSettingsNew />}
                            color="warning"
                            trend={getTrend(latestData?.dischargeCurrent || 0, previousData?.dischargeCurrent)}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <BatteryVoltageChart data={batteryHistory} loading={loading} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <BatteryCapacityChart data={batteryHistory} loading={loading} />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CurrentFlowChart data={batteryHistory} loading={loading} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <BatteryHealthPieChart data={batteryHistory} loading={loading} />
                    </Grid>
                </Grid>

                {currentBattery && !loading ? (
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Box display="flex" gap={2} flexWrap="wrap" mb={2} alignItems="center" justifyContent="space-between">
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Current Battery Status
                                </Typography>
                                <Box display="flex" gap={1}>
                                    <Chip
                                        label={currentBattery.batteryChargingCurrent > 0 ? 'Charging' : 'Idle'}
                                        color={currentBattery.batteryChargingCurrent > 0 ? 'success' : 'default'}
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`Health: ${currentBattery.batteryCapacity > 80 ? 'Excellent' : currentBattery.batteryCapacity > 60 ? 'Good' : 'Fair'}`}
                                        color={getBatteryColor(currentBattery.batteryCapacity)}
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentBattery.batteryCapacity}
                                    sx={{
                                        flexGrow: 1,
                                        height: 12,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.grey[200],
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 2,
                                            backgroundColor: theme.palette[getBatteryColor(currentBattery.batteryCapacity)].main,
                                        },
                                    }}
                                />
                                <Typography variant="h6" fontWeight={700}>
                                    {currentBattery.batteryCapacity}%
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Box display="flex" gap={2} flexWrap="wrap" mb={2.5} alignItems="center" justifyContent="space-between">
                                <Skeleton variant="text" width="40%" height={28} />
                                <Box display="flex" gap={1}>
                                    <Skeleton variant="rounded" width={45} height={30} />
                                    <Skeleton variant="rounded" width={120} height={30} />
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Skeleton variant="rectangular" height={14} sx={{ flexGrow: 1, borderRadius: 2 }} />
                                <Skeleton variant="text" width={50} height={28} />
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box >
    );
}
