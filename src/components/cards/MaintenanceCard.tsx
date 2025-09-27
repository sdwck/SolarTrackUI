import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    Build,
    Schedule,
    CalendarMonth,
    CleaningServices,
    Settings,
    Engineering,
    Upgrade,
    Tune
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { SolarData, MaintenanceTask, MaintenanceTaskStats } from '../../types';

interface MaintenanceCardProps {
    solarData: SolarData | null;
    loading: boolean;
}

const CATEGORY_ICONS = {
    cleaning: <CleaningServices />,
    inspection: <Settings />,
    repair: <Build />,
    upgrade: <Upgrade />,
    calibration: <Tune />,
    other: <Engineering />
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'overdue': return 'error';
        case 'pending': return 'warning';
        case 'in_progress': return 'info';
        case 'completed': return 'success';
        default: return 'default';
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'default';
    }
};

export const MaintenanceCard = ({ loading }: MaintenanceCardProps) => {
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
    const [stats, setStats] = useState<MaintenanceTaskStats | null>(null);
    const [cardLoading, setCardLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadMaintenanceData();
    }, []);

    const loadMaintenanceData = async () => {
        try {
            setCardLoading(true);
            const [tasksResponse, statsData] = await Promise.all([
                api.getMaintenanceTasks(undefined, 1, 4),
                api.getMaintenanceStats()
            ]);
            setTasks(tasksResponse.items);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load maintenance data:', error);
        } finally {
            setCardLoading(false);
        }
    };

    const maintenanceScore = stats ? ((stats.completed / stats.total) * 100) || 0 : 0;
    const overdueCount = stats?.overdue || 0;
    const dueCount = stats?.pending || 0;

    if (loading || cardLoading) {
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
                    <Box mb={3}>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 1 }} />
                        <Box display="flex" gap={1} mt={1}>
                            <Skeleton variant="rounded" width={60} height={24} />
                            <Skeleton variant="rounded" width={70} height={24} />
                        </Box>
                    </Box>
                    <List sx={{ py: 0, maxHeight: 200, overflow: 'auto' }}>
                        {[...Array(3)].map((_, i) => (
                            <ListItem key={i} sx={{ px: 0, py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <Skeleton variant="circular" width={20} height={20} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Skeleton variant="text" width="70%" height={20} />}
                                    secondary={<Skeleton variant="text" width="90%" height={16} />}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        sx={{
                            bgcolor: overdueCount > 0 ? 'error.main' : dueCount > 0 ? 'warning.main' : 'success.main',
                            width: 48,
                            height: 48,
                        }}
                    >
                        <Build />
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={700}>
                            Maintenance
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            System maintenance schedule
                        </Typography>
                    </Box>
                </Box>

                {stats && (
                    <Box mb={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                                Maintenance Score
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                color={maintenanceScore > 80 ? 'success.main' : maintenanceScore > 60 ? 'warning.main' : 'error.main'}
                            >
                                {Math.round(maintenanceScore)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={maintenanceScore}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: maintenanceScore > 80 ? 'success.main' : maintenanceScore > 60 ? 'warning.main' : 'error.main',
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                            {overdueCount > 0 && (
                                <Chip
                                    label={`${overdueCount} Overdue`}
                                    color="error"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {dueCount > 0 && (
                                <Chip
                                    label={`${dueCount} Due`}
                                    color="warning"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {stats.total > 0 && (
                                <Chip
                                    label={`${stats.total} Total`}
                                    color="info"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Box>
                )}

                <List sx={{
                    py: 0,
                    maxHeight: 200,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: 8,
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200],
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[400],
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[500],
                    },
                }}>
                    {tasks.slice(0, 4).map((task) => (
                        <ListItem key={task.id} sx={{ px: 1, py: 1, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                <Box color={`${getStatusColor(task.status)}.main`}>
                                    {CATEGORY_ICONS[task.category]}
                                </Box>
                            </ListItemIcon>
                            <ListItemText
                                slotProps={{ primary: { component: 'div' }, secondary: { component: 'div' } }}
                                primary={
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {task.title}
                                        </Typography>
                                        <Chip
                                            label={task.priority}
                                            color={getPriorityColor(task.priority)}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.6rem',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                                            {task.description}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Schedule fontSize="small" color="disabled" />
                                            <Typography variant="caption" color="text.disabled">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </Typography>
                                            <Chip
                                                label={task.status.replace('_', ' ')}
                                                color={getStatusColor(task.status)}
                                                size="small"
                                                sx={{
                                                    height: 16,
                                                    fontSize: '0.55rem',
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                {tasks.length > 4 && (
                    <Box mt={2} textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                            +{stats?.total ? stats.total - 4 : 0} more tasks
                        </Typography>
                    </Box>
                )}

                <Box mt={2} display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<CalendarMonth />}
                        size="small"
                        sx={{ borderRadius: 2, flex: 1 }}
                        onClick={() => navigate('/maintenance')}
                    >
                        Manage Tasks
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};