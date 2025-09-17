import { type ReactElement } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Avatar,
    Skeleton,
} from '@mui/material';
import {
    Power,
    PowerOff,
    Battery80,
    WbSunny,
    EnergySavingsLeaf,
} from '@mui/icons-material';
import { type SolarData } from '../../types';

interface SystemStatusCardProps {
    solarData: SolarData | null;
    loading?: boolean;
}

interface StatusItemProps {
    icon: ReactElement;
    title: string;
    status: string;
    isActive: boolean;
    loading?: boolean;
}

function StatusItem({
    icon,
    title,
    status,
    isActive,
    loading = false,
}: StatusItemProps) {
    if (loading) {
        return (
            <Box textAlign="center" p={1.5}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 0.6 }} />
                <Skeleton variant="text" width={60} height={24} sx={{ mx: 'auto', mb: 0.5 }} />
                <Skeleton variant="rounded" width={55} height={20} sx={{ mx: 'auto' }} />
            </Box>
        );
    }

    return (
        <Box textAlign="center" p={1.5}>
            <Avatar
                sx={{
                    bgcolor: isActive ? 'success.main' : 'grey.500',
                    mx: 'auto',
                    mb: 1,
                    width: 40,
                    height: 40,
                    boxShadow: isActive ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {icon}
            </Avatar>
            <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: '0.8rem', mb: 0.5, lineHeight: 1.2 }}
            >
                {title}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 500,
                    px: 1,
                    py: 0.3,
                    borderRadius: 1,
                    bgcolor: isActive ? 'success.light' : 'grey.100',
                    color: isActive ? 'grey.900' : 'grey.700',
                    fontSize: '0.7rem',
                    display: 'inline-block',
                }}
            >
                {status}
            </Typography>
        </Box>
    );
}

export function SystemStatusCard({
    solarData,
    loading = false,
}: SystemStatusCardProps) {
    const getEfficiencyStatus = (): string => {
        if (!solarData?.powerData?.pvInputPower) return 'Standby';

        const power = solarData.powerData.pvInputPower;
        if (power > 400) return 'Excellent';
        if (power > 200) return 'Good';
        return 'Low';
    };

    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                    System Status
                </Typography>

                <Grid container spacing={1} rowSpacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <StatusItem
                            icon={solarData?.isLoadOn ? <Power /> : <PowerOff />}
                            title="Load"
                            status={solarData?.isLoadOn ? 'Active' : 'Inactive'}
                            isActive={solarData?.isLoadOn ?? false}
                            loading={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <StatusItem
                            icon={<Battery80 />}
                            title="Charging"
                            status={solarData?.isSccChargingOn ? 'Active' : 'Inactive'}
                            isActive={solarData?.isSccChargingOn ?? false}
                            loading={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <StatusItem
                            icon={<WbSunny />}
                            title="Solar"
                            status={solarData?.powerData?.pvInputPower && solarData.powerData.pvInputPower > 0 ? 'Generating' : 'Standby'}
                            isActive={solarData?.powerData?.pvInputPower ? solarData.powerData.pvInputPower > 0 : false}
                            loading={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <StatusItem
                            icon={<EnergySavingsLeaf />}
                            title="Efficiency"
                            status={getEfficiencyStatus()}
                            isActive={solarData?.powerData?.pvInputPower ? solarData.powerData.pvInputPower > 200 : false}
                            loading={loading}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}