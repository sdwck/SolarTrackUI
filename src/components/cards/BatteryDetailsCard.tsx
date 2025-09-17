import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Avatar,
    LinearProgress,
    Fade,
    Skeleton,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    BatteryFull,
    BatteryChargingFull,
    BatteryStd,
    Info as InfoIcon,
} from '@mui/icons-material';

import { type BatteryData } from '../../types';

interface BatteryDetailsCardProps {
    batteryData?: BatteryData | null;
    loading?: boolean;
}

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

const getBatteryColor = (cap: number, theme: any) => {
    if (cap >= 80) return theme.palette.success.main;
    if (cap >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
};

export function BatteryDetailsCard({ batteryData, loading = false }: BatteryDetailsCardProps) {
    const theme = useTheme();
    const cap = clamp(Math.round(batteryData?.batteryCapacity ?? 0));

    if (loading && !batteryData) {
        return (
            <Fade in timeout={600}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                Battery Details
                            </Typography>
                            <Skeleton variant="circular" width={48} height={48} />
                        </Box>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    State of Charge
                                </Typography>

                                <Box display="flex" alignItems="center" gap={2} mt={1}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Skeleton variant="rounded" height={12} sx={{ borderRadius: 2 }} />
                                    </Box>
                                    <Skeleton variant="text" width={40} height={32} />
                                </Box>

                                <Box mt={1.7}>
                                    <Grid container spacing={0.8}>
                                        <Grid size={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Voltage
                                            </Typography>
                                            <Skeleton variant="text" width="80%" height={25} />
                                        </Grid>

                                        <Grid size={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Charging Current
                                            </Typography>
                                            <Skeleton variant="text" width="80%" height={25} />
                                        </Grid>

                                        <Grid size={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Discharge Current
                                            </Typography>
                                            <Skeleton variant="text" width="80%" height={25} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Summary
                                </Typography>

                                <Box mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 16 }} />
                                </Box>

                                <Box mt={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Notes
                                    </Typography>
                                    <Skeleton variant="text" width="90%" height={24} sx={{ mt: 1 }} />
                                </Box>

                                <Box mt={3} display="flex" alignItems="center" gap={1}>
                                    <Skeleton variant="circular" width={18} height={18} />
                                    <Skeleton variant="text" width="70%" height={20} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Battery Details
                    </Typography>

                    <Avatar
                        sx={{
                            bgcolor: getBatteryColor(cap, theme),
                            width: 48,
                            height: 48,
                            boxShadow: `0 6px 18px ${getBatteryColor(cap, theme)}33`,
                        }}
                        aria-label={batteryData?.batteryChargingCurrent && batteryData.batteryChargingCurrent > 0 ? 'charging' : 'battery'}
                    >
                        {batteryData && batteryData.batteryChargingCurrent > 0 ? <BatteryChargingFull /> : <BatteryFull />}
                    </Avatar>
                </Box>

                {batteryData ? (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                State of Charge
                            </Typography>

                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={cap}
                                        sx={{
                                            height: 12,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.grey[200],
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 2,
                                                backgroundColor: getBatteryColor(cap, theme),
                                            },
                                        }}
                                    />
                                </Box>

                                <Typography variant="h6" fontWeight={700}>
                                    {`${cap}%`}
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                <Grid container spacing={1}>
                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Voltage
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {batteryData.batteryVoltage != null ? `${batteryData.batteryVoltage} V` : '—'}
                                        </Typography>
                                    </Grid>

                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Charging Current
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {batteryData.batteryChargingCurrent != null ? `${batteryData.batteryChargingCurrent} A` : '—'}
                                        </Typography>
                                    </Grid>

                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Discharge Current
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {batteryData.batteryDischargeCurrent != null ? `${batteryData.batteryDischargeCurrent} A` : '—'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Summary
                            </Typography>

                            <Box mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <Chip
                                    icon={<BatteryStd />}
                                    label={batteryData.batteryChargingCurrent && batteryData.batteryChargingCurrent > 0 ? 'Charging' : 'Idle'}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>

                            <Box mt={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Notes
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    Battery operating within normal parameters.
                                </Typography>
                            </Box>

                            <Box mt={3} display="flex" alignItems="center" gap={1}>
                                <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    Values update automatically with the dashboard refresh.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Box textAlign="center" p={3}>
                        <Typography variant="body2" color="text.secondary">
                            No battery data available.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
