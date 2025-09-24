import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    IconButton,
    Alert,
    Snackbar,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Refresh,
    ArrowBack
} from '@mui/icons-material';
import api from '../../services/api';
import { useSolarStore } from '../../store/solarStore';
import { PowerFlowCard } from '../../components/cards/PowerFlowCard';
import { BatteryModeCard } from '../../components/cards/BatteryModeCard';
import { LoadModeCard } from '../../components/cards/LoadModeCard';
import { SystemControlStatusCard } from '../../components/cards/SystemControlStatusCard';
import { SystemInfoCard } from '../../components/cards/SystemInfoCard';
import { CurrentModeDisplay } from '../../components/cards/CurrentModeDisplay';
import { type SystemMode } from '../../types';

type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

const SNACKBAR_AUTO_HIDE_DURATION = 6000;

interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

export default function SystemControlPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        latestData: solarData,
        loading,
        fetchLatestData,
        clearError
    } = useSolarStore();

    const [systemMode, setSystemMode] = useState<SystemMode>({
        id: 1,
        batteryMode: 'PCP02',
        loadMode: 'POP02'
    });
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async (): Promise<void> => {
        try {
            await Promise.all([
                fetchLatestData(),
                loadSystemMode()
            ]);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error loading initial data:', error);
            showSnackbar('Error loading system data', 'error');
        }
    };

    const loadSystemMode = async (): Promise<void> => {
        try {
            const mode = await api.getSystemMode();
            setSystemMode(mode);
        } catch (error) {
            console.error('Error loading system mode:', error);
            showSnackbar('Error loading system modes', 'error');
        }
    };

    const refreshSolarData = async (): Promise<void> => {
        try {
            await fetchLatestData();
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error refreshing solar data:', error);
        }
    };

    const handleRefresh = async (): Promise<void> => {
        setRefreshing(true);
        clearError();
        try {
            await loadInitialData();
            showSnackbar('Data refreshed successfully', 'success');
        } catch (error) {
            showSnackbar('Error refreshing data', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    const handleBatteryModeChange = async (newMode: string): Promise<void> => {
        try {
            await api.setBatteryMode(newMode);
            showSnackbar(`Request sent to change battery mode to ${newMode}`, 'info');
        } catch (error) {
            console.error('Error changing battery mode:', error);
            showSnackbar('Error changing battery mode', 'error');
        }
    };

    const handleLoadModeChange = async (newMode: string): Promise<void> => {
        try {
            await api.setLoadMode(newMode);
            showSnackbar(`Request sent to change load mode to ${newMode}`, 'success');
        } catch (error) {
            console.error('Error changing load mode:', error);
            showSnackbar('Error changing load mode', 'error');
        }
    };

    const handleDataChange = (): void => {
        refreshSolarData();
    };

    const showSnackbar = (message: string, severity: SnackbarSeverity): void => {
        setSnackbar({ open: true, message, severity });
    };

    const formatLastUpdate = (date: Date | null): string => {
        if (!date) return 'Loading...';

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
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
                                System Control
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Last updated: {formatLastUpdate(lastUpdate)}
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

                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Fade in timeout={600}>
                            <div>
                                <PowerFlowCard solarData={solarData} loading={loading} />
                            </div>
                        </Fade>
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 3, width: '100%' }}>
                        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex' }}>
                            <Fade in timeout={700}>
                                <div style={{ flex: 1, display: 'flex', width: '100%' }}>
                                    <CurrentModeDisplay
                                        batteryMode={systemMode.batteryMode}
                                        loadMode={systemMode.loadMode}
                                        loading={loading}
                                    />
                                </div>
                            </Fade>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex' }}>
                            <Fade in timeout={800}>
                                <div style={{ flex: 1, display: 'flex', width: '100%' }}>
                                    <BatteryModeCard
                                        currentMode={systemMode.batteryMode}
                                        onModeChange={handleBatteryModeChange}
                                        loading={loading}
                                    />
                                </div>
                            </Fade>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex' }}>
                            <Fade in timeout={900}>
                                <div style={{ flex: 1, display: 'flex', width: '100%' }}>
                                    <LoadModeCard
                                        currentMode={systemMode.loadMode}
                                        onModeChange={handleLoadModeChange}
                                        loading={loading}
                                    />
                                </div>
                            </Fade>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 3, width: '100%' }}>
                        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex' }}>
                            <Fade in timeout={1000}>
                                <div style={{ flex: 1, display: 'flex', width: '100%' }}>
                                    <SystemControlStatusCard solarData={solarData} loading={loading} />
                                </div>
                            </Fade>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                            <Fade in timeout={1100}>
                                <div style={{ flex: 1, display: 'flex', width: '100%' }}>
                                    <SystemInfoCard
                                        solarData={solarData}
                                        loading={loading}
                                    />
                                </div>
                            </Fade>
                        </Grid>
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    <Alert
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}