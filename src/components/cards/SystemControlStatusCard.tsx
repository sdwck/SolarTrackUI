import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Skeleton
} from '@mui/material';
import { type SolarData } from '../../types';

export interface SystemStatusCardProps {
    solarData?: SolarData | null;
    loading?: boolean;
}

export function SystemControlStatusCard({ solarData, loading = false }: SystemStatusCardProps) {
    if (loading) {
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                    <Box display="flex" flexDirection="column" gap={2}>
                        {[...Array(4)].map((_, i) => (
                            <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                                <Skeleton variant="text" width={120} />
                                <Skeleton variant="rounded" width={60} height={24} />
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const getStatusChip = (status: boolean, onLabel: string = 'ON', offLabel: string = 'OFF') => (
        <Chip
            size="small"
            label={status ? onLabel : offLabel}
            color={status ? 'success' : 'default'}
        />
    );

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    System Status
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Load</Typography>
                        {getStatusChip(solarData?.isLoadOn ?? false)}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Charging</Typography>
                        {getStatusChip(solarData?.isChargingOn ?? false)}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Solar Charging</Typography>
                        {getStatusChip(solarData?.isSccChargingOn ?? false)}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">AC Charging</Typography>
                        {getStatusChip(solarData?.isAcChargingOn ?? false)}
                    </Box>
                </Box>

                <Box mt={3}>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                        System Parameters
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Temperature
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {solarData?.inverterHeatSinkTemperature ?? 0}°C
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Bus Voltage
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {solarData?.busVoltage ?? 0}V
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Battery Voltage
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {solarData?.batteryData?.batteryVoltage ?? 0}V
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}