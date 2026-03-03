import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Avatar,
    LinearProgress,
    Snackbar,
    Alert,
    Pagination,
    type SelectChangeEvent
} from '@mui/material';
import {
    Add,
    ArrowBack,
    Refresh,
    Build,
    Warning,
    CheckCircle,
    Schedule,
    Delete,
    CleaningServices,
    Settings,
    Engineering,
    Upgrade,
    Tune,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../../services/api';
import type { MaintenanceTask, CreateMaintenanceTaskRequest, MaintenanceTaskStats } from '../../types';

const CATEGORY_ICONS = {
    cleaning: <CleaningServices />,
    inspection: <Settings />,
    repair: <Build />,
    upgrade: <Upgrade />,
    calibration: <Tune />,
    other: <Engineering />
};

const STATUS_COLORS = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    overdue: 'error'
} as const;

const PRIORITY_COLORS = {
    low: 'info',
    medium: 'warning',
    high: 'error'
} as const;

export default function MaintenanceManagement() {
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
    const [stats, setStats] = useState<MaintenanceTaskStats | null>(null);
    const [paginationData, setPaginationData] = useState<{
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    }>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 5
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);

    const handleEditTask = (task: MaintenanceTask) => {
        setEditingTask(task);
        setEditDialogOpen(true);
    };

    const handleUpdateTask = async () => {
        if (!editingTask) return;
        try {
            await api.updateMaintenanceTask(editingTask.id, {
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                category: editingTask.category,
                dueDate: editingTask.dueDate,
                estimatedDuration: editingTask.estimatedDuration,
                assignedTo: editingTask.assignedTo,
                notes: editingTask.notes,
                tags: editingTask.tags,
            });
            setEditDialogOpen(false);
            setEditingTask(null);
            await loadData();
            showSnackbar('Task updated successfully (demo - nothing happened)', 'success');
        } catch (error) {
            showSnackbar('Failed to update task', 'error');
        }
    };


    const [newTask, setNewTask] = useState<CreateMaintenanceTaskRequest>({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString(),
        category: 'inspection',
        estimatedDuration: undefined,
        assignedTo: '',
        notes: '',
        tags: []
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        loadData(filter);
    }, [paginationData.currentPage, paginationData.pageSize, filter]);

    const loadData = async (filter?: string) => {
        try {
            setLoading(true);
            const [tasksData, statsData] = await Promise.all([
                api.getMaintenanceTasks(filter, paginationData.currentPage, paginationData.pageSize),
                api.getMaintenanceStats()
            ]);
            setPaginationData(prev => ({
                ...prev,
                totalPages: tasksData.totalPages,
                totalItems: tasksData.totalCount
            }));
            setTasks(tasksData.items);
            setStats(statsData);
        } catch (error) {
            showSnackbar('Failed to load maintenance data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handlePageChange = (_: unknown, newPage: number) => {
        setPaginationData(prev => ({ ...prev, currentPage: newPage }));
    };

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        const newPageSize = event.target.value;
        setPaginationData(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    };

    const handleFilterChange = (newFilter: 'all' | 'pending' | 'overdue' | 'completed') => {
        setFilter(newFilter);
        setPaginationData(prev => ({ ...prev, currentPage: 1 }));
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCreateTask = async () => {
        try {
            await api.createMaintenanceTask(newTask);
            setCreateDialogOpen(false);
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: new Date().toISOString(),
                category: 'inspection',
                estimatedDuration: undefined,
                assignedTo: '',
                notes: '',
                tags: []
            });
            await loadData();
            showSnackbar('Task created successfully (demo - nothing happened)', 'success');
        } catch (error) {
            showSnackbar('Failed to create task', 'error');
        }
    };

    const handleCompleteTask = async (id: string) => {
        try {
            await api.completeMaintenanceTask(id);
            await loadData();
            showSnackbar('Task completed successfully (demo - nothing happened)', 'success');
        } catch (error) {
            showSnackbar('Failed to complete task', 'error');
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await api.deleteMaintenanceTask(id);
            await loadData();
            showSnackbar('Task deleted successfully (demo - nothing happened)', 'success');
        } catch (error) {
            showSnackbar('Failed to delete task', 'error');
        }
    };

    const filteredTasks = tasks;

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
                <Container maxWidth="lg">
                    <LinearProgress />
                </Container>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
                <Container maxWidth="lg" sx={{ pt: 2 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        gap={{ xs: 2, sm: 0 }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            {!isMobile && (
                                <IconButton onClick={() => window.history.back()}>
                                    <ArrowBack />
                                </IconButton>
                            )}
                            <Box>
                                <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" mb={1}>
                                    Maintenance Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage system maintenance tasks and schedules
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            size="large"
                            sx={{ minWidth: 120, borderRadius: 2 }}
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </Box>

                    {stats && (
                        <Grid container spacing={{ xs: 1, md: 2, lg: 3 }} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <Build />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {stats.total}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {isMobile || isLg ? 'Total Tasks' : 'Total'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'error.main' }}>
                                                <Warning />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {stats.overdue}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Overdue
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                <Schedule />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {stats.pending}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pending
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'success.main' }}>
                                                <CheckCircle />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {Math.round(stats.completionRate)}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {isMobile || isLg ? 'Completion Rate' : 'Completion'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} flexDirection={isMobile ? 'column' : 'row'} mb={2}>
                                        <Typography variant="h6" fontWeight={700}>
                                            Maintenance Tasks
                                        </Typography>
                                        <Box display="flex" gap={1} flexWrap="wrap" mt={isMobile ? 1 : 0} width={isMobile ? '100%' : 'auto'}>
                                            {(['all', 'pending', 'overdue', 'completed'] as const).map((filterOption) => (
                                                <Chip
                                                    key={filterOption}
                                                    label={filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                                                    color={filter === filterOption ? 'primary' : 'default'}
                                                    onClick={() => handleFilterChange(filterOption)}
                                                    variant={filter === filterOption ? 'filled' : 'outlined'}
                                                    size="small"
                                                    sx={{
                                                        flex: isMobile ? '1 1' : 'unset',
                                                        justifyContent: 'center'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <List sx={{ py: 0 }}>
                                        {filteredTasks.map((task) => (
                                            <ListItem
                                                key={task.id}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 2,
                                                    mb: 1,
                                                    bgcolor: task.status === 'overdue' ? 'error.50' : 'transparent'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column': 'row'}>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={task.status === 'completed'}
                                                            onChange={() => task.status !== 'completed' && handleCompleteTask(task.id)}
                                                            disabled={task.status === 'completed'}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        {CATEGORY_ICONS[task.category]}
                                                    </ListItemIcon>
                                                </Box>
                                                <ListItemText
                                                sx={{ mr: { xs: 0, sm: 4 } }}
                                                    slotProps={{ primary: { component: 'div' }, secondary: { component: 'div' } }}
                                                    primary={
                                                        <Box display="flex" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={{ xs: 0.5, sm: 1 }} mb={0.5} flexDirection={{ xs: 'column', sm: 'row' }}>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight={600}
                                                                sx={{
                                                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                                <Chip
                                                                    label={task.priority}
                                                                    color={PRIORITY_COLORS[task.priority]}
                                                                    size="small"
                                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                                />
                                                                <Chip
                                                                    label={task.status.replace('_', ' ')}
                                                                    color={STATUS_COLORS[task.status]}
                                                                    size="small"
                                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                                                                {task.description}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.disabled">
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <ListItemSecondaryAction sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                                                    <IconButton
                                                        onClick={() => handleEditTask(task)}
                                                        color="primary"
                                                        size="small">
                                                        <Build />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>

                                    {filteredTasks.length === 0 && (
                                        <Box textAlign="center" py={4}>
                                            <Typography variant="body1" color="text.secondary">
                                                No tasks found for the selected filter.
                                            </Typography>
                                        </Box>
                                    )}

                                    {paginationData.totalItems > 0 && (
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Showing {((paginationData.currentPage - 1) * paginationData.pageSize) + 1} to{' '}
                                                {Math.min(paginationData.currentPage * paginationData.pageSize, paginationData.totalItems)} of{' '}
                                                {paginationData.totalItems} tasks
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                                                <FormControl size="small" sx={{ minWidth: 80 }}>
                                                    <InputLabel>Rows</InputLabel>
                                                    <Select
                                                        value={paginationData.pageSize}
                                                        onChange={handlePageSizeChange}
                                                        label="Rows"
                                                    >
                                                        <MenuItem value={5}>5</MenuItem>
                                                        <MenuItem value={10}>10</MenuItem>
                                                        <MenuItem value={20}>20</MenuItem>
                                                        <MenuItem value={50}>50</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Pagination
                                                    count={paginationData.totalPages}
                                                    page={paginationData.currentPage}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                    size={isMobile ? 'small' : 'medium'}
                                                    showFirstButton
                                                    showLastButton
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Dialog
                        open={editDialogOpen}
                        onClose={() => setEditDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        fullScreen={isMobile}
                    >
                        <DialogTitle>Edit Maintenance Task</DialogTitle>
                        <DialogContent>
                            {editingTask && (
                                <Box component="form" sx={{ pt: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Task Title"
                                        value={editingTask.title}
                                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={editingTask.description}
                                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        required
                                    />
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Priority</InputLabel>
                                                <Select
                                                    value={editingTask.priority}
                                                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                                                    label="Priority"
                                                >
                                                    <MenuItem value="low">Low</MenuItem>
                                                    <MenuItem value="medium">Medium</MenuItem>
                                                    <MenuItem value="high">High</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Category</InputLabel>
                                                <Select
                                                    value={editingTask.category}
                                                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as any })}
                                                    label="Category"
                                                >
                                                    <MenuItem value="cleaning">Cleaning</MenuItem>
                                                    <MenuItem value="inspection">Inspection</MenuItem>
                                                    <MenuItem value="repair">Repair</MenuItem>
                                                    <MenuItem value="upgrade">Upgrade</MenuItem>
                                                    <MenuItem value="calibration">Calibration</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <DatePicker
                                        label="Due Date"
                                        value={new Date(editingTask.dueDate)}
                                        onChange={(date) =>
                                            setEditingTask({
                                                ...editingTask,
                                                dueDate: date?.toISOString() || new Date().toISOString(),
                                            })
                                        }
                                        sx={{ width: '100%', mt: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Estimated Duration (minutes)"
                                        type="number"
                                        value={editingTask.estimatedDuration || ''}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined,
                                            })
                                        }
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Assigned To"
                                        value={editingTask.assignedTo}
                                        onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Notes"
                                        value={editingTask.notes}
                                        onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                                        margin="normal"
                                        multiline
                                        rows={2}
                                    />
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleUpdateTask}
                                variant="contained"
                                disabled={!editingTask?.title || !editingTask?.description}
                            >
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>


                    <Fab
                        color="primary"
                        aria-label="add task"
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 1000
                        }}
                    >
                        <Add />
                    </Fab>

                    <Dialog
                        open={createDialogOpen}
                        onClose={() => setCreateDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        fullScreen={isMobile}
                    >
                        <DialogTitle>Create New Maintenance Task</DialogTitle>
                        <DialogContent>
                            <Box component="form" sx={{ pt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Task Title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    required
                                />
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Priority</InputLabel>
                                            <Select
                                                value={newTask.priority}
                                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                                label="Priority"
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                value={newTask.category}
                                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                                                label="Category"
                                            >
                                                <MenuItem value="cleaning">Cleaning</MenuItem>
                                                <MenuItem value="inspection">Inspection</MenuItem>
                                                <MenuItem value="repair">Repair</MenuItem>
                                                <MenuItem value="upgrade">Upgrade</MenuItem>
                                                <MenuItem value="calibration">Calibration</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <DatePicker
                                    label="Due Date"
                                    value={new Date(newTask.dueDate)}
                                    onChange={(date) => setNewTask({ ...newTask, dueDate: date?.toISOString() || new Date().toISOString() })}
                                    sx={{ width: '100%', mt: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Estimated Duration (minutes)"
                                    type="number"
                                    value={newTask.estimatedDuration || ''}
                                    onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined })}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Assigned To"
                                    value={newTask.assignedTo}
                                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    value={newTask.notes}
                                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTask}
                                variant="contained"
                                disabled={!newTask.title || !newTask.description}
                            >
                                Create Task
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                    >
                        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </LocalizationProvider>
    );
}