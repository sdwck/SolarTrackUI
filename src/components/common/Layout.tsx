import { useState, type ReactElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    Avatar,
    Switch,
    Divider,
    Menu,
    MenuItem,
    ListItemAvatar,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    ViewList as ListIcon,
    Analytics as AnalyticsIcon,
    LightMode,
    DarkMode,
    WbSunny as SolarIcon,
    Build as BuildIcon,
    AccountCircle,
    Logout,
    Person,
    ControlCamera,
} from '@mui/icons-material';
import { useThemeMode } from '../../contexts/ThemeContext';
import { BatteryFull as BatteryFullIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 280;

interface NavigationItem {
    text: string;
    path: string;
    icon: ReactElement;
    badge?: number;
}

const navigationItems: NavigationItem[] = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Controls', path: '/control', icon: <ControlCamera /> },
    { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
    { text: 'Diagnostics', path: '/diagnostics', icon: <SolarIcon /> },
    { text: 'Maintenance', path: '/maintenance', icon: <BuildIcon /> },
    { text: 'Battery', path: '/battery', icon: <BatteryFullIcon /> },
    { text: 'History', path: '/history', icon: <ListIcon /> },
];

export function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
    const { mode, toggleTheme } = useThemeMode();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = (): void => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string): void => {
        window.scrollTo({ top: 0 });
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
        navigate('/login');
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ px: 3, py: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        mr: 2,
                    }}
                >
                    <SolarIcon />
                </Avatar>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    SolarTrack
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ px: 2, py: 1 }}>
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.25,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'primary.contrastText' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ p: 3 }}>
                <Divider sx={{ mb: 2 }} />

                <Box
                    sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider'
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                            <Person fontSize="small" />
                        </Avatar>
                        <Box flexGrow={1} sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                                {user?.username || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {user?.email || ''}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <LightMode sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleTheme}
                            size="small"
                        />
                        <DarkMode sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {mode === 'dark' ? 'Dark' : 'Light'} Mode
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: theme.shadows[1],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                        color="inherit"
                        onClick={handleUserMenuOpen}
                        sx={{
                            p: 0,
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                        onClick={handleUserMenuClose}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                minWidth: 200,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Person fontSize="small" />
                                </Avatar>
                            </ListItemAvatar>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    {user?.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body2">Logout</Typography>
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            height: '100%',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: `1px solid ${theme.palette.divider}`,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};
