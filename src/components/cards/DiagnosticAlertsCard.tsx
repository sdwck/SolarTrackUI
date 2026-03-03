import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Notifications,
    Error,
    Warning,
    Info,
    CheckCircle,
    Circle
} from '@mui/icons-material';
import type { SolarData } from '../../types';

interface DiagnosticAlertsCardProps {
    solarData: SolarData | null;
    loading: boolean;
}

interface Alert {
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    timestamp: string;
    priority: 'high' | 'medium' | 'low';
}

const generateAlerts = (data: SolarData | null): Alert[] => {
    if (!data) return [];

    const alerts: Alert[] = [];
    const now = new Date("2026-01-31T08:51:36.8381549");

    if (data.inverterHeatSinkTemperature > 70) {
        alerts.push({
            id: 'temp-critical',
            type: 'error',
            title: 'Critical Temperature',
            description: `Heat sink at ${data.inverterHeatSinkTemperature}°C - immediate attention required`,
            timestamp: now.toLocaleTimeString(),
            priority: 'high'
        });
    } else if (data.inverterHeatSinkTemperature > 55) {
        alerts.push({
            id: 'temp-elevated',
            type: 'warning',
            title: 'Elevated Temperature',
            description: `Heat sink at ${data.inverterHeatSinkTemperature}°C - monitor closely`,
            timestamp: now.toLocaleTimeString(),
            priority: 'medium'
        });
    }

    if (data.busVoltage < 400 || data.busVoltage > 450) {
        alerts.push({
            id: 'bus-voltage',
            type: 'warning',
            title: 'Bus Voltage Issue',
            description: `Bus voltage ${data.busVoltage}V outside optimal range (400-450V)`,
            timestamp: now.toLocaleTimeString(),
            priority: 'medium'
        });
    }

    if (data.batteryData.batteryVoltage < 24) {
        alerts.push({
            id: 'battery-voltage-low',
            type: 'warning',
            title: 'Low Battery Voltage',
            description: `Battery voltage ${data.batteryData.batteryVoltage}V below recommended minimum`,
            timestamp: now.toLocaleTimeString(),
            priority: 'high'
        });
    }

    if (data.powerData.acInputFrequency < 49.5 || data.powerData.acInputFrequency > 50.5) {
        alerts.push({
            id: 'grid-frequency',
            type: 'warning',
            title: 'Grid Frequency Variance',
            description: `Grid frequency ${data.powerData.acInputFrequency}Hz outside normal range`,
            timestamp: now.toLocaleTimeString(),
            priority: 'medium'
        });
    }

    if (!data.isSwitchedOn) {
        alerts.push({
            id: 'system-off',
            type: 'error',
            title: 'System Switched Off',
            description: 'Main system switch is in OFF position',
            timestamp: now.toLocaleTimeString(),
            priority: 'high'
        });
    }

    if (data.batteryData.batteryCapacity < 20) {
        alerts.push({
            id: 'battery-low',
            type: 'warning',
            title: 'Low Battery Capacity',
            description: `Battery at ${data.batteryData.batteryCapacity}% - consider charging`,
            timestamp: now.toLocaleTimeString(),
            priority: 'medium'
        });
    }

    if (data.powerData.pvInputPower === 0 && data.powerData.pvInputVoltage > 0) {
        alerts.push({
            id: 'pv-no-power',
            type: 'info',
            title: 'No Solar Generation',
            description: 'PV panels not generating power despite voltage present',
            timestamp: now.toLocaleTimeString(),
            priority: 'low'
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            id: 'all-good',
            type: 'success',
            title: 'All Systems Normal',
            description: 'No active alerts detected - system operating within parameters',
            timestamp: now.toLocaleTimeString(),
            priority: 'low'
        });
    }

    return alerts.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
        case 'error': return <Error color="error" fontSize="small" />;
        case 'warning': return <Warning color="warning" fontSize="small" />;
        case 'info': return <Info color="info" fontSize="small" />;
        case 'success': return <CheckCircle color="success" fontSize="small" />;
        default: return <Circle color="disabled" fontSize="small" />;
    }
};

const getPriorityChip = (priority: Alert['priority']) => {
    const colors = {
        high: 'error' as const,
        medium: 'warning' as const,
        low: 'info' as const
    };

    return (
        <Chip
            label={priority.toUpperCase()}
            color={colors[priority]}
            size="small"
            sx={{
                height: 20,
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}
        />
    );
};

export const DiagnosticAlertsCard = ({ solarData, loading }: DiagnosticAlertsCardProps) => {
    const alerts = generateAlerts(solarData);
    const alertCounts = alerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box flexGrow={1}>
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} />
                        </Box>
                    </Box>
                    <Box mb={2}>
                        <Box display="flex" gap={1} mb={2}>
                            <Skeleton variant="rounded" width={60} height={24} />
                            <Skeleton variant="rounded" width={70} height={24} />
                            <Skeleton variant="rounded" width={50} height={24} />
                        </Box>
                    </Box>
                    <List sx={{ py: 0 }}>
                        {[...Array(3)].map((_, i) => (
                            <Box key={i}>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Skeleton variant="circular" width={20} height={20} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Skeleton variant="text" width="70%" height={20} />}
                                        secondary={<Skeleton variant="text" width="90%" height={16} />}
                                    />
                                </ListItem>
                                {i < 2 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        sx={{
                            color: alerts.some(a => a.type === 'error') ? 'error.main' :
                                alerts.some(a => a.type === 'warning') ? 'warning.main' : 'success.main',
                            width: 48,
                            height: 48,
                        }}
                    >
                        <Notifications />
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={700}>
                            System Alerts
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Active notifications and warnings
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                    {alertCounts.error && (
                        <Chip
                            label={`${alertCounts.error} Error${alertCounts.error > 1 ? 's' : ''}`}
                            color="error"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {alertCounts.warning && (
                        <Chip
                            label={`${alertCounts.warning} Warning${alertCounts.warning > 1 ? 's' : ''}`}
                            color="warning"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {alertCounts.info && (
                        <Chip
                            label={`${alertCounts.info} Info`}
                            color="info"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {alertCounts.success && (
                        <Chip
                            label="All Good"
                            color="success"
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>

                <List sx={{ py: 0, maxHeight: 240, overflow: 'auto' }}>
                    {alerts.slice(0, 4).map((alert, index) => (
                        <Box key={alert.id}>
                            <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                    {getAlertIcon(alert.type)}
                                </ListItemIcon>
                                <ListItemText
                                    slotProps={{ primary: { component: 'div' }, secondary: { component: 'div' } }}
                                    primary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {alert.title}
                                            </Typography>
                                            {getPriorityChip(alert.priority)}
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem' }}>
                                                {alert.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {alert.timestamp}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < Math.min(alerts.length - 1, 3) && <Divider />}
                        </Box>
                    ))}
                </List>

                {alerts.length > 4 && (
                    <Box mt={2} textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                            +{alerts.length - 4} more alerts
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};