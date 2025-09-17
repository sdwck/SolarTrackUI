import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Refresh,
    ArrowBack
} from '@mui/icons-material';
import { useSolarStore } from '../../store/solarStore';
import { OverallHealthCard } from '../../components/cards/OverallHealthCard';
import { ThermalStatusCard } from '../../components/cards/ThermalStatusCard';
import { VoltageStabilityCard } from '../../components/cards/VoltageStabilityCard';
import { SystemStatusCard } from '../../components/cards/SystemStatusCard';
import { DiagnosticAlertsCard } from '../../components/cards/DiagnosticAlertsCard';
import { MaintenanceCard } from '../../components/cards/MaintenanceCard';
import { ThermalTrendChart } from '../../components/charts/ThermalTrendChart';
import { VoltageStabilityChart } from '../../components/charts/VoltageStabilityChart';
import { SystemUptimeChart } from '../../components/charts/SystemUptimeChart';

interface HistoricalData {
    timestamp: string;
    temperature: number;
    busVoltage: number;
    batteryVoltage: number;
    isSystemOn: boolean;
    acInputVoltage: number;
    acOutputVoltage: number;
}

export default function SystemHealthDiagnostics() {
    const {
        latestData,
        loading,
        fetchLatestData,
        clearError
    } = useSolarStore();

    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [formattedLastUpdate, setFormattedLastUpdate] = useState<string>('Just now');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const loadData = async () => {
            await fetchLatestData();
            setLastUpdate(new Date());
        };
        loadData();
    }, [fetchLatestData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFormattedLastUpdate(formatLastUpdate(lastUpdate));
        }, 60000);

        return () => clearInterval(interval);
    }, [lastUpdate]);

    const handleRefresh = async () => {
        setRefreshing(true);
        clearError();
        await fetchLatestData();
        const now = new Date();
        setLastUpdate(now);
        setFormattedLastUpdate(formatLastUpdate(now));
        setRefreshing(false);
    };

    const formatLastUpdate = (date: Date | null): string => {
        if (!date) return 'Just now';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        if (seconds < 60) return `Just now`;
        if (minutes < 60) return `${minutes}m ago`;
        return date.toLocaleTimeString();
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={{ xs: 2, sm: 0 }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        {!isMobile && (
                            <IconButton onClick={() => window.history.back()}>
                                <ArrowBack />
                            </IconButton>
                        )}
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" mb={1}>
                                System Health & Diagnostics
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {lastUpdate
                                    ? `Last updated: ${formattedLastUpdate}`
                                    : 'Loading system health data...'
                                }
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        size="large"
                        sx={{ minWidth: 120, borderRadius: 2 }}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </Box>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <OverallHealthCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ThermalStatusCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <VoltageStabilityCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SystemStatusCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DiagnosticAlertsCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ThermalTrendChart
                            data={historicalData}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MaintenanceCard
                            solarData={latestData}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <VoltageStabilityChart
                            data={historicalData}
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SystemUptimeChart
                            data={historicalData}
                            loading={loading}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}