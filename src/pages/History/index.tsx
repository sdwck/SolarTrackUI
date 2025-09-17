import { useState, useEffect } from 'react';
import api from '../../services/api';
import { type HistoryData } from '../../types';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    IconButton,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    useTheme
} from '@mui/material';
import {
    WbSunny,
    ElectricBolt,
    Battery80,
    ThermostatAuto,
    Download,
    Refresh,
    TrendingUp,
    TrendingDown,
    TrendingFlat,
    DateRange,
} from '@mui/icons-material';

import { CircularProgress, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type HistoryRow = {
    date: string;
    time: string;
    solarInput: number;
    batteryLevel: number;
    powerOutput: number;
    temperature: number;
    efficiency: number;
    status: 'optimal' | 'good' | 'low';
};

const formatHourToRound = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const h = date.getHours();
    const m = date.getMinutes();
    const hh = String(h).padStart(2, '0');
    const mm = m < 30 ? '00' : '30';
    return `${hh}:${mm}`;
};

const getStatusColor = (s: HistoryRow['status']) => {
    switch (s) {
        case 'optimal': return 'success';
        case 'good': return 'primary';
        case 'low': return 'warning';
        default: return 'default';
    }
};

const TrendIcon = ({ current, previous }: { current: number; previous?: number }) => {
    if (previous === undefined) return <TrendingFlat fontSize="small" color="action" />;
    if (current > previous) return <TrendingUp fontSize="small" color="success" />;
    if (current < previous) return <TrendingDown fontSize="small" color="error" />;
    return <TrendingFlat fontSize="small" color="action" />;
};

export default function History() {
    const [tabValue, setTabValue] = useState<number>(0);
    const theme = useTheme();
    const [historyData, setHistoryData] = useState<HistoryData[]>([]);
    const [summaryStats, setSummaryStats] = useState({
        peakSolar: { value: '0W', time: '00:00' },
        maxBattery: { value: '0%', time: '00:00' },
        peakPower: { value: '0W', time: '00:00' },
        maxTemp: { value: '0°C', time: '00:00' },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');

    const calculateSummaryStats = (data: HistoryData[]) => {
        if (data.length === 0) return;

        const peakSolar = data.reduce((max, curr) => curr.solarInput > max.solarInput ? curr : max);
        const maxBattery = data.reduce((max, curr) => curr.batteryLevel > max.batteryLevel ? curr : max);
        const peakPower = data.reduce((max, curr) => curr.powerOutput > max.powerOutput ? curr : max);
        const maxTemp = data.reduce((max, curr) => curr.temperature > max.temperature ? curr : max);

        setSummaryStats({
            peakSolar: { value: `${peakSolar.solarInput}W`, time: peakSolar.timestamp },
            maxBattery: { value: `${maxBattery.batteryLevel}%`, time: maxBattery.timestamp },
            peakPower: { value: `${peakPower.powerOutput}W`, time: peakPower.timestamp },
            maxTemp: { value: `${maxTemp.temperature}°C`, time: maxTemp.timestamp },
        });
    };

    const fetchHistoryData = async () => {
        try {
            setError(null);
            setLoading(true);

            let timeRange: 'today' | '3days' | 'week' | 'month';
            switch (tabValue) {
                case 0: timeRange = 'today'; break;
                case 1: timeRange = '3days'; break;
                case 2: timeRange = 'week'; break;
                case 3: timeRange = 'month'; break;
                default: timeRange = 'today';
            }

            let data
            if (tabValue === 5 && from && to) data = await api.getHistoryData(timeRange, from, to);
            else data = await api.getHistoryData(timeRange);
            setHistoryData(data);
            calculateSummaryStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch history data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, [tabValue]);

    const handleRefresh = async () => {
        if (loading || loading) return;
        setLoading(true);

        try {
            let timeRange: 'today' | '3days' | 'week' | 'month';
            switch (tabValue) {
                case 0: timeRange = 'today'; break;
                case 1: timeRange = '3days'; break;
                case 2: timeRange = 'week'; break;
                case 3: timeRange = 'month'; break;
                default: timeRange = 'today';
            }

            const data = await api.getHistoryData(timeRange);
            setHistoryData(data);
            calculateSummaryStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    const summaryStatsArray = [
        { title: 'Peak Solar Input', value: summaryStats.peakSolar.value, time: summaryStats.peakSolar.time, icon: <WbSunny />, color: 'warning' as const },
        { title: 'Max Battery Level', value: summaryStats.maxBattery.value, time: summaryStats.maxBattery.time, icon: <Battery80 />, color: 'success' as const },
        { title: 'Peak Power Output', value: summaryStats.peakPower.value, time: summaryStats.peakPower.time, icon: <ElectricBolt />, color: 'primary' as const },
        { title: 'Max Temperature', value: summaryStats.maxTemp.value, time: summaryStats.maxTemp.time, icon: <ThermostatAuto />, color: 'error' as const },
    ];

    if (loading) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            </Box>
        )
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4, overflowX: 'hidden', boxSizing: 'border-box' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 1, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        justifyContent: 'space-between',
                        gap: 2,
                        mt: 2,
                        mb: 3,
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
                            Energy History
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Track your solar panel performance over time
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
                        <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                            <Button variant="contained" startIcon={<Download />} sx={{ borderRadius: 2, minWidth: 96 }}>
                                Export
                            </Button>
                        </Box>

                        <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
                            <IconButton aria-label="export" size="large">
                                <Download />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                            <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading} sx={{ borderRadius: 2, minWidth: 110 }}>
                                {loading ? 'Loading...' : 'Refresh'}
                            </Button>
                        </Box>

                        <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
                            <IconButton aria-label="refresh" onClick={handleRefresh} disabled={loading} size="large">
                                <Refresh />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3, pt: { xs: 1.5, md: 3 } }}>
                    {summaryStatsArray.map((s) => {
                        const main = theme.palette[s.color].main;
                        const light = theme.palette[s.color].light ?? main;
                        return (
                            <Grid size={{ xs: 6, md: 3 }} key={s.title}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: 1,
                                        borderColor: 'divider',
                                        boxShadow: 'none',
                                        width: '100%',
                                        transition: 'transform .12s ease, box-shadow .12s ease',
                                        '&:hover': { boxShadow: `0 6px 18px ${main}20`, transform: 'translateY(-2px)' },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: '0 auto auto 0',
                                            height: 3,
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            background: `linear-gradient(90deg, ${main}, ${light})`,
                                            borderRadius: '8px 8px 0 0',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ pt: { xs: 2.25, md: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', pb: 2 }}>
                                        <Avatar sx={{ bgcolor: `${main}20`, color: main, width: 36, height: 36, mb: 1 }}>
                                            {s.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={700} fontSize={{ xs: '1rem', md: '1.25rem' }}>
                                            {s.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                            at {new Date(s.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, {formatHourToRound(s.time)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {s.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {tabValue === 5 &&
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
                        <DatePicker
                            label="From"
                            value={from ? new Date(from) : null}
                            onChange={(date) => setFrom(date ? date.toISOString() : '')}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            disabled={tabValue !== 5}
                        />
                        <DatePicker
                            label="To"
                            value={to ? new Date(to) : null}
                            onChange={(date) => setTo(date ? date.toISOString() : '')}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            disabled={tabValue !== 5}
                        />
                        <Button
                            variant="contained"
                            sx={{ minWidth: 100, borderRadius: 2 }}
                            disabled={tabValue !== 5 || !from || !to || loading}
                            onClick={fetchHistoryData}
                        >
                            Apply
                        </Button>
                    </Box>
                }
                <Card sx={{ borderColor: 'divider', width: { xs: '96vw', sm: '100%' } }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_, v) => setTabValue(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ px: 2 }}
                        >
                            <Tab label="Today" />
                            <Tab label="3 Days" />
                            <Tab label="Week" />
                            <Tab label="Month" />
                            <Box sx={{ flex: 1 }} />
                            <Tab
                                icon={
                                    <DateRange sx={{ fontSize: 16, verticalAlign: 'middle', mb: '2px' }} />
                                }
                                iconPosition="start"
                                label="Custom Range"
                                sx={{ minHeight: 40, py: 0 }}
                            />
                        </Tabs>
                    </Box>


                    <Box>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Time</TableCell>
                                            <TableCell align="right">Solar Input</TableCell>
                                            <TableCell align="right">Battery Level</TableCell>
                                            <TableCell align="right">Power Output</TableCell>
                                            <TableCell align="right">Temperature</TableCell>
                                            <TableCell align="right">Efficiency</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historyData.map((row, i) => {
                                            const prev = i < historyData.length - 1 ? historyData[i + 1] : undefined;
                                            return (
                                                <TableRow key={`${row.timestamp}`} hover>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                        {new Date(row.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} {formatHourToRound(row.timestamp)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.solarInput}W</Typography>
                                                            <TrendIcon current={row.solarInput} previous={prev?.solarInput} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.batteryLevel}%</Typography>
                                                            <TrendIcon current={row.batteryLevel} previous={prev?.batteryLevel} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.powerOutput}W</Typography>
                                                            <TrendIcon current={row.powerOutput} previous={prev?.powerOutput} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{row.temperature}°C</TableCell>
                                                    <TableCell align="right">{row.efficiency}%</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={row.status} color={getStatusColor(row.status)} size="small" sx={{ textTransform: 'capitalize' }} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, py: 2 }}>
                            {historyData.map((row, idx) => (
                                <Card key={`${row.timestamp}`} sx={{ mb: 2 }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {new Date(row.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} {formatHourToRound(row.timestamp)}
                                            </Typography>
                                            <Chip
                                                label={row.status}
                                                color={getStatusColor(row.status)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </Box>

                                        <Grid container spacing={1} columnSpacing={6}>
                                            <Grid size={{ xs: 6 }}>
                                                <Grid container sx={{ width: '80%' }}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Solar
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {row.solarInput}W
                                                        </Typography>
                                                        <TrendIcon
                                                            current={row.solarInput}
                                                            previous={idx < historyData.length - 1 ? historyData[idx + 1].solarInput : undefined}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid size={{ xs: 6 }}>
                                                <Grid container sx={{ width: '100%' }}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Battery
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {row.batteryLevel}%
                                                        </Typography>
                                                        <TrendIcon
                                                            current={row.batteryLevel}
                                                            previous={idx < historyData.length - 1 ? historyData[idx + 1].batteryLevel : undefined}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid size={{ xs: 6 }}>
                                                <Grid container sx={{ width: '80%' }}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Output
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {row.powerOutput}W
                                                        </Typography>
                                                        <TrendIcon
                                                            current={row.powerOutput}
                                                            previous={idx < historyData.length - 1 ? historyData[idx + 1].powerOutput : undefined}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid size={{ xs: 6 }}>
                                                <Grid container sx={{ width: '100%' }}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Temp · Eff
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {row.temperature}°C
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {row.efficiency}%
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                            ))}
                        </Box>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}
