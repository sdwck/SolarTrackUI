import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    LinearProgress,
    Chip
} from '@mui/material';
import { 
    ElectricBolt,
    TrendingFlat,
    Warning
} from '@mui/icons-material';
import type { SolarData } from '../../types';

interface VoltageStabilityCardProps {
    solarData: SolarData | null;
    loading: boolean;
}

interface VoltageAnalysis {
    busVoltage: number;
    batteryVoltage: number;
    acInputVoltage: number;
    acOutputVoltage: number;
    stability: 'stable' | 'fluctuating' | 'unstable';
    issues: string[];
}

const analyzeVoltageStability = (data: SolarData | null): VoltageAnalysis => {
    if (!data) {
        return {
            busVoltage: 0,
            batteryVoltage: 0,
            acInputVoltage: 0,
            acOutputVoltage: 0,
            stability: 'unstable',
            issues: ['No data available']
        };
    }

    const issues: string[] = [];
    let stability: VoltageAnalysis['stability'] = 'stable';

    if (data.busVoltage < 400 || data.busVoltage > 450) {
        issues.push('Bus voltage out of range');
        stability = 'unstable';
    }

    if (data.batteryData.batteryVoltage < 24 || data.batteryData.batteryVoltage > 28.5) {
        issues.push('Battery voltage abnormal');
        stability = 'fluctuating';
    }

    if (data.powerData.acInputVoltage < 220 || data.powerData.acInputVoltage > 250) {
        issues.push('AC input voltage variance');
        stability = 'fluctuating';
    }

    if (data.powerData.acOutputVoltage < 220 || data.powerData.acOutputVoltage > 240) {
        issues.push('AC output voltage variance');
        if (stability === 'stable') stability = 'fluctuating';
    }

    const inputOutputDiff = Math.abs(data.powerData.acInputVoltage - data.powerData.acOutputVoltage);
    if (inputOutputDiff > 15) {
        issues.push('Large input/output voltage difference');
        stability = 'unstable';
    }

    return {
        busVoltage: data.busVoltage,
        batteryVoltage: data.batteryData.batteryVoltage,
        acInputVoltage: data.powerData.acInputVoltage,
        acOutputVoltage: data.powerData.acOutputVoltage,
        stability,
        issues
    };
};

const getStabilityColor = (stability: VoltageAnalysis['stability']) => {
    switch (stability) {
        case 'stable': return 'success.main';
        case 'fluctuating': return 'warning.main';
        case 'unstable': return 'error.main';
        default: return 'grey.500';
    }
};

const getStabilityChipColor = (stability: VoltageAnalysis['stability']) => {
    switch (stability) {
        case 'stable': return 'success';
        case 'fluctuating': return 'warning';
        case 'unstable': return 'error';
        default: return 'default';
    }
};

const VoltageMetric = ({ label, value, unit, isGood }: { 
    label: string; 
    value: number; 
    unit: string; 
    isGood: boolean 
}) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
            {label}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="body2" fontWeight={600}>
                {value}{unit}
            </Typography>
            {isGood ? (
                <TrendingFlat fontSize="small" color="success" />
            ) : (
                <Warning fontSize="small" color="warning" />
            )}
        </Box>
    </Box>
);

export const VoltageStabilityCard = ({ solarData, loading }: VoltageStabilityCardProps) => {
    const analysis = analyzeVoltageStability(solarData);
    
    const stabilityScore = analysis.stability === 'stable' ? 95 : 
                          analysis.stability === 'fluctuating' ? 70 : 40;

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
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 1 }} />
                        <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                    <Box>
                        {[...Array(4)].map((_, i) => (
                            <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                                <Skeleton variant="text" width="40%" height={16} />
                                <Skeleton variant="text" width="30%" height={16} />
                            </Box>
                        ))}
                    </Box>
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
                            bgcolor: `${getStabilityColor(analysis.stability)}20`,
                            color: getStabilityColor(analysis.stability),
                            width: 48,
                            height: 48,
                        }}
                    >
                        <ElectricBolt />
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={700}>
                            Voltage Stability
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            System voltage monitoring
                        </Typography>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Stability Score
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={getStabilityColor(analysis.stability)}>
                            {stabilityScore}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={stabilityScore}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: getStabilityColor(analysis.stability),
                                borderRadius: 3,
                            },
                        }}
                    />
                    <Box display="flex" justifyContent="center" mt={1}>
                        <Chip 
                            label={analysis.stability.toUpperCase()} 
                            color={getStabilityChipColor(analysis.stability)}
                            size="small"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                        />
                    </Box>
                </Box>

                <Box>
                    <VoltageMetric 
                        label="Bus Voltage" 
                        value={analysis.busVoltage} 
                        unit="V" 
                        isGood={analysis.busVoltage >= 400 && analysis.busVoltage <= 450} 
                    />
                    <VoltageMetric 
                        label="Battery Voltage" 
                        value={analysis.batteryVoltage} 
                        unit="V" 
                        isGood={analysis.batteryVoltage >= 24 && analysis.batteryVoltage <= 28.5} 
                    />
                    <VoltageMetric 
                        label="AC Input" 
                        value={analysis.acInputVoltage} 
                        unit="V" 
                        isGood={analysis.acInputVoltage >= 220 && analysis.acInputVoltage <= 250} 
                    />
                    <VoltageMetric 
                        label="AC Output" 
                        value={analysis.acOutputVoltage} 
                        unit="V" 
                        isGood={analysis.acOutputVoltage >= 220 && analysis.acOutputVoltage <= 240} 
                    />
                </Box>

                {analysis.issues.length > 0 && (
                    <Box mt={2} p={1.5} sx={{ bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 600 }}>
                            ISSUES DETECTED:
                        </Typography>
                        {analysis.issues.slice(0, 2).map((issue, index) => (
                            <Typography key={index} variant="body2" color="warning.dark" sx={{ fontSize: '0.75rem' }}>
                                • {issue}
                            </Typography>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};