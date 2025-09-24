import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Skeleton,
    useTheme
} from '@mui/material';
import {
    Thermostat,
    ElectricBolt,
    BatteryFull
} from '@mui/icons-material';
import { type SolarData } from '../../types';

export interface SystemInfoCardProps {
    solarData?: SolarData | null;
    loading?: boolean;
}

export function SystemInfoCard({ solarData, loading = false }: SystemInfoCardProps) {
    const theme = useTheme();

    const getTemperatureColor = (temp: number) => {
        if (temp >= 60) return theme.palette.error.main;
        if (temp >= 45) return theme.palette.warning.main;
        return theme.palette.success.main;
    };

    const getBatteryHealthColor = (capacity: number) => {
        if (capacity >= 80) return theme.palette.success.main;
        if (capacity >= 40) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    if (loading) {
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={150} height={32} sx={{ mb: 3 }} />
                    <Box display="flex" flexDirection="column" gap={3}>
                        {[...Array(3)].map((_, i) => (
                            <Box key={i}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton variant="text" width={100} />
                                </Box>
                                <Skeleton variant="rounded" height={8} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width={60} />
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const temperature = solarData?.inverterHeatSinkTemperature ?? 0;
    const busVoltage = solarData?.busVoltage ?? 0;
    const batteryCapacity = solarData?.batteryData?.batteryCapacity ?? 0;
    const batteryVoltage = solarData?.batteryData?.batteryVoltage ?? 0;

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    System Information
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Thermostat
                                fontSize="small"
                                sx={{ color: getTemperatureColor(temperature) }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                                Inverter Temperature
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((temperature / 80) * 100, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: getTemperatureColor(temperature),
                                },
                            }}
                        />
                        <Typography variant="h6" fontWeight={700} color={getTemperatureColor(temperature)} mt={0.5}>
                            {temperature}°C
                        </Typography>
                    </Box>

                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <ElectricBolt
                                fontSize="small"
                                sx={{ color: theme.palette.info.main }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                                Bus Voltage
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((busVoltage / 400) * 100, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: theme.palette.info.main,
                                },
                            }}
                        />
                        <Typography variant="h6" fontWeight={700} color="info.main" mt={0.5}>
                            {busVoltage}V
                        </Typography>
                    </Box>

                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <BatteryFull
                                fontSize="small"
                                sx={{ color: getBatteryHealthColor(batteryCapacity) }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                                Battery Health
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={batteryCapacity}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: getBatteryHealthColor(batteryCapacity),
                                },
                            }}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Typography variant="h6" fontWeight={700} color={getBatteryHealthColor(batteryCapacity)}>
                                {batteryCapacity}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {batteryVoltage}V
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}