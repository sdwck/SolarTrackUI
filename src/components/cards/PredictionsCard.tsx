import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Skeleton,
    Chip,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { type PredictionData } from '../../types';

interface PredictionsCardProps {
    predictions: PredictionData[];
    loading?: boolean;
}

export function PredictionsCard({
    predictions,
    loading = false,
}: PredictionsCardProps) {
    const getPredictionLabel = (period: PredictionData['period']): string => {
        switch (period) {
            case 'tomorrow':
                return 'Tomorrow';
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            default:
                return period;
        }
    };

    const getConfidenceColor = (confidence: number): 'success' | 'warning' | 'error' => {
        if (confidence >= 80) return 'success';
        if (confidence >= 60) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Card sx={{ height: '100%', width: '100%' }}>
                <CardContent sx={{ p: 2.5, pb: '20px !important' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <TrendingUp color="primary" />
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Energy Predictions
                        </Typography>
                    </Box>

                    <Stack spacing={1.5}>
                        {[1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Skeleton variant="text" width={70} height={20} />
                                    <Skeleton variant="text" width={70} height={20} />
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Skeleton variant="rounded" width={95} height={22} />
                                    <Skeleton variant="text" width={45} height={18} />
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardContent sx={{ p: 2.5, pb: '20px !important' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Energy Predictions
                    </Typography>
                </Box>

                <Stack spacing={1.5}>
                    {predictions.map((prediction) => (
                        <Box
                            key={prediction.period}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: 1,
                                },
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
                                    {getPredictionLabel(prediction.period)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ fontSize: '0.85rem' }}>
                                    {prediction.energyKWh.toFixed(1)} kWh
                                </Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Chip
                                    label={`${prediction.confidence}% confidence`}
                                    color={getConfidenceColor(prediction.confidence)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 22 }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {prediction.factors.length} factors
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}