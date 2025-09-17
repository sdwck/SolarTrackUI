import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    LinearProgress,
    useTheme
} from '@mui/material';
import {
    CheckCircle,
    Warning,
    Error,
    QuestionMark,
    Favorite
} from '@mui/icons-material';
import type { SolarData } from '../../types';

interface OverallHealthCardProps {
    solarData: SolarData | null;
    loading: boolean;
}

interface HealthScore {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    issues: string[];
}

const calculateHealthScore = (data: SolarData | null): HealthScore => {
    if (!data) {
        return { score: 0, status: 'critical', issues: ['No data available'] };
    }

    let score = 100;
    const issues: string[] = [];

    if (data.inverterHeatSinkTemperature > 70) {
        score -= 20;
        issues.push('High temperature detected');
    } else if (data.inverterHeatSinkTemperature > 55) {
        score -= 10;
        issues.push('Elevated temperature');
    }

    if (data.busVoltage < 400 || data.busVoltage > 450) {
        score -= 15;
        issues.push('Bus voltage out of optimal range');
    }

    if (data.batteryData.batteryVoltage < 24) {
        score -= 15;
        issues.push('Low battery voltage');
    }

    if (data.powerData.acOutputVoltage < 220 || data.powerData.acOutputVoltage > 240) {
        score -= 10;
        issues.push('AC output voltage variance');
    }

    if (data.powerData.acInputFrequency < 49.5 || data.powerData.acInputFrequency > 50.5) {
        score -= 10;
        issues.push('Grid frequency instability');
    }

    if (!data.isSwitchedOn) {
        score -= 30;
        issues.push('System is switched off');
    }

    if (data.batteryData.batteryCapacity < 20) {
        score -= 15;
        issues.push('Low battery capacity');
    }

    let status: HealthScore['status'] = 'excellent';
    if (score < 60) status = 'critical';
    else if (score < 75) status = 'warning';
    else if (score < 90) status = 'good';

    return { score: Math.max(0, score), status, issues };
};

const getStatusIcon = (status: HealthScore['status']) => {
    switch (status) {
        case 'excellent':
            return <CheckCircle sx={{ color: 'success.main' }} />;
        case 'good':
            return <CheckCircle sx={{ color: 'info.main' }} />;
        case 'warning':
            return <Warning sx={{ color: 'warning.main' }} />;
        case 'critical':
            return <Error sx={{ color: 'error.main' }} />;
        default:
            return <QuestionMark sx={{ color: 'grey.500' }} />;
    }
};

const getStatusColor = (status: HealthScore['status']) => {
    switch (status) {
        case 'excellent': return 'success.main';
        case 'good': return 'info.main';
        case 'warning': return 'warning.main';
        case 'critical': return 'error.main';
        default: return 'grey.500';
    }
};

export const OverallHealthCard = ({ solarData, loading }: OverallHealthCardProps) => {
    const theme = useTheme();
    const healthData = calculateHealthScore(solarData);

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
                    <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 2 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Box mt={2}>
                        <Skeleton variant="text" width="90%" height={16} />
                        <Skeleton variant="text" width="75%" height={16} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{
            height: '100%',
            border: `2px solid ${theme.palette[getStatusColor(healthData.status).split('.')[0] as 'success' | 'info' | 'warning' | 'error'].main}20`
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        sx={{
                            bgcolor: `${getStatusColor(healthData.status)}20`,
                            color: getStatusColor(healthData.status),
                            width: 48,
                            height: 48,
                        }}
                    >
                        <Favorite />
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={700}>
                            System Health
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Overall system status
                        </Typography>
                    </Box>
                    {getStatusIcon(healthData.status)}
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Health Score
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color={getStatusColor(healthData.status)}>
                            {Math.round(healthData.score)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={healthData.score}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: getStatusColor(healthData.status),
                                borderRadius: 4,
                            },
                        }}
                    />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {healthData.status}
                </Typography>

                {healthData.issues.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Active Issues:
                        </Typography>
                        {healthData.issues.slice(0, 2).map((issue, index) => (
                            <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem', color: 'warning.main' }}>
                                • {issue}
                            </Typography>
                        ))}
                        {healthData.issues.length > 2 && (
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                                +{healthData.issues.length - 2} more
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};