import { useState, useEffect } from 'react';
import api from '../../services/api';
import { type AnalyticsData } from '../../types';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Paper,
    LinearProgress,
    Avatar,
    Chip
} from '@mui/material';
import {
    TrendingUp,
    WbSunny,
    Battery80,
    ElectricBolt,
    Download,
} from '@mui/icons-material';

import { CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

const getInsightColor = (type: string) => {
    switch (type) {
        case 'positive': return 'success';
        case 'warning': return 'warning';
        case 'info': return 'info';
        default: return 'default';
    }
};

const getImpactIcon = (impact: string) => {
    switch (impact) {
        case 'high': return '🔥';
        case 'medium': return '⚠️';
        case 'low': return 'ℹ️';
        default: return '';
    }
};

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('week');

    const emptyAnalyticsData: AnalyticsData = {
        dailyAverage: {
            solarGeneration: 0,
            batteryUsage: 0,
            efficiency: 0,
            uptime: 0,
        },
        weeklyTrends: {
            energyProduced: 0,
            energyConsumed: 0,
            savings: 0,
            co2Avoided: 0,
        },
        monthlyComparison: {
            thisMonth: 0,
            lastMonth: 0,
            improvement: 0,
            bestDay: '',
        },
        insights: []
    };

    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(emptyAnalyticsData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setError(null);
                setLoading(true);
                const data = await api.getAnalyticsData(timeRange as 'day' | 'week' | 'month' | 'year');
                setAnalyticsData(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [timeRange]);

    const performanceMetrics = analyticsData ? [
        {
            title: 'Daily Avg Solar',
            value: `${analyticsData.dailyAverage.solarGeneration} kWh`,
            progress: Math.round(analyticsData.dailyAverage.solarGeneration * 10),
            icon: <WbSunny />,
            color: 'warning.main',
        },
        {
            title: 'Battery Usage',
            value: `${analyticsData.dailyAverage.batteryUsage} kWh`,
            progress: Math.round(analyticsData.dailyAverage.batteryUsage * 10),
            icon: <Battery80 />,
            color: 'success.main',
        },
        {
            title: 'System Efficiency',
            value: `${analyticsData.dailyAverage.efficiency}%`,
            progress: analyticsData.dailyAverage.efficiency,
            icon: <ElectricBolt />,
            color: 'primary.main',
        },
        {
            title: 'System Uptime',
            value: `${analyticsData.dailyAverage.uptime}%`,
            progress: analyticsData.dailyAverage.uptime,
            icon: <TrendingUp />,
            color: 'info.main',
        },
    ] : [];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    <Typography variant="body1">Error: {error}</Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 2 }}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                            Analytics Dashboard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Insights and performance analysis for your solar system
                        </Typography>
                    </Box>
                    <Box display="flex" gap={2} alignItems={{ xs: 'flex-end', sm: 'center' }} flexDirection={{ xs: 'column-reverse', sm: 'row' }} mt={{ xs: 2, sm: 0 }}>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Time Range</InputLabel>
                            <Select
                                value={timeRange}
                                label="Time Range"
                                onChange={(event) => setTimeRange(event.target.value as string)}
                            >
                                <MenuItem value="day">Today</MenuItem>
                                <MenuItem value="week">Week</MenuItem>
                                <MenuItem value="month">Month</MenuItem>
                                <MenuItem value="year">Year</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="outlined" startIcon={<Download />} sx={{ minWidth: 100 }}>
                            Export
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {performanceMetrics.map((metric) => (
                        <Grid size={{ xs: 6, md: 3 }} key={metric.title}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        <Avatar
                                            sx={{
                                                bgcolor: metric.color + '20',
                                                color: metric.color,
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            {metric.icon}
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" fontWeight={700}>
                                                {metric.value}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                                {metric.title}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={metric.progress}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: 'grey.200',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: metric.color,
                                                borderRadius: 3,
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Weekly Performance
                                </Typography>

                                <Box mb={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Energy Produced
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="success.main">
                                            {analyticsData.weeklyTrends.energyProduced} kWh
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Energy Consumed
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="primary.main">
                                            {analyticsData.weeklyTrends.energyConsumed} kWh
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Cost Savings
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="warning.main">
                                            ${analyticsData.weeklyTrends.savings}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            CO₂ Avoided
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="info.main">
                                            {analyticsData.weeklyTrends.co2Avoided} kg
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Monthly Comparison
                                </Typography>

                                <Box mb={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            This Month
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700} color="primary.main">
                                            {analyticsData.monthlyComparison.thisMonth} kWh
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            Last Month
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {analyticsData.monthlyComparison.lastMonth} kWh
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            Improvement
                                        </Typography>
                                        <Chip
                                            label={`+${analyticsData.monthlyComparison.improvement}%`}
                                            color="success"
                                            size="small"
                                        />
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Best Performance
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {analyticsData.monthlyComparison.bestDay}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            System Insights
                        </Typography>

                        <Grid container spacing={2}>
                            {analyticsData.insights.map((insight, index) => (
                                <Grid size={{ xs: 12, md: 4 }} key={index}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderLeft: 4,
                                            borderLeftColor: `${getInsightColor(insight.type)}.main`,
                                            bgcolor: `${getInsightColor(insight.type)}.light`,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                                            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                                                {getImpactIcon(insight.impact)}
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={600} flexGrow={1}>
                                                {insight.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ opacity: 0.85, fontSize: '0.875rem' }}>
                                            {insight.description}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}