import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, Alert, Container } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';
import WifiOff from '@mui/icons-material/WifiOff';
import { useSolarStore } from '../../store/solarStore';
import { StatCard } from '../../components/cards/StatCard';
import { SystemStatusCard } from '../../components/cards/SystemStatusCard';
import { PredictionsCard } from '../../components/cards/PredictionsCard';
import { BatteryDetailsCard } from '../../components/cards/BatteryDetailsCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const {
        latestData,
        predictions,
        loading,
        error,
        fetchLatestData,
        fetchSystemMetrics,
        fetchPredictions,
        clearError,
    } = useSolarStore();

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            await Promise.all([fetchLatestData(), fetchSystemMetrics(), fetchPredictions()]);
            setIsInitialLoad(false);
            setLastUpdate(new Date());
        };
        loadData();
        const interval = setInterval(() => {
            fetchLatestData().then(() => setLastUpdate(new Date()));
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchLatestData, fetchSystemMetrics, fetchPredictions]);

    const handleRefresh = async (): Promise<void> => {
        clearError();
        await Promise.all([fetchLatestData(), fetchSystemMetrics(), fetchPredictions()]);
        setLastUpdate(new Date());
    };

    const formatLastUpdate = (date: Date | null): string => {
        if (!date) return '';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        return date.toLocaleTimeString();
    };

    const navigation = useNavigate();

    const handleNavigateToBatteryDetails = (): void => {
        navigation('/battery', { replace: false });
        window.scrollTo({ top: 0 });
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 2 }}>
            <Container maxWidth="md" sx={{ pt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 2, sm: 0 }}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                            Solar Dashboard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {lastUpdate ? `Last updated: ${formatLastUpdate(lastUpdate)}` : 'Loading system data...'}
                        </Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading} size="large" sx={{ minWidth: 120, borderRadius: 2 }}>
                        Refresh
                    </Button>
                </Box>

                {error && (
                    <Alert severity="warning" icon={<WifiOff />} sx={{ mb: 3, borderRadius: 2 }} onClose={clearError}>
                        <Typography variant="body2" fontWeight={500}>
                            Connection Issue
                        </Typography>
                        <Typography variant="body2">
                            Using demo data - API connection failed: {error.message}
                        </Typography>
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Box
                            sx={{ cursor: 'pointer' }}
                            onClick={handleNavigateToBatteryDetails}>
                            <StatCard
                                title="Battery Level"
                                value={latestData?.batteryData?.batteryCapacity ?? 0}
                                unit="%"
                                type="battery"
                                loading={isInitialLoad} />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Current Power"
                            value={latestData?.powerData?.acOutputActivePower ?? 0}
                            unit="W"
                            type="power"
                            loading={isInitialLoad}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Solar Input"
                            value={latestData?.powerData?.pvInputPower ?? 0}
                            unit="W"
                            type="solar"
                            loading={isInitialLoad}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Temperature"
                            value={latestData?.inverterHeatSinkTemperature ?? 0}
                            unit="°C"
                            type="temperature"
                            loading={isInitialLoad}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
                        <SystemStatusCard solarData={latestData} loading={isInitialLoad} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
                        <PredictionsCard predictions={predictions} loading={isInitialLoad} />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid size={{ xs: 12 }}>
                        <Box
                            sx={{ cursor: 'pointer' }}
                            onClick={handleNavigateToBatteryDetails}>
                            <BatteryDetailsCard batteryData={latestData?.batteryData} loading={isInitialLoad} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
