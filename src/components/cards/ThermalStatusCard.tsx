import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    Chip
} from '@mui/material';
import {
    Thermostat,
    LocalFireDepartment,
    AcUnit,
    Warning
} from '@mui/icons-material';
import type { SolarData } from '../../types';

interface ThermalStatusCardProps {
    solarData: SolarData | null;
    loading: boolean;
}

interface ThermalStatus {
    temperature: number;
    status: 'optimal' | 'warm' | 'hot' | 'critical';
    recommendation: string;
    icon: React.ReactNode;
}

const getThermalStatus = (temperature: number): ThermalStatus => {
    if (temperature <= 45) {
        return {
            temperature,
            status: 'optimal',
            recommendation: 'System running at optimal temperature',
            icon: <AcUnit />
        };
    } else if (temperature <= 60) {
        return {
            temperature,
            status: 'warm',
            recommendation: 'Temperature slightly elevated, monitor closely',
            icon: <Thermostat />
        };
    } else if (temperature <= 75) {
        return {
            temperature,
            status: 'hot',
            recommendation: 'High temperature detected, check ventilation',
            icon: <Warning />
        };
    } else {
        return {
            temperature,
            status: 'critical',
            recommendation: 'Critical temperature! System may shut down',
            icon: <LocalFireDepartment />
        };
    }
};

const getStatusColor = (status: ThermalStatus['status']) => {
    switch (status) {
        case 'optimal': return 'success';
        case 'warm': return 'info';
        case 'hot': return 'warning';
        case 'critical': return 'error';
        default: return 'default';
    }
};

const getStatusColorValue = (status: ThermalStatus['status']) => {
    switch (status) {
        case 'optimal': return 'success.main';
        case 'warm': return 'info.main';
        case 'hot': return 'warning.main';
        case 'critical': return 'error.main';
        default: return 'grey.500';
    }
};

export const ThermalStatusCard = ({ solarData, loading }: ThermalStatusCardProps) => {
    const thermalStatus = solarData
        ? getThermalStatus(solarData.inverterHeatSinkTemperature)
        : { temperature: 0, status: 'optimal' as const, recommendation: '', icon: <Thermostat /> };

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
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Skeleton variant="text" width="80px" height={48} />
                    </Box>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Skeleton variant="rounded" width={80} height={28} />
                    </Box>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="90%" height={16} />
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
                            bgcolor: `${getStatusColorValue(thermalStatus.status)}20`,
                            color: getStatusColorValue(thermalStatus.status),
                            width: 48,
                            height: 48,
                        }}
                    >
                        {thermalStatus.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={700}>
                            Thermal Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inverter heat sink temperature
                        </Typography>
                    </Box>
                </Box>

                <Box textAlign="center" mb={2}>
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        color={getStatusColorValue(thermalStatus.status)}
                        sx={{ mb: 1 }}
                    >
                        {thermalStatus.temperature}°C
                    </Typography>
                    <Chip
                        label={thermalStatus.status.toUpperCase()}
                        color={getStatusColor(thermalStatus.status)}
                        size="small"
                        sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}
                >
                    {thermalStatus.recommendation}
                </Typography>

                <Box
                    mt={2}
                    p={1.5}
                    sx={{
                        bgcolor: `${getStatusColorValue(thermalStatus.status)}10`,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        NORMAL RANGE: 25°C - 45°C
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};